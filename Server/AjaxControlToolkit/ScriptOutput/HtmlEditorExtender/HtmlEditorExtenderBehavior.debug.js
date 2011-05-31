// (c) 2010 CodePlex Foundation
/// <reference name="MicrosoftAjax.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function () {

    var scriptName = "HtmlEditorExtenderBehavior";
    var textbox = null;

    function execute() {
        Type.registerNamespace('AjaxControlToolkit');

        AjaxControlToolkit.HtmlEditorExtenderBehavior = function (element) {
            /// <summary>
            /// A sample behavior which assigns text to a TextBox
            /// </summmary>
            /// <param name="element" type="Sys.UI.DomElement">The element to attach to</param>
            AjaxControlToolkit.HtmlEditorExtenderBehavior.initializeBase(this, [element]);
                       
            textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);                        
            this._containerTemplate = {
                    nodeName: "div",
                    properties: {
                        style: {                                                                                                
                            position: "absolute"
                        },
                    },                    
                    visible: true
            };

            this._editableTemplate = {
                nodeName: "div",
                properties: {
                    style: {                                                                    
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",                        
                        borderStyle: "outset",
                        overflow: "scroll"
                    },
                    contentEditable: true             
                },                           
                visible: true
                
            };
            
            this._container = null;
            this._editableDiv = null;                                    
            this._createContainer(this._textbox);
            this._createEditableDiv(this._textbox);
            $addHandler(textbox._element, "blur", this._textBox_onblur, true);
            $addHandler(this._editableDiv, "blur", this._editableDiv_onblur, true);            
            $addHandler(document.forms[0], "submit", this._editableDiv_submit, true);
        }
        
        AjaxControlToolkit.HtmlEditorExtenderBehavior.prototype = {
            initialize: function () {
                AjaxControlToolkit.HtmlEditorExtenderBehavior.callBaseMethod(this, 'initialize');
                                                
            },

            _createContainer: function()
            {
                e = this.get_element();
                this._container = $common.createElementFromTemplate(this._containerTemplate, e.parentNode);
                $common.setBounds(this._container, $common.getBounds(textbox._element));                
                
                $common.wrapElement(textbox._element, this._container, this._container);
            },           
            
            _createEditableDiv: function () {
                e = this.get_element();

                this._editableDiv = $common.createElementFromTemplate(this._editableTemplate, e.parentNode);                 
                var decodeHtml = unescape(textbox._element.value);                
                this._editableDiv.innerHTML = textbox._element.value = decodeHtml;

                $common.setVisible(textbox._element, false);                
                $common.wrapElement(this._editableDiv, this._container, this._container);                
            },    
            
            _editableDiv_onblur: function()
            {   
                textbox._element.value = this.innerHTML;                
            },
                        
            _textBox_onblur: function()
            {                
                this._editableDiv.innerHTML = this.value;
                alert(this._editableDiv.innerHTML);
            },
            
            _editableDiv_submit: function()
            {
                var encodedHtml = escape(textbox._element.value);                
    	        encodedHtml = encodedHtml.replace(/\//g,"%2F");
    	        encodedHtml = encodedHtml.replace(/\?/g,"%3F");
    	        encodedHtml = encodedHtml.replace(/=/g,"%3D");
    	        encodedHtml = encodedHtml.replace(/&/g,"%26");
    	        encodedHtml = encodedHtml.replace(/@/g,"%40");
    	        textbox._element.value = encodedHtml;                
            },

            _dispose: function() {
                
                $removeHandler(textbox._element, "blur", this._textBox_onblur);
                $removeHandler(this._editableDiv, "blur", this._editableDiv_onblur);            
                $removeHandler(document.forms[0], "submit", this._editableDiv_submit);

                AjaxControlToolkit.HtmlEditorExtenderBehavior.callBaseMethod(this, 'dispose');
            }
                         
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
