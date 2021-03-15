import { useEffect } from "react";
import { css } from "@emotion/css";
import { modalScrollbarStyles } from "../styles/scrollbars.js";
import {
  dismissBtn,
  dismissBtnLight,
  dismissBtnDark,
} from "../styles/buttons.js";

export const Modal = ({
  handleDismissModal,
  handleEscapeModal,
  children,
  title,
  width,
  height,
  dismissRef,
  shiftTabRef,
  tabRef,
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

    .modal-wrapper {
      height: 100%;
    }

    .modal-content {
      display: flex;
      flex-flow: column;
      height: 100%;
      .color-scheme-light & {
        background-color: #bdbdbd;
        color: #000;
      }
      .color-scheme-dark & {
        background-color: #373737;
        color: #e0e0e0;
      }
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 12px 12px 25px;
      .color-scheme-light & {
        background-color: #bdbdbd;
      }
      .color-scheme-dark & {
        background-color: #373737;
      }

      h1 {
        margin: 0;
        font-size: 20px;
        margin: 0;
        font-weight: normal;
      }
    }

    main {
      overflow: hidden;
      display: flex;
      height: 100%;
    }
    .color-scheme-light & main {
      background-color: #e0e0e0;
      border-top: 1px solid #9e9e9e;
    }
    .color-scheme-dark & main {
      background-color: #424242;
      border-top: 1px solid #212121;
    }

    .scroll-box {
      overflow: auto;
      ${modalScrollbarStyles}
    }

    .dismiss {
      ${dismissBtn}
      .color-scheme-light & {
        ${dismissBtnLight}
      }
      .color-scheme-dark & {
        ${dismissBtnDark}
      }
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
        .color-scheme-light & {
          box-shadow: 0 0 0 5px #bdbdbd, 10px 14px 13px rgb(0, 0, 0, 0.3);
        }
        .color-scheme-dark & {
          box-shadow: 0 0 0 5px #373737, 10px 14px 13px rgb(0, 0, 0, 0.3);
        }
      }
      header {
        padding: 5px 4px 9px 25px;
      }
      main {
        border-radius: 6px;
        .color-scheme-light & {
          border: 1px solid #9e9e9e;
        }
        .color-scheme-dark & {
          border: 1px solid #212121;
        }
      }
      .scroll-box {
        max-height: ${height};
        width: ${width};
      }
    }
  `;

  function handleTab(e) {
    if (e.shiftKey && e.key === "Tab") {
      shiftTabRef.current.focus();
      e.stopPropagation();
      e.preventDefault();
    } else if (e.key === "Tab") {
      tabRef.current.focus();
      e.stopPropagation();
      e.preventDefault();
    }
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
            <h1>{title}</h1>
            <button
              className="dismiss"
              title="Dismiss"
              onClick={handleDismissModal}
              onKeyDown={handleTab}
              ref={dismissRef}
            >
              <i className="material-icons close">close</i>
            </button>
          </header>
          <main>
            <div className="scroll-box">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
