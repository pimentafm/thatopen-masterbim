import { IProject, Project, ProjectStatus, Role } from "./class/Project";

function showModal(id) {
  const modal = document.getElementById(id);

  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal();
  } else {
    console.warn(`No modal found with id: ${id}`);
  }
}

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

    const project = new Project(projectData);

    console.log(project);
  });
} else {
  console.warn("No new project form found");
}
