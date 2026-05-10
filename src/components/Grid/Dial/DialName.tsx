import { useLayoutEffect, useRef, useState } from "react";

interface DialNameProps {
  name: string[];
}

interface SmallProps {
  align: string;
  children: React.ReactNode;
}

interface DomainProps {
  title?: boolean;
  padding?: boolean;
  children: React.ReactNode;
}

export function DialName(props: DialNameProps) {
  return props.name.length === 1 ? (
    <Domain title={true}>{props.name.join(".")}</Domain>
  ) : props.name.length === 3 && props.name[0].length < props.name[1].length ? (
    <>
      <Small align="left" key={props.name[0]}>
        {props.name[0]}
      </Small>
      <Domain key={props.name[1]}>{props.name[1]}</Domain>
      <Small align="right" key={props.name[2]}>
        {props.name[2]}
      </Small>
    </>
  ) : props.name.length === 2 ? (
    <>
      <Domain padding={true} key={props.name[0]}>
        {props.name[0]}
      </Domain>
      <Small align="right" key={props.name[1]}>
        {props.name[1]}
      </Small>
    </>
  ) : props.name[0].length > props.name[1].length ||
    props.name[0].length === props.name[1].length ? (
    <>
      <Domain padding={true}>{props.name[0]}</Domain>
      <Small align="right">{props.name.slice(1).join(".")}</Small>
    </>
  ) : (
    <>
      <Small align="left">{props.name[0]}</Small>
      <Domain>{props.name[1]}</Domain>
      <Small align="right">{props.name.slice(2).join(".")}</Small>
    </>
  );
}

function Small(props: SmallProps) {
  return (
    <div
      className="Small"
      style={
        {
          "--name-align": props.align,
        } as React.CSSProperties
      }
    >
      <div>{props.children}</div>
    </div>
  );
}

function Domain(props: DomainProps) {
  const [scale, setScale] = useState<number | null>(null);
  const domainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const domainElement = domainRef.current;
    if (!domainElement) return;
    const boxElement = domainElement.closest(".Box") as HTMLElement;
    if (!boxElement) return;

    const calculateScale = () => {
      const domainWidth = domainElement.offsetWidth;
      const domainHeight = domainElement.offsetHeight;
      const boxWidth = boxElement.offsetWidth;
      const boxHeight = boxElement.offsetHeight;

      // Scale relative to Box size.
      const maxWidth = boxWidth * 0.92;
      const maxHeight = boxHeight * 0.92;

      let newScale = null;
      if (domainHeight > maxHeight) {
        newScale = maxHeight / domainHeight;
      } else if (domainWidth > maxWidth) {
        newScale = maxWidth / domainWidth;
      }

      setScale(newScale);
    };

    const resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });

    resizeObserver.observe(domainElement);
    resizeObserver.observe(boxElement);
    calculateScale();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={domainRef}
      className="Domain"
      style={
        {
          "--name-white-space": props.title ? "initial" : "nowrap",
          "--name-padding": props.title
            ? "0"
            : props.padding
              ? "1em 0 0"
              : "0 0",
          "--name-transform": scale ? `scale(${scale})` : "initial",
        } as React.CSSProperties
      }
    >
      <div>{props.children}</div>
    </div>
  );
}
