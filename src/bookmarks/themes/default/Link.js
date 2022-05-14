import { css } from "@emotion/css";

const styles = css`
  text-decoration: none;
  cursor: pointer;
  outline: none;

  .attach-title & {
    box-shadow: 0 3px 3px rgb(0, 0, 0, 0.2);
    border-radius: 6px;

    &.focus-visible {
      box-shadow: 0 3px 3px rgb(0, 0, 0, 0.2);
      outline: 5px solid #90caf9;
      outline-offset: -5px;
    }
  }
`;

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
      className={styles}
      target={newTab ? "_blank" : "_self"}
      onContextMenu={(e) => handleLinkContextMenu(e, { id, url })}
    >
      {children}
    </a>
  );

  const FolderLink = ({ children, id, title, changeFolder }) => {
    let handleClick = (e) => {
      e.preventDefault();
      changeFolder({ id, title });
    };

    return (
      <a
        data-id={id}
        tabIndex="0"
        className={styles}
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
