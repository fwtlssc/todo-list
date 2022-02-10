import PubSub from "pubsub-js";
import { format } from "date-fns";
import app from "../app";
import AddTodoModal from "../components/modals/add-todo-modal";
import helper from "../helpers";
import floatingContainer from "./floating-container";
import Project from "../project/project-controller";
import Todo from "./todo-controller";

class TodoCard {
    todoId;

    card;

    doneCheckbox;

    taskTitle;

    priority;

    dueDate;

    deleteButtonContainer;

    deleteButton;

    tooltip;

    constructor(todoId) {
        this.todoId = todoId;
        this.render();
        this.bindEvents();
        PubSub.subscribe("todoDueDateChange", this.changeTodo.bind(this));
        PubSub.subscribe("todoTitleChange", this.changeTodo.bind(this));
        PubSub.subscribe("todoDoneChange", this.changeTodo.bind(this));
    }

    render() {
        const todo = Todo.getTodoById(this.todoId);
        this.card = document.createElement("li");
        this.card.classList.add("todo-card");
        this.card.dataset.id = todo.getId();
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        this.card.append(cardBody);

        const col1 = document.createElement("div");
        col1.classList.add("col-1");
        this.doneCheckbox = document.createElement("input");
        helper.setAttributes(this.doneCheckbox, { type: "checkbox", name: "task" });
        if (todo.isDone()) {
            this.doneCheckbox.setAttribute("checked", "");
        }

        this.taskTitle = document.createElement("label");
        this.taskTitle.classList.add("task-label");
        if (todo.isDone()) {
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
        this.deleteButton.classList.add(...["btn-delete", "btn-icon"]);
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add(...["bi", "bi-trash"]);
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

    bindEvents() {
        document.body.addEventListener("click", this.clickAway.bind(this));
        this.doneCheckbox.addEventListener("click", this.checkTodo.bind(this));
        this.deleteButton.addEventListener("click", this.removeTodo.bind(this));
    }

    changeTodo(msg, data) {
        if (this.todoId !== data.id) {
            return;
        }
        const todo = Todo.getTodoById(this.todoId);
        this.taskTitle.textContent = todo.getTitle();
        if (todo.isDone()) {
            this.taskTitle.classList.add("task-done");
        } else {
            this.taskTitle.classList.remove("task-done");
        }

        this.dueDate.textContent = format(new Date(todo.getDueDate()), "eeee dd/MM/RRRR");
        this.setPriority();
    }

    removeTodo() {
        if (!this.tooltip) {
            this.showDeleteTooltip();
        } else {
            const todo = Todo.getTodoById(this.todoId);
            app.getProjectById(todo.getProjectId()).removeTodo(this.todoId);
        }
    }

    setPriority() {
        const todo = Todo.getTodoById(this.todoId);
        this.priority.textContent = `Priority: ${todo.getPriority()}`;
    }

    checkTodo() {
        const todo = Todo.getTodoById(this.todoId);
        todo.setDone(this.doneCheckbox.checked);
    }

    showDeleteTooltip() {
        this.tooltip = document.createElement("div");
        this.tooltip.classList.add(...["delete-tool-tip"]);
        const tooltipText = document.createElement("p");
        tooltipText.textContent = "Press again to delete task";
        this.tooltip.append(tooltipText);
        this.deleteButtonContainer.append(this.tooltip);
    }

    hideDeleteTooltip() {
        this.tooltip.classList.add("opacity-0");
        this.tooltip.addEventListener("transitionend", () => {
            this.tooltip.remove();
            this.tooltip = null;
        });
    }

    clickAway(e) {
        if (e.target.closest(".btn-delete") !== this.deleteButton && this.tooltip) {
            this.hideDeleteTooltip();
        }
    }
}

export default (() => {
    let todosSection;
    let todosContainer;
    let activeTodoCard;
    let activeTodoId;
    let addTodoCaption;
    let activeProject;
    let todoCards;
    let resizeObserver;
    let priorityLists;

    // Bind Events
    PubSub.subscribe("activeProjectChanged", render);
    PubSub.subscribe("todoPriorityChange", changeTodo);
    PubSub.subscribe("todoRemoved", removeTodoRender);
    PubSub.subscribe("todoAdded", addTodoRender);

    function addTodoRender(msg, todo) {
        if (!todosContainer) {
            render();
            return;
        }
        if (addTodoCaption) {
            addTodoCaption.remove();
            addTodoCaption = null;
        }
        const priorityContainer = todosContainer.querySelector(
            `.priority-container[data-priority='${todo.getPriority()}']`,
        );
        if (priorityContainer) {
            priorityContainer.nextElementSibling.append(_createTodoCard(todo.getId()).card);
            setActiveTodo(todo.getId());
            priorityContainer.nextElementSibling.style["max-height"] = `${priorityContainer.nextElementSibling.scrollHeight}px`;
            return;
        }
        const prioritySection = _createPrioritySection(todo.getPriority(), [todo.getId()]);
        const priorityContainers = todosContainer.querySelectorAll(".priority-container");
        const nextPrioritySectionIndex = upperBound(
            priorityContainers,
            0,
            priorityContainers.length - 1,
            todo.getPriority(),
        );
        if (nextPrioritySectionIndex !== priorityContainers.length) {
            const nextPrioritySection = priorityContainers[nextPrioritySectionIndex].closest(
                ".single-priority-section",
            );
            todosContainer.insertBefore(prioritySection, nextPrioritySection);
        } else {
            todosContainer.append(prioritySection);
        }
        prioritySection.lastElementChild.style["max-height"] = `${prioritySection.lastElementChild.scrollHeight}px`;
        setActiveTodo(todo.getId());
    }

    function upperBound(list, low, high, key) {
        if (low > high) {
            return low;
        }
        const mid = Math.floor((low + high) / 2);
        if (parseInt(list[mid].dataset.priority, 10) > key) {
            return upperBound(list, low, mid - 1, key);
        }
        return upperBound(list, mid + 1, high, key);
    }

    function removeTodoRender(msg, todoId) {
        const todoCard = todosContainer.querySelector(`.todo-card[data-id='${todoId}']`);
        if (!todoCard) {
            return;
        }
        const parentTodoList = todoCard.closest(".priority-todocards-list");
        if (parentTodoList.children.length === 1) {
            parentTodoList.closest(".single-priority-section").remove();
        } else {
            todoCard.remove();
        }
        if (parseInt(activeTodoId, 10) === todoId) {
            const firstTodoCard = getFirstTodoCard();
            if (firstTodoCard) {
                setActiveTodo(firstTodoCard.dataset.id);
            }
        }
        if (todosContainer.querySelector(".single-priority-section") === null) {
            _createAddTodoCaption();
            todosContainer.append(addTodoCaption);
            floatingContainer.hide();
        }
    }

    function createTodosSection() {
        todosSection = document.createElement("section");
        todosSection.setAttribute("id", "todo-list-section");
        document.querySelector("#main-content").append(todosSection);
        floatingContainer.create();
    }

    function _createOptionContainer(iconClasses) {
        const container = document.createElement("div");
        container.classList.add("option-container");
        const icon = document.createElement("i");
        icon.classList.add(...iconClasses);
        container.append(icon);
        return container;
    }

    function setActiveTodo(todoId) {
        if (activeTodoId === todoId) {
            return;
        }
        activeTodoId = todoId;
        if (activeTodoCard) {
            activeTodoCard.classList.remove("active");
        }
        activeTodoCard = todosContainer.querySelector(`.todo-card[data-id='${todoId}']`);
        activeTodoCard.classList.add("active");
        floatingContainer.render(Todo.getTodoById(todoId));
    }

    function getFirstTodoCard() {
        return todosContainer.querySelector(".todo-card");
    }

    function priorityContainerCollapse() {
        const list = this.parentElement.querySelector(".priority-todocards-list");
        list.classList.toggle("collapse");
        if (list.style["max-height"] === "0px") {
            list.style["max-height"] = `${list.scrollHeight}px`;
            list.addEventListener("transitionend", () => {
                list.classList.remove("overflow-hidden");
            }, { once: true });
        } else {
            list.style["max-height"] = "0px";
            list.classList.add("overflow-hidden");
        }
    }

    function _createTodoCard(todoId) {
        const todoCard = new TodoCard(todoId);
        todoCards.push(todoCard);
        todoCard.card.addEventListener("click", (e) => {
            if (e.target.closest(".btn-delete")) {
                return;
            }
            setActiveTodo(todoId);
        });
        return todoCard;
    }

    function _createPriorityContainer(priority) {
        const priorityContainer = document.createElement("div");
        priorityContainer.classList.add("priority-container");
        priorityContainer.dataset.priority = priority;
        const label = document.createElement("span");
        label.textContent = `#${priority}`;
        priorityContainer.append(label);
        priorityContainer.addEventListener("click", priorityContainerCollapse);
        return priorityContainer;
    }

    function _createPrioritySection(priority, todos) {
        const section = document.createElement("div");
        section.classList.add("single-priority-section");

        const priorityContainer = _createPriorityContainer(priority);
        section.append(priorityContainer);

        const list = document.createElement("ul");
        list.classList.add("priority-todocards-list");
        section.append(list);
        todos.forEach((todoId) => {
            const todoCard = _createTodoCard(todoId);
            list.append(todoCard.card);
        });
        return section;
    }

    function _createAddTodoCaption() {
        addTodoCaption = document.createElement("div");
        addTodoCaption.style.height = "300px";
        addTodoCaption.classList.add(...["center", "bg-grey", "txt-grey"]);
        addTodoCaption.textContent = "No tasks in this project yet";
    }

    function render() {
        if (todosContainer) {
            todosContainer.remove();
        }
        activeProject = app.getProjectById(app.activeProjectId);
        activeTodoCard = null;
        todoCards = [];
        todosContainer = document.createElement("div");
        todosContainer.classList.add("todos-container");
        const options = document.createElement("div");
        options.classList.add("options");
        const addOption = _createOptionContainer(["bi", "bi-plus-circle"]);
        addOption.classList.add("add-item-option");
        const label = document.createElement("span");
        label.textContent = "Add Item";
        addOption.prepend(label);

        addOption.addEventListener("click", () => { (new AddTodoModal(app.activeProjectId)).showModal(); });

        options.append(addOption);
        const refreshOption = _createOptionContainer(["bi", "bi-arrow-clockwise"]);
        refreshOption.addEventListener("click", render);
        options.append(refreshOption);
        todosContainer.append(options);
        if (activeProject.getTodosPriorities().length === 0) {
            _createAddTodoCaption();
            todosContainer.append(addTodoCaption);
            floatingContainer.hide();
        }
        activeProject.getTodosPriorities().forEach((priority) => {
            const todos = activeProject.getTodosByPriority(priority);
            Project.sortTodosByDonethenDueDate(todos);
            const singleSection = _createPrioritySection(priority, todos);
            todosContainer.append(singleSection);
        });
        todosSection.append(todosContainer);
        setTimeout(() => {
            priorityLists = todosContainer.querySelectorAll(".priority-todocards-list");
            priorityLists.forEach((list) => {
                const expandedList = list;
                expandedList.style["max-height"] = `${list.scrollHeight}px`;
            });
            resizeObserver.observe(todosContainer);
        }, 200);
        const firstTodoCard = getFirstTodoCard();
        if (firstTodoCard) {
            setActiveTodo(firstTodoCard.dataset.id);
        }
    }

    resizeObserver = new ResizeObserver(() => {
        priorityLists.forEach((list) => {
            if (!list.classList.contains("collapse")) {
                const expandedList = list;
                expandedList.style["max-height"] = `${list.scrollHeight}px`;
            }
        });
    });

    function changeTodo() {
        render();
        setActiveTodo(activeTodoId);
    }

    return {
        render,
        createTodosSection,
    };
})();
