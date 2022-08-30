import { useLayoutEffect, useRef, useState } from "react";
import { css } from "@emotion/css";

export const Name = ({ name, type }) => {
  const Small = ({ children, align }) => (
    <div
      className={css`
        font-size: 13px;
        font-weight: normal;
        max-width: 180px;
        text-align: ${align};
        margin: 0 auto;
      `}
    >
      {children}
    </div>
  );

  const Domain = ({ children, padding = false, title = false }) => {
    const [scale, setScale] = useState();
    const domainRef = useRef(null);
    useLayoutEffect(() => {
      const domainWidth = domainRef.current.offsetWidth;
      const domainHeight = domainRef.current.offsetHeight;
      if (domainHeight > "120") {
        setScale(120 / domainHeight);
      } else if (domainWidth > "180") {
        setScale(180 / domainWidth);
      }
    }, []);
    return (
      <div
        ref={domainRef}
        className={css`
          line-height: ${title ? "26px" : "16px"};
          white-space: ${title ? "initial" : "nowrap"};
          padding: ${title ? "0" : padding ? "18px 0 3px" : "3px 0"};
          font-size: 24px;
          transform: ${scale ? `scale(${scale})` : "initial"};
          text-align: center;
        `}
      >
        {children}
      </div>
    );
  };

  if (type === "file" || name.length === 1) {
    name = <Domain {...{ title: true }}>{name.join(".")}</Domain>;
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
      return <Domain key={n}>{n}</Domain>;
    });
  } else if (name.length === 2) {
    name = name.map((n, i) => {
      if (i === 0) {
        return (
          <Domain padding={true} key={n}>
            {n}
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
      <>
        <Domain padding={true}>{name[0]}</Domain>
        <Small align="right">
          {name
            .slice(1)
            .map((n) => n)
            .join(".")}
        </Small>
      </>
    );
  } else {
    name = (
      <>
        <Small align="left">{name[0]}</Small>
        <Domain>{name[1]}</Domain>
        <Small align="right">
          {name
            .slice(2)
            .map((n) => n)
            .join(".")}
        </Small>
      </>
    );
  }

  return <div>{name}</div>;
};
