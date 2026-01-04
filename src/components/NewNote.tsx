import { useState, useEffect } from "react"
import { invoke } from "@tauri-apps/api/core";

function NewNote({opened, setOpened, projectId}: {opened: boolean; setOpened: (opened: boolean) => void, projectId: string}) {
    const [title, setTitle] = useState<string>("");

    async function saveChanges() {
        await invoke("new_note", {project_id: projectId, name: title});
        setOpened(false);
    }

    useEffect(() => {
        setTitle("");
    }, [opened]);

    if (!opened) {
        return null;
    }
    return (
        <div className="new-note-container">
            <h2>New Note</h2>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <button className="confirm-btn" onClick={saveChanges}>Save</button>
            <button className="cancel-btn" onClick={()=>{setOpened(false)}}>Cancel</button>
        </div>
    )
}

export default NewNote;