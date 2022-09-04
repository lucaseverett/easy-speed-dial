import { Modal } from "../Modal.jsx";
import { About } from "./About.jsx";

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
      <div className="AboutModal" id="about-modal">
        <About />
      </div>
    </Modal>
  );
};
