import { css } from "emotion";

const switchWidth = 50;
const switchPadding = 3;
const switchHeight = switchWidth / 2 + switchPadding;
const switchRadius = switchHeight / 2;
const circleSize = switchHeight - switchPadding * 2;

export const styles = css`
  font-family: Arial, Helvetica, sans-serif;
  min-height: 100vh;

  .options-background {
    background-color: #e0e0e0;
    min-height: 100vh;
  }

  #options {
    max-width: 800px;
    margin: 0 auto;
  }

  header {
    background-color: #512da8;
    color: #fff;
    padding: 18px 25px;
  }

  header h1 {
    font-size: 24px;
    margin: 0;
    font-weight: normal;
  }

  main {
    background-color: #e0e0e0;
    padding: 0 25px 25px;
  }

  h2 {
    font-size: 1rem;
    margin: 0 0 20px;
  }

  .setting-label {
    width: 300px;
  }

  .setting-wrapper {
    padding: 25px 0;
    border-bottom: 1px solid #c7c7c7;
  }

  .setting-wrapper:last-of-type {
    padding-bottom: 0;
    border-bottom: none;
  }

  .setting-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
  }

  .setting-group:last-of-type {
    margin-bottom: 0;
  }

  .setting-option.wallpapers {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: -15px;
  }

  button.wallpaper-button {
    outline: none;
    width: 80px;
    height: 60px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    position: relative;
    margin: 0 15px 15px 0;
  }

  .wallpaper-button.selected {
    box-shadow: 0 0 0 2px #29b6f6;
  }

  .wallpaper-button.selected::before {
    position: absolute;
    top: 50%;
    left: 50%;
    content: "\\2713";
    background-color: #29b6f6;
    color: #fff;
    height: 24px;
    width: 24px;
    padding-top: 3px;
    margin-left: -12px;
    margin-top: -12px;
    border-radius: 50%;
  }

  button.wallpaper-button:focus,
  button.wallpaper-button:active {
    box-shadow: 0 0 0 2px #29b6f6;
  }

  #dark-wallpaper {
    background-color: #212121;
  }

  #light-wallpaper {
    background-color: #f5f5f5;
  }

  #homepage-url {
    margin-top: 10px;
    display: block;
  }

  #homepage-url a {
    color: #000;
  }

  select {
    border-radius: 5px;
    padding: 7px;
    border: 1px solid #c7c7c7;
    background-color: #c7c7c7;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .folder {
    width: 260px;
    position: relative;
  }

  .fa-caret-down {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #212121;
    pointer-events: none;
  }

  .setting-description {
    display: block;
  }

  .switch-wrap {
    cursor: pointer;
    width: ${switchWidth}px;
    height: ${switchHeight}px;
    display: block;
    position: relative;
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
    background-color: #c7c7c7;
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
    background-color: #f5f5f5;
    transition: 0.2s;
  }

  input:checked + .switch {
    background-color: #29b6f6;
  }

  input:checked + .switch::before {
    transform: translateX(${circleSize}px);
  }

  a {
    color: #000;
    :hover {
      text-decoration: none;
    }
  }

  @media (min-width: 800px) {
    .options-background {
      background-color: transparent;
      padding-top: 30px;
    }

    header {
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
    }

    main {
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
    }
  }
`;
