Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ComboBoxAutoCompleteMode = function () { };
Sys.Extended.UI.ComboBoxAutoCompleteMode.prototype =
{
    None: 0,
    Append: 1,
    Suggest: 2,
    SuggestAppend: 3
};
Sys.Extended.UI.ComboBoxAutoCompleteMode.registerEnum(
    'Sys.Extended.UI.ComboBoxAutoCompleteMode', false);

Sys.Extended.UI.ComboBoxStyle = function () { };
Sys.Extended.UI.ComboBoxStyle.prototype =
{
    DropDownList: 0,
    DropDown: 1,
    Simple: 2
};
Sys.Extended.UI.ComboBoxStyle.registerEnum(
    'Sys.Extended.UI.ComboBoxStyle', false);

Sys.Extended.UI.ComboBoxTextSelectionStrategy = function () { };
Sys.Extended.UI.ComboBoxTextSelectionStrategy.prototype =
{
    Unknown: 0,
    Microsoft: 1,
    W3C: 2
};
Sys.Extended.UI.ComboBoxTextSelectionStrategy.registerEnum(
    "Sys.Extended.UI.ComboBoxTextSelectionStrategy", false);


Sys.Extended.UI.ComboBox = function (element) {

    Sys.Extended.UI.ComboBox.initializeBase(this, [element]);

    this._comboTableControl = null;
    this._textBoxControl = null;
    this._optionListControl = null;
    this._buttonControl = null;
    this._hiddenFieldControl = null;
    this._autoPostBack = false;
    this._autoCompleteMode = null;
    this._dropDownStyle = null;
    this._caseSensitive = false;
    this._originalSelectedIndex = null;
    this._listItemHoverCssClass = null;

    this._popupBehavior = null;
    this._supressFocusHide = true;
    this._doingPostBack = false;
    this._textSelectionStrategy = null;
    this._highlightSuggestedItem = false;
    this._highlightedIndex = null;

    this._optionListItems = null;
    this._optionListItemHeight = null;
    this._optionListHeight = null;
    this._optionListWidth = null;

    this.clearDelegates();

};
Sys.Extended.UI.ComboBox.prototype = {

    initialize: function () {

        Sys.Extended.UI.ComboBox.callBaseMethod(this, 'initialize');
        ComboBox_Elements[ComboBox_Elements.length] = this;
        var hiddenParent = this._findHiddenParent(this.get_comboTableControl());
        var hiddenParentDisplay;
        var hiddenParentVisibility;
        if (hiddenParent != null) {
            hiddenParentDisplay = hiddenParent.style.display;
            hiddenParentVisibility = hiddenParent.style.visibility;
            hiddenParent.style.visibility = "visible";
            hiddenParent.style.display = "block";
        }
        this.createDelegates();
        this.initializeTextBox();
        this.initializeButton();
        this.initializeOptionList();
        this.addHandlers();
        if (hiddenParent != null) {
            hiddenParent.style.visibility = hiddenParentVisibility;
            hiddenParent.style.display = hiddenParentDisplay;
        }
    },
    dispose: function () {

        // dispose of popup extender
        if (this._popupBehavior) {
            this._popupBehavior.remove_showing(this._popupShowingHandler);
            this._popupBehavior.remove_shown(this._popupShownHandler);
            this._popupBehavior.remove_hiding(this._popupHidingHandler);
            this._popupBehavior.dispose();
            this._popupBehavior = null;
        }

        this.clearHandlers();
        this.clearDelegates();

        Sys.Extended.UI.ComboBox.callBaseMethod(this, 'dispose');

    },

    _findHiddenParent: function (element) {
        var parent = element.parentElement;
        if (parent == null || parent.style.visibility == "hidden" || parent.style.display == 'none') {
            return parent;
        }

        return this._findHiddenParent(parent);
    },

    createDelegates: function () {

        this._listMouseOverHandler = Function.createDelegate(this, this._onListMouseOver);
        this._listMouseOutHandler = Function.createDelegate(this, this._onListMouseOut);
        this._listMouseDownHandler = Function.createDelegate(this, this._onListMouseDown);
        this._listClickHandler = Function.createDelegate(this, this._onListClick);
        this._listDragHandler = Function.createDelegate(this, this._onListDrag);
        this._listSelectStartHandler = Function.createDelegate(this, this._onListSelectStart);
        this._listMouseWheelHandler = Function.createDelegate(this, this._onListMouseWheel);
        this._textBoxClickHandler = Function.createDelegate(this, this._onTextBoxClick);
        this._textBoxFocusHandler = Function.createDelegate(this, this._onTextBoxFocus);
        this._textBoxBlurHandler = Function.createDelegate(this, this._onTextBoxBlur);
        this._textBoxKeyPressHandler = Function.createDelegate(this, this._onTextBoxKeyPress);
        this._textBoxKeyDownHandler = Function.createDelegate(this, this._onTextBoxKeyDown);
        this._buttonClickHandler = Function.createDelegate(this, this._onButtonClick);
        this._buttonBlurHandler = Function.createDelegate(this, this._onButtonBlur);
        this._buttonKeyDownHandler = Function.createDelegate(this, this._onButtonKeyDown);
        this._buttonKeyPressHandler = Function.createDelegate(this, this._onButtonKeyPress);
        this._documentClickHandler = Function.createDelegate(this, this._onDocumentClick);
        this._documentMouseWheelHandler = Function.createDelegate(this, this._onDocumentMouseWheel);
        this._popupShowingHandler = Function.createDelegate(this, this._popupShowing);
        this._popupShownHandler = Function.createDelegate(this, this._popupShown);
        this._popupHidingHandler = Function.createDelegate(this, this._popupHiding);

    },
    clearDelegates: function () {

        this._listMouseOverHandler = null;
        this._listMouseOutHandler = null;
        this._listMouseDownHandler = null;
        this._listClickHandler = null;
        this._listDragHandler = null;
        this._listSelectStartHandler = null;
        this._listMouseWheelHandler = null;
        this._textBoxClickHandler = null;
        this._textBoxFocusHandler = null;
        this._textBoxBlurHandler = null;
        this._textBoxKeyPressHandler = null;
        this._textBoxKeyDownHandler = null;
        this._buttonClickHandler = null;
        this._buttonBlurHandler = null;
        this._buttonKeyDownHandler = null;
        this._buttonKeyPressHandler = null;
        this._documentClickHandler = null;
        this._documentMouseWheelHandler = null;
        this._popupShowingHandler = null;
        this._popupShownHandler = null;
        this._popupHidingHandler = null;

    },
    addHandlers: function () {

        var optionListControl = this.get_optionListControl();

        $addHandlers(optionListControl,
        {
            'mouseover': this._listMouseOverHandler,
            'mouseout': this._listMouseOutHandler,
            'mousedown': this._listMouseDownHandler,
            'click': this._listClickHandler,
            'drag': this._listDragHandler,
            'selectstart': this._listSelectStartHandler
        }, this);

        $addHandlers(this.get_textBoxControl(),
        {
            "click": this._textBoxClickHandler,
            "focus": this._textBoxFocusHandler,
            "blur": this._textBoxBlurHandler,
            "keypress": this._textBoxKeyPressHandler
        }, this);

        if (Sys.Browser.agent == Sys.Browser.InternetExplorer || Sys.Browser.agent === Sys.Browser.Safari
            || Sys.Browser.agent === Sys.Browser.WebKit) {
            $addHandler(this.get_textBoxControl(), "keydown", this._textBoxKeyDownHandler);
        }

        $addHandlers(this.get_buttonControl(),
        {
            'click': this._buttonClickHandler,
            'blur': this._buttonBlurHandler,
            'keydown': this._buttonKeyDownHandler,
            'keypress': this._buttonKeyPressHandler
        }, this);

        $addHandler(document, 'click', this._documentClickHandler);

        // FF doesn't have an onmousewheel event
        if (typeof (optionListControl.onmousewheel) === 'undefined') {
            $addHandler(optionListControl, 'DOMMouseScroll', this._listMouseWheelHandler);
            $addHandler(document, 'DOMMouseScroll', this._documentMouseWheelHandler);
        }
        else {
            $addHandler(optionListControl, 'mousewheel', this._listMouseWheelHandler);
            $addHandler(document, 'mousewheel', this._documentMouseWheelHandler);
        }
    },
    clearHandlers: function () {

        $clearHandlers(this.get_optionListControl());
        $clearHandlers(this.get_textBoxControl());
        $clearHandlers(this.get_buttonControl());
        $clearHandlers(document);
    },
    initializeTextBox: function () {

        // initialize style
        var style = this.get_textBoxControl().style;

        // default browser margins interfere with button alignment
        if (style.margin == '')
            style.margin = '0px';

    },
    initializeButton: function () {

        // initialize style
        var style = this.get_buttonControl().style;

        // container height is based on the textbox's offsetHeight
        if (style.height == '' && this.get_textBoxControl().offsetHeight >= 0)
            style.height = this.get_textBoxControl().offsetHeight + 'px';
        if (style.width == '')
            style.width = style.height;

        // zero margins & padding (helps particularly in firefox)
        if (style.margin == '')
            style.margin = '1px 0 0 0';
        if (style.padding == '')
            style.padding = '0px';

        // button is originally hidden to reduce screen flicker
        this._buttonControl.style.visibility = 'visible';

    },
    initializeOptionList: function () {

        // when there are no option items, server does not render a UL element. 
        if (this.get_optionListControl() == null) {
            var optionList = document.createElement('ul');
            this.get_element().appendChild(optionList);
            this.set_optionListControl(optionList);
        }
        var optionListControl = this.get_optionListControl();

        // force inline display on Safari by moving the list to the bottom of the form.
        if (Sys.Browser.agent === Sys.Browser.Safari || Sys.Browser.agent === Sys.Browser.WebKit) {
            //this.get_element().removeChild(optionListControl);
            var parentOfOptionList = optionListControl.parentNode;
            if (parentOfOptionList != null)
                parentOfOptionList.removeChild(optionListControl);

            var parent = this.get_element().parentNode;
            while (typeof (parent) != typeof (document.forms[0])) {
                parent = parent.parentNode;
            }
            var safariListContainer = document.createElement('div');
            safariListContainer.className = this.get_element().className;
            safariListContainer.appendChild(optionListControl);
            parent.appendChild(safariListContainer);
        }

        // initialize style
        var style = optionListControl.style;

        // option list is originally display-none to force inline rendering
        style.display = 'block';
        style.zIndex = '10000';

        // build an array of list items
        this._optionListItems = new Array();
        var children = optionListControl.childNodes;
        for (var i = 0; i < children.length; i++) {

            // evaluate the current node to see if it should be added to the list items array
            var child = children[i];

            // there may be more childNodes than items in the list -- remove non-li elements
            if (child.tagName == undefined || child.tagName.toUpperCase() != 'LI') {
                // remove the child, then re-evaluate this index
                optionListControl.removeChild(child);
                i--;
                continue;
            }

            // add the item to the internal collection
            var item = new Object();
            var text = child.innerHTML.trim();

            // remove carriage returns
            var indexOfCarriageReturn = text.indexOf('\r');
            while (indexOfCarriageReturn >= 0) {
                text = text.substring(0, indexOfCarriageReturn).trim()
                    + ' ' + text.substring(indexOfCarriageReturn + 1, text.length).trim();
                indexOfCarriageReturn = text.indexOf('\r');
            }

            // remove newlines
            var indexOfNewline = text.indexOf('\n');
            while (indexOfNewline >= 0) {
                text = text.substring(0, indexOfNewline).trim()
                    + ' ' + text.substring(indexOfNewline + 1, text.length).trim();
                indexOfNewline = text.indexOf('\n');
            }

            // replace HTML entities with character equivalents
            text = text.replace(/\&amp;/g, '&')
                .replace(/\&quot;/g, '"')
                .replace(/\&gt;/g, '>')
                .replace(/\&lt;/g, '<');

            item.text = text.trim();
            Array.add(this._optionListItems, item);

            // style the ListItem with default skin
            this.initializeOptionListItem(child);
        }

        // initialize list width
        style.width = this._getOptionListBounds().width + 'px';
        style.width = '0px';

        // add the popup behavior to the master container, targeting the option list
        this._popupBehavior = $create(Sys.Extended.UI.PopupBehavior,
        {
            'id': this.get_id() + '_PopupBehavior'
            , 'parentElement': this.get_textBoxControl()
            , "positioningMode": Sys.Extended.UI.PositioningMode.BottomLeft
        }, null, null, optionListControl);
        this._popupBehavior.add_showing(this._popupShowingHandler);
        this._popupBehavior.add_shown(this._popupShownHandler);
        this._popupBehavior.add_hiding(this._popupHidingHandler);

        // highlight the default item and set the default text
        if (this.get_selectedIndex() >= 0) {
            this._highlightListItem(this.get_selectedIndex());
            this.get_textBoxControl().value = this._optionListItems[this.get_selectedIndex()].text;
        }
        else {
            //this.get_textBoxControl().text = '';
            this.get_textBoxControl().value = '';
        }

        // show and hide the popup behavior to initialize dimensions and overflow
        this._popupShowing();
        optionListControl.style.display = "none";

    },
    initializeOptionListItem: function (liElement) {

        // ensure empty text appears in the list
        liElement._textIsEmpty = false;
        if (liElement.innerHTML.length < 1) {
            liElement.innerHTML = '&nbsp;';
            liElement._textIsEmpty = true;
        }

    },
    _popupShowing: function () {

        // find out what dimensions and positioning we are working with
        var windowBounds = this._getWindowBounds();
        var tableBounds = Sys.UI.DomElement.getBounds(this.get_comboTableControl());
        var optionListBounds = this._getOptionListBounds();
        var safetyDimension = 30;

        // determine placement
        var yThreshold = windowBounds.y + (windowBounds.height / 2);
        var yFlopPoint = tableBounds.y + tableBounds.height;
        var xThreshold = windowBounds.x + (windowBounds.width / 2);
        var xFlopPoint = tableBounds.x + (tableBounds.width / 2);

        // vertical alignment & height
        var maxHeight = tableBounds.y - windowBounds.y;
        var yAlign = 'Top';
        if (yFlopPoint <= yThreshold) {
            yAlign = 'Bottom';
            maxHeight = windowBounds.height - tableBounds.height - maxHeight;
        }

        // when the list contains few enough items, maxHeight may be too large
        var itemHeight = this._getOptionListItemHeight();
        if (maxHeight >= optionListBounds.height) {
            maxHeight = optionListBounds.height;
        }
        else {
            // adjust maxHeight to be a multiple of listItemHeight
            maxHeight = itemHeight * ((Math.floor(maxHeight / itemHeight)) - 2);
        }
        var visibleItems = maxHeight / itemHeight;
        var yScrollbar = (visibleItems < this._optionListItems.length);
        var scrollbarWidth = 20;

        // when the list will fit safely, give it default alignment
        if (yAlign == "Top" && maxHeight < (windowBounds.height - tableBounds.y)) {
            yAlign = "Bottom";
        }

        // horizontal alignment & width
        var maxWidth = tableBounds.x - windowBounds.x;
        var xAlign = 'Left';
        if (xFlopPoint <= xThreshold) {
            maxWidth = windowBounds.width - maxWidth;
        }
        else {
            xAlign = 'Right';
            maxWidth = tableBounds.width + maxWidth;
        }

        // subtract safety dimension
        maxWidth -= safetyDimension;

        // when the list contains short items, maxWidth may be too large.
        var bestWidth = optionListBounds.width;
        if (yScrollbar) {
            bestWidth += scrollbarWidth;
            if (maxWidth >= bestWidth) {
                maxWidth = bestWidth;
            }
        }
        else if (maxWidth >= bestWidth) {
            maxWidth = bestWidth;
        }

        // when the list will fit safely, give it default alignment
        if (xAlign == "Right" && maxWidth < (windowBounds.width - tableBounds.x)) {
            xAlign = "Left";
        }

        // when list is empty, maxheight is -Infinity
        if (maxHeight < 0) {
            maxHeight = 0;
        }
        if (maxWidth < 0) {
            maxWidth = 0;
        }

        // set width & height
        var style = this.get_optionListControl().style;
        style.height = maxHeight + 'px';
        style.width = maxWidth + 'px';

        // account for scrollbars
        if (yScrollbar) {
            style.overflow = 'auto';
            style.overflowX = 'hidden';
        }
        else {
            style.overflow = 'hidden';
        }

        // set positioning mode
        var compositeAlign = yAlign + xAlign;
        if (compositeAlign == 'BottomLeft')
            this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.BottomLeft);
        else if (compositeAlign == 'BottomRight')
            this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.BottomRight);
        else if (compositeAlign == 'TopLeft')
            this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.TopLeft);
        else if (compositeAlign == 'TopRight')
            this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.TopRight);

        style.visibility = 'hidden';

    },
    _popupShown: function () {

        var optionListControl = this.get_optionListControl();
        optionListControl.style.display = 'block';

        // check and enforce correct positioning.
        var tableBounds = Sys.UI.DomElement.getBounds(this.get_comboTableControl());
        var listBounds = Sys.UI.DomElement.getBounds(optionListControl);
        var textBoxBounds = Sys.UI.DomElement.getBounds(this.get_textBoxControl());
        var y = listBounds.y;
        var x;

        if (this._popupBehavior.get_positioningMode() === Sys.Extended.UI.PositioningMode.BottomLeft
            || this._popupBehavior.get_positioningMode() === Sys.Extended.UI.PositioningMode.TopLeft) {
            x = textBoxBounds.x;
        }
        else if (this._popupBehavior.get_positioningMode() === Sys.Extended.UI.PositioningMode.BottomRight
            || this._popupBehavior.get_positioningMode() === Sys.Extended.UI.PositioningMode.TopRight) {
            x = textBoxBounds.x - (listBounds.width - textBoxBounds.width);
        }

        Sys.UI.DomElement.setLocation(optionListControl, x, y);

        // enforce default scroll
        this._ensureHighlightedIndex();
        this._ensureScrollTop();

        // show the option list
        optionListControl.style.visibility = 'visible';

    },
    _popupHiding: function () {

        // hide the option list
        this._highlightSuggestedItem = false;

        var style = this.get_optionListControl().style;
        style.display = 'none';
        style.visibility = 'hidden';

    },
    _onButtonClick: function (e) {
        Sys.Extended.UI.ComboBox.IsOpen(this);
        // in Simple mode, always display the list
        if (this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.Simple) {
            this._popupBehavior.show();
        }

        // show / hide the option list
        else if (this._popupBehavior._visible) {
            this._popupBehavior.hide();
        }
        else {
            this._popupBehavior.show();
        }

        e.preventDefault();
        e.stopPropagation();
        return false;

    },
    _onButtonBlur: function (e) {

        // optionally trigger postback
        if (this.get_autoPostBack() == true && !this._doingPostBack && this._originalSelectedIndex != this.get_selectedIndex()) {
            this._doingPostBack = true;
            __doPostBack(this.get_element().id, '');
        }

    },
    _onButtonKeyDown: function (e) {

        // sometimes user can type while the button has focus
        if (e.keyCode == Sys.UI.Key.tab || e.keyCode == 16) { // 16==SHIFT key
            return true;
        }

        if (!this._popupBehavior._visible && (e.keyCode == Sys.UI.Key.enter || e.keyCode == Sys.UI.Key.down)) {
            this._popupBehavior.show();
        }
        else if (this._popupBehavior._visible && (e.keyCode == Sys.UI.Key.enter || e.keyCode == Sys.UI.Key.up)) {
            this._popupBehavior.hide();
        }

        e.stopPropagation();
        e.preventDefault();

        // give focus to the text box
        var textBoxID = this.get_textBoxControl().id;
        setTimeout(function () { document.getElementById(textBoxID).focus(); }, 0);
        return false;

    },
    _onButtonKeyPress: function (e) {

        // sometimes user can type while the button has focus
        if (e.charCode == Sys.UI.Key.tab || e.charCode == 16) { // 16==SHIFT key
            return true;
        }
        e.stopPropagation();
        e.preventDefault();
        return false;

    },
    _onListMouseWheel: function (e) {

        var direction;

        // enforce mousewheel scrolling
        if (typeof (e.rawEvent.wheelDelta) === 'undefined') {
            // firefox
            direction = (e.rawEvent.detail >= 1) ? 1 : -1;
        }
        else {
            // not firefox
            direction = (e.rawEvent.wheelDelta > 1) ? -1 : 1;
        }

        // each event scrolls approximately 1 list item up or down
        this.get_optionListControl().scrollTop += this._getOptionListItemHeight() * direction;

        // tell parents we have handled this event
        e.stopPropagation();
        e.preventDefault();
        return false;

    },
    _onListMouseOver: function (e) {
        var optionListControl = this.get_optionListControl();
        // do not highlight unless an LI is being hovered
        if (e.target !== optionListControl) {
            var target = e.target;
            var children = optionListControl.childNodes;

            // loop through children to find a match with the target
            for (var i = 0; i < children.length; ++i) {
                // match found, highlight item and break loop
                if (target === children[i]) {
                    this._highlightListItem(i, true);
                    break;
                }
            }
        }

    },
    _onListMouseOut: function (e) {

        // unhighlight the highlighted item if the list is open in suggestappend mode
        // prevents overriding user-typed text when determining the selectedindex
        if (this._popupBehavior._visible
            && this.get_autoCompleteMode() == Sys.Extended.UI.ComboBoxAutoCompleteMode.SuggestAppend) {
            this._highlightListItem(this._highlightedIndex, false);
        }

    },
    _onListMouseDown: function (e) {
        var optionListControl = this.get_optionListControl();

        if (e.target == optionListControl || e.target.tagName == 'scrollbar') {
            return true;
        }

        // set the TextBox to the highlighted ListItem's text and update selectedIndex
        if (e.target !== optionListControl) {
            var highlightedItem = optionListControl.childNodes[this._highlightedIndex],
                text = this._optionListItems[this._highlightedIndex].text;
            this.get_textBoxControl().value = text;
            this.set_selectedIndex(this._highlightedIndex);

            // return focus to the TextBox
            this._supressFocusHide = false;
            //this.get_textBoxControl().focus(); // danludwig, see http://Sys.Extended.UI.codeplex.com/WorkItem/View.aspx?WorkItemId=22392
            this._handleTextBoxFocus(null);

        }
        else {
            return true;
        }
        e.preventDefault();
        e.stopPropagation();
        return false;

    },
    _onListClick: function (e) {

        if (e.target == this.get_optionListControl()) {
            return true;
        }

        // prevent ItemList clicks from triggering document clicks
        e.preventDefault();
        e.stopPropagation();
        return false;

    },
    _onListDrag: function (e) {

        // prevent selection of ListItem text
        e.preventDefault();
        e.stopPropagation();
        return false;

    },
    _onListSelectStart: function (e) {

        // prevent selection of ListItem text
        e.preventDefault();
        e.stopPropagation();
        return false;

    },
    _onTextBoxClick: function (e) {

        // in Simple mode, always display the list
        if (this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.Simple) {
            this._popupBehavior.show();
        }

        // prevent TextBox clicks from triggering document clicks
        e.preventDefault();
        e.stopPropagation();
        return false;

    },
    _onTextBoxFocus: function (e) {
        Sys.Extended.UI.ComboBox.IsOpen(this);
        this._handleTextBoxFocus(e);

    },
    _onTextBoxBlur: function (e) {

        // select the correct index based on text box value
        var textBoxValue = this.get_textBoxControl().value.trim();
        var matchedIndex = -3;

        // search items
        for (var i = 0; i < this._optionListItems.length; i++) {
            var item = this._optionListItems[i];
            if (this._isExactMatch(item.text, textBoxValue)) {
                matchedIndex = i;
                break;
            }
        }

        // when in suggest mode, a suggested index may already be set
        if (this._highlightSuggestedItem == true && this._highlightedIndex != null && this._highlightedIndex >= 0) {
            this.set_selectedIndex(this._highlightedIndex);
            this.get_textBoxControl().value = this._optionListItems[this.get_selectedIndex()].text;
        }

        // selected index is -2 when custom text is entered in dropdownlist mode
        else if (matchedIndex == -3 && textBoxValue.length > 0
            && this.get_dropDownStyle() != Sys.Extended.UI.ComboBoxStyle.DropDownList) {
            this.set_selectedIndex(-2);
        }

        // selected index is -1 when there are no items in the list and there is no custom text
        else if (this._optionListItems.length < 1 && (textBoxValue == ''
            || this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.DropDownList)) {
            this.set_selectedIndex(-1);
            this.get_textBoxControl().value = '';
        }

        // when list contains items but none matched, select the first item by default
        else if (this._optionListItems.length >= 0 && matchedIndex == -3
            && this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.DropDownList) {
            this.set_selectedIndex(0);
            this.get_textBoxControl().value = this._optionListItems[0].text;
        }

        // when list contains a matchable item, set the selected index
        else if (matchedIndex >= 0) {
            this.set_selectedIndex(matchedIndex);
            this.get_textBoxControl().value = this._optionListItems[matchedIndex].text;
        }

        // hide the option list and optionally trigger postback
        this._popupBehavior.hide();
        if (this.get_autoPostBack() == true && !this._doingPostBack && this._originalSelectedIndex != this.get_selectedIndex()) {
            this._doingPostBack = true;
            __doPostBack(this.get_element().id, '');
        }

    },
    _onTextBoxKeyDown: function (e) {

        // keydown is not fired in ff or opera. keypress is fired instead.
        // in ie and safari, keydown is fired before keypress for character keys and the ENTER key.
        // in ie and safari, keydown is fired instead of keypress for ARROWS, BACKSPACE, and DELETE keys.
        // only keyCodes are sent to this event: charCodes are always undefined here.

        // user presses ENTER while text box has focus
        var enterResult = this._handleEnterKey(e);
        if (enterResult != null) {
            return enterResult;
        }

        this._handleArrowKey(e);

        // handle backspace and delete keystrokes
        var erasureKeyResult = this._handleErasureKeys(e);
        if (erasureKeyResult != null) {
            return erasureKeyResult;
        }

        return true;

    },
    _onTextBoxKeyPress: function (e) {

        // user presses ENTER while text box has focus
        var enterResult = this._handleEnterKey(e);
        if (enterResult != null) {
            return enterResult;
        }

        // some browsers, like ff and Opera, send arrow strokes here instead of keydown 
        var arrowResult = this._handleArrowKey(e);
        if (arrowResult != null) {
            return arrowResult;
        }

        // do not prevent all keypresses, only character keypresses.
        var nonCharacterKeyResult = this._handleNonCharacterKey(e);
        if (nonCharacterKeyResult != null) {
            return nonCharacterKeyResult;
        }

        // always show list in simple mode
        if (this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.Simple && !this._popupBehavior._visible) {
            this._popupBehavior.show();
        }

        // prevent typing when there are no items in the list
        if (this.get_selectedIndex() == -1 && this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.DropDownList) {
            this.get_textBoxControl().value = '';
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // get info about the text and selection
        var info = this._getTextSelectionInfo(this.get_textBoxControl(), e);
        var newSelectionStart = info.selectionStart;
        var newSelectionEnd = info.selectionEnd;
        var allText = info.selectionPrefix + info.typedCharacter
            + info.selectionText.substring(1) + info.selectionSuffix;
        var userText = info.selectionPrefix + info.typedCharacter;
        var textBoxMaxLength =this.get_textBoxControl().maxLength;
        if(textBoxMaxLength < 0)
            textBoxMaxLength = Number.MAX_VALUE;

        if (userText.length > textBoxMaxLength) {
            userText = userText.substring(0, this.get_textBoxControl().maxLength);
        }
        var suggestedIndex = this._suggestIndex(allText, userText);

        // setup suggest behavior
        if (this.get_autoCompleteMode() == Sys.Extended.UI.ComboBoxAutoCompleteMode.Suggest
                || this.get_autoCompleteMode() == Sys.Extended.UI.ComboBoxAutoCompleteMode.SuggestAppend) {
            this._highlightSuggestedItem = true;
            if (!this._popupBehavior._visible) {
                this._popupBehavior.show();
            }
        }

        // suggestedIndex can be a valid index or -1.
        if (suggestedIndex >= 0) {

            // handle append behavior
            if (this.get_autoCompleteMode() == Sys.Extended.UI.ComboBoxAutoCompleteMode.Append
                    || this.get_autoCompleteMode() == Sys.Extended.UI.ComboBoxAutoCompleteMode.SuggestAppend) {
                this.get_textBoxControl().value = this._optionListItems[suggestedIndex].text;
                newSelectionStart = info.selectionStart + 1;
                newSelectionEnd = this.get_textBoxControl().value.length;
            }
            // do not append suggestion
            else {
                this.get_textBoxControl().value = this._optionListItems[suggestedIndex].text.substring(0, userText.length);
                newSelectionStart = this.get_textBoxControl().value.length;
                newSelectionEnd = this.get_textBoxControl().value.length;
            }
        }
        // when suggestedIndex is -1, there is no match.
        else if (this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.Simple
                || this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.DropDown) {
            this.get_textBoxControl().value = userText;
            newSelectionStart = userText.length;
            newSelectionEnd = userText.length;
        }

        // handle backspace and delete keystrokes
        var erasureKeyResult = this._handleErasureKeys(e);
        if (erasureKeyResult != null) {
            return erasureKeyResult;
        }

        // automatically highlight and scroll based on typing
        this._ensureHighlightedIndex();
        this._ensureScrollTop();
        this._setTextSelectionRange(this.get_textBoxControl(), newSelectionStart, newSelectionEnd);

        e.preventDefault();
        e.stopPropagation();
        return false;

    },
    _onDocumentClick: function (e) {

        // hide the option list when users click document
        if (this._popupBehavior._visible) {
            this._popupBehavior.hide();
        }

    },
    _onDocumentMouseWheel: function (e) {

        // hide the option list when user mousewheel scrolls outside of it
        if (this._popupBehavior) {
            this._popupBehavior.hide();
        }
        return true;

    },
    _handleTextBoxFocus: function (e) {

        // hide the option list and optionally trigger postback
        if (!this._supressFocusHide && this._popupBehavior._visible) {
            this._popupBehavior.hide();
            this._supressFocusHide = true;
            if (this.get_autoPostBack() && !this._doingPostBack && this._originalSelectedIndex != this.get_selectedIndex()) {
                this._doingPostBack = true;
                __doPostBack(this.get_element().id, '');
            }
        }

        // in Simple mode, always display the list
        if (this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.Simple) {
            this._popupBehavior.show();
        }

        // select the entire string in the text box
        this._setTextSelectionRange(
            this.get_textBoxControl(),
            0,
            this.get_textBoxControl().value.length);

        if (e != null) {
            e.preventDefault();
            e.stopPropagation();
        }

    },
    _highlightListItem: function (index, isHighlighted) {

        // only highlight valid indices
        if (index == undefined || index < 0) {
            if (this._highlightedIndex != undefined && this._highlightedIndex >= 0) {
                this._highlightListItem(this._highlightedIndex, false);
            }
            return;
        }

        var children = this.get_optionListControl().childNodes;
        var liElement = children[index];

        // item is being hovered
        if (isHighlighted == true) {

            // skip if already highlighted
            if (this._highlightedIndex == index)
                return;

            // apply hover css class
            if (index >= 0) {
                // to avoid scrollbar flickering during scrolls in IE, do not set className unless it is provided
                if (this.get_listItemHoverCssClass() == undefined || this.get_listItemHoverCssClass() == '') {
                    liElement.style.backgroundColor = 'Highlight';
                    liElement.style.color = 'HighlightText';
                }
                else {
                    liElement.className = this.get_listItemHoverCssClass;
                }
            }

            // unselect previously highlighted item
            if (this._highlightedIndex != null && this._highlightedIndex != index && this._highlightedIndex >= 0) {
                this._highlightListItem(this._highlightedIndex, false);
            }

            // update control state
            this._highlightedIndex = index;
        }

        // item is not being hovered
        else {
            if (this.get_listItemHoverCssClass() == undefined || this.get_listItemHoverCssClass() == '') {
                liElement.style.backgroundColor = '';
                liElement.style.color = '';
            }
            else {
                liElement.className = '';
            }

            if (index == this._highlightedIndex) {
                this._highlightedIndex = -1;
            }
        }

    },
    _suggestIndex: function (allText, userText) {

        // suggest closest option list match based on user's typing
        var suggestedIndex = -1;
        var firstMatch = false;
        var exactMatch = false;

        // loop through all options in the list
        for (var i = 0; i < this._optionListItems.length; i++) {
            itemText = this._optionListItems[i].text;

            // skip empty elements
            if (itemText.length < 1)
                continue;

            // skip elements that don't match on first character
            if (itemText.substring(0, 1).toLowerCase() != userText.substring(0, 1).toLowerCase())
                continue;

            // first, check if strings are exact match
            var allCandidate = itemText.substring(0, allText.length);
            exactMatch = (allCandidate == allText);
            if (!exactMatch && !this.get_caseSensitive()) {
                exactMatch = (allCandidate.toLowerCase() == allText.toLowerCase());
            }

            // always return exact matches before first matches
            if (exactMatch) {
                suggestedIndex = i;
                break;
            }

            // otherwise, look for a partial match and keep going
            else if (!firstMatch) {
                var userCandidate = itemText.substring(0, userText.length);
                firstMatch = (userCandidate == userText);
                if (!firstMatch && !this.get_caseSensitive())
                    firstMatch = (userCandidate.toLowerCase() == userText.toLowerCase());
                if (firstMatch)
                    suggestedIndex = i;
            }
        }
        return suggestedIndex;

    },
    _getKeyboardCode: function (e) {

        if (e.type == 'keypress') {
            return e.charCode;
        } else if (e.type == 'keydown') {
            return e.keyCode;
        }
        return undefined;

    },
    _handleArrowKey: function (e) {

        // when shift key is pressed, ignore arrow codes
        if (e.shiftKey == true) {
            return null;
        }

        var code = this._getKeyboardCode(e);

        // cycle through items when up & down arrow keys are used
        if (code == Sys.UI.Key.up || code == Sys.UI.Key.down) {
            if (this._popupBehavior._visible) {
                var vector = code - 39;
                if ((vector == -1 && this._highlightedIndex > 0) || (vector == 1 && this._highlightedIndex < this._optionListItems.length - 1)) {
                    var newIndex = (this._highlightedIndex + vector);
                    this.get_textBoxControl().value = this._optionListItems[newIndex].text;
                    this._highlightListItem(newIndex, true);
                    this.set_selectedIndex(newIndex);
                    this._ensureScrollTop();
                }
            }
            else {
                this._popupBehavior.show();
            }

            if (e.type == 'keypress') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            return true;
        }
        return null;

    },
    _handleEnterKey: function (e) {

        var code = this._getKeyboardCode(e);

        if (code == Sys.UI.Key.enter) {
            // if the dropdown is open, close it.
            if (this._popupBehavior._visible) {
                if (this._highlightedIndex >= 0) {
                    this.get_textBoxControl().value = this._optionListItems[this._highlightedIndex].text;
                    this.set_selectedIndex(this._highlightedIndex);
                    __doPostBack(this.get_element().id, '');
                }
                this._popupBehavior.hide();
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // allow form submits for free text
            else if (this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.Simple
                || this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.DropDown) {
                return true;
            }

            // allow form submits for valid selected indices
            else if (this._highlightedIndex == this.get_selectedIndex()) {
                return true;
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        return null;

    },
    _handleErasureKeys: function (e) {

        var code = this._getKeyboardCode(e);

        var isBackspaceKey = (code == Sys.UI.Key.backspace);
        var isDeleteKey = (code == Sys.UI.Key.del);
        if (typeof (window.event) === 'undefined' && e.type == 'keypress') {
            isDeleteKey = (e.rawEvent.keyCode == 46);
        }

        if (isBackspaceKey || isDeleteKey) {

            var info = this._getTextSelectionInfo(this.get_textBoxControl(), e);
            var newSelectionStart, newSelectionEnd;

            // always delete selected characters
            if (info.selectionStart < info.selectionEnd) {
                this.get_textBoxControl().value = info.selectionPrefix + info.selectionSuffix;
                newSelectionStart = info.selectionStart;
                newSelectionEnd = info.selectionStart;
            }

            // otherwise, there is no selection -- only a carat
            else if (info.selectionStart == info.selectionEnd) {
                var newValue;
                if (isBackspaceKey && info.selectionStart > 0) {
                    var trimSize = 1;
                    if (info.selectionPrefix.charCodeAt(info.selectionPrefix.length - 1) == 8) {
                        trimSize = 2;
                    }
                    newValue = info.selectionPrefix.substr(0, info.selectionPrefix.length - trimSize);
                    newValue += info.selectionSuffix;
                    this.get_textBoxControl().value = newValue;
                    newSelectionStart = info.selectionStart - 1;
                    newSelectionEnd = info.selectionStart - 1;
                }
                else if (isDeleteKey && info.selectionStart < info.textBoxValue.length) {
                    newValue = info.selectionSuffix;
                    newValue = info.selectionPrefix + newValue.substr(1, info.selectionSuffix.length - 1);
                    this.get_textBoxControl().value = newValue;
                    newSelectionStart = info.selectionStart;
                    newSelectionEnd = info.selectionStart;
                    this._setTextSelectionRange(this.get_textBoxControl(), info.selectionStart, info.selectionStart);
                }
            }

            this._ensureHighlightedIndex();
            this._ensureScrollTop();
            this._setTextSelectionRange(this.get_textBoxControl(), newSelectionStart, newSelectionEnd);

            // in custom text modes with suggestion, need to re-check the highlighted item
            if ((this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.Simple
                || this.get_dropDownStyle() == Sys.Extended.UI.ComboBoxStyle.DropDown)
                && (this.get_autoCompleteMode() == Sys.Extended.UI.ComboBoxAutoCompleteMode.Suggest
                || this.get_autoCompleteMode() == Sys.Extended.UI.ComboBoxAutoCompleteMode.SuggestAppend)
                && (this._highlightedIndex != null && this._highlightedIndex >= 0)) {
                var _isExactMatch = this._isExactMatch(this._optionListItems[this._highlightedIndex].text, this.get_textBoxControl().value);
                if (!_isExactMatch) {
                    this._highlightListItem(this._highlightedIndex, false);
                }
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        return null;

    },
    _handleNonCharacterKey: function (e) {

        var code = this._getKeyboardCode(e);

        var isBackspaceKey = (code == Sys.UI.Key.backspace);
        var isDeleteKey = (code == Sys.UI.Key.del);
        if (e.type == 'keypress') {
            isDeleteKey = (e.rawEvent.code == 46);
        }

        if (isBackspaceKey || isDeleteKey) {
            return null;
        }

        if (this._isNonCharacterKey(e)) {
            // prevent event validation errors when ESC is hit twice
            if (code == Sys.UI.Key.esc) {
                this._popupBehavior.hide();
                this.get_textBoxControl().blur();
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            return true;
        }
        return null;
    },
    _isNonCharacterKey: function (e) {

        // MS Ajax uses following codes for Key enumeration
        // backspace:8,tab:9,enter:13,esc:27,space:32,pageUp:33,pageDown:34,end:35,home:36,left:37,up:38,right:39,down:40,del:127
        var code = this._getKeyboardCode(e);

        // return true if keypress actions should be allowed
        if (code == Sys.UI.Key.enter || code == Sys.UI.Key.esc) { // allow RETURN/ENTER and ESC keys for all browsers
            return true;
        }
        else if (Sys.Browser.agent == Sys.Browser.Safari && Sys.Browser.version < 500) {

            // allow special funky apple keypresses
            if (code == 8           // BACKSPACE in Safari 2
                || code == 9        // TAB in Safari 2
                || code == 63272    // DELETE in Safari 2
                || code == 63276    // PAGEUP in Safari 2
                || code == 63277    // PAGEDOWN in Safari 2
                || code == 63275    // END in Safari 2
                || code == 63273    // HOME in Safari 2
                || code == 63234    // ARROWLEFT in Safari 2
                || code == 63235    // ARROWRIGHT in Safari 2
                || (code >= 63236 && code <= 63243) // FUNCTION keys in Safari 2
                || code == 63248       // F13 key in Safari 2
            ) {
                return true;
            }
        }
        else if (Sys.Browser.agent == Sys.Browser.WebKit) {

            // allow special funky apple webkit keypresses
            if (code == 8            // BACKSPACE in Safari 3
                || code == 9         // TAB in Safari 3
                || code == 19        // PAUSE BREAK Safari 3
                || code == 33        // PAGEUP in Safari 3
                || code == 34        // PAGEDOWN in Safari 3
                || code == 35        // END in Safari 3
                || code == 36        // HOME in Safari 3
                || code == 37        // ARROWLEFT in Safari 3
                || code == 39        // ARROWRIGHT in Safari 3
                || code == 45        // INSERT in Safari 3
                || code == 46        // DELETE in Safari 3
                || code == 91        // WINDOWS LEFT Safari 3
                || code == 92        // WINDOWS RIGHT Safari 3
                || code == 93        // MENU Safari 3
                || code == 113       // F2 Safari 3
                || code == 115       // F4 Safari 3
                || code == 118       // F7 Safari 3
                || code == 119       // F8 Safari 3
                || code == 120       // F9 Safari 3
                || code == 122       // F11 Safari 3
                || code == 145       // SCROLL LOCK Safari 3
            )
                return true;
        }
        else if (Sys.Browser.agent != Sys.Browser.InternetExplorer) {

            // allow kepress events triggered by FF & Opera
            if (code == 8           // BACKSPACE in non-microsoft browsers
                || code == 9        // TAB in non-microsoft browsers
                || code == 33       // PAGEUP in non-microsoft browsers
                || code == 34       // PAGEDOWN in non-microsoft browsers
                || code == 35       // END in non-microsoft browsers
                || code == 36       // HOME in non-microsoft browsers
                || code == 37       // ARROWLEFT in non-microsoft browsers
                || code == 39       // ARROWRIGHT in non-microsoft browsers
                || code == 45       // INSERT in non-microsoft browsers
                || code == 46       // DELETE in non-microsoft browsers
            //|| (code >= 112 && code <= 123) // FUNCTION keys in non-microsoft browsers
            ) {
                if (!e.shiftKey)
                    return true;
            }
            else if (code == 145) {

                // allow SCROLL LOCK events triggered by weird combos
                return true;

            }
            else if (code == 19) {

                // allow PAUSE BREAK events triggered by weird combos
                return true;
            }
            else if (Sys.Browser.agent == Sys.Browser.Opera) {

                // allow kepress events triggered only by Opera
                if (code == 0       // MENU key in Opera
                    || code == 16   // SHIFT key in Opera
                    || code == 17   // CONTROL key in Opera
                ) {
                    return true;
                }
            }
            else if (Sys.Browser.agent == Sys.Browser.Firefox) {

                // allow kepress events triggered only by Firefox
                if (code == 91      // WINDOWS LEFT key in Firefox
                    || code == 92   // WINDOWS RIGHT key in Firefox
                    || code == 93   // MENU key in Firefox
                ) {
                    return true;
                }
            }
        }
        else if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
            // period character for IE
            if (code == 46)
                return true;
        }
        return false;

    },
    _ensureScrollTop: function () {

        var optionListControl = this.get_optionListControl();

        // automatically scroll if the highlighted index is not visible. 
        if (this._highlightedIndex >= 0) {
            var itemHeight = this._getOptionListItemHeight(),
                itemTop = itemHeight * this._highlightedIndex,
                scrollBottom = optionListControl.scrollTop + optionListControl.clientHeight;

            if (itemTop <= optionListControl.scrollTop || itemTop >= scrollBottom)
                optionListControl.scrollTop = this._highlightedIndex * itemHeight;
        }

    },
    _ensureSelectedIndex: function () {

        // server may not always invoke set_selectedIndex(), need to make sure this is always an integer        
        var selectedIndex = this.get_hiddenFieldControl().value;
        if (selectedIndex == '') {
            selectedIndex = (this._optionListItems.length > 0) ? 0 : -1;
            this.get_hiddenFieldControl().value = selectedIndex.toString();
        }
        if (this._originalSelectedIndex == null) {
            this._originalSelectedIndex = parseInt(selectedIndex);
        }


    },
    _ensureHighlightedIndex: function () {

        // highlight an index according to textbox value
        var textBoxValue = this.get_textBoxControl().value;

        // first, check the current highlighted index
        if (this._highlightedIndex != null && this._highlightedIndex >= 0
            && this._isExactMatch(this._optionListItems[this._highlightedIndex].text, textBoxValue)) {
            return;
        }

        // need to find the correct index
        var firstMatch = -1;
        var ensured = false;
        for (var i = 0; i < this._optionListItems.length; i++) {
            var itemText = this._optionListItems[i].text;
            if (this._isExactMatch(itemText, textBoxValue)) {
                this._highlightListItem(i, true);
                ensured = true;
                break;
            }

            // if in DropDownList mode, save first match.
            else if (firstMatch < 0 && this._highlightSuggestedItem) {
                if (this._isPrefixMatch(itemText, textBoxValue)) {
                    firstMatch = i;
                }
            }
        }

        if (!ensured) {
            this._highlightListItem(firstMatch, true);
        }

    },
    _isExactMatch: function (itemText, userText) {

        // whether strings match exactly, depending on case sensitivity
        var exactMatch = (itemText == userText);
        if (!exactMatch && !this.get_caseSensitive())
            exactMatch = (itemText.toLowerCase() == userText.toLowerCase());
        return exactMatch;

    },
    _isPrefixMatch: function (itemText, userText) {

        // whether the user-typed text matches as the prefix of an option in the list
        return this._isExactMatch(itemText.substring(0, userText.length), userText);

    },
    _setTextSelectionRange: function (textBox, selectionStart, selectionEnd) {

        // set the selection range on the text box
        var strategy = this._getTextSelectionStrategy();
        if (strategy == Sys.Extended.UI.ComboBoxTextSelectionStrategy.Microsoft) {
            var range = textBox.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();

            // opera wants to also invoke the W3C setSelectionRange method
            if (Sys.Browser.agent == Sys.Browser.Opera) {
                textBox.setSelectionRange(selectionStart, selectionEnd);
            }
        }
        else if (strategy == Sys.Extended.UI.ComboBoxTextSelectionStrategy.W3C) {
            textBox.setSelectionRange(selectionStart, selectionEnd);
        }

    },
    _getTextSelectionStrategy: function () {

        // different browsers have different API's for selecting text
        if (this._textSelectionStrategy == null) {
            if(Sys.Browser.agent === Sys.Browser.InternetExplorer && Sys.Browser.version <= 8) {
                this._textSelectionStrategy =
                    Sys.Extended.UI.ComboBoxTextSelectionStrategy.Microsoft;
            }
            else if (this.get_textBoxControl().setSelectionRange) {
                this._textSelectionStrategy =
                    Sys.Extended.UI.ComboBoxTextSelectionStrategy.W3C;
            }
            else {
                this._textSelectionStrategy =
                    Sys.Extended.UI.ComboBoxTextSelectionStrategy.Unknown;
            }
        }

        return this._textSelectionStrategy;

    },
    _getTextSelectionInfo: function (textBox, e) {

        // returns a helper object with information about textbox selection
        var info = new Object();

        // strategy
        info.strategy = this._getTextSelectionStrategy();

        // selectionStart & selectionEnd
        if (info.strategy == Sys.Extended.UI.ComboBoxTextSelectionStrategy.Microsoft) {
            var userRange = document.selection.createRange();
            info.selectionStart = 0;
            info.selectionEnd = textBox.value.length;
            while (userRange.moveStart('character', -1) != 0) {
                info.selectionStart++;
            }
            while (userRange.moveEnd('character', 1) != 0) {
                info.selectionEnd--;
            }
        }
        else if (info.strategy == Sys.Extended.UI.ComboBoxTextSelectionStrategy.W3C) {
            info.selectionStart = textBox.selectionStart;
            info.selectionEnd = textBox.selectionEnd;
        }

        // typedCharacter, textBoxValue, selectionPrefix, selectionSuffix, selectionTextFirst
        info.typedCharacter = String.fromCharCode(e.charCode);
        info.textBoxValue = textBox.value;
        info.selectionPrefix = (info.textBoxValue.length >= info.selectionStart)
            ? info.textBoxValue.substring(0, info.selectionStart)
            : '';
        info.selectionText = (info.textBoxValue.length >= info.selectionEnd)
            ? info.textBoxValue.substring(info.selectionStart, info.selectionEnd)
            : '';
        info.selectionSuffix = (info.textBoxValue.length >= info.selectionEnd)
            ? info.textBoxValue.substring(info.selectionEnd, info.textBoxValue.length)
            : '';
        info.selectionTextFirst = info.selectionText.substring(0, 1);

        return info;

    },
    _getOptionListItemHeight: function () {

        var optionListControl = this.get_optionListControl();

        // gets the height of an individual option list item
        if (this._optionListItemHeight == null && optionListControl.scrollHeight > 0) {
            this._optionListItemHeight = Math.round(optionListControl.scrollHeight / this._optionListItems.length);
        }
        else if (Sys.Browser.agent === Sys.Browser.InternetExplorer && Sys.Browser.version < 7
            && Math.round(optionListControl.scrollHeight / this._optionListItems.length) < this._optionListItemHeight) {
            this._optionListItemHeight = Math.round(optionListControl.scrollHeight / this._optionListItems.length);
        }
        return this._optionListItemHeight;

    },
    _getOptionListBounds: function () {

        var bounds = {
            width: this._getOptionListWidth(),
            height: this._getOptionListHeight()
        };
        return bounds;

    },
    _getOptionListHeight: function () {

        // gets the total height of the option list
        if (this._optionListHeight == null || (this._getOptionListItemHeight() * this._optionListItems.length) < this._optionListHeight) {
            // multiply the height of one item by the total number of items
            this._optionListHeight = this._getOptionListItemHeight() * this._optionListItems.length;
        }

        // protect against negative dimensions
        if (this._optionListHeight < 0) {
            this._optionListHeight = 0;
        }

        return this._optionListHeight;

    },
    _getOptionListWidth: function () {

        var optionListControl = this.get_optionListControl();

        // gets the width of the option list
        if (this._optionListWidth == null) {
            var leftBorder = 1;
            var rightBorder = 1;
            var leftPadding = 0;
            var rightPadding = 0;
            var style = optionListControl.style;


            // before doing anything, make sure overflow is auto
            style.overflow = 'auto';

            // first, default to the clientWidth of the container
            var bestWidth = this.get_comboTableControl().offsetWidth;

            // subtract borders from the offsetWidth
            bestWidth -= (leftBorder + rightBorder);
            if (bestWidth < 0) {
                bestWidth = 0;
            }

            // in order for ths list's scrollWidth to be correct, must set its width
            var originalWidth = style.width;
            style.width = bestWidth + 'px';

            // now compare the list's scrollWidth to the box width
            if (this.get_comboTableControl().offsetWidth < optionListControl.scrollWidth) {
                // allow the list to extend as wide as necessary according to its contents
                bestWidth = optionListControl.scrollWidth + rightPadding + leftPadding;
            }

            // hide the overflow, as there shouldn't be any scrollbars needed now
            style.overflow = 'hidden';

            // reset the list's width style to its original setting
            style.width = originalWidth;

            this._optionListWidth = bestWidth;
        }

        // protect against negative dimensions
        if (this._optionListWidth < 0) {
            this._optionListWidth = 0;
        }

        return this._optionListWidth;

    },
    _getWindowBounds: function () {

        var bounds = {
            x: this._getScrollLeft(),
            y: this._getScrollTop(),
            width: this._getWindowWidth(),
            height: this._getWindowHeight()
        };
        return bounds;

    },
    _getWindowHeight: function () {

        var windowHeight = 0;
        if (typeof (window.innerHeight) == 'number') {
            windowHeight = window.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight) {
            windowHeight = document.documentElement.clientHeight;
        }
        else if (document.body && document.body.clientHeight) {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;

    },
    _getWindowWidth: function () {

        var windowWidth = 0;
        if (typeof (window.innerWidth) == 'number') {
            windowWidth = window.innerWidth;
        }
        else if (document.documentElement && document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        }
        else if (document.body && document.body.clientWidth) {
            windowWidth = document.body.clientWidth;
        }
        return windowWidth;

    },
    _getScrollTop: function () {

        var scrollTop = 0;
        if (typeof (window.pageYOffset) == 'number') {
            scrollTop = window.pageYOffset;
        }
        if (document.body && document.body.scrollTop) {
            scrollTop = document.body.scrollTop;
        }
        else if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        }
        return scrollTop;

    },
    _getScrollLeft: function () {

        var scrollLeft = 0;
        if (typeof (window.pageXOffset) == 'number') {
            scrollLeft = window.pageXOffset;
        }
        else if (document.body && document.body.scrollLeft) {
            scrollLeft = document.body.scrollLeft;
        }
        else if (document.documentElement && document.documentElement.scrollLeft) {
            scrollLeft = document.documentElement.scrollLeft;
        }
        return scrollLeft;

    },
    set_comboTableControl: function (value) {

        if (this._comboTableControl !== value) {
            this._comboTableControl = value;
            this.raisePropertyChanged('comboTableControl');
        }

    },
    get_comboTableControl: function () {

        return this._comboTableControl;

    },
    set_textBoxControl: function (value) {

        if (this._textBoxControl !== value) {
            this._textBoxControl = value;
            this.raisePropertyChanged('textBoxControl');
        }

    },
    get_textBoxControl: function () {

        return this._textBoxControl;

    },
    set_buttonControl: function (value) {

        if (this._buttonControl !== value) {
            this._buttonControl = value;
            this.raisePropertyChanged('buttonControl');
        }

    },
    get_buttonControl: function () {
        return this._buttonControl;
    },
    set_optionListControl: function (value) {

        if (this._optionListControl !== value) {
            this._optionListControl = value;
            this.raisePropertyChanged('optionListControl');
        }

    },
    get_optionListControl: function () {

        return this._optionListControl;

    },
    set_hiddenFieldControl: function (value) {

        if (this._hiddenFieldControl !== value) {
            this._hiddenFieldControl = value;
            this.raisePropertyChanged('hiddenFieldControl');
        }

    },
    get_hiddenFieldControl: function () {

        return this._hiddenFieldControl;

    },
    set_selectedIndex: function (value) {

        if (this.get_hiddenFieldControl().value !== value.toString()) {
            this.get_hiddenFieldControl().value = value.toString();
            this._ensureSelectedIndex();
            this.raisePropertyChanged('selectedIndex');
        }

    },
    get_selectedIndex: function () {

        this._ensureSelectedIndex();
        var selectedIndex = this.get_hiddenFieldControl().value;
        return parseInt(selectedIndex);

    },
    set_autoPostBack: function (value) {

        if (this._autoPostBack !== value) {
            this._autoPostBack = value;
            this.raisePropertyChanged('autoPostBack');
        }

    },
    get_autoPostBack: function () {

        return this._autoPostBack;

    },
    set_autoCompleteMode: function (value) {

        if (this._autoCompleteMode !== value) {
            this._autoCompleteMode = value;
            this.raisePropertyChanged('autoCompleteMode');
        }

    },
    get_autoCompleteMode: function () {

        return this._autoCompleteMode;

    },
    set_dropDownStyle: function (value) {

        if (this._dropDownStyle !== value) {
            this._dropDownStyle = value;
            this.raisePropertyChanged('dropDownStyle');
        }

    },
    get_dropDownStyle: function () {

        return this._dropDownStyle;

    },
    set_caseSensitive: function (value) {

        if (this._caseSensitive !== value) {
            this._caseSensitive = value;
            this.raisePropertyChanged('caseSensitive');
        }

    },
    get_caseSensitive: function () {

        return this._caseSensitive;

    },
    set_listItemHoverCssClass: function (value) {

        if (this._listItemHoverCssClass !== value) {
            this._listItemHoverCssClass = value;
            this.raisePropertyChanged('listItemHoverCssClass');
        }

    },
    get_listItemHoverCssClass: function () {

        return this._listItemHoverCssClass;

    }

};
Sys.Extended.UI.ComboBox.registerClass('Sys.Extended.UI.ComboBox', Sys.UI.Control);

var ComboBox_Elements = new Array();

Sys.Extended.UI.ComboBox.IsOpen = function (currentInstance) {
    var components = Sys.Application.getComponents();
    for (var i = 0; i < components.length; i++) {
        var component = components[i];
        if (Sys.Extended.UI.ComboBox.isInstanceOfType(component)) {
            if (component != currentInstance && component._popupBehavior._visible) {
                // hide popup of other instance of combobox
                component._popupBehavior.hide();
            }
        }
    }
};