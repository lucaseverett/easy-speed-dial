import { memo, Fragment } from "react";

import "./styles.css";
import { Box } from "./Box.jsx";
import { Title } from "./Title.jsx";
import { Grid } from "./Grid.jsx";
import { Link } from "./Link.jsx";
import { Breadcrumbs } from "./Breadcrumbs.jsx";
import { useBookmarks } from "useBookmarks";
import { useOptions } from "useOptions";

function Theme({ handleLinkContextMenu }) {
  const { bookmarks, currentFolder, changeFolder, isRoot, parentID } =
    useBookmarks();

  const { newTab, showTitle, switchTitle } = useOptions();

  return (
    <>
      {!isRoot && (
        <Breadcrumbs {...{ currentFolder, changeFolder, parentID }} />
      )}
      <Grid {...{ currentFolder, isRoot }}>
        {bookmarks.map(({ title, url, type, name, id }) => (
          <Fragment key={id}>
            <Link
              {...{
                url,
                type,
                id,
                title,
                changeFolder,
                currentFolder,
                newTab,
                handleLinkContextMenu,
              }}
            >
              <Box {...{ name, title, switchTitle, type }} />
              <Title
                {...{
                  showTitle,
                  title: switchTitle && url ? name.join(".") : title,
                }}
              />
            </Link>
          </Fragment>
        ))}
      </Grid>
    </>
  );
}

Theme = memo(Theme);

export { Theme };
