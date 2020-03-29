import React from "react";
import { css } from "emotion";

export const Breadcrumbs = ({ path, currentFolder, changeFolder }) => {
  const style = css`
    font-size: 20px;
    line-height: 62px;
    padding-top: 8px;
    text-align: center;
    cursor: default;
    .light-appearance & {
      span,
      a {
        color: #000;
      }
    }
    .medium-appearance & {
      span,
      a {
        color: #1b1b1b;
      }
    }
    .dark-appearance & {
      span,
      a {
        color: #fff;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
      }
    }
    a {
      text-decoration: underline;
      cursor: pointer;
      :focus {
        color: #01579b;
        outline: none;
      }
    }
  `;

  let handleClick = (e, folder) => {
    e.preventDefault();
    changeFolder(folder);
  };

  return (
    <div className={style}>
      {path.map(({ id, title }, index) => (
        <span key={id}>
          {index !== 0 && " / "}
          <a
            href={id}
            title={title}
            onClick={e =>
              handleClick(e, {
                nextFolder: { id, title }
              })
            }
            onContextMenu={e => e.stopPropagation()}
          >
            {title}
          </a>
          {index === path.length - 1 && ` / ${currentFolder.title}`}
        </span>
      ))}
    </div>
  );
};
