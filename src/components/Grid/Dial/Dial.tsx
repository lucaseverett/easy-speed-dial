import { observer } from "mobx-react-lite";
import { addOpacity, relativeLuminance } from "random-color-library";
import { useEffect, useState } from "react";

import { DialFolder } from "#components/icons/DialFolder.tsx";
import { Folder } from "#components/icons/Folder.tsx";
import { Globe } from "#components/icons/Globe.tsx";
import { dialColors } from "#lib/dialColors";
import { getSitePresetByUrl, getSitePresetColor } from "#lib/sitePresets";
import { contextMenu } from "#stores/contextMenu";
import { favicons } from "#stores/favicons";
import { settings } from "#stores/settings";
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
  type: "bookmark" | "folder";
  url?: string;
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
            <DialFolder
              topOpacity={folderTopOpacity}
              bottomOpacity={folderBottomOpacity}
              style={{ color: folderColor }}
            />
          ))}
      </div>
      <Title
        {...{
          title: props.title,
          name: props.name,
          type: props.type,
          url: props.url,
        }}
      />
    </a>
  );
});

const Title = observer(function Title(props: TitleProps) {
  if (!settings.showTitle) return;

  const showFavicon = settings.showFavicons;

  return (
    <div className="Title">
      <div className="title">
        {showFavicon &&
          (props.type === "bookmark" ? (
            <BookmarkFavicon key={props.url} url={props.url} />
          ) : (
            <Folder />
          ))}
        <div>{props.title || props.name.join(".")}</div>
      </div>
    </div>
  );
});

// Resolves and renders a bookmark's browser favicon. Each dial requests its own
// favicon on mount, so lookups are scoped to the dials actually rendered and
// stay bounded by the favicon store's concurrency queue. Falls back to the
// Globe icon while unresolved, when the site has no favicon, or on image error.
const BookmarkFavicon = observer(function BookmarkFavicon({
  url,
}: {
  url?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (url) favicons.request(url);
  }, [url]);

  const src = favicons.getFavicon(url);
  if (!src || failed) return <Globe />;

  return (
    <img className="favicon" src={src} alt="" onError={() => setFailed(true)} />
  );
});
