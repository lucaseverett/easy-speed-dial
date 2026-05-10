import { clsx } from "clsx/lite";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import { Modal } from "#components/Modal";
import { sitePresets } from "#lib/sitePresets";
import { bookmarks } from "#stores/useBookmarks";
import { modals } from "#stores/useModals";

import "./styles.css";

interface PopularSitesGridProps {
  selectedPresetKeys?: Set<string>;
  onTogglePreset?: (presetKey: string) => void;
}

const topSitesUSPresetKeys = new Set<keyof typeof sitePresets>([
  "google",
  "youtube",
  "facebook",
  "reddit",
  "amazon",
  "instagram",
  "wikipedia",
  "yahoo",
  "chatgpt",
  "x",
  "duckDuckGo",
  "bing",
  "weatherChannel",
  "tiktok",
  "walmart",
  "temu",
  "usps",
]);

export async function addPopularSitePreset(presetKey: string) {
  const preset = sitePresets[presetKey];
  if (!preset) return;

  await bookmarks.createBookmark({
    url: preset.url,
    title: preset.title,
    parentId: bookmarks.currentFolder.id,
  });
}

export const PopularSitesGrid = observer(function PopularSitesGrid({
  selectedPresetKeys,
  onTogglePreset,
}: PopularSitesGridProps) {
  const [addedPresetKeys, setAddedPresetKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const isSelectionMode = !!selectedPresetKeys && !!onTogglePreset;

  async function handleAdd(presetKey: string) {
    if (isSelectionMode) {
      onTogglePreset(presetKey);
      return;
    }

    if (addedPresetKeys.has(presetKey)) return;

    await addPopularSitePreset(presetKey);
    setAddedPresetKeys((currentKeys) => new Set(currentKeys).add(presetKey));
  }

  const sortedEntries = Object.entries(sitePresets)
    .filter(([key]) => topSitesUSPresetKeys.has(key))
    .sort(([, a], [, b]) => a.title.localeCompare(b.title));

  return (
    <div className="popular-sites-grid">
      {sortedEntries.map(([key, preset]) => {
        const added = addedPresetKeys.has(key);
        const selected = selectedPresetKeys?.has(key) ?? false;
        return (
          <button
            key={key}
            type="button"
            className={clsx(
              "popular-sites-tile",
              added && "added",
              selected && "selected",
            )}
            disabled={added}
            onClick={() => handleAdd(key)}
            title={
              added
                ? `${preset.title} (added)`
                : selected
                  ? `${preset.title} (selected)`
                  : preset.title
            }
            aria-label={
              added
                ? `${preset.title}, already added`
                : selected
                  ? `${preset.title}, selected`
                  : preset.title
            }
            aria-pressed={isSelectionMode ? selected : undefined}
          >
            <span
              className="popular-sites-tile-thumb"
              style={{ backgroundColor: preset.color }}
            >
              <img
                src={preset.image}
                width="32"
                height="32"
                alt=""
              />
            </span>
            <span className="popular-sites-tile-title">{preset.title}</span>
          </button>
        );
      })}
    </div>
  );
});

export const PopularSitesSection = observer(function PopularSitesSection() {
  return (
    <section
      className="PopularSitesSection"
      aria-labelledby="popular-sites-title"
    >
      <h2 id="popular-sites-title">Popular Sites</h2>
      <PopularSitesGrid />
    </section>
  );
});

export const PopularSitesModal = observer(function PopularSitesModal() {
  const [selectedPopularSiteKeys, setSelectedPopularSiteKeys] = useState<
    Set<string>
  >(() => new Set());
  const selectedPopularSiteCount = selectedPopularSiteKeys.size;
  const addLabel =
    selectedPopularSiteCount === 0
      ? "Add"
      : `Add ${selectedPopularSiteCount} ${
          selectedPopularSiteCount === 1 ? "site" : "sites"
        }`;

  function togglePopularSitePreset(presetKey: string) {
    setSelectedPopularSiteKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);
      if (nextKeys.has(presetKey)) {
        nextKeys.delete(presetKey);
      } else {
        nextKeys.add(presetKey);
      }
      return nextKeys;
    });
  }

  async function handleAdd() {
    await Promise.all([...selectedPopularSiteKeys].map(addPopularSitePreset));
    modals.closeModal();
  }

  return (
    <Modal
      title="Add popular sites"
      width="540px"
      initialFocus=".popular-sites-tile"
      className="OnboardingModalLayout"
    >
      <div className="OnboardingModal">
        <p className="onboarding-step-description">
          Choose sites to add to the current folder, then click Add.
        </p>
        <div className="onboarding-step-body">
          <div className="onboarding-popular-sites">
            <PopularSitesGrid
              selectedPresetKeys={selectedPopularSiteKeys}
              onTogglePreset={togglePopularSitePreset}
            />
          </div>
        </div>
        <div className="onboarding-footer onboarding-footer-actions">
          <div className="onboarding-buttons">
            <button
              type="button"
              className="btn defaultBtn"
              onClick={() => modals.closeModal()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn submitBtn"
              onClick={handleAdd}
              disabled={selectedPopularSiteCount === 0}
            >
              {addLabel}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
});
