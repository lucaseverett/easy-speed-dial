import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

import { colorPicker } from "#stores/useColorPicker";

import "./styles.css";

export const ColorPicker = observer(function ColorPicker({
  color,
  handler,
  label,
}) {
  const pickerRef = useRef();

  useEffect(() => {
    // Set focus to color picker.
    pickerRef.current.querySelector(".react-colorful__interactive").focus();
  }, []);

  function handleKeyDown(e) {
    e.stopPropagation();
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      colorPicker.closeColorPicker();
    } else if (
      e.key === "Tab" &&
      e.shiftKey &&
      e.target.getAttribute("aria-label") === "Color"
    ) {
      e.preventDefault();
      pickerRef.current.lastChild.focus();
    } else if (
      e.key === "Tab" &&
      !e.shiftKey &&
      e.target.nodeName === "INPUT"
    ) {
      e.preventDefault();
      pickerRef.current.querySelector(".react-colorful__interactive").focus();
    }
  }

  return (
    <div
      className="ColorPicker"
      style={{
        "--picker-left": `${colorPicker.coords.x}px`,
        "--picker-top": `${colorPicker.coords.y}px`,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={handleKeyDown}
      ref={pickerRef}
      role="application"
    >
      <div className="heading">{label}</div>
      <HexColorPicker color={color} onChange={handler} />
      <HexColorInput
        color={color}
        onChange={handler}
        className="input"
        prefixed={true}
      />
    </div>
  );
});
