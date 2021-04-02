import { css } from "@emotion/css";

const input = css`
  border-radius: 4px;
  border: none;
  padding: 7px 25px 7px 7px;
  :focus {
    outline: none;
  }
`;

const inputLight = css`
  background-color: #cfcfcf;
  :focus {
    box-shadow: 0 0 0 4px #64b5f6;
  }
`;

const inputDark = css`
  background-color: #616161;
  color: #f5f5f5;
  :focus {
    box-shadow: 0 0 0 4px #64b5f6;
  }
`;

const select = css`
  ${input}
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
`;

const selectLight = css`
  ${inputLight}
`;

const selectDark = css`
  ${inputDark}
`;

export { select, selectLight, selectDark, input, inputLight, inputDark };
