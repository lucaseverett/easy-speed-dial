import { useEffect, useId, useRef } from "react";

import { colorPicker } from "#stores/useColorPicker";
import { modals } from "#stores/useModals";
import { focusSafely } from "#utils/focus";

import "./styles.css";

import { clsx } from "clsx/lite";

interface ModalProps {
  children: React.ReactNode;
  title: string;
  initialFocus?: string;
  initialFocusKey?: React.DependencyList[number];
  rightAligned?: boolean;
  height?: string;
  width?: string;
  className?: string;
  showDismissButton?: boolean;
  hideTitle?: boolean;
  dismissOnPointerDownOutside?: boolean;
  descriptionId?: string;
  active?: boolean;
}

const focusableElements = [
  "a[href]",
  "area[href]",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
];

function getFocusableItems(modal: HTMLElement) {
  return [
    ...modal.querySelectorAll<HTMLElement>(focusableElements.join(",")),
  ].reduce((acc: HTMLElement[], element) => {
    if (getComputedStyle(element).display !== "none") {
      acc.push(element);
    }
    return acc;
  }, []);
}

export function Modal(props: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const active = props.active ?? true;

  useEffect(() => {
    if (!active) return;

    if (modals.focusAfterOpened) {
      const didFocusAfterOpened = focusSafely(modals.focusAfterOpened);
      modals.focusAfterOpened = null;
      if (didFocusAfterOpened) return;
    }

    const focusableItems = getFocusableItems(modalRef.current!);

    if (props.initialFocus) {
      const focusElement = modalRef.current!.querySelector(
        props.initialFocus,
      ) as HTMLElement;
      if (focusElement && !focusElement.matches(":disabled")) {
        focusElement.focus();
        return;
      }
    }

    focusableItems[0]?.focus();
  }, [active, props.initialFocus, props.initialFocusKey]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!active) return;

    if (e.key === "Escape") {
      colorPicker.closeColorPicker();
      modals.closeModal();
      return;
    }

    if (e.key !== "Tab") return;

    const focusableItems = getFocusableItems(modalRef.current!);
    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (!firstItem || !lastItem) return;

    if (e.shiftKey && document.activeElement === firstItem) {
      e.preventDefault();
      e.stopPropagation();
      lastItem.focus();
    } else if (!e.shiftKey && document.activeElement === lastItem) {
      e.preventDefault();
      e.stopPropagation();
      firstItem.focus();
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) {
          e.preventDefault();
          if (props.dismissOnPointerDownOutside !== false) {
            modals.closeModal();
          }
        }
        colorPicker.closeColorPicker();
      }}
      className={clsx(
        "Modal",
        props.rightAligned && "right-aligned",
        !active && "inactive",
        props.className,
      )}
      style={
        {
          "--modal-height": props.height || undefined,
          "--modal-width": props.width || undefined,
        } as React.CSSProperties
      }
    >
      <div
        className="modal-wrapper"
        role={active ? "dialog" : undefined}
        aria-modal={active ? "true" : undefined}
        aria-labelledby={active ? titleId : undefined}
        aria-describedby={active ? props.descriptionId : undefined}
        inert={!active}
        ref={modalRef}
        onKeyDown={handleKeyDown}
      >
        <div
          className={clsx(
            "modal-body",
            props.showDismissButton === false && "without-dismiss",
          )}
          tabIndex={-1}
        >
          <div className="modal-header">
            <h1
              id={titleId}
              className={clsx(
                "modal-title",
                props.hideTitle && "visually-hidden",
              )}
              tabIndex={-1}
            >
              {props.title}
            </h1>
            {props.showDismissButton !== false && (
              <button
                className="btn dismissBtn dismiss"
                aria-label="Close"
                onClick={() => modals.closeModal()}
                id="dismiss-btn"
              >
                <div />
              </button>
            )}
          </div>
          <div className="scroll-box scrollbars">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
