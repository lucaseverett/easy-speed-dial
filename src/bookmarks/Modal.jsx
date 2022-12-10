import { useEffect, useRef } from "react";
import { CloseBtn } from "./Close.jsx";
import classNames from "classnames";

export const Modal = ({
  handleDismissModal,
  handleEscapeModal,
  children,
  title,
  width,
  height,
  initialFocus,
  shiftTabFocus,
}) => {
  const focusRef = useRef(null);

  useEffect(() => {
    if (initialFocus) {
      initialFocus().focus();
    } else if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  function handleTab(e) {
    if (e.shiftKey && e.key === "Tab") {
      shiftTabFocus().focus();
      e.stopPropagation();
      e.preventDefault();
    }
  }

  function focusDismissBtn() {
    document.querySelector("#dismiss-btn").focus();
  }

  return (
    <div
      onKeyDown={handleEscapeModal}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (e.button !== 2) handleDismissModal();
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className={classNames(
        "Modal",
        window.matchMedia(`(min-width: ${width})`).matches ? "desktop" : false
      )}
      style={{ "--modal-max-height": height, "--modal-width": width }}
    >
      <div className="modal-wrapper">
        <div
          className="modal-content"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
          }}
        >
          <header>
            <h1 tabIndex="-1" ref={focusRef} onKeyDown={handleTab}>
              {title}
            </h1>
            <button
              className="btn dismissBtn dismiss"
              title="Close"
              onClick={handleDismissModal}
              onKeyDown={handleTab}
              id="dismiss-btn"
            >
              <CloseBtn />
            </button>
          </header>
          <main>
            <div className="scroll-box scrollbars" id="scroll-box" tabIndex="0">
              {children}
            </div>
            <div tabIndex="0" onFocus={focusDismissBtn}></div>
          </main>
        </div>
      </div>
    </div>
  );
};
