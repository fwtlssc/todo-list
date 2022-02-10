import appStorage from "../storage";

export default (() => {
    function loadFromStorage(id) {
        return appStorage.loadProject(id);
    }

    function saveToStorage(project) {
        appStorage.storeProject(project);
    }

    return {
        loadFromStorage,
        saveToStorage,
    };
})();
