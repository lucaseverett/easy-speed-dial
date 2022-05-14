import { useEffect } from "react";
import { css } from "@emotion/css";
import Sortable from "sortablejs";
import { useBookmarks } from "useBookmarks";
import { useOptions } from "useOptions";

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
    grid-template-columns: repeat(auto-fill, 194px);
    max-width: ${maxColumns === "Unlimited"
      ? "100%"
      : `${Number(maxColumns) * 194 + (Number(maxColumns) - 1) * 41 + 140}px`};
    row-gap: 27px;
    .attach-title & {
      row-gap: 40px;
    }
    column-gap: 41px;
    justify-content: center;
    margin: ${isRoot ? "70px auto" : "0 auto 70px"};
    padding: 8px 70px 0;
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
