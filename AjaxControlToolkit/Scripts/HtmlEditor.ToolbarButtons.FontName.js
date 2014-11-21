Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.FontName = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.FontName.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.FontName.prototype = {

    initialize: function() {
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.FontName.callBaseMethod(this, "initialize");
    },

    callMethod: function(select, event) {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.FontName.callBaseMethod(this, "callMethod"))
            return false;

        try {
            var editor = this._designPanel;
            editor._execCommand("fontname", false, select.options.item(select.selectedIndex).value);
        } catch(e) { }
    },

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.FontName.callBaseMethod(this, "checkState"))
            return false;

        var editor = this._designPanel,
            param = null;

        try {
            param = (Function.createDelegate(editor, Sys.Extended.UI.HtmlEditor._queryCommandValue))("fontname");
        } catch(e) { }

        if(!editor._FontNotSet)
            if(!param || param.length == 0)
                param = Sys.Extended.UI.HtmlEditor.getStyle(editor._doc.body, "font-family");

        var el = this._select,
            i = 0;

        if(param && param.length > 0) {
            var seek = param.toLowerCase().split(",")[0].replace(/^(['"])/, "").replace(/(['"])$/, "");

            for(i = 0; i < el.options.length; i++) {
                var cur = el.options.item(i).value.toLowerCase().split(",")[0];
                if(cur == seek)
                    break
            }

            if(i == el.options.length) {
                try {
                    var newopt = document.createElement("OPTION");

                    newopt.value = param.replace(/^(['"])/, "").replace(/(['"])$/, "");
                    newopt.text = param.split(",")[0].replace(/^(['"])/, "").replace(/(['"])$/, "");
                    el.add(newopt, (Sys.Extended.UI.HtmlEditor.isIE) ? i : null);
                    $addHandler(newopt, "click", this._onclick_option$delegate);
                } catch(e) {
                    i = 0;
                }
            }
        }

        el.selectedIndex = i;
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.FontName.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.FontName", Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeSelectButton);