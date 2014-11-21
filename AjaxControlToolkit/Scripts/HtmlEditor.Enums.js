Type.registerNamespace("Sys.Extended.UI.HtmlEditor");

Sys.Extended.UI.HtmlEditor.ActiveModeType = function() { }

Sys.Extended.UI.HtmlEditor.ActiveModeType.prototype = {
    Design: 0x00,
    Html: 0x01,
    Preview: 0x02
}

Sys.Extended.UI.HtmlEditor.ActiveModeType_checkValue = function(value) {
    if(value >= 0 && value <= 2)
        return true;

    return false;
}

Sys.Extended.UI.HtmlEditor.ActiveModeType.registerEnum("Sys.Extended.UI.HtmlEditor.ActiveModeType", true);