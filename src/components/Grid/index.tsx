import { clsx } from "clsx/lite";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

import "./styles.css";

import { runInAction } from "mobx";
import { contrastRatio } from "random-color-library";

import { getImageAverageColor } from "#lib/imageLuminance";
import { bookmarks } from "#stores/useBookmarks";
import { settings } from "#stores/useSettings";
import { Dial } from "./Dial/index.tsx";
import { SettingsGear } from "./SettingsGear";

interface ExtendedSortableEvent extends Sortable.SortableEvent {
  originalEvent?: DragEvent;
  item: HTMLElement;
}

interface ElementWithCleanup extends Element {
  _hoverCleanup?: () => void;
}

interface HTMLElementWithCleanup extends HTMLDivElement {
  _cleanup?: () => void;
}

export const Grid = observer(function Grid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const breadcrumbsRef = useRef<HTMLDivElement>(null);
  const dropZonePercent = 0.6;
  const [isMaxFontSize, setIsMaxFontSize] = useState(false);
  const [gearColor, setGearColor] = useState<string | null>(null);

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

  // Calculate gear color based on root background for optimal contrast
  useEffect(() => {
    // Only run for custom image or custom color.
    // Otherwise the gear color is set manually.
    if (
      settings.wallpaper !== "custom-image" &&
      settings.wallpaper !== "custom-color"
    ) {
      setGearColor(null);
      return;
    }

    const updateGearColor = async () => {
      const rootElement = document.documentElement;
      const computedStyle = window.getComputedStyle(rootElement);
      const bgColor = computedStyle.backgroundColor;

      // Handle background image (rgba indicates transparent background with image)
      if (bgColor.startsWith("rgba")) {
        const backgroundImage = computedStyle.backgroundImage;
        const match = backgroundImage.match(/url\(['"]?([^'"]*?)['"]?\)/);
        const backgroundImageUrl = match?.[1];

        if (!backgroundImageUrl) {
          setGearColor(null);
        } else {
          try {
            const averageLuminance =
              await getImageAverageColor(backgroundImageUrl);
            setGearColor(averageLuminance < 0.5 ? "#ffffff" : "#000000");
          } catch (error) {
            console.warn("Failed to calculate image-based gear color:", error);
            setGearColor(null);
          }
        }
      } else {
        // Handle solid background color
        const whiteContrast = contrastRatio(bgColor, "#ffffff");
        const blackContrast = contrastRatio(bgColor, "#000000");

        setGearColor(whiteContrast > blackContrast ? "#ffffff" : "#000000");
      }
    };

    updateGearColor();
    window.addEventListener("resize", updateGearColor);

    return () => {
      window.removeEventListener("resize", updateGearColor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.wallpaper, settings.customColor, settings.customImage]);

  useEffect(() => {
    // Check if the cursor is in a dial's drop zone
    function isInDragZone(x: number, width: number) {
      const zoneWidth = width * dropZonePercent;
      const start = (width - zoneWidth) / 2;
      const end = start + zoneWidth;
      return x >= start && x <= end;
    }

    // Attach hover event listeners to all sortable items.
    const addHoverListeners = () => {
      const sortableItems = gridRef.current?.querySelectorAll("[data-id]");

      sortableItems?.forEach((item: ElementWithCleanup) => {
        const handleDragOver = (e: Event) => {
          const dragEvent = e as DragEvent;
          const draggedItem = document.querySelector(".sortable-chosen");
          if (draggedItem && draggedItem !== item) {
            const rect = item.getBoundingClientRect();
            const x = dragEvent.clientX - rect.left;
            const width = rect.width;

            if (isInDragZone(x, width)) {
              item.classList.add("folder-drop-target");
            } else {
              item.classList.remove("folder-drop-target");
            }
          }
        };

        const handleDragLeave = (e: Event) => {
          const dragEvent = e as DragEvent;
          // Only trigger when leaving the item, not when entering a child element.
          if (!item.contains(dragEvent.relatedTarget as Node)) {
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
      const handleDragOver = (e: Event) => {
        e.preventDefault();
        breadcrumbElement.classList.add("breadcrumb-drop-target");
      };
      const handleDragLeave = (e: Event) => {
        const dragEvent = e as DragEvent;
        if (!breadcrumbElement.contains(dragEvent.relatedTarget as Node)) {
          breadcrumbElement.classList.remove("breadcrumb-drop-target");
        }
      };
      const handleDrop = (e: Event) => {
        e.preventDefault();
        breadcrumbElement.classList.remove("breadcrumb-drop-target");
      };
      breadcrumbElement.addEventListener("dragover", handleDragOver);
      breadcrumbElement.addEventListener("dragleave", handleDragLeave);
      breadcrumbElement.addEventListener("drop", handleDrop);
      // Save the cleanup function for breadcrumb event listeners.
      (breadcrumbElement as HTMLElementWithCleanup)._cleanup = () => {
        breadcrumbElement.removeEventListener("dragover", handleDragOver);
        breadcrumbElement.removeEventListener("dragleave", handleDragLeave);
        breadcrumbElement.removeEventListener("drop", handleDrop);
      };
    };

    const cleanupBreadcrumbListeners = () => {
      const breadcrumbElement = breadcrumbsRef.current;
      if (
        breadcrumbElement &&
        (breadcrumbElement as HTMLElementWithCleanup)._cleanup
      ) {
        (breadcrumbElement as HTMLElementWithCleanup)._cleanup!();
      }
    };

    const cleanupHoverListeners = () => {
      const sortableItems = gridRef.current?.querySelectorAll("[data-id]");
      sortableItems?.forEach((item: ElementWithCleanup) => {
        if (item._hoverCleanup) {
          item._hoverCleanup();
        }
      });
    };

    const sortable = Sortable.create(gridRef.current!, {
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
      async onEnd(e: ExtendedSortableEvent) {
        cleanupBreadcrumbListeners();
        cleanupHoverListeners();
        // Remove the folder-drop-target class from the drop target.
        if (e.originalEvent?.target) {
          (e.originalEvent.target as HTMLElement).classList?.remove(
            "folder-drop-target",
          );
        }
        // Revert the move if the drag was canceled.
        if (e.originalEvent?.type === "dragend") {
          sortable.sort(
            bookmarks.bookmarks.map((b) => b.id),
            true,
          );
          return;
        }
        const draggedId = e.item.dataset.id;
        const droppedId = (e.originalEvent?.target as HTMLElement | null)
          ?.dataset.id;
        const droppedType = (e.originalEvent?.target as HTMLElement | null)
          ?.dataset.type;

        // Check if the drop happened on the breadcrumb.
        const breadcrumbElement = breadcrumbsRef.current;
        const droppedOnBreadcrumb =
          breadcrumbElement &&
          e.originalEvent &&
          breadcrumbElement.contains(e.originalEvent.target as Node);

        if (droppedOnBreadcrumb && draggedId) {
          bookmarks.moveBookmark({
            id: draggedId,
            parentId: bookmarks.parentId,
          });
        } else if (
          droppedId &&
          (droppedType === "folder" || droppedType === "bookmark")
        ) {
          // Check if the drop happened in the middle third of the target
          const targetElement = (
            e.originalEvent?.target as HTMLElement | null
          )?.closest("[data-id]");
          if (targetElement && e.originalEvent) {
            const rect = targetElement.getBoundingClientRect();
            const x = e.originalEvent.clientX - rect.left;
            const width = rect.width;

            if (isInDragZone(x, width)) {
              if (droppedType === "folder" && draggedId && droppedId) {
                bookmarks.moveBookmark({
                  id: draggedId,
                  parentId: droppedId,
                });
              } else if (droppedType === "bookmark" && draggedId && droppedId) {
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
        } else if (e.oldIndex !== e.newIndex && draggedId) {
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
    <div className="GridContainer">
      <SettingsGear gearColor={gearColor} />
      {/* Render breadcrumbs if not in the root folder */}
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
        className={clsx(
          "Grid",
          !isRoot && "has-breadcrumbs",
          isMaxFontSize && "max-width",
        )}
        id="sortable"
        style={
          {
            "--grid-max-cols":
              settings.maxColumns === "Unlimited" ? "999" : settings.maxColumns,
          } as React.CSSProperties
        }
        ref={gridRef}
      >
        <Dials />
      </div>
    </div>
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
