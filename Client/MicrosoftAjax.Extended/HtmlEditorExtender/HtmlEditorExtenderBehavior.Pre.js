/// <reference name="MicrosoftAjax.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function () {

    // The unique name of the script registered with the
    // client script loader
    var scriptName = "HtmlEditorExtenderBehavior";

    function execute() {
        Type.registerNamespace('Sys.Extended.UI');

        Sys.Extended.UI.HtmlEditorExtenderButton = function () {
            /// <summary>
            /// Class for each Toolbar button            
            /// </summary>

            this._commandName = null;
            this._iconIndex = null;
            this._tooltip = null;
            this._offset = null;
        }

        Sys.Extended.UI.HtmlEditorExtenderButton.prototype = {
            get_CommandName: function () {
                return this._commandName;
            },

            set_CommandName: function () {
                if (this._commandName != value) {
                    this._commandName = value;
                    this.raisePropertyChanged("CommandName")
                }
            },

            get_Tooltip: function () {
                return this._tooltip + 'test-prototype-success';
            },

            set_Tooltip: function () {
                if (this._tooltip != value) {
                    this._tooltip = value;
                    this.raisePropertyChanged("Tooltip")
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
            /// Html Extender behavior which Extends TextBox 
            /// </summmary>
            /// <param name="element" type="Sys.UI.DomElement">The element to attach to</param>
            Sys.Extended.UI.HtmlEditorExtenderBehavior.initializeBase(this, [element]);
            this._textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);

            var id = this.get_id();

            this._ButtonWidth = 23;
            this._ButtonHeight = 21;

            //Templates
            this._containerTemplate = {
                nodeName: "div",
                properties: {
                    id: id + "_ExtenderContainer"
                },
                cssClasses: ["unselectable", "ajax__html_editor_extender_container"]
            };

            this._editableTemplate = {
                nodeName: "div",
                properties: {
                    id: id + "_ExtenderContentEditable",
                    style: {
                        width: "100%",
                        height: "100%",
                        overflow: "auto",
                        clear: "both"
                    },
                    contentEditable: true
                },
                cssClasses: ["ajax__html_editor_extender_texteditor"]
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
                },
                cssClasses: ["ajax__html_editor_extender_buttoncontainer"]
            };

            // variables
            this._container = null;
            this._toolbarButtons = null;
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
                this._createEditableDiv();
                this._createButton();

                // get form that contains textbox
                var formElement = this._textbox._element.parentNode;
                while (formElement != null && formElement.nodeName != 'FORM') {
                    formElement = formElement.parentNode;
                }

                if (formElement == null)
                    throw "Missing Form tag";

                // delegates
                var formSubmitHandler = Function.createDelegate(this, this._editableDiv_submit);
                var delTextBox_onblur = Function.createDelegate(this, this._textBox_onblur);
                var delEditableDiv_onblur = Function.createDelegate(this, this._editableDiv_onblur);
                var btnClickHandler = Function.createDelegate(this, this._executeCommand);

                // handlers                                
                $addHandler(this._textbox._element, "blur", delTextBox_onblur, true);                
                $addHandler(this._editableDiv, "blur", delEditableDiv_onblur, true);                
                $addHandler(formElement, "submit", formSubmitHandler, true);                
                $addHandler(this._topButtonContainer, "click", btnClickHandler);
            },

            _dispose: function () {
                $removeHandler(this._textbox._element, "blur", delTextBox_onblur);
                $removeHandler(this._editableDiv, "blur", delEditableDiv_onblur);
                $removeHandler(formElement, "submit", formSubmitHandler);
                $removeHandler(_topButtonContainer, "click", btnClickHandler);

                Sys.Extended.UI.HtmlEditorExtenderBehavior.callBaseMethod(this, 'dispose');
            },

            _createContainer: function () {
                var e = this.get_element();
                this._container = $common.createElementFromTemplate(this._containerTemplate, e.parentNode);
                
                var bounds = $common.getBounds(this._textbox._element);
                $common.setSize(this._container, {
                    width: bounds.width,
                    height: bounds.height
                });

                $common.wrapElement(this._textbox._element, this._container, this._container);
            },

            _createTopButtonContainer: function () {
                this._topButtonContainer = $common.createElementFromTemplate(this._topButtonContainerTemplate, this._container);
            },

            _createButton: function () {
                for (i = 0; i < this._toolbarButtons.length; i++) {
                    var _btn = $common.createElementFromTemplate(this._buttonTemplate, this._topButtonContainer);
                    _btn.setAttribute("id", this._id + this._toolbarButtons[i].CommandName);
                    _btn.setAttribute("name", this._toolbarButtons[i].CommandName);
                    _btn.setAttribute("title", this._toolbarButtons[i].Tooltip);
                    _btn.setAttribute("unselectable", "on");
                    _btn.style.backgroundPosition = this._toolbarButtons[i].Offset;
                    Array.add(this._buttons, _btn);
                }
            },

            _createEditableDiv: function () {
                this._editableDiv = $common.createElementFromTemplate(this._editableTemplate, this._container);                
                this._editableDiv.innerHTML = this._textbox._element.value;
                $common.setVisible(this._textbox._element, false);
            },

            _editableDiv_onblur: function () {
                this._textbox._element.value = this.innerHTML;
            },

            _textBox_onblur: function () {
                this._editableDiv.innerHTML = this.value;
            },

            _editableDiv_submit: function () {
                //html encode                                         
                var char = 3;
                var sel = null;
                this._editableDiv.focus();
                if (Sys.Browser.agent != Sys.Browser.Firefox) {
                    if (document.selection) {
                        sel = document.selection.createRange();
                        sel.moveStart('character', char);
                        sel.select();
                    }
                    else {
                        sel = window.getSelection();
                        sel.collapse(this._editableDiv.firstChild, char);
                    }
                }
                
                var encodedHtml = this._editableDiv.innerHTML.replace(/</ig, "&lt;").replace(/>/ig, "&gt;").replace(/\"/ig, "&quot;").replace(/\xA0/ig, "&nbsp;");
                //converter to convert different tags into Html5 standard tags
                encodedHtml = encodedHtml.replace(/&lt;STRONG&gt;/ig, "&lt;b&gt;").replace(/&lt;\/STRONG&gt;/ig, "&lt;/b&gt;").replace(/&lt;EM&gt;/ig, "&lt;i&gt;").replace(/&lt;\/EM&gt;/ig, "&lt;/i&gt;");                
                this._textbox._element.value = encodedHtml;
            },

            _executeCommand: function (command) {
                var isFireFox = Sys.Browser.agent == Sys.Browser.Firefox;

                if (isFireFox) {                    
                    document.execCommand("styleWithCSS", false, false);
                }

                document.execCommand(command.target.name, false, null);

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
                return this._toolbarButtons;
            },

            set_ToolbarButtons: function (value) {
                if (this._toolbarButtons != value) {
                    this._toolbarButtons = value;
                    this.raisePropertyChanged("ToolbarButtons");
                }
            }

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