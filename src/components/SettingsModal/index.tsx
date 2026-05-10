import { Modal } from "#components/Modal";
import { SettingsContent } from "#components/SettingsContent";

import "./styles.css";

interface SettingsModalProps {
  active?: boolean;
}

export function SettingsModal({ active = true }: SettingsModalProps) {
  return (
    <Modal
      {...{
        title: "Settings",
        width: "525px",
        rightAligned: true,
        initialFocus: ".modal-title",
        className: "SettingsModal",
        active,
      }}
    >
      <SettingsContent />
    </Modal>
  );
}
