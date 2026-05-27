import { observer } from "mobx-react-lite";

import { ConfirmDialog } from "#components/modals/ConfirmDialog/ConfirmDialog";
import { modals } from "#stores/modals";
import { settings } from "#stores/settings";

export const ConfirmResetDialog = observer(function ConfirmResetDialog() {
  const isDialCustomizationsReset =
    modals.isOpen === "confirm-reset-dial-customizations";
  const title = isDialCustomizationsReset
    ? "Reset dial customizations?"
    : "Reset settings?";
  const description = isDialCustomizationsReset
    ? "Clear all custom dial colors and thumbnails? This can't be undone."
    : "Reset every setting to its default and clear your custom background color, custom image, and custom dial colors or images? This can't be undone.";

  function handleConfirm() {
    if (isDialCustomizationsReset) {
      settings.resetDialCustomizations();
    } else {
      settings.resetSettings();
    }
  }

  return (
    <ConfirmDialog
      title={title}
      description={description}
      confirmLabel="Reset"
      variant="warning"
      onConfirm={handleConfirm}
    />
  );
});
