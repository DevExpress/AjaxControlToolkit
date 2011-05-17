$type = Sys.UI.TemplateContext = function TemplateContext() {
    /// <summary locid="M:J#Sys.UI.TemplateContext.#ctor">Represents the results of a template instantiation.</summary>
    /// <field name="data" locid="F:J#Sys.UI.TemplateContext.data"></field>
    /// <field name="dataItem" locid="F:J#Sys.UI.TemplateContext.dataItem"></field>
    /// <field name="index" type="Number" integer="true" locid="F:J#Sys.UI.TemplateContext.index"></field>
    /// <field name="getInstanceId" type="Function" locid="F:J#Sys.UI.TemplateContext.getInstanceId"></field>
    /// <field name="parentContext" type="Sys.UI.TemplateContext" locid="F:J#Sys.UI.TemplateContext.parentContext"></field>
    /// <field name="containerElement" domElement="true" locid="F:J#Sys.UI.TemplateContext.containerElement"></field>
    /// <field name="components" type="Array" elementType="Object" locid="F:J#Sys.UI.TemplateContext.components"></field>
    /// <field name="nodes" type="Array" elementDomElement="true" locid="F:J#Sys.UI.TemplateContext.nodes"></field>
    var index = this._tcindex = Sys.UI.TemplateContext._tcindex++;
    Sys.UI.TemplateContext._contexts[index] = this;
    this._completed = [];
    this.nodes = [];
    Sys.UI.TemplateContext.initializeBase(this);
}
$type.prototype = {
    data: null,
    dataItem: null,
    index: 0,
    parentContext: null,
    containerElement: null,
    insertBeforeNode: null,
    components: null,
    nodes: null,
    isDisposed: false,
    _lastIndex: -1,
    dispose: function TemplateContext$dispose() {
        /// <summary locid="M:J#Sys.UI.TemplateContext.dispose">Disposes of the template context and the components that were created.</summary>
        if (!this._global) {
            var nodes = this.nodes;
            if (nodes) {
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var element = nodes[i];
                    if (element.nodeType === 1) {
                        Sys.Application.disposeElement(element, false);
                    }
                }
            }
        }
        delete Sys.UI.TemplateContext._contexts[this._tcindex];
        this.nodes = this.dataItem = this.components = this.getInstanceId =
        this.containerElement = this.insertBeforeNode = this.parentContext = this.data = null;
        this.isDisposed = true;
    },
    query: function TemplateContext$query(selector) {
        return new Sys.ElementSet(this._find(selector));
    },
    get: function TemplateContext$get(selector) {
        return this._find(selector, true);
    },
    _find: function TemplateContext$_find(selector, single) {
        // if it is an #ID selector, apply special search rules that uses the context's
        // index to support finding auto-mangled IDs without having to specify them.
        // For example if a template contains <span id="foo">, the generated elements
        // have ids foo_1, foo_2, foo_3, etc. If a template context is used as the context
        // parameter to Sys.find or Sys.get, and the selector is #foo, it should find foo_#
        // of that context or a parent context.
        var found = [],
            selectors;
        if (typeof(selector) === "string") {
            selectors = [selector];
        }
        else {
            selectors = selector;
        }
        var idBased = /^[#\$](\w|[$:\.\-])+$/;
        var tc = this;
        foreach(selectors, function(selector) {
            var result = idBased.test(selector) ?
                    tc._findById(selector.substr(0, 1), selector.substr(1), single) :
                    Sys._find(selector, tc.nodes, single);
            if (result) {
                if (single) {
                    found.push(result);
                    return true;
                }
                else {
                    found.push.apply(found, result);
                }
            }
        });
        return single ? (found[0] || null) : found;
    },
    _findById: function TemplateContext$_findById(kind, id, single) {
        var element = null;
        for (var context = this; !element && context; context = context.parentContext) {
            var nodes = context.nodes,
                instanceId = kind + context.getInstanceId(id);
            if (context._global) {
                // when the context is the global context, don't restrict by nodes unless we don't
                // find one, since the the node collection might be a disconnected set.
                element = Sys.get(instanceId) || Sys.get(instanceId, nodes);
            }
            else {
                element = Sys.get(instanceId, nodes);
            }
        }
        // ultimately just try the regular get
        element = element || Sys.get(kind + id);
        return single ? element : (element ? [element] : []);
    },
    getInstanceId: function TemplateContext$getInstanceId(prefix) {
        /// <summary locid="M:J#Sys.UI.TemplateContext.getInstanceId">Generates an element id suffixed by this template context's index.</summary>
        /// <param name="prefix" type="String">The prefix.</param>
        /// <returns type="String">The generated id.</returns>
        var s;
        if (this._global) {
            s = "";
        }
        else {
            s = this.index;
            var ctx = this.parentContext;
            while (ctx && !ctx._global) {
                s = ctx.index + "_" + s;
                ctx = ctx.parentContext;
            }
        }
        return prefix + s;
    },
    initializeComponents: function TemplateContext$initializeComponents() {
        /// <summary locid="M:J#Sys.UI.TemplateContext.initializeComponents">Initializes the components created by the template instantiation.</summary>
        var components = this.components;
        if (components) {
            var i = components.length - 1, index = this._lastIndex;
            this._lastIndex = i;
            // in reverse order so components initialize from deep to shallow
            for (; i > index; i--) {
                var component = components[i];
                if (component && Sys.Component.isInstanceOfType(component)) {
                    if (component.get_isUpdating()) {
                        component.endUpdate();
                    }
                    else if (!component.get_isInitialized()) {
                        component.initialize();
                    }
                }
            }
        }
    },
    _onInstantiated: function TemplateContext$_onInstantiated(referenceNode, global) {
        foreach(this._completed, function(callback) {
            callback();
        });
        this._completed = [];
        if (!global) {
            var container = this.containerElement;
            foreach(this.nodes, function(node) {
                container.insertBefore(node, referenceNode || null);
            });
        }
    },
    _registerComponent: function TemplateContext$_registerComponent(component) {
        // a component created during template instantiation or dom processing has a "__tc" added to it
        // which is an array with the following items: [templateConextIndex, componentsListIndex]
        // templateContextIndex: identifies which template context the component belongs to. Each TC has a unique number.
        // componentsListIndex: identifies the index of the component in the TC's .components array
        var components = this.components;
        component.__tc = [this._tcindex, components.length];
        components.push(component);
        // if it is a Sys.Component it should be registered with application
        Sys.Component._register(component, null, true);
    },
    _registerIf: function TemplateContext$_registerIf(result) {
        if (result instanceof Array) {
            for (var i = 0, l = result.length; i < l; i++) {
                this._registerComponent(result[i]);
            }
        }
        else if (result && typeof (result) === 'object') {
            this._registerComponent(result);
        }
    }
}
$type.registerClass("Sys.UI.TemplateContext", null, Sys.IDisposable);
$type._tcindex = 0;
$type._contexts = [];
