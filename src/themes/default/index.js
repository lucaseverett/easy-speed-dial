import { h } from "preact";
import Box from "./Box.js";
import Title from "./Title.js";
import Grid from "./Grid.js";
import Link from "./Link.js";
import Theme from "./Theme.js";
import styled from "preact-emotion";
import Breadcrumbs from "./Breadcrumbs.js";

let Bookmark = styled.div({});

export default ({
  bookmarks,
  currentFolder,
  path,
  theme,
  isRoot,
  changeFolder
}) => (
  <Theme {...{ theme }}>
    {!isRoot && (
      <Breadcrumbs {...{ theme, path, currentFolder, changeFolder }} />
    )}
    <Grid {...{ currentFolder, isRoot }}>
      {bookmarks.map(({ title, url, type, name, id }) => (
        <Bookmark>
          <Link
            {...{
              url,
              type,
              id,
              title,
              changeFolder,
              currentFolder,
              isRoot
            }}
          >
            <Box {...{ name, type, theme }} />
            <Title {...{ title, theme }} />
          </Link>
        </Bookmark>
      ))}
    </Grid>
  </Theme>
);
