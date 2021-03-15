import { css } from "@emotion/css";

function goBack() {
  history.back();
}

const styles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  height: 70px;
  padding-top: 8px;
  cursor: default;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  span {
    text-decoration: underline;
    :hover {
      text-decoration: none;
    }
  }
  button {
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    border-radius: 2px;
    height: 30px;
    padding: 0 8px 0 0;
    border: none;
    .color-scheme-light & {
      color: #424242;
      background-color: rgba(35, 35, 35, 0.8);
      background-color: rgba(255, 255, 255, 0.8);
    }
    .color-scheme-dark & {
      color: #e0e0e0;
      background-color: rgba(35, 35, 35, 0.8);
    }
    :focus:not(.focus-visible) {
      outline: none;
    }
    &.focus-visible {
      background-color: #90caf9;
      color: #424242;
      outline: none;
      text-decoration: none;
    }
  }
`;

export const Breadcrumbs = ({ currentFolder }) => {
  return (
    <div className={styles}>
      <button
        title="Go to parent folder"
        onClick={goBack}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <i className="material-icons">chevron_left</i>
        <span>{currentFolder.title}</span>
      </button>
    </div>
  );
};
