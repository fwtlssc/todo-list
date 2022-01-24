
import PubSub from "pubsub-js";
import { Project } from "./project/project-controller";
import { appStorage } from "./storage";


const app = (function(){

    let projects = appStorage.loadProjects();
    let projectsOrder = appStorage.loadProjectsOrder();
    let activeProjectId = appStorage.loadActiveProjectId();
    let openedModals = [];

    let [projectLatestId, todoLatestId, checklistItemLatestId] = appStorage.loadLatestIds();
 
    function generateProjectId(){
        ++projectLatestId;
        appStorage.storeLatestId("projectLatestId",projectLatestId);
        return projectLatestId;
    }

    function generateTodoId(){
        ++todoLatestId;
        appStorage.storeLatestId("todoLatestId",todoLatestId);
        return todoLatestId;
    }

    function generateChecklistItemId(){
        ++checklistItemLatestId;
        appStorage.storeLatestId("checklistItemLatestId",checklistItemLatestId);
        return checklistItemLatestId;
    }

    function addProject(project, order){
        this.projects.forEach( id => {
            if(this.getProjectById(id).getTitle() == project.getTitle()){
                throw new Error("Title is duplicated");
            }
        });
        this.projects.push(project.getId());
        this.setProjectOrder(project.getId(), order);
        this.setActiveProjectId(project.getId());
        appStorage.storeProjects();
    }

    function removeProject(projectId){
        let index = this.projects.indexOf(projectId);
        if(index > -1){
            this.projects.splice(index, 1);
            if(this.projects.length == 0){
                createDefaultProject();
            }
            this.projectsOrder.splice(this.projectsOrder.indexOf(projectId),1);
            appStorage.storeProjectsOrder();
            if(this.activeProjectId == projectId){
                this.setActiveProjectId(this.projectsOrder[0],1);
            }
            appStorage.storeProjects();
            PubSub.publish("projectChanged");
        }
    }

    function createDefaultProject(){
        app.addProject(new Project("Default"));
    }

    function getProjectById(id){
        return appStorage.loadProject(id);
    }
    
    
    function setProjectOrder(projectId, order){
        if(order !== undefined && (order < 1 || order > this.projectsOrder.length + 1)){
            throw new Error(`order must be greater than 0 and less than ${this.projectsOrder.length + 1}`);
        }
        order = order?? this.projectsOrder.length + 1;
        for(let i=0; i<this.projectsOrder.length; i++){
            if(this.projectsOrder[i] == projectId){
                this.projectsOrder.splice(i, 1);
                if( order > i + 1){
                    --order;
                }
                break;
            }
        }
        this.projectsOrder.splice(--order, 0, projectId);
        appStorage.storeProjectsOrder();
        PubSub.publish("projectChanged");
    }

    function setActiveProjectId(projectId){
        if(this.activeProjectId != projectId){
            PubSub.publish("activeProjectChanged");
        }
        this.activeProjectId = projectId;
        appStorage.storeActiveProjectId(this.activeProjectId);
    }

    function getTodoById(id){
        return appStorage.loadTodo(id);
    }

    function pushModal(modal){
        openedModals.push(modal);
    }

    function popModal(){
        if(openedModals.length > 0){
            openedModals.pop();
        }
    }

    function closeAllModals(){
        for(let i=openedModals.length-1; i>=0; i--){
            openedModals[i].closeModal();
        }
    }


    return {
        projects,
        projectsOrder,
        activeProjectId,
        generateProjectId,
        generateTodoId,
        generateChecklistItemId,
        addProject,
        createDefaultProject,
        getProjectById,
        removeProject,
        setProjectOrder,
        setActiveProjectId,
        getTodoById,
        pushModal,
        popModal,
        closeAllModals
    }
})();

export default app;

if(app.projects.length == 0){
    app.createDefaultProject();
}
if(app.activeProjectId == -1){
    app.setActiveProjectId(app.projectsOrder[0]);
}

