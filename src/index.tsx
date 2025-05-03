import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Sidebar } from "./react-components/Sidebar";
import { ProjectsPage } from "./react-components/ProjectsPage";

import { IProject, ProjectStatus, Role } from "./class/Project";
import { UIManager } from "./class/UIManager";
import { ProjectDetailsPage } from "./react-components/ProjectDetailsPage";
import { ProjectsManager } from "./class/ProjectsManager";

const projectsManager = new ProjectsManager();

const rootElement = document.getElementById("app") as HTMLElement;
const appRoot = ReactDOM.createRoot(rootElement);
appRoot.render(
  <BrowserRouter>
    <Sidebar />
    <Routes>
      <Route
        path="/"
        element={<ProjectsPage projectsManager={projectsManager} />}
      />
      <Route
        path="/project/:id"
        element={<ProjectDetailsPage projectsManager={projectsManager} />}
      />
    </Routes>
  </BrowserRouter>
);

const uiManager = new UIManager();

const projectsButton = document.getElementById("projects-button");
const projectsPage = document.getElementById("projects-page");
if (projectsButton && projectsPage instanceof HTMLElement) {
  uiManager.setPageButton(projectsButton, projectsPage);
}

const userButton = document.getElementById("users-button");
const usersPage = document.getElementById("users-page");
if (userButton && usersPage instanceof HTMLElement) {
  uiManager.setPageButton(userButton, usersPage);
}

uiManager.setModalButton("new-project-btn", "new-project-modal");
uiManager.setModalButton(
  "close-modal-btn",
  "new-project-modal",
  "new-project-form"
);

const projectsListUI = document.getElementById("projects-list") as HTMLElement;
//const projectsManager = new ProjectsManager(projectsListUI);

const projectForm = document.getElementById("new-project-form");
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(projectForm);

    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      role: formData.get("role") as Role,
      finishDate: new Date(formData.get("finishDate") as string),
    };

    try {
      //const project = projectsManager.newProject(projectData);
      projectForm.reset();
      uiManager.toggleModal("new-project-modal");
    } catch (err) {
      uiManager.showErrorDialog((err as Error).message);
    }
  });
} else {
  console.warn("No new project form found");
}

const closeFormBtn = document.getElementById("close-modal-btn");
if (closeFormBtn) {
  closeFormBtn.addEventListener("click", () => {
    uiManager.toggleModal("new-project-modal");
  });
} else {
  console.warn("No close project form button found");
}

const closeAlertDialog = document.getElementById("alert-modal");
if (closeAlertDialog) {
  closeAlertDialog.addEventListener("click", () => {
    uiManager.toggleModal("new-project-modal");
  });
} else {
  console.warn("No close project form button found");
}

const exportProjectsBtn = document.getElementById("export-projects-btn");
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    //projectsManager.exportToJSON();
  });
}

const importProjectsBtn = document.getElementById("import-projects-btn");
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    //projectsManager.importFromJSON();
  });
}

document
  .getElementById("close-error-btn")
  ?.addEventListener("click", uiManager.closeErrorDialog);
