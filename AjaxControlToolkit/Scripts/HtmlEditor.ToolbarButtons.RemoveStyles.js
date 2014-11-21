Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveStyles = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveStyles.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveStyles.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveStyles.callBaseMethod(this, "callMethod"))
            return false;

        var editor = this._designPanel;

        setTimeout(function() {
            var selectedHTML = (!Sys.Extended.UI.HtmlEditor.isIE) ? Sys.Extended.UI.HtmlEditor.Trim(editor.getSelectedHTML()) : "",
                sel = editor._getSelection(),
                range = editor._createRange(sel),
                rng = null,
                expanded = false;

            if(!editor.isControl() && ((Sys.Extended.UI.HtmlEditor.isIE && range.text.length > 0) || (!Sys.Extended.UI.HtmlEditor.isIE && selectedHTML.length > 0))) {
                rng = editor._getTextNodeCollection();
            } else {
                rng = editor._tryExpand();
                expanded = true;
            }

            if(rng != null && rng.length > 0) {
                var changed = false, // document tree changing indicator
                    _found = true, // style tag deleting indicator
                    _text = null;

                editor._saveContent(); // for undo

                var span1 = editor._doc.createElement("span");
                span1.id = "_left_";

                var span2 = editor._doc.createElement("span");
                span2.id = "_right_";

                var par1 = rng[0].parentNode,
                    par2 = rng[rng.length - 1].parentNode;

                par1.insertBefore(span1, rng[0]);

                if(rng[rng.length - 1].nextSibling)
                    par2.insertBefore(span2, rng[rng.length - 1].nextSibling);
                else
                    par2.appendChild(span2);

                while(_found) { // while there were tags' deletings
                    _found = false; // reset the indicator

                    for(var i = 0; i < rng.length; i++) { // inspect all TextNodes
                        var par = rng[i].parentNode;

                        // if the TextNode still have a parent 
                        if(par) {
                            // it's the first node in his parent
                            if(rng[i].previousSibling == null && rng[i].nextSibling == null) {
                                var tag = par.tagName.toUpperCase();

                                // parent can be a style tag only
                                if(Sys.Extended.UI.HtmlEditor.isStyleTag(tag) && (tag != "A") && (par.className != Sys.Extended.UI.HtmlEditor.smartClassName || tag.substr(0, 1) == "H")) {
                                    // it is what we need !

                                    // have the parent attributes?
                                    var _attrs = Sys.Extended.UI.HtmlEditor.differAttr(par, ["class", "color", "face", "size"]);

                                    // changes will be now
                                    changed = true;

                                    // if there aren't attributes - we can delete the tag
                                    // and move his chieldren to parent
                                    if(_attrs.length == 0) {
                                        var parent = par.parentNode,
                                            el = (par.firstChild) ? par.firstChild : null,
                                            P = null;

                                        if(tag.toUpperCase().substr(0, 1) == "H" && (Sys.Extended.UI.HtmlEditor.isIE)) {
                                            P = editor._doc.createElement("p");
                                            P.className = Sys.Extended.UI.HtmlEditor.smartClassName;

                                            parent.insertBefore(P, par);

                                            while(par.firstChild) // chieldren moving
                                                P.appendChild(par.firstChild);
                                        } else {
                                            while(par.firstChild) // chieldren moving
                                                parent.insertBefore(par.firstChild, par);

                                            if(tag.toUpperCase().substr(0, 1) == "H") {
                                                var br = editor._doc.createElement("br");
                                                parent.insertBefore(br, par);
                                            }
                                        }

                                        parent.removeChild(par);
                                        _found = true; // set indicator
                                    } else { // we can't remove the tag - cleaning only
                                        var parent = par.parentNode;

                                        // create the new same tag
                                        var nel = editor._doc.createElement(tag);

                                        // set it's attributes
                                        for(var j = 0; j < _attrs.length; j++)
                                            nel.setAttribute(_attrs[j][0], _attrs[j][1]);

                                        // insert the clone instead the old tag
                                        // (no ClassName, no Styles)

                                        parent.insertBefore(nel, par);
                                        while(par.firstChild)
                                            nel.appendChild(par.firstChild);

                                        parent.removeChild(par);
                                    }
                                }
                            }
                        }
                    }
                }

                for(var i = 0; i < rng.length; i++) { // inspect all TextNodes
                    var el = rng[i],
                        _prn = (rng[i].parentNode != null && typeof rng[i].parentNode != "undefined") ? rng[i].parentNode : null;

                    // if the TextNode still have a parent 
                    if(_prn) {
                        // now try to cut this Text node from arround style tags
                        var _fnd = null;

                        // look for the upper style parent
                        while(_prn && _prn.tagName && _prn.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HtmlEditor.isStyleTag(_prn.tagName) && (_prn.tagName.toUpperCase() != "A")
                               && Sys.Extended.UI.HtmlEditor.differAttr(_prn, ["class", "color", "face", "size"]).length == 0) {
                            _fnd = _prn;
                            _prn = _prn.parentNode;
                        }

                        // if such parent is found
                        if(_fnd) {
                            // changes will be now
                            changed = true;

                            function diver(add, el, rpr, before) {
                                var par = rpr.cloneNode(false);

                                if(add) {
                                    if(add.push && typeof add.push == "function")
                                        for(var iii = 0; iii < add.length; iii++)
                                            par.appendChild(add[iii]);
                                    else
                                        par.appendChild(add);
                                }

                                while(el) {
                                    var elSibling = before ? el.previousSibling : el.nextSibling;

                                    if(el.nodeType == 1 || (el.nodeType == 3 && Sys.Extended.UI.HtmlEditor.Trim("" + el.data + "").length > 0)) {
                                        if(el.nodeType == 1) {
                                            if(Sys.Extended.UI.HtmlEditor.isStyleTag(el.tagName) && (el.tagName.toUpperCase() != "A") && (!el.id || (el.id != "_left_" && el.id != "_right_")))
                                                Sys.Extended.UI.HtmlEditor.spanJoiner(el);

                                            if(Sys.Extended.UI.HtmlEditor.isStyleTag(el.tagName) && el.childNodes.length == 0 && (!el.id || (el.id != "_left_" && el.id != "_right_")))
                                                el = null;
                                        }

                                        if(el)
                                            if(par.childNodes.length == 0 || !before)
                                                par.appendChild(el);
                                            else
                                                par.insertBefore(el, par.firstChild);
                                    }
                                    el = elSibling;
                                }

                                if(par.childNodes.length == 0) {
                                    delete par;
                                    par = null;
                                } else if(par.childNodes.length == 1 && par.firstChild.nodeType == 3 && ("" + par.firstChild.data + "").length == 0) {
                                    delete par;
                                    par = null;
                                } else {
                                    if(Sys.Extended.UI.HtmlEditor.isStyleTag(par.tagName)) {
                                        var elNumber = par.childNodes.length;
                                        for(var cnt = 0; cnt < par.childNodes.length; cnt++) {
                                            var inn = par.childNodes.item(cnt);

                                            if(inn.nodeType == 1 && !Sys.Extended.UI.HtmlEditor.isStyleTag(inn.tagName))
                                                elNumber--;
                                        }

                                        if(elNumber == 0) {
                                            var parr = [];
                                            while(par.firstChild) {
                                                var inn = par.removeChild(par.firstChild);
                                                parr.push(inn);
                                            }
                                            par = parr;
                                        }
                                    }
                                }

                                if(rpr == _fnd)
                                    return par;
                                else
                                    return diver(par, before ? rpr.previousSibling : rpr.nextSibling, rpr.parentNode, before);
                            };

                            _prn = el.parentNode;

                            if(el.previousSibling == null && el.nextSibling == null &&
                                _prn && _prn.tagName && _prn.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HtmlEditor.isStyleTag(_prn.tagName) &&
                                Sys.Extended.UI.HtmlEditor.differAttr(_prn, ["class", "color", "face", "size"]).length > 0)
                                el = _prn;


                            // create neibouring style tags for this Text node
                            var p1 = diver(null, el.previousSibling, el.parentNode, true),
                                p2 = diver(null, el.nextSibling, el.parentNode, false);

                            var par = _fnd.parentNode;
                            if(p1) {
                                if(p1.push && typeof p1.push == "function") {
                                    for(var iii = 0; iii < p1.length; iii++)
                                        par.insertBefore(p1[iii], _fnd);
                                } else {
                                    par.insertBefore(p1, _fnd);
                                }

                                if(Sys.Extended.UI.HtmlEditor.isIE) {
                                    span1 = editor._doc.getElementById("_left_");
                                    span2 = editor._doc.getElementById("_right_");
                                }
                            }

                            par.insertBefore(el, _fnd);
                            if(p2) {
                                if(p2.push && typeof p2.push == "function") {
                                    for(var iii = 0; iii < p2.length; iii++)
                                        par.insertBefore(p2[iii], _fnd);
                                } else {
                                    par.insertBefore(p2, _fnd);
                                }

                                if(Sys.Extended.UI.HtmlEditor.isIE) {
                                    span1 = editor._doc.getElementById("_left_");
                                    span2 = editor._doc.getElementById("_right_");
                                }
                            }

                            par.removeChild(_fnd);
                        }
                    }
                }

                if(expanded) {
                    if(Sys.Extended.UI.HtmlEditor.isIE && editor.__saveBM__ != null) {
                        try {
                            var ppp = span1.parentNode;
                            ppp.removeChild(span1);

                            while(ppp && ppp.childNodes.length == 0) {
                                ppp.parentNode.removeChild(ppp);
                                ppp = ppp.parentNode;
                            }

                            ppp = span2.parentNode;
                            ppp.removeChild(span2);

                            while(ppp && ppp.childNodes.length == 0) {
                                ppp.parentNode.removeChild(ppp);
                                ppp = ppp.parentNode;
                            }

                            span1 = null;
                            span2 = null;
                        } catch(e) { }

                        var sel = editor._getSelection();
                        var range = editor._createRange(sel);

                        range.moveToBookmark(editor.__saveBM__);
                        range.select();

                        editor.__saveBM__ = null;
                    } else if(editor.__saveBM__ != null) {
                        if(editor.__saveBM__[0].nodeType == 3) {
                            var sel = editor._getSelection();
                            var range = editor._doc.createRange();

                            range.setStart(editor.__saveBM__[0], editor.__saveBM__[1]);
                            range.setEnd(editor.__saveBM__[0], editor.__saveBM__[1]);

                            editor._removeAllRanges(sel);
                            editor._selectRange(sel, range);
                        } else {
                            editor._trySelect(editor.__saveBM__[0], editor.__saveBM__[0]);
                            editor.__saveBM__[0].parentNode.removeChild(editor.__saveBM__[0]);
                        }

                        editor.__saveBM__ = null;
                    }
                } else if(!Sys.Extended.UI.HtmlEditor.isIE) {
                    rng = [];
                    var _found = false;

                    function _diver(_point, prize) {
                        while(_point) {
                            if(_point == span2) {
                                _found = true;
                                return;
                            }

                            if(_point.nodeType == 3) {
                                while(_point.nextSibling && _point.nextSibling.nodeType == 3) {
                                    _point.data = "" + _point.data + "" + _point.nextSibling.data + "";
                                    _point.parentNode.removeChild(_point.nextSibling);
                                }

                                if(Sys.Extended.UI.HtmlEditor.Trim("" + _point.data + "").length > 0)
                                    rng.push(_point);
                            } else
                                _diver(_point.firstChild, false);

                            if(_found)
                                return;

                            var _save = _point.parentNode;

                            if(prize)
                                while(_point && _point.nextSibling == null)
                                    _point = _point.parentNode;

                            _point = _point.nextSibling;
                        }
                    }

                    _diver(span1, true);

                    range = editor._doc.createRange();
                    range.setStart(rng[0], 0);
                    range.setEnd(rng[rng.length - 1], ("" + rng[rng.length - 1].data + "").length);

                    editor._removeAllRanges(sel);
                    editor._selectRange(sel, range);
                } else {
                    try {
                        sel = editor._getSelection();
                        var range1 = editor._createRange(sel);
                        var range2 = editor._createRange(sel);

                        range1.moveToElementText(span1);
                        range2.moveToElementText(span2);

                        range1.setEndPoint("EndToEnd", range2);
                        range1.select();
                    } catch(e) { }
                }

                try {
                    var ppp;
                    if(span1 != null) {
                        ppp = span1.parentNode;
                        ppp.removeChild(span1);

                        while(ppp && ppp.childNodes.length == 0) {
                            ppp.parentNode.removeChild(ppp);
                            ppp = ppp.parentNode;
                        }
                    }

                    if(span2 != null) {
                        ppp = span2.parentNode;
                        ppp.removeChild(span2);

                        while(ppp && ppp.childNodes.length == 0) {
                            ppp.parentNode.removeChild(ppp);
                            ppp = ppp.parentNode;
                        }
                    }
                } catch(e) { }

                editor.onContentChanged();
                editor._editPanel.updateToolbar();
            }
        }, 0);
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveStyles.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveStyles", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);