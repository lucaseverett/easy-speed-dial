import { useEffect, useRef } from "react";

import { colorPicker } from "#stores/useColorPicker";
import { modals } from "#stores/useModals";

export function Modal(props) {
  const modalRef = useRef();
  const focusItems = useRef();

  useEffect(() => {
    const focusableElements = [
      "a[href]",
      "area[href]",
      'input:not([disabled]):not([type="hidden"])',
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      '[tabindex]:not([tabindex="-1"]',
    ];

    // Get array of all focusable elements.
    const focusableItems = [
      ...modalRef.current.querySelectorAll(focusableElements.join(",")),
    ].reduce((acc, element) => {
      if (getComputedStyle(element).display !== "none") {
        acc.push(element);
      }
      return acc;
    }, []);
    focusItems.current = focusableItems;

    if (props.initialFocus) {
      // Focus the provided initialFocus.
      modalRef.current.querySelector(props.initialFocus).focus();
    } else {
      // Focus first focusable element.
      focusItems.current[0].focus();
    }
  }, []);

  function handleTab(e) {
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
    <div
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) {
          e.preventDefault();
          modals.closeModal();
        }
        colorPicker.closeColorPicker();
      }}
      className="Modal"
      style={{
        "--modal-height": props.height || null,
        "--modal-width": props.width || null,
      }}
    >
      <div
        className="modal-wrapper"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-label"
        ref={modalRef}
        onKeyDown={handleTab}
      >
        <div className="modal-body" tabIndex="-1">
          <div className="header">
            <h1 id="modal-label">{props.label}</h1>
            <button
              className="btn dismissBtn dismiss"
              aria-label="Close"
              onClick={modals.closeModal}
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
