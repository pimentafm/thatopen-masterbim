import * as OBC from "@thatopen/components"

export interface TodoData {
    name: string
    task: string
}

export class TodoCreator extends OBC.Component {
    static uuid = "43eda07b-486c-44a3-b10d-80d144de4155"
    enabled = true
    onTodoCreated = new OBC.Event<TodoData>()

    constructor(components: OBC.Components) {
        super(components)
        this.components.add(TodoCreator.uuid, this)
    }

    addTodo(data: TodoData) {
        this.onTodoCreated.trigger(data)
    }
}