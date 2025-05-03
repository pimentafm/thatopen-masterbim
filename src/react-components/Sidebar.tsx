import * as React from "react";

export function Sidebar(){
    return(
        <aside id="sidebar">
        <img id="company-logo" src="./assets/company-logo.svg" alt="" />
        <ul id="nav-buttons">
          <li id="projects-button">
            <span className="material-symbols-rounded"> apartment </span>Project
          </li>
          <li id="users-button">
            <span className="material-symbols-rounded"> account_circle </span>Users
          </li>
        </ul>
      </aside>
    )
}