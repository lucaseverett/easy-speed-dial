import semverCoerce from "semver/functions/coerce";
import semverGt from "semver/functions/gt";

export interface WhatsNewFeature {
  version: string;
  title: string;
  description: string;
}

// Newest-first order plus the acknowledgment cutoff keeps skipped releases visible.
export const whatsNewFeatures: WhatsNewFeature[] = [
  {
    version: "2.17.0",
    title: "Quick Search",
    description:
      'Added keyboard shortcuts for bookmark search. Enable "Show Search Bar", then press "/" to search bookmarks and "Escape" to clear the search.',
  },
  {
    version: "2.17.0",
    title: "Improved navigation",
    description:
      "Returning to a folder or search with Back and Forward now restores your previous scroll position.",
  },
  {
    version: "2.17.0",
    title: "Hide the Settings icon",
    description:
      'Prefer a cleaner page? Right-click the gear icon and choose "Hide this icon". To bring it back, right-click the page and choose "Settings". The icon will be restored automatically.',
  },
];

export function getUnseenWhatsNewFeatures(
  seenThrough: string,
  currentVersion: string,
) {
  const normalizedSeenThrough = semverCoerce(seenThrough)?.version;
  const normalizedCurrentVersion = semverCoerce(currentVersion)?.version;
  if (!normalizedCurrentVersion) return [];

  return whatsNewFeatures.filter(({ version }) => {
    const normalizedFeatureVersion = semverCoerce(version)?.version;
    if (!normalizedFeatureVersion) return false;

    const isNewerThanCutoff =
      !normalizedSeenThrough ||
      semverGt(normalizedFeatureVersion, normalizedSeenThrough);
    const isAvailable =
      normalizedFeatureVersion === normalizedCurrentVersion ||
      !semverGt(normalizedFeatureVersion, normalizedCurrentVersion);

    return isNewerThanCutoff && isAvailable;
  });
}

export function hasUnseenWhatsNewFeatures(
  seenThrough: string,
  currentVersion: string,
) {
  return getUnseenWhatsNewFeatures(seenThrough, currentVersion).length > 0;
}
