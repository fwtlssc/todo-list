import { Modal } from "./modal";
import { helper } from "../../helpers";
import app from "../../app";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";

export class ProjectSettingsModal extends Modal{
    constructor(){
        super();
        const activeProject = app.getProjectById(app.activeProjectId);
        this.createTitle("Settings", ["bi","bi-gear-fill"]);
        let option = document.createElement("div");
        option.classList.add("option");

        let col1 = document.createElement("label");
        col1.setAttribute("for","project-title");
        col1.textContent = "Project Title";
        option.append(col1);
        let col2 = document.createElement("form");
        col2.setAttribute("id","form-add-project")
        const input = document.createElement("input");
        helper.setAttributes(input, {"type":"text", "name":"title", "id":"project-title",
                                    "placeholder":"Enter project title", "required":"",
                                    "value":activeProject.getTitle()})
        col2.append(input);
        option.append(col2);
        this.form = col2;
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);

        option = document.createElement("div");
        option.classList.add("option");
        col1 = document.createElement("label");
        col1.setAttribute("for","project-order");
        col1.textContent = "Place Before";
        option.append(col1);
        
        col2 = document.createElement("select");
        helper.setAttributes(col2, {"form":"form-add-project", "name":"order", "id":"project-order",
                                    "required":""});
        const defaultOption = document.createElement("option");
        helper.setAttributes(defaultOption, {"value":app.projectsOrder.length + 1})
        if(activeProject.getId() == app.projectsOrder[app.projectsOrder.length-1]){
            defaultOption.setAttribute("selected", "");
        }
        defaultOption.textContent = "Last Project";
        col2.append(defaultOption);
        app.projectsOrder.forEach( (order , index) => {
            if(order == activeProject.getId()){
                return;
            }
            const project = app.getProjectById(order);
            const option = document.createElement("option");
            option.setAttribute("value", index+1);
            if(index > 0 && app.projectsOrder[index-1] == activeProject.getId()){
                option.setAttribute("selected", "");
            }
            option.textContent = project.getTitle();
            col2.append(option);
        });
        option.append(col2);
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);

        option = document.createElement("div");
        option.classList.add("option");
        col1 = document.createElement("p");
        col1.textContent = "Delete Project";
        option.append(col1);

        col2 = document.createElement("button");
        col2.classList.add(...["btn-icon", "btn-delete"])
        const icon = document.createElement("i");
        icon.classList.add(...["bi", "bi-trash"]);
        col2.append(icon);
        col2.addEventListener("click",  () => {new DeleteConfirmationModal(activeProject).showModal();} );
        option.append(col2);
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);

        const changeButton = document.createElement("button");
        changeButton.classList.add(...["btn-option-blue", "btn-add"]);
        changeButton.textContent = "Change";
        this.buttons.prepend(changeButton);
        changeButton.addEventListener("click", this.changeProject.bind(this));
    }

    changeProject(){
        const activeProject = app.getProjectById(app.activeProjectId);
        const title = this.form.title.value;
        const order = this.form.order.value;
        activeProject.setTitle(title);
        app.setProjectOrder(activeProject.getId(), order);
        this.closeModal();
    }

    
}