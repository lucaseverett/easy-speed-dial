import { css } from "@emotion/css";

const input = css`
  .color-scheme-light & {
    --input-background-color: #cfcfcf;
    --input-text-color: inherit;
  }

  .color-scheme-dark & {
    --input-background-color: #616161;
    --input-text-color: #f5f5f5;
  }

  border-radius: 4px;
  border: none;
  padding: 7px 25px 7px 7px;
  background-color: var(--input-background-color);
  color: var(--input-text-color);

  :focus {
    outline: none;
    box-shadow: 0 0 0 4px #64b5f6;
  }
`;

const select = css`
  .color-scheme-light & {
    --select-drop-down-arrow-color: #212121;
  }

  .color-scheme-dark & {
    --select-drop-down-arrow-color: #f5f5f5;
  }

  ${input}
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  + .material-icons.arrow_drop_down {
    position: absolute;
    top: 5px;
    right: 0;
    pointer-events: none;
    color: var(--select-drop-down-arrow-color);
  }
`;

export { select, input };
