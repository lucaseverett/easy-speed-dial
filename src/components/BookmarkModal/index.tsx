import type { FormEvent, MouseEvent } from "react";
import type { Bookmarks } from "webextension-polyfill";

import { clsx } from "clsx/lite";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { HexColorInput } from "react-colorful";

import { ColorPicker } from "#components/ColorPicker";
import { CaretDown } from "#components/icons/CaretDown.tsx";
import { Modal } from "#components/Modal";
import { dialColors } from "#lib/dialColors";
import { getSitePresetByUrl, getSitePresetColor } from "#lib/sitePresets";
import { bookmarks } from "#stores/useBookmarks";
import { colorPicker } from "#stores/useColorPicker";
import { modals } from "#stores/useModals";
import { settings } from "#stores/useSettings";
import { getLinkName } from "#utils/filter";

import "./styles.css";

export const BookmarkModal = observer(function BookmarkModal() {
  const [editingBookmark, setEditingBookmark] =
    useState<Bookmarks.BookmarkTreeNode | null>(null);
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [bookmarkURL, setBookmarkURL] = useState("");
  const [parentFolderId, setparentFolderId] = useState(
    (bookmarks.currentFolder as { id: string }).id || "",
  );
  const [customDialColor, setCustomDialColor] = useState("");
  const [thumbnailSize, setThumbnailSize] = useState("cover");
  const isEditing = modals.editingBookmarkId !== null;
  const bookmarkType = modals.isOpen?.includes("folder")
    ? "folder"
    : "bookmark";
  const dialTarget = modals.editingBookmarkId;
  const hasCustomThumbnail = !!dialTarget && !!settings.dialImages[dialTarget];
  const submitLabel = isEditing ? "Save" : "Add";

  // Load bookmark details when editing an existing bookmark or folder.
  useEffect(() => {
    async function loadBookmarkData() {
      if (modals.editingBookmarkId) {
        const bookmark = await bookmarks.getBookmarkById(
          modals.editingBookmarkId,
        );
        if (bookmark) {
          setEditingBookmark(bookmark);
          setBookmarkTitle(bookmark.title || "");
          setBookmarkURL(bookmark.url || "");
          setparentFolderId(bookmark.parentId || "");
          // Load the custom dial color for this bookmark, if set.
          const customColor = settings.dialColors[modals.editingBookmarkId];
          setCustomDialColor(customColor || "");
          setThumbnailSize(settings.getDialImageSize(modals.editingBookmarkId));
        }
      }
    }

    loadBookmarkData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modals.editingBookmarkId]);

  const preset =
    bookmarkType === "bookmark" && bookmarkURL && settings.usePresetThumbnails
      ? getSitePresetByUrl(bookmarkURL)
      : null;
  const isUsingPresetThumbnail = !!preset && !hasCustomThumbnail;
  const showDialColorInput = isEditing && !isUsingPresetThumbnail;
  const defaultDialColor =
    (preset ? getSitePresetColor(preset) : undefined) ||
    dialColors(
      getLinkName(bookmarkType === "folder" ? bookmarkTitle : bookmarkURL),
    );
  const activeCustomDialColor = isUsingPresetThumbnail ? "" : customDialColor;
  const dialColor = activeCustomDialColor
    ? customDialColor
    : (bookmarkType === "folder" && bookmarkTitle) ||
        (bookmarkType === "bookmark" && bookmarkURL)
      ? defaultDialColor
      : "";
  const disabled = bookmarkType === "folder" ? false : !bookmarkURL;
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isEditing) {
      if (!isUsingPresetThumbnail && dialTarget) {
        // Save a custom dial color if it differs from the default.
        // Remove the custom dial color if it matches the default.
        const color = dialColor !== defaultDialColor ? customDialColor : "";
        if (color) {
          settings.handleDialColors(dialTarget, color);
        } else {
          settings.handleClearColor(dialTarget);
        }
      }
      if (hasCustomThumbnail && dialTarget) {
        settings.handleDialImageSize(dialTarget, thumbnailSize);
      }
      // Determine which bookmark details have changed.
      const detailsChanged =
        ((bookmarkType === "folder" || bookmarkType === "bookmark") &&
          bookmarkTitle !== editingBookmark?.title) ||
        (bookmarkType === "bookmark" && bookmarkURL !== editingBookmark?.url);
      const parentChanged = parentFolderId !== editingBookmark?.parentId;

      let updatedBookmark: Bookmarks.BookmarkTreeNode | undefined;
      let closeModalOptions:
        | { focusAfterClosed?: FocusAfterClosed }
        | undefined;

      // Update bookmark details if they changed.
      if (detailsChanged && modals.editingBookmarkId) {
        updatedBookmark = await bookmarks.updateBookmark(
          modals.editingBookmarkId,
          {
            title: bookmarkTitle,
            ...(bookmarkType === "bookmark" ? { url: bookmarkURL } : {}),
          },
        );
        // Focus on the updated bookmark after closing.
        closeModalOptions = {
          focusAfterClosed: () =>
            document.querySelector(`[data-id="${updatedBookmark!.id}"]`),
        };
      }

      // Move bookmark to different folder if parent changed.
      if (parentChanged) {
        bookmarks.moveBookmark({
          id: modals.editingBookmarkId!,
          from: undefined,
          to: undefined,
          parentId: parentFolderId,
        });
        // Don't focus since the bookmark is no longer visible in current folder.
        closeModalOptions = undefined;
      }

      // Close modal with appropriate focus behavior:
      // - If details changed: focus on updated bookmark
      // - If parent changed: no focus (item moved away)
      // - If no changes: undefined lets modal handle focus automatically
      modals.closeModal(closeModalOptions);
    } else {
      const newBookmark = await bookmarks.createBookmark({
        url: bookmarkType === "bookmark" ? bookmarkURL : undefined,
        title: bookmarkTitle,
        parentId: parentFolderId,
      });
      modals.closeModal({
        focusAfterClosed: () =>
          document.querySelector(`[data-id="${newBookmark.id}"]`),
      });
    }
  }

  function resetCustomDialColor(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setCustomDialColor("");
    (document.querySelector("#dial-color-input") as HTMLInputElement)?.focus();
  }

  return (
    <Modal
      {...{
        title: `${isEditing ? "Edit" : "Add"} ${
          bookmarkType === "bookmark" ? "Bookmark" : "Folder"
        }`,
        initialFocus: "#title-input",
        showDismissButton: false,
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
                  name="url"
                  inputMode="url"
                  onChange={(e) => setBookmarkURL(e.target.value)}
                  autoComplete="off"
                  required
                />
              </>
            )}
            {isEditing && (
              <>
                <label htmlFor="folder-select">Folder:</label>
                <div className="folder-select">
                  <select
                    id="folder-select"
                    value={parentFolderId}
                    onChange={(e) => setparentFolderId(e.target.value)}
                    className="input"
                  >
                    {bookmarks.folders.map(
                      (folder: { id: string; title: string }) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.title}
                        </option>
                      ),
                    )}
                  </select>
                  <CaretDown />
                </div>
              </>
            )}
            {showDialColorInput && (
              <>
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
                    className={clsx(
                      "input",
                      dialColor &&
                        dialColor !== defaultDialColor &&
                        "connected",
                    )}
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
              </>
            )}
            {hasCustomThumbnail && (
              <>
                <label htmlFor="thumbnail-size-select">Thumbnail:</label>
                <div className="thumbnail-size-select">
                  <select
                    id="thumbnail-size-select"
                    value={thumbnailSize}
                    onChange={(e) => setThumbnailSize(e.target.value)}
                    className="input"
                  >
                    <option value="cover">Fill dial</option>
                    <option value="contain">Fit image</option>
                  </select>
                  <CaretDown />
                </div>
              </>
            )}
          </div>
          <div className="buttons">
            <button
              type="button"
              className="btn defaultBtn"
              onClick={() => modals.closeModal()}
            >
              Cancel
            </button>
            <button type="submit" className="btn submitBtn" disabled={disabled}>
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
});
