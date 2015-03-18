Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.AutoCompleteBehavior = function(element) {
    // This behavior can be attached to a textbox to enable auto-complete/auto-suggest scenarios.
    // "element" - DOM Element the behavior is associated with
    Sys.Extended.UI.AutoCompleteBehavior.initializeBase(this, [element]);
    
    // Path to the web service, or null if a page method
    this._servicePath = null;
    
    // Name of the web method
    this._serviceMethod = null;
    
    // User/page specific context provided to the web method
    this._contextKey = null;
    
    // Whether or not the the user/page specific context should be used
    this._useContextKey = false;
    this._minimumPrefixLength = 3;
    this._completionSetCount = 10;
    this._completionInterval = 1000;        
    this._completionListElementID = null;
    this._completionListElement = null;
    this._textColor = 'windowtext';
    this._textBackground = 'window';
    this._popupBehavior = null;
    this._popupBehaviorHiddenHandler = null;
    this._onShowJson = null;
    this._onHideJson = null;
    this._timer = null;
    this._cache = null;
    this._currentPrefix = null;
    this._selectIndex = -1;
    this._focusHandler = null;
    this._blurHandler = null;
    this._bodyClickHandler = null;
    this._completionListBlurHandler = null;        
    this._keyDownHandler = null;
    this._mouseDownHandler = null;
    this._mouseUpHandler = null;
    this._mouseOverHandler = null;
    this._tickHandler = null;
    this._enableCaching = true;
    this._flyoutHasFocus = false;
    this._textBoxHasFocus = false;
    this._completionListCssClass = null;
    this._completionListItemCssClass = null;
    this._highlightedItemCssClass = null;
    this._delimiterCharacters = null;
    this._firstRowSelected = false;
    this._showOnlyCurrentWordInCompletionListItem = false;
    // WebRequest object returned from WebServiceProxy.invoke
    this._webRequest = null;  
    
}
Sys.Extended.UI.AutoCompleteBehavior.prototype = {
    initialize: function() {
        Sys.Extended.UI.AutoCompleteBehavior.callBaseMethod(this, 'initialize');
        $common.prepareHiddenElementForATDeviceUpdate();

        this._popupBehaviorHiddenHandler = Function.createDelegate(this, this._popupHidden);
        this._tickHandler = Function.createDelegate(this, this._onTimerTick);
        this._focusHandler = Function.createDelegate(this, this._onGotFocus);
        this._blurHandler = Function.createDelegate(this, this._onLostFocus);
        this._keyDownHandler = Function.createDelegate(this, this._onKeyDown);
        this._mouseDownHandler = Function.createDelegate(this, this._onListMouseDown);
        this._mouseUpHandler = Function.createDelegate(this, this._onListMouseUp);
        this._mouseOverHandler = Function.createDelegate(this, this._onListMouseOver);
        this._completionListBlurHandler = Function.createDelegate(this, this._onCompletionListBlur);
        this._bodyClickHandler = Function.createDelegate(this, this._onCompletionListBlur);


        this._timer = new Sys.Timer();
        this.initializeTimer(this._timer);

        var element = this.get_element();
        this.initializeTextBox(element);

        if (this._completionListElementID !== null)
            this._completionListElement = $get(this._completionListElementID);
        if (this._completionListElement == null) {
            this._completionListElement = document.createElement('ul');
            this._completionListElement.id = this.get_id() + '_completionListElem';

            // Safari styles the element incorrectly if it's added to the desired location
            if (Sys.Browser.agent === Sys.Browser.Safari) {
                document.body.appendChild(this._completionListElement);
            } else {
                element.parentNode.insertBefore(this._completionListElement, element.nextSibling);
            }
        }
        this.initializeCompletionList(this._completionListElement);

        this._popupBehavior = $create(Sys.Extended.UI.PopupBehavior,
                { 'id': this.get_id() + 'PopupBehavior', 'parentElement': element, "positioningMode": Sys.Extended.UI.PositioningMode.BottomLeft }, null, null, this._completionListElement);
        this._popupBehavior.add_hidden(this._popupBehaviorHiddenHandler);

        // Create the animations (if they were set before initialize was called)
        if (this._onShowJson) {
            this._popupBehavior.set_onShow(this._onShowJson);
        }
        if (this._onHideJson) {
            this._popupBehavior.set_onHide(this._onHideJson);
        }
    },

    dispose: function() {
        this._onShowJson = null;
        this._onHideJson = null;
        if (this._popupBehavior) {
            if (this._popupBehaviorHiddenHandler) {
                this._popupBehavior.remove_hidden(this._popupBehaviorHiddenHandler);
            }
            this._popupBehavior.dispose();
            this._popupBehavior = null;
        }
        if (this._timer) {
            this._timer.dispose();
            this._timer = null;
        }

        var element = this.get_element();
        if (element) {
            $removeHandler(element, "focus", this._focusHandler);
            $removeHandler(element, "blur", this._blurHandler);
            $removeHandler(element, "keydown", this._keyDownHandler);
            $removeHandler(this._completionListElement, 'blur', this._completionListBlurHandler);
            $removeHandler(this._completionListElement, 'mousedown', this._mouseDownHandler);
            $removeHandler(this._completionListElement, 'mouseup', this._mouseUpHandler);
            $removeHandler(this._completionListElement, 'mouseover', this._mouseOverHandler);
        }
        if (this._bodyClickHandler) {
            $removeHandler(document.body, 'click', this._bodyClickHandler);
            this._bodyClickHandler = null;
        }

        this._popupBehaviorHiddenHandler = null;
        this._tickHandler = null;
        this._focusHandler = null;
        this._blurHandler = null;
        this._keyDownHandler = null;
        this._completionListBlurHandler = null;
        this._mouseDownHandler = null;
        this._mouseUpHandler = null;
        this._mouseOverHandler = null;

        Sys.Extended.UI.AutoCompleteBehavior.callBaseMethod(this, 'dispose');
    },

    initializeTimer: function(timer) {
        timer.set_interval(this._completionInterval);
        timer.add_tick(this._tickHandler);
    },

    initializeTextBox: function(element) {
        element.autocomplete = "off";
        $addHandler(element, "focus", this._focusHandler);
        $addHandler(element, "blur", this._blurHandler);
        $addHandler(element, "keydown", this._keyDownHandler);
    },

    initializeCompletionList: function(element) {
        if (this._completionListCssClass) {
            Sys.UI.DomElement.addCssClass(element, this._completionListCssClass);
        } else {
            var completionListStyle = element.style;
            completionListStyle.textAlign = 'left';
            completionListStyle.visibility = 'hidden';
            completionListStyle.cursor = 'default';
            completionListStyle.listStyle = 'none';
            completionListStyle.padding = '0px';
            completionListStyle.margin = '0px! important';
            if (Sys.Browser.agent === Sys.Browser.Safari) {
                completionListStyle.border = 'solid 1px gray';
                completionListStyle.backgroundColor = 'white';
                completionListStyle.color = 'black';
            } else {
                completionListStyle.border = 'solid 1px buttonshadow';
                completionListStyle.backgroundColor = this._textBackground;
                completionListStyle.color = this._textColor;
            }
        }
        $addHandler(element, "mousedown", this._mouseDownHandler);
        $addHandler(element, "mouseup", this._mouseUpHandler);
        $addHandler(element, "mouseover", this._mouseOverHandler);
        $addHandler(element, "blur", this._completionListBlurHandler);
        $addHandler(document.body, 'click', this._bodyClickHandler);
    },

    _currentCompletionWord: function() {
        var element = this.get_element();
        var elementValue = element.value;
        var word = elementValue;

        if (this.get_isMultiWord()) {
            var startIndex = this._getCurrentWordStartIndex();
            var endIndex = this._getCurrentWordEndIndex(startIndex);

            if (endIndex <= startIndex) {
                word = elementValue.substring(startIndex);
            } else {
                word = elementValue.substring(startIndex, endIndex);
            }
        }

        return word;
    },

    _getCursorIndex: function() {
        return this.get_element().selectionStart;
    },

    _getCurrentWordStartIndex: function() {
        var element = this.get_element();
        var elementText = element.value.substring(0, this._getCursorIndex());

        var index = 0;
        var lastIndex = -1;

        for (var i = 0; i < this._delimiterCharacters.length; ++i) {
            var curIndex = elementText.lastIndexOf(this._delimiterCharacters.charAt(i));
            if (curIndex > lastIndex) {
                lastIndex = curIndex;
            }
        }

        index = lastIndex;
        if (index >= this._getCursorIndex()) {
            index = 0;
        }

        return index < 0 ? 0 : index + 1;
    },

    _getCurrentWordEndIndex: function(wordStartIndex) {
        var element = this.get_element();
        var elementText = element.value.substring(wordStartIndex);
        var index = 0;

        for (var i = 0; i < this._delimiterCharacters.length; ++i) {
            var curIndex = elementText.indexOf(this._delimiterCharacters.charAt(i));
            if (curIndex > 0 && (curIndex < index || index == 0)) {
                index = curIndex;
            }
        }

        return index <= 0 ? element.value.length : index + wordStartIndex;
    },

    get_isMultiWord: function() {
        // Whether the behavior is currently in multi-word mode
        return (this._delimiterCharacters != null) && (this._delimiterCharacters != '');
    },

    _getTextWithInsertedWord: function(wordToInsert) {
        var text = wordToInsert;
        var replaceIndex = 0;
        var element = this.get_element();
        var originalText = element.value;

        if (this.get_isMultiWord()) {
            var startIndex = this._getCurrentWordStartIndex();
            var endIndex = this._getCurrentWordEndIndex(startIndex);
            var prefix = '';
            var suffix = '';

            if (startIndex > 0) {
                prefix = originalText.substring(0, startIndex);
            }
            if (endIndex > startIndex) {
                suffix = originalText.substring(endIndex);
            }

            text = prefix + wordToInsert + suffix;
        }

        return text;
    },

    _hideCompletionList: function() {
        var eventArgs = new Sys.CancelEventArgs();
        this.raiseHiding(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }

        // Actually hide the popup
        this.hidePopup();
    },

    showPopup: function() {
        // If you cancel the showing event, you should still call
        // showPopup to ensure consistency of the internal state
        this._popupBehavior.show();
        this.raiseShown(Sys.EventArgs.Empty);
    },

    hidePopup: function() {
        // If you cancel the hiding event, you should still
        // call hidePopup to ensure consistency of the internal
        // state

        if (this._popupBehavior) {
            this._popupBehavior.hide();
        } else {
            this._popupHidden();
        }
    },

    _popupHidden: function() {
        // Clean up the completion list popup after it has been hidden
        this._completionListElement.innerHTML = '';
        this._selectIndex = -1;
        this._flyoutHasFocus = false;

        this.raiseHidden(Sys.EventArgs.Empty);
    },

    _highlightItem: function(item) {
        var children = this._completionListElement.childNodes;

        // Unselect any previously highlighted item
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child._highlighted) {
                if (this._completionListItemCssClass) {
                    Sys.UI.DomElement.removeCssClass(child, this._highlightedItemCssClass);
                    Sys.UI.DomElement.addCssClass(child, this._completionListItemCssClass);
                } else {
                    if (Sys.Browser.agent === Sys.Browser.Safari) {
                        child.style.backgroundColor = 'white';
                        child.style.color = 'black';
                    } else {
                        child.style.backgroundColor = this._textBackground;
                        child.style.color = this._textColor;
                    }
                }
                this.raiseItemOut(new Sys.Extended.UI.AutoCompleteItemEventArgs(child, child.firstChild.nodeValue, child._value));
            }
        }

        // Highlight the new item
        if (this._highlightedItemCssClass) {
            Sys.UI.DomElement.removeCssClass(item, this._completionListItemCssClass);
            Sys.UI.DomElement.addCssClass(item, this._highlightedItemCssClass);
        } else {
            if (Sys.Browser.agent === Sys.Browser.Safari) {
                item.style.backgroundColor = 'lemonchiffon';
            } else {
                item.style.backgroundColor = 'highlight';
                item.style.color = 'highlighttext';
            }

        }
        item._highlighted = true;
        this.raiseItemOver(new Sys.Extended.UI.AutoCompleteItemEventArgs(item, item.firstChild.nodeValue, item._value));
    },

    _onCompletionListBlur: function(ev) {
        this._hideCompletionList();
    },

    _onListMouseDown: function(ev) {
        if (ev.target !== this._completionListElement) {
            this._setText(ev.target);
            this._flyoutHasFocus = false;
        } else { // focus is still on the flyout and we do not want to hide it
            this._flyoutHasFocus = true;
        }
    },

    _onListMouseUp: function(ev) {
        if(this._flyoutHasFocus)
            return;

        try { this.get_element().focus(); } catch (e) { }
    },

    _onListMouseOver: function(ev) {
        var item = ev.target;
        if (item !== this._completionListElement) {
            var children = this._completionListElement.childNodes;
            // make sure the selected index is updated
            for (var i = 0; i < children.length; ++i) {
                if (item === children[i]) {
                    this._highlightItem(item);
                    this._selectIndex = i;
                    break;
                }
            }
        }
    },

    _onGotFocus: function(ev) {
        this._textBoxHasFocus = true;
        if (this._flyoutHasFocus) {
            // hide the flyout now that the focus is back on the textbox
            this._hideCompletionList();
        }
        if ((this._minimumPrefixLength == 0) && (!this.get_element().value)) {
            this._timer.set_enabled(true);
            // only start the timer if the minimumprefixlength is 0
            // since we would like to retrieve results even if
            // the user has not entered any text and the textbox is empty.
        }
    },

    _onKeyDown: function(ev) {
        // If textbox had focus on page load, _onGotFocus() would not have been called.
        // So if a user started typing, then focus is obviously on the textbox.
        this._textBoxHasFocus = true;

        this._timer.set_enabled(false);
        // the last key press occured so we need to "reset" the timer.
        var k = ev.keyCode ? ev.keyCode : ev.rawEvent.keyCode;
        if (k === Sys.UI.Key.esc) {
            this._hideCompletionList();
            ev.preventDefault();
        }
        else if (k === Sys.UI.Key.up) {
            if (this._selectIndex > 0) {
                this._selectIndex--;
                this._handleScroll(this._completionListElement.childNodes[this._selectIndex], this._selectIndex);
                this._highlightItem(this._completionListElement.childNodes[this._selectIndex]);
                ev.stopPropagation();
                ev.preventDefault();
            }
        }
        else if (k === Sys.UI.Key.down) {
            if (this._selectIndex < (this._completionListElement.childNodes.length - 1)) {
                this._selectIndex++;
                this._handleScroll(this._completionListElement.childNodes[this._selectIndex], this._selectIndex);
                this._highlightItem(this._completionListElement.childNodes[this._selectIndex]);
                ev.stopPropagation();
                ev.preventDefault();
            }
        }
        else if (k === Sys.UI.Key.enter) {
            if (this._selectIndex !== -1) {
                this._setText(this._completionListElement.childNodes[this._selectIndex]);
                ev.preventDefault();
            } else {
                // close the popup
                this.hidePopup();
            }
        }
        else if (k === Sys.UI.Key.tab) {
            if (this._selectIndex !== -1) {
                this._setText(this._completionListElement.childNodes[this._selectIndex]);
            }
        }
        else {
            this._timer.set_enabled(true);
            // start the timer to retrieve results since now it is an actual key
        }
    },

    _handleScroll: function(element, index) {
        // Method to determine if an item is in view or not
        var flyout = this._completionListElement;
        var elemBounds = $common.getBounds(element);
        var numItems = this._completionListElement.childNodes.length;
        if (((elemBounds.height * index) - (flyout.clientHeight + flyout.scrollTop)) >= 0) {
            // you need to scroll down
            flyout.scrollTop += (((elemBounds.height * index) - (flyout.clientHeight + flyout.scrollTop)) + elemBounds.height);
        }
        if (((elemBounds.height * (numItems - (index + 1))) - (flyout.scrollHeight - flyout.scrollTop)) >= 0) {
            // you need to scroll up
            flyout.scrollTop -= (((elemBounds.height * (numItems - (index + 1))) - (flyout.scrollHeight - flyout.scrollTop)) + elemBounds.height);
        }

        if (flyout.scrollTop % elemBounds.height !== 0) {
            if (((elemBounds.height * (index + 1)) - (flyout.clientHeight + flyout.scrollTop)) >= 0) {
                // an element is partially displayed at the bottom
                flyout.scrollTop -= (flyout.scrollTop % elemBounds.height);
            } else { // an element is partially displayed on the top 
                flyout.scrollTop += (elemBounds.height - (flyout.scrollTop % elemBounds.height));
            }
        }

    },

    _handleFlyoutFocus: function() {
        // Method to handle flyout focus if textbox loses focus.
        if (!this._textBoxHasFocus) {
            if (!this._flyoutHasFocus) {
                if (this._webRequest) {
                    // abort the web service call if we are losing focus. no sense having it delay future web requests.
                    this._webRequest.get_executor().abort();
                    this._webRequest = null;
                }
                // the textbox lost focus and the flyout does not have it
                this._hideCompletionList();
            } else {
                // keep the flyout around otherwise
            }
        }
    },

    _onLostFocus: function() {        
        this._textBoxHasFocus = false;
        this._timer.set_enabled(false);
        /* the rest of the onblur handling will be done in
        this method after a minor delay to ensure we do not close the flyout 
        if a user clicks on its scroll bars for example */
        window.setTimeout(Function.createDelegate(this, this._handleFlyoutFocus), 500);
    },

    _onMethodComplete: function(result, context) {
        this._webRequest = null; // clear out our saved WebRequest object    
        this._update(context, result, /* cacheResults */true);
    },

    _onMethodFailed: function(err, response, context) {
        this._webRequest = null;
    },

    _onTimerTick: function(sender, eventArgs) {
        // turn off the timer until another key is pressed.
        this._timer.set_enabled(false);
        if (this._servicePath && this._serviceMethod) {
            var text = this._currentCompletionWord();

            if (text.trim().length < this._minimumPrefixLength) {
                this._currentPrefix = null;
                this._update('', null, /* cacheResults */false);
                return;
            }
            // there is new content in the textbox or the textbox is empty but the min prefix length is 0
            if ((this._currentPrefix !== text) || ((text == "") && (this._minimumPrefixLength == 0))) {
                this._currentPrefix = text;
                if ((text != "") && this._cache && this._cache[text]) {
                    this._update(text, this._cache[text], /* cacheResults */false);
                    return;
                }
                // Raise the populating event and optionally cancel the web service invocation
                var eventArgs = new Sys.CancelEventArgs();
                this.raisePopulating(eventArgs);
                if (eventArgs.get_cancel()) {
                    return;
                }

                // Create the service parameters and optionally add the context parameter
                // (thereby determining which method signature we're expecting...)
                var params = { prefixText: this._currentPrefix, count: this._completionSetCount };
                if (this._useContextKey) {
                    params.contextKey = this._contextKey;
                }

                if (this._webRequest) {
                    // abort the previous web service call if we 
                    // are issuing a new one and the previous one is 
                    // active.
                    this._webRequest.get_executor().abort();
                    this._webRequest = null;
                }
                // Invoke the web service
                this._webRequest = Sys.Net.WebServiceProxy.invoke(this.get_servicePath(), this.get_serviceMethod(), false, params,
                                            Function.createDelegate(this, this._onMethodComplete),
                                            Function.createDelegate(this, this._onMethodFailed),
                                            text);
                $common.updateFormToRefreshATDeviceBuffer();
            }
        }
    },

    _setText: function(item) {
        var text = (item && item.firstChild) ? item.firstChild.nodeValue : null;
        this._timer.set_enabled(false);

        var element = this.get_element();
        var control = element.control;
        var newText = this._showOnlyCurrentWordInCompletionListItem ? this._getTextWithInsertedWord(text) : text;
        if (control && control.set_text) {
            control.set_text(newText);
        } else {
            element.value = newText;
        }
        $common.tryFireEvent(element, "change");

        this.raiseItemSelected(new Sys.Extended.UI.AutoCompleteItemEventArgs(item, text, item ? item._value : null));

        this._currentPrefix = this._currentCompletionWord();
        this._hideCompletionList();
    },

    _update: function(prefixText, completionItems, cacheResults) {
        if (cacheResults && this.get_enableCaching()) {
            if (!this._cache) {
                this._cache = {};
            }
            this._cache[prefixText] = completionItems;
        }

        // If the target control loses focus or 
        // if the value in textbox has changed before the webservice returned
        // completion items we don't need to show popup 
        if ((!this._textBoxHasFocus) || (prefixText != this._currentCompletionWord())) {
            this._hideCompletionList();
            return;
        }

        if (completionItems && completionItems.length) {
            this._completionListElement.innerHTML = '';
            this._selectIndex = -1;
            var _firstChild = null;
            var text = null;
            var value = null;

            for (var i = 0; i < completionItems.length; i++) {
                // Create the item                
                var itemElement = null;
                if (this._completionListElementID) {
                    // the completion element has been created by the user and li won't necessarily work
                    itemElement = document.createElement('div');
                } else {
                    itemElement = document.createElement('li');
                }

                // set the first child if it is null
                if (_firstChild == null) {
                    _firstChild = itemElement;
                }

                // Get the text/value for the item
                try {
                    var pair = Sys.Serialization.JavaScriptSerializer.deserialize('(' + completionItems[i] + ')');
                    if (pair && pair.First) {
                        // Use the text and value pair returned from the web service
                        text = pair.First;
                        value = pair.Second;
                    }
                    else {
                        // If the web service only returned a regular string, use it for
                        // both the text and the value
                        text = completionItems[i];
                        value = text;
                    }
                } catch (ex) {
                    text = completionItems[i];
                    value = completionItems[i];
                }


                // Set the text/value for the item
                // ShowOnlyCurrentWordInCompletionListItem support
                var optionText = this._showOnlyCurrentWordInCompletionListItem ? text : this._getTextWithInsertedWord(text);
                itemElement.appendChild(document.createTextNode(optionText));
                itemElement._value = value;
                itemElement.__item = '';

                if (this._completionListItemCssClass) {
                    Sys.UI.DomElement.addCssClass(itemElement, this._completionListItemCssClass);
                } else {
                    var itemElementStyle = itemElement.style;
                    itemElementStyle.padding = '0px';
                    itemElementStyle.textAlign = 'left';
                    itemElementStyle.textOverflow = 'ellipsis';
                    // workaround for safari since normal colors do not
                    // show well there.
                    if (Sys.Browser.agent === Sys.Browser.Safari) {
                        itemElementStyle.backgroundColor = 'white';
                        itemElementStyle.color = 'black';
                    } else {
                        itemElementStyle.backgroundColor = this._textBackground;
                        itemElementStyle.color = this._textColor;
                    }
                }
                this._completionListElement.appendChild(itemElement);
            }
            var elementBounds = $common.getBounds(this.get_element());
            this._completionListElement.style.width = Math.max(1, elementBounds.width - 2) + 'px';
            this._completionListElement.scrollTop = 0;

            this.raisePopulated(Sys.EventArgs.Empty);

            var eventArgs = new Sys.CancelEventArgs();
            this.raiseShowing(eventArgs);
            if (!eventArgs.get_cancel()) {
                this.showPopup();
                // Check if the first Row is to be selected by default and if yes highlight it and updated selectIndex.
                if (this._firstRowSelected && (_firstChild != null)) {
                    this._highlightItem(_firstChild);
                    this._selectIndex = 0;
                }
            }
        } else {
            this._hideCompletionList();
        }
    },

    get_onShow: function() {
        // Generic OnShow Animation's JSON definition
        return this._popupBehavior ? this._popupBehavior.get_onShow() : this._onShowJson;
    },
    set_onShow: function(value) {
        if (this._popupBehavior) {
            this._popupBehavior.set_onShow(value)
        } else {
            this._onShowJson = value;
        }
        this.raisePropertyChanged('onShow');
    },
    get_onShowBehavior: function() {
        // Generic OnShow Animation's behavior
        return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
    },
    onShow: function() {
        if (this._popupBehavior) {
            this._popupBehavior.onShow();
        }
    },

    get_onHide: function() {
        return this._popupBehavior ? this._popupBehavior.get_onHide() : this._onHideJson;
    },
    set_onHide: function(value) {
        if (this._popupBehavior) {
            this._popupBehavior.set_onHide(value)
        } else {
            this._onHideJson = value;
        }
        this.raisePropertyChanged('onHide');
    },
    get_onHideBehavior: function() {
        return this._popupBehavior ? this._popupBehavior.get_onHideBehavior() : null;
    },
    onHide: function() {
        if (this._popupBehavior) {
            this._popupBehavior.onHide();
        }
    },

    get_completionInterval: function() {
        // Auto completion timer interval in milliseconds.
        return this._completionInterval;
    },
    set_completionInterval: function(value) {
        if (this._completionInterval != value) {
            this._completionInterval = value;
            this.raisePropertyChanged('completionInterval');
        }
    },

    get_completionList: function() {
        return this._completionListElement;
    },
    set_completionList: function(value) {
        if (this._completionListElement != value) {
            this._completionListElement = value;
            this.raisePropertyChanged('completionList');
        }
    },

    get_completionSetCount: function() {
        return this._completionSetCount;
    },
    set_completionSetCount: function(value) {
        if (this._completionSetCount != value) {
            this._completionSetCount = value;
            this.raisePropertyChanged('completionSetCount');
        }
    },

    get_minimumPrefixLength: function() {
        return this._minimumPrefixLength;
    },
    set_minimumPrefixLength: function(value) {
        if (this._minimumPrefixLength != value) {
            this._minimumPrefixLength = value;
            this.raisePropertyChanged('minimumPrefixLength');
        }
    },

    get_serviceMethod: function() {
        return this._serviceMethod;
    },
    set_serviceMethod: function(value) {
        if (this._serviceMethod != value) {
            this._serviceMethod = value;
            this.raisePropertyChanged('serviceMethod');
        }
    },

    get_servicePath: function() {
        return this._servicePath;
    },
    set_servicePath: function(value) {
        if (this._servicePath != value) {
            this._servicePath = value;
            this.raisePropertyChanged('servicePath');
        }
    },

    get_contextKey: function() {
        // User/page specific context provided to an optional overload of the
        // web method described by ServiceMethod/ServicePath.  If the context
        // key is used, it should have the same signature with an additional
        // parameter named contextKey of type string.
        return this._contextKey;
    },
    set_contextKey: function(value) {
        if (this._contextKey != value) {
            this._contextKey = value;
            this.set_useContextKey(true);
            this.raisePropertyChanged('contextKey');
        }
    },

    get_useContextKey: function() {
        // Whether or not the ContextKey property should be used.  This will be
        // automatically enabled if the ContextKey property is ever set
        // (on either the client or the server).  If the context key is used,
        // it should have the same signature with an additional parameter
        // named contextKey of type string.
        return this._useContextKey;
    },
    set_useContextKey: function(value) {
        if (this._useContextKey != value) {
            this._useContextKey = value;
            this.raisePropertyChanged('useContextKey');
        }
    },

    get_enableCaching: function() {
        // Get or sets whether suggestions retrieved from the webservice
        // should be cached.
        return this._enableCaching;
    },
    set_enableCaching: function(value) {
        if (this._enableCaching != value) {
            this._enableCaching = value;
            this.raisePropertyChanged('enableCaching');
        }
    },

    get_completionListElementID: function() {        
        return this._completionListElementID;
    },
    set_completionListElementID: function(value) {
        if (this._completionListElementID != value) {
            this._completionListElementID = value;
            this.raisePropertyChanged('completionListElementID');
        }
    },

    get_completionListCssClass: function() {
        return this._completionListCssClass;
    },
    set_completionListCssClass: function(value) {
        if (this._completionListCssClass != value) {
            this._completionListCssClass = value;
            this.raisePropertyChanged('completionListCssClass');
        }
    },

    get_completionListItemCssClass: function() {        
        return this._completionListItemCssClass;
    },
    set_completionListItemCssClass: function(value) {
        if (this._completionListItemCssClass != value) {
            this._completionListItemCssClass = value;
            this.raisePropertyChanged('completionListItemCssClass');
        }
    },

    get_highlightedItemCssClass: function() {
        return this._highlightedItemCssClass;
    },
    set_highlightedItemCssClass: function(value) {
        if (this._highlightedItemCssClass != value) {
            this._highlightedItemCssClass = value;
            this.raisePropertyChanged('highlightedItemCssClass');
        }
    },

    get_delimiterCharacters: function() {
        return this._delimiterCharacters;
    },
    set_delimiterCharacters: function(value) {
        if (this._delimiterCharacters != value) {
            this._delimiterCharacters = value;
            this.raisePropertyChanged('delimiterCharacters');
        }
    },

    get_firstRowSelected: function() {
        return this._firstRowSelected;
    },
    set_firstRowSelected: function(value) {
        if (this._firstRowSelected != value) {
            this._firstRowSelected = value;
            this.raisePropertyChanged('firstRowSelected');
        }
    },

    get_showOnlyCurrentWordInCompletionListItem: function() {
        // If Delimiter characters are specified and showOnlyCurrentWordInCompletionListItem is 
        // set to true, then the completion list displays suggestions just for the current word, 
        // otherwise, it displays the whole string that will show up in the TextBox if that
        // item is selected, which is the current default.
        return this._showOnlyCurrentWordInCompletionListItem;
    },
    set_showOnlyCurrentWordInCompletionListItem: function(value) {
        if (this._showOnlyCurrentWordInCompletionListItem != value) {
            this._showOnlyCurrentWordInCompletionListItem = value;
            this.raisePropertyChanged('showOnlyCurrentWordInCompletionListItem');
        }
    },

    add_populating: function(handler) {
        this.get_events().addHandler('populating', handler);
    },
    remove_populating: function(handler) {
        this.get_events().removeHandler('populating', handler);
    },
    raisePopulating: function(eventArgs) {
        // The populating event can be used to provide custom data to AutoComplete
        // instead of using a web service.  Just cancel the event (using the
        // CancelEventArgs) and pass your own data to the _update method.
        var handler = this.get_events().getHandler('populating');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_populated: function(handler) {
        this.get_events().addHandler('populated', handler);
    },
    remove_populated: function(handler) {
        this.get_events().removeHandler('populated', handler);
    },
    raisePopulated: function(eventArgs) {
        var handler = this.get_events().getHandler('populated');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_showing: function(handler) {
        this.get_events().addHandler('showing', handler);
    },
    remove_showing: function(handler) {
        this.get_events().removeHandler('showing', handler);
    },
    raiseShowing: function(eventArgs) {
        var handler = this.get_events().getHandler('showing');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_shown: function(handler) {
        this.get_events().addHandler('shown', handler);
    },
    remove_shown: function(handler) {
        this.get_events().removeHandler('shown', handler);
    },
    raiseShown: function(eventArgs) {
        var handler = this.get_events().getHandler('shown');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_hiding: function(handler) {
        this.get_events().addHandler('hiding', handler);
    },
    remove_hiding: function(handler) {
        this.get_events().removeHandler('hiding', handler);
    },
    raiseHiding: function(eventArgs) {
        var handler = this.get_events().getHandler('hiding');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_hidden: function(handler) {
        this.get_events().addHandler('hidden', handler);
    },
    remove_hidden: function(handler) {
        this.get_events().removeHandler('hidden', handler);
    },
    raiseHidden: function(eventArgs) {
        var handler = this.get_events().getHandler('hidden');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_itemSelected: function(handler) {
        this.get_events().addHandler('itemSelected', handler);
    },
    remove_itemSelected: function(handler) {
        this.get_events().removeHandler('itemSelected', handler);
    },
    raiseItemSelected: function(eventArgs) {
        var handler = this.get_events().getHandler('itemSelected');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_itemOver: function(handler) {
        this.get_events().addHandler('itemOver', handler);
    },
    remove_itemOver: function(handler) {
        this.get_events().removeHandler('itemOver', handler);
    },
    raiseItemOver: function(eventArgs) {
        var handler = this.get_events().getHandler('itemOver');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_itemOut: function(handler) {
        this.get_events().addHandler('itemOut', handler);
    },
    remove_itemOut: function(handler) {
        this.get_events().removeHandler('itemOut', handler);
    },
    raiseItemOut: function(eventArgs) {
        var handler = this.get_events().getHandler('itemOut');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
Sys.Extended.UI.AutoCompleteBehavior.registerClass('Sys.Extended.UI.AutoCompleteBehavior', Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.AutoCompleteItemEventArgs = function(item, text, value) {
    Sys.Extended.UI.AutoCompleteItemEventArgs.initializeBase(this);
    
    this._item = item;
    this._text = text;
    this._value = (value !== undefined) ? value : null;
}
Sys.Extended.UI.AutoCompleteItemEventArgs.prototype = {
    get_item : function() {
        return this._item;
    },
    set_item : function(value) {
        this._item = value;
    },
    
    get_text : function() {
        return this._text;
    },
    set_text : function(value) {
        this._text = value;
    },
    
    get_value : function() {
        // Value of the item different from text if specifically returned by the webservice
        // as autocomplete json text/value item(using AutoComplete.CreateAutoCompleteItem); otherwise same as text.
        return this._value;
    },
    set_value : function(value) {
        this._value = value;
    }
}
Sys.Extended.UI.AutoCompleteItemEventArgs.registerClass('Sys.Extended.UI.AutoCompleteItemEventArgs', Sys.EventArgs);