export default (() => {
    function loadProjects() {
        return JSON.parse(localStorage.getItem("projects")) || [];
    }

    function storeProjects(projects) {
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    function loadProject(id) {
        const key = `project[${id}]`;
        return JSON.parse(localStorage.getItem(key));
    }

    function storeProject(project) {
        const key = `project[${project.getId()}]`;
        localStorage.setItem(key, JSON.stringify(project.toObject()));
    }

    function loadTodo(id) {
        const key = `todo[${id}]`;
        return JSON.parse(localStorage.getItem(key));
    }

    function storeTodo(todo) {
        const key = `todo[${todo.getId()}]`;
        localStorage.setItem(key, JSON.stringify(todo.toObject()));
    }

    function storeChecklistItem(checklistItem) {
        const key = `checklistItem[${checklistItem.getId()}]`;
        localStorage.setItem(key, JSON.stringify(checklistItem.toObject()));
    }

    function loadChecklistItem(id) {
        const key = `checklistItem[${id}]`;
        return JSON.parse(localStorage.getItem(key));
    }

    function storeProjectsOrder(projectsOrder) {
        localStorage.setItem("projectsOrder", JSON.stringify(projectsOrder));
    }

    function loadProjectsOrder() {
        return JSON.parse(localStorage.getItem("projectsOrder")) || [];
    }

    function storeActiveProjectId(activeProjectId) {
        localStorage.setItem("activeProjectId", JSON.stringify(activeProjectId));
    }

    function loadActiveProjectId() {
        return JSON.parse(localStorage.getItem("activeProjectId")) || -1;
    }

    function loadLatestIds() {
        return [JSON.parse(localStorage.getItem("projectLatestId") || 0),
            JSON.parse(localStorage.getItem("todoLatestId")) || 0,
            JSON.parse(localStorage.getItem("checklistItemLatestId")) || 0,
        ];
    }

    function storeLatestId(key, id) {
        localStorage.setItem(key, JSON.stringify(id));
    }

    return {
        loadProjects,
        storeProjects,
        loadProject,
        storeProject,
        loadTodo,
        storeTodo,
        loadChecklistItem,
        storeChecklistItem,
        storeProjectsOrder,
        loadProjectsOrder,
        loadLatestIds,
        storeLatestId,
        storeActiveProjectId,
        loadActiveProjectId,
    };
})();
