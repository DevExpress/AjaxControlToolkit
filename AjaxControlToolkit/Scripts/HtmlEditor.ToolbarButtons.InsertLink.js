Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertLink = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertLink.initializeBase(this, [element]);
    this._emptySrc = window.location.href.replace(/(http[s]*\:\/\/)[^\u0000]*/i, "$1");
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertLink.prototype = {

    callMethod: function() {
        var editor = this._designPanel,
            sel = editor._getSelection(),
            range = editor._createRange(sel),
            parent = Sys.Extended.UI.HtmlEditor.getSelParent(editor);

        if(parent.nodeType == 3)
            parent = parent.parentNode;

        while(parent && Sys.Extended.UI.HtmlEditor.isStyleTag(parent.tagName) && parent.tagName.toUpperCase() != "A")
            parent = parent.parentNode;

        if(parent && parent.tagName.toUpperCase() == "A") {
            this._edit = true;
            this._editLink(parent);
        } else {
            this._edit = false;
            if(!this._createLink())
                return false;
        }

        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertLink.callBaseMethod(this, "callMethod"))
            return false;

        return true;
    },

    opened: function(contentWindow) {
        this._preparePopup(contentWindow);
    },

    ok: function(contentWindow) {
        var targetField = contentWindow.popupMediator.getField("target");
        if(targetField != null)
            this._obj.target = targetField.value;

        var urlField = contentWindow.popupMediator.getField("url");
        if(urlField != null)
            this._obj.href = urlField.value;

        if(/^javascript:/.test(this._obj.href)) {
            this._obj.target = null;
            try {
                this._obj.removeAttribute("target");
            } catch(e) { }
        } else {
            var targetField = contentWindow.popupMediator.getField("target");

            if(targetField != null)
                this._obj.target = targetField.value;
        }

        if(this._edit) {
            this._edit_callback(true);
        } else {
            this._create_callback(true);
        }
    },

    cancel: function(contentWindow) {
        if(this._edit)
            this._edit_callback(false);
        else
            this._create_callback(false);
    },

    _createLink: function() {
        var editor = this._designPanel,
            selectedHTML = (!Sys.Extended.UI.HtmlEditor.isIE) ? Sys.Extended.UI.HtmlEditor.Trim(editor.getSelectedHTML()) : "",
            sel = editor._getSelection(),
            range = editor._createRange(sel);

        this._txt = null;

        if(!(editor.isControl() && Sys.Extended.UI.HtmlEditor.getSelParent(editor).tagName && (Sys.Extended.UI.HtmlEditor.getSelParent(editor).tagName.toUpperCase() == "EMBED" || Sys.Extended.UI.HtmlEditor.getSelParent(editor).tagName.toUpperCase() == "IMG")) &&
           !(!editor.isControl() && ((Sys.Extended.UI.HtmlEditor.isIE && range.text.length > 0) || (!Sys.Extended.UI.HtmlEditor.isIE && selectedHTML.length > 0)))) {

            editor._saveContent();
            var _span = editor._doc.createElement("span");
            _span.innerHTML = "new link";

            _span.id = Sys.Extended.UI.HtmlEditor.smartClassName;

            var needSelect = true;
            if(Sys.Extended.UI.HtmlEditor.isIE && editor.isControl()) {
                var control = range.item(0);
                var _span1 = editor._doc.createElement("span");

                control.parentNode.insertBefore(_span1, control);
                this._txt = _span.firstChild;
                control.parentNode.insertBefore(this._txt, control);
                var _span2 = editor._doc.createElement("span");

                control.parentNode.insertBefore(_span2, control);
                control.parentNode.removeChild(control);

                editor.setSelectionAfterOperation([_span1, _span2], false);
                needSelect = false;
            } else {
                editor.insertHTML(Sys.Extended.UI.HtmlEditor.getHTML(_span, true));

                var el = editor._doc.getElementById(Sys.Extended.UI.HtmlEditor.smartClassName);

                this._txt = el.firstChild;

                el.parentNode.insertBefore(el.firstChild, el);
                el.parentNode.removeChild(el);
            }

            if(!Sys.Extended.UI.HtmlEditor.isIE) {
                range = editor._createRange();
                range.setStart(this._txt, 0);
                range.setEnd(this._txt, ("" + this._txt.data + "").length);
                editor._removeAllRanges(sel);
                editor._selectRange(sel, range);
            } else {
                if(needSelect)
                    range.select();
            }

            selectedHTML = (!Sys.Extended.UI.HtmlEditor.isIE) ? Sys.Extended.UI.HtmlEditor.Trim(editor.getSelectedHTML()) : "";
            sel = editor._getSelection();
            range = editor._createRange(sel);
        }

        if((editor.isControl() && Sys.Extended.UI.HtmlEditor.getSelParent(editor).tagName.toUpperCase() == "IMG") ||
          (!editor.isControl() && ((Sys.Extended.UI.HtmlEditor.isIE && range.text.length > 0) || (!Sys.Extended.UI.HtmlEditor.isIE && selectedHTML.length > 0)))) {
            editor._saveContent();

            this._obj = { target: "default", href: this._emptySrc, title: "" };

            var temp = editor._doc.getElementsByTagName("A");
            var aList = [];

            for(var i = 0; i < temp.length; i++)
                aList.push([temp[i], "" + temp[i].href + ""]);

            editor._execCommand("createLink", false, this._emptySrc);
            this._oldList = [];

            for(var i = 0; i < aList.length; i++) {
                var a = aList[i][0];
                var href = aList[i][1];

                if(a.href == href)
                    this._oldList.push(a);
            }
        } else {
            if(this._txt) {
                editor._undo(false);
                editor.__stack.pop();
            }
            return false;
        }

        return true;
    },

    _editLink: function(link) {
        var editor = this._designPanel;

        this._obj = link;
        editor._saveContent();
    },

    _preparePopup: function(contentWindow) {
        if(this._obj.target && this._obj.target.length > 0 && this._obj.target == "default")
            this._obj.target = this.get_relatedPopup().get_defaultTarget();

        var targetField = contentWindow.popupMediator.getField("target");
        if(targetField != null)
            targetField.value = (this._obj.target && this._obj.target.length > 0 && this._obj.target.substr(0, 1) == "_") ? this._obj.target.toLowerCase() : "_self";

        var urlField = contentWindow.popupMediator.getField("url");
        if(urlField != null) {
            if(this._edit)
                urlField.value = Sys.Extended.UI.HtmlEditor.getRealAttribute(this._obj, "href");
            else
                urlField.value = this._obj.href;

            if(urlField.value.length == 0)
                urlField.value = this._emptySrc;

            urlField.value = urlField.value.replace(/\&quot;/g, "\"");

            setTimeout(function() {
                Sys.Extended.UI.HtmlEditor.setSelectionRange(urlField, 0, urlField.value.length);
            }, 0);
        }
    },

    _edit_callback: function(ok) {
        var editor = this._designPanel;
        try {
            if(!ok) {
                editor._undo(false);
            } else {
                if(this._obj.title.length == 0) {
                    this._obj.title = null;
                    this._obj.removeAttribute("title");
                }
                editor.onContentChanged();
            }
        } catch(ex) { }

        return true;
    },

    okCheck: function(contentWindow) {
        var urlField = contentWindow.popupMediator.getField("url");

        if(urlField != null) {
            var url = urlField.value;

            if(url == "" || (url.length >= 3 && url.substr(url.length - 3, 3) == "://")) {
                contentWindow.alert(this.get_message("EmptyURL"));
                contentWindow.setTimeout(function() { try { urlField.focus(); } catch(e) { } }, 0);

                return false;
            }

            return true;
        }

        return false;
    },

    _create_callback: function(ok) {
        var editor = this._designPanel;

        try {
            if(ok) {
                var aList = editor._doc.getElementsByTagName("A"),
                    aNumber = 0;

                for(var i = 0; i < aList.length; i++) {
                    var good = true,
                        a = aList[i];

                    for(var j = 0; j < this._oldList.length; j++)
                        if(a == this._oldList[j]) {
                            good = false;
                            break;
                        }

                    if(!good)
                        continue;

                    aNumber = i;
                    if(this._obj.target)
                        a.target = this._obj.target;

                    a.href = this._obj.href;
                    if(this._obj.title.length > 0)
                        a.title = this._obj.title;
                }

                if(this._txt)
                    this._txt.data = this._obj.href;

                if(aList.length > 0) {
                    var elka = aList[aNumber],
                        _span = editor._doc.createElement("span");

                    _span.innerHTML = "&nbsp;";

                    if(elka.nextSibling != null)
                        elka.parentNode.insertBefore(_span, elka.nextSibling);
                    else
                        elka.parentNode.appendChild(_span);

                    setTimeout(function() {
                        Sys.Extended.UI.HtmlEditor._setCursor(_span, editor);

                        setTimeout(function() {
                            elka.parentNode.removeChild(_span);
                        }, 0);
                    }, 0);
                }

                setTimeout(function() { editor._editPanel.updateToolbar(); editor.onContentChanged(); }, 0);
            } else {
                editor._undo(false);
                editor.__stack.pop();

                if(this._txt) {
                    editor._undo(false);
                    editor.__stack.pop();
                }
            }

            editor.focusEditor();
        } catch(e) { }

        return true;
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertLink.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertLink", Sys.Extended.UI.HtmlEditor.ToolbarButtons.OkCancelPopupButton);