/**
 * LumaClient — typed wrapper around the Luma Public API v1
 * Docs: https://docs.lu.ma/reference/getting-started
 *
 * NOTE: Luma's GraphQL schema is not publicly available; this uses
 * their REST API. Verify field names against your API responses and
 * update the interfaces below if the schema differs.
 */

const LUMA_BASE_URL = "https://api.lu.ma/public/v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LumaGeoAddress {
  city?: string;
  region?: string;       // e.g. "FL"
  country?: string;      // e.g. "US"
  full_address?: string;
  latitude?: number;
  longitude?: number;
}

export interface LumaEvent {
  api_id: string;
  name: string;
  start_at: string;       // ISO 8601
  end_at: string;
  geo_address_json?: LumaGeoAddress;
  geo_latitude?: number;
  geo_longitude?: number;
  url: string;
}

export interface LumaGuest {
  api_id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  registered_at: string;  // ISO 8601
  approval_status: "approved" | "pending" | "declined";
}

interface LumaListEventsResponse {
  entries: Array<{ event: LumaEvent }>;
  has_more: boolean;
  next_cursor?: string;
}

interface LumaGetGuestsResponse {
  entries: Array<{ guest: LumaGuest }>;
  has_more: boolean;
  next_cursor?: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────

export class LumaClient {
  private readonly apiKey: string;
  private readonly calendarApiId: string;

  constructor(apiKey: string, calendarApiId: string) {
    this.apiKey = apiKey;
    this.calendarApiId = calendarApiId;
  }

  private async get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${LUMA_BASE_URL}${path}`);
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }

    const res = await fetch(url.toString(), {
      headers: {
        "x-luma-api-key": this.apiKey,
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Luma API error ${res.status} on ${path}: ${text}`);
    }

    return res.json() as Promise<T>;
  }

  /**
   * Fetches ALL events for the calendar, handling pagination automatically.
   * Luma returns max 50 per page.
   */
  async listAllEvents(): Promise<LumaEvent[]> {
    const events: LumaEvent[] = [];
    let cursor: string | undefined;

    do {
      const data = await this.get<LumaListEventsResponse>("/calendar/list-events", {
        calendar_api_id: this.calendarApiId,
        pagination_limit: "50",
        ...(cursor ? { pagination_cursor: cursor } : {}),
      });

      events.push(...data.entries.map((e) => e.event));
      cursor = data.has_more ? data.next_cursor : undefined;
    } while (cursor);

    return events;
  }

  /**
   * Fetches ALL approved guests for a single event, handling pagination.
   */
  async listAllGuests(eventApiId: string): Promise<LumaGuest[]> {
    const guests: LumaGuest[] = [];
    let cursor: string | undefined;

    do {
      const data = await this.get<LumaGetGuestsResponse>("/event/get-guests", {
        event_api_id: eventApiId,
        pagination_limit: "100",
        ...(cursor ? { pagination_cursor: cursor } : {}),
      });

      // Only include approved registrants to avoid adding declined/pending guests
      const approved = data.entries
        .map((e) => e.guest)
        .filter((g) => g.approval_status === "approved");

      guests.push(...approved);
      cursor = data.has_more ? data.next_cursor : undefined;
    } while (cursor);

    return guests;
  }
}
