import * as React from "react";
import * as Firestore from "firebase/firestore";
import { ProjectsManager } from "../class/ProjectsManager";
import { getCollection } from "../firebase";
import { IProject, ProjectStatus, Role } from "../class/Project";

interface Props {
  projectsManager: ProjectsManager;
}

const projectsCollection = getCollection<IProject>("/projects");

export function ProjectsForm(props: Props) {
  const onFormSubmit = (e: React.FormEvent) => {
    const projectForm = document.getElementById("new-project-form");
    if (!(projectForm && projectForm instanceof HTMLFormElement)) {
      return;
    }

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
      Firestore.addDoc(projectsCollection, projectData);
      const project = props.projectsManager.newProject(projectData);
      projectForm.reset();

      const modal = document.getElementById("new-project-modal");

      if (!(modal && modal instanceof HTMLDialogElement)) {
        return;
      }
      modal.close();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <form id="new-project-form" onSubmit={onFormSubmit}>
      <h2>New Project</h2>
      <div className="input-list">
        <div className="form-field-container">
          <label>
            <span className="material-symbols-rounded">apartment</span>Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="What's the name of your project?"
          />
          <p
            style={{
              color: "gray",
              fontSize: "var(--font-sm)",
              marginTop: 5,
              fontStyle: "italic",
            }}
          >
            TIP: Give it a short name
          </p>
        </div>
        <div className="form-field-container">
          <label>
            <span className="material-symbols-rounded"> subject </span>
            Description
          </label>
          <textarea
            name="description"
            cols={30}
            rows={5}
            placeholder="Give your description here"
            defaultValue={""}
          />
        </div>
        <div className="form-field-container">
          <label>
            <span className="material-symbols-rounded">account_circle </span>
            Role
          </label>
          <select name="role">
            <option>Architect</option>
            <option>Engineer</option>
            <option>Developer</option>
          </select>
        </div>
        <div className="form-field-container">
          <label>
            <span className="material-symbols-rounded">question_exchange </span>
            Status
          </label>
          <select name="status">
            <option>Pending</option>
            <option>Active</option>
            <option>Finished</option>
          </select>
        </div>
        <div className="form-field-container">
          <label htmlFor="finishDate">
            <span className="material-symbols-rounded">calendar_month</span>
            Finish Date
          </label>
          <input id="finishDate" name="finishDate" type="date" />
        </div>
      </div>
      <div className="botton-buttons">
        <div
          style={{
            display: "flex",
            columnGap: 10,
            padding: "10px 20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            id="close-modal-btn"
            type="button"
            style={{ backgroundColor: "transparent" }}
          >
            Cancel
          </button>
          <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
            Accept
          </button>
        </div>
      </div>
    </form>
  );
}
