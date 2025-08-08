import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

import { colorPicker } from "#stores/useColorPicker";

import "./styles.css";

interface ColorPickerProps {
  color: string;
  handler: (color: string) => void;
  label: string;
}

export const ColorPicker = observer(function ColorPicker({
  color,
  handler,
  label,
}: ColorPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set focus to color picker.
    pickerRef.current
      ?.querySelector<HTMLElement>(".react-colorful__interactive")
      ?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      colorPicker.closeColorPicker();
    } else if (
      e.key === "Tab" &&
      e.shiftKey &&
      (e.target as HTMLElement).getAttribute("aria-label") === "Color"
    ) {
      e.preventDefault();
      (pickerRef.current?.lastChild as HTMLElement)?.focus();
    } else if (
      e.key === "Tab" &&
      !e.shiftKey &&
      (e.target as HTMLElement).nodeName === "INPUT"
    ) {
      e.preventDefault();
      pickerRef.current
        ?.querySelector<HTMLElement>(".react-colorful__interactive")
        ?.focus();
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="ColorPicker"
      style={
        {
          "--picker-left": `${colorPicker.coords.x}px`,
          "--picker-top": `${colorPicker.coords.y}px`,
        } as React.CSSProperties
      }
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
