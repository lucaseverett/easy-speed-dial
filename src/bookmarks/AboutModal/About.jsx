import "./styles.css";
import logo from "./128.svg?raw";
import { appVersion } from "../../common/version.js";

export const About = () => (
  <div className="About">
    <div className="about">
      <div dangerouslySetInnerHTML={{ __html: logo }} className="logo" />
      <div>
        <p>Version {appVersion}</p>
        <p>
          <a href="https://toolbardial.com/" rel="noopener" target="_blank">
            Toolbar Dial
          </a>{" "}
          was created by{" "}
          <a href="https://lucaseverett.dev/" rel="noopener" target="_blank">
            Lucas Everett
          </a>
          .
        </p>
        <p>
          Please report issues and submit requests to the{" "}
          <a
            href="https://github.com/lucaseverett/toolbar-dial"
            rel="noopener"
            target="_blank"
          >
            GitHub repository
          </a>
          .
        </p>
      </div>
    </div>
    <div className="copyright">
      Copyright &copy; {new Date().getFullYear()} Lucas Everett. Released under
      the{" "}
      <a
        href="https://opensource.org/licenses/MIT"
        rel="noopener noreferrer"
        target="_blank"
      >
        MIT License
      </a>
      .
    </div>
  </div>
);
