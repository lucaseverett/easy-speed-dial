import React from "react";
import { css } from "emotion";

export const Link = ({
  url,
  type,
  children,
  id,
  title,
  changeFolder,
  currentFolder,
  newTab
}) => {
  const style = css`
    text-decoration: none;
    cursor: pointer;
    outline: none;
  `;

  const FileLink = ({ url, title, children, newTab }) => (
    <a
      href={url}
      rel="noopener noreferrer"
      className={style}
      title={title}
      target={newTab ? "_blank" : "_self"}
      onContextMenu={e => e.stopPropagation()}
    >
      {children}
    </a>
  );

  const FolderLink = ({ children, id, title, currentFolder, changeFolder }) => {
    let handleClick = e => {
      e.preventDefault();
      changeFolder({
        currentFolder,
        nextFolder: { id, title }
      });
    };

    return (
      <a
        href={id}
        className={style}
        title={`${title} Folder`}
        onClick={handleClick}
        onContextMenu={e => e.stopPropagation()}
      >
        {children}
      </a>
    );
  };

  return type.match(/(file|link)/) ? (
    <FileLink {...{ url, children, title, currentFolder, newTab }} />
  ) : (
    <FolderLink {...{ children, id, title, changeFolder, currentFolder }} />
  );
};
