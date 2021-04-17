import { useEffect, useRef } from "react";
import { css } from "@emotion/css";
import { modalScrollbarStyles } from "../styles/scrollbars.js";
import { dismissBtn } from "../styles/buttons.js";

export const Modal = ({
  handleDismissModal,
  handleEscapeModal,
  children,
  title,
  width,
  height,
  shiftTabFocus,
}) => {
  const styles = css`
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);

    .color-scheme-light & {
      --modal-background-color: #bdbdbd;
      --modal-text-color: #000;
      --modal-header-background-color: #bdbdbd;
      --modal-main-background-color: #e0e0e0;
      --modal-main-border-color: #9e9e9e;
      --modal-box-shadow: 0 0 0 5px #bdbdbd, 10px 14px 13px rgb(0, 0, 0, 0.3);
    }

    .color-scheme-dark & {
      --modal-background-color: #373737;
      --modal-text-color: #e0e0e0;
      --modal-header-background-color: #373737;
      --modal-main-background-color: #424242;
      --modal-main-border-color: #212121;
      --modal-box-shadow: 0 0 0 5px #373737, 0 0 0 6px #484848,
        10px 14px 13px rgb(0, 0, 0, 0.3);
    }

    .modal-wrapper {
      height: 100%;
    }

    .modal-content {
      display: flex;
      flex-flow: column;
      height: 100%;
      background-color: var(--modal-background-color);
      color: var(--modal-text-color);
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 12px 12px 25px;
      background-color: var(--modal-header-background-color);

      h1 {
        margin: 0;
        font-size: 20px;
        margin: 0;
        font-weight: normal;
        outline: none;
      }
    }

    main {
      overflow: hidden;
      display: flex;
      height: 100%;
      background-color: var(--modal-main-background-color);
      border-top: 1px solid var(--modal-main-border-color);
    }

    .scroll-box {
      overflow: auto;
      ${modalScrollbarStyles}
    }

    .dismiss {
      ${dismissBtn}
    }

    @media (min-width: ${width}) {
      .modal-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-content {
        max-height: calc(100vh - 40px);
        height: initial;
        border-radius: 6px;
        box-shadow: var(--modal-box-shadow);
      }
      header {
        padding: 5px 4px 9px 25px;
      }
      main {
        border-radius: 6px;
        border: 1px solid var(--modal-main-border-color);
      }
      .scroll-box {
        max-height: ${height};
        width: ${width};
      }
    }
  `;

  const focusRef = useRef(null);

  useEffect(() => {
    if (focusRef.current) {
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
      className={styles}
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
              className="dismiss"
              title="Close"
              onClick={handleDismissModal}
              onKeyDown={handleTab}
              id="dismiss-btn"
            >
              <i className="material-icons close">close</i>
            </button>
          </header>
          <main>
            <div className="scroll-box" id="scroll-box">
              {children}
            </div>
            <div tabIndex="0" onFocus={focusDismissBtn}></div>
          </main>
        </div>
      </div>
    </div>
  );
};
