(function(window, $) {

    $act.createWidget('tabContainer', {
        
        options: {
            activeTabIndex: 0,
            useVerticalStripPlacement: false,
            onDemand: false,
            autoPostBackId: null,
            scrollBars: "None",
            tabStripPlacement: "Top"
        },

        _create: function() {
            var self = this,
                opt=self.options,
                el = $(self.element),
                id = el.attr('id');

            self._header = $('#' + id + "_header");
            self._body = $('#' + id + "_body");
            self._tabs = [];
            self._cachedActiveTabIndex = opt.activeTabIndex;
            self._created = false;
            
            el.addClass("ajax__tab_container ajax__tab_default");
            self._body.children().each(function (idx, val) {
                self._tabs.push(
                    $act.common.activateWidget('tabPanel', val,
                        { owner: self, tabIndex: idx }));
            });
            
            self.option("activeTabIndex", self.options.activeTabIndex);
        },
        
        _events:["activeTabChanged"],
        
        _setOption: function (key, value) {
            var self = this;

            // Skip unchanged value
            if (self._created && self.option(key) == value)
                return;
            
            if (key == "activeTabIndex") {
                // Activate and validate tab index value
                value = self._setActiveTabIndex(value);
            }
            
            self._superApply(arguments);
            self._saveClientState();
            self._invalidate();
        },
        
        _saveClientState: function() {
            var opt = this.options,
                state = { "ActiveTabIndex": opt.activeTabIndex, "TabEnabledState": [true, true, true], "TabWasLoadedOnceState": [false, false, false] };
            this._clientStateElement.val(JSON.stringify(state));
        },
        

        // Public methods
        
        show: function() {
            $(this.element).css({ 'visibility': 'visible' });
        },

        getFirstTab: function (includeDisabled) {
            var tabs = this._tabs;
            for (var i = 0; i < tabs.length; i++) {
                if (includeDisabled || tabs[i].options.enabled) {
                    return tabs[i];
                }
            }
            return null;
        },
        getLastTab: function (includeDisabled) {
            var tabs = this._tabs;
            for (var i = tabs.length - 1; i >= 0; i--) {
                if (includeDisabled || tabs[i].options.enabled) {
                    return tabs[i];
                }
            }
            return null;
        },
        getNextTab: function (includeDisabled) {
            var tabs = this._tabs,
                active = this.options.activeTabIndex;
            
            for (var i = 1; i < tabs.length; i++) {
                var tabIndex = (active + i) % tabs.length;
                var tab = tabs[tabIndex];
                if (includeDisabled || tab.options.enabled)
                    return tab;
            }
            return null;
        },
        getPreviousTab: function (includeDisabled) {
            var tabs = this._tabs,
                active = this.options.activeTabIndex;
            
            for (var i = 1; i < tabs.length; i++) {
                var tabIndex = (tabs.length + (active - i)) % tabs.length;
                var tab = tabs[tabIndex];
                if (includeDisabled || tab.options.enabled)
                    return tab;
            }
            return null;
        },
        getNearestTab: function (includeDisabled) {
            var prev = this.getPreviousTab(includeDisabled);
            var next = this.getNextTab(includeDisabled);
            if (prev && prev._tabIndex < this.options.activeTabIndex) {
                return prev;
            } else if (next && next._tabIndex > this.options.activeTabIndex) {
                return next;
            }
            return null;
        },
        
        _invalidate: function() {
            var self = this,
                bodyClassName = "ajax__scroll_auto", 
                opt = self.options;

            switch (opt.scrollBars) {
                case "Horizontal":
                    bodyClassName = "ajax__scroll_horizontal";
                    break;
                case "Vertical":
                    bodyClassName = "ajax__scroll_vertical";
                    break;
                case "Both":
                    bodyClassName = "ajax__scroll_both";
                    break;
                case "None":
                    bodyClassName = "ajax__scroll_none";
                    break;
                default:
                    break;
            }

            self._body.addClass(bodyClassName);
            
            if (!self.hoop && opt.useVerticalStripPlacement) {
                var id = self.element.attr('id'),
                    headHeight = self._header.outerHeight(),
                    bodyHeight = self._body.outerHeight();

                $('#' + id + '_headerSpannerHeight').height(bodyHeight - headHeight);
                self.hoop = true;
            }
        },
        
        _setActiveTabIndex: function (value) {

            var self = this, opt = self.options;

            if (value < -1) {
                throw "invalid tab index";
            }

            if (value >= self._tabs.length) {
                value = self._tabs.length - 1;
            }

            if (!self._created || value != opt.activeTabIndex) {

                if (opt.activeTabIndex != -1) {
                    // deactivate old tab
                    self._tabs[opt.activeTabIndex]._set_active(false);
                }

                opt.activeTabIndex = value;

                var activeTab = self._tabs[opt.activeTabIndex];
                if (opt.activeTabIndex != -1) {
                    // activate new tab
                    activeTab._set_active(true);
                }

                if (opt.onDemand) {
                    var onDemandMode = activeTab.options.onDemandMode;
                    if (onDemandMode != "None") {
                        if ((onDemandMode == "Once" && !activeTab.options.wasLoadedOnce) || onDemandMode == "Always") {

                            // Giving delay to ensure the tab was displayed
                            setTimeout(function () {
                                $act.common.doPostBack(activeTab.options.updatePanelID);
                                activeTab.option("wasLoadedOnce", true);
                            }, 0);
                        }
                    }
                }

                // Raise activeTabChanged event
                if (self._created) {
                    self.raiseActiveTabChanged();
                }

                self._created = true;
            }

            return value;
        },

        // Overriden Events

        raiseActiveTabChanged: function () {
            var self = this,
                opt = self.options;
            self._invokeHandler("activeTabChanged", self);
            
            if (opt.autoPostBackId && opt.autoPostBack) {
                $act.common.doPostBack(opt.autoPostBackId, "activeTabChanged:" + opt.activeTabIndex);
            }
        },
        
        // End Of Override  Events
        
        // Custom Client Properties
        
        set_activeTab: function (value) {
            var i = $.inArray(value, this._tabs);
            if (i == -1) {
                throw "can't find index of tab to activate";
            }
            this.option("activeTabIndex", i);
        },
        
        get_activeTab: function() {
            return this._tabs[this.options.activeTabIndex];
        },
        
        get_tabs: function () {
            if (this._tabs == null) {
                this._tabs = [];
            }
            return this._tabs;
        }
        // End Of Custom Client Properties
    });
    
})(window, actJQuery);