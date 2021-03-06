import PubSub from "pubsub-js";
import Project from "./project/project-controller";
import appStorage from "./storage";
import projectStorage from "./project/project-storage";

const app = (() => {
    const projects = appStorage.loadProjects();
    const projectsOrder = appStorage.loadProjectsOrder();
    const activeProjectId = appStorage.loadActiveProjectId();
    const openedModals = [];

    function addProject(project, order) {
        this.projects.forEach((id) => {
            if (this.getProjectById(id).getTitle() === project.getTitle()) {
                throw new Error("Title is duplicated");
            }
        });
        this.projects.push(project.getId());
        this.setProjectOrder(project.getId(), order);
        this.setActiveProjectId(project.getId());
        appStorage.storeProjects(this.projects);
    }

    function createDefaultProject() {
        app.addProject(new Project("Default"));
    }

    function removeProject(projectId) {
        const index = this.projects.indexOf(projectId);
        if (index > -1) {
            this.projects.splice(index, 1);
            if (this.projects.length === 0) {
                createDefaultProject();
            }
            this.projectsOrder.splice(this.projectsOrder.indexOf(projectId), 1);
            appStorage.storeProjectsOrder(this.projectsOrder);
            if (this.activeProjectId === projectId) {
                this.setActiveProjectId(this.projectsOrder[0], 1);
            }
            appStorage.storeProjects(this.projects);
            PubSub.publish("projectChanged");
        }
    }

    function getProjectById(id) {
        return Project.createFromObject(projectStorage.loadFromStorage(id));
    }

    function setProjectOrder(projectId, order) {
        if (order !== undefined && (order < 1 || order > this.projectsOrder.length + 1)) {
            throw new Error(`order must be greater than 0 and less than ${this.projectsOrder.length + 1}`);
        }
        let newOrder = order ?? this.projectsOrder.length + 1;
        for (let i = 0; i < this.projectsOrder.length; i++) {
            if (this.projectsOrder[i] === projectId) {
                this.projectsOrder.splice(i, 1);
                if (newOrder > i + 1) {
                    newOrder -= 1;
                }
                break;
            }
        }
        this.projectsOrder.splice(newOrder - 1, 0, projectId);
        appStorage.storeProjectsOrder(this.projectsOrder);
        PubSub.publish("projectChanged");
    }

    function setActiveProjectId(projectId) {
        if (this.activeProjectId !== projectId) {
            PubSub.publish("activeProjectChanged");
        }
        this.activeProjectId = projectId;
        appStorage.storeActiveProjectId(this.activeProjectId);
    }

    function pushModal(modal) {
        openedModals.push(modal);
    }

    function popModal() {
        if (openedModals.length > 0) {
            openedModals.pop();
        }
    }

    function closeAllModals() {
        for (let i = openedModals.length - 1; i >= 0; i--) {
            openedModals[i].closeModal();
        }
    }

    return {
        projects,
        projectsOrder,
        activeProjectId,
        addProject,
        createDefaultProject,
        getProjectById,
        removeProject,
        setProjectOrder,
        setActiveProjectId,
        pushModal,
        popModal,
        closeAllModals,
    };
})();

export default app;

if (app.projects.length === 0) {
    app.createDefaultProject();
}
if (app.activeProjectId === -1) {
    app.setActiveProjectId(app.projectsOrder[0]);
}
