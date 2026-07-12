import { settings } from "#stores/settings";

import "./styles.css";

export function NewPill() {
  if (!settings.showNewBadges) return null;

  return (
    <span className="new-pill" aria-label="New feature">
      New
    </span>
  );
}
