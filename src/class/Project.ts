import { v4 as uuidv4 } from "uuid";

export class ProjectsManager {}
export type ProjectStatus = "pending" | "active" | "finished";
export type Role = "architect" | "engineer" | "developer";

export interface IProject {
  name: string;
  description: string;
  status: ProjectStatus;
  role: Role;
  finishDate: Date;
}

export class Project implements IProject {
  name: string;
  description: string;
  status: "pending" | "active" | "finished";
  role: "architect" | "engineer" | "developer";
  finishDate: Date;

  ui: HTMLDivElement;
  cost: number = 0;
  progress: number = 0;
  id: string;

  constructor(data) {
    for (const key in data) {
      this[key] = data[key];
    }

    this.id = uuidv4();
    this.setUI();
  }

  setUI() {
    if (this.ui) return;
    this.ui = document.createElement("div");
    this.ui.className = "project-card";
    this.ui.innerHTML = `
      <div class="card-header">
        <p
          style="
            background-color: #ca8134;
            padding: 10px;
            border-radius: 8px;
            aspect-ratio: 1;
          "
        >
          HC
        </p>
        <div>
          <h5>${this.name}</h5>
          <p>${this.description}</p>
        </div>
      </div>
      <div class="card-content">
        <div class="card-property">
          <p style="color: #969696">Status</p>
          <p>${this.status}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696">Role</p>
          <p>${this.role}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696">Cost</p>
          <p>$${this.cost}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696">Estimated progress</p>
          <p>${this.progress * 100}%</p>
        </div>
      </div>
    `;
  }
}
