import { projectView } from "../project/project-view";
import { AboutModal } from "./modals/about-modal";
import { AddProjectModal } from "./modals/add-project-modal";
import { ProjectSettingsModal } from "./modals/project-settings-modal";


export let mainNav = (function(){

    let nav;
    let addOption = _createOptionContainer(["bi","bi-plus-lg"]);
    let expandOption = _createOptionContainer(["bi","bi-caret-down-fill"]);
    let aboutOption = _createOptionContainer(["bi","bi-info-circle-fill"]);
    let settingsOption = _createOptionContainer(["bi","bi-gear-fill"]);

    //bind events
    addOption.addEventListener("click", () => { (new AddProjectModal()).showModal();} );
    expandOption.addEventListener("click", projectView.expandProjects);
    aboutOption.addEventListener("click", () => { (new AboutModal()).showModal();} );
    settingsOption.addEventListener("click", () => { (new ProjectSettingsModal()).showModal(); });
    

    function createMainNavbar(){
        nav = document.createElement("nav");
        nav.setAttribute("id", "main-navbar");
        document.querySelector("#main-content").append(nav);
        this.render();
    }

    function render(){
        nav.append(addOption);

        const growContainer = document.createElement("div");
        growContainer.classList.add("grow-container");
        nav.append(growContainer);

        nav.append(expandOption);
        nav.append(aboutOption);
        nav.append(settingsOption);
    }

    function _createOptionContainer(iconClasses){
        let container = document.createElement("div");
        container.classList.add("option-container");

        let icon = document.createElement("i");
        icon.classList.add(...iconClasses);
        container.append(icon);

        return container;
    }

    return {
        createMainNavbar,
        render
    }

})();