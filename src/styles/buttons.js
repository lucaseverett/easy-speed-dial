import { css } from "@emotion/css";

const defaultBtn = css`
  .color-scheme-light & {
    --btn-background-color: #cfcfcf;
    --btn-text-color: #000;
    --btn-active-background-color: #bcbcbc;
    --btn-active-text-color: #000;
    --btn-hover-background-color: #bcbcbc;
    --btn-hover-text-color: #000;
    --btn-focus-box-shadow-color: #90caf9;
  }

  .color-scheme-dark & {
    --btn-background-color: #616161;
    --btn-text-color: #f5f5f5;
    --btn-active-background-color: #373737;
    --btn-active-text-color: #f5f5f5;
    --btn-hover-background-color: #373737;
    --btn-hover-text-color: #000;
    --btn-focus-box-shadow-color: #90caf9;
  }

  padding: 10px 10px 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: var(--btn-background-color);
  color: var(---btn-text-color);
  :active,
  :hover {
    outline: none;
    background-color: var(--btn-active-background-color);
    color: var(---btn-active-text-color);
  }
  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :focus {
    outline: none;
    box-shadow: 0 0 0 4px var(--btn-focus-box-shadow-color);
  }
`;

const dismissBtn = css`
  .color-scheme-light & {
    --dismiss-btn-hover-background-color: #aeaeae;
    --dismiss-btn-focus-background-color: #aeaeae;
  }

  .color-scheme-dark & {
    --dismiss-btn-hover-background-color: #424242;
    --dismiss-btn-focus-background-color: #424242;
  }

  background: transparent;
  border: none;
  padding: 3px;
  border-radius: 4px;
  color: inherit;
  cursor: pointer;
  :focus {
    outline: none;
    background-color: var(--dismiss-btn-focus-background-color);
  }
  :hover {
    background-color: var(--dismiss-btn-hover-background-color);
  }
  :active {
    outline: none;
  }
  .close {
    vertical-align: middle;
  }
`;

export { defaultBtn, dismissBtn };
