export type Priority = 'Low' | 'Medium' | 'High'

export interface TodoInput {
  name: string
  task: string
  priority: Priority
}

export interface TodoData {
  name: string
  task: string
  priority: Priority
  ifcGuids: string[]
  camera: { position: THREE.Vector3; target: THREE.Vector3 }
}
