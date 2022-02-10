import Modal from "./modal";
import helper from "../../helpers";
import Project from "../../project/project-controller";
import app from "../../app";

export default class AddProjectModal extends Modal {
    constructor() {
        super();
        this.createTitle("Add", ["bi", "bi-plus-circle-fill"]);
        let option = document.createElement("div");
        option.classList.add("option");

        let col1 = document.createElement("label");
        col1.setAttribute("for", "project-title");
        col1.textContent = "Project Title";
        option.append(col1);
        let col2 = document.createElement("form");
        col2.setAttribute("id", "form-add-project");
        const input = document.createElement("input");
        helper.setAttributes(input, {
            type: "text",
            form: "form-add-project",
            name: "title",
            id: "project-title",
            placeholder: "Enter project title",
            required: "required",
        });
        col2.append(input);
        option.append(col2);
        this.form = col2;
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);

        option = document.createElement("div");
        option.classList.add("option");
        col1 = document.createElement("label");
        col1.setAttribute("for", "project-order");
        col1.textContent = "Place Before";
        option.append(col1);

        col2 = document.createElement("select");
        helper.setAttributes(col2, {
            form: "form-add-project",
            name: "order",
            id: "project-order",
            required: "",
        });
        const defaultOption = document.createElement("option");
        helper.setAttributes(defaultOption, {
            value: app.projectsOrder.length + 1,
            selected: "",
        });
        defaultOption.textContent = "Last Project";
        col2.append(defaultOption);
        app.projectsOrder.forEach((order, index) => {
            const project = app.getProjectById(order);
            const selectOption = document.createElement("option");
            selectOption.setAttribute("value", index + 1);
            selectOption.textContent = project.getTitle();
            col2.append(selectOption);
        });
        option.append(col2);
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);

        const addButton = document.createElement("button");
        addButton.classList.add(...["btn-option-blue", "btn-add"]);
        addButton.textContent = "Add";
        this.buttons.prepend(addButton);
        addButton.addEventListener("click", this.addProject.bind(this));
    }

    addProject() {
        const title = this.form.title.value;
        const order = this.form.order.value;
        app.addProject(new Project(title), order);
        this.closeModal();
    }
}
