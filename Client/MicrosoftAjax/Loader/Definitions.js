obj = Sys.loader;

obj.defineScripts({
    releaseUrl: "%/MicrosoftAjax{0}.js",
    debugUrl: "%/MicrosoftAjax{0}.debug.js",
    executionDependencies: ["Core"]
},
[{ name: "Core",
    executionDependencies: null,
    isLoaded: !!window.Type
},
 { name: "ComponentModel",
   //#if DEBUG
   plugins: [{name: "setCommand", dom: true, description: "Causes a DOM element to raise a bubble event when clicked.",
                parameters: [{name: "commandName", description: "The name of the command to raise."},
                             {name: "commandArgument", description: "Optional command argument."},
                             {name: "commandTarget", description: "DOM element from which the command should start bubbling up."}]},
             {name: "addHandler", dom: true, description: "A cross-browser way to add a DOM event handler to an element.",
                parameters: [{name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
                             {name: "handler", type: "Function", description: "The event handler to add."},
                             {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}] },
             {name: "removeHandler", dom: true, description: "A cross-browser way to remove a DOM event handler from an element.",
                parameters: [{name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
                             {name: "handler", type: "Function", description: "The event handler to remove."}] },
             {name: "addHandlers", dom: true, description: "Adds a list of event handlers to an element. If a handlerOwner is specified, delegates are created with each of the handlers.",
                parameters: [{name: "events", type: "Object", description: "A dictionary of event handlers."},
                             {name: "handlerOwner", description: "The owner of the event handlers that will be the this pointer for the delegates that will be created from the handlers."},
                             {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}] },
             {name: "clearHandlers", dom: true, description: "Clears all the event handlers that were added to the element or array of elements." }
   ],
   //#else
   plugins: [{name:"setCommand",dom:true}, {name:"addHandler",dom:true}, {name:"addHandlers",dom:true}, {name:"removeHandler",dom:true}, {name:"clearHandlers",dom:true}],
   //#endif
   isLoaded: !!Sys.Component
 },
 { name: "History",
   executionDependencies: ["ComponentModel", "Serialization"],
   isLoaded: !!(Sys.Application && Sys.Application.get_stateString)
 },
 { name: "Serialization",
   isLoaded: !!Sys.Serialization
 },
 { name: "Network",
   executionDependencies: ["Serialization"],
   isLoaded: !!(Sys.Net && Sys.Net.WebRequest)
 },
 { name: "WebServices",
   executionDependencies: ["Network"],
   isLoaded: !!(Sys.Net && Sys.Net.WebServiceProxy)
 },
 { name: "ApplicationServices",
   executionDependencies: ["WebServices"],
   isLoaded: !!(Sys.Services && Sys.Services.RoleService && Sys.Services.RoleService.get_path)
 },
 { name: "Globalization",
   isLoaded: !!Number._parse
 },
 { name: "OpenData",
   executionDependencies: ["DataContext"],
   //#if DEBUG
   components: [
        "Sys.Data.OpenDataContext",
        { typeName: "Sys.Data.OpenDataServiceProxy", parameters: [{name: "serviceUri", type: "String"}] }
   ],
   //#else
   components: [
        "Sys.Data.OpenDataContext",
        { typeName: "Sys.Data.OpenDataServiceProxy", parameters: ["serviceUri"] }
   ],
   //#endif
   isLoaded: !!(Sys.Data && Sys.Data.OpenDataServiceProxy)
 },
 { name: "DataContext",
   executionDependencies: ["ComponentModel", "Serialization", "WebServices"],
   components: ["Sys.Data.DataContext"],
   isLoaded: !!(Sys.Data && Sys.Data.DataContext)
 },
 { name: "Templates",
   executionDependencies: ["ComponentModel", "Serialization"],
   behaviors: ["Sys.UI.DataView"],
   //#if DEBUG
   plugins: [{name: "binding", global: true, parameters: ['target',{name:'property',type:'String'},'source',{name:'path',type:'String'},'options']},
             {name: "binding", dom: true, parameters: [{name:'property',type:'String'},'source',{name:'path',type:'String'},'options']},
             {name: "binding", components: true, parameters: [{name:'property',type:'String'},'source',{name:'path',type:'String'},'options']},
             {name: "activateElements", dom: true, 
                parameters: [{name: "bindingContext", description: "The binding context."}, {name: "recursive", type: "Boolean", description: "Specifies whether processing should occur recursively."}]}],
   //#else
   plugins: [{name:"binding",global:true},{name:"binding",dom:true},{name:"binding",components:true},{name:"activateElements",dom:true}],
   //#endif
   isLoaded: !!(Sys.UI && Sys.UI.Template)
 },
 // Composite Scripts
 { name: "MicrosoftAjax",
   releaseUrl: "%/MicrosoftAjax.js",
   debugUrl: "%/MicrosoftAjax.debug.js",
   executionDependencies: null,
   contains: ["Core", "ComponentModel", "History", "Serialization", "Network", "WebServices", "Globalization"]
 }
]);

var ajaxPath = (window.location.protocol === "https:" ? "https" : "http") + "://ajax.microsoft.com/ajax/";

obj.defineScripts(null, [
 { name: "jQuery",
   releaseUrl: ajaxPath + "jquery/jquery-1.4.1.min.js",
   debugUrl: ajaxPath + "jquery/jquery-1.4.1.js",
   isLoaded: !!window.jQuery
 },
 { name: "jQueryValidate",
   releaseUrl: ajaxPath + "jquery.validate/1.6/jquery.validate.min.js",
   debugUrl: ajaxPath + "jquery.validate/1.6/jquery.validate.js",
   dependencies: ["jQuery"],
   isLoaded: !!(window.jQuery && jQuery.fn.validate)
 }
]);

obj._init();