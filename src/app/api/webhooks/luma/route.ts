/**
 * POST /api/webhooks/luma
 *
 * ONGOING AUTOMATION — triggered by Luma webhooks on new registrations.
 *
 * Setup in Luma:
 *   Dashboard → Settings → Webhooks → Add Endpoint
 *   URL: https://your-app.vercel.app/api/webhooks/luma
 *   Events: event.registration.created
 *
 * Flow:
 *   1. Luma fires webhook when someone registers for an event
 *   2. This handler validates the payload (Zod)
 *   3. Resolves the event's city → Flodesk segment name
 *   4. Upserts the registrant into Flodesk with the segment
 */

import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { FlodesKClient } from "@/lib/flodesk-client";
import { resolveSegmentForCity } from "@/lib/city-mapper";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────
// Based on Luma's documented webhook payload for event.registration.created
// Verify these field names match the real payload by logging the raw body first.

const LumaGeoAddressSchema = z.object({
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  full_address: z.string().optional(),
});

const LumaWebhookEventSchema = z.object({
  api_id: z.string(),
  name: z.string(),
  geo_address_json: LumaGeoAddressSchema.optional().nullable(),
});

const LumaWebhookGuestSchema = z.object({
  api_id: z.string(),
  email: z.string().email(),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  approval_status: z.enum(["approved", "pending", "declined"]),
});

const LumaWebhookPayloadSchema = z.object({
  /** Top-level event type from Luma */
  event_type: z.literal("event.registration.created"),
  /** Nested event + guest data */
  event: LumaWebhookEventSchema,
  guest: LumaWebhookGuestSchema,
});

// ─── Lazy-initialized singleton ──────────────────────────────────────────────
// Avoids re-creating the client on every request in serverless environments

let _flodesk: FlodesKClient | null = null;

function getFlodesKClient(): FlodesKClient {
  if (!_flodesk) {
    _flodesk = new FlodesKClient(process.env.FLODESK_API_KEY!);
  }
  return _flodesk;
}

// ─── Webhook signature verification ───────────────────────────────────────────
// Luma signs webhooks with HMAC-SHA256. Verify before processing.

async function verifyLumaSignature(
  req: NextRequest,
  rawBody: string
): Promise<boolean> {
  const secret = process.env.LUMA_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("LUMA_WEBHOOK_SECRET not set — skipping signature verification");
    return true;
  }

  const signature = req.headers.get("x-luma-signature");
  if (!signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const expected = Buffer.from(sig).toString("hex");

  // Constant-time comparison to prevent timing attacks
  const expectedBuf = Buffer.from(expected, "utf-8");
  const signatureBuf = Buffer.from(signature, "utf-8");

  if (expectedBuf.length !== signatureBuf.length) {
    return false;
  }

  return timingSafeEqual(expectedBuf, signatureBuf);
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Read raw body for signature verification
  const rawBody = await req.text();

  // 2. Verify webhook authenticity
  const isValid = await verifyLumaSignature(req, rawBody);
  if (!isValid) {
    console.warn("Luma webhook: invalid signature");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. Parse + validate payload
  let payload: z.infer<typeof LumaWebhookPayloadSchema>;
  try {
    const json = JSON.parse(rawBody);
    payload = LumaWebhookPayloadSchema.parse(json);
  } catch (err) {
    console.error("Luma webhook: payload validation failed", err);
    // Return 200 to prevent Luma from retrying on our schema errors
    return NextResponse.json({ ok: false, reason: "Invalid payload shape" });
  }

  const { event, guest } = payload;

  // 4. Only process approved registrations
  if (guest.approval_status !== "approved") {
    console.log(
      `Luma webhook: skipping ${guest.email} — status: ${guest.approval_status}`
    );
    return NextResponse.json({ ok: true, reason: "Not approved — skipped" });
  }

  // 5. Resolve city → segment
  const city = event.geo_address_json?.city;
  const segment = resolveSegmentForCity(city);

  if (!segment) {
    console.log(
      `Luma webhook: no segment mapped for city "${city ?? "unknown"}" ` +
        `(event: ${event.name})`
    );
    // Still upsert subscriber to Flodesk, just without a location segment
    // This ensures they're in the list even if we can't segment them yet
  }

  // 6. Upsert to Flodesk
  const firstName = guest.first_name ?? guest.name?.split(" ")[0] ?? undefined;
  const lastName =
    guest.last_name ??
    (guest.name?.split(" ").slice(1).join(" ") || undefined);

  const flodesk = getFlodesKClient();

  try {
    await flodesk.upsertAndSegment(
      {
        email: guest.email,
        first_name: firstName,
        last_name: lastName,
        status: "active",
      },
      segment ? [segment] : []
    );

    console.log(
      `Luma webhook: upserted ${guest.email}` +
        (segment ? ` → ${segment}` : " (no location segment)")
    );

    return NextResponse.json({
      ok: true,
      email: guest.email,
      segment: segment ?? null,
    });
  } catch (err) {
    console.error(`Luma webhook: Flodesk upsert failed for ${guest.email}`, err);
    // Return 500 so Luma will retry (it has built-in retry logic)
    return NextResponse.json(
      { error: "Failed to sync to Flodesk" },
      { status: 500 }
    );
  }
}
