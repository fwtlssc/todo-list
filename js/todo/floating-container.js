import app from "../app";
import { helper } from "../helpers";
import { format } from "date-fns";

export let floatingContainer = (function(){

    let todosSection;
    let container;
    let card;
    let todoId;
    let taskTitle;
    let description;
    let priority;
    let dueDate;

    function create(){
        container = document.createElement("div");
        container.classList.add("floating-container");

        //card
        card = document.createElement("div");
        card.classList.add("description-card");
        container.append(card);

        //card header
        let cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");
        card.append(cardHeader);
        let title = document.createElement("h2");
        title.textContent = "Details";
        cardHeader.append(title);

        //card body
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        card.append(cardBody);

        //title
        let formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        let titleLabel = document.createElement("label");
        titleLabel.setAttribute("for","task-title");
        titleLabel.textContent = "Task";
        formGroup.append(titleLabel);
        taskTitle = document.createElement("textarea");
        helper.setAttributes(taskTitle, {"name":"task","id":"task-title", "class":"task","rows":"1", 
                                    "placeholder":"Enter task"});
        formGroup.append(taskTitle);
        cardBody.append(formGroup);

         //description
         formGroup = document.createElement("div");
         formGroup.classList.add("form-group");
         let descriptionLabel = document.createElement("label");
         descriptionLabel.setAttribute("for","task-description");
         descriptionLabel.textContent = "Description";
         formGroup.append(descriptionLabel);
         description = document.createElement("textarea");
         helper.setAttributes(description, {"name":"description","id":"task-description", "class":"description",
                                    "rows":"1", "placeholder":"Enter description"});
         formGroup.append(description);
         cardBody.append(formGroup);

        //priority
        formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        let priorityLabel = document.createElement("label");
        priorityLabel.setAttribute("for","task-priority");
        priorityLabel.textContent = "Priority";
        formGroup.append(priorityLabel);
        priority = document.createElement("input");
        formGroup.append(priority);
        cardBody.append(formGroup);

        //due date
        formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        let dueDateLabel = document.createElement("label");
        dueDateLabel.setAttribute("for","task-duedate");
        formGroup.append(dueDateLabel);
        dueDate = document.createElement("input");
        formGroup.append(dueDate);
        cardBody.append(formGroup);

        //append to DOM
        if(!todosSection){
            todosSection = document.getElementById("todo-list-section");
        }
        todosSection.append(container);

        //events
        bindEvents();
    }

    function load(){
        if(!container){
            return;
        }
        let loading = document.createElement("div");
        loading.classList.add("loading");
        let spinner = document.createElement("div");
        spinner.classList.add("spinner");
        loading.append(spinner);
        container.append(loading);
        setTimeout( () => {
            loading.remove();
        }, 500);
    }

    function render(todo){
        load();
        todoId = todo.getId();
        card.classList.remove("hide");
        // card.classList.add("loading");        


        //title
        taskTitle.value = todo.getTitle();
        setTimeout( () => {
            setTextAreaHeight(taskTitle);
        },500);

        //description
        description.value = todo.getDescription();
        setTimeout( () => {
            setTextAreaHeight(description);
        },500);
        
        //priority
        helper.setAttributes(priority, {"type":"number", "name":"priority","id":"task-priority",
                                         "min":"1", "max":"99", "placeholder":"1", "value": todo.getPriority()});

        //due date
        helper.setAttributes(dueDate, {"type":"date", "name":"duedate","id":"task-duedate",
                                        "value": format(new Date(todo.getDueDate()), "RRRR-MM-dd")});
        
    }

    function hide(){
        if(card){
            card.classList.add("hide");
        }
    }
    
    function bindEvents(){
        taskTitle.addEventListener("input", titleChange);
        description.addEventListener("input", descriptionChange);
        priority.addEventListener("blur", priorityChange);
        dueDate.addEventListener("change", dueDateChange);
    }

    function titleChange(){
        app.getTodoById(todoId).setTitle(taskTitle.value);
        setTextAreaHeight(taskTitle);
    }

    function descriptionChange(){
        app.getTodoById(todoId).setDescription(description.value);
        setTextAreaHeight(description);
    }

    function priorityChange(){
        const todo = app.getTodoById(todoId);
        if(priority.value != todo.getPriority()){
            todo.setPriority(priority.value);
        }
    }

    function dueDateChange(){
        app.getTodoById(todoId).setDueDate(dueDate.value);
    }


    function setTextAreaHeight(element){
        element.style['height'] = `0px`;
        requestAnimationFrame( () => {
            element.style['height'] = `${element.scrollHeight}px`;
        });
        
    }


    return {
        create,
        render,
        hide
    }
})();