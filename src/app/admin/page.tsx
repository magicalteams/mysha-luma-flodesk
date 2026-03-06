import { getSegments, getCityMap } from "@/lib/kv-city-mapper";
import {
  addSegmentAction,
  removeSegmentAction,
  addCityAction,
  removeCityAction,
} from "./actions";

const styles = {
  container: {
    maxWidth: 720,
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "system-ui",
    fontSize: 14,
  } as React.CSSProperties,
  h1: { fontSize: 20, marginBottom: 32 } as React.CSSProperties,
  h2: { fontSize: 16, marginBottom: 16, marginTop: 40 } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginBottom: 16,
  } as React.CSSProperties,
  th: {
    textAlign: "left" as const,
    padding: "8px 12px",
    borderBottom: "2px solid #e5e7eb",
    fontSize: 12,
    textTransform: "uppercase" as const,
    color: "#6b7280",
  } as React.CSSProperties,
  td: {
    padding: "8px 12px",
    borderBottom: "1px solid #f3f4f6",
  } as React.CSSProperties,
  form: {
    display: "flex",
    gap: 8,
    alignItems: "flex-end",
    marginBottom: 8,
  } as React.CSSProperties,
  input: {
    padding: "6px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 4,
    fontSize: 14,
  } as React.CSSProperties,
  select: {
    padding: "6px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 4,
    fontSize: 14,
  } as React.CSSProperties,
  addBtn: {
    padding: "6px 14px",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  deleteBtn: {
    padding: "4px 10px",
    backgroundColor: "#fff",
    color: "#dc2626",
    border: "1px solid #dc2626",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  } as React.CSSProperties,
};

export default async function AdminPage() {
  const [segments, cityMap] = await Promise.all([getSegments(), getCityMap()]);

  // Group city mappings by segment key
  const citiesBySegment: Record<string, string[]> = {};
  for (const segKey of Object.keys(segments)) {
    citiesBySegment[segKey] = [];
  }
  for (const [city, segKey] of Object.entries(cityMap)) {
    if (!citiesBySegment[segKey]) citiesBySegment[segKey] = [];
    citiesBySegment[segKey].push(city);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Mysha — Location Segments</h1>

      {/* ── Segments ──────────────────────────────────── */}
      <h2 style={styles.h2}>Segments</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Key</th>
            <th style={styles.th}>Flodesk Segment Name</th>
            <th style={styles.th}>Cities</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(segments).map(([key, label]) => (
            <tr key={key}>
              <td style={styles.td}>{key}</td>
              <td style={styles.td}>{label}</td>
              <td style={styles.td}>
                {(citiesBySegment[key] ?? []).join(", ") || "—"}
              </td>
              <td style={styles.td}>
                <form action={removeSegmentAction}>
                  <input type="hidden" name="key" value={key} />
                  <button type="submit" style={styles.deleteBtn}>
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form action={addSegmentAction} style={styles.form}>
        <div>
          <span style={styles.label}>Key (e.g. NASHVILLE)</span>
          <input
            name="key"
            placeholder="NASHVILLE"
            required
            style={styles.input}
          />
        </div>
        <div>
          <span style={styles.label}>Flodesk Segment Name</span>
          <input
            name="label"
            placeholder="Location: NASHVILLE"
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.addBtn}>
          Add Segment
        </button>
      </form>

      {/* ── City Mappings ────────────────────────────── */}
      <h2 style={styles.h2}>City Mappings</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>City Name (from Luma)</th>
            <th style={styles.th}>Segment</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(cityMap)
            .sort(([, a], [, b]) => a.localeCompare(b))
            .map(([city, segKey]) => (
              <tr key={city}>
                <td style={styles.td}>{city}</td>
                <td style={styles.td}>
                  {segKey} ({segments[segKey] ?? "unknown"})
                </td>
                <td style={styles.td}>
                  <form action={removeCityAction}>
                    <input type="hidden" name="city" value={city} />
                    <button type="submit" style={styles.deleteBtn}>
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <form action={addCityAction} style={styles.form}>
        <div>
          <span style={styles.label}>City name (as it appears in Luma)</span>
          <input
            name="city"
            placeholder="nashville"
            required
            style={styles.input}
          />
        </div>
        <div>
          <span style={styles.label}>Segment</span>
          <select name="segmentKey" required style={styles.select}>
            <option value="">Select...</option>
            {Object.entries(segments).map(([key, label]) => (
              <option key={key} value={key}>
                {key} ({label})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" style={styles.addBtn}>
          Add City
        </button>
      </form>
    </div>
  );
}
