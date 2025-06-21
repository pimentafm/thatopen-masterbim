import * as React from "react";
import * as Router from "react-router-dom";
import { ProjectsManager } from "../class/ProjectsManager";
import { ProjectsForm } from "./ProjectsForm";

import { IFCViewer } from "./IFCViewer";

import { deleteDocument, updateDocument } from "../firebase";
import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui";

import { todoTool, TodoData, TodoCreator } from "../bim-components/TodoCreator";

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

  const components = new OBC.Components();
  const dashboard = React.useRef<HTMLDivElement>(null);
  const todoContainer = React.useRef<HTMLDivElement>(null);

  const navigateTo = Router.useNavigate();
  props.projectsManager.deleteProject = async (id) => {
    await deleteDocument("/projects", id);
    navigateTo("/");
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

  const onRowCreated = (event) => {
    event.stopImmediatePropagation()
    const { row } = event.detail
    row.addEventListener("click", () => {
      todoCreator.highlightTodo({
        name: row.data.Name,
        task: row.data.Task,
        priority: row.data.Priority,
        ifcGuids: JSON.parse(row.data.Guids),
        camera: JSON.parse(row.data.Camera)
      })
    })
  }


  const todoTable = BUI.Component.create<BUI.Table>(() => {
    return BUI.html`
      <bim-table @rowcreated=${onRowCreated}></bim-table>
    `
  })

  const addTodo = (data: TodoData) => {
    if (!todoTable) return
    const newData = {
      data: {
        Name: data.name,
        Task: data.task,
        Priority: data.priority,
        Date: new Date().toDateString(),
        Guids: JSON.stringify(data.ifcGuids),
        Camera: data.camera ? JSON.stringify(data.camera) : ""
      }
    }
    todoTable.data = [...todoTable.data, newData];
    todoTable.hiddenColumns = ["Guids", "Camera"];
  }

  const todoCreator = components.get(TodoCreator)
  todoCreator.onTodoCreated.add((data) => addTodo(data))

  React.useEffect(() => {
    dashboard.current?.appendChild(todoTable);
    const [ todoButton, todoPriorityButton ] = todoTool({ components })
    todoContainer.current?.appendChild(todoButton);
    todoContainer.current?.appendChild(todoPriorityButton);
  }, []);


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
          <div className="dashboard-card" style={{ flexGrow: 1 }} ref={dashboard}>
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
                ref={todoContainer}
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
              </div>
            </div>

          </div>
        </div>
        <IFCViewer components={components}/>
      </div>
    </div>
  );
}
