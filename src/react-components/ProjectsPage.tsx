import * as React from "react";
import { useState, useEffect } from "react";
import * as Router from "react-router-dom";
import * as Firestore from "firebase/firestore";

import { IProject, Project } from "../class/Project";
import { ProjectsManager } from "../class/ProjectsManager";
import { ProjectCard } from "./ProjectCard";
import { SearchBox } from "./SearchBox";
import { ProjectsForm } from "./ProjectsForm";

import { getCollection } from "../firebase";

interface Props {
  projectsManager: ProjectsManager;
}

const projectsCollection = getCollection<IProject>("/projects");

export function ProjectsPage(props: Props) {
  const [projects, setProjects] = useState<Project[]>(
    props.projectsManager.list
  );

  props.projectsManager.onProjectCreated = () => {
    setProjects([...props.projectsManager.list]);
  };

  const getFirestoreProjects = async () => {
    const firebaseProjects = await Firestore.getDocs(projectsCollection);

    for (const doc of firebaseProjects.docs) {
      const data = doc.data();
      const project: IProject = {
        ...data,
        finishDate: (
          data.finishDate as unknown as Firestore.Timestamp
        ).toDate(),
      };

      try {
        props.projectsManager.newProject(project, doc.id);
      } catch (err) {
        console.log("Error creating project", err);
      }
    }
  };

  useEffect(() => {
    getFirestoreProjects();
  }, []);

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

  const onProjectSearch = (value: string) => {
    setProjects(props.projectsManager.filterProjects(value));
  };

  return (
    <div id="projects-page" className="page" style={{ display: "block" }}>
      <ProjectsForm projectsManager={props.projectsManager} />
      <header>
        <h2>Projects</h2>
        <SearchBox onChange={(value) => onProjectSearch(value)} />
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
      {projects.length > 0 ? (
        <div id="projects-list">{projectCards}</div>
      ) : (
        <p>There is no projects to display</p>
      )}
    </div>
  );
}
