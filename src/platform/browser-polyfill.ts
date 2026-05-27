import bookmarksBrowser from "#platform/demo/bookmarks";
import settingsBrowser from "#platform/demo/storage";

const browser = {
  ...bookmarksBrowser,
  storage: settingsBrowser.storage,
};

export { browser };
export default browser;
