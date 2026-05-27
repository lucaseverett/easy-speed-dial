import { observer } from "mobx-react-lite";
import { useEffect, useLayoutEffect, useRef } from "react";

import { ConfirmFaviconPermissionDialog } from "#components/modals/ConfirmFaviconPermissionDialog/ConfirmFaviconPermissionDialog";
import { ConfirmResetDialog } from "#components/modals/ConfirmResetDialog/ConfirmResetDialog";
import { SettingsContent } from "#components/settings/SettingsContent";
import { focusSafely } from "#lib/focus";
import { colorPicker } from "#stores/colorPicker";
import { modals } from "#stores/modals";

import "./Settings.css";

export const Settings = observer(function Settings() {
  const focusRef = useRef<HTMLHeadingElement>(null);
  const modalOpen = modals.isOpen;

  useLayoutEffect(() => {
    focusRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!modalOpen && modals.focusAfterClosed) {
      if (focusSafely(modals.focusAfterClosed)) {
        modals.focusAfterClosed = null;
      }
    }
  }, [modalOpen]);

  return (
    <>
      {modals.isOpen?.startsWith("confirm-reset") && <ConfirmResetDialog />}
      {modals.isOpen === "confirm-favicon-permission" && (
        <ConfirmFaviconPermissionDialog />
      )}
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
