import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

import { SettingsContent } from "#components/SettingsContent";
import { colorPicker } from "#stores/useColorPicker";

import "./styles.css";

export const Settings = observer(function Settings() {
  const focusRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onMouseDown={colorPicker.closeColorPicker}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="Options"
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
  );
});
