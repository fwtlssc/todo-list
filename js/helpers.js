
export let helper = (function(){
    function setAttributes(element, attributes){
        for(let key in attributes){
            element.setAttribute(key, attributes[key])
        }
    }

    return {
        setAttributes
    }
})();
