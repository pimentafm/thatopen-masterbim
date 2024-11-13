import { v4 as uuidv4 } from "uuid";
import { Utils } from "./Utils";

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
  status: ProjectStatus;
  role: Role;
  finishDate: Date;

  ui: HTMLDivElement;
  cost: number = 0;
  progress: number = 0;
  id: string;
  avatarColor: "#ffffff";

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
    const utils = new Utils();
    this.ui.innerHTML = `
      <div class="card-header">
        <p
          style="
            background-color: ${utils.getRandomColor()};
            padding: 10px;
            border-radius: 8px;
            aspect-ratio: 1;
          "
        >
          ${utils.getInitials(this.name)}
        </p>
        <div>
          <h5>${this.name}</h5>
          <p>${this.description}</p>
        </div>
      </div>
      <div class="card-content">
        <div class="card-property">
          <p style="color: #969696">Status</p>
          <p data-project-info="statusProperty" >${this.status}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696">Role</p>
          <p data-project-info="roleProperty" >${this.role}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696">Cost</p>
          <p data-project-info="costProperty" >$${this.cost}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696">Estimated progress</p>
          <p data-project-info="progressProperty">${this.progress * 100}%</p>
        </div>
      </div>
    `;
  }
}
