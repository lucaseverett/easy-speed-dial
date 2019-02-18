import React from "react";
import { css } from "emotion";

let style = css({
  textDecoration: "none",
  cursor: "pointer",
  outline: "none"
});

let FileLink = ({ url, title, children, isRoot }) => (
  <a
    href={url}
    rel="noreferrer"
    class={style}
    title={title}
    target={isRoot ? "_self" : "_blank"}
  >
    {children}
  </a>
);

let FolderLink = ({ children, id, title, currentFolder, changeFolder }) => {
  let handleClick = e => {
    e.preventDefault();
    changeFolder({
      currentFolder,
      nextFolder: { id, title }
    });
  };

  return (
    <a href={id} class={style} title={`${title} Folder`} onClick={handleClick}>
      {children}
    </a>
  );
};

export default ({
  url,
  type,
  children,
  id,
  title,
  changeFolder,
  currentFolder,
  isRoot
}) =>
  type.match(/(file|link)/) ? (
    <FileLink {...{ url, children, title, isRoot, currentFolder }} />
  ) : (
    <FolderLink {...{ children, id, title, changeFolder, currentFolder }} />
  );
