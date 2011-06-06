/// <reference name="MicrosoftAjax.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function () {

    // The unique name of the script registered with the
    // client script loader
    var scriptName = "HtmlEditorExtenderBehavior";
    var textbox = null;

    function execute() {
        Type.registerNamespace('Sys.Extended.UI');

        Sys.Extended.UI.HtmlEditorExtenderBehavior = function (element) {
            /// <summary>
            /// A sample behavior which assigns text to a TextBox
            /// </summmary>
            /// <param name="element" type="Sys.UI.DomElement">The element to attach to</param>
            Sys.Extended.UI.HtmlEditorExtenderBehavior.initializeBase(this, [element]);
            textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);
            var id = this.get_id();

            this._buttonWidth = 23;
            this._buttonHeight = 21;            

            this._containerTemplate = {
                nodeName: "div",
                properties: {
                    id: id + "_ExtenderContainer"
                }
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
                    contentEditable: true,
                    designMode: "on"
                },                
            };

            this._buttonTemplate = {
                nodeName: "div",
                properties: {
                    style: {
                        width: this._buttonWidth + "px",
                        height: this._buttonHeight + "px"
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
            this._ToolbarContent = null;
            this._editableDiv = null;
            this._topButtonContainer = null;
            this._buttons = [];
            this._btnClickHandler = null;

            this._button_names = new Array(
							 "undo", "redo", "bold", "italic", "underline", "strike", "subscript",
							 "superscript", "left_to_right", "right_to_left", "justify_left", "justify_center",
							 "justify_right", "justify", "remove_alignment", "ordered_list", "bulleted_list",
							 "insert_horizontal_rule", "insert_edit_url", "remove_url", "remove_style", "cut",
							 "paste_plain_text", "paste_from_msword", "decrease_indent", "increase_indent");

            this._button_titles = new Array(
							 "Undo", "Redo", "Bold", "Italic", "Underline", "Strike Through", "Sub script",
							 "Super script", "Left to right direction", "Right to left direction", "Justify Left", "Justify Center",
							 "Justify Right", "Justify", "Remove Alignment", "Ordered List", "Bulleted List",
							 "Insert horizontal rule", "Insert/edit URL", "Remove URL", "Remove Style", "Cut",
							 "Paste plain text", "Paste from MS Word", "Decrease Indent", "Increase Indent");
        }

        Sys.Extended.UI.HtmlEditorExtenderBehavior.prototype = {
            initialize: function () {
                Sys.Extended.UI.HtmlEditorExtenderBehavior.callBaseMethod(this, 'initialize');

                var idx = 0;
                this._button_list = new Array();
                for (var btnName in this._button_names) {
                    this._button_list[idx] = new this._buttonInfo(this._button_names[idx], this._button_titles[idx], idx, idx * this._buttonWidth, 0);
                    idx++;
                }

                this._createContainer();
                this._createTopButtonContainer();
                this._createEditableDiv(this._textbox);
                this._createButton();

                // get form that contains textbox
                var formElement = textbox._element.parentNode;
                while (formElement != null && formElement.nodeName != 'FORM') {
                    formElement = formElement.parentNode;
                }

                if (formElement == null)
                    throw "Missing Form tag";

                // handlers
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

                //var bounds = $common.getBounds(textbox._element);                
                //$common.setSize(this._container, { width: bounds.width, height: bounds.height });                
                //swap _container with textbox and append textbox in _container
                $common.wrapElement(textbox._element, this._container, this._container);
            },

            _createTopButtonContainer: function () {
                this._topButtonContainer = $common.createElementFromTemplate(this._topButtonContainerTemplate, this._container);
            },

            _createButton: function () {
                for (var i = 0; i < this._button_list.length; i++) {
                    var _btn = $common.createElementFromTemplate(this._buttonTemplate, this._topButtonContainer);
                    _btn.setAttribute("id", this._button_list[i].Name);
                    _btn.setAttribute("name", this._button_list[i].Name);
                    _btn.setAttribute("title", this._button_list[i].Title);
                    _btn.setAttribute("unselectable", "on");
                    _btn.style.backgroundPosition = (this._button_list[i].X * -1) + 'px ' + (this._button_list[i].Y * -1) + 'px';
                    Array.add(this._buttons, _btn);
                }
            },

            _createEditableDiv: function () {
                var e = this.get_element();

                this._editableDiv = $common.createElementFromTemplate(this._editableTemplate, this._container);
                var decodeHtml = this._decodeText(textbox._element.value);
                this._editableDiv.innerHTML = textbox._element.value = decodeHtml;

                var bounds = $common.getBounds(textbox._element);
                $common.setSize(this._editableDiv, {
                    width: bounds.width,
                    height: bounds.height
                });

                $common.setVisible(textbox._element, false);

                //$common.wrapElement(this._editableDiv, this._container, this._container);
            },

            //            _createToolbar: function (contents) {
            //                var e = this.get_element();

            //                this._toolbarDiv = $common.createElementFromTemplate(this._toolbarTemplate, e.parentNode);
            //                var arrButton = this._ToolbarContent.split('|');
            //                for (i = 0; i < arrButton.length; i++) {
            //                    var button = document.createElement("span");
            //                    button.innerText = arrButton[i];
            //                    var attribute = document.createAttribute("unselectable");

            //                    attribute.nodeValue = "on"
            //                    button.setAttributeNode(attribute);

            //                    $addHandler(button, "click", this._executeCommand, true);
            //                    this._toolbarDiv.appendChild(button);
            //                    if (i < length - 1)
            //                        this.toolbarDiv.appendChild("|");
            //                }

            //                $common.wrapElement(this._toolbarDiv, this._container, this._container);
            //            },

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
                        
            _encodeText: function (str) {
                return str.replace(/&/ig, "&amp;").replace(/</ig, "&lt;").replace(/>/ig, "&gt;").replace(/\"/ig, "&quot;").replace(/\xA0/ig, "&nbsp;");
            },

            _decodeText: function (str) {
                return str.replace(/&amp;/ig, "&").replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&quot;/ig, "\"").replace(/&nbsp;/ig, "\xA0");
            },

            _executeCommand: function (command) {
                            
                switch (command.target.title.toUpperCase()) {
                    case "BOLD":
                        document.execCommand('Bold');
                        break;
                    case "ITALIC":
                        document.execCommand('Italic');
                        break;
                    case "UNDERLINE":
                        document.execCommand('Underline');
                        break;
                    case "STRIKE THROUGH":
                        document.execCommand('StrikeThrough');
                        break;
                    case "SUB SCRIPT":
                        document.execCommand('Subscript');
                        break;
                    case "SUPER SCRIPT":
                        document.execCommand('Superscript');
                        break;
                    case "JUSTIFY LEFT":
                        document.execCommand('JustifyLeft');
                        break;
                    case "JUSTIFY RIGHT":
                        document.execCommand('JustifyRight');
                        break;
                    case "JUSTIFY CENTER":
                        document.execCommand('JustifyCenter');
                        break;
                    case "ORDERED LIST":
                        document.execCommand('insertOrderedList');
                        break;
                    case "BULLETED LIST":
                        document.execCommand('insertUnorderedList');
                        break;
                }
            },

            _buttonInfo: function (_name, _title, _index, _x, _y) {
                this.Index = _index;
                this.X = _x;
                this.Y = _y;
                this.Name = 'btn_' + _name;
                this.Title = _title;
            },

            get_ToolbarContent: function () {
                return this._ToolbarContent;
            },

            set_ToolbarContent: function (value) {
                if (this._ToolbarContent != value) {
                    this._ToolbarContent = value;
                }
                this.raisePropertyChanged("ToolbarContent");
            }

        };

        Sys.Extended.UI.HtmlEditorExtenderBehavior.registerClass('Sys.Extended.UI.HtmlEditorExtenderBehavior', Sys.Extended.UI.BehaviorBase);
        Sys.registerComponent(Sys.Extended.UI.HtmlEditorExtenderBehavior, { name: "HtmlEditorExtender", parameters: [{ name: "ToolbarContent", type: "String"}] });

    } // execute

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon"], execute);

    }
    else {
        execute();
    }

})();    