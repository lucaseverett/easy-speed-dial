import React from "react";
import { css } from "emotion";
import { Name } from "./Name.js";
import { dialColors } from "./dialColors.js";

export const Box = ({ name, title, switchTitle, type }) => {
  const styles = css`
    border-radius: 6px;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 8px;
    color: #fff;

    font-weight: 500;
    .windows & {
      font-weight: bold;
    }
    overflow: hidden;
    background-color: ${dialColors(name)};
    & .material-icons {
      text-align: center;
      font-size: 80px;
    }
    a.focus-visible & {
      box-shadow: 0 4px 3px rgb(0, 0, 0, 0.3), inset 0 0 0 5px #90caf9;
    }
    box-shadow: 0 4px 3px rgb(0, 0, 0, 0.3);
    text-shadow: ${type !== "folder" ? "2px 1px 0 rgb(33,33,33,0.7)" : "none"};
  `;

  return (
    <div className={styles}>
      {type.match(/(file|link)/) ? (
        <Name {...{ name: switchTitle ? [title] : name, type }} />
      ) : (
        <i className="material-icons material-icons-outlined">folder</i>
      )}
    </div>
  );
};
