import { useEffect } from "react";

import { Modal } from "#components/Modal/Modal";
import { SettingsContent } from "#components/settings/SettingsContent";
import { modals } from "#stores/modals";
import { settings } from "#stores/settings";

import "./styles.css";

interface SettingsModalProps {
  active?: boolean;
}

export function SettingsModal({ active = true }: SettingsModalProps) {
  useEffect(() => {
    const wasSettingsIconHidden = settings.settingsIconHidden;
    settings.showSettingsIcon();
    if (wasSettingsIconHidden) {
      modals.setFocusById("settings-icon");
    }
  }, []);

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
