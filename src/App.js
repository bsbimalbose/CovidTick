import React, { useReducer, useMemo } from "react";
import "./App.scss";
import Nav from "./components/Nav/Nav";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import India from "./pages/india";
import Compare from "./pages/compare";
import reducer from "./store/reducer";
import Tips from "./pages/tips";

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
              <Route path={"/tips"} component={Tips} />
            </Switch>
          </div>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
