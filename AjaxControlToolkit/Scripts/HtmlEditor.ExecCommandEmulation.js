Sys.Extended.UI.HtmlEditor.MSIE_list = function(listTg) {
    var paragraphs = this.get_paragraphs(),
        pars = this.getSelectionAfterOperation(paragraphs),
        currentParent = null,
        collectedParagraphs = [],
        editor = this,
        commonList = null,
        commonListItems = [],
        listTag = listTg.toUpperCase(),
        needJoiner = false;

    function operateList() {
        if(commonList != null) {
            var newList;

            newList = commonList.cloneNode(false);
            commonList.parentNode.insertBefore(newList, commonList);

            while(commonList.firstChild != commonListItems[0])
                newList.appendChild(commonList.firstChild);

            if(newList.firstChild == null)
                newList.parentNode.removeChild(newList);

            if(commonList.tagName.toUpperCase() == listTag) {
                for(var i = 0; i < commonListItems.length; i++) {
                    var element = commonListItems[i];

                    if(element.nodeType == 1 && element.tagName && element.tagName.toUpperCase() == "LI") {
                        var good = false;
                        commonList.parentNode.insertBefore(element, commonList);

                        if(element.style.textAlign == "")
                            element.style.textAlign = commonList.style.textAlign;

                        if(commonList.childNodes.length == 0 && i == commonListItems.length - 1) {
                            commonList.parentNode.removeChild(commonList);
                            commonList = null;
                        }

                        if(element.style.textAlign == "" || (element.style.textAlign.toLowerCase() == "left" && !editor.rtlState()) ||
                            (element.style.textAlign.toLowerCase() == "right" && editor.rtlState())) {

                            good = editor.tryUnWrap(element, pars);
                            if(good)
                                needJoiner = true;
                        }

                        if(!good) {
                            var newP = editor._doc.createElement(editor.dfltBlockElement),
                                attrs = element.attributes;

                            for(var ik = 0; ik < attrs.length; ++ik) {
                                var a = attrs.item(ik);

                                if(!a.specified)
                                    continue;
                                if(a.name.toLowerCase() == "style")
                                    continue;

                                newP.setAttribute(a.name, a.value);
                            }

                            newP.style.cssText = element.style.cssText;
                            if(newP.tagName.toUpperCase() == "P")
                                newP.style.margin = "0px";

                            while(element.firstChild)
                                newP.appendChild(element.firstChild);

                            element.parentNode.insertBefore(newP, element);
                            element.parentNode.removeChild(element);
                        }
                    } else
                        commonList.parentNode.insertBefore(element, commonList);
                }
            } else {
                var newList = editor._doc.createElement(listTag),
                    attrs = commonList.attributes;

                for(var ik = 0; ik < attrs.length; ++ik) {
                    var a = attrs.item(ik);

                    if(!a.specified)
                        continue;
                    if(a.name.toLowerCase() == "style")
                        continue;

                    newList.setAttribute(a.name, a.value);
                }

                newList.style.cssText = commonList.style.cssText;
                commonList.parentNode.insertBefore(newList, commonList);

                for(var i = 0; i < commonListItems.length; i++) {
                    var element = commonListItems[i];
                    newList.appendChild(element);
                }
            }

            if(commonList != null) {
                newList = commonList.cloneNode(false);
                commonList.parentNode.insertBefore(newList, commonList);

                while(commonList.firstChild)
                    newList.appendChild(commonList.firstChild);

                if(newList.firstChild == null)
                    newList.parentNode.removeChild(newList);

                commonList.parentNode.removeChild(commonList);
            }
        }

        commonList = null;
        commonListItems = [];
    }

    function operateCollectedParagraphs() {
        var firstChild = currentParent.firstChild,
            lastChild = currentParent.lastChild,
            parTagName = currentParent.tagName.toUpperCase();

        if( // if all paragraps(only) are in one parent already
            !Sys.Extended.UI.HtmlEditor.isInlineElement(currentParent) &&
            collectedParagraphs[0][0] == firstChild &&
            collectedParagraphs[collectedParagraphs.length - 1][collectedParagraphs[collectedParagraphs.length - 1].length - 1] == lastChild &&
            (parTagName == "OL" || parTagName == "UL" || parTagName == "DL" || parTagName == "LI" ||
            ((parTagName == "P" || parTagName == "DIV" || Sys.Extended.UI.HtmlEditor.isHeader(currentParent)) && parTagName == "LI")
            )
        ) {
            operateList();
            commonListItems = [];

            if(parTagName == "LI") {
                commonList = currentParent.parentNode;
                commonListItems.push(currentParent);
            } else if(parTagName == "P" || parTagName == "DIV" || Sys.Extended.UI.HtmlEditor.isHeader(currentParent)) {
                commonList = currentParent.parentNode.parentNode;
                commonListItems.push(currentParent.parentNode);
            } else {
                commonList = currentParent;

                for(var i = 0; i < collectedParagraphs.length; i++) {
                    var paragraph = collectedParagraphs[i];

                    for(var j = 0; j < paragraph.length; j++)
                        commonListItems.push(paragraph[j]);
                }
            }
            operateList();
        } else {
            if(parTagName == "LI" && (collectedParagraphs.length < paragraphs.length)) {
                if(commonList != currentParent.parentNode) {
                    operateList();
                    commonList = currentParent.parentNode;
                    commonListItems = [];
                }
                commonListItems.push(currentParent);
            } else if(parTagName == "OL" || parTagName == "UL" || parTagName == "DL") {
                operateList();
                commonList = currentParent;
                commonListItems = [];

                for(var i = 0; i < collectedParagraphs.length; i++) {
                    var paragraph = collectedParagraphs[i];

                    for(var j = 0; j < paragraph.length; j++)
                        commonListItems.push(paragraph[j]);
                }
                operateList();
            } else {
                var li = null,
                    list = null;

                function completeLi() {
                    if(li != null)
                        if(li.childNodes == 1 && (li.firstChild == pars[0] || li.firstChild == pars[1])) {
                            li.parentNode.insertBefore(li.firstChild, li);
                            li.parentNode.removeChild(li);
                        }
                    li = null;
                }

                if(commonList != null)
                    operateList();

                var colTagName = "";
                if(collectedParagraphs.length == 1 && collectedParagraphs[0].length == 1 && collectedParagraphs[0][0].nodeType == 1 && collectedParagraphs[0][0].tagName)
                    colTagName = collectedParagraphs[0][0].tagName.toUpperCase();

                if(colTagName == "OL" || colTagName == "UL" || colTagName == "DL") {
                    var element = collectedParagraphs[0][0];

                    commonList = element;
                    commonListItems = [];

                    for(var i = 0; i < element.childNodes.length; i++) {
                        var el = element.childNodes.item(i);
                        commonListItems.push(el);
                    }
                    operateList();
                } else {
                    for(var i = 0; i < collectedParagraphs.length; i++) {
                        var paragraph = collectedParagraphs[i];

                        for(var j = 0; j < paragraph.length; j++) {
                            var element = paragraph[j],
                                elTagName = (element.tagName) ? element.tagName.toUpperCase() : "";

                            if(list == null) {
                                list = editor._doc.createElement(listTag);
                                element.parentNode.insertBefore(list, element);
                            }

                            if(!Sys.Extended.UI.HtmlEditor.isInlineElement(element) && elTagName != "BR") {
                                if(li && li.firstChild)
                                    completeLi();

                                if(li == null) {
                                    li = editor._doc.createElement("LI");
                                    list.appendChild(li);
                                }

                                li.appendChild(element);
                                completeLi();
                            } else {
                                if(li == null) {
                                    li = editor._doc.createElement("LI");
                                    list.appendChild(li);
                                }

                                var actualLength = (paragraph[paragraph.length - 1] == pars[1]) ? paragraph.length - 1 : paragraph.length,
                                    actualStart = (paragraph[0] == pars[0]) ? 1 : 0;

                                if(elTagName == "BR" && j == actualLength - 1 && j == actualStart) {
                                    if(Sys.Extended.UI.HtmlEditor.isIE) {
                                        li.appendChild(editor._doc.createTextNode(String.fromCharCode(160)));
                                        element.parentNode.removeChild(element);
                                    } else
                                        li.appendChild(element);
                                } else
                                    if(elTagName == "BR" && j == actualLength - 1 && j > actualStart)
                                        element.parentNode.removeChild(element);
                                    else
                                        li.appendChild(element);

                                if(elTagName == "BR" && j == paragraph.length - 1) {
                                    completeLi();
                                    li = null;
                                }

                                if(element == pars[1] && j == paragraph.length - 1) {
                                    completeLi();
                                    li = null;
                                }
                            }
                        }

                        if(li && li.firstChild)
                            completeLi();
                    }
                }

                if(list != null) {
                    var aligns = [];
                    for(var j = 0; j < list.childNodes.length; j++)
                        aligns.push(list.childNodes.item(j).style.textAlign);

                    var jj = 1;
                    for(; jj < aligns.length; jj++)
                        if(aligns[jj - 1] != aligns[jj])
                            break;

                    if(jj == aligns.length) {
                        var align = ((aligns[0] == "left" && !editor.rtlState()) || (aligns[0] == "right" && editor.rtlState())) ? "" : aligns[0];

                        for(var j = 0; j < list.childNodes.length; j++)
                            list.childNodes.item(j).style.textAlign = "";

                        list.style.textAlign = align;
                    }
                }

                if(list != null)
                    if(list.parentNode.tagName.toUpperCase() == "P" && list.parentNode.childNodes.length == 1) {
                        var pp = list.parentNode,
                            clone = pp.cloneNode(false);

                        pp.parentNode.insertBefore(list, pp);
                        pp.parentNode.removeChild(pp);

                        if(list.childNodes.length == 1) {
                            var item = list.firstChild;

                            while(item.firstChild)
                                clone.appendChild(item.firstChild);

                            item.appendChild(clone);
                        } else
                            delete clone;
                    }
            }
        }
    }

    for(var i = 0; i < paragraphs.length; i++) {
        var paragraph = paragraphs[i];

        if(paragraph.length > 0) {
            if(paragraph[0].parentNode != currentParent) { // start new collection of paragraps
                if(collectedParagraphs.length > 0)
                    operateCollectedParagraphs();

                collectedParagraphs = [];
                currentParent = paragraph[0].parentNode;
            }

            collectedParagraphs.push(paragraph);
        }
    }

    if(collectedParagraphs.length > 0)
        operateCollectedParagraphs();

    if(commonList != null)
        operateList();

    this.setSelectionAfterOperation(pars, needJoiner);
};

Sys.Extended.UI.HtmlEditor.MSIE_justify = function(textAlign, addParameter, addParameter1) {
    var paragraphs = this.get_paragraphs(),
        pars = this.getSelectionAfterOperation(paragraphs),
        currentParent = null,
        collectedParagraphs = [],
        editor = this,
        force = (typeof addParameter != "undefined" && addParameter) ? true : false,
        remainP = (typeof addParameter1 == "string") ? true : false,
        pTag = (typeof addParameter1 == "string") ? addParameter1 : "",
        needJoiner = false;

    function completeDiv(div) {
        if(div != null)
            if(div.childNodes == 1 && (div.firstChild == pars[0] || div.firstChild == pars[1])) {
                div.parentNode.insertBefore(div.firstChild, div);
                div.parentNode.removeChild(div);
            }
    }

    function operateCollectedParagraphs() {
        var firstChild = currentParent.firstChild,
            lastChild = currentParent.lastChild,
            single = false,
            curTagName;

        if(currentParent.tagName && !Sys.Extended.UI.HtmlEditor.isInlineElement(currentParent) &&
            collectedParagraphs[0][0] == firstChild &&
            collectedParagraphs[collectedParagraphs.length - 1][collectedParagraphs[collectedParagraphs.length - 1].length - 1] == lastChild
        ) {
            curTagName = currentParent.tagName.toUpperCase();

            if(curTagName != "TD" && curTagName != "TH" && curTagName != "FIELDSET" && curTagName != "LEGEND")
                single = true;
        }

        if(single) { // if all paragraps(them only) are in one parent already
            var align = "";

            if(currentParent.getAttribute("align") && currentParent.getAttribute("align").length > 0)
                align = currentParent.getAttribute("align");

            if(currentParent.align && currentParent.align.length > 0)
                align = currentParent.align;

            if(currentParent.style.textAlign && currentParent.style.textAlign.length > 0)
                align = currentParent.style.textAlign;

            currentParent.align = "";
            currentParent.setAttribute("align", "");
            currentParent.removeAttribute("align");

            // can we remove parent element?
            if((curTagName == "DIV" || curTagName == "P" || Sys.Extended.UI.HtmlEditor.isHeader(currentParent)) && textAlign == "left" && force) {
                if(editor.tryUnWrap(currentParent, pars, force))
                    needJoiner = true;
            } else {
                if(textAlign != "remain") {
                    if(!(textAlign == "left" && force) || (curTagName == "LI" && currentParent.parentNode.style.textAlign.length > 0))
                        currentParent.style.textAlign = textAlign;
                    else
                        currentParent.style.textAlign = "";
                }

                if(force)
                    currentParent.style.margin = (curTagName == "P") ? "0px" : "";

                if(curTagName == "LI") {
                    var list = currentParent.parentNode,
                        aligns = [];

                    for(var jn = 0; jn < list.childNodes.length; jn++)
                        if(list.childNodes.item(jn).nodeType == 1)
                            aligns.push(list.childNodes.item(jn).style.textAlign);

                    var jj = 1;
                    for(; jj < aligns.length; jj++)
                        if(aligns[jj - 1] != aligns[jj])
                            break;

                    if(jj == aligns.length) {
                        var align = (aligns[0] == "left" && force) ? "" : aligns[0];

                        for(var j = 0; j < list.childNodes.length; j++)
                            if(list.childNodes.item(j).nodeType == 1) {
                                list.childNodes.item(j).style.textAlign = "";

                                if(force)
                                    list.childNodes.item(j).style.margin = (list.childNodes.item(j).tagName.toUpperCase() == "P") ? "0px" : "";
                            }

                        list.style.textAlign = align;
                    }
                }

                if((curTagName == "DIV" || curTagName == "P" || Sys.Extended.UI.HtmlEditor.isHeader(currentParent))
                    && remainP && pTag.toUpperCase() != curTagName) {
                    var nEl = editor._doc.createElement(pTag),
                        attrs = currentParent.attributes;

                    for(var k = 0; k < attrs.length; ++k) {
                        var a = attrs.item(k);

                        if(!a.specified)
                            continue;
                        if(a.name.toLowerCase() == "style")
                            continue;

                        nEl.setAttribute(a.name, a.value);
                    }

                    nEl.style.cssText = currentParent.style.cssText;

                    while(currentParent.firstChild)
                        nEl.appendChild(currentParent.firstChild);

                    currentParent.parentNode.insertBefore(nEl, currentParent);
                    currentParent.parentNode.removeChild(currentParent);
                }
            }
        } else {
            var div = null;
            for(var i = 0; i < collectedParagraphs.length ; i++) {
                if(!remainP)
                    div = null;

                var paragraph = collectedParagraphs[i];
                for(var j = 0; j < paragraph.length; j++) {
                    var element = paragraph[j],
                        elementTagName = (element.nodeType == 1 && element.tagName) ? element.tagName.toUpperCase() : null;

                    if(elementTagName != null &&
                       (elementTagName == "UL" || elementTagName == "OL" ||
                        elementTagName == "DL" || elementTagName == "DIV" || Sys.Extended.UI.HtmlEditor.isHeader(element) ||
                        elementTagName == "P" || elementTagName == "LI" || elementTagName == "TABLE"
                       )
                    ) {
                        completeDiv(div);
                        div = null;
                        if(textAlign != "remain")
                            if(elementTagName != "TABLE" && !force)
                                element.style.textAlign = textAlign;

                        if(force)
                            element.style.margin = (elementTagName == "P") ? "0px" : "";

                        if(elementTagName == "UL" || elementTagName == "OL" || elementTagName == "DL") {
                            for(var jk = 0; jk < element.childNodes.length; jk++) {
                                var li = element.childNodes.item(jk);

                                if(li.nodeType == 1) {
                                    li.style.textAlign = "";
                                    if(force)
                                        li.style.margin = (li.tagName.toUpperCase() == "P") ? "0px" : "";

                                    for(var kk = 0; kk < li.childNodes.length; kk++) {
                                        var child = li.childNodes.item(kk);

                                        if(child.nodeType == 1 && child.tagName) {
                                            var childTagName = child.tagName.toUpperCase();

                                            if(force)
                                                child.style.margin = (childTagName == "P") ? "0px" : "";

                                            if(childTagName == "DIV" || childTagName == "P" || Sys.Extended.UI.HtmlEditor.isHeader(child))
                                                if(editor.tryUnWrap(child, pars, force))
                                                    needJoiner = true;
                                        }
                                    }
                                }
                            }

                            if(textAlign == "left" && force)
                                element.style.textAlign = "";

                            continue;
                        } else if(elementTagName == "LI") {
                            if(textAlign != "remain")
                                if(!(textAlign == "left" && force) || element.parentNode.style.textAlign.length > 0)
                                    element.style.textAlign = textAlign;
                                else
                                    element.style.textAlign = "";

                            if(force)
                                element.style.margin = (elementTagName == "P") ? "0px" : "";

                            var list = element.parentNode,
                                aligns = [];

                            for(var jn = 0; jn < list.childNodes.length; jn++)
                                if(list.childNodes.item(jn).nodeType == 1)
                                    aligns.push(list.childNodes.item(jn).style.textAlign);

                            var jj = 1;
                            for(; jj < aligns.length; jj++)
                                if(aligns[jj - 1] != aligns[jj])
                                    break;

                            if(jj == aligns.length) {
                                var align = (aligns[0] == "left" && force) ? "" : aligns[0];

                                for(var j = 0; j < list.childNodes.length; j++)
                                    if(list.childNodes.item(j).nodeType == 1) {
                                        list.childNodes.item(j).style.textAlign = "";

                                        if(force)
                                            list.childNodes.item(j).style.margin = (list.childNodes.item(j).tagName.toUpperCase() == "P") ? "0px" : "";
                                    }

                                list.style.textAlign = align;
                            }

                            continue;
                        } else if(elementTagName == "TABLE") {
                            if(textAlign != "remain") {
                                if(!(textAlign == "left" && force))
                                    element.align = textAlign;
                                else {
                                    element.align = "";
                                    element.removeAttribute("align");
                                }
                            }
                        }

                        // can we remove DIV or P ?
                        if((elementTagName == "DIV" || elementTagName == "P" || Sys.Extended.UI.HtmlEditor.isHeader(element)) && textAlign == "left" && force)
                            if(editor.tryUnWrap(element, pars, force))
                                needJoiner = true;

                        if((elementTagName == "DIV" || elementTagName == "P" || Sys.Extended.UI.HtmlEditor.isHeader(element))
                            && remainP && pTag.toUpperCase() != elementTagName) {
                            var nEl = editor._doc.createElement(pTag);

                            var attrs = element.attributes;

                            for(var k = 0; k < attrs.length; ++k) {
                                var a = attrs.item(k);

                                if(!a.specified)
                                    continue;
                                if(a.name.toLowerCase() == "style")
                                    continue;

                                nEl.setAttribute(a.name, a.value);
                            }

                            nEl.style.cssText = element.style.cssText;

                            while(element.firstChild)
                                nEl.appendChild(element.firstChild);

                            element.parentNode.insertBefore(nEl, element);
                            element.parentNode.removeChild(element);
                        }
                    } else {
                        if(!(textAlign == "left" && force) || remainP) {
                            if(div == null) {
                                div = editor._doc.createElement(remainP ? pTag : editor.dfltBlockElement);

                                if(editor.dfltBlockElement.toUpperCase() == "P" && !remainP)
                                    div.style.margin = "0px";
                                if(!remainP)
                                    div.style.textAlign = textAlign;

                                element.parentNode.insertBefore(div, element);
                            }

                            var actualLength = (paragraph[paragraph.length - 1] == pars[1]) ? paragraph.length - 1 : paragraph.length,
                                actualStart = (paragraph[0] == pars[0]) ? 1 : 0;

                            if(elementTagName == "BR" && j == actualLength - 1 && j == actualStart) {
                                if(Sys.Extended.UI.HtmlEditor.isIE) {
                                    div.appendChild(editor._doc.createTextNode(String.fromCharCode(160)));
                                    element.parentNode.removeChild(element);
                                } else
                                    div.appendChild(element);
                            } else
                                if(elementTagName == "BR" && j == actualLength - 1 && j > actualStart && (!remainP || (element.nextSibling != null && element.nextSibling == pars[1])))
                                    element.parentNode.removeChild(element);
                                else
                                    div.appendChild(element);

                            if(elementTagName == "BR" && j == paragraph.length - 1 && !remainP) {
                                completeDiv(div);
                                div = null;
                            }

                            if(element == pars[1] && j == paragraph.length - 1) {
                                completeDiv(div);
                                div = null;
                            }
                        }
                    }
                }
            }
        }
    }

    for(var i = 0; i < paragraphs.length; i++) {
        var paragraph = paragraphs[i];

        if(paragraph.length > 0) {
            if(paragraph[0].parentNode != currentParent) { // start new collection of paragraps
                if(collectedParagraphs.length > 0)
                    operateCollectedParagraphs();

                collectedParagraphs = [];
                currentParent = paragraph[0].parentNode;
            }

            collectedParagraphs.push(paragraph);
        }
    }

    if(collectedParagraphs.length > 0)
        operateCollectedParagraphs();

    this.setSelectionAfterOperation(pars, needJoiner);
}

Sys.Extended.UI.HtmlEditor.MSIE_indent = function(increase) {
    var paragraphs = this.get_paragraphs(),
        pars = this.getSelectionAfterOperation(paragraphs),
        currentParent = null,
        collectedParagraphs = [],
        editor = this,
        needJoiner = false;

    function getMargin(el) {
        if(el.nodeType == 1) {
            var cssEl = (!editor.rtlState()) ? el.style.marginLeft : el.style.marginRight;

            if(cssEl.length > 0)
                return parseInt(cssEl);
        }

        return 0;
    }

    function setMargin(el, value) {
        if(el.nodeType == 1) {
            if(el.tagName.toUpperCase() == "P" && value == "")
                value = "0px";

            if(!editor.rtlState())
                el.style.marginLeft = value;
            else
                el.style.marginRight = value;
        }
    }

    function changeMargin(el) {
        if(increase)
            setMargin(el, (getMargin(el) + 40) + "px");
        else {
            if(el.tagName.toUpperCase() == "P") {
                if(getMargin(el) >= 40)
                    setMargin(el, (getMargin(el) - 40) + "px");
                else
                    setMargin(el, "0px");
            } else {
                if(getMargin(el) > 40)
                    setMargin(el, (getMargin(el) - 40) + "px");
                else
                    setMargin(el, "");
            }
        }
    }

    function completeDiv(div) {
        if(div != null)
            if(div.childNodes == 1 && (div.firstChild == pars[0] || div.firstChild == pars[1])) {
                div.parentNode.insertBefore(div.firstChild, div);
                div.parentNode.removeChild(div);
            }
    }

    function operateCollectedParagraphs() {
        var firstChild = currentParent.firstChild,
            lastChild = currentParent.lastChild;

        if( // if all paragraps(them only) are in one parent already
            currentParent.tagName && !Sys.Extended.UI.HtmlEditor.isInlineElement(currentParent) &&
            collectedParagraphs[0][0] == firstChild &&
            collectedParagraphs[collectedParagraphs.length - 1][collectedParagraphs[collectedParagraphs.length - 1].length - 1] == lastChild
        ) {
            var textAlign = "";

            if(currentParent.getAttribute("align") && currentParent.getAttribute("align").length > 0)
                textAlign = currentParent.getAttribute("align");

            if(currentParent.align && currentParent.align.length > 0)
                textAlign = currentParent.align;

            if(currentParent.style.textAlign && currentParent.style.textAlign.length > 0)
                textAlign = currentParent.style.textAlign;

            if((textAlign.toLowerCase() == "left" && !editor.rtlState()) || (textAlign.toLowerCase() == "right" && editor.rtlState()))
                textAlign = "";

            currentParent.align = "";
            currentParent.setAttribute("align", "");
            currentParent.removeAttribute("align");

            changeMargin(currentParent);

            var curTagName = currentParent.tagName.toUpperCase();

            // can we remove parent element?
            if((curTagName == "DIV" || curTagName == "P" || Sys.Extended.UI.HtmlEditor.isHeader(currentParent)) && textAlign == "") {
                if(editor.tryUnWrap(currentParent, pars))
                    needJoiner = true;
            } else {
                if(textAlign != "" || (curTagName == "LI" && currentParent.parentNode.style.textAlign.length > 0))
                    currentParent.style.textAlign = textAlign;
                else
                    currentParent.style.textAlign = "";

                if(curTagName == "LI") {
                    var list = currentParent.parentNode,
                        margins = [];

                    for(var jn = 0; jn < list.childNodes.length; jn++)
                        margins.push(getMargin(list.childNodes.item(jn)));

                    var jj = 1;
                    for(; jj < margins.length; jj++)
                        if(margins[jj - 1] != margins[jj])
                            break;

                    if(jj == margins.length) {
                        var margin = (margins[0] == 0) ? "" : (margins[0] + "px");

                        for(var j = 0; j < list.childNodes.length; j++)
                            setMargin(list.childNodes.item(j), "");

                        setMargin(list, margin);
                    }
                }
            }
        } else {
            for(var i = 0; i < collectedParagraphs.length ; i++) {
                var div = null,
                    paragraph = collectedParagraphs[i];

                for(var j = 0; j < paragraph.length; j++) {
                    var element = paragraph[j],
                        elementTagName = (element.nodeType == 1 && element.tagName) ? element.tagName.toUpperCase() : null;

                    if(elementTagName != null &&
                       (elementTagName == "UL" || elementTagName == "OL" ||
                        elementTagName == "DL" || elementTagName == "DIV" || Sys.Extended.UI.HtmlEditor.isHeader(element) ||
                        elementTagName == "P" || elementTagName == "LI"
                       )
                    ) {
                        completeDiv(div);
                        div = null;

                        changeMargin(element)

                        if(elementTagName == "UL" || elementTagName == "OL" || elementTagName == "DL") {
                            for(var jk = 0; jk < element.childNodes.length; jk++) {
                                var li = element.childNodes.item(jk);

                                if(li.nodeType == 1) {
                                    setMargin(li, "");

                                    for(var kk = 0; kk < li.childNodes.length; kk++) {
                                        var child = li.childNodes.item(kk);

                                        var textAlign = (child.nodeType == 1) ? element.style.textAlign : "";
                                        if((textAlign.toLowerCase() == "left" && !editor.rtlState()) || (textAlign.toLowerCase() == "right" && editor.rtlState()))
                                            textAlign = "";

                                        if(child.nodeType == 1) {
                                            setMargin(child, "");

                                            if(textAlign == "" && child.tagName) {
                                                var childTagName = child.tagName.toUpperCase();

                                                if(childTagName == "DIV" || childTagName == "P")
                                                    if(editor.tryUnWrap(child, pars))
                                                        needJoiner = true;
                                            }
                                        }
                                    }
                                }
                            }

                            continue;
                        } else if(elementTagName == "LI") {
                            var list = element.parentNode,
                                margins = [];

                            for(var jn = 0; jn < list.childNodes.length; jn++)
                                margins.push(getMargin(list.childNodes.item(jn)));

                            var jj = 1;
                            for(; jj < margins.length; jj++)
                                if(margins[jj - 1] != margins[jj])
                                    break;

                            if(jj == margins.length) {
                                var margin = (margins[0] == 0) ? "" : (margins[0] + "px");

                                for(var j = 0; j < list.childNodes.length; j++)
                                    setMargin(list.childNodes.item(j), "");

                                setMargin(list, margin);
                            }

                            continue;
                        }

                        var textAlign = element.style.textAlign;
                        if((textAlign.toLowerCase() == "left" && !editor.rtlState()) || (textAlign.toLowerCase() == "right" && editor.rtlState()))
                            textAlign = "";

                        // can we remove DIV or P ?
                        if((elementTagName == "DIV" || elementTagName == "P" || Sys.Extended.UI.HtmlEditor.isHeader(element)) && textAlign == "") {
                            if(editor.tryUnWrap(element, pars))
                                needJoiner = true;
                        }
                    } else {
                        if(increase) {
                            if(div == null) {
                                div = editor._doc.createElement(editor.dfltBlockElement);

                                if(editor.dfltBlockElement.toUpperCase() == "P")
                                    div.style.margin = "0px";

                                changeMargin(div);
                                element.parentNode.insertBefore(div, element);
                            }

                            var actualLength = (paragraph[paragraph.length - 1] == pars[1]) ? paragraph.length - 1 : paragraph.length,
                                actualStart = (paragraph[0] == pars[0]) ? 1 : 0;

                            if(elementTagName == "BR" && j == actualLength - 1 && j == actualStart) {
                                if(Sys.Extended.UI.HtmlEditor.isIE) {
                                    div.appendChild(editor._doc.createTextNode(String.fromCharCode(160)));
                                    element.parentNode.removeChild(element);
                                } else
                                    div.appendChild(element);
                            } else if(elementTagName == "BR" && j == actualLength - 1 && j > actualStart)
                                element.parentNode.removeChild(element);
                            else
                                div.appendChild(element);

                            if(elementTagName == "BR" && j == paragraph.length - 1) {
                                completeDiv(div);
                                div = null;
                            }

                            if(element == pars[1] && j == paragraph.length - 1) {
                                completeDiv(div);
                                div = null;
                            }
                        }
                    }
                }
            }
        }
    }

    for(var i = 0; i < paragraphs.length; i++) {
        var paragraph = paragraphs[i];

        if(paragraph.length > 0) {
            if(paragraph[0].parentNode != currentParent) {
                if(collectedParagraphs.length > 0)
                    operateCollectedParagraphs();

                collectedParagraphs = [];
                currentParent = paragraph[0].parentNode;
            }

            collectedParagraphs.push(paragraph);
        }
    }

    if(collectedParagraphs.length > 0)
        operateCollectedParagraphs();

    this.setSelectionAfterOperation(pars, needJoiner);
};

Sys.Extended.UI.HtmlEditor.getSelectionAfterOperation = function(paragraphs) {
    if(paragraphs.length == 0)
        return [];

    var lPoint = this._doc.createElement("SPAN"),
        rPoint = this._doc.createElement("SPAN"),
        initFirst = paragraphs[0][0],
        initLast = paragraphs[paragraphs.length - 1][paragraphs[paragraphs.length - 1].length - 1];

    if(initFirst == initLast && initLast.nodeType == 1 && initLast.childNodes.length == 0 && Sys.Extended.UI.HtmlEditor.canHaveChildren(initLast)) {
        initLast.appendChild(lPoint);
        initLast.appendChild(rPoint);
    } else {
        var firstest = Sys.Extended.UI.HtmlEditor._getReallyFirst(initFirst);

        firstest.parentNode.insertBefore(lPoint, firstest);

        if(firstest == initFirst) {
            var sv = [];
            sv.push(lPoint);

            for(var i = 0; i < paragraphs[0].length; i++)
                sv.push(paragraphs[0][i]);

            paragraphs[0] = sv;
        }

        var lastest = Sys.Extended.UI.HtmlEditor._getReallyLast(initLast);

        if(lastest.nextSibling)
            lastest.parentNode.insertBefore(rPoint, lastest.nextSibling);
        else
            lastest.parentNode.appendChild(rPoint);

        if(lastest == initLast)
            paragraphs[paragraphs.length - 1].push(rPoint)
    }

    return [lPoint, rPoint];
};

Sys.Extended.UI.HtmlEditor.setSelectionAfterOperation = function(pars, needJoiner) {
    if(pars.length == 0)
        return;

    var lPoint = pars[0],
        rPoint = pars[1];

    var sel = this._getSelection(),
        text1 = null,
        text2 = null;

    if(Sys.Extended.UI.HtmlEditor.isIE) {
        sel.empty();
        sel = this._getSelection();

        var range1 = this._createRange(sel),
            range2 = this._createRange(sel);

        try {
            if(lPoint != null && rPoint != null && lPoint.nextSibling == rPoint) {
                text1 = this._doc.createTextNode(" ");
                rPoint.parentNode.insertBefore(text1, rPoint);
            }

            this._TcurrentFormat = null;

            if(lPoint != null)
                range1.moveToElementText(lPoint);

            if(rPoint != null)
                range2.moveToElementText(rPoint);

            if(lPoint != null && rPoint != null) {
                range1.setEndPoint("EndToStart", range2);
                range1.select();

                if(text1 != null) {
                    range1.collapse(false);
                    range1.select();
                    text1.parentNode.removeChild(text1);
                }
            } else
                if(lPoint != null)
                    range1.select();
                else
                    if(rPoint != null)
                        range2.select();
        } catch(ex) { }
    } else {
        try {
            var range,
                next = lPoint.nextSibling,
                prev = rPoint.previousSibling

            this._TcurrentFormat = null;

            if(next == prev && next.nodeType == 1 && next.tagName.toUpperCase() == "BR") {
                var ind = Sys.Extended.UI.HtmlEditor.__getIndex(next);

                range = this._doc.createRange();
                range.setStart(next.parentNode, ind);
                range.setEnd(next.parentNode, ind);
            } else {
                text1 = this._doc.createTextNode("");
                text2 = this._doc.createTextNode("");

                lPoint.parentNode.insertBefore(text1, lPoint);
                rPoint.parentNode.insertBefore(text2, rPoint);

                range = this._doc.createRange();
                range.setStart(text1, 0);
                range.setEnd(text2, 0);
            }

            this._removeAllRanges(sel);
            this._selectRange(sel, range);
        } catch(ex) { }
    }

    var fnd = Sys.Extended.UI.HtmlEditor._commonTotalParent((lPoint == null) ? rPoint : lPoint, (rPoint == null) ? lPoint : rPoint),
        parent = null;

    if(fnd != null)
        parent = fnd.parent;

    if(lPoint != null)
        lPoint.parentNode.removeChild(lPoint);
    if(rPoint != null)
        rPoint.parentNode.removeChild(rPoint);

    if(needJoiner && parent != null) {
        Sys.Extended.UI.HtmlEditor.spanJoiner(parent, this._doc);

        if(!Sys.Extended.UI.HtmlEditor.isIE && text1 != null && text2 != null) {
            var range = this._doc.createRange();

            range.setStart(text1, 0);
            range.setEnd(text2, 0);

            this._removeAllRanges(sel);
            this._selectRange(sel, range);
        }
    }
};

Sys.Extended.UI.HtmlEditor.get_paragraphs = function() {
    this._TcurrentFormat = null;
    var paragraphs = this.getPseudoP();

    if(paragraphs.length == 0) {
        try {
            var str = "<span id='" + Sys.Extended.UI.HtmlEditor.smartClassName + "_ll'></span><span id='" + Sys.Extended.UI.HtmlEditor.smartClassName + "_rr'></span><br>";
            this.insertHTML(str);

            var lPoint = this._doc.getElementById(Sys.Extended.UI.HtmlEditor.smartClassName + "_ll"),
                rPoint = this._doc.getElementById(Sys.Extended.UI.HtmlEditor.smartClassName + "_rr");

            var sv = this._TcurrentFormat;

            this._TcurrentFormat = null;
            this.setSelectionAfterOperation([lPoint, rPoint], false);
            this._TcurrentFormat = sv;

            paragraphs = this.getPseudoP();
        } catch(ex) { }
    }

    return paragraphs;
};

Sys.Extended.UI.HtmlEditor.getPseudoP = function() {
    var result = [];

    try {
        var sel = this._getSelection(),
            range = this._createRange(sel);

        // ids for bound markers
        var rn = Sys.Extended.UI.HtmlEditor.smartClassName + "_right",
            ln = Sys.Extended.UI.HtmlEditor.smartClassName + "_left";

        // bound ranges
        var r_left = null,
            r_right = null;

        // get bound ranges
        if(Sys.Extended.UI.HtmlEditor.isIE) {
            if(sel.type.toLowerCase() != "control") {
                r_left = range.duplicate();
                r_right = range.duplicate();
                r_left.setEndPoint("EndToStart", range);
                r_right.setEndPoint("StartToEnd", range);
            }
        } else {
            r_left = range.cloneRange();
            r_right = range.cloneRange();
            r_left.setEnd(r_left.startContainer, r_left.startOffset);
            r_right.setStart(r_right.endContainer, r_right.endOffset);
        }

        var lPoint = null,
            rPoint = null;

        // insert markers
        if(Sys.Extended.UI.HtmlEditor.isIE && sel.type.toLowerCase() == "control") {
            var control = range.item(0),
                cspan;

            cspan = this._doc.createElement("SPAN");
            cspan.id = ln;
            control.parentNode.insertBefore(cspan, control);

            cspan = this._doc.createElement("SPAN");
            cspan.id = rn;

            if(control.nextSibling == null)
                control.parentNode.appendChild(cspan);
            else
                control.parentNode.insertBefore(cspan, control.nextSibling);
        } else {
            if(!this.insertHTML("<span id='" + rn + "'/>", r_right))
                return [];

            if(!this.insertHTML("<span id='" + ln + "'/>", r_left)) {
                var rP = this._doc.getElementById(rn);

                if(rP != null) {
                    temp = rP.parentNode;
                    temp.removeChild(rP);
                }

                return [];
            }
        }

        // get markers
        lPoint = this._doc.getElementById(ln);
        rPoint = this._doc.getElementById(rn);

        if(lPoint != null && rPoint != null)
            while(lPoint.nextSibling == null)
                if(lPoint.parentNode.nextSibling)
                    lPoint.parentNode.parentNode.insertBefore(lPoint, lPoint.parentNode.nextSibling);
                else
                    lPoint.parentNode.parentNode.appendChild(lPoint);

        if(lPoint != null && rPoint != null) {
            while(rPoint.previousSibling == null)
                rPoint.parentNode.parentNode.insertBefore(rPoint, rPoint.parentNode);

            if(rPoint.previousSibling.nodeType == 1) {
                var tagName = rPoint.previousSibling.tagName.toUpperCase();

                if(tagName != "BR" && tagName != "IMG") {
                    var last = Sys.Extended.UI.HtmlEditor._getReallyLast(rPoint.previousSibling);

                    if(last.nodeType == 1 && Sys.Extended.UI.HtmlEditor.canHaveChildren(last))
                        last.appendChild(rPoint);
                    else
                        last.parentNode.appendChild(rPoint);
                }
            }

            if(rPoint.previousSibling && rPoint.previousSibling.nodeType == 1 && rPoint.previousSibling.tagName.toUpperCase() == "BR")
                rPoint.parentNode.insertBefore(rPoint, rPoint.previousSibling);
        }

        if(lPoint == null) {
            var span = this._doc.createElement("SPAN");
            span.id = ln;
            rPoint.parentNode.insertBefore(span, rPoint);
            lPoint = span;
        }

        if(rPoint == null) {
            var span = this._doc.createElement("SPAN");
            span.id = rn;

            if(lPoint.nextSibling)
                lPoint.parentNode.insertBefore(span, lPoint.nextSibling);
            else
                lPoint.parentNode.appendChild(span);

            rPoint = span;
        }

        if(lPoint != null && rPoint != null)
            if(lPoint.parentNode == rPoint) {
                rPoint.parentNode.insertBefore(lPoint, rPoint);
            } else if(rPoint.parentNode == lPoint) {
                if(lPoint.nextSibling != null)
                    lPoint.parentNode.insertBefore(rPoint, lPoint.nextSibling);
                else
                    lPoint.parentNode.appendChild(rPoint);
            }

        while(lPoint.nextSibling != null && lPoint.nextSibling.nodeType == 3 && ("" + lPoint.nextSibling.data + "").length == 0)
            lPoint.parentNode.removeChild(lPoint.nextSibling);


        if(this._TcurrentFormat == null && lPoint != null && rPoint != null && lPoint.nextSibling == rPoint) {
            var par = rPoint.parentNode;

            this._TcurrentFormat = null;

            while(par && par.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HtmlEditor.isStyleTag(par.tagName)) {
                if(par.tagName.toUpperCase() != "A") {
                    var temp = par.cloneNode(false);

                    if(this._TcurrentFormat == null) {
                        this._TcurrentFormat = temp;
                    } else {
                        temp.appendChild(this._TcurrentFormat);
                        this._TcurrentFormat = temp;
                    }
                }

                par = par.parentNode;
            }

            if(this._TcurrentFormat) {
                var sspan = this._doc.createElement("span");
                sspan.appendChild(this._TcurrentFormat);
                this._TcurrentFormat = sspan.innerHTML;
            }
        }

        // try to move markers to pseudo paragraphs bounds

        var telem = lPoint;
        while(telem && telem.tagName && Sys.Extended.UI.HtmlEditor.isStyleTag(telem.tagName) && (telem.tagName.toUpperCase() != "A"))
            telem = telem.parentNode;

        if(telem != null && telem.tagName.toUpperCase() == "P") {
            if(telem.firstChild != null)
                telem.insertBefore(lPoint, telem.firstChild);
            else
                telem.appendChild(lPoint);
        } else
            Sys.Extended.UI.HtmlEditor.positionInParagraph(lPoint, lPoint.previousSibling, true, lPoint.parentNode);

        telem = rPoint;
        while(telem && telem.tagName && Sys.Extended.UI.HtmlEditor.isStyleTag(telem.tagName) && (telem.tagName.toUpperCase() != "A"))
            telem = telem.parentNode;

        if(telem != null && telem.tagName.toUpperCase() == "P") {
            telem.appendChild(rPoint);
        } else
            Sys.Extended.UI.HtmlEditor.positionInParagraph(rPoint, rPoint.nextSibling, false, rPoint.parentNode);

        result = this.getPseudoP_Recur(lPoint, rPoint, 0);

        var lpTagName = lPoint.parentNode.tagName.toUpperCase();
        if(result.length == 0 && lPoint.previousSibling == null && rPoint.nextSibling == null &&
            lPoint.nextSibling == rPoint && (lpTagName == "P" || llpTagName == "DIV" || lpTagName == "LI")
        )
            result = [[lPoint.parentNode]];

        // set selection
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
                else
                    if(rPoint != null)
                        range2.select();
            } catch(e) { }
        }

        // remobe bound markers
        if(lPoint != null)
            lPoint.parentNode.removeChild(lPoint);
        if(rPoint != null)
            rPoint.parentNode.removeChild(rPoint);
    } catch(e) {
        var spans = this._doc.getElementsByTagName("SPAN"),
            del = [];

        for(var i = 0; i < spans.length; i++) {
            var span = spans[i];

            if(span.id && span.id.length > 0) {
                var reg = new RegExp(Sys.Extended.UI.HtmlEditor.smartClassName, "ig");
                if(reg.test(span.id))
                    del.push(span);
            }
        }

        for(var i = 0; i < del.length; i++)
            del[i].parentNode.removeChild(del[i]);
    }

    return result;
};

Sys.Extended.UI.HtmlEditor.getPseudoP_Recur = function(lPoint, rPoint, r_level) {
    var result = [];

    // bound elements
    var lBound = lPoint,
        rBound = (rPoint.nextSibling != null && rPoint.nextSibling.tagName && rPoint.nextSibling.tagName.toUpperCase() == "BR") ? rPoint.nextSibling : rPoint;

    // find coomon parent of the bound elements
    var fnd = null;

    if(lBound == null || rBound == null) {
        if(lBound != null)
            fnd = Sys.Extended.UI.HtmlEditor._commonTotalParent(lBound, lBound);

        if(rBound != null)
            fnd = Sys.Extended.UI.HtmlEditor._commonTotalParent(rBound, rBound);
    } else
        fnd = Sys.Extended.UI.HtmlEditor._commonTotalParent(lBound, rBound);

    if(fnd != null) { // common parent found
        //where are the bound elements?
        lBound = Sys.Extended.UI.HtmlEditor.getContainer(fnd.parent.childNodes.item(fnd.indexFirst), lBound);
        rBound = Sys.Extended.UI.HtmlEditor.getContainer(fnd.parent.childNodes.item(fnd.indexLast), rBound);

        // move them up
        Sys.Extended.UI.HtmlEditor.unStyle(lBound);
        Sys.Extended.UI.HtmlEditor.unStyle(rBound);

        while(lBound.parentNode != fnd.parent)
            lBound = lBound.parentNode;
        while(rBound.parentNode != fnd.parent)
            rBound = rBound.parentNode;

        // move up all non inline elements (<br>,<div>,<table> ...)
        Sys.Extended.UI.HtmlEditor._moveTagsUp(lBound.nextSibling, rBound);

        fnd = null;

        // optimize spans
        if(lPoint == null || rPoint == null) {
            if(lPoint != null)
                fnd = Sys.Extended.UI.HtmlEditor._commonTotalParent(lPoint, lPoint);
            if(rPoint != null)
                fnd = Sys.Extended.UI.HtmlEditor._commonTotalParent(rPoint, rPoint);
        } else
            fnd = Sys.Extended.UI.HtmlEditor._commonTotalParent(lPoint, rPoint);

        if(fnd != null)
            Sys.Extended.UI.HtmlEditor.spanJoiner(fnd.parent, this._doc, fnd.indexFirst, fnd.indexLast + 1, true);

        // prepare output array
        function _dive1(next) {
            if(!Sys.Extended.UI.HtmlEditor.isInlineElement(next)) {
                return true;
            } else if(next.tagName && Sys.Extended.UI.HtmlEditor.isStyleTag(next.tagName) && (next.tagName.toUpperCase() != "A") && !Sys.Extended.UI.HtmlEditor.isTempElement(next)) {
                var nnn = next.firstChild;

                while(nnn != null) {
                    nnnNext = nnn.nextSibling;
                    var temp = _dive1(nnn);

                    if(temp)
                        return true;

                    nnn = nnnNext;
                }
            }

            return false;
        }

        var arrIndex = 0,
            subArr = [],
            subIndex = 0;

        if(lBound.tagName && rBound.tagName) {
            var lBoundTagName = lBound.tagName.toUpperCase(),
                rBoundTagName = rBound.tagName.toUpperCase();

            if((lBoundTagName == "TD" || lBoundTagName == "TR") &&
               (rBoundTagName == "TD" || rBoundTagName == "TR")
            ) {
                while(lBound.tagName.toUpperCase() != "TABLE")
                    lBound = lBound.parentNode;

                rBound = lBound;
            } else {
                if((lBoundTagName == "DD" || lBoundTagName == "DT") &&
                   (rBoundTagName == "DD" || rBoundTagName == "DT")
                ) {
                    while(lBound.tagName && lBound.tagName.toUpperCase() != "DL")
                        lBound = lBound.parentNode;

                    rBound = lBound;
                } else {
                    if((lBoundTagName == "LI") && (rBoundTagName == "LI")) {
                        while(lBoundTagName != "UL" && lBoundTagName != "OL") {
                            lBound = lBound.parentNode;
                            lBoundTagName = (lBound.tagName) ? lBound.tagName.toUpperCase() : null;
                        }
                        rBound = lBound;
                    }
                }
            }
        }

        var fromPoint = lPoint ? lPoint : rPoint,
            toPoint = rPoint ? rPoint : lPoint,
            next = lBound;

        while(true) {
            if(!Sys.Extended.UI.HtmlEditor.isTempElement(next)) {
                var isBlock = _dive1(next);

                if(!isBlock) {
                    if(next.nodeType && next.nodeType == 3) {
                        var str = "" + next.data + "";

                        if(str.length == 0 || /^[\n\r]+$/.test(str)) {
                            var tempNext = next.nextSibling;

                            next.parentNode.removeChild(next);
                            if(next == rBound)
                                break;

                            next = tempNext;

                            continue;
                        }
                    }

                    subArr[subIndex] = next;
                    subIndex++;
                } else {
                    if(next.tagName && next.tagName.toUpperCase() == "BR") {
                        subArr[subIndex] = next;
                        result[arrIndex] = subArr;
                        arrIndex++;

                        subArr = [];
                        subIndex = 0;
                    } else
                        if((next == rBound || next == lBound) &&
                          !((next == rBound && next == lBound) ? (Sys.Extended.UI.HtmlEditor._reallyFirst(next, fromPoint) && Sys.Extended.UI.HtmlEditor._reallyLast(next, toPoint))
                           : (Sys.Extended.UI.HtmlEditor._reallyFirst(next, fromPoint) || Sys.Extended.UI.HtmlEditor._reallyLast(next, toPoint))
                          )
                        ) {
                            var nextTagName = (next.tagName) ? (next.tagName.toUpperCase()) : null;

                            if(nextTagName == "TABLE" || nextTagName == "TBODY") {
                                var table = next;

                                while(table.tagName.toUpperCase() != "TABLE")
                                    table = table.parentNode;

                                var fromCellIndex = 0,
                                    fromRowIndex = 0,
                                    toCellIndex = table.rows.item(table.rows.length - 1).cells.length - 1,
                                    toRowIndex = table.rows.length - 1;

                                // find cells with start/end of selection in the Table
                                for(var i = 0; i < table.rows.length; i++) {
                                    var row = table.rows.item(i),
                                        j = 0;

                                    for(; j < row.cells.length; j++) {
                                        var cell = row.cells.item(j);

                                        if(Sys.Extended.UI.HtmlEditor._lookChild(cell, fromPoint) >= 0) {
                                            fromCellIndex = j;
                                            fromRowIndex = i;
                                        }

                                        if(Sys.Extended.UI.HtmlEditor._lookChild(cell, toPoint) >= 0) {
                                            toCellIndex = j;
                                            toRowIndex = i;
                                        }
                                    }
                                }

                                // collect pseudo paragraps
                                for(var i = fromRowIndex; i <= toRowIndex; i++)
                                    for(var j = ((i == fromRowIndex) ? fromCellIndex : 0) ; j <= ((i == toRowIndex) ? toCellIndex : (table.rows.item(i).cells.length - 1)) ; j++) {
                                        var cell = table.rows.item(i).cells.item(j);

                                        if(subIndex > 0) {
                                            result[arrIndex] = subArr;
                                            arrIndex++;
                                            subArr = [];
                                            subIndex = 0;
                                        }

                                        var is_lPoint = (Sys.Extended.UI.HtmlEditor._lookChild(cell, fromPoint) >= 0),
                                            is_rPoint = (Sys.Extended.UI.HtmlEditor._lookChild(cell, toPoint) >= 0);

                                        if(is_lPoint || is_rPoint) { // need recursion
                                            var r_lPoint = fromPoint,
                                                r_rPoint = toPoint,
                                                rn = Sys.Extended.UI.HtmlEditor.smartClassName + "_right_" + r_level,
                                                ln = Sys.Extended.UI.HtmlEditor.smartClassName + "_left_" + r_level;

                                            if(is_lPoint) {
                                                r_rPoint = this._doc.createElement("span");
                                                r_rPoint.id = rn;
                                                cell.appendChild(r_rPoint);
                                            }

                                            if(is_rPoint) {
                                                r_lPoint = this._doc.createElement("span");
                                                r_lPoint.id = ln;

                                                if(cell.firstChild)
                                                    cell.insertBefore(r_lPoint, cell.firstChild);
                                                else
                                                    cell.appendChild(r_lPoint);
                                            }

                                            var r_result = this.getPseudoP_Recur(r_lPoint, r_rPoint, r_level + 1);
                                            for(var cnt = 0; cnt < r_result.length; cnt++) {
                                                result[arrIndex] = r_result[cnt];
                                                arrIndex++;
                                            }

                                            if(r_lPoint != fromPoint)
                                                r_lPoint.parentNode.removeChild(r_lPoint);
                                            if(r_rPoint != toPoint)
                                                r_rPoint.parentNode.removeChild(r_rPoint);
                                        } else {
                                            var fromEl = 0,
                                                toEl = cell.childNodes.length;

                                            for(var k = fromEl; k < toEl; k++) {
                                                var el = cell.childNodes.item(k);

                                                if(!Sys.Extended.UI.HtmlEditor.isTempElement(el)) {
                                                    subArr[subIndex] = el;
                                                    subIndex++;
                                                }
                                            }

                                            if(subArr.length > 0) {
                                                result[arrIndex] = subArr;
                                                arrIndex++;
                                                subArr = [];
                                                subIndex = 0;
                                            }
                                        }
                                    }
                            } else if(nextTagName == "UL" || nextTagName == "OL" || nextTagName == "DL") {
                                var list = next,
                                    fromIndex = 0,
                                    toIndex = list.childNodes.length - 1;

                                // find itemss with start/end of selection in the list
                                for(var i = 0; i < list.childNodes.length; i++) {
                                    var point = list.childNodes.item(i);

                                    if(point.nodeType == 1) {
                                        if(point == fromPoint || Sys.Extended.UI.HtmlEditor._lookChild(point, fromPoint) >= 0)
                                            fromIndex = i;

                                        if(point == toPoint || Sys.Extended.UI.HtmlEditor._lookChild(point, toPoint) >= 0)
                                            toIndex = i;
                                    }
                                }

                                // collect pseudo paragraps
                                for(var i = fromIndex; i <= toIndex; i++) {
                                    var point = list.childNodes.item(i);

                                    if(subIndex > 0) {
                                        result[arrIndex] = subArr;
                                        arrIndex++;
                                        subArr = [];
                                        subIndex = 0;
                                    }

                                    var is_lPoint = (Sys.Extended.UI.HtmlEditor._lookChild(point, fromPoint) >= 0),
                                        is_rPoint = (Sys.Extended.UI.HtmlEditor._lookChild(point, toPoint) >= 0);

                                    if(is_lPoint || is_rPoint) { // need recursion
                                        var r_lPoint = fromPoint,
                                            r_rPoint = toPoint,
                                            rn = Sys.Extended.UI.HtmlEditor.smartClassName + "_right_" + r_level,
                                            ln = Sys.Extended.UI.HtmlEditor.smartClassName + "_left_" + r_level;

                                        if(is_lPoint) {
                                            r_rPoint = this._doc.createElement("span");
                                            r_rPoint.id = rn;
                                            point.appendChild(r_rPoint);
                                        }

                                        if(is_rPoint) {
                                            r_lPoint = this._doc.createElement("span");
                                            r_lPoint.id = ln;

                                            if(point.firstChild)
                                                point.insertBefore(r_lPoint, point.firstChild);
                                            else
                                                point.appendChild(r_lPoint);
                                        }

                                        var r_result = this.getPseudoP_Recur(r_lPoint, r_rPoint, r_level + 1);

                                        for(var cnt = 0; cnt < r_result.length; cnt++) {
                                            result[arrIndex] = r_result[cnt];
                                            arrIndex++;
                                        }

                                        if(r_lPoint != fromPoint)
                                            r_lPoint.parentNode.removeChild(r_lPoint);
                                        if(r_rPoint != toPoint)
                                            r_rPoint.parentNode.removeChild(r_rPoint);
                                    } else {
                                        var fromEl = 0,
                                            toEl = point.childNodes.length;

                                        for(var k = fromEl; k < toEl; k++) {
                                            var el = point.childNodes.item(k);

                                            if(!Sys.Extended.UI.HtmlEditor.isTempElement(el)) {
                                                subArr[subIndex] = el;
                                                subIndex++;
                                            }
                                        }

                                        if(subArr.length > 0) {
                                            result[arrIndex] = subArr;
                                            arrIndex++;
                                            subArr = [];
                                            subIndex = 0;
                                        }
                                    }
                                }
                            } else {
                                var is_lPoint = (Sys.Extended.UI.HtmlEditor._lookChild(next, fromPoint) >= 0),
                                    is_rPoint = (Sys.Extended.UI.HtmlEditor._lookChild(next, toPoint) >= 0);

                                if(subIndex > 0) {
                                    result[arrIndex] = subArr;
                                    arrIndex++;
                                    subArr = [];
                                    subIndex = 0;
                                }

                                if(is_lPoint || is_rPoint) { // need recursion
                                    var r_lPoint = fromPoint,
                                        r_rPoint = toPoint,
                                        rn = Sys.Extended.UI.HtmlEditor.smartClassName + "_right_" + r_level,
                                        ln = Sys.Extended.UI.HtmlEditor.smartClassName + "_left_" + r_level;

                                    if(is_lPoint) {
                                        r_rPoint = this._doc.createElement("span");
                                        r_rPoint.id = rn;
                                        next.appendChild(r_rPoint);
                                    }

                                    if(is_rPoint) {
                                        r_lPoint = this._doc.createElement("span");
                                        r_lPoint.id = ln;

                                        if(next.firstChild)
                                            next.insertBefore(r_lPoint, next.firstChild);
                                        else
                                            next.appendChild(r_lPoint);
                                    }

                                    var r_result = this.getPseudoP_Recur(r_lPoint, r_rPoint, r_level + 1);

                                    for(var cnt = 0; cnt < r_result.length; cnt++) {
                                        result[arrIndex] = r_result[cnt];
                                        arrIndex++;
                                    }

                                    if(r_lPoint != fromPoint)
                                        r_lPoint.parentNode.removeChild(r_lPoint);
                                    if(r_rPoint != toPoint)
                                        r_rPoint.parentNode.removeChild(r_rPoint);
                                } else {
                                    var fromEl = 0,
                                        toEl = next.childNodes.length;

                                    for(var k = fromEl; k < toEl; k++) {
                                        var el = next.childNodes.item(k);

                                        if(!Sys.Extended.UI.HtmlEditor.isTempElement(el)) {
                                            subArr[subIndex] = el;
                                            subIndex++;
                                        }
                                    }

                                    if(subArr.length > 0) {
                                        result[arrIndex] = subArr;
                                        arrIndex++;
                                        subArr = [];
                                        subIndex = 0;
                                    }
                                }
                            }
                        } else {
                            if(subIndex > 0) {
                                result[arrIndex] = subArr;
                                arrIndex++;
                                subArr = [];
                                subIndex = 0;
                            }

                            subArr[subIndex] = next;
                            result[arrIndex] = subArr;
                            arrIndex++;
                            subArr = [];
                            subIndex = 0;
                        }
                }
            }

            if(next == rBound)
                break;
            next = next.nextSibling;
        }

        if(subIndex > 0)
            result[arrIndex] = subArr;
    }

    return result;
};

Sys.Extended.UI.HtmlEditor.unWrap = function(element, pars) {
    var editor = this;

    if(element.firstChild) {
        while(element.firstChild && element.firstChild.nodeType == 3 && ("" + element.firstChild.data + "") == "")
            element.removeChild(element.firstChild);

        var inner = [];
        while(element.firstChild) {
            if(element.firstChild != pars[0] && element.firstChild != pars[1])
                inner.push(element.firstChild);
            element.parentNode.insertBefore(element.firstChild, element);
        }

        if(inner.length == 0) {
            var br = editor._doc.createElement("BR");
            element.parentNode.insertBefore(br, element);
        }

        if(Sys.Extended.UI.HtmlEditor.isIE && inner.length == 1 && inner[0].nodeType == 3) {
            var str = "" + inner[0].data + "";

            if(str.length == 1 && str.charCodeAt(0) == 160) {
                var br = editor._doc.createElement("BR");

                inner[0].parentNode.insertBefore(br, inner[0]);
                inner[0].parentNode.removeChild(inner[0]);
            }
        }

        while(element.nextSibling && element.nextSibling.nodeType == 3 && ("" + element.nextSibling.data + "") == "")
            element.parentNode.removeChild(element.nextSibling);

        var previousSibling = (element.previousSibling && pars[1] == element.previousSibling) ? pars[1].previousSibling : element.previousSibling;

        if(previousSibling && Sys.Extended.UI.HtmlEditor.isInlineElement(previousSibling))
            if(previousSibling.nodeType == 1 && previousSibling.childNodes.length > 0)
                previousSibling = Sys.Extended.UI.HtmlEditor._getReallyLast(previousSibling);

        if(Sys.Extended.UI.HtmlEditor.isInlineElement(previousSibling) && element.nextSibling != null) {
            var br = editor._doc.createElement("BR");
            element.parentNode.insertBefore(br, element);
        }
    } else {
        var br = editor._doc.createElement("BR");
        element.parentNode.insertBefore(br, element);
    }

    element.parentNode.removeChild(element);
};

Sys.Extended.UI.HtmlEditor.tryUnWrap = function(element, pars, force) {
    var editor = this;

    element.style.textAlign = "";

    var attrsNumber = 0,
        attrs = element.attributes;

    for(var k = 0; k < attrs.length; ++k) {
        var a = attrs.item(k);

        if(!a.specified)
            continue;
        if(a.name.toLowerCase() == "style")
            continue;

        attrsNumber++;
    }

    var save_css = element.style.cssText,
        margin = 0,
        mar,
        elementTagName = element.tagName.toUpperCase();

    if(!(typeof force != "undefined" && force))
        if(elementTagName != "LI")
            try {
                mar = parseInt(Sys.Extended.UI.HtmlEditor.getStyle(element, "margin-top"));
                if(isNaN(mar))
                    mar = elementTagName == "P" ? 1 : 0;
                margin += mar;

                mar = parseInt(Sys.Extended.UI.HtmlEditor.getStyle(element, "margin-bottom"));
                if(isNaN(mar))
                    mar = elementTagName == "P" ? 1 : 0;
                margin += mar;

                mar = parseInt(Sys.Extended.UI.HtmlEditor.getStyle(element, "margin-right"));
                if(isNaN(mar))
                    mar = elementTagName == "P" ? 1 : 0;
                margin += mar;

                mar = parseInt(Sys.Extended.UI.HtmlEditor.getStyle(element, "margin-left"));
                if(isNaN(mar))
                    mar = elementTagName == "P" ? 1 : 0;
                margin += mar;
            } catch(e) { margin = 1; }

    element.style.margin = "";

    if((attrsNumber == 0 && element.style.cssText.length == 0 && margin == 0) || (typeof force != "undefined" && force && elementTagName != "LI")) {
        editor.unWrap(element, pars);

        return true;
    } else {
        element.style.cssText = save_css;

        return false;
    }
};

Sys.Extended.UI.HtmlEditor._queryCommandValue = function(cmdID, _id) {
    var obj = this._rangeStartEnd();
    if(obj == null)
        return "";

    try {
        if(cmdID.toLowerCase() == "backcolor") {
            var el = obj.start;

            while(el) {
                var bckg = Sys.Extended.UI.HtmlEditor.getStyle(el, "background-color").toLowerCase();
                if(bckg.length > 0 && bckg != "transparent")
                    return bckg;

                el = el.parentNode;
            }

            return "#FFFFFF";
        }

        var cssStyle = "none";
        switch(cmdID.toLowerCase()) {
            case "forecolor":
                cssStyle = "color";
                break;
            case "fontname":
                cssStyle = "font-family";
                break;
            case "fontsize":
                cssStyle = "font-size";
                break;
        }

        var ret;

        if((cssStyle == "font-size" || cssStyle == "font-family") && this._FontNotSet) {
            ret = "";
            var par = obj.start;
            while(par != null) {
                if(cssStyle == "font-size") {
                    if(par.style && par.style.fontSize && par.style.fontSize.length > 0) {
                        ret = par.style.fontSize;
                        break;
                    } else if(par.tagName && par.tagName.toUpperCase() == "FONT" && par.size && par.size.length > 0) {
                        ret = Sys.Extended.UI.HtmlEditor.fontSizeSeek(par.size);
                        break;
                    }
                } else {
                    if(par.style && par.style.fontFamily && par.style.fontFamily.length > 0) {
                        ret = par.style.fontFamily;
                        break;
                    } else if(par.tagName && par.tagName.toUpperCase() == "FONT" && par.face && par.face.length > 0) {
                        ret = par.face;
                        break;
                    }
                }

                if(par.className && par.className.length > 0) {
                    ret = Sys.Extended.UI.HtmlEditor.getStyle(par, cssStyle).toLowerCase();
                    if(cssStyle == "font-size")
                        if(!Sys.Extended.UI.HtmlEditor.isIE)
                            ret = Sys.Extended.UI.HtmlEditor._TryTransformFromPxToPt(ret, this, _id);

                    break;
                }

                var parTagName = par.tagName.toUpperCase();
                if(parTagName == "BODY" || parTagName == "TD")
                    break;

                par = par.parentNode;
            }
        } else {
            ret = Sys.Extended.UI.HtmlEditor.getStyle(obj.start, cssStyle).toLowerCase();

            if(cssStyle == "font-size") {
                if(!Sys.Extended.UI.HtmlEditor.isIE) {
                    ret = Sys.Extended.UI.HtmlEditor._TryTransformFromPxToPt(ret, this, _id);

                    var par = obj.start;
                    while(par != null) {
                        if(par.style && par.style.fontSize && par.style.fontSize.length > 0) {
                            ret = par.style.fontSize;
                            break;
                        }

                        if(par.className && par.className.length > 0)
                            break;

                        var parTagName = par.tagName.toUpperCase();
                        if(parTagName == "BODY" || parTagName == "TD")
                            break;

                        par = par.parentNode;
                    }
                }
            }
        }

        if(this._StyleForTyping != null && this._StyleForTyping.length > 0)
            for(var i = 0; i < this._StyleForTyping.length; i++) {
                var curCss = this._StyleForTyping[i];

                if(curCss.name == cssStyle) {
                    ret = curCss.value;
                    break;
                }
            }

        return ret;
    } catch(ex) { return ""; }
};