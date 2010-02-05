


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../DynamicPopulate/DynamicPopulateBehavior.js" />

(function() {
var scriptName = "ExtendedTabs";

function execute() {


Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.ScrollBars = function() { }
Sys.Extended.UI.ScrollBars.prototype = {
    None : 0x00,
    Horizontal : 0x01,
    Vertical : 0x02,
    Both : 0x03,
    Auto : 0x04
}
Sys.Extended.UI.ScrollBars.registerEnum("Sys.Extended.UI.ScrollBars", true);

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
        if (eh) {
            eh(this, Sys.EventArgs.Empty);
        }
        if (this._autoPostBackId) {
            __doPostBack(this._autoPostBackId, "activeTabChanged:" + this.get_activeTabIndex());
        }
    },

    get_activeTabIndex: function() {
        if (this._cachedActiveTabIndex > -1) {
            return this._cachedActiveTabIndex;
        }
        return this._activeTabIndex;
    },
    set_activeTabIndex: function(valuePassed) {
        var value = valuePassed;
        if (!this.get_isInitialized()) {
            this._cachedActiveTabIndex = value;
        } else {
            if (value < -1) {
                throw Error.argumentOutOfRange("value");
            }
            if (value >= this.get_tabs().length) {
                value = this.get_tabs().length - 1;
            }
            if (this._activeTabIndex != -1) {
                this.get_tabs()[this._activeTabIndex]._set_active(false);
            }

            var changed = (this._activeTabIndex != value);

            this._activeTabIndex = value;

            if (this._activeTabIndex != -1) {
                this.get_tabs()[this._activeTabIndex]._set_active(true);
            }
            if (this._loaded && changed) {
                this.raiseActiveTabChanged();
            }
            this.raisePropertyChanged("activeTabIndex");
        }
    },

    get_tabs: function() {
        if (this._tabs == null) {
            this._tabs = [];
        }
        return this._tabs;
    },

    get_activeTab: function() {
        if (this._activeTabIndex > -1) {
            return this.get_tabs()[this._activeTabIndex];
        }
        return null;
    },
    set_activeTab: function(value) {
        var i = Array.indexOf(this.get_tabs(), value);
        if (i == -1) {
            throw Error.argument("value", Sys.Extended.UI.Resources.Tabs_ActiveTabArgumentOutOfRange);
        }
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
        if (this._scrollBars != value) {
            this._scrollBars = value;
            this._invalidate();
            this.raisePropertyChanged("scrollBars");
        }
    },

    initialize: function() {
        Sys.Extended.UI.TabContainer.callBaseMethod(this, "initialize");

        var elt = this.get_element();
        var header = this._header = $get(this.get_id() + "_header");
        var body = this._body = $get(this.get_id() + "_body");

        // default classes
        $common.addCssClasses(elt, [
            "ajax__tab_container",
            "ajax__tab_default"
        ]);
        Sys.UI.DomElement.addCssClass(header, "ajax__tab_header");
        Sys.UI.DomElement.addCssClass(body, "ajax__tab_body");

        this._invalidate();

        Sys.Application.add_load(this._app_onload$delegate);
    },
    dispose: function() {
        Sys.Application.remove_load(this._app_onload$delegate);
        Sys.Extended.UI.TabContainer.callBaseMethod(this, "dispose");
    },
    getFirstTab: function(includeDisabled) {
        var tabs = this.get_tabs();
        for (var i = 0; i < tabs.length; i++) {
            if (includeDisabled || tabs[i].get_enabled()) {
                return tabs[i];
            }
        }
        return null;
    },
    getLastTab: function(includeDisabled) {
        var tabs = this.get_tabs();
        for (var i = tabs.length - 1; i >= 0; i--) {
            if (includeDisabled || tabs[i].get_enabled()) {
                return tabs[i];
            }
        }
        return null;
    },
    getNextTab: function(includeDisabled) {
        var tabs = this.get_tabs();
        var active = this.get_activeTabIndex();
        for (var i = 1; i < tabs.length; i++) {
            var tabIndex = (active + i) % tabs.length;
            var tab = tabs[tabIndex];
            if (includeDisabled || tab.get_enabled())
                return tab;
        }
        return null;
    },
    getPreviousTab: function(includeDisabled) {
        var tabs = this.get_tabs();
        var active = this.get_activeTabIndex();
        for (var i = 1; i < tabs.length; i++) {
            var tabIndex = (tabs.length + (active - i)) % tabs.length;
            var tab = tabs[tabIndex];
            if (includeDisabled || tab.get_enabled())
                return tab;
        }
        return null;
    },
    getNearestTab: function(includeDisabled) {
        var prev = this.getPreviousTab(includeDisabled);
        var next = this.getNextTab(includeDisabled);
        if (prev && prev.get_tabIndex() < this._activeTabIndex) {
            return prev;
        } else if (next && next.get_tabIndex() > this._activeTabIndex) {
            return next;
        }
        return null;
    },
    saveClientState: function() {
        var tabs = this.get_tabs();
        var tabState = [];
        for (var i = 0; i < tabs.length; i++) {
            Array.add(tabState, tabs[i].get_enabled());
        }
        var state = {
            ActiveTabIndex: this._activeTabIndex,
            TabState: tabState
        };
        return Sys.Serialization.JavaScriptSerializer.serialize(state);
    },
    _invalidate: function() {
        if (this.get_isInitialized()) {
            $common.removeCssClasses(this._body, [
                "ajax__scroll_horiz",
                "ajax__scroll_vert",
                "ajax__scroll_both",
                "ajax__scroll_auto"
            ]);
            switch (this._scrollBars) {
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
            }
        }
    },
    _app_onload: function(sender, e) {
        if (this._cachedActiveTabIndex != -1) {
            this.set_activeTabIndex(this._cachedActiveTabIndex);
            this._cachedActiveTabIndex = -1;
        }
        this._loaded = true;
    }
}
Sys.Extended.UI.TabContainer.registerClass("Sys.Extended.UI.TabContainer", Sys.Extended.UI.ControlBase);
Sys.registerComponent(Sys.Extended.UI.TabContainer, { name: "tabContainer", parameters: [{ name: "activeTabIndex", type: "Number" }] });

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
    this._header_onclick$delegate = Function.createDelegate(this, this._header_onclick);
    this._header_onmouseover$delegate = Function.createDelegate(this, this._header_onmouseover);
    this._header_onmouseout$delegate = Function.createDelegate(this, this._header_onmouseout);
    this._header_onmousedown$delegate = Function.createDelegate(this, this._header_onmousedown);
    this._dynamicPopulate_onpopulated$delegate = Function.createDelegate(this, this._dynamicPopulate_onpopulated);
    this._oncancel$delegate = Function.createDelegate(this, this._oncancel);
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
        if (eh) {
            eh(this, Sys.EventArgs.Empty);
        }
    },

    add_populating: function(handler) {
        this.get_events().addHandler("populating", handler);
    },
    remove_populating: function(handler) {
        this.get_events().removeHandler("populating", handler);
    },
    raisePopulating: function() {
        var eh = this.get_events().getHandler("populating");
        if (eh) {
            eh(this, Sys.EventArgs.Empty);
        }
    },

    add_populated: function(handler) {
        this.get_events().addHandler("populated", handler);
    },
    remove_populated: function(handler) {
        this.get_events().removeHandler("populated", handler);
    },
    raisePopulated: function() {
        var eh = this.get_events().getHandler("populated");
        if (eh) {
            eh(this, Sys.EventArgs.Empty);
        }
    },

    get_headerText: function() {
        if (this.get_isInitialized()) {
            return this._header.innerHTML;
        }
        return "";
    },
    set_headerText: function(value) {
        if (!this.get_isInitialized()) {
            throw Error.invalidOperation(String.format(Sys.Extended.UI.Resources.Tabs_PropertySetBeforeInitialization, 'headerText'));
        }
        if (this.get_headerText() != value) {
            this._header.innerHTML = value;
            this.raisePropertyChanged("headerText");
        }
    },

    get_headerTab: function() {
        return this._header;
    },
    set_headerTab: function(value) {
        if (typeof(value) === "string") {
            value = Sys.get(value);
            if (!value) {
                throw new Error.argumentNull("value");
            }
        }
        if (this._header != value) {
            if (this.get_isInitialized()) {
                throw Error.invalidOperation(String.format(Sys.Extended.UI.Resources.Tabs_PropertySetAfterInitialization, 'headerTab'));
            }
            this._header = value;
            this.raisePropertyChanged("value");
        }
    },

    get_enabled: function() {
        return this._enabled;
    },
    set_enabled: function(value) {
        if (value != this._enabled) {
            this._enabled = value;
            if (this.get_isInitialized()) {
                this._makeEnabled(this._enabled);
            }
            this.raisePropertyChanged("enabled");
        }
    },

    get_owner: function() {
        return this._owner;
    },
    set_owner: function(value) {
        if (value instanceof Sys.ComponentSet) value = value.get(0);
        if (this._owner != value) {
            if (this.get_isInitialized()) {
                throw Error.invalidOperation(String.format(Sys.Extended.UI.Resources.Tabs_PropertySetAfterInitialization, 'owner'));
            }
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
        if (this._scrollBars != value) {
            this._scrollBars = value;
            this.raisePropertyChanged("scrollBars");
        }
    },

    get_tabIndex: function() {
        return this._tabIndex;
    },

    get_dynamicContextKey: function() {
        return this._dynamicContextKey;
    },
    set_dynamicContextKey: function(value) {
        if (this._dynamicContextKey != value) {
            this._dynamicContextKey = value;
            this.raisePropertyChanged('dynamicContextKey');
        }
    },

    get_dynamicServicePath: function() {
        return this._dynamicServicePath;
    },
    set_dynamicServicePath: function(value) {
        if (this._dynamicServicePath != value) {
            this._dynamicServicePath = value;
            this.raisePropertyChanged('dynamicServicePath');
        }
    },

    get_dynamicServiceMethod: function() {
        return this._dynamicServiceMethod;
    },
    set_dynamicServiceMethod: function(value) {
        if (this._dynamicServiceMethod != value) {
            this._dynamicServiceMethod = value;
            this.raisePropertyChanged('dynamicServiceMethod');
        }
    },

    _get_active: function() {
        return this._active;
    },
    _set_active: function(value) {
        this._active = value;
        if (value)
            this._activate();
        else
            this._deactivate();
    },

    initialize: function() {
        var owner = this.get_owner();

        if (!owner) {
            owner = $find(this.get_ownerID());
            if (owner) {
                owner.initialize();
                this.set_owner(owner);
            }
        }

        Sys.Extended.UI.TabPanel.callBaseMethod(this, "initialize");

        if (!owner) {
            throw Error.invalidOperation(Sys.Extended.UI.Resources.Tabs_OwnerExpected);
        }

        this._tabIndex = owner.get_tabs().length;

        Array.add(owner.get_tabs(), this);
        var tabId = this.get_id() + "_tab";
        this._tab = document.getElementById(tabId);
        var serverRendered = (this._tab != null);

        if (!serverRendered) {
            this._headerOuterWrapper = document.createElement('span');
            this._headerInnerWrapper = document.createElement('span');
            this._tab = document.createElement('span');
            this._tab.id = tabId;
            this._header.parentNode.replaceChild(this._tab, this._header);
            this._tab.appendChild(this._headerOuterWrapper);
            this._headerOuterWrapper.appendChild(this._headerInnerWrapper);
            this._headerInnerWrapper.appendChild(this._header);
        }

        $addHandlers(this._header, {
            mousedown: this._header_onmousedown$delegate,
            dragstart: this._oncancel$delegate,
            selectstart: this._oncancel$delegate,
            select: this._oncancel$delegate
        });
        if (this._enabled) {
            this._addHandlersOnEnabled();
        } else {
            Sys.UI.DomElement.addCssClass(this._tab, "ajax__tab_disabled");
        }

        if (!serverRendered) {
            Sys.UI.DomElement.addCssClass(this._headerOuterWrapper, "ajax__tab_outer");
            Sys.UI.DomElement.addCssClass(this._headerInnerWrapper, "ajax__tab_inner");
            Sys.UI.DomElement.addCssClass(this._header, "ajax__tab_tab");
            Sys.UI.DomElement.addCssClass(this.get_element(), "ajax__tab_panel");
        }
    },

    dispose: function() {
        if (this._dynamicPopulateBehavior) {
            this._dynamicPopulateBehavior.dispose();
            this._dynamicPopulateBehavior = null;
        }
        $common.removeHandlers(this._header, {
            mousedown: this._header_onmousedown$delegate,
            dragstart: this._oncancel$delegate,
            selectstart: this._oncancel$delegate,
            select: this._oncancel$delegate
        });
        if (this._enabled) {
            this._removeHandlersOnEnabled();
        }
        Sys.Extended.UI.TabPanel.callBaseMethod(this, "dispose");
    },

    _addHandlersOnEnabled: function() {
        $addHandlers(this._header, {
            click: this._header_onclick$delegate,
            mouseover: this._header_onmouseover$delegate,
            mouseout: this._header_onmouseout$delegate
        });
    },

    _removeHandlersOnEnabled: function() {
        $common.removeHandlers(this._header, {
            click: this._header_onclick$delegate,
            mouseover: this._header_onmouseover$delegate,
            mouseout: this._header_onmouseout$delegate
        });
    },

    populate: function(contextKeyOverride) {
        if (this._dynamicPopulateBehavior && (this._dynamicPopulateBehavior.get_element() != this.get_element())) {
            this._dynamicPopulateBehavior.dispose();
            this._dynamicPopulateBehavior = null;
        }
        if (!this._dynamicPopulateBehavior && this._dynamicServiceMethod) {
            this._dynamicPopulateBehavior = $create(Sys.Extended.UI.DynamicPopulateBehavior, { "ContextKey": this._dynamicContextKey, "ServicePath": this._dynamicServicePath, "ServiceMethod": this._dynamicServiceMethod }, { "populated": this._dynamicPopulate_onpopulated$delegate }, null, this.get_element());
        }
        if (this._dynamicPopulateBehavior) {
            this.raisePopulating();
            this._dynamicPopulateBehavior.populate(contextKeyOverride ? contextKeyOverride : this._dynamicContextKey);
        }
    },

    _activate: function() {
        if (this._enabled) {
            var elt = this.get_element();
            $common.setVisible(elt, true);
            Sys.UI.DomElement.addCssClass(this._tab, "ajax__tab_active");

            this.populate();
        } else if (this._get_active()) {
            var next = this._owner.getNearestTab(false);
            if (!!next) {
                this._owner.set_activeTab(next);
            }
        }
        this._owner.get_element().style.visibility = 'visible';
    },
    _deactivate: function() {
        var elt = this.get_element();
        $common.setVisible(elt, false);
        Sys.UI.DomElement.removeCssClass(this._tab, "ajax__tab_active");
    },
    _show: function() {
        this._tab.style.display = '';
    },
    _hide: function() {
        this._tab.style.display = 'none';
        if (this._get_active()) {
            var next = this._owner.getNearestTab(false);
            if (!!next) {
                this._owner.set_activeTab(next);
            }
        }
        this._deactivate();
    },

    _makeEnabled: function(enable) {
        if (enable) {
            this._addHandlersOnEnabled();
            Sys.UI.DomElement.removeCssClass(this._tab, "ajax__tab_disabled");
        } else {
            this._removeHandlersOnEnabled();
            if (this._get_active()) {
                var next = this._owner.getNearestTab(false);
                if (!!next) {
                    this._owner.set_activeTab(next);
                }
            }
            this._deactivate();
            Sys.UI.DomElement.addCssClass(this._tab, "ajax__tab_disabled");
        }
    },

    _header_onclick: function(e) {
        this.raiseClick();
        this.get_owner().set_activeTab(this);
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
    _dynamicPopulate_onpopulated: function(sender, e) {
        this.raisePopulated();
    }
}
Sys.Extended.UI.TabPanel.registerClass("Sys.Extended.UI.TabPanel", Sys.UI.Control);
Sys.registerComponent(Sys.Extended.UI.TabPanel, { name: "tabPanel", parameters: [{ name: "owner", type: "Sys.Extended.UI.TabContainer" }, { name: "headerTab", type: "String" }] });

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedDynamicPopulate"], execute);
}
else {
    execute();
}

})();
