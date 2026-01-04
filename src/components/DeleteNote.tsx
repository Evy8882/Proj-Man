import { invoke } from "@tauri-apps/api/core"

function DeleteNote({opened, setOpened, noteId, projectId}:
    {opened: boolean, setOpened: (arg: boolean)=>void, noteId: string, projectId: string}) {

    if (opened) {
        return (
            <div className="delete-note-container modal-container">
                <h2>Are you sure you want to delete this note?</h2>
                <button className="confirm-btn" onClick={async ()=>{
                    await invoke("delete_note", {project_id: projectId, note_id: noteId});
                    setOpened(false);
                    }}>Confirm</button>
                <button className="cancel-btn" onClick={()=>{setOpened(false)}}>Cancel</button>
            </div>
        )
    }
}

export default DeleteNote