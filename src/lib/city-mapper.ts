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
  NEW_YORK: "Location: NYC",
  LOS_ANGELES: "Location: LA",
  AUSTIN: "Location: Austin",
  CHICAGO: "Location: Chicago",
  SAN_FRANCISCO: "Location: SF",
  BOSTON: "Location: Boston",
  WASHINGTON_DC: "Location: DC",
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

  // Chicago
  "chicago": FLODESK_LOCATION_SEGMENTS.CHICAGO,

  // San Francisco
  "san francisco": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "sf": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "oakland": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "berkeley": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,

  // Boston
  "boston": FLODESK_LOCATION_SEGMENTS.BOSTON,
  "cambridge": FLODESK_LOCATION_SEGMENTS.BOSTON,
  "somerville": FLODESK_LOCATION_SEGMENTS.BOSTON,

  // Washington DC
  "washington": FLODESK_LOCATION_SEGMENTS.WASHINGTON_DC,
  "washington dc": FLODESK_LOCATION_SEGMENTS.WASHINGTON_DC,
  "washington d.c.": FLODESK_LOCATION_SEGMENTS.WASHINGTON_DC,
  "dc": FLODESK_LOCATION_SEGMENTS.WASHINGTON_DC,
};

/**
 * Resolves a raw city string (from Luma's geo_address_json.city) to the
 * matching Flodesk segment name, or null if unmapped.
 *
 * @example
 * resolveSegmentForCity("Miami Beach") // → "Location: MIA"
 * resolveSegmentForCity("Tokyo")       // → null
 */
export function resolveSegmentForCity(
  city: string | undefined | null
): FlodesKLocationSegment | null {
  if (!city) return null;
  const normalized = city.trim().toLowerCase();
  return CITY_TO_SEGMENT_MAP[normalized] ?? null;
}
