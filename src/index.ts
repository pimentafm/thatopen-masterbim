import { IProject, ProjectStatus, Role } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";

function showModal(id) {
  const modal = document.getElementById(id);

  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal();
  } else {
    console.warn(`No modal found with id: ${id}`);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);

  if (modal && modal instanceof HTMLDialogElement) {
    modal.close();
  } else {
    console.warn(`No modal found with id: ${id}`);
  }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectsListUI);

const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    showModal("new-project-modal");
  });
} else {
  console.warn("No new project button found");
}

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
      closeModal("new-project-modal");
    } catch (err) {
      console.warn("Project name!");
    }
  });
} else {
  console.warn("No new project form found");
}

const closeFormBtn = document.getElementById("close-modal-btn");
if (closeFormBtn) {
  closeFormBtn.addEventListener("click", () => {
    closeModal("new-project-modal");
  });
} else {
  console.warn("No close project form button found");
}

const closeAlertDialog = document.getElementById("alert-modal");
if (closeAlertDialog) {
  closeAlertDialog.addEventListener("click", () => {
    closeModal("alert-modal");
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
