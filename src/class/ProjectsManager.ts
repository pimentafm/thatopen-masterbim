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

  exportToJson(fileName: string = "projects") {
    const json = JSON.stringify(this.list, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importFromJson() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const json = reader.result;
      if (!json) return;
      const projects: IProject[] = JSON.parse(json as string);

      for (const project of projects) {
        try {
          this.newProject(project);
        } catch (error) {
          alert(error);
        }
      }
    });

    input.addEventListener("change", () => {
      const filesList = input.files;
      if (!filesList) return;
      reader.readAsText(filesList[0]);
    });

    input.click();
  }
}
