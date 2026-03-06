"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import DeleteButton from "./delete-button";
import { removeCityAction } from "../actions";

interface CityTableProps {
  cityMap: Record<string, string>;
  segments: Record<string, string>;
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function CityTable({ cityMap, segments }: CityTableProps) {
  const [query, setQuery] = useState("");

  const sorted = Object.entries(cityMap)
    .sort(([, a], [, b]) => a.localeCompare(b))
    .filter(([city, segKey]) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        city.toLowerCase().includes(q) ||
        segKey.toLowerCase().includes(q) ||
        (segments[segKey] ?? "").toLowerCase().includes(q)
      );
    });

  return (
    <>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>
          <SearchIcon />
        </span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search cities or segments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {sorted.length === 0 ? (
        <div className={styles.noResults}>
          No cities matching &ldquo;{query}&rdquo;
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>City Name</th>
              <th className={styles.th}>Segment</th>
              <th className={styles.thRight}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(([city, segKey]) => (
              <tr key={city} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.segKey}>{city}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.badge}>
                    {segments[segKey] ?? segKey}
                  </span>
                </td>
                <td className={styles.tdRight}>
                  <DeleteButton
                    action={removeCityAction}
                    hiddenFields={{ city }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
