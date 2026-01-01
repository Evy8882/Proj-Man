export type Todo = {
    id: string;
    title: string;
    completed: boolean;
}

export type Project = {
    id: string;
    name: string;
    description: string;
    todos: Todo[];
}