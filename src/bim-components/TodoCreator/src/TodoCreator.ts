import * as OBC from "@thatopen/components"
import * as OBCF from "@thatopen/components-front"
import * as THREE from "three"
import { TodoData, TodoInput } from "./base-types"

export class TodoCreator extends OBC.Component {
    static uuid = "43eda07b-486c-44a3-b10d-80d144de4155"
    enabled = true
    onTodoCreated = new OBC.Event<TodoData>()

    private _world: OBC.World

    constructor(components: OBC.Components) {
        super(components)
        this.components.add(TodoCreator.uuid, this)
    }

    set world(world: OBC.World) {
        this._world = world
    }

    addTodo(data: TodoInput) {
        const fragments = this.components.get(OBC.FragmentsManager)
        const highlighter = this.components.get(OBCF.Highlighter)
        const guids = fragments.fragmentIdMapToGuids(highlighter.selection.select)

        const camera = this._world.camera
        if(!(camera.hasCameraControls())){
            throw new Error("Camera controls are not available in the current camera setup.")
        }

        const position = new THREE.Vector3()
        camera.controls.getPosition(position)
        const target = new THREE.Vector3()
        camera.controls.getTarget(target)
        
        const todoData: TodoData = {
            name: data.name,
            task: data.task,
            ifcGuids: guids,
            camera: {
                position,
                target
            }
        }
        this.onTodoCreated.trigger(todoData)
    }

    async highlightTodo(todo: TodoData) {
        const fragments = this.components.get(OBC.FragmentsManager);
        const fragmentIdMap = fragments.guidToFragmentIdMap(todo.ifcGuids);
        const highlighter = this.components.get(OBCF.Highlighter);
        highlighter.highlightByID("select", fragmentIdMap)    

        if (!this._world){
            throw new Error("World is not set for TodoCreator")
        }

        const camera = this._world.camera
        if(!(camera.hasCameraControls())){
            throw new Error("Camera controls are not available in the current camera setup.")
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
}