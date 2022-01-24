import "../css/styles.css";

import app from "./app";
import { ChecklistItem } from "./checklist-item/checklist-item-controller";
import { mainNav } from "./components/main-nav";
import { Project } from "./project/project-controller";
import { projectView } from "./project/project-view";
import { appStorage } from "./storage";
import { Todo } from "./todo/todo-controller";
import { todoView } from "./todo/todo-view";
import {format} from "date-fns";


// let project1 = new Project("hello world");
// let project2 = new Project("second hi");
// let project3 = new Project("third hi");


// app.addProject(project1)
// app.addProject(project2)
// app.addProject(project3)

// app.getProjectById(2).setTitle("qwe");

// let todo = new Todo(project1.getId(), "todo task","desc","2010-2-1",1);
// let todo2 = new Todo(project1.getId(), "todo2 task","desc2","2017-6-1",5);
// let todo3 = new Todo(project1.getId(), "todo3 task","desc3","2012-2-1",4);
// let todo4 = new Todo(project1.getId(), "todo4 task","desc4","2012-6-1",3);
// let todo5 = new Todo(project1.getId(), "todo5 task","desc5","2015-2-1",3);


// project1.addTodo(todo)
// project1.addTodo(todo2)
// project1.addTodo(todo3)
// project1.addTodo(todo4)
// project1.addTodo(todo5)


// let item1 = new ChecklistItem(todo.getId(),"11ww");
// let item2 = new ChecklistItem(todo.getId(),"22ww");
// let item3 = new ChecklistItem(todo.getId(),"33ee");

// todo.addChecklistItem(item1);
// todo.addChecklistItem(item2);
// todo.addChecklistItem(item3);




let mainContent = document.getElementById("main-content");

mainNav.createMainNavbar();
projectView.render();

let spacer = document.createElement("div");
spacer.classList.add("spacer-md");
mainContent.append(spacer);

todoView.createTodosSection();
todoView.render();

mainContent.append(spacer.cloneNode());
