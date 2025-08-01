import * as React from 'react'
import { useState, useEffect } from 'react'
import * as Router from 'react-router-dom'
import * as Firestore from 'firebase/firestore'

import { IProject, Project } from '../class/Project'
import { ProjectsManager } from '../class/ProjectsManager'
import { ProjectCard } from './ProjectCard'
import { SearchBox } from './SearchBox'
import { ProjectsForm } from './ProjectsForm'

import { getCollection } from '../firebase'
import * as BUI from '@thatopen/ui'

interface Props {
  projectsManager: ProjectsManager
}

const projectsCollection = getCollection<IProject>('/projects')

export function ProjectsPage(props: Props) {
  const [projects, setProjects] = useState<Project[]>(
    props.projectsManager.list
  )

  props.projectsManager.onProjectCreated = () => {
    setProjects([...props.projectsManager.list])
  }

  const getFirestoreProjects = async () => {
    const firebaseProjects = await Firestore.getDocs(projectsCollection)

    for (const doc of firebaseProjects.docs) {
      const data = doc.data()
      const project: IProject = {
        ...data,
        finishDate: (
          data.finishDate as unknown as Firestore.Timestamp
        ).toDate(),
      }

      try {
        props.projectsManager.newProject(project, doc.id)
      } catch (err) {
        console.log('Error creating project', err)
      }
    }
  }

  useEffect(() => {
    getFirestoreProjects()
  }, [])

  const projectCards = projects.map((project) => {
    return (
      <Router.Link to={`/project/${project.id}`} key={project.id}>
        <ProjectCard project={project} />
      </Router.Link>
    )
  })

  useEffect(() => {
    console.log('Projects state updated', projects)
  }, [projects])

  const onNewProjectClick = () => {
    const modal = document.getElementById('new-project-modal')
    if (!(modal && modal instanceof HTMLDialogElement)) {
      return
    }
    modal.showModal()
  }

  const onImportProject = () => {
    props.projectsManager.importFromJSON()
  }

  const onExportProject = () => {
    props.projectsManager.exportToJSON()
  }

  const onProjectSearch = (value: string) => {
    setProjects(props.projectsManager.filterProjects(value))
  }

  const importButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
          <bim-button
            id="import-projects-btn"
            icon="iconoir:import"
            @click=${onImportProject}
          ></bim-button>     
    `
  })

  const exportButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
          <bim-button
            id="export-projects-btn"
            icon="ph:export"
            @click=${onExportProject}
          ></bim-button>     
    `
  })

  const newProjectButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
          <bim-button
            id="new-project-btn"
            label="New project"
            icon="fluent:add-20-regular"
            @click=${onNewProjectClick}
          ></bim-button>  
    `
  })

  useEffect(() => {
    const projectControls = document.getElementById('project-page-controls')
    projectControls?.appendChild(importButton)
    projectControls?.appendChild(exportButton)
    projectControls?.appendChild(newProjectButton)

    const cancelButton = document.getElementById('close-modal-btn')
    cancelButton?.addEventListener('click', () => {
      const modal = document.getElementById('new-project-modal')
      if (!(modal && modal instanceof HTMLDialogElement)) {
        return
      }
      modal.close()
    })
  }, [])

  return (
    <div id="projects-page" className="page" style={{ display: 'block' }}>
      <ProjectsForm projectsManager={props.projectsManager} />
      <header>
        <bim-label>Projects</bim-label>
        <SearchBox onChange={(value) => onProjectSearch(value)} />
        <div
          id="project-page-controls"
          style={{ display: 'flex', alignItems: 'center', columnGap: 15 }}
        ></div>
      </header>
      {projects.length > 0 ? (
        <div id="projects-list">{projectCards}</div>
      ) : (
        <p>There is no projects to display</p>
      )}
    </div>
  )
}
