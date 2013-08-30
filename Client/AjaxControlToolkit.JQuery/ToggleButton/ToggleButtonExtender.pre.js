(function (window, $) {

    $act.createWidget('toggleButtonExtender', {
        idDecoration: '_ToggleButton',
        
        _create: function() {

            var self = this,
                el = self.element[0],
                id = el.id + this.idDecoration,
                container = $('<div/>').insertBefore(el).css({ position: 'relative' }),
                opt = self.config;

            self._decoyElement = $('<a/>').appendTo(container)
                    .attr({ id: id, href: '' })
                    .css({
                        position: 'absolute',
                        left: '0px',
                        top: '0px',
                        width: opt.imageWidth + 'px',
                        height: opt.imageHeight + 'px',
                        'font-size': opt.imageHeight + 'px',
                        'background-repeat': 'no-repeat'
                    });

            $(el).css({ visibility: 'hidden' });
            
            self.onClick();

            $(el).change(function () {
                self.onClick();
            });

            $(this._decoyElement).click(function (ev) {
                ev.preventDefault();
                $(el).click();
            }).hover(function () {
                self._onDecoyElementMouseOver();
            }, function () {
                self._onDecoyElementMouseOut();
            });
            
            // Find any any label elements "for" the checkbox and update them to be "for" the decoy element
            // Only for Internet Explorer
            if (window.$act.browser.agent === window.$act.browser.InternetExplorer) {
                container.parent().find('label').each(function () {
                    if (el.id == $(this).prop('htmlFor')) {
                        $(this).prop('htmlFor', id);
                    }
                });
            }
        },
        
        onClick: function () {
            /// <summary>
            /// Handle the element's click events
            /// </summary>

            var self = this,
                el = self.element[0],
                opt = self.config;

            if (!el)
                return;

            if (el.checked) {
                self._decoyElement.css('background-image', 'url(' + (el.disabled ? opt.disabledCheckedImageUrl : opt.checkedImageUrl) + ')');
                if (opt.checkedImageAlternateText) {
                    self._decoyElement.prop('title', opt.checkedImageAlternateText);
                }
            } else {
                self._decoyElement.css('background-image', 'url(' + (el.disabled ? opt.disabledUncheckedImageUrl : opt.uncheckedImageUrl) + ')');
                if (opt.uncheckedImageAlternateText) {
                    self._decoyElement.prop('title', opt.uncheckedImageAlternateText);
                }
            }
        },

        _onDecoyElementClick: function (e) {
            /// <summary>
            /// Handle the decoy element's click events
            /// </summary>

            this.element.click();
            e.preventDefault();
            return false;
        },

        _onDecoyElementMouseOver: function () {
            /// <summary>
            /// Handle the decoy element's mouseover event
            /// </summary>

            var self = this,
               el = self.element[0],
               opt = self.config;
            
            if (el && !el.disabled) {
                if (el.checked && opt.checkedImageOverUrl) {
                    self._decoyElement.css('background-image', 'url(' + opt.checkedImageOverUrl + ')');
                    if (opt.checkedImageOverAlternateText) {
                        self._decoyElement.prop('title', opt.checkedImageOverAlternateText);
                    }
                } else if (!el.checked && opt.uncheckedImageOverUrl) {
                    self._decoyElement.css('background-image', 'url(' + opt.uncheckedImageOverUrl + ')');
                    if (opt.uncheckedImageOverAlternateText) {
                        self._decoyElement.prop('title', opt.uncheckedImageOverAlternateText);
                    }
                }
            }
        },

        _onDecoyElementMouseOut: function () {
            /// <summary>
            /// Handle the decoy element's mouseout event
            /// </summary>

            // Call onClick because it restores the correct image
            this.onClick();
        }
    });

})(window, jQuery);