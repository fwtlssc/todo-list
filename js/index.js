import "../css/styles.css";

import mainNav from "./components/main-nav";
import projectView from "./project/project-view";
import todoView from "./todo/todo-view";

mainNav.createMainNavbar();
projectView.render();

todoView.createTodosSection();
todoView.render();
