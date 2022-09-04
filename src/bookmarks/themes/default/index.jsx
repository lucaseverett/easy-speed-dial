import { memo, Fragment } from "react";

import "./styles.css";
import { Box } from "./Box.jsx";
import { Title } from "./Title.jsx";
import { Grid } from "./Grid.jsx";
import { Link } from "./Link.jsx";
import { Breadcrumbs } from "./Breadcrumbs.jsx";

function Theme({
  bookmarks,
  currentFolder,
  isRoot,
  changeFolder,
  newTab,
  handleLinkContextMenu,
  showTitle,
  switchTitle,
}) {
  return (
    <>
      {!isRoot && <Breadcrumbs {...{ currentFolder, changeFolder }} />}
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
