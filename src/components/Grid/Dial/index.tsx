import { observer } from "mobx-react-lite";
import { addOpacity, relativeLuminance } from "random-color-library";

import { dialColors } from "#lib/dialColors";
import { getSitePresetByUrl, getSitePresetColor } from "#lib/sitePresets";
import { contextMenu } from "#stores/useContextMenu";
import { settings } from "#stores/useSettings";
import { DialName } from "./DialName";

import "./styles.css";

interface DialProps {
  id: string;
  title?: string;
  name: string[];
  type: "bookmark" | "folder";
  url?: string;
}

interface TitleProps {
  title?: string;
  name: string[];
}

export const Dial = observer(function Dial(props: DialProps) {
  const customDialColor = settings.dialColors[props.id];
  const customThumbnailImage = settings.dialImages[props.id];
  const preset =
    props.type === "bookmark" && props.url && settings.usePresetThumbnails
      ? getSitePresetByUrl(props.url)
      : null;
  const activeCustomDialColor =
    preset && !customThumbnailImage ? undefined : customDialColor;
  const dialColor =
    activeCustomDialColor ||
    (preset ? getSitePresetColor(preset) : undefined) ||
    dialColors(props.name);
  const backgroundColor = settings.transparentDials
    ? addOpacity(dialColor, 0.75)
    : dialColor;
  const presetThumbnailImage = preset?.image;
  const thumbnailImage = customThumbnailImage || presetThumbnailImage;
  const backgroundImage = thumbnailImage;
  const backgroundSize = customThumbnailImage
    ? settings.getDialImageSize(props.id)
    : "cover";
  const dialLuminance = relativeLuminance(dialColor);
  const isNearWhiteDial = dialLuminance > 0.84;
  const folderColor = isNearWhiteDial ? "var(--grey-400)" : undefined;
  const folderTopOpacity = isNearWhiteDial
    ? 0.72
    : dialLuminance > 0.5
      ? 0.5
      : 0.35;
  const folderBottomOpacity = isNearWhiteDial
    ? 0.95
    : dialLuminance > 0.5
      ? 0.82
      : 0.65;
  const accessibleName = props.title || props.name.join(".");

  return (
    <a
      href={props.type === "bookmark" ? props.url : `#${props.id}`}
      aria-label={accessibleName}
      data-id={props.id}
      data-title={props.title}
      data-type={props.type}
      data-thumbnail={customThumbnailImage ? "" : null}
      rel={props.type === "bookmark" ? "noreferrer" : undefined}
      className="Link"
      target={
        props.type === "bookmark" && settings.newTab ? "_blank" : undefined
      }
      onContextMenu={contextMenu.openContextMenu}
    >
      <div
        className="Box"
        style={{
          backgroundColor,
          backgroundImage: backgroundImage
            ? `url("${backgroundImage}")`
            : undefined,
          backgroundPosition: "center",
          backgroundSize,
          backgroundRepeat: "no-repeat",
          textShadow:
            props.type !== "folder" ? "2px 1px 0 rgb(33,33,33,0.7)" : "none",
        }}
      >
        {!backgroundImage &&
          (props.type === "bookmark" ? (
            <div>
              <DialName
                {...{
                  name: settings.switchTitle
                    ? props.title
                      ? [props.title]
                      : [props.name.join(".")]
                    : props.name,
                }}
              />
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="folder"
              aria-hidden="true"
              focusable="false"
              style={{ color: folderColor }}
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M10 4H4c-1.1 0-2 .9-2 2v2h20V8c0-1.1-.9-2-2-2h-8l-2-2z"
                opacity={folderTopOpacity}
              />
              <path
                d="M2 8h20v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8z"
                opacity={folderBottomOpacity}
              />
            </svg>
          ))}
      </div>
      <Title {...{ title: props.title, name: props.name }} />
    </a>
  );
});

const Title = observer(function Title(props: TitleProps) {
  if (!settings.showTitle) return;

  return (
    <div className="Title">
      <div className="title">
        <div>{props.title || props.name.join(".")}</div>
      </div>
    </div>
  );
});
