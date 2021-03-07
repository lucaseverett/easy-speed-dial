import { css } from "@emotion/css";
import { wallpapers } from "./index.js";

export const wallpaperStyles = ({ wallpaper, customColor, customImage }) => {
  return css`
    min-height: 100vh;
    &.color-scheme-light {
      background-color: #f5f5f5;
    }
    &.color-scheme-dark {
      background-color: #212121;
    }
    &.light-wallpaper {
      background-color: #f5f5f5;
    }
    &.dark-wallpaper {
      background-color: #212121;
    }
    &.pink-wallpaper {
      background-color: #f8bbd0;
    }
    &.green-wallpaper {
      background-color: #b2dfdb;
    }
    &.blue-wallpaper {
      background-color: #bbdefb;
    }
    &.brown-wallpaper {
      background-color: #d7ccc8;
    }
    &.yellow-wallpaper {
      background-color: #ffe082;
    }
    &.custom-color {
      background-color: ${customColor};
    }
    background-image: url(${wallpaper === "custom-image"
      ? customImage
      : wallpapers
          .filter((w) => w.id === wallpaper)
          .map(({ filename }) => `https://media.toolbardial.com/${filename}`)});
    background-size: cover;
    background-position: ${/BlackSand|Crayons/.test(wallpaper)
      ? "bottom"
      : "center"};
    background-attachment: fixed;
  `;
};
