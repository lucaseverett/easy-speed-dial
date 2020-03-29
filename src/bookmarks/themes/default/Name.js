import React from "react";
import { css } from "emotion";

let shorten = name => {
  return name.length > 24 ? `${name.substr(0, 22)}..` : name;
};

export const Name = ({ name, type }) => {
  const styles = css`
    margin: 0 auto;
  `;

  const Small = ({ children, align }) => (
    <div
      className={css`
        font-size: 12px;
        line-height: 12px;
        font-weight: normal;
        white-space: nowrap;
        max-width: 190px;
        text-align: ${align};
      `}
    >
      {children}
    </div>
  );

  const Domain = ({ children, padding = false }) => (
    <div
      className={css`
        line-height: 16px;
        padding-bottom: 3px;
        white-space: nowrap;
        max-width: 190px;
        font-size: ${children.length < 14
          ? "24px"
          : children.length > 12 &&
            children.length < 25 &&
            ((24 - children.length) / 10) * 23 > 13
          ? `${((24 - children.length) / 10) * 23}px`
          : "14px"};
        padding-top: ${padding ? "13px" : "0"};
      `}
    >
      {children}
    </div>
  );

  if (type === "file" || name.length === 1) {
    name = <Domain>{shorten(name.join("."))}</Domain>;
  } else if (name.length === 3 && name[0].length < name[1].length) {
    name = name.map((n, i) => {
      if (i === 0) {
        return (
          <Small align="left" key={n}>
            {n}
          </Small>
        );
      } else if (i + 1 === name.length) {
        return (
          <Small align="right" key={n}>
            {n}
          </Small>
        );
      }
      return <Domain key={n}>{shorten(n)}</Domain>;
    });
  } else if (name.length === 2) {
    name = name.map((n, i) => {
      if (i === 0) {
        return (
          <Domain padding={true} key={n}>
            {shorten(n)}
          </Domain>
        );
      }
      return (
        <Small align="right" key={n}>
          {n}
        </Small>
      );
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

  return <div className={styles}>{name}</div>;
};
