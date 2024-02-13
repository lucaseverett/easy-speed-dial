/* eslint-disable jsx-a11y/no-static-element-interactions */

import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { HexColorInput } from "react-colorful";

import { dialColors } from "#Bookmarks/dialColors";
import { ColorPicker } from "#common/ColorPicker";
import { getLinkName } from "#common/filter";
import { bookmarks } from "#stores/useBookmarks";
import { colorPicker } from "#stores/useColorPicker";
import { modals } from "#stores/useModals";
import { settings } from "#stores/useSettings";
import { Modal } from "./Modal";

export const BookmarkModal = observer(function BookmarkModal() {
  const [bookmarkTitle, setBookmarkTitle] = useState(
    modals.focusAfterClosed?.dataset?.title || "",
  );
  const [bookmarkURL, setBookmarkURL] = useState(
    modals.focusAfterClosed?.href || "",
  );
  const initialCustomDialColor =
    settings.dialColors[modals.focusAfterClosed?.dataset?.id];
  const [customDialColor, setCustomDialColor] = useState(
    initialCustomDialColor || "",
  );
  const isEditing = modals.focusAfterClosed?.dataset?.id !== undefined;
  const bookmarkType = modals.isOpen.includes("folder") ? "folder" : "bookmark";
  const defaultDialColor = dialColors(
    getLinkName(bookmarkType === "folder" ? bookmarkTitle : bookmarkURL),
  );
  const dialColor = customDialColor
    ? customDialColor
    : (bookmarkType === "folder" && bookmarkTitle) ||
        (bookmarkType === "bookmark" && bookmarkURL)
      ? defaultDialColor
      : "";
  const disabled = bookmarkType === "folder" ? false : !bookmarkURL;
  async function handleSubmit(e) {
    e.preventDefault();
    if (isEditing) {
      // Add custom dial color if it doesn't match default dial color.
      // Remove custom dial color if it matches default dial color.
      const color = dialColor !== defaultDialColor ? customDialColor : "";
      settings.handleDialColors(modals.focusAfterClosed?.dataset.id, color);
      if (
        ((bookmarkType === "folder" || bookmarkType === "bookmark") &&
          bookmarkTitle !== modals.focusAfterClosed?.dataset.title) ||
        (bookmarkType === "bookmark" &&
          bookmarkURL !== modals.focusAfterClosed?.href)
      ) {
        const updatedBookmark = await bookmarks.updateBookmark(
          modals.focusAfterClosed?.dataset.id,
          {
            title: bookmarkTitle,
            ...(bookmarkType === "bookmark" ? { url: bookmarkURL } : {}),
          },
        );
        modals.closeModal({
          focusAfterClosed: () =>
            document.querySelector(`[data-id="${updatedBookmark.id}"]`),
        });
      } else {
        modals.closeModal();
      }
    } else {
      const newBookmark = await bookmarks.createBookmark({
        title: bookmarkTitle,
        parentId: bookmarks.currentFolder.id,
        ...(bookmarkType === "bookmark" ? { url: bookmarkURL } : {}),
      });
      if (dialColor !== defaultDialColor) {
        // Add custom dial color if it doesn't match default dial color.
        settings.handleDialColors(newBookmark.id, customDialColor);
      }
      modals.closeModal({
        focusAfterClosed: () =>
          document.querySelector(`[data-id="${newBookmark.id}"]`),
      });
    }
  }

  function resetCustomDialColor(e) {
    e.preventDefault();
    setCustomDialColor("");
    document.querySelector("#dial-color-input").focus();
  }

  return (
    <Modal
      {...{
        label: `${isEditing ? "Edit" : "New"} ${
          bookmarkType === "bookmark" ? "Bookmark" : "Folder"
        }`,
        initialFocus: "#title-input",
        width: "400px",
      }}
    >
      <div className="BookmarkModal">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label htmlFor="title-input">Name:</label>
            <input
              type="text"
              value={bookmarkTitle}
              className="input"
              id="title-input"
              onChange={(e) => setBookmarkTitle(e.target.value)}
              autoComplete="off"
            />
            {bookmarkType === "bookmark" && (
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
            <label htmlFor="dial-color-input">Color:</label>
            <div className="dial-color-input">
              <button
                className="btn defaultBtn colorBtn"
                style={{ backgroundColor: dialColor }}
                onClick={colorPicker.openColorPicker}
                aria-label="Open color picker"
                type="button"
              />
              {colorPicker.isOpen && (
                <ColorPicker
                  {...{
                    color: dialColor,
                    handler: setCustomDialColor,
                    label: "Dial Color",
                  }}
                />
              )}
              <HexColorInput
                color={dialColor}
                id="dial-color-input"
                onChange={setCustomDialColor}
                className={classNames("input", {
                  connected: dialColor && dialColor !== defaultDialColor,
                })}
                prefixed={true}
              />
              {dialColor && dialColor !== defaultDialColor && (
                <button
                  className="btn defaultBtn resetBtn"
                  onClick={resetCustomDialColor}
                  type="button"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="buttons">
            <button type="submit" className="btn submitBtn" disabled={disabled}>
              Submit
            </button>
            <button
              type="button"
              className="btn defaultBtn"
              onClick={modals.closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
});
