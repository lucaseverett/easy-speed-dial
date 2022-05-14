import { css } from "@emotion/css";
import { Modal } from "../Modal.js";
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
        shiftTabFocus: () => {
          let links = document.querySelectorAll("#about-modal a");
          return links[links.length - 1];
        },
      }}
    >
      <div className={styles} id="about-modal">
        <About />
      </div>
    </Modal>
  );
};
