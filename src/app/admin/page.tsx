import { getSegments, getCityMap } from "@/lib/kv-city-mapper";
import {
  addSegmentAction,
  removeSegmentAction,
  addCityAction,
  logoutAction,
} from "./actions";
import DeleteButton from "./components/delete-button";
import SubmitButton from "./components/submit-button";
import CityTable from "./components/city-table";
import styles from "./admin.module.css";

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

  const cityCount = Object.keys(cityMap).length;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ── Header ───────────────────────────────── */}
        <div className={styles.header}>
          <img
            src="/header.png"
            alt="Magical Teams & Mysha Admin Dashboard"
            className={styles.headerLogo}
          />
          <form action={logoutAction}>
            <button type="submit" className={styles.logoutBtn}>
              Log out
            </button>
          </form>
        </div>

        {/* ── Segments Card ────────────────────────── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Segments</h2>
            <span className={styles.cardCount}>
              {Object.keys(segments).length}
            </span>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Key</th>
                <th className={styles.th}>Flodesk Segment</th>
                <th className={styles.th}>Mapped Cities</th>
                <th className={styles.thRight}></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(segments).map(([key, label]) => {
                const cities = citiesBySegment[key] ?? [];
                return (
                  <tr key={key} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.segKey}>{key}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.segLabel}>{label}</span>
                    </td>
                    <td className={styles.td}>
                      {cities.length > 0 ? (
                        <div className={styles.badgeWrap}>
                          {cities.slice(0, 6).map((c) => (
                            <span key={c} className={styles.badge}>
                              {c}
                            </span>
                          ))}
                          {cities.length > 6 && (
                            <span className={styles.badge}>
                              +{cities.length - 6} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className={styles.emptyState}>No cities</span>
                      )}
                    </td>
                    <td className={styles.tdRight}>
                      <DeleteButton
                        action={removeSegmentAction}
                        hiddenFields={{ key }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <form action={addSegmentAction} className={styles.formRow}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Key</span>
              <input
                name="key"
                placeholder="e.g. NASHVILLE"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Flodesk Segment Name</span>
              <input
                name="label"
                placeholder="e.g. Location: NASHVILLE"
                required
                className={styles.input}
              />
            </div>
            <SubmitButton label="Add Segment" pendingLabel="Adding..." />
          </form>
        </div>

        {/* ── City Mappings Card ───────────────────── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>City Mappings</h2>
            <span className={styles.cardCount}>{cityCount}</span>
          </div>

          <CityTable cityMap={cityMap} segments={segments} />

          <form action={addCityAction} className={styles.formRow}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>City name (from Luma)</span>
              <input
                name="city"
                placeholder="e.g. nashville"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Segment</span>
              <select name="segmentKey" required className={styles.select}>
                <option value="">Select segment...</option>
                {Object.entries(segments).map(([key, label]) => (
                  <option key={key} value={key}>
                    {key} — {label}
                  </option>
                ))}
              </select>
            </div>
            <SubmitButton label="Add City" pendingLabel="Adding..." />
          </form>
        </div>
      </div>
    </div>
  );
}
