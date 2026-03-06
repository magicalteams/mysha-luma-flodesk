/**
 * FlodesKClient — typed wrapper around the Flodesk REST API v1
 * Docs: https://developers.flodesk.com/
 *
 * Auth: HTTP Basic — username = API key, password = empty string.
 *
 * NOTE: The Flodesk API expects `segment_ids` (array of ID strings),
 * not segment names. This client resolves human-readable segment names
 * to IDs automatically via a cached GET /segments lookup.
 */

const FLODESK_BASE_URL = "https://api.flodesk.com/v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FlodesKSubscriberPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  custom_fields?: Record<string, string>;
  /** Human-readable segment names (e.g. "Location: MIA") — resolved to IDs internally */
  segments?: string[];
  status?: "active" | "unsubscribed";
}

export interface FlodeskSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: "active" | "unsubscribed" | "bounced";
  segments: Array<{ id: string; name: string }>;
}

interface FlodeskSegment {
  id: string;
  name: string;
}

interface FlodeskSegmentsResponse {
  data: FlodeskSegment[];
}

// ─── Client ───────────────────────────────────────────────────────────────────

export class FlodesKClient {
  private readonly authHeader: string;
  private segmentCache: Map<string, string> | null = null;

  constructor(apiKey: string) {
    // Flodesk uses HTTP Basic auth: key as username, empty password
    this.authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
  }

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<T> {
    const res = await fetch(`${FLODESK_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Flodesk API error ${res.status} on ${method} ${path}: ${text}`);
    }

    // 204 No Content — return empty object
    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;
  }

  /**
   * Fetches all segments from Flodesk and caches the name→ID mapping.
   * Only makes one API call per client instance.
   */
  private async getSegmentNameToIdMap(): Promise<Map<string, string>> {
    if (this.segmentCache) return this.segmentCache;

    const response = await this.request<FlodeskSegmentsResponse>("GET", "/segments");
    this.segmentCache = new Map(response.data.map((s) => [s.name, s.id]));
    return this.segmentCache;
  }

  /**
   * Resolves human-readable segment names to Flodesk segment IDs.
   * Throws if a segment name doesn't exist in Flodesk.
   */
  async resolveSegmentIds(names: string[]): Promise<string[]> {
    if (names.length === 0) return [];

    const nameToId = await this.getSegmentNameToIdMap();

    return names.map((name) => {
      const id = nameToId.get(name);
      if (!id) {
        throw new Error(
          `Flodesk segment "${name}" not found. Create it in Flodesk first.`
        );
      }
      return id;
    });
  }

  /**
   * Upserts a subscriber (creates or updates by email).
   * Segment names in `payload.segments` are resolved to IDs automatically.
   */
  async upsertSubscriber(
    payload: FlodesKSubscriberPayload
  ): Promise<FlodeskSubscriber> {
    const { segments, ...rest } = payload;

    const body: Record<string, unknown> = { ...rest };
    if (segments && segments.length > 0) {
      body.segment_ids = await this.resolveSegmentIds(segments);
    }

    return this.request<FlodeskSubscriber>("POST", "/subscribers", body);
  }

  /**
   * Convenience: upsert + segment in a single logical operation.
   * Handles the case where the subscriber is brand-new.
   */
  async upsertAndSegment(
    payload: FlodesKSubscriberPayload,
    segmentNames: string[]
  ): Promise<FlodeskSubscriber> {
    return this.upsertSubscriber({
      ...payload,
      segments: segmentNames,
    });
  }
}
