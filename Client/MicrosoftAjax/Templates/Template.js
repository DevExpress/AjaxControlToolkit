$type = Sys.UI.Template = function Template(element) {
    /// <summary locid="M:J#Sys.UI.Template.#ctor"></summary>
    /// <param name="element" domElement="true" mayBeNull="false">The element that contains the template.</param>
    this._element = element;
    this._instantiateIn = null;
    this._instanceId = 0;
}
$type.prototype = {
    get_element: function Template$get_element() {
        /// <value domElement="true" locid="P:J#Sys.UI.Template.element">The root element of the template.</value>
        return this._element;
    },
    dispose: function Template$dispose() {
        this._element = null;
        this._instantiateIn = null;
    },
    _appendTextNode: function Template$_appendTextNode(code, storeElementCode, text) {
        code.push(storeElementCode, "document.createTextNode(", serialize(text), "));\n");
    },
    _appendAttributeSetter: function Template$_appendAttributeSetter(code, typeIndex, attrib, expression, isExpression, booleanValue) {
        var ns = attrib.ns, name = attrib.name, restricted = (!ns && Sys.UI.Template._isRestricted(name));
        if (restricted) {
            expression = "Sys.UI.Template._checkAttribute('" + name + "', " + expression + ")";
        }
        switch (attrib.type) {
            case 1:
                // dom attribute that needs a direct set or a text node created (not createAttribute)
                code.push("  $component = $element;\n  ");
                if (isExpression) {
                    if (attrib.textNode) {
                        // sys:innertext requires creating a text node
                        code.push("$element.appendChild(document.createTextNode(", expression, "));\n");
                    }
                    else {
                        code.push("$element.", name, " = ", expression, ";\n");
                    }
                }
                else {
                    code.push(expression, ";\n");
                }
                if (attrib.textNode || name === "innerHTML") return true;
                break;
            case 2: 
                // sys:class-foo attribute to set a css class on the element. The class name is the sub-string after 'class-'.
                // sys:class-foo="" ==> value ? DE.addCssClass('name') : DE.removeCssClass('name')
                if (isExpression) {
                    name = serialize(name);
                    code.push("  $component = $element;\n    (", expression,
                                ") ? Sys.UI.DomElement.addCssClass($element, ", name,
                                ") : Sys.UI.DomElement.removeCssClass($element, ", name, ");\n");
                }
                else {
                    code.push("  $component = $element;\n  ", expression, ";\n");
                }
                break;
            case 3:
                // foo:bar component reference property
                var index = typeIndex[ns];
                if (index.isClass) {
                    code.push("  $component = __componentIndex['", ns, "'];\n");
                    if (isExpression) {
                        var map = attrib.map;
                        if (map.type === 1) {
                            code.push("  $component.", map.setterName, "(", expression, ");\n");
                        }
                        else if (map.type === 2) {
                            code.push("  __f = ", expression, ";\n", 
                                      "  $component.", map.setterName, '(typeof(__f) === "function" ? __f : new Function("sender", "args", __f));\n');
                        }
                        else {
                            code.push("  $component.", map.name, " = ", expression, ";\n");
                        }
                    }
                    else {
                        code.push("  ", expression, ";\n");
                    }
                }
                else {
                    //#if DEBUG
                    if (!isExpression) {
                        throw Error.invalidOperation(); // todo: can't have a non-expression based attribute for a fn() call
                    }
                    //#endif
                    var prop = serialize(attrib.name) + ": " + expression;
                    if (!index.props) {
                        index.props = prop;
                    }
                    else {
                        index.props += ", " + prop;
                    }
                }
                break;
            case 4:
                // sys:command/sys:commandargument/sys:commandtarget case
                this["_" + name] = expression;
                break;
            default:
                // dom attribute
                if (isExpression) {
                    if (/^on/i.test(name)) {
                        // The only way to tell it is an event attribute is if it starts with 'on'.
                        code.push("  $component = $element;\n  $element." + name + " = new Function(" +
                            (document.attachEvent ? "" : "'event', ") + expression + ");\n");
                    }
                    else {
                        if (booleanValue) {
                            // boolean attributes such as 'checked' and 'disabled' dont really have a value.
                            // They are either there or not.
                            code.push("  $component = $element;\n  if (" + expression +
                                        ") {\n    __e = document.createAttribute('" + name +
                                        "');\n    __e.nodeValue = \"" + booleanValue + "\";\n    $element.setAttributeNode(__e);\n  }\n");
                        }
                        else {
                            code.push("  $component = $element;\n  __e = document.createAttribute('" + name + "');\n  __e.nodeValue = " +
                                    expression + ";\n  $element.setAttributeNode(__e);\n");
                        }
                    }
                }
                else {
                    // note that expression might reference $component
                    // this is the code path for non-expression markup extensions on element properties, e.g. value="{binding}"
                    code.push("  $component = $element;\n  " + expression + ";\n");
                }
                break;
        }
        return false;
    },
    _processAttribute: function Template$_processAttribute(code, typeIndex, attrib, value, booleanValue) {
        value = this._getAttributeExpression(attrib, value);
        if (value) {
            return this._appendAttributeSetter(code, typeIndex, attrib,
                value.code, value.isExpression, booleanValue);
        }
        return false;
    },
    _getAttributeExpression: function Template$_getAttributeExpression(attrib, value, noSerialize) {
        var type = typeof(value);
        if (type === "undefined") return null;
        if (value === null) return { isExpression: true, code: "null" };
        if (!attrib.isNative && (type === "string")) {
            if (value.startsWith("{{") && value.endsWith("}}")) {
                return { isExpression: true, code: value.slice(2, -2).trim() };
            }
            else if (value.startsWith("{") && value.endsWith("}")) {
                var ext = Sys.Application._getExtensionCode(value.slice(1, -1)),
                    properties = ext.properties,
                    props = "";
                for (var name in properties) {
                    var subValue = this._getAttributeExpression(attrib, properties[name]);
                    if (subValue && subValue.isExpression) {
                        var prop = serialize(name) + ":" + subValue.code;
                        if (props) {
                            props += "," + prop;
                        }
                        else {
                            props = prop;
                        }
                    }
                }
                // we use 'class:XXX' as target property for markup extension as a convention so the extension can 
                // recognize the css class of the elements as the target and use add/removeCssClass.
                return { isExpression: ext.instance.expression, 
                    code: "Sys.Application._getMarkupExtension(" + serialize(ext.name) + ").extension($component, " +
                        serialize((attrib.type === 2 ? "class:" : "") + attrib.name) +
                        ", $context, {" + props + "})" };
            }
        }
        if (attrib.isId) {
            // id="<anything>", or,
            // sys:id="<not-an-expression>"
            noSerialize = true;
            value = '$id(' + serialize(value) + ')';
        }
        return { isExpression: true, code: (noSerialize ? value : serialize(value)) };
    },
    _processBooleanAttribute: function Template$_processBooleanAttribute(element, code, typeIndex, name) {
        var value, isNative, node = element.getAttributeNode("sys:" + name);
        if (!node) {
            isNative = true;
            node = element.getAttributeNode(name);
            if (node && (node.specified || (node.nodeValue === true))) {
                // in IE, node.specified is never true for at least some boolean attributes
                // like 'selected'. But nodeValue would be true if really were specified.
                value = true;
            }
            else if (element.getAttribute(name) === name) {
                // in IE8, element.getAttribute("selected") === "selected",
                // but element.getAttributeNode("selected") is null
                value = true;
            }
            else {
                return;
            }
        }
        else {
            value = node.nodeValue;
            if (value === "true") {
                value = true;
            }
            else if (value === "false") {
                return;
            }
        }
        this._processAttribute(code, typeIndex, { name: name, isNative: isNative }, value, name);
    },
    _processBooleanAttributes: function Template$_processBooleanAttributes(element, code, typeIndex, attributes) {
        var name, node, value;
        for (var i = 0, l = attributes.length; i < l; i++) {
            this._processBooleanAttribute(element, code, typeIndex, attributes[i]);
        }
    },
    _processCodeBlock: function Template$_processCodeBlock(name, element, code) {
        var value = this._getExplicitAttribute(null, null, element, name);
        if (value) {
            value = this._getAttributeExpression({ name: name }, value, true).code;
            code.push((name === "sys:if") ? ("  if (" + value + ") {\n")
                        : ("  " + value + "\n"));
        }
        return !!value;
    },
    _getExplicitAttribute: function Template$_getExplicitAttribute(code, typeIndex, element, name, processName, isNative, attrib) {
        var e, node, value;
        if (name === "style" && element.style) {
            value = element.style.cssText;
        }
        else {
            try {
                node = element.getAttributeNode(name);
                if (node && node.specified) {
                    value = node.nodeValue;
                }
            }
            catch (e) {
            }
        }
        if (value && processName) {
            this._processAttribute(code, typeIndex, merge({ name: processName, type: 1, isNative: isNative }, attrib), value);
        }
        return value;
    },
    _buildTemplateCode: function Template$_buildTemplateCode(nestedTemplates, element, code, depth) {
        var i, j, l, m, typeName, isInput, isButton,
            expressionRegExp = Sys.UI.Template._expressionRegExp,
            storeElementCode = "  " + (depth ? ("__p[__d-1].appendChild(") : "__topElements.push("),
            isIE = isBrowser("InternetExplorer");
            
        code.push("  __d++;\n");
        for (i = 0, l = element.childNodes.length; i < l; i++) {
            var childNode = element.childNodes[i], text = childNode.nodeValue;

            if (childNode.nodeType === 8) {
                code.push(storeElementCode + "document.createComment(" + serialize(text) + "));\n");
            }
            else if (childNode.nodeType === 3) {
                // check for text node that is a markup extension
                // e.g. <span>{Binding ..}</span>
                var trimText = text.trim();
                if (trimText.startsWith("{") && trimText.endsWith("}") && (!trimText.startsWith("{{") || !trimText.endsWith("}}"))) {
                    var attribName, setComponentCode;
                    setComponentCode = '$component=$element;\n';
                    if (element.tagName.toLowerCase() === "textarea") {
                        attribName = "value";
                    }
                    else {
                        attribName = "innerText";
                    }
                    var expr = this._getAttributeExpression({name:attribName}, trimText);
                    if (expr.isExpression) {
                        code.push(storeElementCode, "document.createTextNode(", expr.code, "));\n");
                    }
                    else {
                        // probably a {Binding}
                        code.push('$component=$element;\n', '  ', expr.code, ';\n');
                    }
                }
                else {
                    // normal text node, but it might have }} embedded blocks
                    var match = expressionRegExp.exec(text), lastIndex = 0;
                    while (match) {
                        var catchUpText = text.substring(lastIndex, match.index);
                        if (catchUpText) {
                            this._appendTextNode(code, storeElementCode, catchUpText);
                        }
                        code.push(storeElementCode, "document.createTextNode(", match[1], "));\n");
                        lastIndex = match.index + match[0].length;
                        match = expressionRegExp.exec(text);
                    }
                    if (lastIndex < text.length) {
                        this._appendTextNode(code, storeElementCode, text.substr(lastIndex));
                    }
                }
            }
            else {
                var attributes = childNode.attributes,
                    typeNames = null, sysAttribute = null, typeIndex = {},
                    tagName = childNode.tagName.toLowerCase(),
                    booleanAttributes,  dp1 = depth + 1;
                if (tagName === "script") {
                    // script elements are skipped. they do not work across browsers in this way.
                    // even if they did, it's more appropriate to consider script elements as executed
                    // already by the browser for the intent of modifying the template itself, not the
                    // instances of the template.
                    continue;
                }
                var isCodeIfGenerated = this._processCodeBlock("sys:if", childNode, code);
                this._processCodeBlock("sys:codebefore", childNode, code);
                isButton = (tagName === "button");
                isInput = isButton || (tagName === "input");
                if (isInput) {
                    var typeExpression = childNode.getAttribute("sys:type");
                    typeExpression = typeExpression ?
                        this._getAttributeExpression({ name: "type" }, typeExpression) :
                        this._getAttributeExpression({ name: "type", isNative: true }, childNode.getAttribute("type"));             
                    var nameExpression = childNode.getAttribute("sys:name");
                    nameExpression = nameExpression ?
                        this._getAttributeExpression({ name: "name" }, nameExpression) :
                        this._getAttributeExpression({ name: "name", isNative: true }, childNode.getAttribute("name"));
                    //#if DEBUG
                    if (!typeExpression.isExpression || !nameExpression.isExpression) {
                        throw Error.invalidOperation(Sys.UI.TemplatesRes.mustSetInputElementsExplicitly);
                    }
                    //#endif
                    code.push("  $element=__p[__d]=Sys.UI.Template._createInput(" + typeExpression.code + ", " + nameExpression.code + ", " + isButton + ");\n");
                    booleanAttributes = Sys.UI.Template._inputBooleanAttributes;
                    this._processBooleanAttributes(childNode, code, typeIndex, booleanAttributes[" list"]);
                }
                else {
                    code.push("  $element=__p[__d]=document.createElement('" + childNode.nodeName + "');\n");
                }
                if (!depth) {
                    // top level elements have thier template context index set as an expando so that 
                    // we can find the template context for a given element later on.
                    code.push(" $element.__mstcindex = $context._tcindex;\n");
                }
                // apply the id attribute if it exists. sys:id takes precedence over id
                this._getExplicitAttribute(code, typeIndex, childNode, "sys:id", "id", false, { isId: true }) ||
                    this._getExplicitAttribute(code, typeIndex, childNode, "id", "id", true, { isId: true });

                // process the sys:attach attribute if found
                typeNames = this._getExplicitAttribute(code, typeIndex, childNode, "sys:attach");
                if (typeNames) {
                    typeNames = typeNames.split(',');
                    code.push("  __componentIndex = {}\n");
                    // for each value in sys:type, separated by commas, find the corresponding type,
                    // and append code to instantiate it.
                    for (j = 0, m = typeNames.length; j < m; j++) {
                        typeName = typeNames[j].trim();
                        if (typeIndex[typeName]) continue; // already creating that type
                        var type = Sys.Application._findType(childNode, typeName, isIE);
                        //#if DEBUG
                        if (!type) {
                            throw Error.invalidOperation(String.format(Sys.UI.TemplatesRes.invalidAttach, "sys:attach", typeName));
                        }
                        //#endif
                        // typeIndex used at compile time to ensure a ns:type attribute corresponds to a declared type.
                        // __componentIndex used at instantiation time to reference created components for property settings.
                        var isComponent, isControlOrBehavior, isContext,
                            isClass = typeof(type) !== "string";
                        if (isClass) {
                            isComponent = type.inheritsFrom(Sys.Component);
                            isControlOrBehavior = (isComponent && (type.inheritsFrom(Sys.UI.Behavior) || type.inheritsFrom(Sys.UI.Control)));
                            isContext = type.implementsInterface(Sys.UI.ITemplateContextConsumer);
                        }
                        typeIndex[typeName] = { type: type, isClass: isClass, isComponent: isComponent };
                        if (isClass) {
                            code.push("  __componentIndex['" + typeName + "'] = $component = new " + type.getName());
                            if (isControlOrBehavior) {
                                // controls and behaviors need the element in the constructor
                                code.push("($element);\n");
                            }
                            else {
                                // components use the default constructor
                                // and need to be added to the element's component list for disposal
                                code.push("();\n  Sys.Application._registerComponent($element, $component);\n");
                            }
                            if (isComponent) {
                                // components follow the beginUpdate/endUpdate model. While processing
                                // nodes components are put into update mode. After the entire template
                                // is instantiated each componet is initialized with endUpdate().
                                code.push("  $component.beginUpdate();\n");
                            }
                            if (isContext) {
                                code.push("  $component.set_templateContext($context);\n");
                            }
                            // look for foo:id and process now. This will allow cross-referencing between multiple
                            // components on the same element since are looking for them now instead of along with
                            // the other attributes. We also auto-mangle the IDs if they aren't expressions 
                            // to ensure uniqueness.
                            var idattr = typeName + ":id",
                                typeattr = Sys.Application._splitAttribute(idattr, false, typeIndex);
                            typeattr.isId = true;
                            this._getExplicitAttribute(code, typeIndex, childNode, idattr, "id", false, typeattr);
                        }
                        // else -- its a function but not a class, call it with the following
                        // signature once we have all of its property attributes:
                        // fn(element, properties, templateContext);
                    }
                }
                // apply style and class attributes
                // do these first so that the native style and class of an element is always applied before
                // any sys:style-foo or sys:class-foo attributes are found.
                this._getExplicitAttribute(code, typeIndex, childNode, "style", "style.cssText", true);
                this._getExplicitAttribute(code, typeIndex, childNode, "class", "className", true);
                
                // must explictly look for boolean attributes
                if (!isInput) {
                    booleanAttributes = Sys.UI.Template._booleanAttributes[tagName] ||
                        Sys.UI.Template._commonBooleanAttributes;
                    this._processBooleanAttributes(childNode, code, typeIndex, booleanAttributes[" list"]);
                }
                
                var isSelect = (tagName === "select"),
                    // attributes that are processed after all child nodes are processed first.
                    delayedAttributes = null,
                    split = Sys.Application._splitAttribute,
                    skipChildren = false,
                    // certain attributes are processed ahead of time and should be skipped if encountered here
                    skip = {'id':1,'class':1,'style':1,'sys:attach':1,'sys:id':1,'sys:disabled':1,'sys:checked':1,'sys:readonly':1,'sys:ismap':1,'sys:multiple':1,'sys:selected':1,'sys:if':1,'sys:codebefore':1,'sys:codeafter':1};
                for (j = 0, m = attributes.length; j < m; j++) {
                    var attribute = attributes[j], name = attribute.nodeName, lowerName = name.toLowerCase();
                    // ignore attributes that werent actually specified in the markup (.specified=false)
                    // except in IE, value on inputs are always specified=false.
                    if (!attribute.specified && (!isInput || lowerName !== "value")) continue;
                    // class and style attributes were processed manually already
                    // boolean attributes were processed manually already
                    // also skip attributes that already had a 'sys' version processed so they take priority
                    if (skip[lowerName] || booleanAttributes[lowerName]) continue;
                    // on inputs, we already processed 'type' and 'name' attributes
                    if (isInput && Sys.UI.Template._inputRequiredAttributes[lowerName]) continue;
                    var attrib = split(name, isSelect, typeIndex),
                        ns = attrib.ns,
                        value = attribute.nodeValue,
                        atype = attrib.type;
                    name = attrib.name;
                    if (atype === 1) {
                        // type 1: attribute that needs to be set via a field instead of appendAttribute,
                        // may be 'sys' or not.
                        if (isSelect && (!ns || ns === "sys")) {
                            // dont process type 1 attributes for <selects> until after the element
                            // has been appended to the dom.
                            delayedAttributes = delayedAttributes || [];
                            delayedAttributes.push([attrib,value]);
                            continue;
                        }
                        skip[name.toLowerCase()] = true;
                    }
                    else if (atype === 0) {
                        // type 0: "sys" prefixed attribute                    
                        skip[name.toLowerCase()] = true;                        
                    }
                    else if (atype === 3 && name === "id" && typeIndex[ns] && typeIndex[ns].isClass) {
                        // type 3: foo:bar component property
                        // already processed foo:id attributes for components in sys:attach
                        continue;
                    }
                    if (this._processAttribute(code, typeIndex, attrib, value)) {
                        skipChildren = true;
                    }
                }
                if (this._command) {
                    code.push(" Sys.query($element).setCommand(" + this._command  + ", " + (this._commandargument || 'null') + ", Sys.UI.DomElement._ensureGet(" + (this._commandtarget || 'null') + ", $context, 'sys:commandtarget'));\n");
                    this._command = null;
                }
                this._commandargument = null;
                this._commandtarget = null;

                code.push(storeElementCode + "$element);\n");
                
                for (typeName in typeIndex) {
                    var index = typeIndex[typeName];
                    if (index.isClass) {
                        // register potentially created components for this element with application
                        code.push("  $context._registerComponent(__componentIndex['" + typeName + "']);\n");
                    }
                    else {
                        // call the function, fn(element, properties, templateContext)
                        code.push("  $context._registerIf(");
                        code.push(index.type);
                        code.push("($element, ");
                        code.push("{" + (index.props||"") + "}, $context));\n");
                    }
                }
                // recursively process child nodes -- unless the element is a template,
                // or a sys:innertext or sys:innerhtml attribute was used.
                if (Sys.UI.Template._isTemplate(childNode)) {
                    // this element is a nested template.
                    // The nested templates are stored on the _msajaxtemplate reference, in index 1.
                    // When instantiateIn is called on this template, the root of the child template is created as usual,
                    // with the _msajaxtemplate expando set to the child template instance of the appropriate index.
                    // This way, the root of the template is created with each instance, but
                    // the actual template isn't recompiled each time.
                    var nestedTemplate = new Sys.UI.Template(childNode);
                    nestedTemplate.recompile();
                    nestedTemplates.push(childNode._msajaxtemplate);
                    code.push("  $element._msajaxtemplate = this.get_element()._msajaxtemplate[1][" + (nestedTemplates.length-1) + "];\n");
                }
                else if (!skipChildren) {
                    this._buildTemplateCode(nestedTemplates, childNode, code, dp1);
                    // restore $element reference now that this element is completed
                    code.push("  $element=__p[__d];\n");
                }
                if (delayedAttributes) {
                    for (j = 0, m = delayedAttributes.length; j < m; j++) {
                        attribute = delayedAttributes[j];
                        this._processAttribute(code, typeIndex, attribute[0], attribute[1]);
                    }
                }
                this._processCodeBlock("sys:codeafter", childNode, code);
                if (isCodeIfGenerated) {
                    code.push("  }\n");
                }
            }
        }
        code.push("  --__d;\n");
    },
    _ensureCompiled: function Template$_ensureCompiled() {
        if (!this._instantiateIn) {
            var element = this.get_element();
            if (element._msajaxtemplate) {
                this._instantiateIn = element._msajaxtemplate[0];
            }
            else {
                this.recompile();
            }
        }
    },
    recompile: function Template$recompile() {
        /// <summary locid="M:J#Sys.UI.Template.recompile">Compiles the template.</summary>
        var element = this.get_element(),
            code = [" $index = (typeof($index) === 'number' ? $index : __instanceId);\n var $component, __componentIndex, __e, __f, __topElements = [], __d = 0, __p = [__containerElement], $element = __containerElement, $context = new Sys.UI.TemplateContext(), $id = function(prefix) { return $context.getInstanceId(prefix); };\n $context.data = (typeof(__data) === 'undefined' ? null : __data);\n $context.components = [];\n $context.nodes = __topElements;\n $context.dataItem = $dataItem;\n $context.index = $index;\n $context.parentContext = __parentContext;\n $context.containerElement = __containerElement;\n $context.insertBeforeNode = __referenceNode;\n $context.template = this;\n with($dataItem || {}) {\n"],
            nestedTemplates = [];
        this._buildTemplateCode(nestedTemplates, element, code, 0);
        code.push("}\n $context._onInstantiated(__referenceNode);\n return $context;");
        code = code.join('');
        element._msajaxtemplate = [this._instantiateIn = new Function("__containerElement", "__data", "$dataItem", "$index", "__referenceNode", "__parentContext", "__instanceId", code), nestedTemplates];
    },
    instantiateIn: function Template$instantiateIn(containerElement, data, dataItem, dataIndex, nodeToInsertTemplateBefore, parentContext) {
        /// <summary locid="M:J#$id"></summary>
        /// <param name="containerElement"></param>
        /// <param name="data" optional="true" mayBeNull="true"></param>
        /// <param name="dataItem" optional="true" mayBeNull="true"></param>
        /// <param name="dataIndex" optional="true" mayBeNull="true" type="Number" integer="true"></param>
        /// <param name="nodeToInsertTemplateBefore" optional="true" mayBeNull="true">The child node of container before which to instantiate the template.</param>
        /// <param name="parentContext" type="Sys.UI.TemplateContext" optional="true" mayBeNull="true"></param>
        /// <returns type="Sys.UI.TemplateContext"></returns>
        containerElement = Sys.UI.DomElement._ensureGet(containerElement, null, "containerElement");
        nodeToInsertTemplateBefore = Sys.UI.DomElement._ensureGet(nodeToInsertTemplateBefore, null, "nodeToInsertTemplateBefore");
        this._ensureCompiled();
        return this._instantiateIn(containerElement, data, dataItem, dataIndex, nodeToInsertTemplateBefore, parentContext, this._instanceId++);
    }
}
$type._isRestricted = function Template$_isRestricted(name) {
    var restricted = Sys.UI.Template._getRestrictedIndex();
    return restricted.attributes[name.toLowerCase()];
}
$type._checkAttribute = function Template$_checkAttribute(name, value) {
    if (!value) return value;
    var newValue = value, restricted = Sys.UI.Template._getRestrictedIndex();
    if (restricted.attributes[name.toLowerCase()]) {
        // this attribute is to be checked
        // first see if the value begins with a scheme
        if (typeof(value) !== "string") {
            value = value.toString();
        }
        var match = Sys.UI.Template._protocolRegExp.exec(value.toLowerCase());
        if (match) {
            // scheme has been matched, now see if it is one of the allowed protocols
            if (!restricted.protocols[match[1]]) {
                newValue = "";
            }
        }
    }
    return newValue;
}
$type._getIdFunction = function Template$_getIdFunction(instance) {
    return function(prefix) {
        return prefix + instance;
    }
}
$type._createInput = function Template$_createInput(type, name, isButton) {
    var err, element, callee = arguments.callee, dynamic = callee._dynamic;
    if (dynamic === true) {
        element = document.createElement(isButton ? 'button' : 'input');
        // in chrome, must use setAttribute, .type doesn't work for buttons.
        if (type) {
            element.setAttribute("type", type);
        }
        if (name) {
            element.setAttribute("name", name);
        }
    }
    else {
        var html = isButton ? "<button " : "<input ";
        if (type) {
            html += "type='" + type + "' ";
        }
        if (name) {
            html += "name='" + name + "' ";
        }
        html += isButton ? "></button>" : "/>";
        try {
            element = document.createElement(html);
        }
        catch (err) {
            dynamic = true;
        }
        if (typeof(dynamic) === "undefined") {
            dynamic = (element.tagName.toLowerCase() !== (isButton ? "button" : "input"));
        }
        callee._dynamic = dynamic;
        if (dynamic) {
            element = callee(type, name, isButton);
        }
    }
    return element;
}
$type._isTemplate = function Template$_isTemplate(element) {
    var className = element.className;
    return (className && ((className === "sys-template") || /(^| )sys\-template($| )/.test(className)));
}
$type._inputRequiredAttributes = {"type":1, "name":1, "sys:type":1, "sys:name":1};
// w3c doesnt define 'disabled' on non input elements, but IE implements it.
// The boolean attribute structure is a dictionary of the attributes, and also contains 
// a list for faster enumeration. The name of the field for the list is leaded by a space,
// which is an easy way of making sure we dont consider an attribute named 'list' as a boolean
// attribute, since attribute names will never contain a space.
$type._commonBooleanAttributes = { disabled: true, " list" : ["disabled"] };
$type._inputBooleanAttributes =
    { disabled: true, checked: true, readonly: true,
        " list": ["disabled", "checked", "readonly"] };
$type._booleanAttributes = {
    "input": Sys.UI.Template._inputBooleanAttributes,
    "select": { disabled: true, multiple: true, " list": ["disabled", "multiple"] },
    "option": { disabled: true, selected: true, " list": ["disabled", "selected"] },
    "img": { disabled: true, ismap: true, " list": ["disabled", "ismap"] },
    "textarea": { disabled: true, readonly: true, " list": ["disabled", "readonly"] }
};
$type._expressionRegExp = /\{\{\s*([\w\W]*?)\s*\}\}/g;
$type.allowedProtocols = [
    "http",
    "https"
];
$type.restrictedAttributes = [
    "src",
    "href",
    "codebase",
    "cite",
    "background",
    "action",
    "longdesc",
    "profile",
    "usemap",
    "classid",
    "data"
];
$type._getRestrictedIndex = function Template$_getRestrictedIndex() {
    var i, l, protocolIndex, attributeIndex,
        protocols = Sys.UI.Template.allowedProtocols || [],
        attributes = Sys.UI.Template.restrictedAttributes || [],
        index = Sys.UI.Template._restrictedIndex;
    if (!index || (index.allowedProtocols !== protocols) || (index.restrictedAttributes !== attributes)) {
        index = { allowedProtocols: protocols, restrictedAttributes: attributes };
        index.protocols = protocolIndex = {};
        for (i = 0, l = protocols.length; i < l; i++) {
            protocolIndex[protocols[i]] = true;
        }
        index.attributes = attributeIndex = {};
        for (i = 0, l = attributes.length; i < l; i++) {
            attributeIndex[attributes[i]] = true;
        }
        Sys.UI.Template._restrictedIndex = index;
    }
    return index;
}
$type.registerClass("Sys.UI.Template", null, Sys.IDisposable);

// RFC2396 section 3.1 describes a scheme to be a sequence of characters beginning with a lowercase letter
// and followed by any combination of lowercase letters, digits, plus(+), minus(-), or period(.), followed by
// a colon(:).
// However, it also says agents may interpret uppercase letters as lowercase letters. It does define a letter
// to be specifically a-z, not any other unicode characters. In practice, IE at least does not require that a
// a scheme begin with a letter, so we check for any combination (e.g. including +++:).
// Note that space/tab or any other whitespace is not an allowed scheme character, so if the url looks like
// "abc :foo" the browser will not interpret it as a scheme, so we do not need to capture and prevent this,
// but browsers are forgiving for space before the scheme begins, such as with "   abc:foo", so we account
// for \s* in the beginning of the string.
$type._protocolRegExp = /^\s*([a-zA-Z0-9\+\-\.]+)\:/;

$type.findContext = function Template$findContext(element) {
    /// <summary locid="M:J#Sys.UI.Template.findContext"></summary>
    /// <param name="element" domElement="true"></param>
    /// <returns type="Sys.UI.TemplateContext"></returns>
    var tc;
    for (tc = Sys.UI.TemplateContext._contexts[element.__mstcindex]; !tc && element; element = element.parentNode);
    return tc || Sys.Application.get_templateContext();
}

$prototype = Sys._Application.prototype;
$prototype.get_templateContext = function _Application$get_templateContext() {
    /// <summary locid="M:J#Sys._Application.get_templateContext"></summary>
    return this._context || null;
}

// todo: integrate these directly into application rather than monkey patching

$prototype._baseDispose = $prototype.dispose;
$prototype.dispose = function _Application$dispose() {
    var ctx = this._context;
    if (ctx) ctx.dispose();
    this._context = null;
    this._baseDispose();
}

$prototype.removeComponent = function _Application$removeComponent(component) {
    /// <summary locid="M:J#Sys._Application.removeComponent">Removes a top-level component from the application.</summary>
    /// <param name="component" type="Sys.Component">The component to remove.</param>
    // overwritten so that when a top level component is disposed, it is removed from the
    // global template context components collection, too.
    var id = component.get_id();
    if (id) delete this._components[id];
    var ctx = this._context;
    if (ctx) {
        var tc = component.__tc;
        if (tc && tc[0] === ctx._tcindex) {
            delete ctx.components[tc[1]];
        }
    }
}
