import { Name } from "./Name.jsx";
import { dialColors } from "./dialColors.js";

export const Box = ({ name, title, switchTitle, type }) => {
  return (
    <div
      className="Box"
      style={{
        "--dial-background-color": dialColors(name),
        "--dial-text-shadow":
          type !== "folder" ? "2px 1px 0 rgb(33,33,33,0.7)" : "none",
      }}
    >
      {type.match(/(file|link)/) ? (
        <Name {...{ name: switchTitle ? [title] : name, type }} />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="folder"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
        </svg>
      )}
    </div>
  );
};
