import { memo, useEffect, useRef, useState } from "react";

import { CloseBtn } from "./Close.jsx";
import { useModals } from "./useModals.jsx";

export const Modal = memo(function Memo({
  children,
  height,
  initialFocus,
  title,
  width,
}) {
  const modalRef = useRef(null);
  const [focusItems, setFocusItems] = useState(null);
  const { handleDismissModal } = useModals();

  const focusableElements = [
    "a[href]",
    "area[href]",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    '[tabindex]:not([tabindex="-1"]',
  ];

  useEffect(() => {
    // Get array of all focusable elements
    const focusableItems = [
      ...modalRef.current.querySelectorAll(focusableElements.join(",")),
    ].reduce((acc, element) => {
      if (getComputedStyle(element).display !== "none") {
        acc.push(element);
      }
      return acc;
    }, []);
    setFocusItems(focusableItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialFocus) {
      // Focus provided initialFocus
      modalRef.current.querySelector(initialFocus).focus();
    } else if (modalRef.current) {
      // Focus first focusable element
      focusItems?.[0].focus();
    }
  }, [focusItems, initialFocus]);

  function handleTab(e) {
    if (e.key === "Escape") {
      handleDismissModal();
    } else if (
      e.shiftKey &&
      e.key === "Tab" &&
      document.activeElement === focusItems[0]
    ) {
      e.preventDefault();
      e.stopPropagation();
      focusItems[focusItems.length - 1].focus();
    } else if (
      !e.shiftKey &&
      e.key === "Tab" &&
      document.activeElement === focusItems[focusItems.length - 1]
    ) {
      e.preventDefault();
      e.stopPropagation();
      focusItems[0].focus();
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        handleDismissModal();
      }}
      className="Modal"
      style={{
        "--modal-max-height": height || null,
        "--modal-width": width || null,
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className="modal-wrapper"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        onKeyDown={handleTab}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="header">
          <h1 id="modal-title">{title}</h1>
          <button
            className="btn dismissBtn dismiss"
            title="Close"
            onClick={handleDismissModal}
            id="dismiss-btn"
          >
            <CloseBtn />
          </button>
        </div>
        <div className="modal-content">
          <div className="scroll-box scrollbars">{children}</div>
        </div>
      </div>
    </div>
  );
});
