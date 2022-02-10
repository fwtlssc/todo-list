import app from "../../app";
import Modal from "./modal";
import helper from "../../helpers";

export default class DeleteConfirmationModal extends Modal {
    constructor(project) {
        super();
        this.modal.classList.add("delete-confirmation");
        const card = this.modal.firstElementChild;
        card.classList.add("confirmation-modal");
        this.createTitle("Delete confirmation");

        const option = document.createElement("div");
        option.classList.add("single-option");
        const text = document.createElement("p");
        text.textContent = `Are you sure you want to delete (${project.getTitle()}) project and all its content?`;
        option.append(text);
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);

        this.form = document.createElement("form");
        this.form.setAttribute("id", "form-delete-project");
        const hiddenInput = document.createElement("input");
        helper.setAttributes(hiddenInput, { type: "hidden", name: "project-id", value: project.getId() });
        this.form.append(hiddenInput);
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "submit");
        deleteButton.classList.add(...["btn-option-green", "btn-delete"]);
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", this.removeProject.bind(this));
        this.buttons.prepend(deleteButton);

        this.closeButton.classList.remove("btn-option-red");
        this.closeButton.classList.add("btn-option-green");
    }

    removeProject() {
        const projectId = this.form["project-id"].value;
        app.removeProject(Number.parseInt(projectId, 10));
        app.closeAllModals();
    }
}
