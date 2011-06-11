// (c) 2010 CodePlex Foundation
/// <reference name="MicrosoftAjax.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function () {

    var scriptName = "HtmlEditorExtenderBehavior";
    var textbox = null;

    function execute() {
        Type.registerNamespace('Sys.Extended.UI');

        Sys.Extended.UI.HtmlEditorExtenderButton = function () {
            /// <summary>
            /// Class for each Toolbar button            
            /// </summary>

            this._name = null;
            this._iconIndex = null;
            this._title = null;
            this._offset = null;
        }

        Sys.Extended.UI.HtmlEditorExtenderButton.prototype = {
            get_Name: function () {
                return this._name;
            },

            set_Name: function () {
                if (this._name != value) {
                    this._name = value;
                    this.raisePropertyChanged("Name")
                }
            },

            get_Title: function () {
                return this._title + 'test-prototype-success';
            },

            set_Title: function () {
                if (this._title != value) {
                    this._title = value;
                    this.raisePropertyChanged("Title")
                }
            },

            get_IconIndex: function () {
                return this._iconIndex;
            },

            set_IconIndex: function () {
                if (this._iconIndex != value) {
                    this._iconIndex = value;
                    this.raisePropertyChanged("IconIndex")
                }
            },

            get_Offset: function () {
                return this._offset;
            },

            set_Offset: function () {
                if (this._iconIndex != value) {
                    this._iconIndex = value;
                    this.raisePropertyChanged("Offset")
                }
            }
        }

        Sys.Extended.UI.HtmlEditorExtenderButton.registerClass('Sys.Extended.UI.HtmlEditorExtenderButton');

        Sys.Extended.UI.HtmlEditorExtenderBehavior = function (element) {
            /// <summary>
            /// A sample behavior which assigns text to a TextBox
            /// </summmary>
            /// <param name="element" type="Sys.UI.DomElement">The element to attach to</param>
            Sys.Extended.UI.HtmlEditorExtenderBehavior.initializeBase(this, [element]);
            textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);

            var id = this.get_id();

            this._ButtonWidth = 23;
            this._ButtonHeight = 21;

            this._containerTemplate = {
                nodeName: "div",
                properties: {
                    id: id + "_ExtenderContainer"
                },
                cssClasses: ["unselectable"]
            };

            this._editableTemplate = {
                nodeName: "div",
                properties: {
                    id: id + "_ExtenderContentEditable",
                    style: {
                        width: "100%",
                        height: "100%",
                        borderStyle: "outset",
                        overflow: "scroll",
                        clear: "both"
                    },
                    contentEditable: true
                }
            };

            this._buttonTemplate = {
                nodeName: "input",
                properties: {
                    type: "button",
                    style: {
                        width: this._ButtonWidth + "px",
                        height: this._ButtonHeight + "px"
                    }
                },
                cssClasses: ["ajax__html_editor_extender_button"]
            };

            this._topButtonContainerTemplate = {
                nodeName: "div",
                properties: {
                    id: id + "_ExtenderButtonContainer"
                }                
            };

            this._container = null;
            this._ToolbarButtons = null;
            this._editableDiv = null;
            this._topButtonContainer = null;
            this._buttons = [];
            this._btnClickHandler = null;
            this._requested_buttons = new Array();
        }

        Sys.Extended.UI.HtmlEditorExtenderBehavior.prototype = {
            initialize: function () {
                Sys.Extended.UI.HtmlEditorExtenderBehavior.callBaseMethod(this, 'initialize');

                var idx = 0;
                this._button_list = new Array();
                this._createContainer();
                this._createTopButtonContainer();
                this._createEditableDiv(this._textbox);
                this._createButton();

                var formElement = textbox._element.parentNode;
                while (formElement != null && formElement.nodeName != 'FORM') {
                    formElement = formElement.parentNode;
                }

                if (formElement == null)
                    throw "Missing Form tag";

                $addHandler(textbox._element, "blur", this._textBox_onblur, true);
                $addHandler(this._editableDiv, "blur", this._editableDiv_onblur, true);
                $addHandler(formElement, "submit", this._editableDiv_submit, true);

                this._btnClickHandler = Function.createDelegate(this, this._executeCommand);
                
                for (var i = 0; i < this._buttons.length; i++) {
                    $addHandler(this._buttons[i], "click", this._btnClickHandler);                
                }

            },

            _dispose: function () {
                $removeHandler(textbox._element, "blur", this._textBox_onblur);
                $removeHandler(this._editableDiv, "blur", this._editableDiv_onblur);
                $removeHandler(document.forms[0], "submit", this._editableDiv_submit);

                for (var i = 0; i < this._buttons.length; i++) {
                    $removeHandler(this._buttons[i], "click", this._btnClickHandler);                    
                }

                Sys.Extended.UI.HtmlEditorExtenderBehavior.callBaseMethod(this, 'dispose');
            },

            _createContainer: function () {
                var e = this.get_element();
                this._container = $common.createElementFromTemplate(this._containerTemplate, e.parentNode);
                $common.wrapElement(textbox._element, this._container, this._container);
            },

            _createTopButtonContainer: function () {
                this._topButtonContainer = $common.createElementFromTemplate(this._topButtonContainerTemplate, this._container);
            },

            _createButton: function () {
                for (i = 0; i < this._ToolbarButtons.length; i++) {
                    var _btn = $common.createElementFromTemplate(this._buttonTemplate, this._topButtonContainer);
                    _btn.setAttribute("id", this._ToolbarButtons[i].Name);
                    _btn.setAttribute("name", this._ToolbarButtons[i].Name);
                    _btn.setAttribute("title", this._ToolbarButtons[i].Title);
                    _btn.setAttribute("unselectable", "on");
                    _btn.style.backgroundPosition = this._ToolbarButtons[i].Offset;
                    Array.add(this._buttons, _btn);
                }
            },

            _createEditableDiv: function () {
                var e = this.get_element();

                this._editableDiv = $common.createElementFromTemplate(this._editableTemplate, this._container);
                this._editableDiv.innerHTML = textbox._element.value;

                var bounds = $common.getBounds(textbox._element);
                $common.setSize(this._editableDiv, {
                    width: bounds.width,
                    height: bounds.height
                });

                $common.setVisible(textbox._element, false);
            },

            _editableDiv_onblur: function () {
                textbox._element.value = this.innerHTML;
            },

            _textBox_onblur: function () {
                this._editableDiv.innerHTML = this.value;
            },

            _editableDiv_submit: function () {
                var encodedHtml = textbox._element.value.replace(/&/ig, "&amp;").replace(/</ig, "&lt;").replace(/>/ig, "&gt;").replace(/\"/ig, "&quot;").replace(/\xA0/ig, "&nbsp;");
                textbox._element.value = encodedHtml;
            },



            _executeCommand: function (command) {

                switch (command.target.title.toUpperCase()) {
                    case "BOLD":                        
                        document.execCommand('Bold', false, null);
                        break;
                    case "ITALIC":
                        document.execCommand('Italic', false, null);
                        break;
                    case "UNDERLINE":
                        document.execCommand('Underline', false, null);
                        break;
                    case "STRIKE THROUGH":
                        document.execCommand('StrikeThrough', false, null);
                        break;
                    case "SUB SCRIPT":
                        document.execCommand('Subscript', false, null);
                        break;
                    case "SUPER SCRIPT":
                        document.execCommand('Superscript', false, null);
                        break;
                    case "JUSTIFY LEFT":
                        document.execCommand('Justifyleft', false, null);
                        break;
                    case "JUSTIFY RIGHT":
                        document.execCommand('Justifyright', false, null);
                        break;
                    case "JUSTIFY CENTER":
                        document.execCommand('Justifycenter', false, null);
                        break;
                    case "INSERT ORDERED LIST":
                        document.execCommand('insertOrderedList', false, null);
                        break;
                    case "INSERT UNORDERED LIST":
                        document.execCommand('insertUnorderedList', false, null);
                        break;
                }
            },
            
            get_ButtonWidth: function () {
                return this._ButtonWidth;
            },

            set_ButtonWidth: function (value) {
                if (this._ButtonWidth != value) {
                    this._ButtonWidth = value;
                    this.raisePropertyChanged("ButtonWidth");
                }
            },

            get_ButtonHeight: function () {
                return this._ButtonHeight;
            },

            set_ButtonHeight: function (value) {
                if (this._ButtonHeight != value) {
                    this._ButtonHeight = value;
                    this.raisePropertyChanged("ButtonHeight");
                }
            },

            get_ToolbarButtons: function () {
                return this._ToolbarButtons;
            },

            set_ToolbarButtons: function (value) {
                if (this._ToolbarButtons != value) {
                    this._ToolbarButtons = value;
                    this.raisePropertyChanged("ToolbarButtons");
                }

            }//,




        };

        Sys.Extended.UI.HtmlEditorExtenderBehavior.registerClass('Sys.Extended.UI.HtmlEditorExtenderBehavior', Sys.Extended.UI.BehaviorBase);
        Sys.registerComponent(Sys.Extended.UI.HtmlEditorExtenderBehavior, { name: "HtmlEditorExtender", parameters: [{ name: "ToolbarButtons", type: "HtmlEditorExtenderButton[]"}] });

    } // execute

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon"], execute);

    }
    else {
        execute();
    }

})();    
