import React from "react";
import { render } from "react-dom";
import "./styles.css";
import { css } from "emotion";
import DefaultTheme from "./themes/default/index.js";
import filter from "./filter.js";

const themes = {
  DefaultLight: DefaultTheme,
  DefaultDark: DefaultTheme
};

const rootFolder = { id: "toolbar_____", title: "Bookmarks" };

class App extends React.Component {
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

  receiveOptions = change => {
    if (change["theme"]) {
      this.changeTheme({ theme: change["theme"]["newValue"] });
    }
    if (change["folder"]) {
      rootFolder.id = change["folder"]["newValue"];
      this.initialBookmarks();
    }
  };

  initialBookmarks = () => {
    this.getBookmarks(rootFolder.id).then(bookmarks => {
      if (bookmarks) {
        this.setState({ bookmarks, currentFolder: rootFolder, path: [] });
      }
    });
  };

  updateBookmarks = () => {
    this.getBookmarks(this.state.currentFolder.id).then(bookmarks => {
      if (bookmarks) {
        this.setState({ bookmarks });
      }
    });
  };

  receiveBookmarks = () => {
    let getChildren = browser.bookmarks.getChildren(
      this.state.currentFolder.id
    );
    getChildren.then(this.updateBookmarks, this.initialBookmarks);
  };

  getBookmarks = async folder => {
    let bookmarks = [];
    let sort = (a, b) => a.index - b.index;
    try {
      bookmarks = await browser.bookmarks.getChildren(folder);
    } catch (e) {
      console.log(e);
    }
    return filter(bookmarks).sort(sort);
  };

  getTheme = async () => {
    return await browser.storage.local.get({ theme: "" });
  };

  getDefaultFolder = async () => {
    return await browser.storage.local.get({ folder: "toolbar_____" });
  };

  componentDidMount() {
    this.getDefaultFolder().then(({ folder }) => {
      rootFolder.id = folder;
      this.initialBookmarks();
    });
    this.getTheme().then(theme => this.changeTheme(theme));
    browser.storage.onChanged.addListener(this.receiveOptions);
    browser.bookmarks.onChanged.addListener(this.receiveBookmarks);
    browser.bookmarks.onCreated.addListener(this.receiveBookmarks);
    browser.bookmarks.onMoved.addListener(this.receiveBookmarks);
    browser.bookmarks.onRemoved.addListener(this.receiveBookmarks);
  }

  componentWillUnmount() {
    browser.storage.onChanged.removeListener(this.receiveOptions);
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

  render() {
    let { bookmarks, theme, path, currentFolder } = this.state;
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

render(<App />, document.querySelector("#app"));
