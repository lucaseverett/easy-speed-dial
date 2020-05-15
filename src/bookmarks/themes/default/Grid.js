import React, { useEffect } from "react";
import { css } from "emotion";
import Sortable from "sortablejs";
import { useBookmarks } from "../../../hooks/useBookmarks.js";
import { useOptions } from "../../../hooks/useOptions.js";

export const Grid = ({ children, isRoot }) => {
  const { moveBookmark } = useBookmarks();
  const { maxColumns } = useOptions();

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
          id: e.item.dataset.id,
          from: e.oldIndex,
          to: e.newIndex,
        });
      },
    });
  }, []);

  const styles = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, 210px);
    max-width: ${maxColumns === "Unlimited"
      ? "100%"
      : `${Number(maxColumns) * 210 + (Number(maxColumns) - 1) * 25 + 140}px`};
    row-gap: 19px;
    column-gap: 25px;
    justify-content: center;
    margin: ${isRoot ? "70px auto" : "0 auto 70px"};
    padding: 0 70px;
    .sortable-ghost {
      visibility: hidden;
    }
  `;

  return (
    <div className={styles} id="sortable">
      {children}
    </div>
  );
};
