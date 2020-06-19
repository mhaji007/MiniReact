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

    // RMP - Revealing Module Pattern
    return {createElement}

}());
