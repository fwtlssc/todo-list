

import app from "../../app";
import { helper } from "../../helpers";
import { Todo } from "../../todo/todo-controller";
import { Modal } from "./modal";
import { format } from "date-fns";

export class AddTodoModal extends Modal{

    title;
    description;
    priority;
    projectId;

    constructor(projectId){
        super();
        this.projectId = projectId;
        this.createTitle("Add Todo", ["bi","bi-card-checklist"]);
        let option = document.createElement("div");
        option.classList.add("option");

        this.form = document.createElement("form");
        this.form.setAttribute("id", "form-add-todo");
        this.modalBody.insertBefore(this.form, this.modalBody.lastElementChild);
        
        //Title
        option = document.createElement("div");
        option.classList.add("single-option");

        let formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        option.append(formGroup);

        const titleLabel = document.createElement("label");
        titleLabel.textContent = "Task";
        titleLabel.setAttribute("for","todo-title");
        formGroup.append(titleLabel);

        this.title = document.createElement("textarea");
        helper.setAttributes(this.title, {"form":"form-add-todo", "name":"title","id":"todo-title",
                                    "rows":"1","cols":"40", "placeholder":"Enter task",
                                    "required":""});
        formGroup.append(this.title);
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);

        //Description
        option = document.createElement("div");
        option.classList.add("single-option");

        formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        option.append(formGroup);

        const descriptionLabel = document.createElement("label");
        descriptionLabel.textContent = "Description";
        descriptionLabel.setAttribute("for","todo-description");
        formGroup.append(descriptionLabel);

        this.description = document.createElement("textarea");
        helper.setAttributes(this.description, {"form":"form-add-todo", "name":"description",
                                    "id":"todo-description",
                                    "rows":"1", "cols":"40","placeholder":"Enter description"});
        formGroup.append(this.description);
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);

        //Priority
        option = document.createElement("div");
        option.classList.add("option");

        const priorityLabel = document.createElement("label");
        priorityLabel.textContent = "Priority";
        priorityLabel.setAttribute("for","todo-priority");
        option.append(priorityLabel);

        let col = document.createElement("div");
        col.classList.add("col-end");
        option.append(col);

        this.priority = document.createElement("input");
        helper.setAttributes(this.priority, {"form":"form-add-todo", "type":"number", "name":"priority",
                                            "id":"todo-priority",
                                                "min":"1", "max":"99", "value":"1", "placeholder":"1",
                                                "required":""});
        col.append(this.priority);
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);

        //Priority
        option = document.createElement("div");
        option.classList.add("option");

        const dueDateLabel = document.createElement("label");
        dueDateLabel.textContent = "Due date";
        dueDateLabel.setAttribute("for","todo-duedate");
        option.append(dueDateLabel);

        col = document.createElement("div");
        col.classList.add("col-end");
        option.append(col);

        this.dueDate = document.createElement("input");
        helper.setAttributes(this.dueDate, {"form":"form-add-todo", "type":"date", "name":"duedate",
                                            "id":"todo-duedate", "required":"",
                                            "value": format(new Date(), "RRRR-MM-dd")
                                            });
                                            

        col.append(this.dueDate);
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);
        
        const addButton = document.createElement("button");
        addButton.classList.add(...["btn-option-blue", "btn-add"]);
        addButton.textContent = "Add";
        helper.setAttributes(addButton, {"type":"submit","form":"form-add-todo"});
        this.buttons.prepend(addButton);

        this.form.addEventListener("submit", this.addTodo.bind(this));
        this.title.addEventListener("input", this.titleChange.bind(this));
        this.description.addEventListener("input", this.descriptionChange.bind(this));
        
    }

    addTodo(e){
        e.preventDefault();
        const title = this.form['title'].value;
        const description = this.form['description'].value;
        const priority = this.form['priority'].value;
        const dueDate = this.form['duedate'].value;
        app.getProjectById(this.projectId).addTodo(
                    new Todo(this.projectId, title, description, dueDate, priority)
                    );
        this.closeModal();
        
    }

    titleChange(){
        this.setTextAreaHeight(this.title);
    }

    descriptionChange(){
        this.setTextAreaHeight(this.description);
    }

    setTextAreaHeight(element){
        element.style['height'] = `0px`;
        element.style['height'] = `${element.scrollHeight}px`;
    }

}