import * as OBC from '@thatopen/components'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as THREE from 'three'
import { TodoData, TodoInput } from './base-types'

export class TodoCreator extends OBC.Component implements OBC.Disposable {
  static uuid = '43eda07b-486c-44a3-b10d-80d144de4155'
  enabled = true
  onTodoCreated = new OBC.Event<TodoData>()
  onDisposed: OBC.Event<any> = new OBC.Event()

  private _world: OBC.World
  private _list: TodoData[] = []

  constructor(components: OBC.Components) {
    super(components)
    this.components.add(TodoCreator.uuid, this)
  }

  async dispose() {
    this.enabled = false
    this._list = []
    this.onDisposed.trigger()
  }

  setup() {
    const highlighter = this.components.get(OBCF.Highlighter)
    highlighter.add(
      `${TodoCreator.uuid}-priority-Low`,
      new THREE.Color(0x59bc59)
    )
    highlighter.add(
      `${TodoCreator.uuid}-priority-Medium`,
      new THREE.Color(0x597cff)
    )
    highlighter.add(
      `${TodoCreator.uuid}-priority-High`,
      new THREE.Color(0xff7676)
    )
  }

  set world(world: OBC.World) {
    this._world = world
  }

  set enablePriorityHighlight(value: boolean) {
    if (!this.enabled) return

    const fragments = this.components.get(OBC.FragmentsManager)
    const highlighter = this.components.get(OBCF.Highlighter)

    if (value) {
      for (const todo of this._list) {
        const fragmentIdMap = fragments.guidToFragmentIdMap(todo.ifcGuids)
        highlighter.highlightByID(
          `${TodoCreator.uuid}-priority-${todo.priority}`,
          fragmentIdMap,
          false,
          false
        )
      }
    } else {
      highlighter.clear()
    }
  }

  addTodo(data: TodoInput) {
    if (!this.enabled) return

    const fragments = this.components.get(OBC.FragmentsManager)
    const highlighter = this.components.get(OBCF.Highlighter)
    const guids = fragments.fragmentIdMapToGuids(highlighter.selection.select)

    const camera = this._world.camera
    if (!camera.hasCameraControls()) {
      throw new Error(
        'Camera controls are not available in the current camera setup.'
      )
    }

    const position = new THREE.Vector3()
    camera.controls.getPosition(position)
    const target = new THREE.Vector3()
    camera.controls.getTarget(target)

    const todoData: TodoData = {
      name: data.name,
      task: data.task,
      priority: data.priority,
      ifcGuids: guids,
      camera: {
        position,
        target,
      },
    }
    this._list.push(todoData)
    this.onTodoCreated.trigger(todoData)
  }

  deleteTodo(todo: TodoData) {
    if (!this.enabled) return
    const updateToDoList = this._list.filter((item) => {
      return item.name !== todo.name
    })
    this._list = updateToDoList
    this.onDisposed.trigger(todo)
  }

  async highlightTodo(todo: TodoData) {
    if (!this.enabled) return

    const fragments = this.components.get(OBC.FragmentsManager)
    const fragmentIdMap = fragments.guidToFragmentIdMap(todo.ifcGuids)
    const highlighter = this.components.get(OBCF.Highlighter)
    highlighter.highlightByID('select', fragmentIdMap)

    if (!this._world) {
      throw new Error('World is not set for TodoCreator')
    }

    const camera = this._world.camera
    if (!camera.hasCameraControls()) {
      throw new Error(
        'Camera controls are not available in the current camera setup.'
      )
    }

    await camera.controls.setLookAt(
      todo.camera.position.x,
      todo.camera.position.y,
      todo.camera.position.z,
      todo.camera.target.x,
      todo.camera.target.y,
      todo.camera.target.z,
      true
    )
  }

  addTodoMarker(todo: TodoData) {
    if (!this.enabled) return

    if (todo.ifcGuids.length === 0) return

    const fragments = this.components.get(OBC.FragmentsManager)
    const fragmentIdMap = fragments.guidToFragmentIdMap(todo.ifcGuids)
    const boundingBoxer = this.components.get(OBC.BoundingBoxer)
    boundingBoxer.addFragmentIdMap(fragmentIdMap)
    const { center } = boundingBoxer.getSphere()

    const label = BUI.Component.create<BUI.Label>(() => {
      return BUI.html`
                <bim-label
                    @mouseover=${() => {
                      const highlighter = this.components.get(OBCF.Highlighter)
                      highlighter.highlightByID(
                        'hover',
                        fragmentIdMap,
                        true,
                        false
                      )
                    }}
                    style="background-color: var(--bim-ui_bg-contrast-100); cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 999px; pointer-events: all;"
                    icon="fa:map-marker"
                ></bim-label>
            `
    })

    const marker = new OBCF.Mark(this._world, label)
    marker.three.position.copy(center)
  }
}
