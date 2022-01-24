
import { Modal } from "./modal";

export class AboutModal extends Modal{
    constructor(){
        super();
        this.createTitle("About", ["bi","bi-info-circle-fill"]);
        let option = document.createElement("div");
        option.classList.add("option");

        let col1 = document.createElement("p");
        col1.textContent = "Developer";
        option.append(col1);
        let col2 = document.createElement("p");
        col2.textContent = "Mohammad Termanini";
        option.append(col2)
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);

        option = document.createElement("div");
        option.classList.add("option");
        col1 = document.createElement("p");
        col1.textContent = "Email";
        option.append(col1);
        col2 = document.createElement("p");
        col2.textContent = "mohtermanini@gmail.com";
        option.append(col2)
        this.modalBody.insertBefore(option, this.modalBody.lastElementChild);
    }
}