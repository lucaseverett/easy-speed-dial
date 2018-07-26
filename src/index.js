import { h, Component, render } from "preact";
import "./index.css";
import { css } from "preact-emotion";
import DefaultTheme from "./themes/default/index.js";
import filter from "./filter.js";

// Mock Data for Testing
//import browser from "./mockdata.js";

const themes = {
  DefaultLight: DefaultTheme,
  DefaultDark: DefaultTheme
};

const rootFolder = { id: "toolbar_____", title: "Bookmarks" };

class App extends Component {
  state = {
    bookmarks: [],
    theme: "DefaultLight",
    currentFolder: rootFolder,
    path: []
  };

  changeFolder = ({ currentFolder = "", nextFolder }) => {
    this.getBookmarks(nextFolder.id).then(bookmarks =>
      this.setState(({ path }) => {
        if (currentFolder) {
          return {
            bookmarks,
            currentFolder: nextFolder,
            path: [...path, currentFolder]
          };
        } else {
          path = path.slice(0, path.map(({ id }) => id).indexOf(nextFolder.id));
          return {
            bookmarks,
            currentFolder: nextFolder,
            path
          };
        }
      })
    );
  };

  changeTheme = ({ theme }) => {
    if (theme) {
      this.setState({
        theme
      });
    }
  };

  receiveTheme = ({ theme }) => {
    this.changeTheme({ theme: theme.newValue });
  };

  receiveBookmarks = () => {
    this.getBookmarks(rootFolder.id).then(bookmarks => {
      if (bookmarks) {
        this.setState({ bookmarks, currentFolder: rootFolder, path: [] });
      }
    });
  };

  getBookmarks = async folder => {
    let bookmarks = [];
    let sort = (a, b) => a.index - b.index;
    try {
      bookmarks = await browser.bookmarks.getChildren(folder);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
    return filter(bookmarks).sort(sort);
  };

  getTheme = async () => {
    return await browser.storage.local.get({ theme: "" });
  };

  componentDidMount() {
    this.receiveBookmarks();
    this.getTheme().then(theme => this.changeTheme(theme));
    browser.storage.onChanged.addListener(this.receiveTheme);
    browser.bookmarks.onChanged.addListener(this.receiveBookmarks);
    browser.bookmarks.onCreated.addListener(this.receiveBookmarks);
    browser.bookmarks.onMoved.addListener(this.receiveBookmarks);
    browser.bookmarks.onRemoved.addListener(this.receiveBookmarks);
  }

  componentWillUnmount() {
    browser.storage.onChanged.removeListener(this.receiveTheme);
    browser.bookmarks.onChanged.removeListener(this.receiveBookmarks);
    browser.bookmarks.onCreated.removeListener(this.receiveBookmarks);
    browser.bookmarks.onMoved.removeListener(this.receiveBookmarks);
    browser.bookmarks.onRemoved.removeListener(this.receiveBookmarks);
  }

  focusRef = null;

  setFocusRef = element => {
    this.focusRef = element;
  };

  setFocus = () => {
    this.focusRef.focus();
  };

  componentDidUpdate() {
    this.setFocus();
    window.scrollTo(0, 0);
  }

  render({}, { bookmarks, theme, path, currentFolder }) {
    let noOutline = css({ outline: 0 });

    let Theme = themes[theme];
    return (
      <div ref={this.setFocusRef} tabIndex="-1" class={noOutline}>
        <Theme
          {...{
            bookmarks,
            currentFolder,
            path,
            theme,
            changeFolder: this.changeFolder,
            isRoot: currentFolder.id === rootFolder.id
          }}
        />
      </div>
    );
  }
}

render(<App />, document.body, document.body.lastElementChild);
