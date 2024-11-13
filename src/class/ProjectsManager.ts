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

  editProject(name: string, updatedData: Partial<IProject>) {
    const project = this.list.find((project) => project.name === name);
    if (!project) {
      throw new Error(`Project with the name "${name}" does not exist!`);
    }
  
    // Update project properties
    if (updatedData.name && updatedData.name.length >= 5) {
      project.name = updatedData.name;
    } else if (updatedData.name) {
      throw new Error(`Project name cannot be less than 5 characters!`);
    }
  
    if (updatedData.description) {
      project.description = updatedData.description;
    }

    if (updatedData.status) {
      project.status = updatedData.status;
    }
  
    if (updatedData.role) {
      project.role = updatedData.role;
    }

    if (updatedData.finishDate) {
      project.finishDate = updatedData.finishDate;
    }
  
    // Update the UI if necessary
    const nameElement = project.ui.querySelector('[data-project-info="cardName"]');
    if (nameElement) {
      nameElement.textContent = project.name;
    }
    const descriptionElement = project.ui.querySelector('[data-project-info="cardDescription"]');
    if (descriptionElement) {
      descriptionElement.textContent = project.description;
    }
    const finishDateElement = project.ui.querySelector('[data-project-info="cardDate"]');
    if (finishDateElement) {
      finishDateElement.textContent = project.finishDate.toISOString();
    }
  
    // Reflect changes in the details page if it is currently displayed
    const detailsPage = document.getElementById("project-details");
    if (detailsPage && detailsPage.style.display === "flex") {
      this.setDetailsPage(project);
      this.setProjectProperties(project);
    }
  
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
      '[data-project-info="cardName"]'
    );
    if (cardName) {
      cardName.textContent = project.name;
    }
    const cardDescription = detailsPage.querySelector(
      '[data-project-info="cardDescription"]'
    );
    if (cardDescription) {
      cardDescription.textContent = project.description;
    }
    const cardStatus = detailsPage.querySelector(
      '[data-project-info="cardStatus"]'
    );
    if (cardStatus) {
      cardStatus.textContent = project.status;
    }
    const cardRole = detailsPage.querySelector(
      '[data-project-info="cardRole"]'
    );
    if (cardRole) {
      cardRole.textContent = project.role;
    }
    const cardDate = detailsPage.querySelector(
      '[data-project-info="cardDate"]'
    );
    if (cardDate) {
      cardDate.textContent = project.finishDate.toISOString().split('T')[0];
    }
  }

  private setProjectProperties(project: Project) {
    const detailsPage = document.getElementById("projects-page");
    if (!detailsPage) return;

    const name = detailsPage.querySelector("[data-project-info='nameProperty']");
    if (name) {
      name.textContent = project.name;
    }
    const description = detailsPage.querySelector("[data-project-info='descriptionProperty']");
    if (description) {
      description.textContent = project.description;
    }
    const status = detailsPage.querySelector("[data-project-info='statusProperty']");
    if (status) {
      status.textContent = project.status;
    }
    const role = detailsPage.querySelector("[data-project-info='roleProperty']");
    if (role) {
      role.textContent = project.role;
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
