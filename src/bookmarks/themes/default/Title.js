import { css } from "@emotion/css";

const styles = css`
  text-align: center;
  font-size: 13px;
  padding-top: 10px;

  .attach-title & {
    padding: 0;
  }

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
    display: inline-block;
    .color-scheme-light & {
      background-color: rgba(245, 245, 245, 0.75);
      color: #373737;
    }
    .color-scheme-dark & {
      background-color: rgba(55, 55, 55, 0.75);
      color: #eeeeee;
    }
    a.focus-visible & {
      background-color: #90caf9;
      color: #424242;
    }

    max-width: 100%;
    .attach-title & {
      border-radius: 0 0 6px 6px;
      width: 100%;
      display: block;
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
