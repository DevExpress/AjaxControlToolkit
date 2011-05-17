// maps a case-insensitive property event or field name it its case sensitive name
$type = Sys.Application;
$type._caseIndex = {};
// maps a property event or field name to its corresponding method
$type._prototypeIndex = {};

$type._context = new Sys.UI.TemplateContext();
$type._context._global = true;

Sys.registerPlugin({
    name: "activateElements",
    dom: true,
    //#if DEBUG
    returnType: "Sys.UI.TemplateContext",
    parameters: [
        {name: "bindingContext", description: "The binding context."},
        {name: "recursive", type: "Boolean", description: "Specifies whether processing should occur recursively."}
    ],
    //#endif
    plugin: function(bindingContext, recursive) {
        var elements = this.get(),
            app = Sys.Application,
            tc = app._context,
            useDirect = isBrowser("InternetExplorer");
        elements = elements || document.documentElement;
        tc.dataItem = typeof(bindingContext) === "undefined" ? null : bindingContext;
        tc.components = tc.components || [];
        tc.nodes = [];
        recursive = (recursive !== false);
        Sys.query(elements).each(function() {
            tc.nodes.push(this);
            app._activateElement(this, tc, useDirect, recursive);
        });
        tc.initializeComponents();
        tc._onInstantiated(null, true);
        return tc;
    }
});

$type._findType = function Application$_findType(element, prefix, useDirect) {
    // determines the namespace for an element by searching for a xmlns:prefix on all ancestors
    var er, err, type, xmlns = "xmlns:" + prefix;
    function getType() {
        var ns;
        try { ns = useDirect ? element[xmlns] : element.getAttribute(xmlns); }
        catch(er) { }
        if (ns && ns.substr(0, 11) === "javascript:") {
            ns = ns.substr(11);
            type = null;          
            //#if DEBUG
            try {
                type = Type.parse(ns);
            }
            catch(er) {
                err = String.format(Sys.UI.TemplatesRes.invalidTypeNamespace, ns);
                return;
            }
            //#else
            type = Type.parse(ns);
            //#endif                
            if (type && type.__class) {
                // points to an ajax class
                return;
            }
            else {
                // points to a function that isnt a type, or it is null
                // Type.parse would have thrown if it didnt point to a function
                type = ns; 
            }
        }
    }
    for (; element; element = element.parentNode) {
        getType();
        if (err) {
            // getType() could throw instead, but in IE7 or less, a closure that throws
            // doesnt bubble the exception to the browser
            throw Error.invalidOperation(err);
        }
        if (type) return type;
    }
    // for an unrooted dom element we also check the body.
    // someone may, for example, create a template dynamically and never root it into the DOM
    element = document.body;
    getType();
    if (err) {
        throw Error.invalidOperation(err);
    }
    return type;
}

$type._activateElement = function Application$_activateElement(parent, templateContext, useDirect, recursive) {
    // this method is used to activate an element and the children of that element.
    // The fastest way is to get all descendants, then enumerate them and activate them as we go,
    // skipping over templates using a technique that finds the next sibling in the flat list.
    // useDirect: element["foo"] is much faster in IE than element.getAttribute("foo")
    if (recursive) {
        recursive = !Sys.UI.Template._isTemplate(parent);
    }
    // start at -1 since we activate the parent first, then dip into the allElements array
    var i = -1,
        allElements = recursive ? (useDirect ? parent.all : parent.getElementsByTagName("*")) : [],
        isTemplate = /(^| )sys\-template($| )/,
        expandosAreLast = useDirect && Sys.Browser.version <= 7,
        element = parent;
    do {
        if (element.nodeType !== 1) continue; // includes comment nodes in IE
        ///// this code is inline rather than factored out into a function because
        ///// performance testing has shown that calling the factored method causes activation
        ///// to be measurably slower in IE, due to the overhead of invoking a function.
        ///// begin element activation

        // now enumerate all the attributes once, treating behavior:foo="value" attributes as property sets on
        // index[behavior].
        // value may be an expression {{ code }} or extension {extension <properties>}
        var err, j, m, typeList = null, entry = null, index = null, fnIndex = null,
            activated = false,
            nodeName = null,
            attributes = element.attributes,
            alength = attributes.length - 1,
            attributes2 = null;
        // for some reason, avoiding the for loop from even beginning improves perf by 15% in 
        // large document test case in IE6,7.
        if (alength >= 0 && (!expandosAreLast || attributes[alength].expando) && !element.__msajaxactivated) {
            for (j = alength; j >= 0; j--) {
                var attribute = attributes[j];
                // in IE, encountering expando=false means we have started to back into
                // attributes that are standard for the element. But 'sys:foo' and 'foo:bar'
                // attributes are always expandos, and those are always at the end of the
                // attribute list. This behavior is important for this to work in IE,
                // since if we had to enumerate all the attributes, it would be too slow.
                if (expandosAreLast && !attribute.expando) break;
                if (!attribute.specified || attribute.nodeName.indexOf(':') < 0) continue;
                activated = true;
                nodeName = attribute.nodeName;
                var value = attribute.nodeValue;
                switch (nodeName) {
                case "sys:attach":
                    typeList = value.split(',');
                    break;
                case "sys:command":
                    var command = Sys.Application._getPropertyValue(null, null, null, value, templateContext, null, true);
                    var commandArg = Sys.Application._getCommandAttr(element, "sys:commandargument", useDirect, templateContext),
                        commandTarget = Sys.Application._getCommandAttr(element, "sys:commandtarget", useDirect, templateContext);
                    Sys.query(element).setCommand(command||"", commandArg||null, Sys.UI.DomElement._ensureGet(commandTarget, templateContext, "sys:commandtarget"));
                    break;
                default:
                    // copy it for a 2nd pass, since processing these may modify the attribute collection making this for loop invalid.
                    attributes2 = attributes2 || [];
                    attributes2.push(attribute);
                }
            } // end for each attribute
            if (activated)  {
                element.__msajaxactivated = true;
                if (typeList) {
                    // Enumerate the behaviors list and instantiate the types in index[behavior]
                    index = {};
                    for (var k = 0, n = typeList.length; k < n; k++) {
                        var typeName = typeList[k].trim();
                        if (index[typeName]) continue; // already exists
                        var type = Sys.Application._findType(element, typeName, useDirect);
                        //#if DEBUG
                        if (!type) {
                            throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.invalidAttach, "sys:attach", typeName));
                        }
                        //#endif
                        var props = null, isComponent = 0, isControlOrBehavior = 0, isContext = 0,
                            isClass = (typeof(type) !== "string"),
                            instance = null;
                        if (isClass) {
                            isComponent = type.inheritsFrom(Sys.Component);
                            isControlOrBehavior = (isComponent && (type.inheritsFrom(Sys.UI.Behavior) || type.inheritsFrom(Sys.UI.Control)));
                            isContext = type.implementsInterface(Sys.UI.ITemplateContextConsumer);
                            instance = isControlOrBehavior ? new type(element) : new type();
                            if (isComponent) {
                                instance.beginUpdate();
                            }
                            if (!isControlOrBehavior) {
                                Sys.Application._registerComponent(element, instance);
                            }
                            if (isContext) {
                                instance.set_templateContext(templateContext);
                            }
                            entry = { instance: instance, isClass: true, typeName: typeName, type: type};
                        }
                        else {
                            props = {};
                            instance = Type.parse(type);
                            entry = { instance: instance, props: props, typeName: typeName, type: type};
                            fnIndex = (fnIndex || []);
                            fnIndex.push(entry);
                        }
                        index[typeName] = entry;
                    }             
                } // typeList
                if (attributes2) {
                    for (j = attributes2.length - 1; j >= 0; j--) {
                        attribute = attributes2[j];
                        nodeName = attribute.nodeName;
                        value = attribute.nodeValue;
                        var isSelect = (/^select$/i.test(element.tagName)),
                            attrib = Sys.Application._splitAttribute(nodeName, isSelect, index),
                            atype = attrib.type,
                            ns = attrib.ns,
                            name = attrib.name;
                        // dont care about non-sys attributes (-1)
                        if (atype < 0) continue;
                        if (atype === 3) {
                            entry = attrib.index;
                            var target = entry.instance;
                            value = Sys.Application._getPropertyValue(attrib, target, name, value, templateContext);
                            if (typeof(value) === "undefined") continue;
                            if (entry.isClass) {
                                switch (attrib.map.type) {
                                    case 1:
                                        attrib.map.setter.call(target, value);
                                        break;
                                    case 2:
                                        attrib.map.setter.call(target, typeof(value) === "function" ? value : new Function("sender", "args", value));
                                        break;
                                    default:
                                        target[name] = value;
                                }
                            }
                            else {
                                entry.props[name] = value;
                            }
                        }
                        else if (atype <= 2) {
                            // a 'top level binding', to an element attribute.
                            if (attrib.textNode || (name === "innerHTML")) {
                                Sys.Application._clearContent(element);
                            }
                            value = Sys.Application._getPropertyValue(attrib, element, name, value, templateContext);
                            if (typeof(value) === "undefined") continue;
                            switch(attrib.type) {
                                case 0:
                                    // sys:x attribute
                                    // we use createAttribute/setAttributeNode because it works more reliably in IE
                                    // for example, in IE, table.setAttribute("cellspacing", x) fails (it expects cellSpacing),
                                    // but setAttributeNode works.
                                    // There are many exceptions in various browsers... all exceptions interject with an 'if'
                                    // and break if they took care of the attribute, or do not break if they still also rely
                                    // on the default behavior.
                                    if (/^on/i.test(name)) {
                                        // The only way to tell it is an event attribute is if it starts with 'on'.
                                        element[name] = document.attachEvent ? new Function(value) : new Function("event", value);
                                        break;
                                    }
                                    if (isSelect && (name === "value")) {
                                        // in opera, setting the value of a <select> doesn't work with setAttribute/Node
                                        element.value = value;
                                        break;
                                    }
                                    var booleans = Sys.UI.Template._booleanAttributes,
                                        lowerTag = element.tagName.toLowerCase(),
                                        isbool = (name === "disabled") || (booleans[lowerTag] && booleans[lowerTag][name]);
                                    if (isbool) {
                                        if (name === "selected") {
                                            // in opera, setting option.selected doesn't work with setAttribute/Node
                                            // but also go ahead and use setAttributeNode below for consistency as it
                                            // does show up in its attributes collection.
                                            // This special case also needed because the 'selected' attribute can be flipped to true
                                            // via side effects, and so there is no actual attribute to remove if "value" is false.
                                            // For example, a <select> will have its first option selected by default, even if that
                                            // option has no 'selected' attribute.
                                            element.selected = value;
                                        }
                                        if (!value) {
                                            // try to remove the attribute if it exists
                                            // note: setAttriubte to blank should technically work, but is quirky -- in IE8
                                            // a blank value is still interpreted as true.
                                            element.removeAttribute(name);
                                            break;
                                        }
                                        else if (name === "checked") {
                                            // setAttribute required for setting 'checked' to true in IE
                                            element.setAttribute(name, name);
                                            break;
                                        }
                                    }
                                    var a = document.createAttribute(name);
                                    // booleans look like checked="checked" if the value is 'true-ish',
                                    a.nodeValue = isbool ? name : value;
                                    element.setAttributeNode(a);
                                    break;
                                case 1:
                                    // sys:x attribute that needs direct setting rather than setAttribute
                                    // using Observer is a cheap way of supporting a '.' in the name (such as style.cssText)
                                    if (attrib.textNode) {
                                        Sys.Application._clearContent(element);
                                        element.appendChild(document.createTextNode(value));
                                    }
                                    else {
                                        Sys.Observer.setValue(element, name, value);
                                    }
                                    break;
                                case 2:
                                    // sys:class-x attribute
                                    value ? Sys.UI.DomElement.addCssClass(element, name) : Sys.UI.DomElement.removeCssClass(element, name);
                                    break;
                            }
                        }
                        // atype              
                    }
                    // for each attribute2
                }
                // if attributes2
                // call any attachments to regular functions
                if (fnIndex) {  
                    for (j = 0, m = fnIndex.length; j < m; j++) {
                        entry = fnIndex[j];
                        templateContext._registerIf(entry.instance(element, entry.props, templateContext));
                    }      
                }
                if (index) {
                    for (entry in index) {
                        if (index.hasOwnProperty(entry)) {
                            // register all components with the application
                            // Dev10 659564: Must do this after processing the attributes so we are certain
                            // a declared ID was set first.
                            entry = index[entry];
                            if (entry && entry.isClass) {
                                templateContext._registerComponent(entry.instance);
                            }
                        }
                    }
                }
            } // if activated
            ///// end element activatation
        } // no expandos or already activated
        // See if the element we just activated is a sys-template. If so, we should skip
        // its descendants.
        if (recursive) {
            var className = element.className;
            if (className && (className.length >= 12) && ((className === "sys-template") || isTemplate.test(className))) {
                // skip to the node's next element sibling to skip over its child elements
                // get the current node's next element sibling
                var next = element.nextSibling;
                while (next && (next.nodeType !== 1)) {
                    next = next.nextSibling;
                }
                // if it doesnt have an element next sibling, get it from the parent node,
                // if that parent node doesnt have a next sibling, get it from it's parent, etc.
                while (!next) {                        
                    element = element.parentNode;
                    if (element === parent) {
                        break;
                    }
                    next = element.nextSibling;
                    while (next && (next.nodeType !== 1)) {
                        next = next.nextSibling;
                    }
                }
                if (!next || (next.nodeType !== 1)) {
                    // skipping over the last element in the list, so just break out
                    break;
                }
                // next is now the node to skip to, find it
                do {
                    element = allElements[i+1];
                    if (element === next) break;
                    i++;
                }
                while (element);
            }
        }
    } // allElements
    // yes I intended to write an assignment here
    // need the i increment and the assignment to both be in the while condition so that 'continue' triggers it
    while (!!(element = allElements[++i])); 
}

$type._clearContent = function Application$_clearContent(element) {
    var err;
    Sys.Application.disposeElement(element, true);
    try { element.innerHTML = ""; }
    catch(err) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}
$type._getCommandAttr = function Application$_getCommandAttr(element, name, useDirect, templateContext) {
    var err, value = null;
    try {
        value = useDirect ? element[name] : element.getAttribute(name);
        value = value ? Sys.Application._getPropertyValue(null, null, null, value, templateContext, null, true) : null;
    }
    catch(err) { }
    return value;
}
$type._directAttributes = {
    "style": "style.cssText",
    "class": "className",
    "cellpadding" : "cellPadding",
    "cellspacing" : "cellSpacing",
    "colspan" : "colSpan",
    "rowspan" : "rowSpan",
    "contenteditable" : "contentEditable",
    "valign" : "vAlign",
    "innertext": "innerText",
    "innerhtml": "innerHTML"
}
$type._splitAttribute = function Application$_splitAttribute(attributeName, isSelect, typeIndex) {
    // Splits an attribute name into its namespace prefix and its name,
    // then tries to figure out what kind of attribute is and provides
    // metadata about it in the return value.
    //type -1: normal nonprefixed attribute, should be ignored
    //type 0: normal 'sys:' prefixed attribute
    //type 1: attriubte that needs to be set via a field (select.selectedIndex = foo),
    //        includes sys:style-foo-bar, which are translated to name = style.fooBar
    //        includes special attributes that work better x-browser if set via field (class=className, style=style.cssText)
    //type 2: "sys:class-foo" attribute, should be assigned via add/remove css class (name set to just "foo")
    //type 3: foo:bar component property attribute setter (name is mapped to the type's casing in it's prototype automatically)
    //type 4: sys:command/argument/target for command bubbling
    var nameParts = attributeName.split(':'),
            ns = nameParts.length > 1 ? nameParts[0] : null,
            name = nameParts[ns ? 1 : 0],
            type = -1,
            textNode, map, index, isSys = (ns === "sys"),
            lowerName = name.toLowerCase(),
            isNative = !ns;
    if (!ns || isSys) {
        var newName = Sys.Application._directAttributes[lowerName];
        if (newName) {
            type = 1;
            if (name === "innertext") {
                textNode = true;
            }
            name = newName;
        }
        else if (isSelect) {
            // setting the value or index for a select doesn't work until after the child options
            // are created, and must be set directly rather than created with createAttribute.
            if (lowerName === "selectedindex") {
                // convert to proper casing
                name = "selectedIndex";
                type = 1;
            }
            else if (name === "value") {
                type = 1;
            }
            else if (isSys) {
                type = 0;
                ns = null;
            }
        }
        else if (isSys) {
            if ((name === "command") || (name === "commandargument") || (name === "commandtarget")) {
                type = 4; // command bubbling
            }
            else if (name.indexOf("style-") === 0) {
                // sys:style-foo="" ==> e.style.foo
                // sys:style-foo-bar="" ==> e.style.fooBar
                // For sub-strings after 'style-', remove dashes, and make the character after them uppercase
                name = "style." + Sys.Application._translateStyleName(name.substr(6));
                type = 1;
            }
            else if (name.indexOf("class-") === 0) {
                name = name.substr(6);
                type = 2;
            }
            else {
                // other sys attributes are just pass-through
                ns = null;
                type = 0;
            }        
        }
    }
    else if (typeIndex) {
        index = typeIndex[ns];
        if (index) {
            type = 3;
            if (index.isClass) {
                map = Sys.Application._translateName(name, index.type);
                name = map.name;
            }
        }
        else {
            // a namespaced attribute that does not map to an attached type
            // so it is treated like a regular dom element attribute and added
            // as-is (e.g. xml:lang="foo")
            name = ns + ":" + name;
            ns = null;
            type = -1;
       }
    }
    else {
        name = ns + ":" + name;
        ns = null;
        type = -1;
    }
    return { ns: ns, name: name, type: type, map: map, index: index, textNode: textNode, isNative: isNative };
}

$type._translateStyleName = function Application$_translateStyleName(name) {
    // remove dashes, and make the character after them uppercase
    if (name.indexOf('-') === -1) return name;
    var parts = name.toLowerCase().split('-'),
        // dont uppercase the first one
        newName = parts[0];
    for (var i = 1, l = parts.length; i < l; i++) {
        var part = parts[i];
        newName += part.substr(0, 1).toUpperCase() + part.substr(1);
    }
    return newName;
}

$type._getExtensionCode = function Application$_getExtensionCode(extension, doEval, templateContext) {
    extension = extension.trim();
    var name, properties, propertyBag = {}, spaceIndex = extension.indexOf(' ');
    if (spaceIndex !== -1) {
        name = extension.substr(0, spaceIndex);
        properties = extension.substr(spaceIndex + 1);
        if (properties) {
            properties = properties.replace(/\\,/g, '\u0000').split(",");
            for (var i = 0, l = properties.length; i < l; i++) {
                var property = properties[i].replace(/\u0000/g, ","),
                        equalIndex = property.indexOf('='),
                        pValue, pName;
                if (equalIndex !== -1) {
                    pName = property.substr(0, equalIndex).trim();
                    pValue = property.substr(equalIndex + 1).trim();
                    if (doEval) {
                        // null for target and name since we dont support nested extensions
                        pValue = this._getPropertyValue(null, null, null, pValue, templateContext, true);
                    }
                }
                else {
                    pName = "$default";
                    pValue = property.trim();
                }
                propertyBag[pName] = pValue;
            }
        }
    }
    else {
        name = extension;
    }
    return { instance: Sys.Application._getMarkupExtension(name), name: name, properties: propertyBag };
}

$type._getPropertyValue = function Application$_getPropertyValue(attrib, target, name, value, templateContext, inExtension, suppressExtension) {
    var propertyValue = value;
    if (value.startsWith("{{") && value.endsWith("}}")) {
        propertyValue = this._evaluateExpression(value.slice(2, -2), templateContext);
    }
    else if (!suppressExtension && !inExtension && value.startsWith("{") && value.endsWith("}")) {
        var extension = this._getExtensionCode(value.slice(1, -1), true, templateContext);
        propertyValue = extension.instance.extension(target, (attrib.type === 2 ? "class:" : "") + name, templateContext, extension.properties);
    }
    return propertyValue;
}
$type._tryName = function Application$_tryName(name, type) {
    var prototype = type.prototype,
        setterName = "set_" + name, setter = prototype[setterName];
    if (setter) {
        return { name: name, setterName: setterName, setter: setter, type: 1 };
    }
    if (name.startsWith('on')) {
        setterName = "add_" + name.substr(2);
        var adder = prototype[setterName];
        if (adder) {
            return { name: name, setterName: setterName, setter: adder, type: 2 };
        }
    }
    if (typeof(prototype[name]) !== "undefined") {
        return { name: name };
    }
    return null;
}
$type._translateName = function Application$_translateName(name, type) {
    //#if DEBUG
    if (name && (name !== name.toLowerCase())) {
        throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.invalidAttributeName, name));
    }
    //#endif
    var cache, index = Sys.Application._prototypeIndex[type.__typeName];
    if (index) {
        cache = index[name];
        if (cache) return cache;
    }
    else {
        index = {};
    }    
    type.resolveInheritance();
    cache = Sys.Application._tryName(name, type);
    if (!cache) {
        var casedName = Sys.Application._mapToPrototype(name, type);
        if (casedName && (casedName !== name)) {
            cache = Sys.Application._tryName(casedName, type);
        }
        if (!cache) {
            cache = { name: name };
        }
    }
    index[name] = cache;
    return cache;
}
$type._mapToPrototype = function Application$_mapToPrototype(name, type) {
    // maps a function/field name case-insensitively to its actual casing, if it exists.
    var fixedName, caseIndex = Sys.Application._caseIndex[type.__typeName];
    if (!caseIndex) {
        caseIndex = {};
        type.resolveInheritance();
        for (var memberName in type.prototype) {
            if (memberName.startsWith("get_") || memberName.startsWith("set_") || memberName.startsWith("add_")) {
                memberName = memberName.substr(4);
            }
            else if (memberName.startsWith("remove_")) {
                memberName = memberName.substr(7);
            }
            caseIndex[memberName.toLowerCase()] = memberName;
        }
        Sys.Application._caseIndex[type.__typeName] = caseIndex;
    }
    name = name.toLowerCase();
    // onfoo should first map to add_foo event
    if (name.startsWith('on')) {
        fixedName = caseIndex[name.substr(2)];
        // if there is no add_foo event it should map to a get/set_onfoo or field named onfoo
        if (fixedName) {
            fixedName = "on" + fixedName;
        }
        else {
            fixedName = caseIndex[name];
        }
    }
    else {
        // does not start with 'on' so it is always a get/set/field
        fixedName = caseIndex[name];
    }
    return fixedName;
}
$type._doEval = function Application$_doEval(__expression, $context) {
    with({$context:$context}) {
        with($context.dataItem || {}) {
            return eval("(" + __expression + ")");
        }
    }
}
$type._evaluateExpression = function Application$_evaluateExpression($expression, $templateContext) {
    return Sys.Application._doEval.call($templateContext.dataItem, $expression, $templateContext);
}

$type._registerComponent = function Application$_registerComponent(element, component) {
    // a means of 'attaching' a component to an element so it may be automatically disposed of
    // when the element is destroyed. This should only need to happen if the component is not
    // a control or behavior. It is not necessarily a Sys.Component.
    var components = element._components;
    if (!components) {
        element._components = components = [];
    }
    components.push(component);
}

$type._activateOnPartial = function Application$_activateOnPartial(panel, rendering) {
    this._doUpdatePanel(panel, rendering);
    if (Sys.activateDom) {
        Sys.query(panel).activateElements();
    }
}

$type._raiseInit = function Application$_raiseInit() {
    this.beginCreateComponents();
    Sys.Observer.raiseEvent(this, "init");
    if (Sys.activateDom) {
        Sys.query(document.documentElement).activateElements();
    }
    if (Sys.WebForms && Sys.WebForms.PageRequestManager) {
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        prm._doUpdatePanel = prm._updatePanel;
        prm._updatePanel = Sys.Application._activateOnPartial;
    }
    this.endCreateComponents();
}
