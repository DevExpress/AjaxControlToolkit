Type.registerNamespace("Sys.Extended.UI.HtmlEditor");

Sys.Extended.UI.HtmlEditor.DesignPanelEventHandler = function(ev) {
    try {
        var editor = this;

        if(editor._editPanel != Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel)
            return true;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            try {
                var selka = this._doc.selection,
                    rrr = this._createRange(selka);
            } catch(e) {
                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                return false;
            }
        }

        if(ev.type == "mousedown" || ev.type == "dblclick")
            this._focus(true);

        if(!Sys.Extended.UI.HtmlEditor.isIE && ev.type == "keydown" && ev.keyCode == Sys.UI.Key.tab && this._editPanel.get_suppressTabInDesignMode()) {
            Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel = null;

            return true;
        }

        if(this.isPopup()) {
            Sys.Extended.UI.HtmlEditor._stopEvent(ev);

            return false;
        }

        // if there is opened Context menu
        var contextMenuRemoved = false;
        if(editor._contextElement && editor._contextElement != null) {
            Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.RemoveContextMenu)();

            if(ev.type == "keydown" || ev.type == "keypress") {
                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                return;
            }
            contextMenuRemoved = true;
        }

        if(typeof editor.captureInDesign == "function")
            if(editor.captureInDesign(ev) === false) {
                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                return;
            }

        // try to emulate "Ctrl + mouse click" in IE
        if(Sys.Extended.UI.HtmlEditor.isIE && ev.type == "mousedown" && ev.ctrlKey) {
            var sel = editor._getSelection(),
                savedX = ev.clientX,
                savedY = ev.clientY;

            setTimeout(function() {
                var sel = editor._getSelection();

                if(sel.type.toLowerCase() != "control") {
                    var range = editor._doc.body.createTextRange();

                    range.moveToPoint(savedX, savedY);
                    range.select();
                }

                sel = editor._getSelection();
                var range = editor._createRange(sel),
                    parent = Sys.Extended.UI.HtmlEditor.getSelParent(editor);

                while(parent != null && parent.tagName.toUpperCase() != "BODY") {
                    if(parent.tagName.toUpperCase() == "A" && parent.href != null && typeof parent.href != "undefined" && parent.href.length > 0) {
                        window.open(parent.href, "LinkViewWindow");
                        break;
                    }
                    parent = parent.parentNode;
                }
            }, 0);

            Sys.Extended.UI.HtmlEditor._stopEvent(ev);

            return false;
        }

        var el = (!Sys.Extended.UI.HtmlEditor.isIE) ? ev.target : ev.srcElement;
        if(el.tagName != null && typeof el.tagName != "undefined" && (el.tagName.toUpperCase() == "HTML" || el.tagName.toUpperCase() == "BODY")) {
            if(editor.__kkoka != true) {
                editor.__kkoka = true;

                setTimeout(function() {
                    if(editor._editPanel == Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel) {
                        if(!editor.toEndOfProtected())
                            try {
                                editor.focusEditor();
                            } catch(ex) { }
                    }

                    editor.__kkoka = false;
                }, 0);
            }
        } else {
            if(Sys.Extended.UI.HtmlEditor.contentEditable(el) != null) {
                setTimeout(function() {
                    if(editor._editPanel == Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel)
                        editor.toEndOfProtected();
                }, 0);
            }
        }

        if(contextMenuRemoved && (Sys.Extended.UI.HtmlEditor.isIE)) {
            var sss = this._getSelection(),
                rrr;

            try {
                rrr = this._createRange(sss);

                if(sss.type.toLowerCase() == "control") {
                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                    return false;
                }
            } catch(ex) {
                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                return false;
            }
        }

        var keyEvent = (Sys.Extended.UI.HtmlEditor.isIE && ev.type == "keydown") || (ev.type == "keypress"),
            rere = ev.type + "--" + keyEvent;

        if(keyEvent && !this._editPanel.get_keyboardEnabled()) {
            Sys.Extended.UI.HtmlEditor._stopEvent(ev);

            return false;
        }

        var key = String.fromCharCode(Sys.Extended.UI.HtmlEditor.isIE ? ev.keyCode : ev.charCode).toLowerCase();;
        if(keyEvent && editor._editPanel.get_hotkeys() != null) {
            if(editor._editPanel.get_hotkeys().length > 0) {
                var keysn = editor._editPanel.get_hotkeys().length,
                    cake = key;

                if(ev.keyCode == 18 || ev.keyCode == 17 || ev.keyCode == 16)
                    cake = null;

                for(var i = 0; i < keysn; i++) {
                    var item = editor._editPanel.get_hotkeys()[i];

                    if(item[1] == cake && item[2] == ev.altKey && item[3] == ev.shiftKey && item[4] == ev.ctrlKey) {
                        if(typeof item[0] == "function") {
                            setTimeout(function() {
                                (item[0])(editor);
                                editor.onContentChanged();
                                editor.focusEditor();
                            }, 0);
                        }

                        Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                        return false;
                    }
                }
            }
        }

        if(keyEvent && ev.shiftKey && ev.keyCode == 45) {
            this._commonPaste(ev);
        } else {
            if(keyEvent && ev.ctrlKey && ev.altKey && ev.keyCode == Sys.UI.Key.home) {
                var prot = null,
                    el = Sys.Extended.UI.HtmlEditor.getSelParent(editor);

                while(el && (el.nodeType == 3 || (el.tagName && el.tagName.toUpperCase() != "BODY"))) {
                    if(el.nodeType == 3 || !el.tagName) {
                        el = el.parentNode;
                        continue;
                    }

                    var tagName = el.tagName.toUpperCase();
                    if(!Sys.Extended.UI.HtmlEditor.canBeInsideP(el) && tagName != "P") {
                        if(tagName == "TD") {
                            while(tagName != "TABLE") {
                                el = el.parentNode;
                                tagName = el.tagName.toUpperCase();
                            }
                        } else {
                            if(tagName == "LI") {
                                while(tagName != "OL" && tagName != "UL") {
                                    el = el.parentNode;
                                    tagName = el.tagName.toUpperCase();
                                }
                            }
                        }

                        prot = el;
                        break;
                    }

                    el = el.parentNode;
                }

                if(prot != null) {
                    var sel = editor._getSelection(),
                        range = editor._createRange(sel),
                        tempText = editor._doc.createTextNode("");

                    prot.parentNode.insertBefore(tempText, prot);
                    if(Sys.Extended.UI.HtmlEditor.isIE) {
                        var range1 = editor._createRange(sel),
                            range2 = editor._createRange(sel),
                            span1 = editor._doc.createElement("span"),
                            span2 = editor._doc.createElement("span");

                        tempText.parentNode.insertBefore(span1, tempText);
                        if(tempText.nextSibling)
                            tempText.parentNode.insertBefore(span2, tempText.nextSibling);
                        else
                            tempText.parentNode.appendChild(span2);

                        try {
                            range1.moveToElementText(span1);
                            range2.moveToElementText(span2);
                            range1.setEndPoint("EndToEnd", range2);
                            range1.select();
                        } catch(e) { }

                        tempText.parentNode.removeChild(span1);
                        tempText.parentNode.removeChild(span2);
                    } else {
                        editor._removeAllRanges(sel);
                        range.setStart(tempText, 0);
                        range.setEnd(tempText, 0);
                        editor._selectRange(sel, range);
                    }
                }
            } else
                if(Sys.Extended.UI.HtmlEditor.isIE && ev.keyCode >= 33 && ev.keyCode <= 40 && !ev.shiftKey) {
                    var after_pos = (ev.keyCode == Sys.UI.Key.pageDown || ev.keyCode == Sys.UI.Key.end || ev.keyCode == Sys.UI.Key.right || ev.keyCode == Sys.UI.Key.down);

                    setTimeout(function() {
                        var sel = editor._getSelection(),
                            range = editor._createRange(sel);

                        if(sel.type.toLowerCase() == "control") {
                            var el = range.item(0);

                            if(!el.contentEditable || el.contentEditable == "false") {
                                range.remove(0);
                                sel.empty();
                                range = editor._createRange(sel);
                                var span = editor._doc.createElement("SPAN");
                                span.appendChild(editor._doc.createTextNode(""));

                                if(after_pos) {
                                    if(el.nextSibling == null)
                                        el.parentNode.appendChild(span);
                                    else
                                        el.parentNode.insertBefore(span, el.nextSibling);
                                } else {
                                    el.parentNode.insertBefore(span, el);
                                }

                                range.moveToElementText(span);
                                range.select();

                                setTimeout(function() {
                                    editor.focusEditor();
                                    span.parentNode.removeChild(span);
                                }, 0);
                            }
                        }
                    }, 0);
                } else
                    if(((keyEvent && !Sys.Extended.UI.HtmlEditor.isSafari) || (Sys.Extended.UI.HtmlEditor.isSafari && ev.type == "keydown")) && ev.ctrlKey && !ev.altKey) {
                        editor._a_prize = false;

                        var sel = null,
                            range = null,
                            key = String.fromCharCode((Sys.Extended.UI.HtmlEditor.isIE || Sys.Extended.UI.HtmlEditor.isOpera || Sys.Extended.UI.HtmlEditor.isSafari) ? ev.keyCode : ev.charCode).toLowerCase(),
                            cmd = null,
                            value = null;

                        if((Sys.Extended.UI.HtmlEditor.isIE || Sys.Extended.UI.HtmlEditor.isSafari) && ev.keyCode == 17) { // Ctrl
                            return false;
                        } else
                            if(!Sys.Extended.UI.HtmlEditor.isIE && ev.keyCode == Sys.UI.Key.end && !ev.shiftKey) {
                                editor._setToEnd();
                            } else
                                if(ev.keyCode == 46 && this.isShadowed()) {
                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                    return false;
                                } else
                                    if(ev.keyCode == 46 || ev.keyCode == Sys.UI.Key.backspace) {
                                        if((Sys.Extended.UI.HtmlEditor.isIE && ev.type == "keydown") || (!Sys.Extended.UI.HtmlEditor.isIE && ev.type == "keypress"))
                                            this._saveContent();
                                    } else {
                                        switch(key) {
                                            case "a":
                                                if(!Sys.Extended.UI.HtmlEditor.isIE) {
                                                    // KEY select all
                                                    sel = this._getSelection();
                                                    this._removeAllRanges(sel);
                                                    range = this._createRange();
                                                    range.selectNodeContents(this._doc.body);
                                                    this._selectRange(sel, range);
                                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                    return false;
                                                } else {
                                                    editor._a_prize = true;
                                                }

                                                break;
                                            case "z":
                                                this.undo();
                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                return false;
                                            case "p":
                                                if(!Sys.Extended.UI.HtmlEditor.isIE) {
                                                    setTimeout(function() {
                                                        editor._contextMenuCallP();
                                                    }, 0);

                                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                    return false;
                                                }

                                                break;
                                            case "y":
                                                this.redo();
                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                return false;
                                                break;
                                            case "x":
                                                if(this.isShadowed()) {
                                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                    return false;
                                                }

                                                this._saveContent();
                                                if(Sys.Extended.UI.HtmlEditor.isIE) {
                                                    if(ev.type == "keydown") {
                                                        editor.openWait();

                                                        setTimeout(function() {
                                                            editor._copyCut(key, false);
                                                            editor.closeWait();
                                                        }, 0);

                                                        Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                        return false;
                                                    }
                                                }
                                                break;
                                            case "c":
                                                if(this.isShadowed()) {
                                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                    return false;
                                                }

                                                if(Sys.Extended.UI.HtmlEditor.isIE) {
                                                    if(ev.type == "keydown") {
                                                        editor.openWait();

                                                        setTimeout(function() {
                                                            editor._copyCut(key, false);
                                                            editor.closeWait();
                                                            setTimeout(function() {
                                                                editor._ifShadow();
                                                            }, 0);
                                                        }, 0);

                                                        Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                        return false;
                                                    }
                                                }
                                                break;
                                            case "v":
                                                if(this.isShadowed()) {
                                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                    return false;
                                                }

                                                // This was added on 5 Feb 2009 : "Let's paste it as it is" in IE
                                                // Not a good idea, but in this case some Word's markup will not be lost
                                                if(Sys.Extended.UI.HtmlEditor.isIE) {
                                                    this._saveContent();

                                                    return true;
                                                }

                                                this._commonPaste(ev);
                                                break;
                                                // simple key commands follow                                                                  
                                            case "b": // KEY bold
                                                this._execCommand("bold", false, value);
                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                return false;
                                            case "i": // KEY italic
                                                this._execCommand("italic", false, value);
                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                return false;
                                            case "u": // KEY underline
                                                this._execCommand("underline", false, value);
                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                return false;
                                            case "s": // KEY strike through
                                                this._execCommand("strikethrough", false, value);
                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                return false;
                                            case "l": // KEY justify left
                                                cmd = "justifyleft";
                                                break;
                                            case "e": // KEY justify center
                                                cmd = "justifycenter";
                                                break;
                                            case "r": // KEY justify right
                                                cmd = "justifyright";
                                                break;
                                            case "j": // KEY justify full
                                                cmd = "justifyfull";
                                                break;
                                            case "q": // test KEY
                                                alert(this._doc.body.innerHTML);
                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                return false;
                                                break;
                                            case "0": // test KEY
                                                var str1 = "Your browser:\n\n" + navigator.userAgent;
                                                alert(str1);
                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                return false;
                                                break;
                                            case "9":
                                                if(!Sys.Extended.UI.HtmlEditor.isIE) {
                                                    var sel = editor._getSelection(),
                                                        range = editor._createRange(sel),
                                                        p1 = range.startContainer,
                                                        p2 = range.endContainer,
                                                        Str = "";

                                                    Str += "startContainer: " + (p1.nodeType == 1 ? p1.tagName : "text") + "\n";
                                                    Str += "endContainer  : " + (p2.nodeType == 1 ? p2.tagName : "text") + "\n";

                                                    if(p1 == p2) {
                                                        Str += "startOffset: " + range.startOffset + "\n";
                                                        Str += "endOffset  : " + range.endOffset + "\n";

                                                        if(p1.nodeType == 1) {
                                                            p1 = p1.childNodes.item(range.startOffset);

                                                            if(p1 && p1.nodeType) {
                                                                Str += "startOffset node: " + (p1.nodeType == 1 ? p1.tagName : "text") + "\n";

                                                                if(range.startOffset != range.endOffset) {
                                                                    p1 = p2.childNodes.item(range.endOffset);

                                                                    if(p1 && p1.nodeType)
                                                                        Str += "endOffset node: " + (p1.nodeType == 1 ? p1.tagName : "text") + "\n";
                                                                }
                                                            } else {
                                                                Str += p1;
                                                            }
                                                        }
                                                    }
                                                    alert(Str);
                                                } else {
                                                    var sel = editor._getSelection(),
                                                        range = editor._createRange(sel);

                                                    alert("boundingLeft: " + range.boundingLeft + " boundingTop: " + range.boundingTop + "\n" + "boundingWidth: " + range.boundingWidth + " boundingHeight: " + range.boundingHeight);
                                                }

                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                return false;
                                                break;
                                        }
                                    }
                        if(cmd) {
                            // execute simple command
                            this._execCommand(cmd, false, value);
                            if(cmd == "formatblock" && !Sys.Extended.UI.HtmlEditor.isIE) {
                                this._saveContent();
                                this._undo(false);
                            }

                            Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                            if(cmd == "delete" || cmd == "paste")
                                this._clearP();
                        }
                    } else
                        if(keyEvent || ((Sys.Extended.UI.HtmlEditor.isSafari || Sys.Extended.UI.HtmlEditor.isOpera) && ev.type == "keydown")) {
                            // other keys here
                            if(Sys.Extended.UI.HtmlEditor.isIE && this._tryForward) {
                                var range = this._createRange(this._getSelection());
                                range.select();
                                this._tryForward = false;
                            }

                            var key = String.fromCharCode(Sys.Extended.UI.HtmlEditor.isIE ? ev.keyCode : ev.charCode).toLowerCase();
                            if(editor._a_prize) {
                                editor._a_prize = false;

                                function test_a() {
                                    var r = editor._createRange(editor._getSelection()),
                                        parent = r.parentElement();

                                    if(parent && parent.nodeType == 1 && parent.tagName.toUpperCase() == "P") {
                                        while(parent.firstChild)
                                            parent.parentNode.insertBefore(parent.firstChild, parent);

                                        parent.parentNode.removeChild(parent);
                                    }
                                }
                                // wait for the IE stops operating this event
                                setTimeout(test_a, 0);
                            }

                            if(this.isShadowed()) {
                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                return false;
                            }

                            switch(ev.keyCode) {
                                case Sys.UI.Key.tab:
                                    if((Sys.Extended.UI.HtmlEditor.isSafari || Sys.Extended.UI.HtmlEditor.isOpera) && ev.type != "keydown")
                                        break;

                                    if(!this._editPanel.get_suppressTabInDesignMode()) {
                                        if(!this.isControl())
                                            this.insertHTML("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

                                        Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                    } else {
                                        if(Sys.Extended.UI.HtmlEditor.isSafari) {
                                            Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                        }

                                        Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel = null;
                                        return true;
                                    }
                                    break;
                                case 46: case Sys.UI.Key.backspace:
                                    if((Sys.Extended.UI.HtmlEditor.isSafari || Sys.Extended.UI.HtmlEditor.isOpera) && ev.type != "keydown")
                                        break;

                                    if(((Sys.Extended.UI.HtmlEditor.isIE || Sys.Extended.UI.HtmlEditor.isSafari) && ev.type == "keydown") || (!Sys.Extended.UI.HtmlEditor.isIE && ev.type == "keypress"))
                                        this._saveContent();

                                    if(!Sys.Extended.UI.HtmlEditor.isIE) {
                                        var range = this._createRange(this._getSelection()),
                                            p1 = range.startContainer,
                                            p2 = range.endContainer;

                                        if(ev.type == "keypress")
                                            if(Sys.Extended.UI.HtmlEditor.contentEditable(p1) != null || Sys.Extended.UI.HtmlEditor.contentEditable(p2) != null) {
                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                return false;
                                            }

                                        // inside TD
                                        if(p1 == p2 && p1.nodeType == 1 && p1.tagName.toUpperCase() == "TD" && range.startOffset == range.startOffset && p1.childNodes.item(range.startOffset) && p1.childNodes.item(range.startOffset).tagName && p1.childNodes.item(range.startOffset).tagName.toUpperCase() == "BR") {
                                            var span = p1.childNodes.item(range.startOffset),
                                                left = 0, right = 0,
                                                nb;

                                            nb = span.previousSibling;
                                            while(nb) {
                                                left++;
                                                nb = nb.previousSibling;
                                            }

                                            nb = span.nextSibling;
                                            while(nb) {
                                                right++;
                                                nb = nb.nextSibling;
                                            }

                                            if((ev.keyCode == 46 && right == 0) || (ev.keyCode == Sys.UI.Key.backspace && left == 0)) {
                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                return false;
                                            } else {
                                                if(ev.keyCode == 46 && p1.firstChild == p1.lastChild && p1.firstChild.nodeType == 1) {
                                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                    return false;
                                                }
                                            }
                                        }

                                        // inside TEXTNODE
                                        if(p1 == p2 && p1.nodeType == 3 && range.startOffset == range.endOffset && !Sys.Extended.UI.HtmlEditor.isOpera) {
                                            var data = p1.data + "";

                                            if(ev.keyCode == 46) {
                                                if(range.startOffset == data.length && !(p1.nextSibling && p1.nextSibling.nodeType == 3)) {
                                                    if(p1.nextSibling) {
                                                        p1.parentNode.removeChild(p1.nextSibling);
                                                        editor.onContentChanged();
                                                    }

                                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                    return false;
                                                }
                                            }

                                            if(ev.keyCode == Sys.UI.Key.backspace)
                                                if(range.startOffset == 0 && !(p1.previousSibling && p1.previousSibling.nodeType == 3)) {
                                                    if(p1.previousSibling) {
                                                        p1.parentNode.removeChild(p1.previousSibling);
                                                        editor.onContentChanged();
                                                    }

                                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                    return false;
                                                }
                                        }

                                        if(ev.keyCode == Sys.UI.Key.backspace && p1.nodeType == 1 && p1 == p2 && range.startOffset == range.endOffset) {
                                            var mel = p1.childNodes.item(range.startOffset);

                                            if(mel != null && mel.nodeType == 1 && mel.tagName.toUpperCase() == "BR") {
                                                mel = mel.previousSibling;

                                                if(mel != null && mel.nodeType != 3) {
                                                    mel.parentNode.removeChild(mel);
                                                    editor.onContentChanged();
                                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                    return false;
                                                }
                                            }
                                        }

                                        setTimeout(function() {
                                            var sel = editor._getSelection(),
                                                range = editor._createRange(sel),
                                                p1 = range.startContainer,
                                                p2 = range.endContainer;

                                            if(Sys.Extended.UI.HtmlEditor.contentEditable(p1) != null || Sys.Extended.UI.HtmlEditor.contentEditable(p2) != null) {
                                                editor._undo(false);
                                                return;
                                            }

                                            if(Sys.Extended.UI.HtmlEditor.isOpera && p1 == p2 && p1.nodeType == 3 && (p1.data).length == 0) {
                                                p1.parentNode.removeChild(p1);
                                            } else
                                                if(p1 == p2 && p1.nodeType == 1 && Sys.Extended.UI.HtmlEditor.isStyleTag(p1.tagName) && range.startOffset == range.endOffset && p1.childNodes.length == 0) {
                                                    while(p1.parentNode.nodeType == 1 && Sys.Extended.UI.HtmlEditor.isStyleTag(p1.parentNode.tagName) && p1.parentNode.childNodes.length == 1)
                                                        p1 = p1.parentNode;

                                                    var next = p1.nextSibling,
                                                        prev = p1.previousSibling,
                                                        parent = p1.parentNode;

                                                    parent.removeChild(p1);
                                                    editor.onContentChanged();

                                                    if(next == null && prev == null) {
                                                        range.setStart(parent, 0);
                                                        range.setEnd(parent, 0);
                                                    } else
                                                        if(next != null && prev != null) {
                                                            if(next.nodeType == 3 && prev.nodeType == 3) {
                                                                var l = ("" + prev.data + "").length;

                                                                prev.appendData(next.data);
                                                                parent.removeChild(next);
                                                                range.setStart(prev, l);
                                                                range.setEnd(prev, l);
                                                            } else {
                                                                if(prev.nodeType == 3) {
                                                                    var l = ("" + prev.data + "").length;
                                                                    range.setStart(prev, l);
                                                                    range.setEnd(prev, l);
                                                                } else {
                                                                    if(next.nodeType == 3) {
                                                                        range.setStart(next, 0);
                                                                        range.setEnd(next, 0);
                                                                    } else {
                                                                        if(next.childNodes.length > 0) {
                                                                            range.setStart(next, 0);
                                                                            range.setEnd(next, 0);
                                                                        } else {
                                                                            var l = Sys.Extended.UI.HtmlEditor.__getIndex(next);
                                                                            range.setStart(parent, l);
                                                                            range.setEnd(parent, l);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        } else {
                                                            if(prev != null) {
                                                                if(prev.nodeType == 3) {
                                                                    var l = ("" + prev.data + "").length;

                                                                    range.setStart(prev, l);
                                                                    range.setEnd(prev, l);
                                                                } else {
                                                                    var l = prev.childNodes.length;

                                                                    if(l > 0) {
                                                                        range.setStart(prev, l);
                                                                        range.setEnd(prev, l);
                                                                    } else {
                                                                        l = Sys.Extended.UI.HtmlEditor.__getIndex(prev);
                                                                        range.setStart(parent, l);
                                                                        range.setEnd(parent, l);
                                                                    }
                                                                }
                                                            } else {
                                                                if(next != null) {
                                                                    if(next.nodeType == 3) {
                                                                        range.setStart(next, 0);
                                                                        range.setEnd(next, 0);
                                                                    } else {
                                                                        var l = next.childNodes.length;

                                                                        if(l > 0) {
                                                                            range.setStart(next, l);
                                                                            range.setEnd(next, l);
                                                                        } else {
                                                                            l = Sys.Extended.UI.HtmlEditor.__getIndex(next);
                                                                            range.setStart(parent, l);
                                                                            range.setEnd(parent, l);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }

                                                    editor._removeAllRanges(sel);
                                                    editor._selectRange(sel, range);
                                                }
                                        }, 0);
                                    } else { // IE
                                        var sel = editor._getSelection();

                                        if(sel.type.toLowerCase() == "control") {
                                            if(ev.keyCode == 8) {
                                                setTimeout(function() {
                                                    editor._ifShadow();
                                                    editor.onContentChanged();
                                                }, 0);

                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                return;
                                            }

                                            var r = editor._createRange(sel),
                                                eln = r.item(0);

                                            if(eln.tagName.toUpperCase() == "EMBED") {
                                                eln.src = "";
                                                eln.parentNode.removeChild(eln);

                                                while(r.length > 0)
                                                    r.remove(0);

                                                try {
                                                    r.collapse(false);
                                                } catch(e) { }

                                                Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                                editor._saveContent();

                                                setTimeout(function() {
                                                    editor._undo(false);
                                                    editor.onContentChanged();
                                                }, 0);

                                                return;
                                            }
                                        }

                                        var tempCollectionLength = editor._doc.body.getElementsByTagName("EMBED").length;
                                        if(tempCollectionLength > 0) {
                                            var popup = editor._body.ownerDocument.createElement("div");
                                            editor._body.appendChild(popup);
                                            var evKeyCode = ev.keyCode;

                                            setTimeout(function() {
                                                editor._body.removeChild(popup);
                                                var tempCollectionNew = editor._doc.body.getElementsByTagName("EMBED");

                                                if(tempCollectionLength != tempCollectionNew.length) {
                                                    editor._saveContent();

                                                    setTimeout(function() {
                                                        editor._undo(false);
                                                        editor.onContentChanged();
                                                    }, 0);
                                                }
                                            }, 0);
                                        }

                                        setTimeout(function() {
                                            editor._clearP();
                                        }, 0);
                                    }
                                    break;
                                case Sys.UI.Key.enter:
                                    if((Sys.Extended.UI.HtmlEditor.isSafari || Sys.Extended.UI.HtmlEditor.isOpera) && ev.type == "keydown")
                                        break;

                                    if((!Sys.Extended.UI.HtmlEditor.isIE && ev.type == "keypress") || (Sys.Extended.UI.HtmlEditor.isIE && ev.type == "keydown"))
                                        this._saveContent();

                                    if(Sys.Extended.UI.HtmlEditor.isIE && ev.type == "keydown") {
                                        var sel = editor._getSelection();

                                        if(sel.type.toLowerCase() == "control")
                                            break;

                                        var r = editor._createRange(sel);
                                        if(!ev.shiftKey) {
                                            var prnt = r.parentElement();

                                            if(prnt.tagName.toUpperCase() == "TEXTAREA")
                                                break;

                                            while(prnt && prnt.tagName && prnt.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HtmlEditor.isStyleTag(prnt.tagName))
                                                prnt = prnt.parentNode;

                                            if(prnt && prnt.tagName) {
                                                var tagName = prnt.tagName.toUpperCase();

                                                if(tagName == "P" || tagName == "LI") {
                                                    if(tagName == "LI") {
                                                        function test() {
                                                            r = editor._createRange(editor._getSelection());
                                                            var parent = r.parentElement();

                                                            while(parent && parent.tagName && parent.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HtmlEditor.isStyleTag(parent.tagName))
                                                                parent = parent.parentNode;

                                                            if(parent && parent.nodeType == 1 && parent.tagName.toUpperCase() == "P") {
                                                                var span1 = editor._doc.createElement("span"),
                                                                    tempText = editor._doc.createTextNode(" "),
                                                                    inner = parent;

                                                                while(inner.firstChild != null && inner.firstChild.nodeType == 1)
                                                                    inner = inner.firstChild;

                                                                if(inner.nodeType == 1) {
                                                                    inner.appendChild(tempText);
                                                                    inner.appendChild(span1);

                                                                    while(parent.firstChild)
                                                                        parent.parentNode.insertBefore(parent.firstChild, parent);
                                                                } else {
                                                                    parent.parentNode.insertBefore(tempText, parent);
                                                                    parent.parentNode.insertBefore(span1, parent);
                                                                }

                                                                parent.parentNode.removeChild(parent);
                                                                r.moveToElementText(span1);
                                                                r.select();
                                                                span1.parentNode.removeChild(span1);
                                                                editor.onContentChanged();
                                                            }
                                                        }
                                                        setTimeout(test, 0);
                                                    }
                                                    break;
                                                }
                                            }

                                            try {
                                                var mn = Sys.Extended.UI.HtmlEditor.smartClassName + "_middle_add",
                                                    mn_element = null,
                                                    mn_span_text = "<span id=" + mn + "></span>";

                                                function testNextBlockElement() {
                                                    var sel = editor._getSelection(),
                                                        range = editor._createRange(sel);

                                                    if(mn_element != null) {
                                                        mn_element.innerHTML = "&nbsp;";
                                                        range.moveToElementText(mn_element);
                                                        range.select();
                                                        mn_element.parentNode.insertBefore(mn_element.firstChild, mn_element);
                                                        mn_element.parentNode.removeChild(mn_element);
                                                        editor.onContentChanged();
                                                    }
                                                }

                                                r.pasteHTML(mn_span_text);
                                                var needTest = false;
                                                mn_element = editor._doc.getElementById(mn);

                                                if(mn_element != null) {
                                                    var nextSibling = mn_element.nextSibling,
                                                        curPar = mn_element.parentNode;

                                                    while(nextSibling == null && curPar != null && Sys.Extended.UI.HtmlEditor.isStyleTag(curPar.tagName)) {
                                                        nextSibling = curPar.nextSibling;
                                                        curPar = curPar.parentNode;
                                                    }

                                                    if(nextSibling != null && !Sys.Extended.UI.HtmlEditor.isInlineElement(nextSibling) && nextSibling.tagName != null && typeof nextSibling.tagName != "undefined") {
                                                        var tag = nextSibling.tagName.toUpperCase();

                                                        if(tag != "BR" && tag != "UL" && tag != "OL" && tag != "P")
                                                            needTest = true;
                                                    }

                                                    mn_element.parentNode.removeChild(mn_element);
                                                }
                                                r.pasteHTML("<br/>" + (needTest ? mn_span_text : ""));

                                                if(needTest)
                                                    mn_element = editor._doc.getElementById(mn);

                                                r.select();
                                                if(needTest) {
                                                    setTimeout(testNextBlockElement, 0);
                                                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                                    return false;
                                                }
                                            } catch(ex) { }
                                        } else {
                                            break;
                                        }

                                        Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                    } else {
                                        if(!ev.shiftKey && (Sys.Extended.UI.HtmlEditor.isSafari || Sys.Extended.UI.HtmlEditor.isOpera)) {
                                            var prnt = Sys.Extended.UI.HtmlEditor.getSelParent(this);

                                            if(prnt.nodeType == 3)
                                                prnt = prnt.parentNode;

                                            while(prnt && prnt.tagName && prnt.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HtmlEditor.isStyleTag(prnt.tagName))
                                                prnt = prnt.parentNode;

                                            if(prnt && prnt.tagName && (prnt.tagName.toUpperCase() == "P" || prnt.tagName.toUpperCase() == "LI"))
                                                break;

                                            var mn_span_text = "<br />";
                                            if(Sys.Extended.UI.HtmlEditor.isOpera) {
                                                var sel = editor._getSelection(),
                                                    range = editor._createRange(sel);

                                                if(range.startContainer == range.endContainer)
                                                    if(range.startContainer.nodeType == 1) {
                                                        var firstCh = range.startContainer.childNodes.item(range.startOffset);

                                                        if(firstCh.nodeType == 1 && firstCh.tagName.toUpperCase() == "BR")
                                                            mn_span_text += "<br />";
                                                    } else if(range.startContainer.nodeType == 3 && range.startOffset == range.endOffset && (range.startContainer.data).length == range.endOffset && !(range.startContainer.nextSibling && range.startContainer.nextSibling.nodeType == 3)) {
                                                        mn_span_text += "&nbsp;";
                                                    }
                                            }

                                            this.insertHTML(mn_span_text);
                                            Sys.Extended.UI.HtmlEditor._stopEvent(ev);

                                            if(Sys.Extended.UI.HtmlEditor.isOpera) {
                                                var sel = editor._getSelection(),
                                                    range = editor._createRange(sel);

                                                if(range.startContainer == range.endContainer && range.startContainer.nodeType == 3 && range.startOffset == range.endOffset && (range.startContainer.data).length == 0) {
                                                    var nbsp = range.startContainer.previousSibling;

                                                    range.startContainer.parentNode.removeChild(range.startContainer);
                                                    editor._removeAllRanges(sel);
                                                    range = editor._createRange();
                                                    range.setStart(nbsp, 0);
                                                    range.setEnd(nbsp, 1);
                                                    editor._selectRange(sel, range);
                                                }
                                            }

                                            editor.onContentChanged();
                                        } else if(Sys.Extended.UI.HtmlEditor.isSafari) {
                                            this.insertHTML("<br/>");
                                            Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                                            editor.onContentChanged();
                                        }
                                    }
                                    break;
                            }
                        } else {
                            editor._a_prize = false;
                        }
        }

        // Struggle with bad behavior of IE when text is typing inside SPAN and when some text is selected
        if(Sys.Extended.UI.HtmlEditor.isIE && ev.type == "keypress" && !ev.ctrlKey) {
            var key = ev.keyCode,
                selT = editor._getSelection(),
                rangeT = editor._createRange(selT);

            if(rangeT.text.length > 0) {
                var chr = String.fromCharCode(key),
                    caps = Sys.Extended.UI.HtmlEditor.capLock(ev),
                    upper = (ev.shiftKey && !caps) || caps;

                if(!upper)
                    chr = chr.toLowerCase();

                var tid = Sys.Extended.UI.HtmlEditor.smartClassName + "StyleForTyping",
                    elT = editor._doc.getElementById(tid);

                if(elT != null) {
                    chr = "<span id='" + tid + "'></span>" + chr + "<span id='" + tid + tid + "'></span>";
                    elT.parentNode.removeChild(elT);
                }

                rangeT.pasteHTML(chr);
                if(elT != null) {
                    editor.trickWithStyles(tid);
                    elT = editor._doc.getElementById(tid + tid);
                    elT.parentNode.removeChild(elT);
                }

                Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                editor.onContentChanged();

                return false;
            }
        }

        if(ev.type == "mouseup" || ev.type == "mousedown" || ev.type == "keydown") {
            var need_update = true;

            if(ev.type == "keydown" && !ev.ctrlKey) {
                var key = ev.keyCode;

                if((key >= 0x30 && key <= 0x5a) || (key == 0x20) || (key == 0x0d) || (key >= 0xba && key <= 0xde) || (key >= 0x60 && key <= 0x6f)) {
                    if(editor._StyleForTyping != null) {
                        editor.n_arr = [];

                        for(var im = 0; im < editor._StyleForTyping.length; im++)
                            editor.n_arr.push(editor._StyleForTyping[im]);

                        var tid = Sys.Extended.UI.HtmlEditor.smartClassName + "StyleForTyping",
                            needItNow = true;

                        if(!Sys.Extended.UI.HtmlEditor.isIE) {
                            editor.insertHTML("<span id='" + tid + "'></span>");
                        } else {
                            editor.insertHTML("<span id='" + tid + "'>&nbsp;</span>");
                            var elT = editor._doc.getElementById(tid);

                            if(elT && elT.nextSibling && elT.nextSibling.nodeType == 3) {
                                needItNow = false;

                                var selT = editor._getSelection(),
                                    rangeT = editor._createRange(selT);

                                rangeT.moveToElementText(editor._doc.getElementById(tid));
                                rangeT.select();
                            } else {
                                if(elT)
                                    elT.removeChild(elT.firstChild);
                            }
                        }

                        if(needItNow) {
                            setTimeout(function() {
                                editor.trickWithStyles(tid);
                                editor.onContentChanged();
                            }, 0);
                        }
                    }
                }
            }

            if(need_update || !Sys.Extended.UI.HtmlEditor.isIE) {
                if(!editor._updated_now) {
                    if(editor._updateTimer) {
                        clearTimeout(editor._updateTimer);
                        editor._updateTimer = null;
                    }
                    editor._updateTimerLimit = 3;

                    function xyz() {
                        if(editor._editPanel == Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel) {
                            try {
                                if(Sys.Extended.UI.HtmlEditor.isIE) {
                                    try {
                                        var selka = editor._doc.selection;
                                    } catch(e) {
                                        return false;
                                    }

                                    if(editor._getSelection().type == "None" && editor._doc.queryCommandValue("backcolor") == 0 && editor._doc.queryCommandValue("forecolor") == 0) {
                                        editor._updateTimerLimit--;

                                        if(editor._updateTimerLimit > 0) {
                                            editor._updateTimer = setTimeout(xyz, 100); // delay for toolbars updating
                                            return;
                                        }
                                    }
                                }

                                editor._updated_now = true;
                                editor._editPanel.updateToolbar();
                                editor._updated_now = false;
                                editor._updateTimer = null;

                                if(!Sys.Extended.UI.HtmlEditor.isIE)
                                    editor.focusEditor();
                            } catch(e) { }
                        }
                    }

                    editor._updateTimer = setTimeout(xyz, 300); // delay for toolbars updating
                }
            }
        }

        if(!((!Sys.Extended.UI.HtmlEditor.isIE && (ev.type == "keydown" || ev.type == "keyup")) || (Sys.Extended.UI.HtmlEditor.isIE && (ev.type == "keydown" || ev.type == "keyup") && (ev.keyCode == 16 || ev.keyCode == 20))))
            editor._StyleForTyping = null;

        if(Sys.Extended.UI.HtmlEditor.isSafari)
            setTimeout(function() {
                editor._createRange(editor._getSelection());
            }, 0);

        if(!Sys.Extended.UI.HtmlEditor.isIE) {
            setTimeout(function() {
                if(editor._editPanel == Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel) {
                    var sel = editor._getSelection(),
                        range = editor._createRange(sel);

                    if(range.startContainer.nodeType != 3 && range.startContainer == range.endContainer)
                        if(range.startOffset == range.endOffset)
                            if(range.startContainer.childNodes.item(range.startOffset))
                                if(range.startContainer.childNodes.item(range.startOffset).nodeType == 3) {
                                    var container = range.startContainer.childNodes.item(range.startOffset);

                                    sel.collapseToEnd();
                                    editor._removeAllRanges(sel);
                                    sel = editor._getSelection();
                                    range = editor._createRange(sel);
                                    range.setStart(container, 0);
                                    range.setEnd(container, 0);
                                    editor._selectRange(sel, range);
                                }
                }
            }, 0);
        }

        if(!Sys.Extended.UI.HtmlEditor.isIE) {
            var sel = editor._getSelection(),
                range = editor._createRange(sel);

            editor._saved_startContainer = range.startContainer;
            editor._saved_startOffset = range.startOffset;
        }

        setTimeout(function() {
            try {
                if(editor._editPanel == Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel)
                    editor._ifShadow();
            } catch(e) { }
        }, 0);

        if(ev.type == "keydown") {
            if(editor._AfterOnContentChanged == null || typeof editor._AfterOnContentChanged == "undefined" || !editor._AfterOnContentChanged) {
                editor._AfterOnContentChanged = true;

                setTimeout(function() {
                    if(editor._editPanel == Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel) {
                        editor.onContentChanged();
                        editor._AfterOnContentChanged = false;
                    }
                }, 0);
            }
        }

        return true;
    } catch(ex) {
        Sys.Extended.UI.HtmlEditor._stopEvent(ev);
        return false;
    }
};