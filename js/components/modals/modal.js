import app from "../../app";

export default class Modal {
    modal;

    modalHeader;

    modalBody;

    buttons;

    closeButton;

    form;

    constructor() {
        this.modal = document.createElement("div");
        this.modal.classList.add("option-card-container");

        const card = document.createElement("div");
        card.classList.add("options-card");
        this.modal.append(card);

        this.modalHeader = document.createElement("div");
        this.modalHeader.classList.add("card-header");
        card.append(this.modalHeader);

        this.modalBody = document.createElement("div");
        this.modalBody.classList.add("card-body");
        card.append(this.modalBody);

        this.buttons = document.createElement("div");
        this.buttons.classList.add("buttons");
        this.modalBody.append(this.buttons);

        this.closeButton = document.createElement("button");
        this.closeButton.textContent = "Close";
        this.closeButton.classList.add(...["btn-option-red", "btn-close"]);
        this.buttons.append(this.closeButton);
        this.bindEvents();
    }

    bindEvents() {
        this.closeButton.addEventListener("click", this.closeModal.bind(this));
        this.modal.addEventListener("click", this.clickOnBackground.bind(this));
    }

    createTitle(title, iconClasses) {
        const header = document.createElement("h2");
        this.modalHeader.append(header);

        const label = document.createElement("span");
        label.classList.add("label");
        label.textContent = title;
        header.append(label);

        if (iconClasses) {
            const icon = document.createElement("i");
            icon.classList.add(...iconClasses);
            header.append(icon);
        }
    }

    showModal() {
        document.body.append(this.modal);
        document.body.classList.add("modal-active");
        app.pushModal(this);
    }

    closeModal() {
        this.modal.classList.add("animation-fadeOut");
        this.modal.addEventListener("animationend", () => {
            this.modal.remove();
            document.body.classList.remove("modal-active");
            app.popModal();
        });
    }

    clickOnBackground(e) {
        if (e.target === this.modal) {
            this.closeModal();
        }
    }
}
