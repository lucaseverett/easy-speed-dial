import { css } from "emotion";

export const buttonStyles = {
  defaultBtn: css`
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    text-transform: uppercase;
    padding: 10px;
    background-color: #e0e0e0;
    color: #000;
    cursor: pointer;
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    &:focus,
    &:active,
    &:hover {
      outline: none;
    }
    &:hover {
      background-color: #aeaeae;
      border-color: #aeaeae;
    }
    &:focus {
      border-color: #707070;
      box-shadow: 0 0 0 2px #707070;
    }
  `,
  primaryBtn: css`
    border-color: #5e35b1;
    background-color: #5e35b1;
    color: #fff;
    &:hover {
      background-color: #280680;
      border-color: #280680;
    }
    &:focus {
      border-color: #9162e4;
      box-shadow: 0 0 0 2px #9162e4;
    }
  `
};
