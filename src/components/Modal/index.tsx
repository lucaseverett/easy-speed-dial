import { useEffect, useRef } from "react";

import { colorPicker } from "#stores/useColorPicker";
import { modals } from "#stores/useModals";

import "./styles.css";

import { clsx } from "clsx/lite";

interface ModalProps {
  children: React.ReactNode;
  title: string;
  initialFocus?: string;
  rightAligned?: boolean;
  height?: string;
  width?: string;
  className?: string;
}

export function Modal(props: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const focusItems = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const focusableElements = [
      "a[href]",
      "area[href]",
      'input:not([disabled]):not([type="hidden"])',
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ];

    // Get array of all focusable elements.
    const focusableItems = [
      ...modalRef.current!.querySelectorAll(focusableElements.join(",")),
    ].reduce((acc: HTMLElement[], element) => {
      if (getComputedStyle(element as HTMLElement).display !== "none") {
        acc.push(element as HTMLElement);
      }
      return acc;
    }, []);
    focusItems.current = focusableItems;

    if (props.initialFocus) {
      // Focus the provided initialFocus.
      const focusElement = modalRef.current!.querySelector(
        props.initialFocus,
      ) as HTMLElement;
      focusElement?.focus();
    } else {
      // Focus first focusable element.
      focusItems.current[0]?.focus();
    }
  }, [props.initialFocus]);

  function handleTab(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      colorPicker.closeColorPicker();
      modals.closeModal();
    } else if (
      e.shiftKey &&
      e.key === "Tab" &&
      document.activeElement === focusItems.current[0]
    ) {
      e.preventDefault();
      e.stopPropagation();
      focusItems.current[focusItems.current.length - 1].focus();
    } else if (
      !e.shiftKey &&
      e.key === "Tab" &&
      document.activeElement ===
        focusItems.current[focusItems.current.length - 1]
    ) {
      e.preventDefault();
      e.stopPropagation();
      focusItems.current[0].focus();
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) {
          e.preventDefault();
          modals.closeModal();
        }
        colorPicker.closeColorPicker();
      }}
      className={clsx(
        "Modal",
        props.rightAligned && "right-aligned",
        props.className,
      )}
      style={
        {
          "--modal-height": props.height || undefined,
          "--modal-width": props.width || undefined,
        } as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className="modal-wrapper"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        onKeyDown={handleTab}
      >
        <div className="modal-body" tabIndex={-1}>
          <div className="header">
            <h1 id="modal-title" tabIndex={-1}>
              {props.title}
            </h1>
            <button
              className="btn dismissBtn dismiss"
              aria-label="Close"
              onClick={() => modals.closeModal()}
              id="dismiss-btn"
            >
              <div />
            </button>
          </div>
          <div className="scroll-box scrollbars">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
