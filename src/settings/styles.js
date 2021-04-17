import { css } from "@emotion/css";
import { settingsScrollbarStyles } from "../styles/scrollbars.js";
import { defaultBtn } from "../styles/buttons.js";
import { select } from "../styles/inputs.js";

const switchWidth = 50;
const switchPadding = 3;
const switchHeight = switchWidth / 2 + switchPadding;
const switchRadius = switchHeight / 2;
const circleSize = switchHeight - switchPadding * 2;

export const styles = css`
  .color-scheme-light & {
    --options-background-color: #bdbdbd;
    --options-text-color: #000;
    --options-box-shadow: 0 0 0 5px #bdbdbd, 0 0 0 6px #9e9e9e,
      0 0 15px rgb(33, 33, 33, 0.5), 8px 8px 20px rgb(33, 33, 33, 0.5);
    --header-background-color: #bdbdbd;
    --main-background-color: #e0e0e0;
    --main-border-color: #9e9e9e;
    --btn-active-background-color: #bcbcbc;
    --wallpaper-button-box-shadow-color: #9e9e9e;
    --setting-wrapper-background-color: #eee;
    --setting-wrapper-border-color: #bdbdbd;
    --switch-background-color: #c2c2c2;
    --switch-before-background-color: #f5f5f5;
  }

  .color-scheme-dark & {
    --options-background-color: #373737;
    --options-text-color: #e0e0e0;
    --options-box-shadow: 0 0 0 5px #373737, 0 0 0 6px #484848,
      10px 14px 13px rgb(0, 0, 0, 0.6);
    --header-background-color: #373737;
    --main-background-color: #424242;
    --main-border-color: #212121;
    --btn-active-background-color: #373737;
    --wallpaper-button-box-shadow-color: #212121;
    --setting-wrapper-background-color: #484848;
    --setting-wrapper-border-color: #373737;
    --switch-background-color: #616161;
    --switch-before-background-color: #f5f5f5;
  }

  font-family: "Roboto", sans-serif;
  height: 100vh;
  ${settingsScrollbarStyles}

  .options-background {
    height: 100%;
  }

  #options {
    height: 100%;
    display: flex;
    flex-flow: column;
    background-color: var(--options-background-color);
    color: var(--options-text-color);
    .color-scheme-dark & {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }

  header {
    padding: 16px 16px 16px 25px;
    background-color: var(--header-background-color);
  }

  header h1 {
    font-size: 20px;
    margin: 0;
    font-weight: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  main {
    overflow: hidden;
    display: flex;
    height: 100%;
    background-color: var(--main-background-color);
    border-top: 1px solid var(--main-border-color);
    .setting-wrapper:last-of-type {
      padding-bottom: 25px;
    }
  }

  .settings-content {
    overflow: auto;
    outline: none;
  }

  .background-buttons {
    margin: 5px 0 20px;

    & button {
      ${defaultBtn}
      display: block;
      width: 100%;
      text-align: left;
      margin: 0 0 1px 0;

      &.active {
        background-color: var(--btn-active-background-color);
      }

      &.focus-visible {
        z-index: 10;
      }
    }
  }

  .setting-option.wallpapers {
    display: flex;
    flex-wrap: wrap;
    margin-right: -20px;
    margin-bottom: -20px;
  }

  .wallpaper-button,
  .wallpaper-button-transparent {
    outline: none;
    width: 120px;
    height: 90px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    position: relative;
    background-size: cover;
    background-position: center;
    margin: 0 20px 20px 0;
    box-shadow: 0 0 0 1px var(--wallpaper-button-box-shadow-color);
    &:focus,
    &:active {
      box-shadow: 0 0 0 4px #64b5f6;
    }
  }
  .wallpaper-button.selected {
    box-shadow: 0 0 0 4px #1565c0;
    :focus:not(.focus-visible) {
      box-shadow: 0 0 0 4px #1565c0;
    }
    &.focus-visible {
      box-shadow: 0 0 0 4px #1565c0, 0 0 0 8px #64b5f6;
    }
    ::before {
      background-color: #1565c0;
      color: #fff;
    }
    ::before {
      position: absolute;
      top: 50%;
      left: 50%;
      content: "L";
      height: 24px;
      width: 24px;
      padding-top: 2px;
      margin-left: -12px;
      margin-top: -12px;
      border-radius: 50%;
      transform: scaleX(-1) rotate(-35deg);
    }
  }

  .wallpaper-button-transparent {
    cursor: initial;
  }

  #dark-wallpaper {
    background-color: #212121;
  }

  #light-wallpaper {
    background-color: #f5f5f5;
  }

  #blue-wallpaper {
    background-color: #bbdefb;
  }

  #brown-wallpaper {
    background-color: #d7ccc8;
  }

  #yellow-wallpaper {
    background-color: #ffe082;
  }

  #green-wallpaper {
    background-color: #b2dfdb;
  }

  #pink-wallpaper {
    background-color: #f8bbd0;
  }

  .custom-group {
    width: 120px;
    margin: 0 20px 20px 0;
  }

  button.custom {
    ${defaultBtn}
    width: 100%;
  }

  .setting-wrapper {
    padding: 25px 25px 25px;
    border-radius: 6px;
    margin: 25px;
    border: 1px solid var(--setting-wrapper-border-color);
    background-color: var(--setting-wrapper-background-color);
  }

  .setting-wrapper.setting-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .setting-title {
    font-weight: bold;
    padding-bottom: 10px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  select {
    ${select};
    max-width: 175px;
  }

  .setting-option {
    &.select,
    &.toggle {
      margin-left: 20px;
    }
  }

  .setting-option.select {
    position: relative;
  }

  .setting-description {
    line-height: 1.5;
  }

  .switch-wrap {
    cursor: pointer;
    width: ${switchWidth}px;
    height: ${switchHeight}px;
    display: block;
    position: relative;
    border-radius: ${switchRadius}px;
    :focus-within {
      box-shadow: 0 0 0 4px #64b5f6;
    }
  }
  .switch-wrap input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .switch {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: ${switchRadius}px;
    transition: 0.2s;
    background-color: var(--switch-background-color);
  }
  .switch::before {
    content: "";
    position: absolute;
    left: ${switchPadding}px;
    bottom: ${switchPadding}px;
    height: ${circleSize}px;
    width: ${circleSize}px;
    border-radius: 50%;
    transition: 0.2s;
    background-color: var(--switch-before-background-color);
  }
  input:checked + .switch {
    background-color: #1565c0;
  }
  input:checked + .switch::before {
    transform: translateX(${circleSize}px);
  }

  @media (min-width: 797px) {
    .options-background {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #options {
      border-radius: 6px;
      max-height: calc(100vh - 40px);
      height: initial;
      box-shadow: var(--options-box-shadow);
    }

    main {
      border-radius: 6px;
      max-height: 949px;
      border: 1px solid var(--main-border-color);
    }

    .setting-wrapper {
      width: 732px;
    }

    header {
      padding: 6px 11px 11px 25px;
    }

    .background-buttons {
      display: flex;
      button {
        text-align: center;
        margin: 0 1px 0 0;
        :not(:first-of-type) {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        :not(:last-of-type) {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        :last-of-type {
          margin-right: 0;
        }
      }
    }
  }
`;
