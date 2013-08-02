jQuery.noConflict();
(function (window, $) {
    var act = {
        browser: {
            InternetExplorer: {},
            Firefox: {},
            Safari: {},
            Opera: {},
            agent: null,
            hasDebuggerStatement: false,
            name: navigator.appName,
            version: parseFloat(navigator.appVersion),
            documentMode: 0
        },
        
        createWidget: function(name, base, prototype) {
            if (!prototype) {
                prototype = base;
                base = $.Widget;
            }

            var createFunc = prototype._create;
            prototype._create = function() {
                this.metadata = this.element.data('act-options');
                
                // metadata is not found, this control could be an extender control, 
                // let's find where is the metadata located on, it should be carries out by data element
                if (!this.metadata) {
                    var dataElement = $("data[data-act-target='" + this.element.attr('id') + "']");
                    if (dataElement)
                        this.metadata = dataElement.data('act-options');
                }

                if (!this.metadata)
                    throw "Could not resolve meta-data. Please ensure that data-act-options attribute is not empty.";

                this.config = $.extend({}, this.defaults, this.options, this.metadata);

                // apply actual _create method implementation
                if (createFunc)
                    createFunc.apply(this);
            };
            $.widget('ajaxControlToolkit.' + name, base, prototype);
        }
    };
    

    // Adapt from MicrosoftAjax.Extensions.Compact.Browser
    var agent = navigator.userAgent, browser = act.browser;
    
    if (agent.indexOf(' MSIE ') > -1) {
        browser.agent = browser.InternetExplorer;
        browser.version = parseFloat(agent.match(/MSIE (\d+\.\d+)/)[1]);
        if ((browser.version > 7) && (document.documentMode > 6)) {
            browser.documentMode = document.documentMode;
        }
        browser.hasDebuggerStatement = true;
    }
    else if (agent.indexOf(' Firefox/') > -1) {
        browser.agent = browser.Firefox;
        browser.version = parseFloat(agent.match(/ Firefox\/(\d+\.\d+)/)[1]);
        browser.name = 'Firefox';
        browser.hasDebuggerStatement = true;
    }
    else if (agent.indexOf(' AppleWebKit/') > -1) {
        browser.agent = browser.Safari;
        browser.version = parseFloat(agent.match(/ AppleWebKit\/(\d+(\.\d+)?)/)[1]);
        browser.name = 'Safari';
    }
    else if (agent.indexOf('Opera/') > -1) {
        browser.agent = browser.Opera;
    }

    window.$act = act;

})(window, jQuery);