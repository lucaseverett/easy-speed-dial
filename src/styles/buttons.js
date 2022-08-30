import { css } from "@emotion/css";

const btn = css`
  .color-scheme-light & {
    --btn-background-color: #cfcfcf;
    --btn-text-color: #000;
    --btn-hover-background-color: #bcbcbc;
    --btn-hover-text-color: #000;
    --btn-focus-color: #90caf9;
    --btn-selected-background-color: #bcbcbc;
  }

  .color-scheme-dark & {
    --btn-background-color: #616161;
    --btn-text-color: #f5f5f5;
    --btn-hover-background-color: #373737;
    --btn-hover-text-color: #f5f5f5;
    --btn-focus-color: #90caf9;
    --btn-selected-background-color: #373737;
  }

  padding: 10px 10px 8px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  text-decoration: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active {
    filter: brightness(0.9);
  }

  &.focus-visible {
    outline: 4px solid var(--btn-focus-color);
  }
`;

const defaultBtn = css`
  ${btn}
  background-color: var(--btn-background-color);
  color: var(--btn-text-color);

  :hover {
    background-color: var(--btn-hover-background-color);
    color: var(--btn-hover-text-color);
  }
`;

const submitBtn = css`
  ${btn}
  background-color: #1565c0;
  color: #fff;

  &:hover {
    background-color: #0d47a1;
    color: #fff;
  }
`;

const dismissBtn = css`
  .color-scheme-light & {
    --dismiss-btn-hover-background-color: #aeaeae;
    --dismiss-btn-focus-color: #90caf9;
  }

  .color-scheme-dark & {
    --dismiss-btn-hover-background-color: #424242;
    --dismiss-btn-focus-color: #90caf9;
  }

  background: transparent;
  border: none;
  padding: 3px;
  border-radius: 4px;
  color: inherit;
  cursor: pointer;

  :hover {
    background-color: var(--dismiss-btn-hover-background-color);
  }

  &:active {
    filter: brightness(0.9);
  }

  &.focus-visible {
    outline: 4px solid var(--dismiss-btn-focus-color);
  }

  .close {
    vertical-align: middle;
  }
`;

export { submitBtn, defaultBtn, dismissBtn };
