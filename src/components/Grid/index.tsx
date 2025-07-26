import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

import "./styles.css";

import { runInAction } from "mobx";

import { Dial } from "#components/Dial";
import { bookmarks } from "#stores/useBookmarks";
import { settings } from "#stores/useSettings";

export const Grid = observer(function Grid() {
  const gridRef = useRef(null);
  const breadcrumbsRef = useRef(null);
  const dropZonePercent = 0.6;
  const [isMaxFontSize, setIsMaxFontSize] = useState(false);

  // Show breadcrumbs unless in the root folder.
  const isRoot =
    (settings.defaultFolder !== undefined &&
      bookmarks.currentFolder.id === settings.defaultFolder) ||
    !bookmarks.parentId;

  // Check if font size is at maximum (1.6em) for scale mode.
  // This is used to determine if the grid should have a max-width applied.
  // It's a workaround for a Firefox glitch where the grid does not scale properly.
  // By removing the max-width when the font size is at maximum, we work around the issue.
  useEffect(() => {
    const checkFontSize = () => {
      if (gridRef.current) {
        const computedStyle = window.getComputedStyle(gridRef.current);
        const fontSize = parseFloat(computedStyle.fontSize);

        setIsMaxFontSize(fontSize === 25.6);
      }
    };

    // Check on mount, when window resizes, and when dial settings change
    checkFontSize();
    window.addEventListener("resize", checkFontSize);

    return () => {
      window.removeEventListener("resize", checkFontSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.dialSize, settings.maxColumns, settings.squareDials]);

  useEffect(() => {
    // Check if the cursor is in a dial's drop zone
    function isInDragZone(x, width) {
      const zoneWidth = width * dropZonePercent;
      const start = (width - zoneWidth) / 2;
      const end = start + zoneWidth;
      return x >= start && x <= end;
    }

    // Attach hover event listeners to all sortable items.
    const addHoverListeners = () => {
      const sortableItems = gridRef.current?.querySelectorAll("[data-id]");

      sortableItems?.forEach((item) => {
        const handleDragOver = (e) => {
          const draggedItem = document.querySelector(".sortable-chosen");
          if (draggedItem && draggedItem !== item) {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;

            if (isInDragZone(x, width)) {
              item.classList.add("folder-drop-target");
            } else {
              item.classList.remove("folder-drop-target");
            }
          }
        };

        const handleDragLeave = (e) => {
          // Only trigger when leaving the item, not when entering a child element.
          if (!item.contains(e.relatedTarget)) {
            const draggedItem = document.querySelector(".sortable-chosen");
            if (draggedItem && draggedItem !== item) {
              item.classList.remove("folder-drop-target");
            }
          }
        };

        item.addEventListener("dragover", handleDragOver);
        item.addEventListener("dragleave", handleDragLeave);

        // Save the cleanup function for drag event listeners.
        item._hoverCleanup = () => {
          item.removeEventListener("dragover", handleDragOver);
          item.removeEventListener("dragleave", handleDragLeave);
        };
      });
    };

    // Attach drag-and-drop event listeners to the breadcrumb element.
    const addBreadcrumbListeners = () => {
      const breadcrumbElement = breadcrumbsRef.current;
      if (!breadcrumbElement) return;
      const handleDragOver = (e) => {
        e.preventDefault();
        breadcrumbElement.classList.add("breadcrumb-drop-target");
      };
      const handleDragLeave = (e) => {
        if (!breadcrumbElement.contains(e.relatedTarget)) {
          breadcrumbElement.classList.remove("breadcrumb-drop-target");
        }
      };
      const handleDrop = (e) => {
        e.preventDefault();
        breadcrumbElement.classList.remove("breadcrumb-drop-target");
      };
      breadcrumbElement.addEventListener("dragover", handleDragOver);
      breadcrumbElement.addEventListener("dragleave", handleDragLeave);
      breadcrumbElement.addEventListener("drop", handleDrop);
      // Save the cleanup function for breadcrumb event listeners.
      breadcrumbElement._cleanup = () => {
        breadcrumbElement.removeEventListener("dragover", handleDragOver);
        breadcrumbElement.removeEventListener("dragleave", handleDragLeave);
        breadcrumbElement.removeEventListener("drop", handleDrop);
      };
    };

    const cleanupBreadcrumbListeners = () => {
      const breadcrumbElement = breadcrumbsRef.current;
      if (breadcrumbElement && breadcrumbElement._cleanup) {
        breadcrumbElement._cleanup();
      }
    };

    const cleanupHoverListeners = () => {
      const sortableItems = gridRef.current?.querySelectorAll("[data-id]");
      sortableItems?.forEach((item) => {
        if (item._hoverCleanup) {
          item._hoverCleanup();
        }
      });
    };

    const sortable = Sortable.create(gridRef.current, {
      animation: 150,
      delay: 100,
      delayOnTouchOnly: true,
      easing: "cubic-bezier(0.11, 0, 0.5, 0)",
      invertSwap: true,
      swapThreshold: dropZonePercent,
      revertOnSpill: true,
      onStart() {
        addHoverListeners();
        addBreadcrumbListeners();
      },
      async onEnd(e) {
        cleanupBreadcrumbListeners();
        cleanupHoverListeners();
        // Remove the folder-drop-target class from the drop target.
        if (
          e.originalEvent &&
          e.originalEvent.target &&
          e.originalEvent.target.classList
        ) {
          e.originalEvent.target.classList.remove("folder-drop-target");
        }
        // Revert the move if the drag was canceled.
        if (e.originalEvent.type === "dragend") {
          sortable.sort(
            bookmarks.bookmarks.map((b) => b.id),
            true,
          );
          return;
        }
        const draggedId = e.item.dataset.id;
        const droppedId = e.originalEvent.target.dataset.id;
        const droppedType = e.originalEvent.target.dataset.type;

        // Check if the drop happened on the breadcrumb.
        const breadcrumbElement = breadcrumbsRef.current;
        const droppedOnBreadcrumb =
          breadcrumbElement &&
          e.originalEvent &&
          breadcrumbElement.contains(e.originalEvent.target);

        if (droppedOnBreadcrumb) {
          bookmarks.moveBookmark({
            id: draggedId,
            parentId: bookmarks.parentId,
          });
        } else if (
          droppedId &&
          (droppedType === "folder" || droppedType === "bookmark")
        ) {
          // Check if the drop happened in the middle third of the target
          const targetElement = e.originalEvent.target.closest("[data-id]");
          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const x = e.originalEvent.clientX - rect.left;
            const width = rect.width;

            if (isInDragZone(x, width)) {
              if (droppedType === "folder") {
                bookmarks.moveBookmark({
                  id: draggedId,
                  parentId: droppedId,
                });
              } else if (droppedType === "bookmark") {
                runInAction(async () => {
                  // Create a new folder inside the current folder.
                  const newFolder = await bookmarks.createBookmark({
                    title: "New Folder",
                    parentId: bookmarks.currentFolder.id,
                  });
                  const newFolderId = newFolder.id;
                  // Move the new folder to the position of the drop.
                  bookmarks.moveBookmark({
                    id: newFolderId,
                    // Find the index of the added bookmark.
                    // The new index returned by the API may not be the literal index.
                    // There are sometimes skipped indices.
                    from: bookmarks.bookmarks.length - 1,
                    to: bookmarks.bookmarks.findIndex(
                      (b) => b.id === droppedId,
                    ),
                  });
                  // Move the dragged item inside the new folder.
                  bookmarks.moveBookmark({
                    id: draggedId,
                    parentId: newFolderId,
                  });
                  // Move the dropped-on bookmark inside the new folder.
                  bookmarks.moveBookmark({
                    id: droppedId,
                    parentId: newFolderId,
                  });
                });
              }
            }
          }
        } else if (e.oldIndex !== e.newIndex) {
          // Handle standard reordering of dials.
          bookmarks.moveBookmark({
            id: draggedId,
            from: e.oldIndex,
            to: e.newIndex,
          });
        }
      },
    });
  }, []);

  return (
    <>
      {!isRoot && (
        <div className="Breadcrumbs" ref={breadcrumbsRef}>
          <a href={`#${bookmarks.parentId}`} title="Go to parent folder">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="chevron-left"
            >
              <rect fill="none" height="24" width="24" />
              <g>
                <polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12" />
              </g>
            </svg>
            <span>{bookmarks.currentFolder.title}</span>
          </a>
        </div>
      )}
      <div
        className={classNames("Grid", {
          "has-breadcrumbs": !isRoot,
          "max-width": isMaxFontSize,
        })}
        id="sortable"
        style={{
          "--grid-max-cols":
            settings.maxColumns === "Unlimited" ? "999" : settings.maxColumns,
        }}
        ref={gridRef}
      >
        <Dials />
      </div>
    </>
  );
});

const Dials = observer(function Dials() {
  return bookmarks.bookmarks.map(({ id, name, title, type, index, url }) => (
    <Dial
      {...{
        id,
        name,
        title,
        index,
        type,
        url,
      }}
      key={id}
    />
  ));
});
