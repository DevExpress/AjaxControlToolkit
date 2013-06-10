Type.registerNamespace("Sys.Extended.UI.HTMLEditor");

Sys.Extended.UI.HTMLEditor.ActiveModeType = function() { }
Sys.Extended.UI.HTMLEditor.ActiveModeType.prototype = {
    Design : 0x00,
    Html : 0x01,
    Preview: 0x02
}
Sys.Extended.UI.HTMLEditor.ActiveModeType_checkValue = function(value) {
    if(value >= 0 && value <= 2) return true;
    return false;
}

Sys.Extended.UI.HTMLEditor.ActiveModeType.registerEnum("Sys.Extended.UI.HTMLEditor.ActiveModeType", true);


