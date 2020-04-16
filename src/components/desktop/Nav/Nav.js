import React from "react";
import "./nav.scss";
import NavButton from "./NavButton";
import { useHistory, useLocation  } from "react-router-dom";
import navMap from "./navMap";

export default function Nav() {
  const history = useHistory();
  const location = useLocation ();
  function handleClick(path) {
    history.push(path);
  }

  return (
    <div className="nav">
      <div className="nav-logo">
        <div className="logo"></div>
      </div>
      <div className="nav-buttons">
        {navMap.map(nav => (
          <NavButton
            onClick={() => {
              handleClick(nav.url);
            }}
            isActive={location.pathname === nav.url}
            icon={nav.icon}
          />
        ))}
      </div>
    </div>
  );
}
