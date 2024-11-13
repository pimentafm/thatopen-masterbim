import { IProject, ProjectStatus, Role } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";
import { UIManager } from "./class/UIManager";

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
uiManager.setModalButton("edit-project-details-btn", "edit-project-details-modal");
uiManager.setModalButton(
  "close-modal-btn",
  "new-project-modal",
  "new-project-form"
);

const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectsListUI);

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
      const project = projectsManager.newProject(projectData);
      projectForm.reset();
      uiManager.toggleModal("new-project-modal");
    } catch (err) {
      uiManager.showErrorDialog((err as Error).message);
    }
  });
} else {
  console.warn("No new project form found");
}

const projectEditForm = document.getElementById("edit-project-details-form");
if (projectEditForm && projectEditForm instanceof HTMLFormElement) {
  projectEditForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameElement = document.querySelector('[data-project-info="cardName"]');
    if (nameElement) {
      const name = nameElement.textContent;
      if (name) {
        const formData = new FormData(projectEditForm);

        const updatedData: Partial<IProject> = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          status: formData.get("status") as ProjectStatus,
          role: formData.get("role") as Role,
          finishDate: formData.get("finishDate") ? new Date(formData.get("finishDate") as string) : undefined,
        };

        try {
          const project = projectsManager.editProject(name, updatedData);
          projectEditForm.reset();
          uiManager.toggleModal("edit-project-details-modal");
        } catch (err) {
          uiManager.showErrorDialog((err as Error).message);
        }
      }
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

const closeEditFormBtn = document.getElementById("edit-project-details-close-modal-btn");
if (closeEditFormBtn) {
  closeEditFormBtn.addEventListener("click", () => {
    uiManager.toggleModal("edit-project-details-modal");
  });
} else {
  console.warn("No close project form button found");
}

const closeAlertDialog = document.getElementById("error-modal");
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
    projectsManager.exportToJSON();
  });
}

const importProjectsBtn = document.getElementById("import-projects-btn");
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON();
  });
}

  