Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.prototype = {
    initialize : function() {
        Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.callBaseMethod(this, "initialize");
    },
    
    callMethod : function(select,event) {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.callBaseMethod(this, "callMethod")) return false;

        try {
            var editor = this._designPanel;
            editor._execCommand("FontSize",false,Sys.Extended.UI.HTMLEditor.fontSizeSeek(select.options.item(select.selectedIndex).value));
        } catch(e) {}
    },
    
    checkState : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.callBaseMethod(this, "checkState")) return false;
    
        var editor = this._designPanel;

        var param =null;
        var _id = this._select.id;

        try{param =(Function.createDelegate(editor, Sys.Extended.UI.HTMLEditor._queryCommandValue))("fontsize",_id);} catch(e){}

        if(param) param = param.toString();

        if(!editor._FontNotSet)
        if(!param || param.length==0) {
            param = Sys.Extended.UI.HTMLEditor.getStyle(editor._doc.body,"font-size");
            param = Sys.Extended.UI.HTMLEditor._TryTransformFromPxToPt(param, this, _id);
        }

        try {
            var el = this._select;
            var i=0;
            if(param && param.length > 0) {
                var seek = param.toLowerCase().split(",")[0];
                for(i=0; i< el.options.length; i++) {
                    var cur = Sys.Extended.UI.HTMLEditor.fontSizeSeek(el.options.item(i).value.toLowerCase().split(",")[0]);

                    if(cur==seek) break;
                }
                if(i==el.options.length) {
                    try {
                        var newopt = document.createElement("OPTION");
                        newopt.value = param;
                        newopt.text  = param;
                        el.add(newopt,(Sys.Extended.UI.HTMLEditor.isIE)?i:null);
                        $addHandler(newopt, "click", this._onclick_option$delegate);
                    } catch (e) {
                        i = 0;
                    }
                }
            }
            el.selectedIndex = i;
        } catch(e) {}
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton);

