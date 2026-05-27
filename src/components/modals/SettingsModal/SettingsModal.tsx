import { Modal } from "#components/Modal/Modal";
import { SettingsContent } from "#components/settings/SettingsContent";

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
