import React from "react";
import styled from "@emotion/styled";

export default styled.div(
  {
    font: "message-box",
    minHeight: "100vh"
  },
  ({ theme }) => ({
    backgroundColor: theme === "DefaultLight" ? "#f5f5f5" : "#212121"
  })
);
