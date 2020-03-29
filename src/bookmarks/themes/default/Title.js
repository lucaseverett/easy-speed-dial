import React from "react";
import { css } from "emotion";

export const Title = ({ title }) => {
  const style = css`
    padding: 2px 18px 1px;
    text-align: center;
    font-size: 13px;
    font-weight: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    .light-appearance & {
      color: #000;
    }
    .medium-appearance & {
      color: #1b1b1b;
    }
    .dark-appearance & {
      color: #fff;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
    }
  `;

  return <div className={style}>{title}</div>;
};
