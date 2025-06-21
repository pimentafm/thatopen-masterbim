import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"
import * as OBCF from "@thatopen/components-front"
import { TodoCreator } from "./TodoCreator"

export interface TodoUIState {
    components: OBC.Components
}

export const todoTool = (state: TodoUIState) => {
    const { components } = state
    const todoCreator = components.get(TodoCreator)

    const nameInput = document.createElement("bim-text-input")
    nameInput.label = "Name"
    const taskInput = document.createElement("bim-text-input")
    taskInput.label = "Task"

    const todoModal = BUI.Component.create<HTMLDialogElement>(() => {
        return BUI.html`
            <dialog>
                <bim-panel style="width: 20rem;">
                    <bim-panel-section label="To-Do" fixed>
                        <bim-label>Create A To-Do For Future</bim-label>
                        ${nameInput}
                        ${taskInput}
                        <bim-button
                            label="Create Todo"
                            @click=${() => {
                                const fragments = components.get(OBC.FragmentsManager)
                                const highlighter = components.get(OBCF.Highlighter)
                                const guids = fragments.fragmentIdMapToGuids(highlighter.selection.select)
                                const todoValue = { 
                                    name: nameInput.value,
                                    task: taskInput.value,
                                    ifcGuids: guids
                                }
                                todoCreator.addTodo(todoValue)
                                nameInput.value = ""
                                taskInput.value = ""
                                todoModal.close()
                            }}
                        ></bim-button>
                    </bim-panel-section>
                </bim-panel>
            </dialog>
        `
    })

    document.body.appendChild(todoModal)

    return BUI.Component.create<BUI.Button>(() => {
        return BUI.html`
            <bim-button
                @click=${() => todoModal.showModal()}
                icon="pajamas:todo-done"
                tooltip-title="To-Do"
            ></bim-button>
            `
    })
}