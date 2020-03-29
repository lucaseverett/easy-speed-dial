import React from "react";
import { css } from "emotion";

export const ContextMenu = ({ top, left }) => {
  return (
    <div
      className={css`
        position: absolute;
        top: ${top}px;
        left: ${left}px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        background-color: rgba(0, 0, 0, 0.65);
        & ul {
          list-style: none;
          padding: 5px 0;
          margin: 0;
        }
        & li {
          color: #fff;
          font-weight: bold;
          text-decoration: none;
          display: block;
          cursor: pointer;
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          a {
            text-decoration: none;
            color: #fff;
            padding: 10px;
            display: block;
          }
        }
      `}
    >
      <ul>
        <li>
          <a href="/dist/options.html" target="_blank">
            Change Wallpaper
          </a>
        </li>
      </ul>
    </div>
  );
};
