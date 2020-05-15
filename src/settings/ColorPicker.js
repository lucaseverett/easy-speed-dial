import React, { useEffect, useState } from "react";
import iro from "@jaames/iro";
import { css } from "emotion";
import { input, inputLight, inputDark } from "../styles/inputs.js";

let colorPicker;

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
  `;

  const [color, setColor] = useState(customColor || "#ffffff");

  function handleColor(e) {
    if (e.key === "Enter") {
      colorPicker.color.set(e.target.value);
    }
  }

  function changeColor(color) {
    handleCustomColor(color.hexString);
    setColor(color.hexString);
  }

  useEffect(() => {
    colorPicker = new iro.ColorPicker("#picker", {
      width: 120,
      color: customColor || "#ffffff",
      padding: 0,
      margin: 5,
      layout: [
        {
          component: iro.ui.Box,
          options: {},
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: "hue",
          },
        },
      ],
    });
    colorPicker.on("color:change", changeColor);
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
      <div id="picker"></div>
      <input
        type="text"
        value={color}
        onKeyDown={handleColor}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
  );
}
