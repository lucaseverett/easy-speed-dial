import { memo } from "react";

import { Modal } from "./Modal.jsx";
import { About } from "./About";

export const AboutModal = memo(function AboutModal() {
  return (
    <Modal
      {...{
        title: "About Toolbar Dial",
      }}
    >
      <div className="AboutModal">
        <About />
      </div>
    </Modal>
  );
});
