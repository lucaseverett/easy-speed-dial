import { memo, useState } from "react";

import { Modal } from "./Modal.jsx";
import { useBookmarks } from "useBookmarks";
import { useModals } from "./useModals.jsx";

export const BookmarkModal = memo(function BookmarkModal() {
  const { bookmarkDetails, handleDismissModal } = useModals();
  const { createBookmark, updateBookmark, currentFolder } = useBookmarks();
  const [bookmarkTitle, setBookmarkTitle] = useState(
    bookmarkDetails.current.bookmarkTitle || "",
  );
  const [bookmarkURL, setBookmarkURL] = useState(
    bookmarkDetails.current.bookmarkURL || "",
  );
  const isEditing = () => bookmarkDetails.current.bookmarkID !== "";
  const bookmarkType = () => bookmarkDetails.current.bookmarkType;
  const disabled = () =>
    bookmarkDetails.current.bookmarkType === "folder" ? false : !bookmarkURL;

  async function handleSubmit(e) {
    e.preventDefault();
    if (isEditing()) {
      if (
        bookmarkTitle !== bookmarkDetails.current.bookmarkTitle ||
        bookmarkURL !== bookmarkDetails.current.bookmarkURL
      ) {
        updateBookmark(bookmarkDetails.current.bookmarkID, {
          title: bookmarkTitle,
          ...(bookmarkURL ? { url: bookmarkURL } : {}),
        });
        handleDismissModal({ submit: true });
      } else {
        handleDismissModal();
      }
    } else {
      let newBookmark = createBookmark({
        title: bookmarkTitle,
        parentId: currentFolder.id,
        ...(bookmarkURL ? { url: bookmarkURL } : {}),
      });
      handleDismissModal({ submit: true });
      if (newBookmark instanceof Promise) {
        // This allows the demo version to work without returning a Promise.
        // This is a workaround until I change all of the demo functions
        // to use Promises.
        newBookmark = await newBookmark;
      }
      bookmarkDetails.current.bookmarkID = newBookmark.id;
    }
  }
  return (
    <Modal
      {...{
        title: `${isEditing() ? "Edit" : "New"} ${
          bookmarkType() === "bookmark" ? "Bookmark" : "Folder"
        }`,
        initialFocus: "#title-input",
      }}
    >
      <div className="BookmarkModal">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title-input">Name:</label>
          <input
            type="text"
            value={bookmarkTitle}
            className="input"
            id="title-input"
            onChange={(e) => setBookmarkTitle(e.target.value)}
            autoComplete="off"
          />
          {bookmarkType() === "bookmark" && (
            <>
              <label htmlFor="url-input">URL:</label>
              <input
                type="text"
                value={bookmarkURL}
                className="input"
                id="url-input"
                onChange={(e) => setBookmarkURL(e.target.value)}
                autoComplete="off"
                required
              />
            </>
          )}
          <div className="buttons">
            <button
              type="submit"
              className="btn submitBtn"
              disabled={disabled()}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn defaultBtn"
              onClick={handleDismissModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
});
