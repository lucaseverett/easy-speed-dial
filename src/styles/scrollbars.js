import { css } from "emotion";

const themes = {
  light: css`
    scrollbar-color: #cdcdcd #f0f0f0;
    &::-webkit-scrollbar {
      background-color: #f0f0f0;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cdcdcd;
      border: 1px solid #f0f0f0;
    }
  `,
  modalLight: css`
    scrollbar-color: #cecece #b3b3b3;
    &::-webkit-scrollbar {
      background-color: #b3b3b3;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cecece;
      border: 1px solid #b3b3b3;
    }
  `,
  modalDark: css`
    scrollbar-color: #7b7b7b #353535;
    &::-webkit-scrollbar {
      background-color: #353535;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #7b7b7b;
      border: 1px solid #353535;
      border-top: none;
      border-bottom: none;
    }
  `,
  auto: css`
    scrollbar-color: rgb(255, 255, 255, 0.4) rgb(0, 0, 0, 0.3);
    &::-webkit-scrollbar {
      background-color: rgb(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgb(255, 255, 255, 0.4);
      border: 1px solid rgb(0, 0, 0, 0.2);
    }
  `,
};

const mainScrollbarStyles = css`
  &.firefox,
  &.chrome {
    ${themes.auto}
  }
`;

const modalScrollbarStyles = css`
  .firefox.mac.color-scheme-dark &,
  .chrome.color-scheme-dark & {
    ${themes.modalDark}
  }
  .firefox.mac.color-scheme-light &,
  .chrome.color-scheme-light & {
    ${themes.modalLight}
  }
`;

const settingsScrollbarStyles = css`
  &.firefox.mac.color-scheme-dark .settings-content,
  &.chrome.color-scheme-dark .settings-content {
    ${themes.modalDark}
  }
  &.firefox.mac.color-scheme-light .settings-content,
  &.chrome.color-scheme-light .settings-content {
    ${themes.light}
  }
`;

export { mainScrollbarStyles, modalScrollbarStyles, settingsScrollbarStyles };
