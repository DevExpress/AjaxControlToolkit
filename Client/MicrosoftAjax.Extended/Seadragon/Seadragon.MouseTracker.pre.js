Type.registerNamespace('Sys.Extended.UI.Seadragon');
Type.registerNamespace('Seadragon'); (function() {

	// DUPLICATION CHECK -- necessary here because of private static state
	if (Seadragon.MouseTracker) {
		return;
	}

	// Constants

	var isIE = Seadragon.Utils.getBrowser() == Seadragon.Browser.IE;

	// Static fields

	var buttonDownAny = false;

	var ieCapturingAny = false;
	var ieTrackersActive = {};      // dictionary from hash to MouseTracker
	var ieTrackersCapturing = [];   // list of trackers interested in capture

	// Static helpers

	function getMouseAbsolute(event) {
		return Seadragon.Utils.getMousePosition(event);
	}

	function getMouseRelative(event, elmt) {
		var mouse = Seadragon.Utils.getMousePosition(event);
		var offset = Seadragon.Utils.getElementPosition(elmt);

		return mouse.minus(offset);
	}

	/**
	* Returns true if elmtB is a child node of elmtA, or if they're equal.
	*/
	function isChild(elmtA, elmtB) {
		var body = document.body;
		while (elmtB && elmtA != elmtB && body != elmtB) {
			try {
				elmtB = elmtB.parentNode;
			} catch (e) {
				// Firefox sometimes fires events for XUL elements, which throws
				// a "permission denied" error. so this is not a child.
				return false;
			}
		}
		return elmtA == elmtB;
	}

	function onGlobalMouseDown() {
		buttonDownAny = true;
	}

	function onGlobalMouseUp() {
		buttonDownAny = false;
	}

	// Static constructor

	(function() {
		// the W3C event model lets us listen to the capture phase of events, so
		// to know if the mouse is globally up or down, we'll listen to the
		// capture phase of the window's events. we can't do this in IE, so
		// we'll give it a best effort by listening to the regular bubble phase,
		// and on the document since window isn't legal in IE for mouse events.
		if (isIE) {
			Seadragon.Utils.addEvent(document, "mousedown", onGlobalMouseDown, false);
			Seadragon.Utils.addEvent(document, "mouseup", onGlobalMouseUp, false);
		} else {
			Seadragon.Utils.addEvent(window, "mousedown", onGlobalMouseDown, true);
			Seadragon.Utils.addEvent(window, "mouseup", onGlobalMouseUp, true);
		}
	})();

	// Class

	Seadragon.MouseTracker = function(elmt, clickTimeThreshold, clickDistThreshold) {

		// Fields

		var self = this;
		var ieSelf = null;

		var hash = Math.random();     // a unique hash for this tracker
		var elmt = Seadragon.Utils.getElement(elmt);

		var tracking = false;
		var capturing = false;
		var buttonDownElmt = false;
		var insideElmt = false;

		var lastPoint = null;           // position of last mouse down/move
		var lastMouseDownTime = null;   // time of last mouse down
		var lastMouseDownPoint = null;  // position of last mouse down
		var clickTimeThreshold = clickTimeThreshold;
		var clickDistThreshold = clickDistThreshold;

		// Properties

		this.target = elmt;
		this.enterHandler = null;       // function(tracker, position, buttonDownElmt, buttonDownAny)
		this.exitHandler = null;        // function(tracker, position, buttonDownElmt, buttonDownAny)
		this.pressHandler = null;       // function(tracker, position)
		this.releaseHandler = null;     // function(tracker, position, insideElmtPress, insideElmtRelease)
		this.clickHandler = null;       // function(tracker, position, quick, shift)
		this.dragHandler = null;        // function(tracker, position, delta, shift)
		

		// Helpers

		function startTracking() {
			if (!tracking) {
				Seadragon.Utils.addEvent(elmt, "mouseover", onMouseOver, false);
				Seadragon.Utils.addEvent(elmt, "mouseout", onMouseOut, false);
				Seadragon.Utils.addEvent(elmt, "mousedown", onMouseDown, false);
				Seadragon.Utils.addEvent(elmt, "mouseup", onMouseUp, false);
				Seadragon.Utils.addEvent(elmt, "click", onMouseClick, false);

				tracking = true;
				ieTrackersActive[hash] = ieSelf;
			}
		}

		function stopTracking() {
			if (tracking) {
				Seadragon.Utils.removeEvent(elmt, "mouseover", onMouseOver, false);
				Seadragon.Utils.removeEvent(elmt, "mouseout", onMouseOut, false);
				Seadragon.Utils.removeEvent(elmt, "mousedown", onMouseDown, false);
				Seadragon.Utils.removeEvent(elmt, "mouseup", onMouseUp, false);
				Seadragon.Utils.removeEvent(elmt, "click", onMouseClick, false);

				releaseMouse();
				tracking = false;
				delete ieTrackersActive[hash];
			}
		}

		function captureMouse() {
			if (!capturing) {
				// IE lets the element capture the mouse directly, but other
				// browsers use the capture phase on the highest element.
				if (isIE) {
					// we need to capture the mouse, but we also don't want to
					// handle mouseup like normally (special case for bubbling)
					Seadragon.Utils.removeEvent(elmt, "mouseup", onMouseUp, false);
					Seadragon.Utils.addEvent(elmt, "mouseup", onMouseUpIE, true);
					Seadragon.Utils.addEvent(elmt, "mousemove", onMouseMoveIE, true);
				} else {
					Seadragon.Utils.addEvent(window, "mouseup", onMouseUpWindow, true);
					Seadragon.Utils.addEvent(window, "mousemove", onMouseMove, true);
				}

				capturing = true;
			}
		}

		function releaseMouse() {
			if (capturing) {
				// similar reasoning as captureMouse()
				if (isIE) {
					// we need to release the mouse, and also go back to handling
					// mouseup like normal (no longer a hack for capture phase)
					Seadragon.Utils.removeEvent(elmt, "mousemove", onMouseMoveIE, true);
					Seadragon.Utils.removeEvent(elmt, "mouseup", onMouseUpIE, true);
					Seadragon.Utils.addEvent(elmt, "mouseup", onMouseUp, false);
				} else {
					Seadragon.Utils.removeEvent(window, "mousemove", onMouseMove, true);
					Seadragon.Utils.removeEvent(window, "mouseup", onMouseUpWindow, true);
				}

				capturing = false;
			}
		}

		// IE-specific helpers

		function triggerOthers(eventName, event) {
			// update: protecting against properties added to the Object class's
			// prototype, which can and does happen (e.g. through js libraries)
			var trackers = ieTrackersActive;
			for (var otherHash in trackers) {
				if (trackers.hasOwnProperty(otherHash) && hash != otherHash) {
					trackers[otherHash][eventName](event);
				}
			}
		}

		function hasMouse() {
			return insideElmt;
		}

		// Listeners

		function onMouseOver(event) {
			var event = Seadragon.Utils.getEvent(event);

			// IE capturing model doesn't raise or bubble the events on any
			// other element if we're capturing currently. so pass this event to
			// other elements being tracked so they can adjust if the element
			// was from them or from a child. however, IE seems to always fire
			// events originating from parents to those parents, so don't double
			// fire the event if the event originated from a parent.
			if (isIE && capturing && !isChild(event.srcElement, elmt)) {
				triggerOthers("onMouseOver", event);
			}

			// similar to onMouseOut() tricky bubbling case...
			var to = event.target ? event.target : event.srcElement;
			var from = event.relatedTarget ? event.relatedTarget : event.fromElement;
			if (!isChild(elmt, to) || isChild(elmt, from)) {
				// the mouseover needs to end on this or a child node, and it
				// needs to start from this or an outer node.
				return;
			}

			insideElmt = true;

			if (typeof (self.enterHandler) == "function") {
				try {
					self.enterHandler(self, getMouseRelative(event, elmt),
                            buttonDownElmt, buttonDownAny);
				} catch (e) {
					// handler threw an error, ignore
					Seadragon.Debug.error(e.name +
                            " while executing enter handler: " + e.message, e);
				}
			}
		}

		function onMouseOut(event) {
			var event = Seadragon.Utils.getEvent(event);

			// similar to onMouseOver() case for IE capture model
			if (isIE && capturing && !isChild(event.srcElement, elmt)) {
				triggerOthers("onMouseOut", event);
			}

			// we have to watch out for a tricky case: a mouseout occurs on a
			// child element, but the mouse is still inside the parent element.
			// the mouseout event will bubble up to us. this happens in all
			// browsers, so we need to correct for this. technique from:
			// http://www.quirksmode.org/js/events_mouse.html
			var from = event.target ? event.target : event.srcElement;
			var to = event.relatedTarget ? event.relatedTarget : event.toElement;
			if (!isChild(elmt, from) || isChild(elmt, to)) {
				// the mouseout needs to start from this or a child node, and it
				// needs to end on this or an outer node.
				return;
			}

			insideElmt = false;

			if (typeof (self.exitHandler) == "function") {
				try {
					self.exitHandler(self, getMouseRelative(event, elmt),
                            buttonDownElmt, buttonDownAny);
				} catch (e) {
					// handler threw an error, ignore
					Seadragon.Debug.error(e.name +
                            " while executing exit handler: " + e.message, e);
				}
			}
		}

		function onMouseDown(event) {
			var event = Seadragon.Utils.getEvent(event);

			// don't consider right-clicks (fortunately this is cross-browser)
			if (event.button == 2) {
				return;
			}

			buttonDownElmt = true;

			lastPoint = getMouseAbsolute(event);
			lastMouseDownPoint = lastPoint;
			lastMouseDownTime = new Date().getTime();

			if (typeof (self.pressHandler) == "function") {
				try {
					self.pressHandler(self, getMouseRelative(event, elmt));
				} catch (e) {
					// handler threw an error, ignore
					Seadragon.Debug.error(e.name +
                            " while executing press handler: " + e.message, e);
				}
			}

			if (self.pressHandler || self.dragHandler) {
				// if a press or drag handler is registered, don't drag-drop images, etc.
				Seadragon.Utils.cancelEvent(event);
			}

			if (!isIE || !ieCapturingAny) {
				captureMouse();
				ieCapturingAny = true;
				ieTrackersCapturing = [ieSelf];     // reset to empty & add us
			} else if (isIE) {
				ieTrackersCapturing.push(ieSelf);   // add us to the list
			}
		}

		function onMouseUp(event) {
			var event = Seadragon.Utils.getEvent(event);
			var insideElmtPress = buttonDownElmt;
			var insideElmtRelease = insideElmt;

			// don't consider right-clicks (fortunately this is cross-browser)
			if (event.button == 2) {
				return;
			}

			buttonDownElmt = false;

			if (typeof (self.releaseHandler) == "function") {
				try {
					self.releaseHandler(self, getMouseRelative(event, elmt),
                            insideElmtPress, insideElmtRelease);
				} catch (e) {
					// handler threw an error, ignore
					Seadragon.Debug.error(e.name +
                            " while executing release handler: " + e.message, e);
				}
			}

			// some browsers sometimes don't fire click events when we're also
			// listening for mouseup events. i'm not sure why, it could be
			// something i'm doing. in the meantime, this is a temporary fix.
			if (insideElmtPress && insideElmtRelease) {
				handleMouseClick(event);
			}
		}

		/**
		* Only triggered once by the deepest element that initially received
		* the mouse down event. We want to make sure THIS event doesn't bubble.
		* Instead, we want to trigger the elements that initially received the
		* mouse down event (including this one) only if the mouse is no longer
		* inside them. Then, we want to release capture, and emulate a regular
		* mouseup on the event that this event was meant for.
		*/
		function onMouseUpIE(event) {
			var event = Seadragon.Utils.getEvent(event);

			// don't consider right-clicks (fortunately this is cross-browser)
			if (event.button == 2) {
				return;
			}

			// first trigger those that were capturing
			for (var i = 0; i < ieTrackersCapturing.length; i++) {
				var tracker = ieTrackersCapturing[i];
				if (!tracker.hasMouse()) {
					tracker.onMouseUp(event);
				}
			}

			// then release capture and emulate a regular event
			releaseMouse();
			ieCapturingAny = false;
			event.srcElement.fireEvent("on" + event.type,
                    document.createEventObject(event));

			// make sure to stop this event -- shouldn't bubble up
			Seadragon.Utils.stopEvent(event);
		}

		/**
		* Only triggered in W3C browsers by elements within which the mouse was
		* initially pressed, since they are now listening to the window for
		* mouseup during the capture phase. We shouldn't handle the mouseup
		* here if the mouse is still inside this element, since the regular
		* mouseup handler will still fire.
		*/
		function onMouseUpWindow(event) {
			if (!insideElmt) {
				onMouseUp(event);
			}

			releaseMouse();
		}

		function onMouseClick(event) {
			// see onMouseUp() bug -- handleClick() is already called by
			// onMouseUp() as a temporary fix, so don't duplicate the call here.

			if (self.clickHandler) {
				// since a click handler was registered, don't follow href's, etc.
				Seadragon.Utils.cancelEvent(event);
			}
		}

		function handleMouseClick(event) {
			var event = Seadragon.Utils.getEvent(event);

			// don't consider right-clicks (fortunately this is cross-browser)
			if (event.button == 2) {
				return;
			}

			var time = new Date().getTime() - lastMouseDownTime;
			var point = getMouseAbsolute(event);
			var distance = lastMouseDownPoint.distanceTo(point);
			var quick = time <= clickTimeThreshold &&
                    distance <= clickDistThreshold;

			if (typeof (self.clickHandler) == "function") {
				try {
					self.clickHandler(self, getMouseRelative(event, elmt),
                            quick, event.shiftKey);
				} catch (e) {
					// handler threw an error, ignore
					Seadragon.Debug.error(e.name +
                            " while executing click handler: " + e.message, e);
				}
			}
		}

		function onMouseMove(event) {
			var event = Seadragon.Utils.getEvent(event);
			var point = getMouseAbsolute(event);
			var delta = point.minus(lastPoint);

			lastPoint = point;

			if (typeof (self.dragHandler) == "function") {
				try {
					self.dragHandler(self, getMouseRelative(event, elmt),
                            delta, event.shiftKey);
				} catch (e) {
					// handler threw an error, ignore
					Seadragon.Debug.error(e.name +
                            " while executing drag handler: " + e.message, e);
				}

				// since a drag handler was registered, don't allow highlighting, etc.
				Seadragon.Utils.cancelEvent(event);
			}
		}

		/**
		* Only triggered once by the deepest element that initially received
		* the mouse down event. Since no other element has captured the mouse,
		* we want to trigger the elements that initially received the mouse
		* down event (including this one).
		*/
		function onMouseMoveIE(event) {
			// manually trigger those that are capturing
			for (var i = 0; i < ieTrackersCapturing.length; i++) {
				ieTrackersCapturing[i].onMouseMove(event);
			}

			// make sure to stop this event -- shouldn't bubble up. note that at
			// the time of this writing, there is no harm in letting it bubble,
			// but a minor change to our implementation would necessitate this.
			Seadragon.Utils.stopEvent(event);
		}

		// Constructor

		(function() {
			ieSelf = {
				hasMouse: hasMouse,
				onMouseOver: onMouseOver,
				onMouseOut: onMouseOut,
				onMouseUp: onMouseUp,
				onMouseMove: onMouseMove
			};
		})();

		// Methods

		this.isTracking = function() {
			return tracking;
		};

		this.setTracking = function(track) {
			if (track) {
				startTracking();
			} else {
				stopTracking();
			}
		};

	};

})();