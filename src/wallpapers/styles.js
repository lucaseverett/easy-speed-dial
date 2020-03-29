import { css } from "emotion";
import { wallpapers } from "./index.js";

export const wallpaperStyles = wallpaper => css`
  min-height: 100vh;
  &.light-wallpaper {
    background-color: #f5f5f5;
  }
  &.dark-wallpaper {
    background-color: #212121;
  }
  background-image: url(${wallpapers
    .filter(w => w.id === wallpaper)
    .map(({ filename }) => filename)});
  background-size: cover;
  background-position: bottom;
  background-attachment: fixed;
`;
