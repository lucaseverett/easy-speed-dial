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
  rootFolder,
  changeFolder
}) => (
  <Theme {...{ theme }}>
    {currentFolder.id !== rootFolder && (
      <Breadcrumbs {...{ theme, path, currentFolder, changeFolder }} />
    )}
    <Grid {...{ currentFolder, rootFolder }}>
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
              rootFolder
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
