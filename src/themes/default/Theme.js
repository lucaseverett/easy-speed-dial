import { h } from "preact";
import styled from "preact-emotion";

export default styled.div(
  {
    font: "message-box",
    minHeight: "100vh"
  },
  ({ theme }) => ({
    backgroundColor: theme === "DefaultLight" ? "#f5f5f5" : "#212121"
  })
);
