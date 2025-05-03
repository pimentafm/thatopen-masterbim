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

  cost: number = 0;
  progress: number = 0;
  id: string;
  avatarColor: "#ffffff";

  constructor(data) {
    for (const key in data) {
      this[key] = data[key];
    }

    this.id = uuidv4();
  }
}
