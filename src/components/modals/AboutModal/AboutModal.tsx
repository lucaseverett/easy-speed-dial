import { About } from "#components/About/About";
import { Modal } from "#components/Modal/Modal";

import "./styles.css";

export function AboutModal() {
  return (
    <Modal
      {...{
        title: "About",
        hideTitle: true,
        width: "360px",
      }}
    >
      <div className="AboutModal">
        <About />
      </div>
    </Modal>
  );
}
