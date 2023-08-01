import { memo } from "react";

import { ContextMenu } from "../../useContextMenu.jsx";

export const Link = memo(function Link({
  url,
  type,
  children,
  id,
  title,
  changeFolder,
  currentFolder,
  newTab,
}) {
  function FileLink({ url, children, newTab }) {
    return (
      <ContextMenu>
        <a
          href={url}
          data-id={id}
          data-title={title}
          rel="noopener noreferrer"
          className="Link"
          target={newTab ? "_blank" : "_self"}
        >
          {children}
        </a>
      </ContextMenu>
    );
  }

  function FolderLink({ children, id, title, changeFolder }) {
    function handleClick(e) {
      e.preventDefault();
      changeFolder({
        id,
        pushState: true,
        replaceState: false,
        saveSession: true,
      });
    }

    return (
      <ContextMenu>
        <button
          data-id={id}
          data-title={title}
          tabIndex="0"
          className="Link"
          onClick={handleClick}
        >
          {children}
        </button>
      </ContextMenu>
    );
  }

  return type === "link" ? (
    <FileLink {...{ id, url, children, title, currentFolder, newTab }} />
  ) : (
    <FolderLink {...{ children, id, title, changeFolder, currentFolder }} />
  );
});
