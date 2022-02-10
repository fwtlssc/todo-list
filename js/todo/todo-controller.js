//  import { ChecklistItem } from "../checklist-item/checklist-item-controller";
import PubSub from "pubsub-js";
import idGenerator from "../generators/id-generator";
import todoStorage from "./todo-storage";

export default class Todo {
    #id;

    #projectId;

    #title;

    #description;

    #done;

    #dueDate;

    #priority;

    #checklist;

    constructor(projectId, title, description, dueDate, priority, id, done, checklist) {
        this.#projectId = projectId;
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#id = id ?? idGenerator.generateTodoId();
        this.#done = done ?? false;
        this.#checklist = checklist ?? [];
        this.saveToStorage();
    }

    toObject() {
        return {
            id: this.#id,
            projectId: this.#projectId,
            title: this.#title,
            description: this.#description,
            done: this.#done,
            dueDate: this.#dueDate,
            priority: this.#priority,
            checklist: this.#checklist,
        };
    }

    static createFromObject(object) {
        return new this(
            object.projectId,
            object.title,
            object.description,
            object.dueDate,
            object.priority,
            object.id,
            object.done,
            object.checklist,
        );
    }

    static getTodoById(id) {
        return this.createFromObject(todoStorage.loadFromStorage(id));
    }

    getId() {
        return this.#id;
    }

    getProjectId() {
        return this.#projectId;
    }

    getTitle() {
        return this.#title;
    }

    setTitle(title) {
        this.#title = title;
        this.saveToStorage();
        PubSub.publish("todoTitleChange", { id: this.#id });
    }

    getDescription() {
        return this.#description;
    }

    setDescription(description) {
        this.#description = description;
        this.saveToStorage();
    }

    isDone() {
        return this.#done;
    }

    setDone(done) {
        this.#done = done;
        this.saveToStorage();
        PubSub.publish("todoDoneChange", { id: this.#id });
    }

    getDueDate() {
        return this.#dueDate;
    }

    setDueDate(dueDate) {
        this.#dueDate = new Date(dueDate);
        this.saveToStorage();
        PubSub.publish("todoDueDateChange", { id: this.#id });
    }

    getPriority() {
        return this.#priority;
    }

    setPriority(priority) {
        this.#priority = priority;
        this.saveToStorage();
        PubSub.publish("todoPriorityChange");
    }

    addChecklistItem(checklistItem) {
        this.#checklist.push(checklistItem.getId());
        this.saveToStorage();
    }

    removeChecklistItem(checklistItemId) {
        const index = this.#checklist.indexOf(checklistItemId);
        if (index > -1) {
            this.#checklist.splice(index, 1);
            this.saveToStorage();
        }
    }

    /*
        getChecklistItemById(id) {
            return ChecklistItem.loadFromStorage(id);
        }
*/

    getChecklist() {
        return this.#checklist;
    }

    saveToStorage() {
        todoStorage.saveToStorage(this);
    }
}
