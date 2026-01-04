import { invoke } from "@tauri-apps/api/core"
import { useEffect, useState } from "react"

function EditTodo({opened, setOpened, projectId, todoId, todoTitle}: {opened: boolean, setOpened: (arg: boolean)=>void, projectId: string, todoId: string, todoTitle: string}) {
    const [title, setTitle] = useState<string>(todoTitle);

    async function saveChanges() {
        await invoke("set_todo_title", {project_id: projectId, todo_id: todoId, new_title: title});
        setOpened(false);
    }

    useEffect(()=>{
        setTitle(todoTitle);
    }, [todoTitle]);

    if (opened) {
        return (
            <div className="edit-todo-container modal-container">
                <h2>Edit Todo</h2>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <button className="confirm-btn" onClick={saveChanges}>Save</button>
                <button className="cancel-btn" onClick={()=>{setOpened(false)}}>Cancel</button>
            </div>
        )
    }
}

export default EditTodo