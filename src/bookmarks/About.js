import { css } from "@emotion/css";
import logo from "url:../../public/icons/128.svg";
import { appVersion } from "../common/version.js";

const styles = css`
  display: flex;
  align-items: center;
  line-height: 1.5;

  img {
    padding-right: 20px;
  }

  .color-scheme-light & a {
    color: inherit;
  }

  .color-scheme-dark & a {
    color: inherit;
  }

  a {
    :hover {
      text-decoration: none;
    }
    :focus {
      background-color: #90caf9;
      color: #000;
      outline: none;
    }
  }
`;

export const About = () => (
  <div className={styles}>
    <img src={logo} />
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
);
