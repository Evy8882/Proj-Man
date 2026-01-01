import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import { Project } from "../types/types";

function ProjBar({setNavRoute}: {setNavRoute: (route: string) => void}) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [opened, setOpened] = useState<boolean>(false);

    async function getProjects() {
        const projectsJson = await invoke<string>("get_projects");
        const projects = JSON.parse(projectsJson);
        setProjects(projects);
    }

    useEffect(() => {
        getProjects();
    }, []);

    if (opened) {
        return (
            <div className="proj-bar">
            <div className="line">
                <h2>Project Bar</h2>
                <div className="line">
                    <button className="reload-btn" onClick={getProjects}>↻</button>
                    <button className="reload-btn" onClick={()=>{setOpened(false)}}>×</button>
                </div>
            </div>
            {projects.map((project) => (
                <button onClick={()=>{setNavRoute(`/project/${project.id}`)}} key={project.id} className="proj-btn">
                    <h3>{project.name}</h3>
                </button>
            ))}
            </div>
        );
    }else{
        return (
            <div className="proj-bar-closed">
                <button className="proj-open-btn" onClick={() => setOpened(true)}>☰</button>
            </div>
        );
    }
}

export default ProjBar;