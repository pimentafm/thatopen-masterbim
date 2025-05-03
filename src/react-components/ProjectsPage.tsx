import * as React from "react";
import { useState, useEffect } from "react";

import { IProject, Project, ProjectStatus, Role } from "../class/Project";
import { ProjectsManager } from "../class/ProjectsManager";
import { ProjectCard } from "./ProjectCard";
import * as Router from "react-router-dom";

interface Props {
  projectsManager: ProjectsManager;
}

export function ProjectsPage(props: Props) {
  const [projects, setProjects] = useState<Project[]>(
    props.projectsManager.list
  );

  props.projectsManager.onProjectCreated = () => {
    setProjects([...props.projectsManager.list]);
  };
  props.projectsManager.onProjectDeleted = () => {
    setProjects([...props.projectsManager.list]);
  };

  const projectCards = projects.map((project) => {
    return (
      <Router.Link to={`/project/${project.id}`} key={project.id}>
        <ProjectCard project={project} />
      </Router.Link>
    );
  });

  useEffect(() => {
    console.log("Projects state updated", projects);
  }, [projects]);

  const onNewProjectClick = () => {
    const modal = document.getElementById("new-project-modal");
    if (!(modal && modal instanceof HTMLDialogElement)) {
      return;
    }
    modal.showModal();
  };

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
    <div id="projects-page" className="page" style={{ display: "block" }}>
      <dialog id="new-project-modal">
        <dialog id="error-modal" style={{ display: "none" }}>
          <p id="error-message" style={{ padding: 10 }} />
          <button
            id="close-error-btn"
            type="button"
            style={{ backgroundColor: "#26282b", padding: 10 }}
          >
            Close
          </button>
        </dialog>
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
                <span className="material-symbols-rounded">
                  account_circle{" "}
                </span>
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
                <span className="material-symbols-rounded">
                  question_exchange{" "}
                </span>
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
              <button
                type="submit"
                style={{ backgroundColor: "rgb(18, 145, 18)" }}
              >
                Accept
              </button>
            </div>
          </div>
        </form>
      </dialog>
      <header>
        <h2>Projects</h2>
        <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
          <span
            id="import-projects-btn"
            className="material-symbols-rounded action-icon"
          >
            file_upload
          </span>
          <span
            id="export-projects-btn"
            className="material-symbols-rounded action-icon"
          >
            file_download
          </span>
          <button id="new-project-btn" onClick={onNewProjectClick}>
            <span className="material-symbols-rounded">add</span>New Project
          </button>
        </div>
      </header>
      <div id="projects-list">{projectCards}</div>
    </div>
  );
}
