export type Todo = {
    id: string;
    title: string;
    completed: boolean;
}

export type Note = {
    id: string;
    name: string;
    content: string,
}

export type Project = {
    id: string;
    name: string;
    description: string;
    todos: Todo[];
    notes: Note[];
}