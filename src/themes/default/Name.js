import { h } from "preact";
import styled from "preact-emotion";

let Small = styled.div(
  {
    fontSize: "12px",
    lineHeight: "12px",
    fontWeight: "normal",
    whiteSpace: "nowrap",
    maxWidth: "190px"
  },
  ({ align }) => ({
    textAlign: align
  })
);

let Domain = styled.div(
  {
    lineHeight: "16px",
    paddingBottom: "3px",
    whiteSpace: "nowrap",
    maxWidth: "190px"
  },
  ({ children, padding = false }) => ({
    fontSize:
      children[0].length < 14
        ? "24px"
        : children[0].length > 12 &&
          children[0].length < 25 &&
          ((24 - children[0].length) / 10) * 23 > 13
          ? `${((24 - children[0].length) / 10) * 23}px`
          : "14px",
    paddingTop: padding ? "13px" : "0"
  })
);

let shorten = name => {
  return name.length > 24 ? `${name.substr(0, 22)}..` : name;
};

let Name = styled.div({
  margin: "0 auto"
});

export default ({ name, type }) => {
  if (type === "file") {
    name = <Domain>{shorten(name.join("."))}</Domain>;
  } else if (name.length === 3 && name[0].length < name[1].length) {
    name = name.map((n, i) => {
      if (i === 0) {
        return <Small align="left">{n}</Small>;
      } else if (i + 1 === name.length) {
        return <Small align="right">{n}</Small>;
      }
      return <Domain>{shorten(n)}</Domain>;
    });
  } else if (name.length === 2) {
    name = name.map((n, i) => {
      if (i === 0) {
        return <Domain padding={true}>{shorten(n)}</Domain>;
      }
      return <Small align="right">{n}</Small>;
    });
  } else if (
    name[0].length > name[1].length ||
    name[0].length === name[1].length
  ) {
    name = (
      <div>
        <Domain padding={true}>{shorten(name[0])}</Domain>
        <Small align="right">
          {name
            .slice(1)
            .map(n => n)
            .join(".")}
        </Small>
      </div>
    );
  } else {
    name = (
      <div>
        <Small align="left">{name[0]}</Small>
        <Domain>{shorten(name[1])}</Domain>
        <Small align="right">
          {name
            .slice(2)
            .map(n => n)
            .join(".")}
        </Small>
      </div>
    );
  }

  return <Name>{name}</Name>;
};
