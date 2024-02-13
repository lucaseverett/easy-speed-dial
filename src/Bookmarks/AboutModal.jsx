import { About } from "./About";
import { Modal } from "./Modal";

export function AboutModal() {
  return (
    <Modal
      {...{
        label: "About",
      }}
    >
      <div className="AboutModal">
        <About />
      </div>
    </Modal>
  );
}
