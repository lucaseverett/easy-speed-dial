import React, { Fragment } from "react";
import { Box } from "./Box.js";
import { Title } from "./Title.js";
import { Grid } from "./Grid.js";
import { Link } from "./Link.js";
import { Breadcrumbs } from "./Breadcrumbs.js";

export const Theme = ({
  bookmarks,
  currentFolder,
  path,
  isRoot,
  changeFolder,
  newTab,
  handleLinkContextMenu,
  switchTitle,
}) => (
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
              {...{ title: switchTitle && url ? name.join(".") : title }}
            />
          </Link>
        </Fragment>
      ))}
    </Grid>
  </>
);
