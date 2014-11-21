Type.registerNamespace("Sys.Extended.UI.HtmlEditor");

Sys.Extended.UI.HtmlEditor.DesignPanel = function(element) {
    Sys.Extended.UI.HtmlEditor.DesignPanel.initializeBase(this, [element]);

    this._doc = null;
    this._updated_now = false;
    this._updateTimer = null;
    this._popup = null;
    this._contextElement = null;
    this._a_prize = false;
    this.__stack = null;
    this._StyleForTyping = null;
    this.isWord = false;
    this.isPlainText = false;
    this.dfltBlockElement = "P";
    this._FontNotSet = true;
    this._design_timer1 = null;

    this._events$delegate = Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.DesignPanelEventHandler);
    this._blur$delegate = Function.createDelegate(this, this._blur);
    this._focus$delegate = Function.createDelegate(this, this._focus_event);
}

Sys.Extended.UI.HtmlEditor.DesignPanel.prototype = {

    initialize: function() {
        Sys.Extended.UI.HtmlEditor.DesignPanel.callBaseMethod(this, "initialize");
    },

    dispose: function() {
        Sys.Extended.UI.HtmlEditor.DesignPanel.callBaseMethod(this, "dispose");
    },

    _activate: function(value) {
        Sys.Extended.UI.HtmlEditor.DesignPanel.callBaseMethod(this, "_activate");

        this._wasFocused = false;
        this._initIframe(value);
        this._onDocumentLoaded();
    },

    _deactivate: function() {
        this._deactivateCommon();

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            this._doc.open();
            this._doc.write("");
            this._doc.close();
            this.get_element().src = "javascript:false;";
        }

        this._doc = null;
        Sys.Extended.UI.HtmlEditor.DesignPanel.callBaseMethod(this, "_deactivate");
    },

    _deactivateCommon: function() {
        this._editPanel.__blured = false;
        var aList = this._doc.body.getElementsByTagName("IMG");

        for(var i = 0; i < aList.length; i++) {
            if(aList[i].getAttribute(Sys.Extended.UI.HtmlEditor.attachedIdAttribute) && aList[i].getAttribute(Sys.Extended.UI.HtmlEditor.attachedIdAttribute).length > 0) {
                try {
                    if(Sys.Extended.UI.HtmlEditor.isIE)
                        $removeHandler(aList[i], "dragstart", Sys.Extended.UI.HtmlEditor.stopDrag);
                    else
                        $removeHandler(aList[i], "draggesture", Sys.Extended.UI.HtmlEditor.stopDrag);
                } catch(e) { }
            }
        }

        Sys.Extended.UI.HtmlEditor._removeEvents(this._doc, ["keydown", "keypress", "mousedown", "mouseup", "dblclick"], this._events$delegate);
        Sys.Extended.UI.HtmlEditor._removeEvents(this.get_element().contentWindow, ["blur"], this._blur$delegate);
        Sys.Extended.UI.HtmlEditor._removeEvents(this.get_element().contentWindow, ["focus"], this._focus$delegate);
    },

    _initIframe: function(value) {
        if(!Sys.Extended.UI.HtmlEditor.isIE) {
            this._savedValue = value;
            this._absAndFixedParents = this._getAbsAndFixedParents();
        }

        var str = Sys.Extended.UI.HtmlEditor.Trim(this._prepareContent(value));
        this._doc = this.get_element().contentWindow.document;

        if(!Sys.Extended.UI.HtmlEditor.isIE)
            this._doc.designMode = "on";

        this._doc.open();
        this._doc.write("<html><head><link rel=\"stylesheet\" href=\"" + this._editPanel.get_documentCssPath() + "\" media=\"all\" /><link rel=\"stylesheet\" href=\"" + this._editPanel.get_designPanelCssPath() + "\" media=\"all\" /></head><body>" + str + "</body></html>");
        this._doc.close();
        this._doc.id = "EditorDocument";

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            this._doc.body.contentEditable = true;
            this._tryForward = true;
        }
    },

    _blur: function(event) {
        this._editPanel.__blured = true;

        if(!Sys.Extended.UI.HtmlEditor.isIE && this._design_timer1 != null) {
            clearTimeout(this._design_timer1);
            this._design_timer1 = null;
        }

        if(!this.isPopup)
            this._editPanel._validate(event, null);

        return true;
    },

    _focus_event: function() {
        this._editPanel.__blured = false;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            this._really_focused();
        } else {
            var panel = this;
            Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel = this._editPanel;

            if(this._design_timer1 == null)
                this._design_timer1 = setTimeout(function() { panel._really_focused(); panel._design_timer1 = null; }, 0);
        }

        return true;
    },

    _getAbsAndFixedParents: function() {
        var el = this.get_element(),
            str = "";

        while(el != null && el.tagName && el.tagName.toLowerCase() != "body") {
            str += el.tagName;

            if(el.style.position == "absolute" || el.style.position == "fixed")
                str += ": " + el.style.position;

            str += "\n";
            el = el.parentNode;
        }

        return str;
    },

    _onDocumentLoaded: function() {
        var editor = this;

        if(!Sys.Extended.UI.HtmlEditor.isIE) {
            var absAndFixedParents = this._getAbsAndFixedParents();

            if(absAndFixedParents != this._absAndFixedParents) {
                this._initIframe(this._savedValue);
                setTimeout(function() {
                    editor._onDocumentLoaded()
                }, 10);

                return;
            }
        }

        try {
            if(!Sys.Extended.UI.HtmlEditor.isIE) {
                this._doc.queryCommandValue("forecolor");

                if(Sys.Extended.UI.HtmlEditor.isSafari || Sys.Extended.UI.HtmlEditor.isOpera)
                    if(!Sys.Extended.UI.HtmlEditor.isReallyVisible(this.get_element())) {
                        setTimeout(function() {
                            editor._onDocumentLoaded()
                        }, 10);

                        return;
                    }
            }
            var temp = editor._doc.body.innerHTML;
        } catch(e) {
            setTimeout(function() {
                editor._onDocumentLoaded()
            }, 10); // waiting for loading

            return;
        }

        this._afterBodyIsFormed();

        setTimeout(function() {
            editor._activateFinished();
            if(Sys.Extended.UI.HtmlEditor.isIE && !editor._editPanel.get_autofocus())
                editor._getSelection().empty();
        }, 0);
    },

    _afterBodyIsFormed: function() {
        var editor = this;

        Sys.Extended.UI.HtmlEditor._addEvents(this._doc, ["keydown", "keypress", "mousedown", "mouseup", "dblclick"], this._events$delegate);
        Sys.Extended.UI.HtmlEditor._addEvents(this.get_element().contentWindow, ["blur"], this._blur$delegate);
        Sys.Extended.UI.HtmlEditor._addEvents(this.get_element().contentWindow, ["focus"], this._focus$delegate);

        Sys.Extended.UI.HtmlEditor.inspectForShadows(editor._doc.body);

        var body = this._doc.body;

        if(body.childNodes.length == 1 && body.firstChild.tagName && body.firstChild.tagName.toUpperCase() == "DIV" &&
                body.firstChild.style.cssText.length > 0 && body.firstChild.style.direction.length > 0 &&
                Sys.Extended.UI.HtmlEditor.getStyle(body.firstChild, "position") != "absolute") {

            body.style.cssText = body.firstChild.style.cssText;
            var temp = body.firstChild;

            while(temp.firstChild)
                body.insertBefore(temp.firstChild, temp);

            body.removeChild(temp);
        }

        editor._clearP();
    },

    _getContent: function() {
        if(this._popup != null)
            if(typeof this._popup._forceImClose == "function") {
                var func = this._popup._forceImClose;
                func(this._popup._iframe.contentWindow);
            }

        this._clearP();
        var temp;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            Sys.Extended.UI.HtmlEditor.spanJoiner(this._doc.body, this._doc);
            temp = Sys.Extended.UI.HtmlEditor.getHTML(this._doc.body, false, true);

            temp = temp.replace(/(<td[^>]*?>)([\s ]*?)(<\/td[^>]*?>)/ig, "$1&nbsp;$3")
                .replace(/(<td[^>]*?>)\s*(&nbsp;)\s*(<\/td[^>]*?>)/ig, "$1<br/>$3")
                .replace(/(<p[^>]*?>)\s*(&nbsp;)\s*(<\/p[^>]*?>)/ig, "$1<br/>$3");
            temp = ((this._doc.body.style.cssText.length > 0) ? "<div style=\"" + this._doc.body.style.cssText.replace("\"", "'") + "\">" : "") + temp + ((this._doc.body.style.cssText.length > 0) ? "</div>" : "");

            if(this._editPanel.get_noScript())
                temp = temp.replace(/(<script(?:[^>]*?)>(?:[^<]*?)<\/script(?:[^>]*?)>)/gi, "");

            if(/<embed/ig.test(temp)) {
                temp = temp.replace(/(<embed(?:.*?))(\sloop=\"true\")((?:.*?)>)/ig, "$1$3")
                    .replace(/(<embed(?:.*?))(\splay=\"true\")((?:.*?)>)/ig, "$1$3")
                    .replace(/(<embed(?:.*?))(\sbgcolor=\"\")((?:.*?)>)/ig, "$1$3")
                    .replace(/(<embed(?:.*?))(\sscale=\"\")((?:.*?)>)/ig, "$1$3")
                    .replace(/(<embed(?:.*?))(\shspace=\"0\")((?:.*?)>)/ig, "$1$3")
                    .replace(/(<embed(?:.*?))(\svspace=\"0\")((?:.*?)>)/ig, "$1$3")
                    .replace(/(<embed(?:.*?))(\swmode=\"[^\"]+\")((?:.*?)>)/ig, "$1$3")
                    .replace(/(<embed(?:.*?))(pseudomode=)(\"[^\"]*\")((?:.*?)>)/ig, "$1wmode=$3$4")
                    .replace(/(<embed(?:.*?))(\swmode=\"\")((?:.*?)>)/ig, "$1$3");
            }

            var nnreg = new RegExp("(<[/]?)(teo" + Sys.Extended.UI.HtmlEditor.smartClassName + ":)", "ig");
            temp = temp.replace(nnreg, "$1");
        } else {
            var trg = this._doc.createElement("DIV"),
                scriptRecover = new Sys.Extended.UI.HtmlEditor.DesignPanel.ScriptRecover();

            trg.style.cssText = this._doc.body.style.cssText;
            if(!this._editPanel.get_noScript())
                this._doc.body.innerHTML.replace(/<script(?:[^>]*?)>(.*?)<\/script(?:[^>]*?>)/gi, function(p0, p1) { return scriptRecover.regReplScript1(p0, p1); });

            trg.innerHTML = Sys.Extended.UI.HtmlEditor.Trim(this._doc.body.innerHTML);

            var tempCollection = trg.getElementsByTagName("IMG"),
                imgCollection = [];

            for(var i = 0; i < tempCollection.length; i++)
                imgCollection.push(tempCollection[i]);

            for(var j = 0; j < imgCollection.length; j++) {
                var img = imgCollection[j],
                    attr;

                attr = img.getAttribute("dummytag");
                if(attr && attr.length > 0 && attr.toLowerCase() == "embed") {
                    var src = img.getAttribute("dummysrc"),
                        bgcolor = img.getAttribute("dummybgcolor"),
                        wmode = img.getAttribute("pseudomode"),
                        attrs = img.attributes,
                        embed = this._doc.createElement("EMBED");

                    embed.src = src;
                    embed.width = img.width;
                    embed.height = img.height;

                    if(bgcolor && bgcolor.length > 0) {
                        bgcolor = Sys.Extended.UI.HtmlEditor.tryReplaceRgb(bgcolor);
                        embed.setAttribute("bgcolor", bgcolor);
                    }

                    if(wmode && wmode.length > 0)
                        embed.setAttribute("wmode", wmode);

                    for(var i = 0; i < attrs.length; ++i) {
                        var a = attrs.item(i);

                        if(!a.specified)
                            continue;

                        var name = a.name.toLowerCase(),
                            value = a.value;

                        if(name == "dummytag" || name == "dummysrc" ||
                           name == "dummybgcolor" || name == "style" ||
                           name == "wmode" || name == "pseudomode" ||
                           name == "src")
                            continue;

                        if(name == "loop" && value == "true") continue;
                        if(name == "play" && value == "true") continue;
                        if(name == "hspace" && value == "0") continue;
                        if(name == "vspace" && value == "0") continue;
                        if(name == "scale" && value.length == 0) continue;
                        if(name == "align" && value.length == 0) continue;

                        embed.setAttribute(name, value);
                    }

                    if(img.style.width && img.style.width.length > 0)
                        embed.style.width = img.style.width;
                    if(img.style.height && img.style.height.length > 0)
                        embed.style.height = img.style.height;

                    img.parentNode.insertBefore(embed, img);
                    img.parentNode.removeChild(img);
                }
            }

            Sys.Extended.UI.HtmlEditor.spanJoiner(trg, this._doc);

            temp = Sys.Extended.UI.HtmlEditor.getHTML(trg, (trg.style.cssText.length > 0) ? true : false, true);
            if(!this._editPanel.get_noScript())
                temp = temp.replace(/(<script(?:[^>]*?)>)(.*?)(<\/script(?:[^>]*?)>)/gi, function(p0, p1, p2, p3) { return scriptRecover.regReplFromScript1(p0, p1, p2, p3); });
            else
                temp = temp.replace(/(<script(?:[^>]*?)>(?:[^<]*?)<\/script(?:[^>]*?)>)/gi, "");

            delete trg;
        }

        temp = Sys.Extended.UI.HtmlEditor.brXHTML(temp.replace(/^([\n|\r]+)/, ""));
        if(this._editPanel.get_noUnicode())
            temp = temp.replace(/([\u0080-\uFFFF])/g, function(p0, p1) { return "&#" + p1.charCodeAt(0).toString(10) + ";"; });

        if(Sys.Extended.UI.HtmlEditor.Trim(temp) == "<br />")
            temp = "";

        return temp;
    },

    _setContent: function(value) {
        this._deactivateCommon();
        var str = Sys.Extended.UI.HtmlEditor.Trim(this._prepareContent(value));

        this._doc.open();
        this._doc.write("<html><head><link rel=\"stylesheet\" href=\"" + this._editPanel.get_documentCssPath() + "\" media=\"all\" /><link rel=\"stylesheet\" href=\"" + this._editPanel.get_designPanelCssPath() + "\" media=\"all\" /></head><body>" + str + "</body></html>");
        this._doc.close();

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            this._doc.body.contentEditable = true;
            this._tryForward = true;
        }

        this._afterBodyIsFormed();
        if(this._editPanel.get_autofocus())
            this._focus();

        if(Sys.Extended.UI.HtmlEditor.isIE && !this._editPanel.get_autofocus())
            this._getSelection().empty();
    },

    _focus: function(prize) {
        this.focusEditor();
        this._focused(prize);
    },

    focusEditor: function() {
        try {
            this.get_element().contentWindow.focus();
        } catch(e) { }

        if(!this._wasFocused) {
            this._wasFocused = true;

            if(!this._editPanel.get_startEnd())
                this._setToEnd();
        }
    },

    _prepareContent: function(value) {
        var temptext = value;

        temptext = temptext.replace(/<object(?:[^>]*?)>(?:[^\u0000]*?)(<embed(?:[^>]*?)>)(?:[^\u0000]*?)<\/object(?:[^>]*?)>/gi, "$1");

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            temptext = Sys.Extended.UI.HtmlEditor.Trim(temptext.replace(/([\n\r]+<)/g, "<").replace(/([^>])([\n\r]+)([^<])/g, "$1 $3"))
                .replace(/(&amp;)/g, "&amp;amp;")
                .replace(/<br\s*[\/]*>\s*<\/td>/ig, "</td>")
                .replace(/(<td[^>]*?>)([\s ]*?)(<\/td[^>]*?>)/ig, "$1&nbsp;$3")
                .replace(/(<p[^>]*?>)\s*(<br[^>]*?>)\s*(<\/p[^>]*?>)/ig, "$1&nbsp;$3");

            if(/<embed/ig.test(temptext))
                temptext = temptext.replace(/(<embed(?:.*?))(wmode=)(\"[^\"]*\")((?:.*?)>)/ig, "$1pseudomode=$3$4")
                    .replace(/(<embed)([^>]*?>)/ig, "$1 wmode=\"transparent\"$2");

            temptext = temptext.replace(/&amp;/ig, "&");

            return temptext;
        } else {
            var scriptRecover = new Sys.Extended.UI.HtmlEditor.DesignPanel.ScriptRecover(),
                src = document.createElement("DIV");

            if(!this._editPanel.get_noScript())
                temptext.replace(/<script(?:[^>]*?)>(.*?)<\/script(?:[^>]*?>)/gi, function(p0, p1) { return scriptRecover.regReplScript1(p0, p1); });

            src.innerHTML = Sys.Extended.UI.HtmlEditor.Trim(temptext.replace(/([^>])([\n\r]+)([^<])/g, "$1 $3"));

            var tempCollection = src.getElementsByTagName("EMBED"),
                embedCollection = [];

            for(var i = 0; i < tempCollection.length; i++)
                embedCollection.push(tempCollection[i]);

            for(var j = 0; j < embedCollection.length; j++) {
                var embed = embedCollection[j],
                    img = document.createElement("IMG"),
                    attrs = embed.attributes;

                img.src = this._editPanel.get_imagePath_1x1();
                img.setAttribute("dummytag", "embed");

                for(var i = 0; i < attrs.length; ++i) {
                    var a = attrs.item(i);
                    if(!a.specified)
                        continue;

                    var name = a.name.toLowerCase(),
                        value = a.value;

                    if(name == "src")
                        name = "dummysrc";
                    else
                        if(name == "bgcolor")
                            name = "dummybgcolor";
                        else
                            if(name == "wmode")
                                name = "pseudomode";

                    img.setAttribute(name, value);
                }

                img.style.cssText = "border: 1px dotted #000000; background-image: url('" + (img.getAttribute("type").toLowerCase() == "application/x-mplayer2" ? this._editPanel.get_imagePath_media() : tthis._editPanel.get_imagePath_flash()) + "'); background-position: center; background-repeat: no-repeat; background-color: #c0c0c0;";

                if(embed.style.width && embed.style.width.length > 0)
                    img.style.width = embed.style.width;
                if(embed.style.height && embed.style.height.length > 0)
                    img.style.height = embed.style.height;

                embed.parentNode.insertBefore(img, embed);
                embed.parentNode.removeChild(embed);
            }

            Sys.Extended.UI.HtmlEditor.spanJoiner(src, document);

            temptext = Sys.Extended.UI.HtmlEditor.Trim(Sys.Extended.UI.HtmlEditor.getHTML(src, false, true));
            if(!this._editPanel.get_noScript())
                temptext = temptext.replace(/(<script(?:[^>]*?)>)(.*?)(<\/script(?:[^>]*?)>)/gi, function(p0, p1, p2, p3) { return scriptRecover.regReplFromScript1(p0, p1, p2, p3); });

            delete src;
            delete scriptRecover;
            temptext = Sys.Extended.UI.HtmlEditor.brXHTML(temptext);

            if(temptext.length == 0)
                temptext = "<br/>";

            return temptext;
        }
    },

    _clearP: function() {
        try {
            var el = this._doc.body;

            if(el.firstChild)
                if(el.firstChild.nodeType == 3) {
                    var str = Sys.Extended.UI.HtmlEditor.Trim("" + el.firstChild.data + "");

                    if(str.length == 0)
                        el.removeChild(el.firstChild);
                    else
                        if(str != ("" + el.firstChild.data + ""))
                            el.firstChild.data = str;
                }

            if(Sys.Extended.UI.HtmlEditor.isIE) {
                if(el.childNodes.length == 1) {
                    el = el.firstChild;

                    if(el.nodeType == 1) {
                        var elTagName = el.tagName.toLowerCase();

                        if(elTagName == "p" || elTagName == "ul" || elTagName == "ol") {
                            var needDel = false,
                                list = (elTagName == "ul" || elTagName == "ol");

                            function checkInner(elem) {
                                var ret = false;

                                if(elem.nodeType == 1) {
                                    var tagName = elem.tagName.toUpperCase();

                                    if(!(list && tagName == "LI"))
                                        if(Sys.Extended.UI.HtmlEditor.isRestricted(elem) || tagName == "IMG" || tagName == "IFRAME" || tagName == "EMBED" || tagName == "SCRIPT")
                                            return true;

                                    if(elem.childNodes.length > 1)
                                        return true;
                                    if(elem.childNodes.length == 0)
                                        return false;

                                    ret |= checkInner(elem.firstChild);
                                } else {
                                    if(elem.nodeType == 3)
                                        ret |= true;
                                }

                                return ret;
                            }

                            if(el.childNodes.length == 1)
                                if(!checkInner(el.firstChild))
                                    el.removeChild(el.firstChild); needDel = true;

                            if(needDel || el.parentNode.innerHTML.toLowerCase() == "<p>&nbsp;</p>")
                                this._doc.body.removeChild(el);
                        }
                    }
                }
            }
        } catch(e) { }
    },

    isControl: function() {
        try {
            var sel = this._getSelection();

            if(Sys.Extended.UI.HtmlEditor.isIE) {
                if(sel.type.toLowerCase() == "control")
                    return true;
                else
                    return false;
            } else {
                var range = this._createRange(sel),
                    parent = this._getParent(range);

                if(parent.nodeType != 3 && range.startContainer == range.endContainer) {
                    if(!parent.tagName)
                        return false;

                    if(range.startContainer.childNodes.item(range.startOffset) == null)
                        return false;

                    if(range.startOffset == range.endOffset &&
                        range.startContainer.childNodes.item(range.startOffset).tagName &&
                        (range.startContainer.childNodes.item(range.startOffset).tagName.toUpperCase() == "BR" ||
                        Sys.Extended.UI.HtmlEditor.isStyleTag(range.startContainer.childNodes.item(range.startOffset).tagName)))
                        return false;

                    if(parent.tagName.toUpperCase() == "BODY" && range.startOffset == 0 &&
                    range.endOffset > 0 && range.endOffset == parent.childNodes.length)
                        return false;

                    if(range.startOffset == range.endOffset && range.startContainer.childNodes.item(range.startOffset).nodeType == 3)
                        return false;

                    return true;
                }
                else {
                    return false;
                }
            }
        } catch(e) {
            return true;
        }
    },

    isPopup: function() {
        return (this._popup != null);
    },

    _getSelection: function() {
        if(Sys.Extended.UI.HtmlEditor.isIE) {
            var sel = this._doc.selection;

            return sel;
        } else {
            this.focusEditor();

            var sel,
                range,
                el,
                contentWindow = this.get_element().contentWindow;

            sel = contentWindow.getSelection();
            range = this._createRange(sel);
            el = range.startContainer;

            try {
                while(el && el.nodeType)
                    el = el.parentNode;
            } catch(e) {
                this._removeAllRanges(sel);
                range = this._createRange(sel);
                range.setStart(this._saved_startContainer, this._saved_startOffset);
                range.setEnd(this._saved_startContainer, this._saved_startOffset);

                this._selectRange(sel, range);
                sel = contentWindow.getSelection();
            }

            return sel;
        }
    },

    _createRange: function(sel) {
        if(Sys.Extended.UI.HtmlEditor.isIE) {
            if(typeof sel == "undefined")
                return this._doc.body.createTextRange();
            else
                return sel.createRange();
        } else {
            this.focusEditor();

            if(typeof sel == "undefined") {
                return this._doc.createRange();
            } else {
                try {
                    var r = sel.getRangeAt(0);
                    return r;
                } catch(e) {
                    return this._doc.createRange();
                }
            }
        }
    },

    toEndOfProtected: function() {
        var editor = this,
            sss = this._getSelection(),
            range;

        try {
            range = this._createRange(sss);
        } catch(ex) {
            return false;
        }

        var el;
        if(!Sys.Extended.UI.HtmlEditor.isIE) {
            el = Sys.Extended.UI.HtmlEditor.contentEditable(range.startContainer);

            if(el == null)
                el = Sys.Extended.UI.HtmlEditor.contentEditable(range.endContainer);
        } else {
            el = Sys.Extended.UI.HtmlEditor.contentEditable(Sys.Extended.UI.HtmlEditor.getSelParent(editor));
        }

        if(Sys.Extended.UI.HtmlEditor.isIE && el != null) {
            try {
                range.remove(el);
            } catch(e) { }

            range = editor._doc.body.createControlRange();
            range.add(el);
            range.select();
        } else {
            if(!Sys.Extended.UI.HtmlEditor.isIE && el != null) {
                var sel = editor._getSelection(),
                    tempText;

                if(el.nextSibling != null && el.nextSibling.nodeType == 3) {
                    tempText = el.nextSibling;
                } else {
                    tempText = editor._doc.createTextNode("");

                    if(el.nextSibling != null)
                        el.parentNode.insertBefore(tempText, el.nextSibling);
                    else
                        el.parentNode.appendChild(tempText);
                }

                editor._removeAllRanges(sel);
                var range = editor._createRange(sel);

                range.setStart(tempText, 0);
                range.setEnd(tempText, 0);
                editor._selectRange(sel, range);
            }
        }

        return true;
    },

    _commonPaste: function(ev) {
        var editor = this;

        this._saveContent();

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            this.openWait();

            setTimeout(function() {
                editor._paste(!editor._editPanel.get_noPaste()); editor.closeWait();
            }, 0)
            Sys.Extended.UI.HtmlEditor._stopEvent(ev);
        }
        else {
            if(!this.isPlainText && !this.isWord && !this._editPanel.get_noPaste()) {
                setTimeout(function() {
                    Sys.Extended.UI.HtmlEditor.operateAnchors(editor, editor._doc, !editor._editPanel.get_showAnchors());
                    Sys.Extended.UI.HtmlEditor.operatePlaceHolders(editor, editor._doc, !editor._editPanel.get_showPlaceHolders());
                    Sys.Extended.UI.HtmlEditor.inspectForShadows(editor._doc.body);

                    editor._checkImages(editor._doc.body);
                    editor.onContentChanged();
                }, 0);
            } else {
                var place = editor._getSafePlace();

                if(place != null) {
                    var div = editor._doc.createElement("div");

                    div.style.display = "inline";
                    div.style.borderStyle = "none";
                    place.parentNode.insertBefore(div, place);
                    div.appendChild(place);
                    div.removeChild(place);
                    div.innerHTML = "xx";

                    var sel = editor._getSelection(),
                        rng = editor._createRange();

                    editor._removeAllRanges(sel);
                    rng.setStart(div.firstChild, 0);
                    rng.setEnd(div.firstChild, 1);
                    editor._selectRange(sel, rng);
                    editor.openWait();

                    setTimeout(function() {
                        var parent = div.parentNode;
                        div.lastChild.deleteData(div.lastChild.length - 1, 1);

                        if(editor.isWord) {
                            div.innerHTML = Sys.Extended.UI.HtmlEditor.cleanUp(div.innerHTML);
                            Sys.Extended.UI.HtmlEditor.replaceOldTags(div, editor);
                            Sys.Extended.UI.HtmlEditor.spanJoiner(div, editor._doc);
                        } else {
                            var div1 = document.createElement("div");
                            div1.innerHTML = Sys.Extended.UI.HtmlEditor.cleanUp(div.innerHTML);

                            var html = new Sys.Extended.UI.HtmlEditor.jsDocument(true);
                            Sys.Extended.UI.HtmlEditor.__MozillaGetInnerText(div1, html);

                            div.innerHTML = html.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "").replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;");
                            delete div1;
                        }

                        while(div.firstChild)
                            parent.insertBefore(div.firstChild, div);

                        var ns = null,
                            ps = null;

                        if(div.nextSibling && div.nextSibling.nodeType == 3 && div.previousSibling && div.previousSibling.nodeType == 3) {
                            ns = div.nextSibling;
                            ps = div.previousSibling;
                        }

                        parent.removeChild(div);
                        var pslength = null;

                        if(ns != null && ps != null) {
                            pslength = ps.data.length;
                            ps.data = "" + ps.data + "" + ns.data + "";
                            ns.parentNode.removeChild(ns);
                        }

                        editor.isWord = false;
                        editor.isPlainText = false;
                        editor.closeWait();

                        if(pslength != null) {
                            var sel = editor._getSelection();
                            var rng = editor._createRange();

                            editor._removeAllRanges(sel);
                            rng.setStart(ps, pslength);
                            rng.setEnd(ps, pslength);
                            editor._selectRange(sel, rng);
                        }

                        editor.onContentChanged();
                    }, 0);
                } else {
                    Sys.Extended.UI.HtmlEditor._stopEvent(ev);
                }
            }
        }
    },

    _selectRange: function(sel, range) {
        sel.addRange(range);
        this.focusEditor();
    },

    _selectRng: function(rng) {
        var sel = this._getSelection();

        if(!Sys.Extended.UI.HtmlEditor.isIE) {
            var range = this._doc.createRange();

            range.setStart(rng[0], 0);
            range.setEnd(rng[rng.length - 1], ("" + rng[rng.length - 1].data + "").length);

            this._removeAllRanges(sel);
            this._selectRange(sel, range);
        } else {
            var range1 = this._createRange(sel),
                range2 = this._createRange(sel);

            var span1 = this._doc.createElement("span"),
                span2 = this._doc.createElement("span");

            rng[0].parentNode.insertBefore(span1, rng[0]);

            if(rng[rng.length - 1].nextSibling)
                rng[rng.length - 1].parentNode.insertBefore(span2, rng[rng.length - 1].nextSibling);
            else
                rng[rng.length - 1].parentNode.appendChild(span2);

            try {
                range1.moveToElementText(span1);
                var ii = range1.moveStart('character', 1);
                range1.moveStart('character', -ii);

                range2.moveToElementText(span2);
                ii = range2.moveEnd('character', -1);
                range2.moveEnd('character', -ii);

                range1.setEndPoint("EndToEnd", range2);
                range1.select();
            } catch(e) { }

            rng[0].parentNode.removeChild(span1);
            rng[rng.length - 1].parentNode.removeChild(span2);
        }
    },

    _removeAllRanges: function(sel) {
        sel.removeAllRanges();
    },

    _setToEnd: function() {
        var editor = this;

        setTimeout(function() {
            editor._setToEnd_();
            editor._editPanel.updateToolbar();
        }, 0);
    },

    _setToEnd_: function() {
        var editor = this;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            var sel = editor._getSelection(),
                range = editor._createRange(sel);

            if(sel.type.toLowerCase() != "control") {
                range.moveEnd("textedit", 1);
                range.collapse(false);
            }

            range.select();
            editor.focusEditor();

            return;
        }

        var index = 0,
            container = editor._doc.body,
            anchor = null;

        if(container.lastChild && container.lastChild.nodeType == 3) {
            container = container.lastChild;
            index = ("" + container.data + "").length;
        } else {
            var tempText = editor._doc.createTextNode("");

            if(container.lastChild && container.lastChild.nodeType == 1 && container.lastChild.tagName.toUpperCase() == "BR")
                container.insertBefore(tempText, container.lastChild);
            else
                container.appendChild(tempText);

            container = tempText;
            index = 0;
        }

        var sel = editor._getSelection();
        editor._removeAllRanges(sel);
        var range = editor._createRange();

        range.setStart(container, index);
        range.setEnd(container, index);

        editor._selectRange(sel, range);

        if(anchor != null)
            editor._doc.body.removeChild(anchor);

        editor.focusEditor();

        if(!Sys.Extended.UI.HtmlEditor.isSafari && !Sys.Extended.UI.HtmlEditor.isOpera) {
            try {
                var anchor = editor._doc.createElement("button");
                anchor.style.width = "0px";
                anchor.style.height = "20px";
                editor._doc.body.appendChild(anchor);

                anchor.focus();

                anchor.blur();
                editor.focusEditor();
                editor._doc.body.removeChild(anchor);
            } catch(e) { }
        }
    },

    isShadowed: function() {
        if(!this.isControl())
            return false;

        var sel = this._getSelection(),
            range = this._createRange(sel),
            element;

        if(Sys.Extended.UI.HtmlEditor.isIE)
            element = range.item(0);
        else
            element = range.startContainer.childNodes.item(range.startOffset);

        if(element.tagName &&
            element.tagName.toUpperCase() == "IMG" &&
            element.getAttribute(Sys.Extended.UI.HtmlEditor.attachedIdAttribute) &&
            element.getAttribute(Sys.Extended.UI.HtmlEditor.attachedIdAttribute).length > 0
        ) {
            var shadowNode = this.getAttachedElement(element);

            if(shadowNode != null) {
                if(Sys.Extended.UI.HtmlEditor.isIE) {
                    range = this._doc.body.createControlRange();
                    range.add(shadowNode);
                    range.select();
                } else {
                    try {
                        var index = Sys.Extended.UI.HtmlEditor.__getIndex(shadowNode);
                        sel.collapseToEnd();

                        this._removeAllRanges(sel);
                        range = this._createRange(sel);
                        range.setStart(shadowNode.parentNode, index);
                        range.setEnd(shadowNode.parentNode, index + 1);

                        this._selectRange(sel, range);
                    } catch(e) {
                        return true;
                    }
                }
                return false;
            }

            return true;
        }

        return false;
    },

    _ifShadow: function() {
        if(Sys.Extended.UI.HtmlEditor.isIE) {
            try {
                var selka = this._doc.selection;
            } catch(e) {
                return false;
            }
        }

        var editor = this,
            prot = null,
            el = Sys.Extended.UI.HtmlEditor.getSelParent(editor);

        while(el && (el.nodeType == 3 || (el.tagName && el.tagName.toUpperCase() != "BODY"))) {
            if(el.nodeType == 3 || !el.tagName) {
                el = el.parentNode;

                continue;
            }

            var tagName = el.tagName.toUpperCase()
            if(tagName == "TABLE" && el.getAttribute(Sys.Extended.UI.HtmlEditor.noContextMenuAttribute) &&
                el.getAttribute(Sys.Extended.UI.HtmlEditor.noContextMenuAttribute) == "yes") {
                prot = el.rows.item(0).cells.item(0).firstChild;

                if(Sys.Extended.UI.HtmlEditor.isIE && tagName == "P")
                    prot = prot.firstChild;

                break;
            }

            el = el.parentNode;
        }

        if(prot != null) {
            var sel = editor._getSelection(),
                range = editor._createRange(sel);

            if(Sys.Extended.UI.HtmlEditor.isIE) {
                range = editor._doc.body.createControlRange();
                range.add(prot);
                range.select();
            } else {
                try {
                    sel.collapseToEnd();
                    editor._removeAllRanges(sel);
                    range = editor._createRange(sel);
                    range.setStart(prot.parentNode, 0);
                    range.setEnd(prot.parentNode, 1);
                    editor._selectRange(sel, range);
                } catch(e) { }
            }
        }
    },

    _saveContent: function() {
        var sel,
            range,
            marker;

        try {
            try {
                sel = this._getSelection();
                range = this._createRange(sel);
            } catch(e) { }

            marker = new Sys.Extended.UI.HtmlEditor._Marker(this, range, sel);
        } catch(e) {
            return;
        }

        if(!this.__stack) {
            this.__stack = [];
            this.__stackPos = 0;
        }

        while(this.__stackPos < this.__stack.length)
            this.__stack.pop();

        if(this.__stack.length == Sys.Extended.UI.HtmlEditor.__stackMaxSize) {
            this.__stack.reverse();
            this.__stack.pop();
            this.__stack.reverse();
        }

        this.__stack.push(marker);
        this.__stackPos = this.__stack.length;
    },

    _restoreContent: function() {
        if(this.__stack && this.__stackPos >= 0 && this.__stackPos < this.__stack.length) {
            var obj = this.__stack[this.__stackPos],
                sel,
                range;

            if(Sys.Extended.UI.HtmlEditor.isIE) {
                function rep(p0, p1, p2, p3, p4) {
                    return p1.replace(/\salign=[^\s>]*/ig, "") + ((p3 == '"X"') ? "" : ("align=" + p3)) + p4.replace(/\salign=[^\s>]*/ig, "");
                }

                var tempCollection = this._doc.body.getElementsByTagName("EMBED");

                var els = [];
                for(var i = 0; i < tempCollection.length; i++)
                    els.push(tempCollection[i]);

                for(var jk = 0; jk < els.length; jk++)
                    els[jk].parentNode.removeChild(els[jk]);

                var tuk = obj._save.replace(/&amp;/ig, "&");
                tuk = tuk.replace(/(<embed(?:.*?))(teoalign=)(\"[^\"]*\")((?:.*?)>)/ig, rep);
                this._doc.body.innerHTML = "!!!<span></span>" + Sys.Extended.UI.HtmlEditor.Trim(tuk);

                if(this._doc.body.firstChild)
                    this._doc.body.removeChild(this._doc.body.firstChild);
                if(this._doc.body.firstChild)
                    this._doc.body.removeChild(this._doc.body.firstChild);

                var mArr = Sys.Extended.UI.HtmlEditor.getHrefsText(tuk);
                Sys.Extended.UI.HtmlEditor.setHrefsText(this._doc.body, mArr);

                if(this._editPanel.get_relativeImages()) {
                    mArr = Sys.Extended.UI.HtmlEditor.getImagesText(tuk);
                    Sys.Extended.UI.HtmlEditor.setImagesText(this._doc.body, mArr);
                }

                Sys.Extended.UI.HtmlEditor.setNames(this._doc.body, obj._nArr);
                Sys.Extended.UI.HtmlEditor.operateAnchors(this, this._doc, !this._editPanel.get_showAnchors());
                Sys.Extended.UI.HtmlEditor.operatePlaceHolders(this, this._doc, !this._editPanel.get_showPlaceHolders());

                if(obj._tree != null) {
                    var el = this._doc.body, i;

                    try {
                        for(i = obj._tree.length - 1; i >= 0; i--)
                            el = el.childNodes.item(obj._tree[i]);
                    } catch(e) {
                        if(this.__stackPos > 0) {
                            this.__stackPos--;
                            this._restoreContent();
                            this.__stackPos++;
                        }

                        return;
                    }

                    try {
                        var rng = this._doc.body.createControlRange();

                        rng.add(el);
                        rng.select();
                    } catch(e) { }
                } else {
                    var editor = this;

                    setTimeout(function() {
                        try {
                            if(editor._editPanel == Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel) {
                                sel = editor._getSelection();
                                range = editor._createRange(sel);

                                if(sel.type.toLowerCase() != "control")
                                    try { range.moveToPoint(obj._offsetLeft, obj._offsetTop); } catch(e) { }

                                range.select();
                            }
                        } catch(e) { }
                    }, 0);
                }
            } else {
                if(Sys.Extended.UI.HtmlEditor.isOpera) {
                    this._doc.body.innerHTML = Sys.Extended.UI.HtmlEditor.Trim(obj._save);
                } else {
                    this._doc.body.innerHTML = "";

                    for(var i = 0; i < obj._save.childNodes.length; i++)
                        this._doc.body.appendChild(obj._save.childNodes.item(i).cloneNode(true));
                }

                Sys.Extended.UI.HtmlEditor.operateAnchors(this, this._doc, !this._editPanel.get_showAnchors());
                Sys.Extended.UI.HtmlEditor.operatePlaceHolders(this, this._doc, !this._editPanel.get_showPlaceHolders());

                try {
                    sel = this._getSelection();
                    range = this._createRange();
                    this._removeAllRanges(sel);
                } catch(e) { }

                var str = "",
                    el = this._doc.body;

                for(var i = obj._tree.length - 1; i >= 0; i--) {
                    str += " " + obj._tree[i];
                    el = el.childNodes.item(obj._tree[i]);
                }

                var n_offset = obj._offset;
                try {
                    range.setStart(el, n_offset);
                    range.setEnd(el, n_offset);
                } catch(e) {
                    Sys.Extended.UI.HtmlEditor.inspectForShadows(this._doc.body);

                    return;
                }

                try {
                    this._selectRange(sel, range);
                } catch(e) { }
            }

            try {
                Sys.Extended.UI.HtmlEditor.inspectForShadows(this._doc.body);
            } catch(e) { }
        }
    },

    SaveContent: function() {
        this._saveContent();
    },

    RestoreContent: function() {
        this._undo(false);
    },

    _undo: function(pr) {
        if(this.__stack) {
            if(this.__stackPos > 0) {
                if(this.__stackPos == this.__stack.length && pr)
                    this._saveContent();

                do {
                    var tmp = Sys.Extended.UI.HtmlEditor.Trim(this._doc.body.innerHTML);

                    this.__stackPos--;
                    this._restoreContent();
                }
                while(Sys.Extended.UI.HtmlEditor.Trim(this._doc.body.innerHTML) == tmp && this.__stackPos > 0 && pr)

                var editor = this;
                setTimeout(function() {
                    try {
                        editor._ifShadow();
                    } catch(e) { };

                    if(editor._editPanel == Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel)
                        try {
                            editor._editPanel.updateToolbar();
                        } catch(e) { }

                    if(!pr)
                        editor.onContentChanged();
                }, 0);
            }
        }
    },

    _redo: function() {
        if(this.__stack) {
            if(this.__stackPos < this.__stack.length - 1) {
                this.__stackPos++;
                var editor = this,
                    tempCollectionLength;

                if(Sys.Extended.UI.HtmlEditor.isIE) {
                    tempCollectionLength = editor._doc.body.getElementsByTagName("EMBED").length;

                    if(tempCollectionLength > 0) {
                        var popup = editor._body.ownerDocument.createElement("div");
                        editor._body.appendChild(popup);

                        setTimeout(function() {
                            editor._body.removeChild(popup);
                        }, 0);
                    }
                }

                this._restoreContent();
                var editor = this;

                setTimeout(function() {
                    editor._ifShadow(); editor._editPanel.updateToolbar();
                }, 0);
            }
        }
    },

    undo: function() {
        this._undo(true);
        this.onContentChanged();
    },

    redo: function() {
        this._redo();
        this.onContentChanged();
    },

    _contextMenuCallP: function() {
    },

    onContentChanged: function() {
    },

    _copyCut: function(key, prize) {
        var editor = this;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            var sel = this._getSelection(),
                range = this._createRange(sel),
                was = false,
                html = "";

            if(key == 'x')
                this._saveContent();

            if(sel.type.toLowerCase() == "control") {
                was = true;
                html = Sys.Extended.UI.HtmlEditor.getHTML(range.item(0), true)
            } else {
                if(range.text != "") {
                    was = true;
                    html = range.htmlText;

                    var sr = range.duplicate();

                    var rng = this._getTextNodeCollection();

                    if(rng.length < 1)
                        return;

                    var fnd = Sys.Extended.UI.HtmlEditor._commonParent(rng[0], rng[rng.length - 1]);

                    if(fnd != null && rng[0].previousSibling && rng[0].previousSibling.nodeType == 3) {
                        var par = fnd.parent;

                        while(par && par.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HtmlEditor.isStyleTag(par.tagName)) {
                            var ttt = par.cloneNode(false);
                            ttt.innerHTML = html;
                            html = ttt.outerHTML;
                            par = par.parentNode;
                        }
                    }

                    sel = this._getSelection();
                    sel.empty();

                    range = this._createRange(sel);
                    range.setEndPoint("EndToEnd", sr);
                    range.setEndPoint("StartToStart", sr);
                    range.select();
                } else {
                    if(range.htmlText != "") {
                        was = true;
                        html = range.htmlText;
                    }
                }
            }

            if(was) {
                var src = this._doc.createElement("DIV");

                src.innerHTML = "!!!<span></span>" + html;
                src.removeChild(src.firstChild);
                src.removeChild(src.firstChild);

                var temp = Sys.Extended.UI.HtmlEditor.getHTML(src, false, true);

                var nnreg = new RegExp("(<[/]?)(teo" + Sys.Extended.UI.HtmlEditor.smartClassName + ":)", "ig");
                temp = temp.replace(nnreg, "$1");

                delete src;
                this._contentCopy(temp, true);
                range.select();

                if(key == 'x') {
                    sel.clear();
                    this._clearP();
                }
            } else {
                if(key == 'x') {
                    sel.clear();
                    this._clearP();
                }
            }

            if(prize)
                setTimeout(function() { editor._editPanel.updateToolbar(); }, 0);
        } else {
            if(key == "x") {
                this._saveContent();

                var sel = this._getSelection(),
                    range = this._createRange(sel);

                this._removeAllRanges(sel);
                range.deleteContents();

                if(this._doc.body.innerHTML == "") {
                    this._doc.body.innerHTML = "<br/>";
                    range.setStart(this._doc.body, 0);
                    range.setEnd(this._doc.body, 0);
                }

                editor.onContentChanged();
                this._selectRange(sel, range);
            } else {
                var sel = this._getSelection(),
                    range = this._createRange(sel);

                this._removeAllRanges(sel);

                alert(String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_Use_verb, (Sys.Extended.UI.HtmlEditor.isSafari && navigator.userAgent.indexOf("mac") != -1) ? "Apple-C" : "Ctrl-C"));
                this._selectRange(sel, range);
            }
        }
    },

    _paste: function(prize, word) {
        var editor = this,
            sel = this._getSelection(),
            range = this._createRange(sel),
            _left,
            _top;

        if(!prize) {
            _left = range.offsetLeft;
            _top = range.offsetTop;

            this.insertHTML(this._getPlain());
            editor.onContentChanged();

            return;
        }

        if(this._editPanel.get_noPaste())
            return;

        _left = range.offsetLeft;
        _top = range.offsetTop;

        var temp = this._doc.createElement("span"),
            place,
            tText = this._contentCopy("", false, word);

        if((/<[\/]*p[\s>]+/i.test(tText)) || (/<[\/]*h/i.test(tText))) {
            place = this._getSafePlace();
        } else {
            place = this._doc.createElement("SPAN");
            place.id = Sys.Extended.UI.HtmlEditor.smartClassName;

            if(!this.insertHTML(Sys.Extended.UI.HtmlEditor.getHTML(place, true)))
                return;

            place = this._doc.getElementById(Sys.Extended.UI.HtmlEditor.smartClassName);

            if(place) {
                place.id = null;
                place.removeAttribute("id");
                place.setAttribute("para", "no");
            }
        }

        temp.innerHTML = tText;
        if(!place)
            return;

        this._checkImages(temp);

        var par = place.parentNode,
            pos = place.getAttribute("para");

        if(pos != "no") {
            if(pos.indexOf("left") >= 0 && temp.firstChild) {
                if(temp.firstChild.tagName && temp.firstChild.tagName.toUpperCase() == "P") {
                    while(temp.firstChild.firstChild)
                        place.previousSibling.appendChild(temp.firstChild.firstChild);

                    temp.removeChild(temp.firstChild);
                }
            }

            if(pos.indexOf("right") >= 0 && temp.lastChild) {
                if(temp.lastChild.tagName && temp.lastChild.tagName.toUpperCase() == "P") {
                    while(temp.lastChild.lastChild)
                        place.nextSibling.insertBefore(temp.lastChild.lastChild, place.nextSibling.firstChild);

                    temp.removeChild(temp.lastChild);
                }
            }
        }

        var saveEl = place,
            temp1 = null;

        if(temp.childNodes.length == 0 && pos.indexOf("left") >= 0 && pos.indexOf("right") >= 0) {
            if(place.nextSibling.firstChild) {
                temp1 = this._doc.createElement("span");
                saveEl = temp1;
                temp1.innerHTML = "111";
                place.previousSibling.appendChild(temp1);
            }

            while(place.nextSibling.firstChild)
                place.previousSibling.appendChild(place.nextSibling.firstChild);

            par.removeChild(place.nextSibling);
        } else {
            while(temp.firstChild)
                par.insertBefore(temp.firstChild, place);
        }

        setTimeout(function() {
            var sel = editor._getSelection(),
                range = editor._createRange(sel);

            if(sel.type.toLowerCase() == "control") {
                while(range.length > 0)
                    range.remove(0);
            }

            try {
                range.collapse(false);
            } catch(e) { }

            editor.focusEditor();
            Sys.Extended.UI.HtmlEditor._setCursor(saveEl, editor);

            if(temp1)
                temp1.parentNode.removeChild(temp1);

            par.removeChild(place);
            Sys.Extended.UI.HtmlEditor.inspectForShadows(editor._doc.body);
            editor.onContentChanged();
            range.select();
        }, 0);
    },

    _contentCopy: function(text, prize, word) {
        if(text != "") {
            text = text.replace(/(<td[^>]*?>)([\s ]*?)(<\/td[^>]*?>)/ig, "$1&nbsp;$3")
                .replace(/(<td[^>]*?>)\s*(&nbsp;)\s*(<\/td[^>]*?>)/ig, "$1<br/>$3")
                .replace(/(<p[^>]*?>)\s*(&nbsp;)\s*(<\/p[^>]*?>)/ig, "$1<br/>$3");
        }

        var iframe = this._doc.createElement("iframe");

        iframe.width = "0";
        iframe.height = "0";

        if(Sys.Extended.UI.HtmlEditor.isIE)
            iframe.src = "javascript:false;";

        this._doc.appendChild(iframe);
        var doc = iframe.contentWindow.document;

        doc.write("<html><head></head><body>" + text + "</body></html>");
        doc.close();
        doc.body.contentEditable = true;

        var r = doc.body.createTextRange(),
            wasNbsp = false;

        if(text == "") {
            r.execCommand("paste");
            var trg = doc.createElement("DIV");

            for(var i = 0; i < doc.body.childNodes.length; i++) {
                var child = doc.body.childNodes.item(i);

                if(child.nodeType == 8) {
                    var str = "" + child.data + "";

                    if(str.search(/StartFragment/i) >= 0) {
                        if(child.nextSibling && child.nextSibling.nodeType == 3) {
                            var str = "" + child.nextSibling.data + "";

                            if(str.length) {
                                if(str.charCodeAt(0) == 160) {
                                    str = str.substr(1);
                                    child.nextSibling.data = str;
                                    wasNbsp = true;

                                    break;
                                }
                            }
                        }
                    }
                }
            }

            if(typeof word != "undefined" && word)
                doc.body.innerHTML = Sys.Extended.UI.HtmlEditor.cleanUp(doc.body.innerHTML);

            var str = Sys.Extended.UI.HtmlEditor.Trim(Sys.Extended.UI.HtmlEditor.getHTML(doc.body, false, true));
            str = str.replace(/(<script(?:[^>]*?)>(?:[^<]*?)<\/script(?:[^>]*?)>)/gi, "");
            doc.body.innerHTML = str;

            if(!prize) {
                Sys.Extended.UI.HtmlEditor.operateAnchors(this, doc, !this.showAnchors);
                Sys.Extended.UI.HtmlEditor.operatePlaceHolders(this, doc, !this.showPlaceHolders);

                var tempCollection = doc.body.getElementsByTagName("EMBED");

                var els = [];
                for(var i = 0; i < tempCollection.length; i++)
                    els.push(tempCollection[i]);

                for(var jk = 0; jk < els.length; jk++)
                    els[jk].parentNode.removeChild(els[jk]);
            }

            delete r;
            delete trg;

            if(prize && Sys.Extended.UI.HtmlEditor.isIE)
                r = doc.body.createTextRange();
        }

        if(prize && Sys.Extended.UI.HtmlEditor.isIE) {
            if(text != "") {
                Sys.Extended.UI.HtmlEditor.operateAnchors(this, doc, true);
                Sys.Extended.UI.HtmlEditor.operatePlaceHolders(this, doc, true);
            }

            r.select();
            r.execCommand("copy");
        }

        var ret = Sys.Extended.UI.HtmlEditor.Trim(doc.body.innerHTML)
            .replace(/<br\s*[\/]*>\s*<\/td>/ig, "</td>")
            .replace(/(<td[^>]*?>)([\s ]*?)(<\/td[^>]*?>)/ig, "$1&nbsp;$3")
            .replace(/(<p[^>]*?>)\s*(<br[^>]*?>)\s*(<\/p[^>]*?>)/ig, "$1&nbsp;$3")
            .replace(/(<embed(?:.*?))(wmode=)(\"[^\"]*\")((?:.*?)>)/ig, "$1pseudomode=$3$4")
            .replace(/(<embed)([^>]*?>)/ig, "$1 wmode=\"transparent\"$2");

        var tempCollection = doc.body.getElementsByTagName("EMBED"),
            els = [];

        for(var i = 0; i < tempCollection.length; i++)
            els.push(tempCollection[i]);

        for(var jk = 0; jk < els.length; jk++)
            els[jk].parentNode.removeChild(els[jk]);

        iframe.src = "";
        var editor = this;
        editor._doc.removeChild(iframe);

        delete iframe;

        return ret;
    },

    insertHTML: function(html, range) {
        this.focusEditor();
        var sel = this._getSelection();

        if(typeof range == "undefined")
            range = this._createRange(sel);

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            function regReplScript(p0, p1) {
                return "<span class=\"" + Sys.Extended.UI.HtmlEditor.smartClassName + "_script\" style='display:none;visibility:hidden;'>" + p1.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</span>";
            }

            function regReplFromScript(p0, p1, p2, p3) {
                return p1.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
            }

            var new_html = "<span id=\"" + Sys.Extended.UI.HtmlEditor.smartClassName + "\">111<span></span>" + html + "</span>";
            var mArr = Sys.Extended.UI.HtmlEditor.getHrefsText(new_html);
            var mArr1 = Sys.Extended.UI.HtmlEditor.getImagesText(new_html);

            if(!this._editPanel.get_noScript())
                new_html = new_html.replace(/(<script(?:[^>]*?)>.*?<\/script(?:[^>]*?)>)/gi, regReplScript);
            else
                new_html = new_html.replace(/(<script(?:[^>]*?)>.*?<\/script(?:[^>]*?)>)/gi, "");

            var editor = this;
            try {
                if(range.pasteHTML) {
                    range.pasteHTML(new_html);
                } else {
                    var div = this._doc.createElement("DIV");
                    div.innerHTML = new_html;

                    while(div.firstChild)
                        range(0).parentNode.insertBefore(div.firstChild, range(0));

                    range(0).parentNode.removeChild(range(0));
                    range.remove(0);

                    delete div;
                }
            } catch(e) {
                return false;
            }

            var trg = this._doc.getElementById(Sys.Extended.UI.HtmlEditor.smartClassName);

            trg.innerHTML = "<span>qqq</span>" + Sys.Extended.UI.HtmlEditor.getHTML(trg, false, true).replace(new RegExp("<span(?:[^>]*?)class=" + Sys.Extended.UI.HtmlEditor.smartClassName + "_script(?:[^>]*?)>(.*?)<\/span(?:[^>]*?)>", "gi"), regReplFromScript) + "<span>qqq</span>";
            trg.removeChild(trg.firstChild);
            trg.removeChild(trg.lastChild);

            Sys.Extended.UI.HtmlEditor.setHrefsText(trg, mArr);
            Sys.Extended.UI.HtmlEditor.setImagesText(trg, mArr1);

            if(trg.firstChild)
                trg.removeChild(trg.firstChild);

            if(trg.firstChild)
                trg.removeChild(trg.firstChild);

            while(trg.firstChild)
                trg.parentNode.insertBefore(trg.firstChild, trg);

            trg.parentNode.removeChild(trg);
            delete trg;

            return true;
        } else {
            var div = this._doc.createElement("div");
            div.innerHTML = html;

            var tempCollection = div.getElementsByTagName("EMBED");

            var embedCollection = [];
            for(var i = 0; i < tempCollection.length; i++)
                embedCollection.push(tempCollection[i]);

            for(var j = 0; j < embedCollection.length; j++) {
                var embed = embedCollection[j],
                    img = document.createElement("IMG"),
                    attrs = embed.attributes;

                img.src = this._images_list[1];
                img.setAttribute("dummytag", "embed");

                for(var i = 0; i < attrs.length; ++i) {
                    var a = attrs.item(i);
                    if(!a.specified)
                        continue;

                    var name = a.name.toLowerCase(),
                        value = a.value;

                    if(name == "src")
                        name = "dummysrc";
                    else if(name == "bgcolor")
                        name = "dummybgcolor";
                    else if(name == "wmode")
                        name = "pseudomode";

                    img.setAttribute(name, value);
                }

                img.getAttribute("type")
                img.style.cssText = "border: 1px dotted #000000; background-image: url('" + (img.getAttribute("type").toLowerCase() == "application/x-mplayer2" ? this._images_list[3] : this._images_list[2]) + "'); background-position: center; background-repeat: no-repeat; background-color: #c0c0c0;";

                embed.parentNode.insertBefore(img, embed);
                embed.parentNode.removeChild(embed);
            }
            var ret = this.insertNodeAtSelection(div, range);

            return ret;
        }
    },

    insertNodeAtSelection: function(toBeInserted, range) {
        if(!Sys.Extended.UI.HtmlEditor.isIE) {
            var sel = this._getSelection();

            if(typeof range == "undefined") {
                try {
                    range = this._createRange(sel);
                } catch(ex) {
                    this._removeAllRanges(sel);

                    return false;
                }
            }

            var node = range.startContainer,
                pos = range.startOffset;

            if(node.ownerDocument.id != "EditorDocument")
                return false;

            if((range.startContainer.nodeType == 1 && range.startContainer.tagName.toUpperCase() == "TR") ||
                (range.endContainer.nodeType == 1 && range.endContainer.tagName.toUpperCase() == "TR"))
                return false;

            this._removeAllRanges(sel);
            range.deleteContents();

            try {
                range = this._createRange();
            } catch(ex) {
                this._removeAllRanges(sel);

                return false;
            }

            switch(node.nodeType) {
                case 3:
                    if(pos > 0)
                        node = node.splitText(pos);

                    while(toBeInserted.firstChild)
                        node.parentNode.insertBefore(toBeInserted.firstChild, node);

                    range.setStart(node, 0);
                    range.setEnd(node, 0);

                    break;
                case 1:
                case 11:
                    try {
                        this._removeAllRanges(sel);
                        if(node.childNodes.length >= pos + 1) {
                            node = node.childNodes.item(pos);

                            while(toBeInserted.firstChild)
                                node.parentNode.insertBefore(toBeInserted.firstChild, node);

                            var tempText = this._doc.createTextNode("");
                            node.parentNode.insertBefore(tempText, node);
                            node = tempText;
                        } else {
                            var tempText = this._doc.createTextNode("");

                            if(Sys.Extended.UI.HtmlEditor.canHaveChildren(node)) {
                                while(toBeInserted.firstChild)
                                    node.appendChild(toBeInserted.firstChild);

                                node.appendChild(tempText);
                            } else {
                                while(toBeInserted.firstChild)
                                    node.parentNode.insertBefore(toBeInserted.firstChild, node);

                                node.parentNode.insertBefore(tempText, node);
                            }
                            node = tempText;
                        }

                        if(node.nodeType == 1) {
                            var par = node.parentNode,
                                container = par,
                                j = 0;

                            for(; j < par.childNodes.length; j++)
                                if(node == par.childNodes.item(j))
                                    break;

                            range.setStart(par, j);
                            range.setEnd(par, j);
                        } else {
                            range.setStart(node, 0);
                            range.setEnd(node, 0);
                        }
                    } catch(ex) {
                        this._removeAllRanges(sel);

                        return false;
                    }
                    break;
            }

            this._selectRange(sel, range);
            return true;
        } else {
            return false;
        }
    },

    trickWithStyles: function(tid) {
        var editor = this,
            el = editor._doc.getElementById(tid);

        if(el != null) {
            if(el.nextSibling && el.nextSibling.nodeType == 3) {
                var text = el.nextSibling;
                el.parentNode.removeChild(el);

                var spaceIndex = ("" + text.data + "").indexOf(" ");
                if(spaceIndex > 0) {
                    text.splitText(spaceIndex);
                } else {
                    if(spaceIndex == 0)
                        text.splitText(1);
                }

                if(editor.n_arr != null)
                    for(var im = 0; im < editor.n_arr.length; im++)
                        editor.MSIE_applyCssStyle(editor.n_arr[im], [text], false);

                editor.n_arr = null;

                var sel = editor._getSelection();

                if(!Sys.Extended.UI.HtmlEditor.isIE) {
                    var range = editor._doc.createRange();

                    range.setStart(text, text.length);
                    range.setEnd(text, text.length);

                    editor._removeAllRanges(sel);
                    editor._selectRange(sel, range);
                } else {
                    var range1 = editor._createRange(sel),
                        span1 = editor._doc.createElement("span");

                    if(text.nextSibling)
                        text.parentNode.insertBefore(span1, text.nextSibling);
                    else
                        text.parentNode.appendChild(span1);

                    try {
                        range1.moveToElementText(span1);
                        range1.select();
                    } catch(e) { }

                    span1.parentNode.removeChild(span1);
                }
            }
            else {
                el.parentNode.removeChild(el);
            }
        }
    },

    _getParent: function(range) {
        if(Sys.Extended.UI.HtmlEditor.isIE)
            return range.parentElement();
        else
            return range.startContainer;
    },

    _checkImages: function(element) {
        if(this._editPanel.get_relativeImages()) {
            var images = element.getElementsByTagName("IMG");

            for(var i = 0; i < images.length; i++) {
                var image = images[i];

                if(image.src.indexOf("http://") >= 0) {
                    var tmp = image.src;

                    image.src = "qwerty.gif";
                    var n = image.src.indexOf("qwerty.gif");

                    if(tmp.substr(0, n) == image.src.substr(0, n))
                        tmp = tmp.substr(n, tmp.length - n);

                    image.src = tmp;
                }
            }
        }
    },

    _getSafePlace: function(uel) {
        var el = this._doc.createElement("SPAN"),
            editor = this;

        el.id = Sys.Extended.UI.HtmlEditor.smartClassName;

        if(typeof uel == "undefined") {
            if(!this.insertHTML(Sys.Extended.UI.HtmlEditor.getHTML(el, true)))
                return null;
        } else {
            if(uel.nextSibling == null)
                uel.parentNode.appendChild(el);
            else
                uel.parentNode.insertBefore(el, uel.nextSibling);

            uel.parentNode.removeChild(uel);
        }

        el = this._doc.getElementById(Sys.Extended.UI.HtmlEditor.smartClassName);
        el.id = null;
        el.removeAttribute("id");
        el.setAttribute("para", "no");

        var parent = el.parentNode,
            tagName = parent.tagName.toUpperCase();

        while(tagName != "BODY" && tagName != "TD" && tagName != "P" && tagName != "DIV") {
            if(Sys.Extended.UI.HtmlEditor.isStyleTag(parent.tagName)) {
                parent = parent.parentNode;
                tagName = parent.tagName.toUpperCase();
            } else {
                break;
            }
        }

        if(tagName == "P") {
            el.setAttribute("para", "");

            function diver(add, el, rpr, before) {
                var neighbour,
                    par = Sys.Extended.UI.HtmlEditor.myClone(rpr, editor._doc, false);

                if(add)
                    par.appendChild(add);

                while(el) {
                    if(el.nodeType == 1 || (el.nodeType == 3 && Sys.Extended.UI.HtmlEditor.Trim("" + el.data + "").length > 0)) {
                        var text = null;

                        if(el.tagName && el.tagName.toUpperCase() == "SCRIPT")
                            text = el.text;

                        var ela = Sys.Extended.UI.HtmlEditor.myClone(el, editor._doc, true);

                        if(par.childNodes.length == 0 || !before)
                            par.appendChild(ela);
                        else
                            par.insertBefore(ela, par.firstChild);

                        if(text != null)
                            ela.text = text;
                    }
                    el = before ? el.previousSibling : el.nextSibling
                }

                if(par.childNodes.length == 0) {
                    delete par;
                    par = null;
                }

                if(rpr == parent)
                    return par;
                else
                    return diver(par, before ? rpr.previousSibling : rpr.nextSibling, rpr.parentNode, before);
            };

            var p1 = diver(null, el.previousSibling, el.parentNode, true),
                p2 = diver(null, el.nextSibling, el.parentNode, false);

            var par = parent.parentNode;

            if(p1) {
                par.insertBefore(p1, parent);
                el.setAttribute("para", el.getAttribute("para") + " left");
            }
            par.insertBefore(el, parent);

            if(p2) {
                par.insertBefore(p2, parent);
                el.setAttribute("para", el.getAttribute("para") + " right");
            }
            par.removeChild(parent);
        }

        return el;
    },

    noContextMenuAttributeName: function() {
        return Sys.Extended.UI.HtmlEditor.noContextMenuAttribute;
    },

    _getTextNodeCollection: function(total) {
        var _result = [];
        if(this.isControl())
            return _result;

        var sel = this._getSelection(),
            range = this._createRange(sel);

        var rn = Sys.Extended.UI.HtmlEditor.smartClassName + "_right",
            ln = Sys.Extended.UI.HtmlEditor.smartClassName + "_left",
            r_left = null,
            r_right = null,
            svs;

        if(typeof total == "undefined") {
            if(Sys.Extended.UI.HtmlEditor.isIE) {
                r_left = range.duplicate();
                r_right = range.duplicate();
                r_left.setEndPoint("EndToStart", range);
                r_right.setEndPoint("StartToEnd", range);
            } else {
                r_left = range.cloneRange();
                r_right = range.cloneRange();
                r_left.setEnd(r_left.startContainer, r_left.startOffset);
                r_right.setStart(r_right.endContainer, r_right.endOffset);
                svs = r_left.endOffset;
            }

            if(!this.insertHTML("<span id='" + rn + "'/>", r_right)) {
                return _result;
            } else {
                if(Sys.Extended.UI.HtmlEditor.isOpera) {
                    r_left.setEnd(r_left.startContainer, svs);
                    r_left.setStart(r_left.startContainer, svs);
                }

                if(!this.insertHTML("<span id='" + ln + "'/>", r_left)) {
                    var rP = this._doc.getElementById(rn);

                    if(rP != null) {
                        temp = rP.parentNode;
                        temp.removeChild(rP);
                    }

                    var rL = this._doc.getElementById(rl);
                    if(rL != null) {
                        temp = rL.parentNode;
                        temp.removeChild(rL);
                    }

                    return _result;
                }
            }
        } else {
            var span;

            span = this._doc.createElement("SPAN");
            span.id = rn;
            this._doc.body.appendChild(span);

            span = this._doc.createElement("SPAN");
            span.id = ln;
            this._doc.body.insertBefore(span, this._doc.body.firstChild);
        }

        var lPoint = this._doc.getElementById(ln),
            rPoint = this._doc.getElementById(rn);

        if(lPoint == null || rPoint == null) {
            var temp;

            if(lPoint != null) {
                temp = lPoint.parentNode;
                temp.removeChild(lPoint);
            }

            if(rPoint != null) {
                temp = rPoint.parentNode;
                temp.removeChild(rPoint);
            }

            return [];
        }

        while(lPoint.firstChild)
            lPoint.removeChild(lPoint.firstChild);

        while(rPoint.firstChild)
            rPoint.removeChild(rPoint.firstChild);

        while(lPoint.previousSibling && lPoint.previousSibling.nodeType == 3 &&
              Sys.Extended.UI.HtmlEditor.Trim("" + lPoint.previousSibling.data + "").length == 0)
            lPoint.parentNode.removeChild(lPoint.previousSibling);

        while(lPoint.nextSibling && lPoint.nextSibling.nodeType == 3 &&
              Sys.Extended.UI.HtmlEditor.Trim("" + lPoint.nextSibling.data + "").length == 0)
            lPoint.parentNode.removeChild(lPoint.nextSibling);

        while(rPoint.previousSibling && rPoint.previousSibling.nodeType == 3 &&
              Sys.Extended.UI.HtmlEditor.Trim("" + rPoint.previousSibling.data + "").length == 0)
            rPoint.parentNode.removeChild(rPoint.previousSibling);

        while(rPoint.nextSibling && rPoint.nextSibling.nodeType == 3 &&
              Sys.Extended.UI.HtmlEditor.Trim("" + rPoint.nextSibling.data + "").length == 0)
            rPoint.parentNode.removeChild(rPoint.nextSibling);

        var _found = false,
            editor = this;

        function _diver(_point, prize) {
            while(_point) {
                if(_point.id && _point.id == rn) {
                    _found = true;

                    return;
                }

                if(_point.nodeType == 3) {
                    while(_point.nextSibling && (_point.nextSibling.nodeType == 3 || (!Sys.Extended.UI.HtmlEditor.isIE && typeof editor.__saveBM__ != "undefined" && editor.__saveBM__ != null && editor.__saveBM__[0] == _point.nextSibling))) {
                        if(_point.nextSibling.nodeType == 3) {
                            _point.data = "" + _point.data + "" + _point.nextSibling.data + "";
                        } else {
                            editor.__saveBM__[0] = _point;
                            editor.__saveBM__[1] = ("" + _point.data + "").length;
                        }

                        _point.parentNode.removeChild(_point.nextSibling);
                    }

                    if(Sys.Extended.UI.HtmlEditor.Trim("" + _point.data + "").length > 0)
                        _result.push(_point);
                } else {
                    var tagName = _point.tagName;

                    if(_point.tagName) {
                        tagName = tagName.toUpperCase();

                        if(!(tagName == "MAP" || tagName == "AREA" || tagName == "SCRIPT" || tagName == "NOSCRIPT"))
                            if(!(_point.style && (Sys.Extended.UI.HtmlEditor.getStyle(_point, "display") == "none" || Sys.Extended.UI.HtmlEditor.getStyle(_point, "visibility") == "hidden")))
                                _diver(_point.firstChild, false);
                    }
                }

                if(_found)
                    return;

                var _save = _point.parentNode;

                if(prize)
                    while(_point.nextSibling == null)
                        _point = _point.parentNode;

                _point = _point.nextSibling;
            }
        };

        _diver(lPoint, true);
        var temp;

        temp = lPoint.parentNode;
        temp.removeChild(lPoint);
        temp = rPoint.parentNode;
        temp.removeChild(rPoint);

        if(typeof total == "undefined") {
            if(Sys.Extended.UI.HtmlEditor.isIE) {
                sel.empty();
                r_right.select();
            } else {
                if(_result.length > 0) {
                    this._removeAllRanges(sel);
                    var rrr = this._createRange();

                    rrr.setEnd(_result[_result.length - 1], _result[_result.length - 1].length);
                    rrr.setStart(_result[_result.length - 1], _result[_result.length - 1].length);
                    this._selectRange(sel, rrr);
                }
            }
        }

        return _result;
    },

    _getPlain: function() {
        var area = this._doc.createElement("textarea");
        area.width = "0";
        area.height = "0";

        this._doc.appendChild(area);
        var r = area.createTextRange();
        r.execCommand("paste");
        var res = area.value;
        res = res.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "").replace(/\n/g, "<br/>");
        this._doc.removeChild(area);

        return res;
    },

    _execCommand: function(cmdID, UI, param) {
        var editor = this,
            sel,
            range;

        if(Sys.Extended.UI.HtmlEditor.isIE && !this.isControl()) {
            sel = this._getSelection();
            range = this._createRange(sel);

            var prnt = range.parentElement();
            if(prnt.tagName.toUpperCase() == "TEXTAREA")
                return;
        }

        if(cmdID.toLowerCase() != "createlink")
            this._saveContent();

        switch(cmdID.toLowerCase()) {
            case "createlink":
                if(Sys.Extended.UI.HtmlEditor.isIE || !UI) {
                    this._doc.execCommand(cmdID, UI, param);
                } else {
                    var param;

                    if((param = prompt("Enter URL")))
                        this._doc.execCommand(cmdID, false, param);
                }
                break;
            case "backcolor":
            case "forecolor":
            case "fontname":
            case "fontsize":
                this.MSIE_applyCommand(cmdID.toLowerCase(), param);
                break;
            case "indent":
                this.MSIE_indent(true);
                break;
            case "outdent":
                this.MSIE_indent(false);
                break;
            case "justifyleft":
                this.MSIE_justify("left");
                break;
            case "justifyfull":
                this.MSIE_justify("justify");
                break;
            case "justifycenter":
                this.MSIE_justify("center");
                break;
            case "justifyright":
                this.MSIE_justify("right");
                break;
            case "paragraph":
                this.MSIE_justify("remain", false, "P");
                break;
            case "formatblock":
                if(param != null && typeof param == "string" && param.length == 2)
                    if(param.substr(0, 1).toUpperCase() == "H" && parseInt(param.substr(1, 1)) > 0) {
                        this.MSIE_justify("remain", false, param);
                        break;
                    }

                this._doc.execCommand(cmdID, UI, param);
                break;
            case "insertunorderedlist":
                this.MSIE_list("UL");
                break;
            case "insertorderedlist":
                this.MSIE_list("OL");
                break;
            case "bold":
            case "italic":
            case "underline":
            case "strikethrough":
            case "superscript":
            case "subscript":
                this.MSIE_applyCommand(cmdID.toLowerCase());
                break;
            default:
                this._doc.execCommand(cmdID, UI, param);
                break;
        }

        this.onContentChanged();

        if(!Sys.Extended.UI.HtmlEditor.isIE) {
            sel = this._getSelection();
            range = this._createRange(sel);

            this._removeAllRanges(sel);

            this._selectRange(sel, range);
            this.focusEditor();
        }

        var editor = this;
        setTimeout(function() {
            editor._editPanel.updateToolbar();
        }, 0);
    },

    MSIE_indent: function(increase) {
        return (Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.MSIE_indent))(increase);
    },

    MSIE_justify: function(textAlign, addParameter, addParameter1) {
        return (Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.MSIE_justify))(textAlign, addParameter, addParameter1);
    },

    MSIE_list: function(listTg) {
        return (Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.MSIE_list))(listTg);
    },

    getSelectionAfterOperation: function(paragraphs) {
        return (Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.getSelectionAfterOperation))(paragraphs);
    },

    setSelectionAfterOperation: function(pars, needJoiner) {
        return (Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.setSelectionAfterOperation))(pars, needJoiner);
    },

    get_paragraphs: function() {
        return (Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.get_paragraphs))();
    },

    getPseudoP: function() {
        return (Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.getPseudoP))();
    },

    getPseudoP_Recur: function(lPoint, rPoint, r_level) {
        return (Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.getPseudoP_Recur))(lPoint, rPoint, r_level);
    },

    unWrap: function(element, pars) {
        return (Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.unWrap))(element, pars);
    },

    tryUnWrap: function(element, pars, force) {
        return (Function.createDelegate(this, Sys.Extended.UI.HtmlEditor.tryUnWrap))(element, pars, force);
    },

    MSIE_applyCommand: function(cmd, par) {
        var selectedHTML = (!Sys.Extended.UI.HtmlEditor.isIE) ? Sys.Extended.UI.HtmlEditor.Trim(this.getSelectedHTML()) : "";

        if(this.isControl())
            return;

        var sel = this._getSelection(),
            range = this._createRange(sel),
            savedRange = (Sys.Extended.UI.HtmlEditor.isIE) ? [range.boundingLeft, range.boundingTop] : [range.startContainer, range.startOffset],
            notEmpty = (Sys.Extended.UI.HtmlEditor.isIE && range.text.length > 0) || (!Sys.Extended.UI.HtmlEditor.isIE && selectedHTML.length > 0);

        var cssStyle = { name: "none", value: "none" };
        switch(cmd.toLowerCase()) {
            case "bold":
                cssStyle = { name: "font-weight", value: "bold", repl: false };
                break;
            case "italic":
                cssStyle = { name: "font-style", value: "italic", repl: false };
                break;
            case "underline":
                cssStyle = { name: "text-decoration", value: "underline", repl: false };
                break;
            case "strikethrough":
                cssStyle = { name: "text-decoration", value: "line-through", repl: false };
                break;
            case "superscript":
                cssStyle = { name: "vertical-align", value: "super", repl: false };
                break;
            case "subscript":
                cssStyle = { name: "vertical-align", value: "sub", repl: false };
                break;
            case "forecolor":
                cssStyle = { name: "color", value: par, repl: false };
                break;
            case "backcolor":
                cssStyle = { name: "background-color", value: par, repl: false };
                break;
            case "fontname":
                cssStyle = { name: "font-family", value: par, repl: false };
                break;
            case "fontsize":
                cssStyle = { name: "font-size", value: par, repl: false };
                break;
        }

        if(notEmpty) {
            var rng = this._getTextNodeCollection();
            this.MSIE_applyCssStyle(cssStyle, rng, true);
        } else {
            if(this.isControl())
                return;

            var rng = this._tryExpand();

            if(rng.length > 0) {
                this.MSIE_applyCssStyle(cssStyle, rng, false);

                if(Sys.Extended.UI.HtmlEditor.isIE && this.__saveBM__ != null) {
                    sel = this._getSelection();
                    range = this._createRange(sel);
                    range.moveToBookmark(this.__saveBM__);
                    range.select();
                    this.__saveBM__ = null;
                } else {
                    if(this.__saveBM__ != null) {
                        if(this.__saveBM__[0].nodeType == 3) {
                            sel = this._getSelection();
                            range = this._doc.createRange();
                            range.setStart(this.__saveBM__[0], this.__saveBM__[1]);
                            range.setEnd(this.__saveBM__[0], this.__saveBM__[1]);

                            this._removeAllRanges(sel);
                            this._selectRange(sel, range);
                        } else {
                            this._trySelect(this.__saveBM__[0], this.__saveBM__[0]);
                            this.__saveBM__[0].parentNode.removeChild(this.__saveBM__[0]);
                        }

                        this.__saveBM__ = null;
                    }
                }
            } else {
                this._setStyleForTyping(cssStyle);
            }
        }
    },

    MSIE_applyCssStyle: function(cssStyle, rng, selectPrize) {
        var name = cssStyle.name.replace(/\-(\w)/g, function(strMatch, p1) { return p1.toUpperCase(); }),
            value = cssStyle.value,
            repl = cssStyle.repl,
            _detected = false,
            _remove = false;

        this._saveContent();

        var rn = Sys.Extended.UI.HtmlEditor.smartClassName + "_right",
            ln = Sys.Extended.UI.HtmlEditor.smartClassName + "_left";

        var lPoint = this._doc.createElement("SPAN");
        lPoint.id = ln;

        var rPoint = this._doc.createElement("SPAN");
        rPoint.id = rn;

        rng[0].parentNode.insertBefore(lPoint, rng[0]);

        if(rng[rng.length - 1].nextSibling != null)
            rng[rng.length - 1].parentNode.insertBefore(rPoint, rng[rng.length - 1].nextSibling);
        else
            rng[rng.length - 1].parentNode.appendChild(rPoint);

        Sys.Extended.UI.HtmlEditor.unStyle(lPoint);
        Sys.Extended.UI.HtmlEditor.unStyle(rPoint);

        var parentNodes = [];
        for(var i = 0; i < rng.length; i++) {
            var textNode = rng[i],
                par = textNode.parentNode;

            var j;
            for(j = 0; j < parentNodes.length; j++) {
                var parent = parentNodes[j];

                if(parent.parent == par) {
                    parent.textNodes.push(textNode);
                    break;
                }
            }

            if(j == parentNodes.length)
                parentNodes.push({ parent: par, textNodes: [textNode] });
        }

        for(var i = 0; i < parentNodes.length; i++) {
            var parent = parentNodes[i];

            if(parent.textNodes.length > 1) {
                var textNodes = parent.textNodes;

                var lPointT = this._doc.createElement("SPAN"),
                    rPointT = this._doc.createElement("SPAN");

                textNodes[0].parentNode.insertBefore(lPointT, textNodes[0]);

                if(textNodes[textNodes.length - 1].nextSibling != null)
                    textNodes[textNodes.length - 1].parentNode.insertBefore(rPointT, textNodes[textNodes.length - 1].nextSibling);
                else
                    textNodes[textNodes.length - 1].parentNode.appendChild(rPointT);

                Sys.Extended.UI.HtmlEditor._moveTagsUp(lPointT, rPointT);

                lPointT.parentNode.removeChild(lPointT);
                rPointT.parentNode.removeChild(rPointT);
            }
        }

        for(var i = 0; i < rng.length; i++) {
            var textNode = rng[i],
                par = textNode.parentNode,
                _found = false;

            while(par && par.tagName && par.childNodes.length == 1 && Sys.Extended.UI.HtmlEditor.isStyleTag(par.tagName)) {
                var parTag = par.tagName.toUpperCase();

                if(
                ((parTag == "I" || parTag == "EM") && cssStyle.name == "font-style") ||
                ((parTag == "B" || parTag == "STRONG") && cssStyle.name == "font-weight") ||
                ((parTag == "S" || parTag == "STRIKE") && cssStyle.name == "text-decoration") ||
                ((parTag == "U") && cssStyle.name == "text-decoration") ||
                ((parTag == "SUB" || parTag == "SUP") && cssStyle.name == "vertical-align")
                ) {
                    var parSaved = par;
                    par = par.parentNode;

                    while(parSaved.firstChild)
                        par.insertBefore(parSaved.firstChild, parSaved);

                    par.removeChild(parSaved);

                    _found = true;

                    continue;
                } else if(par.style && par.style[name] && par.style[name].length > 0) {
                    var foundCss = par.style[name];

                    if(name.toLowerCase().indexOf("color") >= 0 || name == "fontFamily" || name == "fontSize") {
                        par.style[name] = value;
                    } else {
                        if(repl) {
                            try {
                                par.style[name] = par.style[name] + " " + value;

                                if(foundCss == par.style[name])
                                    par.style[name] = value;
                            } catch(e) {
                                par.style[name] = value;
                            }
                        } else {
                            if(!_detected) {
                                var sv = foundCss.replace(value, "");

                                if(name == "fontWeight" && foundCss.toString() == "700")
                                    sv = "";

                                if(sv == foundCss) {
                                    try {
                                        par.style[name] = par.style[name] + " " + value;

                                        if(foundCss == par.style[name])
                                            par.style[name] = value;
                                    } catch(e) {
                                        par.style[name] = value;
                                    }
                                } else {
                                    par.style[name] = sv.replace(/,/, "");
                                    _remove = true;
                                }

                                _detected = true;
                            } else {
                                if(_remove) {
                                    par.style[name] = foundCss.replace(value, "").replace(/,/, "");
                                } else {
                                    try {
                                        par.style[name] = par.style[name] + " " + value;

                                        if(foundCss == par.style[name])
                                            par.style[name] = value;
                                    } catch(e) {
                                        par.style[name] = value;
                                    }
                                }
                            }
                        }
                    }

                    _found = true;
                }

                par = par.parentNode;
            }

            if(!_found && !_remove) {
                var span;

                span = this._doc.createElement("SPAN");
                span.style[name] = value;

                var parN = textNode.parentNode;
                parN.insertBefore(span, textNode);

                span.appendChild(textNode);
                _detected = true;
            }
        }

        var commonParent = Sys.Extended.UI.HtmlEditor._commonTotalParent(lPoint, rPoint),
            pSibling = commonParent.parent.childNodes.item(commonParent.indexFirst).previousSibling,
            nSibling = commonParent.parent.childNodes.item(commonParent.indexLast).nextSibling;

        lPoint.parentNode.removeChild(lPoint);
        rPoint.parentNode.removeChild(rPoint);

        var indexFirst = 0,
            indexLast = commonParent.parent.childNodes.length;

        if(pSibling != null)
            indexFirst = Sys.Extended.UI.HtmlEditor.__getIndex(pSibling);

        if(nSibling != null) {
            indexLast = Sys.Extended.UI.HtmlEditor.__getIndex(nSibling) + 1;

            if(indexLast < commonParent.parent.childNodes.length) {
                if(nSibling.nodeType == 3) {
                    indexLast++;
                } else if(nSibling.nodeType == 1) {
                    var tag = nSibling.tagName.toUpperCase();

                    if(tag != "TR" && tag != "TD" && tag != "LI")
                        indexLast++;
                }
            }
        }

        Sys.Extended.UI.HtmlEditor.spanJoiner(commonParent.parent, this._doc, indexFirst, indexLast);

        var editor = this;
        if(selectPrize)
            editor._selectRng(rng);

        setTimeout(function() {
            if(!Sys.Extended.UI.HtmlEditor.isIE)
                editor.focusEditor();

            editor._editPanel.updateToolbar();
        }, 0);
    },

    _tryExpand: function(prize) {
        var result = [],
            selectedHTML,
            notEmpty;

        var sel = this._getSelection(),
            range = this._createRange(sel),
            sel1,
            range1;

        var rn = Sys.Extended.UI.HtmlEditor.smartClassName + "_right_add",
            ln = Sys.Extended.UI.HtmlEditor.smartClassName + "_left_add",
            mn = Sys.Extended.UI.HtmlEditor.smartClassName + "_middle_add";

        if(Sys.Extended.UI.HtmlEditor.isIE && typeof prize == "undefined") {
            range.execCommand('bold');
            this.__saveBM__ = range.getBookmark();
            range.execCommand('bold');
        }

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            var mn_element = null,
                mn_span_text = "<span id=" + mn + "></span>",
                save_range = range.duplicate();

            try {
                range.pasteHTML(mn_span_text);
            } catch(ex) { }

            mn_element = this._doc.getElementById(mn);
            if(mn_element == null)
                return [];

            if(typeof prize != "undefined")
                this.__saveBM__ = mn_element;

            if(mn_element.nextSibling != null && !Sys.Extended.UI.HtmlEditor.isInlineElement(mn_element.nextSibling)) {
                mn_element.parentNode.removeChild(mn_element);

                return [];
            }

            range.expand('word');
            range.select();

            if(range.text.length == 0) {
                mn_element.parentNode.removeChild(mn_element);
                save_range.select();

                return [];
            }

            var re = new RegExp(mn_span_text, "ig");
            if(!re.test(range.htmlText.replace(/[\n\r]/g, ""))) {
                mn_element.parentNode.removeChild(mn_element);
                save_range.select();

                return [];
            }

            re = new RegExp(mn_span_text + "(</span>|&nbsp;|[\\s])*$", "ig");
            if(re.test(range.htmlText.replace(/[\n\r]/g, ""))) {
                mn_element.parentNode.removeChild(mn_element);
                save_range.select();

                return [];
            }

            while(range.text.length > 0 && range.text.substr(range.text.length - 1, 1) == " ") {
                range.moveEnd('character', -1);
                range.select();

                if(range.text.length == 0) {
                    mn_element.parentNode.removeChild(mn_element);
                    save_range.select();

                    return [];
                }
            }


            if(typeof prize == "undefined")
                mn_element.parentNode.removeChild(mn_element);

            return this._getTextNodeCollection();
        }


        function wordBound(c) {
            var re = /[\d\w]/;

            if(re.test(c))
                return false;

            re = /[\u0080-\u024F]/;
            if(re.test(c))
                return false;

            re = /[\u0370-\u2000]/;
            if(re.test(c))
                return false;

            return true;
        }

        if(!this.insertHTML("<span id='" + ln + "'></span><span id='" + mn + "'></span><span id='" + rn + "'></span>"))
            return [];

        var lPoint = this._doc.getElementById(ln),
            rPoint = this._doc.getElementById(rn),
            mPoint = this._doc.getElementById(mn);

        Sys.Extended.UI.HtmlEditor.positionInParagraph(lPoint, lPoint.previousSibling, true, lPoint.parentNode, wordBound);
        try {
            this._trySelect(lPoint, rPoint);
        } catch(ex) { }

        sel1 = this._getSelection();
        range1 = this._createRange(sel1);
        selectedHTML = (!Sys.Extended.UI.HtmlEditor.isIE) ? Sys.Extended.UI.HtmlEditor.Trim(this.getSelectedHTML()) : "";
        notEmpty = (Sys.Extended.UI.HtmlEditor.isIE && range1.text.length > 0) || (!Sys.Extended.UI.HtmlEditor.isIE && selectedHTML.length > 0);

        if(!notEmpty || this._getTextNodeCollection().length == 0) {
            var text1 = this._doc.createTextNode("");

            lPoint.parentNode.insertBefore(text1, lPoint);
            lPoint.parentNode.removeChild(lPoint);
            rPoint.parentNode.removeChild(rPoint);
            mPoint.parentNode.removeChild(mPoint);

            var range = this._doc.createRange();
            range.setStart(text1, 0);
            range.setEnd(text1, 0);
            range.setStart(text1, 0);
            range.setEnd(text1, 0);

            this._removeAllRanges(sel);
            this._selectRange(sel, range);

            return [];
        }

        rPoint.parentNode.insertBefore(lPoint, mPoint);

        Sys.Extended.UI.HtmlEditor.positionInParagraph(rPoint, rPoint.nextSibling, false, rPoint.parentNode, wordBound);
        this._trySelect(lPoint, rPoint);

        sel1 = this._getSelection();
        range1 = this._createRange(sel1);
        selectedHTML = (!Sys.Extended.UI.HtmlEditor.isIE) ? Sys.Extended.UI.HtmlEditor.Trim(this.getSelectedHTML()) : "";
        notEmpty = (Sys.Extended.UI.HtmlEditor.isIE && range1.text.length > 0) || (!Sys.Extended.UI.HtmlEditor.isIE && selectedHTML.length > 0);

        if(!notEmpty || this._getTextNodeCollection().length == 0) {
            var text1 = this._doc.createTextNode("");

            lPoint.parentNode.insertBefore(text1, lPoint);
            lPoint.parentNode.removeChild(lPoint);
            rPoint.parentNode.removeChild(rPoint);
            mPoint.parentNode.removeChild(mPoint);

            var range = this._doc.createRange();
            range.setStart(text1, 0);
            range.setEnd(text1, 0);
            range.setStart(text1, 0);
            range.setEnd(text1, 0);

            this._removeAllRanges(sel);
            this._selectRange(sel, range);

            return [];
        }

        Sys.Extended.UI.HtmlEditor.positionInParagraph(lPoint, lPoint.previousSibling, true, lPoint.parentNode, wordBound);
        this._trySelect(lPoint, rPoint);
        sel1 = this._getSelection();
        range1 = this._createRange(sel1);
        selectedHTML = (!Sys.Extended.UI.HtmlEditor.isIE) ? Sys.Extended.UI.HtmlEditor.Trim(this.getSelectedHTML()) : "";
        notEmpty = (Sys.Extended.UI.HtmlEditor.isIE && range1.text.length > 0) || (!Sys.Extended.UI.HtmlEditor.isIE && selectedHTML.length > 0);

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            if(typeof prize != "undefined")
                this.__saveBM__ = mPoint;
            else
                mPoint.parentNode.removeChild(mPoint);
        } else {
            this.__saveBM__ = [mPoint, 0];
        }

        if(notEmpty)
            result = this._getTextNodeCollection();

        lPoint.parentNode.removeChild(lPoint);
        rPoint.parentNode.removeChild(rPoint);

        return result;
    },

    _setStyleForTyping: function(cssStyle) {
        var name = cssStyle.name.replace(/\-(\w)/g, function(strMatch, p1) { return p1.toUpperCase(); }),
            value = cssStyle.value,
            repl = cssStyle.repl;

        if(this._StyleForTyping == null)
            this._StyleForTyping = [];

        var n_arr = [],
            needApply = true;

        for(var i = 0; i < this._StyleForTyping.length; i++) {
            var i_name = this._StyleForTyping[i].name.replace(/\-(\w)/g, function(strMatch, p1) { return p1.toUpperCase(); }),
                i_value = this._StyleForTyping[i].value;

            if(!(i_name == name && (i_value == value || repl)))
                n_arr.push(this._StyleForTyping[i]);
            else
                needApply = false;
        }

        this._StyleForTyping = n_arr;
        if(needApply)
            this._StyleForTyping.push(cssStyle);
    },

    _trySelect: function(lPoint, rPoint) {
        var sel = this._getSelection(),
            text1 = null,
            text2 = null;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            sel.empty();
            sel = this._getSelection();

            var range1 = this._createRange(sel),
                range2 = this._createRange(sel);

            try {
                if(lPoint != null)
                    range1.moveToElementText(lPoint);
                if(rPoint != null)
                    range2.moveToElementText(rPoint);

                if(lPoint != null && rPoint != null) {
                    range1.setEndPoint("EndToEnd", range2);
                    range1.select();
                } else if(lPoint != null)
                    range1.select();
                else if(rPoint != null)
                    range2.select();

            } catch(e) { }
        } else {
            try {
                text1 = this._doc.createTextNode("");
                text2 = this._doc.createTextNode("");

                lPoint.parentNode.insertBefore(text1, lPoint);
                rPoint.parentNode.insertBefore(text2, rPoint);

                var range = this._doc.createRange();
                range.setStart(text1, 0);
                range.setEnd(text2, 0);

                this._removeAllRanges(sel);
                this._selectRange(sel, range);
            } catch(e) { }
        }
    },

    getSelectedHTML: function() {
        var sel = this._getSelection(),
            range = this._createRange(sel),
            existing = null;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            existing = range.htmlText;
        } else {
            if(Sys.Extended.UI.HtmlEditor.isSafari && (sel.type == "Caret" || sel.type == "None")) {
                existing = "";
            } else {
                if(Sys.Extended.UI.HtmlEditor.isSafari)
                    if(range.cloneContents() == null)
                        return "";

                existing = Sys.Extended.UI.HtmlEditor.getHTML(range.cloneContents(), false);
            }
        }

        return existing;
    },

    _queryCommandState: function(cmdID) {
        var obj = this._rangeStartEnd();
        if(obj == null)
            return false;

        try {
            var cssStyle = { name: "none", value: "none" };

            switch(cmdID.toLowerCase()) {
                case "bold":
                    cssStyle = { name: "font-weight", value: "bold" };
                    break;
                case "italic":
                    cssStyle = { name: "font-style", value: "italic" };
                    break;
                case "underline":
                    cssStyle = { name: "text-decoration", value: "underline" };
                    break;
                case "strikethrough":
                    cssStyle = { name: "text-decoration", value: "line-through" };
                    break;
                case "superscript":
                    cssStyle = { name: "vertical-align", value: "super" };
                    break;
                case "subscript":
                    cssStyle = { name: "vertical-align", value: "sub" };
                    break;
            }

            var el1 = obj.start,
                el2 = obj.end,
                cs1 = Sys.Extended.UI.HtmlEditor.getStyle(el1, cssStyle.name).toString().toLowerCase(),
                cs2 = Sys.Extended.UI.HtmlEditor.getStyle(el2, cssStyle.name).toString().toLowerCase();

            if(cssStyle.name == "font-weight" && cs1 == "700")
                cs1 = "bold";
            if(cssStyle.name == "font-weight" && cs2 == "700")
                cs2 = "bold";

            if(/MSIE (5|6)/.test(navigator.userAgent) && cmdID.toLowerCase() == "strikethrough" && (cs1 == "underline" || cs2 == "underline")) {
                while(el1 && Sys.Extended.UI.HtmlEditor.isStyleTag(el1.tagName)) {
                    if(el1.style.textDecoration.indexOf("line-through") >= 0) {
                        cs1 = el1.style.textDecoration;

                        break;
                    }

                    el1 = el1.parentNode;
                }

                while(el2 && Sys.Extended.UI.HtmlEditor.isStyleTag(el2.tagName)) {
                    if(el2.style.textDecoration.indexOf("line-through") >= 0) {
                        cs2 = el2.style.textDecoration;

                        break;
                    }

                    el2 = el2.parentNode;
                }
            }

            if(Sys.Extended.UI.HtmlEditor.isSafari && (cmdID.toLowerCase() == "strikethrough" || cmdID.toLowerCase() == "underline")) {
                var cmdl = cmdID.toLowerCase();
                if(cmdl == "strikethrough")
                    cmdl = "line-through";

                while(el1 && Sys.Extended.UI.HtmlEditor.isStyleTag(el1.tagName)) {
                    if(el1.style.textDecoration.indexOf(cmdl) >= 0) {
                        cs1 = el1.style.textDecoration;

                        break;
                    }

                    el1 = el1.parentNode;
                }

                while(el2 && Sys.Extended.UI.HtmlEditor.isStyleTag(el2.tagName)) {
                    if(el2.style.textDecoration.indexOf(cmdl) >= 0) {
                        cs2 = el2.style.textDecoration;

                        break;
                    }

                    el2 = el2.parentNode;
                }
            }

            var ret = (cs1.indexOf(cssStyle.value) >= 0) && (cs2.indexOf(cssStyle.value) >= 0);

            if(this._StyleForTyping != null && this._StyleForTyping.length > 0) {
                for(var i = 0; i < this._StyleForTyping.length; i++) {
                    var curCss = this._StyleForTyping[i];

                    if(curCss.name == cssStyle.name && curCss.value == cssStyle.value) {
                        ret = !ret;

                        break;
                    }
                }
            }

            return ret;
        } catch(ex) {
            return false;
        }
    },

    _textAlignState: function(value) {
        var obj = this._rangeStartEnd();
        if(obj == null)
            return false;

        try {
            var cs1 = this._textAlignStateSingle(obj.start),
                cs2 = this._textAlignStateSingle(obj.end);

            return (cs1 == value && cs2 == value);
        } catch(ex) {
            return false;
        }
    },

    _textAlignStateSingle: function(el) {
        while(el && Sys.Extended.UI.HtmlEditor.isStyleTag(el.tagName))
            el = el.parentNode;

        if(el != null) {
            var tagName = el.tagName.toUpperCase();
            if(tagName == "P" || tagName == "DIV")
                return el.style.textAlign.toLowerCase();
        }

        return null;
    },

    _rangeStartEnd: function() {
        if(this.isControl())
            return null;

        try {
            var sel = this._getSelection(),
                range = this._createRange(sel),
                el1 = null,
                el2 = null;

            if(!Sys.Extended.UI.HtmlEditor.isIE) {
                function __getText__(par, first) {
                    var ret = null;

                    while(ret == null) {
                        if(par.nodeType == 3) {
                            if(first && range.startContainer != range.endContainer && range.startOffset == par.length && par.nextSibling)
                                ret = __getText__(par.nextSibling, first);
                            else if(!first && range.startContainer != range.endContainer && range.endOffset == 0 && par.previousSibling)
                                ret = __getText__(par.previousSibling, first);
                            else
                                ret = par;
                        } else {
                            if((first ? par.firstChild : par.lastChild) == null)
                                ret = null;
                            else
                                ret = __getText__(first ? par.firstChild : par.lastChild, first);
                        }

                        if(ret == null) {
                            par = first ? par.nextSibling : par.previousSibling;
                            if(par == null)
                                return null;
                        } else {
                            return ret;
                        }
                    }
                }

                var parent = this._getParent(range);

                if(parent.nodeType != 3 && range.startContainer == range.endContainer &&
                    range.startOffset == range.endOffset &&
                    range.startContainer.childNodes.item(range.startOffset).tagName &&
                    Sys.Extended.UI.HtmlEditor.isStyleTag(range.startContainer.childNodes.item(range.startOffset).tagName)
                ) {
                    return { start: range.startContainer.childNodes.item(range.startOffset), end: range.startContainer.childNodes.item(range.startOffset) };
                }

                el1 = __getText__(range.startContainer, true);
                if(el1 != null && el1.parentNode != null)
                    el1 = el1.parentNode;
                if(el1 == null)
                    el1 = range.startContainer;

                el2 = __getText__(range.endContainer, false);
                if(el2 != null && el2.parentNode != null)
                    el2 = el2.parentNode;
                if(el2 == null)
                    el2 = range.endContainer;
            } else {
                if(range.text.length == 0) {
                    el1 = el2 = this._getParent(range);
                } else {
                    var rn = Sys.Extended.UI.HtmlEditor.smartClassName + "_right_marker",
                        ln = Sys.Extended.UI.HtmlEditor.smartClassName + "_left_marker";

                    // get bound ranges
                    var r_left = range.duplicate(),
                        r_right = range.duplicate();

                    r_left.setEndPoint("EndToStart", range);
                    r_right.setEndPoint("StartToEnd", range);

                    // insert markers
                    r_right.pasteHTML("<span id='" + rn + "'/>");
                    r_left.pasteHTML("<span id='" + ln + "'/>");

                    // get markers
                    var lPoint = this._doc.getElementById(ln),
                        rPoint = this._doc.getElementById(rn);

                    el1 = lPoint.parentNode;
                    el2 = rPoint.parentNode;

                    lPoint.parentNode.removeChild(lPoint);
                    rPoint.parentNode.removeChild(rPoint);
                }
            }

            return { start: el1, end: el2 };
        } catch(ex) {
            return null;
        }
    },

    rtlState: function() {
        if(this._doc.body.style.direction && this._doc.body.style.direction == "rtl")
            return true;

        return false;
    },

    openWait: function() {
        this._editPanel.openWait();
    },

    closeWait: function() {
        this._editPanel.closeWait();
    }
}

Sys.Extended.UI.HtmlEditor.DesignPanel.ScriptRecover = function() {
    this.scriptsArray = [];
    this.scriptsArray_index = -1;

    this.regReplScript1 = function(p0, p1) {
        this.scriptsArray.push(p1);

        return "";
    }

    this.regReplFromScript = function(p0, p1, p2, p3) {
        return p1.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
    }

    this.regReplFromScript1 = function(p0, p1, p2, p3) {
        this.scriptsArray_index++;
        var mmm;

        if(!Sys.Extended.UI.HtmlEditor.isIE)
            mmm = this.scriptsArray[this.scriptsArray_index].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
        else
            mmm = this.scriptsArray[this.scriptsArray_index];

        return p1 + mmm + p3;
    }
}

Sys.Extended.UI.HtmlEditor.DesignPanel.registerClass("Sys.Extended.UI.HtmlEditor.DesignPanel", Sys.Extended.UI.HtmlEditor.ModePanel);