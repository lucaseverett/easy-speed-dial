import { memo, useEffect, useState, useRef } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

export const ColorPicker = memo(function ColorPicker({
  customColor,
  handleCloseColorPicker,
  handleCustomColor,
  left,
  top,
}) {
  const [color, setColor] = useState(customColor || "#ffffff");

  function changeColor(color) {
    handleCustomColor(color);
    setColor(color);
  }

  const pickerRef = useRef(null);

  useEffect(() => {
    // set focus to color picker
    pickerRef.current.querySelector(".react-colorful__interactive").focus();
  }, []);

  function handleKeyDown(e) {
    e.stopPropagation();
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCloseColorPicker();
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
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions
    <div
      className="ColorPicker"
      style={{
        "--picker-top": `${top}px`,
        "--picker-left": `${left}px`,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={handleKeyDown}
      ref={pickerRef}
      role="application"
    >
      <HexColorPicker color={color} onChange={changeColor} />
      <HexColorInput
        color={color}
        onChange={changeColor}
        className="input"
        prefixed={true}
      />
    </div>
  );
});
