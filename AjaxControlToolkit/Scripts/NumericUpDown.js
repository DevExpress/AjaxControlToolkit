Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.NumericUpDownBehavior = function(element) {
    // The NumericUpDownBehavior is used add up/down buttons to any textbox
    // "element" - DOM Element the behavior is associated with
    Sys.Extended.UI.NumericUpDownBehavior.initializeBase(this, [element]);

    // Properties
    this._currentValue = null;
    this._widthValue = null;
    this._targetButtonUpIDValue = null;
    this._targetButtonDownIDValue = null;
    this._serviceUpPathValue = location.pathname;
    this._serviceUpMethodValue = null;
    this._serviceDownPathValue = location.pathname;
    this._serviceDownMethodValue = null;
    this._refValuesValue = null;
    this._tagValue = null;
    this._elementTextBox = null;
    this._step = 1.0;
    this._min = -Number.MAX_VALUE;
    this._max = Number.MAX_VALUE;

    // Variables
    this._bUp = null;
    this._bDown = null;
    this._stepPrecision = 0;
    this._valuePrecision = 0;

    // Delegates
    this._clickUpHandler = null;
    this._clickDownHandler = null;
    this._changeHandler = null;
}

Sys.Extended.UI.NumericUpDownBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.NumericUpDownBehavior.callBaseMethod(this, 'initialize');
        $common.prepareHiddenElementForATDeviceUpdate();

        var e = this.get_element();
        this._elementTextBox = e;

        if((this._refValuesValue) || (this._serviceUpMethodValue) || (this._serviceDownMethodValue))
            this._elementTextBox.readOnly = true;
        else
            this._elementTextBox.readOnly = false;

        // Init TextBox
        this.readValue();

        // Add Event
        this._changeHandler = Function.createDelegate(this, this._onChange);
        $addHandler(e, 'blur', this._changeHandler);

        // If no button design for include them
        if(!this._targetButtonUpIDValue || !this._targetButtonDownIDValue) {
            // Change Style TextBox
            this._widthValue = Math.max(this._widthValue, 24);
            e.style.width = (this._widthValue - 24) + 'px';
            e.style.textAlign = 'center';

            // Create a new parent for TextBox
            var _divContent = document.createElement('DIV');
            _divContent.style.position = 'relative';
            _divContent.style.width = this._widthValue + 'px';
            _divContent.style.fontSize = e.clientHeight + 'px';
            _divContent.style.height = e.clientHeight + 'px';
            _divContent.style.paddingRight = '24px';

            if(!(Sys.Browser.agent == Sys.Browser.Firefox || Sys.Browser.agent == Sys.Browser.Safari))
                _divContent.style.display = 'inline';
            else
                _divContent.style.display = 'inline-block';

            e.parentNode.insertBefore(_divContent, e);

            var _innerTable = document.createElement('TABLE'),
                _innerTbody = document.createElement('TBODY'),
                _innerRow1 = document.createElement('TR'),
                _innerRow2 = document.createElement('TR'),
                _textboxCell = document.createElement('TD'),
                _upButtonCell = document.createElement('TD'),
                _downButtonCell = document.createElement('TD');

            _textboxCell.rowSpan = '2';

            _textboxCell.style.verticalAlign = 'middle';
            _upButtonCell.style.verticalAlign = 'bottom';
            _upButtonCell.style.lineHeight = '0';
            _downButtonCell.style.verticalAlign = 'top';
            _downButtonCell.style.lineHeight = '0';

            _innerRow1.appendChild(_textboxCell);
            _innerRow1.appendChild(_upButtonCell);
            _innerRow2.appendChild(_downButtonCell);
            _innerTbody.appendChild(_innerRow1);
            _innerTbody.appendChild(_innerRow2);
            _innerTable.appendChild(_innerTbody);
            _divContent.appendChild(_innerTable);

            e.parentNode.removeChild(e);
            _textboxCell.appendChild(e);

            _innerTable.style.borderCollapse = 'collapse';
            _innerTable.cellSpacing = '0';
            _innerTable.cellPadding = '0';

            _innerTable.style.display = 'inline';
            _innerTable.style.position = 'relative';

            _textboxCell.style.padding = '0';
            _upButtonCell.style.padding = '0';
            _downButtonCell.style.padding = '0';
            _textboxCell.style.margin = '0';
            _upButtonCell.style.margin = '0';
            _downButtonCell.style.margin = '0';
        }

        // If no Up button create it
        if(!this._targetButtonUpIDValue) {
            this._bUp = document.createElement('input');
            this._bUp.type = 'button';
            this._bUp.id = e.id + '_bUp';
            this._bUp.style.border = 'outset 1px';

            if(Sys.Browser.agent == Sys.Browser.InternetExplorer) {
                this._bUp.style.fontFamily = 'Webdings';
                this._bUp.style.fontSize = '9pt';
                this._bUp.value = '5';
            } else {
                this._bUp.style.fontFamily = 'Tahoma, Arial, sans-serif';
                this._bUp.style.fontSize = '5pt';
                this._bUp.value = '\u25B2';
                this._bUp.style.fontWeight = 'bold';
                this._bUp.style.lineHeight = '3pt';
            }

            this._bUp.style.height = '12px';
            this._bUp.style.width = '24px';
            this._bUp.style.overflow = 'hidden';
            this._bUp.style.margin = '0';

            _upButtonCell.appendChild(this._bUp);
        }

        // If no Down button create it
        if(!this._targetButtonDownIDValue) {
            this._bDown = document.createElement('input');
            this._bDown.type = 'button';
            this._bDown.id = e.id + '_bDown';
            this._bDown.style.border = 'outset 1px';

            if(Sys.Browser.agent == Sys.Browser.InternetExplorer) {
                this._bDown.value = '6';
                this._bDown.style.fontFamily = 'Webdings';
                this._bDown.style.fontSize = '9pt';
            } else {
                this._bDown.value = '\u25BC';
                this._bDown.style.fontFamily = 'Tahoma, Arial, sans-serif';
                this._bDown.style.fontSize = '5pt';
                this._bDown.style.fontWeight = 'bold';
            }

            this._bDown.style.height = '12px';
            this._bDown.style.width = '24px';
            this._bDown.style.overflow = 'hidden';
            this._bDown.style.margin = '0';

            _downButtonCell.appendChild(this._bDown);
        }

        // Add button Up Down Event
        if(this._bUp == null)
            this._bUp = document.getElementById(this._targetButtonUpIDValue);

        if(this._bUp) {
            this._clickUpHandler = Function.createDelegate(this, this._clickUp);
            $addHandler(this._bUp, 'click', this._clickUpHandler);
        }

        if(this._bDown == null)
            this._bDown = document.getElementById(this._targetButtonDownIDValue);

        if(this._bDown) {
            this._clickDownHandler = Function.createDelegate(this, this._clickDown);
            $addHandler(this._bDown, 'click', this._clickDownHandler);
        }
    },

    dispose: function() {
        if(this._changeHandler) {
            $removeHandler(this.get_element(), 'blur', this._changeHandler);
            this._changeHandler = null;
        }

        if(this._clickUpHandler)
            if(this._bUp) {
                $removeHandler(this._bUp, 'click', this._clickUpHandler);
                this._clickUpHandler = null;
            }

        if(this._clickDownHandler)
            if(this._bDown) {
                $removeHandler(this._bDown, 'click', this._clickDownHandler);
                this._clickDownHandler = null;
            }

        Sys.Extended.UI.NumericUpDownBehavior.callBaseMethod(this, 'dispose');
    },

    add_currentChanged: function(handler) {
        this.get_events().addHandler('currentChanged', handler);
    },

    remove_currentChanged: function(handler) {
        this.get_events().removeHandler('currentChanged', handler);
    },

    raiseCurrentChanged: function(eventArgs) {
        var handler = this.get_events().getHandler('currentChanged');
        if(handler) {
            if(!eventArgs)
                eventArgs = Sys.EventArgs.Empty;
            handler(this, eventArgs);
        }
    },

    _onChange: function() {
        this.readValue();

        if(this._refValuesValue) {
            this.setCurrentToTextBox(this._refValuesValue[this._currentValue]);

            if(this._elementTextBox)
                this._elementTextBox.readOnly = true;
        } else {
            this.setCurrentToTextBox(this._currentValue);

            if(this._elementTextBox)
                // Make the textbox readonly if its results come from a webservice
                this._elementTextBox.readOnly = this._serviceUpMethodValue || this._serviceDownMethodValue;
        }
    },

    readValue: function() {
        // Parse value of textbox and this._currentValue to be that value.
        // this._currentValue = this._min if some there is an exception
        // when attempting to parse.
        // Parse int or string element of RefValues

        if(this._elementTextBox) {
            var v = this._elementTextBox.value;
            // if textbox empty this._currentValue = this._min
            if(!this._refValuesValue) {
                if(!v) {
                    this._currentValue = this._min;
                } else {
                    try {
                        this._currentValue = parseFloat(v);
                    } catch(ex) {
                        this._currentValue = this._min;
                    }
                }

                if(isNaN(this._currentValue))
                    this._currentValue = this._min;

                this.setCurrentToTextBox(this._currentValue);
                this._valuePrecision = this._computePrecision(this._currentValue);
            } else {
                if(!v) {
                    this._currentValue = 0;
                } else {
                    var find = 0;
                    for(var i = 0; i < this._refValuesValue.length; i++)
                        if(v.toLowerCase() == this._refValuesValue[i].toLowerCase())
                            find = i;

                    this._currentValue = find;
                }

                this.setCurrentToTextBox(this._refValuesValue[this._currentValue]);
            }
        }
    },

    setCurrentToTextBox: function(value) {
        if(this._elementTextBox) {
            this._elementTextBox.value = value;
            this.raiseCurrentChanged(value);

            if(document.createEvent) {
                var onchangeEvent = document.createEvent('HTMLEvents');
                onchangeEvent.initEvent('change', true, false);
                this._elementTextBox.dispatchEvent(onchangeEvent);
            } else if(document.createEventObject) {
                this._elementTextBox.fireEvent('onchange');
            }
        }
    },

    _incrementValue: function(step) {
        // Use toFixed/parseFloat to prevent quantization when incrementing
        var tmp = parseFloat((this._currentValue + step).toFixed(Math.max(this._stepPrecision, this._valuePrecision)));

        if(step > 0)
            this._currentValue = Math.max(Math.min(tmp, this._max), this._min);
        else
            this._currentValue = Math.min(Math.max(tmp, this._min), this._max);
    },

    _computePrecision: function(value) {
        // Compute the precision of the value by counting the number
        // of digits in the fractional part of its string representation
        // "value" - value
        // returns fractional precision of the number

        if(value == Number.Nan)
            return this._min;

        // Call toString which does not localize, according to ECMA 262
        var str = value.toString();
        if(str) {
            var fractionalPart = /\.(\d*)$/;
            var matches = str.match(fractionalPart);
            if(matches && matches.length == 2 && matches[1])
                return matches[1].length;
        }

        return this._min;
    },

    get_Width: function() {
        // Combined size of the TextBox and Up/Down buttons (min value 25).
        // This property is not used if you provide custom buttons.
        return this._widthValue;
    },

    set_Width: function(value) {
        if(this._widthValue != value) {
            this._widthValue = value;
            this.raisePropertyChanged('Width');
        }
    },

    get_Tag: function() {
        // Specifies a custom parameter to pass to the Web Service
        return this._tagValue;
    },

    set_Tag: function(value) {
        if(this._tagValue != value) {
            this._tagValue = value;
            this.raisePropertyChanged('Tag');
        }
    },

    get_TargetButtonUpID: function() {
        // Reference to a custom Up button
        return this._targetButtonUpIDValue;
    },

    set_TargetButtonUpID: function(value) {
        if(this._targetButtonUpIDValue != value) {
            this._targetButtonUpIDValue = value;
            this.raisePropertyChanged('TargetButtonUpID');
        }
    },

    get_TargetButtonDownID: function() {
        // Reference to a custom Down button
        return this._targetButtonDownIDValue;
    },

    set_TargetButtonDownID: function(value) {
        if(this._targetButtonDownIDValue != value) {
            this._targetButtonDownIDValue = value;
            this.raisePropertyChanged('TargetButtonDownID');
        }
    },

    get_ServiceUpPath: function() {
        // Path to a web service that returns the data used to get the next value.
        // If empty, a PageMethod will be used instead of a web service.
        return this._serviceUpPathValue;
    },

    set_ServiceUpPath: function(value) {
        if(this._serviceUpPathValue != value) {
            this._serviceUpPathValue = value;
            this.raisePropertyChanged('ServiceUpPath');
        }
    },

    get_ServiceUpMethod: function() {
        // Name of the method to call on the web service (or the name of a PageMethod) to get the next value

        // The signature of the web method must be of the form:
        //     [WebMethod]
        //     public int MethodName(int current, string tag)
        //     {
        //         ...
        //     }
        return this._serviceUpMethodValue;
    },

    set_ServiceUpMethod: function(value) {
        if(this._serviceUpMethodValue != value) {
            this._serviceUpMethodValue = value;
            this.raisePropertyChanged('ServiceUpMethod');

            if(this._elementTextBox)
                this._elementTextBox.readOnly = true;
        }
    },

    get_ServiceDownPath: function() {
        // Path to a web service that returns the data used to get the previous value.
        // If empty, a PageMethod will be used instead of a web service.
        return this._serviceDownPathValue;
    },

    set_ServiceDownPath: function(value) {
        if(this._serviceDownPathValue != value) {
            this._serviceDownPathValue = value;
            this.raisePropertyChanged('ServiceDownPath');
        }
    },

    get_ServiceDownMethod: function() {
        // Name of the method to call on the web service (or the name of a PageMethod) to get the previous value

        // The signature of the web method must be of the form:
        //     [WebMethod]
        //     public int MethodName(int current, string tag)
        //     {
        //         ...
        //     }
        return this._serviceDownMethodValue;
    },

    set_ServiceDownMethod: function(value) {
        if(this._serviceDownMethodValue != value) {
            this._serviceDownMethodValue = value;
            this.raisePropertyChanged('ServiceDownMethod');

            if(this._elementTextBox)
                this._elementTextBox.readOnly = true;
        }
    },

    get_RefValues: function() {
        // A list of strings separated by semicolons (;) to be used as an enumeration
        return this._refValuesValue ? this._refValuesValue.join(";") : "";
    },

    set_RefValues: function(value) {
        if(value != '') {
            this._refValuesValue = value.split(';');
            this._onChange();

            if(this._elementTextBox)
                this._elementTextBox.readOnly = true;
        } else {
            this._refValuesValue = null;

            if(this._elementTextBox)
                this._elementTextBox.readOnly = false;
        }

        this.raisePropertyChanged('RefValues');
    },

    get_Step: function() {
        // Step used for simple numeric incrementing and decrementing
        return this._step;
    },

    set_Step: function(value) {
        if(value != this._step) {
            this._step = value;
            this._stepPrecision = this._computePrecision(value);
            this.raisePropertyChanged('Step');
        }
    },

    get_Minimum: function() {
        return this._min;
    },

    set_Minimum: function(value) {
        if(value != this._min) {
            this._min = value;
            this.raisePropertyChanged('Minimum');
        }
    },

    get_Maximum: function() {
        return this._max;
    },

    set_Maximum: function(value) {
        if(value != this._max) {
            this._max = value;
            this.raisePropertyChanged('Maximum');
        }
    },

    _clickUp: function(evt) {
        // Handler for the Up button's click event
        // "evt" - event info
        this.readValue();

        // Proxy WebService
        if(this._serviceUpPathValue && this._serviceUpMethodValue) {
            // Call the helper web service
            Sys.Net.WebServiceProxy.invoke(this._serviceUpPathValue, this._serviceUpMethodValue, false,
                { current: this._currentValue, tag: this._tagValue },
                Function.createDelegate(this, this._onMethodUpDownComplete));
            $common.updateFormToRefreshATDeviceBuffer();
        } else {
            // Else increment one element on _refValues or juste this._currentValue++
            if(this._refValuesValue) {
                if((this._currentValue + 1) < this._refValuesValue.length) {
                    this._currentValue = this._currentValue + 1;
                    this.setCurrentToTextBox(this._refValuesValue[this._currentValue]);
                }
            } else {
                this._incrementValue(this._step);
                this.setCurrentToTextBox(this._currentValue);
            }
        }

        if(evt)
            evt.preventDefault();

        return false;
    },

    _clickDown: function(evt) {
        this.readValue();

        // Proxy WebService
        if(this._serviceDownPathValue && this._serviceDownMethodValue) {
            // Call the helper web service
            Sys.Net.WebServiceProxy.invoke(this._serviceDownPathValue, this._serviceDownMethodValue, false,
                { current: this._currentValue, tag: this._tagValue },
                Function.createDelegate(this, this._onMethodUpDownComplete));
            $common.updateFormToRefreshATDeviceBuffer();
        } else {
            // Else decrement one element on _refValues or juste this._currentValue--
            if(this._refValuesValue) {
                if((this._currentValue - 1) >= 0) {
                    this._currentValue = this._currentValue - 1;
                    this.setCurrentToTextBox(this._refValuesValue[this._currentValue]);
                }
            } else {
                this._incrementValue(-this._step);
                this.setCurrentToTextBox(this._currentValue);
            }
        }

        if(evt)
            evt.preventDefault();

        return false;
    },

    // Call BackWebServices
    _onMethodUpDownComplete: function(result, userContext, methodName) {
        this._currentValue = result;
        this.setCurrentToTextBox(this._currentValue);
    }
}

Sys.Extended.UI.NumericUpDownBehavior.registerClass('Sys.Extended.UI.NumericUpDownBehavior', Sys.Extended.UI.BehaviorBase);