import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Project } from "../types/types";
import "./Project.css"

function ProjectPage({setNavRoute, projectId}: {setNavRoute: (route: string) => void, projectId: string}) {
    const [project, setProject] = useState<Project | null>(null);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<string>("");

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

    async function addNewTodo(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setTitle("");
        await invoke("new_todo", {project_id: projectId, title: title});
        getProjectById(projectId);
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
        <div className="project-container container">
            <button className="go-home-btn" onClick={() => setNavRoute("/")}>←</button>
            <h1>{project?.name}</h1>
            <p>{project?.description}</p>
            <h2>To Do List</h2>
            <form className="line" onSubmit={addNewTodo}>
                <input type="text" className="new-todo-input" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <button className="new-todo-btn" type="submit">+</button>
            </form>
            <section className="to-do-list">
                {project?.todos.length === 0 && <p>No to-do items found.</p>}
                {project?.todos.map((item, index) => (
                    <div key={index} className={`to-do-item${item.completed ? " completed" : ""}`}>
                        <h3>{item.title}</h3>
                        <div className="item-details">
                        <p>Status: {item.completed ? "Completed" : "Pending"}</p>
                            <div className="actions">
                                <button>Concluir</button>
                                <button>Excluir</button>
                                <button>↑</button>
                                <button>↓</button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}

export default ProjectPage;