import { useState } from "react";
import { MapFilters } from "@/hooks/usePoliceDataForMap";
import * as styles from "./FloatingFilterPanel.css";

interface FloatingFilterPanelProps {
  filters: MapFilters;
  onFiltersChange: (filters: Partial<MapFilters>) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
  totalCount?: number;
}

// Todo: bring these in from zod schemas or constants
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
    <div className={styles.panel}>
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.headerLeft}>
          <span className={styles.title}>Filters</span>
          {activeFilterCount > 0 && (
            <span className={styles.badge}>{activeFilterCount}</span>
          )}
        </div>
        <div className={styles.headerRight}>
          {isLoading && <div className={styles.spinner}></div>}
          <span className={styles.expandIcon}>{isExpanded ? "−" : "+"}</span>
        </div>
      </div>

      {activeFilterCount > 0 && !isExpanded && (
        <div className={styles.content}>
          <div className={styles.activeFilters}>
            {activeFilters.map(({ key, value }) => (
              <div key={key} className={styles.activeFilterTag}>
                {getFilterDisplayName(key, value)}
                <button
                  className={styles.removeFilterButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter(key);
                  }}
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
        <div className={styles.scrollableContent}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Date Range</label>
            <div className={styles.dateGrid}>
              <input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className={styles.input}
              />
              <input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Type</label>
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
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Gender</label>
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
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Age Range</label>
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
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Outcome</label>
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
          </div>

          <button
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            className={styles.clearButton}
          >
            Clear All Filters ({activeFilterCount})
          </button>
        </div>
      )}

      <div className={styles.totalCount}>
        {isLoading
          ? "Loading..."
          : `Showing ${totalCount.toLocaleString()} results`}
      </div>
    </div>
  );
}
