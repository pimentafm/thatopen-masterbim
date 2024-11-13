import { IProject, Project } from "./Project";

export class ProjectsManager {
  list: Project[] = [];
  ui: HTMLElement;

  constructor(container: HTMLElement) {
    this.ui = container;
  }

  newProject(data: IProject) {
    const projectNames = this.list.map((project) => project.name);
    const nameInUse = projectNames.includes(data.name);
    if (nameInUse) {
      throw new Error(`A project with the name "${data.name}" already exist!`);
    }
    if (data.name.length < 5) {
      throw new Error(`Project name cannot be less than 5 characters!`);
    }

    const project = new Project(data);
    project.ui.addEventListener("click", () => {
      const projectsPage = document.getElementById("projects-page");
      const detailsPage = document.getElementById("project-details");
      if (!projectsPage || !detailsPage) {
        return;
      }
      projectsPage.style.display = "none";
      detailsPage.style.display = "flex";
      this.setDetailsPage(project);
    });
    this.ui.append(project.ui);
    this.list.push(project);
    return project;
  }

  editProject(data: IProject) {
    const projectNames = this.list.map((project) => project.name);
    const nameInUse = projectNames.includes(data.name);
    if (nameInUse) {
      throw new Error(`A project with the name "${data.name}" already exist!`);
    }
    if (data.name.length < 5) {
      throw new Error(`Project name cannot be less than 5 characters!`);
    }

    const project = new Project(data);
    project.ui.addEventListener("click", () => {
      const projectsPage = document.getElementById("projects-page");
      const detailsPage = document.getElementById("project-details");
      if (!projectsPage || !detailsPage) {
        return;
      }
      projectsPage.style.display = "none";
      detailsPage.style.display = "flex";
      this.setDetailsPage(project);
    });
    this.ui.append(project.ui);
    this.list.push(project);
    return project;
  }

  private setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details");
    if (!detailsPage) return;

    const name = detailsPage.querySelector("[data-project-info='name']");
    if (name) {
      name.textContent = project.name;
    }
    const description = detailsPage.querySelector(
      "[data-project-info='description']"
    );
    if (description) {
      description.textContent = project.description;
    }
    const cardName = detailsPage.querySelector(
      "[data-project-info='cardName']"
    );
    if (cardName) {
      cardName.textContent = project.name;
    }
    const cardDescription = detailsPage.querySelector(
      "[data-project-info='cardDescription']"
    );
    if (cardDescription) {
      cardDescription.textContent = project.description;
    }
  }

  getProject(id: string) {
    const project = this.list.find((project) => project.id === id);
    return project;
  }

  getProjectByName(name: string) {
    const project = this.list.find((project) => project.name === name);
    return project;
  }

  deleteProject(id: string) {
    const project = this.getProject(id);
    if (!project) return;
    project.ui.remove();
    const remaining = this.list.filter((project) => project.id !== id);
    this.list = remaining;
  }

  exportToJSON(fileName: string = "projects") {
    function replacer(key, value) {
      if (key !== "ui") {
        return value;
      }
    }
    const json = JSON.stringify(this.list, replacer, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  importFromJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const json = reader.result;
      if (!json) {
        return;
      }
      const projects: IProject[] = JSON.parse(json as string);
      for (const project of projects) {
        try {
          this.newProject(project);
        } catch (error) {}
      }
    });
    input.addEventListener("change", () => {
      const filesList = input.files;
      if (!filesList) {
        return;
      }
      reader.readAsText(filesList[0]);
    });
    input.click();
  }
}
