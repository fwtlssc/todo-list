import PubSub from "pubsub-js";
import app from "../app";
import { AddTodoModal } from "../components/modals/add-todo-modal";
import { helper } from "../helpers";
import { floatingContainer } from "./floating-container";
import { format } from "date-fns";
import { Project } from "../project/project-controller";

export let todoView = (function(){

    let todosSection;
    let todosContainer;
    let activeTodoCard;
    let activeTodoId;
    let activeProject;
    let todoCards;
    let resizeObserver;
    let priorityLists;


    PubSub.subscribe("activeProjectChanged", render);
    PubSub.subscribe("todoPriorityChange", changeTodo);
    PubSub.subscribe("todoRemoved", render);
    PubSub.subscribe("todoAdded", render);

    function createTodosSection(){
        todosSection = document.createElement("section");
        todosSection.setAttribute("id", "todo-list-section");
        document.querySelector("#main-content").append(todosSection);
        floatingContainer.create();
    }

    function render(){
        if(todosContainer){
            todosContainer.remove();
        }
        activeProject = app.getProjectById(app.activeProjectId);
        activeTodoCard = null;
        todoCards = [];
        todosContainer = document.createElement("div");
        todosContainer.classList.add("todos-container");
        const options = document.createElement("div");
        options.classList.add("options");
        const addOption = _createOptionContainer(["bi","bi-plus-circle"]);
        addOption.classList.add("add-item-option");
        const label = document.createElement("span");
        label.textContent = "Add Item";
        addOption.prepend(label);

        addOption.addEventListener("click", () => { (new AddTodoModal(app.activeProjectId)).showModal();} );

        options.append(addOption);
        const refreshOption = _createOptionContainer(["bi","bi-arrow-clockwise"]);
        refreshOption.addEventListener("click", refreshTodos);
        options.append(refreshOption);
        todosContainer.append(options);
        if(activeProject.getTodosPriorities().length == 0){
            let addTodoCaption = document.createElement("div");
            addTodoCaption.style.height = "300px";
            addTodoCaption.classList.add(...["center","bg-grey", "txt-grey"]);
            addTodoCaption.textContent = "No tasks in this project yet";
            todosContainer.append(addTodoCaption);
            floatingContainer.hide();
        }
        activeProject.getTodosPriorities().forEach( priority => {
            let todos = activeProject.getTodosByPriority(priority);
            Project.sortTodosByDonethenDueDate(todos);
            const singleSection = _createPrioritySection(priority, todos);
            todosContainer.append(singleSection);
        });
        todosSection.append(todosContainer);
        setTimeout( () => {
            priorityLists = todosContainer.querySelectorAll(".priority-todocards-list");
            priorityLists.forEach( list => {
                list.style['max-height'] = `${list.scrollHeight}px`;
            });
            resizeObserver.observe(todosContainer);
        },200)
    }

    resizeObserver = new ResizeObserver( () => {
        priorityLists.forEach( list => {
            if(!list.classList.contains("collapse")){
                list.style['max-height'] = `${list.scrollHeight}px`;
            }
        })
    });

    function _createPrioritySection(priority, todos){
        const section = document.createElement("div");
        section.classList.add("single-priority-section");

        const priorityContainer = document.createElement("div");
        priorityContainer.classList.add("priority-container");
        let label = document.createElement("span");
        label.textContent = `#${priority}`;
        priorityContainer.append(label);
        priorityContainer.addEventListener("click", priorityContainerCollapse);
        section.append(priorityContainer);

        let list = document.createElement("ul");
        list.classList.add("priority-todocards-list")
        section.append(list)
        todos.forEach( todoId => {
            const todoCard = new TodoCard(todoId);
            todoCards.push(todoCard);
            if(!activeTodoCard){
                setActiveTodo(todoCard);
            }
            todoCard.card.addEventListener("click", (e) => { 
                if(e.target.closest('.btn-delete')){
                    return;
                }
                setActiveTodo(todoCard) 
            });
            list.append(todoCard.card)
        });
        return section;
    }

    function _createOptionContainer(iconClasses){
        let container = document.createElement("div");
        container.classList.add("option-container");

        let icon = document.createElement("i");
        icon.classList.add(...iconClasses);
        container.append(icon);

        return container;
    }

    function setActiveTodo(todoCard){
        if(activeTodoCard === todoCard){
            return;
        }
        if(activeTodoCard){
            activeTodoCard.card.classList.remove("active");
        }
        activeTodoCard = todoCard;
        activeTodoId = todoCard.todoId;
        activeTodoCard.card.classList.add("active");
        floatingContainer.render(app.getTodoById(todoCard.todoId));
    }

    function changeTodo(){
        let oldActiveTodoId = activeTodoId;
        render();
        let card = todoCards.find( todoCard => todoCard.todoId == oldActiveTodoId);
        if(card){
            setActiveTodo(card);
        }
    }

    function priorityContainerCollapse(){
        let list = this.parentElement.querySelector(".priority-todocards-list");
        list.classList.toggle("collapse");
        if(list.style['max-height'] == "0px"){
            list.style['max-height'] = `${list.scrollHeight}px`;
            list.addEventListener("transitionend", ()=> {
                list.classList.remove("overflow-hidden");
            }, {once : true});
        }else{
            list.style['max-height'] = "0px";
            list.classList.add("overflow-hidden");
        }
    }

    function refreshTodos(){
        render();
    }

    return {
        render,
        createTodosSection
    }

})();

class TodoCard{

    todoId;
    card;
    doneCheckbox;
    taskTitle;
    priority;
    dueDate;
    deleteButtonContainer;
    deleteButton;
    tooltip;

    constructor(todoId){
        this.todoId = todoId;
        this.render();
        this.bindEvents();
        PubSub.subscribe("todoDueDateChange", this.changeTodo.bind(this));
        PubSub.subscribe("todoTitleChange", this.changeTodo.bind(this));
        PubSub.subscribe("todoDoneChange", this.changeTodo.bind(this));
    }

    render(){
        let todo = app.getTodoById(this.todoId);
        this.card = document.createElement("li");
        this.card.classList.add("todo-card");
        this.card.setAttribute("id",todo.getId());
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        this.card.append(cardBody);

        const col1 = document.createElement("div");
        col1.classList.add("col-1");
        this.doneCheckbox = document.createElement("input");
        helper.setAttributes(this.doneCheckbox, {"type":"checkbox", "name":"task"});
        if(todo.isDone()){
            this.doneCheckbox.setAttribute("checked","");
        }

        this.taskTitle = document.createElement("label");
        this.taskTitle.classList.add("task-label");
        if(todo.isDone()){
            this.taskTitle.classList.add("task-done");
        }
        this.taskTitle.textContent = todo.getTitle();
        col1.append(this.doneCheckbox);
        col1.append(this.taskTitle);
        cardBody.append(col1);

        const col2 = document.createElement("div");
        col2.classList.add("col-2");
        this.deleteButtonContainer = document.createElement("div");
        this.deleteButtonContainer.classList.add("delete-button-container");
        this.deleteButton = document.createElement("button");
        this.deleteButton.classList.add(...["btn-delete","btn-icon"]);
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add(...["bi","bi-trash"]);
        this.deleteButton.append(deleteIcon);
        this.deleteButtonContainer.append(this.deleteButton);
        col2.append(this.deleteButtonContainer);
        cardBody.append(col2);

        const col3 = document.createElement("div");
        col3.classList.add("col-3");
        this.dueDate = document.createElement("p");
        this.dueDate.classList.add("date");
        this.dueDate.textContent = format(new Date(todo.getDueDate()), "eeee dd/MM/RRRR");
        col3.append(this.dueDate);
        cardBody.append(col3);

        const col4 = document.createElement("div");
        col4.classList.add("col-4");
        this.priority = document.createElement("p");
        this.priority.classList.add("priority");
        this.setPriority();
        col4.append(this.priority);
        cardBody.append(col4);

        return this.card;
    }

    bindEvents(){
        document.body.addEventListener("click", this.clickAway.bind(this));
        this.doneCheckbox.addEventListener("click", this.checkTodo.bind(this));
        this.deleteButton.addEventListener("click", this.removeTodo.bind(this));
    }

    changeTodo(msg, data){
        if(this.todoId != data['id']){
            return;
        }
        let todo = app.getTodoById(this.todoId);
        this.taskTitle.textContent = todo.getTitle();
        if(todo.isDone()){
            this.taskTitle.classList.add("task-done");
        }else{
            this.taskTitle.classList.remove("task-done");
        }
        
        this.dueDate.textContent = format(new Date(todo.getDueDate()), "eeee dd/MM/RRRR");
        this.setPriority();
    }

    removeTodo(){
        if(!this.tooltip){
            this.showDeleteTooltip();
        }else{
            let todo = app.getTodoById(this.todoId);
            app.getProjectById(todo.getProjectId()).removeTodo(this.todoId);
        }
    }

    setPriority(){
        let todo = app.getTodoById(this.todoId);
        this.priority.textContent = `Priority: ${todo.getPriority()}`
    }

    checkTodo(){
        let todo = app.getTodoById(this.todoId);
        todo.setDone(this.doneCheckbox.checked);
    }

    showDeleteTooltip(){
        this.tooltip = document.createElement("div");
        this.tooltip.classList.add(...["delete-tool-tip"]);
        const tooltipText = document.createElement("p");
        tooltipText.textContent = "Press again to delete task";
        this.tooltip.append(tooltipText);
        this.deleteButtonContainer.append(this.tooltip);
       
    }
    
    hideDeleteTooltip(){
        this.tooltip.classList.add("opacity-0");
        this.tooltip.addEventListener("transitionend", () => {
            this.tooltip.remove();
            this.tooltip = null;
        });
    }

    clickAway(e){
        if(e.target.closest(".btn-delete") != this.deleteButton && this.tooltip){
            this.hideDeleteTooltip();
        }
    }

}
