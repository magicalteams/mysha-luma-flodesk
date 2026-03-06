/**
 * kv-city-mapper.ts
 *
 * Redis-backed city → segment mapper. Used by the webhook route handler
 * and admin UI at runtime. Reads from Upstash Redis (via @upstash/redis),
 * seeding from the hardcoded defaults in city-mapper.ts on first access.
 *
 * KV schema:
 *   "segments"  → Record<string, string>  e.g. { "MIAMI": "Location: MIA" }
 *   "city-map"  → Record<string, string>  e.g. { "miami": "MIAMI", "miami beach": "MIAMI" }
 */

import { Redis } from "@upstash/redis";
import { DEFAULT_SEGMENTS, DEFAULT_CITY_MAP } from "./city-mapper";

// ─── Redis client ────────────────────────────────────────────────────────────

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

const SEGMENTS_KEY = "segments";
const CITY_MAP_KEY = "city-map";

// ─── Read operations ─────────────────────────────────────────────────────────

export async function getSegments(): Promise<Record<string, string>> {
  const redis = getRedis();
  const data = await redis.get<Record<string, string>>(SEGMENTS_KEY);

  if (!data) {
    // Seed from hardcoded defaults on first access
    await redis.set(SEGMENTS_KEY, DEFAULT_SEGMENTS);
    return { ...DEFAULT_SEGMENTS };
  }

  return data;
}

export async function getCityMap(): Promise<Record<string, string>> {
  const redis = getRedis();
  const data = await redis.get<Record<string, string>>(CITY_MAP_KEY);

  if (!data) {
    await redis.set(CITY_MAP_KEY, DEFAULT_CITY_MAP);
    return { ...DEFAULT_CITY_MAP };
  }

  return data;
}

/**
 * Async version of resolveSegmentForCity — reads from Redis.
 * Used by the webhook route handler at runtime.
 */
export async function resolveSegmentForCityAsync(
  city: string | undefined | null
): Promise<string | null> {
  if (!city) return null;

  const normalized = city.trim().toLowerCase();
  const [cityMap, segments] = await Promise.all([getCityMap(), getSegments()]);

  const segmentKey = cityMap[normalized];
  if (!segmentKey) return null;

  return segments[segmentKey] ?? null;
}

// ─── Write operations (used by admin UI) ──────────────────────────────────────

export async function addSegment(key: string, label: string): Promise<void> {
  const segments = await getSegments();
  segments[key.toUpperCase()] = label;
  await getRedis().set(SEGMENTS_KEY, segments);
}

export async function removeSegment(key: string): Promise<void> {
  const redis = getRedis();
  const [segments, cityMap] = await Promise.all([getSegments(), getCityMap()]);

  // Remove the segment
  delete segments[key];
  // Remove all city mappings that pointed to this segment
  for (const [city, segKey] of Object.entries(cityMap)) {
    if (segKey === key) {
      delete cityMap[city];
    }
  }

  await Promise.all([
    redis.set(SEGMENTS_KEY, segments),
    redis.set(CITY_MAP_KEY, cityMap),
  ]);
}

export async function addCityMapping(
  city: string,
  segmentKey: string
): Promise<void> {
  const cityMap = await getCityMap();
  cityMap[city.trim().toLowerCase()] = segmentKey;
  await getRedis().set(CITY_MAP_KEY, cityMap);
}

export async function removeCityMapping(city: string): Promise<void> {
  const cityMap = await getCityMap();
  delete cityMap[city];
  await getRedis().set(CITY_MAP_KEY, cityMap);
}
