import { css } from "@emotion/css";
import { Name } from "./Name.js";
import { dialColors } from "./dialColors.js";

export const Box = ({ name, title, switchTitle, type }) => {
  const styles = css`
    border-radius: 6px;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
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
    .normal-title a.focus-visible & {
      outline: 5px solid #90caf9;
      outline-offset: -5px;
    }
    text-shadow: ${type !== "folder" ? "2px 1px 0 rgb(33,33,33,0.7)" : "none"};

    .normal-title & {
      box-shadow: 0 3px 3px rgb(0, 0, 0, 0.2);
    }

    .attach-title.show-title & {
      border-radius: 6px 6px 0 0;
    }
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
