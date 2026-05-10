import { Modal } from "#components/Modal";
import { modals } from "#stores/useModals";
import { settings } from "#stores/useSettings";

import "./styles.css";

export function ConfirmResetDialog() {
  const isDialCustomizationsReset =
    modals.isOpen === "confirm-reset-dial-customizations";
  const title = isDialCustomizationsReset
    ? "Reset dial customizations?"
    : "Reset settings?";
  const confirmLabel = "Reset";
  const message = isDialCustomizationsReset
    ? "Clear all custom dial colors and thumbnails? This can't be undone."
    : "Reset every setting to its default and clear your custom background color, custom image, and custom dial colors or images? This can't be undone.";
  const descriptionId = "confirm-reset-description";

  function handleConfirm() {
    if (isDialCustomizationsReset) {
      settings.resetDialCustomizations();
    } else {
      settings.resetSettings();
    }
    modals.closeModal();
  }

  return (
    <Modal
      {...{
        title,
        initialFocus: "#confirm-reset-cancel",
        showDismissButton: false,
        descriptionId,
        width: "400px",
      }}
    >
      <div className="ConfirmResetDialog">
        <div className="warning-icon" aria-hidden="true">
          !
        </div>
        <p id={descriptionId}>{message}</p>
        <div className="buttons">
          <button
            type="button"
            id="confirm-reset-cancel"
            className="btn defaultBtn"
            onClick={() => modals.closeModal()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn dangerBtn"
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
