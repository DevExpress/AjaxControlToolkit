/// <reference name='MicrosoftAjax.js' />
/// <reference path='../ExtenderBase/BaseScripts.js' />
/// <reference path='../Common/Common.js' />

(function () {

    // The unique name of the script registered with the
    // client script loader
    var scriptName = 'HtmlEditorExtenderBehavior';

    function execute() {
        Type.registerNamespace('Sys.Extended.UI');

        Sys.Extended.UI.HtmlEditorExtenderBehavior = function (element) {
            /// <summary>
            /// Html Extender behavior which Extends TextBox 
            /// </summmary>
            /// <param name='element' type='Sys.UI.DomElement'>The element to attach to</param>
            Sys.Extended.UI.HtmlEditorExtenderBehavior.initializeBase(this, [element]);
            this._textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);

            var id = this.get_id();

            this._ButtonWidth = 23;
            this._ButtonHeight = 21;

            //Templates
            this._containerTemplate = {
                nodeName: 'div',
                properties: {
                    id: id + '_ExtenderContainer'
                },
                cssClasses: ['unselectable', 'ajax__html_editor_extender_container']
            };

            this._editableTemplate = {
                nodeName: 'div',
                properties: {
                    id: id + '_ExtenderContentEditable',
                    style: {
                        width: '100%',
                        height: '80%',
                        overflow: 'auto',
                        clear: 'both'
                    },
                    contentEditable: true
                },
                cssClasses: ['ajax__html_editor_extender_texteditor']
            };

            this._buttonTemplate = {
                nodeName: 'input',
                properties: {
                    type: 'button',
                    style: {
                        width: this._ButtonWidth + 'px',
                        height: this._ButtonHeight + 'px'
                    }
                },
                cssClasses: ['ajax__html_editor_extender_button']
            };

            this._textboxTemplate = {
                nodeName: 'input',
                properties: {
                    type: 'text'                    
                },                
            };

            this._dropDownTemplate = {
                nodeName: 'select',
                properties: {
                    style: {
                        width: this._ButtonWidth + 'px',
                        height: this._ButtonHeight + 'px'
                    }
                },
                cssClasses: ['ajax__html_editor_extender_button']
            };

            this._topButtonContainerTemplate = {
                nodeName: 'div',
                properties: {
                    id: id + '_ExtenderButtonContainer'
                },
                cssClasses: ['ajax__html_editor_extender_buttoncontainer']
            };

            // variables
            this._container = null;
            this._toolbarButtons = null;
            this._editableDiv = null;
            this._topButtonContainer = null;
            this._buttons = [];
            this._btnClickHandler = null;
            this._requested_buttons = new Array();
            this._colorPicker = null;
            this._txtBoxForColor = null;

            // Hook into the ASP.NET WebForm_OnSubmit function to encode html tags prior to submission
            if ((typeof (WebForm_OnSubmit) == 'function') && !Sys.Extended.UI.HtmlEditorExtenderBehavior._originalWebForm_OnSubmit) {
                Sys.Extended.UI.HtmlEditorExtenderBehavior._originalWebForm_OnSubmit = WebForm_OnSubmit;
                WebForm_OnSubmit = Sys.Extended.UI.HtmlEditorExtenderBehavior.WebForm_OnSubmit;
            }
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
                    throw 'Missing Form tag';

                // delegates
                //var formSubmitHandler = Function.createDelegate(this, this._editableDiv_submit);
                var delTextBox_onblur = Function.createDelegate(this, this._textBox_onblur);
                var delEditableDiv_onblur = Function.createDelegate(this, this._editableDiv_onblur);
                var btnClickHandler = Function.createDelegate(this, this._executeCommand);

                // handlers                                
                $addHandler(this._textbox._element, 'blur', delTextBox_onblur, true);
                $addHandler(this._editableDiv, 'blur', delEditableDiv_onblur, true);
                //$addHandler(formElement, 'submit', formSubmitHandler, true);
                $addHandler(this._topButtonContainer, 'click', btnClickHandler);
            },

            _dispose: function () {
                $removeHandler(this._textbox._element, 'blur', delTextBox_onblur);
                $removeHandler(this._editableDiv, 'blur', delEditableDiv_onblur);
                //$removeHandler(formElement, 'submit', formSubmitHandler);
                $removeHandler(_topButtonContainer, 'click', btnClickHandler);

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
                    var _btn;
                    if (this._toolbarButtons[i].CommandName == 'FontName') {
                        _btn = $common.createElementFromTemplate(this._dropDownTemplate, this._topButtonContainer);
                        var option = new Option('Times New Roman', 'Times New Roman');
                        _btn.options[0] = option;
                        _btn.setAttribute('id', this._id + this._toolbarButtons[i].CommandName);
                        _btn.setAttribute('name', this._toolbarButtons[i].CommandName);
                        _btn.setAttribute('title', this._toolbarButtons[i].Tooltip);
                        _btn.setAttribute('unselectable', 'on');
                    }
                    else {
                        _btn = $common.createElementFromTemplate(this._buttonTemplate, this._topButtonContainer);
                        _btn.setAttribute('id', this._id + this._toolbarButtons[i].CommandName);
                        _btn.setAttribute('name', this._toolbarButtons[i].CommandName);
                        _btn.setAttribute('title', this._toolbarButtons[i].Tooltip);
                        _btn.setAttribute('unselectable', 'on');
                        _btn.setAttribute('class', 'ajax__html_editor_extender_button ajax__html_editor_extender_' + this._toolbarButtons[i].CommandName);
                        //_btn.style.backgroundPosition = this._toolbarButtons[i].Offset;                    
                    }
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

                //Encode html tags
                var encodedHtml = this._editableDiv.innerHTML.replace(/&/ig, '&amp;').replace(/</ig, '&lt;').replace(/>/ig, '&gt;').replace(/\'/ig, '&quot;').replace(/\xA0/ig, '&nbsp;');
                //converter to convert different tags into Html5 standard tags
                encodedHtml = encodedHtml.replace(/&lt;STRONG&gt;/ig, '&lt;b&gt;').replace(/&lt;\/STRONG&gt;/ig, '&lt;/b&gt;').replace(/&lt;EM&gt;/ig, '&lt;i&gt;').replace(/&lt;\/EM&gt;/ig, '&lt;/i&gt;');
                this._textbox._element.value = encodedHtml;
            },

            _executeCommand: function (command) {
                var isFireFox = Sys.Browser.agent == Sys.Browser.Firefox;

                if (isFireFox) {
                    document.execCommand('styleWithCSS', false, false);
                }

                var map = {
                    JustifyRight: 1,
                    JustifyLeft: 1,
                    JustifyCenter: 1,
                    JustifyFull: 1
                }

                if (map[command.target.name]) {
                    try {
                        document.execCommand(command.target.name, false, null);
                    }
                    catch (e) {
                        //special case for Mozilla Bug #442186
                        if (e && e.result == 2147500037) {
                            //probably firefox bug 442186 - workaround
                            var range = window.getSelection().getRangeAt(0);
                            var dummy = document.createElement('div');

                            //To restore the range after collapsing for triple click bug...
                            var restoreSelection = false;
                            dummy.style.height = '1px;';

                            //Triple Click selection Problem in mozilla, the selection contains the content editable div, which creates a problem for some reason, so we collapse the selection to the end, and then re-select everything...
                            if (range.startContainer.contentEditable == 'true') {
                                window.getSelection().collapseToEnd();
                                restoreSelection = true;
                            }

                            var ceNode = window.getSelection().getRangeAt(0).startContainer;

                            while (ceNode && ceNode.contentEditable != 'true')
                                ceNode = ceNode.parentNode;

                            if (!ceNode) throw 'Selected node is not editable!';

                            ceNode.insertBefore(dummy, ceNode.childNodes[0]);
                            document.execCommand(command.target.name, false, null);
                            dummy.parentNode.removeChild(dummy);

                            //RestoreSelection if we changed it...
                            if (restoreSelection) {
                                window.getSelection().addRange(range);
                            }
                        }
                        else if (window.console && window.console.log) {
                            window.console.log(e);
                        }
                    }
                }
                else if (command.target.name == "createLink") {
                    var url = prompt('Please insert  URL', '');
                    if (url) {
                        document.execCommand('createLink', false, url);
                    }
                }
                else if (command.target.name == 'BackColor' || command.target.name == 'ForeColor') {                    
                    var color = prompt('Please insert  Color', '');
                    if (color) {
                        document.execCommand(command.target.name, false, color);
                    }
                }
                else if (command.target.name == 'FontName') {
                    // to do open popup
                    var fontName = prompt('Please insert  Font Name', '');
                    if (fontName) {
                        document.execCommand(command.target.name, false, fontName);
                    }
                }
                else if (command.target.name == 'FontSize') {
                    // to do open popup
                    var fontSize = prompt('Please insert  Font Size', '');
                    if (fontSize) {
                        document.execCommand(command.target.name, false, fontSize);
                    }
                }
                else {
                    document.execCommand(command.target.name, false, null);
                }

            },

            get_ButtonWidth: function () {
                return this._ButtonWidth;
            },

            set_ButtonWidth: function (value) {
                if (this._ButtonWidth != value) {
                    this._ButtonWidth = value;
                    this.raisePropertyChanged('ButtonWidth');
                }
            },

            get_ButtonHeight: function () {
                return this._ButtonHeight;
            },

            set_ButtonHeight: function (value) {
                if (this._ButtonHeight != value) {
                    this._ButtonHeight = value;
                    this.raisePropertyChanged('ButtonHeight');
                }
            },

            get_ToolbarButtons: function () {
                return this._toolbarButtons;
            },

            set_ToolbarButtons: function (value) {
                if (this._toolbarButtons != value) {
                    this._toolbarButtons = value;
                    this.raisePropertyChanged('ToolbarButtons');
                }
            }

        };

        Sys.Extended.UI.HtmlEditorExtenderBehavior.registerClass('Sys.Extended.UI.HtmlEditorExtenderBehavior', Sys.Extended.UI.BehaviorBase);
        Sys.registerComponent(Sys.Extended.UI.HtmlEditorExtenderBehavior, { name: 'HtmlEditorExtender', parameters: [{ name: 'ToolbarButtons', type: 'HtmlEditorExtenderButton[]'}] });

        Sys.Extended.UI.HtmlEditorExtenderBehavior.WebForm_OnSubmit = function () {
            /// <summary>
            /// Wraps ASP.NET's WebForm_OnSubmit in order to encode tags prior to submission
            /// </summary>
            /// <returns type='Boolean'>
            /// Result of original WebForm_OnSubmit
            /// </returns>
            var result = Sys.Extended.UI.HtmlEditorExtenderBehavior._originalWebForm_OnSubmit();
            if (result) {
                var components = Sys.Application.getComponents();
                for (var i = 0; i < components.length; i++) {
                    var component = components[i];
                    if (Sys.Extended.UI.HtmlEditorExtenderBehavior.isInstanceOfType(component)) {
                        component._editableDiv_submit();
                    }
                }
            }
            return result;
        }

    } // execute

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, ['ExtendedBase', 'ExtendedCommon'], execute);

    }
    else {
        execute();
    }

})();    