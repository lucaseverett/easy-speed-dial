import { useEffect, useRef } from "react";
import { css } from "@emotion/css";
import { Modal } from "./Modal.js";
import { About } from "./About.js";

const styles = css`
  font-size: 16px;
  padding: 25px;
  outline: none;
`;

export const AboutModal = ({ handleDismissModal, handleEscapeModal }) => {
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
        title: "About Toolbar Dial",
        width: "520px",
        height: "450px",
        dismissRef,
        shiftTabRef: focusRef,
        tabRef: focusRef,
      }}
    >
      <div tabIndex="0" ref={focusRef} className={styles} onKeyDown={tabKey}>
        <About />
      </div>
    </Modal>
  );
};
