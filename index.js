function showModal(id) {
  const modal = document.getElementById(id);
  modal.showModal();
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
if (projectForm) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(projectForm);

    const project = {
      name: formData.get("name"),
      description: formData.get("description"),
      status: formData.get("status"),
      role: formData.get("role"),
      finishDate: formData.get("finishDate"),
    };

    console.log(project);
  });
} else {
  console.warn("No new project form found");
}
