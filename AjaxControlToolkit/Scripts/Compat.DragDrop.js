Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.IDragSource = function() {
}

Sys.Extended.UI.IDragSource.prototype = {
    // Type get_dragDataType()
    get_dragDataType: function() { throw Error.notImplemented(); },

    // Object getDragData(Context)
    getDragData: function() { throw Error.notImplemented(); },

    // DragMode get_dragMode()
    get_dragMode: function() { throw Error.notImplemented(); },

    // void onDragStart()
    onDragStart: function() { throw Error.notImplemented(); },

    // void onDrag()
    onDrag: function() { throw Error.notImplemented(); },

    // void onDragEnd(Cancelled)
    onDragEnd: function() { throw Error.notImplemented(); }
}

Sys.Extended.UI.IDragSource.registerInterface('Sys.Extended.UI.IDragSource');

Sys.Extended.UI.IDropTarget = function() {
}

Sys.Extended.UI.IDropTarget.prototype = {
    get_dropTargetElement: function() { throw Error.notImplemented(); },
    // bool canDrop(DragMode, DataType, Data)
    canDrop: function() { throw Error.notImplemented(); },

    // void drop(DragMode, DataType, Data)
    drop: function() { throw Error.notImplemented(); },

    // void onDragEnterTarget(DragMode, DataType, Data)
    onDragEnterTarget: function() { throw Error.notImplemented(); },

    // void onDragLeaveTarget(DragMode, DataType, Data)
    onDragLeaveTarget: function() { throw Error.notImplemented(); },

    // void onDragInTarget(DragMode, DataType, Data)
    onDragInTarget: function() { throw Error.notImplemented(); }
}

Sys.Extended.UI.IDropTarget.registerInterface('Sys.Extended.UI.IDropTarget');

Sys.Extended.UI.DragMode = function() {
    throw Error.invalidOperation();
}

Sys.Extended.UI.DragMode.prototype = {
    Copy: 0,
    Move: 1
}

Sys.Extended.UI.DragMode.registerEnum('Sys.Extended.UI.DragMode');

Sys.Extended.UI.DragDropEventArgs = function(dragMode, dragDataType, dragData) {
    this._dragMode = dragMode;
    this._dataType = dragDataType;
    this._data = dragData;
}

Sys.Extended.UI.DragDropEventArgs.prototype = {
    get_dragMode: function() {
        return this._dragMode || null;
    },

    get_dragDataType: function() {
        return this._dataType || null;
    },

    get_dragData: function() {
        return this._data || null;
    }
}

Sys.Extended.UI.DragDropEventArgs.registerClass('Sys.Extended.UI.DragDropEventArgs');

Sys.Extended.UI._DragDropManager = function() {
    this._instance = null;
    this._events = null;
}

Sys.Extended.UI._DragDropManager.prototype = {
    add_dragStart: function(handler) {
        this.get_events().addHandler('dragStart', handler);
    },

    remove_dragStart: function(handler) {
        this.get_events().removeHandler('dragStart', handler);
    },

    get_events: function() {
        if(!this._events)
            this._events = new Sys.EventHandlerList();

        return this._events;
    },

    add_dragStop: function(handler) {
        this.get_events().addHandler('dragStop', handler);
    },

    remove_dragStop: function(handler) {
        this.get_events().removeHandler('dragStop', handler);
    },

    _getInstance: function() {
        if(!this._instance) {
            if(Sys.Browser.agent === Sys.Browser.InternetExplorer)
                this._instance = new Sys.Extended.UI.IEDragDropManager();
            else
                this._instance = new Sys.Extended.UI.GenericDragDropManager();

            this._instance.initialize();
            this._instance.add_dragStart(Function.createDelegate(this, this._raiseDragStart));
            this._instance.add_dragStop(Function.createDelegate(this, this._raiseDragStop));
        }

        return this._instance;
    },

    startDragDrop: function(dragSource, dragVisual, context, useBuiltInDragAndDropFunctions) {
        this._getInstance().startDragDrop(dragSource, dragVisual, context, useBuiltInDragAndDropFunctions);
    },

    registerDropTarget: function(target) {
        this._getInstance().registerDropTarget(target);
    },

    unregisterDropTarget: function(target) {
        this._getInstance().unregisterDropTarget(target);
    },

    dispose: function() {
        delete this._events;

        Sys.Application.unregisterDisposableObject(this);
        Sys.Application.removeComponent(this);
    },

    _raiseDragStart: function(sender, eventArgs) {
        var handler = this.get_events().getHandler('dragStart');
        if(handler)
            handler(this, eventArgs);
    },

    _raiseDragStop: function(sender, eventArgs) {
        var handler = this.get_events().getHandler('dragStop');
        if(handler)
            handler(this, eventArgs);
    }
}

Sys.Extended.UI._DragDropManager.registerClass('Sys.Extended.UI._DragDropManager');
Sys.Extended.UI.DragDropManager = new Sys.Extended.UI._DragDropManager();

Sys.Extended.UI.IEDragDropManager = function() {
    Sys.Extended.UI.IEDragDropManager.initializeBase(this);

    this._dropTargets = null;
    // Radius of the cursor used to determine what drop target we 
    // are hovering. Anything below the cursor's zone may be a 
    // potential drop target.
    this._radius = 10;
    this._useBuiltInDragAndDropFunctions = true;
    this._activeDragVisual = null;
    this._activeContext = null;
    this._activeDragSource = null;
    this._underlyingTarget = null;
    this._oldOffset = null;
    this._potentialTarget = null;
    this._isDragging = false;
    this._mouseUpHandler = null;
    this._documentMouseMoveHandler = null;
    this._documentDragOverHandler = null;
    this._dragStartHandler = null;
    this._mouseMoveHandler = null;
    this._dragEnterHandler = null;
    this._dragLeaveHandler = null;
    this._dragOverHandler = null;
    this._dropHandler = null;
}

Sys.Extended.UI.IEDragDropManager.prototype = {

    add_dragStart: function(handler) {
        this.get_events().addHandler("dragStart", handler);
    },

    remove_dragStart: function(handler) {
        this.get_events().removeHandler("dragStart", handler);
    },

    add_dragStop: function(handler) {
        this.get_events().addHandler("dragStop", handler);
    },

    remove_dragStop: function(handler) {
        this.get_events().removeHandler("dragStop", handler);
    },

    initialize: function() {
        Sys.Extended.UI.IEDragDropManager.callBaseMethod(this, 'initialize');

        this._mouseUpHandler = Function.createDelegate(this, this._onMouseUp);
        this._documentMouseMoveHandler = Function.createDelegate(this, this._onDocumentMouseMove);
        this._documentDragOverHandler = Function.createDelegate(this, this._onDocumentDragOver);
        this._dragStartHandler = Function.createDelegate(this, this._onDragStart);
        this._mouseMoveHandler = Function.createDelegate(this, this._onMouseMove);
        this._dragEnterHandler = Function.createDelegate(this, this._onDragEnter);
        this._dragLeaveHandler = Function.createDelegate(this, this._onDragLeave);
        this._dragOverHandler = Function.createDelegate(this, this._onDragOver);
        this._dropHandler = Function.createDelegate(this, this._onDrop);
    },

    dispose: function() {
        if(this._dropTargets) {
            for(var i = 0; i < this._dropTargets; i++)
                this.unregisterDropTarget(this._dropTargets[i]);

            this._dropTargets = null;
        }

        Sys.Extended.UI.IEDragDropManager.callBaseMethod(this, 'dispose');
    },


    startDragDrop: function(dragSource, dragVisual, context, useBuiltInDragAndDropFunctions) {
        var ev = window._event;

        // Don't allow drag and drop if there is another active drag operation going on.
        if(this._isDragging)
            return;

        this._underlyingTarget = null;
        this._activeDragSource = dragSource;
        this._activeDragVisual = dragVisual;
        this._activeContext = context;
        this._useBuiltInDragAndDropFunctions = typeof (useBuiltInDragAndDropFunctions) != 'undefined' ? useBuiltInDragAndDropFunctions : true;

        var mousePosition = { x: ev.clientX, y: ev.clientY };

        // By default we use absolute positioning, unless a different type 
        // of positioning is set explicitly.
        dragVisual.originalPosition = dragVisual.style.position;
        dragVisual.style.position = "absolute";

        document._lastPosition = mousePosition;
        dragVisual.startingPoint = mousePosition;
        var scrollOffset = this.getScrollOffset(dragVisual, /* recursive */true);

        dragVisual.startingPoint = this.addPoints(dragVisual.startingPoint, scrollOffset);

        var left = parseInt(dragVisual.style.left),
            top = parseInt(dragVisual.style.top);

        if(isNaN(left))
            left = "0";
        if(isNaN(top))
            top = "0";

        dragVisual.startingPoint = this.subtractPoints(dragVisual.startingPoint, { x: left, y: top });

        // Monitor DOM changes.
        this._prepareForDomChanges();
        dragSource.onDragStart();

        var eventArgs = new Sys.Extended.UI.DragDropEventArgs(
            dragSource.get_dragMode(),
            dragSource.get_dragDataType(),
            dragSource.getDragData(context));

        var handler = this.get_events().getHandler('dragStart');
        if(handler)
            handler(this, eventArgs);

        this._recoverFromDomChanges();
        this._wireEvents();
        this._drag(/* isInitialDrag */true);
    },

    _stopDragDrop: function(cancelled) {
        var ev = window._event;
        if(this._activeDragSource != null) {
            this._unwireEvents();

            if(!cancelled)
                // The drag operation is cancelled if there 
                // is no drop target.
                cancelled = (this._underlyingTarget == null);

            if(!cancelled && this._underlyingTarget != null)
                this._underlyingTarget.drop(this._activeDragSource.get_dragMode(), this._activeDragSource.get_dragDataType(), this._activeDragSource.getDragData(this._activeContext));

            this._activeDragSource.onDragEnd(cancelled);
            var handler = this.get_events().getHandler('dragStop');
            if(handler)
                handler(this, Sys.EventArgs.Empty);

            this._activeDragVisual.style.position = this._activeDragVisual.originalPosition;
            this._activeDragSource = null;
            this._activeContext = null;
            this._activeDragVisual = null;
            this._isDragging = false;
            this._potentialTarget = null;

            ev.preventDefault();
        }
    },

    _drag: function(isInitialDrag) {
        var ev = window._event,
            mousePosition = { x: ev.clientX, y: ev.clientY };

        // NOTE: We store the event object to be able to determine the current 
        // mouse position in Mozilla in other event handlers such as keydown.
        document._lastPosition = mousePosition;

        var scrollOffset = this.getScrollOffset(this._activeDragVisual, /* recursive */true),
            position = this.addPoints(this.subtractPoints(mousePosition, this._activeDragVisual.startingPoint), scrollOffset);

        // Check if the visual moved at all.
        if(!isInitialDrag && parseInt(this._activeDragVisual.style.left) == position.x && parseInt(this._activeDragVisual.style.top) == position.y)
            return;

        $common.setLocation(this._activeDragVisual, position);

        // Monitor DOM changes.
        this._prepareForDomChanges();
        this._activeDragSource.onDrag();
        this._recoverFromDomChanges();

        // Find a potential target.
        this._potentialTarget = this._findPotentialTarget(this._activeDragSource, this._activeDragVisual);

        var movedToOtherTarget = (this._potentialTarget != this._underlyingTarget || this._potentialTarget == null);

        // Check if we are leaving an underlying target.
        if(movedToOtherTarget && this._underlyingTarget != null)
            this._leaveTarget(this._activeDragSource, this._underlyingTarget);

        if(this._potentialTarget != null) {
            // Check if we are entering a new target.
            if(movedToOtherTarget) {
                this._underlyingTarget = this._potentialTarget;

                // Enter the new target.
                this._enterTarget(this._activeDragSource, this._underlyingTarget);
            } else {
                this._moveInTarget(this._activeDragSource, this._underlyingTarget);
            }
        } else {
            this._underlyingTarget = null;
        }
    },

    _wireEvents: function() {
        if(this._useBuiltInDragAndDropFunctions) {
            $addHandler(document, "mouseup", this._mouseUpHandler);
            $addHandler(document, "mousemove", this._documentMouseMoveHandler);
            $addHandler(document.body, "dragover", this._documentDragOverHandler);

            $addHandler(this._activeDragVisual, "dragstart", this._dragStartHandler);
            $addHandler(this._activeDragVisual, "dragend", this._mouseUpHandler);
            $addHandler(this._activeDragVisual, "drag", this._mouseMoveHandler);
        } else {
            $addHandler(document, "mouseup", this._mouseUpHandler);
            $addHandler(document, "mousemove", this._mouseMoveHandler);
        }
    },

    _unwireEvents: function() {
        if(this._useBuiltInDragAndDropFunctions) {
            $removeHandler(this._activeDragVisual, "drag", this._mouseMoveHandler);
            $removeHandler(this._activeDragVisual, "dragend", this._mouseUpHandler);
            $removeHandler(this._activeDragVisual, "dragstart", this._dragStartHandler);

            $removeHandler(document.body, "dragover", this._documentDragOverHandler);
            $removeHandler(document, "mousemove", this._documentMouseMoveHandler);
            $removeHandler(document, "mouseup", this._mouseUpHandler);
        } else {
            $removeHandler(document, "mousemove", this._mouseMoveHandler);
            $removeHandler(document, "mouseup", this._mouseUpHandler);
        }
    },

    registerDropTarget: function(dropTarget) {
        if(this._dropTargets == null)
            this._dropTargets = [];

        Array.add(this._dropTargets, dropTarget);

        this._wireDropTargetEvents(dropTarget);
    },

    unregisterDropTarget: function(dropTarget) {
        this._unwireDropTargetEvents(dropTarget);
        if(this._dropTargets)
            Array.remove(this._dropTargets, dropTarget);
    },

    _wireDropTargetEvents: function(dropTarget) {
        var associatedElement = dropTarget.get_dropTargetElement();

        associatedElement._dropTarget = dropTarget;
        $addHandler(associatedElement, "dragenter", this._dragEnterHandler);
        $addHandler(associatedElement, "dragleave", this._dragLeaveHandler);
        $addHandler(associatedElement, "dragover", this._dragOverHandler);
        $addHandler(associatedElement, "drop", this._dropHandler);
    },

    _unwireDropTargetEvents: function(dropTarget) {
        var associatedElement = dropTarget.get_dropTargetElement();

        // make sure that the handlers are not removed twice
        if(associatedElement._dropTarget) {
            associatedElement._dropTarget = null;
            $removeHandler(associatedElement, "dragenter", this._dragEnterHandler);
            $removeHandler(associatedElement, "dragleave", this._dragLeaveHandler);
            $removeHandler(associatedElement, "dragover", this._dragOverHandler);
            $removeHandler(associatedElement, "drop", this._dropHandler);
        }
    },


    _onDragStart: function(ev) {
        window._event = ev;
        document.selection.empty();

        var dt = ev.dataTransfer;
        if(!dt && ev.rawEvent)
            dt = ev.rawEvent.dataTransfer;

        var dataType = this._activeDragSource.get_dragDataType().toLowerCase(),
            data = this._activeDragSource.getDragData(this._activeContext);

        if(data) {
            // TODO: How do we want to deal with 'non-compatible types'?
            if(dataType != "text" && dataType != "url") {
                dataType = "text";

                if(data.innerHTML != null)
                    data = data.innerHTML;
            }

            dt.effectAllowed = "move";
            dt.setData(dataType, data.toString());
        }
    },

    _onMouseUp: function(ev) {
        window._event = ev;
        this._stopDragDrop(false);
    },

    _onDocumentMouseMove: function(ev) {
        window._event = ev;
        this._dragDrop();
    },

    _onDocumentDragOver: function(ev) {
        window._event = ev;
        if(this._potentialTarget)
            ev.preventDefault();
    },

    _onMouseMove: function(ev) {
        window._event = ev;
        this._drag();
    },

    _onDragEnter: function(ev) {
        window._event = ev;
        if(this._isDragging) {
            ev.preventDefault();
            //ev.returnValue = false;
        } else {
            // An external object is dragged to the drop target.
            var dataObjects = Sys.Extended.UI.IEDragDropManager._getDataObjectsForDropTarget(this._getDropTarget(ev.target));

            for(var i = 0; i < dataObjects.length; i++)
                this._dropTarget.onDragEnterTarget(Sys.Extended.UI.DragMode.Copy, dataObjects[i].type, dataObjects[i].value);
        }
    },

    _onDragLeave: function(ev) {
        window._event = ev;
        if(this._isDragging) {
            ev.preventDefault();
            //ev.returnValue = false;
        } else {
            // An external object is dragged to the drop target.
            var dataObjects = Sys.Extended.UI.IEDragDropManager._getDataObjectsForDropTarget(this._getDropTarget(ev.target));

            for(var i = 0; i < dataObjects.length; i++)
                this._dropTarget.onDragLeaveTarget(Sys.Extended.UI.DragMode.Copy, dataObjects[i].type, dataObjects[i].value);
        }
    },

    _onDragOver: function(ev) {
        window._event = ev;
        if(this._isDragging) {
            ev.preventDefault();
        } else {
            // An external object is dragged over the drop target.
            var dataObjects = Sys.Extended.UI.IEDragDropManager._getDataObjectsForDropTarget(this._getDropTarget(ev.target));

            for(var i = 0; i < dataObjects.length; i++)
                this._dropTarget.onDragInTarget(Sys.Extended.UI.DragMode.Copy, dataObjects[i].type, dataObjects[i].value);
        }
    },

    _onDrop: function(ev) {
        window._event = ev;

        if(!this._isDragging) {
            // An external object is dropped on the drop target.
            var dataObjects = Sys.Extended.UI.IEDragDropManager._getDataObjectsForDropTarget(this._getDropTarget(ev.target));

            for(var i = 0; i < dataObjects.length; i++)
                this._dropTarget.drop(Sys.Extended.UI.DragMode.Copy, dataObjects[i].type, dataObjects[i].value);
        }
        ev.preventDefault();
    },

    _getDropTarget: function(element) {
        while(element) {
            if(element._dropTarget != null)
                return element._dropTarget;

            element = element.parentNode;
        }

        return null;
    },

    _dragDrop: function() {
        if(this._isDragging)
            return;

        this._isDragging = true;
        this._activeDragVisual.dragDrop();

        document.selection.empty();
    },

    _moveInTarget: function(dragSource, dropTarget) {
        // Monitor DOM changes.
        this._prepareForDomChanges();
        dropTarget.onDragInTarget(dragSource.get_dragMode(), dragSource.get_dragDataType(), dragSource.getDragData(this._activeContext));
        this._recoverFromDomChanges();
    },

    _enterTarget: function(dragSource, dropTarget) {
        // Monitor DOM changes.
        this._prepareForDomChanges();
        dropTarget.onDragEnterTarget(dragSource.get_dragMode(), dragSource.get_dragDataType(), dragSource.getDragData(this._activeContext));
        this._recoverFromDomChanges();
    },

    _leaveTarget: function(dragSource, dropTarget) {
        // Monitor DOM changes.
        this._prepareForDomChanges();
        dropTarget.onDragLeaveTarget(dragSource.get_dragMode(), dragSource.get_dragDataType(), dragSource.getDragData(this._activeContext));
        this._recoverFromDomChanges();
    },

    _findPotentialTarget: function(dragSource, dragVisual) {
        var ev = window._event;

        if(this._dropTargets == null)
            return null;

        var type = dragSource.get_dragDataType(),
            mode = dragSource.get_dragMode(),
            data = dragSource.getDragData(this._activeContext);

        // Get the current cursor location.
        var scrollOffset = this.getScrollOffset(document.body, /* recursive */true),
            x = ev.clientX + scrollOffset.x,
            y = ev.clientY + scrollOffset.y,
            cursorRect = { x: x - this._radius, y: y - this._radius, width: this._radius * 2, height: this._radius * 2 };

        // Find any targets near the current cursor location.
        var targetRect;
        for(var i = 0; i < this._dropTargets.length; i++) {
            targetRect = $common.getBounds(this._dropTargets[i].get_dropTargetElement());

            if($common.overlaps(cursorRect, targetRect) && this._dropTargets[i].canDrop(mode, type, data))
                return this._dropTargets[i];
        }

        return null;
    },

    _prepareForDomChanges: function() {
        this._oldOffset = $common.getLocation(this._activeDragVisual);
    },

    _recoverFromDomChanges: function() {
        var newOffset = $common.getLocation(this._activeDragVisual);

        if(this._oldOffset.x != newOffset.x || this._oldOffset.y != newOffset.y) {
            this._activeDragVisual.startingPoint = this.subtractPoints(this._activeDragVisual.startingPoint, this.subtractPoints(this._oldOffset, newOffset));
            scrollOffset = this.getScrollOffset(this._activeDragVisual, /* recursive */true);

            var position = this.addPoints(this.subtractPoints(document._lastPosition, this._activeDragVisual.startingPoint), scrollOffset);
            $common.setLocation(this._activeDragVisual, position);
        }
    },

    addPoints: function(p1, p2) {
        return { x: p1.x + p2.x, y: p1.y + p2.y };
    },

    subtractPoints: function(p1, p2) {
        return { x: p1.x - p2.x, y: p1.y - p2.y };
    },

    // -- Drag and drop helper methods.
    getScrollOffset: function(element, recursive) {
        var left = element.scrollLeft,
            top = element.scrollTop;

        if(recursive) {
            var parent = element.parentNode;

            while(parent != null && parent.scrollLeft != null) {
                left += parent.scrollLeft;
                top += parent.scrollTop;

                // Don't include anything below the body.
                if(parent == document.body && (left != 0 && top != 0))
                    break;

                parent = parent.parentNode;
            }
        }

        return { x: left, y: top };
    },

    getBrowserRectangle: function() {
        var width = window.innerWidth,
            height = window.innerHeight;

        if(width == null)
            width = document.documentElement.clientWidth;

        if(height == null)
            height = document.documentElement.clientHeight;

        return { x: 0, y: 0, width: width, height: height };
    },

    getNextSibling: function(item) {
        for(item = item.nextSibling; item != null; item = item.nextSibling)
            if(item.innerHTML != null)
                return item;

        return null;
    },

    hasParent: function(element) {
        return (element.parentNode != null && element.parentNode.tagName != null);
    }
}

Sys.Extended.UI.IEDragDropManager.registerClass('Sys.Extended.UI.IEDragDropManager', Sys.Component);

Sys.Extended.UI.IEDragDropManager._getDataObjectsForDropTarget = function(dropTarget) {
    if(dropTarget == null)
        return [];

    var ev = window._event,
        dataObjects = [],
        dataTypes = ["URL", "Text"],
        data;

    for(var i = 0; i < dataTypes.length; i++) {
        var dt = ev.dataTransfer;

        if(!dt && ev.rawEvent)
            dt = ev.rawEvent.dataTransfer;

        data = dt.getData(dataTypes[i]);
        if(dropTarget.canDrop(Sys.Extended.UI.DragMode.Copy, dataTypes[i], data))
            if(data)
                Array.add(dataObjects, { type: dataTypes[i], value: data });
    }

    return dataObjects;
}

Sys.Extended.UI.GenericDragDropManager = function() {
    Sys.Extended.UI.GenericDragDropManager.initializeBase(this);

    this._dropTargets = null;
    // Radius of the cursor used to determine what drop target we 
    // are hovering. Anything below the cursor's zone may be a 
    // potential drop target.
    this._scrollEdgeConst = 40;
    this._scrollByConst = 10;
    this._scroller = null;
    this._scrollDeltaX = 0;
    this._scrollDeltaY = 0;
    this._activeDragVisual = null;
    this._activeContext = null;
    this._activeDragSource = null;
    this._oldOffset = null;
    this._potentialTarget = null;
    this._mouseUpHandler = null;
    this._mouseMoveHandler = null;
    this._keyPressHandler = null;
    this._scrollerTickHandler = null;
}

Sys.Extended.UI.GenericDragDropManager.prototype = {

    initialize: function() {
        Sys.Extended.UI.GenericDragDropManager.callBaseMethod(this, "initialize");

        this._mouseUpHandler = Function.createDelegate(this, this._onMouseUp);
        this._mouseMoveHandler = Function.createDelegate(this, this._onMouseMove);
        this._keyPressHandler = Function.createDelegate(this, this._onKeyPress);
        this._scrollerTickHandler = Function.createDelegate(this, this._onScrollerTick);
        this._scroller = new Sys.Timer();
        this._scroller.set_interval(10);
        this._scroller.add_tick(this._scrollerTickHandler);
    },

    startDragDrop: function(dragSource, dragVisual, context) {
        this._activeDragSource = dragSource;
        this._activeDragVisual = dragVisual;
        this._activeContext = context;

        Sys.Extended.UI.GenericDragDropManager.callBaseMethod(this, "startDragDrop", [dragSource, dragVisual, context]);
    },

    _stopDragDrop: function(cancelled) {
        this._scroller.set_enabled(false);

        Sys.Extended.UI.GenericDragDropManager.callBaseMethod(this, "_stopDragDrop", [cancelled]);
    },

    _drag: function(isInitialDrag) {
        Sys.Extended.UI.GenericDragDropManager.callBaseMethod(this, "_drag", [isInitialDrag]);

        this._autoScroll();
    },

    _wireEvents: function() {
        $addHandler(document, "mouseup", this._mouseUpHandler);
        $addHandler(document, "mousemove", this._mouseMoveHandler);
        $addHandler(document, "keypress", this._keyPressHandler);
    },

    _unwireEvents: function() {
        $removeHandler(document, "keypress", this._keyPressHandler);
        $removeHandler(document, "mousemove", this._mouseMoveHandler);
        $removeHandler(document, "mouseup", this._mouseUpHandler);
    },

    _wireDropTargetEvents: function(dropTarget) {
    },

    _unwireDropTargetEvents: function(dropTarget) {
    },

    _onMouseUp: function(e) {
        window._event = e;
        this._stopDragDrop(false);
    },

    _onMouseMove: function(e) {
        window._event = e;
        this._drag();
    },

    _onKeyPress: function(e) {
        window._event = e;
        // Escape.
        var k = e.keyCode ? e.keyCode : e.rawEvent.keyCode;
        if(k == 27)
            this._stopDragDrop(/* cancel */ true);
    },

    _autoScroll: function() {
        var ev = window._event,
            browserRect = this.getBrowserRectangle();

        if(browserRect.width > 0) {
            this._scrollDeltaX = this._scrollDeltaY = 0;

            if(ev.clientX < browserRect.x + this._scrollEdgeConst)
                this._scrollDeltaX = -this._scrollByConst;
            else if(ev.clientX > browserRect.width - this._scrollEdgeConst)
                this._scrollDeltaX = this._scrollByConst;

            if(ev.clientY < browserRect.y + this._scrollEdgeConst)
                this._scrollDeltaY = -this._scrollByConst;
            else if(ev.clientY > browserRect.height - this._scrollEdgeConst)
                this._scrollDeltaY = this._scrollByConst;

            if(this._scrollDeltaX != 0 || this._scrollDeltaY != 0)
                this._scroller.set_enabled(true);
            else
                this._scroller.set_enabled(false);
        }
    },

    _onScrollerTick: function() {
        var oldLeft = document.body.scrollLeft,
            oldTop = document.body.scrollTop;

        window.scrollBy(this._scrollDeltaX, this._scrollDeltaY);
        var newLeft = document.body.scrollLeft,
            newTop = document.body.scrollTop;

        var dragVisual = this._activeDragVisual,
            position = { x: parseInt(dragVisual.style.left) + (newLeft - oldLeft), y: parseInt(dragVisual.style.top) + (newTop - oldTop) };

        $common.setLocation(dragVisual, position);
    }
}

Sys.Extended.UI.GenericDragDropManager.registerClass('Sys.Extended.UI.GenericDragDropManager', Sys.Extended.UI.IEDragDropManager);