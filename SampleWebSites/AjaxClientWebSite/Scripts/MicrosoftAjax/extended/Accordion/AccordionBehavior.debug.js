// (c) 2010 CodePlex Foundation



/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../Compat/Timer/Timer.js" />
/// <reference path="../Animation/Animations.js" />



(function() {
var scriptName = "ExtendedAccordion";

function execute() {

Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.AutoSize = function() {
    /// <summary>
    /// The AutoSize enumeration is used to specify how the AccordionBehavior limits
    /// the growth of the accordion when panes are expanded and collapsed.  It must
    /// correspond to the AutoSize CLR enumeration in AutoSize.cs.
    /// </summary>
    /// <field name="None" type="Number" integer="true">
    /// Allow the accordion to expand/collapse without restriction.
    /// </field>
    /// <field name="Fill" type="Number" integer="true">
    /// Keep the accordion the same size as its specified size.  If any
    /// panes are larger or smaller than the available space, grow or shrink
    /// them to the available space.
    /// </field>
    /// <field name="Limit" type="Number" integer="true">
    /// Prevent the accordion from growing any larger than its specified size.
    /// If the content of a pane is too large to fit, grow it to fill the
    /// remaining space.
    /// </field>
    throw Error.invalidOperation();
}
Sys.Extended.UI.AutoSize.prototype = {
    None : 0,
    Fill : 1,
    Limit : 2
}
Sys.Extended.UI.AutoSize.registerEnum("Sys.Extended.UI.AutoSize", false);


Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs = function(oldIndex, selectedIndex) {
    /// <summary>
    /// Event arguments used to provide notification when an accordion's selected
    /// index is changed.  The same event argument type is used for both the
    /// selectedIndexChanging event and the selectedIndexChanged events.  If you set
    /// the cancel property to true during the selectedIndexChanging event, the
    /// accordion will not change panes.  The cancel property has no effect during
    /// the selectedIndexChanged event.
    /// </summary>
    /// <param name="oldIndex" type="Number" integer="true" mayBeNull="false">
    /// Last selected index
    /// </param>
    /// <param name="selectedIndex" type="Number" integer="true" mayBeNull="false">
    /// New selected index
    /// </param>
    Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs.initializeBase(this);

    this._oldIndex = oldIndex;
    this._selectedIndex = selectedIndex;
}
Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs.prototype = {
    get_oldIndex : function() {
        /// <value type="Number" integer="true" mayBeNull="false">
        /// Last selected index
        /// </value>
        return this._oldIndex;
    },
    set_oldIndex : function(value) {
        this._oldIndex = value;
    },
    
    get_selectedIndex : function() {
        /// <value type="Number" integer="true" mayBeNull="false">
        /// New selected index
        /// </value>
        return this._selectedIndex;
    },
    set_selectedIndex : function(value) {
        this._selectedIndex = value;
    }
}
Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs.registerClass('Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs', Sys.CancelEventArgs);






Sys.Extended.UI.AccordionBehavior = function(element) {
    /// <summary>
    /// The AccordionBehavior is used to turn properly structured XHTML into an
    /// Accordion with panes that can expand one at a time.
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// The DOM element the behavior is associated with.  It should contain an
    /// even number of child divs (such that ith pane has a header at div 2i and
    /// has content at div 2i+1).
    /// </param>
    Sys.Extended.UI.AccordionBehavior.initializeBase(this, [element]);

    this._selectedIndex = 0;

    this._panes = [];

    this._fadeTransitions = false;

    this._duration = 0.25;

    this._framesPerSecond = 30;

    this._autoSize = Sys.Extended.UI.AutoSize.None;

    this._requireOpenedPane = true;

    this._suppressHeaderPostbacks = false;

    this._headersSize = 0;

    this._headerClickHandler = null;

    this._headerCssClass = '';

    this._headerSelectedCssClass = '';

    this._resizeHandler = null;

    this._isIE8InStandardMode = (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version > 7 && Sys.Browser.documentMode != 0);
}
Sys.Extended.UI.AccordionBehavior.prototype = {
    initialize: function() {
        /// <summary>
        /// The initialize function is responsible for getting the selected index from
        /// the ClientState mechanism and walking the children of the behavior's target
        /// to find all of the accordion's child panes.  It builds up a collection of the
        /// panes from the headers and content sections.  Then we hide all the content
        /// sections that aren't selected and initialize the layout.
        /// </summary>
        /// <returns />
        Sys.Extended.UI.AccordionBehavior.callBaseMethod(this, 'initialize');

        this._headerClickHandler = Function.createDelegate(this, this._onHeaderClick);

        var state = this.get_ClientState();
        if (state !== null && state !== '') {
            this._changeSelectedIndex(parseInt(state), false, true);
        }

        var nodes = this.get_element().childNodes;
        var index = {};
        for (index.value = 0; index.value < nodes.length; index.value++) {
            var header = this._getNextDiv(nodes, index);
            if (!header) {
                break;
            }
            var content = this._getNextDiv(nodes, index);
            if (content) {
                this.addPane(header, content);
                index.value--;
            }
        }

        if (this._requireOpenedPane && !this.get_Pane() && this._panes.length > 0) {
            this._changeSelectedIndex(0, false, true);
        }

        this._initializeLayout();
    },

    _getNextDiv: function(nodes, index) {
        /// <summary>
        /// Get the next div in a sequence of child nodes starting at the
        /// given index
        /// </summary>
        /// <param name="nodes" type="Array" mayBeNull="false" elementMayBeNull="true"
        ///   elementType="Sys.UI.DomElement" elementDomElement="true">
        /// Array of child nodes (i.e. element.childNodes)
        /// </param>
        /// <param name="index" type="Object" mayBeNull="false">
        /// The index is an object of the form { value } where index.value represents
        /// the current index in the collection of nodes.  We wrap the index in an object
        /// to perform the .NET equivalent of boxing so it can be passed by reference.
        /// </param>
        /// <returns type="Sys.UI.DomElement" DomElement="true" mayBeNull="true">
        /// The next DOM element representing a div tag, starting at the provided index.
        /// </returns>

        var div = null;
        while (index.value < nodes.length && (div = nodes[index.value++])) {
            if (div.tagName && (div.tagName.toLowerCase() === 'div')) {
                break;
            }
        }
        return div;
    },

    addPane: function(header, content) {
        /// <summary>
        /// Create a new Accordion pane given references to its header and content divs
        /// and add it to the _panes collection.  We also wrap the content div in a new
        /// container div, add a click handler to the header div, etc.
        /// </summary>
        /// <param name="header" type="Sys.UI.DomElement" domElement="true" mayBeNull="false">
        /// Header element of the new Accordion pane
        /// </param>
        /// <param name="content" type="Sys.UI.DomElement" domElement="true" mayBeNull="false">
        /// Content element of the new Accordion pane
        /// </param>
        /// <returns type="Object" mayBeNull="false">
        /// New pane object added to the end of the Accordion's pane collection.  The pane
        /// is an object of the form {header, content, animation} corresponding to that
        /// pane's header section, content section, and the animation used to open and
        /// close its content section.  The content element is a new div that has been
        /// created to wrap the original div (so we can completely collapse it - even if it
        /// has padding, margins, etc.) which is pointed to by a dynamic _original property.
        /// The header element has a dynamic _index property indicating its position in the
        /// Accordion's pane collection (used primarily by the headers' shared click handler).
        /// Furthermore, the animation will either be an instance of LengthAnimation or
        /// ParallelAnimation (in the latter case, it will have two children which are a
        /// LengthAnimation and a FadeAnimation).  There will be two dynamic properties
        /// _length and _fade pointing to each of these children (to easily set the length
        /// and fadeEffect properties).  There is also a dynamic _ended property which is
        /// an event handler to be fired when the animation is complete, a dynamic _opening
        /// property to indicate whether the animation was opening or closing the pane, and
        /// a dynamic _pane property to provide a reference to the pane that was being
        /// animated.
        /// </returns>

        var pane = {};
        pane.animation = null;

        pane.header = header;
        header._index = this._panes.length;
        $addHandler(header, "click", this._headerClickHandler);

        var accordion = this.get_element();
        var wrapper = document.createElement('div');
        accordion.insertBefore(wrapper, content);
        wrapper.appendChild(content);
        wrapper._original = content;
        pane.content = wrapper;

        wrapper.style.border = '';
        wrapper.style.margin = '';
        wrapper.style.padding = '';

        Array.add(this._panes, pane);

        this._initializePane(header._index);

        content.style.display = 'block';

        return pane;
    },

    _getAnimation: function(pane) {
        /// <summary>
        /// Get the animation for the specified accordion section or demand create
        /// the animation if it doesn't already exist.
        /// </summary>
        /// <param name="pane" type="Object" mayBeNull="false">
        /// The pane is an object of the form {header, content, animation} corresponding to
        /// that pane's header section, content section, and the animation used to open and
        /// close its content section.  The content element is a new div that has been created
        /// to wrap the original div (so we can completely collapse it - even if it has
        /// padding, margins, etc.) which is pointed to by a dynamic _original property. The
        /// header element has a dynamic _index property indicating its position in the
        /// Accordion's pane collection (used primarily by the headers' shared click
        /// handler). Furthermore, the animation will either be an instance of
        /// LengthAnimation or ParallelAnimation (in the latter case, it will have two
        /// children which are a LengthAnimation and a FadeAnimation).  There will be two
        /// dynamic properties _length and _fade pointing to each of these children (to
        /// easily set the length and fadeEffect properties).  There is also a dynamic _ended
        /// property which is an event handler to be fired when the animation is complete,
        /// a dynamic _opening property to indicate whether the animation was opening or
        /// closing the pane, and a dynamic _pane property to provide a reference to the pane
        /// that was being animated.
        /// </param>
        /// <returns type="Sys.Extended.UI.Animation.Animation">
        /// Animation for the desired section
        /// </returns>

        var animation = pane.animation;
        if (!animation) {
            var length = null;
            var fade = null;
            if (!this._fadeTransitions) {
                animation = length = new Sys.Extended.UI.Animation.LengthAnimation(pane.content, this._duration, this._framesPerSecond, "style", "height", 0, 0, "px");
            } else {
                length = new Sys.Extended.UI.Animation.LengthAnimation(null, null, null, "style", "height", 0, 0, "px");
                fade = new Sys.Extended.UI.Animation.FadeAnimation(null, null, null, Sys.Extended.UI.Animation.FadeEffect.FadeOut, 0, 1, false);
                animation = new Sys.Extended.UI.Animation.ParallelAnimation(pane.content, this._duration, this._framesPerSecond, [fade, length]);
            }

            pane.animation = animation;
            animation._length = length;
            animation._fade = fade;
            animation._pane = pane;
            animation._opening = true;
            animation._behavior = this;
            animation._ended = Function.createDelegate(pane.animation, this._onAnimationFinished);
            animation.add_ended(pane.animation._ended);

            animation.initialize();
        }
        return animation;
    },

    _onAnimationFinished: function() {
        /// <summary>
        /// _onAnimationFinished is an event handler played after an animation (to open/
        /// close an accordion pane) has completed.  The delegate for this function should
        /// have associated it with an animation (so the this references below are expecting
        /// to reach expando fields declared on the animation).  It invokes _endPaneChange
        /// for the current pane.
        /// </summary>
        /// <returns />
        this._behavior._endPaneChange(this._pane, this._opening);
    },

    _initializeLayout: function() {
        /// <summary>
        /// Setup the layout of the accordion (either when the behavior is created or when the
        /// AutoSize mode is changed).
        /// </summary>
        /// <returns />

        for (var i = 0; i < this._panes.length; i++) {
            var animation = this._panes[i].animation;
            if (animation && animation.get_isPlaying()) {
                animation.stop();
            }
        }

        var accordion = this.get_element();
        this._initialHeight = accordion.offsetHeight;
        var style = accordion.style;


        if (this._autoSize === Sys.Extended.UI.AutoSize.None) {
            this._disposeResizeHandler();

            var isIE7 = (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version >= 7)
            if (!isIE7 || (isIE7 && style.height && style.height.length > 0)) {
                style.height = 'auto';
            }
            if (!isIE7 || (isIE7 && style.overflow && style.overflow.length > 0)) {
                style.overflow = 'auto';
            }
        } else {
            this._addResizeHandler();

            style.height = accordion.offsetHeight + 'px';
            style.overflow = 'hidden';
        }

        for (var i = 0; i < this._panes.length; i++) {
            this._initializePane(i);
        }

        this._resizeSelectedPane();
    },


    _initializePane: function(index) {
        /// <summary>
        /// Setup the layout attributes for the pane so that it will be in a proper opened or
        /// closed.  This will be called when adding a new pane for the first time or when
        /// changing the AutoSize mode.
        /// </summary>
        /// <param name="index" type="Number" integer="true">
        /// Index of the pane to initialize
        /// </param>
        /// <returns />

        var pane = this.get_Pane(index);
        if (!pane) {
            return;
        }
        var wrapper = pane.content;
        var original = wrapper._original;

        var opened = (index === this._selectedIndex);
        wrapper.style.height = (opened || (this._autoSize === Sys.Extended.UI.AutoSize.Fill)) ? 'auto' : '0px';
        wrapper.style.overflow = opened ? 'auto' : 'hidden';
        wrapper.style.display = opened ? 'block' : 'none';
        original.style.height = 'auto';
        original.style.maxHeight = '';
        original.style.overflow = opened ? 'auto' : 'hidden';

        var opacity = (opened || !this._fadeTransitions) ? 1 : 0;
        if (this._autoSize === Sys.Extended.UI.AutoSize.Fill) {
            if ($common.getElementOpacity(original) != opacity) {
                $common.setElementOpacity(original, opacity);
            }
            if ($common.getElementOpacity(wrapper) != 1) {
                $common.setElementOpacity(wrapper, 1);
            }
        } else {
            if ($common.getElementOpacity(wrapper) != opacity) {
                $common.setElementOpacity(wrapper, opacity);
            }
            if ($common.getElementOpacity(original) != 1) {
                $common.setElementOpacity(original, 1);
            }
        }
        
        pane.header.className = this._selectedIndex === index ? (this._headerSelectedCssClass || this._headerCssClass) : this._headerCssClass;
    },

    _addResizeHandler: function() {
        /// <summary>
        /// Attach the resize handler
        /// </summary>
        /// <returns />
        /// <remarks>
        /// This has been pulled out into its own method since we need to selectively wire
        /// up the resize handler depending on the AutoSize mode.
        /// </remarks>

        if (!this._resizeHandler) {
            this._resizeHandler = Function.createDelegate(this, this._resizeSelectedPane);
            $addHandler(window, "resize", this._resizeHandler);
        }
    },

    dispose: function() {
        /// <summary>
        /// Dispose of the AccordionBehavior
        /// </summary>
        /// <returns />

        this._disposeResizeHandler();

        this._disposeAnimations();

        for (var i = this._panes.length - 1; i >= 0; i--) {
            var pane = this._panes[i];
            if (pane) {
                if (pane.header) {
                    pane.header._index = null;
                    $removeHandler(pane.header, "click", this._headerClickHandler);
                    pane.header = null;
                }
                if (pane.content) {
                    pane.content._original = null;
                    pane.content = null;
                }
                this._panes[i] = null;
                delete this._panes[i];
            }
        }
        this._panes = null;
        this._headerClickHandler = null;

        Sys.Extended.UI.AccordionBehavior.callBaseMethod(this, 'dispose');
    },

    _disposeResizeHandler: function() {
        /// <summary>
        /// Remove the resize handler
        /// </summary>
        /// <returns />
        /// <remarks>
        /// This has been pulled out into its own method since we need to selectively wire
        /// up the resize handler depending on the AutoSize mode.
        /// </remarks>

        if (this._resizeHandler) {
            $removeHandler(window, "resize", this._resizeHandler);
            this._resizeHandler = null;
        }
    },

    _disposeAnimations: function() {
        /// <summary>
        /// Dispose all the animations.  This method was pulled out of dispose so we could
        /// allow the user to change the FadeTransitions property after the behavior was
        /// already initialized.  We can merge it back into dispose once we support generic
        /// animations on the Accordion.
        /// </summary>
        /// <returns />

        for (var i = 0; i < this._panes.length; i++) {
            var animation = this._panes[i].animation;
            if (animation) {
                if (animation.get_isPlaying()) {
                    animation.stop();
                }

                if (animation._ended) {
                    animation.remove_ended(animation._ended);
                    animation._ended = null;
                }

                animation.dispose();

                animation._length = null;
                animation._fade = null;
                animation._pane = null;
                animation._opening = null;
                animation._behavior = null;
                this._panes[i].animation = null;
            }
        }
    },

    _resizeSelectedPane: function() {
        /// <summary>
        /// Adjust the size of the currently selected pane (upon initialization,
        /// resizing the window, etc.)
        /// </summary>
        /// <returns />

        var pane = this.get_Pane();
        if (!pane) {
            return;
        }

        this._headersSize = this._getHeadersSize().height;

        var original = pane.content._original;
        switch (this._autoSize) {
            case Sys.Extended.UI.AutoSize.None:
                original.style.height = 'auto';
                original.style.maxHeight = '';
                break;
            case Sys.Extended.UI.AutoSize.Limit:
                var remaining = this._getRemainingHeight(false);
                original.style.height = 'auto';
                original.style.maxHeight = remaining + 'px';
                break;
            case Sys.Extended.UI.AutoSize.Fill:
                var remaining = this._getRemainingHeight(true);
                original.style.height = remaining + 'px';
                original.style.maxHeight = '';
                break;
        }
    },

    _onHeaderClick: function(evt) {
        /// <summary>
        /// OnClick handler to open the desired pane
        /// </summary>
        /// <param name="evt" type="Sys.UI.DomEvent" mayBeNull="false">Event info</param>
        /// <returns />

        var header = evt.target;
        var accordion = this.get_element();
        while (header && (header.parentNode !== accordion)) {
            header = header.parentNode;
        }

        evt.stopPropagation();
        if (this._suppressHeaderPostbacks) {
            evt.preventDefault();
        }

        var index = header._index;
        if ((index === this._selectedIndex) && !this._requireOpenedPane) {
            index = -1;
        }
        this._changeSelectedIndex(index, true);
    },

    _changeSelectedIndex: function(index, animate, force) {
        /// <summary>
        /// Change the accordion's selected pane to a new index (and optionally show the change).
        /// </summary>
        /// <param name="index" type="Number" integer="true" mayBeNull="false">
        /// Index of the new selected pane
        /// </param>
        /// <param name="animate" type="Boolean" mayBeNull="false">
        /// Whether or not to show the pane change (this is primarily intended to support
        /// restoring _selectedIndex in initialize before any panes have been added)
        /// </param>
        /// <param name="force" type="Boolean" mayBeNull="true" optional="true">
        /// We perform no action (i.e. raising events, animating, etc.) if the two indices represent
        /// the same pane (including the case when we have two different "no pane selected values"
        /// like -1 and -500).  The force flag is used during initialization to skip this check since
        /// we aren't able to determine invalid values yet.
        /// </param>
        /// <returns />

        var lastIndex = this._selectedIndex;
        var currentPane = this.get_Pane(index);
        var lastPane = this.get_Pane(lastIndex);
        if (!force && (currentPane == lastPane)) {
            return;
        }

        var eventArgs = new Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs(lastIndex, index);
        this.raiseSelectedIndexChanging(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }

        if (lastPane) {
            lastPane.header.className = this._headerCssClass;
        }

        if (currentPane) {
            currentPane.header.className = (this._headerSelectedCssClass == '') ?
                this._headerCssClass : this._headerSelectedCssClass;
        }

        this._selectedIndex = index;

        this.set_ClientState(this._selectedIndex);

        if (animate) {
            this._changePanes(lastIndex);
        }

        this.raiseSelectedIndexChanged(new Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs(lastIndex, index));
        this.raisePropertyChanged('SelectedIndex');
    },

    _changePanes: function(lastIndex) {
        /// <summary>
        /// The _changePanes function is used to animate the change between two panes when
        /// the selected index changes.  We will loop through each pane and get its
        /// animation (or demand create it if it doesn't have one yet), stop playing it if
        /// it's currently playing, change its parameters to either open or close, and then
        /// animate it.  Because we have an animation for each pane and we stop them if they
        /// were already playing, the Accordion has the ability to nicely change panes
        /// again before the animation is finished.
        /// </summary>
        /// <param name="lastIndex" type="Number" integer="true" mayBeNull="false">
        /// Index of the last selected Accordion pane
        /// </param>
        /// <returns />

        if (!this.get_isInitialized()) {
            return;
        }

        var open = null;
        var close = null;
        for (var i = 0; i < this._panes.length; i++) {
            var pane = this._panes[i];
            var animation = this._getAnimation(pane);

            if (animation.get_isPlaying()) {
                animation.stop();
            }

            if (i == this._selectedIndex) {
                animation._opening = true;
                open = animation;
            } else if (i == lastIndex) {
                animation._opening = false;
                close = animation;
            } else {
                continue;
            }

            this._startPaneChange(pane, animation._opening);


            if (this._fadeTransitions) {
                animation._fade.set_effect(animation._opening ? Sys.Extended.UI.Animation.FadeEffect.FadeIn : Sys.Extended.UI.Animation.FadeEffect.FadeOut);
            }

            if (this._autoSize === Sys.Extended.UI.AutoSize.Fill) {
                animation.set_target(pane.content._original);
                animation._length.set_startValue($common.getContentSize(pane.content._original).height);
                animation._length.set_endValue(animation._opening ? this._getRemainingHeight(true) : 0);
            } else {
                animation.set_target(pane.content);
                animation._length.set_startValue(pane.content.offsetHeight);
                animation._length.set_endValue(animation._opening ? this._getRemainingHeight(false) : 0);
            }
        }

        if (close) {
            close.play();
        }
        if (open) {
            open.play();
        }

    },

    _startPaneChange: function(pane, opening) {
        /// <summary>
        /// Setup the pane before it is animated.
        /// </summary>
        /// <param name="pane" type="Object" mayBeNull="false">
        /// Pane that is being animated
        /// </param>
        /// <param name="opening" type="Boolean" mayBeNull="false">
        /// Whether or not the pane is being opened or closed
        /// </param>
        /// <returns />

        var wrapper = pane.content;
        var original = wrapper._original;

        if (opening) {
            wrapper.style.display = 'block';

            if (this._autoSize === Sys.Extended.UI.AutoSize.Fill && this._isIE8InStandardMode) {
                original.style.display = 'block';
            }
        } else {
            wrapper.style.overflow = 'hidden';

            original.style.overflow = 'hidden';

            if (this._autoSize === Sys.Extended.UI.AutoSize.Limit) {
                wrapper.style.height = this._getTotalSize(original).height + 'px';
                original.style.maxHeight = '';
            }
        }
    },

    _endPaneChange: function(pane, opening) {
        /// <summary>
        /// Clean the pane up after it's been animated.
        /// </summary>
        /// <param name="pane" type="Object" mayBeNull="false">
        /// Pane that is being animated
        /// </param>
        /// <param name="opening" type="Boolean" mayBeNull="false">
        /// Whether or not the pane is being opened or closed
        /// </param>
        /// <returns />

        var wrapper = pane.content;
        var original = wrapper._original;

        if (opening) {
            if (this._autoSize === Sys.Extended.UI.AutoSize.Limit) {
                var remaining = this._getRemainingHeight(true);
                original.style.maxHeight = remaining + 'px';
            }

            original.style.overflow = 'auto';

            wrapper.style.height = 'auto';
            wrapper.style.overflow = 'auto';
        } else {

            if (!this._isIE8InStandardMode) {
                wrapper.style.display = 'none';
            } else {
                if (this._autoSize === Sys.Extended.UI.AutoSize.Fill) {
                    original.style.display = 'none';
                } else {
                    wrapper.style.height = '0px';
                }
            }
        }
    },

    _getHeadersSize: function() {
        /// <summary>
        /// Compute the size of all the header sections
        /// </summary>
        /// <returns type="Object" mayBeNull="false">
        /// Size of all header sections (of the form {width, height}).
        /// </returns>

        var total = { width: 0, height: 0 };
        for (var i = 0; i < this._panes.length; i++) {
            var size = this._getTotalSize(this._panes[i].header);
            total.width = Math.max(total.width, size.width);
            total.height += size.height;
        }
        return total;
    },

    _getRemainingHeight: function(includeGutter) {
        /// <summary>
        /// Determine how much remaining height we have to fill with the currently selected
        /// pane's content section after taking into account all the headers.  This is primarily
        /// used for the Limit and Fill AutoSize modes.
        /// </summary>
        /// <param name="includeGutter" type="Boolean" mayBeNull="false">
        /// Whether or not we should include the gutter (padding, borders, margins) of the
        /// selected pane's original content section.  This should be true whenever we're
        /// getting the remaining height for the original content section and false whenever
        /// we're getting the remaining height for its wrapper.
        /// </param>
        /// <returns type="Number" integer="true">
        /// Remaining height after all the headers have been accounted for
        /// </returns>    

        var height = 0;
        var pane = this.get_Pane();

        if (this._autoSize === Sys.Extended.UI.AutoSize.None) {
            if (pane) {
                height = this._getTotalSize(pane.content._original).height;
            }
        } else {
            height = this._headersSize;
            if (includeGutter && pane) {
                height += this._getGutterSize(pane.content._original).height;
            }

            var accordion = this.get_element();
            height = Math.max(accordion.offsetHeight - height, 0);

            if (pane && (this._autoSize === Sys.Extended.UI.AutoSize.Limit)) {
                var required = this._getTotalSize(pane.content._original).height;
                if (required > 0) {
                    height = Math.min(height, required);
                }
            }
        }

        return height;
    },

    _getTotalSize: function(element) {
        /// <summary>
        /// Get the total size of an element, including its margins
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// Element
        /// </param>
        /// <returns type="Object">
        /// Total size of the element (in the form {width, height})
        /// </returns>

        var size = $common.getSize(element);
        var box = $common.getMarginBox(element);
        size.width += box.horizontal;
        size.height += box.vertical;
        return size;
    },

    _getGutterSize: function(element) {
        /// <summary>
        /// Get the extra "gutter" size around an element made up of its padding,
        /// borders, and margins.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// Element
        /// </param>
        /// <returns type="Object">
        /// Size of the extra space (in the form of {height, width})
        /// </returns>

        var gutter = { width: 0, height: 0 };

        try {
            var box = $common.getPaddingBox(element);
            gutter.width += box.horizontal;
            gutter.height += box.vertical;
        } catch (ex) { }

        try {
            var box = $common.getBorderBox(element);
            gutter.width += box.horizontal;
            gutter.height += box.vertical;
        } catch (ex) { }

        var box = $common.getMarginBox(element);
        gutter.width += box.horizontal;
        gutter.height += box.vertical;

        return gutter;
    },

    add_selectedIndexChanging: function(handler) {
        /// <summary>
        /// Add an event handler for the selectedIndexChanging event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('selectedIndexChanging', handler);
    },
    remove_selectedIndexChanging: function(handler) {
        /// <summary>
        /// Add an event handler for the selectedIndexChanging event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('selectedIndexChanging', handler);
    },
    raiseSelectedIndexChanging: function(eventArgs) {
        /// <summary>
        /// Raise the selectedIndexChanging event
        /// </summary>
        /// <param name="eventArgs" type="Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs" mayBeNull="false">
        /// Event arguments for the selectedIndexChanging event
        /// </param>
        /// <returns />

        var handler = this.get_events().getHandler('selectedIndexChanging');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_selectedIndexChanged: function(handler) {
        /// <summary>
        /// Add an event handler for the selectedIndexChanged event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('selectedIndexChanged', handler);
    },
    remove_selectedIndexChanged: function(handler) {
        /// <summary>
        /// Add an event handler for the selectedIndexChanged event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('selectedIndexChanged', handler);
    },
    raiseSelectedIndexChanged: function(eventArgs) {
        /// <summary>
        /// Raise the selectedIndexChanged event
        /// </summary>
        /// <param name="eventArgs" type="Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs" mayBeNull="false">
        /// Event arguments for the selectedIndexChanged event
        /// </param>
        /// <returns />

        var handler = this.get_events().getHandler('selectedIndexChanged');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    get_Pane: function(index) {
        /// <summary>
        /// Get a specific Accordion pane given its index.  If no index is provided, get
        /// the currently selected pane.
        /// </summary>
        /// <param name="index" type="Number" integer="true" mayBeNull="true">
        /// Index of the desired Accordion pane.  If the index is not provided, we use
        /// the currently selected index.  In the event the provided index (or the currently
        /// selected index) is outside the bounds of the panes collection, we return null.
        /// </param>
        /// <returns type="Object" mayBeNull="true">
        /// The desired pane object, or null if outside the the bounds of the _panes array.
        /// The pane is an object of the form {header, content, animation} corresponding to
        /// that pane's header section, content section, and the animation used to open and
        /// close its content section.  The content element is a new div that has been
        /// created to wrap the original div (so we can completely collapse it - even if it
        /// has padding, margins, etc.) which is pointed to by a dynamic _original property.
        /// The header element has a dynamic _index property indicating its position in the
        /// Accordion's pane collection (used primarily by the headers' shared click handler).
        /// Furthermore, the animation will either be an instance of LengthAnimation or
        /// ParallelAnimation (in the latter case, it will have two children which are a
        /// LengthAnimation and a FadeAnimation).  There will be two dynamic properties
        /// _length and _fade pointing to each of these children (to easily set the length
        /// and fadeEffect properties).  There is also a dynamic _ended property which is an
        /// event handler to be fired when the animation is complete, a dynamic _opening
        /// property to indicate whether the animation was opening or closing the pane, and
        /// a dynamic _pane property to provide a reference to the pane that was being
        /// animated.
        /// </returns>

        if (index === undefined || index === null) {
            index = this._selectedIndex;
        }
        return (this._panes && index >= 0 && index < this._panes.length) ? this._panes[index] : null;
    },

    get_Count: function() {
        /// <value type="Number" integer="true" mayBeNull="false">
        /// Number of Accordion panes
        /// </value>
        return this._panes ? this._panes.length : 0;
    },

    get_TransitionDuration: function() {
        /// <value type="Number">
        /// Length of time to transition between Accordion sections in
        /// milleseconds.  The default value is 250ms.
        /// </value>
        return this._duration * 1000;
    },
    set_TransitionDuration: function(value) {
        if (this._duration != (value / 1000)) {
            this._duration = value / 1000;
            for (var i = 0; i < this._panes.length; i++) {
                var animation = this._panes[i].animation;
                if (animation) {
                    animation.set_duration(this._duration);
                }
            }
            this.raisePropertyChanged('TransitionDuration');
        }
    },

    get_FramesPerSecond: function() {
        /// <value type="Number" integer="true">
        /// Number of steps per second in the transition animations.
        /// The default value is 30 frames per second.
        /// </value>
        return this._framesPerSecond;
    },
    set_FramesPerSecond: function(value) {
        if (this._framesPerSecond != value) {
            this._framesPerSecond = value;
            for (var i = 0; i < this._panes.length; i++) {
                var animation = this._panes[i].animation;
                if (animation) {
                    animation.set_fps(this._framesPerSecond);
                }
            }
            this.raisePropertyChanged('FramesPerSecond');
        }
    },

    get_FadeTransitions: function() {
        /// <value type="Boolean">
        /// Whether or not to fade the accordion panes when transitioning
        /// </value>
        return this._fadeTransitions;
    },
    set_FadeTransitions: function(value) {
        if (this._fadeTransitions != value) {
            this._fadeTransitions = value;

            this._disposeAnimations();

            if (!this._fadeTransitions) {
                for (var i = 0; i < this._panes.length; i++) {
                    if ($common.getElementOpacity(this._panes[i].content) != 1) {
                        $common.setElementOpacity(this._panes[i].content, 1);
                    }
                    if ($common.getElementOpacity(this._panes[i].content._original) != 1) {
                        $common.setElementOpacity(this._panes[i].content._original, 1);
                    }
                }
            }
            this.raisePropertyChanged('FadeTransitions');
        }
    },

    get_HeaderCssClass: function() {
        /// <summary>
        /// This is the CSS class applied to each header.
        /// </summary>
        return this._headerCssClass;
    },

    set_HeaderCssClass: function(value) {
        this._headerCssClass = value;
        this.raisePropertyChanged('HeaderCssClass');
    },

    get_HeaderSelectedCssClass: function() {
        /// <summary>
        /// This is the CSS class applied to the selected header.
        /// </summary>
        return this._headerSelectedCssClass;
    },

    set_HeaderSelectedCssClass: function(value) {
        this._headerSelectedCssClass = value;
        this.raisePropertyChanged('HeaderSelectedCssClass');
    },

    get_AutoSize: function() {
        /// <value type="Sys.Extended.UI.AutoSize">
        /// AutoSize mode
        /// </value>
        return this._autoSize;
    },
    set_AutoSize: function(value) {
        if (Sys.Browser.agent === Sys.Browser.InternetExplorer && value === Sys.Extended.UI.AutoSize.Limit) {
            value = Sys.Extended.UI.AutoSize.Fill;
        }

        if (this._autoSize != value) {
            this._autoSize = value;
            this._initializeLayout();
            this.raisePropertyChanged('AutoSize');
        }
    },

    get_SelectedIndex: function() {
        /// <value type="Number" integer="true">
        /// Index of the currently selected Accordion section
        /// </value>
        return this._selectedIndex;
    },
    set_SelectedIndex: function(value) {
        this._changeSelectedIndex(value, true);
    },

    get_requireOpenedPane: function() {
        /// <value type="Boolean">
        /// Whether or not clicking the header will close the currently opened pane
        /// (which leaves all the Accordion's panes closed)
        /// </value>
        return this._requireOpenedPane;
    },
    set_requireOpenedPane: function(value) {
        if (this._requireOpenedPane != value) {
            this._requireOpenedPane = value;
            this.raisePropertyChanged('requireOpenedPane');
        }
    },

    get_suppressHeaderPostbacks: function() {
        /// <value type="Boolean">
        /// Whether or not we suppress the client-side click handlers of any elements
        /// (including server controls like Button or HTML elements like anchor) in the
        /// header sections of the Accordion.
        /// </value>
        return this._suppressHeaderPostbacks;
    },
    set_suppressHeaderPostbacks: function(value) {
        if (this._suppressHeaderPostbacks != value) {
            this._suppressHeaderPostbacks = value;
            this.raisePropertyChanged('suppressHeaderPostbacks');
        }
    }
}
Sys.Extended.UI.AccordionBehavior.registerClass('Sys.Extended.UI.AccordionBehavior', Sys.Extended.UI.BehaviorBase);
Sys.registerComponent(Sys.Extended.UI.AccordionBehavior, { name: "accordion" });

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedAnimations", "ExtendedBase"], execute);
}
else {
    execute();
}

})();
