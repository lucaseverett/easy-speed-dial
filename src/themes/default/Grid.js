import React from "react";
import styled from "@emotion/styled";

export default styled.div(
  {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 210px)",
    gridGap: "25px",
    justifyContent: "center",
    "@media only screen and (min-width: 1740px)": {
      gridTemplateColumns: "repeat(7, 210px)"
    }
  },
  ({ isRoot }) => ({
    padding: isRoot ? "70px" : "0 70px 70px"
  })
);
