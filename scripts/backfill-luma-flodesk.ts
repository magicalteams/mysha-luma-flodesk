/**
 * backfill-luma-flodesk.ts
 *
 * ONE-TIME BACKFILL SCRIPT
 * ─────────────────────────────────────────────────────────────────
 * Fetches all events from the Mysha Luma calendar, then for each
 * event resolves the city → Flodesk location segment, and upserts
 * every approved guest into Flodesk with the correct segment applied.
 *
 * Usage:
 *   npm run backfill
 *
 * Optional flags:
 *   --dry-run      Logs what WOULD happen without writing to Flodesk
 *   --city miami   Only process events matching a city's segment
 *                  (e.g. --city miami matches Miami, Miami Beach, Coral Gables, etc.)
 *
 * Rate limiting:
 *   Flodesk's API has limits; this script includes a configurable
 *   delay between batches to stay safe.
 * ─────────────────────────────────────────────────────────────────
 */

import "dotenv/config";
import { LumaClient } from "../src/lib/luma-client.js";
import { FlodesKClient } from "../src/lib/flodesk-client.js";
import { resolveSegmentForCity } from "../src/lib/city-mapper.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const LUMA_API_KEY = process.env.LUMA_API_KEY!;
const LUMA_CALENDAR_API_ID = process.env.LUMA_CALENDAR_API_ID!;
const FLODESK_API_KEY = process.env.FLODESK_API_KEY!;

/** ms to wait between each subscriber upsert to avoid rate-limiting */
const RATE_LIMIT_DELAY_MS = 150;

/** ms to wait between events */
const EVENT_DELAY_MS = 500;

const IS_DRY_RUN = process.argv.includes("--dry-run");

const CITY_FILTER = (() => {
  const idx = process.argv.indexOf("--city");
  return idx !== -1 ? process.argv[idx + 1]?.toLowerCase() : null;
})();

// Resolve the --city filter to a segment so "miami" matches Miami Beach, Coral Gables, etc.
const FILTER_SEGMENT = CITY_FILTER ? resolveSegmentForCity(CITY_FILTER) : null;

if (CITY_FILTER && !FILTER_SEGMENT) {
  console.error(
    `City "${CITY_FILTER}" does not map to any known segment. Check src/lib/city-mapper.ts.`
  );
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function validateEnv() {
  const missing = [
    !LUMA_API_KEY && "LUMA_API_KEY",
    !LUMA_CALENDAR_API_ID && "LUMA_CALENDAR_API_ID",
    !FLODESK_API_KEY && "FLODESK_API_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

// ─── Counters ─────────────────────────────────────────────────────────────────

const stats = {
  eventsProcessed: 0,
  eventsSkipped: 0,
  guestsProcessed: 0,
  guestsUpserted: 0,
  guestsSkipped: 0,
  errors: 0,
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  validateEnv();

  if (IS_DRY_RUN) {
    console.log("DRY RUN MODE — no writes to Flodesk\n");
  }

  if (FILTER_SEGMENT) {
    console.log(
      `City filter active: "${CITY_FILTER}" → processing all events matching ${FILTER_SEGMENT}\n`
    );
  }

  const luma = new LumaClient(LUMA_API_KEY, LUMA_CALENDAR_API_ID);
  const flodesk = new FlodesKClient(FLODESK_API_KEY);

  console.log("Fetching all Luma events...");
  const events = await luma.listAllEvents();
  console.log(`   Found ${events.length} events total\n`);

  for (const event of events) {
    const city = event.geo_address_json?.city;
    const segment = resolveSegmentForCity(city);

    // Skip if city filter is active and this event doesn't match the target segment
    if (FILTER_SEGMENT && segment !== FILTER_SEGMENT) {
      continue;
    }

    if (!segment) {
      console.log(`[SKIP] "${event.name}" — city "${city ?? "unknown"}" not mapped`);
      stats.eventsSkipped++;
      continue;
    }

    console.log(`\nProcessing: "${event.name}"`);
    console.log(`   City: ${city}  →  Segment: ${segment}`);
    console.log(`   Date: ${new Date(event.start_at).toLocaleDateString()}`);

    const guests = await luma.listAllGuests(event.api_id);
    console.log(`   Approved guests: ${guests.length}`);

    for (const guest of guests) {
      stats.guestsProcessed++;

      if (!guest.email) {
        console.warn(`   Guest ${guest.api_id} has no email — skipping`);
        stats.guestsSkipped++;
        continue;
      }

      const firstName = guest.first_name ?? guest.name?.split(" ")[0];
      const lastName =
        guest.last_name ??
        (guest.name?.split(" ").slice(1).join(" ") || undefined);

      if (IS_DRY_RUN) {
        console.log(`   [DRY RUN] Would upsert ${guest.email} → ${segment}`);
        stats.guestsUpserted++;
        continue;
      }

      try {
        await flodesk.upsertAndSegment(
          {
            email: guest.email,
            first_name: firstName,
            last_name: lastName,
            status: "active",
          },
          [segment]
        );
        stats.guestsUpserted++;
      } catch (err) {
        console.error(`   Error upserting ${guest.email}:`, err);
        stats.errors++;
      }

      // Polite rate limiting
      await sleep(RATE_LIMIT_DELAY_MS);
    }

    stats.eventsProcessed++;
    await sleep(EVENT_DELAY_MS);
  }

  // ─── Summary ────────────────────────────────────────────────────────────────

  console.log("\n" + "-".repeat(50));
  console.log("BACKFILL COMPLETE");
  console.log(`   Events processed:  ${stats.eventsProcessed}`);
  console.log(`   Events skipped:    ${stats.eventsSkipped} (unmapped city)`);
  console.log(`   Guests processed:  ${stats.guestsProcessed}`);
  console.log(`   Guests upserted:   ${stats.guestsUpserted}`);
  console.log(`   Guests skipped:    ${stats.guestsSkipped} (no email)`);
  console.log(`   Errors:            ${stats.errors}`);
  console.log("-".repeat(50));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
