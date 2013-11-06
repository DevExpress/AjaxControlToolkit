(function(window, $) {

    $act.createWidget('dynamicPopulateExtender', {
        
        // Default options
        options: {
            clearContentsDuringUpdate: true,
            contextKey: null,
            servicePath: null,
            serviceMethod: null,
            populateTriggerID: null,
            cacheDynamicResults: false,
            updatingCssClass: "",
            customScript: ""
        },
        
        _events: [
            "populating", "populated"
        ],
        
        _create: function() {
            var self = this, opt = self.options;

            // Vars
            self._clickHandler = null;
            self._callID = 0;
            self._currentCallID = -1;
            self._oldCss = null;
            self._populated = false;


            // Hook up the trigger if we have one.
            if (opt.populateTriggerID) {
                $('#' + opt.populateTriggerID).click(function () {
                    self.populate(opt.contextKey);
                });
            }
        },
        
        populate: function (contextKey) {
            /// <summary>
            /// Get the dymanic content and use it to populate the target element
            /// </summary>
            /// <param name="contextKey" type="String" mayBeNull="true" optional="true">
            /// An arbitrary string value to be passed to the web method. For example, if the element to be
            /// populated is within a data-bound repeater, this could be the ID of the current row.
            /// </param>

            // Overwrite contextKey as if new contextKey updated
            if (contextKey)
                this._setOption("contextKey", contextKey);

            var self = this,
                opt = self.options;
            
            // Don't populate if we already cached the results
            if (opt.populated && opt.cacheDynamicResults) {
                return;
            }

            // Initialize the population if this is the very first call
            if (self._currentCallID == -1) {
                var eventArgs = new $act.args.cancelEventArgs();
                self.raisePopulating(eventArgs);
                if (eventArgs.get_cancel()) {
                    return;
                }
                self._setUpdating(true);
            }

            // Either run the custom population script or invoke the web service
            if (opt.customScript) {
                // Call custom javascript call to populate control
                var scriptResult = eval(opt.customScript);
                self._setTargetHtml(scriptResult);
                self._setUpdating(false);
            } else {
                self._currentCallID = ++self._callID;
                var servicePath = opt.servicePath || location.pathname,
                    serviceMethod = opt.serviceMethod;

                if (servicePath || serviceMethod) {

                    var url = servicePath 
                        ? servicePath + "/" + encodeURIComponent(serviceMethod)
                        :  encodeURIComponent(serviceMethod),
                        ctxKey = (contextKey ? contextKey : opt.contextKey);
                    
                    $.ajax({
                        url: url,
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        data: JSON.stringify({ contextKey: ctxKey })
                    }).done(function (result) {
                        if (result && result.d)
                            result = result.d;
                        self._onMethodComplete(result, self._currentCallID);
                    }).fail(function(xhr) {
                        self._onMethodError(xhr, self._currentCallID);
                    });
                }
            }

        },
        
        _onMethodComplete: function (result, userContext, methodName) {
            /// <summary>
            /// Callback used when the populating service returns successfully
            /// </summary>
            /// <param name="result" type="Object" mayBeNull="">
            /// The data returned from the Web service method call
            /// </param>
            /// <param name="userContext" type="Object">
            /// The context information that was passed when the Web service method was invoked
            /// </param>        
            /// <param name="methodName" type="String">
            /// The Web service method that was invoked
            /// </param>

            // ignore if it's not the current call.
            if (userContext != this._currentCallID) return;

            this._setTargetHtml(result);

            this._setUpdating(false);
        },

        _onMethodError: function (webServiceError, userContext, methodName) {
            /// <summary>
            /// Callback used when the populating service fails
            /// </summary>
            /// <param name="webServiceError" type="Sys.Net.WebServiceError">
            /// Web service error
            /// </param>
            /// <param name="userContext" type="Object">
            /// The context information that was passed when the Web service method was invoked
            /// </param>        
            /// <param name="methodName" type="String">
            /// The Web service method that was invoked
            /// </param>

            // ignore if it's not the current call.
            if (userContext != this._currentCallID) return;

            if (webServiceError.statusText == "timeout") {
                this._setTargetHtml($act.resources.DynamicPopulate_WebServiceTimeout);
            } else {
                this._setTargetHtml($act.string.format($act.resources.DynamicPopulate_WebServiceError, webServiceError.status));
            }

            this._setUpdating(false);
        },
        
        _setUpdating: function (updating) {
            /// <summary>
            /// Toggle the display elements to indicate if they are being updated or not
            /// </summary>
            /// <param name="updating" type="Boolean">
            /// Whether or not the display should indicated it is being updated
            /// </param>

            var self = this;

            self.setStyle(updating);

            if (!updating) {
                self._currentCallID = -1;
                self._populated = true;
                self.raisePopulated(this);
            }
        },
        
        _setTargetHtml: function (value) {
            /// <summary>
            /// Populate the target element with the given value
            /// </summary>
            /// <param name="value" type="String">
            /// The data to populate the target element.
            /// </param>

            // Make sure the element is still accessible
            var e = $(this.element);
            if (e) {
                // Use value for input elements; otherwise innerHTML
                if (e.is('input')) {
                    e.val(value);
                } else {
                    e.html(value);
                }
            }
        },
        
        setStyle: function (updating) {
            /// <summary>
            /// Set the style of the display
            /// </summary>
            /// <param name="updating" type="Boolean">
            /// Whether or not the display is being updated
            /// </param>

            var self = this, opt = self.options, e = $(self.element);
            
            if (opt.updatingCssClass) {
                if (!updating) {
                    e.removeClass().addClass(self._oldCss);
                    self._oldCss = null;
                } else {
                    self._oldCss = e.attr('class');
                    e.removeClass().addClass(opt.updatingCssClass);
                }
            }

            if (updating && opt.clearContentsDuringUpdate) {
                self._setTargetHtml("");
            }
        }
    });

})(window, actJQuery);