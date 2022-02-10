export default (() => {
    function setAttributes(element, attributes) {
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
    }
    return {
        setAttributes,
    };
})();
