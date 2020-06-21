const MiniReact = (function () {
    // createElement function
    function createElement(type, attributes = {}, ...children) {
         // if statement handles true/false shortcircuiting
        let childElements = [].concat(...children).reduce(
            (acc, child) => {
                // below deals with categorizing the text child elements
                if (child != null && child !== true && child !== false) {
                    if (child instanceof Object) {
                        acc.push(child);
                    } else {
                        acc.push(createElement("text", {
                            textContent: child
                        }));
                    }
                }
                return acc;
            }
            , []);
        // return {type,children,props: attributes }
        return {
            type,
            children: childElements,
            props: Object.assign({ children: childElements }, attributes)
        }
    }
     // render function
    const render = function (vdom, container, oldDom = container.firstChild) {
        // First time render
        if (!oldDom) {
            mountElement(vdom, container, oldDom);
        }
    }
    // Responsible for rendering native DOM elements
    // as well as functions
    const mountElement = function (vdom, container, oldDom) {
         // helper function for creating and mounting the dom element
        return mountSimpleNode(vdom, container, oldDom);
    }
    const mountSimpleNode = function (vdom, container, oldDomElement, parentComponent) {
        // Stores newly created DOM - null on initial render
        let newDomElement = null;
        // For decision making on insertion order (before or after sibling)
        // node immediately following the specified node, in the same tree level
         // is saved to nextSibling variable
        const nextSibling = oldDomElement && oldDomElement.nextSibling;

        if (vdom.type === "text") {
            newDomElement = document.createTextNode(vdom.props.textContent);
        } else {
            newDomElement = document.createElement(vdom.type);
            updateDomElement(newDomElement, vdom);
        }

        // Store a reference to vdom within the newly created dom element
        // Useful for reconciliation, so that the vdom is 
        // readily available to grab from every dom element
        // Serves as a reference point for diffing
        newDomElement._virtualElement = vdom;
        // Render top-level element to the container
        if (nextSibling) {
            container.insertBefore(newDomElement, nextSibling);
        } else {
         // Text node do not have any attributes
         // So we set attributes here
            container.appendChild(newDomElement);
        }

        //TODO: Render children
        vdom.children.forEach(child => {
            mountElement(child, newDomElement);
        });

    }

    // Set DOM attributes and events
    // domElement holds the newDomElement and
    // newVirtualElement holds the vdom
    function updateDomElement(domElement, newVirtualElement, oldVirtualElement = {}) {
        const newProps = newVirtualElement.props || {};
        const oldProps = oldVirtualElement.props || {};
        Object.keys(newProps).forEach(propName => {
            const newProp = newProps[propName];
            const oldProp = oldProps[propName];
            if (newProp !== oldProp) {
                 // check whether the props is an event
                if (propName.slice(0, 2) === "on") {
                    // prop is an event handler
                    // extract event handler's name
                    const eventName = propName.toLowerCase().slice(2);
                    domElement.addEventListener(eventName, newProp, false);
                    // Prevent memory leak
                    if (oldProp) {
                        domElement.removeEventListener(eventName, oldProp, false);
                    }
                } else if (propName === "value" || propName === "checked") {
                    // this are special attributes that cannot be set
                    // using setAttribute
                    domElement[propName] = newProp;
                } else if (propName !== "children") {
                    // ignore the 'children' prop
                    if (propName === "className") {
                        domElement.setAttribute("class", newProps[propName]);
                    } else {
                        domElement.setAttribute(propName, newProps[propName]);
                    }
                }
            }
        });
    }

     // RMP - Revealing Module Pattern
     // returns functions available in MiniReact namespace
    return {
        createElement,
        render
    }
}());
