import React, { Fragment } from "react";
import { Box } from "./Box.js";
import { Title } from "./Title.js";
import { Grid } from "./Grid.js";
import { Link } from "./Link.js";
import { Breadcrumbs } from "./Breadcrumbs.js";
import { css } from "emotion";

export const Theme = ({
  bookmarks,
  currentFolder,
  path,
  isRoot,
  changeFolder,
  newTab
}) => (
  <div
    className={css`
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    `}
  >
    {!isRoot && <Breadcrumbs {...{ path, currentFolder, changeFolder }} />}
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
              newTab
            }}
          >
            <Box {...{ name, type }} />
            <Title {...{ title }} />
          </Link>
        </Fragment>
      ))}
    </Grid>
  </div>
);
