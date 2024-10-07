import { IProject, Project } from "./Project";

export class ProjectsManager {
  list: Project[] = [];
  ui: HTMLElement;

  constructor(container: HTMLElement) {
    this.ui = container;
  }

  newProject(data: IProject) {
    const projectNames = this.list.map((project) => {
      return project.name;
    });

    const nameInUse = projectNames.includes(data.name);
    if (nameInUse) throw new Error("Project name already in use");

    const project = new Project(data);
    this.ui.appendChild(project.ui);
    this.list.push(project);
    return project;
  }

  getProject(id: string) {
    const project = this.list.find((project) => project.id === id);
    return project;
  }

  deleteProject(id: string) {
    const project = this.getProject(id);
    if (!project) return;
    project.ui.remove();
    const remaining = this.list.filter((project) => project.id !== id);
    this.list = remaining;
  }

  getProjects() {
    return this.list;
  }

  exportToJson() {}

  importFromJson() {}
}
