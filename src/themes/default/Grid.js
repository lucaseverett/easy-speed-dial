import { h } from "preact";
import styled from "preact-emotion";

export default styled.div(
  {
    display: "grid",
    gridTemplateColumns: "repeat(1, 210px)",
    gridGap: "25px",
    justifyContent: "center",

    "@media only screen and (min-width: 565px)": {
      gridTemplateColumns: "repeat(2, 210px)"
    },
    "@media only screen and (min-width: 800px)": {
      gridTemplateColumns: "repeat(3, 210px)"
    },
    "@media only screen and (min-width: 1035px)": {
      gridTemplateColumns: "repeat(4, 210px)"
    },
    "@media only screen and (min-width: 1270px)": {
      gridTemplateColumns: "repeat(5, 210px)"
    },
    "@media only screen and (min-width: 1505px)": {
      gridTemplateColumns: "repeat(6, 210px)"
    },
    "@media only screen and (min-width: 1740px)": {
      gridTemplateColumns: "repeat(7, 210px)"
    }
  },
  ({ isRoot }) => ({
    padding: isRoot ? "70px 0" : "0 0 70px"
  })
);
