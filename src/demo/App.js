import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Bookmarks } from "../bookmarks";
import { Settings } from "../settings";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/options">
          <Settings />
        </Route>
        <Route path="/">
          <Bookmarks />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
