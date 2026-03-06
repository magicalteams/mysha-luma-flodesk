/**
 * city-mapper.ts
 *
 * Maps raw city strings from Luma's geo_address_json to the canonical
 * Flodesk segment names used by Mysha.
 *
 * HOW TO EXTEND: Add new entries to CITY_TO_SEGMENT_MAP below.
 * Keys are lowercase, trimmed city strings from Luma.
 */

// ─── Segment name constants ────────────────────────────────────────────────────
// These must exactly match the segment names in Flodesk.

export const FLODESK_LOCATION_SEGMENTS = {
  MIAMI: "Location: MIA",
  NEW_YORK: "Location: NY",
  LOS_ANGELES: "Location: LA",
  AUSTIN: "Location: AUSTIN",
} as const;

export type FlodesKLocationSegment =
  (typeof FLODESK_LOCATION_SEGMENTS)[keyof typeof FLODESK_LOCATION_SEGMENTS];

// ─── City → Segment mapping ────────────────────────────────────────────────────

const CITY_TO_SEGMENT_MAP: Record<string, FlodesKLocationSegment> = {
  // Miami variations
  "miami": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "miami beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "coral gables": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "brickell": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "coconut grove": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "south miami": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "wynwood": FLODESK_LOCATION_SEGMENTS.MIAMI,

  // New York variations
  "new york": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "new york city": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "nyc": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "brooklyn": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "manhattan": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "queens": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "bronx": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "hoboken": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "jersey city": FLODESK_LOCATION_SEGMENTS.NEW_YORK,

  // Los Angeles variations
  "los angeles": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "la": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "santa monica": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "venice": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "west hollywood": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "beverly hills": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "culver city": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,

  // Austin
  "austin": FLODESK_LOCATION_SEGMENTS.AUSTIN,
};

/**
 * Resolves a raw city string (from Luma's geo_address_json.city) to the
 * matching Flodesk segment name, or null if unmapped.
 *
 * @example
 * resolveSegmentForCity("Miami Beach") // → "Location: MIA"
 * resolveSegmentForCity("Tokyo")       // → null
 */
// ─── Default data for KV seeding ──────────────────────────────────────────────
// Used by kv-city-mapper.ts to seed Redis on first run.

export const DEFAULT_SEGMENTS: Record<string, string> = {
  MIAMI: "Location: MIA",
  NY: "Location: NY",
  LA: "Location: LA",
  AUSTIN: "Location: AUSTIN",
};

export const DEFAULT_CITY_MAP: Record<string, string> = {
  "miami": "MIAMI",
  "miami beach": "MIAMI",
  "coral gables": "MIAMI",
  "brickell": "MIAMI",
  "coconut grove": "MIAMI",
  "south miami": "MIAMI",
  "wynwood": "MIAMI",
  "new york": "NY",
  "new york city": "NY",
  "nyc": "NY",
  "brooklyn": "NY",
  "manhattan": "NY",
  "queens": "NY",
  "bronx": "NY",
  "hoboken": "NY",
  "jersey city": "NY",
  "los angeles": "LA",
  "la": "LA",
  "santa monica": "LA",
  "venice": "LA",
  "west hollywood": "LA",
  "beverly hills": "LA",
  "culver city": "LA",
  "austin": "AUSTIN",
};

// ─── Sync resolver (used by backfill script) ─────────────────────────────────

export function resolveSegmentForCity(
  city: string | undefined | null
): FlodesKLocationSegment | null {
  if (!city) return null;
  const normalized = city.trim().toLowerCase();
  return CITY_TO_SEGMENT_MAP[normalized] ?? null;
}
