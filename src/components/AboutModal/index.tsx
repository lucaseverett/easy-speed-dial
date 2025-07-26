import { About } from "#components/About";
import { Modal } from "#components/Modal";

import "./styles.css";

export function AboutModal() {
  return (
    <Modal
      {...{
        title: "About",
        initialFocus: "#modal-title",
      }}
    >
      <div className="AboutModal">
        <About />
      </div>
    </Modal>
  );
}
