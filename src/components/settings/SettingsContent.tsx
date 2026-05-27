import { observer } from "mobx-react-lite";

import "./styles.css";

import { About } from "#components/About/About";
import { modals } from "#stores/modals";
import { settings } from "#stores/settings";
import {
  AppearanceSettingsGroup,
  BookmarkSettingsGroup,
  DialAppearanceSettingsGroup,
  LayoutSettingsGroup,
} from "./groups";

export const SETTINGS_SECTION_TITLES = {
  appearance: "Appearance",
  layout: "Layout",
  dialAppearance: "Dial Appearance",
  bookmarks: "Bookmarks",
} as const;

export const SettingsContent = observer(function SettingsContent() {
  const { restoreFromJSON, saveToJSON } = settings;

  return (
    <>
      <section className="settings-section">
        <h2 className="settings-section-title">
          {SETTINGS_SECTION_TITLES.appearance}
        </h2>
        <div className="settings-section-content">
          <AppearanceSettingsGroup />
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">
          {SETTINGS_SECTION_TITLES.layout}
        </h2>
        <div className="settings-section-content">
          <LayoutSettingsGroup />
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">
          {SETTINGS_SECTION_TITLES.dialAppearance}
        </h2>
        <div className="settings-section-content">
          <DialAppearanceSettingsGroup />
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">
          {SETTINGS_SECTION_TITLES.bookmarks}
        </h2>
        <div className="settings-section-content">
          <BookmarkSettingsGroup />
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Backup & Restore</h2>
        <div className="settings-section-content">
          <div className="setting-wrapper setting-group">
            <div className="setting-label">
              <div className="setting-title" id="export-settings-title">
                Backup Settings
              </div>
              <div
                className="setting-description"
                id="export-settings-description"
              >
                Download a backup file with your preferences, background, and
                any custom dial colors or images.
              </div>
            </div>
            <div className="setting-option reset">
              <button
                type="button"
                className="btn defaultBtn"
                onClick={saveToJSON}
              >
                Backup
              </button>
            </div>
          </div>

          <div className="setting-wrapper setting-group">
            <div className="setting-label">
              <div className="setting-title" id="restore-settings-title">
                Restore Settings
              </div>
              <div
                className="setting-description"
                id="restore-settings-description"
              >
                Replace your current settings with a backup file. This
                can&apos;t be undone.
              </div>
            </div>
            <div className="setting-option reset">
              <button
                type="button"
                className="btn defaultBtn"
                onClick={(e) => restoreFromJSON(e.currentTarget)}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Reset</h2>
        <div className="settings-section-content">
          <div className="setting-wrapper setting-group">
            <div className="setting-label">
              <div
                className="setting-title"
                id="reset-dial-customizations-title"
              >
                Reset Dial Customizations
              </div>
              <div
                className="setting-description"
                id="reset-dial-customizations-description"
              >
                Clears all custom dial colors and images.
              </div>
            </div>
            <div className="setting-option reset">
              <button
                type="button"
                className="btn dangerBtn"
                onClick={(e) =>
                  modals.openModal({
                    modal: "confirm-reset-dial-customizations",
                    focusAfterClosed: e.currentTarget,
                  })
                }
              >
                Reset customizations
              </button>
            </div>
          </div>

          <div className="setting-wrapper setting-group">
            <div className="setting-label">
              <div className="setting-title" id="reset-settings-title">
                Reset All Settings
              </div>
              <div
                className="setting-description"
                id="reset-settings-description"
              >
                Return every setting to its default and clear all custom
                backgrounds and dial customizations. This can&apos;t be undone.
              </div>
            </div>
            <div className="setting-option reset">
              <button
                type="button"
                className="btn dangerBtn"
                onClick={(e) =>
                  modals.openModal({
                    modal: "confirm-reset",
                    focusAfterClosed: e.currentTarget,
                  })
                }
              >
                Reset settings
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="setting-wrapper about">
          <About />
        </div>
      </section>
    </>
  );
});
