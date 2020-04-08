import React, { useEffect } from "react";
import { css } from "emotion";
import Sortable from "sortablejs";
import { useBookmarks } from "../../../hooks/useBookmarks.js";

export const Grid = ({ children, isRoot }) => {
  const { moveBookmark } = useBookmarks();

  useEffect(() => {
    const sortable = Sortable.create(document.getElementById("sortable"), {
      animation: 150,
      delay: 100,
      delayOnTouchOnly: true,
      easing: "cubic-bezier(0.11, 0, 0.5, 0)",
      invertSwap: true,
      revertOnSpill: true,
      onSort(e) {
        moveBookmark({
          bookmarkID: e.item.dataset.id,
          oldIndex: e.oldIndex,
          newIndex: e.newIndex,
        });
      },
    });
  }, []);

  const style = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, 210px);
    grid-gap: 25px;
    justify-content: center;
    margin: ${isRoot ? "70px" : "0 70px 70px"};
    .normal-width & {
      @media only screen and (min-width: 1740px) {
        grid-template-columns: repeat(7, 210px);
      }
    }
    .sortable-ghost {
      visibility: hidden;
    }
  `;

  return (
    <div className={style} id="sortable">
      {children}
    </div>
  );
};
