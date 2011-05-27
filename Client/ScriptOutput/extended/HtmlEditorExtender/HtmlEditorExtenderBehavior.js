// (c) 2010 CodePlex Foundation
/// <reference name="MicrosoftAjax.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function () {

    var scriptName = "HtmlEditorExtenderBehavior";

    function execute() {
        Type.registerNamespace('AjaxControlToolkit');

        AjaxControlToolkit.HtmlEditorExtenderBehavior = function (element) {
            /// <summary>
            /// A sample behavior which assigns text to a TextBox
            /// </summmary>
            /// <param name="element" type="Sys.UI.DomElement">The element to attach to</param>
            AjaxControlToolkit.HtmlEditorExtenderBehavior.initializeBase(this, [element]);

            this._textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);            
            this._editableTemplate = {
                nodeName: "div",
                properties: {
                    style: {                                                                    
                        backgroundColor: "transparent",                        
                        borderStyle: "outset",
                        overFlow: "auto"
                    },
                    contentEditable: true             
                },                                
                visible: true
                
            };
            
            this._editableDiv;            
            this._createEditableDiv(this._textbox);
            this._textbox.visible = false;
        }


        AjaxControlToolkit.HtmlEditorExtenderBehavior.prototype = {
            initialize: function () {
                AjaxControlToolkit.HtmlEditorExtenderBehavior.callBaseMethod(this, 'initialize');

            },

            _createEditableDiv: function (txtBoxControl) {
                e = this.get_element();

                this._editableDiv = $common.createElementFromTemplate(this._editableTemplate, e.parentNode);                    
                $common.setBounds(this._editableDiv, $common.getBounds(txtBoxControl._element));

                this._editableDiv.innerText = txtBoxControl._element.value;
                $common.setVisible(txtBoxControl._element, false);
            },            
             
        };

        AjaxControlToolkit.HtmlEditorExtenderBehavior.registerClass('AjaxControlToolkit.HtmlEditorExtenderBehavior', Sys.Extended.UI.BehaviorBase);
        Sys.registerComponent(AjaxControlToolkit.HtmlEditorExtenderBehavior, { name: "HtmlEditorExtender" });

    } // execute

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon"], execute);

    }
    else {
        execute();
    }

})();    
