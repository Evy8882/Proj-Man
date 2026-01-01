use uuid::Uuid;
use serde::{Serialize, Deserialize};
use serde_json::{to_string_pretty, from_str};


#[derive(Serialize, Deserialize)]
struct Todo {
    id: u32,
    title: String,
    completed: bool,
}

#[derive(Serialize, Deserialize)]
struct Project {
    id: u128,
    name: String,
    description: String,
    todos: Vec<Todo>,
}

fn get_json_data() -> Option<Vec<Project>> {
    let file_content = match std::fs::read_to_string("data.json"){
        Ok(v) => v,
        Err(_) => String::from("[]"),
    };

    let data = from_str::<Vec<Project>>(&file_content).ok()?;
    Some(data)
}

fn save_json_data(projects: &Vec<Project>) {
    let json_data = to_string_pretty(projects).expect("Erro ao salvar arquivo");
    std::fs::write("data.json", json_data).expect("Erro ao escrever no arquivo");
}

#[tauri::command]
fn create_new_project(name: &str, description: &str) -> u128 {

    let mut current_projects: Vec<Project> = match get_json_data() {
        Some(v) => v,
        None => Vec::new(),
    };

    let id = Uuid::new_v4();
    let project = Project {
        id: id.as_u128(),
        name: name.to_string(),
        description: description.to_string(),
        todos: Vec::new(),
    };
    let p_id = project.id;
    current_projects.push(project);
    save_json_data(&current_projects);
    p_id
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![create_new_project])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
