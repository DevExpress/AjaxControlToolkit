Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.TemplateHelper = {};
Sys.UI.Test.TemplateHelper.verifyHTML = function(element, expectedHTML) {
    var expectedElement = document.createElement(element.tagName);
    if (element.id) {
        expectedElement.id = element.id;
    }
    if (element.className) {
        expectedElement.className = element.className;
    }
    expectedElement.innerHTML = expectedHTML;
    // compare a to b, then b to a
    try {
        Sys.UI.Test.TemplateHelper.assertElementsAreEqual(expectedElement, element);
        Sys.UI.Test.TemplateHelper.assertElementsAreEqual(element, expectedElement);
    }
    catch (e) {
        AtlasUnit.Assert.fail(e.message + "\nExpected HTML: " + expectedElement.innerHTML + "\nActual HTML  : " + element.innerHTML);
    }
}
Sys.UI.Test.TemplateHelper.assertElementsAreEqual = function(expected, element) {
    var elen = expected.childNodes.length,
        alen = element.childNodes.length;
    AtlasUnit.Assert.areEqual(Sys.UI.Test.TemplateHelper.getSortedString(expected.style.cssText, ';', ' '), Sys.UI.Test.TemplateHelper.getSortedString(element.style.cssText, ';', ' '), "Mismatched styles on tag '" + expected.tagName + "'");
    AtlasUnit.Assert.areEqual(Sys.UI.Test.TemplateHelper.getSortedString(expected.className, ' ', ';'), Sys.UI.Test.TemplateHelper.getSortedString(element.className, ' ', ';'), "Mismatched className on tag '" + expected.tagName + "'");
    if (alen !== elen) {
        var s = "Mismatched child node count on tag '" + expected.tagName;
        if (elen) {
            s += "\nExpected First = [" + (expected.childNodes[0].nodeType === 1 ? expected.childNodes[0].tagName : expected.childNodes[0].nodeValue) + "]";
            if (alen) {
                s += "\nActual First   = [" + (element.childNodes[0].nodeType === 1 ? element.childNodes[0].tagName : element.childNodes[0].nodeValue) + "]";
            }
            s += "\nExpected Last  = [" + (expected.childNodes[elen-1].nodeType === 1 ? expected.childNodes[elen-1].tagName : expected.childNodes[elen-1].nodeValue) + "]";
            if (alen) {
                s += "\nActual Last    = [" + (element.childNodes[alen-1].nodeType === 1 ? element.childNodes[alen-1].tagName : element.childNodes[alen-1].nodeValue) + "]";
            }                
        }
        AtlasUnit.Assert.fail(s);
    }
    for (var i = 0, l = expected.attributes.length; i < l; i++) {
        var expectedAttrib = expected.attributes[i], expectedName = expectedAttrib.nodeName,
            isInput = expected.tagName.toLowerCase() === "input";
        var specified = expectedAttrib.specified || (isInput && expectedName.toLowerCase() === "value");
        if (!specified) continue;
        
        if (expectedAttrib.expando) {
             if (typeof(expectedAttrib.nodeValue) !== "string") continue;
             // special case for IE8 -- these expandos are exposed as an attribute and converted to a string
             // blacklist the known ones rather than skip on all expandos. if we did that its a higher risk
             // of skipping over an attribute we really do want to validate.
             if (/control|__mstcindex|__msajaxphcount|__msajaxactivated|_msajaxtemplate|_components|_behaviors|dispose/.test(expectedName)) continue;
        }
        var expectedValue, attrib;
        if (/style|className|class/.test(expectedName)) continue;
        attrib = element.getAttribute(expectedName);
        expectedValue = expectedAttrib.nodeValue;
        // IE is wierd with how getAttribute and attributes[name] works.
        // For example, getAttribute('CHECKED') works, attributes['CHECKED'] fails.
        //              getAttribute('class') fails, attributes['class'] works.
        if ((typeof (attrib) === "undefined") || (attrib === null)) {
            attrib = element.attributes[expectedName];
            if (attrib) {
                attrib = attrib.nodeValue;
            }
            if ((typeof (attrib) === "undefined") || (attrib === null)) {
                if (expectedName === "value") {
                    // still didnt find it and it is 'value'. On non-IE, element.getAttribute("value") doesnt work on selects
                    attrib = element.value;
                }
                else if (expectedName === "selectedindex") {
                    attrib = element.selectedIndex;
                }
            }
        }
        if (expectedValue && typeof (expectedValue) === "string") expectedValue = expectedValue.replace("%REMOVE%", "");
        if (attrib && typeof (attrib) === "string") attrib = attrib.replace("%REMOVE%", "");
        AtlasUnit.Assert.areEqual(expectedValue + "", attrib + "", "Mismatched attribute '" + expectedName + "'");
    }
    for (i = 0, l = expected.childNodes.length; i < l; i++) {
        var node = expected.childNodes[i];
        if (node.nodeType === 1) {
            Sys.UI.Test.TemplateHelper.assertElementsAreEqual(expected.childNodes[i], element.childNodes[i]);
        }
        else {
            AtlasUnit.Assert.areEqual(node.nodeValue, element.childNodes[i].nodeValue, "Non-element node mismatch.\nExpected: " + node.nodeValue + "\nActual  : " + element.childNodes[i].nodeValue);
        }
    }
}
    
Sys.UI.Test.TemplateHelper.getSortedString = function(str, sep, ignore) {
    var parts = str.replace(new RegExp(ignore + "|" + sep + "$", 'g'), '').replace(new RegExp(sep+sep, 'g'), sep).split(sep);
    parts.sort();
    return parts.join(sep);
}

Sys.UI.Test.TemplateHelper.processAndVerify = function(testHTML, expectedHTML, bindingContext, getElementId) {
    if (!expectedHTML) expectedHTML = testHTML;
    // the same as testHTML except 'sys' attributes are changed to regular ones (and the 'sys' ones remain)
    if (expectedHTML === "auto") {
        expectedHTML = testHTML.replace(/sys\:([a-zA-Z]*)\=\'([^']*)\'/g, "sys:$1='$2' $1='$2'");
    }
    var div = document.createElement('div');
    div.innerHTML = testHTML;
    var result = Sys.query(div).activateElements(bindingContext);
    Sys.UI.Test.TemplateHelper.verifyHTML(div, expectedHTML);
    if (getElementId) {
        return $get(getElementId, div);
    }
    return result;
}
    
Sys.UI.Test.TemplateHelper.createAndVerify = function(templateHTML, expectedHTML, dataContext, dataIndex, parentContext, getElementId) {
    if (!expectedHTML) {
        expectedHTML = templateHTML;
        // id attributes are auto suffixed by the dataindex
        expectedHTML = expectedHTML.replace(/id\=["']([a-zA-Z0-9]+)['"]/g, "id='$1" + (dataIndex||0) + "'");
    }
    var div = document.createElement('div');
    div.innerHTML = templateHTML;
    var template = new Sys.UI.Template(div);
    var container = document.createElement('div');
    var result = template.instantiateIn(container, null, dataContext, dataIndex, null, parentContext);
    Sys.UI.Test.TemplateHelper.verifyHTML(container, expectedHTML);
    AtlasUnit.Assert.areEqual(container, result.containerElement);
    if (getElementId) {
        return result.get("#" + getElementId);
    }
    return result;
}
    
Sys.UI.Test.TemplateHelper.instantiateIn = function(templateHTML, dataContext, dataIndex, parentContext, getElementId) {
    var div = document.createElement('div');
    div.innerHTML = templateHTML;
    var template = new Sys.UI.Template(div);
    var container = document.createElement('div');
    var result = template.instantiateIn(container, null, dataContext, dataIndex, null, parentContext);
    if (getElementId) {
        return result.get("#" + getElementId);
    }
    return result;
}

Sys.UI.Test.TemplateHelper.verifyInput = function(element, properties, isButton) {
    AtlasUnit.Assert.areEqual(isButton ? "button" : "input", element.tagName.toLowerCase());
    for (var property in properties) {
        AtlasUnit.Assert.areEqual(properties[property], element[property], "Mismatched input value '" + property + "' on '" + element.id + "'.");
    }
}

Sys.UI.Test.TemplateHelper.verifySelect = function(element, options, msg) {
    AtlasUnit.Assert.areEqual(element.options.length, options.length, "Number of options do not match. " + msg);
    for (var i = 0; i < options.length; i++) {
        var expectedOption = options[i];
        var option = element.options[i];
        AtlasUnit.Assert.areEqual(expectedOption.text, option.text, msg);
        AtlasUnit.Assert.areEqual(expectedOption.value, option.value, msg);
        AtlasUnit.Assert.areEqual(!!expectedOption.selected, option.selected, "Option with value '" + option.value + "' selected mismatch. " + msg);
    }
}

Sys.UI.Test.TemplateHelper.clearNamespaces = function() {
    for (var i = 0; i < document.body.attributes.length; i++) {
        var a = document.body.attributes[i];
        if (!a.specified) continue;
        var n = a.nodeName;
        if (n.startsWith("xmlns")) {
            document.body.setAttribute(n, "");
        }
    }
}
