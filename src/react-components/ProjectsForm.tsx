import * as React from 'react'
import * as Firestore from 'firebase/firestore'
import { ProjectsManager } from '../class/ProjectsManager'
import { getCollection } from '../firebase'
import { IProject, ProjectStatus, Role } from '../class/Project'

interface Props {
  projectsManager: ProjectsManager
}

const projectsCollection = getCollection<IProject>('/projects')

export function ProjectsForm(props: Props) {
  const onFormSubmit = (e: React.FormEvent) => {
    const projectForm = document.getElementById('new-project-form')
    if (!(projectForm && projectForm instanceof HTMLFormElement)) {
      return
    }

    e.preventDefault()
    const formData = new FormData(projectForm)

    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      role: formData.get('role') as Role,
      finishDate: new Date(formData.get('finishDate') as string),
    }

    try {
      Firestore.addDoc(projectsCollection, projectData)
      const project = props.projectsManager.newProject(projectData)
      projectForm.reset()

      const modal = document.getElementById('new-project-modal')

      if (!(modal && modal instanceof HTMLDialogElement)) {
        return
      }
      modal.close()
    } catch (err) {
      alert((err as Error).message)
    }
  }

  return (
    <dialog id="new-project-modal">
      <dialog id="error-modal" style={{ display: 'none' }}>
        <p id="error-message" style={{ padding: 10 }} />
        <button
          id="close-error-btn"
          type="button"
          style={{ backgroundColor: '#26282b', padding: 10 }}
        >
          Close
        </button>
      </dialog>

      <form id="new-project-form" onSubmit={onFormSubmit}>
        <h2>New Project</h2>
        <div className="input-list">
          <div className="form-field-container">
            <bim-label
              icon="material-symbols:apartment"
              style={{ marginBottom: 5 }}
            >
              Name
            </bim-label>
            <bim-text-input
              name="name"
              type="text"
              placeholder="What's the name of your project?"
            ></bim-text-input>
            <bim-label
              style={{
                color: 'gray',
                fontSize: 'var(--font-sm)',
                marginTop: 5,
                fontStyle: 'italic',
              }}
            >
              TIP: Give it a short name
            </bim-label>
          </div>
          <div className="form-field-container">
            <bim-label
              icon="material-symbols:subject"
              style={{ marginBottom: 5 }}
            >
              Description
            </bim-label>
            <textarea
              name="description"
              cols={30}
              rows={5}
              placeholder="Give your description here"
              defaultValue={''}
            />
          </div>
          <div className="form-field-container">
            <bim-label
              icon="material-symbols:person"
              style={{ marginBottom: 5 }}
            >
              Role
            </bim-label>
            <bim-dropdown name="role">
              <bim-option>Architect</bim-option>
              <bim-option>Engineer</bim-option>
              <bim-option>Developer</bim-option>
            </bim-dropdown>
          </div>
          <div className="form-field-container">
            <bim-label icon="material-symbols:info" style={{ marginBottom: 5 }}>
              Status
            </bim-label>
            <bim-dropdown name="status">
              <bim-option>Pending</bim-option>
              <bim-option>Active</bim-option>
              <bim-option>Finished</bim-option>
            </bim-dropdown>
          </div>
          <div className="form-field-container">
            <bim-label icon="material-symbols:info" style={{ marginBottom: 5 }}>
              Finish Date
            </bim-label>
            <bim-text-input
              id="finishDate"
              type="date"
              name="finishDate"
            ></bim-text-input>
          </div>
        </div>
        <div className="botton-buttons">
          <div
            style={{
              display: 'flex',
              columnGap: 10,
              padding: '10px 20px',
              justifyContent: 'flex-end',
            }}
          >
            <bim-button
              id="close-modal-btn"
              type="button"
              label="Cancel"
            ></bim-button>
            <bim-button
              type="submit"
              name="submit"
              label="Accept"
              style={{ backgroundColor: 'rgb(18, 145, 18)' }}
            ></bim-button>
          </div>
        </div>
      </form>
    </dialog>
  )
}
