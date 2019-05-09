import React from "react";
import NavLink from "./navLink";

export default props => (
  <div>
    <ul>
      <li>
        <NavLink to="targets">Targets</NavLink>
      </li>
    </ul>
    {props.children}
  </div>
);
