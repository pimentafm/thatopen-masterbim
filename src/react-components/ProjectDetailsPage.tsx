import * as React from "react";
import * as Router from "react-router-dom";
import { ProjectsManager } from "../class/ProjectsManager";
import { ProjectsForm } from "./ProjectsForm";

import { ThreeViewer } from "./ThreeViewer";

import { deleteDocument, updateDocument } from "../firebase";
import * as BUI from "@thatopen/ui";

interface Props {
  projectsManager: ProjectsManager;
}

export function ProjectDetailsPage(props: Props) {
  const routeParams = Router.useParams<{ id: string }>();

  if (!routeParams.id) {
    return <p>Project not found</p>;
  }

  const project = props.projectsManager.getProject(routeParams.id);

  if (!project) {
    return <p>The Project ID {routeParams.id} wasn't found.</p>;
  }

  const navigateTo = Router.useNavigate();
  props.projectsManager.deleteProject = async (id) => {
    await deleteDocument("/projects", id);
    navigateTo("/");
  };

  const onTableCreated = (element?: Element) => {
    if (!element) {
      return;
    }

    const toDoTable = element as BUI.Table;

    toDoTable.data = [
      {
        data: {
          Task: "Do Rebar for Columns",
          Date: "2023-10-01",
        },
      },
    ];
  };

  const onEditProjectClick = () => {
    const modal = document.getElementById("new-project-modal");
    if (!(modal && modal instanceof HTMLDialogElement)) {
      return;
    }
    modal.showModal();
  };

  props.projectsManager.updateProject = async (id) => {
    const projectData = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      cost: project.cost,
      role: project.role,
      finishDate: project.finishDate,
      progress: project.progress,
    };

    await updateDocument("/projects", id, projectData);
  };

  return (
    <div id="project-details" className="page">
      <header>
        <div>
          <bim-label
            style={{ color: "#fff", fontSize: "var(--font-xl)" }}
            data-project-info="name"
          >
            {project.name}
          </bim-label>
          <bim-label
            data-project-info="description"
            style={{ color: "#969696", fontSize: "15px" }}
          >
            {project.description}
          </bim-label>
        </div>
        <div>
          <bim-button
            label="Delete"
            icon="material-symbols:delete"
            onClick={() => props.projectsManager.deleteProject(project.id)}
            style={{ backgroundColor: "red" }}
          ></bim-button>
        </div>
      </header>
      <div className="main-page-content">
        <ProjectsForm projectsManager={props.projectsManager} />
        <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
          <div className="dashboard-card" style={{ padding: "30px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 30px",
                marginBottom: 30,
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  backgroundColor: "#ca8134",
                  aspectRatio: 1,
                  borderRadius: "100%",
                  padding: 12,
                }}
              >
                HC
              </p>
              <div>
                <bim-button
                  label="Edit"
                  icon="material-symbols:edit"
                  className="btn-secondary"
                  onClick={() => onEditProjectClick()}
                ></bim-button>
              </div>
            </div>
            <div style={{ padding: "0 30px" }}>
              <div>
                <bim-label
                  style={{ color: "#fff", fontSize: "var(--font-xl)" }}
                  data-project-info="cardName"
                >
                  {project.name}
                </bim-label>
                <bim-label data-project-info="cardDescription">
                  {project.description}
                </bim-label>
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: 30,
                  padding: "30px 0px",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <bim-label
                    style={{ color: "#969696", fontSize: "var(--font-sm)" }}
                  >
                    Status
                  </bim-label>
                  <bim-label style={{ color: "#fff" }}>
                    {project.status}
                  </bim-label>
                </div>
                <div>
                  <bim-label
                    style={{ color: "#969696", fontSize: "var(--font-sm)" }}
                  >
                    Cost
                  </bim-label>
                  <bim-label style={{ color: "#fff" }}>
                    ${project.cost}
                  </bim-label>
                </div>
                <div>
                  <bim-label
                    style={{ color: "#969696", fontSize: "var(--font-sm)" }}
                  >
                    Role
                  </bim-label>
                  <bim-label style={{ color: "#fff" }}>
                    {project.role}
                  </bim-label>
                </div>
                <div>
                  <bim-label
                    style={{ color: "#969696", fontSize: "var(--font-sm)" }}
                  >
                    Finish Date
                  </bim-label>
                  <bim-label style={{ color: "#fff" }}>
                    {project.finishDate.toDateString()}
                  </bim-label>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#404040",
                  borderRadius: 9999,
                  overflow: "auto",
                }}
              >
                <div
                  style={{
                    width: `${project.progress * 100}%`,
                    backgroundColor: "green",
                    padding: "4px 0",
                    textAlign: "center",
                  }}
                >
                  {project.progress * 100}%
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-card" style={{ flexGrow: 1 }}>
            <div
              style={{
                padding: "20px 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <bim-label style={{ color: "#fff", fontSize: "var(--font-lg)" }}>
                To-Do
              </bim-label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  columnGap: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: 10,
                  }}
                >
                  <bim-label
                    icon="material-symbols:search"
                    style={{ color: "#fff" }}
                  ></bim-label>
                  <bim-text-input placeholder="Search To-Do's name"></bim-text-input>
                </div>
                <bim-label
                  icon="material-symbols:add"
                  style={{ color: "#fff" }}
                ></bim-label>
              </div>
            </div>
            <bim-table id="todo-table" ref={onTableCreated}></bim-table>
          </div>
        </div>
        <ThreeViewer />
      </div>
    </div>
  );
}
