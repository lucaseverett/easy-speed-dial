import { memo, Fragment } from "react";

import "./styles.css";
import { Box } from "./Box.jsx";
import { Title } from "./Title.jsx";
import { Grid } from "./Grid.jsx";
import { Link } from "./Link.jsx";
import { Breadcrumbs } from "./Breadcrumbs.jsx";
import { useBookmarks } from "useBookmarks";
import { useOptions } from "useOptions";

export const Theme = memo(function Theme() {
  const { bookmarks, currentFolder, changeFolder, isRoot, parentId } =
    useBookmarks();

  const { newTab, showTitle, switchTitle } = useOptions();

  return (
    <>
      {!isRoot && (
        <Breadcrumbs {...{ currentFolder, changeFolder, parentId }} />
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
              }}
            >
              <Box {...{ name, title, switchTitle, type }} />
              <Title
                {...{
                  showTitle,
                  title: switchTitle || !title ? name.join(".") : title,
                }}
              />
            </Link>
          </Fragment>
        ))}
      </Grid>
    </>
  );
});
