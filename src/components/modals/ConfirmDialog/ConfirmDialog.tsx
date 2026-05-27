import { useId } from "react";

import { Modal } from "#components/Modal/Modal";
import { modals } from "#stores/modals";

import "./styles.css";

interface ConfirmDialogProps {
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "info" | "warning";
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  variant,
  onConfirm,
}: ConfirmDialogProps) {
  const descriptionId = useId();
  const cancelId = useId();
  const confirmButtonClass =
    variant === "warning" ? "btn dangerBtn" : "btn submitBtn";

  async function handleConfirm() {
    try {
      await onConfirm();
    } finally {
      // Always close — leaving the modal open on a thrown onConfirm strands
      // the user with no path forward besides Cancel.
      modals.closeModal();
    }
  }

  return (
    <Modal
      title={title}
      initialFocus={`#${CSS.escape(cancelId)}`}
      showDismissButton={false}
      descriptionId={descriptionId}
      width="400px"
    >
      <div className="ConfirmDialog" data-variant={variant}>
        {variant === "warning" && (
          <div className="ConfirmDialog-icon warning" aria-hidden="true">
            !
          </div>
        )}
        {variant === "info" && (
          <div className="ConfirmDialog-icon info" aria-hidden="true">
            i
          </div>
        )}
        <p id={descriptionId}>{description}</p>
        <div className="buttons">
          <button
            type="button"
            id={cancelId}
            className="btn defaultBtn"
            onClick={() => modals.closeModal()}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmButtonClass}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
