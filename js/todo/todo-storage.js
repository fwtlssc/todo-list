import appStorage from "../storage";

export default (() => {
    function loadFromStorage(id) {
        return appStorage.loadTodo(id);
    }

    function saveToStorage(todo) {
        appStorage.storeTodo(todo);
    }

    return {
        loadFromStorage,
        saveToStorage,
    };
})();
