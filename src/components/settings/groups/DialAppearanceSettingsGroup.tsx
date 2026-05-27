import type { SettingsGroupProps } from "./settingsGroupUtils";

import { observer } from "mobx-react-lite";

import { CaretDown } from "#components/icons/CaretDown.tsx";
import { Switch } from "#components/Switch";
import { modals } from "#stores/modals";
import { settings } from "#stores/settings";
import { dialSizes, getId, handleTitlePlacement } from "./settingsGroupUtils";

export const DialAppearanceSettingsGroup = observer(
  function DialAppearanceSettingsGroup({ idPrefix }: SettingsGroupProps) {
    const dialSizeTitleId = getId(idPrefix, "dial-size-title");
    const dialSizeDescriptionId = getId(idPrefix, "dial-size-description");
    const dialShapeTitleId = getId(idPrefix, "dial-shape-title");
    const dialShapeDescriptionId = getId(idPrefix, "dial-shape-description");
    const titlePlacementTitleId = getId(idPrefix, "title-placement-title");
    const titlePlacementDescriptionId = getId(
      idPrefix,
      "title-placement-description",
    );
    const dialTextTitleId = getId(idPrefix, "dial-text-title");
    const dialTextDescriptionId = getId(idPrefix, "dial-text-description");
    const showDialBordersTitleId = getId(idPrefix, "show-dial-borders-title");
    const showDialBordersDescriptionId = getId(
      idPrefix,
      "show-dial-borders-description",
    );
    const transparentDialsTitleId = getId(idPrefix, "transparent-dials-title");
    const transparentDialsDescriptionId = getId(
      idPrefix,
      "transparent-dials-description",
    );
    const usePresetThumbnailsTitleId = getId(
      idPrefix,
      "use-preset-thumbnails-title",
    );
    const usePresetThumbnailsDescriptionId = getId(
      idPrefix,
      "use-preset-thumbnails-description",
    );
    const showFaviconsTitleId = getId(idPrefix, "show-favicons-title");
    const showFaviconsDescriptionId = getId(
      idPrefix,
      "show-favicons-description",
    );
    const titlePlacement = !settings.showTitle
      ? "hidden"
      : settings.attachTitle
        ? "attached"
        : "below";

    return (
      <>
        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={dialSizeTitleId}>
              Dial Size
            </div>
            <div className="setting-description" id={dialSizeDescriptionId}>
              Set a fixed size, or use Scale to Fit to fill the current column
              count.
            </div>
          </div>
          <div className="setting-option select">
            <select
              onChange={(e) => settings.handleDialSize(e.target.value)}
              value={settings.dialSize as string}
              className="input"
              aria-labelledby={dialSizeTitleId}
              aria-describedby={dialSizeDescriptionId}
            >
              {dialSizes.map(({ label, value }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
            <CaretDown />
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={dialShapeTitleId}>
              Dial Shape
            </div>
            <div className="setting-description" id={dialShapeDescriptionId}>
              Show dials as rectangles or squares.
            </div>
          </div>
          <div className="setting-option select">
            <select
              onChange={(e) =>
                settings.handleSquareDials(e.target.value === "square")
              }
              value={settings.squareDials ? "square" : "rectangle"}
              className="input"
              aria-labelledby={dialShapeTitleId}
              aria-describedby={dialShapeDescriptionId}
            >
              <option value="rectangle">Rectangle</option>
              <option value="square">Square</option>
            </select>
            <CaretDown />
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={dialTextTitleId}>
              Dial Text
            </div>
            <div className="setting-description" id={dialTextDescriptionId}>
              Sets the text shown inside each dial.
            </div>
          </div>
          <div className="setting-option select">
            <select
              onChange={(e) =>
                settings.handleSwitchTitle(e.target.value === "name")
              }
              value={settings.switchTitle ? "name" : "url"}
              className="input"
              aria-labelledby={dialTextTitleId}
              aria-describedby={dialTextDescriptionId}
            >
              <option value="url">URL</option>
              <option value="name">Name</option>
            </select>
            <CaretDown />
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={titlePlacementTitleId}>
              Title Placement
            </div>
            <div
              className="setting-description"
              id={titlePlacementDescriptionId}
            >
              Show the site name below the dial, attached to it, or hidden.
            </div>
          </div>
          <div className="setting-option select">
            <select
              onChange={(e) => handleTitlePlacement(e.target.value)}
              value={titlePlacement}
              className="input"
              aria-labelledby={titlePlacementTitleId}
              aria-describedby={titlePlacementDescriptionId}
            >
              <option value="below">Below dial</option>
              <option value="attached">Attached</option>
              <option value="hidden">Hidden</option>
            </select>
            <CaretDown />
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={transparentDialsTitleId}>
              Transparent Dials
            </div>
            <div
              className="setting-description"
              id={transparentDialsDescriptionId}
            >
              Make dial backgrounds transparent so your wallpaper shows through.
            </div>
          </div>
          <div className="setting-option toggle">
            <Switch
              aria-labelledby={transparentDialsTitleId}
              aria-describedby={transparentDialsDescriptionId}
              onClick={() =>
                settings.handleTransparentDials(!settings.transparentDials)
              }
              className="switch-root"
              checked={settings.transparentDials as boolean}
            >
              <span className="switch-thumb" />
            </Switch>
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={showDialBordersTitleId}>
              Show Borders
            </div>
            <div
              className="setting-description"
              id={showDialBordersDescriptionId}
            >
              Add subtle borders around dials.
            </div>
          </div>
          <div className="setting-option toggle">
            <Switch
              aria-labelledby={showDialBordersTitleId}
              aria-describedby={showDialBordersDescriptionId}
              onClick={() =>
                settings.handleShowDialBorders(!settings.showDialBorders)
              }
              className="switch-root"
              checked={settings.showDialBorders as boolean}
            >
              <span className="switch-thumb" />
            </Switch>
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={usePresetThumbnailsTitleId}>
              Use Preset Thumbnails
            </div>
            <div
              className="setting-description"
              id={usePresetThumbnailsDescriptionId}
            >
              Automatically apply preset thumbnails to popular sites.
            </div>
          </div>
          <div className="setting-option toggle">
            <Switch
              aria-labelledby={usePresetThumbnailsTitleId}
              aria-describedby={usePresetThumbnailsDescriptionId}
              onClick={() =>
                settings.handleUsePresetThumbnails(
                  !settings.usePresetThumbnails,
                )
              }
              className="switch-root"
              checked={settings.usePresetThumbnails as boolean}
            >
              <span className="switch-thumb" />
            </Switch>
          </div>
        </div>

        <div className="setting-wrapper setting-group">
          <div className="setting-label">
            <div className="setting-title" id={showFaviconsTitleId}>
              Show Favicons
            </div>
            <div className="setting-description" id={showFaviconsDescriptionId}>
              Show a site favicon next to each dial title.
            </div>
          </div>
          <div className="setting-option toggle">
            <Switch
              aria-labelledby={showFaviconsTitleId}
              aria-describedby={showFaviconsDescriptionId}
              onClick={(e) => {
                if (settings.showFavicons) {
                  settings.handleShowFavicons(false);
                  return;
                }
                modals.openModal({
                  modal: "confirm-favicon-permission",
                  focusAfterClosed: e.currentTarget,
                });
              }}
              className="switch-root"
              checked={settings.showFavicons as boolean}
            >
              <span className="switch-thumb" />
            </Switch>
          </div>
        </div>
      </>
    );
  },
);
