import { css } from "@emotion/css";

const styles = css`
  padding-top: 2px;
  text-align: center;
  font-size: 13px;
  .title {
    text-overflow: ellipsis;
    .windows & {
      font-weight: 500;
    }
    .windows.firefox & {
      padding: 3px 8px 3px;
    }
    .windows.chrome & {
      padding: 4px 8px 3px;
    }
    .mac.chrome & {
      padding: 4px 8px 2px;
    }
    .mac.firefox & {
      padding: 3px 8px 2px;
    }
    border-radius: 10px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 194px;
    display: inline-block;
    .color-scheme-light & {
      background-color: rgba(255, 255, 255, 0.8);
      color: #424242;
    }
    .color-scheme-dark & {
      background-color: rgba(33, 33, 33, 0.8);
      color: #e0e0e0;
    }
    a.focus-visible & {
      background-color: #90caf9;
      color: #424242;
    }
  }
`;

export const Title = ({ showTitle, title }) => {
  return (
    showTitle && (
      <div className={styles}>
        <span className="title" title={title}>
          {title}
        </span>
      </div>
    )
  );
};
