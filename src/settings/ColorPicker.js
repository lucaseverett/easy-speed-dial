import { useEffect, useState, useRef } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { css } from "@emotion/css";
import { input } from "../styles/inputs.js";

export function ColorPicker({ customColor, handleCustomColor, left, top }) {
  const styles = css`
    .color-scheme-light & {
      --picker-background-color: #e0e0e0;
      --picker-border-color: #9e9e9e;
    }

    .color-scheme-dark & {
      --picker-background-color: #424242;
      --picker-border-color: #212121;
    }

    position: absolute;
    z-index: 1;
    top: ${top + 4}px;
    left: ${left - 6}px;
    padding: 5px;
    box-shadow: 0 4px 3px rgb(0, 0, 0, 0.3);
    border-radius: 6px;
    width: 132px;
    outline: none;
    background-color: var(--picker-background-color);
    border: 1px solid var(--picker-border-color);
    input {
      ${input}
      margin-top: 5px;
      font-size: 12px;
      text-align: center;
      padding: 1px 0 0 0;
      line-height: 0;
      width: 100%;
      border-radius: 4px;
    }
    .react-colorful {
      width: 120px;
      height: 136px;
    }
    .react-colorful__saturation {
      border-bottom: none;
      border-radius: 6px;
      margin-bottom: 5px;
    }
    .react-colorful__hue {
      height: 16px;
      border-radius: 4px;
    }
    .react-colorful__hue-pointer,
    .react-colorful__saturation-pointer {
      width: 20px;
      height: 20px;
    }
  `;

  const [color, setColor] = useState(customColor || "#ffffff");

  function changeColor(color) {
    handleCustomColor(color);
    setColor(color);
  }

  const focusRef = useRef(null);

  useEffect(() => {
    // set focus to color picker popup
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  function handleTab(e) {
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      focusRef.current.lastChild.focus();
    }
  }

  function handleTabInput(e) {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      focusRef.current.focus();
    } else if (e.shiftKey) {
      e.stopPropagation();
    }
  }

  return (
    <div
      className={styles}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={handleTab}
      tabIndex="0"
      ref={focusRef}
    >
      <HexColorPicker
        color={color}
        onChange={changeColor}
        onKeyDown={(e) => e.stopPropagation()}
      />
      <HexColorInput
        color={color}
        onChange={changeColor}
        onKeyDown={handleTabInput}
      />
    </div>
  );
}
