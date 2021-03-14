import { useEffect, useRef } from "react";
import { css } from "@emotion/css";
import { Modal } from "./Modal.js";

const styles = css`
  font-size: 16px;
  padding: 25px;
  outline: none;

  h2 {
    margin: 20px 0 0;
    font-size: 16px;

    .color-scheme-light & {
      color: #1565c0;
    }

    .color-scheme-dark & {
      color: #64b5f6;
    }
  }

  h3 {
    margin: 20px 0;
  }

  h2,
  h3 {
    font-size: 16px;
    font-weight: 500;
  }

  ul {
    padding-left: 30px;
  }

  li {
    margin: 10px 0;
  }

  div {
    .color-scheme-light & {
      border-top: 1px solid #bdbdbd;
    }

    .color-scheme-dark & {
      border-top: 1px solid #373737;
    }

    :first-child {
      border: none;

      h2 {
        margin-top: 0;
      }
    }

    :last-child {
      ul:last-of-type {
        margin-bottom: 0;
      }
    }
  }
`;

export const WhatsNew = ({ handleDismissModal, handleEscapeModal }) => {
  const focusRef = useRef(null);

  const dismissRef = useRef(null);

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  function tabKey(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      dismissRef.current.focus();
    }
  }

  return (
    <Modal
      {...{
        handleDismissModal,
        handleEscapeModal,
        title: "What's New",
        width: "470px",
        height: "450px",
        dismissRef,
        shiftTabRef: focusRef,
        tabRef: focusRef,
      }}
    >
      <div
        className="releases"
        tabIndex="0"
        ref={focusRef}
        className={styles}
        onKeyDown={tabKey}
      >
        <div>
          <h2>Version 2.0.2</h2>
          <h3>Changes</h3>
          <ul>
            <li>Tweaked dial colors used for many popular websites</li>
          </ul>
        </div>
        <div>
          <h2>Version 2.0.1</h2>
          <h3>Resolved Issues</h3>
          <ul>
            <li>Minor bug fixes</li>
          </ul>
        </div>
        <div>
          <h2>Version 2.0</h2>
          <h3>New features</h3>
          <ul>
            <li>Custom background colors and images</li>
            <li>Custom context menu for folders and bookmarks</li>
            <li>Delete bookmark or folder from context menu</li>
            <li>Open all bookmarks in folder from context menu</li>
            <li>Option to set maximum number of columns</li>
            <li>Option to use title in dial</li>
          </ul>
          <h3>Changes</h3>
          <ul>
            <li>Added new background colors and images in Options</li>
            <li>Accessibility enhancements to improve contrast</li>
            <li>Back and forward browser buttons now work</li>
            <li>UI changes in Options</li>
          </ul>
          <h3>Resolved Issues</h3>
          <ul>
            <li>Minor bug fixes</li>
          </ul>
        </div>
        <div>
          <h3>Other recent additions to Toolbar Dial</h3>
          <ul>
            <li>Context menu for background to customize Options</li>
            <li>Drag and drop to sort bookmarks</li>
          </ul>
        </div>
        <div>
          <h3>Features coming in future releases of Toolbar Dial</h3>
          <ul>
            <li>Bookmark editing</li>
            <li>Custom dial colors</li>
            <li>Option to change dial size and shape</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
