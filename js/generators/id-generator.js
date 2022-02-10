import appStorage from "../storage";

export default (() => {
    let [projectLatestId, todoLatestId, checklistItemLatestId] = appStorage.loadLatestIds();

    function generateProjectId() {
        projectLatestId += 1;
        appStorage.storeLatestId("projectLatestId", projectLatestId);
        return projectLatestId;
    }

    function generateTodoId() {
        todoLatestId += 1;
        appStorage.storeLatestId("todoLatestId", todoLatestId);
        return todoLatestId;
    }

    function generateChecklistItemId() {
        checklistItemLatestId += 1;
        appStorage.storeLatestId("checklistItemLatestId", checklistItemLatestId);
        return checklistItemLatestId;
    }

    return {
        generateProjectId,
        generateTodoId,
        generateChecklistItemId,
    };
})();
