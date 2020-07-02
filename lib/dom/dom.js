const MiniReact = (function () {
    
    // ** createElement function
    // type of the html element or component (example : h1,h2,p,button, etc).
    // attributes is the properties object (example: {style: { color: “red” }} 
    // children is an array of anything you need to pass between the dom elements.
    function createElement(type, attributes = {}, ...children) {
        // Flattens the children to create a current
        // instance of chlid and make handling
        // the text nodes easier since elements could
        // be nested within other elements and direct
        // handling of array elements as a React child 
        // is not possible
        let childElements = [].concat(...children).reduce(
            // remove undefined nodes using reduce in place of map
            (acc, child) => {
                // Handle true/false short circuiting 
                if (child != null && child !== true && child !== false) {
                    // below deals with categorizing the text child elements
                    // instances can be object like div,h1, span, function, class
                    // or it could be text
                    // e.g., 2:{type: "h1", children: Array(1), props: {…}} or 9: "2,3"
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
        // The virtual DOM structure representation
        // that react returns
        return {
            type,
            children: childElements,
            // props will contain all attributes
            // plus a new property called children
            // e.g., <div><h1>Title</h1></div>
            // the type "div" will contain a props
            // called children that containes the
            // structure for <h1>Title</h1>
            props: Object.assign({ children: childElements }, attributes)
        }
    }
   
    //** render function
    // vdom is jsx representation of the real DOM to be created
    // at this point vdom points to the Step1 component in todo-app file
    // container is the entry point of the application 
    // it is the div element with id of root - on which the vdom will be mounted
    // oldDom/oldDomElement is the top level component contained in container
    // referenced by container.firstChild
    const render = function (vdom, container, oldDom = container.firstChild) {
        diff(vdom, container, oldDom);
    }
    
    //** diff function
    // Resposible for the entire reconciiation logic
    const diff = function (vdom, container, oldDom) {
        // If and only if there is a virtual DOM 
        // grab the reference to the existing virtual element property
        // because we need both vdoms: vdom of new element and 
        // vdom of old element to make the comparison       
        let oldvdom = oldDom && oldDom._virtualElement;
        // First time render
        // the container is empty
        if (!oldDom) {
            // helper method to loop through all
            // vdom nodes, create a respective
            // DOM element and add back to parent
            mountElement(vdom, container, oldDom);
        }
        // Check for functional component
        else if (typeof vdom.type === "function") {
            // helper method 
            // oldcomponent = null - no stateful component at
            // this point
            diffComponent(vdom, null, container, oldDom);
        }

        // See if old vdom exists and old vdom's type
        // equals the new vdom's i.e. there is some
        // changes between the two
        else if (oldvdom && oldvdom.type === vdom.type) {
            if (oldvdom.type === "text") {
                updateTextNode(oldDom, vdom, oldvdom);
            } else {
                updateDomElement(oldDom, vdom, oldvdom);
            }

            // Set a reference to updated vdom
            oldDom._virtualElement = vdom;

            // Recursively diff children..
            // Doing an index by index diffing (because we don't have keys yet)
            vdom.children.forEach((child, i) => {
                diff(child, oldDom, oldDom.childNodes[i]);
            });

            // Remove old dom nodes
            let oldNodes = oldDom.childNodes;
            if (oldNodes.length > vdom.children.length) {
                for (let i = oldNodes.length - 1; i >= vdom.children.length; i -= 1) {
                    let nodeToBeRemoved = oldNodes[i];
                    unmountNode(nodeToBeRemoved, oldDom);
                }
            }

        }
    }

    function unmountNode(domElement, parentComponent) {
        domElement.remove();
    }

    // Compare text content of new virtual DOM and the old virtual DOM
    // if they are not the same, overwrite the text content
    function updateTextNode(domElement, newVirtualElement, oldVirtualElement) {
        if (newVirtualElement.props.textContent !== oldVirtualElement.props.textContent) {
            domElement.textContent = newVirtualElement.props.textContent;
        }
        // Set a reference to the newvddom in oldDom
        domElement._virtualElement = newVirtualElement;
    }

    function diffComponent(newVirtualElement, oldComponent, container, domElement) {
        if (!oldComponent) {
            mountElement(newVirtualElement, container, domElement);
        }
    }

    // Responsible for rendering native DOM elements (e.g., div,p,h1)
    // as well as functions
    const mountElement = function (vdom, container, oldDom) {
        if (isFunction(vdom)) {
            return mountComponent(vdom, container, oldDom);
        } else {// helper function for creating the dom elements
            return mountSimpleNode(vdom, container, oldDom);
        }
    }
    
    
    function buildFunctionalComponent(vnode, context) {
        // This is where new vdom is generted from 
        // a functional component
        return vnode.type();
    }



    // Helper function to determine 
    // whether an object is of type function
    function isFunction(obj) {
        return obj && 'function' === typeof obj.type;
    }

    // Helper function to determine 
    // whether it is a functional component
    // without render method or
    // or a stateful component with one
    function isFunctionalComponent(vnode) {
        let nodeType = vnode && vnode.type;
        return nodeType && isFunction(vnode)
            && !(nodeType.prototype && nodeType.prototype.render);
    }


    

    
    function mountComponent(vdom, container, oldDomElement) {
        // When a component is mounted a new vdom is generated
        let nextvDom = null, component = null, newDomElement = null;
        // check whether the vdom passed is a functional component
        if (isFunctionalComponent(vdom)) {
            // will return a new vdom
            nextvDom = buildFunctionalComponent(vdom);
        }



                // Recursively render child components
                if (isFunction(nextvDom)) {
                    return mountComponent(nextvDom, container, oldDomElement);
                } else {
                    newDomElement = mountElement(nextvDom, container, oldDomElement);
                }
                return newDomElement;
        
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
            // elemnents are now rendedred to the DOM
            // but attributes (e.g. className) and 
            // event handlers are not 
            // updateDomElement is used for
            // for updating the rendered elements
            // with these values. 
            // Text nodes (the text inside elements) 
            // do not have any attributes
            // So we set attributes here
            updateDomElement(newDomElement, vdom);
        }

        // Store a reference to vdom within the newly created dom element
        // Useful for reconciliation, so that the vdom is 
        // readily available to grab from every dom element
        // Serves as a reference point for diffing.
        // Every DOM element will have a reference
        // to the virtual DOM. For example,
        // for a <span> element on the UI, 
        // the DOM for the <span> will have the _virtualElement 
        // which will point to the span's virtual DOM.
        newDomElement._virtualElement = vdom;
        // Render top-level element to the container
        if (nextSibling) {
            container.insertBefore(newDomElement, nextSibling);
        } else {
            container.appendChild(newDomElement);
        }

        // TODO: Render children
        // Up to here only the div element within
        // the root has been rendered
        // Once the top level DOM element is rendered
        // the code below loops through every child of vdom
        // and for every child calls mountElement.
        // Passing the new child element as the first parameter
        // and the newDomElement as the second (container) ensures
        // correct assoication between parent and child elements
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
                    // Special attributes that cannot be set
                    // using setAttribute
                    domElement[propName] = newProp;
                } else if (propName !== "children") {
                    // ignore the 'children' prop
                    // childrens are not set as attribute
                    // and can be ignored as it
                    // is recursively taken care of
                    if (propName === "className") {
                        domElement.setAttribute("class", newProps[propName]);
                    } else {
                        domElement.setAttribute(propName, newProps[propName]);
                    }
                }
            }
        });
          // remove oldProps
          // to ensure that if in case any handlers are 
          // chnaged or reassigned programatically, 
          // the old reference is removed and 
          // new handlers are always attached to the
          // DOM 
          Object.keys(oldProps).forEach(propName => {
            const newProp = newProps[propName];
            const oldProp = oldProps[propName];
            if (!newProp) {
                if (propName.slice(0, 2) === "on") {
                    // prop is an event handler
                    domElement.removeEventListener(propName, oldProp, false);
                } else if (propName !== "children") {
                    // ignore the 'children' prop
                    domElement.removeAttribute(propName);
                }
            }
        });
    }

     // RMP - Revealing Module Pattern
     // returns functions available in MiniReact namespace
     // so that babel can make use of the exposed functions
    return {
        createElement,
        render
    }
}());
