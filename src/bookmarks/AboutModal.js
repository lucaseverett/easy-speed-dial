import { css } from "@emotion/css";
import { Modal } from "./Modal.js";
import { About } from "./About.js";

const styles = css`
  font-size: 16px;
  padding: 25px;
`;

export const AboutModal = ({ handleDismissModal, handleEscapeModal }) => {
  return (
    <Modal
      {...{
        handleDismissModal,
        handleEscapeModal,
        title: "About Toolbar Dial",
        width: "520px",
        height: "450px",
        shiftTabFocus: () => document.querySelector("#github-repo-link"),
      }}
    >
      <div className={styles}>
        <About />
      </div>
    </Modal>
  );
};
