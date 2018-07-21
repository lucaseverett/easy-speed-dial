import { h } from "preact";
import styled from "preact-emotion";

let Title = styled.div(
  {
    padding: "2px 18px",
    textAlign: "center",
    fontSize: "12px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  ({ theme }) => ({
    color: theme === "DefaultLight" ? "#000" : "#fff"
  })
);

export default ({ title, theme }) => <Title {...{ theme }}>{title}</Title>;
