use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string_pretty};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
struct Todo {
    id: String,
    title: String,
    completed: bool,
}

impl Todo {
    fn set_completed(&mut self) {
        self.completed = !self.completed;
    }
}

#[derive(Serialize, Deserialize)]
struct Project {
    id: String,
    name: String,
    description: String,
    todos: Vec<Todo>,
}

fn get_json_data() -> Option<Vec<Project>> {
    let file_content = match std::fs::read_to_string("data.json") {
        Ok(v) => v,
        Err(_) => String::from("[]"),
    };

    let data = from_str::<Vec<Project>>(&file_content).ok()?;
    Some(data)
}

fn get_specific_project(project_id: &str) -> Option<Project> {
    let projects: Vec<Project> = match get_json_data() {
        Some(v) => v,
        None => Vec::new(),
    };

    for project in projects {
        if project.id == project_id {
            return Some(project);
        }
    }
    None
}

fn save_json_data(projects: &Vec<Project>) {
    let json_data = to_string_pretty(projects).expect("Error saving file");
    std::fs::write("data.json", json_data).expect("Error writing to file");
}

#[tauri::command]
fn create_new_project(name: &str, description: &str) -> String {

    let mut current_projects: Vec<Project> = match get_json_data() {
        Some(v) => v,
        None => Vec::new(),
    };

    let id = Uuid::new_v4();
    let project = Project {
        id: id.as_simple().to_string(),
        name: name.to_string(),
        description: description.to_string(),
        todos: Vec::new(),
    };
    let p_id = project.id.clone();
    current_projects.push(project);
    save_json_data(&current_projects);
    p_id
}

#[tauri::command]
fn get_projects() -> String {
    let projects: Vec<Project> = match get_json_data() {
        Some(v) => v,
        None => Vec::new(),
    };
    match to_string_pretty(&projects) {
        Ok(v) => v,
        Err(_) => String::from("[]"),
    }
}

#[tauri::command(rename_all = "snake_case")]
fn get_project_by_id(project_id: &str) -> String {
    let project = get_specific_project(project_id);
    if let Some(proj) = project {
        match to_string_pretty(&proj) {
            Ok(v) => return v,
            Err(_) => return String::from("Error serializing project"),
        }
    }

    String::from("Not found")
}

#[tauri::command(rename_all = "snake_case")]
fn new_todo(project_id: &str, title: &str) {
    let mut projects: Vec<Project> = match get_json_data() {
        Some(v) => v,
        None => Vec::new(),
    };

    let todo = Todo {
        id: Uuid::new_v4().as_simple().to_string(),
        title: title.to_string(),
        completed: false,
    };

    for project in &mut projects {
        if &project.id == project_id {
            project.todos.push(todo);
            break;
        }
    }
    save_json_data(&projects);
}

#[tauri::command(rename_all = "snake_case")]
fn set_todo_done(project_id: &str, todo_id: &str){
    let mut projects: Vec<Project> = match get_json_data() {
        Some(v) => v,
        None => Vec::new(),
    };
    for project in &mut projects {
        if &project.id == project_id {
            for todo in &mut project.todos {
                if &todo.id == todo_id {
                    todo.set_completed();
                    break;
                }
            }
            break;
        }
    }
    save_json_data(&projects);
}

#[derive(Serialize, Deserialize)]
struct TodoDeleteResponse {
    deleted_todo: Todo,
    position: usize,
    project_id: String,
}

#[tauri::command(rename_all = "snake_case")]
fn delete_todo(project_id: &str, todo_id: &str) -> Option<TodoDeleteResponse> {
    let mut projects: Vec<Project> = match get_json_data() {
        Some(v) => v,
        None => Vec::new(),
    };
    for project in &mut projects {
        if &project.id == project_id {
            let position = project.todos.iter().position(|todo| &todo.id == todo_id);
            if let Some(index) = position {
                let todo = project.todos.remove(index);
                save_json_data(&projects);
                return Some(TodoDeleteResponse {
                        deleted_todo: todo,
                        position: index,
                        project_id: project_id.to_string(),
                    }
                );
            }
            break;
        }
    }
    None
}


#[tauri::command(rename_all = "snake_case")]
fn move_todo_up(project_id: &str, todo_id: &str) {
    let moved_todo = delete_todo(project_id, todo_id);
    let project = get_specific_project(project_id);
    if let Some(mut proj) = project {
        if let Some(moved) = moved_todo {
            let new_position = if moved.position == 0 {
                0
            } else {
                moved.position - 1
            };
            proj.todos.insert(new_position, moved.deleted_todo);
            let mut projects: Vec<Project> = match get_json_data() {
                Some(v) => v,
                None => Vec::new(),
            };
            for p in &mut projects {
                if &p.id == project_id {
                    *p = proj;
                    break;
                }
            }
            save_json_data(&projects);
        }
    }
}

#[tauri::command(rename_all = "snake_case")]
fn move_todo_down(project_id: &str, todo_id: &str) {
    let moved_todo = delete_todo(project_id, todo_id);
    let project = get_specific_project(project_id);
    if let Some(mut proj) = project {
        if let Some(moved) = moved_todo {
            let new_position = if moved.position == proj.todos.len() {
                moved.position
            } else {
                moved.position + 1
            };
            proj.todos.insert(new_position, moved.deleted_todo);
            let mut projects: Vec<Project> = match get_json_data() {
                Some(v) => v,
                None => Vec::new(),
            };
            for p in &mut projects {
                if &p.id == project_id {
                    *p = proj;
                    break;
                }
            }
            save_json_data(&projects);
        }
    }
}

#[tauri::command(rename_all = "snake_case")]
fn update_project(project_id: &str, name: &str, description: &str) {
    let mut project: Project = match get_specific_project(project_id) {
        Some(v) => v,
        None => return,
    };
    project.name = name.to_string();
    project.description = description.to_string();
    let mut projects: Vec<Project> = match get_json_data() {
        Some(v) => v,
        None => Vec::new(),
    };
    for p in &mut projects {
        if &p.id == project_id {
            *p = project;
            break;
        }
    }
    save_json_data(&projects);
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_new_project,
            get_projects,
            get_project_by_id,
            new_todo,
            set_todo_done,
            delete_todo,
            move_todo_up,
            move_todo_down,
            update_project
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
