import { Project } from "./project/project-controller";
import app from "./app";
import { Todo } from "./todo/todo-controller";
import { ChecklistItem } from "./checklist-item/checklist-item-controller";

export let appStorage = (function(){

    function loadProjects(){
        return JSON.parse(localStorage.getItem("projects")) || [];
    }

    function storeProjects(){
        localStorage.setItem("projects", JSON.stringify(app.projects));
    }

    function loadProject(id){
        let key = `project[${id}]`;
        let object = JSON.parse(localStorage.getItem(key));
        let project = new Project(
            object.title,
            object.id,
            object.todos
        );
        return project;
    }

    function storeProject(project){
        let key = `project[${project.getId()}]`;
        localStorage.setItem(key, JSON.stringify(project.toObject()));
    }

    function loadTodo(id){
        let key = `todo[${id}]`;
        let object = JSON.parse(localStorage.getItem(key));
        let todo = new Todo(
            object.projectId,
            object.title,
            object.description,
            object.dueDate,
            object.priority,
            object.id,
            object.done,
            object.checklist
        );
        return todo;
    }

    function storeTodo(todo){
        let key = `todo[${todo.getId()}]`;
        localStorage.setItem(key, JSON.stringify(todo.toObject()));
    }


    function storeChecklistItem(checklistItem){
        let key = `checklistItem[${checklistItem.getId()}]`;
        localStorage.setItem(key, JSON.stringify(checklistItem.toObject()));
    }

    function loadChecklistItem(id){
        let key = `checklistItem[${id}]`;
        const object = JSON.parse(localStorage.getItem(key));
        let checklistItem = new ChecklistItem(
            object.todoId,
            object.content,
            object.id,
            object.done
        );
        return checklistItem;
    }

    function storeProjectsOrder(){
        localStorage.setItem("projectsOrder", JSON.stringify(app.projectsOrder));
    }

    function loadProjectsOrder(){
        return JSON.parse(localStorage.getItem("projectsOrder")) || [];
    }

    function storeActiveProjectId(activeProjectId){
        localStorage.setItem("activeProjectId", JSON.stringify(activeProjectId));
    }

    function loadActiveProjectId(){
        return JSON.parse(localStorage.getItem("activeProjectId")) || -1;
    }

    function loadLatestIds(){
        return [JSON.parse(localStorage.getItem("projectLatestId") || 0),
                JSON.parse(localStorage.getItem("todoLatestId")) || 0,
                JSON.parse(localStorage.getItem("checklistItemLatestId")) || 0,
                ];
    }

    function storeLatestId(key, id){
        localStorage.setItem(key, JSON.stringify(id));
    }

    return {
        loadProjects,
        storeProjects,
        loadProject,
        storeProject,
        loadTodo,
        storeTodo,
        loadChecklistItem,
        storeChecklistItem,
        storeProjectsOrder,
        loadProjectsOrder,
        loadLatestIds,
        storeLatestId,
        storeActiveProjectId,
        loadActiveProjectId
    }

})();