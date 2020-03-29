import { css } from "emotion";

export const inputStyles = css`
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  border: 1px solid #c7c7c7;
  &:focus {
    outline: 0;
    border: 1px solid #280680;
    box-shadow: 0 0 0 2px #9162e4;
  }
  &:invalid {
    border: 1px solid #ef9a9a;
    box-shadow: none;
    outline: none;
    &:focus {
      box-shadow: 0 0 0 2px #ef9a9a;
      border-color: #7f0000;
    }
  }
`;
