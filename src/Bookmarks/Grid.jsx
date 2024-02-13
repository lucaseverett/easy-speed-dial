import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Sortable from "sortablejs";

import "./styles.css";

import { bookmarks } from "#stores/useBookmarks";
import { settings } from "#stores/useSettings";
import { Dial } from "./Dial";

export const Grid = observer(function Grid() {
  // Display breadcrumbs if not in root folder.
  const isRoot =
    (settings.defaultFolder !== undefined &&
      bookmarks.currentFolder.id === settings.defaultFolder) ||
    !bookmarks.parentId;

  useEffect(() => {
    Sortable.create(document.querySelector("#sortable"), {
      animation: 150,
      delay: 100,
      delayOnTouchOnly: true,
      easing: "cubic-bezier(0.11, 0, 0.5, 0)",
      invertSwap: true,
      revertOnSpill: true,
      onSort(e) {
        bookmarks.moveBookmark({
          id: e.item.dataset.id,
          from: e.oldIndex,
          to: e.newIndex,
        });
      },
    });
  }, []);

  return (
    <>
      {!isRoot && (
        <div className="Breadcrumbs">
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
        })}
        id="sortable"
        style={{
          "--grid-max-cols": settings.maxColumns,
        }}
      >
        <Dials />
      </div>
    </>
  );
});

const Dials = observer(function Dials() {
  return bookmarks.bookmarks.map(({ id, name, title, type, url }) => (
    <Dial
      {...{
        id,
        name,
        title,
        type,
        url,
      }}
      key={id}
    />
  ));
});
