import { IProject, Project } from './Project'

export class ProjectsManager {
  list: Project[] = []
  onProjectCreated = (project: Project) => {}
  onProjectDeleted = (id: string) => {}
  onProjectUpdate = (project: Project) => {}

  filterProjects(value: string) {
    const filteredProjects = this.list.filter((project) => {
      return project.name.includes(value)
    })

    return filteredProjects
  }

  newProject(data: IProject, id?: string) {
    const projectNames = this.list.map((project) => project.name)
    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {
      throw new Error(`A project with the name "${data.name}" already exist!`)
    }
    if (data.name.length < 5) {
      throw new Error(`Project name cannot be less than 5 characters!`)
    }

    const project = new Project(data, id)
    this.list.push(project)
    this.onProjectCreated(project)
    return project
  }

  getProject(id: string) {
    const project = this.list.find((project) => project.id === id)
    return project
  }

  deleteProject(id: string) {
    const project = this.getProject(id)
    if (!project) return
    const remaining = this.list.filter((project) => project.id !== id)
    this.list = remaining
    this.onProjectDeleted(id)
  }

  updateProject(id: string) {
    const project = this.getProject(id)
    if (!project) return
    const remaining = this.list.filter((project) => project.id !== id)
    this.list = remaining
    this.onProjectUpdate(project)
  }

  exportToJSON(fileName: string = 'projects') {
    function replacer(key: string, value: any) {
      if (key !== 'ui') {
        return value
      }
    }
    const json = JSON.stringify(this.list, replacer, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  importFromJSON() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const json = reader.result
      if (!json) {
        return
      }
      const projects: IProject[] = JSON.parse(json as string)
      for (const project of projects) {
        try {
          this.newProject(project)
        } catch (error) {}
      }
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) {
        return
      }
      reader.readAsText(filesList[0])
    })
    input.click()
  }
}
