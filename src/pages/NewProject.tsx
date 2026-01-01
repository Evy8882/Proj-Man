import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import "./NewProject.css";

function NewProject({setNavRoute}: {setNavRoute: (route: string) => void}) {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await invoke("create_new_project", {
            name: projectName,
            description: projectDescription
        });
        setNavRoute("/");
    }

    return (
        <div className="new-project-container container">
            <button className="go-home-btn" onClick={() => setNavRoute("/")}>←</button>
            <h1>Create a New Project</h1>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="project-name">Project Name:</label>
                <input type="text" id="project-name" name="project-name" required
                value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                
                <label htmlFor="project-description">Project Description:</label>
                <textarea id="project-description" name="project-description" rows={4}
                value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}></textarea>
                <button type="submit" className="new-project-btn">Create Project</button>
            </form>
        </div>
  )
}

export default NewProject;