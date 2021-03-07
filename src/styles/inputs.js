import { css } from "@emotion/css";

const input = css`
  border-radius: 4px;
  padding: 7px 25px 7px 7px;
  :focus {
    outline: none;
  }
`;

const inputLight = css`
  border: 1px solid #9e9e9e;
  background-color: #bdbdbd;
  :focus {
    box-shadow: 0 0 0 4px #64b5f6;
  }
`;

const inputDark = css`
  border: 1px solid #212121;
  background-color: #373737;
  color: #f5f5f5;
  :focus {
    box-shadow: 0 0 0 4px #64b5f6;
  }
`;

const select = css`
  ${input}
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
