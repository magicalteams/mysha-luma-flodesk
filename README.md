# Mysha: Luma → Flodesk Location Segmentation

Two-phase solution for syncing Luma event participants into Flodesk with city-based location segments.

---

## Architecture

```
Phase 1 (one-time backfill)
  Luma Calendar API
      └─ All events + guests
          └─ city → resolveSegmentForCity()
              └─ Flodesk: upsert subscriber + add segment

Phase 2 (ongoing, real-time)
  Luma Webhook: event.registration.created
      └─ POST /api/webhooks/luma
          └─ Zod validation
              └─ city → resolveSegmentForCity()
                  └─ Flodesk: upsert subscriber + add segment
```

---

## Segment Naming Convention (in Flodesk)

These segment names must exist in Flodesk **before** running the backfill:

| City | Flodesk Segment Name |
|------|----------------------|
| Miami / Miami Beach / etc. | `Location: MIA` |
| New York / Brooklyn / etc. | `Location: NYC` |
| Los Angeles / Santa Monica / etc. | `Location: LA` |
| Austin | `Location: Austin` |
| Chicago | `Location: Chicago` |
| San Francisco / Oakland / etc. | `Location: SF` |
| Boston / Cambridge | `Location: Boston` |
| Washington D.C. | `Location: DC` |

To add a new city, edit `src/lib/city-mapper.ts`.

---

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

**Where to find each key:**
- `LUMA_API_KEY` — lu.ma → Settings → API → Generate Key
- `LUMA_CALENDAR_API_ID` — From the lu.ma/mysha-happenings calendar URL or Calendar Settings
- `LUMA_WEBHOOK_SECRET` — Generated when you create the webhook in Luma (see Phase 2)
- `FLODESK_API_KEY` — flodesk.com → Account → Integrations → API

### 2. Create Location Segments in Flodesk

Manually create each segment listed above in Flodesk **before** running anything.
The API will error if it references a segment name that doesn't exist.

---

## Phase 1: One-Time Backfill

Run the backfill script to process all historical Luma events:

```bash
# Dry run first — logs what would happen, writes nothing
npx ts-node --esm scripts/backfill-luma-flodesk.ts --dry-run

# Dry run for Miami only (great for testing)
npx ts-node --esm scripts/backfill-luma-flodesk.ts --dry-run --city miami

# Live run for Miami only
npx ts-node --esm scripts/backfill-luma-flodesk.ts --city miami

# Full backfill (all cities, all events)
npx ts-node --esm scripts/backfill-luma-flodesk.ts
```

**Estimated runtime:** ~2–5 minutes depending on number of events and guests.
The script includes built-in delays (150ms/subscriber, 500ms/event) to respect Flodesk's rate limits.

The script prints a summary at the end:
```
✅ BACKFILL COMPLETE
   Events processed:  47
   Events skipped:    3 (unmapped city)
   Guests processed:  1,842
   Guests upserted:   1,798
   Guests skipped:    44 (no email)
   Errors:            0
```

---

## Phase 2: Ongoing Webhook Automation

### Deploy to Vercel

```bash
vercel deploy
```

### Configure the Luma Webhook

1. Go to **lu.ma → Settings → Webhooks**
2. Click **Add Endpoint**
3. Set URL to: `https://your-app.vercel.app/api/webhooks/luma`
4. Select event: `event.registration.created`
5. Copy the generated **Signing Secret** → add to `.env.local` as `LUMA_WEBHOOK_SECRET`

From this point forward, every new Luma registration will automatically:
- Upsert the guest into Flodesk
- Apply the correct `Location: XYZ` segment based on event city

### Updating/Retiring the Existing Zap

The existing Zap (Luma → Flodesk, no segmentation) should be **turned off** once this webhook is live to avoid duplicate upserts. The webhook replaces it entirely.

If you need to keep the Zap for any reason, add a filter step in Zapier to skip contacts that already have a location segment.

---

## Adding New Cities

Edit `src/lib/city-mapper.ts`:

```typescript
const CITY_TO_SEGMENT_MAP: Record<string, FlodesKLocationSegment> = {
  // Add your new mapping:
  "nashville": FLODESK_LOCATION_SEGMENTS.NASHVILLE,
  // ...
};
```

Also add the new segment to the `FLODESK_LOCATION_SEGMENTS` constant and create it in Flodesk.

---

## Troubleshooting

**"Segment not found" error from Flodesk**
→ The segment name in `city-mapper.ts` doesn't match what's in Flodesk exactly (case-sensitive). Check for trailing spaces.

**Luma returns 401**
→ Verify `LUMA_API_KEY` is correct and the calendar API ID matches the Mysha Happenings calendar.

**Webhook not firing**
→ Check Luma's webhook delivery logs in Settings → Webhooks. Ensure your Vercel URL is publicly accessible.

**City not getting mapped**
→ Log the raw `geo_address_json.city` value from Luma (the backfill script prints unmapped cities). Add the city string to `city-mapper.ts`.
