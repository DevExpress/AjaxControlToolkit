// Some of the techniques used in this.script were adapted with permission from Bertrand
// LeRoy's MIX06 Demo (http://weblogs.asp.net/bleroy/archive/2006/03/28/441343.aspx)
Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.AutoSize = function() {
    // The AutoSize enumeration is used to specify how the AccordionBehavior limits
    // the growth of the accordion when panes are expanded and collapsed.  It must
    // correspond to the AutoSize CLR enumeration in AutoSize.cs.
    //
    // "None" - allows the accordion to expand/collapse without restriction.
    // "Fill" - keeps the accordion the same size as its specified size.  If any
    // panes are larger or smaller than the available space, grow or shrink
    // them to the available space.    
    // "Limit" - prevents the accordion from growing any larger than its specified size.
    // If the content of a pane is too large to fit, grow it to fill the
    // remaining space.
    throw Error.invalidOperation();
}
Sys.Extended.UI.AutoSize.prototype = {
    None : 0,
    Fill : 1,
    Limit : 2
}
Sys.Extended.UI.AutoSize.registerEnum("Sys.Extended.UI.AutoSize", false);

Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs = function(oldIndex, selectedIndex) {
    // Event arguments used to provide notification when an accordion's selected
    // index is changed.  The same event argument type is used for both the
    // selectedIndexChanging event and the selectedIndexChanged events.  If you set
    // the cancel property to true during the selectedIndexChanging event, the
    // accordion will not change panes.  The cancel property has no effect during
    // the selectedIndexChanged event.
    //
    // "oldIndex" - Last selected index
    // "selectedIndex" - new selected index
    Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs.initializeBase(this);

    this._oldIndex = oldIndex;
    this._selectedIndex = selectedIndex;
}
Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs.prototype = {
    get_oldIndex : function() {
        return this._oldIndex;
    },
    set_oldIndex : function(value) {
        this._oldIndex = value;
    },
    
    get_selectedIndex : function() {
        return this._selectedIndex;
    },
    set_selectedIndex : function(value) {
        this._selectedIndex = value;
    }
}
Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs.registerClass('Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs', Sys.CancelEventArgs);


// The Accordion layout is slightly complex because we support several AutoSize modes
// that are applied to an element collection across multiple events and animations.
// To make the code a little easier to understand, we'll provide a brief description
// of the element format, the control flow for laying out the elements, and an informal
// "correctness proof" of our algorithm.
//
// The Accordion server control will create a collection of panes which it will dump
// out as a sequence of <div>s where the (2i)th <div> is the ith header and the
// (2i+1)th <div> is the ith content section:
// 
//      <div id="Accordion" ... >
//          ...
//          <div id="2i" ... >Ith Header</div>
//          <div id="2i+1" ... >Ith Content</div>
//          ...
//      </div>
// 
// Because the <div>s may have padding, borders, or margins (we'll refer to these
// additional pixels as the "gutter"), we cannot collapse them all the way during
// animation (i.e. myDiv.style.height = '0px' will still show myDiv's padding,
// borders, and margins).  To work around this, we wrap all of the content section
// <div>s in wrappers that have no "gutter" style to end up with a tree of DOM
// elements that looks like:
// 
//      <div id="Accordion" ... >
//          ...
//          <div id="2i" ... >Ith Header</div>
//          <div id="2i+1 Wrapper">
//              <div id="2i+1 Original" ... >Ith Content</div>
//          </div>
//          ...
//      </div>
// 
// We automatically wrap the content section when it is passed to the addPane
// function.  From here on out, we'll refer to the behavior's target element (the
// root <div>) as the accordion, the dynamically created <div> as a wrapper, and
// the content section <div> as the original <div>.
//
// The primary purpose of the accordion is to expand and collapse its panes so that
// at most only one pane is open at a time.  We want to do this using animations for
// a polished effect, but we must also respect the AutoSize modes (where None allows
// the accordion to grow unrestrained, Limit provides a maximum height for the
// accordion, and Fill forces the accordion to always be the specified size).  Given
// the structure of an accordion, original <div>s, and wrapper <div>s, we accomplish
// the layout requirements using the following CSS properties:
//      Accordion root <div>:
//          height
//          overflow
//      Wrapper <div>:
//          height
//          opacity
//          overflow
//          display
//      Original content section <div>:
//          height
//          maxHeight
//          overflow
// 
// The large table below precisely defines the expected value of the properties at
// any given point in time.  Each of the columns 1 through 8 represents a possible
// state of the accordion.  Most of the time the accordion will be in states 1 and 5
// until the user clicks a header section and triggers a series of changes.  The rows
// of the table represent the properties of elements in a particular AutoSize mode.
// For example, a closed wrapper <div> with the Limit AutoSize mode should have a value
// of '0px' for its height.  Most of the properties in the the table are literal values
// like 'auto', 'hidden', '0px', etc.  The value Current for a property is used to
// indicate that a height set to 'auto' should be assigned its explicit value (i.e.
// element.offsetHeight) so that it will not be able to grow/shrink during an animation.
// The value Remaining for a height property refers specifically to the available space
// remaining after all the header sections of the accordion have been taken into
// consideration (this is used specifically for setting the size of the open content
// section when working in Limit or Fill AutoSize modes).  It's important to note that
// the Remaining value, retrieved by calling _getRemainingHeight, is slightly different
// for a wrapper <div> compared to a an original <div> because it must also consider the
// "gutter" offsets for an original <div>.  Finally, the animations (columns 3 and 7)
// are represented as transformations that take one property value to another when played.
//
//    ------------------------+---------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+
//                            |  +---                         Closing an open pane                                    |                              Opening a closed pane                          <--+  |
//        AutoSize Mode       |  |        1.              2.                  3.                  4.                  |       5.              6.                  7.                  8.               |  |
//            Element         |  +-->     Opened   ->     Before Closing  ->  Closing      ->     After Closing     --+->     Closed    ->    Before Opening  ->  Opening     ->      After Opening ---+  |
//                Property    |           Pane            Animation           Animation           Animation           |       Pane            Animation           Animation           Animation           |
//    ------------------------+---------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+
//        None:               |                                                                                       |                                                                                   |
//            Accordion:      |                                                                                       |                                                                                   |
//                height:     |           'auto'          .                   .                   .                   |       'auto'          .                   .                   .                   |
//                overflow:   |           'auto'          .                   .                   'auto'              |       'auto'          .                   .                   'auto'              |
//            Wrapper:        |                                                                                       |                                                                                   |
//                height:     |           'auto'          .                   Current -> '0px'    .                   |       '0px'           .                   '0px' -> Current    'auto'              |
//                opacity:    |           1.0             .                   1.0 -> 0.0          .                   |       0.0             .                   0.0 -> 1.0          .                   |
//                overflow:   |           'auto'          'hidden'            .                   .                   |       'hidden'        .                   .                   'auto'              |
//                display:    |           'block'         .                   .                   'none'              |       'none'          'block'             .                   .                   |
//            Original:       |                                                                                       |                                                                                   |
//                height:     |           'auto'          .                   .                   .                   |       'auto'          .                   .                   .                   |
//                maxHeight:  |           ''              .                   .                   .                   |       ''              .                   .                   .                   |
//                overflow:   |           'auto'          'hidden'            .                   .                   |       'hidden'        .                   .                   'auto'              |
//    ------------------------+---------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+
//        Limit:              |                                                                                       |                                                                                   |
//            Accordion:      |                                                                                       |                                                                                   |
//                height:     |           Current         .                   .                   .                   |       Current         .                   .                   .                   |
//                overflow:   |           'hidden'        .                   .                   .                   |       'hidden'        .                   .                   .                   |
//            Wrapper:        |                                                                                       |                                                                                   |
//                height:     |           'auto'          Remaining           Remaining -> '0px'  .                   |       '0px'           .                   '0px' -> Remaining  'auto'              |
//                opacity:    |           1.0             .                   1.0 -> 0.0          .                   |       0.0             .                   0.0 -> 1.0          .                   |
//                overflow:   |           'auto'          'hidden'            .                   .                   |       'hidden'        .                   .                   'auto'              |
//                display:    |           'block'         .                   .                   'none'              |       'none'          'block'             .                   .                   |
//            Original:       |                                                                                       |                                                                                   |
//                height:     |           'auto'          .                   .                   .                   |       'auto'          .                   .                   .                   |
//                maxHeight:  |           Remaining       'auto'              .                   .                   |       'auto'          .                   .                   Remaining           |
//                overflow:   |           'auto'          'hidden'            .                   .                   |       'hidden'        .                   .                   'auto'              |
//    ------------------------+---------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+
//        Fill:               |                                                                                       |                                                                                   |
//            Accordion:      |                                                                                       |                                                                                   |
//                height:     |           Current         .                   .                   .                   |       Current         .                   .                   .                   |
//                overflow:   |           'hidden'        .                   .                   .                   |       'hidden'        .                   .                   .                   |
//            Wrapper:        |                                                                                       |                                                                                   |
//                height:     |           'auto'          .                   .                   .                   |       'auto'          .                   .                   .                   |
//                opacity:    |           1.0             .                   1.0 -> 0.0          .                   |       0.0             .                   0.0 -> 1.0          .                   |
//                overflow:   |           'auto'          'hidden'            .                   .                   |       'hidden'        .                   .                   'auto'              |
//                display:    |           'block'         .                   .                   'none'              |       'none'          'block'             .                   .                   |
//            Original:       |                                                                                       |                                                                                   |
//                height:     |           Remaining       .                   Remaining -> '0px'  .                   |       '0px'           .                   '0px' -> Remaining  .                   |
//                maxHeight:  |           ''              .                   .                   .                   |       ''              .                   .                   .                   |
//                overflow:   |           'auto'          'hidden'            .                   .                   |       'hidden'        .                   .                   'auto'              |
//    ------------------------+---------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+
//
// Although this table is rather large, it's extremely useful because it allows
// us to present an informal argument for the correctness of our layout algorithm.
// It's easy to verify that if an accordion starts in state 1 and proceeds through
// steps 2, 3, and 4 when closing, it will arrive properly in state 5.  Similarly
// an accordion starting in state 5 that is opened will progress through steps 6, 7,
// and 8 to arrive back at step 1.  Clearly then any accordion starting in a valid
// state of 1 or 5 can be opened or closed repeatedly and return to a proper state.
// It's also worth pointing out that this layout algorithm can operate on one or two
// panes at a time (i.e. if all panes were closed and one were clicked, it would
// open a single pane...  but if one pane were already open and another were clicked,
// it would have to close one while opening the other).
//
// States 1 and 5 from the above table are implemented in the _intiailizeLayout and
// _initializePane functions.  States 2 and 6 are handled by the _startPaneChange
// function while states 4 and 8 are handled by the _endPaneChange function.  Finally,
// states 3 and 7 are intialized and played in the _changePanes function.

Sys.Extended.UI.AccordionBehavior = function(element) {
    // The AccordionBehavior is used to turn properly structured XHTML into an
    // Accordion with panes that can expand one at a time.
    //
    // "element" - the DOM element the behavior is associated with.  It should contain an
    // even number of child divs (such that ith pane has a header at div 2i and
    // has content at div 2i+1).
    Sys.Extended.UI.AccordionBehavior.initializeBase(this, [element]);

    // The _selectedIndex variable is used to track the currently visible content
    // pane.  It is persisted via ClientState so that it can be restored on PostBack.
    // If 0 <= _selectedIndex < _panes.Length is not true, then no pane is selected
    // (and they all appear collapsed).  While any index outside the bounds of the
    // _panes array indicates that no pane is selected, we don't automatically set
    // the value to a sentinel like -1 (especially on the server) because it's
    // possible for additional panes to be added at any time.  We abstract this
    // problem using the get_Pane() function which returns the selected pane when
    // it's called with no arguments (and returns null when the current selected
    // index is invalid).
    this._selectedIndex = 0;

    // The _panes array represents the collection of Accordion panes.  Each element of
    // the array is an object of the form {header, content, animation} corresponding
    // to that pane's header section, content section, and the animation used to open
    // and close its content section.  The content element is a new div that has been
    // created to wrap the original div (so we can completely collapse it - even if it
    // has padding, margins, etc.) which is pointed to by a dynamic _original property.
    // The header element has a dynamic _index property indicating its position in the
    // Accordion's pane collection (used primarily by the headers' shared click handler).
    // Furthermore, the animation will either be an instance of LengthAnimation or
    // ParallelAnimation (in the latter case, it will have two children which are a
    // LengthAnimation and a FadeAnimation).  There will be two dynamic properties
    // _length and _fade pointing to each of these children (to easily set the length
    // and fadeEffect properties).  There is also a dynamic _ended property which is
    // an event handler to be fired when the animation is complete, a dynamic _opening
    // property to indicate whether the animation was opening or closing the pane, and
    // a dynamic _pane property to provide a reference to the pane that was being
    // animated.
    this._panes = [];

    // The this._fadeTransitions flag determines whether or not we enable a simple fade
    // animation effect on top of the opening and closing effect
    this._fadeTransitions = false;

    // The this._duration represents the transition duration of the animations in seconds
    this._duration = 0.25;

    // framesPerSecond is used to tune the animation to perform well depending on
    // the the type of effect being used an the number of accordion panes, etc.
    this._framesPerSecond = 30;

    // Determine how growth of the Accordion will be controlled.  If it is set to
    // None, then the Accordion can grow as large or as small as necessary.  If it is
    // set to Limit, then the Accordion will always be less than or equal to its
    // available space.  If it is set to Fill, then it will always be equal to its
    // available space.
    this._autoSize = Sys.Extended.UI.AutoSize.None;

    // Whether or not clicking the header will close the currently opened pane (which
    // leaves all the Accordion's panes closed)
    this._requireOpenedPane = true;

    // Whether or not we suppress the client-side click handlers of any elements
    // (including server controls like Button or HTML elements like anchor) in the header
    // sections of the Accordion
    this._suppressHeaderPostbacks = false;

    // Size of all the headers
    this._headersSize = 0;

    // The _headerClickHandler is a reference to the event handler that all the header
    // elements of our panes will be wired up to
    this._headerClickHandler = null;

    // The _headerSelectedCssClass is the css class applied to the selected header.    
    this._headerCssClass = '';

    // The _headerSelectedCssClass is the css class applied to the selected header.    
    this._headerSelectedCssClass = '';

    // The _resizeHandler is a reference to the global event handler used to patch
    // up the accordion when the window is resized
    this._resizeHandler = null;

    // Check the browser version and document mode to see if IE8 in standards-compliant mode is used
    this._isIE8InStandardMode = (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version > 7 && Sys.Browser.documentMode != 0);
}
Sys.Extended.UI.AccordionBehavior.prototype = {
    initialize: function() {
        // The initialize function is responsible for getting the selected index from
        // the ClientState mechanism and walking the children of the behavior's target
        // to find all of the accordion's child panes.  It builds up a collection of the
        // panes from the headers and content sections.  Then we hide all the content
        // sections that aren't selected and initialize the layout.
        Sys.Extended.UI.AccordionBehavior.callBaseMethod(this, 'initialize');

        // Create the onclick handler used by the accordion's headers
        this._headerClickHandler = Function.createDelegate(this, this._onHeaderClick);

        // Get the selected index from ClientState
        var state = this.get_ClientState();
        if (state !== null && state !== '') {
            this._changeSelectedIndex(parseInt(state), false, true);
        }

        // Walk the children of the target control to obtain the accordion's child panes.
        // We are expecting a hierarchy of divs that looks like:
        //   <div id="accordion">         this.element
        //     ...
        //     <div id="header_i"></div>   this.element.childNodes[2i]
        //     <div id="content_i"></div>  this.element.childNodes[2i+1]
        //     ...
        //   </div>
        // We'll turn this hierarchy of divs into objects filling the _panes collection.
        // See the comment above the _panes array for more details on the structure of
        // these objects.  It's also worth pointing out that we effectively "box" the
        // index so it can be passed by reference to the _getNextDiv function
        var nodes = this.get_element().childNodes;
        var index = {};
        for (index.value = 0; index.value < nodes.length; index.value++) {
            var header = this._getNextDiv(nodes, index);
            if (!header) {
                break;
            }
            var content = this._getNextDiv(nodes, index);
            if (content) {
                // Add the pane once we've found both a header and a content section
                // (but bump the loop index back so we don't skip an element when the
                // loop increments)
                this.addPane(header, content);
                index.value--;
            }
        }

        // Ensure we have an opened pane if we're required to (and use the first
        // pane if we don't have a valid selected index)
        if (this._requireOpenedPane && !this.get_Pane() && this._panes.length > 0) {
            this._changeSelectedIndex(0, false, true);
        }

        // Setup the layout for the given AutoSize mode
        this._initializeLayout();
    },

    _getNextDiv: function(nodes, index) {
        // Get the next div in a sequence of child nodes starting at the
        // given index
        //
        // "nodes" - array of child nodes (i.e. element.childNodes)
        // "index" - The index is an object of the form { value } where index.value represents
        // the current index in the collection of nodes.  We wrap the index in an object
        // to perform the .NET equivalent of boxing so it can be passed by reference.
        var div = null;
        while (index.value < nodes.length && (div = nodes[index.value++])) {
            if (div.tagName && (div.tagName.toLowerCase() === 'div')) {
                break;
            }
        }
        return div;
    },

    addPane: function(header, content) {
        // Create a new Accordion pane given references to its header and content divs
        // and add it to the _panes collection.  We also wrap the content div in a new
        // container div, add a click handler to the header div, etc.
        // New pane object added to the end of the Accordion's pane collection.  The pane
        // is an object of the form {header, content, animation} corresponding to that
        // pane's header section, content section, and the animation used to open and
        // close its content section.  The content element is a new div that has been
        // created to wrap the original div (so we can completely collapse it - even if it
        // has padding, margins, etc.) which is pointed to by a dynamic _original property.
        // The header element has a dynamic _index property indicating its position in the
        // Accordion's pane collection (used primarily by the headers' shared click handler).
        // Furthermore, the animation will either be an instance of LengthAnimation or
        // ParallelAnimation (in the latter case, it will have two children which are a
        // LengthAnimation and a FadeAnimation).  There will be two dynamic properties
        // _length and _fade pointing to each of these children (to easily set the length
        // and fadeEffect properties).  There is also a dynamic _ended property which is
        // an event handler to be fired when the animation is complete, a dynamic _opening
        // property to indicate whether the animation was opening or closing the pane, and
        // a dynamic _pane property to provide a reference to the pane that was being
        // animated.
        //
        // "header" - header element of the new Accordion pane
        // "content" - content element of the new Accordion pane

        // Create the new pane object
        var pane = {};
        pane.animation = null;

        // Initialize the header
        pane.header = header;
        header._index = this._panes.length;
        $addHandler(header, "click", this._headerClickHandler);

        // Wrap the content in a new element
        var accordion = this.get_element();
        var wrapper = document.createElement('div');
        accordion.insertBefore(wrapper, content);
        wrapper.appendChild(content);
        wrapper._original = content;
        pane.content = wrapper;

        // Remove any style facets (possibly) automatically applied by
        // CSS selectors so they don't interfere with UI/layout
        wrapper.style.border = '';
        wrapper.style.margin = '';
        wrapper.style.padding = '';

        // Add the new pane at the bottom of the accordion
        Array.add(this._panes, pane);

        // Setup the layout attributes for the pane so that it will be in a proper opened or
        // closed state (we don't bother setting the opacity of the wrapper with
        // $common.setElementOpacity(wrapper, selected ? 1 : 0); because it will
        // be taken care of by the animation)
        this._initializePane(header._index);

        // Since the content section of the accordion panes will be sent down from the server
        // with display: none (so the content sections aren't shown before they're wrapped in
        // new divs) we'll turn them back on once they've been wrapped in hidden divs
        content.style.display = 'block';

        return pane;
    },

    _getAnimation: function(pane) {
        // Get the animation for the specified accordion section or demand create
        // the animation if it doesn't already exist.
        //
        // "pane"- the pane is an object of the form {header, content, animation} corresponding to
        // that pane's header section, content section, and the animation used to open and
        // close its content section.  The content element is a new div that has been created
        // to wrap the original div (so we can completely collapse it - even if it has
        // padding, margins, etc.) which is pointed to by a dynamic _original property. The
        // header element has a dynamic _index property indicating its position in the
        // Accordion's pane collection (used primarily by the headers' shared click
        // handler). Furthermore, the animation will either be an instance of
        // LengthAnimation or ParallelAnimation (in the latter case, it will have two
        // children which are a LengthAnimation and a FadeAnimation).  There will be two
        // dynamic properties _length and _fade pointing to each of these children (to
        // easily set the length and fadeEffect properties).  There is also a dynamic _ended
        // property which is an event handler to be fired when the animation is complete,
        // a dynamic _opening property to indicate whether the animation was opening or
        // closing the pane, and a dynamic _pane property to provide a reference to the pane
        // that was being animated.

        var animation = pane.animation;
        if (!animation) {
            // Determine whether or not to just use the length animation or build a
            // composite effect with fading transitions (note that only the parent
            // animation has the duration/fps specfied)
            var length = null;
            var fade = null;
            if (!this._fadeTransitions) {
                animation = length = new Sys.Extended.UI.Animation.LengthAnimation(pane.content, this._duration, this._framesPerSecond, "style", "height", 0, 0, "px");
            } else {
                length = new Sys.Extended.UI.Animation.LengthAnimation(null, null, null, "style", "height", 0, 0, "px");
                fade = new Sys.Extended.UI.Animation.FadeAnimation(null, null, null, Sys.Extended.UI.Animation.FadeEffect.FadeOut, 0, 1, false);
                animation = new Sys.Extended.UI.Animation.ParallelAnimation(pane.content, this._duration, this._framesPerSecond, [fade, length]);
            }

            // Create references to the length and fade animations so we can easily
            // set the length and fadeEffect properties when animating without having
            // to reach into the composite animation.
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
        // _onAnimationFinished is an event handler played after an animation (to open/
        // close an accordion pane) has completed.  The delegate for this function should
        // have associated it with an animation (so the this references below are expecting
        // to reach expando fields declared on the animation).  It invokes _endPaneChange
        // for the current pane.
        this._behavior._endPaneChange(this._pane, this._opening);
    },

    _initializeLayout: function() {
        // Setup the layout of the accordion (either when the behavior is created or when the
        // AutoSize mode is changed).

        // Stop any animations that are still playing (i.e. that haven't finished opening
        // or closing from changing previous panes) in case the user changed the AutoSize
        // mode while an animation was playing.
        for (var i = 0; i < this._panes.length; i++) {
            var animation = this._panes[i].animation;
            if (animation && animation.get_isPlaying()) {
                animation.stop();
            }
        }

        // Cache the initial size of the accordion
        var accordion = this.get_element();
        this._initialHeight = accordion.offsetHeight;
        var style = accordion.style;


        // Initialize the accordion itself
        if (this._autoSize === Sys.Extended.UI.AutoSize.None) {
            // Remove the window resizing handler
            this._disposeResizeHandler();

            // IE7 appears to have a rendering quirk where it will hide the
            // accordion if we change height or overflow from the empty string
            // to auto when it's contained in a fixed size div.  We'll just not
            // change the value if that's the case.
            var isIE7 = (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version >= 7)
            if (!isIE7 || (isIE7 && style.height && style.height.length > 0)) {
                style.height = 'auto';
            }
            if (!isIE7 || (isIE7 && style.overflow && style.overflow.length > 0)) {
                style.overflow = 'auto';
            }
        } else {
            // Add the window's resizing handler
            this._addResizeHandler();

            style.height = accordion.offsetHeight + 'px';
            style.overflow = 'hidden';
        }

        // Setup the layout attributes for the pane so that it will be in a proper opened
        // or closed state
        for (var i = 0; i < this._panes.length; i++) {
            this._initializePane(i);
        }

        // Resize the selected pane so (depending on the AutoSize mode) it will fill the
        // available remaining space after the headers have been laid out.
        this._resizeSelectedPane();
    },


    _initializePane: function(index) {
        // Setup the layout attributes for the pane so that it will be in a proper opened or
        // closed.  This will be called when adding a new pane for the first time or when
        // changing the AutoSize mode.
        //
        // "index" - index of the pane to initialize

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
        // Attach the resize handler
        // This has been pulled out into its own method since we need to selectively wire
        // up the resize handler depending on the AutoSize mode.

        if (!this._resizeHandler) {
            this._resizeHandler = Function.createDelegate(this, this._resizeSelectedPane);
            $addHandler(window, "resize", this._resizeHandler);
        }
    },

    dispose: function() {
        // Remove the window resizing handler
        this._disposeResizeHandler();

        // Wipe all the animations
        this._disposeAnimations();

        // Wipe the _panes collection.  We're careful to wipe any expando properties
        // which could cause memory leaks in IE6.
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
        // Remove the resize handler
        // This has been pulled out into its own method since we need to selectively wire
        // up the resize handler depending on the AutoSize mode.

        if (this._resizeHandler) {
            $removeHandler(window, "resize", this._resizeHandler);
            this._resizeHandler = null;
        }
    },

    _disposeAnimations: function() {
        // Dispose all the animations.  This method was pulled out of dispose so we could
        // allow the user to change the FadeTransitions property after the behavior was
        // already initialized.  We can merge it back into dispose once we support generic
        // animations on the Accordion.

        for (var i = 0; i < this._panes.length; i++) {
            var animation = this._panes[i].animation;
            if (animation) {
                // Stop the animation if it was still playing
                if (animation.get_isPlaying()) {
                    animation.stop();
                }

                // Remove the event handler that runs after the animation completes
                if (animation._ended) {
                    animation.remove_ended(animation._ended);
                    animation._ended = null;
                }

                // Dispose the animation's resources (timer, etc.)
                animation.dispose();

                // Wipe expando properties to prevent leaks in IE6
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
        var pane = this.get_Pane();
        if (!pane) {
            return;
        }

        // Cache the header size so it only gets looked up when the window resizes
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
        // Get the header that raised the event (by walking up the event target's
        // control hierarchy until we find an element just below the root of the accordion)
        var header = evt.target;
        var accordion = this.get_element();
        while (header && (header.parentNode !== accordion)) {
            header = header.parentNode;
        }

        // Stop the event from bubbling out of the header pane and prevent any
        // action from happening unless we clicked a control inside the header
        evt.stopPropagation();
        if (this._suppressHeaderPostbacks) {
            evt.preventDefault();
        }

        // Select this pane (which saves it to ClientState and initiates an animation
        // to show the content pane).  If the user clicked the currently open pane and
        // we're not required to keep one pane open, then we'll set the selected index
        // to -1 which will close it (which means all panes will be collapsed).
        var index = header._index;
        if ((index === this._selectedIndex) && !this._requireOpenedPane) {
            index = -1;
        }
        this._changeSelectedIndex(index, true);
    },

    _changeSelectedIndex: function(index, animate, force) {
        // Change the accordion's selected pane to a new index (and optionally show the change).
        //
        // "index" - index of the new selected pane
        // "animate" - whether or not to show the pane change (this is primarily intended to support
        // restoring _selectedIndex in initialize before any panes have been added)
        // "force" - we perform no action (i.e. raising events, animating, etc.) if the two indices represent
        // the same pane (including the case when we have two different "no pane selected values"
        // like -1 and -500).  The force flag is used during initialization to skip this check since
        // we aren't able to determine invalid values yet.

        // Don't bother doing anything if the index didn't change (we actually check the
        // panes so any invalid indices will match because get_Pane() will return null for
        // both of them)
        var lastIndex = this._selectedIndex;
        var currentPane = this.get_Pane(index);
        var lastPane = this.get_Pane(lastIndex);
        if (!force && (currentPane == lastPane)) {
            return;
        }

        // Raise the selectedIndexChanging event but don't change the selected index
        // if the handler set the cancel property to true
        var eventArgs = new Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs(lastIndex, index);
        this.raiseSelectedIndexChanging(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }

        //This sets the header CSS class to the non-selected case.
        if (lastPane) {
            lastPane.header.className = this._headerCssClass;
        }

        //This sets the selected header CSS class if available.
        if (currentPane) {
            currentPane.header.className = (this._headerSelectedCssClass == '') ?
                this._headerCssClass : this._headerSelectedCssClass;
        }

        this._selectedIndex = index;

        // Save the selected pane to preserve on postbacks
        this.set_ClientState(this._selectedIndex);

        // Animate the pane changes if required
        if (animate) {
            this._changePanes(lastIndex);
        }

        // Raise the selectedIndexChanged event and the propertyChanged event.  We include
        // both events because many users have expressed that the propertyChanged event is
        // not discoverable.
        this.raiseSelectedIndexChanged(new Sys.Extended.UI.AccordionSelectedIndexChangeEventArgs(lastIndex, index));
        this.raisePropertyChanged('SelectedIndex');
    },

    _changePanes: function(lastIndex) {
        // The _changePanes function is used to animate the change between two panes when
        // the selected index changes.  We will loop through each pane and get its
        // animation (or demand create it if it doesn't have one yet), stop playing it if
        // it's currently playing, change its parameters to either open or close, and then
        // animate it.  Because we have an animation for each pane and we stop them if they
        // were already playing, the Accordion has the ability to nicely change panes
        // again before the animation is finished.
        //
        // "lastIndex" - index of the last selected Accordion pane

        if (!this.get_isInitialized()) {
            return;
        }

        var open = null;
        var close = null;
        for (var i = 0; i < this._panes.length; i++) {
            // Get the animation for each pane (creating it on demand if it doesn't
            // already exist)
            var pane = this._panes[i];
            var animation = this._getAnimation(pane);

            // Stop any animations that are still playing (i.e. that haven't finished
            // opening or closing from changing previous panes)
            if (animation.get_isPlaying()) {
                animation.stop();
            }

            // If we're not opening or closing the current pane, then restart the loop.
            // We set the _opening flag so we don't have to keep checking if we're opening
            // or closing.  If opening, we also set the display style of the pane's content
            // so it will be visible for the animation
            if (i == this._selectedIndex) {
                animation._opening = true;
                open = animation;
            } else if (i == lastIndex) {
                animation._opening = false;
                close = animation;
            } else {
                continue;
            }

            // Get the pane ready to be animated by setting 
            this._startPaneChange(pane, animation._opening);


            // Setup the fade effect if we are using it
            if (this._fadeTransitions) {
                animation._fade.set_effect(animation._opening ? Sys.Extended.UI.Animation.FadeEffect.FadeIn : Sys.Extended.UI.Animation.FadeEffect.FadeOut);
            }

            // Set the length animation to either open or close depending on whether or
            // not this is the selected pane.  We also change the target to be the wrapper
            // or the original pane depending on whether the AutoSize mode is set to Fill
            // (because we need the background color, etc., to grow with the animation
            // which means changing the size of the original, not the wrapper, should grow).
            // We would prefer to animate the wrapper because it can collapse all the way to
            // 0px while the original can only collapse it's content size to 0px (leaving any
            // padding, margins, borders, etc.) which is why we need to factor in the size of
            // the original div's gutter pixels.  Animating the original content will also
            // cause the animation to jump slightly at the end when it collapses smoothly down
            // to the gutter pixels but then sets display: none and disappears.
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

        // Play the animations to open the selected pane/close any other panes.  Note that we
        // pulled playing the animations out of the loop so that we could always play the
        // closing animation first.  If you play the opening animation first, in some cases the
        // accordion will always grow slightly larger (shifting the rest of the page down) and
        // then shrink again because the animations are running on different timers (and
        // unifying them into a single animation would be a lot messier than the current
        // implementation since they won't both play when we're closing the currently open pane).
        if (close) {
            close.play();
        }
        if (open) {
            open.play();
        }

        // TODO: Someday get both animations to run on the same timer because it makes an obvious
        // difference in IE6 and Safari
    },

    _startPaneChange: function(pane, opening) {
        // Setup the pane before it is animated.

        var wrapper = pane.content;
        var original = wrapper._original;

        if (opening) {
            // Make the hidden panes visible so we can see them animate
            wrapper.style.display = 'block';

            // Workaround for IE8 to preserve the margins of the accordion headers
            if (this._autoSize === Sys.Extended.UI.AutoSize.Fill && this._isIE8InStandardMode) {
                original.style.display = 'block';
            }
        } else {
            // Hide any overflow because we'll be shrinking the wrapper div down to 0px and
            // we don't want content leaking out the bottom
            wrapper.style.overflow = 'hidden';

            // Turn off overflow on the original div because it's content doesn't grow during
            // the animation and leaving it on slows the animation down
            original.style.overflow = 'hidden';

            // Remove any explicit height off the original content section but manually set
            // the wrapper to the initial height (since it will be shrunk from this height
            // to zero)
            if (this._autoSize === Sys.Extended.UI.AutoSize.Limit) {
                wrapper.style.height = this._getTotalSize(original).height + 'px';
                original.style.maxHeight = '';
            }
        }
    },

    _endPaneChange: function(pane, opening) {
        // Clean the pane up after it's been animated.

        var wrapper = pane.content;
        var original = wrapper._original;

        if (opening) {
            // Depending on the mode, move the explicit height value from the original
            // content div to the wrapper div.  This is necessary because we moved the
            // explicit height value to the wrapper before the animation started since
            // it was the target.
            if (this._autoSize === Sys.Extended.UI.AutoSize.Limit) {
                var remaining = this._getRemainingHeight(true);
                original.style.maxHeight = remaining + 'px';
            }

            // Turn overflow back on so the original div's content can grow accordingly
            original.style.overflow = 'auto';

            // Remove an explicit height from the wrapper div so that it will
            // automatically grow and shrink with the original content div
            wrapper.style.height = 'auto';
            wrapper.style.overflow = 'auto';
        } else {
            // If we finished a close animation, completely hide the pane so that
            // it's content cannot be tabbed into

            if (!this._isIE8InStandardMode) {
                wrapper.style.display = 'none';
            } else {
                // Workaround for IE8 to preserve the margins of the accordion headers
                if (this._autoSize === Sys.Extended.UI.AutoSize.Fill) {
                    original.style.display = 'none';
                } else {
                    wrapper.style.height = '0px';
                }
            }
        }
    },

    _getHeadersSize: function() {
        // Compute the amount of space used by all the headers
        var total = { width: 0, height: 0 };
        for (var i = 0; i < this._panes.length; i++) {
            var size = this._getTotalSize(this._panes[i].header);
            total.width = Math.max(total.width, size.width);
            total.height += size.height;
        }
        return total;
    },

    _getRemainingHeight: function(includeGutter) {
        // Determine how much remaining height we have to fill with the currently selected
        // pane's content section after taking into account all the headers.  This is primarily
        // used for the Limit and Fill AutoSize modes.
        // Returns remaining height after all the headers have been accounted for.
        //
        // "includeGutter" - whether or not we should include the gutter (padding, borders, margins) of the
        // selected pane's original content section.  This should be true whenever we're
        // getting the remaining height for the original content section and false whenever
        // we're getting the remaining height for its wrapper.

        var height = 0;
        var pane = this.get_Pane();

        if (this._autoSize === Sys.Extended.UI.AutoSize.None) {
            // If the AutoSize mode is "None", then we use the size of the pane
            if (pane) {
                height = this._getTotalSize(pane.content._original).height;
            }
        } else {
            // Compute the amount of space used
            height = this._headersSize;
            if (includeGutter && pane) {
                height += this._getGutterSize(pane.content._original).height;
            }

            // Determine how much of the remaining space to use
            // (if AutoSize is "Fill", use the rest of the available space)
            var accordion = this.get_element();
            height = Math.max(accordion.offsetHeight - height, 0);

            // If AutoSize is "Limit", then the size of the pane should be either its
            // actual size, or the rest of the available space.
            if (pane && (this._autoSize === Sys.Extended.UI.AutoSize.Limit)) {
                var required = this._getTotalSize(pane.content._original).height;
                // Ensure we return a number greater than or equal to zero
                if (required > 0) {
                    height = Math.min(height, required);
                }
            }
        }

        return height;
    },

    _getTotalSize: function(element) {
        // Get the total size of an element, including its margins, in the form {width, height}

        var size = $common.getSize(element);
        var box = $common.getMarginBox(element);
        size.width += box.horizontal;
        size.height += box.vertical;
        return size;
    },

    _getGutterSize: function(element) {
        // Get the extra "gutter" size around an element made up of its padding,
        // borders, and margins.
        // Returns size of the extra space (in the form of {height, width})

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
        this.get_events().addHandler('selectedIndexChanging', handler);
    },
    remove_selectedIndexChanging: function(handler) {
        this.get_events().removeHandler('selectedIndexChanging', handler);
    },
    raiseSelectedIndexChanging: function(eventArgs) {

        var handler = this.get_events().getHandler('selectedIndexChanging');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_selectedIndexChanged: function(handler) {        
        this.get_events().addHandler('selectedIndexChanged', handler);
    },
    remove_selectedIndexChanged: function(handler) {        
        this.get_events().removeHandler('selectedIndexChanged', handler);
    },
    raiseSelectedIndexChanged: function(eventArgs) {
        var handler = this.get_events().getHandler('selectedIndexChanged');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    get_Pane: function(index) {
        // Get a specific Accordion pane given its index.  If no index is provided, get
        // the currently selected pane.
        // The desired pane object, or null if outside the the bounds of the _panes array.
        // The pane is an object of the form {header, content, animation} corresponding to
        // that pane's header section, content section, and the animation used to open and
        // close its content section.  The content element is a new div that has been
        // created to wrap the original div (so we can completely collapse it - even if it
        // has padding, margins, etc.) which is pointed to by a dynamic _original property.
        // The header element has a dynamic _index property indicating its position in the
        // Accordion's pane collection (used primarily by the headers' shared click handler).
        // Furthermore, the animation will either be an instance of LengthAnimation or
        // ParallelAnimation (in the latter case, it will have two children which are a
        // LengthAnimation and a FadeAnimation).  There will be two dynamic properties
        // _length and _fade pointing to each of these children (to easily set the length
        // and fadeEffect properties).  There is also a dynamic _ended property which is an
        // event handler to be fired when the animation is complete, a dynamic _opening
        // property to indicate whether the animation was opening or closing the pane, and
        // a dynamic _pane property to provide a reference to the pane that was being
        // animated.
        //
        // "index"- index of the desired Accordion pane.  If the index is not provided, we use
        // the currently selected index.  In the event the provided index (or the currently
        // selected index) is outside the bounds of the panes collection, we return null.

        if (index === undefined || index === null) {
            index = this._selectedIndex;
        }
        return (this._panes && index >= 0 && index < this._panes.length) ? this._panes[index] : null;
    },

    get_Count: function() {
        return this._panes ? this._panes.length : 0;
    },

    get_TransitionDuration: function() {
        // Length of time to transition between Accordion sections in
        // milleseconds.  The default value is 250ms.
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
        // Number of steps per second in the transition animations.
        // The default value is 30 frames per second.
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
        // Whether or not to fade the accordion panes when transitioning
        return this._fadeTransitions;
    },
    set_FadeTransitions: function(value) {
        if (this._fadeTransitions != value) {
            this._fadeTransitions = value;

            // Whenever we toggle FadeTransitions we dispose the entire list of
            // animations because it's not easy to selectively play just one of a
            // ParallelAnimation's children...  This is of course just a temporary
            // workaround until we enable generic animations and remove the
            // FadeTransitions property.
            this._disposeAnimations();

            // Set all the content sections to 100% opacity in case they had been
            // faded out when a pane was changed but not faded back in yet
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
        return this._headerCssClass;
    },

    set_HeaderCssClass: function(value) {
        this._headerCssClass = value;
        this.raisePropertyChanged('HeaderCssClass');
    },

    get_HeaderSelectedCssClass: function() {
        return this._headerSelectedCssClass;
    },

    set_HeaderSelectedCssClass: function(value) {
        this._headerSelectedCssClass = value;
        this.raisePropertyChanged('HeaderSelectedCssClass');
    },

    get_AutoSize: function() {
        return this._autoSize;
    },
    set_AutoSize: function(value) {
        // In IE, treat AutoSize.Limit exactly the same as AutoSize.Fill.  Since IE does not
        // support the max-height CSS property, we can't achieve the Limit auto-size behavior
        // without fixing the exact size of the pane (which means it can't grow/shrink in response
        // to dynamic content changes).  Since Fill has most of the same UI characteristics, it's
        // a safer and cleaner workaround for this one browser.
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
        return this._selectedIndex;
    },
    set_SelectedIndex: function(value) {
        this._changeSelectedIndex(value, true);
    },

    get_requireOpenedPane: function() {
        // Whether or not clicking the header will close the currently opened pane
        // (which leaves all the Accordion's panes closed)
        return this._requireOpenedPane;
    },
    set_requireOpenedPane: function(value) {
        if (this._requireOpenedPane != value) {
            this._requireOpenedPane = value;
            this.raisePropertyChanged('requireOpenedPane');
        }
    },

    get_suppressHeaderPostbacks: function() {
        // Whether or not we suppress the client-side click handlers of any elements
        // (including server controls like Button or HTML elements like anchor) in the
        // header sections of the Accordion.
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