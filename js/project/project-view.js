import PubSub from "pubsub-js";
import app from "../app";

export default (() => {
    let growContainer;
    let projectsContainer;
    let activeContainer;

    function setActiveProject(container, projectId) {
        activeContainer.classList.remove("active");
        app.setActiveProjectId(projectId);
        activeContainer = container;
        activeContainer.classList.add("active");
    }

    function _createSingleProjectContainer(project) {
        const container = document.createElement("li");
        container.classList.add("single-project-container");

        const title = document.createElement("h2");
        title.textContent = project.getTitle();
        container.append(title);
        container.addEventListener("click", () => { setActiveProject(container, project.getId()); });
        return container;
    }

    function render() {
        const order = app.projectsOrder;
        growContainer = growContainer ?? document.querySelector(".grow-container");
        if (projectsContainer !== undefined) {
            projectsContainer.remove();
        }
        projectsContainer = document.createElement("ul");
        projectsContainer.classList.add("projects-container");
        order.forEach((projectId) => {
            const singleProjectContainer = _createSingleProjectContainer(
                app.getProjectById(projectId),
            );
            if (app.activeProjectId === projectId) {
                singleProjectContainer.classList.add("active");
                activeContainer = singleProjectContainer;
            }
            projectsContainer.append(singleProjectContainer);
        });
        growContainer.append(projectsContainer);
    }

    function expandProjects() {
        projectsContainer.classList.toggle("expanded");
    }

    // Bind Events
    PubSub.subscribe("projectChanged", render);

    return {
        render,
        expandProjects,
    };
})();
