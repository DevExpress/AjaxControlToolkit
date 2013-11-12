(function(window, $) {

    $act.createWidget('tabPanel', $.Widget, {
        
        // Default options
        options: {
            enabled: true,
            scrollBars: "None",
            dynamicServicePath: null,
            dynamicServiceMethod: null,
            dynamicContextKey: null,
            onDemandMode: "Always",
            updatePanelID: null,
            wasLoadedOnce: false,
            owner: null           
        },

        // Events
        _events: ["click", "populating", "populated"],

        _create: function() {
            var self = this, 
                opt = self.options,
                elId = self.element.attr('id');

            // Vars
            self._active = false;
            self._tab = $('#' + elId + "_tab");
            self._header = $("#__tab_" + elId);
            self._tabIndex = opt.owner.get_tabs().length;

            if (opt.enabled) {
                self._addHandlersOnEnabled();
            } else {
                self._makeEnabled(false);
            }
            
            if (opt.onClientClick) {
                self.add_click(opt.onClientClick);
            }
        },
        
        _setOption: function (key, value) {
            var self = this;

            switch (key) {
                case "enabled":
                    self._makeEnabled(value);
                    break;
                    
                case "disabled":
                    self._makeEnabled(!value);
                    break;
            
                case "headerText":
                    self._header.text(value);
                    break;
            }
            
            self._superApply(arguments);
        },

        _set_active: function (value) {
            this._active = value;
            if (value)
                this._activate();
            else
                this._deactivate();
        },
        
        _activate: function () {

            var self = this, opt = self.options,
                owner = opt.owner;

            if (opt.enabled) {
                var elt = $(self.element);
                elt.css({ 'visibility': 'visible', 'display': '' });
                self._tab.addClass("ajax__tab_active");
                self.populate();
                self._header.focus();
            } else if (self._active) {
                var next = owner.getNearestTab(false);
                if (!!next) {
                    owner.set_activeTab(next);
                }
            }
            
            owner.show();
        },
        
        _deactivate: function () {
            var self = this, elt = $(self.element);
            elt.css({ 'visibility': 'hidden', 'display': 'none' });
            self._tab.removeClass("ajax__tab_active");
        },
        
        _makeEnabled: function (enable) {

            var self = this,
                owner = self.options.owner;

            if (enable) {
                self._addHandlersOnEnabled();
                self._header.removeClass("ajax__tab_disabled");
            } else {
                self._removeHandlersOnEnabled();
                if (self._active) {
                    var next = owner.getNearestTab(false);
                    if (!!next) {
                        owner.set_activeTab(next);
                    }
                }
                self._deactivate();
                self._header.addClass("ajax__tab_disabled");
            }
        },
        
        _addHandlersOnEnabled: function () {
            var self = this;
            self._header
                .on('click', function(e) {self._headerOnClick.call(self, e); })
                .on('mouseover', function(e) { self._headerOnMouseOver.call(self, e); })
                .on('mouseout', function(e) {self._headerOnMouseOut.call(self, e); })
                .on('keydown', function (e) { self._headerOnKeyDown.call(self, e); });
        },

        _removeHandlersOnEnabled: function () {
            this._header
                .off('click')
                .off('mouseover')
                .off('mouseout')
                .off('keydown')
                .on('click', function(e) {
                    e.preventDefault();
                });
        },
        
        _headerOnClick: function(e) {
            e.preventDefault();
            this.options.owner.set_activeTab(this);
            this.raiseClick(this);

            // ensure clicked tab always got focus even it's been already activated
            this._header.focus();
        },
        
        _headerOnMouseOver: function(e) {
            this._tab.addClass("ajax__tab_hover");
        },
        
        _headerOnMouseOut: function(e) {
            this._tab.removeClass("ajax__tab_hover");
        },
        
        _headerOnKeyDown: function(e) {
            var self = this, keyCode = ('which' in e) ? e.which : e.keyCode,
                owner = self.options.owner,
                vertical = owner.options.useVerticalStripPlacement;

            if ((keyCode == "39" && !vertical) || (keyCode == "40" && vertical))//right or down
            {
                e.preventDefault();
                var next = owner.getNextTab(false);
                if (next) {
                    owner.set_activeTab(next);
                }
            } else if ((keyCode == "37" && !vertical) || (keyCode == "38" && vertical))//left or up
            {
                e.preventDefault();
                var prev = owner.getPreviousTab(false);
                if (prev) {
                    owner.set_activeTab(prev);
                }
            } else if (keyCode == "35")//end
            {
                e.preventDefault();
                var last = owner.getLastTab(false);
                if (last) {
                    owner.set_activeTab(last);
                }
            } else if (keyCode == "36")//home
            {
                e.preventDefault();
                var first = owner.getFirstTab(false);
                if (first) {
                    owner.set_activeTab(first);
                }
            }
        },
        
        
        populate: function (contextKeyOverride) {

            var self = this, opt = self.options;
            
            if (!self._dynamicPopulateBehavior && opt.dynamicServiceMethod) {
                self._dynamicPopulateBehavior = $act.common.activateWidget('dynamicPopulateExtender',
                    self.element, {
                        id: self.element.attr('id') + '_DynamicPopulateBehavior',
                        contextKey: opt.dynamicContextKey,
                        serviceMethod: opt.dynamicServiceMethod,
                        servicePath: opt.dynamicServicePath
                    });

                self._dynamicPopulateBehavior.add_populating(function() {
                    self.raisePopulating(this);
                });
                
                self._dynamicPopulateBehavior.add_populated(function() {
                    self.raisePopulated(this);
                });
            }
            
            if (self._dynamicPopulateBehavior) {
                self._dynamicPopulateBehavior.populate(contextKeyOverride ? contextKeyOverride : opt.dynamicContextKey);
            }
        }
        
    }, true);

})(window, actJQuery);