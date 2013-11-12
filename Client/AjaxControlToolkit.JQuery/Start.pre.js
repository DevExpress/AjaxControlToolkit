if (typeof actJQuery == "undefined") {
    
    if (typeof jQuery == "undefined" || jQuery.fn.jquery !== "1.9.1") {
        throw "jQuery 1.9.1 required.";
    }
    
    actJQuery = jQuery.noConflict();
}

(function (window, $) {
    var act = {
        
        jQueryVersion: $.fn.jquery,

        browser: {
            InternetExplorer: {},
            Firefox: {},
            Safari: {},
            Opera: {},
            agent: null,
            hasDebuggerStatement: false,
            name: navigator.appName,
            version: parseFloat(navigator.appVersion),
            documentMode: 0
        },
        
        initialized: false,
        widgets: [],
        behaviors: [],
        
        createWidget: function (name, base, prototype, skipAutoActivation) {

            var body = prototype || base,
                attrKey = 'act' + name.substr(0, 1).toLocaleUpperCase()
                + name.toLocaleLowerCase().substr(1);
            
            if (!prototype) {
                base = $.Widget;
            }
            
            // Registering widget for auto activation
            if (!skipAutoActivation)
                act.widgets[attrKey] = name;

            // Event handlers builder
            body._addHandler = function(handlerName, handler) {
                this._handlers[name + handlerName] = handler;
            };
            body._removeHandler = function(handlerName) {
                if (this._handlers[name + handlerName])
                    delete this._handlers[name + handlerName];
            };
            body._invokeHandler = function(handlerName, args) {
                var handler = this._handlers[name + handlerName];
                if (!handler)
                    return;
                
                if (typeof handler == "string") {
                    eval(handler)(args);
                } else {
                    handler.call(this, args);
                }
            };
            
            // Hook _create method
            var createMethod = body._create;
            body._create = function () {
                
                this._handlers = [];
                this._clientStateElement = $('#' + this.element.attr('id') + "_ClientState");

                // Maintain 'dispose' method for backward compatibility
                this.dispose = this.destroy;
                
                function createDelegate(object, ev, method) {
                    var fn = function () {
                        var args = [];
                        args.push(ev);
                        if (arguments) {
                            for (var a in arguments) {
                                args.push(arguments[a]);
                            }
                        }
                        return method.apply(object, args);
                    };

                    return fn;
                }

                if (this._events) {

                    // Maintain add/remove/raise event methods for backward compatibility
                    for (var i = 0; i < this._events.length; i++) {
                        var evt = this._events[i],
                            eventMethodName = 'add_' + evt;
                        if (!this[eventMethodName])
                            this[eventMethodName] = createDelegate(this, evt, this._addHandler);

                        eventMethodName = 'remove_' + evt;
                        if (!this[eventMethodName])
                            this[eventMethodName] = createDelegate(this, evt, this._removeHandler);

                        eventMethodName = 'raise' + $act.common.pascalCase(evt);
                        if (!this[eventMethodName])
                            this[eventMethodName] = createDelegate(this, evt, this._invokeHandler);

                        // Assign event handler and remove from options if found
                        if (this.options[evt]) {
                            var eh = this.options[evt];
                            delete this.options[evt];
                            this['add_' + evt](eh);
                        }
                    }
                }

                if (this.options) {
                    for (var o in this.options) {
                        var getName = "get_" + o,
                            setName = "set_" + o;

                        if (!this[getName])
                            this[getName] = createDelegate(this, o, this.option);

                        if (!this[setName])
                            this[setName] = createDelegate(this, o, this.option);
                    }
                }
                
                if (createMethod)
                    createMethod.apply(this);
            };

            $.widget('ajaxControlToolkit.' + name, base, body);
        },
        
        activateWidgets: function (elements) {
            
            // Select all elements containing "data-act-*" attribute
            var self = this, targets = $(elements).map(function () {
                var that = this,
                    data = $(that).data(),
                    results = [];

                for (var key in data) {
                    if (key.indexOf('act') === 0)
                        results.push({ key: key, value: that });
                }
                return results;
            }).get();

            // Validate and activate widget for all elements
            $.each(targets, function (key, obj) {
                var widgetName = $act.widgets[obj.key];
                if (widgetName) {
                    $act.common.activateWidget(widgetName, obj.value);
                }
            });
        },
        
        init: function () {            
            var self = this;
            if (!self.initialized) {
                self.initialized = true;
                self.activateWidgets('*');
            }
        }
    };


    $(document).ready(function () {
        $act.init();
    });
    

    // Adapt from MicrosoftAjax.Extensions.Compact.Browser
    var agent = navigator.userAgent, browser = act.browser;
    
    if (agent.indexOf(' MSIE ') > -1) {
        browser.agent = browser.InternetExplorer;
        browser.version = parseFloat(agent.match(/MSIE (\d+\.\d+)/)[1]);
        if ((browser.version > 7) && (document.documentMode > 6)) {
            browser.documentMode = document.documentMode;
        }
        browser.hasDebuggerStatement = true;
    }
    else if (agent.indexOf(' Firefox/') > -1) {
        browser.agent = browser.Firefox;
        browser.version = parseFloat(agent.match(/ Firefox\/(\d+\.\d+)/)[1]);
        browser.name = 'Firefox';
        browser.hasDebuggerStatement = true;
    }
    else if (agent.indexOf(' AppleWebKit/') > -1) {
        browser.agent = browser.Safari;
        browser.version = parseFloat(agent.match(/ AppleWebKit\/(\d+(\.\d+)?)/)[1]);
        browser.name = 'Safari';
    }
    else if (agent.indexOf('Opera/') > -1) {
        browser.agent = browser.Opera;
    }

    window.$act = act;

})(window, actJQuery);