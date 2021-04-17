import { css } from "@emotion/css";
import { defaultBtn, dismissBtn } from "../styles/buttons.js";
import { useOptions } from "useOptions";
import { appVersion } from "../common/version.js";

const styles = css`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #4527a0;
  color: #fff;
  font-size: 16px;
  .message {
    display: flex;
    align-items: center;
    padding: 15px 0;
    .info {
      padding-right: 10px;
      font-size: 28px;
    }
    strong {
      font-weight: 500;
      padding-right: 5px;
    }
    a {
      color: inherit;
      text-decoration: underline;
      cursor: pointer;
      :hover {
        text-decoration: none;
      }
      :focus {
        background-color: #7953d2;
        outline: none;
      }
    }
  }
  .whats-new {
    margin-right: 20px;
  }
  button.whats-new {
    ${defaultBtn}
    :focus {
      box-shadow: 0 0 0 4px #7953d2;
    }
  }
  button.dismiss {
    ${dismissBtn}
    :hover {
      background-color: #7953d2;
    }
    :focus {
      background-color: #7953d2;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
  }
`;

export const AlertBanner = ({
  handleDismissAlertBanner,
  handleShowWhatsNew,
  hideContextMenu,
  firstRun,
}) => {
  const { openOptions } = useOptions();

  function handleContextMenu(e) {
    hideContextMenu();
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className={styles} onContextMenu={handleContextMenu}>
      {firstRun ? (
        <>
          <div className="message">
            <i className="material-icons info">campaign</i>
            <div>
              <strong>Welcome to Toolbar Dial {appVersion}!</strong> You can set
              a background color or image, among other customizations, in{" "}
              <a onClick={openOptions}>Options</a>.
            </div>
          </div>
          <div className="buttons">
            <button
              className="dismiss"
              title="Dismiss"
              onClick={handleDismissAlertBanner}
            >
              <i className="material-icons close">close</i>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="message">
            <i className="material-icons info">campaign</i>
            <div>
              <strong>
                Toolbar Dial has been updated to version {appVersion}!
              </strong>
            </div>
          </div>
          <div className="buttons">
            <button
              className={[
                css`
                  ${defaultBtn}
                `,
                "whats-new",
              ].join(" ")}
              title="Learn More"
              onClick={handleShowWhatsNew}
            >
              What's New
            </button>
            <button
              className="dismiss"
              title="Dismiss"
              onClick={handleDismissAlertBanner}
            >
              <i className="material-icons close">close</i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
