import { h, Component, render } from "preact";
import "./options.css";
import { css } from "preact-emotion";

class Options extends Component {
  state = {
    theme: "DefaultLight",
    themes: [
      { id: "DefaultLight", title: "Default Light" },
      { id: "DefaultDark", title: "Default Dark" }
    ]
  };

  getTheme = async () => {
    return await browser.storage.local.get({ theme: "" });
  };

  changeTheme = ({ theme }) => {
    if (theme) {
      this.setState({
        theme
      });
    }
  };

  componentDidMount() {
    this.getTheme().then(theme => this.changeTheme(theme));
  }

  handleChange = e => {
    this.setState({
      theme: e.target.value
    });
    browser.storage.local.set({ theme: e.target.value });
  };

  render({}, { theme, themes }) {
    return (
      <div>
        <label>Theme: </label>
        <select value={theme} onChange={this.handleChange}>
          {themes.map(({ id, title }) => <option value={id}>{title}</option>)}
        </select>
      </div>
    );
  }
}

render(<Options />, document.body, document.body.lastElementChild);
