import { memo } from "react";

export const Breadcrumbs = memo(function Breadcrumbs({
  currentFolder,
  changeFolder,
  parentId,
}) {
  return (
    <div className="Breadcrumbs">
      <button
        title="Go to parent folder"
        onClick={() =>
          changeFolder({
            id: parentId,
            pushState: true,
            replaceState: false,
            saveSession: true,
          })
        }
        onContextMenu={(e) => e.stopPropagation()}
      >
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
        <span>{currentFolder.title}</span>
      </button>
    </div>
  );
});
