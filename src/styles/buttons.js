import { css } from "@emotion/css";

const defaultBtn = css`
  padding: 10px 10px 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  :active,
  :hover {
    outline: none;
  }
  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :focus {
    outline: none;
  }
`;

const defaultBtnLight = css`
  background-color: #cfcfcf;
  color: #000;
  :active,
  :hover {
    background-color: #bcbcbc;
    color: #000;
  }
  :focus {
    box-shadow: 0 0 0 4px #aeaeae;
  }
`;

const defaultBtnDark = css`
  background-color: #616161;
  color: #f5f5f5;
  :active,
  :hover {
    background-color: #373737;
    color: #f5f5f5;
  }
  :focus {
    box-shadow: 0 0 0 4px #757575;
  }
`;

const dismissBtn = css`
  background: transparent;
  border: none;
  padding: 3px;
  border-radius: 4px;
  color: inherit;
  cursor: pointer;
  :focus {
    outline: none;
  }
  :active {
    outline: none;
  }
  .close {
    vertical-align: middle;
  }
`;

const dismissBtnLight = css`
  :hover {
    background-color: #aeaeae;
  }
  :focus {
    background-color: #aeaeae;
  }
`;

const dismissBtnDark = css`
  :hover {
    background-color: #424242;
  }
  :focus {
    background-color: #424242;
  }
`;

export {
  defaultBtn,
  defaultBtnLight,
  defaultBtnDark,
  dismissBtn,
  dismissBtnLight,
  dismissBtnDark,
};
