import { invoke } from "@tauri-apps/api/core"

function DeleteProject({opened, setOpened, projectId, setNavRoute}:
    {opened: boolean, setOpened: (arg: boolean)=>void, projectId: string, setNavRoute: (route: string)=>void}) {

    if (opened) {
        return (
            <div className="delete-project-container modal-container">
                <h2>Are you sure you want to delete this project?</h2>
                <button className="confirm-btn" onClick={async ()=>{
                    await invoke("delete_project", {project_id: projectId});
                    setNavRoute("/");
                    }}>Confirm</button>
                <button className="cancel-btn" onClick={()=>{setOpened(false)}}>Cancel</button>
            </div>
        )
    }
}

export default DeleteProject