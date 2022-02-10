import PubSub from "pubsub-js";
import idGenerator from "../generators/id-generator";
import Todo from "../todo/todo-controller";
import projectStorage from "./project-storage";

export default class Project {
    #id;

    #title;

    #todos;

    constructor(title, id, todos) {
        this.#title = title;
        this.#id = id ?? idGenerator.generateProjectId();
        this.#todos = todos ?? [];
        this.saveToStorage();
    }

    toObject() {
        return { id: this.#id, title: this.#title, todos: this.#todos };
    }

    static createFromObject(object) {
        return new this(
            object.title,
            object.id,
            object.todos,
        );
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }

    setTitle(title) {
        this.#title = title;
        this.saveToStorage();
    }

    addTodo(todo) {
        this.#todos.push(todo.getId());
        this.saveToStorage();
        PubSub.publish("todoAdded", todo);
    }

    removeTodo(todoId) {
        const index = this.#todos.indexOf(todoId);
        if (index > -1) {
            this.#todos.splice(index, 1);
            this.saveToStorage();
        }
        PubSub.publish("todoRemoved", todoId);
    }

    getTodos() {
        return this.#todos;
    }

    getTodosPriorities() {
        const priorities = new Set();
        this.#todos.forEach((todoId) => {
            priorities.add(Todo.getTodoById(todoId).getPriority());
        });
        return Array.from(priorities).sort((a, b) => a - b);
    }

    getTodosByPriority(priority) {
        const filteredTodos = this.#todos.filter(
            (todoId) => Todo.getTodoById(todoId).getPriority() === priority,
        );
        return filteredTodos;
    }

    static sortTodosByDonethenDueDate(todos) {
        todos.sort((a, b) => {
            const todo1 = Todo.getTodoById(a);
            const todo2 = Todo.getTodoById(b);
            if (todo1.isDone() === todo2.isDone()) {
                return new Date(todo1.getDueDate()) - new Date(todo2.getDueDate());
            }
            return todo1.isDone() - todo2.isDone();
        });
    }

    saveToStorage() {
        projectStorage.saveToStorage(this);
    }
}
