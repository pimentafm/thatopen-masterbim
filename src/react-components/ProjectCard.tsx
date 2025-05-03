import * as React from "react";
import { Project } from "../class/Project";

interface Props {
  project: Project;
}

export function ProjectCard(props: Props) {
  return (
    <div className="project-card">
      <div className="card-header">
        <p
          style={{
            backgroundColor: "#ca8134",
            padding: 10,
            borderRadius: 8,
            aspectRatio: 1,
          }}
        >
          FP
        </p>
        <div>
          <h5>{props.project.name}</h5>
          <p>{props.project.description}</p>
        </div>
      </div>
      <div className="card-content">
        <div className="card-property">
          <p style={{ color: "#969696" }}>Status</p>
          <p>{props.project.status}</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Role</p>
          <p>{props.project.role}</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Cost</p>
          <p>$ {props.project.cost}</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Estimated progress</p>
          <p>{props.project.progress}</p>
        </div>
      </div>
    </div>
  );
}
