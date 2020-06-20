const MiniReact = (function () {
    // createElement function
    function createElement(type, attributes = {}, ...children) {
        let childElements = []
            .concat(...children)
            .reduce((acc, child) => {
                // if statement handles true/false shortcircuiting
                if (child != null && child !== true && child !== false) {
                    // below deals with categorizing the text child elements
                    if (child instanceof Object) {
                        acc.push(child);
                    } else {
                        acc.push(createElement("text", {textContent: child}))

                    }
                }
                return acc;
            }, []);

        // return {type,children,props: attributes }
        return {
            type,
            children: childElements,
            props: Object.assign({
                children: childElements
            }, attributes)
        }

    }

    // render function
    const render = function(vdom, container, oldDom=container.firstChild){

        // First time render
        if(!oldDom) {
            mountElement(vdom, container, oldDom);
        }

    }

    // Responsible for rendering native DOM elements
    // as well as functions
    const mountElement = function (vdom, container, oldDom) {

        // helper function for creating and mounting the dom element
        return  mountSimpleNode(vdom, container, oldDom);
    }

    const mountSimpleNode = function (vdom, container, oldDomElement, parentComponent) {
        let newDomElement = null;
        // For decision making on insertion order (before, or after sibling)
        const nextSibling = oldDomElement && oldDomElement.nextSibling;

        if(vdom.type === "text") {
            newDomElement = document.createTextNode(vdom.props.textContent);
        } else {
            newDomElement = document.createElement(vdom.type);
        }

        // Store a reference to vdom within the newly created dom element
        // Useful for reconciliation, so that the vdom is 
        // readily available to grab from every dom element
        // Serves as a reference point for diffing
        newDomElement._virtualElement = vdom;

        // Render top-level element to the container
        if(nextSibling) {
            container.insertBefore(newDomElement, nextSibling);
        } else {
            container.appendChild(newDomElement);
        }
    }

    vdom.children.array.forEach(child => {
        mountElement(child, newDomElement);
        
    });

    // RMP - Revealing Module Pattern
    // returns functions available in MiniReact namespace
    return {
    createElement,
    render
    }



}());



