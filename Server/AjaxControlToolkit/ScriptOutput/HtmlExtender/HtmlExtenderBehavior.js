// (c) 2010 CodePlex Foundation
/// <reference name="MicrosoftAjax.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function () {

    var scriptName = "HtmlExtenderBehavior";

    function execute() {
        Type.registerNamespace('AjaxControlToolkit');

        AjaxControlToolkit.HtmlExtenderBehavior = function (element) {
            /// <summary>
            /// A sample behavior which assigns text to a TextBox
            /// </summmary>
            /// <param name="element" type="Sys.UI.DomElement">The element to attach to</param>
            AjaxControlToolkit.HtmlExtenderBehavior.initializeBase(this, [element]);

            this._textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);            
            this._editableTemplate = {
                nodeName: "div",
                properties: {
                    style: {                                            
                        width: "400px",
                        height: "100px",
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


        AjaxControlToolkit.HtmlExtenderBehavior.prototype = {
            initialize: function () {
                AjaxControlToolkit.HtmlExtenderBehavior.callBaseMethod(this, 'initialize');

            },

            _createEditableDiv: function (txtBoxControl) {
                e = this.get_element();

                var div = $common.createElementFromTemplate(this._editableTemplate, e.parentNode);                    
                $common.setBounds(div, $common.getBounds(txtBoxControl._element));

                div.innerText = txtBoxControl._element.value;
                this._editableDiv = div;

            },            
             
        };

        AjaxControlToolkit.HtmlExtenderBehavior.registerClass('AjaxControlToolkit.HtmlExtenderBehavior', Sys.Extended.UI.BehaviorBase);
        Sys.registerComponent(AjaxControlToolkit.HtmlExtenderBehavior, { name: "HtmlExtender" });

    } // execute

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon"], execute);

    }
    else {
        execute();
    }

})();    
