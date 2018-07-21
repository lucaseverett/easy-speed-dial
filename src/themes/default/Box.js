import { h } from "preact";
import styled, { css } from "preact-emotion";
import randomMC from "random-material-color";
import Name from "./Name.js";

let Box = styled.div(
  {
    borderRadius: "6px",
    height: "130px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0",
    margin: "8px",
    color: "#fff",
    fontWeight: "bold",
    overflow: "hidden",
    "& .fa-folder": {
      textAlign: "center",
      fontSize: "70px"
    },
    "a:focus:active &": {
      border: "none"
    },
    "a:focus &": {
      border: "5px solid #01579B"
    }
  },
  ({ backgroundColor, theme }) => ({
    backgroundColor,
    boxShadow:
      theme === "DefaultLight" ? "0 6px 8px #9e9e9e" : "0 6px 8px #1C1C1C"
  })
);

export default ({ name, theme, type }) => {
  let backgroundColor = randomMC.getColor({
    shades: ["700"],
    text: name.join(".")
  });

  return type.match(/(file|link)/) ? (
    <Box {...{ backgroundColor, theme }}>
      <Name {...{ name, type }} />
    </Box>
  ) : (
    <Box {...{ backgroundColor, theme }}>
      <i class="far fa-folder" />
    </Box>
  );
};
