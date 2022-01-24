import PubSub from "pubsub-js";
import app from "../app";

export let projectView = (function(){

    let growContainer;
    let projectsContainer;
    let activeContainer;

    PubSub.subscribe("projectChanged", render);

    function render(){
        let order = app.projectsOrder;
        growContainer = growContainer?? document.querySelector(".grow-container");
        if(projectsContainer !== undefined){
            projectsContainer.remove();
        }
        projectsContainer = document.createElement("ul");
        projectsContainer.classList.add("projects-container");
        order.forEach( projectId => {
            let singleProjectContainer = _createSingleProjectContainer(app.getProjectById(projectId));
            if(app.activeProjectId == projectId){
                singleProjectContainer.classList.add("active");
                activeContainer = singleProjectContainer;
            }
            projectsContainer.append(singleProjectContainer);
        });
        growContainer.append(projectsContainer);
    }

    function _createSingleProjectContainer(project){
        let container = document.createElement("li");
        container.classList.add("single-project-container");

        let title = document.createElement("h2");
        title.textContent = project.getTitle();
        container.append(title);
        container.addEventListener("click", () => {setActiveProject(container, project.getId())});
        return container;
    }

    function expandProjects(){
        projectsContainer.classList.toggle("expanded");
    }

    function setActiveProject(container, projectId){
        activeContainer.classList.remove("active");
        app.setActiveProjectId(projectId);
        activeContainer = container;
        activeContainer.classList.add("active");
    }

    return {
        render,
        expandProjects
    }

})();