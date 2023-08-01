import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { WhatsNewModal } from "./WhatsNewModal.jsx";
import { AboutModal } from "./AboutModal.jsx";
import { BookmarkModal } from "./BookmarkModal.jsx";
import { useBookmarks } from "useBookmarks";

const ModalsContext = createContext();

export const ProvideModals = memo(function ProvideModals({ children }) {
  const [showModal, setShowModal] = useState();
  const restoreFocusRef = useRef(null);
  const bookmarkDetails = useRef({});
  const isSubmit = useRef(false);
  const { bookmarks } = useBookmarks();

  const handleShowModal = useCallback(({ modal, ...props }) => {
    setShowModal(modal);
    restoreFocusRef.current = props.restoreFocusRef;
    bookmarkDetails.current.bookmarkType =
      modal === "new-bookmark" ||
      document.querySelector(restoreFocusRef.current)?.href
        ? "bookmark"
        : "folder";
  }, []);

  const handleDismissModal = useCallback((options = {}) => {
    const { submit = false } = options;
    setShowModal();
    isSubmit.current = submit;
  }, []);

  useEffect(() => {
    // Restore focus to Link when modal is submitted with changes.
    // This also covers submitting new bookmarks.
    if (!showModal && isSubmit.current && bookmarkDetails.current.bookmarkID) {
      document
        .querySelector(`[data-id="${bookmarkDetails.current.bookmarkID}"]`)
        ?.focus();
      bookmarkDetails.current = {};
      isSubmit.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarks]);

  useEffect(() => {
    // Restore focus to Link when modal is dismissed.
    // This also covers submitting with no changes.
    if (!showModal && restoreFocusRef.current) {
      document.querySelector(restoreFocusRef.current)?.focus();
      restoreFocusRef.current = null;
    }
  }, [showModal]);

  useLayoutEffect(() => {
    if (showModal) {
      document.documentElement.classList.add("modal-open");
    } else {
      document.documentElement.classList.remove("modal-open");
    }
  }, [showModal]);

  const contextValue = useMemo(
    () => ({
      bookmarkDetails,
      handleDismissModal,
      handleShowModal,
    }),
    [handleDismissModal, handleShowModal],
  );

  return (
    <ModalsContext.Provider value={contextValue}>
      {["new-bookmark", "new-folder", "edit-bookmark"].includes(showModal) && (
        <BookmarkModal />
      )}
      {showModal === "whats-new" && <WhatsNewModal />}
      {showModal === "about" && <AboutModal />}
      <div
        style={{
          pointerEvents: showModal ? "none" : "auto",
        }}
        aria-hidden={showModal ? "true" : "false"}
      >
        {children}
      </div>
    </ModalsContext.Provider>
  );
});

export function useModals() {
  return useContext(ModalsContext);
}
