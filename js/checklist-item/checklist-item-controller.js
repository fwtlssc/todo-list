import app from "../app";
import { appStorage } from "../storage";

export class ChecklistItem{

    #id;
    #todoId;
    #content;
    #done;

    constructor(todoId, content, id, done){
        this.#todoId = todoId;
        this.#content = content;
        this.#id = id?? app.generateChecklistItemId();
        this.#done = done??false;
        this.saveToStorage();
    }

    toObject(){
        return {id: this.#id, todoId: this.#todoId, content: this.#content, done: this.#done};
    }

    getId(){
        return this.#id;
    }

    getContent(){
        return this.#content;
    }

    setContent(content){
        this.#content = content;
        this.saveToStorage();
    }

    isDone(){
        return this.#done;
    }

    setDone(done){
        this.#done = done;
        this.saveToStorage();
    }

    saveToStorage(){
        appStorage.storeChecklistItem(this);
    }

}