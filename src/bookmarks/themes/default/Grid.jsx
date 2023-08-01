import { memo, useEffect } from "react";
import Sortable from "sortablejs";

import { useBookmarks } from "useBookmarks";
import { useOptions } from "useOptions";

export const Grid = memo(function Grid({ children, isRoot }) {
  const { moveBookmark } = useBookmarks();
  const { maxColumns } = useOptions();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="Grid"
      id="sortable"
      style={{
        "--grid-max-width":
          maxColumns === "Unlimited"
            ? "100%"
            : `${
                Number(maxColumns) * 194 + (Number(maxColumns) - 1) * 41 + 140
              }px`,
        "--grid-margin": isRoot ? "70px auto" : "0 auto 70px",
      }}
    >
      {children}
    </div>
  );
});
