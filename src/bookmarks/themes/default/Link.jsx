export const Link = ({
  url,
  type,
  children,
  id,
  title,
  changeFolder,
  currentFolder,
  newTab,
  handleLinkContextMenu,
}) => {
  const FileLink = ({ url, children, newTab }) => (
    <a
      href={url}
      data-id={id}
      rel="noopener noreferrer"
      className="Link"
      target={newTab ? "_blank" : "_self"}
      onContextMenu={(e) => handleLinkContextMenu(e, { id, url })}
    >
      {children}
    </a>
  );

  const FolderLink = ({ children, id, title, changeFolder }) => {
    let handleClick = (e) => {
      e.preventDefault();
      changeFolder({
        id,
        pushState: true,
        replaceState: false,
        saveSession: true,
      });
    };

    return (
      <a
        data-id={id}
        tabIndex="0"
        className="Link"
        onClick={handleClick}
        onContextMenu={(e) => handleLinkContextMenu(e, { id })}
      >
        {children}
      </a>
    );
  };

  return type.match(/(file|link)/) ? (
    <FileLink {...{ id, url, children, title, currentFolder, newTab }} />
  ) : (
    <FolderLink {...{ children, id, title, changeFolder, currentFolder }} />
  );
};
