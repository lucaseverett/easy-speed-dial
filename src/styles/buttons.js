import { css } from "@emotion/css";

const defaultBtn = css`
  .color-scheme-light & {
    --btn-background-color: #cfcfcf;
    --btn-text-color: #000;
    --btn-hover-background-color: #bcbcbc;
    --btn-hover-text-color: #000;
    --btn-focus-box-shadow-color: #90caf9;
    --btn-selected-background-color: #bcbcbc;
  }

  .color-scheme-dark & {
    --btn-background-color: #616161;
    --btn-text-color: #f5f5f5;
    --btn-hover-background-color: #373737;
    --btn-hover-text-color: #f5f5f5;
    --btn-focus-box-shadow-color: #90caf9;
    --btn-selected-background-color: #373737;
  }

  padding: 10px 10px 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: var(--btn-background-color);
  color: var(--btn-text-color);
  :hover,
  :active {
    outline: none;
    background-color: var(--btn-hover-background-color);
    color: var(--btn-hover-text-color);
  }
  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &.focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px var(--btn-focus-box-shadow-color);
  }
`;

const dismissBtn = css`
  .color-scheme-light & {
    --dismiss-btn-hover-background-color: #aeaeae;
    --dismiss-btn-focus-box-shadow-color: #90caf9;
  }

  .color-scheme-dark & {
    --dismiss-btn-hover-background-color: #424242;
    --dismiss-btn-focus-box-shadow-color: #90caf9;
  }

  background: transparent;
  border: none;
  padding: 3px;
  border-radius: 4px;
  color: inherit;
  cursor: pointer;
  :hover,
  :active {
    outline: none;
    background-color: var(--dismiss-btn-hover-background-color);
  }
  &.focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px var(--dismiss-btn-focus-box-shadow-color);
  }
  .close {
    vertical-align: middle;
  }
`;

export { defaultBtn, dismissBtn };
