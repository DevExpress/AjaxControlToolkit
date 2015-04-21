Type.registerNamespace('Sys.Extended.UI');

if(!Type.isClass(Sys.Extended.UI.TestExtenderBehavior)) {
    Sys.Extended.UI.TestExtenderBehavior = function(element) {
        Sys.Extended.UI.TestExtenderBehavior.initializeBase(this, [element]);
    }
}

//Sys.Extended.UI.TestExtenderBehavior.prototype = {
//    initialize: function() {
//        Sys.Extended.UI.TestExtenderBehavior.callBaseMethod(this, 'initialize');
//    },

//    dispose: function() { }
//}

if(!Type.isClass(Sys.Extended.UI.TestExtenderBehavior))
    Sys.Extended.UI.TestExtenderBehavior.registerClass('Sys.Extended.UI.TestExtenderBehavior', Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.TestExtender = {};
Sys.Extended.UI.TestExtender.Debug = {};
Sys.Extended.UI.TestExtender.Debug.Static = {};