import React from "react";
import styled from "@emotion/styled";

let Nav = styled.div(
  {
    fontSize: "20px",
    lineHeight: "62px",
    paddingTop: "8px",
    textAlign: "center",
    cursor: "default"
  },
  ({ theme }) => ({
    "span, & a, & a:active": {
      color: theme === "DefaultLight" ? "#000" : "#fff"
    },
    "& a:focus": { color: "#01579B", outline: "none" },
    "& a": {
      textDecoration: "underline",
      cursor: "pointer"
    }
  })
);

export default ({ theme, path, currentFolder, changeFolder }) => {
  let handleClick = (e, folder) => {
    e.preventDefault();
    changeFolder(folder);
  };
  return (
    <Nav {...{ theme }}>
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
          >
            {title}
          </a>
          {index === path.length - 1 && ` / ${currentFolder.title}`}
        </span>
      ))}
    </Nav>
  );
};
