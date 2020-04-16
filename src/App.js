import React, { useReducer, useMemo, useEffect } from "react";
import "./App.scss";
import Nav from "./components/desktop/Nav/Nav";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import India from "./pages/india";
import Compare from "./pages/compare";
import reducer from "./store/reducer";

export const AppContext = React.createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, {});
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="App">
          <Nav />
          <div className="app-content-wrap">
            <Switch>
              <Route path={"/"} exact component={Dashboard} />
              <Route path={"/india"} component={India} />
              <Route path={"/compare"} component={Compare} />
            </Switch>
          </div>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
