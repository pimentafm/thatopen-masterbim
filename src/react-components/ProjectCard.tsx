import * as React from 'react'
import { Project } from '../class/Project'

interface Props {
  project: Project
}

export function ProjectCard(props: Props) {
  return (
    <div className="project-card">
      <div className="card-header">
        <p
          style={{
            backgroundColor: '#ca8134',
            padding: 10,
            borderRadius: 8,
            aspectRatio: 1,
          }}
        >
          FP
        </p>
        <div>
          <bim-label
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
            }}
          >
            {props.project.name}
          </bim-label>
          <bim-label style={{ color: '#fff' }}>
            {props.project.description}
          </bim-label>
        </div>
      </div>
      <div className="card-content">
        <div className="card-property">
          <bim-label style={{ color: '#969696' }}>Status</bim-label>
          <bim-label style={{ color: '#fff' }}>
            {props.project.status}
          </bim-label>
        </div>
        <div className="card-property">
          <bim-label style={{ color: '#969696' }}>Role</bim-label>
          <bim-label style={{ color: '#fff' }}>{props.project.role}</bim-label>
        </div>
        <div className="card-property">
          <bim-label style={{ color: '#969696' }}>Cost</bim-label>
          <bim-label style={{ color: '#fff' }}>${props.project.cost}</bim-label>
        </div>
        <div className="card-property">
          <bim-label style={{ color: '#969696' }}>Estimated progress</bim-label>
          <bim-label style={{ color: '#fff' }}>
            {props.project.progress * 100}%
          </bim-label>
        </div>
      </div>
    </div>
  )
}
