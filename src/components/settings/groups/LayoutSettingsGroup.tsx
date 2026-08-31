import type { SettingsGroupProps } from "./settingsGroupUtils";

import { observer } from "mobx-react-lite";

import { CaretDown } from "#components/icons/CaretDown.tsx";
import { settings } from "#stores/settings";
import { getId, gridSpacings, maxColumns } from "./settingsGroupUtils";

export const LayoutSettingsGroup = observer(function LayoutSettingsGroup({
  idPrefix,
}: SettingsGroupProps) {
  const maxColumnsTitleId = getId(idPrefix, "max-cols-title");
  const maxColumnsDescriptionId = getId(idPrefix, "max-cols-description");
  const gridSpacingTitleId = getId(idPrefix, "grid-spacing-title");
  const gridSpacingDescriptionId = getId(idPrefix, "grid-spacing-description");

  return (
    <>
      <div className="setting-wrapper setting-group">
        <div className="setting-label">
          <div className="setting-title" id={maxColumnsTitleId}>
            Maximum Columns
          </div>
          <div className="setting-description" id={maxColumnsDescriptionId}>
            Caps how wide the grid can grow on larger screens.
          </div>
        </div>
        <div className="setting-option select">
          <select
            onChange={(e) => settings.handleMaxColumns(e.target.value)}
            value={settings.maxColumns as string}
            className="input"
            aria-labelledby={maxColumnsTitleId}
            aria-describedby={maxColumnsDescriptionId}
          >
            {maxColumns.map((n) => (
              <option value={n} key={n}>
                {n}
              </option>
            ))}
          </select>
          <CaretDown />
        </div>
      </div>

      <div className="setting-wrapper setting-group">
        <div className="setting-label">
          <div className="setting-title" id={gridSpacingTitleId}>
            Grid Spacing
          </div>
          <div className="setting-description" id={gridSpacingDescriptionId}>
            Space between dials. Smaller spacing leaves room for more.
          </div>
        </div>
        <div className="setting-option select">
          <select
            onChange={(e) => settings.handleGridSpacing(e.target.value)}
            value={settings.gridSpacing as string}
            className="input"
            aria-labelledby={gridSpacingTitleId}
            aria-describedby={gridSpacingDescriptionId}
          >
            {gridSpacings.map(({ label, value }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
          <CaretDown />
        </div>
      </div>
    </>
  );
});
