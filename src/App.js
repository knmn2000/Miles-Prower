import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import { Landing } from "./views/Landing";
import { Scraper } from "./views/Scraper";
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/scraper" component={Scraper} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
