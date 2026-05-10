import { observer } from "mobx-react-lite";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

import { EyeDropper } from "#components/icons/EyeDropper";
import { colorPicker } from "#stores/useColorPicker";

import "./styles.css";

interface ColorPickerProps {
  color: string;
  handler: (color: string) => void;
  label: string;
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export const ColorPicker = observer(function ColorPicker({
  color,
  handler,
  label,
}: ColorPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const sampleButtonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const anchor = colorPicker.anchor;
  const canSampleScreenColor = "EyeDropper" in window;

  useEffect(() => {
    // Set focus to color picker.
    pickerRef.current
      ?.querySelector<HTMLElement>(".react-colorful__interactive")
      ?.focus();
  }, []);

  useLayoutEffect(() => {
    const picker = pickerRef.current;
    if (!anchor || !picker) return;

    const PICKER_GAP = 4;
    const PICKER_MARGIN = 8;
    const anchorRect = anchor.getBoundingClientRect();
    const pickerHeight = picker.offsetHeight;
    const pickerWidth = picker.offsetWidth;
    const desiredTop = anchorRect.bottom + PICKER_GAP;
    const maxTop = window.innerHeight - pickerHeight - PICKER_MARGIN;
    const top = Math.max(PICKER_MARGIN, Math.min(desiredTop, maxTop));

    const desiredLeft = anchorRect.left;
    const maxLeft = window.innerWidth - pickerWidth - PICKER_MARGIN;
    const left = Math.max(PICKER_MARGIN, Math.min(desiredLeft, maxLeft));

    setPosition({ left, top });
  }, [anchor]);

  async function sampleScreenColor() {
    const EyeDropperConstructor = window.EyeDropper;
    if (!EyeDropperConstructor) return;

    try {
      document.documentElement.classList.add("sampling-screen-color");
      await waitForNextPaint();
      const result = await new EyeDropperConstructor().open();
      handler(result.sRGBHex);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error(error);
      }
    } finally {
      document.documentElement.classList.remove("sampling-screen-color");
      sampleButtonRef.current?.focus();
    }
  }

  function getFocusableControls() {
    const firstControl = pickerRef.current?.querySelector<HTMLElement>(
      ".react-colorful__interactive",
    );
    const controls = [
      firstControl,
      canSampleScreenColor ? sampleButtonRef.current : null,
      pickerRef.current?.querySelector<HTMLInputElement>("input"),
    ];

    return controls.filter((control): control is HTMLElement =>
      Boolean(control),
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const isFormControl =
      target instanceof HTMLButtonElement || target instanceof HTMLInputElement;

    if (e.key === "Escape") {
      e.preventDefault();
      colorPicker.closeColorPicker();
    } else if ((e.key === "Enter" || e.key === " ") && !isFormControl) {
      e.preventDefault();
      colorPicker.closeColorPicker();
    } else if (e.key === "Tab") {
      const controls = getFocusableControls();
      const firstControl = controls[0];
      const lastControl = controls.at(-1);

      if (e.shiftKey && target === firstControl && lastControl) {
        e.preventDefault();
        lastControl.focus();
      } else if (!e.shiftKey && target === lastControl && firstControl) {
        e.preventDefault();
        firstControl.focus();
      }
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="ColorPicker"
      style={
        {
          "--picker-left": `${position.left}px`,
          "--picker-top": `${position.top}px`,
        } as React.CSSProperties
      }
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={handleKeyDown}
      ref={pickerRef}
      role="group"
      aria-label={label}
    >
      <div className="heading">{label}</div>
      <HexColorPicker color={color} onChange={handler} />
      <div className="input-row">
        {canSampleScreenColor && (
          <button
            type="button"
            className="sample-button"
            onClick={sampleScreenColor}
            ref={sampleButtonRef}
            aria-label={`Sample ${label.toLowerCase()} from screen`}
          >
            <EyeDropper />
          </button>
        )}
        <HexColorInput
          color={color}
          onChange={handler}
          className="input"
          prefixed={true}
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  );
});
