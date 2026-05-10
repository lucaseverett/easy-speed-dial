import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

import { ConfirmResetDialog } from "#components/ConfirmResetDialog";
import { SettingsContent } from "#components/SettingsContent";
import { colorPicker } from "#stores/useColorPicker";
import { modals } from "#stores/useModals";
import { focusSafely } from "#utils/focus";

import "./styles.css";

export const Settings = observer(function Settings() {
  const focusRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!modals.isOpen && modals.focusAfterClosed) {
      if (focusSafely(modals.focusAfterClosed)) {
        modals.focusAfterClosed = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modals.isOpen]);

  return (
    <>
      {modals.isOpen?.startsWith("confirm-reset") && <ConfirmResetDialog />}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        onMouseDown={colorPicker.closeColorPicker}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        className="Options"
        inert={!!modals.isOpen}
      >
        <div className="options-wrapper">
          <div
            className="options-content"
            onContextMenu={(e) => {
              e.stopPropagation();
            }}
          >
            <h1 tabIndex={-1} ref={focusRef}>
              Settings
            </h1>
            <div className="settings-content scrollbars">
              <SettingsContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
