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

let scrollPosition = 0;

window.onscroll = () => {
  scrollPosition = window.pageYOffset;
};

class App extends React.Component {
  state = {
    bookmarks: [],
    theme: "DefaultLight",
    currentFolder: rootFolder,
    folderTarget: "new",
    path: []
  };

  getDefaultFolder = async () => {
    return await browser.storage.local.get({ folder: rootFolder.id });
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

  getTheme = async () => {
    return await browser.storage.local.get({ theme: this.state.DefaultTheme });
  };

  changeTheme = ({ theme }) => {
    if (theme) {
      this.setState({
        theme
      });
    }
  };

  getTarget = async () => {
    return await browser.storage.local.get({ target: "new" });
  };

  changeTarget = ({ target }) => {
    if (target) {
      this.setState({
        folderTarget: target
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
    if (change["target"]) {
      this.changeTarget({ target: change["target"]["newValue"] });
    }
  };

  initialBookmarks = () => {
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
      console.log(e);
    }
    return filter(bookmarks).sort(sort);
  };

  updateBookmarks = () => {
    this.getBookmarks(this.state.currentFolder.id).then(bookmarks => {
      if (bookmarks) {
        this.setState({ bookmarks });
      }
    });
  };

  receiveBookmarks = () => {
    let getChildren = browser.bookmarks.get(this.state.currentFolder.id);
    getChildren.then(this.updateBookmarks, this.initialBookmarks);
  };

  componentDidMount() {
    this.getDefaultFolder().then(({ folder }) => {
      rootFolder.id = folder;
      this.initialBookmarks();
    });
    this.getTheme().then(theme => this.changeTheme(theme));
    this.getTarget().then(target => this.changeTarget(target));
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

  componentDidUpdate(prevProps, prevState) {
    this.setFocus();
    if (prevState.currentFolder !== this.state.currentFolder) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, scrollPosition);
    }
  }

  render() {
    let { bookmarks, theme, path, currentFolder, folderTarget } = this.state;
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
            isRoot: currentFolder.id === rootFolder.id,
            folderTarget
          }}
        />
      </div>
    );
  }
}

render(<App />, document.querySelector("#app"));
