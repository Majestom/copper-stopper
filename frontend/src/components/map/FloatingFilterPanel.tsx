import { useState } from "react";
import { FloatingFilterPanelProps } from "@/schemas/mapSchemas";
import { MapFilters } from "@/hooks/usePoliceDataForMap";
import * as styles from "./FloatingFilterPanel.css";

const TYPE_OPTIONS = [
  "Person search",
  "Vehicle search",
  "Person and Vehicle search",
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const AGE_RANGE_OPTIONS = ["under 10", "10-17", "18-24", "25-34", "over 34"];

const OUTCOME_OPTIONS = [
  "Nothing found - no further action",
  "Arrest",
  "Caution (simple or conditional)",
  "Penalty Notice for Disorder",
  "Community service penalty",
  "Khat or Cannabis warning",
  "Summons / charged by post",
];

export default function FloatingFilterPanel({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading = false,
  totalCount = 0,
}: FloatingFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get active filters (excluding bbox)
  const activeFilters = Object.entries(filters)
    .filter(
      ([key, value]) => key !== "bbox" && value && value.toString().trim()
    )
    .map(([key, value]) => ({
      key: key as keyof MapFilters,
      value: value as string,
    }));

  const activeFilterCount = activeFilters.length;

  const handleFilterChange = (key: keyof MapFilters, value: string) => {
    onFiltersChange({ [key]: value || undefined });
  };

  const handleCheckboxChange = (
    key: keyof MapFilters,
    option: string,
    checked: boolean
  ) => {
    const currentValue = (filters[key] as string) || "";
    const currentOptions = currentValue ? currentValue.split(",") : [];

    let newOptions;
    if (checked) {
      newOptions = [...currentOptions, option];
    } else {
      newOptions = currentOptions.filter((opt) => opt !== option);
    }

    const newValue = newOptions.length > 0 ? newOptions.join(",") : "";
    handleFilterChange(key, newValue);
  };

  const isOptionChecked = (key: keyof MapFilters, option: string): boolean => {
    const currentValue = (filters[key] as string) || "";
    return currentValue.split(",").includes(option);
  };

  const removeFilter = (key: keyof MapFilters) => {
    onFiltersChange({ [key]: undefined });
  };

  const getFilterDisplayName = (key: string, value: string): string => {
    switch (key) {
      case "dateFrom":
        return `From: ${value}`;
      case "dateTo":
        return `To: ${value}`;
      case "type":
      case "gender":
      case "ageRange":
      case "outcome":
        return value.split(",").join(", ");
      default:
        return `${key}: ${value}`;
    }
  };

  return (
    <div className={styles.panel} role="region" aria-label="Map data filters">
      <button
        type="button"
        className={styles.header}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="filter-content"
        aria-label={`Filter panel ${
          isExpanded ? "expanded" : "collapsed"
        }. ${activeFilterCount} filters active.`}
      >
        <div className={styles.headerLeft}>
          <span className={styles.title}>Filters</span>
          {activeFilterCount > 0 && (
            <span
              className={styles.badge}
              aria-label={`${activeFilterCount} active filters`}
            >
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className={styles.headerRight}>
          {isLoading && (
            <div
              className={styles.spinner}
              aria-label="Loading filter results"
              role="status"
            />
          )}
          <span className={styles.expandIcon} aria-hidden="true">
            {isExpanded ? "−" : "+"}
          </span>
        </div>
      </button>

      {activeFilterCount > 0 && !isExpanded && (
        <div
          className={styles.content}
          id="filter-content"
          role="region"
          aria-label="Active filters"
        >
          <div className={styles.activeFilters}>
            {activeFilters.map(({ key, value }) => (
              <div
                key={key}
                className={styles.activeFilterTag}
                role="group"
                aria-label={`Active filter: ${getFilterDisplayName(
                  key,
                  value
                )}`}
              >
                {getFilterDisplayName(key, value)}
                <button
                  type="button"
                  className={styles.removeFilterButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter(key);
                  }}
                  aria-label={`Remove ${key} filter`}
                  title={`Remove ${key} filter`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isExpanded && (
        <div
          className={styles.scrollableContent}
          id="filter-content"
          role="form"
          aria-label="Filter options"
        >
          <fieldset className={styles.fieldGroup}>
            <legend className={styles.legend}>Date Range</legend>
            <div className={styles.dateGrid}>
              <div>
                <label htmlFor="date-from" className={styles.label}>
                  From
                </label>
                <input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                  className={styles.input}
                />
              </div>
              <div>
                <label htmlFor="date-to" className={styles.label}>
                  To
                </label>
                <input
                  id="date-to"
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.fieldGroup}>
            <legend className={styles.legend}>Type</legend>
            <div className={styles.checkboxGroup}>
              {TYPE_OPTIONS.map((option) => (
                <div key={option} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    id={`type-${option}`}
                    checked={isOptionChecked("type", option)}
                    onChange={(e) =>
                      handleCheckboxChange("type", option, e.target.checked)
                    }
                    className={styles.checkbox}
                  />
                  <label
                    htmlFor={`type-${option}`}
                    className={styles.checkboxLabel}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.fieldGroup}>
            <legend className={styles.legend}>Gender</legend>
            <div className={styles.checkboxGroup}>
              {GENDER_OPTIONS.map((option) => (
                <div key={option} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    id={`gender-${option}`}
                    checked={isOptionChecked("gender", option)}
                    onChange={(e) =>
                      handleCheckboxChange("gender", option, e.target.checked)
                    }
                    className={styles.checkbox}
                  />
                  <label
                    htmlFor={`gender-${option}`}
                    className={styles.checkboxLabel}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.fieldGroup}>
            <legend className={styles.legend}>Age Range</legend>
            <div className={styles.checkboxGroup}>
              {AGE_RANGE_OPTIONS.map((option) => (
                <div key={option} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    id={`ageRange-${option}`}
                    checked={isOptionChecked("ageRange", option)}
                    onChange={(e) =>
                      handleCheckboxChange("ageRange", option, e.target.checked)
                    }
                    className={styles.checkbox}
                  />
                  <label
                    htmlFor={`ageRange-${option}`}
                    className={styles.checkboxLabel}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.fieldGroup}>
            <legend className={styles.legend}>Outcome</legend>
            <div className={styles.checkboxGroup}>
              {OUTCOME_OPTIONS.map((option) => (
                <div key={option} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    id={`outcome-${option}`}
                    checked={isOptionChecked("outcome", option)}
                    onChange={(e) =>
                      handleCheckboxChange("outcome", option, e.target.checked)
                    }
                    className={styles.checkbox}
                  />
                  <label
                    htmlFor={`outcome-${option}`}
                    className={styles.checkboxLabel}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            className={styles.clearButton}
            aria-label={`Clear all ${activeFilterCount} active filters`}
          >
            Clear All Filters ({activeFilterCount})
          </button>
        </div>
      )}

      <div
        className={styles.totalCount}
        role="status"
        aria-live="polite"
        aria-label={
          isLoading
            ? "Loading results"
            : `Showing ${totalCount?.toLocaleString() || 0} results on map`
        }
      >
        {isLoading
          ? "Loading..."
          : `Showing ${totalCount?.toLocaleString() || 0} results`}
      </div>
    </div>
  );
}
