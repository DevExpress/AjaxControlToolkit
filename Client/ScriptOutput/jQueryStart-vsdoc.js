
/*
 * This file has been commented to support Visual Studio Intellisense.
 * You should not use this file at runtime inside the browser--it is only
 * intended to be used only for design-time IntelliSense.  Please use the
 * standard jQuery library for all production use.
 *
 * Comment version: 1.3.2b
 */

/*
 * jQuery JavaScript Library v1.3.2
 * http://jquery.com/
 *
 * Copyright (c) 2009 John Resig
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Date: 2009-02-19 17:34:21 -0500 (Thu, 19 Feb 2009)
 * Revision: 6246
 */

(function(){

var 
	window = this,
	undefined,
	_jQuery = window.jQuery,
	_$ = window.$,

	jQuery = window.jQuery = window.$ = function(selector, context) {
        ///	<summary>
        ///		1: $(expression, context) - This function accepts a string containing a CSS selector which is then used to match a set of elements.
        ///		2: $(html) - Create DOM elements on-the-fly from the provided String of raw HTML.
        ///		3: $(elements) - Wrap jQuery functionality around a single or multiple DOM Element(s).
        ///		4: $(callback) - A shorthand for $(document).ready().
        ///	</summary>
        ///	<param name="selector" type="String">
        ///		1: expression - An expression to search with.
        ///		2: html - A string of HTML to create on the fly.
        ///		3: elements - DOM element(s) to be encapsulated by a jQuery object.
        ///		4: callback - The function to execute when the DOM is ready.
        ///	</param>
        ///	<param name="context" type="jQuery">
        ///		1: context - A DOM Element, Document or jQuery to use as context.
        ///	</param>
        /// <field name="selector" Type="Object">
        ///     The DOM node context originally passed to jQuery() (if none was passed then context will be equal to the document).
        /// </field>
        /// <field name="context" Type="String">
        ///     A selector representing selector originally passed to jQuery().
        /// </field>
        ///	<returns type="jQuery" />
	
		return new jQuery.fn.init( selector, context );
	},

	quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
	isSimple = /^.[^:#\[\.,]*$/;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		///	<summary>
		///		1: $(expression, context) - This function accepts a string containing a CSS selector which is then used to match a set of elements.
		///		2: $(html) - Create DOM elements on-the-fly from the provided String of raw HTML.
		///		3: $(elements) - Wrap jQuery functionality around a single or multiple DOM Element(s).
		///		4: $(callback) - A shorthand for $(document).ready().
		///	</summary>
		///	<param name="selector" type="String">
		///		1: expression - An expression to search with.
		///		2: html - A string of HTML to create on the fly.
		///		3: elements - DOM element(s) to be encapsulated by a jQuery object.
		///		4: callback - The function to execute when the DOM is ready.
		///	</param>
		///	<param name="context" type="jQuery">
		///		1: context - A DOM Element, Document or jQuery to use as context.
		///	</param>
		///	<returns type="jQuery" />

		selector = selector || document;

		if ( selector.nodeType ) {
			this[0] = selector;
			this.length = 1;
			this.context = selector;
			return this;
		}
		if (typeof selector === "string") {
		    var match = quickExpr.exec(selector);

		    if (match && (match[1] || !context)) {

		        if (match[1])
		            selector = jQuery.clean([match[1]], context);

		        else {
		            var elem = document.getElementById(match[3]);

		            if (elem && elem.id != match[3])
		                return jQuery().find(selector);

		            var ret = jQuery(elem || []);
		            ret.context = document;
		            ret.selector = selector;
		            return ret;
		        }

		    } else
		        return jQuery(context).find(selector);

		} else if ( jQuery.isFunction( selector ) )
			return jQuery( document ).ready( selector );

		if ( selector.selector && selector.context ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return this.setArray(jQuery.isArray( selector ) ?
			selector :
			jQuery.makeArray(selector));
	},

	selector: "",

	jquery: "1.3.2",

	size: function() {
		///	<summary>
		///		The number of elements currently matched.
		///		Part of Core
		///	</summary>
		///	<returns type="Number" />

		return this.length;
	},

	get: function( num ) {
		///	<summary>
		///		Access a single matched element. num is used to access the
		///		Nth element matched.
		///		Part of Core
		///	</summary>
		///	<returns type="Element" />
		///	<param name="num" type="Number">
		///		Access the element in the Nth position.
		///	</param>

		return num == undefined ?

			Array.prototype.slice.call( this ) :

			this[ num ];
	},

	pushStack: function( elems, name, selector ) {
		///	<summary>
		///		Set the jQuery object to an array of elements, while maintaining
		///		the stack.
		///		Part of Core
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="elems" type="Elements">
		///		An array of elements
		///	</param>
		
		var ret = jQuery( elems );

		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" )
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		else if ( name )
			ret.selector = this.selector + "." + name + "(" + selector + ")";

		return ret;
	},

	setArray: function( elems ) {
		///	<summary>
		///		Set the jQuery object to an array of elements. This operation is
		///		completely destructive - be sure to use .pushStack() if you wish to maintain
		///		the jQuery stack.
		///		Part of Core
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="elems" type="Elements">
		///		An array of elements
		///	</param>
		
		this.length = 0;
		Array.prototype.push.apply( this, elems );

		return this;
	},

	each: function( callback, args ) {
		///	<summary>
		///		Execute a function within the context of every matched element.
		///		This means that every time the passed-in function is executed
		///		(which is once for every element matched) the 'this' keyword
		///		points to the specific element.
		///		Additionally, the function, when executed, is passed a single
		///		argument representing the position of the element in the matched
		///		set.
		///		Part of Core
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="callback" type="Function">
		///		A function to execute
		///	</param>

		return jQuery.each( this, callback, args );
	},

	index: function( elem ) {
		///	<summary>
		///		Searches every matched element for the object and returns
		///		the index of the element, if found, starting with zero. 
		///		Returns -1 if the object wasn't found.
		///		Part of Core
		///	</summary>
		///	<returns type="Number" />
		///	<param name="elem" type="Element">
		///		Object to search for
		///	</param>

		return jQuery.inArray(
			elem && elem.jquery ? elem[0] : elem
		, this );
	},

	attr: function( name, value, type ) {
		///	<summary>
		///		Set a single property to a computed value, on all matched elements.
		///		Instead of a value, a function is provided, that computes the value.
		///		Part of DOM/Attributes
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="name" type="String">
		///		The name of the property to set.
		///	</param>
		///	<param name="value" type="Function">
		///		A function returning the value to set.
		///	</param>

		var options = name;

		if ( typeof name === "string" )
			if ( value === undefined )
				return this[0] && jQuery[ type || "attr" ]( this[0], name );

			else {
				options = {};
				options[ name ] = value;
			}

		return this.each(function(i){
			for ( name in options )
				jQuery.attr(
					type ?
						this.style :
						this,
					name, jQuery.prop( this, options[ name ], type, i, name )
				);
		});
	},

	css: function( key, value ) {
		///	<summary>
		///		Set a single style property to a value, on all matched elements.
		///		If a number is provided, it is automatically converted into a pixel value.
		///		Part of CSS
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="key" type="String">
		///		The name of the property to set.
		///	</param>
		///	<param name="value" type="String">
		///		The value to set the property to.
		///	</param>

		if ( (key == 'width' || key == 'height') && parseFloat(value) < 0 )
			value = undefined;
		return this.attr( key, value, "curCSS" );
	},

	text: function( text ) {
		///	<summary>
		///		Set the text contents of all matched elements.
		///		Similar to html(), but escapes HTML (replace &quot;&lt;&quot; and &quot;&gt;&quot; with their
		///		HTML entities).
		///		Part of DOM/Attributes
		///	</summary>
		///	<returns type="String" />
		///	<param name="text" type="String">
		///		The text value to set the contents of the element to.
		///	</param>

		if ( typeof text !== "object" && text != null )
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );

		var ret = "";

		jQuery.each( text || this, function(){
			jQuery.each( this.childNodes, function(){
				if ( this.nodeType != 8 )
					ret += this.nodeType != 1 ?
						this.nodeValue :
						jQuery.fn.text( [ this ] );
			});
		});

		return ret;
	},

	wrapAll: function( html ) {
		///	<summary>
		///		Wrap all matched elements with a structure of other elements.
		///		This wrapping process is most useful for injecting additional
		///		stucture into a document, without ruining the original semantic
		///		qualities of a document.
		///		This works by going through the first element
		///		provided and finding the deepest ancestor element within its
		///		structure - it is that element that will en-wrap everything else.
		///		This does not work with elements that contain text. Any necessary text
		///		must be added after the wrapping is done.
		///		Part of DOM/Manipulation
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="html" type="Element">
		///		A DOM element that will be wrapped around the target.
		///	</param>

		if ( this[0] ) {
			var wrap = jQuery( html, this[0].ownerDocument ).clone();

			if ( this[0].parentNode )
				wrap.insertBefore( this[0] );

			wrap.map(function(){
				var elem = this;

				while ( elem.firstChild )
					elem = elem.firstChild;

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		///	<summary>
		///		Wraps the inner child contents of each matched elemenht (including text nodes) with an HTML structure.
		///	</summary>
		///	<param name="html" type="String">
		///		A string of HTML or a DOM element that will be wrapped around the target contents.
		///	</param>
		///	<returns type="jQuery" />

		return this.each(function(){
			jQuery( this ).contents().wrapAll( html );
		});
	},

	wrap: function( html ) {
		///	<summary>
		///		Wrap all matched elements with a structure of other elements.
		///		This wrapping process is most useful for injecting additional
		///		stucture into a document, without ruining the original semantic
		///		qualities of a document.
		///		This works by going through the first element
		///		provided and finding the deepest ancestor element within its
		///		structure - it is that element that will en-wrap everything else.
		///		This does not work with elements that contain text. Any necessary text
		///		must be added after the wrapping is done.
		///		Part of DOM/Manipulation
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="html" type="Element">
		///		A DOM element that will be wrapped around the target.
		///	</param>
		
		return this.each(function(){
			jQuery( this ).wrapAll( html );
		});
	},

	append: function() {
		///	<summary>
		///		Append content to the inside of every matched element.
		///		This operation is similar to doing an appendChild to all the
		///		specified elements, adding them into the document.
		///		Part of DOM/Manipulation
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="content" type="Content">
		///		Content to append to the target
		///	</param>

		return this.domManip(arguments, true, function(elem){
			if (this.nodeType == 1)
				this.appendChild( elem );
		});
	},

	prepend: function() {
		///	<summary>
		///		Prepend content to the inside of every matched element.
		///		This operation is the best way to insert elements
		///		inside, at the beginning, of all matched elements.
		///		Part of DOM/Manipulation
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="" type="Content">
		///		Content to prepend to the target.
		///	</param>

		return this.domManip(arguments, true, function(elem){
			if (this.nodeType == 1)
				this.insertBefore( elem, this.firstChild );
		});
	},

	before: function() {
		///	<summary>
		///		Insert content before each of the matched elements.
		///		Part of DOM/Manipulation
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="" type="Content">
		///		Content to insert before each target.
		///	</param>

		return this.domManip(arguments, false, function(elem){
			this.parentNode.insertBefore( elem, this );
		});
	},

	after: function() {
		///	<summary>
		///		Insert content after each of the matched elements.
		///		Part of DOM/Manipulation
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="" type="Content">
		///		Content to insert after each target.
		///	</param>

		return this.domManip(arguments, false, function(elem){
			this.parentNode.insertBefore( elem, this.nextSibling );
		});
	},

	end: function() {
		///	<summary>
		///		End the most recent 'destructive' operation, reverting the list of matched elements
		///		back to its previous state. After an end operation, the list of matched elements will
		///		revert to the last state of matched elements.
		///		If there was no destructive operation before, an empty set is returned.
		///		Part of DOM/Traversing
		///	</summary>
		///	<returns type="jQuery" />

		return this.prevObject || jQuery( [] );
	},

	push: [].push,
	sort: [].sort,
	splice: [].splice,

	find: function( selector ) {
		///	<summary>
		///		Searches for all elements that match the specified expression.
		///		This method is a good way to find additional descendant
		///		elements with which to process.
		///		All searching is done using a jQuery expression. The expression can be
		///		written using CSS 1-3 Selector syntax, or basic XPath.
		///		Part of DOM/Traversing
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="selector" type="String">
		///		An expression to search with.
		///	</param>
		///	<returns type="jQuery" />

		if ( this.length === 1 ) {
			var ret = this.pushStack( [], "find", selector );
			ret.length = 0;
			jQuery.find( selector, this[0], ret );
			return ret;
		} else {
			return this.pushStack( jQuery.unique(jQuery.map(this, function(elem){
				return jQuery.find( selector, elem );
			})), "find", selector );
		}
	},

	clone: function( events ) {
		///	<summary>
		///		Clone matched DOM Elements and select the clones. 
		///		This is useful for moving copies of the elements to another
		///		location in the DOM.
		///		Part of DOM/Manipulation
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="deep" type="Boolean" optional="true">
		///		(Optional) Set to false if you don't want to clone all descendant nodes, in addition to the element itself.
		///	</param>

		var ret = this.map(function(){
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				var html = this.outerHTML;
				if ( !html ) {
					var div = this.ownerDocument.createElement("div");
					div.appendChild( this.cloneNode(true) );
					html = div.innerHTML;
				}

				return jQuery.clean([html.replace(/ jQuery\d+="(?:\d+|null)"/g, "").replace(/^\s*/, "")])[0];
			} else
				return this.cloneNode(true);
		});

		if ( events === true ) {
			var orig = this.find("*").andSelf(), i = 0;

			ret.find("*").andSelf().each(function(){
				if ( this.nodeName !== orig[i].nodeName )
					return;

				var events = jQuery.data( orig[i], "events" );

				for ( var type in events ) {
					for ( var handler in events[ type ] ) {
						jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
					}
				}

				i++;
			});
		}

		return ret;
	},

	filter: function( selector ) {
		///	<summary>
		///		Removes all elements from the set of matched elements that do not
		///		pass the specified filter. This method is used to narrow down
		///		the results of a search.
		///		})
		///		Part of DOM/Traversing
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="selector" type="Function">
		///		A function to use for filtering
		///	</param>
		///	<returns type="jQuery" />
	
		return this.pushStack(
			jQuery.isFunction( selector ) &&
			jQuery.grep(this, function(elem, i){
				return selector.call( elem, i );
			}) ||

			jQuery.multiFilter( selector, jQuery.grep(this, function(elem){
				return elem.nodeType === 1;
			}) ), "filter", selector );
	},

	closest: function( selector ) {
		///	<summary>
		///		Get a set of elements containing the closest parent element that matches the specified selector, the starting element included.
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="selector" type="Function">
		///		An expression to filter the elements with.
		///	</param>
		///	<returns type="jQuery" />

		var pos = jQuery.expr.match.POS.test( selector ) ? jQuery(selector) : null,
			closer = 0;

		return this.map(function(){
			var cur = this;
			while ( cur && cur.ownerDocument ) {
				if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selector) ) {
					jQuery.data(cur, "closest", closer);
					return cur;
				}
				cur = cur.parentNode;
				closer++;
			}
		});
	},

	not: function( selector ) {
		///	<summary>
		///		Removes any elements inside the array of elements from the set
		///		of matched elements. This method is used to remove one or more
		///		elements from a jQuery object.
		///		Part of DOM/Traversing
		///	</summary>
		///	<param name="selector" type="jQuery">
		///		A set of elements to remove from the jQuery set of matched elements.
		///	</param>
		///	<returns type="jQuery" />

		if ( typeof selector === "string" )
			if ( isSimple.test( selector ) )
				return this.pushStack( jQuery.multiFilter( selector, this, true ), "not", selector );
			else
				selector = jQuery.multiFilter( selector, this );

		var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
		return this.filter(function() {
			return isArrayLike ? jQuery.inArray( this, selector ) < 0 : this != selector;
		});
	},

	add: function( selector ) {
		///	<summary>
		///		Adds one or more Elements to the set of matched elements.
		///		Part of DOM/Traversing
		///	</summary>
		///	<param name="elements" type="Element">
		///		One or more Elements to add
		///	</param>
		///	<returns type="jQuery" />
	
		return this.pushStack( jQuery.unique( jQuery.merge(
			this.get(),
			typeof selector === "string" ?
				jQuery( selector ) :
				jQuery.makeArray( selector )
		)));
	},

	is: function( selector ) {
		///	<summary>
		///		Checks the current selection against an expression and returns true,
		///		if at least one element of the selection fits the given expression.
		///		Does return false, if no element fits or the expression is not valid.
		///		filter(String) is used internally, therefore all rules that apply there
		///		apply here, too.
		///		Part of DOM/Traversing
		///	</summary>
		///	<returns type="Boolean" />
		///	<param name="expr" type="String">
		///		 The expression with which to filter
		///	</param>

		return !!selector && jQuery.multiFilter( selector, this ).length > 0;
	},

	hasClass: function( selector ) {
		///	<summary>
		///		Checks the current selection against a class and returns whether at least one selection has a given class.
		///	</summary>
		///	<param name="selector" type="String">The class to check against</param>
		///	<returns type="Boolean">True if at least one element in the selection has the class, otherwise false.</returns>

		return !!selector && this.is( "." + selector );
	},

	val: function( value ) {
		///	<summary>
		///		Set the value of every matched element.
		///		Part of DOM/Attributes
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="val" type="String">
		///		 Set the property to the specified value.
		///	</param>

		if ( value === undefined ) {			
			var elem = this[0];

			if ( elem ) {
				if( jQuery.nodeName( elem, 'option' ) )
					return (elem.attributes.value || {}).specified ? elem.value : elem.text;
				
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type == "select-one";

					if ( index < 0 )
						return null;

					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							value = jQuery(option).val();

							if ( one )
								return value;

							values.push( value );
						}
					}

					return values;				
				}

				return (elem.value || "").replace(/\r/g, "");

			}

			return undefined;
		}

		if ( typeof value === "number" )
			value += '';

		return this.each(function(){
			if ( this.nodeType != 1 )
				return;

			if ( jQuery.isArray(value) && /radio|checkbox/.test( this.type ) )
				this.checked = (jQuery.inArray(this.value, value) >= 0 ||
					jQuery.inArray(this.name, value) >= 0);

			else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(value);

				jQuery( "option", this ).each(function(){
					this.selected = (jQuery.inArray( this.value, values ) >= 0 ||
						jQuery.inArray( this.text, values ) >= 0);
				});

				if ( !values.length )
					this.selectedIndex = -1;

			} else
				this.value = value;
		});
	},

	html: function( value ) {
		///	<summary>
		///		Set the html contents of every matched element.
		///		This property is not available on XML documents.
		///		Part of DOM/Attributes
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="val" type="String">
		///		 Set the html contents to the specified value.
		///	</param>

		return value === undefined ?
			(this[0] ?
				this[0].innerHTML.replace(/ jQuery\d+="(?:\d+|null)"/g, "") :
				null) :
			this.empty().append( value );
	},

	replaceWith: function( value ) {
		///	<summary>
		///		Replaces all matched element with the specified HTML or DOM elements.
		///	</summary>
		///	<param name="value" type="String">
		///		The content with which to replace the matched elements.
		///	</param>
		///	<returns type="jQuery">The element that was just replaced.</returns>

		return this.after( value ).remove();
	},

	eq: function( i ) {
		///	<summary>
		///		Reduce the set of matched elements to a single element.
		///		The position of the element in the set of matched elements
		///		starts at 0 and goes to length - 1.
		///		Part of Core
		///	</summary>
		///	<returns type="jQuery" />
		///	<param name="num" type="Number">
		///		pos The index of the element that you wish to limit to.
		///	</param>

		return this.slice( i, +i + 1 );
	},

	slice: function() {
		///	<summary>
		///		Selects a subset of the matched elements.  Behaves exactly like the built-in Array slice method.
		///	</summary>
		///	<param name="start" type="Number" integer="true">Where to start the subset (0-based).</param>
		///	<param name="end" optional="true" type="Number" integer="true">Where to end the subset (not including the end element itself).
		///		If omitted, ends at the end of the selection</param>
		///	<returns type="jQuery">The sliced elements</returns>

		return this.pushStack( Array.prototype.slice.apply( this, arguments ),
			"slice", Array.prototype.slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		///	<summary>
		///		This member is internal.
		///	</summary>
		///	<private />
		///	<returns type="jQuery" />
		
		return this.pushStack( jQuery.map(this, function(elem, i){
			return callback.call( elem, i, elem );
		}));
	},

	andSelf: function() {
		///	<summary>
		///		Adds the previous selection to the current selection.
		///	</summary>
		///	<returns type="jQuery" />
		
		return this.add( this.prevObject );
	},

	domManip: function( args, table, callback ) {
		///	<param name="args" type="Array">
		///		 Args
		///	</param>
		///	<param name="table" type="Boolean">
		///		 Insert TBODY in TABLEs if one is not found.
		///	</param>
		///	<param name="dir" type="Number">
		///		 If dir&lt;0, process args in reverse order.
		///	</param>
		///	<param name="fn" type="Function">
		///		 The function doing the DOM manipulation.
		///	</param>
		///	<returns type="jQuery" />
		///	<summary>
		///		Part of Core
		///	</summary>
		
		if ( this[0] ) {
			var fragment = (this[0].ownerDocument || this[0]).createDocumentFragment(),
				scripts = jQuery.clean( args, (this[0].ownerDocument || this[0]), fragment ),
				first = fragment.firstChild;

			if ( first )
				for ( var i = 0, l = this.length; i < l; i++ )
					callback.call( root(this[i], first), this.length > 1 || i > 0 ?
							fragment.cloneNode(true) : fragment );
		
			if ( scripts )
				jQuery.each( scripts, evalScript );
		}

		return this;
		
		function root( elem, cur ) {
			return table && jQuery.nodeName(elem, "table") && jQuery.nodeName(cur, "tr") ?
				(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
				elem;
		}
	}
};

jQuery.fn.init.prototype = jQuery.fn;

function evalScript( i, elem ) {
	///	<summary>
	///		This method is internal.
	///	</summary>
	/// <private />
	
	if ( elem.src )
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});

	else
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );

	if ( elem.parentNode )
		elem.parentNode.removeChild( elem );
}

function now(){
	///	<summary>
	///		Gets the current date.
	///	</summary>
	///	<returns type="Date">The current date.</returns>
	return +new Date;
}

jQuery.extend = jQuery.fn.extend = function() {
	///	<summary>
	///		Extend one object with one or more others, returning the original,
	///		modified, object. This is a great utility for simple inheritance.
	///		jQuery.extend(settings, options);
	///		var settings = jQuery.extend({}, defaults, options);
	///		Part of JavaScript
	///	</summary>
	///	<param name="target" type="Object">
	///		 The object to extend
	///	</param>
	///	<param name="prop1" type="Object">
	///		 The object that will be merged into the first.
	///	</param>
	///	<param name="propN" type="Object" optional="true" parameterArray="true">
	///		 (optional) More objects to merge into the first
	///	</param>
	///	<returns type="Object" />

	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}

	if ( typeof target !== "object" && !jQuery.isFunction(target) )
		target = {};

	if ( length == i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ )
		if ( (options = arguments[ i ]) != null )
			for ( var name in options ) {
				var src = target[ name ], copy = options[ name ];

				if ( target === copy )
					continue;

				if ( deep && copy && typeof copy === "object" && !copy.nodeType )
					target[ name ] = jQuery.extend( deep, 
						src || ( copy.length != null ? [ ] : { } )
					, copy );

				else if ( copy !== undefined )
					target[ name ] = copy;

			}

	return target;
};

var	exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	defaultView = document.defaultView || {},
	toString = Object.prototype.toString;

jQuery.extend({
	noConflict: function( deep ) {
		///	<summary>
		///		Run this function to give control of the $ variable back
		///		to whichever library first implemented it. This helps to make 
		///		sure that jQuery doesn't conflict with the $ object
		///		of other libraries.
		///		By using this function, you will only be able to access jQuery
		///		using the 'jQuery' variable. For example, where you used to do
		///		$(&quot;div p&quot;), you now must do jQuery(&quot;div p&quot;).
		///		Part of Core 
		///	</summary>
		///	<returns type="undefined" />
		
		window.$ = _$;

		if ( deep )
			window.jQuery = _jQuery;

		return jQuery;
	},

	isFunction: function( obj ) {
		///	<summary>
		///		Determines if the parameter passed is a function.
		///	</summary>
		///	<param name="obj" type="Object">The object to check</param>
		///	<returns type="Boolean">True if the parameter is a function; otherwise false.</returns>
		
		return toString.call(obj) === "[object Function]";
	},

	isArray: function(obj) {
	    ///	<summary>
	    ///		Determine if the parameter passed is an array.
	    ///	</summary>
	    ///	<param name="obj" type="Object">Object to test whether or not it is an array.</param>
	    ///	<returns type="Boolean">True if the parameter is a function; otherwise false.</returns>
    		
		return toString.call(obj) === "[object Array]";
	},

	isXMLDoc: function( elem ) {
		///	<summary>
		///		Determines if the parameter passed is an XML document.
		///	</summary>
		///	<param name="elem" type="Object">The object to test</param>
		///	<returns type="Boolean">True if the parameter is an XML document; otherwise false.</returns>

	    return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
			!!elem.ownerDocument && jQuery.isXMLDoc(elem.ownerDocument);
    },

	globalEval: function( data ) {
		///	<summary>
		///		Internally evaluates a script in a global context.
		///	</summary>
		///	<private />

		if ( data && /\S/.test(data) ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";
			if ( jQuery.support.scriptEval )
				script.appendChild( document.createTextNode( data ) );
			else
				script.text = data;

			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		///	<summary>
		///		Checks whether the specified element has the specified DOM node name.
		///	</summary>
		///	<param name="elem" type="Element">The element to examine</param>
		///	<param name="name" type="String">The node name to check</param>
		///	<returns type="Boolean">True if the specified node name matches the node's DOM node name; otherwise false</returns>

		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
	},

	each: function( object, callback, args ) {
		///	<summary>
		///		A generic iterator function, which can be used to seemlessly
		///		iterate over both objects and arrays. This function is not the same
		///		as $().each() - which is used to iterate, exclusively, over a jQuery
		///		object. This function can be used to iterate over anything.
		///		The callback has two arguments:the key (objects) or index (arrays) as first
		///		the first, and the value as the second.
		///		Part of JavaScript
		///	</summary>
		///	<param name="obj" type="Object">
		///		 The object, or array, to iterate over.
		///	</param>
		///	<param name="fn" type="Function">
		///		 The function that will be executed on every object.
		///	</param>
		///	<returns type="Object" />
		
		var name, i = 0, length = object.length;

		if ( args ) {
			if ( length === undefined ) {
				for ( name in object )
					if ( callback.apply( object[ name ], args ) === false )
						break;
			} else
				for ( ; i < length; )
					if ( callback.apply( object[ i++ ], args ) === false )
						break;

		} else {
			if ( length === undefined ) {
				for ( name in object )
					if ( callback.call( object[ name ], name, object[ name ] ) === false )
						break;
			} else
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
		}

		return object;
	},

	prop: function( elem, value, type, i, name ) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />

		if ( jQuery.isFunction( value ) )
			value = value.call( elem, i );

		return typeof value === "number" && type == "curCSS" && !exclude.test( name ) ?
			value + "px" :
			value;
	},

	className: {
		add: function( elem, classNames ) {
   			///	<summary>
   			///		Internal use only; use addClass('class')
			///	</summary>
   			///	<private />

			jQuery.each((classNames || "").split(/\s+/), function(i, className){
				if ( elem.nodeType == 1 && !jQuery.className.has( elem.className, className ) )
					elem.className += (elem.className ? " " : "") + className;
			});
		},

		remove: function( elem, classNames ) {
   			///	<summary>
   			///		Internal use only; use removeClass('class')
			///	</summary>
   			///	<private />

			if (elem.nodeType == 1)
				elem.className = classNames !== undefined ?
					jQuery.grep(elem.className.split(/\s+/), function(className){
						return !jQuery.className.has( classNames, className );
					}).join(" ") :
					"";
		},

		has: function( elem, className ) {
   			///	<summary>
   			///		Internal use only; use hasClass('class')
			///	</summary>
   			///	<private />

		    return elem && jQuery.inArray(className, (elem.className || elem).toString().split(/\s+/)) > -1;
		}
	},

	swap: function( elem, options, callback ) {
		///	<summary>
		///		Swap in/out style options.
		///	</summary>

		var old = {};
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		for ( var name in options )
			elem.style[ name ] = old[ name ];
	},

	css: function( elem, name, force, extra ) {
		///	<summary>
		///		This method is internal only.
		///	</summary>
		///	<private />

		if ( name == "width" || name == "height" ) {
			var val, props = { position: "absolute", visibility: "hidden", display:"block" }, which = name == "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ];

			function getWH() {
				val = name == "width" ? elem.offsetWidth : elem.offsetHeight;

				if ( extra === "border" )
					return;

				jQuery.each( which, function() {
					if ( !extra )
						val -= parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					if ( extra === "margin" )
						val += parseFloat(jQuery.curCSS( elem, "margin" + this, true)) || 0;
					else
						val -= parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
				});
			}

			if ( elem.offsetWidth !== 0 )
				getWH();
			else
				jQuery.swap( elem, props, getWH );

			return Math.max(0, Math.round(val));
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		///	<summary>
		///		This method is internal only.
		///	</summary>
		///	<private />

		var ret, style = elem.style;

		if ( name == "opacity" && !jQuery.support.opacity ) {
			ret = jQuery.attr( style, "opacity" );

			return ret == "" ?
				"1" :
				ret;
		}

		if ( name.match( /float/i ) )
			name = styleFloat;

		if ( !force && style && style[ name ] )
			ret = style[ name ];

		else if ( defaultView.getComputedStyle ) {

			if ( name.match( /float/i ) )
				name = "float";

			name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle )
				ret = computedStyle.getPropertyValue( name );

			if ( name == "opacity" && ret == "" )
				ret = "1";

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(/\-(\w)/g, function(all, letter){
				return letter.toUpperCase();
			});

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];


			if ( !/^\d+(px)?$/i.test( ret ) && /^\d/.test( ret ) ) {
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = ret || 0;
				ret = style.pixelLeft + "px";

				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	clean: function( elems, context, fragment ) {
		///	<summary>
		///		This method is internal only.
		///	</summary>
		///	<private />


		context = context || document;

		if ( typeof context.createElement === "undefined" )
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;

		if ( !fragment && elems.length === 1 && typeof elems[0] === "string" ) {
			var match = /^<(\w+)\s*\/?>$/.exec(elems[0]);
			if ( match )
				return [ context.createElement( match[1] ) ];
		}

		var ret = [], scripts = [], div = context.createElement("div");

		jQuery.each(elems, function(i, elem){
			if ( typeof elem === "number" )
				elem += '';

			if ( !elem )
				return;

			if ( typeof elem === "string" ) {
				elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
					return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
						all :
						front + "></" + tag + ">";
				});

				var tags = elem.replace(/^\s+/, "").substring(0, 10).toLowerCase();

				var wrap =
					!tags.indexOf("<opt") &&
					[ 1, "<select multiple='multiple'>", "</select>" ] ||

					!tags.indexOf("<leg") &&
					[ 1, "<fieldset>", "</fieldset>" ] ||

					tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
					[ 1, "<table>", "</table>" ] ||

					!tags.indexOf("<tr") &&
					[ 2, "<table><tbody>", "</tbody></table>" ] ||

					(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
					[ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||

					!tags.indexOf("<col") &&
					[ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||

					!jQuery.support.htmlSerialize &&
					[ 1, "div<div>", "</div>" ] ||

					[ 0, "", "" ];

				div.innerHTML = wrap[1] + elem + wrap[2];

				while ( wrap[0]-- )
					div = div.lastChild;

				if ( !jQuery.support.tbody ) {

					var hasBody = /<tbody/i.test(elem),
						tbody = !tags.indexOf("<table") && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

						wrap[1] == "<table>" && !hasBody ?
							div.childNodes :
							[];

					for ( var j = tbody.length - 1; j >= 0 ; --j )
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length )
							tbody[ j ].parentNode.removeChild( tbody[ j ] );

					}

				if ( !jQuery.support.leadingWhitespace && /^\s/.test( elem ) )
					div.insertBefore( context.createTextNode( elem.match(/^\s*/)[0] ), div.firstChild );
				
				elem = jQuery.makeArray( div.childNodes );
			}

			if ( elem.nodeType )
				ret.push( elem );
			else
				ret = jQuery.merge( ret, elem );

		});

		if ( fragment ) {
			for ( var i = 0; ret[i]; i++ ) {
				if ( jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				} else {
					if ( ret[i].nodeType === 1 )
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					fragment.appendChild( ret[i] );
				}
			}
			
			return scripts;
		}

		return ret;
	},

	attr: function( elem, name, value ) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />

		if (!elem || elem.nodeType == 3 || elem.nodeType == 8)
			return undefined;

		var notxml = !jQuery.isXMLDoc( elem ),
			set = value !== undefined;

		name = notxml && jQuery.props[ name ] || name;

		if ( elem.tagName ) {

			var special = /href|src|style/.test( name );

			if ( name == "selected" && elem.parentNode )
				elem.parentNode.selectedIndex;

			if ( name in elem && notxml && !special ) {
				if ( set ){
					if ( name == "type" && jQuery.nodeName( elem, "input" ) && elem.parentNode )
						throw "type property can't be changed";

					elem[ name ] = value;
				}

				if( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) )
					return elem.getAttributeNode( name ).nodeValue;

				if ( name == "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );
					return attributeNode && attributeNode.specified
						? attributeNode.value
						: elem.nodeName.match(/(button|input|object|select|textarea)/i)
							? 0
							: elem.nodeName.match(/^(a|area)$/i) && elem.href
								? 0
								: undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml &&  name == "style" )
				return jQuery.attr( elem.style, "cssText", value );

			if ( set )
				elem.setAttribute( name, "" + value );

			var attr = !jQuery.support.hrefNormalized && notxml && special
					? elem.getAttribute( name, 2 )
					: elem.getAttribute( name );

			return attr === null ? undefined : attr;
		}


		if ( !jQuery.support.opacity && name == "opacity" ) {
			if ( set ) {
				elem.zoom = 1;

				elem.filter = (elem.filter || "").replace( /alpha\([^)]*\)/, "" ) +
					(parseInt( value ) + '' == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
			}

			return elem.filter && elem.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100) + '':
				"";
		}

		name = name.replace(/-([a-z])/ig, function(all, letter){
			return letter.toUpperCase();
		});

		if ( set )
			elem[ name ] = value;

		return elem[ name ];
	},

	trim: function( text ) {
		///	<summary>
		///		Remove the whitespace from the beginning and end of a string.
		///		Part of JavaScript
		///	</summary>
		///	<returns type="String" />
		///	<param name="text" type="String">
		///		The string to trim.
		///	</param>

		return (text || "").replace( /^\s+|\s+$/g, "" );
	},

	makeArray: function( array ) {
		///	<summary>
		///		Turns anything into a true array.  This is an internal method.
		///	</summary>
		///	<param name="array" type="Object">Anything to turn into an actual Array</param>
		///	<returns type="Array" />
		///	<private />

		var ret = [];

		if( array != null ){
			var i = array.length;
			if( i == null || typeof array === "string" || jQuery.isFunction(array) || array.setInterval )
				ret[0] = array;
			else
				while( i )
					ret[--i] = array[i];
		}

		return ret;
	},

	inArray: function( elem, array ) {
		///	<summary>
		///		Determines the index of the first parameter in the array.
		///	</summary>
		///	<param name="elem">The value to see if it exists in the array.</param>
		///	<param name="array" type="Array">The array to look through for the value</param>
		///	<returns type="Number" integer="true">The 0-based index of the item if it was found, otherwise -1.</returns>

		for ( var i = 0, length = array.length; i < length; i++ )
			if ( array[ i ] === elem )
				return i;

		return -1;
	},

	merge: function( first, second ) {
		///	<summary>
		///		Merge two arrays together, removing all duplicates.
		///		The new array is: All the results from the first array, followed
		///		by the unique results from the second array.
		///		Part of JavaScript
		///	</summary>
		///	<returns type="Array" />
		///	<param name="first" type="Array">
		///		 The first array to merge.
		///	</param>
		///	<param name="second" type="Array">
		///		 The second array to merge.
		///	</param>

		var i = 0, elem, pos = first.length;
		if ( !jQuery.support.getAll ) {
			while ( (elem = second[ i++ ]) != null )
				if ( elem.nodeType != 8 )
					first[ pos++ ] = elem;

		} else
			while ( (elem = second[ i++ ]) != null )
				first[ pos++ ] = elem;

		return first;
	},

	unique: function( array ) {
		///	<summary>
		///		Removes all duplicate elements from an array of elements.
		///	</summary>
		///	<param name="array" type="Array&lt;Element&gt;">The array to translate</param>
		///	<returns type="Array&lt;Element&gt;">The array after translation.</returns>

		var ret = [], done = {};

		try {

			for ( var i = 0, length = array.length; i < length; i++ ) {
				var id = jQuery.data( array[ i ] );

				if ( !done[ id ] ) {
					done[ id ] = true;
					ret.push( array[ i ] );
				}
			}

		} catch( e ) {
			ret = array;
		}

		return ret;
	},

	grep: function( elems, callback, inv ) {
		///	<summary>
		///		Filter items out of an array, by using a filter function.
		///		The specified function will be passed two arguments: The
		///		current array item and the index of the item in the array. The
		///		function must return 'true' to keep the item in the array, 
		///		false to remove it.
		///		});
		///		Part of JavaScript
		///	</summary>
		///	<returns type="Array" />
		///	<param name="elems" type="Array">
		///		array The Array to find items in.
		///	</param>
		///	<param name="fn" type="Function">
		///		 The function to process each item against.
		///	</param>
		///	<param name="inv" type="Boolean">
		///		 Invert the selection - select the opposite of the function.
		///	</param>
		
		var ret = [];

		for ( var i = 0, length = elems.length; i < length; i++ )
			if ( !inv != !callback( elems[ i ], i ) )
				ret.push( elems[ i ] );

		return ret;
	},

	map: function( elems, callback ) {
		///	<summary>
		///		Translate all items in an array to another array of items.
		///		The translation function that is provided to this method is 
		///		called for each item in the array and is passed one argument: 
		///		The item to be translated.
		///		The function can then return the translated value, 'null'
		///		(to remove the item), or  an array of values - which will
		///		be flattened into the full array.
		///		Part of JavaScript
		///	</summary>
		///	<returns type="Array" />
		///	<param name="elems" type="Array">
		///		array The Array to translate.
		///	</param>
		///	<param name="fn" type="Function">
		///		 The function to process each item against.
		///	</param>
		
		var ret = [];

		for ( var i = 0, length = elems.length; i < length; i++ ) {
			var value = callback( elems[ i ], i );

			if ( value != null )
				ret[ ret.length ] = value;
		}

		return ret.concat.apply( [], ret );
	}
});


var userAgent = navigator.userAgent.toLowerCase();

jQuery.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};


jQuery.each({
	parent: function(elem){return elem.parentNode;}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		///	<summary>
		///		Get a set of elements containing the unique parents of the matched
		///		set of elements.
		///		Can be filtered with an optional expressions.
		///		Part of DOM/Traversing
		///	</summary>
		///	<param name="expr" type="String" optional="true">
		///		(optional) An expression to filter the parents with
		///	</param>
		///	<returns type="jQuery" />   
		
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	parents: function(elem){return jQuery.dir(elem,"parentNode");}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		///	<summary>
		///		Get a set of elements containing the unique ancestors of the matched
		///		set of elements (except for the root element).
		///		Can be filtered with an optional expressions.
		///		Part of DOM/Traversing
		///	</summary>
		///	<param name="expr" type="String" optional="true">
		///		(optional) An expression to filter the ancestors with
		///	</param>
		///	<returns type="jQuery" />   
		
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	next: function(elem){return jQuery.nth(elem,2,"nextSibling");}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		///	<summary>
		///		Get a set of elements containing the unique next siblings of each of the
		///		matched set of elements.
		///		It only returns the very next sibling, not all next siblings.
		///		Can be filtered with an optional expressions.
		///		Part of DOM/Traversing
		///	</summary>
		///	<param name="expr" type="String" optional="true">
		///		(optional) An expression to filter the next Elements with
		///	</param>
		///	<returns type="jQuery" />
		
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	prev: function(elem){return jQuery.nth(elem,2,"previousSibling");}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		///	<summary>
		///		Get a set of elements containing the unique previous siblings of each of the
		///		matched set of elements.
		///		Can be filtered with an optional expressions.
		///		It only returns the immediately previous sibling, not all previous siblings.
		///		Part of DOM/Traversing
		///	</summary>
		///	<param name="expr" type="String" optional="true">
		///		(optional) An expression to filter the previous Elements with
		///	</param>
		///	<returns type="jQuery" />
		
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	nextAll: function(elem){return jQuery.dir(elem,"nextSibling");}
}, function(name, fn){
	jQuery.fn[name] = function(selector) {
		///	<summary>
		///		Finds all sibling elements after the current element.
		///		Can be filtered with an optional expressions.
		///		Part of DOM/Traversing
		///	</summary>
		///	<param name="expr" type="String" optional="true">
		///		(optional) An expression to filter the next Elements with
		///	</param>
		///	<returns type="jQuery" />
		
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	prevAll: function(elem){return jQuery.dir(elem,"previousSibling");}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		///	<summary>
		///		Finds all sibling elements before the current element.
		///		Can be filtered with an optional expressions.
		///		Part of DOM/Traversing
		///	</summary>
		///	<param name="expr" type="String" optional="true">
		///		(optional) An expression to filter the previous Elements with
		///	</param>
		///	<returns type="jQuery" />
	
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	siblings: function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		///	<summary>
		///		Get a set of elements containing all of the unique siblings of each of the
		///		matched set of elements.
		///		Can be filtered with an optional expressions.
		///		Part of DOM/Traversing
		///	</summary>
		///	<param name="expr" type="String" optional="true">
		///		(optional) An expression to filter the sibling Elements with
		///	</param>
		///	<returns type="jQuery" />
		
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	children: function(elem){return jQuery.sibling(elem.firstChild);}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		///	<summary>
		///		Get a set of elements containing all of the unique children of each of the
		///		matched set of elements.
		///		Can be filtered with an optional expressions.
		///		Part of DOM/Traversing
		///	</summary>
		///	<param name="expr" type="String" optional="true">
		///		(optional) An expression to filter the child Elements with
		///	</param>
		///	<returns type="jQuery" />
		
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	contents: function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		///	<summary>Finds all the child nodes inside the matched elements including text nodes, or the content document if the element is an iframe.</summary>
		///	<returns type="jQuery" />
		
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});


jQuery.fn.appendTo = function( selector ) {
	///	<summary>
	///		Append all of the matched elements to another, specified, set of elements.
	///		As of jQuery 1.3.2, returns all of the inserted elements.
	///		This operation is, essentially, the reverse of doing a regular
	///		$(A).append(B), in that instead of appending B to A, you're appending
	///		A to B.
	///	</summary>
	///	<param name="selector" type="Selector">
	///		 target to which the content will be appended.
	///	</param>
	///	<returns type="jQuery" />
	var ret = [], insert = jQuery( selector );

	for ( var i = 0, l = insert.length; i < l; i++ ) {
		var elems = (i > 0 ? this.clone(true) : this).get();
		jQuery.fn[ "append" ].apply( jQuery(insert[i]), elems );
		ret = ret.concat( elems );
	}

	return this.pushStack( ret, "appendTo", selector );
};

jQuery.fn.prependTo = function( selector ) {
	///	<summary>
	///		Prepend all of the matched elements to another, specified, set of elements.
	///		As of jQuery 1.3.2, returns all of the inserted elements.
	///		This operation is, essentially, the reverse of doing a regular
	///		$(A).prepend(B), in that instead of prepending B to A, you're prepending
	///		A to B.
	///	</summary>
	///	<param name="selector" type="Selector">
	///		 target to which the content will be appended.
	///	</param>
	///	<returns type="jQuery" />
	var ret = [], insert = jQuery( selector );

	for ( var i = 0, l = insert.length; i < l; i++ ) {
		var elems = (i > 0 ? this.clone(true) : this).get();
		jQuery.fn[ "prepend" ].apply( jQuery(insert[i]), elems );
		ret = ret.concat( elems );
	}

	return this.pushStack( ret, "prependTo", selector );
};

jQuery.fn.insertBefore = function( selector ) {
	///	<summary>
	///		Insert all of the matched elements before another, specified, set of elements.
	///		As of jQuery 1.3.2, returns all of the inserted elements.
	///		This operation is, essentially, the reverse of doing a regular
	///		$(A).before(B), in that instead of inserting B before A, you're inserting
	///		A before B.
	///	</summary>
	///	<param name="content" type="String">
	///		 Content after which the selected element(s) is inserted.
	///	</param>
	///	<returns type="jQuery" />
	var ret = [], insert = jQuery( selector );

	for ( var i = 0, l = insert.length; i < l; i++ ) {
		var elems = (i > 0 ? this.clone(true) : this).get();
		jQuery.fn[ "before" ].apply( jQuery(insert[i]), elems );
		ret = ret.concat( elems );
	}

	return this.pushStack( ret, "insertBefore", selector );
};

jQuery.fn.insertAfter = function( selector ) {
	///	<summary>
	///		Insert all of the matched elements after another, specified, set of elements.
	///		As of jQuery 1.3.2, returns all of the inserted elements.
	///		This operation is, essentially, the reverse of doing a regular
	///		$(A).after(B), in that instead of inserting B after A, you're inserting
	///		A after B.
	///	</summary>
	///	<param name="content" type="String">
	///		 Content after which the selected element(s) is inserted.
	///	</param>
	///	<returns type="jQuery" />
	var ret = [], insert = jQuery( selector );

	for ( var i = 0, l = insert.length; i < l; i++ ) {
		var elems = (i > 0 ? this.clone(true) : this).get();
		jQuery.fn[ "after" ].apply( jQuery(insert[i]), elems );
		ret = ret.concat( elems );
	}

	return this.pushStack( ret, "insertAfter", selector );
};

jQuery.fn.replaceAll = function( selector ) {
	///	<summary>
	///		Replaces the elements matched by the specified selector with the matched elements.
	///		As of jQuery 1.3.2, returns all of the inserted elements.
	///	</summary>
	///	<param name="selector" type="Selector">The elements to find and replace the matched elements with.</param>
	///	<returns type="jQuery" />
	var ret = [], insert = jQuery( selector );

	for ( var i = 0, l = insert.length; i < l; i++ ) {
		var elems = (i > 0 ? this.clone(true) : this).get();
		jQuery.fn[ "replaceWith" ].apply( jQuery(insert[i]), elems );
		ret = ret.concat( elems );
	}

	return this.pushStack( ret, "replaceAll", selector );
};


jQuery.fn.removeAttr = function(){
	///	<summary>
	///		Remove an attribute from each of the matched elements.
	///		Part of DOM/Attributes
	///	</summary>
	///	<param name="key" type="String">
	///		name The name of the attribute to remove.
	///	</param>
	///	<returns type="jQuery" />
	return this.each( function( name ) {
		jQuery.attr( this, name, "" );
		if (this.nodeType == 1)
			this.removeAttribute( name );
	}, arguments );
};

jQuery.fn.addClass = function(){
	///	<summary>
	///		Adds the specified class(es) to each of the set of matched elements.
	///		Part of DOM/Attributes
	///	</summary>
	///	<param name="classNames" type="String">
	///		lass One or more CSS classes to add to the elements
	///	</param>
	///	<returns type="jQuery" />
	return this.each( function( classNames ) {
		jQuery.className.add( this, classNames );
	}, arguments );
};

jQuery.fn.removeClass = function(){
	///	<summary>
	///		Removes all or the specified class(es) from the set of matched elements.
	///		Part of DOM/Attributes
	///	</summary>
	///	<param name="cssClasses" type="String" optional="true">
	///		(Optional) One or more CSS classes to remove from the elements
	///	</param>
	///	<returns type="jQuery" />
	return this.each( function( classNames ) {
		jQuery.className.remove( this, classNames );
	}, arguments );
};

jQuery.fn.toggleClass = function(){
	///	<summary>
	///		Adds the specified class if it is not present, removes it if it is
	///		present.
	///		Part of DOM/Attributes
	///	</summary>
	///	<param name="cssClass" type="String">
	///		A CSS class with which to toggle the elements
	///	</param>
	///	<returns type="jQuery" />
	return this.each( function( classNames, state ) {
		if( typeof state !== "boolean" )
			state = !jQuery.className.has( this, classNames );
		jQuery.className[ state ? "add" : "remove" ]( this, classNames );
	}, arguments );
};

jQuery.fn.remove = function(){
	///	<summary>
	///		Removes all matched elements from the DOM. This does NOT remove them from the
	///		jQuery object, allowing you to use the matched elements further.
	///		Can be filtered with an optional expressions.
	///		Part of DOM/Manipulation
	///	</summary>
	///	<param name="expr" type="String" optional="true">
	///		(optional) A jQuery expression to filter elements by.
	///	</param>
	///	<returns type="jQuery" />
	return this.each( function( selector ) {
		if ( !selector || jQuery.filter( selector, [ this ] ).length ) {
			jQuery( "*", this ).add([this]).each(function(){
				jQuery.event.remove(this);
				jQuery.removeData(this);
			});
			if (this.parentNode)
				this.parentNode.removeChild( this );
		}
	}, arguments );
};

jQuery.fn.empty = function(){
	///	<summary>
	///		Removes all child nodes from the set of matched elements.
	///		Part of DOM/Manipulation
	///	</summary>
	///	<returns type="jQuery" />
	return this.each( function() {
		jQuery(this).children().remove();

		while ( this.firstChild )
			this.removeChild( this.firstChild );
	}, arguments );
};

function num(elem, prop) {
	return elem[0] && parseInt( jQuery.curCSS(elem[0], prop, true), 10 ) || 0;
}
var expando = "jQuery" + now(), uuid = 0, windowData = {};

jQuery.extend({
	cache: {},

	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		if ( !id )
			id = elem[ expando ] = ++uuid;

		if ( name && !jQuery.cache[ id ] )
			jQuery.cache[ id ] = {};

		if ( data !== undefined )
			jQuery.cache[ id ][ name ] = data;

		return name ?
			jQuery.cache[ id ][ name ] :
			id;
	},

	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		if ( name ) {
			if ( jQuery.cache[ id ] ) {
				delete jQuery.cache[ id ][ name ];

				name = "";

				for ( name in jQuery.cache[ id ] )
					break;

				if ( !name )
					jQuery.removeData( elem );
			}

		} else {
			try {
				delete elem[ expando ];
			} catch(e){
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			delete jQuery.cache[ id ];
		}
	},
	queue: function( elem, type, data ) {
		if ( elem ){
	
			type = (type || "fx") + "queue";
	
			var q = jQuery.data( elem, type );
	
			if ( !q || jQuery.isArray(data) )
				q = jQuery.data( elem, type, jQuery.makeArray(data) );
			else if( data )
				q.push( data );
	
		}
		return q;
	},

	dequeue: function( elem, type ){
		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();
		
		if( !type || type === "fx" )
			fn = queue[0];
			
		if( fn !== undefined )
			fn.call(elem);
	}
});

jQuery.fn.extend({
	data: function( key, value ){
		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length )
				data = jQuery.data( this[0], key );

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
				jQuery.data( this, key, value );
			});
	},

	removeData: function( key ){
		return this.each(function(){
			jQuery.removeData( this, key );
		});
	},
	queue: function(type, data){
		///	<summary>
		///		1: queue() - Returns a reference to the first element's queue (which is an array of functions).
		///		2: queue(callback) - Adds a new function, to be executed, onto the end of the queue of all matched elements.
		///		3: queue(queue) - Replaces the queue of all matched element with this new queue (the array of functions).
		///	</summary>
		///	<param name="type" type="Function">The function to add to the queue.</param>
		///	<returns type="jQuery" />

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined )
			return jQuery.queue( this[0], type );

		return this.each(function(){
			var queue = jQuery.queue( this, type, data );
			
			 if( type == "fx" && queue.length == 1 )
				queue[0].call(this);
		});
	},
	dequeue: function(type){
		///	<summary>
		///		Removes a queued function from the front of the queue and executes it.
		///	</summary>
		///	<param name="type" type="String" optional="true">The type of queue to access.</param>
		///	<returns type="jQuery" />
		
		return this.each(function(){
			jQuery.dequeue( this, type );
		});
	}
});/*!
 * Sizzle CSS Selector Engine - v0.9.3
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
	done = 0,
	toString = Object.prototype.toString;

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 )
		return [];
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, check, mode, extra, prune = true;
	
	chunker.lastIndex = 0;
	
	while ( (m = chunker.exec(selector)) !== null ) {
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = RegExp.rightContext;
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] )
					selector += parts.shift();

				set = posProcess( selector, set );
			}
		}
	} else {
		var ret = seed ?
			{ expr: parts.pop(), set: makeArray(seed) } :
			Sizzle.find( parts.pop(), parts.length === 1 && context.parentNode ? context.parentNode : context, isXML(context) );
		set = Sizzle.filter( ret.expr, ret.set );

		if ( parts.length > 0 ) {
			checkSet = makeArray(set);
		} else {
			prune = false;
		}

		while ( parts.length ) {
			var cur = parts.pop(), pop = cur;

			if ( !Expr.relative[ cur ] ) {
				cur = "";
			} else {
				pop = parts.pop();
			}

			if ( pop == null ) {
				pop = context;
			}

			Expr.relative[ cur ]( checkSet, pop, isXML(context) );
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		throw "Syntax error, unrecognized expression: " + (cur || selector);
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, context, results, seed );

		if ( sortOrder ) {
			hasDuplicate = false;
			results.sort(sortOrder);

			if ( hasDuplicate ) {
				for ( var i = 1; i < results.length; i++ ) {
					if ( results[i] === results[i-1] ) {
						results.splice(i--, 1);
					}
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.match[ type ].exec( expr )) ) {
			var left = RegExp.leftContext;

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.match[ type ].exec( expr )) != null ) {
				var filter = Expr.filter[ type ], found, item;
				anyFound = false;

				if ( curLoop == result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		if ( expr == old ) {
			if ( anyFound == null ) {
				throw "Syntax error, unrecognized expression: " + expr;
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
	},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part, isXML){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag && !isXML ) {
				part = part.toUpperCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part, isXML){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = isXML ? part : part.toUpperCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context, isXML){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0) ) {
						if ( !inplace )
							result.push( elem );
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			for ( var i = 0; curLoop[i] === false; i++ ){}
			return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
		},
		CHILD: function(match){
			if ( match[1] == "nth" ) {
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				if ( match[3].match(chunker).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 == i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 == i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while (node = node.previousSibling)  {
						if ( node.nodeType === 1 ) return false;
					}
					if ( type == 'first') return true;
					node = elem;
				case 'last':
					while (node = node.nextSibling)  {
						if ( node.nodeType === 1 ) return false;
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first == 1 && last == 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first == 0 ) {
						return diff == 0;
					} else {
						return ( diff % first == 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value != check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

try {
	Array.prototype.slice.call( document.documentElement.childNodes );

} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.selectNode(a);
		aRange.collapse(true);
		bRange.selectNode(b);
		bRange.collapse(true);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

(function(){
	////var form = document.createElement("form"),
	////	id = "script" + (new Date).getTime();
	////form.innerHTML = "<input name='" + id + "'/>";

	////var root = document.documentElement;
	////root.insertBefore( form, root.firstChild );

	////if ( !!document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	////}

	////root.removeChild( form );
})();

(function(){

	////var div = document.createElement("div");
	////div.appendChild( document.createComment("") );

	////if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	////}

	////div.innerHTML = "<a href='#'></a>";
	////if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
	////		div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	////}
})();

if ( document.querySelectorAll ) (function(){
	var oldSizzle = Sizzle, div = document.createElement("div");
	div.innerHTML = "<p class='TEST'></p>";

	if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
		return;
	}
	
	Sizzle = function(query, context, extra, seed){
		context = context || document;

		if ( !seed && context.nodeType === 9 && !isXML(context) ) {
			try {
				return makeArray( context.querySelectorAll(query), extra );
			} catch(e){}
		}
		
		return oldSizzle(query, context, extra, seed);
	};

	Sizzle.find = oldSizzle.find;
	Sizzle.filter = oldSizzle.filter;
	Sizzle.selectors = oldSizzle.selectors;
	Sizzle.matches = oldSizzle.matches;
})();

if ( document.getElementsByClassName && document.documentElement.getElementsByClassName ) (function(){
	var div = document.createElement("div");
	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	if ( div.getElementsByClassName("e").length === 0 )
		return;

	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 )
		return;

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	var sibDir = dir == "previousSibling" && !isXML;
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			if ( sibDir && elem.nodeType === 1 ){
				elem.sizcache = doneName;
				elem.sizset = i;
			}
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	var sibDir = dir == "previousSibling" && !isXML;
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			if ( sibDir && elem.nodeType === 1 ) {
				elem.sizcache = doneName;
				elem.sizset = i;
			}
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ?  function(a, b){
	return a.compareDocumentPosition(b) & 16;
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
		!!elem.ownerDocument && isXML( elem.ownerDocument );
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

jQuery.find = Sizzle;
jQuery.filter = Sizzle.filter;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;

Sizzle.selectors.filters.hidden = function(elem){
	return elem.offsetWidth === 0 || elem.offsetHeight === 0;
};

Sizzle.selectors.filters.visible = function(elem){
	return elem.offsetWidth > 0 || elem.offsetHeight > 0;
};

Sizzle.selectors.filters.animated = function(elem){
	return jQuery.grep(jQuery.timers, function(fn){
		return elem === fn.elem;
	}).length;
};

jQuery.multiFilter = function( expr, elems, not ) {
	///	<summary>
	///		This member is internal only.
	///	</summary>
	///	<private />

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return Sizzle.matches(expr, elems);
};

jQuery.dir = function( elem, dir ){
	///	<summary>
	///		This member is internal only.
	///	</summary>
	///	<private />
	var matched = [], cur = elem[dir];
	while ( cur && cur != document ) {
		if ( cur.nodeType == 1 )
			matched.push( cur );
		cur = cur[dir];
	}
	return matched;
};

jQuery.nth = function(cur, result, dir, elem){
	///	<summary>
	///		This member is internal only.
	///	</summary>
	///	<private />
	result = result || 1;
	var num = 0;

	for ( ; cur; cur = cur[dir] )
		if ( cur.nodeType == 1 && ++num == result )
			break;

	return cur;
};

jQuery.sibling = function(n, elem){
	///	<summary>
	///		This member is internal only.
	///	</summary>
	///	<private />
	var r = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType == 1 && n != elem )
			r.push( n );
	}

	return r;
};

return;

window.Sizzle = Sizzle;

})();
/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	add: function(elem, types, handler, data) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		if ( elem.setInterval && elem != window )
			elem = window;

		if ( !handler.guid )
			handler.guid = this.guid++;

		if ( data !== undefined ) {
			var fn = handler;

			handler = this.proxy( fn );

			handler.data = data;
		}

		var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
			handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function(){
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply(arguments.callee.elem, arguments) :
					undefined;
			});
		handle.elem = elem;

		jQuery.each(types.split(/\s+/), function(index, type) {
			var namespaces = type.split(".");
			type = namespaces.shift();
			handler.type = namespaces.slice().sort().join(".");

			var handlers = events[type];
			
			if ( jQuery.event.specialAll[type] )
				jQuery.event.specialAll[type].setup.call(elem, data, namespaces);

			if (!handlers) {
				handlers = events[type] = {};

				if ( !jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem, data, namespaces) === false ) {
					if (elem.addEventListener)
						elem.addEventListener(type, handle, false);
					else if (elem.attachEvent)
						elem.attachEvent("on" + type, handle);
				}
			}

			handlers[handler.guid] = handler;

			jQuery.event.global[type] = true;
		});

		elem = null;
	},

	guid: 1,
	global: {},

	remove: function(elem, types, handler) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		var events = jQuery.data(elem, "events"), ret, index;

		if ( events ) {
			if ( types === undefined || (typeof types === "string" && types.charAt(0) == ".") )
				for ( var type in events )
					this.remove( elem, type + (types || "") );
			else {
				if ( types.type ) {
					handler = types.handler;
					types = types.type;
				}

				jQuery.each(types.split(/\s+/), function(index, type){
					var namespaces = type.split(".");
					type = namespaces.shift();
					var namespace = RegExp("(^|\\.)" + namespaces.slice().sort().join(".*\\.") + "(\\.|$)");

					if ( events[type] ) {
						if ( handler )
							delete events[type][handler.guid];

						else
							for ( var handle in events[type] )
								if ( namespace.test(events[type][handle].type) )
									delete events[type][handle];
									
						if ( jQuery.event.specialAll[type] )
							jQuery.event.specialAll[type].teardown.call(elem, namespaces);

						for ( ret in events[type] ) break;
						if ( !ret ) {
							if ( !jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem, namespaces) === false ) {
								if (elem.removeEventListener)
									elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
								else if (elem.detachEvent)
									elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
							}
							ret = null;
							delete events[type];
						}
					}
				});
			}

			for ( ret in events ) break;
			if ( !ret ) {
				var handle = jQuery.data( elem, "handle" );
				if ( handle ) handle.elem = null;
				jQuery.removeData( elem, "events" );
				jQuery.removeData( elem, "handle" );
			}
		}
	},

	trigger: function( event, data, elem, bubbling ) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		
		var type = event.type || event;

		if( !bubbling ){
			event = typeof event === "object" ?
				event[expando] ? event :
				jQuery.extend( jQuery.Event(type), event ) :
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			if ( !elem ) {
				event.stopPropagation();
				if ( this.global[type] )
					jQuery.each( jQuery.cache, function(){
						if ( this.events && this.events[type] )
							jQuery.event.trigger( event, data, this.handle.elem );
					});
			}


			if ( !elem || elem.nodeType == 3 || elem.nodeType == 8 )
				return undefined;
			
			event.result = undefined;
			event.target = elem;
			
			data = jQuery.makeArray(data);
			data.unshift( event );
		}

		event.currentTarget = elem;

		var handle = jQuery.data(elem, "handle");
		if ( handle )
			handle.apply( elem, data );

		if ( (!elem[type] || (jQuery.nodeName(elem, 'a') && type == "click")) && elem["on"+type] && elem["on"+type].apply( elem, data ) === false )
			event.result = false;

		if ( !bubbling && elem[type] && !event.isDefaultPrevented() && !(jQuery.nodeName(elem, 'a') && type == "click") ) {
			this.triggered = true;
			try {
				elem[ type ]();
			} catch (e) {}
		}

		this.triggered = false;

		if ( !event.isPropagationStopped() ) {
			var parent = elem.parentNode || elem.ownerDocument;
			if ( parent )
				jQuery.event.trigger(event, data, parent, true);
		}
	},

	handle: function(event) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		
		var all, handlers;

		event = arguments[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		var namespaces = event.type.split(".");
		event.type = namespaces.shift();

		all = !namespaces.length && !event.exclusive;
		
		var namespace = RegExp("(^|\\.)" + namespaces.slice().sort().join(".*\\.") + "(\\.|$)");

		handlers = ( jQuery.data(this, "events") || {} )[event.type];

		for ( var j in handlers ) {
			var handler = handlers[j];

			if ( all || namespace.test(handler.type) ) {
				event.handler = handler;
				event.data = handler.data;

				var ret = handler.apply(this, arguments);

				if( ret !== undefined ){
					event.result = ret;
					if ( ret === false ) {
						event.preventDefault();
						event.stopPropagation();
					}
				}

				if( event.isImmediatePropagationStopped() )
					break;

			}
		}
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function(event) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		
		if ( event[expando] )
			return event;

		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ){
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		if ( !event.target )
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either

		if ( event.target.nodeType == 3 )
			event.target = event.target.parentNode;

		if ( !event.relatedTarget && event.fromElement )
			event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
		}

		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) )
			event.which = event.charCode || event.keyCode;

		if ( !event.metaKey && event.ctrlKey )
			event.metaKey = event.ctrlKey;

		if ( !event.which && event.button )
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));

		return event;
	},

	proxy: function( fn, proxy ){
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		
		proxy = proxy || function(){ return fn.apply(this, arguments); };
		proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
		return proxy;
	},

	special: {
		ready: {
			///	<summary>
			///		This method is internal.
			///	</summary>
			///	<private />
			
			setup: bindReady,
			teardown: function() {}
		}
	},
	
	specialAll: {
		live: {
			setup: function( selector, namespaces ){
				jQuery.event.add( this, namespaces[0], liveHandler );
			},
			teardown:  function( namespaces ){
				if ( namespaces.length ) {
					var remove = 0, name = RegExp("(^|\\.)" + namespaces[0] + "(\\.|$)");
					
					jQuery.each( (jQuery.data(this, "events").live || {}), function(){
						if ( name.test(this.type) )
							remove++;
					});
					
					if ( remove < 1 )
						jQuery.event.remove( this, namespaces[0], liveHandler );
				}
			}
		}
	}
};

jQuery.Event = function( src ){
	if( !this.preventDefault )
		return new jQuery.Event(src);
	
	if( src && src.type ){
		this.originalEvent = src;
		this.type = src.type;
	}else
		this.type = src;

	this.timeStamp = now();
	
	this[expando] = true;
};

function returnFalse(){
	return false;
}
function returnTrue(){
	return true;
}

jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if( !e )
			return;
		if (e.preventDefault)
			e.preventDefault();
		e.returnValue = false;
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if( !e )
			return;
		if (e.stopPropagation)
			e.stopPropagation();
		e.cancelBubble = true;
	},
	stopImmediatePropagation:function(){
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};
var withinElement = function(event) {
	var parent = event.relatedTarget;
	while ( parent && parent != this )
		try { parent = parent.parentNode; }
		catch(e) { parent = this; }
	
	if( parent != this ){
		event.type = event.data;
		jQuery.event.handle.apply( this, arguments );
	}
};
	
jQuery.each({ 
	mouseover: 'mouseenter', 
	mouseout: 'mouseleave'
}, function( orig, fix ){
	jQuery.event.special[ fix ] = {
		setup: function(){
			///	<summary>
			///		This method is internal.
			///	</summary>
			///	<private />
			
			jQuery.event.add( this, orig, withinElement, fix );
		},
		teardown: function(){
			///	<summary>
			///		This method is internal.
			///	</summary>
			///	<private />
			
			jQuery.event.remove( this, orig, withinElement );
		}
	};			   
});

jQuery.fn.extend({
	bind: function( type, data, fn ) {
		///	<summary>
		///		Binds a handler to one or more events for each matched element.  Can also bind custom events.
		///	</summary>
		///	<param name="type" type="String">One or more event types separated by a space.  Built-in event type values are: blur, focus, load, resize, scroll, unload, click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, error .</param>
		///	<param name="data" optional="true" type="Object">Additional data passed to the event handler as event.data</param>
		///	<param name="fn" type="Function">A function to bind to the event on each of the set of matched elements.  function callback(eventObject) such that this corresponds to the dom element.</param>
		
		return type == "unload" ? this.one(type, data, fn) : this.each(function(){
			jQuery.event.add( this, type, fn || data, fn && data );
		});
	},

	one: function( type, data, fn ) {
		///	<summary>
		///		Binds a handler to one or more events to be executed exactly once for each matched element.
		///	</summary>
		///	<param name="type" type="String">One or more event types separated by a space.  Built-in event type values are: blur, focus, load, resize, scroll, unload, click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, error .</param>
		///	<param name="data" optional="true" type="Object">Additional data passed to the event handler as event.data</param>
		///	<param name="fn" type="Function">A function to bind to the event on each of the set of matched elements.  function callback(eventObject) such that this corresponds to the dom element.</param>
		
		var one = jQuery.event.proxy( fn || data, function(event) {
			jQuery(this).unbind(event, one);
			return (fn || data).apply( this, arguments );
		});
		return this.each(function(){
			jQuery.event.add( this, type, one, fn && data);
		});
	},

	unbind: function( type, fn ) {
		///	<summary>
		///		Unbinds a handler from one or more events for each matched element.
		///	</summary>
		///	<param name="type" type="String">One or more event types separated by a space.  Built-in event type values are: blur, focus, load, resize, scroll, unload, click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, error .</param>
		///	<param name="fn" type="Function">A function to bind to the event on each of the set of matched elements.  function callback(eventObject) such that this corresponds to the dom element.</param>
		
		return this.each(function(){
			jQuery.event.remove( this, type, fn );
		});
	},

	trigger: function( type, data ) {
		///	<summary>
		///		Triggers a type of event on every matched element.
		///	</summary>
		///	<param name="type" type="String">One or more event types separated by a space.  Built-in event type values are: blur, focus, load, resize, scroll, unload, click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, error .</param>
		///	<param name="data" optional="true" type="Array">Additional data passed to the event handler as additional arguments.</param>
		///	<param name="fn" type="Function">This parameter is undocumented.</param>
		
		return this.each(function(){
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		///	<summary>
		///		Triggers all bound event handlers on an element for a specific event type without executing the browser's default actions.
		///	</summary>
		///	<param name="type" type="String">One or more event types separated by a space.  Built-in event type values are: blur, focus, load, resize, scroll, unload, click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, error .</param>
		///	<param name="data" optional="true" type="Array">Additional data passed to the event handler as additional arguments.</param>
		///	<param name="fn" type="Function">This parameter is undocumented.</param>
	
		if( this[0] ){
			var event = jQuery.Event(type);
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}		
	},

	toggle: function( fn ) {
		///	<summary>
		///		Toggles among two or more function calls every other click.
		///	</summary>
		///	<param name="fn" type="Function">The functions among which to toggle execution</param>
		
		var args = arguments, i = 1;

		while( i < args.length )
			jQuery.event.proxy( fn, args[i++] );

		return this.click( jQuery.event.proxy( fn, function(event) {
			this.lastToggle = ( this.lastToggle || 0 ) % i;

			event.preventDefault();

			return args[ this.lastToggle++ ].apply( this, arguments ) || false;
		}));
	},

	hover: function(fnOver, fnOut) {
		///	<summary>
		///		Simulates hovering (moving the mouse on or off of an object).
		///	</summary>
		///	<param name="fnOver" type="Function">The function to fire when the mouse is moved over a matched element.</param>
		///	<param name="fnOut" type="Function">The function to fire when the mouse is moved off of a matched element.</param>
		
		return this.mouseenter(fnOver).mouseleave(fnOut);
	},

	ready: function(fn) {
		///	<summary>
		///		Binds a function to be executed whenever the DOM is ready to be traversed and manipulated.
		///	</summary>
		///	<param name="fn" type="Function">The function to be executed when the DOM is ready.</param>

		bindReady();

		if ( jQuery.isReady )
			fn.call( document, jQuery );

		else
			jQuery.readyList.push( fn );

		return this;
	},
	
	live: function( type, fn ){
		///	<summary>
		///		Binds a handler to an event (like click) for all current - and future - matched element. Can also bind custom events.
		///	</summary>
		///	<param name="type" type="String">An event type</param>
		///	<param name="fn" type="Function">A function to bind to the event on each of the set of matched elements</param>

		var proxy = jQuery.event.proxy( fn );
		proxy.guid += this.selector + type;

		jQuery(document).bind( liveConvert(type, this.selector), this.selector, proxy );

		return this;
	},
	
	die: function( type, fn ){
		///	<summary>
		///		This does the opposite of live, it removes a bound live event.
		///		You can also unbind custom events registered with live.
		///		If the type is provided, all bound live events of that type are removed.
		///		If the function that was passed to live is provided as the second argument, only that specific event handler is removed.
		///	</summary>
		///	<param name="type" type="String">A live event type to unbind.</param>
		///	<param name="fn" type="Function">A function to unbind from the event on each of the set of matched elements.</param>

		jQuery(document).unbind( liveConvert(type, this.selector), fn ? { guid: fn.guid + this.selector + type } : null );
		return this;
	}
});

function liveHandler( event ){
	var check = RegExp("(^|\\.)" + event.type + "(\\.|$)"),
		stop = true,
		elems = [];

	jQuery.each(jQuery.data(this, "events").live || [], function(i, fn){
		if ( check.test(fn.type) ) {
			var elem = jQuery(event.target).closest(fn.data)[0];
			if ( elem )
				elems.push({ elem: elem, fn: fn });
		}
	});

	elems.sort(function(a,b) {
		return jQuery.data(a.elem, "closest") - jQuery.data(b.elem, "closest");
	});
	
	jQuery.each(elems, function(){
		if ( this.fn.call(this.elem, event, this.fn.data) === false )
			return (stop = false);
	});

	return stop;
}

function liveConvert(type, selector){
	return ["live", type, selector.replace(/\./g, "`").replace(/ /g, "|")].join(".");
}

jQuery.extend({
	isReady: false,
	readyList: [],
	ready: function() {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		
		if ( !jQuery.isReady ) {
			jQuery.isReady = true;

			if ( jQuery.readyList ) {
				jQuery.each( jQuery.readyList, function(){
					this.call( document, jQuery );
				});

				jQuery.readyList = null;
			}

			jQuery(document).triggerHandler("ready");
		}
	}
});

var readyBound = false;

function bindReady(){
	if ( readyBound ) return;
	readyBound = true;

	if ( document.addEventListener ) {
		document.addEventListener( "DOMContentLoaded", function(){
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
			jQuery.ready();
		}, false );

	} else if ( document.attachEvent ) {
		document.attachEvent("onreadystatechange", function(){
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", arguments.callee );
				jQuery.ready();
			}
		});

		if ( document.documentElement.doScroll && window == window.top ) (function(){
			if ( jQuery.isReady ) return;

			try {
				document.documentElement.doScroll("left");
			} catch( error ) {
				setTimeout( arguments.callee, 0 );
				return;
			}

			jQuery.ready();
		})();
	}

	jQuery.event.add( window, "load", jQuery.ready );
}


jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
	"mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave," +
	"change,select,submit,keydown,keypress,keyup,error").split(","), function(i, name){

	jQuery.fn[name] = function(fn){
		return fn ? this.bind(name, fn) : this.trigger(name);
	};
});

jQuery.fn["blur"] = function(fn) {
	///	<summary>
	///		1: blur() - Triggers the blur event of each matched element.
	///		2: blur(fn) - Binds a function to the blur event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("blur", fn) : this.trigger(name);
};

jQuery.fn["focus"] = function(fn) {
	///	<summary>
	///		1: focus() - Triggers the focus event of each matched element.
	///		2: focus(fn) - Binds a function to the focus event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("focus", fn) : this.trigger(name);
};

jQuery.fn["load"] = function(fn) {
	///	<summary>
	///		1: load() - Triggers the load event of each matched element.
	///		2: load(fn) - Binds a function to the load event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("load", fn) : this.trigger(name);
};

jQuery.fn["resize"] = function(fn) {
	///	<summary>
	///		1: resize() - Triggers the resize event of each matched element.
	///		2: resize(fn) - Binds a function to the resize event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("resize", fn) : this.trigger(name);
};

jQuery.fn["scroll"] = function(fn) {
	///	<summary>
	///		1: scroll() - Triggers the scroll event of each matched element.
	///		2: scroll(fn) - Binds a function to the scroll event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("scroll", fn) : this.trigger(name);
};

jQuery.fn["unload"] = function(fn) {
	///	<summary>
	///		1: unload() - Triggers the unload event of each matched element.
	///		2: unload(fn) - Binds a function to the unload event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("unload", fn) : this.trigger(name);
};

jQuery.fn["click"] = function(fn) {
	///	<summary>
	///		1: click() - Triggers the click event of each matched element.
	///		2: click(fn) - Binds a function to the click event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("click", fn) : this.trigger(name);
};

jQuery.fn["dblclick"] = function(fn) {
	///	<summary>
	///		1: dblclick() - Triggers the dblclick event of each matched element.
	///		2: dblclick(fn) - Binds a function to the dblclick event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("dblclick", fn) : this.trigger(name);
};

jQuery.fn["mousedown"] = function(fn) {
	///	<summary>
	///		Binds a function to the mousedown event of each matched element. 
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("mousedown", fn) : this.trigger(name);
};

jQuery.fn["mouseup"] = function(fn) {
	///	<summary>
	///		Bind a function to the mouseup event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("mouseup", fn) : this.trigger(name);
};

jQuery.fn["mousemove"] = function(fn) {
	///	<summary>
	///		Bind a function to the mousemove event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("mousemove", fn) : this.trigger(name);
};

jQuery.fn["mouseover"] = function(fn) {
	///	<summary>
	///		Bind a function to the mouseover event of each matched element. 
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("mouseover", fn) : this.trigger(name);
};

jQuery.fn["mouseout"] = function(fn) {
	///	<summary>
	///		Bind a function to the mouseout event of each matched element. 
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("mouseout", fn) : this.trigger(name);
};

jQuery.fn["mouseenter"] = function(fn) {
	///	<summary>
	///		Bind a function to the mouseenter event of each matched element. 
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("mouseenter", fn) : this.trigger(name);
};

jQuery.fn["mouseleave"] = function(fn) {
	///	<summary>
	///		Bind a function to the mouseleave event of each matched element. 
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("mouseleave", fn) : this.trigger(name);
};

jQuery.fn["change"] = function(fn) {
	///	<summary>
	///		1: change() - Triggers the change event of each matched element.
	///		2: change(fn) - Binds a function to the change event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("change", fn) : this.trigger(name);
};

jQuery.fn["select"] = function(fn) {
	///	<summary>
	///		1: select() - Triggers the select event of each matched element.
	///		2: select(fn) - Binds a function to the select event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("select", fn) : this.trigger(name);
};

jQuery.fn["submit"] = function(fn) {
	///	<summary>
	///		1: submit() - Triggers the submit event of each matched element.
	///		2: submit(fn) - Binds a function to the submit event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("submit", fn) : this.trigger(name);
};

jQuery.fn["keydown"] = function(fn) {
	///	<summary>
	///		1: keydown() - Triggers the keydown event of each matched element.
	///		2: keydown(fn) - Binds a function to the keydown event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("keydown", fn) : this.trigger(name);
};

jQuery.fn["keypress"] = function(fn) {
	///	<summary>
	///		1: keypress() - Triggers the keypress event of each matched element.
	///		2: keypress(fn) - Binds a function to the keypress event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("keypress", fn) : this.trigger(name);
};

jQuery.fn["keyup"] = function(fn) {
	///	<summary>
	///		1: keyup() - Triggers the keyup event of each matched element.
	///		2: keyup(fn) - Binds a function to the keyup event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("keyup", fn) : this.trigger(name);
};

jQuery.fn["error"] = function(fn) {
	///	<summary>
	///		1: error() - Triggers the error event of each matched element.
	///		2: error(fn) - Binds a function to the error event of each matched element.
	///	</summary>
	///	<param name="fn" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return fn ? this.bind("error", fn) : this.trigger(name);
};

jQuery( window ).bind( 'unload', function(){ 
	for ( var id in jQuery.cache )
		if ( id != 1 && jQuery.cache[ id ].handle )
			jQuery.event.remove( jQuery.cache[ id ].handle.elem );
});

(function(){

	jQuery.support = {};

	jQuery.support = {
		leadingWhitespace: false,
		
		tbody: false,
		
		objectAll: false,
		
		htmlSerialize: false,
		
		style: false,
		
		hrefNormalized: false,
		
		opacity: false,
		
		cssFloat: false,

		scriptEval: false,
		noCloneEvent: false,
		boxModel: false
	};

})();

var styleFloat = "styleFloat";

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	"float": styleFloat,
	cssFloat: styleFloat,
	styleFloat: styleFloat,
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	tabindex: "tabIndex"
};
jQuery.fn.extend({
	_load: jQuery.fn.load,

	load: function( url, params, callback ) {
		///	<summary>
		///		Loads HTML from a remote file and injects it into the DOM.  By default performs a GET request, but if parameters are included
		///		then a POST will be performed.
		///	</summary>
		///	<param name="url" type="String">The URL of the HTML page to load.</param>
		///	<param name="data" optional="true" type="Map">Key/value pairs that will be sent to the server.</param>
		///	<param name="callback" optional="true" type="Function">The function called when the AJAX request is complete.  It should map function(responseText, textStatus, XMLHttpRequest) such that this maps the injected DOM element.</param>
		///	<returns type="jQuery" />
		
		if ( typeof url !== "string" )
			return this._load( url );

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		var type = "GET";

		if ( params )
			if ( jQuery.isFunction( params ) ) {
				callback = params;
				params = null;

			} else if( typeof params === "object" ) {
				params = jQuery.param( params );
				type = "POST";
			}

		var self = this;

		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function(res, status){
				if ( status == "success" || status == "notmodified" )
					self.html( selector ?
						jQuery("<div/>")
							.append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))

							.find(selector) :

						res.responseText );

				if( callback )
					self.each( callback, [res.responseText, status, res] );
			}
		});
		return this;
	},

	serialize: function() {
		///	<summary>
		///		Serializes a set of input elements into a string of data.
		///	</summary>
		///	<returns type="String">The serialized result</returns>
	
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		///	<summary>
		///		Serializes all forms and form elements but returns a JSON data structure.
		///	</summary>
		///	<returns type="String">A JSON data structure representing the serialized items.</returns>
	
		return this.map(function(){
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				(this.checked || /select|textarea/i.test(this.nodeName) ||
					/text|hidden|password|search/i.test(this.type));
		})
		.map(function(i, elem){
			var val = jQuery(this).val();
			return val == null ? null :
				jQuery.isArray(val) ?
					jQuery.map( val, function(val, i){
						return {name: elem.name, value: val};
					}) :
					{name: elem.name, value: val};
		}).get();
	}
});


jQuery.fn["ajaxStart"] = function(callback) {
	///	<summary>
	///		Attach a function to be executed whenever an AJAX request begins and there is none already active. This is an Ajax Event.
	///	</summary>
	///	<param name="callback" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return this.bind("ajaxStart", f);
};

jQuery.fn["ajaxStop"] = function(callback) {
	///	<summary>
	///		Attach a function to be executed whenever all AJAX requests have ended. This is an Ajax Event.
	///	</summary>
	///	<param name="callback" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return this.bind("ajaxStop", f);
};

jQuery.fn["ajaxComplete"] = function(callback) {
	///	<summary>
	///		Attach a function to be executed whenever an AJAX request completes. This is an Ajax Event.
	///	</summary>
	///	<param name="callback" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return this.bind("ajaxComplete", f);
};

jQuery.fn["ajaxError"] = function(callback) {
	///	<summary>
	///		Attach a function to be executed whenever an AJAX request fails. This is an Ajax Event.
	///	</summary>
	///	<param name="callback" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return this.bind("ajaxError", f);
};

jQuery.fn["ajaxSuccess"] = function(callback) {
	///	<summary>
	///		Attach a function to be executed whenever an AJAX request completes successfully. This is an Ajax Event.
	///	</summary>
	///	<param name="callback" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return this.bind("ajaxSuccess", f);
};

jQuery.fn["ajaxSend"] = function(callback) {
	///	<summary>
	///		Attach a function to be executed before an AJAX request is sent. This is an Ajax Event.
	///	</summary>
	///	<param name="callback" type="Function">The function to execute.</param>
	///	<returns type="jQuery" />
	return this.bind("ajaxSend", f);
};


var jsc = now();

jQuery.extend({
  
	get: function( url, data, callback, type ) {
		///	<summary>
		///		Loads a remote page using an HTTP GET request.
		///	</summary>
		///	<param name="url" type="String">The URL of the HTML page to load.</param>
		///	<param name="data" optional="true" type="Map">Key/value pairs that will be sent to the server.</param>
		///	<param name="callback" optional="true" type="Function">The function called when the AJAX request is complete.  It should map function(responseText, textStatus) such that this maps the options for this AJAX request.</param>
		///	<param name="type" optional="true" type="String">Type of data to be returned to callback function.  Valid valiues are xml, html, script, json, text, _default.</param>
		///	<returns type="XMLHttpRequest" />
		
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		///	<summary>
		///		Loads and executes a local JavaScript file using an HTTP GET request.
		///	</summary>
		///	<param name="url" type="String">The URL of the script to load.</param>
		///	<param name="callback" optional="true" type="Function">The function called when the AJAX request is complete.  It should map function(data, textStatus) such that this maps the options for the AJAX request.</param>
		///	<returns type="XMLHttpRequest" />
	
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		///	<summary>
		///		Loads JSON data using an HTTP GET request.
		///	</summary>
		///	<param name="url" type="String">The URL of the JSON data to load.</param>
		///	<param name="data" optional="true" type="Map">Key/value pairs that will be sent to the server.</param>
		///	<param name="callback" optional="true" type="Function">The function called when the AJAX request is complete if the data is loaded successfully.  It should map function(data, textStatus) such that this maps the options for this AJAX request.</param>
		///	<returns type="XMLHttpRequest" />
	
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		///	<summary>
		///		Loads a remote page using an HTTP POST request.
		///	</summary>
		///	<param name="url" type="String">The URL of the HTML page to load.</param>
		///	<param name="data" optional="true" type="Map">Key/value pairs that will be sent to the server.</param>
		///	<param name="callback" optional="true" type="Function">The function called when the AJAX request is complete.  It should map function(responseText, textStatus) such that this maps the options for this AJAX request.</param>
		///	<param name="type" optional="true" type="String">Type of data to be returned to callback function.  Valid valiues are xml, html, script, json, text, _default.</param>
		///	<returns type="XMLHttpRequest" />
		
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		///	<summary>
		///		Sets up global settings for AJAX requests.
		///	</summary>
		///	<param name="settings" type="Options">A set of key/value pairs that configure the default Ajax request.</param>
	
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		*/
		xhr:function(){
			return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	lastModified: {},

	ajax: function( s ) {
		///	<summary>
		///		Load a remote page using an HTTP request.
		///	</summary>
		///	<private />
		
		s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));

		var jsonp, jsre = /=\?(&|$)/g, status, data,
			type = s.type.toUpperCase();

		if ( s.data && s.processData && typeof s.data !== "string" )
			s.data = jQuery.param(s.data);

		if ( s.dataType == "jsonp" ) {
			if ( type == "GET" ) {
				if ( !s.url.match(jsre) )
					s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
			} else if ( !s.data || !s.data.match(jsre) )
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			s.dataType = "json";
		}

		if ( s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre)) ) {
			jsonp = "jsonp" + jsc++;

			if ( s.data )
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			s.dataType = "script";

			window[ jsonp ] = function(tmp){
				data = tmp;
				success();
				complete();
				window[ jsonp ] = undefined;
				try{ delete window[ jsonp ]; } catch(e){}
				if ( head )
					head.removeChild( script );
			};
		}

		if ( s.dataType == "script" && s.cache == null )
			s.cache = false;

		if ( s.cache === false && type == "GET" ) {
			var ts = now();
			var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
			s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
		}

		if ( s.data && type == "GET" ) {
			s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;

			s.data = null;
		}

		if ( s.global && ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		var parts = /^(\w+:)?\/\/([^\/?#]+)/.exec( s.url );

		if ( s.dataType == "script" && type == "GET" && parts
			&& ( parts[1] && parts[1] != location.protocol || parts[2] != location.host )){

			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.src = s.url;
			if (s.scriptCharset)
				script.charset = s.scriptCharset;

			if ( !jsonp ) {
				var done = false;

				script.onload = script.onreadystatechange = function(){
					if ( !done && (!this.readyState ||
							this.readyState == "loaded" || this.readyState == "complete") ) {
						done = true;
						success();
						complete();

						script.onload = script.onreadystatechange = null;
						head.removeChild( script );
					}
				};
			}

			head.appendChild(script);

			return undefined;
		}

		var requestDone = false;

		var xhr = s.xhr();

		if( s.username )
			xhr.open(type, s.url, s.async, s.username, s.password);
		else
			xhr.open(type, s.url, s.async);

		try {
			if ( s.data )
				xhr.setRequestHeader("Content-Type", s.contentType);

			if ( s.ifModified )
				xhr.setRequestHeader("If-Modified-Since",
					jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT" );

			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e){}

		if ( s.beforeSend && s.beforeSend(xhr, s) === false ) {
			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
			xhr.abort();
			return false;
		}

		if ( s.global )
			jQuery.event.trigger("ajaxSend", [xhr, s]);

		var onreadystatechange = function(isTimeout){
			if (xhr.readyState == 0) {
				if (ival) {
					clearInterval(ival);
					ival = null;
					if ( s.global && ! --jQuery.active )
						jQuery.event.trigger( "ajaxStop" );
				}
			} else if ( !requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout") ) {
				requestDone = true;

				if (ival) {
					clearInterval(ival);
					ival = null;
				}

				status = isTimeout == "timeout" ? "timeout" :
					!jQuery.httpSuccess( xhr ) ? "error" :
					s.ifModified && jQuery.httpNotModified( xhr, s.url ) ? "notmodified" :
					"success";

				if ( status == "success" ) {
					try {
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch(e) {
						status = "parsererror";
					}
				}

				if ( status == "success" ) {
					var modRes;
					try {
						modRes = xhr.getResponseHeader("Last-Modified");
					} catch(e) {} // swallow exception thrown by FF if header is not available

					if ( s.ifModified && modRes )
						jQuery.lastModified[s.url] = modRes;

					if ( !jsonp )
						success();
				} else
					jQuery.handleError(s, xhr, status);

				complete();

				if ( isTimeout )
					xhr.abort();

				if ( s.async )
					xhr = null;
			}
		};

		if ( s.async ) {
			var ival = setInterval(onreadystatechange, 13);

			if ( s.timeout > 0 )
				setTimeout(function(){
					if ( xhr && !requestDone )
						onreadystatechange( "timeout" );
				}, s.timeout);
		}

		try {
			xhr.send(s.data);
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
		}

		if ( !s.async )
			onreadystatechange();

		function success(){
			if ( s.success )
				s.success( data, status );

			if ( s.global )
				jQuery.event.trigger( "ajaxSuccess", [xhr, s] );
		}

		function complete(){
			if ( s.complete )
				s.complete(xhr, status);

			if ( s.global )
				jQuery.event.trigger( "ajaxComplete", [xhr, s] );

			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
		}

		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />

		if ( s.error ) s.error( xhr, status, e );

		if ( s.global )
			jQuery.event.trigger( "ajaxError", [xhr, s, e] );
	},

	active: 0,

	httpSuccess: function( xhr ) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		
		try {
			return !xhr.status && location.protocol == "file:" ||
				( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status == 1223;
		} catch(e){}
		return false;
	},

	httpNotModified: function( xhr, url ) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		
		try {
			var xhrRes = xhr.getResponseHeader("Last-Modified");

			return xhr.status == 304 || xhrRes == jQuery.lastModified[url];
		} catch(e){}
		return false;
	},

	httpData: function( xhr, type, s ) {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		
		var ct = xhr.getResponseHeader("content-type"),
			xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.tagName == "parsererror" )
			throw "parsererror";
			
		if( s && s.dataFilter )
			data = s.dataFilter( data, type );

		if( typeof data === "string" ){

			if ( type == "script" )
				jQuery.globalEval( data );

			if ( type == "json" )
				data = window["eval"]("(" + data + ")");
		}
		
		return data;
	},

	param: function( a ) {
		///	<summary>
		///		This method is internal.  Use serialize() instead.
		///	</summary>
		///	<param name="a" type="Map">A map of key/value pairs to serialize into a string.</param>'
		///	<returns type="String" />
		///	<private />
	
		var s = [ ];

		function add( key, value ){
			s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
		};

		if ( jQuery.isArray(a) || a.jquery )
			jQuery.each( a, function(){
				add( this.name, this.value );
			});

		else
			for ( var j in a )
				if ( jQuery.isArray(a[j]) )
					jQuery.each( a[j], function(){
						add( j, this );
					});
				else
					add( j, jQuery.isFunction(a[j]) ? a[j]() : a[j] );

		return s.join("&").replace(/%20/g, "+");
	}

});
var elemdisplay = {},
	timerId,
	fxAttrs = [
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		[ "opacity" ]
	];

function genFx( type, num ){
	var obj = {};
	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function(){
		obj[ this ] = type;
	});
	return obj;
}

jQuery.fn.extend({
	show: function(speed,callback){
		///	<summary>
		///		Show all matched elements using a graceful animation and firing an optional callback after completion.
		///	</summary>
		///	<param name="speed" type="String">A string representing one of three predefined speeds ('slow', 'normal', or 'fast'), or
		///		the number of milliseconds to run the animation</param>
		///	<param name="callback" optional="true" type="Function">A function to be executed whenever the animation completes, once for each animated element.  It should map function callback() such that this is the DOM element being animated.</param>
		///	<returns type="jQuery" />
		
		if ( speed ) {
			return this.animate( genFx("show", 3), speed, callback);
		} else {
			for ( var i = 0, l = this.length; i < l; i++ ){
				var old = jQuery.data(this[i], "olddisplay");
				
				this[i].style.display = old || "";
				
				if ( jQuery.css(this[i], "display") === "none" ) {
					var tagName = this[i].tagName, display;
					
					if ( elemdisplay[ tagName ] ) {
						display = elemdisplay[ tagName ];
					} else {
						var elem = jQuery("<" + tagName + " />").appendTo("body");
						
						display = elem.css("display");
						if ( display === "none" )
							display = "block";
						
						elem.remove();
						
						elemdisplay[ tagName ] = display;
					}
					
					jQuery.data(this[i], "olddisplay", display);
				}
			}

			for ( var i = 0, l = this.length; i < l; i++ ){
				this[i].style.display = jQuery.data(this[i], "olddisplay") || "";
			}
			
			return this;
		}
	},

	hide: function(speed,callback){
		///	<summary>
		///		Hides all matched elements using a graceful animation and firing an optional callback after completion.
		///	</summary>
		///	<param name="speed" type="String">A string representing one of three predefined speeds ('slow', 'normal', or 'fast'), or
		///		the number of milliseconds to run the animation</param>
		///	<param name="callback" optional="true" type="Function">A function to be executed whenever the animation completes, once for each animated element.  It should map function callback() such that this is the DOM element being animated.</param>
		///	<returns type="jQuery" />
	
		if ( speed ) {
			return this.animate( genFx("hide", 3), speed, callback);
		} else {
			for ( var i = 0, l = this.length; i < l; i++ ){
				var old = jQuery.data(this[i], "olddisplay");
				if ( !old && old !== "none" )
					jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
			}

			for ( var i = 0, l = this.length; i < l; i++ ){
				this[i].style.display = "none";
			}

			return this;
		}
	},

	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ){
		///	<summary>
		///		Toggles displaying each of the set of matched elements.
		///	</summary>
		///	<returns type="jQuery" />
		
		var bool = typeof fn === "boolean";

		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle.apply( this, arguments ) :
			fn == null || bool ?
				this.each(function(){
					var state = bool ? fn : jQuery(this).is(":hidden");
					jQuery(this)[ state ? "show" : "hide" ]();
				}) :
				this.animate(genFx("toggle", 3), fn, fn2);
	},

	fadeTo: function(speed,to,callback){
		///	<summary>
		///		Fades the opacity of all matched elements to a specified opacity.
		///	</summary>
		///	<param name="speed" type="String">A string representing one of three predefined speeds ('slow', 'normal', or 'fast'), or
		///		the number of milliseconds to run the animation</param>
		///	<param name="callback" optional="true" type="Function">A function to be executed whenever the animation completes, once for each animated element.  It should map function callback() such that this is the DOM element being animated.</param>
		///	<returns type="jQuery" />
		return this.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		///	<summary>
		///		A function for making custom animations.
		///	</summary>
		///	<param name="prop" type="Options">A set of style attributes that you wish to animate and to what end.</param>
		///	<param name="speed" optional="true" type="String">A string representing one of three predefined speeds ('slow', 'normal', or 'fast'), or
		///		the number of milliseconds to run the animation</param>
		///	<param name="easing" optional="true" type="String">The name of the easing effect that you want to use.  There are two built-in values, 'linear' and 'swing'.</param>
		///	<param name="callback" optional="true" type="Function">A function to be executed whenever the animation completes, once for each animated element.  It should map function callback() such that this is the DOM element being animated.</param>
		///	<returns type="jQuery" />

		var optall = jQuery.speed(speed, easing, callback);

		return this[ optall.queue === false ? "each" : "queue" ](function(){
		
			var opt = jQuery.extend({}, optall), p,
				hidden = this.nodeType == 1 && jQuery(this).is(":hidden"),
				self = this;
	
			for ( p in prop ) {
				if ( prop[p] == "hide" && hidden || prop[p] == "show" && !hidden )
					return opt.complete.call(this);

				if ( ( p == "height" || p == "width" ) && this.style ) {
					opt.display = jQuery.css(this, "display");

					opt.overflow = this.style.overflow;
				}
			}

			if ( opt.overflow != null )
				this.style.overflow = "hidden";

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function(name, val){
				var e = new jQuery.fx( self, opt, name );

				if ( /toggle|show|hide/.test(val) )
					e[ val == "toggle" ? hidden ? "show" : "hide" : val ]( prop );
				else {
					var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat(parts[2]),
							unit = parts[3] || "px";

						if ( unit != "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						if ( parts[1] )
							end = ((parts[1] == "-=" ? -1 : 1) * end) + start;

						e.custom( start, end, unit );
					} else
						e.custom( start, val, "" );
				}
			});

			return true;
		});
	},

	stop: function(clearQueue, gotoEnd){
		///	<summary>
		///		Stops all currently animations on the specified elements.
		///	</summary>
		///	<param name="clearQueue" optional="true" type="Boolean">True to clear animations that are queued to run.</param>
		///	<param name="gotoEnd" optional="true" type="Boolean">True to move the element value to the end of its animation target.</param>
		///	<returns type="jQuery" />
		
		var timers = jQuery.timers;

		if (clearQueue)
			this.queue([]);

		this.each(function(){
			for ( var i = timers.length - 1; i >= 0; i-- )
				if ( timers[i].elem == this ) {
					if (gotoEnd)
						timers[i](true);
					timers.splice(i, 1);
				}
		});

		if (!gotoEnd)
			this.dequeue();

		return this;
	}

});



jQuery.fn.slideDown = function( speed, callback ){
	///	<summary>
	///		Reveal all matched elements by adjusting their height.
	///	</summary>
	///	<param name="speed" type="String">A string representing one of three predefined speeds ('slow', 'normal', or 'fast'), or
	///		the number of milliseconds to run the animation</param>
	///	<param name="callback" optional="true" type="Function">A function to be executed whenever the animation completes, once for each animated element.  It should map function callback() such that this is the DOM element being animated.</param>
	///	<returns type="jQuery" />
	return this.animate( genFx("show", 1), speed, callback );
};

jQuery.fn.slideUp = function( speed, callback ){
	///	<summary>
	///		Hiding all matched elements by adjusting their height.
	///	</summary>
	///	<param name="speed" type="String">A string representing one of three predefined speeds ('slow', 'normal', or 'fast'), or
	///		the number of milliseconds to run the animation</param>
	///	<param name="callback" optional="true" type="Function">A function to be executed whenever the animation completes, once for each animated element.  It should map function callback() such that this is the DOM element being animated.</param>
	///	<returns type="jQuery" />
	return this.animate( genFx("hide", 1), speed, callback );
};

jQuery.fn.slideToggle = function( speed, callback ){
	///	<summary>
	///		Toggles the visibility of all matched elements by adjusting their height.
	///	</summary>
	///	<param name="speed" type="String">A string representing one of three predefined speeds ('slow', 'normal', or 'fast'), or
	///		the number of milliseconds to run the animation</param>
	///	<param name="callback" optional="true" type="Function">A function to be executed whenever the animation completes, once for each animated element.  It should map function callback() such that this is the DOM element being animated.</param>
	///	<returns type="jQuery" />
	return this.animate( genFx("toggle", 1), speed, callback );
};

jQuery.fn.fadeIn = function( speed, callback ){
	///	<summary>
	///		Fades in all matched elements by adjusting their opacity.
	///	</summary>
	///	<param name="speed" type="String">A string representing one of three predefined speeds ('slow', 'normal', or 'fast'), or
	///		the number of milliseconds to run the animation</param>
	///	<param name="callback" optional="true" type="Function">A function to be executed whenever the animation completes, once for each animated element.  It should map function callback() such that this is the DOM element being animated.</param>
	///	<returns type="jQuery" />
	return this.animate( { opacity: "show" }, speed, callback );
};

jQuery.fn.fadeOut = function( speed, callback ){
	///	<summary>
	///		Fades the opacity of all matched elements to a specified opacity.
	///	</summary>
	///	<param name="speed" type="String">A string representing one of three predefined speeds ('slow', 'normal', or 'fast'), or
	///		the number of milliseconds to run the animation</param>
	///	<param name="callback" optional="true" type="Function">A function to be executed whenever the animation completes, once for each animated element.  It should map function callback() such that this is the DOM element being animated.</param>
	///	<returns type="jQuery" />
	return this.animate( { opacity: "hide" }, speed, callback );
};

jQuery.extend({

	speed: function(speed, easing, fn) {
		///	<summary>
		///		This member is internal.
		///	</summary>
		///	<private />
		var opt = typeof speed === "object" ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

		opt.old = opt.complete;
		opt.complete = function(){
			if ( opt.queue !== false )
				jQuery(this).dequeue();
			if ( jQuery.isFunction( opt.old ) )
				opt.old.call( this );
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
   		///	<summary>
   		///		This member is internal.
			///	</summary>
   		///	<private />
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
   		///	<summary>
   		///		This member is internal.
			///	</summary>
   		///	<private />
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ){
		///	<summary>
		///		This member is internal.
		///	</summary>
		///	<private />
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig )
			options.orig = {};
	}

});

jQuery.fx.prototype = {

	update: function(){
		///	<summary>
		///		This member is internal.
		///	</summary>
		///	<private />
		if ( this.options.step )
			this.options.step.call( this.elem, this.now, this );

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		if ( ( this.prop == "height" || this.prop == "width" ) && this.elem.style )
			this.elem.style.display = "block";
	},

	cur: function(force){
		///	<summary>
		///		This member is internal.
		///	</summary>
		///	<private />
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) )
			return this.elem[ this.prop ];

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	custom: function(from, to, unit){
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t(gotoEnd){
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(function(){
				var timers = jQuery.timers;

				for ( var i = 0; i < timers.length; i++ )
					if ( !timers[i]() )
						timers.splice(i--, 1);

				if ( !timers.length ) {
					clearInterval( timerId );
					timerId = undefined;
				}
			}, 13);
		}
	},

	show: function(){
		///	<summary>
		///		Displays each of the set of matched elements if they are hidden.
		///	</summary>
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.show = true;

		this.custom(this.prop == "width" || this.prop == "height" ? 1 : 0, this.cur());

		jQuery(this.elem).show();
	},

	hide: function(){
		///	<summary>
		///		Hides each of the set of matched elements if they are shown.
		///	</summary>

		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.hide = true;

		this.custom(this.cur(), 0);
	},

	step: function(gotoEnd){
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		var t = now();

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim )
				if ( this.options.curAnim[i] !== true )
					done = false;

			if ( done ) {
				if ( this.options.display != null ) {
					this.elem.style.overflow = this.options.overflow;

					this.elem.style.display = this.options.display;
					if ( jQuery.css(this.elem, "display") == "none" )
						this.elem.style.display = "block";
				}

				if ( this.options.hide )
					jQuery(this.elem).hide();

				if ( this.options.hide || this.options.show )
					for ( var p in this.options.curAnim )
						jQuery.attr(this.elem.style, p, this.options.orig[p]);
					
				this.options.complete.call( this.elem );
			}

			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			this.update();
		}

		return true;
	}

};

jQuery.extend( jQuery.fx, {
	speeds:{
		slow: 600,
 		fast: 200,
 		_default: 400
	},
	step: {

		opacity: function(fx){
			jQuery.attr(fx.elem.style, "opacity", fx.now);
		},

		_default: function(fx){
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null )
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			else
				fx.elem[ fx.prop ] = fx.now;
		}
	}
});
if ( document.documentElement["getBoundingClientRect"] )
	jQuery.fn.offset = function() {
		///	<summary>
		///		Gets the current offset of the first matched element relative to the viewport.
		///	</summary>
		///	<returns type="Object">An object with two Integer properties, 'top' and 'left'.</returns>
		if ( !this[0] ) return { top: 0, left: 0 };
		if ( this[0] === this[0].ownerDocument.body ) return jQuery.offset.bodyOffset( this[0] );
		var box  = this[0].getBoundingClientRect(), doc = this[0].ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jQuery.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jQuery.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;
		return { top: top, left: left };
	};
else 
	jQuery.fn.offset = function() {
		///	<summary>
		///		Gets the current offset of the first matched element relative to the viewport.
		///	</summary>
		///	<returns type="Object">An object with two Integer properties, 'top' and 'left'.</returns>
		if ( !this[0] ) return { top: 0, left: 0 };
		if ( this[0] === this[0].ownerDocument.body ) return jQuery.offset.bodyOffset( this[0] );
		jQuery.offset.initialized || jQuery.offset.initialize();

		var elem = this[0], offsetParent = elem.offsetParent, prevOffsetParent = elem,
			doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView.getComputedStyle(elem, null),
			top = elem.offsetTop, left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			computedStyle = defaultView.getComputedStyle(elem, null);
			top -= elem.scrollTop, left -= elem.scrollLeft;
			if ( elem === offsetParent ) {
				top += elem.offsetTop, left += elem.offsetLeft;
				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.tagName)) )
					top  += parseInt( computedStyle.borderTopWidth,  10) || 0,
					left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
				prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
			}
			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" )
				top  += parseInt( computedStyle.borderTopWidth,  10) || 0,
				left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" )
			top  += body.offsetTop,
			left += body.offsetLeft;

		if ( prevComputedStyle.position === "fixed" )
			top  += Math.max(docElem.scrollTop, body.scrollTop),
			left += Math.max(docElem.scrollLeft, body.scrollLeft);

		return { top: top, left: left };
	};

jQuery.offset = {
	initialize: function() {
		if ( this.initialized ) return;
		var body = document.body, container = document.createElement('div'), innerDiv, checkDiv, table, td, rules, prop, bodyMarginTop = body.style.marginTop,
			html = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"cellpadding="0"cellspacing="0"><tr><td></td></tr></table>';

		rules = { position: 'absolute', top: 0, left: 0, margin: 0, border: 0, width: '1px', height: '1px', visibility: 'hidden' };
		for ( prop in rules ) container.style[prop] = rules[prop];

		container.innerHTML = html;
		body.insertBefore(container, body.firstChild);
		innerDiv = container.firstChild, checkDiv = innerDiv.firstChild, td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		innerDiv.style.overflow = 'hidden', innerDiv.style.position = 'relative';
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		body.style.marginTop = '1px';
		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop === 0);
		body.style.marginTop = bodyMarginTop;

		body.removeChild(container);
		this.initialized = true;
	},

	bodyOffset: function(body) {
		jQuery.offset.initialized || jQuery.offset.initialize();
		var top = body.offsetTop, left = body.offsetLeft;
		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset )
			top  += parseInt( jQuery.curCSS(body, 'marginTop',  true), 10 ) || 0,
			left += parseInt( jQuery.curCSS(body, 'marginLeft', true), 10 ) || 0;
		return { top: top, left: left };
	}
};


jQuery.fn.extend({
	position: function() {
		///	<summary>
		///		Gets the top and left positions of an element relative to its offset parent.
		///	</summary>
		///	<returns type="Object">An object with two integer properties, 'top' and 'left'.</returns>
		var left = 0, top = 0, results;

		if ( this[0] ) {
			var offsetParent = this.offsetParent(),

			offset       = this.offset(),
			parentOffset = /^body|html$/i.test(offsetParent[0].tagName) ? { top: 0, left: 0 } : offsetParent.offset();

			offset.top  -= num( this, 'marginTop'  );
			offset.left -= num( this, 'marginLeft' );

			parentOffset.top  += num( offsetParent, 'borderTopWidth'  );
			parentOffset.left += num( offsetParent, 'borderLeftWidth' );

			results = {
				top:  offset.top  - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		}

		return results;
	},

	offsetParent: function() {
		///	<summary>
		///		This method is internal.
		///	</summary>
		///	<private />
		var offsetParent = this[0].offsetParent || document.body;
		while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && jQuery.css(offsetParent, 'position') == 'static') )
			offsetParent = offsetParent.offsetParent;
		return jQuery(offsetParent);
	}
});


jQuery.each( ['Left'], function(i, name) {
	var method = 'scroll' + name;
	
	jQuery.fn[ method ] = function(val) {
		///	<summary>
		///		Gets and optionally sets the scroll left offset of the first matched element.
		///	</summary>
		///	<param name="val" type="Number" integer="true" optional="true">A positive number representing the desired scroll left offset.</param>
		///	<returns type="Number" integer="true">The scroll left offset of the first matched element.</returns>
		if (!this[0]) return null;

		return val !== undefined ?

			this.each(function() {
				this == window || this == document ?
					window.scrollTo(
						!i ? val : jQuery(window).scrollLeft(),
						 i ? val : jQuery(window).scrollTop()
					) :
					this[ method ] = val;
			}) :

			this[0] == window || this[0] == document ?
				self[ i ? 'pageYOffset' : 'pageXOffset' ] ||
					jQuery.boxModel && document.documentElement[ method ] ||
					document.body[ method ] :
				this[0][ method ];
	};
});

jQuery.each( ['Top'], function(i, name) {
	var method = 'scroll' + name;
	
	jQuery.fn[ method ] = function(val) {
		///	<summary>
		///		Gets and optionally sets the scroll top offset of the first matched element.
		///	</summary>
		///	<param name="val" type="Number" integer="true" optional="true">A positive number representing the desired scroll top offset.</param>
		///	<returns type="Number" integer="true">The scroll top offset of the first matched element.</returns>
		if (!this[0]) return null;

		return val !== undefined ?

			this.each(function() {
				this == window || this == document ?
					window.scrollTo(
						!i ? val : jQuery(window).scrollLeft(),
						 i ? val : jQuery(window).scrollTop()
					) :
					this[ method ] = val;
			}) :

			this[0] == window || this[0] == document ?
				self[ i ? 'pageYOffset' : 'pageXOffset' ] ||
					jQuery.boxModel && document.documentElement[ method ] ||
					document.body[ method ] :
				this[0][ method ];
	};
});

jQuery.each([ "Height" ], function(i, name){

	var tl = i ? "Left"  : "Top",  // top or left
		br = i ? "Right" : "Bottom", // bottom or right
		lower = name.toLowerCase();

	jQuery.fn["inner" + name] = function(){
		///	<summary>
		///		Gets the inner height of the first matched element, excluding border but including padding.
		///	</summary>
		///	<returns type="Number" integer="true">The outer height of the first matched element.</returns>
		return this[0] ?
			jQuery.css( this[0], lower, false, "padding" ) :
			null;
	};

	jQuery.fn["outer" + name] = function(margin) {
		///	<summary>
		///		Gets the outer height of the first matched element, including border and padding by default.
		///	</summary>
		///	<param name="margins" type="Map">A set of key/value pairs that specify the options for the method.</param>
		///	<returns type="Number" integer="true">The outer height of the first matched element.</returns>
		return this[0] ?
			jQuery.css( this[0], lower, false, margin ? "margin" : "border" ) :
			null;
	};
	
	var type = name.toLowerCase();

	jQuery.fn[ type ] = function( size ) {
		///	<summary>
		///		Set the CSS height of every matched element. If no explicit unit
		///		was specified (like 'em' or '%') then &quot;px&quot; is added to the width.  If no parameter is specified, it gets
		///		the current computed pixel height of the first matched element.
		///		Part of CSS
		///	</summary>
		///	<returns type="jQuery" type="jQuery" />
		///	<param name="cssProperty" type="String">
		///		Set the CSS property to the specified value. Omit to get the value of the first matched element.
		///	</param>

		return this[0] == window ?
			document.compatMode == "CSS1Compat" && document.documentElement[ "client" + name ] ||
			document.body[ "client" + name ] :

			this[0] == document ?
				Math.max(
					document.documentElement["client" + name],
					document.body["scroll" + name], document.documentElement["scroll" + name],
					document.body["offset" + name], document.documentElement["offset" + name]
				) :

				size === undefined ?
					(this.length ? jQuery.css( this[0], type ) : null) :

					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});

jQuery.each([ "Width" ], function(i, name){

	var tl = i ? "Left"  : "Top",  // top or left
		br = i ? "Right" : "Bottom", // bottom or right
		lower = name.toLowerCase();

	jQuery.fn["inner" + name] = function(){
		///	<summary>
		///		Gets the inner width of the first matched element, excluding border but including padding.
		///	</summary>
		///	<returns type="Number" integer="true">The outer width of the first matched element.</returns>
		return this[0] ?
			jQuery.css( this[0], lower, false, "padding" ) :
			null;
	};

	jQuery.fn["outer" + name] = function(margin) {
		///	<summary>
		///		Gets the outer width of the first matched element, including border and padding by default.
		///	</summary>
		///	<param name="margins" type="Map">A set of key/value pairs that specify the options for the method.</param>
		///	<returns type="Number" integer="true">The outer width of the first matched element.</returns>
		return this[0] ?
			jQuery.css( this[0], lower, false, margin ? "margin" : "border" ) :
			null;
	};
	
	var type = name.toLowerCase();

	jQuery.fn[ type ] = function( size ) {
		///	<summary>
		///		Set the CSS width of every matched element. If no explicit unit
		///		was specified (like 'em' or '%') then &quot;px&quot; is added to the width.  If no parameter is specified, it gets
		///		the current computed pixel width of the first matched element.
		///		Part of CSS
		///	</summary>
		///	<returns type="jQuery" type="jQuery" />
		///	<param name="cssProperty" type="String">
		///		Set the CSS property to the specified value. Omit to get the value of the first matched element.
		///	</param>

		return this[0] == window ?
			document.compatMode == "CSS1Compat" && document.documentElement[ "client" + name ] ||
			document.body[ "client" + name ] :

			this[0] == document ?
				Math.max(
					document.documentElement["client" + name],
					document.body["scroll" + name], document.documentElement["scroll" + name],
					document.body["offset" + name], document.documentElement["offset" + name]
				) :

				size === undefined ?
					(this.length ? jQuery.css( this[0], type ) : null) :

					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});
})();

(function(window, Sys) {

if (!Sys || !Sys.loader) {
var merge = function _merge(target) {
    target = target || {};
    foreach(arguments, function(o) {
        if (o) {
            forIn(o, function(v, n) {
                target[n] = v;
            });
        }
    }, 1);
    return target;
}
var forIn = function _forIn(obj, callback) {
    for (var x in obj) {
        callback(obj[x], x);
    }
}
var foreach = function _foreach(arr, callback, start) {
    var cancelled;
    if (arr) {
        arr = arr instanceof Array || 
            (typeof(arr.length) === 'number' && (typeof(arr.callee) === "function" || (arr.item && typeof(arr.nodeType) === "undefined") && !arr.addEventListener && !arr.attachEvent))
            ? arr : [arr];
        for (var i = start||0, l = arr.length; i < l; i++) {
            if (callback(arr[i], i)) {
                cancelled = true;
                break;
            }
        }
    }
    return !cancelled;
}
var callIf = function _callIf(obj, name, args) {
    var fn = obj[name],
        exists = typeof(fn) === "function";
    if (exists) fn.call(obj, args);
    return exists;
}
    function append(target) {
        target = target || {};
        foreach(arguments, function(o) {
            if (o) {
                forIn(o, function(v, n) {
                    if (typeof(target[n]) === "undefined") target[n] = v;
                });
            }
        }, 1);
        return target;
    }

    var attachEvent = !!document.attachEvent;
  
    var notLoading = 0,
        loading = 1,
        loadingCo = 2,
        loaded = 3,
        autoToken = {};

    function foreachScriptInfo(arr, callback) {
        var cancelled;
        if (arr) {
            for (var i = 0, l = arr.length; i < l; i++) {
                if (callback(getScriptInfo(arr[i]))) {
                    cancelled = true;
                    break;
                }
            }
        }
        return !cancelled;
    }
    function toIndex(arr) {
        var obj = {};
        foreach(arr, function(name) {
            obj[name] = true;
        });
        return obj;
    }
    function contains(source, item) {
        for (var i = 0, l = source.length; i < l; i++) {
            if (source[i] === item) return true;
        }
        return false;
    }
    function getCompositeDependencies(composite, executionDependencies) {
        var dependencies = [];
        foreachScriptInfo(composite.contains, function(scriptInfo) {
            foreach(lazyget(scriptInfo, executionDependencies ? "executionDependencies" : "dependencies"), function(name) {
                if (!composite._contains[name]) dependencies.push(name);
            });
        });
        return dependencies;
    }
    function getDependencies(scriptInfo, executionDependencies) {
        var dependencies;
        if (scriptInfo.contains) {
            dependencies = getCompositeDependencies(scriptInfo, executionDependencies);
        }
        else {
            var composite = getComposite(scriptInfo);
            if (composite) {
                dependencies = getCompositeDependencies(composite, executionDependencies);
            }
            else {
                dependencies = lazyget(scriptInfo, executionDependencies ? "executionDependencies" : "dependencies");
            }
        }
        return dependencies;
    }
    function requireParents(scriptInfo) {
        forIn(scriptInfo["_parents"], function(parentInfo) {
            forIn(parentInfo["_composites"], function(composite) {
                requireScript(composite, null, null, true);
            });
            requireScript(parentInfo, null, null, true);
        });
    }
    function getScriptInfo(name) {
        return resolveScriptInfo(name) || (Sys.scripts[name] = { name: name });
    }
    function requireScript(scriptInfo, callback, session, readOnly) {
        return Sys.loader._requireScript(scriptInfo, callback, session, readOnly);
    }
    function requireAll(scriptInfos, callback, session, readOnly) {
        var waiting;
        foreach(scriptInfos, function(dependency) {
            dependency = resolveScriptInfo(dependency);
            waiting |= requireScript(dependency, callback, session, readOnly);
        });
        return waiting;
    }
    function resolveScriptInfo(nameOrScriptInfo, onlyScripts) {
        var info = typeof(nameOrScriptInfo) === "string" ?
                Sys.scripts[nameOrScriptInfo] ||
                Sys.composites[nameOrScriptInfo] ||
                (!onlyScripts && (lazyget(Sys.components[nameOrScriptInfo], "script") || lazyget(Sys.plugins[nameOrScriptInfo], "script"))) :
            (nameOrScriptInfo ? (nameOrScriptInfo.script || nameOrScriptInfo) : null);
        if (info && !info._isScript) {
            info = null;
        }
        return info;
    }
    function state(scriptInfo, newState) {
        var ret = (scriptInfo._state = newState || scriptInfo._state) || 0;
        if (newState) {
            foreachScriptInfo(scriptInfo.contains, function(scriptInfo) {
                state(scriptInfo, newState);
            });
        }
        return ret;
    }
    function getComposite(scriptInfo) {
        return scriptInfo._composite;
    }
    function isLoaded(scriptInfo) {
        return !scriptInfo || (state(scriptInfo) > loadingCo);
    }
    function getAndDelete(obj, field) {
        var r = obj[field];
        delete obj[field];
        return r;
    }
    function foreachCall(obj, field, args) {
        foreach(getAndDelete(obj, field), function(callback) {
            callback.apply(null, args||[]);
        });
    }
    function lazyget(obj, name, value) {
        return obj ? (obj[name] = obj[name] || value) : value;
    }
    function lazypush(obj, name, value) {
        lazyget(obj, name, []).push(value);
    }
    function lazyset(obj, name, key, value) {
        lazyget(obj, name, {})[key] = value;
    }
    function all(tag, element) {
        return (element||document).getElementsByTagName(tag);
    }
    function createElement(tag) {
        return document.createElement(tag);
    }
    function listenOnce(target, name, ieName, callback, isReadyState, isScript) {
        function onEvent() {
            if (!attachEvent || !isReadyState || /loaded|complete/.test(target.readyState)) {
                if (attachEvent) {
                    target.detachEvent(ieName || ("on" + name), onEvent);
                }
                else {
                    target.removeEventListener(name, onEvent, false);
                    if (isScript) {
                        target.removeEventListener("error", onEvent, false);
                    }
                }
                callback.apply(target);
                target = null;
            }
        }
        if (attachEvent) {
            target.attachEvent(ieName || ("on" + name), onEvent);
        }
        else {
            if (target.addEventListener) {
            target.addEventListener(name, onEvent, false);
            }
            if (isScript) {
                target.addEventListener("error", onEvent, false);
            }
        }
    }
    function raiseDomReady() {
        if (Sys._domReady) {
            Sys._2Pass(getAndDelete(Sys, "_domReadyQueue"));
        }
    }
    function raiseOnReady() {
        var ready = Sys._ready;
        if (!ready && Sys._domReady && !(Sys.loader && Sys.loader._loading)) {
            Sys._ready = ready = true;
        }
        if (ready) {
            Sys._2Pass(getAndDelete(Sys, "_readyQueue"));
        }
    }
    window.Sys = Sys = append(Sys, {
        version: [3, 0, 31106, 0],
        __namespace: true,
        debug: true,
        scripts: {},
        activateDom: true,
        composites: {},
        components: {},
        plugins: {},
        create: {},
        converters: {},
        _domLoaded: function _domLoaded() {
            if (Sys._domChecked) return;
            Sys._domChecked = true;
            function domReady() {
                if (!Sys._domReady) {
                    Sys._domReady = true;
                    var autoRequire = Sys._autoRequire;
                    if (autoRequire) {
                        Sys.require(autoRequire, function() {
                            Sys._autoRequire = null;
                            foreachCall(Sys, "_autoQueue");
                        }, autoToken);
                    }
                    raiseDomReady();
                    raiseOnReady();
                }
            }
            listenOnce(window, "load", null, domReady);

            var check;
            if (attachEvent) {
                if ((window == window.top) && document.documentElement.doScroll) {
                    var timeout, er, el = createElement("div");
                    check = function() {
                        try {
                            el.doScroll("left");
                        }
                        catch (er) {
                            timeout = window.setTimeout(check, 0);
                            return;
                        }
                        el = null;
                        domReady();
                    }
                    check();
                }
                else {
                    listenOnce(document, null, "onreadystatechange", domReady, true);
                }
            }
            else if (document.addEventListener) {
                listenOnce(document, "DOMContentLoaded", null, domReady);
            }
        },
        _getById: function _getById(found, id, single, includeSelf, element, filter) {
            if (element) {
                if (includeSelf && (element.id === id)) {
                    found.push(element);
                }
                else if (!filter) {
                    foreach(all("*", element), function(element) {
                        if (element.id === id) {
                            found.push(element);
                            return true;
                        }
                    });
                }
            }
            else {
                var e = document.getElementById(id);
                if (e) found.push(e);
            }
            return found.length;
        },
        _getByClass: function _getByClass(found, targetClass, single, includeSelf, element, filter) {
            function pushIfMatch(element) {
                var ret, className = element.className;
                if (className && ((className === targetClass) || (className.indexOf(' ' + targetClass) >= 0) || (className.indexOf(targetClass + ' ') >= 0))) {
                    found.push(element);
                    ret = true;
                }
                return ret;
            }
            var i, l, nodes;
            if (includeSelf && pushIfMatch(element) && single) {
                return true;
            }
            if (!filter) {
                element = element || document;
                var finder = element.querySelectorAll || element.getElementsByClassName;
                if (finder) {
                    if (element.querySelectorAll) targetClass = "." + targetClass;
                    nodes = finder.call(element, targetClass);
                    for (i = 0, l = nodes.length; i < l; i++) {
                        found.push(nodes[i]);
                        if (single) return true;
                    }
                }
                else {
                    nodes = all("*", element);
                    for (i = 0, l = nodes.length; i < l; i++) {
                        if (pushIfMatch(nodes[i]) && single) {
                            return true;
                        }
                    }
                }
            }
        },
        query: function query(selector, context) {
            /// <summary>Queries the DOM for a set of DOM elements.</summary>
            /// <validationOptions enabled="false" />
            /// <param name="selector">Selector for a set of DOM elements based on id (#&lt;id>), class (.&lt;name>), or tag name (&lt;tagname>). Also supports an array of DOM elements or selectors. More complex selectors may be used if jQuery is loaded.</param>
            /// <param name="context" optional="true" mayBeNull="true">A DOM element (exclusive), array of DOM elements (inclusive), or other Sys.ElementSet or Sys.UI.TemplateContext (exclusive) to restrict the search within.</param>
            /// <returns type="Sys.ElementSet">An object representing the set of matching elements.</returns>
            return new Sys.ElementSet(selector, context);
        },
        get: function get(selector, context) {
            /// <summary>Queries the DOM for a single DOM element.</summary>
            /// <validationOptions enabled="false" />
            /// <param name="selector">
            /// Selector for a DOM element based on id (#&lt;id>), class (.&lt;name>), or tag name (&lt;tagname>). More complex selectors may be used if jQuery is loaded.
            /// If multiple elements match the selector, the first one is returned.
            /// </param>
            /// <param name="context" optional="true" mayBeNull="true">An element, array of elements, or Sys.UI.TemplateContext to restrict the query within.</param>
            /// <returns>The matching element, or null if none match.</returns>
            return (context && typeof(context.get) === "function") ?
                context.get(selector) :
                this._find(selector, context, true);
        },
        _find: function _find(selector, context, single, filter) {
            var found = [],
                selectors;
            if (typeof(selector) === "string") {
                selectors = [selector];
            }
            else {
                selectors = selector;
            }
            var includeSelf = context instanceof Array,
                simpleNonTag = /^([\$#\.])((\w|[$:\.\-])+)$/,
                tag = /^((\w+)|\*)$/;
            if ((typeof(context) === "string") || (context instanceof Array)) {
                context = Sys._find(context);
            }
            if (context instanceof Sys.ElementSet) {
                context = context.get();
            }
            foreach(selectors, function(selector) {
                if (typeof(selector) !== "string") {
                    if (filter) {
                        if (contains(context, selector)) {
                            found.push(selector);
                        }
                    }
                    else {
                        found.push(selector);
                    }
                }
                else {
                    var match = simpleNonTag.exec(selector);
                    if (match && match.length === 4) {
                        selector = match[2];
                        var type = match[1];
                        if (type === "$") {
                            Sys._getComponent(found, selector, context);
                        }
                        else {
                            var finder = type === "#" ? Sys._getById : Sys._getByClass;
                            if (context) {
                                foreach(context, function(node) {
                                    if (node.nodeType === 1) {
                                        return finder(found, selector, single, includeSelf, node, filter);
                                    }
                                });
                            }
                            else {
                                finder(found, selector, single);
                            }
                        }
                    }
                    else if (tag.test(selector)) {
                        if (context instanceof Array) {
                            foreach(context, function(node) {
                                if (node.nodeType === 1) {
                                    if (includeSelf && (selector === "*" || (node.tagName.toLowerCase() === selector))) {
                                        found.push(node);
                                        if (single) return true;
                                    }
                                    if (!filter) {
                                        if(!foreach(all(selector, node), function(node) {
                                            found.push(node);
                                            if (single) return true;
                                        })) {
                                            return true;
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            var nodes = all(selector, context);
                            if (single) {
                                if (nodes[0]) {
                                    found.push(nodes[0]);
                                }
                                return true;
                            }
                            foreach(nodes, function(node) {
                                found.push(node);
                            });
                        }
                    }
                    else if (window.jQuery) {
                        if (!filter) {
                            found.push.apply(found, jQuery(selector, context).get());
                        }
                        if (includeSelf) {
                            found.push.apply(found, jQuery(context).filter(selector).get());
                        }
                    }
                }
            });
            return found.length ? (single ? (found[0] || null) : found) : null;
        },
        onDomReady: function onDomReady(callback) {
            /// <summary>Registers a function to be called when the DOM is ready.</summary>
            /// <validationOptions enabled="false" />
            /// <param name="callback" type="Function"></param>
            lazypush(this, "_domReadyQueue", callback);
            raiseDomReady();
        },
        onReady: function onReady(callback) {
            /// <summary>Registers a function to be called when the DOM is ready and when all required resources have been loaded.</summary>
            /// <validationOptions enabled="false" />
            /// <param name="callback" type="Function"></param>
            lazypush(this, "_readyQueue", callback);
            raiseOnReady();
        },
        _onjQuery: function _onjQuery() {
            if (!Sys._jqLoaded) {
                Sys._jqLoaded = true;
                var fn = jQuery.fn,
                    prototype = Sys.ElementSet.prototype;
                fn.components = prototype.components;
                fn.component = prototype.component;
            }
        },
        _set: function(instance, properties) {
            forIn(properties, function(value, field) {
                callIf(instance, "add_" + field, value) ||
                callIf(instance, "set_" + field, value) ||
                (instance[field] = value);
            });
        }
        ,require: function require(features, completedCallback, userContext) {
            /// <summary>
            /// Declares what scripts or script features are required, loads the appropriate script resources, and executes a callback when they are available.
            /// </summary>
            /// <validationOptions enabled="false" />
            /// <param name="features" type="Array">Array of all the required scripts and/or features. [Sys.scripts.foo, Sys.scripts.bar, Sys.components.foo, ...]</param>
            /// <param name="completedCallback" type="Function" optional="true" mayBeNull="true">Optional callback that is called when all the requirements are available.</param>
            /// <param name="userContext" optional="true" mayBeNull="true">Optional context that is passed to the completed callback.</param>
            var session = Sys.loader._session++,
                iterating,
                loaded;
            function raiseCallback() {
                if (completedCallback) {
                    if (Sys._autoRequire && userContext !== autoToken) {
                        lazypush(Sys, "_autoQueue", raiseCallback);
                    }
                    else {
                        Sys.onDomReady(function() { completedCallback(features, userContext) });
                    }
                }
            }
            function allLoaded() {
                
                if (!loaded && !iterating && !iteration()) {
                    loaded = true;
                    raiseCallback();
                }
                raiseOnReady();
            }
            function iteration() {
                iterating = true;
                var resolvedScripts = [];
                foreach(features, function(feature) {
                    feature = resolveScriptInfo(feature);
                    if (feature) {
                        var contains = feature.contains;
                        if (contains) {
                            foreachScriptInfo(contains, function(scriptInfo) {
                                resolvedScripts.push(scriptInfo);
                            });
                        }
                        else {
                            resolvedScripts.push(feature);
                        }
                    }
                });
                if (Sys.loader.combine) {
                    Sys.loader._findComposites(resolvedScripts);
                }
                var waiting = requireAll(resolvedScripts, allLoaded, session);
                iterating = false;
                return waiting;
            }
            allLoaded();
        },
        loadScripts: function loadScripts(scriptUrls, completedCallback, userContext) {
            /// <summary>
            /// Loads the given scripts, and executes a callback when they are available. Ensures each script is not loaded more than once even if one is referenced with a &lt;script&gt; element on the page.
            /// </summary>
            /// <validationOptions enabled="false" />
            /// <param name="scriptUrls" type="Array" elementType="String">Array of all the scripts to load. The scripts are loaded in sequential order.</param>
            /// <param name="completedCallback" type="Function" optional="true" mayBeNull="true">Optional callback that is called when all the scripts are available.</param>
            /// <param name="userContext" optional="true" mayBeNull="true">Optional context that is passed to the completed callback.</param>
            this.loader._loadScripts(scriptUrls, completedCallback, userContext);
        },
        loader: {
            __class: true,
            combine: true,
            basePath: "",
            _loading: 0,
            _session: 0,
            _init: function _init() {
                var scripts = all("script"),
                    selfUrl = scripts.length ? scripts[scripts.length - 1].src : null;
                if (selfUrl) {
                    this.basePath = selfUrl.slice(0, selfUrl.lastIndexOf("/"));
                    var i = selfUrl.lastIndexOf("#"), list;
                    list = ["jQuery"];
                    if (i !== -1) {
                        var args = selfUrl.substr(i+1).split("&");
                        foreach(args, function(pair) {
                            var parts = pair.split("="),
                                name = parts[0],
                                value = parts[1];
                            if (name === "require") {
                                list.push.apply(list, value.split(","));
                            }
                        });
                    }
                    Sys._autoRequire = list;
                }
            },
            _loadSrc: function _loadSrc(src, callback) {
                var script = merge(createElement('script'), {
                        type: 'text/javascript',
                        src: src }),
                    loaded = lazyget(this, "_loadedScripts", {});
                foreach(all("script"), function(script) {
                    var src = script.src;
                    if (src) loaded[src] = true;
                });
                if (loaded[script.src]) {
                    if (callback) callback();
                }
                else {
                    listenOnce(script, "load", "onreadystatechange", callback, true, true);
                    this._loading++;
                    loaded[script.src] = true;
                    all("head")[0].appendChild(script);
                }
            },
            _load: function _load(scriptInfo, callback, session) {
                var waiting;
                if (isLoaded(scriptInfo)) {
                    callback();
                }
                else {
                    waiting = true;
                    var notifyList = lazyget(scriptInfo, "_notify", []),
                        key = "session" + session;
                    if (!notifyList[key]) {
                        notifyList[key] = true;
                        notifyList.push(callback);
                    }
                    if (state(scriptInfo) < loading) {
                        state(scriptInfo, loading);
                        this._loadSrc(this._getUrl(scriptInfo), this._getHandler(scriptInfo));
                    }
                }
                return waiting;
            },            
            _getUrl: function _getUrl(scriptInfo) {
                var debug = Sys.debug,
                    name = scriptInfo.name,
                    path = (debug ? (scriptInfo.debugUrl || scriptInfo.releaseUrl) : scriptInfo.releaseUrl).replace(/\{0\}/, name) || "";
                if (path.substr(0, 2) === "%/") {
                    var basePath = this.basePath,
                        hasSlash = (basePath.charAt(basePath.length-1) === "/");
                    path = basePath + (hasSlash ? "" : "/") + path.substr(2);
                }
                return path;
            },
            _getHandler: function _getHandler(scriptInfo) {
                return function() {
                    Sys.loader._loading--;
                    if (state(scriptInfo) < loadingCo) {
                        state(scriptInfo, loadingCo);
                    }
                    foreachCall(scriptInfo, "_notify");
                    foreachScriptInfo(scriptInfo.contains, function(scriptInfo) {
                        foreachCall(scriptInfo, "_notify");
                    });
                }
            },
            _findComposites: function _findComposites(scripts) {
                var scriptSet = {},
                    compositeMapping = {},
                    foundAny;
                function visit(script) {
                    script = resolveScriptInfo(script);
                    var currentState = state(script);
                    if (currentState < loading && !getComposite(script)) {
                        scriptSet[script.name] = script;
                        foundAny = true;
                        foreach(script["dependencies"], visit);
                    }
                    if (currentState < loaded) {
                        foreach(script["executionDependencies"], visit);
                    }
                }
                foreach(scripts, visit);
                if (foundAny) {
                    forIn(Sys.composites, function(composite) {
                        if (foreachScriptInfo(composite.contains, function(contained) {
                                if (!scriptSet[contained.name]) {
                                    return true;
                                }
                            })) {
                            var offsets = {}, offsetCount = 0;
                            foreach(composite.contains, function(name) {
                                var otherCandidate = compositeMapping[name];
                                if (otherCandidate && !offsets[otherCandidate.name]) {
                                    offsets[otherCandidate.name] = otherCandidate;
                                    offsetCount += otherCandidate.contains.length - 1;
                                }
                            });
                            if (composite.contains.length - 1 > offsetCount) {
                                forIn(offsets, function(offset) {
                                    foreach(offset.contains, function(name) {
                                        delete compositeMapping[name];
                                    });
                                });
                                foreach(composite.contains, function(name) {
                                    compositeMapping[name] = composite;
                                });
                            }
                        }
                    });
                    forIn(compositeMapping, function(composite, name) {
                        Sys.scripts[name]._composite = composite;
                    });
                }
            },
            _loadScripts: function _loadScripts(scriptUrls, completedCallback, userContext) {
                var index = -1, loaded = lazyget(this, "_loadedScripts", {});
                scriptUrls = scriptUrls instanceof Array ? Array.apply(null, scriptUrls) : [scriptUrls];
                function scriptLoaded(first) {
                    if (!first) Sys.loader._loading--;
                    if (++index < scriptUrls.length) {
                        Sys.loader._loadSrc(scriptUrls[index], scriptLoaded);
                    }
                    else {
                        if (completedCallback) {
                            completedCallback(scriptUrls, userContext);
                        }
                        raiseOnReady();
                    }
                }
                scriptLoaded(true);
            },
            _requireScript: function _requireScript(scriptInfo, callback, session, readOnly) {
                var waiting;
                if (!isLoaded(scriptInfo)) {
                    var waitForDeps = requireAll(getDependencies(scriptInfo), callback, session, readOnly),
                        waitForDepsCo = requireAll(getDependencies(scriptInfo, true), callback, session, readOnly);
                    if (!waitForDeps && !waitForDepsCo && state(scriptInfo) === loadingCo) {
                        state(scriptInfo, loaded);
                        foreachCall(scriptInfo, "_callback");
                        if (scriptInfo.name === "jQuery" && window.jQuery) {
                            var loader = Sys.loader;
                            forIn(Sys.components, loader._createPlugin);
                            forIn(Sys.plugins, function(plugin) {
                                loader._createPlugin(plugin, true);
                            });
                            Sys._onjQuery();
                        }
                        if (readOnly) {
                            var contains = scriptInfo.contains;
                            if (contains) {
                                foreachScriptInfo(contains, function(scriptInfo) {
                                    requireParents(scriptInfo);
                                });
                            }
                            else {
                                requireParents(getScriptInfo(scriptInfo));
                            }
                        }
                    }
                    else if (!readOnly && !waitForDeps) {
                        this._load(getComposite(scriptInfo) || scriptInfo, callback, session);
                    }
                    waiting |= (waitForDeps || waitForDepsCo);
                }
                return waiting || !isLoaded(scriptInfo);
            },            
            _registerParents: function _registerParents(scriptInfo) {
                function register(dependency) {
                    var depInfo = getScriptInfo(dependency);
                    lazyset(depInfo, "_parents", scriptInfo.name, scriptInfo);
                }
                foreach(scriptInfo["dependencies"], register);
                foreach(scriptInfo["executionDependencies"], register);
            },
            _createPlugin: function _createPlugin(component, isPlugin) {
                if (window.jQuery) {
                    isPlugin = isPlugin === true;
                    var target, source;
                    if (isPlugin) {
                        target = component.global ? jQuery : (component.dom ? jQuery.fn : null);
                        source = Sys.plugins;
                    }
                    else {
                        target = component._isBehavior ? jQuery.fn : jQuery,
                        source = Sys.components;
                    }
                    if (target) {
                        var name = component.name,
                            fnName = name;
                        if (isPlugin) {
                            fnName = component.functionName || name;
                        }
                        target[fnName] = ((!isPlugin || component.global) ? source[name]._jqQueue : source[name]._jqQueueDom) ||
                            Sys._getCreate(component, isPlugin, true);
                    }
                }
            },
            defineScript: function defineScript(scriptInfo) {
                /// <summary>Defines a script and its dependencies.</summary>
                /// <validationOptions enabled="false" />
                /// <param name="scriptInfo" type="Object">The script to define. You may use the following fields: name (required), debugUrl (string), releaseUrl (string), dependencies (array), executionDependencies (array).</param>
                var scripts = Sys.scripts,
                    name = scriptInfo.name,
                    contains = scriptInfo.contains,
                    loader = this;
                if (contains) {
                    var composites = Sys.composites;
                    composites[name] = scriptInfo = merge(composites[name], scriptInfo);
                    scriptInfo._contains = toIndex(contains);
                    foreachScriptInfo(contains, function(contain) {
                        lazyset(contain, "_composites", name, scriptInfo);
                    });
                }
                else {
                    scriptInfo = scripts[name] = merge(scripts[name], scriptInfo);
                    this._registerParents(scriptInfo);
                    var isBehavior;
                    function registerComponent(component) {
                        var name;
                        if (typeof(component) === "string") {
                            component = { typeName: component };
                        }
                        else {
                            name = component.name;
                        }
                        if (!name) {
                            name = component.typeName;
                            var i = name.lastIndexOf('.');
                            if (i >= 0) {
                                name = name.substr(i+1);
                            }
                            name = name.substr(0, 1).toLowerCase() + name.substr(1);
                            component.name = name;
                        }
                        component._isBehavior = isBehavior;
                        component.script = scriptInfo;
                        var components = Sys.components,
                            entry = components[name] = merge(components[name], component),
                            fn = Sys._getCreate(component),
                            target = isBehavior ? Sys.ElementSet.prototype : Sys.create;
                        target[name] = target[name] || fn;
                        loader._createPlugin(component);
                    }
                    foreach(scriptInfo.components, registerComponent);
                    isBehavior = true;
                    foreach(scriptInfo.behaviors, registerComponent);
                    foreach(scriptInfo.plugins, function(plugin) {
                        var name = plugin.name,
                            fnName = plugin.functionName || name,
                            plugins = Sys.plugins;
                        plugin.script = scriptInfo;
                        plugins[name] = merge(plugins[name], plugin);
                        var target = plugin.global ? Sys :
                                (plugin.dom ? Sys.ElementSet.prototype : 
                                    (plugin.components ? Sys.ComponentSet.prototype : null));
                        if (target) {
                            target[fnName] = target[fnName] || Sys._getCreate(plugin, true);
                        }
                        loader._createPlugin(plugin, true);
                    });
                }
                if (scriptInfo.isLoaded) {
                    scriptInfo._state = loaded;
                }
                scriptInfo._isScript = true;
            },
            defineScripts: function defineScripts(defaultScriptInfo, scriptInfos) {
                /// <summary>Defines a set of script and its dependencies.</summary>
                /// <validationOptions enabled="false" />
                /// <param name="defaultScriptInfo" type="Object">A default set of properties to apply to each defined script.</param>
                /// <param name="scriptInfos" type="Array" elementType="Object">The set of scripts to define. You may define on each: name (required), debugUrl (string), releaseUrl (string), dependencies (array), executionDependencies (array).</param>
                foreach(scriptInfos, function(scriptInfo) {
                    Sys.loader.defineScript(merge(null, defaultScriptInfo, scriptInfo));
                });
            },
            registerScript: function registerScript(name, executionDependencies, executionCallback) {
                /// <summary>Called by a script when it loads and it supports deferred exeuction.</summary>
                /// <validationOptions enabled="false" />
                /// <param name="name" type="String"></param>
                /// <param name="executionDependencies" mayBeNull="true" type="Array" elementType="String"></param>
                /// <param name="executionCallback" type="Function"></param>
                var scriptInfo = getScriptInfo(name);
                scriptInfo._callback = executionCallback;
                var existingList = lazyget(scriptInfo, "executionDependencies", []),
                    existing = toIndex(existingList);
                foreach(executionDependencies, function(executionDependency) {
                    if (!existing[executionDependency]) {
                        existingList.push(executionDependency);
                    }
                });
                this._registerParents(scriptInfo);
                
                state(scriptInfo, loadingCo);
                requireScript(scriptInfo, null, null, true);
            }
        } // loader
    });

    Sys._getComponent = Sys._getComponent || function() { }
    
    Sys._2Pass = Sys._2Pass || function _2Pass(callback) {
       foreach(callback, function(c) { c(); });
    }

    var obj;
    if (!Sys.ElementSet) {
obj = Sys.ElementSet = function(selector, context) {
    /// <summary>Represents a set of DOM elements.</summary>
    /// <param name="selector">The DOM selector, array of DOM selectors, or array of DOM elements to query the document for.</param>
    /// <param name="context">A DOM selector (exclusive), A DOM element (exclusive), array of DOM elements (inclusive), or other Sys.ElementSet (exclusive) to restrict the search within.</param>
    this._elements = ((typeof(context) === "object") && typeof(context.query) === "function") ?
        context.query(selector).get() :
        Sys._find(selector, context) || [];
}
obj.prototype = {
    __class: true,
    components: function(type, index) {
        /// <summary>Gets the set of controls and behaviors associated with the current DOM elements.</summary>
        /// <param name="type" type="Function" mayBeNull="true" optional="true">Type to limit the search to.</param>
        /// <param name="index" type="Number" mayBeNull="true" optional="true">Index of the component to limit to.</param>
        /// <returns type="Sys.ComponentSet" />
        var elementSet = new Sys.ElementSet(this.get());
        if (window.jQuery && (this instanceof jQuery)) {
            elementSet._jquery = this;
        }
        return new Sys.ComponentSet(elementSet, type, index);
    },
    component: function(type, index) {
        /// <summary>Get the first control or behavior associated with the current set of DOM elements.</summary>
        /// <param name="type" type="Function" mayBeNull="true" optional="true">Type to limit the search to.</param>
        /// <param name="index" type="Number" mayBeNull="true" optional="true">Index of the component to return.</param>
        /// <returns type="Object" mayBeNull="true" />
        return this.components(type, index).get(0);
    },
    each: function(callback) {
        /// <summary>Enumerates all the matched elements, calling the given callback for each with the current element as the context.
        /// The callback may return false to cancel enumeration.</summary>
        /// <returns type="Sys.ElementSet"/>
        var elements = this._elements;
        for (var i = 0, l = elements.length; i < l; i++) {
            if (callback.call(elements[i], i) === false) break;
        }
        return this;
    },
    get: function(index) {
        /// <summary>Retrieves the element at the specified index.</summary>
        /// <param name="index" type="Number">The index of the element to retrieve. Omit to return all elements as an array.</param>
        /// <returns isDomElement="true">The element at the given index, or an array of all the matched elements.</returns>
        var elements = this._elements;
        return (typeof(index) === "undefined") ? (Array.apply(null, elements)) : (elements[index] || null);
    },
    find: function(selector) {
        /// <summary>Searches the current set of DOM elements with the given selector, including descendents.</summary>
        /// <param name="selector">DOM selector or array of DOM selectors to search with.</param>
        /// <returns type="Sys.ElementSet">A new element set with the matched elements.</returns>
        return new Sys.ElementSet(selector, this);
    },
    filter: function(selector) {
        /// <summary>Filters the current set of DOM elements by the given selector, excluding descendents.</summary>
        /// <param name="selector">DOM selector or array of elements to filter by.</param>
        /// <returns type="Sys.ElementSet">A new element set with the matched elements.</returns>
        return new Sys.ElementSet(Sys._find(selector, this._elements, false, true));
    }
}
    }
    if (!Sys.ComponentSet) {
obj = Sys.ComponentSet = function ComponentSet(elementSet, query, index) {
    /// <summary></summary>
    /// <param name="elementSet" type="Sys.ElementSet" mayBeNull="true" optional="true"></param>
    /// <param name="query" mayBeNull="true" optional="true">The type of component to filter by, or an array of components to include.</param>
    /// <param name="index" type="Number" mayBeNull="true" optional="true">The index of the component to retrieve from the filtered list.</param>
    this._elementSet = elementSet || (elementSet = new Sys.ElementSet());
    this._components = this._execute(elementSet, query, index);
}
obj.prototype = {
    __class: true,
    setProperties: function ComponentSet$setProperties(properties) {
        /// <summary>Sets properties on the matched components.</summary>
        /// <param name="properties" type="Object" mayBeNull="false">Object with the names and values of the properties to set.</param>
        /// <returns type="Sys.ComponentSet" />
        return this.each(function() {
            Sys._set(this, properties);
        });
    },
    get: function ComponentSet$get(index) {
        /// <summary>Returns the component at the specified index, or an array of all matches if not specified.</summary>
        /// <param name="index" type="Number" mayBeNull="true" optional="true"></param>
        /// <returns type="Object" mayBeNull="true"/>
        var components = this._components;
        return (typeof(index) === "undefined") ? (Array.apply(null, components)) : (components[index || 0] || null);
    },
    each: function ComponentSet$each(callback) {
        /// <summary>Enumerate all the found components. The index of the component are passed as parameters to a callback. You may return 'false' to cancel the enumeration.</summary>
        /// <param name="callback" type="Function" mayBeNull="false">Function called for each component.</param>
        /// <returns type="Sys.ComponentSet" />
        foreach(this._components, function(c, i) {
            if (callback.call(c, i) === false) {
                return true;
            }
        });
        return this;
    },
    elements: function ComponentSet$elements() {
        /// <summary>Returns the underlying set of elements this component collection came from.</summary>
        /// <returns type="Sys.ElementSet" />
        var elements = this._elementSet;
        return elements._jquery || elements;
    },
    _execute: function ComponentSet$_execute(elementSet, query, index) {
        var components = [];
        function match(c) {
            var ctor;
            return (c instanceof query) ||
                ((ctor = c.constructor) && (
                    (ctor === query) ||
                    (ctor.inheritsFrom && ctor.inheritsFrom(query)) ||
                    (ctor.implementsInterface && ctor.implementsInterface(query))));
        }
        if (query instanceof Array) {
            components.push.apply(components, query);
        }
        else {
            elementSet.each(function() {
                var c = this.control;
                if (c && (!query || match(c))) {
                    components.push(c);
                }
                foreach(this._behaviors, function(b) {
                    if (!query || match(b)) {
                        components.push(b);
                    }
                });
            });
        }
        if ((typeof(index) !== "undefined")) {
            if (components[index]) {
                components = [components[index]];
            }
            else {
                components = [];
            }
        }
        return components;
    }
}
obj = Sys._jComponentSet = function() {};
obj.prototype = new Sys.ComponentSet();
obj.prototype.elements = function() {
    /// <summary>Returns the underlying set of elements this component collection came from.</summary>
    /// <returns type="jQuery" />
}
    }
    
    obj = null;
    var getCreate = function _getCreate(options, isPlugin, isjQuery) {
        var body = [],
            arglist = [],
            description = (options && options.description) || 
                          (options.type && ("Creates an instance of the type '" + options.type.getName()  + "' and sets the given properties.")) ||
                          "";
        body.push("/// <summary>", description, "</summary>\n");
        foreach(options && options.parameters, function(parameter) {
            var name = parameter, type = '', desc = '';
            if (typeof(parameter) !== "string") {
                name = parameter.name;
                type = parameter.type||'';
                desc = parameter.description||'';
            }
            arglist.push(name);
            body.push('/// <param name="', name, '"');
            if (type) {
                body.push(' type="', type, '"');
            }
            body.push('>', desc, '</param>\n');
        });
        var returnType;
        if (!isPlugin) {
            arglist.push("properties");
            body.push('/// <param name="properties" type="Object" mayBeNull="true" optional="true">Additional properties to set on the component.</param>\n');
            returnType = (isjQuery ? 'Sys._jComponentSet' : 'Sys.ComponentSet');
        }
        else {
            returnType = options.returnType;
            if (isjQuery && returnType === "Sys.ElementSet") {
                returnType = "jQuery";
            }
        }
        if (returnType) {
            body.push('/// <returns type="', returnType, '" />\n');
        }
        body.push("throw new Error(\"The '", options.name, "' plugin requires Sys.scripts.", options.script.name, " to be loaded with a call to Sys.require() first.\");\n");
        arglist.push(body.join(''));
        return Function.apply(null, arglist);
    }
    Sys._getCreate = Sys._getCreate || getCreate;
obj = Sys.loader;

obj.defineScripts({
    releaseUrl: "%/MicrosoftAjax{0}.js",
    debugUrl: "%/MicrosoftAjax{0}.debug.js",
    executionDependencies: ["Core"]
},
[{ name: "Core",
    executionDependencies: null,
    isLoaded: !!window.Type
},
 { name: "ComponentModel",
   plugins: [{name: "setCommand", dom: true, description: "Causes a DOM element to raise a bubble event when clicked.",
                parameters: [{name: "commandName", description: "The name of the command to raise."},
                             {name: "commandArgument", description: "Optional command argument."},
                             {name: "commandTarget", description: "DOM element from which the command should start bubbling up."}]},
             {name: "addHandler", dom: true, description: "A cross-browser way to add a DOM event handler to an element.",
                parameters: [{name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
                             {name: "handler", type: "Function", description: "The event handler to add."},
                             {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}] },
             {name: "removeHandler", dom: true, description: "A cross-browser way to remove a DOM event handler from an element.",
                parameters: [{name: "eventName", type: "String", description: "The name of the event. Do not include the 'on' prefix, for example, 'click' instead of 'onclick'."},
                             {name: "handler", type: "Function", description: "The event handler to remove."}] },
             {name: "addHandlers", dom: true, description: "Adds a list of event handlers to an element. If a handlerOwner is specified, delegates are created with each of the handlers.",
                parameters: [{name: "events", type: "Object", description: "A dictionary of event handlers."},
                             {name: "handlerOwner", description: "The owner of the event handlers that will be the this pointer for the delegates that will be created from the handlers."},
                             {name: "autoRemove", type: "Boolean", description: "Whether the handler should be removed automatically when the element is disposed of, such as when an UpdatePanel refreshes, or Sys.Application.disposeElement is called."}] },
             {name: "clearHandlers", dom: true, description: "Clears all the event handlers that were added to the element or array of elements." }
   ],
   isLoaded: !!Sys.Component
 },
 { name: "History",
   executionDependencies: ["ComponentModel", "Serialization"],
   isLoaded: !!(Sys.Application && Sys.Application.get_stateString)
 },
 { name: "Serialization",
   isLoaded: !!Sys.Serialization
 },
 { name: "Network",
   executionDependencies: ["Serialization"],
   isLoaded: !!(Sys.Net && Sys.Net.WebRequest)
 },
 { name: "WebServices",
   executionDependencies: ["Network"],
   isLoaded: !!(Sys.Net && Sys.Net.WebServiceProxy)
 },
 { name: "ApplicationServices",
   executionDependencies: ["WebServices"],
   isLoaded: !!(Sys.Services && Sys.Services.RoleService && Sys.Services.RoleService.get_path)
 },
 { name: "Globalization",
   isLoaded: !!Number._parse
 },
 { name: "OpenData",
   executionDependencies: ["DataContext"],
   components: [
        "Sys.Data.OpenDataServiceProxy",
        { typeName: "Sys.Data.OpenDataContext", parameters: [{name: "serviceUri", type: "String"}] }
   ],
   isLoaded: !!(Sys.Data && Sys.Data.OpenDataServiceProxy)
 },
 { name: "DataContext",
   executionDependencies: ["ComponentModel", "Serialization", "WebServices"],
   components: ["Sys.Data.DataContext"],
   isLoaded: !!(Sys.Data && Sys.Data.DataContext)
 },
 { name: "Templates",
   executionDependencies: ["ComponentModel", "Serialization"],
   behaviors: ["Sys.UI.DataView"],
   plugins: [{name: "binding", global: true, parameters: ['target',{name:'property',type:'String'},'source',{name:'path',type:'String'},'options']},
             {name: "binding", dom: true, parameters: [{name:'property',type:'String'},'source',{name:'path',type:'String'},'options']},
             {name: "binding", components: true, parameters: [{name:'property',type:'String'},'source',{name:'path',type:'String'},'options']},
             {name: "activateElements", dom: true, 
                parameters: [{name: "bindingContext", description: "The binding context."}, {name: "recursive", type: "Boolean", description: "Specifies whether processing should occur recursively."}]}],
   isLoaded: !!(Sys.UI && Sys.UI.Template)
 },
 { name: "MicrosoftAjax",
   releaseUrl: "%/MicrosoftAjax.js",
   debugUrl: "%/MicrosoftAjax.debug.js",
   executionDependencies: null,
   contains: ["Core", "ComponentModel", "History", "Serialization", "Network", "WebServices", "Globalization"]
 }
]);

var ajaxPath = (window.location.protocol === "https:" ? "https" : "http") + "://ajax.microsoft.com/ajax/";

obj.defineScripts(null, [
 { name: "jQuery",
   releaseUrl: ajaxPath + "jquery/jquery-1.4.1.min.js",
   debugUrl: ajaxPath + "jquery/jquery-1.4.1.js",
   isLoaded: !!window.jQuery
 },
 { name: "jQueryValidate",
   releaseUrl: ajaxPath + "jquery.validate/1.6/jquery.validate.min.js",
   debugUrl: ajaxPath + "jquery.validate/1.6/jquery.validate.js",
   dependencies: ["jQuery"],
   isLoaded: !!(window.jQuery && jQuery.fn.validate)
 }
]);

obj._init();
if (!window.Type) {
    window.Type = Function;
    Type.registerNamespace = Type.registerNamespace || function registerNamespace(namespacePath) {
        lazypush(Sys, "_ns", namespacePath);
        var rootObject = window;
        foreach(namespacePath.split('.'), function(part) {
            rootObject = rootObject[part] = rootObject[part] || {};
        });
        rootObject = null;
    }
}
if (window.jQuery) {
    Sys._onjQuery();
}
Sys._domLoaded();
}

})(window, window.Sys);


