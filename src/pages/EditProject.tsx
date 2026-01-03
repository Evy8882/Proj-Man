import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./Project.css"
import ProjBar from "../components/ProjBar";

function EditProject({setNavRoute, projectId}: {setNavRoute: (route: string) => void, projectId: string}) {
    const [notFound, setNotFound] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");

    async function getProjectById(id: string) {
        const projectJson = await invoke<string>("get_project_by_id", {project_id: id});
        if (projectJson === "Not found") {
            setNotFound(true);
        }else {
            const project = JSON.parse(projectJson);
            setProjectName(project.name);
            setProjectDescription(project.description);
        }
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await invoke("update_project", {
            project_id: projectId,
            name: projectName,
            description: projectDescription
        });
        setNavRoute(`/project/${projectId}`);
    }
    

    useEffect(() => {
        getProjectById(projectId);
    }, [projectId])

    if (notFound) {
        return (
            <div className="project-container container">
                <button className="go-home-btn" onClick={() => setNavRoute("/")}>←</button>
                <h1>Project Not Found</h1>
                <p>Id: {projectId}</p>
                <p>The project you are looking for does not exist.</p>
            </div>
        )
    }
    if (loading) {
        return (
            <div className="project-container container">
                <button className="go-home-btn" onClick={() => setNavRoute("/")}>←</button>
                <h1>Loading...</h1>
                <p>Id: {projectId}</p>
            </div>
        )
    }
    return (
        <div className="new-project-container container">
            <ProjBar setNavRoute={setNavRoute} />
            <h1>Edit Project</h1>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="project-name">Project Name:</label>
                <input type="text" id="project-name" name="project-name" required
                value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                
                <label htmlFor="project-description">Project Description:</label>
                <textarea id="project-description" name="project-description" rows={4}
                value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}></textarea>
                <button type="submit" className="new-project-btn">Save Changes</button>
            </form>
        </div>
    )
}

export default EditProject;