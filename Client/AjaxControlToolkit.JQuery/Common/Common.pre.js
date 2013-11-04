(function(window, $) {

    //#include "Args.js"
    //#include "String.js"
    //#include "Resources.js"

    $act.common = {
        
        activateWidget: function (widgetName, el, options) {
            // Get and apply options from data attribute
            var metadata = this.parseMetaData(widgetName, $(el)),
                widget = $(el)[widgetName]($.extend(metadata, options))
                    .data("ajaxControlToolkit-" + widgetName);
            
            // Registering widget behavior component 
            var id = widget.options.id || widget.element.attr('id');
            $act.behaviors[id] = widget;

            return widget;
        },

        parseMetaData: function(name, el) {
            var dataAttrName = 'act-' + name.toLowerCase(),
                strMetadata = el.data(dataAttrName);

            if (!strMetadata) {
                var dataElement = $("data[data-act-target='" + el.attr('id') + "']");
                if (dataElement)
                    strMetadata = dataElement.data(self.dataAttrName);
            }
            if (!strMetadata)
                return null;
                //throw "Could not resolve meta-data. Please ensure that data-" + dataAttrName + " attribute is not empty.";

            // parse string metadata into object notation
            var rgx = /(\w+)(.|\s+)(:)/g, pimp = function(s) {
                return '#$%<*' + s + '$%@#<';
            },
                props = strMetadata.match(rgx),
                tmpMetadata = strMetadata.replace(rgx, pimp('$1$2$3')),
                obj = {};

            for (var i = 0; i < props.length; i++) {
                var prop = pimp(props[i]),
                    idx = tmpMetadata.indexOf(prop) + prop.length,
                    nextIdx = (i < props.length - 1)
                        ? tmpMetadata.indexOf(pimp(props[i + 1])) - 1
                        : tmpMetadata.length,
                    propVal = tmpMetadata.substring(idx, nextIdx);
                
                if (propVal.startsWith("'") && propVal.endsWith("'"))
                    // decode string value
                    propVal = $('<div/>').html(propVal.substr(1, propVal.length - 2)).text();
                
                else if (!isNaN(propVal))
                    // decode numeric value
                    propVal = parseFloat(propVal);
                else {
                    
                    // decode boolean value
                    var val=propVal.toLowerCase().trim();
                    if (val == "true" || val == "false")
                        propVal = Boolean(val == "true" ? 1 : 0);
                }

                obj[props[i].trim().slice(0, -1)] = propVal;
            }

            return obj;
        },
        
        doPostBack: function () {
            if (!window.__doPostBack)
                throw "can't find MS Ajax __doPostBack method";
            
            return window.__doPostBack.apply(window, arguments);
        },
        
        pascalCase: function(str) {
            return str.charAt(0).toUpperCase() + str.substr(1);
        }
    };
    
})(window, actJQuery);