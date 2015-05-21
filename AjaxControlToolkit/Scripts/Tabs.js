Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.TabStripPlacement = function() { }
Sys.Extended.UI.TabStripPlacement.prototype = {
    Top: 0,
    Bottom: 1,
    TopRight: 2,
    BottomRight: 3
}
Sys.Extended.UI.TabStripPlacement.registerEnum("Sys.Extended.UI.TabStripPlacement", true);

Sys.Extended.UI.UseVerticalStripPlacement = function() { }
Sys.Extended.UI.OnDemand = function() { }

Sys.Extended.UI.OnDemandMode = function() { }
Sys.Extended.UI.OnDemandMode.prototype = {
    None: 0,
    Always: 1,
    Once: 2
}
Sys.Extended.UI.OnDemandMode.registerEnum("Sys.Extended.UI.OnDemandMode", true);

Sys.Extended.UI.TabContainer = function(element) {
    Sys.Extended.UI.TabContainer.initializeBase(this, [element]);
    this._cachedActiveTabIndex = -1;
    this._activeTabIndex = -1;
    this._scrollBars = Sys.Extended.UI.ScrollBars.None;
    this._tabs = null;
    this._header = null;
    this._body = null;
    this._loaded = false;
    this._autoPostBackId = null;
    this._useVerticalStripPlacement = false;
    this._onDemand = false;
    this._pageRequestManager = null;
    this._tabStripPlacement = Sys.Extended.UI.TabStripPlacement.Top;
    this._app_onload$delegate = Function.createDelegate(this, this._app_onload);
}
Sys.Extended.UI.TabContainer.prototype = {

    add_activeTabChanged: function(handler) {
        this.get_events().addHandler("activeTabChanged", handler);
    },
    remove_activeTabChanged: function(handler) {
        this.get_events().removeHandler("activeTabChanged", handler);
    },
    raiseActiveTabChanged: function() {
        var eh = this.get_events().getHandler("activeTabChanged");
        if(eh)
            eh(this, Sys.EventArgs.Empty);
        if(this._autoPostBackId)
            __doPostBack(this._autoPostBackId, "activeTabChanged:" + this.get_activeTabIndex());
    },

    get_activeTabIndex: function() {
        if(this._cachedActiveTabIndex > -1)
            return this._cachedActiveTabIndex;
        return this._activeTabIndex;
    },
    set_activeTabIndex: function(valuePassed) {
        var value = valuePassed;
        if(!this.get_isInitialized()) {
            this._cachedActiveTabIndex = value;
        } else {
            if(value < -1)
                throw Error.argumentOutOfRange("value");
            if(value >= this.get_tabs().length)
                value = this.get_tabs().length - 1;
            if(value != this._activeTabIndex) {
                if(this._activeTabIndex != -1) {
                    var oldTab = this.get_tabs()[this._activeTabIndex];
                    oldTab._set_active(false);
                }

                var changed = (this._activeTabIndex != value);

                this._activeTabIndex = value;

                if(this._activeTabIndex != -1)
                    this.get_tabs()[this._activeTabIndex]._set_active(true);

                if(this._loaded && changed) {
                    if(this._onDemand) {
                        var activeTab = this.get_tabs()[this._activeTabIndex];
                        if(activeTab._onDemandMode != Sys.Extended.UI.OnDemandMode.None) {
                            if((activeTab._onDemandMode == Sys.Extended.UI.OnDemandMode.Once && activeTab._wasLoadedOnce == false)
                                || activeTab._onDemandMode == Sys.Extended.UI.OnDemandMode.Always) {
                                this._pageRequestManager.beginAsyncPostBack([activeTab._updatePanelID], null, null, false, null);
                                activeTab.set_wasLoadedOnce(true);
                            }
                        }
                    }
                    this.raiseActiveTabChanged();
                }
                this.raisePropertyChanged("activeTabIndex");
            }
        }
    },

    get_tabs: function() {
        if(this._tabs == null)
            this._tabs = [];
        return this._tabs;
    },

    get_activeTab: function() {
        if(this._activeTabIndex > -1)
            return this.get_tabs()[this._activeTabIndex];
        return null;
    },
    set_activeTab: function(value) {
        var i = Array.indexOf(this.get_tabs(), value);
        if(i == -1)
            throw Error.argument("value", Sys.Extended.UI.Resources.Tabs_ActiveTabArgumentOutOfRange);
        this.set_activeTabIndex(i);
    },

    get_autoPostBackId: function() {
        return this._autoPostBackId;
    },
    set_autoPostBackId: function(value) {
        this._autoPostBackId = value;
    },
    get_scrollBars: function() {
        return this._scrollBars;
    },
    set_scrollBars: function(value) {
        if(this._scrollBars != value) {
            this._scrollBars = value;
            this._invalidate();
            this.raisePropertyChanged("scrollBars");
        }
    },

    get_tabStripPlacement: function() {
        return this._tabStripPlacement;
    },
    set_tabStripPlacement: function(value) {
        if(this._tabStripPlacement != value) {
            this._tabStripPlacement = value;
            this._invalidate();
            this.raisePropertyChanged("tabStripPlacement");
        }
    },

    get_useVerticalStripPlacement: function() {
        return this._useVerticalStripPlacement;
    },
    set_useVerticalStripPlacement: function(value) {
        if(this._useVerticalStripPlacement != value) {
            this._useVerticalStripPlacement = value;
            this._invalidate();
            this.raisePropertyChanged("useVerticalStripPlacement");
        }
    },

    get_onDemand: function() {
        return this._onDemand;
    },
    set_onDemand: function(value) {
        if(this._onDemand != value) {
            this._onDemand = value;
            this._invalidate();
            this.raisePropertyChanged("onDemand");
        }
    },

    initialize: function() {
        Sys.Extended.UI.TabContainer.callBaseMethod(this, "initialize");

        var elt = this.get_element();
        this._header = $get(this.get_id() + "_header");
        this._body = $get(this.get_id() + "_body");

        // default classes
        $common.addCssClasses(elt, [
            "ajax__tab_container",
            "ajax__tab_default"
        ]);

        this._invalidate();
        if(this._onDemand)
            this._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
        Sys.Application.add_load(this._app_onload$delegate);
    },
    dispose: function() {
        $clearHandlers(this.get_element());
        Sys.Application.remove_load(this._app_onload$delegate);
        Sys.Extended.UI.TabContainer.callBaseMethod(this, "dispose");
    },
    getFirstTab: function(includeDisabled) {
        var tabs = this.get_tabs();
        for(var i = 0; i < tabs.length; i++)
            if(includeDisabled || tabs[i].get_enabled())
                return tabs[i];
        return null;
    },
    getLastTab: function(includeDisabled) {
        var tabs = this.get_tabs();
        for(var i = tabs.length - 1; i >= 0; i--)
            if(includeDisabled || tabs[i].get_enabled())
                return tabs[i];
        return null;
    },
    getNextTab: function(includeDisabled) {
        var tabs = this.get_tabs();
        var active = this.get_activeTabIndex();
        for(var i = 1; i < tabs.length; i++) {
            var tabIndex = (active + i) % tabs.length;
            var tab = tabs[tabIndex];
            if(includeDisabled || tab.get_enabled())
                return tab;
        }
        return null;
    },
    getPreviousTab: function(includeDisabled) {
        var tabs = this.get_tabs();
        var active = this.get_activeTabIndex();
        for(var i = 1; i < tabs.length; i++) {
            var tabIndex = (tabs.length + (active - i)) % tabs.length;
            var tab = tabs[tabIndex];
            if(includeDisabled || tab.get_enabled())
                return tab;
        }
        return null;
    },
    getNearestTab: function(includeDisabled) {
        var prev = this.getPreviousTab(includeDisabled);
        var next = this.getNextTab(includeDisabled);
        if(prev && prev.get_tabIndex() < this._activeTabIndex)
            return prev;
        else if(next && next.get_tabIndex() > this._activeTabIndex)
            return next;
        return null;
    },
    saveClientState: function() {
        var tabs = this.get_tabs();

        var tabEnabledState = [];
        var tabWasLoadedOnceState = [];
        for(var i = 0; i < tabs.length; i++) {
            Array.add(tabEnabledState, tabs[i].get_enabled());
            Array.add(tabWasLoadedOnceState, tabs[i].get_wasLoadedOnce());
        }
        var state = {
            ActiveTabIndex: this._activeTabIndex,
            TabEnabledState: tabEnabledState,
            TabWasLoadedOnceState: tabWasLoadedOnceState
        };
        return Sys.Serialization.JavaScriptSerializer.serialize(state);
    },
    _invalidate: function() {
        if(this.get_isInitialized()) {
            $common.removeCssClasses(this._body, [
                "ajax__scroll_horiz",
                "ajax__scroll_vert",
                "ajax__scroll_both",
                "ajax__scroll_auto",
                "ajax__scroll_none"
            ]);
            switch(this._scrollBars) {
                case Sys.Extended.UI.ScrollBars.Horizontal:
                    Sys.UI.DomElement.addCssClass(this._body, "ajax__scroll_horiz");
                    break;
                case Sys.Extended.UI.ScrollBars.Vertical:
                    Sys.UI.DomElement.addCssClass(this._body, "ajax__scroll_vert");
                    break;
                case Sys.Extended.UI.ScrollBars.Both:
                    Sys.UI.DomElement.addCssClass(this._body, "ajax__scroll_both");
                    break;
                case Sys.Extended.UI.ScrollBars.Auto:
                    Sys.UI.DomElement.addCssClass(this._body, "ajax__scroll_auto");
                    break;
                case Sys.Extended.UI.ScrollBars.None:
                    Sys.UI.DomElement.addCssClass(this._body, "ajax__scroll_none");
                    break;
            }
            if(this._useVerticalStripPlacement) {
                var headBounds = $common.getBounds(this._header);
                var bodyBounds = $common.getBounds(this._body);
                var spannerHeight = (bodyBounds.height - headBounds.height - 1) + "px";
                $get(this.get_id() + "_headerSpannerHeight").style.height = spannerHeight;

                if(Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version < 7) {
                    if(this._tabStripPlacement == Sys.Extended.UI.TabStripPlacement.Top ||
                        this._tabStripPlacement == Sys.Extended.UI.TabStripPlacement.Bottom) {
                        var newBounds = {
                            x: headBounds.x + headBounds.width,
                            y: headBounds.y,
                            width: bodyBounds.width,
                            height: bodyBounds.height
                        };
                        $common.setBounds(this._body, newBounds);
                    } else {
                        var newBounds = {
                            x: bodyBounds.x + bodyBounds.width,
                            y: headBounds.y,
                            width: headBounds.width,
                            height: headBounds.height
                        };
                        $common.setBounds(this._header, newBounds);
                        $common.setBounds(this._body, bodyBounds);
                    }
                }
            }
        }
    },
    _app_onload: function(sender, e) {
        if(this._cachedActiveTabIndex != -1) {
            this.set_activeTabIndex(this._cachedActiveTabIndex);
            this._cachedActiveTabIndex = -1;

            var activeTab = this.get_tabs()[this._activeTabIndex];
            if(activeTab) {
                activeTab.set_wasLoadedOnce(true);
                activeTab._setFocus(activeTab);
            }
        }
        this._loaded = true;
    }
}
Sys.Extended.UI.TabContainer.registerClass("Sys.Extended.UI.TabContainer", Sys.Extended.UI.ControlBase);

Sys.Extended.UI.TabPanel = function(element) {
    Sys.Extended.UI.TabPanel.initializeBase(this, [element]);
    this._active = false;
    this._tab = null;
    this._headerOuter = null;
    this._headerInner = null;
    this._header = null;
    this._owner = null;
    this._ownerID = null;
    this._enabled = true;
    this._tabIndex = -1;
    this._dynamicContextKey = null;
    this._dynamicServicePath = null;
    this._dynamicServiceMethod = null;
    this._dynamicPopulateBehavior = null;
    this._scrollBars = Sys.Extended.UI.ScrollBars.None;
    this._onDemandMode = Sys.Extended.UI.OnDemandMode.Always;
    this._wasLoadedOnce = false;
    this._updatePanelID = "";
    this.isAttachedDisabledEvents = false;
    this.isAttachedEnabledEvents = false;
    this._dynamicPopulate_onpopulated$delegate = Function.createDelegate(this, this._dynamicPopulate_onpopulated);

    _oncancel$delegate = Function.createDelegate(this, this._oncancel);

    this._headerEventHandlers = {
        mousedown: Function.createDelegate(this, this._header_onmousedown),
        dragstart: _oncancel$delegate,
        selectstart: _oncancel$delegate,
        select: _oncancel$delegate
    };

    this._enabledHeaderEventHandlers = {
        click: Function.createDelegate(this, this._header_onclick),
        mouseover: Function.createDelegate(this, this._header_onmouseover),
        mouseout: Function.createDelegate(this, this._header_onmouseout),
        keydown: Function.createDelegate(this, this._onkeydown),
    };
}

Sys.Extended.UI.TabPanel.prototype = {

    add_click: function(handler) {
        this.get_events().addHandler("click", handler);
    },
    remove_click: function(handler) {
        this.get_events().removeHandler("click", handler);
    },
    raiseClick: function() {
        var eh = this.get_events().getHandler("click");
        if(eh)
            eh(this, Sys.EventArgs.Empty);
    },

    add_populating: function(handler) {
        this.get_events().addHandler("populating", handler);
    },
    remove_populating: function(handler) {
        this.get_events().removeHandler("populating", handler);
    },
    raisePopulating: function() {
        var eh = this.get_events().getHandler("populating");
        if(eh)
            eh(this, Sys.EventArgs.Empty);
    },

    add_populated: function(handler) {
        this.get_events().addHandler("populated", handler);
    },
    remove_populated: function(handler) {
        this.get_events().removeHandler("populated", handler);
    },
    raisePopulated: function() {
        var eh = this.get_events().getHandler("populated");
        if(eh)
            eh(this, Sys.EventArgs.Empty);
    },

    get_headerText: function() {
        if(this.get_isInitialized())
            return this._header.innerHTML;
        return "";
    },
    set_headerText: function(value) {
        if(!this.get_isInitialized())
            throw Error.invalidOperation(String.format(Sys.Extended.UI.Resources.Tabs_PropertySetBeforeInitialization, 'headerText'));
        if(this.get_headerText() != value) {
            this._header.innerHTML = value;
            this.raisePropertyChanged("headerText");
        }
    },

    get_headerTab: function() {
        return this._header;
    },
    set_headerTab: function(value) {
        if(typeof (value) === "string") {
            value = Sys.get(value);
            if(!value)
                throw new Error.argumentNull("value");
        }
        if(this._header != value) {
            if(this.get_isInitialized())
                throw Error.invalidOperation(String.format(Sys.Extended.UI.Resources.Tabs_PropertySetAfterInitialization, 'headerTab'));
            this._header = value;
            this.raisePropertyChanged("value");
        }
    },

    get_enabled: function() {
        return this._enabled;
    },
    set_enabled: function(value) {
        if(value != this._enabled) {
            this._enabled = value;
            if(this.get_isInitialized())
                this._makeEnabled(this._enabled);
            this.raisePropertyChanged("enabled");
        }
    },

    get_owner: function() {
        return this._owner;
    },
    set_owner: function(value) {
        if(value instanceof Sys.ComponentSet) value = value.get(0);
        if(this._owner != value) {
            if(this.get_isInitialized())
                throw Error.invalidOperation(String.format(Sys.Extended.UI.Resources.Tabs_PropertySetAfterInitialization, 'owner'));
            this._owner = value;
            this.raisePropertyChanged("owner");
        }
    },

    get_ownerID: function() {
        return this._ownerID;
    },
    set_ownerID: function(value) {
        this._ownerID = value;
    },

    get_scrollBars: function() {
        return this._scrollBars;
    },
    set_scrollBars: function(value) {
        if(this._scrollBars != value) {
            this._scrollBars = value;
            this.raisePropertyChanged("scrollBars");
        }
    },

    get_onDemandMode: function() {
        return this._onDemandMode;
    },
    set_onDemandMode: function(value) {
        if(this._onDemandMode != value) {
            this._onDemandMode = value;
            this.raisePropertyChanged("onDemandMode");
        }
    },

    get_tabIndex: function() {
        return this._tabIndex;
    },

    get_dynamicContextKey: function() {
        return this._dynamicContextKey;
    },
    set_dynamicContextKey: function(value) {
        if(this._dynamicContextKey != value) {
            this._dynamicContextKey = value;
            this.raisePropertyChanged('dynamicContextKey');
        }
    },

    get_dynamicServicePath: function() {
        return this._dynamicServicePath;
    },
    set_dynamicServicePath: function(value) {
        if(this._dynamicServicePath != value) {
            this._dynamicServicePath = value;
            this.raisePropertyChanged('dynamicServicePath');
        }
    },

    get_dynamicServiceMethod: function() {
        return this._dynamicServiceMethod;
    },
    set_dynamicServiceMethod: function(value) {
        if(this._dynamicServiceMethod != value) {
            this._dynamicServiceMethod = value;
            this.raisePropertyChanged('dynamicServiceMethod');
        }
    },

    _get_active: function() {
        return this._active;
    },
    _set_active: function(value) {
        this._active = value;
        if(value)
            this._activate();
        else
            this._deactivate();
    },

    get_updatePanelID: function() {
        return this._updatePanelID;
    },
    set_updatePanelID: function(value) {
        if(this._updatePanelID != value) {
            this._updatePanelID = value;
            this.raisePropertyChanged("updatePanelID");
        }
    },

    get_wasLoadedOnce: function() {
        return this._wasLoadedOnce;
    },
    set_wasLoadedOnce: function(value) {
        if(value != this._wasLoadedOnce) {
            this._wasLoadedOnce = value;
            this.raisePropertyChanged("wasLoadedOnce");
        }
    },

    initialize: function() {
        var owner = this.get_owner();
        if(!owner) {
            owner = $find(this.get_ownerID());
            if(owner) {
                owner.initialize();
                this.set_owner(owner);
            }
        }

        Sys.Extended.UI.TabPanel.callBaseMethod(this, "initialize");

        if(!owner)
            throw Error.invalidOperation(Sys.Extended.UI.Resources.Tabs_OwnerExpected);

        this._tabIndex = owner.get_tabs().length;

        Array.add(owner.get_tabs(), this);
        var tabId = this.get_id() + "_tab";
        this._tab = document.getElementById(tabId);

        this._makeEnabled(this._enabled);

        $addHandlers(this._header, this._headerEventHandlers);

        var serverRendered = (this._tab != null);
        if(!serverRendered) {
            this._headerOuterWrapper = document.createElement('span');
            this._headerInnerWrapper = document.createElement('span');
            this._tab = document.createElement('span');
            this._tab.id = tabId;
            this._header.parentNode.replaceChild(this._tab, this._header);
            this._tab.appendChild(this._headerOuterWrapper);
            this._headerOuterWrapper.appendChild(this._headerInnerWrapper);
            this._headerInnerWrapper.appendChild(this._header);

            Sys.UI.DomElement.addCssClass(this._headerOuterWrapper, "ajax__tab_outer");
            Sys.UI.DomElement.addCssClass(this._headerInnerWrapper, "ajax__tab_inner");
            Sys.UI.DomElement.addCssClass(this._header, "ajax__tab_tab");
            Sys.UI.DomElement.addCssClass(this.get_element(), "ajax__tab_panel");
        }
    },

    dispose: function() {
        if(this._dynamicPopulateBehavior) {
            this._dynamicPopulateBehavior.dispose();
            this._dynamicPopulateBehavior = null;
        }

        $common.removeHandlers(this._header, this._headerEventHandlers);
        
        if(this._enabled)
            if(this._isAttachedEnabledEvents)
                this._removeHandlersOnEnabled();
            else
                if(this._isAttachedDisabledEvents)
                    $common.removeHandlers(this._header, {
                        click: this._disabled_onclick
                    });

        Sys.Extended.UI.TabPanel.callBaseMethod(this, "dispose");
    },

    _addHandlersOnEnabled: function() {
        $addHandlers(this._header, this._enabledHeaderEventHandlers);
        this._isAttachedEnabledEvents = true;
    },

    _removeHandlersOnEnabled: function() {
        $common.removeHandlers(this._header, this._enabledHeaderEventHandlers);
    },

    populate: function(contextKeyOverride) {
        if(this._dynamicPopulateBehavior && (this._dynamicPopulateBehavior.get_element() != this.get_element())) {
            this._dynamicPopulateBehavior.dispose();
            this._dynamicPopulateBehavior = null;
        }

        if(!this._dynamicPopulateBehavior && this._dynamicServiceMethod)
            this._dynamicPopulateBehavior = $create(Sys.Extended.UI.DynamicPopulateBehavior,
                { "ContextKey": this._dynamicContextKey, "ServicePath": this._dynamicServicePath, "ServiceMethod": this._dynamicServiceMethod },
                { "populated": this._dynamicPopulate_onpopulated$delegate }, null, this.get_element());

        if(this._dynamicPopulateBehavior) {
            this.raisePopulating();
            this._dynamicPopulateBehavior.populate(contextKeyOverride ? contextKeyOverride : this._dynamicContextKey);
        }
    },

    _activate: function() {
        if(this._enabled) {
            $common.setVisible(this.get_element(), true);

            Sys.UI.DomElement.addCssClass(this._tab, "ajax__tab_active");

            this.populate();
        } else if(this._get_active()) {
            var next = this._owner.getNearestTab(false);
            if(!!next)
                this._owner.set_activeTab(next);
        }
        this._owner.get_element().style.visibility = 'visible';
    },

    _deactivate: function() {
        $common.setVisible(this.get_element(), false);

        Sys.UI.DomElement.addCssClass(this._tab, "ajax__tab_disabled");
        Sys.UI.DomElement.removeCssClass(this._tab, "ajax__tab_active");
    },

    _show: function() {
        this._tab.style.display = '';
    },
    _hide: function() {
        this._tab.style.display = 'none';
        if(this._get_active()) {
            var next = this._owner.getNearestTab(false);
            if(!!next)
                this._owner.set_activeTab(next);
        }
        this._deactivate();
    },

    _makeEnabled: function(enable) {
        var hyperlinkId = "__tab_" + this.get_element().id;

        if(enable) {
            if(this._isAttachedDisabledEvents) {
                $common.removeHandlers(this._header, {
                    click: this._disabled_onclick
                });
                this._isAttachedDisabledEvents = false;
            }
            this._addHandlersOnEnabled();
            Sys.UI.DomElement.removeCssClass($get(hyperlinkId), "ajax__tab_disabled");
        } else {
            if(this._isAttachedEnabledEvents) {
                this._removeHandlersOnEnabled();
                this._isAttachedEnabledEvents = false;
            }
            $addHandlers(this._header, {
                click: this._disabled_onclick
            });
            this._isAttachedDisabledEvents = true;
            if(this._get_active()) {
                var next = this._owner.getNearestTab(false);
                if(!!next)
                    this._owner.set_activeTab(next);
            }
            this._deactivate();
            Sys.UI.DomElement.addCssClass($get(hyperlinkId), "ajax__tab_disabled");
        }
    },
    _setFocus: function(obj) {
        var tabEl = $get("__tab_" + obj.get_element().id);
        if(tabEl.offsetHeight === 0)
            return;
        
        tabEl.focus();
    },
    _header_onclick: function(e) {
        e.preventDefault();
        this.raiseClick();
        this.get_owner().set_activeTab(this);
        this._setFocus(this);
    },
    _header_onmouseover: function(e) {
        Sys.UI.DomElement.addCssClass(this._tab, "ajax__tab_hover");
    },
    _header_onmouseout: function(e) {
        Sys.UI.DomElement.removeCssClass(this._tab, "ajax__tab_hover");
    },
    _header_onmousedown: function(e) {
        e.preventDefault();
    },
    _oncancel: function(e) {
        e.stopPropagation();
        e.preventDefault();
    },
    _onkeydown: function(e) {
        var keyCode = ('which' in e) ? e.which : e.keyCode;
        //right or down
        if((keyCode == "39" && !this._owner._useVerticalStripPlacement) || (keyCode == "40" && this._owner._useVerticalStripPlacement))  {
            e.preventDefault();
            var next = this._owner.getNextTab(false);
            if(next) {
                this._owner.set_activeTab(next);
                this._setFocus(next);
            }
        }
        //left or up
        else if((keyCode == "37" && !this._owner._useVerticalStripPlacement) || (keyCode == "38" && this._owner._useVerticalStripPlacement)) {
            e.preventDefault();
            var next = this._owner.getPreviousTab(false);
            if(next) {
                this._owner.set_activeTab(next);
                this._setFocus(next);
            }
        }
        // end   
        else if(keyCode == "35") {
            e.preventDefault();
            var next = this._owner.getLastTab(false);
            if(next) {
                this._owner.set_activeTab(next);
                this._setFocus(next);
            }
        }
        //home
        else if(keyCode == "36") {
            e.preventDefault();
            var next = this._owner.getFirstTab(false);
            if(next) {
                this._owner.set_activeTab(next);
                this._setFocus(next);
            }
        }
    },
    _dynamicPopulate_onpopulated: function(sender, e) {
        this.raisePopulated();
    },
    _disabled_onclick: function(e) {
        e.preventDefault();
    }
}
Sys.Extended.UI.TabPanel.registerClass("Sys.Extended.UI.TabPanel", Sys.UI.Control);