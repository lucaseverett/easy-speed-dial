import { Modal } from "#components/Modal";
import { SettingsContent } from "#components/SettingsContent";

import "./styles.css";

export function SettingsModal() {
  return (
    <Modal
      {...{
        title: "Settings",
        width: "535px",
        rightAligned: true,
        initialFocus: "#modal-title",
        className: "SettingsModal",
      }}
    >
      <SettingsContent />
    </Modal>
  );
}
