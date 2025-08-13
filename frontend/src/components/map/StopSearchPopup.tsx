import React from "react";
import { StopSearchPopupProps } from "@/schemas/mapSchemas";
import * as styles from "./StopSearchPopup.css";

export function StopSearchPopup({ data, onClose }: StopSearchPopupProps) {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getOutcomeStyle = (outcome: string | null): string => {
    if (!outcome) return styles.outcomeStyle;

    const outcomeKey = outcome.toLowerCase();
    if (outcomeKey.includes("arrest"))
      return `${styles.outcomeStyle} ${styles.outcomeBadge.arrest}`;
    if (outcomeKey.includes("caution"))
      return `${styles.outcomeStyle} ${styles.outcomeBadge.caution}`;
    if (outcomeKey.includes("warning"))
      return `${styles.outcomeStyle} ${styles.outcomeBadge.warning}`;
    if (outcomeKey.includes("nothing"))
      return `${styles.outcomeStyle} ${styles.outcomeBadge.nothing}`;
    return styles.outcomeStyle;
  };

  const formatValue = (value: string | null | undefined): string => {
    if (!value || value === "null" || value.trim() === "") {
      return "Not recorded";
    }
    return value;
  };

  return (
    <div className={styles.popup} role="dialog" aria-labelledby="popup-header">
      <button
        className={styles.popupCloseButton}
        onClick={onClose}
        aria-label="Close popup"
        title="Close"
      >
        ×
      </button>

      <div id="popup-header" className={styles.popupHeader}>
        Stop & Search #{data.id}
      </div>

      <div className={styles.popupContent}>
        <div className={styles.popupRow}>
          <span className={styles.popupLabel}>Date & Time:</span>
          <span className={styles.popupValue}>{formatDate(data.datetime)}</span>
        </div>

        <div className={styles.popupRow}>
          <span className={styles.popupLabel}>Type:</span>
          <span className={styles.popupValue}>{formatValue(data.type)}</span>
        </div>

        {data.gender && (
          <div className={styles.popupRow}>
            <span className={styles.popupLabel}>Gender:</span>
            <span className={styles.popupValue}>
              {formatValue(data.gender)}
            </span>
          </div>
        )}

        {data.age_range && (
          <div className={styles.popupRow}>
            <span className={styles.popupLabel}>Age Range:</span>
            <span className={styles.popupValue}>
              {formatValue(data.age_range)}
            </span>
          </div>
        )}

        {data.self_defined_ethnicity && (
          <div className={styles.popupRow}>
            <span className={styles.popupLabel}>Ethnicity:</span>
            <span className={styles.popupValue}>
              {formatValue(data.self_defined_ethnicity)}
            </span>
          </div>
        )}

        {data.object_of_search && (
          <div className={styles.popupRow}>
            <span className={styles.popupLabel}>Object of Search:</span>
            <span className={styles.popupValue}>
              {formatValue(data.object_of_search)}
            </span>
          </div>
        )}

        {data.outcome && (
          <div className={styles.popupRow}>
            <span className={styles.popupLabel}>Outcome:</span>
            <span
              className={`${styles.popupValue} ${getOutcomeStyle(
                data.outcome
              )}`}
            >
              {formatValue(data.outcome)}
            </span>
          </div>
        )}

        {data.legislation && (
          <div className={styles.popupRow}>
            <span className={styles.popupLabel}>Legislation:</span>
            <span className={styles.popupValue}>
              {formatValue(data.legislation)}
            </span>
          </div>
        )}

        {data.street_name && (
          <div className={styles.popupRow}>
            <span className={styles.popupLabel}>Location:</span>
            <span className={styles.popupValue}>
              {formatValue(data.street_name)}
            </span>
          </div>
        )}

        {data.force && (
          <div className={styles.popupRow}>
            <span className={styles.popupLabel}>Force:</span>
            <span className={styles.popupValue}>{formatValue(data.force)}</span>
          </div>
        )}

        <div className={styles.popupRow}>
          <span className={styles.popupLabel}>Coordinates:</span>
          <span className={styles.popupValue}>
            {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
          </span>
        </div>
      </div>
    </div>
  );
}
