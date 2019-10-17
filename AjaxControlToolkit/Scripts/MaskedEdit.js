Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.MaskedEditBehavior = function(element) {
    Sys.Extended.UI.MaskedEditBehavior.initializeBase(this, [element]);

    // mask
    this._mask = "";
    this._maskType = Sys.Extended.UI.MaskedEditType.None;
    this._filtered = "";
    this._promptCharacter = "_";
    this._inputDirection = Sys.Extended.UI.MaskedEditInputDirections.LeftToRight;

    // Message
    this._messageValidatorTip = true;
    this._showMessageErrorFloat = false;
    this._cssMessageErrorFloat = "";

    // AutoComplete
    this._autoComplete = true;
    this._autoCompleteValue = "";

    // behavior
    this._clearTextOnInvalid = false;
    this._clearMaskOnLostfocus = true;
    this._acceptAmPm = Sys.Extended.UI.MaskedEditShowSymbol.None;
    this._acceptNegative = Sys.Extended.UI.MaskedEditShowSymbol.None;
    this._displayMoney = Sys.Extended.UI.MaskedEditShowSymbol.None;

    // CSS
    this._onFocusCssClass = "MaskedEditFocus";
    this._onInvalidCssClass = "MaskedEditError";
    this._onFocusCssNegative = "MaskedEditFocusNegative";
    this._onBlurCssNegative = "MaskedEditBlurNegative";

    // globalization 
    this._cultureName = Sys.CultureInfo.CurrentCulture.name; // "en-US"
    this._userDateFormat = Sys.Extended.UI.MaskedEditUserDateFormat.None;
    this._userTimeFormat = Sys.Extended.UI.MaskedEditUserTimeFormat.None;

    // globalization Hidden 
    this._cultureDatePlaceholder = Sys.CultureInfo.CurrentCulture.dateTimeFormat.DateSeparator; // "/"
    this._cultureTimePlaceholder = Sys.CultureInfo.CurrentCulture.dateTimeFormat.TimeSeparator; // ":"
    this._cultureDecimalPlaceholder = Sys.CultureInfo.CurrentCulture.numberFormat.NumberDecimalSeparator; // "."
    this._cultureThousandsPlaceholder = Sys.CultureInfo.CurrentCulture.numberFormat.NumberGroupSeparator; // ","

    this._cultureDateFormat = "MDY";
    var parts = Sys.CultureInfo.CurrentCulture.dateTimeFormat.ShortDatePattern.split(this._cultureDatePlaceholder);

    if(parts.length >= 3)
        this._cultureDateFormat = parts[0].substr(0, 1).toUpperCase() + parts[1].substr(0, 1).toUpperCase() + parts[2].substr(0, 1).toUpperCase(); // "MDY"

    this._cultureCurrencySymbolPlaceholder = Sys.CultureInfo.CurrentCulture.numberFormat.CurrencySymbol; // "$"
    this._cultureAMPMPlaceholder = Sys.CultureInfo.CurrentCulture.dateTimeFormat.PMDesignator + ";" + Sys.CultureInfo.CurrentCulture.dateTimeFormat.PMDesignator; // "AM;PM"
    this._AMPMPlaceholderSeparator = ";";
    this._century = 1900;

    // clipboard
    this._allowCopyPaste = true;
    this._clipboardText = (Sys.Extended.UI.Resources && Sys.Extended.UI.Resources.Shared_BrowserSecurityPreventsPaste) ||
        "Your browser security settings don't permit the automatic execution of paste operations. Please use the keyboard shortcut Ctrl+V instead.";

    // local var mask valid
    //  9 = only numeric
    //  L = only letter
    //  $ = only letter and spaces
    //  C = only custom - read from this._filtered
    //  A = only letter and custom
    //  N = only numeric and custom
    //  ? = any digit
    this._CharsEditMask = "9L$CAN?";

    // local var special mask
    // At runtime replace with culture property
    //  / = Date placeholder
    //  : = Time placeholder
    //  . = Decimal placeholder
    //  , = Thousands placeholder
    this._CharsSpecialMask = "/:.,";

    // local converted mask 
    // i.e.: 9{2} => 99 , 9{2}/9{2}/9{2} = 99/99/99
    this._maskConv = "";

    this._EmptyMask = "";
    this._maskvalid = ""
    this._DirectSelText = ""; // save the Direction selected Text (only for ie)
    this._initialvalue = ""; // save the initial value for verify changed
    this._LogicSymbol = ""; // save the symbol - or AM/PM
    this._LogicTextMask = ""; // save logic mask with text input
    this._LogicMask = ""; // save logic mask without text
    this._LogicMaskConv = ""; // save logic mask without text and without escape
    this._LogicPrompt = String.fromCharCode(1); // logic prompt char
    this._LogicEscape = String.fromCharCode(2); // logic escape char
    this._LogicFirstPos = -1; // first valid position
    this._LogicLastPos = -1; // Last valid position
    this._LogicLastInt = -1; // Last valid position RTL Integer with decimal
    this._LogicDateTimeSepPos = -1; // valid position seperating date & time
    this._QtdValidInput = 0; // Qtd Valid input Position 
    this._InLostfocus = false; // Flag to validate in lost focus not duplicate clearMask execute
    this._ExternalMessageError = ""; // Save local MessageError from Controls Validator
    this._CurrentMessageError = ""; // Save local Current MessageError
    this._FiringOnChange = false;  // true when OnChange is being fired
    this._ErroOnEnter = false; // Flag Erro validate with Enter

    // local chars ANSI
    this._charLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this._charNumbers = "0123456789";
    this._charEscape = "\\";

    // local placeholder delimit for info repeat mask
    this._DelimitStartDup = "{";
    this._DelimitEndDup = "}";

    // Handler
    this._focusHandler = null;
    this._keypressdown = null;
    this._keypressHandler = null;
    this._blurHandler = null;
    this._mouseOutHandler = null;
    this._mouseOutHandler = null;
    this._mouseMoveHandler = null;
    this._mouseEnterHandler = null;
    this._changeHandler = null;

    // Only for Opera
    this._timer = null; //Timer
    this._timerHandler = null; //Timer Handler
    this._SaveSymb = ""; // Symb Saved immediate perform Action
    this._SaveText = ""; // Text Saved immediate perform Action
    this._SavePosi = -1; // Cursor pos Saved immediate perform Action
    this._SaveMask = ""; // Mask with text Saved 
    this._SaveKeyDown = 0; // save scancode at keydown
}

Sys.Extended.UI.MaskedEditBehavior.prototype = {

    initialize: function() {
        var e = this.get_element();

        this._InLostfocus = true;
        Sys.Extended.UI.MaskedEditBehavior.callBaseMethod(this, 'initialize');

        this._createMask();

        // if this textbox is focused initially
        var hasInitialFocus = false,
            clientState = this.get_ClientState();

        if(clientState != null && clientState != "") {
            hasInitialFocus = (clientState == "Focused");
            this.set_ClientState(null);
        }

        //only for ie , for firefox see keydown
        try {
            if(e === document.activeElement)
                hasInitialFocus = true;
        } catch(ex) { }

        // Create delegates Attach events
        if(this._showMessageErrorFloat) {
            this._mouseOutHandler = Function.createDelegate(this, this._onMouseOut);
            $addHandler(e, "mouseout", this._mouseOutHandler);

            this._mouseMoveHandler = Function.createDelegate(this, this._onMouseMove);
            $addHandler(e, "mousemove", this._mouseMoveHandler);

            this._mouseEnterHandler = Function.createDelegate(this, this._onMouseover);
            $addHandler(e, "mouseover", this._mouseEnterHandler);
        }

        if(!e.readOnly) {
            this._keypressdown = Function.createDelegate(this, this._onKeyPressdown);
            $addHandler(e, "keydown", this._keypressdown);

            this._keypressHandler = Function.createDelegate(this, this._onKeyPress);
            $addHandler(e, "keypress", this._keypressHandler);
        }

        this._focusHandler = Function.createDelegate(this, this._onFocus);
        $addHandler(e, "focus", this._focusHandler);

        this._blurHandler = Function.createDelegate(this, this._onBlur);
        $addHandler(e, "blur", this._blurHandler);

        this._changeHandler = Function.createDelegate(this, this._onChange);
        $addHandler(e, "change", this._changeHandler);

        if(Sys.Browser.agent == Sys.Browser.Opera) {
            this._timerHandler = Function.createDelegate(this, this._OnTimerTicket);
            this._timer = new Sys.Timer();
            this._timer.set_enabled(false);
            this._timer.set_interval(100);
            this._timer.add_tick(this._timerHandler);
            this._SaveText = "";
            this._SavePosi = -1;
            this._timer.set_enabled(true);
        }

        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(e);
        this._InitValue(wrapper.get_Value(), true);

        if(hasInitialFocus) {
            this._onFocus();
        } else {
            if(this._clearMaskOnLostfocus)
                wrapper.set_Value(this._getClearMask(wrapper.get_Value()));

            var IsValid = this._CaptureServerValidators();
            if(!IsValid)
                if(this._onInvalidCssClass != "")
                    this.addCssClassMaskedEdit(this._onInvalidCssClass);
        }
    },

    dispose: function() {
        var e = this.get_element();

        if(this._mouseOutHandler) {
            $removeHandler(e, "mouseout", this._mouseOutHandler);
            this._mouseOutHandler = null;
        }

        if(this._mouseMoveHandler) {
            $removeHandler(e, "mousemove", this._mouseMoveHandler);
            this._mouseMoveHandler = null;
        }

        if(this._mouseEnterHandler) {
            $removeHandler(e, "mouseover", this._mouseEnterHandler);
            this._mouseEnterHandler = null;
        }

        if(this._focusHandler) {
            $removeHandler(e, "focus", this._focusHandler);
            this._focusHandler = null;
        }

        if(this._blurHandler) {
            $removeHandler(e, "blur", this._blurHandler);
            this._blurHandler = null;
        }

        if(this._changeHandler) {
            $removeHandler(e, "change", this._changeHandler);
            this._changeHandler = null;
        }

        if(this._keypressdown) {
            $removeHandler(e, "keydown", this._keypressdown);
            this._keypressdown = null;
        }

        if(this._keypressHandler) {
            $removeHandler(e, "keypress", this._keypressHandler);
            this._keypressHandler = null;
        }

        if(this._timerHandler) {
            this._timer.set_enabled(false);
            this._timerHandler = null;
            this._timer.dispose();
            this._timer = null;
        }

        Sys.Extended.UI.MaskedEditBehavior.callBaseMethod(this, 'dispose');
    },
    // EVENT TARGET
    _OnTimerTicket: function() {
        this._SaveSymb = "";

        if(this._InLostfocus)
            return;

        this._timer.set_enabled(false);
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());

        if(this._SaveText != "") {
            wrapper.set_Value(this._SaveText);

            this.setSelectionRange(this._SavePosi, this._SavePosi);
            this._SaveText = "";
            this._SavePosi = -1;
            this._SaveMask = wrapper.get_Value();
        } else {
            if(wrapper.get_Value().length != this._EmptyMask.length)
                wrapper.set_Value(this._SaveMask);

            if(this._timer.get_interval() != 100)
                this._timer.set_interval(100);
        }

        this._timer.set_enabled(true);
    },

    _onChange: function() {
        if(!this._FiringOnChange)
            //capture and initialize external input Ex : calendar Extender
            this._onFocus();
    },

    _onFocus: function() {
        var e = this.get_element();
        if(e.readOnly || e.disabled)
            return;

        if(!this._keypressdown) {
            this._keypressdown = Function.createDelegate(this, this._onKeyPressdown);
            $addHandler(e, "keydown", this._keypressdown);
        }

        if(!this._keypressHandler) {
            this._keypressHandler = Function.createDelegate(this, this._onKeyPress);
            $addHandler(e, "keypress", this._keypressHandler);
        }

        this._InLostfocus = false;
        this._RemoveDivToolTip();

        if(this._onFocusCssClass != "")
            this.addCssClassMaskedEdit(this._onFocusCssClass);

        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(e);
        this._initialvalue = wrapper.get_Value();
        this._InitValue(wrapper.get_Value(), false);

        var ClearText = this._getClearMask(),
            hastip = false;

        if(this._messageValidatorTip && ClearText == "")
            hastip = true;

        if((this._maskType == Sys.Extended.UI.MaskedEditType.Time || this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) && this.get_cultureAMPMPlaceholder() != "" && ClearText == "") {
            if(this._acceptAmPm)
                this.insertAMPM(this.get_cultureAMPMPlaceholder().substring(0, 1));
        } else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && ClearText != "") {
            if(this._LogicSymbol == "-" && this._onFocusCssNegative != "")
                this.addCssClassMaskedEdit(this._onFocusCssNegative);
        }

        if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft) {
            if(this._LogicLastInt != -1)
                this.setSelectionRange(this._LogicLastInt, this._LogicLastInt);
            else
                this.setSelectionRange(this._LogicLastPos + 1, this._LogicLastPos + 1);
        } else {
            if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && ClearText != "") {
                var pos = this._getLastEmptyPosition() + 1;
                this.setSelectionRange(pos, pos);
            } else {
                this.setSelectionRange(this._LogicFirstPos, this._LogicFirstPos);
            }
        }

        this.showTooltipMessage(false);
        if(hastip)
            this.showTooltipMessage(true);
    },

    _PeforformValidLostFocus: function(isblur) {
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
        var ClearText = this._getClearMask(wrapper.get_Value());

        if(ClearText == "" && this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._LogicSymbol == "-")
            this.insertSignal("+");

        // auto format 
        if(ClearText != "" && this._autoComplete && this._maskType == Sys.Extended.UI.MaskedEditType.Date)
            this.AutoFormatDate();
        else if(ClearText != "" && this._autoComplete && this._maskType == Sys.Extended.UI.MaskedEditType.Time)
            this.AutoFormatTime();
        else if(ClearText != "" && this._autoComplete && this._maskType == Sys.Extended.UI.MaskedEditType.DateTime)
            this.AutoFormatDateTime();
        else if(ClearText != "" && this._autoComplete && this._maskType == Sys.Extended.UI.MaskedEditType.Number)
            this.AutoFormatNumber();

        // clear mask and set CSS
        if((this._clearMaskOnLostfocus && ClearText != "") || (isblur && this._clearMaskOnLostfocus))
            wrapper.set_Value(this._getClearMask(wrapper.get_Value()));

        this.addCssClassMaskedEdit("");
        if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._LogicSymbol == "-" && this._onBlurCssNegative != "")
            this.addCssClassMaskedEdit(this._onBlurCssNegative);

        // perform validation
        this.showTooltipMessage(false);
        this._RemoveDivToolTip();

        var IsValid = this._CaptureClientsValidators();
        if(!IsValid) {
            if(this._onInvalidCssClass != "")
                this.addCssClassMaskedEdit(this._onInvalidCssClass);

            if(this._clearTextOnInvalid) {
                this._createMask();
                wrapper.set_Value(this._EmptyMask);
            }
        }

        return IsValid;
    },

    _onBlur: function(evt) {
        this._InLostfocus = true;
        var IsValid = this._PeforformValidLostFocus(true);

        if(IsValid) {
            var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
            // trigger TextChanged with postback
            if(!this.get_element().readOnly && (this._initialvalue != wrapper.get_Value()) && evt)
                this._fireChanged();
        }
    },

    _fireChanged: function() {
        // Attempts to fire the change event on the attached textbox
        this._FiringOnChange = true;
        var elt = this.get_element();

        if(document.createEventObject) {
            elt.fireEvent("onchange");
        } else if(document.createEvent) {
            var e = document.createEvent("HTMLEvents");
            e.initEvent("change", true, true);
            elt.dispatchEvent(e);
        }

        this._FiringOnChange = false;
    },

    _onKeyPress: function(evt) {
        var scancode = this._KeyCode(evt);
        if(scancode == 9) // tab default action
            return true;

        if(scancode == 13) {
            var IsValid = this._PeforformValidLostFocus(false);
            this._ErroOnEnter = false;

            if(!IsValid)
                this._ErroOnEnter = true;

            // Opera not perform cancel event. Re-perform at Timer
            if(Sys.Browser.agent == Sys.Browser.Opera) {
                var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());

                this._SaveText = wrapper.get_Value();
                this._SavePosi = this._getCurrentPosition();
                this._timer.set_enabled(false);
                this._timer.set_interval(1);
                this._timer.set_enabled(true);
            }

            return IsValid;
        }

        if(this._onFocusCssClass != "" && this._ErroOnEnter)
            this.addCssClassMaskedEdit(this._onFocusCssClass);

        this._ErroOnEnter = false;
        if(!this._isNormalChar(evt, scancode)) {
            this._ExecuteNav(evt, scancode);
            return false;
        }

        // process and validate normal char
        var curpos = this._deleteTextSelection();
        if(curpos == -1)
            curpos = this._getCurrentPosition()

        var c = String.fromCharCode(scancode);
        if(this._maskType == Sys.Extended.UI.MaskedEditType.Date && c == this.get_cultureDatePlaceholder())
            this._AdjustElementDate();
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Time && c == this.get_cultureTimePlaceholder())
            this._AdjustElementTime();
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime && (c == this.get_cultureTimePlaceholder() || c == this.get_cultureDatePlaceholder()))
            this._AdjustElementDateTime(c);
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.LeftToRight && c == this.get_cultureDecimalPlaceholder() && curpos == this._LogicLastInt)
            this._AdjustElementDecimalLTR();
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft && c == this.get_cultureDecimalPlaceholder() && curpos == this._LogicLastInt)
            this._AdjustElementDecimalRTL();
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && c == this.get_cultureDecimalPlaceholder() && curpos != this._LogicLastInt)
            this._MoveDecimalPos();
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.LeftToRight && c == this.get_cultureThousandsPlaceholder())
            this._MoveThousandLTR();
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft && c == this.get_cultureThousandsPlaceholder())
            this._MoveThousandRTL();
        else if((this._maskType == Sys.Extended.UI.MaskedEditType.Time || this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) && this.getCultureFirstLettersAMPM().toUpperCase().indexOf(c.toUpperCase()) != -1) {
            if(this._acceptAmPm) {
                this.insertAMPM(c);
                this.setSelectionRange(curpos, curpos);
            }
        }
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._acceptNegative != Sys.Extended.UI.MaskedEditShowSymbol.None && "+-".indexOf(c) != -1)
            if(Sys.Browser.agent != Sys.Browser.Opera) {
                this.insertSignal(c);
                this.setSelectionRange(curpos, curpos);
            } else {
                // Opera perform double event! when press "-" at numpad key
                if(this._SaveSymb == "") {
                    this.insertSignal(c);
                    this.setSelectionRange(curpos, curpos);
                    this._SaveSymb = c;
                    this._timer.set_enabled(false);
                    this._timer.set_interval(1);
                    this._timer.set_enabled(true);
                } else {
                    this._SaveSymb = "";
                }
            }
        else {
            var OriPos = curpos;
            curpos = this._getNextPosition(curpos);
            var logiccur = curpos;

            if(this._LogicLastInt != -1 && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft) {
                if(OriPos == this._LogicLastInt)
                    logiccur = this._getLastEmptyPosition();
            } else {
                if(curpos >= this._LogicLastPos + 1 && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft)
                    logiccur = this._getLastEmptyPosition();
            }

            if(this._processKey(logiccur, c)) {
                if(this._messageValidatorTip)
                    this.showTooltipMessage(false);

                if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.LeftToRight) {
                    this._insertContent(c, logiccur);
                    curpos = this._getNextPosition(logiccur + 1);
                } else if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft) {
                    if(this._LogicLastInt == -1) {
                        if(curpos < this._LogicLastPos + 1) {
                            this._insertContent(c, logiccur);
                            curpos = this._getNextPosition(logiccur + 1);
                        } else {
                            this._insertContentRight(c);
                            curpos = this._LogicLastPos + 1;
                        }
                    } else {
                        if(OriPos != this._LogicLastInt) {
                            this._insertContent(c, logiccur);
                            curpos = this._getNextPosition(logiccur + 1);
                        } else {
                            this._insertContentRight(c);
                            curpos = this._LogicLastInt;
                        }
                    }
                }

                this.setSelectionRange(curpos, curpos);
            }
        }

        this._SetCancelEvent(evt);

        return false;
    },

    _onKeyPressdown: function(evt) {
        // for other browsers not IE (NOT IMPLEMENT document.activeElement)
        if(this._InLostfocus)
            this._onFocus(evt);

        var scancode = this._KeyCode(evt);
        if(scancode == 9) //tab default action
            return true;

        if(scancode == 13)  //enter 
            return true;

        if(!this._isNormalChar(evt, scancode)) {
            this._ExecuteNav(evt, scancode);
        } else {
            // Opera not perform cancel event. Re-perform at Timer
            if(Sys.Browser.agent == Sys.Browser.Opera) {
                // cancel shift Ins , assume Ins = "-"
                if(evt.rawEvent.shiftKey && !evt.rawEvent.ctrlKey && !evt.rawEvent.altKey && evt.rawEvent.keyCode == 45) {
                    var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());

                    this._SaveText = wrapper.get_Value();
                    this._SavePosi = this._getCurrentPosition();
                    this._timer.set_enabled(false);
                    this._timer.set_interval(1);
                    this._timer.set_enabled(true);
                }
            }
        }
    },

    _onMouseOut: function(evt) {
        this._RemoveDivToolTip();
    },

    _onMouseMove: function(evt) {
        if((this._InLostfocus || this._ErroOnEnter) && this._ExternalMessageError != "")
            this._ShowDivToolTip(evt);
    },

    _onMouseover: function(evt) {
        // check if validation execute at asyc.post back
        if(!$get("DivMaskedEditTip_" + this.get_element().id))
            this._CaptureServerValidators();

        if((this._InLostfocus || this._ErroOnEnter) && this._ExternalMessageError != "")
            this._createDivToolTip(evt, this._ExternalMessageError);
    },

    // CREATE TOOLTIP
    _ShowDivToolTip: function(evt) {
        var et = $get("DivMaskedEditTip_" + this.get_element().id);
        if(!et) {
            this._createDivToolTip(evt, this._ExternalMessageError);
            et = $get("DivMaskedEditTip_" + this.get_element().id);
        }

        var mousepos = this._GetMousePos(evt);
        et.style.left = mousepos.x + 1 /* offset To prevent flick in FF */ + "px";
        et.style.top = mousepos.y + 1 /* offset To prevent flick in FF */ + "px";
    },

    _GetMousePos: function(evt) {
        var scrOfX = 0, scrOfY = 0;
        if(typeof (window.pageYOffset) == 'number') {
            //Netscape compliant
            scrOfY = window.pageYOffset;
            scrOfX = window.pageXOffset;
        } else if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
            //DOM compliant
            scrOfY = document.body.scrollTop;
            scrOfX = document.body.scrollLeft;
        } else if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
            //IE6 standards compliant mode
            scrOfY = document.documentElement.scrollTop;
            scrOfX = document.documentElement.scrollLeft;
        }

        var posX = 0, posY = 0;
        if(typeof (evt.pageX) == 'number') {
            posX = evt.pageX;
            posY = evt.pageY;
        } else if(typeof (evt.clientX) == 'number') {
            posX = evt.clientX;
            posY = evt.clientY;
        }

        return { x: posX + scrOfX, y: posY + scrOfY }
    },

    _RemoveDivToolTip: function() {
        var e = $get("DivMaskedEditTip_" + this.get_element().id);
        if(e)
            document.body.removeChild(e);
    },

    _createDivToolTip: function(evt, Msg) {
        var e = $get("DivMaskedEditTip_" + this.get_element().id);
        if(!e) {
            var DivTp,
                mousepos = this._GetMousePos(evt);

            DivTp = document.createElement("div");
            DivTp.id = "DivMaskedEditTip_" + this.get_element().id;
            DivTp.style.position = "absolute";
            DivTp.style.left = mousepos.x + 2 /* offset */ + "px";
            DivTp.style.top = mousepos.y + 2 /* offset */ + "px";
            DivTp.style.zIndex = Sys.Extended.UI.zIndex.MaskedEditDivTip;

            if(this._cssMessageErrorFloat == "") {
                DivTp.style.padding = "3px 3px 3px 3px";
                DivTp.style.border = "Solid 1px #000000";
                DivTp.style.backgroundColor = "#FFFFEA";
                DivTp.style.fontWeight = "normal";
                DivTp.style.fontSize = "12px";
                DivTp.style.fontFamily = "Arial";
            } else {
                DivTp.className = this._cssMessageErrorFloat;
            }

            DivTp.innerHTML = Msg;
            DivTp = document.body.insertBefore(DivTp, document.body.firstChild);
        }
    },

    // Execute Navigator on Mask
    _ExecuteNav: function(evt, scanCode) {
        if(evt.type == "keydown") {
            if($common.isInternetExplorer()) {
                // ctrl v 
                if((scanCode == 86 || scanCode == 118) && !evt.shiftKey && evt.ctrlKey && !evt.altKey) {
                    this._SetCancelEvent(evt);
                    this._PasteFromClipBoard();

                    return;
                }

                // Shift Ins 
                if(evt.shiftKey && !evt.ctrlKey && !evt.altKey && evt.keyCode == 45) {
                    this._SetCancelEvent(evt);
                    this._PasteFromClipBoard();

                    return;
                }
            }
        }

        if (!$common.isInternetExplorer() || evt.type == "keypress") {
            // Shift Ins 
            if(evt.rawEvent.shiftKey && !evt.rawEvent.ctrlKey && !evt.rawEvent.altKey && evt.rawEvent.keyCode == 45) {
                // at opera assume Ins = "-" not execute Shift-Ins
                this._SetCancelEvent(evt);
                this._PasteFromClipBoard();

                return;
            }
            // ctrl v 
            if(evt.type == "keydown" && (scanCode == 86 || scanCode == 118) && !evt.shiftKey && evt.ctrlKey && !evt.altKey) {
                this._SetCancelEvent(evt);
                this._PasteFromClipBoard();

                return;
            }
        }

        var curpos;
        if(Sys.Browser.agent == Sys.Browser.InternetExplorer || evt.type == "keypress" || evt.type == "keydown") {
            if(scanCode == 8) { // BackSpace
                this._SetCancelEvent(evt);
                curpos = this._deleteTextSelection();

                if(curpos != -1) {
                    this.setSelectionRange(curpos, curpos);
                } else {
                    curpos = this._getCurrentPosition();
                    this._backspace(curpos);

                    curpos = this._getPreviousPosition(curpos - 1);
                    this.setSelectionRange(curpos, curpos);
                }

                var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
                if(this._messageValidatorTip && wrapper.get_Value() == this._EmptyMask)
                    this.showTooltipMessage(true);

                // Opera not perform cancel event. Re-perform at Timer
                if(Sys.Browser.agent == Sys.Browser.Opera) {
                    this._SaveText = wrapper.get_Value();
                    this._SavePosi = curpos;
                    this._timer.set_enabled(false);
                    this._timer.set_interval(1);
                    this._timer.set_enabled(true);
                }
            } else if(scanCode == 46 || scanCode == 127) { // delete
                this._SetCancelEvent(evt);
                var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
                curpos = this._deleteTextSelection();

                if(curpos == -1) {
                    curpos = this._getCurrentPosition();

                    if(!this._isValidMaskedEditPosition(curpos))
                        if(curpos != this._LogicLastInt && this._inputDirection != Sys.Extended.UI.MaskedEditInputDirections.RightToLeft)
                            curpos = this._getNextPosition(curpos);

                    this._deleteAtPosition(curpos, false);
                } else {
                    if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft) {
                        var ClearText = this._getClearMask(wrapper.get_Value());

                        if(ClearText != "") {
                            ClearText = ClearText.replace(new RegExp("(\\" + this.get_cultureThousandsPlaceholder() + ")", "g"), "") + '';

                            if(ClearText.substring(ClearText.length - 1, ClearText.length) == this.get_cultureDecimalPlaceholder()) {
                                ClearText = ClearText.substring(0, ClearText.length - 1);
                                this.loadValue(ClearText, this._LogicLastInt);
                            } else {
                                this.loadValue(ClearText, this._LogicLastPos);
                            }
                        }
                    }
                }

                this.setSelectionRange(curpos, curpos);
                if(this._messageValidatorTip && wrapper.get_Value() == this._EmptyMask)
                    this.showTooltipMessage(true);

                if(Sys.Browser.agent == Sys.Browser.Opera) {
                    this._SaveText = wrapper.get_Value();
                    this._SavePosi = curpos;
                    this._timer.set_enabled(false);
                    this._timer.set_interval(1);
                    this._timer.set_enabled(true);
                }
            } else if(evt.ctrlKey) {
                if(scanCode == 39 || scanCode == 35 || scanCode == 34) { //Right or END or pgdown
                    this._DirectSelText = "R";
                    if(Sys.Browser.agent == Sys.Browser.Opera)
                        return;

                    this._SetCancelEvent(evt);
                    curpos = this._getCurrentPosition();
                    this.setSelectionRange(curpos, this._LogicLastPos + 1);
                } else if(scanCode == 37 || scanCode == 36 || scanCode == 33) { //Left or Home or pgup
                    this._DirectSelText = "L";
                    if(Sys.Browser.agent == Sys.Browser.Opera)
                        return;

                    this._SetCancelEvent(evt);
                    curpos = this._getCurrentPosition();
                    this.setSelectionRange(this._LogicFirstPos, curpos);
                }
            } else if(scanCode == 35 || scanCode == 34) { //END or pgdown
                this._DirectSelText = "R";
                if(Sys.Browser.agent == Sys.Browser.Opera)
                    return;

                this._SetCancelEvent(evt);
                if(evt.shiftKey) {
                    curpos = this._getCurrentPosition();
                    this.setSelectionRange(curpos, this._LogicLastPos + 1);
                } else {
                    this.setSelectionRange(this._LogicLastPos + 1, this._LogicLastPos + 1);
                }
            } else if(scanCode == 36 || scanCode == 33) { //Home or pgup
                this._DirectSelText = "L";
                if(Sys.Browser.agent == Sys.Browser.Opera)
                    return;

                this._SetCancelEvent(evt);
                if(evt.shiftKey) {
                    curpos = this._getCurrentPosition();
                    this.setSelectionRange(this._LogicFirstPos, curpos);
                } else {
                    this.setSelectionRange(this._LogicFirstPos, this._LogicFirstPos);
                }
            } else if(scanCode == 37) { //left
                this._DirectSelText = "L";
                if(Sys.Browser.agent == Sys.Browser.Opera)
                    return;

                this._SetCancelEvent(evt);
                if(evt.shiftKey) {
                    var BoundSel = this._GetBoundSelection();

                    if(BoundSel) {
                        if(BoundSel.left > this._LogicFirstPos)
                            BoundSel.left--;

                        this.setSelectionRange(BoundSel.left, BoundSel.right);
                    } else {
                        var pos = this._getCurrentPosition();
                        if(pos > this._LogicFirstPos)
                            this.setSelectionRange(pos - 1, pos);
                    }
                } else {
                    curpos = this._getCurrentPosition() - 1;
                    if(curpos < this._LogicFirstPos)
                        curpos = this._LogicFirstPos;

                    this.setSelectionRange(curpos, curpos);
                }

                if(Sys.Browser.agent == Sys.Browser.Opera) {
                    var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());

                    this._SaveText = wrapper.get_Value();
                    this._SavePosi = curpos;
                    this._timer.set_enabled(false);
                    this._timer.set_interval(1);
                    this._timer.set_enabled(true);
                }
            } else if(scanCode == 39) { // right
                this._DirectSelText = "R";
                if(Sys.Browser.agent == Sys.Browser.Opera)
                    return;

                this._SetCancelEvent(evt);
                if(evt.shiftKey) {
                    var BoundSel = this._GetBoundSelection();
                    if(BoundSel) {
                        if(BoundSel.right < this._LogicLastPos + 1)
                            BoundSel.right++;

                        this.setSelectionRange(BoundSel.left, BoundSel.right);
                    } else {
                        pos = this._getCurrentPosition();
                        if(pos < this._LogicLastPos + 1)
                            this.setSelectionRange(pos, pos + 1);
                    }
                } else {
                    curpos = this._getCurrentPosition() + 1;
                    if(curpos > this._LogicLastPos + 1)
                        curpos = this._LogicLastPos + 1;

                    this.setSelectionRange(curpos, curpos);
                }

                if(Sys.Browser.agent == Sys.Browser.Opera) {
                    var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());

                    this._SaveText = wrapper.get_Value();
                    this._SavePosi = curpos;
                    this._timer.set_enabled(false);
                    this._timer.set_interval(1);
                    this._timer.set_enabled(true);
                }
            } else if(scanCode == 27) { // esc
                this._SetCancelEvent(evt);
                var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());

                if(this._EmptyMask == this._initialvalue)
                    wrapper.set_Value("");
                else
                    wrapper.set_Value(this._initialvalue);

                this._onFocus();
            }
        }

        // any other nav key
        this._SetCancelEvent(evt);
    },

    _backspace: function(curpos) {
        var exec = false;
        if(curpos > this._LogicFirstPos) {
            var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
            var masktext = wrapper.get_Value();

            curpos = this._getPreviousPosition(curpos - 1);
            this._deleteAtPosition(curpos, true);
            exec = true;
        }

        return exec;
    },

    _deleteAtPosition: function(curpos, isBS) {
        var exec = false,
            lastpos = this._LogicLastPos + 1;

        if(this._LogicLastInt != -1 && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft)
            lastpos = this._LogicLastInt;

        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
        if(isBS == false && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft && curpos == lastpos) {
            var ClearText = this._getClearMask(wrapper.get_Value());
            if(ClearText != "") {
                exec = true;
                ClearText = ClearText.replace(new RegExp("(\\" + this.get_cultureThousandsPlaceholder() + ")", "g"), "") + '';

                if(ClearText.substring(ClearText.length - 1, ClearText.length) == this.get_cultureDecimalPlaceholder())
                    ClearText = ClearText.substring(0, ClearText.length - 1);

                var arr_num = ClearText.split(this.get_cultureDecimalPlaceholder());
                if(this._LogicLastInt != -1 && arr_num[0] != "") {
                    arr_num[0] = arr_num[0].substring(0, arr_num[0].length - 1);
                    ClearText = arr_num[0];

                    if(arr_num.length == 2)
                        ClearText += this.get_cultureDecimalPlaceholder() + arr_num[1];
                } else {
                    ClearText = ClearText.substring(0, ClearText.length - 1);
                }

                ClearText += this._LogicSymbol;
                this.loadValue(ClearText, lastpos);
            }
        } else {
            var masktext = wrapper.get_Value().substring(this._LogicFirstPos, this._LogicLastPos + 1),
                logiTxt = this._LogicTextMask.substring(this._LogicFirstPos, this._LogicLastPos + 1),
                qtdDt = 0,
                curvld = curpos - this._LogicFirstPos;

            if(this._isValidMaskedEditPosition(curpos)) {
                exec = true;
                if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
                    var arr_mask = this._SplitDateTime(masktext),
                        posmask = curpos - this._LogicFirstPos;

                    if(posmask > arr_mask[0].length) {
                        // at position time
                        masktext = arr_mask[1];
                        qtdDt = arr_mask[0].length + 1;
                        logiTxt = logiTxt.substring(qtdDt);
                        curvld -= qtdDt;
                    } else {
                        // at position date
                        masktext = arr_mask[0];
                        logiTxt = logiTxt.substring(0, arr_mask[0].length);
                    }
                }

                var resttext = masktext.substring(curvld + 1),
                    restlogi = logiTxt.substring(curvld + 1);

                masktext = masktext.substring(0, curvld) + this._promptCharacter;
                logiTxt = logiTxt.substring(0, curvld) + this._LogicPrompt;
                var i;

                // clear rest of mask
                for(i = 0 ; i < parseInt(resttext.length, 10) ; i++)
                    if(this._isValidMaskedEditPosition(curpos + 1 + i)) {
                        masktext += this._promptCharacter;
                        logiTxt += this._LogicPrompt;
                    } else {
                        masktext += resttext.substring(i, i + 1);
                        logiTxt += restlogi.substring(i, i + 1);
                    }

                // insert only valid text
                var posaux = this._getNextPosition(curpos);
                for(i = 0 ; i < parseInt(resttext.length, 10) ; i++)
                    if(this._isValidMaskedEditPosition(curpos + 1 + i) && restlogi.substring(i, i + 1) != this._LogicPrompt) {
                        masktext = masktext.substring(0, posaux - this._LogicFirstPos - qtdDt) + resttext.substring(i, i + 1) + masktext.substring(posaux + 1 - this._LogicFirstPos - qtdDt);
                        logiTxt = logiTxt.substring(0, posaux - this._LogicFirstPos - qtdDt) + restlogi.substring(i, i + 1) + logiTxt.substring(posaux + 1 - this._LogicFirstPos - qtdDt);
                        posaux = this._getNextPosition(posaux + 1);
                    }

                if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
                    var oritext = wrapper.get_Value().substring(this._LogicFirstPos, this._LogicLastPos + 1),
                        orilogi = this._LogicTextMask.substring(this._LogicFirstPos, this._LogicLastPos + 1),
                        arr_mask = this._SplitDateTime(oritext),
                        posmask = curpos - this._LogicFirstPos;

                    if(posmask > arr_mask[0].length) {
                        // at position time
                        masktext = arr_mask[0] + " " + masktext;
                        logiTxt = orilogi.substring(0, qtdDt) + logiTxt;
                    } else {
                        // at position date
                        masktext = masktext + " " + arr_mask[1];
                        logiTxt = logiTxt + orilogi.substring(arr_mask[0].length);
                    }
                }

                var currValue = wrapper.get_Value();
                masktext = currValue.substring(0, this._LogicFirstPos) + masktext + currValue.substring(this._LogicLastPos + 1);
                this._LogicTextMask = this._LogicTextMask.substring(0, this._LogicFirstPos) + logiTxt + this._LogicTextMask.substring(this._LogicLastPos + 1);
                wrapper.set_Value(masktext);
            }
        }

        return exec;
    },

    _SplitDateTime: function(inputText) {
        var arr = [];
        if(inputText.charAt(this._LogicDateTimeSepPos) == " ") {
            arr[0] = inputText.substring(this._LogicFirstPos, this._LogicDateTimeSepPos);
            arr[1] = inputText.substring(this._LogicDateTimeSepPos + 1);
        } else {
            arr[0] = inputText;
        }

        return arr;
    },

    // Paste clip board
    _ShowModalClipBoardInput: function() {
        var clip = prompt(this._clipboardText, "");

        return clip;
    },

    _PasteFromClipBoard: function() {
        var value = null,
            curpos,
            iniSel = -1,
            fimSel = -1;

        if ($common.isInternetExplorer()) {
            value = window.clipboardData.getData("Text");
        } else {
            // save current values because lost focus 
            var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()),
                oldvalue = wrapper.get_Value(),
                BoundSel = this._GetBoundSelection(),
                curpos = this._getCurrentPosition(),
                OldAuto = this._autoComplete,
                OldInv = this._clearTextOnInvalid,
                OldCls = this._clearMaskOnLostfocus,
                OldDir = this._DirectSelText;

            this._autoComplete = false;
            this._clearTextOnInvalid = false;
            this._clearMaskOnLostfocus = false;
            value = this._ShowModalClipBoardInput();
            this._autoComplete = OldAuto;
            this._clearTextOnInvalid = OldInv;
            this._clearMaskOnLostfocus = OldCls;
            wrapper.set_Value(oldvalue);

            if(BoundSel)
                this.setSelectionRange(BoundSel.left, BoundSel.right);
            else
                this.setSelectionRange(curpos, curpos);
        }

        if(value == null || value == "")
            return;

        if(value.length > this._maskvalid.length)
            value = value.substring(0, this._maskvalid.length);

        curpos = this._deleteTextSelection();
        if(curpos == -1) {
            curpos = this._getCurrentPosition();
            if(BoundSel)
                curpos = BoundSel.left;
        }

        this.setSelectionRange(curpos, curpos);
        var ReturnPosDec = false;

        if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft && this._LogicLastInt != -1)
            ReturnPosDec = true;

        var i = 0;
        for(i = 0; i < value.length; i++) {
            var c = value.substring(i, i + 1),
                logiccur = curpos;

            if(ReturnPosDec)
                logiccur = this._getLastEmptyPosition();

            if((this._maskType == Sys.Extended.UI.MaskedEditType.Time || this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) && this.getCultureFirstLettersAMPM().toUpperCase().indexOf(c.toUpperCase()) != -1) {
                if(this._acceptAmPm) {
                    this.insertAMPM(c);
                    this.setSelectionRange(curpos, curpos);
                }
            } else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._acceptNegative != Sys.Extended.UI.MaskedEditShowSymbol.None && "+-".indexOf(c) != -1) {
                this.insertSignal(c);
                this.setSelectionRange(curpos, curpos);
            } else {
                var OriPos = curpos;
                curpos = this._getNextPosition(curpos);
                var logiccur = curpos;

                if(this._LogicLastInt != -1 && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft) {
                    if(OriPos == this._LogicLastInt)
                        logiccur = this._getLastEmptyPosition();
                } else {
                    if(curpos >= this._LogicLastPos + 1 && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft)
                        logiccur = this._getLastEmptyPosition();
                }

                if(this._processKey(logiccur, c)) {
                    if(this._messageValidatorTip)
                        this.showTooltipMessage(false);

                    if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.LeftToRight) {
                        this._insertContent(c, logiccur);
                        curpos = this._getNextPosition(logiccur + 1);
                    } else if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft) {
                        if(this._LogicLastInt == -1) {
                            if(curpos < this._LogicLastPos + 1) {
                                this._insertContent(c, logiccur);
                                curpos = this._getNextPosition(logiccur + 1);
                            } else {
                                this._insertContentRight(c);
                                curpos = this._LogicLastPos + 1;
                            }
                        } else {
                            if(OriPos != this._LogicLastInt) {
                                this._insertContent(c, logiccur);
                                curpos = this._getNextPosition(logiccur + 1);
                            } else {
                                this._insertContentRight(c);
                                curpos = this._LogicLastInt;
                            }
                        }
                    }
                    this.setSelectionRange(curpos, curpos);
                }
            }
        }

        if(ReturnPosDec)
            this.setSelectionRange(this._LogicLastInt, this._LogicLastInt);
    },

    // Move cursor to decimal position (LeftToRight and RightToLeft Mode)
    _MoveDecimalPos: function() {
        var e = this.get_element(),
            wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(e),
            curpos = this._LogicFirstPos,
            max = this._LogicLastPos,
            posDc = -1;

        while(curpos < max) {
            if(wrapper.get_Value().substring(curpos, curpos + 1) == this.get_cultureDecimalPlaceholder()) {
                posDc = curpos;
                break;
            }
            curpos++;
        }

        if(posDc == -1)
            return;

        this.setSelectionRange(posDc, posDc);
    },

    // Move cursor to next Thousand position (LeftToRight Mode)
    _MoveThousandLTR: function() {
        var e = this.get_element(),
            wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(e),
            curpos = this._getCurrentPosition(),
            max = this._LogicLastPos,
            cur = curpos + 1,
            posTh = -1;

        while(cur < max) {
            if(wrapper.get_Value().substring(cur, cur + 1) == this.get_cultureThousandsPlaceholder()) {
                posTh = cur;
                break;
            }
            cur++;
        }

        if(posTh == -1) {
            var cur = 0;
            max = curpos;

            while(cur < max) {
                if(wrapper.get_Value().substring(cur, cur + 1) == this.get_cultureThousandsPlaceholder()) {
                    posTh = cur;
                    break;
                }
                cur++;
            }

            if(posTh == -1)
                return;
        }
        this.setSelectionRange(posTh, posTh);
    },

    // Move cursor to next Thousand position (RightToLeft Mode)
    _MoveThousandRTL: function() {
        var e = this.get_element(),
            wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(e),
            curpos = this._getCurrentPosition(),
            min = this._LogicFirstPos,
            cur = curpos - 1,
            posTh = -1;

        while(cur > min) {
            if(wrapper.get_Value().substring(cur, cur + 1) == this.get_cultureThousandsPlaceholder()) {
                posTh = cur;
                break;
            }
            cur--;
        }

        if(posTh == -1) {
            cur = this._LogicLastPos;
            min = curpos;

            while(cur > min) {
                if(wrapper.get_Value().substring(cur, cur + 1) == this.get_cultureThousandsPlaceholder()) {
                    posTh = cur;
                    break;
                }
                cur--;
            }

            if(posTh == -1)
                return;
        }
        this.setSelectionRange(posTh, posTh);
    },

    // adjust element Number to Decimal position (LeftToRight Mode)
    _AdjustElementDecimalLTR: function() {
        var e = this.get_element(),
            wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(e),
            curpos = this._getCurrentPosition();

        if(wrapper.get_Value().substring(curpos).indexOf(this.get_cultureDecimalPlaceholder()) == -1)
            //after decimal position
            return;

        var value = wrapper.get_Value().substring(this._LogicFirstPos, this._LogicLastPos + 1),
            newcur = value.indexOf(this.get_cultureDecimalPlaceholder());

        if(newcur == -1)
            //decimal not exist
            return;

        var arr_num,
            ClearText = this._getClearMask(wrapper.get_Value());

        if(ClearText != "") {
            ClearText = ClearText.replace(new RegExp("(\\" + this.get_cultureThousandsPlaceholder() + ")", "g"), "") + '';
            arr_num = ClearText.split(this.get_cultureDecimalPlaceholder());
        } else {
            arr_num = this.get_cultureDecimalPlaceholder().split(this.get_cultureDecimalPlaceholder());
        }

        if(arr_num[0] == "")
            arr_num[0] = "0";

        // fill decimal
        var QtdDec = value.length - newcur - 1;
        while(arr_num[1].length < QtdDec)
            arr_num[1] += "0";

        var OldDir = this._inputDirection;

        this._inputDirection = Sys.Extended.UI.MaskedEditInputDirections.RightToLeft;
        this.loadValue(arr_num[0] + this.get_cultureDecimalPlaceholder() + arr_num[1], this._LogicLastPos);
        this._inputDirection = OldDir;
        newcur += this._LogicFirstPos + 1;
        this.setSelectionRange(newcur, newcur);
    },

    // adjust element Number to Decimal position (RightToleft Mode)
    _AdjustElementDecimalRTL: function() {
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()),
            value = wrapper.get_Value().substring(this._LogicFirstPos, this._LogicLastPos + 1),
            posdec = value.indexOf(this.get_cultureDecimalPlaceholder());

        if(posdec == -1)
            //decimal not exist
            return;

        var curpos = this._getCurrentPosition();
        if(posdec + this._LogicFirstPos >= curpos) {
            //before decimal position , EXECUTE LTR MODE
            this._AdjustElementDecimalLTR();
            return;
        }

        var arr_num,
            ClearText = this._getClearMask(wrapper.get_Value());

        if(ClearText != "") {
            ClearText = ClearText.replace(new RegExp("(\\" + this.get_cultureThousandsPlaceholder() + ")", "g"), "") + '';
            arr_num = ClearText.split(this.get_cultureDecimalPlaceholder());
        } else {
            arr_num = this.get_cultureDecimalPlaceholder().split(this.get_cultureDecimalPlaceholder());
        }

        if(arr_num[0] == "")
            arr_num[0] = "0";

        // fill decimal
        var QtdDec = value.length - posdec - 1;
        while(arr_num[1].length < QtdDec)
            arr_num[1] += "0";

        var OldDir = this._inputDirection;
        this._inputDirection = Sys.Extended.UI.MaskedEditInputDirections.RightToLeft;
        this.loadValue(arr_num[0] + this.get_cultureDecimalPlaceholder() + arr_num[1], this._LogicLastPos);
        this._inputDirection = OldDir;
        posdec += this._LogicFirstPos + 1;
        this.setSelectionRange(posdec, posdec);
    },

    // adjust Time Format 
    _AdjustTime: function(value, ValueDefault) {
        var emp = true;
        var i;

        for(i = 0 ; i < parseInt(value.length, 10) ; i++)
            if(value.substring(i, i + 1) != this._promptCharacter)
                emp = false;

        if(emp)
            return ValueDefault;

        var max = value.length;
        value = value.replace(new RegExp("(\\" + this._promptCharacter + ")", "g"), "") + '';

        while(value.length < max)
            value = "0" + value;

        return value;
    },

    // adjust Element Time Format 
    _AdjustElementTime: function() {
        var e = this.get_element(),
            wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(e),
            type = "",
            curpos = this._getCurrentPosition() - this._LogicFirstPos,
            m_mask = this._maskvalid,
            newcur = curpos + this._LogicFirstPos,
            QtdDt = 0;

        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
            QtdDt = m_mask.split(" ")[0].length + 1;

            if(curpos < QtdDt) {
                newcur = QtdDt + this._LogicFirstPos;
                this.setSelectionRange(newcur, newcur);

                return;
            }

            // without am/pm, The AP/PM will get from this._LogicSymbol
            m_mask = m_mask.split(" ")[1];
            curpos -= QtdDt;
        }

        m_mask = m_mask.split(":");
        if(curpos <= 1) {
            type = "H";
            newcur = this._LogicFirstPos + QtdDt + 3;
        } else if(curpos == 2 && m_mask.length == 2) {
            type = "M";
            newcur = this._LogicFirstPos + QtdDt + 3;
        } else if (curpos >= 3 && curpos <= 5 && m_mask.length == 2) {
            type = "M";
            newcur = this._LogicFirstPos + QtdDt;
        } else if(curpos >= 2 && curpos <= 4 && m_mask.length == 3) {
            type = "M";
            newcur = this._LogicFirstPos + QtdDt + 6;
        } else if(m_mask.length == 3) {
            type = "S";
            newcur = this._LogicFirstPos + QtdDt;
        }

        if(type == "")
            return;

        var valueTM = wrapper.get_Value().substring(this._LogicFirstPos, this._LogicLastPos + 1);
        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime)
            valueTM = (this._SplitDateTime(valueTM))[1];

        var m_arrTime = valueTM.split(this.get_cultureTimePlaceholder()),
            elem = this._GetTimeElementText(type),
            value;

        if(type == "H") {
            value = elem + this.get_cultureTimePlaceholder() + m_arrTime[1];

            if(m_arrTime.length == 3)
                value += this.get_cultureTimePlaceholder() + m_arrTime[2];
        } else if(type == "M") {
            value = m_arrTime[0] + this.get_cultureTimePlaceholder() + elem;

            if(m_arrTime.length == 3)
                value += this.get_cultureTimePlaceholder() + m_arrTime[2];
        } else if(type == "S") {
            value = m_arrTime[0] + this.get_cultureTimePlaceholder() + m_arrTime[1];
            value += this.get_cultureTimePlaceholder() + elem;
        }

        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
            value = wrapper.get_Value().substring(this._LogicFirstPos, QtdDt) + value;
        }

        this.loadMaskValue(value, this._LogicFirstPos, this._LogicSymbol);
        this.setSelectionRange(newcur, newcur);
    },

    // Get Element Time
    _GetTimeElementText: function(Type) {
        var aux,
            logiTxt = this._LogicTextMask.substring(this._LogicFirstPos, this._LogicLastPos + 1);

        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime)
            logiTxt = logiTxt.substring(this._maskvalid.split(" ")[0].length + 1);

        var m_arrTime = logiTxt.split(this.get_cultureTimePlaceholder());
        m_arrTime[0] = m_arrTime[0].replace(new RegExp("(\\" + this._LogicPrompt + ")", "g"), this._promptCharacter) + '';
        aux = m_arrTime[0].replace(new RegExp("(\\" + this._promptCharacter + ")", "g"), "") + '';

        if(aux != "" && aux.length < 2) {
            aux = "0" + aux;
            m_arrTime[0] = aux;
        }

        m_arrTime[1] = m_arrTime[1].replace(new RegExp("(\\" + this._LogicPrompt + ")", "g"), this._promptCharacter) + '';
        aux = m_arrTime[1].replace(new RegExp("(\\" + this._promptCharacter + ")", "g"), "") + '';

        if(aux != "" && aux.length < 2) {
            aux = "0" + aux;
            m_arrTime[1] = aux;
        }

        if(m_arrTime.length == 3) {
            m_arrTime[2] = m_arrTime[2].replace(new RegExp("(\\" + this._LogicPrompt + ")", "g"), this._promptCharacter) + '';
            aux = m_arrTime[2].replace(new RegExp("(\\" + this._promptCharacter + ")", "g"), "") + '';

            if(aux != "" && aux.length < 2) {
                aux = "0" + aux;
                m_arrTime[2] = aux;
            }
        }

        if(Type == "H")
            return m_arrTime[0];
        else if(Type == "M")
            return m_arrTime[1];

        // Type == "S"
        return m_arrTime[2];
    },

    // adjust Date Format 
    _AdjustElementDateTime: function(c) {
        if(c == this.get_cultureDatePlaceholder())
            this._AdjustElementDate();

        if(c == this.get_cultureTimePlaceholder())
            this._AdjustElementTime();
    },

    _AdjustElementDate: function() {
        var e = this.get_element(),
            wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(e),
            input = wrapper.get_Value().substring(this._LogicFirstPos, this._LogicLastPos + 1);

        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime)
            input = this._SplitDateTime(input)[0];

        var m_arrDate = input.split(this.get_cultureDatePlaceholder()),
            type = "",
            curpos = this._getCurrentPosition() - this._LogicFirstPos,
            newcur = curpos + this._LogicFirstPos,
            QtdY = (this._maskvalid.indexOf("9999") != -1) ? 2 : 0;

        if(this.get_cultureDateFormat() == "DMY") {
            if(curpos <= 1) {
                type = "D";
                newcur = 3 + this._LogicFirstPos;
            } else if(curpos >= 2 && curpos <= 4) {
                type = "M";
                newcur = 6 + this._LogicFirstPos;
            } else {
                if(curpos > 8 + QtdY && this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
                    this.setSelectionRange(this._LogicFirstPos, this._LogicFirstPos);
                    return;
                }
                type = "Y";
                newcur = this._LogicFirstPos;
            }
        } else if(this.get_cultureDateFormat() == "MDY") {
            if(curpos <= 1) {
                type = "M";
                newcur = 3 + this._LogicFirstPos;
            } else if(curpos >= 2 && curpos <= 4) {
                type = "D";
                newcur = 6 + this._LogicFirstPos;
            } else {
                if(curpos > 8 + QtdY && this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
                    this.setSelectionRange(this._LogicFirstPos, this._LogicFirstPos);
                    return;
                }
                type = "Y";
                newcur = this._LogicFirstPos;
            }
        } else if(this.get_cultureDateFormat() == "DYM") {
            if(curpos <= 1) {
                type = "D";
                newcur = 3 + this._LogicFirstPos;
            } else if(curpos >= 2 && curpos <= 4 + QtdY) {
                type = "Y";
                newcur = 6 + QtdY + this._LogicFirstPos;
            } else {
                type = "M";
                newcur = this._LogicFirstPos;
            }
        } else if(this.get_cultureDateFormat() == "MYD") {
            if(curpos <= 1) {
                type = "M";
                newcur = 3 + this._LogicFirstPos;
            } else if(curpos >= 2 && curpos <= 4 + QtdY) {
                type = "Y";
                newcur = 6 + QtdY + this._LogicFirstPos;
            } else {
                type = "D";
                newcur = this._LogicFirstPos;
            }
        } else if(this.get_cultureDateFormat() == "YMD") {
            if(curpos <= 1 + QtdY) {
                type = "Y";
                newcur = 3 + QtdY + this._LogicFirstPos;
            } else if(curpos >= 2 + QtdY && curpos <= 4 + QtdY) {
                type = "M";
                newcur = 6 + QtdY + this._LogicFirstPos;
            } else {
                type = "D";
                newcur = this._LogicFirstPos;
            }
        } else if(this.get_cultureDateFormat() == "YDM") {
            if(curpos <= 1 + QtdY) {
                type = "Y";
                newcur = 3 + QtdY + this._LogicFirstPos;
            } else if(curpos >= 2 + QtdY && curpos <= 4 + QtdY) {
                type = "D";
                newcur = 6 + QtdY + this._LogicFirstPos;
            } else {
                type = "M";
                newcur = this._LogicFirstPos;
            }
        }

        var elem = this._GetDateElementText(type);
        m_arrDate[this.get_cultureDateFormat().indexOf(type)] = elem;
        var value = m_arrDate[0] + this.get_cultureDatePlaceholder() + m_arrDate[1] + this._cultureDatePlaceholder + m_arrDate[2];

        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
            var aux = wrapper.get_Value().substring(this._LogicFirstPos, this._LogicLastPos + 1),
                arr = this._SplitDateTime(aux),
                time_arr = arr[1].split(" ");

            if(time_arr.length == 2)
                value += " " + time_arr[0] + " " + time_arr[1];
            else
                value += " " + arr[1];
        }

        this.loadMaskValue(value, this._LogicFirstPos, this._LogicSymbol);
        this.setSelectionRange(newcur, newcur);
    },

    // Get Element Date 
    _GetDateElementText: function(Type) {
        var aux,
            m_arrDate;

        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
            var auxdate = this._SplitDateTime(this._LogicTextMask.substring(this._LogicFirstPos, this._LogicLastPos + 1))[0];
            m_arrDate = auxdate.split(this.get_cultureDatePlaceholder());
        } else {
            m_arrDate = this._LogicTextMask.substring(this._LogicFirstPos, this._LogicLastPos + 1).split(this.get_cultureDatePlaceholder());
        }

        m_arrDate[this.get_cultureDateFormat().indexOf("D")] = m_arrDate[this.get_cultureDateFormat().indexOf("D")].replace(new RegExp("(\\" + this._LogicPrompt + ")", "g"), this._promptCharacter) + '';
        aux = m_arrDate[this.get_cultureDateFormat().indexOf("D")].replace(new RegExp("(\\" + this._promptCharacter + ")", "g"), "") + '';

        if(aux != "" && aux.length < 2) {
            aux = "0" + aux;
            m_arrDate[this.get_cultureDateFormat().indexOf("D")] = aux
        }

        m_arrDate[this.get_cultureDateFormat().indexOf("M")] = m_arrDate[this.get_cultureDateFormat().indexOf("M")].replace(new RegExp("(\\" + this._LogicPrompt + ")", "g"), this._promptCharacter) + '';
        aux = m_arrDate[this.get_cultureDateFormat().indexOf("M")].replace(new RegExp("(\\" + this._promptCharacter + ")", "g"), "") + '';

        if(aux != "" && aux.length < 2) {
            aux = "0" + aux;
            m_arrDate[this.get_cultureDateFormat().indexOf("M")] = aux;
        }

        var Y4 = (this._maskvalid.indexOf("9999") != -1) ? true : false;
        m_arrDate[this.get_cultureDateFormat().indexOf("Y")] = m_arrDate[this.get_cultureDateFormat().indexOf("Y")].replace(new RegExp("(\\" + this._LogicPrompt + ")", "g"), this._promptCharacter) + '';
        aux = m_arrDate[this.get_cultureDateFormat().indexOf("Y")].replace(new RegExp("(\\" + this._promptCharacter + ")", "g"), "") + '';

        if(Y4) {
            if(aux != "" && aux.length < 4) {
                aux = this._century.toString().substr(0, aux.length) + aux;
                m_arrDate[this.get_cultureDateFormat().indexOf("Y")] = aux;
            }
        } else {
            if(aux != "" && aux.length < 2) {
                aux = "0" + aux;
                m_arrDate[this.get_cultureDateFormat().indexOf("Y")] = aux;
            }
        }

        return m_arrDate[this.get_cultureDateFormat().indexOf(Type)];
    },

    _GetBoundSelection: function() {
        var ret = null,
            input = this.get_element();

        if(input.setSelectionRange) {
            if(input.selectionStart != input.selectionEnd)
                ret = { left: parseInt(input.selectionStart, 10), right: parseInt(input.selectionEnd, 10) };
        } else if(document.selection) {
            var sel = document.selection.createRange();

            if(sel.text != "") {
                var tam = parseInt(sel.text.length, 10);
                sel.text = String.fromCharCode(3) + sel.text;

                var dummy = input.createTextRange();
                dummy.findText(String.fromCharCode(3));
                dummy.select();

                var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(input);
                var pos = parseInt(wrapper.get_Value().indexOf(String.fromCharCode(3)), 10);

                document.selection.clear();
                ret = { left: pos, right: pos + tam };
            }
        }

        return ret;
    },

    _deleteTextSelection: function() {
        var input = this.get_element(),
            wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(input),
            masktext = wrapper.get_Value(),
            lenaux = -1,
            begin = -1,
            isDel = false;

        if(input.setSelectionRange) {
            if(input.selectionStart != input.selectionEnd) {
                var ini = parseInt(input.selectionStart, 10);
                var fim = parseInt(input.selectionEnd, 10);

                isDel = true;
                lenaux = fim - ini;
                begin = input.selectionStart;
                input.selectionEnd = input.selectionStart;
            }
        } else if(document.selection) {
            var sel = document.selection.createRange();

            if(sel.text != "") {
                isDel = true;
                var aux = sel.text + String.fromCharCode(3);

                sel.text = aux;
                var dummy = input.createTextRange();

                dummy.findText(aux);
                dummy.select();
                begin = wrapper.get_Value().indexOf(aux);
                document.selection.clear();
                lenaux = parseInt(aux.length, 10) - 1;
            }
        }

        if(isDel) {
            for(var i = 0 ; i < lenaux ; i++)
                if(this._isValidMaskedEditPosition(begin + i)) {
                    masktext = masktext.substring(0, begin + i) + this._promptCharacter + masktext.substring(begin + i + 1);
                    this._LogicTextMask = this._LogicTextMask.substring(0, begin + i) + this._LogicPrompt + this._LogicTextMask.substring(begin + i + 1);
                }

            wrapper.set_Value(masktext);
            if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft)
                begin += lenaux;
        }

        this._DirectSelText = "";
        return begin;
    },

    _isNormalChar: function(evt, scanCode) {
        var ret = true;

        if(Sys.Browser.agent == Sys.Browser.Opera && evt.type == "keydown")
            this._SaveKeyDown = scanCode;

        if(scanCode < 32) { // < space
            ret = false;
        } else if(Sys.Browser.agent != Sys.Browser.InternetExplorer || evt.type == "keydown") {
            switch(scanCode) {
                case 33: //pg up or ! 
                    if(typeof (evt.rawEvent.which) != "undefined" && evt.rawEvent.which != null)
                        if(evt.rawEvent.which == 0)
                            //pg up
                            ret = false;
                    break;
                case 34: //pg down  or " 
                    if(typeof (evt.rawEvent.which) != "undefined" && evt.rawEvent.which != null)
                        if(evt.rawEvent.which == 0)
                            //pg down
                            ret = false;
                    break;
                case 35: //end   
                    if(Sys.Browser.agent == Sys.Browser.Opera && evt.type == "keypress") {
                        //at opera keydown = 51 keypress = 35 = #
                        if(this._SaveKeyDown == 35)
                            //END
                            ret = false;
                    } else {
                        ret = false;
                    }
                    break;
                case 36: //home
                    if(Sys.Browser.agent == Sys.Browser.Opera && evt.type == "keypress") {
                        //at opera keydown = 52 keypress = 36 = $
                        if(this._SaveKeyDown == 36)
                            //home
                            ret = false;
                    } else {
                        ret = false;
                    }
                    break;
                case 37: //left  or % 
                    if(typeof (evt.rawEvent.which) != "undefined" && evt.rawEvent.which != null)
                        if(evt.rawEvent.which == 0)
                            //left
                            ret = false;
                    break;
                case 38: //up or &
                    if(typeof (evt.rawEvent.which) != "undefined" && evt.rawEvent.which != null)
                        if(evt.rawEvent.which == 0)
                            //up
                            ret = false;
                    break;
                case 39: //right or  '
                    if(typeof (evt.rawEvent.which) != "undefined" && evt.rawEvent.which != null)
                        if(evt.rawEvent.which == 0)
                            //right
                            ret = false;
                    break;
                case 40: //down or (
                    if(typeof (evt.rawEvent.which) != "undefined" && evt.rawEvent.which != null)
                        if(evt.rawEvent.which == 0)
                            //down
                            ret = false;
                    break;
                case 45: //ins - at opera Inconsistency with -
                    if(typeof (evt.rawEvent.which) != "undefined" && evt.rawEvent.which != null && Sys.Browser.agent != Sys.Browser.Opera) {
                        if(evt.rawEvent.which == 0)
                            ret = false;
                    } else if(Sys.Browser.agent == Sys.Browser.Opera) { // re-valid Ins for opera
                        //assume ins = char "-"
                        //at opera Shift-ins in MaskedEdit not execute
                        ret = true;
                    } else {
                        ret = false;
                    }
                    break;
                case 86: // V   
                case 118: // v
                    //ctrl press
                    if(!evt.rawEvent.shiftKey && evt.rawEvent.ctrlKey && !evt.rawEvent.altKey)
                        ret = false;
                    break;
                case 46: //del FF ~ Mozilla - at opera Inconsistency with .
                    if(typeof (evt.rawEvent.which) != "undefined" && evt.rawEvent.which != null && Sys.Browser.agent != Sys.Browser.Opera) {
                        if(evt.rawEvent.which == 0)
                            ret = false;
                    } else if(Sys.Browser.agent == Sys.Browser.Opera && evt.type == "keypress") {
                        //at opera keydown = 78 keypress = 46 = . at numpad
                        if(this._SaveKeyDown == 127)
                            ret = false;
                    } else {
                        ret = false;
                    }
                    break;
                case 127: //del IE - at opera Inconsistency with .
                    ret = false;
                    break;
            }
        }

        return ret;
    },

    _KeyCode: function(evt) {
        // Get Keycode for any browser
        // and convert keycode Safari to IE Code
        var scanCode = 0;
        if(evt.keyIdentifier) {
            if(evt.charCode == 63272) //63272: 'KEY_DELETE', 46
                scanCode = 46;
            else if(evt.charCode == 63302) //63302: 'KEY_INSERT', 45
                scanCode = 45;
            else if(evt.charCode == 63233) //63233: 'KEY_ARROW_DOWN',40
                scanCode = 40;
            else if(evt.charCode == 63235) //63235: 'KEY_ARROW_RIGHT', 39
                scanCode = 39;
            else if(evt.charCode == 63232) //63232: 'KEY_ARROW_UP', 38
                scanCode = 38;
            else if(evt.charCode == 63234) //63234: 'KEY_ARROW_LEFT', 37
                scanCode = 37;
            else if(evt.charCode == 63273) //63273: 'KEY_HOME', 36
                scanCode = 36;
            else if(evt.charCode == 63275) //63275: 'KEY_END', 35
                scanCode = 35;
            else if(evt.charCode == 63277) //63277: 'KEY_PAGE_DOWN', 34
                scanCode = 34;
            else if(evt.charCode == 63276) //63276: 'KEY_PAGE_UP', 33
                scanCode = 33;
            else if(evt.charCode == 3) //3: 'KEY_ENTER', 13
                scanCode = 13;
        }

        if(scanCode == 0)
            if(evt.charCode)
                scanCode = evt.charCode;

        if(scanCode == 0)
            scanCode = evt.keyCode;

        return scanCode;
    },

    // Init value startup
    _InitValue: function(value, loadFirst) {
        this._LogicSymbol = "";

        var e = this.get_element(),
            wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(e);

        wrapper.set_Value(this._EmptyMask);
        if(value == this._EmptyMask || value == "")
            this.loadValue("", this._LogicFirstPos);
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Date && value != "")
            value = this.ConvFmtDate(value, loadFirst);
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Time && value != "")
            value = this.ConvFmtTime(value, loadFirst);
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime && value != "")
            value = this.ConvFmtDateTime(value, loadFirst);
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && value != "")
            value = this.ConvFmtNumber(value, loadFirst);

        if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.LeftToRight && value != "") {
            if(this._maskType == Sys.Extended.UI.MaskedEditType.Number) {
                this._inputDirection = Sys.Extended.UI.MaskedEditInputDirections.RightToLeft;
                this.loadValue(value, this._LogicLastPos);
                this._inputDirection = Sys.Extended.UI.MaskedEditInputDirections.LeftToRight;
            } else {
                if(!this.get_clearMaskOnLostFocus() && this._LogicFirstPos > 0) {
                    // https://github.com/DevExpress/AjaxControlToolkit/issues/493
                    value = value.substr(this._LogicFirstPos);
                }
                this.loadValue(value, this._LogicFirstPos);
            }
        } else if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft && value != "") {
            this.loadValue(value, this._LogicLastPos);
        }

        if(this._maskType == Sys.Extended.UI.MaskedEditType.Number)
            if(this._InLostfocus && this._LogicSymbol == "-" && this._onBlurCssNegative != "")
                this.addCssClassMaskedEdit(this._onBlurCssNegative);
    },

    // Load initial value with mask
    loadMaskValue: function(value, logicPosition, Symb) {
        this._createMask();
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
        wrapper.set_Value(this._EmptyMask);

        if((this._maskType == Sys.Extended.UI.MaskedEditType.Time || this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) && this.getCultureFirstLettersAMPM().toUpperCase().indexOf(Symb.toUpperCase().substring(0, 1)) != -1) {
            if(this._acceptAmPm)
                this.insertAMPM(Symb.toUpperCase().substring(0, 1));
        } else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._acceptNegative != Sys.Extended.UI.MaskedEditShowSymbol.None && "+-".indexOf(Symb) != -1) {
            this.insertSignal(Symb);
        }

        var i = 0;
        for(i = 0 ; i < parseInt(value.length, 10) ; i++) {
            var c = value.substring(i + logicPosition, i + logicPosition + 1);

            if(this._processKey(logicPosition + i, c))
                this._insertContent(c, logicPosition + i);
        }
    },

    containsAMPMLetters: function(value, index)
    {
        var currentAMPMtext = value.substring(index);
    },

    getMaskCharPositions: function()
    {
        var maskCharPositions = [];
        var mask = this.get_clearMaskOnLostFocus() ? this.getVisibleMask() : this._LogicMaskConv;

        for (var i = 0; i < mask.length; i++) {
            var char = mask[i];
            if (this.isMaskChar(char))
                maskCharPositions.push(i);
        }

        return maskCharPositions;
    },

    getVisibleMask: function()
    {
        var clearedMask = this.replaceAll(this._LogicMaskConv, this._LogicPrompt, "");
        clearedMask = this.replaceAll(clearedMask, this._LogicEscape, "");
        return clearedMask;
    },

    isMaskChar: function(char)
    {
        var maskChars = "9L$CAN?";
        return maskChars.indexOf(char) == -1;
    },

    // Load initial value in mask
    loadValue: function(value, logicPosition) {
        var i;
        this._createMask();
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
        wrapper.set_Value(this._EmptyMask);

        var maskCharPositions = this.getMaskCharPositions();

        if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.LeftToRight) {
            for(i = 0 ; i < parseInt(value.length, 10) ; i++) {
                var c = value.substring(i, i + 1);

                if ((this._maskType == Sys.Extended.UI.MaskedEditType.Time || this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) && this.getCultureFirstLettersAMPM().toUpperCase().indexOf(c.toUpperCase()) != -1) {
                    if (this._acceptAmPm) {
                        this.insertAMPM(c);
                        break;
                    }
                } else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._acceptNegative != Sys.Extended.UI.MaskedEditShowSymbol.None && "+-".indexOf(c) != -1) {
                    this.insertSignal(c);
                }

                if(this._processKey(logicPosition, c)) {
                    if(this._maskType != Sys.Extended.UI.MaskedEditType.Number)
                        this._insertContent(c, logicPosition);
                    logicPosition = this._getNextPosition(logicPosition + 1);
                }
            }
        } else if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft) {
            if(logicPosition == this._LogicLastInt) {
                logicPosition = this._getPreviousPosition(logicPosition);
                var arr_num = value.split(this.get_cultureDecimalPlaceholder())

                // int element
                for(i = parseInt(arr_num[0].length, 10) ; i > 0  ; i--) {
                    var c = arr_num[0].substring(i - 1, i);

                    if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._acceptNegative != Sys.Extended.UI.MaskedEditShowSymbol.None && "+-".indexOf(c) != -1)
                        this.insertSignal(c);

                    if(this._processKey(logicPosition, c)) {
                        this._insertContent(c, logicPosition);
                        logicPosition = this._getPreviousPosition(logicPosition - 1);
                    }
                }

                // decimal element
                if(arr_num.length > 1) {
                    logicPosition = this._getNextPosition(this._LogicLastInt);

                    for(i = 0 ; i < parseInt(arr_num[1].length, 10) ; i++) {
                        var c = arr_num[1].substring(i, i + 1);

                        if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._acceptNegative != Sys.Extended.UI.MaskedEditShowSymbol.None && "+-".indexOf(c) != -1)
                            this.insertSignal(c);

                        if(this._processKey(logicPosition, c)) {
                            this._insertContent(c, logicPosition);
                            logicPosition = this._getNextPosition(logicPosition + 1);
                        }
                    }
                }
            } else {

                var valueLength = value.length;
                var maskLength = this.get_clearMaskOnLostFocus() ? this.getVisibleMask().length : this._EmptyMask.length;
                maskCharPositions.splice(0, maskLength - valueLength);

                for (i = parseInt(value.length, 10) ; i > 0  ; i--) {

                    if (!this.get_clearMaskOnLostFocus()
                        && this._maskType === Sys.Extended.UI.MaskedEditType.Number
                        && maskCharPositions.indexOf(i - 1) != -1)
                        continue;

                    var c = value.substring(i - 1, i);

                    if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._acceptNegative != Sys.Extended.UI.MaskedEditShowSymbol.None && "+-".indexOf(c) != -1) {
                        if(this._LogicSymbol == '-')
                            this._LogicSymbol = ' ';

                        this.insertSignal(c);
                    }

                    if (this._processKey(logicPosition, c)) {
                        this._insertContent(c, logicPosition);
                        logicPosition = this._getPreviousPosition(logicPosition - 1);
                    }

                    //oldLogicPosition = logicPosition;

                    //if(this._maskType === Sys.Extended.UI.MaskedEditType.Number && logicPosition === oldLogicPosition)
                    //    break;
                }
            }
        }
    },

    // AutoFormat (date and Time and number)
    AutoFormatNumber: function() {
        var i,
            wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());

        ValueText = wrapper.get_Value();

        var AutoComp = this._autoCompleteValue,
            okdgt = false;

        for(i = this._LogicFirstPos ; i <= this._LogicLastPos ; i++) {
            if(this._LogicTextMask.substring(i, i + 1) == this._LogicPrompt) {
                var CharComp = "0";

                if(AutoComp != "")
                    CharComp = AutoComp.substring(i - this._LogicFirstPos, i + 1 - this._LogicFirstPos);

                if(okdgt) {
                    this._LogicTextMask = this._LogicTextMask.substring(0, i) + CharComp + this._LogicTextMask.substring(i + 1);
                    ValueText = ValueText.substring(0, i) + CharComp + ValueText.substring(i + 1);
                }
            } else if(this._LogicMask.substring(i, i + 1) == this._LogicPrompt && "123456789".indexOf(this._LogicTextMask.substring(i, i + 1)) != -1) {
                okdgt = true;
            }
        }
        wrapper.set_Value(ValueText);

        return ValueText;
    },

    getCurrentHour: function (date)
    {
        return date.getHours().toString();
    },

    AutoFormatTime: function() {
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
        ValueText = wrapper.get_Value();
        var autocomp = this._autoCompleteValue;

        if(autocomp.indexOf(this.get_cultureTimePlaceholder()) == -1)
            autocomp = "";

        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
            var arr = this._SplitDateTime(ValueText),
                time_arr = arr[1].split(" ");

            if(time_arr.length == 2)
                ValueText = time_arr[0] + " " + time_arr[1];
            else
                ValueText = time_arr[0]; //arr[0];

            if(autocomp != "") {
                // if not have date...
                if(autocomp.indexOf(this.get_cultureDatePlaceholder()) == -1)
                    autocomp = " " + autocomp;

                var autocomp_arr = this._SplitDateTime(autocomp),
                    autocomptime_arr = autocomp_arr[1].split(" ");

                if(autocomptime_arr.length == 2)
                    autocomp = autocomptime_arr[0] + " " + autocomptime_arr[1];
                else
                    autocomp = autocomp_arr[0];
            }
        }

        var CurDate = new Date(),
            Hcur = this.getCurrentHour(CurDate);

        if(Hcur.length < 2)
            Hcur = "0" + Hcur;

        if(autocomp != "")
            Hcur = autocomp.substring(0, 2);

        var SetAM = false,
            SetPM = false,
            LcAM = "",
            LcPM = "",
            Symb = "";

        if(this.get_cultureAMPMPlaceholder() != "") {
            var m_arrtm = this.get_cultureAMPMPlaceholder().split(this._AMPMPlaceholderSeparator);

            LcAM = m_arrtm[0];
            LcPM = m_arrtm[1];

            if(autocomp == "") {
                var Symb = LcAM;

                if(Hcur > 12) {
                    Hcur = (parseInt(Hcur, 10) - 12).toString();
                    if(Hcur.length < 2)
                        Hcur = "0" + Hcur;

                    Symb = LcPM;
                }
            } else {
                Symb = LcAM; // default
                if(autocomp.indexOf(LcPM) != -1)
                    // set by autocomplete
                    Symb = LcPM;
            }

            // set by input
            SetAM = true; // default
            if(ValueText.indexOf(LcPM) != -1 && LcPM != "")
                // set by input
                SetPM = true;

            if(!this._acceptAmPm) {
                Symb = "";
                SetPM = false;
                SetAM = false;
            } else {
                //check empty hour to validate AM/PM
                var emp = true;
                if(ValueText.substring(0, 1) != this._promptCharacter || ValueText.substring(1, 2) != this._promptCharacter)
                    emp = false;

                if(emp && Symb != "") {
                    SetAM = true; // default;
                    SetPM = false;

                    if(LcPM == Symb)
                        // set by current time
                        SetPM = true;
                }
            }
        }

        var Mcur = CurDate.getMinutes().toString();
        if(Mcur.length < 2)
            Mcur = "0" + Mcur;

        if(autocomp != "")
            Mcur = autocomp.substring(3, 5);

        var Scur = "00",
            PH, PM;

        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
            PH = ValueText.substring(0, 2);
            PH = this._AdjustTime(PH, Hcur);
            PM = ValueText.substring(3, 5);
            PM = this._AdjustTime(PM, Mcur);
        } else {
            PH = ValueText.substring(this._LogicFirstPos, this._LogicFirstPos + 2);
            PH = this._AdjustTime(PH, Hcur);
            PM = ValueText.substring(this._LogicFirstPos + 3, this._LogicFirstPos + 5);
            PM = this._AdjustTime(PM, Mcur);
        }

        var maskvld = this._maskvalid;
        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime)
            maskvld = maskvld.split(" ")[1];

        if(maskvld == "99:99:99") {
            if(autocomp != "")
                Scur = autocomp.substring(6);

            var PS;
            if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
                PS = ValueText.substring(6, 8);
                PS = this._AdjustTime(PS, Scur);
            } else {
                PS = ValueText.substring(this._LogicFirstPos + 6, this._LogicFirstPos + 8);
                PS = this._AdjustTime(PS, Scur);
            }

            ValueText = PH + this.get_cultureTimePlaceholder() + PM + this.get_cultureTimePlaceholder() + PS;
        } else {
            ValueText = PH + this.get_cultureTimePlaceholder() + PM;
        }

        if(SetPM)
            ValueText += " " + LcPM;
        else if(SetAM)
            ValueText += " " + LcAM;

        if(this._maskType != Sys.Extended.UI.MaskedEditType.DateTime)
            this.loadValue(ValueText, this._LogicFirstPos);

        return ValueText;
    },

    AutoFormatDateTime: function() {
        var PartDt = this.AutoFormatDate(),
            PartTm = this.AutoFormatTime();

        this.loadValue(PartDt + " " + PartTm, this._LogicFirstPos);

        return PartDt + " " + PartTm;
    },

    AutoFormatDate: function() {
        var D = this._GetDateElementText("D").replace(new RegExp("(\\" + this._promptCharacter + ")", "g"), "") + '',
            M = this._GetDateElementText("M").replace(new RegExp("(\\" + this._promptCharacter + ")", "g"), "") + '',
            Y = this._GetDateElementText("Y").replace(new RegExp("(\\" + this._promptCharacter + ")", "g"), "") + '',
            Y4 = (this._maskvalid.indexOf("9999") != -1) ? true : false,
            autocomp = this._autoCompleteValue;

        if(autocomp.indexOf(this.get_cultureDatePlaceholder()) == -1)
            autocomp = "";

        var Dcur, Mcur, Ycur;
        if(autocomp == "") {
            var CurDate = new Date();
            Dcur = (CurDate.getUTCDate()).toString();

            if(Dcur.length < 2)
                Dcur = "0" + Dcur;

            Mcur = (CurDate.getUTCMonth() + 1).toString();
            if(Mcur.length < 2)
                Mcur = "0" + Mcur;

            Ycur = CurDate.getUTCFullYear().toString();
            if(!Y4)
                Ycur = CurDate.getUTCFullYear().toString().substring(2);
        } else {
            var m_arrDate;
            if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
                // if not have time...
                if(autocomp.indexOf(this.get_cultureTimePlaceholder()) == -1)
                    autocomp = autocomp + " ";

                var partdt = this._SplitDateTime(autocomp)[0];
                m_arrDate = partdt.split(this.get_cultureDatePlaceholder());
            } else {
                m_arrDate = autocomp.split(this.get_cultureDatePlaceholder());
            }

            if(this.get_cultureDateFormat() == "DMY") {
                Dcur = m_arrDate[0];
                Mcur = m_arrDate[1];
                Ycur = m_arrDate[2];
            } else if(this.get_cultureDateFormat() == "MDY") {
                Dcur = m_arrDate[1];
                Mcur = m_arrDate[0];
                Ycur = m_arrDate[2];
            } else if(this.get_cultureDateFormat() == "DYM") {
                Dcur = m_arrDate[0];
                Mcur = m_arrDate[2];
                Ycur = m_arrDate[1];
            } else if(this.get_cultureDateFormat() == "MYD") {
                Dcur = m_arrDate[2];
                Mcur = m_arrDate[0];
                Ycur = m_arrDate[1];
            } else if(this.get_cultureDateFormat() == "YMD") {
                Dcur = m_arrDate[2];
                Mcur = m_arrDate[1];
                Ycur = m_arrDate[0];
            } else if(this.get_cultureDateFormat() == "YDM") {
                Dcur = m_arrDate[1];
                Mcur = m_arrDate[2];
                Ycur = m_arrDate[0];
            }

            if(Dcur.length < 2)
                Dcur = "0" + Dcur;

            if(Mcur.length < 2)
                Mcur = "0" + Mcur;

            if(Y4) {
                while(Ycur.length < 4)
                    Ycur = "0" + Ycur;
            } else {
                while(Ycur.length < 2)
                    Ycur = "0" + Ycur;
            }
        }

        if(D == "")
            D = Dcur;
        if(M == "")
            M = Mcur;
        if(Y == "")
            Y = Ycur;

        var value;
        if(this.get_cultureDateFormat() == "DMY")
            value = D + this.get_cultureDatePlaceholder() + M + this._cultureDatePlaceholder + Y;
        else if(this.get_cultureDateFormat() == "MDY")
            value = M + this.get_cultureDatePlaceholder() + D + this._cultureDatePlaceholder + Y;
        else if(this.get_cultureDateFormat() == "DYM")
            value = D + this.get_cultureDatePlaceholder() + Y + this._cultureDatePlaceholder + M;
        else if(this.get_cultureDateFormat() == "MYD")
            value = M + this.get_cultureDatePlaceholder() + Y + this._cultureDatePlaceholder + D;
        else if(this.get_cultureDateFormat() == "YMD")
            value = Y + this.get_cultureDatePlaceholder() + M + this._cultureDatePlaceholder + D;
        else if(this.get_cultureDateFormat() == "YDM")
            value = Y + this.get_cultureDatePlaceholder() + D + this._cultureDatePlaceholder + M;

        if(this._maskType != Sys.Extended.UI.MaskedEditType.DateTime)
            this.loadValue(value, this._LogicFirstPos);

        return value;
    },

    // normalize initial value (number)
    ConvFmtNumber: function(input, loadFirst) {
        if(this._maskvalid.split(this.get_cultureDecimalPlaceholder()).length == 2) {
            if(input.substring(input.length - 1, input.length) == this.get_cultureDecimalPlaceholder())
                input = input.substring(0, input.length - 1);
        }

        return input;
    },

    // normalize initial value (Time)
    ConvFmtTime: function(input, loadFirst) {
        var AddH = 0,
            SetAM = false,
            SetPM = false,
            LcAM = "",
            LcPM = "";

        if(this.get_cultureAMPMPlaceholder() != "") {
            LcAM = this.get_cultureAMPMPlaceholder().split(this._AMPMPlaceholderSeparator)[0];
            LcPM = this.get_cultureAMPMPlaceholder().split(this._AMPMPlaceholderSeparator)[1];
        }

        //perform convert for loading of a page 
        if(loadFirst) {
            var LDLcAM = "",
                LDLcPM = "";

            if(this._cultureAMPMPlaceholder != "") {
                LDLcAM = this._cultureAMPMPlaceholder.split(this._AMPMPlaceholderSeparator)[0];
                LDLcPM = this._cultureAMPMPlaceholder.split(this._AMPMPlaceholderSeparator)[1];
            }

            // convert current Culture to user culture format (24H)
            if(this.get_userTimeFormat() == Sys.Extended.UI.MaskedEditUserTimeFormat.TwentyFourHour) {
                input = input.replace(new RegExp("(\\" + LDLcAM + ")", "g"), "");
                if(input.indexOf(LDLcPM) != -1)
                    AddH = 12;

                input = input.replace(new RegExp("(\\" + LDLcPM + ")", "g"), "");
            }
        }

        if(input.indexOf(LcAM) != -1 && LcAM != "")
            SetAM = true;
        else if(input.indexOf(LcPM) != -1 && LcPM != "")
            SetPM = true;

        if(LcAM != "")
            input = input.replace(new RegExp("(\\" + LcAM + ")", "g"), "");
        if(LcPM != "")
            input = input.replace(new RegExp("(\\" + LcPM + ")", "g"), "");

        input = input.replace(new RegExp("(\\" + " " + ")", "g"), "");

        var m_arrTime = input.split(this.get_cultureTimePlaceholder()),
            m_mask = this._maskvalid;

        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime)
            m_mask = m_mask.split(" ")[1];

        m_mask = m_mask.split(":");
        if(parseInt(m_arrTime.length, 10) < 2 || parseInt(m_arrTime.length, 10) > 3)
            return "";

        var H = parseInt(m_arrTime[0], 10) + AddH;
        H = H.toString();
        if(H.length < m_mask[0].length)
            while(H.length < m_mask[0].length)
                H = "0" + H;

        m_arrTime[0] = H;
        var M = parseInt(m_arrTime[1], 10) + '';
        if(M.length < m_mask[1].length)
            while(M.length < m_mask[1].length)
                M = "0" + M;

        m_arrTime[1] = M;
        var value = "";
        if(parseInt(m_arrTime.length, 10) == 3) {
            var S = parseInt(m_arrTime[2], 10) + '';

            if(S.length < m_mask[2].length)
                while(S.length < m_mask[2].length)
                    S = "0" + S;

            m_arrTime[2] = S;
            value = m_arrTime[0] + this.get_cultureTimePlaceholder() + m_arrTime[1] + this.get_cultureTimePlaceholder() + m_arrTime[2];
        } else {
            value = m_arrTime[0] + this.get_cultureTimePlaceholder() + m_arrTime[1];
        }

        if(SetAM)
            value += " " + LcAM;
        else if(SetPM)
            value += " " + LcPM;

        return value;
    },

    // normalize initial value (Date)
    ConvFmtDateTime: function(input, loadFirst) {
        var arr = this._SplitDateTime(input),
            partdt = arr[0],
            parttm = arr[1];

        if(parttm.split(" ").length == 2)
            parttm += " " + parttm.split(" ")[1];

        partdt = this.ConvFmtDate(partdt, loadFirst);
        parttm = this.ConvFmtTime(parttm, loadFirst);

        return partdt + " " + parttm;
    },

    _filter: function (array, testFunc) {
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            if (testFunc(array[i]))
                newArray.push(array[i]);
        }

        return newArray;
    },

    _map: function (array, mapFunc) {
        var newArray = [];
        for (var i = 0; i < array.length; i++)
            newArray.push(mapFunc(array[i]));

        return newArray;
    },

    ConvFmtDate: function (input, loadFirst) {
        var m_arrDateLD,
            m_arrDate;

        m_arrDate = this._filter(input.split(this.get_cultureDatePlaceholder()), function (element) {
            return element != "";
        });
        m_arrDate = this._map(m_arrDate, function (element) {
            return element.replace(/[^\/\d]/g, '')
        });

        if(loadFirst) {
            m_arrDateLD = input.split(this.get_cultureDatePlaceholder());
            if(this.get_userDateFormat() != Sys.Extended.UI.MaskedEditUserDateFormat.None) {
                if(this.get_userDateFormat() == Sys.Extended.UI.MaskedEditUserDateFormat.DayMonthYear)
                    this._cultureDateFormat = 'DMY';
                if(this.get_userDateFormat() == Sys.Extended.UI.MaskedEditUserDateFormat.DayYearMonth)
                    this._cultureDateFormat = 'DYM';
                if(this.get_userDateFormat() == Sys.Extended.UI.MaskedEditUserDateFormat.MonthDayYear)
                    this._cultureDateFormat = 'MDY';
                if(this.get_userDateFormat() == Sys.Extended.UI.MaskedEditUserDateFormat.MonthYearDay)
                    this._cultureDateFormat = 'MYD';
                if(this.get_userDateFormat() == Sys.Extended.UI.MaskedEditUserDateFormat.YearDayMonth)
                    this._cultureDateFormat = 'YDM';
                if(this.get_userDateFormat() == Sys.Extended.UI.MaskedEditUserDateFormat.YearMonthDay)
                    this._cultureDateFormat = 'YMD';

                m_arrDate[this.get_cultureDateFormat().indexOf("D")] = m_arrDateLD[this._cultureDateFormat.indexOf("D")];
                m_arrDate[this.get_cultureDateFormat().indexOf("M")] = m_arrDateLD[this._cultureDateFormat.indexOf("M")];
                m_arrDate[this.get_cultureDateFormat().indexOf("Y")] = m_arrDateLD[this._cultureDateFormat.indexOf("Y")];
            }
        }

        var m_mask = this._maskvalid;
        if(this._maskType == Sys.Extended.UI.MaskedEditType.DateTime)
            m_mask = m_mask.split(" ")[0];

        m_mask = m_mask.split("/");
        if(parseInt(m_arrDate.length, 10) != 3)
            return "";

        var D = parseInt(m_arrDate[this.get_cultureDateFormat().indexOf("D")], 10) + '';
        if(D.length < m_mask[this.get_cultureDateFormat().indexOf("D")].length)
            while(D.length < m_mask[this.get_cultureDateFormat().indexOf("D")].length)
                D = "0" + D;

        m_arrDate[this.get_cultureDateFormat().indexOf("D")] = D;
        var M = parseInt(m_arrDate[this.get_cultureDateFormat().indexOf("M")], 10) + '';
        if(M.length < m_mask[this.get_cultureDateFormat().indexOf("M")].length)
            while(M.length < m_mask[this.get_cultureDateFormat().indexOf("M")].length)
                M = "0" + M;

        m_arrDate[this.get_cultureDateFormat().indexOf("M")] = M;
        var Y = parseInt(m_arrDate[this.get_cultureDateFormat().indexOf("Y")], 10) + '';
        while(Y.length < m_mask[this.get_cultureDateFormat().indexOf("Y")].length)
            Y = "0" + Y;

        m_arrDate[this.get_cultureDateFormat().indexOf("Y")] = Y;

        return m_arrDate[0] + this.get_cultureDatePlaceholder() + m_arrDate[1] + this.get_cultureDatePlaceholder() + m_arrDate[2];
    },

    /// <summary>
    /// Sets the CSS class from MaskedEdit
    /// </summary>
    /// <param name="cssClass" type="String">CSS class to add</param>
    /// <member name="cM:AjaxControlToolkit.MaskedEditExtender.addCssClassMaskedEdit" />
    addCssClassMaskedEdit: function(cssClass) {
        var e = this.get_element();

        Sys.UI.DomElement.removeCssClass(e, this._onBlurCssNegative);
        Sys.UI.DomElement.removeCssClass(e, this._onFocusCssClass);
        Sys.UI.DomElement.removeCssClass(e, this._onFocusCssNegative);
        Sys.UI.DomElement.removeCssClass(e, this._onInvalidCssClass);

        if(cssClass != "")
            Sys.UI.DomElement.addCssClass(e, cssClass);
    },

    AddCssClassMaskedEdit: function(CssClass) {
        Sys.Extended.Deprecated("AddCssClassMaskedEdit(CssClass)", "addCssClassMaskedEdit(cssClass)");
        this.addCssClassMaskedEdit(CssClass);
    },

    // Set Cancel Event for cross browser
    _SetCancelEvent: function(evt) {
        if(typeof (evt.returnValue) !== "undefined")
            evt.returnValue = false;

        if(typeof (evt.cancelBubble) !== "undefined")
            evt.cancelBubble = true;

        if(typeof (evt.preventDefault) !== "undefined")
            evt.preventDefault();

        if(typeof (evt.stopPropagation) !== "undefined")
            evt.stopPropagation();
    },

    // Capture result validator after Postback
    _CaptureServerValidators: function() {
        var ret = true,
            msg = this._ExternalMessageError;

        if(typeof (Page_Validators) != "undefined") {
            var ctrval = null,
                first = true;

            for(var i = 0; i < Page_Validators.length; i++) {
                ctrval = Page_Validators[i];

                if(typeof (ctrval.enabled) == "undefined" || ctrval.enabled != false) {
                    if(ctrval.TargetValidator == this.get_element().id) {
                        if(!ctrval.isvalid) {
                            if(first) {
                                first = false;
                                msg = "";
                            }

                            if(typeof (ctrval.errormessage) == "string") {
                                if(msg != "")
                                    msg += ", ";

                                msg += ctrval.errormessage;
                            }
                            ret = false;
                        }
                    }
                }
            }
        }
        this._ExternalMessageError = msg;

        return ret;
    },

    // Capture and execute client validator to control
    _CaptureClientsValidators: function() {
        var ret = true;

        // clear local save External Message Error
        var msg = "";
        this._ExternalMessageError = msg;

        // Page_Validators is a Array of script asp.net
        if(typeof (Page_Validators) != "undefined") {
            var ctrval = null;

            for(var i = 0; i < Page_Validators.length; i++) {
                ctrval = Page_Validators[i];

                if(typeof (ctrval.enabled) == "undefined" || ctrval.enabled != false) {
                    if(ctrval.TargetValidator == this.get_element().id) {
                        if(typeof (ctrval.evaluationfunction) == "function") {
                            var crtret = ctrval.evaluationfunction(ctrval);

                            if(!crtret) {
                                ret = false;
                                if(typeof (ctrval.errormessage) == "string") {
                                    if(msg != "")
                                        msg += ", ";

                                    msg += ctrval.errormessage;
                                }
                            }
                        } else if(typeof (ctrval.evaluationfunction) == "string") {
                            var crtret;
                            eval("crtret = " + ctrval.evaluationfunction + "(" + ctrval.id + ")");

                            if(!crtret) {
                                ret = false;

                                if(typeof (ctrval.errormessage) == "string") {
                                    if(msg != "")
                                        msg += ", ";

                                    msg += ctrval.errormessage;
                                }
                            }
                        }
                    }
                }
            }
        }
        this._ExternalMessageError = msg;

        return ret;
    },

    /// <summary>
    /// Shows or hides the message tip
    /// </summary>
    /// <param name="visible" type="Boolean">Indicates whether or not to show or hide the message tip</param>
    /// <member name="cM:AjaxControlToolkit.MaskedEditExtender.showTooltipMessage" />
    showTooltipMessage: function(visible) {
        if(typeof (Page_Validators) == "undefined")
            return;

        var msg = "";
        if(!visible) {
            msg = this._CurrentMessageError;
            this._CurrentMessageError = "";
        }

        var i = 0,
            ctrval = null;

        for(i = 0; i < Page_Validators.length; i++) {
            ctrval = Page_Validators[i];

            if(ctrval.TargetValidator == this.get_element().id && ctrval.IsMaskedEdit == "true") {
                if(!visible) {
                    ctrval.innerHTML = msg;

                    if(typeof (ctrval.display) == "string") {
                        if(ctrval.display == "None")
                            return;

                        if(ctrval.display == "Dynamic") {
                            ctrval.style.display = ctrval.isvalid ? "none" : "inline";
                            return;
                        }
                    }
                    return;
                }

                this._CurrentMessageError = ctrval.innerHTML;
                ctrval.innerHTML = ctrval.TooltipMessage;

                if(typeof (ctrval.display) == "string") {
                    if(ctrval.display == "None")
                        return;

                    if(ctrval.display == "Dynamic") {
                        ctrval.style.display = "inline";
                        return;
                    }
                }
                ctrval.style.visibility = "visible";

                return;
            }
        }
    },

    ShowTooltipMessage: function(Visible) {
        Sys.Extended.Deprecated("ShowTooltipMessage(Visible)", "showTooltipMessage(visible)");
        this.showTooltipMessage(Visible);
    },

    _insertContent: function(value, curpos) {
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()),
            masktext = wrapper.get_Value();

        masktext = masktext.substring(0, curpos) + value + masktext.substring(curpos + 1);
        this._LogicTextMask = this._LogicTextMask.substring(0, curpos) + value + this._LogicTextMask.substring(curpos + 1);
        wrapper.set_Value(masktext);
    },

    // Insert Content at last right position 
    _insertContentRight: function(value) {
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()),
            masktext = wrapper.get_Value(),
            curpos = this._getLastEmptyPosition();

        if(curpos < 0)
            return;

        var i,
            resttext = masktext.substring(curpos + 1),
            restlogi = this._LogicTextMask.substring(curpos + 1);

        masktext = masktext.substring(0, curpos) + this._promptCharacter;
        this._LogicTextMask = this._LogicTextMask.substring(0, curpos) + this._LogicPrompt;
        var posaux;

        // clear rest of mask
        if(this._LogicLastInt != -1 && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft) {
            var arr_num = resttext.split(this.get_cultureDecimalPlaceholder()),
                arr_log = restlogi.split(this.get_cultureDecimalPlaceholder());

            for(i = 0 ; i < parseInt(arr_num[0].length, 10) ; i++) {
                if(this._isValidMaskedEditPosition(curpos + 1 + i)) {
                    masktext += this._promptCharacter;
                    this._LogicTextMask += this._LogicPrompt;
                } else {
                    masktext += arr_num[0].substring(i, i + 1);
                    this._LogicTextMask += arr_log[0].substring(i, i + 1);
                }
            }

            if(arr_num.length == 2) {
                masktext += this.get_cultureDecimalPlaceholder() + arr_num[1];
                this._LogicTextMask += this.get_cultureDecimalPlaceholder() + arr_log[1];
            }

            // insert only valid text
            posaux = this._getNextPosition(curpos);
            for(i = 0 ; i < parseInt(arr_num[0].length, 10) ; i++)
                if(this._isValidMaskedEditPosition(curpos + 1 + i) && arr_log[0].substring(i, i + 1) != this._LogicPrompt) {
                    masktext = masktext.substring(0, posaux) + arr_num[0].substring(i, i + 1) + masktext.substring(posaux + 1);
                    this._LogicTextMask = this._LogicTextMask.substring(0, posaux) + arr_log[0].substring(i, i + 1) + this._LogicTextMask.substring(posaux + 1);
                    posaux = this._getNextPosition(posaux + 1);
                }
        } else {
            for(i = 0 ; i < parseInt(resttext.length, 10) ; i++) {
                if(this._isValidMaskedEditPosition(curpos + 1 + i)) {
                    masktext += this._promptCharacter;
                    this._LogicTextMask += this._LogicPrompt;
                } else {
                    masktext += resttext.substring(i, i + 1);
                    this._LogicTextMask += restlogi.substring(i, i + 1);
                }
            }

            // insert only valid text
            posaux = this._getNextPosition(curpos);
            for(i = 0 ; i < parseInt(resttext.length, 10) ; i++)
                if(this._isValidMaskedEditPosition(curpos + 1 + i) && restlogi.substring(i, i + 1) != this._LogicPrompt) {
                    masktext = masktext.substring(0, posaux) + resttext.substring(i, i + 1) + masktext.substring(posaux + 1);
                    this._LogicTextMask = this._LogicTextMask.substring(0, posaux) + restlogi.substring(i, i + 1) + this._LogicTextMask.substring(posaux + 1);
                    posaux = this._getNextPosition(posaux + 1);
                }
        }

        // insert value
        var dif = 0;
        if(this._LogicLastInt != -1 && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft)
            dif = this._LogicLastPos - this._LogicLastInt + 1;

        masktext = masktext.substring(0, this._LogicLastPos - dif) + value + masktext.substring(this._LogicLastPos - dif + 1);
        this._LogicTextMask = this._LogicTextMask.substring(0, this._LogicLastPos - dif) + value + this._LogicTextMask.substring(this._LogicLastPos - dif + 1);
        wrapper.set_Value(masktext);
    },

    /// <summary>
    /// Inserts AM/PM symbol
    /// </summary>
    /// <param name="value" type="String">Value to insert</param>
    /// <member name="cM:AjaxControlToolkit.MaskedEditExtender.insertAMPM" />
    insertAMPM: function(value) {
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()),
            masktext = wrapper.get_Value(),
            ASymMask = this.get_cultureAMPMPlaceholder().split(this._AMPMPlaceholderSeparator),
            symb = "";

        if(ASymMask.length == 2) {
            if(value.toUpperCase() == this.getCultureFirstLetterAM().toUpperCase())
                symb = ASymMask[0];
            else if(value.toUpperCase() == this.getCultureFirstLetterPM().toUpperCase())
                symb = ASymMask[1];

            this._LogicSymbol = symb;
        }

        masktext = masktext.substring(0, this._LogicLastPos + 2) + symb + masktext.substring(this._LogicLastPos + 2 + symb.length);
        wrapper.set_Value(masktext);
    },

    InsertAMPM: function(value) {
        Sys.Extended.Deprecated("InsertAMPM(value)", "insertAMPM(value)");
        this.insertAMPM(value);
    },

    /// <summary>
    /// Inserts symbol negative
    /// </summary>
    /// <param name="value" type="String">Value to insert</param>
    /// <member name="cM:AjaxControlToolkit.MaskedEditExtender.insertSignal" />
    insertSignal: function(value) {
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()),
            masktext = wrapper.get_Value();

        if(value == "-" && this._LogicSymbol == "-")
            value = "+";

        if(value == "+") {
            value = " ";
            this._LogicSymbol = "";

            if(!this._InLostfocus && this._onFocusCssClass != "")
                this.addCssClassMaskedEdit(this._onFocusCssClass);
            else if(!this._InLostfocus)
                this.addCssClassMaskedEdit("");
        } else {
            this._LogicSymbol = "-";

            if(!this._InLostfocus && this._onFocusCssNegative != "")
                this.addCssClassMaskedEdit(this._onFocusCssNegative);
        }

        if(this._acceptNegative == Sys.Extended.UI.MaskedEditShowSymbol.Left)
            masktext = masktext.substring(0, this._LogicFirstPos - 1) + value + masktext.substring(this._LogicFirstPos);
        else if(this._acceptNegative == Sys.Extended.UI.MaskedEditShowSymbol.Right)
            masktext = masktext.substring(0, this._LogicLastPos + 1) + value + masktext.substring(this._LogicLastPos + 2);

        wrapper.set_Value(masktext);
    },

    InsertSignal: function(value) {
        Sys.Extended.Deprecated("InsertSignal(value)", "insertSignal(value)");
        this.insertSignal(value);
    },

    /// <summary>
    /// Sets Cursor at position in TextBox
    /// </summary>
    /// <param name="selectionStart" type="Number">Selection start index</param>
    /// <param name="selectionEnd" type="Number">Selection end index</param>
    /// <member name="cM:AjaxControlToolkit.MaskedEditExtender.setSelectionRange" />
    setSelectionRange: function(selectionStart, selectionEnd) {
        var input = this.get_element();

        if(input.setSelectionRange) {
            input.setSelectionRange(selectionStart, selectionEnd);
        } else if(input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    },

    _getLastEmptyPosition: function() {
        var pos = this._LogicLastPos;
        if(this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft && this._LogicLastInt != -1) {
            var curpos = this._getCurrentPosition();

            if(curpos <= this._LogicLastInt)
                pos = this._LogicLastInt;
        }

        while(pos >= 0 && this._LogicTextMask.substring(pos, pos + 1) != this._LogicPrompt)
            pos--;

        return pos;
    },

    _isValidMaskedEditPosition: function(pos) {
        return (this._LogicMask.substring(pos, pos + 1) == this._LogicPrompt);
    },

    // Next valid Position
    _getNextPosition: function(pos) {
        while(!this._isValidMaskedEditPosition(pos) && pos < this._LogicLastPos + 1)
            pos++;

        if(pos > this._LogicLastPos + 1)
            pos = this._LogicLastPos + 1;

        return pos;
    },

    // Previous valid Position
    _getPreviousPosition: function(pos) {
        while(!this._isValidMaskedEditPosition(pos) && pos > this._LogicFirstPos)
            pos--;

        if(pos < this._LogicFirstPos)
            pos = this._LogicFirstPos;

        return pos;
    },

    _getCurrentPosition: function() {
        var begin = 0,
            input = this.get_element();

        if(input.setSelectionRange) {
            begin = parseInt(input.selectionStart, 10);
        } else if(document.selection) {
            var sel = document.selection.createRange();
            if(sel.text != "") {
                var aux = ""

                if(this._DirectSelText == "R")
                    aux = sel.text + String.fromCharCode(3);
                else if(this._DirectSelText == "L")
                    aux = String.fromCharCode(3) + sel.text;

                sel.text = aux;
                this._DirectSelText == "";
            } else {
                sel.text = String.fromCharCode(3);
                this._DirectSelText == "";
            }

            var dummy = input.createTextRange();
            dummy.findText(String.fromCharCode(3));
            dummy.select();

            var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(input);
            begin = wrapper.get_Value().indexOf(String.fromCharCode(3));
            document.selection.clear();
        }

        if(begin > this._LogicLastPos + 1)
            begin = this._LogicLastPos + 1;

        if(begin < this._LogicFirstPos)
            begin = this._LogicFirstPos;

        return begin;
    },

    // Validate key at position in mask and/or filter
    _processKey: function(poscur, key) {
        var posmask = this._LogicMaskConv;

        //  9 = only numeric
        //  L = only letter
        //  $ = only letter and spaces
        //  C = only Custom - read from this._filtered
        //  A = only letter and Custom
        //  N = only numeric and Custom
        //  ? = any digit
        var filter;
        if(posmask.substring(poscur, poscur + 1) == "9")
            filter = this._charNumbers;
        else if(posmask.substring(poscur, poscur + 1).toUpperCase() == "L")
            filter = this._charLetters + this._charLetters.toLowerCase();
        else if(posmask.substring(poscur, poscur + 1) == "$")
            filter = this._charLetters + this._charLetters.toLowerCase() + " ";
        else if(posmask.substring(poscur, poscur + 1).toUpperCase() == "C")
            filter = this._filtered;
        else if(posmask.substring(poscur, poscur + 1).toUpperCase() == "A")
            filter = this._charLetters + this._charLetters.toLowerCase() + this._filtered;
        else if(posmask.substring(poscur, poscur + 1).toUpperCase() == "N")
            filter = this._charNumbers + this._filtered;
        else if(posmask.substring(poscur, poscur + 1) == "?")
            filter = "";
        else
            return false;

        if(filter == "")
            return true;

        // return true if we should accept the character.
        return (!filter || filter.length == 0 || filter.indexOf(key) != -1);
    },

    // create mask empty , logic mask empty
    // convert escape code and Placeholder to culture
    _createMask: function() {
        if(this._maskConv == "" && this._mask != "")
            this._convertMask();

        var text = this._maskConv,
            i = 0,
            masktext = "",
            maskvld = "",
            flagescape = false;

        this._LogicTextMask = "";
        this._QtdValidInput = 0;

        while(i < parseInt(text.length, 10)) {
            if(text.substring(i, i + 1) == this._charEscape && flagescape == false) {
                flagescape = true;
            } else if(this._CharsEditMask.indexOf(text.substring(i, i + 1)) == -1) {
                if(flagescape == true) {
                    flagescape = false;
                    masktext += text.substring(i, i + 1);
                    maskvld += text.substring(i, i + 1);
                    this._LogicTextMask += this._LogicEscape;
                } else {
                    if(this._CharsSpecialMask.indexOf(text.substring(i, i + 1)) != -1) {
                        this._QtdValidInput++;

                        if(text.substring(i, i + 1) == "/") {
                            masktext += this.get_cultureDatePlaceholder();
                            maskvld += "/";
                            this._LogicTextMask += this.get_cultureDatePlaceholder();
                        } else if(text.substring(i, i + 1) == ":") {
                            masktext += this.get_cultureTimePlaceholder();
                            maskvld += ":";
                            this._LogicTextMask += this.get_cultureTimePlaceholder();
                        } else if(text.substring(i, i + 1) == ",") {
                            masktext += this.get_cultureThousandsPlaceholder();
                            maskvld += ".";
                            this._LogicTextMask += this.get_cultureThousandsPlaceholder();
                        } else if(text.substring(i, i + 1) == ".") {
                            masktext += this.get_cultureDecimalPlaceholder();
                            maskvld += ",";
                            this._LogicTextMask += this.get_cultureDecimalPlaceholder();
                        }
                    } else {
                        masktext += text.substring(i, i + 1);
                        maskvld += text.substring(i, i + 1);
                        this._LogicTextMask += text.substring(i, i + 1);
                    }
                }
            } else {
                if(flagescape == true) {
                    flagescape = false;
                    masktext += text.substring(i, i + 1);
                    maskvld += text.substring(i, i + 1);
                    this._LogicTextMask += this._LogicEscape;
                } else {
                    this._QtdValidInput++;
                    masktext += this._promptCharacter;
                    maskvld += text.substring(i, i + 1);
                    this._LogicTextMask += this._LogicPrompt;
                }
            }
            i++;
        }

        // Set First and last logic position
        this._LogicFirstPos = -1;
        this._LogicLastPos = -1;
        this._LogicLastInt = -1;
        this._LogicMask = this._LogicTextMask;

        for(i = 0 ; i < parseInt(this._LogicMask.length, 10) ; i++) {
            if(this._LogicFirstPos == -1 && this._LogicMask.substring(i, i + 1) == this._LogicPrompt)
                this._LogicFirstPos = i;

            if(this._LogicMask.substring(i, i + this.get_cultureDatePlaceholder().length) == this.get_cultureDatePlaceholder())
                continue;
            else if(this._LogicMask.substring(i, i + 1) == " ")
                this._LogicDateTimeSepPos = i;

            if(this._LogicMask.substring(i, i + 1) == this._LogicPrompt)
                this._LogicLastPos = i;

            if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._inputDirection == Sys.Extended.UI.MaskedEditInputDirections.RightToLeft)
                if(this._LogicMask.substring(i, i + 1) == this.get_cultureDecimalPlaceholder())
                    this._LogicLastInt = i;
        }

        this._maskvalid = maskvld.substring(this._LogicFirstPos, this._LogicLastPos + 1);
        this._EmptyMask = masktext;
    },

    replaceAll: function(string, find, replace) {
        return string.split(find).join(replace);
    },

    getTextWithoutMask: function(text)
    {
        var clearedMask = this.replaceAll(this._LogicMask, this._LogicPrompt, "");
        clearedMask = this.replaceAll(clearedMask, this._LogicEscape, "");

        var clearedText = "";

        for (var charPos = 0; charPos < text.length; charPos++) {
            var currentChar = text[charPos];

            if (currentChar == clearedMask[0]) {
                clearedMask = clearedMask.substring(1);
            } else
                clearedText += currentChar;
        }

        return clearedText;
    },

    isDataCharacter: function(char)
    {
        return char == this._LogicEscape || char == this._LogicPrompt;
    },

    // return text without mask but with placeholders 
    _getClearMask: function(masktext) {
        var i = 0,
            clearmask = "",
            qtdok = 0,
            includedec = false;

        while(i < parseInt(this._LogicTextMask.length, 10)) {
            if(qtdok < this._QtdValidInput) {
                if(this._isValidMaskedEditPosition(i) && this._LogicTextMask.substring(i, i + 1) != this._LogicPrompt) {
                    if(clearmask == "" && includedec) {
                        clearmask += "0" + this.get_cultureDecimalPlaceholder();
                        includedec = false;
                    }

                    clearmask += this._LogicTextMask.substring(i, i + 1);
                    qtdok++;
                } else if(this._LogicTextMask.substring(i, i + 1) != this._LogicPrompt && this._LogicTextMask.substring(i, i + 1) != this._LogicEscape) {
                    if(this._LogicTextMask.substring(i, i + this.get_cultureDatePlaceholder().length) == this.get_cultureDatePlaceholder() && (this._maskType == Sys.Extended.UI.MaskedEditType.Date || this._maskType == Sys.Extended.UI.MaskedEditType.DateTime)) {
                        clearmask += (clearmask == "") ? "" : this.get_cultureDatePlaceholder();
                        i += (this.get_cultureDatePlaceholder().length - 1);
                    } else if(this._LogicTextMask.substring(i, i + 1) == this.get_cultureTimePlaceholder() && (this._maskType == Sys.Extended.UI.MaskedEditType.Time || this._maskType == Sys.Extended.UI.MaskedEditType.DateTime)) {
                        clearmask += (clearmask == "") ? "" : this.get_cultureTimePlaceholder();
                    } else if(this._LogicTextMask.substring(i, i + 1) == " " && this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) {
                        clearmask += (clearmask == "") ? "" : " ";
                    } else if(this._LogicTextMask.substring(i, i + 1) == this.get_cultureThousandsPlaceholder() && this._maskType == Sys.Extended.UI.MaskedEditType.Number) {
                        clearmask += (clearmask == "") ? "" : this.get_cultureThousandsPlaceholder();
                    } else if(this._LogicTextMask.substring(i, i + 1) == this.get_cultureDecimalPlaceholder() && this._maskType == Sys.Extended.UI.MaskedEditType.Number) {
                        clearmask += (clearmask == "") ? "" : this.get_cultureDecimalPlaceholder();
                        if(clearmask == "")
                            includedec = true;
                    }
                }
            }
            i++;
        }

        if(this._LogicSymbol != "" && clearmask != "") {
            if(this._maskType == Sys.Extended.UI.MaskedEditType.Time || this._maskType == Sys.Extended.UI.MaskedEditType.DateTime)
                clearmask += " " + this._LogicSymbol;
            else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number)
                clearmask = this._LogicSymbol + clearmask;
        }

        return clearmask;
    },

    // Convert notation {Number} in PAD's Number
    _convertMask: function() {
        this._maskConv = "";

        var qtdmask = "",
            maskchar = "",
            i;

        for(i = 0 ; i < parseInt(this._mask.length, 10) ; i++) {
            if(this._CharsEditMask.indexOf(this._mask.substring(i, i + 1)) != -1) {
                if(qtdmask.length == 0) {
                    this._maskConv += this._mask.substring(i, i + 1);
                    qtdmask = "";
                    maskchar = this._mask.substring(i, i + 1);
                } else if(this._mask.substring(i, i + 1) == "9") {
                    qtdmask += "9";
                } else if(this._mask.substring(i, i + 1) == "0") {
                    qtdmask += "0";
                }
            } else if(this._CharsEditMask.indexOf(this._mask.substring(i, i + 1)) == -1 && this._mask.substring(i, i + 1) != this._DelimitStartDup && this._mask.substring(i, i + 1) != this._DelimitEndDup) {
                if(qtdmask.length == 0) {
                    this._maskConv += this._mask.substring(i, i + 1);
                    qtdmask = "";
                    maskchar = "";
                } else {
                    if(this._charNumbers.indexOf(this._mask.substring(i, i + 1)) != -1)
                        qtdmask += this._mask.substring(i, i + 1);
                }
            } else if(this._mask.substring(i, i + 1) == this._DelimitStartDup && qtdmask == "") {
                qtdmask = "0";
            } else if(this._mask.substring(i, i + 1) == this._DelimitEndDup && qtdmask != "") {
                var qtddup = parseInt(qtdmask, 10) - 1;
                if(qtddup > 0)
                    for(var q = 0 ; q < qtddup ; q++)
                        this._maskConv += maskchar;
                qtdmask = "";
                maskchar = "";
            }
        }

        // set first and last position in mask for Symbols
        var FirstPos = -1,
            LastPos = -1,
            flagescape = false;

        for(i = 0 ; i < parseInt(this._maskConv.length, 10) ; i++) {
            if(this._maskConv.substring(i, i + 1) == this._charEscape && !flagescape) {
                flagescape = true;
            } else if(this._CharsEditMask.indexOf(this._maskConv.substring(i, i + 1)) != -1 && !flagescape) {
                if(FirstPos == -1)
                    FirstPos = i;

                LastPos = i;
            } else if(flagescape) {
                flagescape = false;
            }
        }

        // set spaces for Symbols AM/PM
        if((this._maskType == Sys.Extended.UI.MaskedEditType.Time || this._maskType == Sys.Extended.UI.MaskedEditType.DateTime) && this._acceptAmPm) {
            var ASymMask = this.get_cultureAMPMPlaceholder().split(this._AMPMPlaceholderSeparator),
                SymMask = "";

            if(ASymMask.length == 2) {
                SymMask = this._charEscape + " ";

                for(i = 0 ; i < parseInt(ASymMask[0].length, 10) ; i++)
                    SymMask += this._charEscape + " ";
            }
            this._maskConv = this._maskConv.substring(0, LastPos + 1) + SymMask + this._maskConv.substring(LastPos + 1);
        } else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._displayMoney == Sys.Extended.UI.MaskedEditShowSymbol.Left) { // set spaces for Symbols Currency
            var SymMask = "";

            for(i = 0 ; i < parseInt(this.get_cultureCurrencySymbolPlaceholder().length, 10) ; i++) {
                if(this._CharsEditMask.indexOf(this.get_cultureCurrencySymbolPlaceholder().substring(i, i + 1)) == -1)
                    SymMask += this.get_cultureCurrencySymbolPlaceholder().substring(i, i + 1);
                else
                    SymMask += this._charEscape + this.get_cultureCurrencySymbolPlaceholder().substring(i, i + 1);
            }

            SymMask += this._charEscape + " ";
            this._maskConv = this._maskConv.substring(0, FirstPos) + SymMask + this._maskConv.substring(FirstPos);
            FirstPos += SymMask.length;
            LastPos += SymMask.length;
        } else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._displayMoney == Sys.Extended.UI.MaskedEditShowSymbol.Right) { // set spaces for Symbols negative
            var SymMask = this._charEscape + " ";

            for(i = 0 ; i < parseInt(this.get_cultureCurrencySymbolPlaceholder().length, 10) ; i++)
                if(this._CharsEditMask.indexOf(this.get_cultureCurrencySymbolPlaceholder().substring(i, i + 1)) == -1)
                    SymMask += this.get_cultureCurrencySymbolPlaceholder().substring(i, i + 1);
                else
                    SymMask += this._charEscape + this.get_cultureCurrencySymbolPlaceholder().substring(i, i + 1);

            this._maskConv = this._maskConv.substring(0, LastPos + 1) + SymMask + this._maskConv.substring(LastPos + 1);
        }

        if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._acceptNegative == Sys.Extended.UI.MaskedEditShowSymbol.Right)
            this._maskConv = this._maskConv.substring(0, LastPos + 1) + this._charEscape + " " + this._maskConv.substring(LastPos + 1);
        else if(this._maskType == Sys.Extended.UI.MaskedEditType.Number && this._acceptNegative == Sys.Extended.UI.MaskedEditShowSymbol.Left)
            this._maskConv = this._maskConv.substring(0, FirstPos) + this._charEscape + " " + this._maskConv.substring(FirstPos);

        this._convertMaskNotEscape();
    },

    // Convert mask with escape to mask not escape
    // length is equal to real position 
    _convertMaskNotEscape: function() {
        this._LogicMaskConv = "";

        var atumask = this._maskConv.replace(/(\/)/g, this.get_cultureDatePlaceholder()),
            flagescape = false,
            i;

        for(i = 0 ; i < parseInt(atumask.length, 10) ; i++) {
            if(atumask.substring(i, i + 1) == this._charEscape)
                flagescape = true;
            else if(!flagescape)
                this._LogicMaskConv += atumask.substring(i, i + 1);
            else {
                this._LogicMaskConv += this._LogicEscape;
                flagescape = false;
            }
        }
    },

    // Helper properties

    /// <summary>
    /// Mask to be applied to target TextBox
    /// </summary>
    /// <getter>get_mask</getter>
    /// <setter>set_mask</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.mask" />
    get_mask: function() {
        if(this._maskConv == "" && this._mask != "")
            this._convertMask();

        return this._maskConv;
    },
    set_mask: function(value) {
        this._mask = value;
        this.raisePropertyChanged('mask');
    },

    get_Mask: function() {
        Sys.Extended.Deprecated("get_Mask()", "get_mask()");
        return this.get_mask();
    },
    set_Mask: function(value) {
        Sys.Extended.Deprecated("set_Mask(value)", "set_mask(value)");
        this.set_mask(value);
    },

    /// <summary>
    /// Valid characters for mask type "C" (case-sensitive)
    /// </summary>
    /// <getter>get_filtered</getter>
    /// <setter>set_filtered</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.filtered" />
    get_filtered: function() {
        return this._filtered;
    },
    set_filtered: function(value) {
        this._filtered = value;
        this.raisePropertyChanged('filtered');
    },

    get_Filtered: function() {
        Sys.Extended.Deprecated("get_Filtered()", "get_filtered()");
        return this.get_filtered();
    },
    set_Filtered: function(value) {
        Sys.Extended.Deprecated("set_Filtered(value)", "set_filtered(value)");
        this.set_filtered(value);
    },

    /// <summary>
    /// Text input direction
    /// </summary>
    /// <remarks>
    /// Possible values:
    /// LeftToRight - Left to Right
    /// RightToLeft - Right to left
    /// </remarks>
    /// <getter>get_inputDirection</getter>
    /// <setter>set_inputDirection</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.inputDirection" />
    get_inputDirection: function() {
        return this._inputDirection;
    },
    set_inputDirection: function(value) {
        this._inputDirection = value;
        this.raisePropertyChanged('inputDirection');
    },

    get_InputDirection: function() {
        Sys.Extended.Deprecated("get_InputDirection()", "get_inputDirection()");
        return this.get_inputDirection();
    },
    set_InputDirection: function(value) {
        Sys.Extended.Deprecated("set_InputDirection(value)", "set_inputDirection(value)");
        this.set_inputDirection(value);
    },

    /// <summary>
    /// Prompt character
    /// </summary>
    /// <getter>get_promptCharacter</getter>
    /// <setter>set_promptCharacter</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.promptCharacter" />
    get_promptCharacter: function() {
        return this._promptCharacter;
    },
    set_promptCharacter: function(value) {
        this._promptCharacter = value;
        this.raisePropertyChanged('promptCharacter');
    },

    get_PromptCharacter: function() {
        Sys.Extended.Deprecated("get_PromptCharacter()", "get_promptCharacter()");
        return this.get_promptCharacter();
    },
    set_PromptCharacter: function(value) {
        Sys.Extended.Deprecated("set_PromptCharacter(value)", "set_promptCharacter(value)");
        this.set_promptCharacter(value);
    },

    /// <summary>
    /// CSS class used when the TextBox receives focus
    /// </summary>
    /// <getter>get_onFocusCssClass</getter>
    /// <setter>set_onFocusCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.onFocusCssClass" />
    get_onFocusCssClass: function() {
        return this._onFocusCssClass;
    },
    set_onFocusCssClass: function(value) {
        this._onFocusCssClass = value;
        this.raisePropertyChanged('onFocusCssClass');
    },

    get_OnFocusCssClass: function() {
        Sys.Extended.Deprecated("get_OnFocusCssClass()", "get_onFocusCssClass()");
        return this.get_onFocusCssClass();
    },
    set_OnFocusCssClass: function(value) {
        Sys.Extended.Deprecated("set_OnFocusCssClass(value)", "set_onFocusCssClass(value)");
        this.set_onFocusCssClass(value);
    },

    /// <summary>
    /// CSS class used when the text is not valid
    /// </summary>
    /// <getter>get_onInvalidCssClass</getter>
    /// <setter>set_onInvalidCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.onInvalidCssClass" />
    get_onInvalidCssClass: function() {
        return this._onInvalidCssClass;
    },
    set_onInvalidCssClass: function(value) {
        this._onInvalidCssClass = value;
        this.raisePropertyChanged('onInvalidCssClass');
    },

    get_OnInvalidCssClass: function() {
        Sys.Extended.Deprecated("get_OnInvalidCssClass()", "get_onInvalidCssClass()");
        return this.get_onInvalidCssClass();
    },
    set_OnInvalidCssClass: function(value) {
        Sys.Extended.Deprecated("set_OnInvalidCssClass(value)", "set_onInvalidCssClass(value)");
        this.set_onInvalidCssClass(value);
    },

    /// <summary>
    /// Name of culture to use (overrides the default page culture)
    /// </summary>
    /// <getter>get_cultureName</getter>
    /// <setter>set_cultureName</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.cultureName" />
    get_cultureName: function() {
        return this._cultureName;
    },
    set_cultureName: function(value) {
        this._cultureName = value;
        this.raisePropertyChanged('cultureName');
    },

    get_CultureName: function() {
        Sys.Extended.Deprecated("get_CultureName()", "get_cultureName()");
        return this.get_cultureName();
    },
    set_CultureName: function(value) {
        Sys.Extended.Deprecated("set_CultureName(value)", "set_cultureName(value)");
        this.set_cultureName(value);
    },

    /// <summary>
    /// Culture override
    /// </summary>
    /// <getter>get_cultureDatePlaceholder</getter>
    /// <setter>set_cultureDatePlaceholder</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.cultureDatePlaceholder" />
    get_cultureDatePlaceholder: function() {
        return this._cultureDatePlaceholder;
    },
    set_cultureDatePlaceholder: function(value) {
        this._cultureDatePlaceholder = value;
        this.raisePropertyChanged('cultureDatePlaceholder');
    },

    get_CultureDatePlaceholder: function() {
        Sys.Extended.Deprecated("get_CultureDatePlaceholder()", "get_cultureDatePlaceholder()");
        return this.get_cultureDatePlaceholder();
    },
    set_CultureDatePlaceholder: function(value) {
        Sys.Extended.Deprecated("set_CultureDatePlaceholder(value)", "set_cultureDatePlaceholder(value)");
        this.set_cultureDatePlaceholder(value);
    },

    /// <summary>
    /// Culture override
    /// </summary>
    /// <getter>get_cultureTimePlaceholder</getter>
    /// <setter>set_cultureTimePlaceholder</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.cutlureTimePlaceholder" />
    get_cultureTimePlaceholder: function() {
        return this._cultureTimePlaceholder;
    },
    set_cultureTimePlaceholder: function(value) {
        this._cultureTimePlaceholder = value;
        this.raisePropertyChanged('cultureTimePlaceholder');
    },

    get_CultureTimePlaceholder: function() {
        Sys.Extended.Deprecated("get_CultureTimePlaceholder()", "get_cultureTimePlaceholder()");
        return this.get_cultureTimePlaceholder();
    },
    set_CultureTimePlaceholder: function(value) {
        Sys.Extended.Deprecated("set_CultureTimePlaceholder(value)", "set_cultureTimePlaceholder(value)");
        this.set_cultureTimePlaceholder(value);
    },

    /// <summary>
    /// Culture override
    /// </summary>
    /// <getter>get_cultureDecimalPlaceholder</getter>
    /// <setter>set_cultureDecimalPlaceholder</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.cultureDecimalPlaceholder" />
    get_cultureDecimalPlaceholder: function() {
        return this._cultureDecimalPlaceholder;
    },
    set_cultureDecimalPlaceholder: function(value) {
        this._cultureDecimalPlaceholder = value;
        this.raisePropertyChanged('cultureDecimalPlaceholder');
    },

    get_CultureDecimalPlaceholder: function() {
        Sys.Extended.Deprecated("get_CultureDecimalPlaceholder()", "get_cultureDecimalPlaceholder()");
        return this.get_cultureDecimalPlaceholder();
    },
    set_CultureDecimalPlaceholder: function(value) {
        Sys.Extended.Deprecated("set_CultureDecimalPlaceholder(value)", "set_cultureDecimalPlaceholder(value)");
        this.set_cultureDecimalPlaceholder(value);
    },

    /// <summary>
    /// Culture override
    /// </summary>
    /// <getter>get_cultureThousandsPlaceholder</getter>
    /// <setter>set_cultureThousandsPlaceholder</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.cultureThousandsPlaceholder" />
    get_cultureThousandsPlaceholder: function() {
        return this._cultureThousandsPlaceholder;
    },
    set_cultureThousandsPlaceholder: function(value) {
        this._cultureThousandsPlaceholder = value;
        this.raisePropertyChanged('cultureThousandsPlaceholder');
    },

    get_CultureThousandsPlaceholder: function() {
        Sys.Extended.Deprecated("get_CultureThousandsPlaceholder()", "get_cultureThousandsPlaceholder()");
        return this.get_cultureThousandsPlaceholder();
    },
    set_CultureThousandsPlaceholder: function(value) {
        Sys.Extended.Deprecated("set_CultureThousandsPlaceholder(value)", "set_cultureThousandsPlaceholder(value)");
        this.set_cultureThousandsPlaceholder(value);
    },

    /// <summary>
    /// Culture override
    /// </summary>
    /// <getter>get_cultureDateFormat</getter>
    /// <setter>set_cultureDateFormat</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.cultureDateFormat" />
    get_cultureDateFormat: function() {
        var ret = this._cultureDateFormat;

        switch(this.get_userDateFormat()) {
            case Sys.Extended.UI.MaskedEditUserDateFormat.DayMonthYear:
                ret = "DMY";
                break;
            case Sys.Extended.UI.MaskedEditUserDateFormat.DayYearMonth:
                ret = "DYM";
                break;
            case Sys.Extended.UI.MaskedEditUserDateFormat.MonthDayYear:
                ret = "MDY";
                break;
            case Sys.Extended.UI.MaskedEditUserDateFormat.MonthYearDay:
                ret = "MYD";
                break;
            case Sys.Extended.UI.MaskedEditUserDateFormat.YearDayMonth:
                ret = "YDM";
                break;
            case Sys.Extended.UI.MaskedEditUserDateFormat.YearMonthDay:
                ret = "YMD";
                break;
        }

        return ret;
    },
    set_cultureDateFormat: function(value) {
        this._cultureDateFormat = value;
        this.raisePropertyChanged('cultureDateFormat');
    },

    get_CultureDateFormat: function() {
        Sys.Extended.Deprecated("get_CultureDateFormat()", "get_cultureDateFormat()");
        return this.get_cultureDateFormat();
    },
    set_CultureDateFormat: function(value) {
        Sys.Extended.Deprecated("set_CultureDateFormat(value)", "set_cultureDateFormat(value)");
        this.set_cultureDateFormat(value);
    },

    /// <summary>
    /// Culture override
    /// </summary>
    /// <getter>get_cultureCurrencySymbolPlaceholder</getter>
    /// <setter>set_cultureCurrencySymbolPlaceholder</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.cultureCurrencySymbolPlaceholder" />
    get_cultureCurrencySymbolPlaceholder: function() {
        return this._cultureCurrencySymbolPlaceholder;
    },
    set_cultureCurrencySymbolPlaceholder: function(value) {
        this._cultureCurrencySymbolPlaceholder = value;
        this.raisePropertyChanged('cultureCurrencySymbolPlaceholder');
    },

    get_CultureCurrencySymbolPlaceholder: function() {
        Sys.Extended.Deprecated("get_CultureCurrencySymbolPlaceholder()", "get_cultureCurrencySymbolPlaceholder()");
        return this.get_cultureCurrencySymbolPlaceholder();
    },
    set_CultureCurrencySymbolPlaceholder: function(value) {
        Sys.Extended.Deprecated("set_CultureCurrencySymbolPlaceholder(value)", "set_cultureCurrencySymbolPlaceholder(value)");
        this.set_cultureCurrencySymbolPlaceholder(value);
    },

    /// <summary>
    /// Culture override
    /// </summary>
    /// <getter>get_cultureAMPMPlaceholder</getter>
    /// <setter>set_cultureAMPMPlaceholder</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.cultureAMPMPlaceholder" />
    get_cultureAMPMPlaceholder: function() {
        var value = this._cultureAMPMPlaceholder;
        if(value.split(this._AMPMPlaceholderSeparator).length != 2 || value == this._AMPMPlaceholderSeparator)
            value = "";

        if(this.get_userTimeFormat() == Sys.Extended.UI.MaskedEditUserTimeFormat.TwentyFourHour)
            value = "";

        return value;
    },
    set_cultureAMPMPlaceholder: function(value) {
        this._cultureAMPMPlaceholder = value;
        this.raisePropertyChanged('cultureAMPMPlaceholder');
    },

    get_CultureAMPMPlaceholder: function() {
        Sys.Extended.Deprecated("get_CultureAMPMPlaceholder()", "get_cultureAMPMPlaceholder()");
        return this.get_cultureAMPMPlaceholder();
    },
    set_CultureAMPMPlaceholder: function(value) {
        Sys.Extended.Deprecated("set_CultureAMPMPlaceholder(value)", "set_cultureAMPMPlaceholder(value)");
        this.set_cultureAMPMPlaceholder(value);
    },

    /// <summary>
    /// Returns culture's first AMPM letters
    /// </summary>
    /// <returns type="String">First AMPM letters</returns>
    /// <member name="cM:AjaxControlToolkit.MaskedEditExtender.getCultureFirstLettersAMPM" />
    getCultureFirstLettersAMPM: function() {
        if(this.get_cultureAMPMPlaceholder() != "") {
            var ASymMask = this.get_cultureAMPMPlaceholder().split(this._AMPMPlaceholderSeparator);
            return (ASymMask[0].substring(0, 1) + ASymMask[1].substring(0, 1));
        }

        return "";
    },

    get_CultureFirstLettersAMPM: function() {
        Sys.Extended.Deprecated("get_CultureFirstLettersAMPM()", "getCultureFirstLettersAMPM()");
        return this.getCultureFirstLettersAMPM();
    },

    /// <summary>
    /// Returns culture's first AM letter
    /// </summary>
    /// <returns type="String">First AM letter</returns>
    /// <member name="cM:AjaxControlToolkit.MaskedEditExtender.getCultureFirstLetterAM" />
    getCultureFirstLetterAM: function() {
        if(this.get_cultureAMPMPlaceholder() != "") {
            var ASymMask = this.get_cultureAMPMPlaceholder().split(this._AMPMPlaceholderSeparator);
            return ASymMask[0].substring(0, 1);
        }

        return "";
    },

    get_CultureFirstLetterAM: function() {
        Sys.Extended.Deprecated("get_CultureFirstLetterAM()", "getCultureFirstLetterAM()");
        return this.getCultureFirstLetterAM();
    },

    /// <summary>
    /// Returns culture's first PM letter
    /// </summary>
    /// <returns type="String">First PM letter</returns>
    /// <member name="cM:AjaxControlToolkit.MaskedEditExtender.getCultureFirstLetterPM" />
    getCultureFirstLetterPM: function() {
        if(this.get_cultureAMPMPlaceholder() != "") {
            var ASymMask = this.get_cultureAMPMPlaceholder().split(this._AMPMPlaceholderSeparator);
            return ASymMask[1].substring(0, 1);
        }

        return "";
    },

    get_CultureFirstLetterPM: function() {
        Sys.Extended.Deprecated("get_CultureFirstLetterPM()", "getCultureFirstLetterPM()");
        return this.getCultureFirstLetterPM();
    },

    /// <summary>
    /// True to remove the mask when the TextBox loses focus
    /// </summary>
    /// <getter>get_clearMaskOnLostFocus</getter>
    /// <setter>set_clearMaskOnLostFocus</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.clearMaskOnLostFocus" />
    get_clearMaskOnLostFocus: function() {
        return this._clearMaskOnLostfocus;
    },
    set_clearMaskOnLostFocus: function(value) {
        this._clearMaskOnLostfocus = value;
        this.raisePropertyChanged('clearMaskOnLostFocus');
    },

    get_ClearMaskOnLostFocus: function() {
        Sys.Extended.Deprecated("get_ClearMaskOnLostFocus()", "get_clearMaskOnLostFocus()");
        return this.get_clearMaskOnLostFocus();
    },
    set_ClearMaskOnLostFocus: function(value) {
        Sys.Extended.Deprecated("set_ClearMaskOnLostFocus(value)", "set_clearMaskOnLostFocus(value)");
        this.set_clearMaskOnLostFocus(value);
    },

    /// <summary>
    /// Message displayed when editing in TextBox
    /// </summary>
    /// <getter>get_messageValidatorTip</getter>
    /// <setter>set_messageValidatorTip</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.messageValidatorTip" />
    get_messageValidatorTip: function() {
        return this._messageValidatorTip;
    },
    set_messageValidatorTip: function(value) {
        this._messageValidatorTip = value;
        this.raisePropertyChanged('messageValidatorTip');
    },

    get_MessageValidatorTip: function() {
        Sys.Extended.Deprecated("get_MessageValidatorTip()", "get_messageValidatorTip()");
        return this.get_messageValidatorTip();
    },
    set_MessageValidatorTip: function(value) {
        Sys.Extended.Deprecated("set_MessageValidatorTip(value)", "set_messageValidatorTip(value)");
        this.set_messageValidatorTip(value);
    },

    /// <summary>
    /// Whether or not AM/PM is accepted on times. The default value is false
    /// </summary>
    /// <getter>get_acceptAMPM</getter>
    /// <setter>set_acceptAMPM</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.acceptAMPM" />
    get_acceptAMPM: function() {
        return this._acceptAmPm;
    },
    set_acceptAMPM: function(value) {
        this._acceptAmPm = value;
        this.raisePropertyChanged('acceptAMPM');
    },

    get_AcceptAMPM: function() {
        Sys.Extended.Deprecated("get_AcceptAMPM()", "get_acceptAMPM()");
        return this.get_acceptAMPM();
    },
    set_AcceptAMPM: function(value) {
        Sys.Extended.Deprecated("set_AcceptAMPM(value)", "set_acceptAMPM(value)");
        this.set_acceptAMPM(value);
    },

    /// <summary>
    /// True if the negative sign (-) is allowed
    /// </summary>
    /// <remarks>
    /// Possible values:
    /// None - Do not show the negative sign
    /// Left - Show the negative sign on the left of the mask
    /// Right - Show the negative sign on the right of the mask
    /// </remarks>
    /// <getter>get_acceptNegative</getter>
    /// <setter>set_acceptNegative</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.acceptNegative" />
    get_acceptNegative: function() {
        return this._acceptNegative;
    },
    set_acceptNegative: function(value) {
        this._acceptNegative = value;
        this.raisePropertyChanged('acceptNegative');
    },

    get_AcceptNegative: function() {
        Sys.Extended.Deprecated("get_AcceptNegative()", "get_acceptNegative()");
        return this.get_acceptNegative();
    },
    set_AcceptNegative: function(value) {
        Sys.Extended.Deprecated("set_AcceptNegative(value)", "set_acceptNegative(value)");
        this.set_acceptNegative(value);
    },

    /// <summary>
    /// Specifies how the currency symbol is displayed
    /// </summary>
    /// <remarks>
    /// Possible values:
    /// None - Do not show the currency symbol
    /// Left - Show the currency symbol on the left of the mask
    /// Right - Show the currency symbol on the right of the mask
    /// </remarks>
    /// <getter>get_displayMoney</getter>
    /// <setter>set_displayMoney</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.displayMoney" />
    get_displayMoney: function() {
        return this._displayMoney;
    },
    set_displayMoney: function(value) {
        this._displayMoney = value;
        this.raisePropertyChanged('displayMoney');
    },

    get_DisplayMoney: function() {
        Sys.Extended.Deprecated("get_DisplayMoney()", "get_displayMoney()");
        return this.get_displayMoney();
    },
    set_DisplayMoney: function(value) {
        Sys.Extended.Deprecated("set_DisplayMoney(value)", "set_displayMoney(value)");
        this.set_displayMoney(value);
    },

    /// <summary>
    /// CSS class used when the TextBox gets focus with a negative value
    /// </summary>
    /// <getter>get_onFocusCssNegative</getter>
    /// <setter>set_onFocusCssNegative</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.onFocusCssNegative" />
    get_onFocusCssNegative: function() {
        return this._onFocusCssNegative;
    },
    set_onFocusCssNegative: function(value) {
        this._onFocusCssNegative = value;
        this.raisePropertyChanged('onFocusCssNegative');
    },

    get_OnFocusCssNegative: function() {
        Sys.Extended.Deprecated("get_OnFocusCssNegative()", "get_onFocusCssNegative()");
        return this.get_onFocusCssNegative();
    },
    set_OnFocusCssNegative: function(value) {
        Sys.Extended.Deprecated("set_OnFocusCssNegative(value)", "set_onFocusCssNegative(value)");
        this.set_onFocusCssNegative(value);
    },

    /// <summary>
    /// CSS class used when the TextBox loses focus with a negative value
    /// </summary>
    /// <getter>get_onBlurCssNegative</getter>
    /// <setter>set_onBlurCssNegative</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.onBlurCssNegative" />
    get_onBlurCssNegative: function() {
        return this._onBlurCssNegative;
    },
    set_onBlurCssNegative: function(value) {
        this._onBlurCssNegative = value;
        this.raisePropertyChanged('onBlurCssNegative');
    },

    get_OnBlurCssNegative: function() {
        Sys.Extended.Deprecated("get_OnBlurCssNegative()", "get_onBlurCssNegative()");
        return this.get_onBlurCssNegative();
    },
    set_OnBlurCssNegative: function(value) {
        Sys.Extended.Deprecated("set_OnBlurCssNegative(value)", "set_onBlurCssNegative(value)");
        this.set_onBlurCssNegative(value);
    },

    /// <summary>
    /// Default century used when a date mask only has two digits for the year
    /// </summary>
    /// <getter>get_century</getter>
    /// <setter>set_century</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.century" />
    get_century: function() {
        return this._century;
    },
    set_century: function(value) {
        this._century = value;
        this.raisePropertyChanged('century');
    },

    get_Century: function() {
        Sys.Extended.Deprecated("get_Century()", "get_century()");
        return this.get_century();
    },
    set_Century: function(value) {
        Sys.Extended.Deprecated("set_Century(value)", "set_century(value)");
        this.set_century(value);
    },

    /// <summary>
    /// True to automatically fill in empty mask characters not specified by the user
    /// </summary>
    /// <remarks>
    /// MaskType=Number - Empty mask characters will be filled with zeros
    /// MaskType=Time - Empty mask characters will be filled with the current time
    /// MaskType=Date - Empty mask characters will be filled with the current date
    /// MaskType=DateTime - Empty mask characters will be filled with the current date/time
    /// </remarks>
    /// <getter>get_autoComplete</getter>
    /// <setter>set_autoComplete</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.autoComplete" />
    get_autoComplete: function() {
        return this._autoComplete;
    },
    set_autoComplete: function(value) {
        this._autoComplete = value;
        this.raisePropertyChanged('autoComplete');
    },

    get_AutoComplete: function() {
        Sys.Extended.Deprecated("get_AutoComplete()", "get_autoComplete()");
        return this.get_autoComplete();
    },
    set_AutoComplete: function(value) {
        Sys.Extended.Deprecated("set_AutoComplete(value)", "set_autoComplete(value)");
        this.set_autoComplete(value);
    },

    /// <summary>
    /// Default character to use when AutoComplete is enabled
    /// </summary>
    /// <getter>get_autoCompleteValue</getter>
    /// <setter>set_autoCompleteValue</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.autoCompleteValue" />
    get_autoCompleteValue: function() {
        return this._autoCompleteValue;
    },
    set_autoCompleteValue: function(value) {
        this._autoCompleteValue = value;
        this.raisePropertyChanged('autoCompleteValue');
    },

    get_AutoCompleteValue: function() {
        Sys.Extended.Deprecated("get_AutoCompleteValue()", "get_autoCompleteValue()");
        return this.get_autoCompleteValue();
    },
    set_AutoCompleteValue: function(value) {
        Sys.Extended.Deprecated("set_AutoCompleteValue(value)", "set_autoCompleteValue(value)");
        this.set_autoCompleteValue(value);
    },

    /// <summary>
    /// Type of validation to perform
    /// </summary>
    /// <remarks>
    /// Possible values:
    /// None - No validation
    /// Number - Number validation
    /// Date - Date validation
    /// Time - Time validation
    /// DateTime - Date and time validation
    /// </remarks>
    /// <getter>get_maskType</getter>
    /// <setter>set_maskType</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.maskType" />
    get_maskType: function() {
        return this._maskType;
    },
    set_maskType: function(value) {
        this._maskType = value;
        this.raisePropertyChanged('maskType');
    },

    get_MaskType: function() {
        Sys.Extended.Deprecated("get_MaskType()", "get_maskType()");
        return this.get_maskType();
    },
    set_MaskType: function(value) {
        Sys.Extended.Deprecated("set_MaskType(value)", "set_maskType(value)");
        this.set_maskType(value);
    },

    /// <summary>
    /// True to clear the TextBox when invalid text is entered
    /// </summary>
    /// <getter>get_clearTextOnInvalid</getter>
    /// <setter>set_clearTextOnInvalid</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.clearTextOnInvalid" />
    get_clearTextOnInvalid: function() {
        return this._clearTextOnInvalid;
    },
    set_clearTextOnInvalid: function(value) {
        if(this._clearTextOnInvalid !== value) {
            this._clearTextOnInvalid = value;
            this.raisePropertyChanged('clearTextOnInvalid');
        }
    },

    get_ClearTextOnInvalid: function() {
        Sys.Extended.Deprecated("get_ClearTextOnInvalid()", "get_clearTextOnInvalid()");
        return this.get_clearTextOnInvalid();
    },
    set_ClearTextOnInvalid: function(value) {
        Sys.Extended.Deprecated("set_ClearTextOnInvalid(value)", "set_clearTextOnInvalid(value)");
        this.set_clearTextOnInvalid(value);
    },

    /// <summary>
    /// Prompt text to use when a clipboard paste is performed
    /// </summary>
    /// <getter>get_clipboardText</getter>
    /// <setter>set_clipboardText</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.clipboardText" />
    get_clipboardText: function() {
        return this._clipboardText;
    },
    set_clipboardText: function(value) {
        this._clipboardText = value;
        this.raisePropertyChanged('clipboardText');
    },

    get_ClipboardText: function() {
        Sys.Extended.Deprecated("get_ClipboardText()", "get_clipboardText()");
        return this.get_clipboardText();
    },
    set_ClipboardText: function(value) {
        Sys.Extended.Deprecated("set_ClipboardText(value)", "set_clipboardText(value)");
        this.set_clipboardText(value);
    },

    /// <summary>
    /// True to allow copy/paste with the clipboard
    /// </summary>
    /// <getter>get_clipboardEnabled</getter>
    /// <setter>set_clipboardEnabled</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.clipboardEnabled" />
    get_clipboardEnabled: function() {
        return this._allowCopyPaste;
    },
    set_clipboardEnabled: function(value) {
        this._allowCopyPaste = value;
        this.raisePropertyChanged('clipboardEnabled');
    },

    get_ClipboardEnabled: function() {
        Sys.Extended.Deprecated("get_ClipboardEnabled()", "get_clipboardEnabled()");
        return this.get_clipboardEnabled();
    },
    set_ClipboardEnabled: function(value) {
        Sys.Extended.Deprecated("set_ClipboardEnabled(value)", "set_clipboardEnabled(value)");
        this.set_clipboardEnabled(value);
    },

    /// <summary>
    /// True to show a tooltip message when the mouse hovers over an invalid TextBox
    /// </summary>
    /// <getter>get_errorTooltipEnabled</getter>
    /// <setter>set_errorTooltipEnabled</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.errorTooltipEnabled" />
    get_errorTooltipEnabled: function() {
        return this._showMessageErrorFloat;
    },
    set_errorTooltipEnabled: function(value) {
        this._showMessageErrorFloat = value;
        this.raisePropertyChanged('errorTooltipEnabled');
    },

    get_ErrorTooltipEnabled: function() {
        Sys.Extended.Deprecated("get_ErrorTooltipEnabled()", "get_errorTooltipEnabled()");
        return this.get_errorTooltipEnabled();
    },
    set_ErrorTooltipEnabled: function(value) {
        Sys.Extended.Deprecated("set_ErrorTooltipEnabled(value)", "set_errorTooltipEnabled(value)");
        this.set_errorTooltipEnabled(value);
    },

    /// <summary>
    /// CSS class for the tooltip message
    /// </summary>
    /// <getter>get_errorTooltipCssClass</getter>
    /// <setter>set_errorTooltipCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.errorTooltipCssClass" />
    get_errorTooltipCssClass: function() {
        return this._cssMessageErrorFloat;
    },
    set_errorTooltipCssClass: function(value) {
        this._cssMessageErrorFloat = value;
        this.raisePropertyChanged('errorTooltipCssClass');
    },

    get_ErrorTooltipCssClass: function() {
        Sys.Extended.Deprecated("get_ErrorTooltipCssClass()", "get_errorTooltipCssClass()");
        return this.get_errorTooltipCssClass();
    },
    set_ErrorTooltipCssClass: function(value) {
        Sys.Extended.Deprecated("set_ErrorTooltipCssClass(value)", "set_errorTooltipCssClass(value)");
        this.set_errorTooltipCssClass(value);
    },

    /// <summary>
    /// Custom date format
    /// </summary>
    /// <getter>get_userDateFormat</getter>
    /// <setter>set_userDateFormat</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.userDateFormat" />
    get_userDateFormat: function() {
        return this._userDateFormat;
    },
    set_userDateFormat: function(value) {
        this._userDateFormat = value;
        this.raisePropertyChanged('userDateFormat');
    },

    get_UserDateFormat: function() {
        Sys.Extended.Deprecated("get_UserDateFormat()", "get_userDateFormat()");
        return this.get_userDateFormat();
    },
    set_UserDateFormat: function(value) {
        Sys.Extended.Deprecated("set_UserDateFormat(value)", "set_userDateFormat(value)");
        this.set_userDateFormat(value);
    },

    /// <summary>
    /// Custom time format
    /// </summary>
    /// <getter>get_userTimeFormat</getter>
    /// <setter>set_userTimeFormat</setter>
    /// <member name="cP:AjaxControlToolkit.MaskedEditExtender.userTimeFormat" />
    get_userTimeFormat: function() {
        return this._userTimeFormat;
    },
    set_userTimeFormat: function(value) {
        this._userTimeFormat = value;
        this.raisePropertyChanged('userTimeFormat');
    },

    get_UserTimeFormat: function() {
        Sys.Extended.Deprecated("get_UserTimeFormat()", "get_userTimeFormat()");
        return this.get_userTimeFormat();
    },
    set_UserTimeFormat: function(value) {
        Sys.Extended.Deprecated("set_UserTimeFormat(value)", "set_userTimeFormat(value)");
        this.set_userTimeFormat(value);
    }
}
Sys.Extended.UI.MaskedEditBehavior.registerClass('Sys.Extended.UI.MaskedEditBehavior', Sys.Extended.UI.DynamicPopulateBehaviorBase);

// Register enumerations  
Sys.Extended.UI.MaskedEditType = function() {
    throw Error.invalidOperation();
}

Sys.Extended.UI.MaskedEditInputDirections = function() {
    throw Error.invalidOperation();
}

Sys.Extended.UI.MaskedEditShowSymbol = function() {
    throw Error.invalidOperation();
}

Sys.Extended.UI.MaskedEditUserDateFormat = function() {
    throw Error.invalidOperation();
}

Sys.Extended.UI.MaskedEditUserTimeFormat = function() {
    throw Error.invalidOperation();
}

Sys.Extended.UI.MaskedEditType.prototype = {
    None: 0,
    Date: 1,
    Number: 2,
    Time: 3,
    DateTime: 4
}

Sys.Extended.UI.MaskedEditInputDirections.prototype = {
    LeftToRight: 0,
    RightToLeft: 1
}

Sys.Extended.UI.MaskedEditShowSymbol.prototype = {
    None: 0,
    Left: 1,
    Right: 2
}

Sys.Extended.UI.MaskedEditUserDateFormat.prototype = {
    None: 0,
    DayMonthYear: 1,
    DayYearMonth: 2,
    MonthDayYear: 3,
    MonthYearDay: 4,
    YearDayMonth: 5,
    YearMonthDay: 6
}

Sys.Extended.UI.MaskedEditUserTimeFormat.prototype = {
    None: 0,
    TwentyFourHour: 1
}

Sys.Extended.UI.MaskedEditType.registerEnum('Sys.Extended.UI.MaskedEditType');
Sys.Extended.UI.MaskedEditInputDirections.registerEnum('Sys.Extended.UI.MaskedEditInputDirections');
Sys.Extended.UI.MaskedEditShowSymbol.registerEnum('Sys.Extended.UI.MaskedEditShowSymbol');
Sys.Extended.UI.MaskedEditUserDateFormat.registerEnum('Sys.Extended.UI.MaskedEditUserDateFormat');
Sys.Extended.UI.MaskedEditUserTimeFormat.registerEnum('Sys.Extended.UI.MaskedEditUserTimeFormat');