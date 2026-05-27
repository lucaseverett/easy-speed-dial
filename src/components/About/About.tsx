import "./styles.css";

import logo from "#assets/logo.svg";

const appVersion = __APP_VERSION__;
const displayAppVersion = appVersion.replace(/\.0$/, "");

export function About() {
  return (
    <div className="About">
      <div className="identity">
        <img src={logo} width="72" height="72" alt="" aria-hidden="true" />
        <p className="title">Easy Speed Dial</p>
        <p className="version">Version {displayAppVersion}</p>
      </div>

      <div className="support">
        <a
          className="textLink"
          href="https://easyspeeddial.com"
          rel="noreferrer"
          target="_blank"
        >
          Website
        </a>
        <span aria-hidden="true">·</span>
        <a className="textLink" href="mailto:support@easyspeeddial.com">
          Email support
        </a>
        <span aria-hidden="true">·</span>
        <a
          className="textLink"
          href="https://github.com/lucaseverett/easy-speed-dial/issues"
          rel="noreferrer"
          target="_blank"
        >
          Report an issue
        </a>
      </div>

      <div className="details">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            className="textLink"
            href="https://lucaseverett.dev"
            rel="noreferrer"
            target="_blank"
          >
            Lucas Everett
          </a>
          <span aria-hidden="true"> · </span>
          <a
            className="textLink"
            href="https://buymeacoffee.com/lucaseverett"
            rel="noreferrer"
            target="_blank"
          >
            Buy me a coffee
          </a>
        </p>
      </div>
    </div>
  );
}
