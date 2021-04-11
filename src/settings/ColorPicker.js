import { useEffect, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { css } from "@emotion/css";
import { input, inputLight, inputDark } from "../styles/inputs.js";

export function ColorPicker({ customColor, handleCustomColor, left, top }) {
  const styles = css`
    position: absolute;
    z-index: 1;
    top: ${top + 4}px;
    left: ${left - 6}px;
    padding: 5px;
    box-shadow: 0 4px 3px rgb(0, 0, 0, 0.3);
    border-radius: 6px;
    width: 132px;
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
    .color-scheme-light & {
      background-color: #e0e0e0;
      border: 1px solid #9e9e9e;
      input {
        ${inputLight}
      }
    }
    .color-scheme-dark & {
      background-color: #424242;
      border: 1px solid #212121;
      input {
        ${inputDark}
      }
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

  useEffect(() => {
    // set focus to handle
  }, []);

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
    >
      <HexColorPicker color={color} onChange={changeColor} />
      <HexColorInput color={color} onChange={changeColor} />
    </div>
  );
}
