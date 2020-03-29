import React from "react";
import { css } from "emotion";
import randomMC from "random-material-color";
import { Name } from "./Name.js";

export const Box = ({ name, type }) => {
  const style = css`
    border-radius: 6px;
    height: 130px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;
    margin: 8px;
    color: #fff;
    font-weight: bold;
    overflow: hidden;
    background-color: ${randomMC.getColor({
      shades: ["700"],
      text: name.join(".")
    })};
    & .fa-folder {
      text-align: center;
      font-size: 70px;
    }
    a:focus:active & {
      border: none;
    }
    a:focus & {
      border: 5px solid #01579b;
    }
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    text-shadow: ${type !== "folder" ? "0 0 2px #212121" : "none"};
  `;

  return (
    <div className={style}>
      {type.match(/(file|link)/) ? (
        <Name {...{ name, type }} />
      ) : (
        <i className="far fa-folder" />
      )}
    </div>
  );
};
