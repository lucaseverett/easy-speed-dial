import { Bookmarks } from "../bookmarks";
import { Settings } from "../settings";

function App() {
  return window.location.pathname.slice(1) === "options" ? (
    <Settings />
  ) : (
    <Bookmarks />
  );
}

export default App;
