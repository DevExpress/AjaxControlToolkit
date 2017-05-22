Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.CalendarBehavior = function(element) {
    // A behavior that attaches a calendar date selector to a textbox
    // param "element" is the element to attach to

    Sys.Extended.UI.CalendarBehavior.initializeBase(this, [element]);

    this._textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);
    /// <summary>
    /// A format string used to display the selected date. The default value is d
    /// </summary>
    /// <getter>get_format</getter>
    /// <setter>set_format</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.format" />
    this._format = "d";
    /// <summary>
    /// A format string used to display today's date. The default value is MMMM d, yyyy.
    /// </summary>
    /// <getter>get_todaysDateFormat</getter>
    /// <setter>set_todaysDateFormat</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.todaysDateFormat" />
    this._todaysDateFormat = "MMMM d, yyyy";
    /// <summary>
    /// A format string used to display Days Mode Title. The default value is MMMM, yyyy.
    /// </summary>
    /// <getter>get_daysModeTitleFormat</getter>
    /// <setter>set_daysModeTitleFormat</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.daysModeTitleFormat" />
    this._daysModeTitleFormat = "MMMM, yyyy";
    /// <summary>
    /// The name of a CSS class used to style the calendar.
    /// The default value is ajax__calendar
    /// </summary>
    /// <getter>get_cssClass</getter>
    /// <setter>set_cssClass</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.cssClass" />
    this._cssClass = "ajax__calendar";
    /// <summary>
    /// Determines whether or not this behavior is available for the current element.
    /// </summary>
    /// <getter>get_enabled</getter>
    /// <setter>set_enabled</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.enabled" />
    this._enabled = true;
    /// <summary>
    /// Sets whether or not changing modes is animated.
    /// The default is true
    /// </summary>
    /// <getter>get_animated</getter>
    /// <setter>set_animated</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.animated" />
    this._animated = true;
    this._buttonID = null;
    this._layoutRequested = 0;
    this._layoutSuspended = false;
    /// <summary>
    /// The button to use to show the calendar (optional).
    /// </summary>
    /// <getter>get_button</getter>
    /// <setter>set_button</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.button" />
    this._button = null;
    this._popupMouseDown = false;
    /// <summary>
    /// A date that the calendar is initialized with.
    /// </summary>
    /// <getter>get_selectedDate</getter>
    /// <setter>set_selectedDate</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.selectedDate" />
    this._selectedDate = null;
    /// <summary>
    /// The start date for the range.
    /// </summary>
    /// <getter>get_startDate</getter>
    /// <setter>set_startDate</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.startDate" />
    this._startDate = null;
    /// <summary>
    /// The end date for a range.
    /// </summary>
    /// <getter>get_endDate</getter>
    /// <setter>set_endDate</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.endDate" />
    this._endDate = null;
    /// <summary>
    /// The date currently visible in the calendar.
    /// </summary>
    /// <getter>get_visibleDate</getter>
    /// <setter>set_visibleDate</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.visibleDate" />
    this._visibleDate = null;
    /// <summary>
    /// The date to use for "Today".
    /// </summary>
    /// <getter>get_todaysDate</getter>
    /// <setter>set_todaysDate</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.todaysDate" />
    this._todaysDate = null;
    /// <summary>
    /// The first day of the week.
    /// The default value is Default
    /// </summary>
    /// <getter>get_firstDayOfWeek</getter>
    /// <setter>set_firstDayOfWeek</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.firstDayOfWeek" />
    this._firstDayOfWeek = Sys.Extended.UI.FirstDayOfWeek.Default;
    this._firstPopUp = true;

    this._container = null;
    this._popupDiv = null;
    this._header = null;
    this._prevArrow = null;
    this._nextArrow = null;
    this._title = null;
    this._body = null;
    /// <summary>
    /// The button used to select today's date.
    /// </summary>
    /// <getter>get_todayButton</getter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.todayButton" />
    this._today = null;
    this._days = null;
    this._daysTable = null;
    this._daysTableHeader = null;
    this._daysTableHeaderRow = null;
    this._daysBody = null;
    this._months = null;
    this._monthsTable = null;
    this._monthsBody = null;
    this._years = null;
    this._yearsTable = null;
    this._yearsBody = null;
    /// <summary>
    /// The popup position of the calendar.
    /// The default is BottomLeft
    /// </summary>
    /// <getter>get_popupPosition</getter>
    /// <setter>set_popupPosition</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.popupPosition" />
    this._popupPosition = Sys.Extended.UI.CalendarPosition.BottomLeft;
    /// <summary>
    /// The default view of the calender. The default value is Days.
    /// </summary>
    /// <getter>get_defaultView</getter>
    /// <setter>set_defaultView</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.defaultView" />
    this._defaultView = Sys.Extended.UI.CalendarDefaultView.Days;

    this._popupBehavior = null;
    this._modeChangeAnimation = null;
    this._modeChangeMoveTopOrLeftAnimation = null;
    this._modeChangeMoveBottomOrRightAnimation = null;
    this._mode = "days";
    this._selectedDateChanging = false;
    /// <summary>
    /// Determines whether or not the calendar is open.
    /// The default value is false
    /// </summary>
    /// <getter>get_isOpen</getter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.isOpen" />
    this._isOpen = false;
    this._isAnimating = false;
    /// <summary>
    /// Determines whether or not time should be cleared in the edited date/time.
    /// The default is false
    /// </summary>
    /// <getter>get_clearTime</getter>
    /// <setter>set_clearTime</setter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.clearTime" />
    this._clearTime = false;
    this._width = 170;
    this._height = 139;
    this._modes = { "days": null, "months": null, "years": null };
    this._modeOrder = { "days": 0, "months": 1, "years": 2 };

    this._blur = new Sys.Extended.UI.DeferredOperation(1, this, this.blur);

    this._button$delegates = {
        click: Function.createDelegate(this, this._button_onclick),
        keypress: Function.createDelegate(this, this._button_onkeypress),
        blur: Function.createDelegate(this, this._button_onblur)
    }
    this._element$delegates = {
        change: Function.createDelegate(this, this._element_onchange),
        keypress: Function.createDelegate(this, this._element_onkeypress),
        click: Function.createDelegate(this, this._element_onclick),
        focus: Function.createDelegate(this, this._element_onfocus),
        blur: Function.createDelegate(this, this._element_onblur)
    }
    this._popup$delegates = {
        mousedown: Function.createDelegate(this, this._popup_onmousedown),
        mouseup: Function.createDelegate(this, this._popup_onmouseup),
        drag: Function.createDelegate(this, this._popup_onevent),
        dragstart: Function.createDelegate(this, this._popup_onevent)
    }
    this._cell$delegates = {
        mouseover: Function.createDelegate(this, this._cell_onmouseover),
        mouseout: Function.createDelegate(this, this._cell_onmouseout),
        click: Function.createDelegate(this, this._cell_onclick)
    }
}
Sys.Extended.UI.CalendarBehavior.prototype = {

    get_clearTime: function() {
        return this._clearTime;
    },
    set_clearTime: function(value) {
        if(this._clearTime != value) {
            this._clearTime = value;
            this.raisePropertyChanged("clearTime");
        }
    },

    get_animated: function() {
        return this._animated;
    },
    set_animated: function(value) {
        if(this._animated != value) {
            this._animated = value;
            this.raisePropertyChanged("animated");
        }
    },

    get_enabled: function() {
        return this._enabled;
    },
    set_enabled: function(value) {
        if(this._enabled != value) {
            this._enabled = value;
            this.raisePropertyChanged("enabled");
        }
    },

    get_button: function() {
        return this._button;
    },
    set_button: function(value) {
        if(this._button != value) {
            if(this._button && this.get_isInitialized()) {
                $common.removeHandlers(this._button, this._button$delegates);
            }
            this._button = value;
            if(this._button && this.get_isInitialized()) {
                $addHandlers(this._button, this._button$delegates);
            }
            this.raisePropertyChanged("button");
        }
    },

    get_popupPosition: function() {
        return this._popupPosition;
    },
    set_popupPosition: function(value) {
        if(this._popupPosition != value) {
            this._popupPosition = value;
            this.raisePropertyChanged('popupPosition');
        }
    },

    get_startDate: function() {
        return this._startDate;
    },
    set_startDate: function(value) {
        // The property of the start date for range
        if(this._startDate != value) {
            this._startDate = this._parseDateSortableFormat(value);
            this.raisePropertyChanged('startDate');
        }
    },

    get_endDate: function() {
        return this._endDate;
    },
    set_endDate: function(value) {
        if(this._endDate != value) {
            this._endDate = this._parseDateSortableFormat(value);
            this.raisePropertyChanged('endDate');
        }
    },

    get_format: function() {
        return this._format;
    },
    set_format: function(value) {
        if(this._format != value) {
            this._format = value;
            this.raisePropertyChanged("format");
        }
    },

    get_todaysDateFormat: function() {
        return this._todaysDateFormat;
    },
    set_todaysDateFormat: function(value) {
        if(this._todaysDateFormat != value) {
            this._todaysDateFormat = value;
            this.raisePropertyChanged("todaysDateFormat");
        }
    },

    get_daysModeTitleFormat: function() {
        return this._daysModeTitleFormat;
    },
    set_daysModeTitleFormat: function(value) {
        if(this._daysModeTitleFormat != value) {
            this._daysModeTitleFormat = value;
            this.raisePropertyChanged("daysModeTitleFormat");
        }
    },

    get_selectedDate: function() {
        // The date value represented by the text box
        if(this._selectedDate == null) {
            var value = this._textbox.get_Value();
            if(value) {
                value = this._parseTextValue(value);
                if(value) {
                    this._selectedDate = value;
                }
            }
        }
        return this._selectedDate;
    },
    set_selectedDate: function(value) {
        if(value && (String.isInstanceOfType(value)) && (value.length != 0)) {
            value = this._parseDateSortableFormat(value);
        }

        if(this._selectedDate != value) {
            this._selectedDate = value;
            this._selectedDateChanging = true;
            var text = "";
            if(value) {
                text = value.localeFormat(this._format);

                // If we don't clear the time then we transfer the time from the
                // textbox to the selected value
                if(!this._clearTime) {
                    var tbvalue = this._textbox.get_Value();
                    if(tbvalue) {
                        tbvalue = this._parseTextValue(tbvalue);
                    }
                    if(tbvalue) {
                        if(value != tbvalue.getDateOnly()) {
                            // Transfer time from textbox to selected value
                            value.setHours(tbvalue.getHours());
                            value.setMinutes(tbvalue.getMinutes());
                            value.setSeconds(tbvalue.getSeconds());
                            value.setMilliseconds(tbvalue.getMilliseconds());

                            text = value.localeFormat(this._format);
                        }
                    }
                }

            }
            if(text != this._textbox.get_Value()) {
                this._textbox.set_Value(text);
                this._fireChanged();
            }
            this._selectedDateChanging = false;
            this.invalidate();
            this.raisePropertyChanged("selectedDate");
        }
    },

    get_defaultView: function() {
        // The default view of the calendar when it first pops up.
        return this._defaultView;
    },
    set_defaultView: function(value) {
        if(this._defaultView != value) {
            this._defaultView = value;
            this.raisePropertyChanged("defaultView");
        }
    },

    get_visibleDate: function() {
        return this._visibleDate;
    },
    set_visibleDate: function(value) {
        if(value && (String.isInstanceOfType(value)) && (value.length != 0)) {
            value = new Date(value);
        }

        if(this._visibleDate != value) {
            this._switchView(value, Sys.Extended.UI.CalendarSwitchViewMode.RangeZoom, !this._isOpen);
            this.raisePropertyChanged("visibleDate");
        }
    },

    get_isOpen: function() {
        return this._isOpen;
    },

    get_todaysDate: function() {
        if(this._todaysDate != null) {
            return this._todaysDate;
        }
        return new Date();
    },
    set_todaysDate: function(value) {
        if(this._todaysDate != value) {
            this._todaysDate = value;

            this.invalidate();
            this.raisePropertyChanged("todaysDate");
        }
    },

    get_firstDayOfWeek: function() {
        // The day of the week to appear as the first day in the calendar
        return this._firstDayOfWeek;
    },
    set_firstDayOfWeek: function(value) {
        if(this._firstDayOfWeek != value) {
            this._firstDayOfWeek = value;
            this.invalidate();
            this.raisePropertyChanged("firstDayOfWeek");
        }
    },

    get_cssClass: function() {
        return this._cssClass;
    },
    set_cssClass: function(value) {
        if(this._cssClass != value) {
            if(this._cssClass && this.get_isInitialized()) {
                Sys.UI.DomElement.removeCssClass(this._container, this._cssClass);
            }
            this._cssClass = value;
            if(this._cssClass && this.get_isInitialized()) {
                Sys.UI.DomElement.addCssClass(this._container, this._cssClass);
            }
            this.raisePropertyChanged("cssClass");
        }
    },

    get_todayButton: function() {
        return this._today;
    },

    /// <summary>
    /// Gets a day cell at the specified row or column	
    /// </summary>
    /// <getter>get_dayCell</getter>
    /// <member name="cP:AjaxControlToolkit.CalendarExtender.dayCell" />
    get_dayCell: function(row, col) {
        if(this._daysBody) {
            return this._daysBody.rows[row].cells[col].firstChild;
        }
        return null;
    },

    /// <summary>
    /// Fires when the calendar is being shown.
    /// </summary>
    /// <event add="add_showing" remove="remove_showing" raise="raise_showing" />
    /// <member name="cE:AjaxControlToolkit.CalendarExtender.showing" />
    add_showing: function(handler) {
        this.get_events().addHandler("showing", handler);
    },
    remove_showing: function(handler) {
        this.get_events().removeHandler("showing", handler);
    },
    raise_showing: function(eventArgs) {
        var handler = this.get_events().getHandler('showing');
        if(handler) {
            handler(this, eventArgs);
        }
    },
    raiseShowing: function(eventArgs) {
        Sys.Extended.Deprecated("raiseShowing(eventArgs)", "raise_showing(eventArgs)");
        this.raise_showing(eventArgs);
    },

    /// <summary>
    /// Fires after the calendar is shown.
    /// </summary>
    /// <event add="add_shown" remove="remove_shown" raise="raise_shown" />
    /// <member name="cE:AjaxControlToolkit.CalendarExtender.shown" />
    add_shown: function(handler) {
        this.get_events().addHandler("shown", handler);
    },
    remove_shown: function(handler) {
        this.get_events().removeHandler("shown", handler);
    },
    raise_shown: function() {
        var handlers = this.get_events().getHandler("shown");
        if(handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },
    raiseShown: function() {
        Sys.Extended.Deprecated("raiseShown", "raise_shown");
        this.raise_shown();
    },

    /// <summary>
    /// Fires when the calendar is being hidden.
    /// </summary>
    /// <event add="add_hiding" remove="remove_hiding" raise="raise_hiding" />
    /// <member name="cE:AjaxControlToolkit.CalendarExtender.hiding" />
    add_hiding: function(handler) {
        this.get_events().addHandler("hiding", handler);
    },
    remove_hiding: function(handler) {
        this.get_events().removeHandler("hiding", handler);
    },
    raise_hiding: function(eventArgs) {
        var handler = this.get_events().getHandler('hiding');
        if(handler) {
            handler(this, eventArgs);
        }
    },
    raiseHiding: function(eventArgs) {
        Sys.Extended.Deprecated("raiseHiding(eventArgs)", "raise_hiding(eventArgs)");
        this.raise_hiding(eventArgs);
    },

    /// <summary>
    /// Fires after the calendar is hidden.
    /// </summary>
    /// <event add="add_hidden" remove="remove_hidden" raise="raise_hidden" />
    /// <member name="cE:AjaxControlToolkit.CalendarExtender.hidden" />
    add_hidden: function(handler) {
        this.get_events().addHandler("hidden", handler);
    },
    remove_hidden: function(handler) {
        this.get_events().removeHandler("hidden", handler);
    },
    raise_hidden: function() {
        var handlers = this.get_events().getHandler("hidden");
        if(handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },
    raiseHidden: function() {
        Sys.Extended.Deprecated("raiseHidden", "raise_hidden");
        this.raise_hidden();
    },

    /// <summary>
    /// Fires when calendar date selection is changed.
    /// </summary>
    /// <event add="add_dateSelectionChanged" remove="remove_dateSelectionChanged" raise="raise_dateSelectionChanged" />
    /// <member name="cE:AjaxControlToolkit.CalendarExtender.dateSelectionChanged" /> 
    add_dateSelectionChanged: function(handler) {
        this.get_events().addHandler("dateSelectionChanged", handler);
    },
    remove_dateSelectionChanged: function(handler) {
        this.get_events().removeHandler("dateSelectionChanged", handler);
    },
    raise_dateSelectionChanged: function() {
        var handlers = this.get_events().getHandler("dateSelectionChanged");
        if(handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },
    raiseDateSelectionChanged: function() {
        Sys.Extended.Deprecated("raiseDateSelectionChanged", "raise_dateSelectionChanged");
        this.raise_dateSelectionChanged();
    },

    initialize: function() {
        Sys.Extended.UI.CalendarBehavior.callBaseMethod(this, "initialize");

        var elt = this.get_element();
        $addHandlers(elt, this._element$delegates);

        if(this._button) {
            $addHandlers(this._button, this._button$delegates);
        }

        this._modeChangeMoveTopOrLeftAnimation = new Sys.Extended.UI.Animation.LengthAnimation(null, null, null, "style", null, 0, 0, "px");
        this._modeChangeMoveBottomOrRightAnimation = new Sys.Extended.UI.Animation.LengthAnimation(null, null, null, "style", null, 0, 0, "px");
        this._modeChangeAnimation = new Sys.Extended.UI.Animation.ParallelAnimation(null, .25, null, [this._modeChangeMoveTopOrLeftAnimation, this._modeChangeMoveBottomOrRightAnimation]);

        var value = this.get_selectedDate();
        if(value) {
            this.set_selectedDate(value);
        }
    },
    dispose: function() {
        if(this._popupBehavior) {
            this._popupBehavior.dispose();
            this._popupBehavior = null;
        }
        this._modes = null;
        this._modeOrder = null;
        if(this._modeChangeMoveTopOrLeftAnimation) {
            this._modeChangeMoveTopOrLeftAnimation.dispose();
            this._modeChangeMoveTopOrLeftAnimation = null;
        }
        if(this._modeChangeMoveBottomOrRightAnimation) {
            this._modeChangeMoveBottomOrRightAnimation.dispose();
            this._modeChangeMoveBottomOrRightAnimation = null;
        }
        if(this._modeChangeAnimation) {
            this._modeChangeAnimation.dispose();
            this._modeChangeAnimation = null;
        }
        if(this._container) {
            if(this._container.parentNode) { // added this check before calling removeChild WI: 8486
                this._container.parentNode.removeChild(this._container);
            }
            this._container = null;
        }
        if(this._popupDiv) {
            $common.removeHandlers(this._popupDiv, this._popup$delegates);
            this._popupDiv = null;
        }
        if(this._prevArrow) {
            $common.removeHandlers(this._prevArrow, this._cell$delegates);
            this._prevArrow = null;
        }
        if(this._nextArrow) {
            $common.removeHandlers(this._nextArrow, this._cell$delegates);
            this._nextArrow = null;
        }
        if(this._title) {
            $common.removeHandlers(this._title, this._cell$delegates);
            this._title = null;
        }
        if(this._today) {
            $common.removeHandlers(this._today, this._cell$delegates);
            this._today = null;
        }
        if(this._button) {
            $common.removeHandlers(this._button, this._button$delegates);
            this._button = null;
        }
        if(this._daysBody) {
            for(var i = 0; i < this._daysBody.rows.length; i++) {
                var row = this._daysBody.rows[i];
                for(var j = 0; j < row.cells.length; j++) {
                    $common.removeHandlers(row.cells[j].firstChild, this._cell$delegates);
                }
            }
            this._daysBody = null;
        }
        if(this._monthsBody) {
            for(var i = 0; i < this._monthsBody.rows.length; i++) {
                var row = this._monthsBody.rows[i];
                for(var j = 0; j < row.cells.length; j++) {
                    $common.removeHandlers(row.cells[j].firstChild, this._cell$delegates);
                }
            }
            this._monthsBody = null;
        }
        if(this._yearsBody) {
            for(var i = 0; i < this._yearsBody.rows.length; i++) {
                var row = this._yearsBody.rows[i];
                for(var j = 0; j < row.cells.length; j++) {
                    $common.removeHandlers(row.cells[j].firstChild, this._cell$delegates);
                }
            }
            this._yearsBody = null;
        }
        var elt = this.get_element();
        $common.removeHandlers(elt, this._element$delegates);
        Sys.Extended.UI.CalendarBehavior.callBaseMethod(this, "dispose");
    },

    /// <summary>
    /// Shows the calendar.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.CalendarExtender.show" />
    show: function() {
        this._ensureCalendar();

        if(!this._isOpen) {

            var eventArgs = new Sys.CancelEventArgs();
            this.raise_showing(eventArgs);
            if(eventArgs.get_cancel()) {
                return;
            }

            this._isOpen = true;

            this._popupBehavior.show();

            if(this._firstPopUp) {
                this._switchView(null, Sys.Extended.UI.CalendarSwitchViewMode.RangeZoom, true);
                switch(this._defaultView) {
                    case Sys.Extended.UI.CalendarDefaultView.Months:
                        this._switchMode("months", true);
                        break;
                    case Sys.Extended.UI.CalendarDefaultView.Years:
                        this._switchMode("years", true);
                        break;
                }
                this._firstPopUp = false;
            }

            this.raise_shown();
        }
    },

    /// <summary>
    /// Hides the calendar.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.CalendarExtender.hide" />
    hide: function() {
        if(this._isOpen) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raise_hiding(eventArgs);
            if(eventArgs.get_cancel()) {
                return;
            }

            if(this._container) {
                this._popupBehavior.hide();
            }
            this._isOpen = false;
            this.raise_hidden();

            // make sure we clean up the flag due to issues with alert/alt-tab/etc
            this._popupMouseDown = false;
        }
    },

    /// <summary>
    /// Focuses the calendar.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.CalendarExtender.focus" />
    focus: function() {
        if(this._button) {
            this._button.focus();
        } else {
            this.get_element().focus();
        }
    },

    /// <summary>
    /// Blurs the calendar.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.CalendarExtender.blur" />
    blur: function(force) {
        if(!force && Sys.Browser.agent === Sys.Browser.Opera) {
            this._blur.post(true);
        } else {
            if(!this._popupMouseDown) {
                this.hide();
            }
            // make sure we clean up the flag due to issues with alert/alt-tab/etc
            this._popupMouseDown = false;
        }
    },

    suspendLayout: function() {
        // Suspends layout of the behavior while setting properties
        this._layoutSuspended++;
    },

    resumeLayout: function() {
        // Resumes layout of the behavior and performs any pending layout requests

        this._layoutSuspended--;
        if(this._layoutSuspended <= 0) {
            this._layoutSuspended = 0;
            if(this._layoutRequested) {
                this._performLayout();
            }
        }
    },
    
    invalidate: function() {
        // Performs layout of the behavior unless layout is suspended

        if(this._layoutSuspended > 0) {
            this._layoutRequested = true;
        } else {
            this._performLayout();
        }
    },

    _buildCalendar: function() {
        // Builds the calendar's layout

        var elt = this.get_element();
        var id = this.get_id();

        this._container = $common.createElementFromTemplate({
            nodeName: "div",
            properties: { id: id + "_container" },
            cssClasses: [this._cssClass],
            visible: false
        }, elt.parentNode);

        this._popupDiv = $common.createElementFromTemplate({
            nodeName: "div",
            events: this._popup$delegates,
            properties: {
                id: id + "_popupDiv"
            },
            cssClasses: ["ajax__calendar_container"]
        }, this._container);
    },
    _buildHeader: function() {
        var id = this.get_id();

        this._header = $common.createElementFromTemplate({
            nodeName: "div",
            properties: { id: id + "_header" },
            cssClasses: ["ajax__calendar_header"]
        }, this._popupDiv);

        var prevArrowWrapper = $common.createElementFromTemplate({ nodeName: "div" }, this._header);
        this._prevArrow = $common.createElementFromTemplate({
            nodeName: "div",
            properties: {
                id: id + "_prevArrow",
                mode: "prev"
            },
            events: this._cell$delegates,
            cssClasses: ["ajax__calendar_prev"]
        }, prevArrowWrapper);

        var nextArrowWrapper = $common.createElementFromTemplate({ nodeName: "div" }, this._header);
        this._nextArrow = $common.createElementFromTemplate({
            nodeName: "div",
            properties: {
                id: id + "_nextArrow",
                mode: "next"
            },
            events: this._cell$delegates,
            cssClasses: ["ajax__calendar_next"]
        }, nextArrowWrapper);

        var titleWrapper = $common.createElementFromTemplate({ nodeName: "div" }, this._header);

        this._title = $common.createElementFromTemplate({
            nodeName: "div",
            properties: {
                id: id + "_title",
                mode: "title"
            },
            events: this._cell$delegates,
            cssClasses: ["ajax__calendar_title"]
        }, titleWrapper);
    },
    _buildBody: function() {
        this._body = $common.createElementFromTemplate({
            nodeName: "div",
            properties: { id: this.get_id() + "_body" },
            cssClasses: ["ajax__calendar_body"]
        }, this._popupDiv);

        this._buildDays();
        this._buildMonths();
        this._buildYears();
    },
    _buildFooter: function() {
        var todayWrapper = $common.createElementFromTemplate({ nodeName: "div" }, this._popupDiv);
        this._today = $common.createElementFromTemplate({
            nodeName: "div",
            properties: {
                id: this.get_id() + "_today",
                mode: "today"
            },
            events: this._cell$delegates,
            cssClasses: ["ajax__calendar_footer", "ajax__calendar_today"]
        }, todayWrapper);
    },
    _buildDays: function() {
        // Builds a "days of the month" view for the calendar

        var dtf = Sys.CultureInfo.CurrentCulture.dateTimeFormat;
        var id = this.get_id();

        this._days = $common.createElementFromTemplate({
            nodeName: "div",
            properties: { id: id + "_days" },
            cssClasses: ["ajax__calendar_days"]
        }, this._body);
        this._modes["days"] = this._days;

        this._daysTable = $common.createElementFromTemplate({
            nodeName: "table",
            properties: {
                id: id + "_daysTable",
                style: { margin: "auto" }
            }
        }, this._days);

        this._daysTableHeader = $common.createElementFromTemplate({ nodeName: "thead", properties: { id: id + "_daysTableHeader" } }, this._daysTable);
        this._daysTableHeaderRow = $common.createElementFromTemplate({ nodeName: "tr", properties: { id: id + "_daysTableHeaderRow" } }, this._daysTableHeader);
        for(var i = 0; i < 7; i++) {
            var dayCell = $common.createElementFromTemplate({ nodeName: "td" }, this._daysTableHeaderRow);
            var dayDiv = $common.createElementFromTemplate({
                nodeName: "div",
                cssClasses: ["ajax__calendar_dayname"]
            }, dayCell);
        }

        this._daysBody = $common.createElementFromTemplate({ nodeName: "tbody", properties: { id: id + "_daysBody" } }, this._daysTable);
        for(var i = 0; i < 6; i++) {
            var daysRow = $common.createElementFromTemplate({ nodeName: "tr" }, this._daysBody);
            for(var j = 0; j < 7; j++) {
                var dayCell = $common.createElementFromTemplate({ nodeName: "td" }, daysRow);
                var dayDiv = $common.createElementFromTemplate({
                    nodeName: "div",
                    properties: {
                        mode: "day",
                        id: id + "_day_" + i + "_" + j,
                        innerHTML: "&nbsp;"
                    },
                    events: this._cell$delegates,
                    cssClasses: ["ajax__calendar_day"]
                }, dayCell);
            }
        }
    },
    _buildMonths: function() {
        // Builds a "months of the year" view for the calendar

        var dtf = Sys.CultureInfo.CurrentCulture.dateTimeFormat;
        var id = this.get_id();

        this._months = $common.createElementFromTemplate({
            nodeName: "div",
            properties: { id: id + "_months" },
            cssClasses: ["ajax__calendar_months"],
            visible: false
        }, this._body);
        this._modes["months"] = this._months;

        this._monthsTable = $common.createElementFromTemplate({
            nodeName: "table",
            properties: {
                id: id + "_monthsTable",
                style: { margin: "auto" }
            }
        }, this._months);

        this._monthsBody = $common.createElementFromTemplate({ nodeName: "tbody", properties: { id: id + "_monthsBody" } }, this._monthsTable);
        for(var i = 0; i < 3; i++) {
            var monthsRow = $common.createElementFromTemplate({ nodeName: "tr" }, this._monthsBody);
            for(var j = 0; j < 4; j++) {
                var monthCell = $common.createElementFromTemplate({ nodeName: "td" }, monthsRow);
                var monthDiv = $common.createElementFromTemplate({
                    nodeName: "div",
                    properties: {
                        id: id + "_month_" + i + "_" + j,
                        mode: "month",
                        month: (i * 4) + j,
                        innerHTML: "<br />" + dtf.AbbreviatedMonthNames[(i * 4) + j]
                    },
                    events: this._cell$delegates,
                    cssClasses: ["ajax__calendar_month"]
                }, monthCell);
            }
        }
    },
    _buildYears: function() {
        // Builds a "years in this decade" view for the calendar

        var id = this.get_id();

        this._years = $common.createElementFromTemplate({
            nodeName: "div",
            properties: { id: id + "_years" },
            cssClasses: ["ajax__calendar_years"],
            visible: false
        }, this._body);
        this._modes["years"] = this._years;

        this._yearsTable = $common.createElementFromTemplate({
            nodeName: "table",
            properties: {
                id: id + "_yearsTable",
                style: { margin: "auto" }
            }
        }, this._years);

        this._yearsBody = $common.createElementFromTemplate({ nodeName: "tbody", properties: { id: id + "_yearsBody" } }, this._yearsTable);
        for(var i = 0; i < 3; i++) {
            var yearsRow = $common.createElementFromTemplate({ nodeName: "tr" }, this._yearsBody);
            for(var j = 0; j < 4; j++) {
                var yearCell = $common.createElementFromTemplate({ nodeName: "td" }, yearsRow);
                var yearDiv = $common.createElementFromTemplate({
                    nodeName: "div",
                    properties: {
                        id: id + "_year_" + i + "_" + j,
                        mode: "year",
                        year: ((i * 4) + j) - 1
                    },
                    events: this._cell$delegates,
                    cssClasses: ["ajax__calendar_year"]
                }, yearCell);
            }
        }
    },

    _isInDateRange: function(date, part, switchMode) {
        switch(part) {
            case "d":
                if((this._startDate) && (this._getDateOnly(date) < this._getDateOnly(this._startDate))) { return false; }
                if((this._endDate) && (this._getDateOnly(date) > this._getDateOnly(this._endDate))) { return false; }
                break;
            case "M":
                if((this._startDate) && (this._getMonthOnly(date) < this._getMonthOnly(this._startDate))) { return false; }
                if((this._endDate) && (this._getMonthOnly(date) > this._getMonthOnly(this._endDate))) { return false; }
                break;
            case "y":
                if((this._startDate) && (date.getFullYear() < this._startDate.getFullYear())) { return false; }
                if((this._endDate) && (date.getFullYear() > this._endDate.getFullYear())) { return false; }
                break;
            case "yy":
                if(this._startDate && this._endDate) {
                    return this._isInYearsDateRange(date, switchMode);
                } else {
                    if(!this._startDate && !this._endDate)
                        return true;

                    var startYear = this._getRangeStartYear(date);
                    if(this._endDate && startYear < this._endDate.getFullYear())
                        return true;

                    var endYear = this._getRangeEndYear(date);
                    if (this._startDate && endYear > this._startDate.getFullYear())
                        return true;

                    return false;
                }
        }
        return true;
    },

    _isInYearsDateRange: function(date, switchMode) {
        var startYear = this._getRangeStartYear(date);
        var endYear = this._getRangeEndYear(date);

        switch(switchMode) {
            case Sys.Extended.UI.CalendarSwitchViewMode.PreviousRange:
                if(endYear > this._startDate.getFullYear())
                    return true;

                return false;

            case Sys.Extended.UI.CalendarSwitchViewMode.NextRange:
                if(startYear < this._endDate.getFullYear())
                    return true;

                return false;

            case Sys.Extended.UI.CalendarSwitchViewMode.RangeZoom:
                if(startYear > this._startDate.getFullYear()
                   &&
                   endYear < this._endDate.getFullYear())
                    return true;

                return false;
            default:
                throw Error.invalidOperation();
        }
    },
    
    _getRangeStartYear: function(date) {
        return date.getFullYear();
    },

    _getRangeEndYear: function(date) {
        return date.getFullYear() + 9;
    },

    _getDateOnly: function(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },

    _getMonthOnly: function(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    _performLayout: function() {
        // Updates the various views of the calendar to match the current selected and visible dates

        var elt = this.get_element();
        if(!elt) return;
        if(!this.get_isInitialized()) return;
        if(!this._isOpen) return;

        var dtf = Sys.CultureInfo.CurrentCulture.dateTimeFormat;
        var selectedDate = this.get_selectedDate();
        var visibleDate = this._getEffectiveVisibleDate();
        var todaysDate = this.get_todaysDate();
        switch(this._mode) {
            case "days":

                var firstDayOfWeek = this._getFirstDayOfWeek();
                var daysToBacktrack = visibleDate.getDay() - firstDayOfWeek;
                if(daysToBacktrack <= 0)
                    daysToBacktrack += 7;

                var startDate = new Date(visibleDate);
                startDate.setDate(startDate.getDate() - daysToBacktrack);
                var currentDate = new Date(startDate);

                for(var i = 0; i < 7; i++) {
                    var dayCell = this._daysTableHeaderRow.cells[i].firstChild;
                    if(dayCell.firstChild) {
                        dayCell.removeChild(dayCell.firstChild);
                    }
                    dayCell.appendChild(document.createTextNode(dtf.ShortestDayNames[(i + firstDayOfWeek) % 7]));
                }
                for(var week = 0; week < 6; week++) {
                    var weekRow = this._daysBody.rows[week];
                    for(var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                        var dayCell = weekRow.cells[dayOfWeek].firstChild;
                        if(dayCell.firstChild) {
                            dayCell.removeChild(dayCell.firstChild);
                        }
                        dayCell.appendChild(document.createTextNode(currentDate.getDate()));
                        dayCell.title = currentDate.localeFormat("D");
                        dayCell.date = currentDate;
                        $common.removeCssClasses(dayCell.parentNode, ["ajax__calendar_other", "ajax__calendar_active", "ajax__calendar_today"]);

                        if(!this._isInDateRange(currentDate, "d")) {
                            $common.removeCssClasses(dayCell.parentNode, ["ajax__calendar_other", "ajax__calendar_active"]);
                            Sys.UI.DomElement.addCssClass(dayCell.parentNode, "ajax__calendar_invalid");
                        } else {
                            $common.removeCssClasses(dayCell.parentNode, ["ajax__calendar_invalid", "ajax__calendar_other", "ajax__calendar_active", ""]);
                            Sys.UI.DomElement.addCssClass(dayCell.parentNode, this._getCssClass(dayCell.date, 'd'));
                        }

                        currentDate = new Date(currentDate);
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }

                this._prevArrow.date = new Date(visibleDate.getFullYear(), visibleDate.getMonth() - 1, 1);
                this._nextArrow.date = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1);
                if(this._title.firstChild) {
                    this._title.removeChild(this._title.firstChild);
                }

                this._title.appendChild(document.createTextNode(visibleDate.localeFormat(this.get_daysModeTitleFormat())));
                this._title.date = visibleDate;

                break;
            case "months":
                for(var i = 0; i < this._monthsBody.rows.length; i++) {
                    var row = this._monthsBody.rows[i];
                    for(var j = 0; j < row.cells.length; j++) {
                        var cell = row.cells[j].firstChild;
                        cell.date = new Date(visibleDate.getFullYear(), cell.month, 1);
                        cell.title = cell.date.localeFormat("Y");

                        if(!this._isInDateRange(cell.date, "M")) {
                            $common.removeCssClasses(cell.parentNode, ["ajax__calendar_other", "ajax__calendar_active"]);
                            Sys.UI.DomElement.addCssClass(cell.parentNode, "ajax__calendar_invalid");
                        }
                        else {

                            $common.removeCssClasses(cell.parentNode, ["ajax__calendar_invalid", "ajax__calendar_other", "ajax__calendar_active"]);
                            Sys.UI.DomElement.addCssClass(cell.parentNode, this._getCssClass(cell.date, 'M'));
                        }
                    }
                }

                if(this._title.firstChild) {
                    this._title.removeChild(this._title.firstChild);
                }

                this._title.appendChild(document.createTextNode(visibleDate.localeFormat("yyyy")));
                this._title.date = visibleDate;
                this._prevArrow.date = new Date(visibleDate.getFullYear() - 1, 0, 1);
                this._nextArrow.date = new Date(visibleDate.getFullYear() + 1, 0, 1);

                break;
            case "years":

                var minYear = (Math.floor(visibleDate.getFullYear() / 10) * 10);
                for(var i = 0; i < this._yearsBody.rows.length; i++) {
                    var row = this._yearsBody.rows[i];
                    for(var j = 0; j < row.cells.length; j++) {
                        var cell = row.cells[j].firstChild;
                        cell.date = new Date(minYear + cell.year, 0, 1);
                        if(cell.firstChild) {
                            cell.removeChild(cell.lastChild);
                        } else {
                            cell.appendChild(document.createElement("br"));
                        }
                        cell.appendChild(document.createTextNode(minYear + cell.year));

                        if(!this._isInDateRange(cell.date, "y")) {
                            $common.removeCssClasses(cell.parentNode, ["ajax__calendar_other", "ajax__calendar_active"]);
                            Sys.UI.DomElement.addCssClass(cell.parentNode, "ajax__calendar_invalid");
                        }
                        else {
                            $common.removeCssClasses(cell.parentNode, ["ajax__calendar_invalid", "ajax__calendar_other", "ajax__calendar_active"]);
                            Sys.UI.DomElement.addCssClass(cell.parentNode, this._getCssClass(cell.date, 'y'));
                        }
                    }
                }

                if(this._title.firstChild) {
                    this._title.removeChild(this._title.firstChild);
                }

                this._title.appendChild(document.createTextNode(minYear.toString() + "-" + (minYear + 9).toString()));
                this._title.date = visibleDate;
                this._prevArrow.date = new Date(minYear - 10, 0, 1);
                this._nextArrow.date = new Date(minYear + 10, 0, 1);

                break;
        }
        if(this._today.firstChild) {
            this._today.removeChild(this._today.firstChild);
        }

        $common.removeCssClasses(this._today.parentNode, ["ajax__calendar_invalid"]);
        this._today.appendChild(document.createTextNode(String.format(Sys.Extended.UI.Resources.Calendar_Today, todaysDate.localeFormat(this.get_todaysDateFormat()))));
        if(!this._isInDateRange(todaysDate, "d")) {
            Sys.UI.DomElement.addCssClass(this._today.parentNode, "ajax__calendar_invalid");
        }

        this._today.date = todaysDate;
    },

    _ensureCalendar: function() {

        if(!this._container) {

            var elt = this.get_element();

            this._buildCalendar();
            this._buildHeader();
            this._buildBody();
            this._buildFooter();

            this._popupBehavior = new $create(Sys.Extended.UI.PopupBehavior, { parentElement: elt }, {}, {}, this._container);
            if(this._popupPosition == Sys.Extended.UI.CalendarPosition.TopLeft) {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.TopLeft);
            } else if(this._popupPosition == Sys.Extended.UI.CalendarPosition.TopRight) {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.TopRight);
            } else if(this._popupPosition == Sys.Extended.UI.CalendarPosition.BottomRight) {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.BottomRight);
            } else if(this._popupPosition == Sys.Extended.UI.CalendarPosition.Right) {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.Right);
            } else if(this._popupPosition == Sys.Extended.UI.CalendarPosition.Left) {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.Left);
            } else {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.BottomLeft);
            }
        }
    },

    _fireChanged: function() {
        // Attempts to fire the change event on the attached textbox

        var elt = this.get_element();
        if(document.createEventObject) {
            elt.fireEvent("onchange");
        } else if(document.createEvent) {
            var e = document.createEvent("HTMLEvents");
            e.initEvent("change", true, true);
            elt.dispatchEvent(e);
        }
    },
    _switchView: function(date, switchMode, dontAnimate) {
        // Switches the visible month in the days view
        // param name "date" of type "Date" is the visible date to switch to
        // param name "dontAnimate" of type "Boolean" prevents animation from occuring if the control is animated

        // Check _isAnimating to make sure we don't animate horizontally and vertically at the same time
        if(this._isAnimating) {
            return;
        }

        // Check if can switch month depending on the startDate and endDAte
        if(date && !this._canSwitchMonth(date, switchMode)) {
            return;
        }

        var visibleDate = this._getEffectiveVisibleDate();
        if((date && date.getFullYear() == visibleDate.getFullYear() && date.getMonth() == visibleDate.getMonth())) {
            dontAnimate = true;
        }

        if(this._animated && !dontAnimate) {
            this._animateViewSwitch(date, visibleDate);
        } else {
            this._visibleDate = date;
            this.invalidate();
        }
    },

    _animateViewSwitch: function(date, visibleDate) {
        this._isAnimating = true;

        var newElement = this._modes[this._mode];
        var oldElement = newElement.cloneNode(true);
        this._body.appendChild(oldElement);
        if(visibleDate > date) {

            // animating down
            // the newIndex element is the top
            // the oldIndex element is the bottom (visible)

            // move in, fade in
            $common.setLocation(newElement, { x: -162, y: 0 });
            $common.setVisible(newElement, true);
            this._modeChangeMoveTopOrLeftAnimation.set_propertyKey("left");
            this._modeChangeMoveTopOrLeftAnimation.set_target(newElement);
            this._modeChangeMoveTopOrLeftAnimation.set_startValue(-this._width);
            this._modeChangeMoveTopOrLeftAnimation.set_endValue(0);

            // move out, fade out
            $common.setLocation(oldElement, { x: 0, y: 0 });
            $common.setVisible(oldElement, true);
            this._modeChangeMoveBottomOrRightAnimation.set_propertyKey("left");
            this._modeChangeMoveBottomOrRightAnimation.set_target(oldElement);
            this._modeChangeMoveBottomOrRightAnimation.set_startValue(0);
            this._modeChangeMoveBottomOrRightAnimation.set_endValue(this._width);

        } else {
            // animating up
            // the oldIndex element is the top (visible)
            // the newIndex element is the bottom

            // move out, fade out
            $common.setLocation(oldElement, { x: 0, y: 0 });
            $common.setVisible(oldElement, true);
            this._modeChangeMoveTopOrLeftAnimation.set_propertyKey("left");
            this._modeChangeMoveTopOrLeftAnimation.set_target(oldElement);
            this._modeChangeMoveTopOrLeftAnimation.set_endValue(-this._width);
            this._modeChangeMoveTopOrLeftAnimation.set_startValue(0);

            // move in, fade in
            $common.setLocation(newElement, { x: 162, y: 0 });
            $common.setVisible(newElement, true);
            this._modeChangeMoveBottomOrRightAnimation.set_propertyKey("left");
            this._modeChangeMoveBottomOrRightAnimation.set_target(newElement);
            this._modeChangeMoveBottomOrRightAnimation.set_endValue(0);
            this._modeChangeMoveBottomOrRightAnimation.set_startValue(this._width);
        }
        this._visibleDate = date;
        this.invalidate();

        var endHandler = Function.createDelegate(this, function() {
            this._body.removeChild(oldElement);
            oldElement = null;
            this._isAnimating = false;
            this._modeChangeAnimation.remove_ended(endHandler);
        });
        this._modeChangeAnimation.add_ended(endHandler);
        this._modeChangeAnimation.play();
    },

    _canSwitchMonth: function(date, switchMode) {
        switch(this._mode) {
            case "days":
                if(!this._isInDateRange(date, "M", switchMode)) {
                    return false;
                }
                break;
            case "months":
                if(!this._isInDateRange(date, "y", switchMode)) {
                    return false;
                }
                break;
            case "years":
                if(!this._isInDateRange(date, "yy", switchMode)) {
                    return false;
                }
                break;
        }
        return true;
    },    
    
    _switchMode: function(mode, dontAnimate) {
        // Switches the visible view from "days" to "months" to "years"
        // param name "mode" of type "String" is the view mode to switch to
        // param name "dontAnimate" of type "Boolean" prevents animation from occuring if the control is animated

        // Check _isAnimating to make sure we don't animate horizontally and vertically at the same time
        if(this._isAnimating || (this._mode == mode)) {
            return;
        }

        var moveDown = this._modeOrder[this._mode] < this._modeOrder[mode];
        var oldElement = this._modes[this._mode];
        var newElement = this._modes[mode];
        this._mode = mode;

        if(this._animated && !dontAnimate) {
            this._isAnimating = true;

            this.invalidate();

            if(moveDown) {
                // animating down
                // the newIndex element is the top
                // the oldIndex element is the bottom (visible)

                // move in, fade in
                $common.setLocation(newElement, { x: 0, y: -this._height });
                $common.setVisible(newElement, true);
                this._modeChangeMoveTopOrLeftAnimation.set_propertyKey("top");
                this._modeChangeMoveTopOrLeftAnimation.set_target(newElement);
                this._modeChangeMoveTopOrLeftAnimation.set_startValue(-this._height);
                this._modeChangeMoveTopOrLeftAnimation.set_endValue(0);

                // move out, fade out
                $common.setLocation(oldElement, { x: 0, y: 0 });
                $common.setVisible(oldElement, true);

                this._modeChangeMoveBottomOrRightAnimation.set_propertyKey("top");
                this._modeChangeMoveBottomOrRightAnimation.set_target(oldElement);
                this._modeChangeMoveBottomOrRightAnimation.set_startValue(0);
                this._modeChangeMoveBottomOrRightAnimation.set_endValue(this._height);

            } else {
                // animating up
                // the oldIndex element is the top (visible)
                // the newIndex element is the bottom

                // move out, fade out
                $common.setLocation(oldElement, { x: 0, y: 0 });
                $common.setVisible(oldElement, true);
                this._modeChangeMoveTopOrLeftAnimation.set_propertyKey("top");
                this._modeChangeMoveTopOrLeftAnimation.set_target(oldElement);
                this._modeChangeMoveTopOrLeftAnimation.set_endValue(-this._height);
                this._modeChangeMoveTopOrLeftAnimation.set_startValue(0);

                // move in, fade in
                $common.setLocation(newElement, { x: 0, y: 139 });
                $common.setVisible(newElement, true);
                this._modeChangeMoveBottomOrRightAnimation.set_propertyKey("top");
                this._modeChangeMoveBottomOrRightAnimation.set_target(newElement);
                this._modeChangeMoveBottomOrRightAnimation.set_endValue(0);
                this._modeChangeMoveBottomOrRightAnimation.set_startValue(this._height);
            }
            var endHandler = Function.createDelegate(this, function() {
                this._isAnimating = false;
                this._modeChangeAnimation.remove_ended(endHandler);
            });
            this._modeChangeAnimation.add_ended(endHandler);
            this._modeChangeAnimation.play();
        } else {
            this._mode = mode;
            $common.setVisible(oldElement, false);
            this.invalidate();
            $common.setVisible(newElement, true);
            $common.setLocation(newElement, { x: 0, y: 0 });
        }
    },
    _isSelected: function(date, part) {
        // Gets whether the supplied date is the currently selected date
        // "date" - the date to match
        // "part" - the most significant part of the date to test

        var value = this.get_selectedDate();
        if(!value) return false;
        switch(part) {
            case 'd':
                if(date.getDate() != value.getDate()) return false;
                // goto case 'M';
            case 'M':
                if(date.getMonth() != value.getMonth()) return false;
                // goto case 'y';
            case 'y':
                if(date.getFullYear() != value.getFullYear()) return false;
                break;
        }
        return true;
    },

    _isOther: function(date, part) {
        // Gets whether the supplied date is in a different view from the current visible month
        // "date" - the date to match
        // "part" - the most significant part of the date to test

        var value = this._getEffectiveVisibleDate();
        switch(part) {
            case 'd':
                return (date.getFullYear() != value.getFullYear() || date.getMonth() != value.getMonth());
            case 'M':
                return false;
            case 'y':
                var minYear = (Math.floor(value.getFullYear() / 10) * 10);
                return date.getFullYear() < minYear || (minYear + 10) <= date.getFullYear();
        }
        return false;
    },

    _isTodaysDate: function(date) {
        return this._getDateOnly(this.get_todaysDate()).valueOf() === this._getDateOnly(date).valueOf();
    },

    _getCssClass: function(date, part) {
        // Gets the cssClass to apply to a cell based on a supplied date
        // "date" - is the date to match
        // "part" - the most significant part of the date to test

        if(this._isSelected(date, part)) {
            return "ajax__calendar_active";
        } else if(this._isOther(date, part)) {
            return "ajax__calendar_other";
            // Highlight today's date
        } else if(this._isTodaysDate(date)) {
            return "ajax__calendar_today";
        } else {
            return "";
        }
    },
    _getEffectiveVisibleDate: function() {
        var value = this.get_visibleDate();
        if(value == null)
            value = this.get_selectedDate();
        if(value == null)
            value = this.get_todaysDate();

        if (this._endDate && value > this._endDate)
            value = this._endDate;
        else if (this._startDate && value < this._startDate)
            value = this._startDate;

        value = new Date(value);
        value.setDate(1);

        return this._getDateOnly(value);
    },
    getMonthStartDate: function(date)
    {
        var value = new Date(date);
        value.setDate(1);

        return this._getDateOnly(value);
    },

    _getFirstDayOfWeek: function() {
        // Gets the first day of the week

        if(this.get_firstDayOfWeek() != Sys.Extended.UI.FirstDayOfWeek.Default) {
            return this.get_firstDayOfWeek();
        }
        return Sys.CultureInfo.CurrentCulture.dateTimeFormat.FirstDayOfWeek;
    },
    _parseTextValue: function(text) {
        // Converts a text value from the textbox into a date

        var value = null;
        if(text) {
            value = Date.parseLocale(text, this.get_format());
            if(value && value.getFullYear() < 100)
                value.setYear(value.getFullYear());
        }
        if(isNaN(value)) {
            value = null;
        }
        return value;
    },

    _element_onfocus: function(e) {
        // Handles the focus event of the element
        if(!this._enabled) return;
        if(!this._button) {
            this.show();
            // make sure we clean up the flag due to issues with alert/alt-tab/etc
            this._popupMouseDown = false;
        }
    },
    _element_onblur: function(e) {
        // Handles the blur event of the element
        if(!this._enabled) return;
        if(!this._button) {
            this.blur();
        }
    },
    _element_onchange: function(e) {
        // Handles the change event of the element
        if(!this._selectedDateChanging) {
            var value = this._parseTextValue(this._textbox.get_Value());
            this._selectedDate = value;
            if(this._isOpen) {
                this._switchView(this._selectedDate, Sys.Extended.UI.CalendarSwitchViewMode.RangeZoom, this._selectedDate == null);
            }
        }
    },
    _element_onkeypress: function(e) {
        // Handles the keypress event of the element
        if(!this._enabled) return;
        if(!this._button && e.charCode == Sys.UI.Key.esc) {
            e.stopPropagation();
            e.preventDefault();
            this.hide();
        }
    },
    _element_onclick: function(e) {
        // Handles the click event of the element
        if(!this._enabled) return;
        if(!this._button) {
            this.show();
            // make sure we clean up the flag due to issues with alert/alt-tab/etc
            this._popupMouseDown = false;
        }
    },

    _popup_onevent: function(e) {
        // Handles the drag-start event of the popup calendar
        e.stopPropagation();
        e.preventDefault();
    },
    _popup_onmousedown: function(e) {
        // Handles the mousedown event of the popup

        // signal that the popup has received a mousedown event, this handles
        // onblur issues on browsers like FF, OP, and SF
        this._popupMouseDown = true;
    },
    _popup_onmouseup: function(e) {
        // Handles the mouseup event of the popup

        // signal that the popup has received a mouseup event, this handles
        // onblur issues on browsers like FF, OP, and SF
        if(Sys.Browser.agent === Sys.Browser.Opera && this._blur.get_isPending()) {
            this._blur.cancel();
        }
        this._popupMouseDown = false;
        this.focus();
    },

    _cell_onmouseover: function(e) {
        // Handles the mouseover event of a cell

        e.stopPropagation();

        if(Sys.Browser.agent === Sys.Browser.Safari) {
            // Safari doesn't reliably call _cell_onmouseout, so clear other cells here to keep the UI correct
            for(var i = 0; i < this._daysBody.rows.length; i++) {
                var row = this._daysBody.rows[i];
                for(var j = 0; j < row.cells.length; j++) {
                    Sys.UI.DomElement.removeCssClass(row.cells[j].firstChild.parentNode, "ajax__calendar_hover");
                }
            }
        }

        var target = e.target;

        Sys.UI.DomElement.addCssClass(target.parentNode, "ajax__calendar_hover");
    },
    _cell_onmouseout: function(e) {
        // Handles the mouseout event of a cell

        e.stopPropagation();

        var target = e.target;

        Sys.UI.DomElement.removeCssClass(target.parentNode, "ajax__calendar_hover");
    },
    _cell_onclick: function(e) {
        // Handles the click event of a cell

        e.stopPropagation();
        e.preventDefault();

        if(!this._enabled) return;

        var target = e.target;
        if(target.parentNode.className.indexOf("ajax__calendar_invalid") != -1) {
            return;
        }
        var visibleDate = this._getEffectiveVisibleDate();
        Sys.UI.DomElement.removeCssClass(target.parentNode, "ajax__calendar_hover");
        switch(target.mode) {
            case "prev":
                this._switchView(target.date, Sys.Extended.UI.CalendarSwitchViewMode.PreviousRange);
                break;
            case "next":
                this._switchView(target.date, Sys.Extended.UI.CalendarSwitchViewMode.NextRange);
                break;
            case "title":
                switch(this._mode) {
                    case "days": this._switchMode("months"); break;
                    case "months": this._switchMode("years"); break;
                }
                break;
            case "month":
                if(target.month == visibleDate.getMonth()) {
                    this._switchMode("days");
                } else {
                    this._visibleDate = target.date;
                    this._switchMode("days");
                }
                break;
            case "year":
                if(target.date.getFullYear() == visibleDate.getFullYear()) {
                    this._switchMode("months");
                } else {
                    this._visibleDate = target.date;
                    this._switchMode("months");
                }
                break;
            case "day":
                this.set_selectedDate(target.date);
                this._switchView(target.date, Sys.Extended.UI.CalendarSwitchViewMode.RangeZoom);
                this._blur.post(true);
                this.raise_dateSelectionChanged();
                break;
            case "today":
                this.set_selectedDate(target.date);
                this._switchView(target.date, Sys.Extended.UI.CalendarSwitchViewMode.RangeZoom);
                this._blur.post(true);
                this.raise_dateSelectionChanged();
                break;
        }
    },

    _button_onclick: function(e) {
        // Handles the click event of the asociated button
        e.preventDefault();
        e.stopPropagation();

        if(!this._enabled) return;
        // if event was rised not by mouse click 
        if(e.clientX == 0) return;

        if(!this._isOpen) {
            this.show();
        } else {
            this.hide();
        }
        this.focus();
        // make sure we clean up the flag due to issues with alert/alt-tab/etc
        this._popupMouseDown = false;
        // set to the date currently in the text box
        if(this._visibleDate != this._selectedDate) {
            this._visibleDate = this._selectedDate
            this.invalidate();
        }
    },
    _button_onblur: function(e) {
        // Handles the blur event of the button
        if(!this._enabled) return;
        if(!this._popupMouseDown) {
            this.hide();
        }
        // make sure we clean up the flag due to issues with alert/alt-tab/etc
        this._popupMouseDown = false;
    },
    _button_onkeypress: function(e) {
        // Handles the keypress event of the element
        if(!this._enabled) return;
        if(e.charCode == Sys.UI.Key.esc) {
            e.stopPropagation();
            e.preventDefault();
            this.hide();
        }
        // make sure we clean up the flag due to issues with alert/alt-tab/etc
        this._popupMouseDown = false;
    },
    _parseDateSortableFormat: function (dateString) {
        var dateParts = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.?(\d{0,7})?/.exec(dateString);

        return new Date(
            dateParts[1],
            dateParts[2] - 1,
            dateParts[3],
            dateParts[4],
            dateParts[5],
            dateParts[6]);
    }
}
Sys.Extended.UI.CalendarBehavior.registerClass("Sys.Extended.UI.CalendarBehavior", Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.CalendarPosition = {
    BottomLeft: 0,
    BottomRight: 1,
    TopLeft: 2,
    TopRight: 3,
    Right: 4,
    Left: 5
};

Sys.Extended.UI.CalendarDefaultView = {
    Days: 0,
    Months: 1,
    Years: 2
};

Sys.Extended.UI.CalendarSwitchViewMode = {
    PreviousRange: 0,
    NextRange: 1,
    RangeZoom: 2
};