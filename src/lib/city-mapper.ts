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
  AUSTIN: "Location: ATX",
  SAN_FRANCISCO: "Location: SF",
} as const;

export type FlodesKLocationSegment =
  (typeof FLODESK_LOCATION_SEGMENTS)[keyof typeof FLODESK_LOCATION_SEGMENTS];

// ─── City → Segment mapping ────────────────────────────────────────────────────

const CITY_TO_SEGMENT_MAP: Record<string, FlodesKLocationSegment> = {
  // ── Miami / South Florida ──────────────────────────────────────────────────
  "miami": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "miami beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "south beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "north miami": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "north miami beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "miami gardens": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "miami lakes": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "miami shores": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "miami springs": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "coral gables": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "brickell": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "coconut grove": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "south miami": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "wynwood": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "little havana": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "overtown": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "edgewater": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "midtown miami": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "design district": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "doral": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "hialeah": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "homestead": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "key biscayne": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "aventura": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "bal harbour": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "sunny isles beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "surfside": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "pinecrest": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "kendall": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "westchester": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "fort lauderdale": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "ft lauderdale": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "ft. lauderdale": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "hollywood": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "hallandale beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "pompano beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "boca raton": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "delray beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "west palm beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "palm beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "boynton beach": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "plantation": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "weston": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "davie": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "pembroke pines": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "miramar": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "cooper city": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "coral springs": FLODESK_LOCATION_SEGMENTS.MIAMI,
  "sunrise": FLODESK_LOCATION_SEGMENTS.MIAMI,

  // ── New York / Tri-State ───────────────────────────────────────────────────
  "new york": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "new york city": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "nyc": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "manhattan": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "brooklyn": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "queens": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "bronx": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "the bronx": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "staten island": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "harlem": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "soho": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "tribeca": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "chelsea": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "greenwich village": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "east village": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "west village": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "lower east side": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "upper east side": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "upper west side": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "midtown": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "financial district": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "williamsburg": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "bushwick": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "dumbo": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "park slope": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "greenpoint": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "astoria": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "long island city": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "flushing": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "hoboken": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "jersey city": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "weehawken": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "fort lee": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "yonkers": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "white plains": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "new rochelle": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "stamford": FLODESK_LOCATION_SEGMENTS.NEW_YORK,
  "greenwich": FLODESK_LOCATION_SEGMENTS.NEW_YORK,

  // ── Los Angeles / SoCal ────────────────────────────────────────────────────
  "los angeles": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "la": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "santa monica": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "venice": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "west hollywood": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "beverly hills": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "culver city": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "malibu": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "pacific palisades": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "brentwood": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "westwood": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "century city": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "silver lake": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "los feliz": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "echo park": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "highland park": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "north hollywood": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "studio city": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "sherman oaks": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "encino": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "burbank": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "glendale": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "pasadena": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "marina del rey": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "playa del rey": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "playa vista": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "el segundo": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "manhattan beach": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "hermosa beach": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "redondo beach": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "torrance": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "long beach": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "downtown la": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "dtla": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "koreatown": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "inglewood": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "calabasas": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "thousand oaks": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,
  "santa clarita": FLODESK_LOCATION_SEGMENTS.LOS_ANGELES,

  // ── Austin / Central Texas ─────────────────────────────────────────────────
  "austin": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "round rock": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "cedar park": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "pflugerville": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "georgetown": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "lakeway": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "bee cave": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "dripping springs": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "kyle": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "buda": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "leander": FLODESK_LOCATION_SEGMENTS.AUSTIN,
  "san marcos": FLODESK_LOCATION_SEGMENTS.AUSTIN,

  // ── San Francisco / Bay Area ───────────────────────────────────────────────
  "san francisco": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "sf": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "oakland": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "berkeley": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "san jose": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "palo alto": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "mountain view": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "sunnyvale": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "santa clara": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "cupertino": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "redwood city": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "menlo park": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "san mateo": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "daly city": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "south san francisco": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "fremont": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "hayward": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "walnut creek": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "concord": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "pleasanton": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "livermore": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "alameda": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "emeryville": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "sausalito": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "mill valley": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "san rafael": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "tiburon": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "novato": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "campbell": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "los gatos": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "saratoga": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
  "milpitas": FLODESK_LOCATION_SEGMENTS.SAN_FRANCISCO,
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
  NYC: "Location: NYC",
  LA: "Location: LA",
  ATX: "Location: ATX",
  SF: "Location: SF",
};

export const DEFAULT_CITY_MAP: Record<string, string> = {
  // Miami / South Florida
  "miami": "MIAMI", "miami beach": "MIAMI", "south beach": "MIAMI",
  "north miami": "MIAMI", "north miami beach": "MIAMI", "miami gardens": "MIAMI",
  "miami lakes": "MIAMI", "miami shores": "MIAMI", "miami springs": "MIAMI",
  "coral gables": "MIAMI", "brickell": "MIAMI", "coconut grove": "MIAMI",
  "south miami": "MIAMI", "wynwood": "MIAMI", "little havana": "MIAMI",
  "overtown": "MIAMI", "edgewater": "MIAMI", "midtown miami": "MIAMI",
  "design district": "MIAMI", "doral": "MIAMI", "hialeah": "MIAMI",
  "homestead": "MIAMI", "key biscayne": "MIAMI", "aventura": "MIAMI",
  "bal harbour": "MIAMI", "sunny isles beach": "MIAMI", "surfside": "MIAMI",
  "pinecrest": "MIAMI", "kendall": "MIAMI", "westchester": "MIAMI",
  "fort lauderdale": "MIAMI", "ft lauderdale": "MIAMI", "ft. lauderdale": "MIAMI",
  "hollywood": "MIAMI", "hallandale beach": "MIAMI", "pompano beach": "MIAMI",
  "boca raton": "MIAMI", "delray beach": "MIAMI", "west palm beach": "MIAMI",
  "palm beach": "MIAMI", "boynton beach": "MIAMI", "plantation": "MIAMI",
  "weston": "MIAMI", "davie": "MIAMI", "pembroke pines": "MIAMI",
  "miramar": "MIAMI", "cooper city": "MIAMI", "coral springs": "MIAMI",
  "sunrise": "MIAMI",
  // New York / Tri-State
  "new york": "NYC", "new york city": "NYC", "nyc": "NYC",
  "manhattan": "NYC", "brooklyn": "NYC", "queens": "NYC",
  "bronx": "NYC", "the bronx": "NYC", "staten island": "NYC",
  "harlem": "NYC", "soho": "NYC", "tribeca": "NYC",
  "chelsea": "NYC", "greenwich village": "NYC", "east village": "NYC",
  "west village": "NYC", "lower east side": "NYC", "upper east side": "NYC",
  "upper west side": "NYC", "midtown": "NYC", "financial district": "NYC",
  "williamsburg": "NYC", "bushwick": "NYC", "dumbo": "NYC",
  "park slope": "NYC", "greenpoint": "NYC", "astoria": "NYC",
  "long island city": "NYC", "flushing": "NYC", "hoboken": "NYC",
  "jersey city": "NYC", "weehawken": "NYC", "fort lee": "NYC",
  "yonkers": "NYC", "white plains": "NYC", "new rochelle": "NYC",
  "stamford": "NYC", "greenwich": "NYC",
  // Los Angeles / SoCal
  "los angeles": "LA", "la": "LA", "santa monica": "LA",
  "venice": "LA", "west hollywood": "LA", "beverly hills": "LA",
  "culver city": "LA", "malibu": "LA", "pacific palisades": "LA",
  "brentwood": "LA", "westwood": "LA", "century city": "LA",
  "silver lake": "LA", "los feliz": "LA", "echo park": "LA",
  "highland park": "LA", "studio city": "LA", "sherman oaks": "LA",
  "encino": "LA", "burbank": "LA", "glendale": "LA",
  "pasadena": "LA", "marina del rey": "LA", "playa del rey": "LA",
  "playa vista": "LA", "el segundo": "LA", "manhattan beach": "LA",
  "hermosa beach": "LA", "redondo beach": "LA", "torrance": "LA",
  "long beach": "LA", "downtown la": "LA", "dtla": "LA",
  "koreatown": "LA", "inglewood": "LA", "calabasas": "LA",
  "thousand oaks": "LA", "santa clarita": "LA", "north hollywood": "LA",
  // Austin / Central Texas
  "austin": "ATX", "round rock": "ATX", "cedar park": "ATX",
  "pflugerville": "ATX", "georgetown": "ATX", "lakeway": "ATX",
  "bee cave": "ATX", "dripping springs": "ATX", "kyle": "ATX",
  "buda": "ATX", "leander": "ATX", "san marcos": "ATX",
  // San Francisco / Bay Area
  "san francisco": "SF", "sf": "SF", "oakland": "SF",
  "berkeley": "SF", "san jose": "SF", "palo alto": "SF",
  "mountain view": "SF", "sunnyvale": "SF", "santa clara": "SF",
  "cupertino": "SF", "redwood city": "SF", "menlo park": "SF",
  "san mateo": "SF", "daly city": "SF", "south san francisco": "SF",
  "fremont": "SF", "hayward": "SF", "walnut creek": "SF",
  "concord": "SF", "pleasanton": "SF", "livermore": "SF",
  "alameda": "SF", "emeryville": "SF", "sausalito": "SF",
  "mill valley": "SF", "san rafael": "SF", "tiburon": "SF",
  "novato": "SF", "campbell": "SF", "los gatos": "SF",
  "saratoga": "SF", "milpitas": "SF",
};

// ─── Sync resolver (used by backfill script) ─────────────────────────────────

export function resolveSegmentForCity(
  city: string | undefined | null
): FlodesKLocationSegment | null {
  if (!city) return null;
  const normalized = city.trim().toLowerCase();
  return CITY_TO_SEGMENT_MAP[normalized] ?? null;
}
