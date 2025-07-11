import "./styles.css";

import logo from "#assets/logo.svg";

const appVersion = __APP_VERSION__;

export function About() {
  return (
    <div className="About">
      <div className="logo">
        <img src={logo} width="128" height="128" alt="Easy Speed Dial" />
        <div className="right">
          <p className="title">Easy Speed Dial</p>
          <p className="small">Version {appVersion}</p>
          <p>
            Need help? Email{" "}
            <a href="mailto:support@easyspeeddial.com">
              support@easyspeeddial.com
            </a>
            .
          </p>
          <p>
            Find a bug? Please report it to the{" "}
            <a
              href="https://github.com/lucaseverett/easy-speed-dial"
              rel="noreferrer"
              target="_blank"
            >
              GitHub repository
            </a>
            .
          </p>
        </div>
      </div>
      <div className="details">
        <p className="copyright">
          <a href="https://easyspeeddial.com/" rel="noreferrer" target="_blank">
            Easy Speed Dial
          </a>{" "}
          was created by and is maintained by{" "}
          <a href="https://lucaseverett.dev/" rel="noreferrer" target="_blank">
            Lucas Everett
          </a>
          .
        </p>
        <p className="copyright">
          Copyright &copy; 2018-{new Date().getFullYear()} Lucas Everett.
          Released under the{" "}
          <a
            href="https://github.com/lucaseverett/easy-speed-dial/blob/main/LICENSE"
            rel="noreferrer"
            target="_blank"
          >
            MIT License
          </a>
          .
        </p>
      </div>
    </div>
  );
}
