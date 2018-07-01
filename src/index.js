import { h, app } from "hyperapp";
import "./styles/index.css";
import view from "./view.js";
import state from "./state.js";
import actions from "./actions.js";

state().then(bookmarks => {
  app(bookmarks, actions, view, document.body);
});
