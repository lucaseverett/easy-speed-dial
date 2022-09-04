import { useEffect, useState, useRef } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

export function ColorPicker({ customColor, handleCustomColor, left, top }) {
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
      className="ColorPicker"
      style={{
        "--picker-top": `${top + 4}px`,
        "--picker-left": `${left - 6}px`,
      }}
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
        className="input"
      />
    </div>
  );
}
