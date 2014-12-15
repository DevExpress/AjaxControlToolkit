Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.HtmlEditorExtenderBehavior = function(element) {
    Sys.Extended.UI.HtmlEditorExtenderBehavior.initializeBase(this, [element]);
    this._textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);

    var id = this.get_id();

    this._backColor = null;
    this._foreColor = null;
    this._commandName = null;
    this._savedRange = null;
    this._isInFocus = null;
    this._oldContents = null;
    this._newContents = null;
    this._isDirty = false;
    this._viewMode = 'content';
    this._displaySourceTab = false;

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
                //height: '60%',
                overflow: 'auto',
                clear: 'both'
            },
            contentEditable: true
        },
        cssClasses: ['ajax__html_editor_extender_texteditor']
    };

    this._sourceViewTemplate = {
        nodeName: 'div',
        properties: {
            id: id + '_ExtenderSourceView',
            style: {
                height: '90%',
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

    this._buttonContentTemplate = {
        nodeName: 'input',
        properties: {
            type: 'button',
            style: {
                width: this._ButtonWidth + 'px',
                height: this._ButtonHeight + 'px'
            }
        },
        cssClasses: ['ajax__html_editor_extender_button ajax__html_editor_extender_content']
    };

    this._buttonSourceTemplate = {
        nodeName: 'input',
        properties: {
            type: 'button',
            style: {
                width: this._ButtonWidth + 'px',
                height: this._ButtonHeight + 'px'
            }
        },
        cssClasses: ['ajax__html_editor_extender_button ajax__html_editor_extender_source']
    };

    this._textboxTemplate = {
        nodeName: 'input',
        properties: {
            type: 'text'
        }
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

    this._topButtonContainerTemplate2 = {
        nodeName: 'div',
        properties: {
            id: id + '_ExtenderButtonContainer2',
            style: {
                clear: 'both'
            }
        },
        cssClasses: ['ajax__html_editor_extender_buttoncontainer2']
    };

    // variables
    this._container = null;
    this._toolbarButtons = null;
    this._editableDiv = null;
    this._sourceViewDiv = null;
    this._topButtonContainer = null;
    this._topButtonContainer2 = null;
    this._buttons = [];
    this._btnClickHandler = null;
    this._requested_buttons = new Array();
    this._colorPicker = null;
    this._txtBoxForColor = null;
    this._contentViewButton = null;
    this._sourceViewButton = null;
    this._popupDiv = null;
    this._btnDone = null;
    this._btnCancel = null;
    this._isFocusInEditableDiv = false;
    this._textBoxOnBlurDelegate = null;
    this._editableDivOnBlurDelegate = null;
    this._editableDivOnFocusDelegate = null;
    this._btnClickDelegate = null;
    this._contentViewClickDelegate = null;
    this._sourceViewClickDelegate = null;
    this._sourceViewDivOnBlurDelegate = null;
    this._imageCancelClickDelegate = null;

    // Hook into the ASP.NET WebForm_OnSubmit function to encode html tags prior to submission
    if((typeof (WebForm_OnSubmit) == 'function') && !Sys.Extended.UI.HtmlEditorExtenderBehavior._originalWebForm_OnSubmit) {
        Sys.Extended.UI.HtmlEditorExtenderBehavior._originalWebForm_OnSubmit = WebForm_OnSubmit;
        WebForm_OnSubmit = Sys.Extended.UI.HtmlEditorExtenderBehavior.WebForm_OnSubmit;
    }
};

Sys.Extended.UI.HtmlEditorExtenderBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.HtmlEditorExtenderBehavior.callBaseMethod(this, 'initialize');
        HtmlEditorExtender_editableDivs[HtmlEditorExtender_editableDivs.length] = this;

        this._button_list = new Array();
        this._createContainer();
        this._createTopButtonContainer();
        this._createButton();
        this._createEditableDiv();

        if(this.get_displaySourceTab()) {
            this._createSourceViewDiv();
            this._createTopButtonContainer2();
        }

        // get form that contains textbox
        var formElement = this._textbox._element.parentNode;
        while(formElement != null && formElement.nodeName != 'FORM')
            formElement = formElement.parentNode;

        if(formElement == null)
            throw 'Missing Form tag';

        var id = this.get_id();
        this._popupDiv = $get(id + '_popupDiv');
        if(this._popupDiv == null) {
            if(id.indexOf('_') != -1)
                id = id.substring(id.lastIndexOf('_') + 1);
            else
                id = '';

            this._popupDiv = $get(id + '_popupDiv');
        }

        if(this._popupDiv != null) {
            this._popupBehavior = $create(Sys.Extended.UI.PopupBehavior, { 'id': id + '_ImagePopupBehavior', 'parentElement': this.get_element(), 'unselectable': 'on' }, null, null, this._popupDiv);
            this._btnCancel = $get(id + '_btnCancel');
            this._imageCancelClickDelegate = Function.createDelegate(this, this._btnCancel_click);

            $addHandler(this._btnCancel, 'click', this._imageCancelClickDelegate, true);
            this._elementVisible(this._popupDiv, false);
        }

        // delegates
        this._textBoxOnBlurDelegate = Function.createDelegate(this, this._textBox_onblur);
        this._editableDivOnBlurDelegate = Function.createDelegate(this, this._editableDiv_onblur);
        this._editableDivOnFocusDelegate = Function.createDelegate(this, this._editableDiv_onfocus);
        this._btnClickDelegate = Function.createDelegate(this, this._executeCommand);

        if(this.get_displaySourceTab()) {
            this._contentViewClickDelegate = Function.createDelegate(this, this._contentView_click);
            this._sourceViewClickDelegate = Function.createDelegate(this, this._sourceView_click);
            this._sourceViewDivOnBlurDelegate = Function.createDelegate(this, this._sourceViewDiv_onblur);
        }

        // handlers                                
        $addHandler(this._textbox._element, 'blur', this._textBoxOnBlurDelegate, true);
        $addHandler(this._editableDiv, 'blur', this._editableDivOnBlurDelegate, true);
        $addHandler(this._editableDiv, 'focus', this._editableDivOnFocusDelegate, true);
        $addHandler(this._topButtonContainer, 'click', this._btnClickDelegate, true);

        if(this.get_displaySourceTab()) {
            $addHandler(this._contentViewButton, 'click', this._contentViewClickDelegate, true);
            $addHandler(this._sourceViewButton, 'click', this._sourceViewClickDelegate, true);
            $addHandler(this._sourceViewDiv, 'blur', this._sourceViewDivOnBlurDelegate, true);
        }
    },

    _dispose: function() {
        $removeHandler(this._textbox._element, 'blur', this._textBoxOnBlurDelegate);
        $removeHandler(this._editableDiv, 'blur', this._editableDivOnBlurDelegate);
        $removeHandler(this._editableDiv, 'focus', this._editableDivOnFocusDelegate);
        $removeHandler(this._topButtonContainer, 'click', this._btnClickDelegate);

        if(this.get_displaySourceTab()) {
            $removeHandler(this._contentViewButton, 'click', this._contentViewClickDelegate);
            $removeHandler(this._sourceViewButton, 'click', this._sourceViewClickDelegate);
            $removeHandler(this._sourceViewDiv, 'blur', this._sourceViewDivOnBlurDelegate);
        }

        if(this._popupDiv != null)
            $removeHandler(this._btnCancel, 'click', this._imageCancelClickDelegate);

        Sys.Extended.UI.HtmlEditorExtenderBehavior.callBaseMethod(this, 'dispose');
    },

    _createContainer: function() {
        var e = this.get_element();
        this._container = $common.createElementFromTemplate(this._containerTemplate, e.parentNode);

        this._elementVisible(this._textbox._element, true);

        var bounds = $common.getBounds(this._textbox._element);
        $common.setSize(this._container, {
            width: bounds.width,
            height: bounds.height
        });

        this._elementVisible(this._textbox._element, false);

        $common.wrapElement(this._textbox._element, this._container, this._container);
    },

    _createTopButtonContainer: function() {
        this._topButtonContainer = $common.createElementFromTemplate(this._topButtonContainerTemplate, this._container);
    },

    _createButton: function() {
        var isIE = Sys.Browser.agent == Sys.Browser.InternetExplorer;
        for(i = 0; i < this._toolbarButtons.length; i++) {
            var _btn;

            if(this._toolbarButtons[i].CommandName == 'HorizontalSeparator') {
                _btn = $common.createElementFromTemplate({
                    nodeName: "span",
                    cssClasses: ['ajax__html_editor_extender_separator']
                }, this._topButtonContainer);
            } else if(this._toolbarButtons[i].CommandName == 'FontName') {
                _btn = $common.createElementFromTemplate({
                    nodeName: "nobr",
                    properties: {
                        style: {
                            float: 'left',
                            cssFloat: 'left',
                            fontSize: '11px'
                        }
                    },
                    cssClasses: ['ajax__html_editor_extender_fontnameclass'],
                    children: [{
                        nodeName: "span",
                        properties: {
                            textContent: "Font ",
                            innerText: "Font ",
                            style: {
                                paddingLeft: '5px',
                                fontWeight: 'bold'
                            }
                        }
                    }]
                }, this._topButtonContainer);

                _select = $common.createElementFromTemplate({
                    nodeName: "select",
                    properties: {
                        style: {
                            fontSize: '9px',
                            fontFamily: 'Arial',
                            height: "20px",
                            width: '90px'
                        }
                    },
                    events: {
                        change: function(e) {
                            var value = this.options[this.selectedIndex].value;
                            setTimeout(function() {
                                document.execCommand("fontname", false, value);
                            }, 200);
                        }
                    }
                }, _btn);

                var option = [
                    { Text: "Arial", Value: "arial,helvetica,sans-serif" },
                    { Text: "Courier New", Value: "courier new,courier,monospace" },
                    { Text: "Georgia", Value: "georgia,times new roman,times,serif" },
                    { Text: "Tahoma", Value: "tahoma,arial,helvetica,sans-serif" },
                    { Text: "Times New Roman", Value: "times new roman,times,serif" },
                    { Text: "Verdana", Value: "verdana,arial,helvetica,sans-serif" },
                    { Text: "Impact", Value: "impact" },
                    { Text: "WingDings", Value: "wingdings" }
                ];

                for(x in option) {
                    var elOptNew = document.createElement('option');

                    elOptNew.text = option[x].Text;
                    elOptNew.value = option[x].Value;

                    try {
                        _select.add(elOptNew, null); // standards compliant; doesn't work in IE
                    } catch(ex) {
                        _select.add(elOptNew); // IE only
                    }
                }

                _select.setAttribute('id', this._id + this._toolbarButtons[i].CommandName);
                _select.setAttribute('name', this._toolbarButtons[i].CommandName);
                _select.setAttribute('title', this._toolbarButtons[i].Tooltip);
                _select.setAttribute('unselectable', 'on');
            } else if(this._toolbarButtons[i].CommandName == 'FontSize') {
                _btn = $common.createElementFromTemplate({
                    nodeName: "nobr",
                    properties: {
                        style: {
                            float: 'left',
                            cssFloat: 'left',
                            fontSize: '11px'
                        }
                    },
                    cssClasses: ['ajax__html_editor_extender_fontsizeclass'],
                    children: [{
                        nodeName: "span",
                        properties: {
                            textContent: "Size ",
                            innerText: "Size ",
                            style: {
                                paddingLeft: '5px',
                                fontWeight: 'bold'
                            }
                        }
                    }]
                }, this._topButtonContainer);

                _select = $common.createElementFromTemplate({
                    nodeName: "select",
                    properties: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Arial',
                            height: "20px",
                            width: isIE ? '30px' : '50px'
                        }
                    },
                    events: {
                        change: function(e) {
                            var value = this.options[this.selectedIndex].value;
                            setTimeout(function() {
                                document.execCommand("fontsize", false, value);
                            }, 200);
                        }
                    }
                }, _btn);

                var option = [
                    { Text: "1", Value: "1" },
                    { Text: "2", Value: "2" },
                    { Text: "3", Value: "3" },
                    { Text: "4", Value: "4" },
                    { Text: "5", Value: "5" },
                    { Text: "6", Value: "6" },
                    { Text: "7", Value: "7" }
                ];

                for(x in option) {
                    var elOptNew = document.createElement('option');

                    elOptNew.text = option[x].Text;
                    elOptNew.value = option[x].Value;

                    try {
                        _select.add(elOptNew, null); // standards compliant; doesn't work in IE
                    } catch(ex) {
                        _select.add(elOptNew); // IE only
                    }
                }

                _select.setAttribute('id', this._id + this._toolbarButtons[i].CommandName);
                _select.setAttribute('name', this._toolbarButtons[i].CommandName);
                _select.setAttribute('title', this._toolbarButtons[i].Tooltip);
                _select.setAttribute('unselectable', 'on');
            } else if(this._toolbarButtons[i].CommandName == 'ForeColor') {
                _btn = $common.createElementFromTemplate({
                    nodeName: "span",
                    properties: {
                        style: {
                            backgroundColor: '#ff0000',
                            border: 'solid 1px #c2c2c2',
                            display: 'block',
                            float: 'left',
                            cssFloat: 'left'
                        }
                    },
                    cssClasses: ['ajax__html_editor_extender_forecolorclass']
                }, this._topButtonContainer);
                _btn.setAttribute('unselectable', 'on');

                this._foreColor = $common.createElementFromTemplate({
                    nodeName: 'input',
                    properties: {
                        type: 'button',
                        id: this._id + this._toolbarButtons[i].CommandName,
                        name: this._toolbarButtons[i].CommandName,
                        title: this._toolbarButtons[i].Tooltip,
                        style: {
                            backgroundColor: 'transparent',
                            width: '21px',
                            height: '19px',
                            color: 'transparent'
                        }
                    },
                    cssClasses: ['ajax__html_editor_extender_button ajax__html_editor_extender_' + this._toolbarButtons[i].CommandName]
                }, _btn);

                this._foreColor.setAttribute('unselectable', 'on');
            } else if(this._toolbarButtons[i].CommandName == 'BackColor') {
                _btn = $common.createElementFromTemplate({
                    nodeName: "span",
                    properties: {
                        style: {
                            backgroundColor: '#ff0000',
                            border: 'solid 1px #c2c2c2',
                            display: 'block',
                            float: 'left',
                            cssFloat: 'left'
                        }
                    },
                    cssClasses: ['ajax__html_editor_extender_backcolorclass']
                }, this._topButtonContainer);
                _btn.setAttribute('unselectable', 'on');

                this._backColor = $common.createElementFromTemplate({
                    nodeName: 'input',
                    properties: {
                        type: 'button',
                        id: this._id + this._toolbarButtons[i].CommandName,
                        name: this._toolbarButtons[i].CommandName,
                        title: this._toolbarButtons[i].Tooltip,
                        style: {
                            backgroundColor: 'transparent',
                            width: '21px',
                            height: '19px',
                            color: 'transparent'
                        }
                    },
                    cssClasses: ['ajax__html_editor_extender_button ajax__html_editor_extender_' + this._toolbarButtons[i].CommandName]
                }, _btn);

                this._backColor.setAttribute('unselectable', 'on');
            } else {
                var map = {
                    Copy: 1,
                    Cut: 1,
                    Paste: 1
                };

                if(Sys.Browser.agent != Sys.Browser.InternetExplorer && map[this._toolbarButtons[i].CommandName]) {
                    // don't render button
                } else {
                    _btn = $common.createElementFromTemplate({
                        nodeName: 'input',
                        properties: {
                            type: 'button',
                            id: this._id + this._toolbarButtons[i].CommandName,
                            name: this._toolbarButtons[i].CommandName,
                            title: this._toolbarButtons[i].Tooltip,
                            style: {
                                width: '23px',
                                height: '21px'
                            }
                        },
                        cssClasses: ['ajax__html_editor_extender_button ajax__html_editor_extender_' + this._toolbarButtons[i].CommandName]
                    }, this._topButtonContainer);
                    _btn.setAttribute('unselectable', 'on');
                }
                Array.add(this._buttons, _btn);
            }
        }
    },

    _createEditableDiv: function() {
        var id = this.get_id(),
            height;

        // need to make visible to get height if this is hidden under parent element
        this._elementVisible(this._container, true);
        if(this.get_displaySourceTab())
            height = this._container.clientHeight - (this._topButtonContainer.clientHeight + 25);
        else
            height = this._container.clientHeight - this._topButtonContainer.clientHeight;

        // make it visible false for its early stage
        this._elementVisible(this._container, false);

        this._editableDiv = $common.createElementFromTemplate({
            nodeName: 'div',
            properties: {
                id: id + '_ExtenderContentEditable',
                style: {
                    height: height + 'px',
                    overflow: 'auto',
                    clear: 'both'
                },
                contentEditable: true
            },
            cssClasses: ['ajax__html_editor_extender_texteditor']
        }, this._container);

        this._textbox._element.value = this._textbox._element.value.replace('&#x26;amp&#x3B;', '&#x26;');
        this._editableDiv.innerHTML = this._textbox._element.value;
        this._oldContents = this._editableDiv.innerHTML;

        $common.setVisible(this._textbox._element, false);
    },

    _createTopButtonContainer2: function() {
        this._topButtonContainer2 = $common.createElementFromTemplate(this._topButtonContainerTemplate2, this._container);
        this._contentViewButton = $common.createElementFromTemplate(this._buttonContentTemplate, this._topButtonContainer2);
        this._sourceViewButton = $common.createElementFromTemplate(this._buttonSourceTemplate, this._topButtonContainer2);
    },

    _createSourceViewDiv: function() {
        var id = this.get_id(),
            height = this._container.clientHeight - 25;

        this._sourceViewDiv = $common.createElementFromTemplate({
            nodeName: 'div',
            properties: {
                id: id + '_ExtenderSourceView',
                style: {
                    height: height + 'px',
                    overflow: 'auto',
                    clear: 'both'
                },
                contentEditable: true
            },
            cssClasses: ['ajax__html_editor_extender_texteditor']
        }, this._container);

        $common.setVisible(this._sourceViewDiv, false);
    },

    _editableDiv_onblur: function() {
        this._textbox._element.value = this._encodeHtml();
        this._isFocusInEditableDiv = false;

        if(this._oldContents != this._editableDiv.innerHTML) {
            this._isDirty = true;
            this._oldContents = this._editableDiv.innerHTML;
            this._raiseEvent('change');
        }
    },

    _editableDiv_onfocus: function() {
        this._isFocusInEditableDiv = false;
    },

    _sourceViewDiv_onblur: function() {
        if(this._oldContents != (this._sourceViewDiv.innerText || this._sourceViewDiv.textContent)) {
            this._isDirty = true;

            if(this._sourceViewDiv.textContent != undefined)
                this._editableDiv.innerHTML = this._sourceViewDiv.textContent;
            else
                this._editableDiv.innerHTML = this._sourceViewDiv.innerText;

            this._oldContents = this._editableDiv.innerHTML;
            this._raiseEvent('change');
        }
    },

    _textBox_onblur: function() {
        this._editableDiv.innerHTML = this._textbox._element.value;
    },

    _contentView_click: function() {
        if(this._viewMode != 'content') {
            $common.setVisible(this._topButtonContainer, true);
            $common.setVisible(this._editableDiv, true);

            if(this._sourceViewDiv.textContent != undefined)
                this._editableDiv.innerHTML = this._sourceViewDiv.textContent;
            else
                this._editableDiv.innerHTML = this._sourceViewDiv.innerText;

            this._oldContents = this._editableDiv.innerHTML;
            $common.setVisible(this._sourceViewDiv, false);
            this._viewMode = 'content';
        }
    },

    _sourceView_click: function() {
        if(this._viewMode != 'source') {
            $common.setVisible(this._sourceViewDiv, true);

            if(this._sourceViewDiv.textContent != undefined)
                this._sourceViewDiv.textContent = this._editableDiv.innerHTML;
            else
                this._sourceViewDiv.innerText = this._editableDiv.innerHTML;

            this._oldContents = this._editableDiv.innerHTML;
            $common.setVisible(this._editableDiv, false);
            $common.setVisible(this._topButtonContainer, false);
            this._viewMode = 'source';
        }
    },

    _btnCancel_click: function() {
        this._popupBehavior.hide();
    },

    _attributes: {
        style: 'st_yle_',
        size: 'si_ze_',
        color: 'co_lor_',
        face: 'fa_ce_',
        align: 'al_ign_'
    },

    _rgbToHex: function(s) {
        var a = /rgb\s?\(\s?(\d+)\s?,\s?(\d+)\s?,\s?(\d+)\s?\)/.exec(s);

        return '#' + (parseInt(a[3], 10) | (parseInt(a[2], 10) << 8) | (parseInt(a[1], 10) << 16)).toString(16);
    },

    _encodeHtml: function() {
        //Encode html tags
        var isIE = Sys.Browser.agent == Sys.Browser.InternetExplorer,
            elements = this._editableDiv.getElementsByTagName('*'),
            element;

        for(var i = 0; element = elements[i]; i++) {
            try {
                element.className = '';
                element.removeAttribute('class');
            } catch(ex) { }

            try {
                element.id = '';
                element.removeAttribute('id');
            } catch(ex) { }

            try {
                element.removeAttribute('width');
            } catch(ex) { }
        }

        var html = this._editableDiv.innerHTML;
        if(isIE) {
            //force attributes to be double quoted
            var allTags = /\<[^\>]+\>/g;

            html = html.replace(allTags, function(tag) {
                var sQA = '',
                    nQA = '';

                if(tag.toLowerCase().substring(0, 2) != '<a') {
                    sQA = /\=\'([^\'])*\'/g; //single quoted attributes
                    nQA = /\=([^\"][^\s\/\>]*)/g; //non double quoted attributes

                    return tag.replace(sQA, '="$1"').replace(nQA, '=$1');
                } else {
                    return tag;
                }
            });
        }

        //convert rgb colors to hex
        var fixRGB = this._rgbToHex;
        var replaceRGB = function() {
            html = html.replace(/(\<[^\>]+)(rgb\s?\(\d{1,3}\s?\,\s?\d{1,3}\s?\,\s?\d{1,3}\s?\))([^\>]*\>)/gi, function(text, p1, p2, p3) {
                return (p1 || '') + ((p2 && fixRGB(p2)) || '') + (p3 || '');
            });
        };

        //twice in case a tag has more than one rgb color in it;
        replaceRGB();
        replaceRGB();

        // remove empty class and id attributes
        html = html.replace(/\sclass\=\"\"/gi, '').replace(/\sid\=\"\"/gi, '');

        //converter to convert different tags into Html5 standard tags
        html = html.replace(/\<(\/?)strong\>/gi, '<$1b>').replace(/\<(\/?)em\>/gi, '<$1i>');

        //encode for safe transport
        html = html.replace(/&/ig, '&amp;').replace(/\xA0/ig, '&nbsp;');
        html = html.replace(/</ig, '&lt;').replace(/>/ig, '&gt;').replace(/\'/ig, '&apos;').replace(/\"/ig, '&quot;');

        return html;
    },

    _editableDiv_submit: function() {
        //html encode
        var char = 3,
            sel = null;

        setTimeout(function() {
            if(this._editableDiv != null)
                this._editableDiv.focus();
        }, 0);

        if(Sys.Browser.agent != Sys.Browser.Firefox) {
            if(document.selection) {
                sel = document.selection.createRange();
                sel.moveStart('character', char);
                sel.select();
            } else {
                sel = window.getSelection();
                sel.collapse(this._editableDiv.firstChild, char);
            }
        }

        //Encode html tags
        this._textbox._element.value = this._encodeHtml();
    },

    _executeCommand: function(command) {
        if(command.target.name == undefined)
            return;

        var isFireFox = Sys.Browser.agent == Sys.Browser.Firefox,
            delcolorPicker_onchange = Function.createDelegate(this, this._colorPicker_onchange);

        if(isFireFox)
            document.execCommand('styleWithCSS', false, false);

        var map = {
            JustifyRight: 1,
            JustifyLeft: 1,
            JustifyCenter: 1,
            JustifyFull: 1,
            Indent: 1,
            Outdent: 1
        };

        if(map[command.target.name]) {
            try {
                document.execCommand(command.target.name, false, null);
            } catch(e) {
                //special case for Mozilla Bug #442186
                if(e && e.result == 2147500037) {
                    //probably firefox bug 442186 - workaround
                    var range = window.getSelection().getRangeAt(0),
                        dummy = document.createElement('div');

                    //To restore the range after collapsing for triple click bug...
                    var restoreSelection = false;
                    dummy.style.height = '1px;';

                    //Triple Click selection Problem in mozilla, the selection contains the content editable div, which creates a problem for some reason, so we collapse the selection to the end, and then re-select everything...
                    if(range.startContainer.contentEditable == 'true') {
                        window.getSelection().collapseToEnd();
                        restoreSelection = true;
                    }

                    var ceNode = window.getSelection().getRangeAt(0).startContainer;

                    while(ceNode && ceNode.contentEditable != 'true')
                        ceNode = ceNode.parentNode;

                    if(!ceNode)
                        throw 'Selected node is not editable!';

                    ceNode.insertBefore(dummy, ceNode.childNodes[0]);
                    document.execCommand(command.target.name, false, null);
                    dummy.parentNode.removeChild(dummy);

                    //RestoreSelection if we changed it...
                    if(restoreSelection)
                        window.getSelection().addRange(range);
                } else if(window.console && window.console.log) {
                    window.console.log(e);
                }
            }
        } else if(command.target.name == "createLink") {
            var url = prompt('Please insert  URL', '');
            if(url)
                document.execCommand('createLink', false, url);
        } else if(command.target.name == 'ForeColor') {
            this._commandName = command.target.name;
            this.saveSelection();

            if(!this._foreColorPicker) {
                this._foreColorPicker = $create(Sys.Extended.UI.ColorPickerBehavior, { 'unselectable': 'on' }, {}, {}, this._foreColor);
                this._foreColorPicker.set_sample(this._foreColor.parentNode);
                this._foreColorPicker.add_colorSelectionChanged(delcolorPicker_onchange);
            }
            this._foreColorPicker.show();
        } else if(command.target.name == 'BackColor') {
            this._commandName = command.target.name;
            this.saveSelection();

            if(!this._backColorPicker) {
                this._backColorPicker = $create(Sys.Extended.UI.ColorPickerBehavior, { 'unselectable': 'on' }, {}, {}, this._backColor);
                this._backColorPicker.set_sample(this._backColor.parentNode);
                this._backColorPicker.add_colorSelectionChanged(delcolorPicker_onchange);
            }
            this._backColorPicker.show();
        } else if(command.target.name == 'UnSelect') {
            if(isFireFox) {
                this._editableDiv.focus();
                var sel = window.getSelection();
                sel.collapse(this._editableDiv.firstChild, 0);
            } else {
                document.execCommand(command.target.name, false, null);
            }
        } else if(command.target.name == 'InsertImage') {
            // if focus in not at editable div then dom error occurs                                        
            if(!this._isFocusInEditableDiv)
                this._editableDiv.focus();

            this.saveSelection();

            var components = Sys.Application.getComponents();

            for(var i = 0; i < components.length; i++) {
                var component = components[i];

                if(Sys.Extended.UI.HtmlEditorExtenderBehavior.isInstanceOfType(component))
                    if(component._popupBehavior._visible)
                        return;
            }

            this._elementVisible(this._popupDiv, true);
            this._popupBehavior.show();

            $common.setStyle(this._popupDiv, {
                position: 'fixed',
                top: '',
                left: '',
                opacity: '1'
            });
        } else {
            document.execCommand(command.target.name, false, null);
        }
    },

    // BackColor & ForeColor colorpicker onchange, fill color to selected text
    _colorPicker_onchange: function(e) {
        this.restoreSelection();

        if(/backcolor/i.test(this._commandName)) {
            var isFireFox = Sys.Browser.agent == Sys.Browser.Firefox;
            if(isFireFox) {
                document.execCommand('stylewithcss', false, true);
                document.execCommand("hilitecolor", false, "#" + e._selectedColor);
                document.execCommand('stylewithcss', false, false);
            } else {
                document.execCommand("backcolor", false, "#" + e._selectedColor);
            }
        } else
            document.execCommand(this._commandName, false, "#" + e._selectedColor);
    },

    // Save selected text
    saveSelection: function() {
        if(window.getSelection) //non IE Browsers
            this._savedRange = window.getSelection().getRangeAt(0);
        else if(document.selection) //IE
            this._savedRange = document.selection.createRange();
    },

    //Restore selected text
    restoreSelection: function() {
        this._isInFocus = true;

        //document.getElementById("area").focus();
        if(this._savedRange != null) {
            if(window.getSelection) { //non IE and there is already a selection
                var s = window.getSelection();

                if(s.rangeCount > 0)
                    s.removeAllRanges();

                s.addRange(this._savedRange);
            } else {
                if(document.createRange) { //non IE and no selection
                    window.getSelection().addRange(this._savedRange);
                } else {
                    if(document.selection) { //IE
                        this._savedRange.select();
                    }
                }
            }
        }
    },

    _elementVisible: function(obj, flag) {
        if(obj.tagName == 'FORM')
            return;

        if(flag) {
            if(obj.style.display == 'none') {
                obj.style.display = 'block';
                obj.setAttribute('displayChanged', true);
            }

            if(obj.style.visibility == 'hidden') {
                obj.style.visibility = 'visible';
                obj.setAttribute('visibleChanged', true);
            }

            this._elementVisible(obj.parentNode, true);
        } else {
            if(obj.getAttribute('displayChanged')) {
                obj.style.display = 'none';
                obj.removeAttribute('displayChanged');
            }

            if(obj.getAttribute('visibleChanged')) {
                // creating problem in IE8
                //obj.style.visibility = 'hidden';
                obj.removeAttribute('visibleChanged');
            }

            this._elementVisible(obj.parentNode, false);
        }
    },

    _raiseEvent: function(eventName, eventArgs) {
        // Get handler for event.
        var handler = this.get_events().getHandler(eventName);

        if(handler) {
            if(!eventArgs)
                eventArgs = Sys.EventArgs.Empty;

            // Fire event.                          
            handler(this, eventArgs);
        }
    },

    get_ButtonWidth: function() {
        return this._ButtonWidth;
    },

    set_ButtonWidth: function(value) {
        if(this._ButtonWidth != value) {
            this._ButtonWidth = value;
            this.raisePropertyChanged('ButtonWidth');
        }
    },

    get_ButtonHeight: function() {
        return this._ButtonHeight;
    },

    set_ButtonHeight: function(value) {
        if(this._ButtonHeight != value) {
            this._ButtonHeight = value;
            this.raisePropertyChanged('ButtonHeight');
        }
    },

    get_ToolbarButtons: function() {
        return this._toolbarButtons;
    },

    set_ToolbarButtons: function(value) {
        if(this._toolbarButtons != value) {
            this._toolbarButtons = value;
            this.raisePropertyChanged('ToolbarButtons');
        }
    },

    get_displaySourceTab: function() {
        return this._displaySourceTab;
    },

    set_displaySourceTab: function(value) {
        if(this._displaySourceTab != value) {
            this._displaySourceTab = value;
            this.raisePropertyChanged('DisplaySourceTab');
        }
    },

    add_change: function(handler) {
        this.get_events().addHandler("change", handler);
    },

    remove_change: function(handler) {
        this.get_events().removeHandler("change", handler);
    },

    get_isDirty: function() {
        return this._isDirty;
    }
};

Sys.Extended.UI.HtmlEditorExtenderBehavior.registerClass('Sys.Extended.UI.HtmlEditorExtenderBehavior', Sys.Extended.UI.BehaviorBase);

var HtmlEditorExtender_editableDivs = new Array();

Sys.Extended.UI.HtmlEditorExtenderBehavior.WebForm_OnSubmit = function() {
    var result = Sys.Extended.UI.HtmlEditorExtenderBehavior._originalWebForm_OnSubmit();

    if(result) {
        var components = Sys.Application.getComponents();

        for(var i = 0; i < components.length; i++) {
            var component = components[i];

            if(Sys.Extended.UI.HtmlEditorExtenderBehavior.isInstanceOfType(component))
                component._editableDiv_submit();
        }
    }

    return result;
},

Sys.Extended.UI.HtmlEditorExtenderBehavior.IsDirty = function() {
    var components = Sys.Application.getComponents();

    for(var i = 0; i < components.length; i++) {
        var component = components[i];

        if(Sys.Extended.UI.HtmlEditorExtenderBehavior.isInstanceOfType(component))
            if(component._isDirty)
                return true;
    }

    return false;
},

ajaxClientUploadComplete = function(sender, e) {
    var htmlEditorExtender = null,
        components = Sys.Application.getComponents();

    for(var i = 0; i < components.length; i++) {
        var component = components[i];

        if(Sys.Extended.UI.HtmlEditorExtenderBehavior.isInstanceOfType(component))
            if(component._popupBehavior._visible) {
                htmlEditorExtender = component;
                i = component.length;
            }
    }

    var postedUrl = e.get_postedUrl().replace('&amp;', '&');
    if(htmlEditorExtender != null) {
        htmlEditorExtender.restoreSelection();

        if(document.selection && document.selection.createRange) {
            try {
                htmlEditorExtender._savedRange.pasteHTML('<img src=\'' + postedUrl + '\' />');
            } catch(Error) {
                var node = document.createElement("img");
                node.src = postedUrl;
                htmlEditorExtender._savedRange.insertNode(node);
            }
        } else {
            var node = document.createElement("img");

            node.src = postedUrl;
            htmlEditorExtender._savedRange.insertNode(node);
        }

        if(sender._filesInQueue.length == sender._currentQueueIndex + 1) {
            while(sender._filesInQueue.length >= 1) {
                sender._filesInQueue[0].removeNodeFrom(sender._queueContainer);
                Array.removeAt(sender._filesInQueue, 0);
            }

            sender._showFilesCount();
            sender._reset();
            htmlEditorExtender._popupBehavior.hide();
        }
    }
};