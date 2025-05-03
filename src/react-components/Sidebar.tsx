import * as React from "react";
import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <aside id="sidebar">
      <img id="company-logo" src="./assets/company-logo.svg" alt="" />
      <ul id="nav-buttons">
        <Link to="/">
          <li id="projects-button">
            <span className="material-symbols-rounded"> apartment </span>Project
          </li>
        </Link>
        <Link to="/project">
          <li id="users-button">
            <span className="material-symbols-rounded"> account_circle </span>
            Users
          </li>
        </Link>
      </ul>
    </aside>
  );
}
