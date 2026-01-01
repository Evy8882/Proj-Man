use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string_pretty};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
struct Todo {
    id: String,
    title: String,
    completed: bool,
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
    let projects: Vec<Project> = match get_json_data() {
        Some(v) => v,
        None => Vec::new(),
    };
    
    for project in projects {
        if project.id == project_id {
            let res = match to_string_pretty(&project) {
                Ok(v) => v,
                Err(_) => String::from("[]"),
            };
            return res;
        }
    }

    String::from("Not found")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_new_project,
            get_projects,
            get_project_by_id,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
