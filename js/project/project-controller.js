import PubSub from "pubsub-js";
import app from "../app";
import { appStorage } from "../storage";

export class Project{

    #id;
    #title;
    #todos;


    constructor(title, id, todos){
        this.#title = title;
        this.#id = id?? app.generateProjectId();
        this.#todos = todos?? [];
        this.saveToStorage();
    }

    toObject(){
        return {id: this.#id, title: this.#title, todos: this.#todos};
    }

    getId(){
        return this.#id;
    }

    getTitle(){
        return this.#title;
    }

    setTitle(title){
        this.#title = title;
        this.saveToStorage();
    }

    addTodo(todo){
        this.#todos.push(todo.getId());
        this.saveToStorage();
        PubSub.publish("todoAdded");
    }

    removeTodo(todoId){
        let index = this.#todos.indexOf(todoId);
        if(index>-1){
            this.#todos.splice(index, 1);
            this.saveToStorage();
        }
        PubSub.publish("todoRemoved");
    }

    getTodos(){
        return this.#todos;
    }

    getTodosPriorities(){
        let priorities = new Set();
        this.#todos.forEach( todoId => {
            priorities.add( app.getTodoById(todoId).getPriority() );
        });
        return Array.from(priorities).sort( (a,b) => a-b);
    }

    getTodosByPriority(priority){
        let filteredTodos = this.#todos.filter( 
            todoId => app.getTodoById(todoId).getPriority() == priority
        );
        return filteredTodos;
    }

    static sortTodosByDonethenDueDate(todos){
        todos.sort( (a, b) => {
            const todo1 = app.getTodoById(a);
            const todo2 = app.getTodoById(b);
            if(todo1.isDone() == todo2.isDone()){
                return new Date(todo1.getDueDate()) - new Date(todo2.getDueDate())
            }
            return todo1.isDone() - todo2.isDone();
         });
    }
    
    setAsActiveProject(){
        app.setActiveProjectId(this.getId());
    }

    saveToStorage(){
        appStorage.storeProject(this);
    }

}