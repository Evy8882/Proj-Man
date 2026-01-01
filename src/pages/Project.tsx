import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Project } from "../types/types";

function ProjectPage({setNavRoute, projectId}: {setNavRoute: (route: string) => void, projectId: string}) {
    const [project, setProject] = useState<Project | null>(null);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    async function getProjectById(id: string) {
        const projectJson = await invoke<string>("get_project_by_id", {project_id: id});
        if (projectJson === "Not found") {
            setNotFound(true);
        }else {
            const project = JSON.parse(projectJson);
            setProject(project);
        }
        setLoading(false);
    }

    useEffect(() => {
        getProjectById(projectId);
    }, [projectId])

    if (notFound) {
        return (
            <div className="project-container container">
                <button className="go-home-btn" onClick={() => setNavRoute("/")}>←</button>
                <h1>Project Not Found</h1>
                <h2>Id: {projectId}</h2>
                <p>The project you are looking for does not exist.</p>
            </div>
        )
    }
    if (loading) {
        return (
            <div className="project-container container">
                <button className="go-home-btn" onClick={() => setNavRoute("/")}>←</button>
                <h1>Loading...</h1>
                <h2>Id: {projectId}</h2>
            </div>
        )
    }
    return (
        <div className="project-container container">
            <button className="go-home-btn" onClick={() => setNavRoute("/")}>←</button>
            <h1>{project?.name}</h1>
            <p>{project?.description}</p>
        </div>
    )
}

export default ProjectPage;