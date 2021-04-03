import { css } from "@emotion/css";
import { settingsScrollbarStyles } from "../styles/scrollbars.js";
import {
  defaultBtn,
  defaultBtnLight,
  defaultBtnDark,
} from "../styles/buttons.js";
import { select, selectLight, selectDark } from "../styles/inputs.js";

const switchWidth = 50;
const switchPadding = 3;
const switchHeight = switchWidth / 2 + switchPadding;
const switchRadius = switchHeight / 2;
const circleSize = switchHeight - switchPadding * 2;

export const styles = css`
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
  }
  &.color-scheme-light #options {
    background-color: #bdbdbd;
    color: #000;
  }
  &.color-scheme-dark #options {
    background-color: #373737;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #e0e0e0;
  }

  header {
    padding: 16px 16px 16px 25px;
  }
  &.color-scheme-light header {
    background-color: #bdbdbd;
  }
  &.color-scheme-dark header {
    background-color: #373737;
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
    .setting-wrapper:last-of-type {
      padding-bottom: 25px;
    }
  }
  &.color-scheme-light main {
    background-color: #e0e0e0;
    border-top: 1px solid #9e9e9e;
  }
  &.color-scheme-dark main {
    background-color: #424242;
    border-top: 1px solid #212121;
  }

  .settings-content {
    overflow: auto;
    outline: none;
  }

  .background-buttons {
    display: flex;
    justify-content: center;
    margin: 5px 0 20px;
  }
  .background-buttons button {
    ${defaultBtn}
    margin: 0 5px;
  }
  &.color-scheme-light .background-buttons button {
    ${defaultBtnLight}
    background-color: transparent;
    &.active {
      ${defaultBtnLight}
    }
  }
  &.color-scheme-dark .background-buttons button {
    ${defaultBtnDark}
    background-color: transparent;
    &.active {
      ${defaultBtnDark}
    }
  }

  .setting-option.wallpapers {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-bottom: -20px;
  }

  .wallpaper-button-transparent {
    width: 120px;
    height: 90px;
    border-radius: 4px;
    border: none;
    margin: 0 20px 20px 0;
  }

  .wallpaper-button {
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
  }
  .wallpaper-button.selected {
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
  &.color-scheme-light {
    .wallpaper-button {
      box-shadow: 0 0 0 1px #9e9e9e;
      &:focus,
      &:active {
        box-shadow: 0 0 0 4px #64b5f6;
      }
    }
    .wallpaper-button-transparent {
      box-shadow: 0 0 0 1px #9e9e9e;
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
    }
  }
  &.color-scheme-dark {
    .wallpaper-button {
      box-shadow: 0 0 0 1px #212121;
      &:focus,
      &:active {
        box-shadow: 0 0 0 4px #64b5f6;
      }
    }
    .wallpaper-button-transparent {
      box-shadow: 0 0 0 1px #212121;
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
    }
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
  &.color-scheme-light button.custom {
    ${defaultBtnLight}
  }
  &.color-scheme-dark button.custom {
    ${defaultBtnDark}
  }

  .setting-wrapper {
    padding: 25px 25px 25px;
    border-radius: 6px;
    margin: 25px;
  }
  &.color-scheme-light .setting-wrapper {
    border: 1px solid #bdbdbd;
    background-color: #eee;
  }

  &.color-scheme-dark .setting-wrapper {
    border: 1px solid #373737;
    background-color: #484848;
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
    &.background {
      padding-bottom: 0;
    }
  }
  .setting-column-right .setting-group:last-of-type {
  }

  select {
    ${select};
  }
  &.color-scheme-light select {
    ${selectLight};
  }
  &.color-scheme-dark select {
    ${selectDark};
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

  .material-icons.arrow_drop_down {
    position: absolute;
    top: 5px;
    right: 0;
    pointer-events: none;
  }
  &.color-scheme-light .material-icons.arrow_drop_down {
    color: #212121;
  }
  &.color-scheme-dark .material-icons.arrow_drop_down {
    color: #f5f5f5;
  }

  .setting-group .setting-description {
    line-height: 1.5;
  }

  .switch-wrap {
    cursor: pointer;
    width: ${switchWidth}px;
    height: ${switchHeight}px;
    display: block;
    position: relative;
    border-radius: ${switchRadius}px;
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
  }
  input:checked + .switch::before {
    transform: translateX(${circleSize}px);
  }
  &.color-scheme-light {
    .switch-wrap {
      :focus-within {
        box-shadow: 0 0 0 4px #64b5f6;
      }
    }
    .switch {
      background-color: #c2c2c2;
    }
    .switch::before {
      background-color: #f5f5f5;
    }
    input:checked + .switch {
      background-color: #1565c0;
    }
  }
  &.color-scheme-dark {
    .switch-wrap {
      :focus-within {
        box-shadow: 0 0 0 4px #64b5f6;
      }
    }
    .switch {
      background-color: #616161;
    }
    .switch::before {
      background-color: #f5f5f5;
    }
    input:checked + .switch {
      background-color: #1565c0;
    }
  }

  &.color-scheme-light a {
    color: inherit;
  }

  &.color-scheme-dark a {
    color: inherit;
  }
  a {
    :hover {
      text-decoration: none;
    }
    :focus {
      background-color: #90caf9;
      color: #000;
      outline: none;
    }
  }

  @media (min-width: 797px) {
    .options-background {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #options {
      border-radius: 6px;
      width: 797px;
      max-height: calc(100vh - 40px);
      height: initial;
    }
    main {
      border-radius: 6px;
      max-height: 949px;
    }
    &.color-scheme-light main {
      border: 1px solid #9e9e9e;
    }
    &.color-scheme-dark main {
      border: 1px solid #212121;
    }
    &.color-scheme-light #options {
      box-shadow: 0 0 0 5px #bdbdbd, 0 0 0 6px #9e9e9e,
        0 0 15px rgb(33, 33, 33, 0.5), 8px 8px 20px rgb(33, 33, 33, 0.5);
    }
    &.color-scheme-dark #options {
      box-shadow: 0 0 0 5px #373737, 0 0 0 6px #484848,
        10px 14px 13px rgb(0, 0, 0, 0.6);
    }

    header {
      padding: 6px 11px 11px 25px;
    }
  }
`;
