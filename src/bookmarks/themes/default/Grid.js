import React from "react";
import { css } from "emotion";

export const Grid = ({ children, isRoot }) => {
  const style = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, 210px);
    grid-gap: 25px;
    justify-content: center;
    padding: ${isRoot ? "70px" : "0 70px 70px"};
    .normal-width & {
      @media only screen and (min-width: 1740px) {
        grid-template-columns: repeat(7, 210px);
      }
    }
  `;

  return <div className={style}>{children}</div>;
};
