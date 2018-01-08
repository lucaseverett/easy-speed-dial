import "./styles/index.css";
import App from "./components/index.js";
import { data } from "./store.js";

data().then(bookmarks => {
  App(bookmarks);
});

document.title = "Toolbar Dial";
