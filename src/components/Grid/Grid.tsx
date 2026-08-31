import { clsx } from "clsx/lite";
import { observer } from "mobx-react-lite";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

import "./styles.css";

import { runInAction } from "mobx";
import { contrastRatio } from "random-color-library";

import { getImageAverageColor } from "#lib/imageLuminance";
import { bookmarks } from "#stores/bookmarks";
import { search } from "#stores/search";
import { settings } from "#stores/settings";
import { Dial } from "./Dial/Dial";
import { SearchBar } from "./SearchBar";
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
  const dialSize = settings.dialSize;
  const gridSpacing = settings.gridSpacing;
  const maxColumns = settings.maxColumns;
  const squareDials = settings.squareDials;
  const wallpaper = settings.wallpaper;
  const customColor = settings.customColor;
  const customImage = settings.customImage;
  const dragAndDrop = settings.dragAndDrop;
  const showSearchBar = settings.showSearchBar;
  const searching = search.isShowingResults;

  const isRoot =
    (settings.defaultFolder !== undefined &&
      bookmarks.currentFolder.id === settings.defaultFolder) ||
    !bookmarks.parentId;

  // Firefox scale-mode workaround: remove max-width at the 1.6em cap.
  useLayoutEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const checkFontSize = () => {
      const computedStyle = window.getComputedStyle(gridElement);
      const fontSize = parseFloat(computedStyle.fontSize);

      setIsMaxFontSize(fontSize === 25.6);
    };

    checkFontSize();
    window.addEventListener("resize", checkFontSize);

    return () => {
      window.removeEventListener("resize", checkFontSize);
    };
  }, [dialSize, gridSpacing, maxColumns, squareDials]);

  useEffect(() => {
    if (wallpaper !== "custom-image" && wallpaper !== "custom-color") {
      setGearColor(null);
      return;
    }

    const updateGearColor = async () => {
      const rootElement = document.documentElement;
      const computedStyle = window.getComputedStyle(rootElement);
      const bgColor = computedStyle.backgroundColor;

      // Custom images expose an rgba background; custom colors expose rgb.
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
  }, [wallpaper, customColor, customImage]);

  useEffect(() => {
    if (!dragAndDrop || searching || !gridRef.current) return;

    function isInDragZone(x: number, width: number) {
      const zoneWidth = width * dropZonePercent;
      const start = (width - zoneWidth) / 2;
      const end = start + zoneWidth;
      return x >= start && x <= end;
    }

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

        item._hoverCleanup = () => {
          item.removeEventListener("dragover", handleDragOver);
          item.removeEventListener("dragleave", handleDragLeave);
        };
      });
    };

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
      filter: "[data-type='separator']",
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
                  const newFolder = await bookmarks.createBookmark({
                    title: "New Folder",
                    parentId: bookmarks.currentFolder.id,
                  });
                  const newFolderId = newFolder.id;
                  bookmarks.moveBookmark({
                    id: newFolderId,
                    // Use display position because browser indices may be sparse.
                    from: bookmarks.bookmarks.length - 1,
                    to: bookmarks.bookmarks.findIndex(
                      (b) => b.id === droppedId,
                    ),
                  });
                  bookmarks.moveBookmark({
                    id: draggedId,
                    parentId: newFolderId,
                  });
                  bookmarks.moveBookmark({
                    id: droppedId,
                    parentId: newFolderId,
                  });
                });
              }
            }
          }
        } else if (e.oldIndex !== e.newIndex && draggedId) {
          bookmarks.moveBookmark({
            id: draggedId,
            from: e.oldIndex,
            to: e.newIndex,
          });
        }
      },
    });

    return () => {
      sortable.destroy();
    };
  }, [dragAndDrop, searching]);

  return (
    <div
      className="GridContainer"
      style={
        gearColor
          ? ({ "--wallpaper-gear-color": gearColor } as React.CSSProperties)
          : undefined
      }
    >
      <SettingsGear />
      {showSearchBar && <SearchBar />}
      {!isRoot && !searching && (
        <div className="Breadcrumbs" ref={breadcrumbsRef}>
          <a href={`#${bookmarks.parentId}`} title="Go to parent folder">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="chevron-left"
              aria-hidden="true"
              focusable="false"
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
          // Preserve search-bar spacing when breadcrumbs are hidden.
          !isRoot && !searching && "has-breadcrumbs",
          isMaxFontSize && "max-width",
        )}
        id="sortable"
        style={
          {
            "--grid-max-cols": maxColumns === "Unlimited" ? "999" : maxColumns,
          } as React.CSSProperties
        }
        ref={gridRef}
      >
        <Dials />
      </div>
      {searching && search.searched && search.results.length === 0 && (
        <div className="SearchEmpty">No bookmarks found</div>
      )}
    </div>
  );
});

const Dials = observer(function Dials() {
  const searching = search.isShowingResults;
  const source = searching ? search.results : bookmarks.bookmarks;
  return source.map(({ id, name, title, type, index, url }) => {
    if (type === "separator") {
      return (
        <hr
          aria-hidden="true"
          className="GridSeparator"
          data-id={id}
          data-type="separator"
          key={id}
        />
      );
    }

    return (
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
    );
  });
});
