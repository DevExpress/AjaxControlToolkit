Sys.Extended.UI.FloatingBehavior = function(element) {
    Sys.Extended.UI.FloatingBehavior.initializeBase(this, [element]);

    var _handle,
        _location,
        _dragStartLocation,
        _profileProperty,
        _profileComponent;

    var _mouseDownHandler = Function.createDelegate(this, mouseDownHandler);

    ///<summary>
    /// Move event handler.
    ///</summary>
    ///<member name="cE:AjaxControlToolkit.DragPanelExtender.move" />
    ///<event add="add_move" remove="remove_move" />
    this.add_move = function(handler) {
        this.get_events().addHandler('move', handler);
    }
    this.remove_move = function(handler) {
        this.get_events().removeHandler('move', handler);
    }

    ///<summary>
    /// Handles to drag the panel around.
    ///</summary>
    ///<getter>get_handle</getter>
    ///<setter>set_handle</setter>
    ///<member name="cP:AjaxControlToolkit.DragPanelExtender.handle" />
    this.get_handle = function() {
        return _handle;
    }
    this.set_handle = function(value) {
        if(_handle != null)
            $removeHandler(_handle, "mousedown", _mouseDownHandler);

        _handle = value;
        $addHandler(_handle, "mousedown", _mouseDownHandler);
    }

    this.get_profileProperty = function() {
        return _profileProperty;
    }
    this.set_profileProperty = function(value) {
        _profileProperty = value;
    }

    this.get_profileComponent = function() {
        return _profileComponent;
    }
    this.set_profileComponent = function(value) {
        _profileComponent = value;
    }

    ///<summary>
    /// Defines the location of an element being dragged.
    ///</summary>
    ///<getter>get_location</getter>
    ///<setter>set_location</setter>
    ///<member name="cP:AjaxControlToolkit.DragPanelExtender.location" />
    this.get_location = function() {
        return _location;
    }
    this.set_location = function(value) {
        if(_location != value) {
            _location = value;

            if(this.get_isInitialized())
                $common.setLocation(this.get_element(), _location);

            this.raisePropertyChanged('location');
        }
    }

    this.initialize = function() {
        Sys.Extended.UI.FloatingBehavior.callBaseMethod(this, 'initialize');
        Sys.Extended.UI.DragDropManager.registerDropTarget(this);

        var el = this.get_element();

        if(!_location)
            _location = $common.getLocation(el);

        el.style.position = "fixed";
        $common.setLocation(el, _location);
    }

    this.dispose = function() {
        Sys.Extended.UI.DragDropManager.unregisterDropTarget(this);
        if(_handle && _mouseDownHandler)
            $removeHandler(_handle, "mousedown", _mouseDownHandler);

        _mouseDownHandler = null;
        Sys.Extended.UI.FloatingBehavior.callBaseMethod(this, 'dispose');
    }

    this.checkCanDrag = function(element) {
        var undraggableTagNames = ["input", "button", "select", "textarea", "label"],
            tagName = element.tagName;

        if((tagName.toLowerCase() == "a") && (element.href != null) && (element.href.length > 0))
            return false;

        if(Array.indexOf(undraggableTagNames, tagName.toLowerCase()) > -1)
            return false;

        return true;
    }

    function mouseDownHandler(ev) {
        window._event = ev;
        var el = this.get_element();

        if(this.checkCanDrag(ev.target)) {
            _dragStartLocation = $common.getLocation(el);

            ev.preventDefault();

            this.startDragDrop(el);
        }
    }

    // Type get_dataType()
    this.get_dragDataType = function() {
        return "_floatingObject";
    }

    // Object get_data(Context)
    this.getDragData = function(context) {
        return null;
    }

    // DragMode get_dragMode()
    this.get_dragMode = function() {
        return Sys.Extended.UI.DragMode.Move;
    }

    // void onDragStart()
    this.onDragStart = function() { }

    // void onDrag()
    this.onDrag = function() { }

    this.onDragEnd = function(canceled) {
        if(!canceled) {
            var handler = this.get_events().getHandler('move');

            if(handler) {
                var cancelArgs = new Sys.CancelEventArgs();

                handler(this, cancelArgs);
                canceled = cancelArgs.get_cancel();
            }
        }

        var el = this.get_element();
        if(canceled) {
            // Restore the position of the control.
            $common.setLocation(el, _dragStartLocation);
        } else {
            _location = $common.getLocation(el);
            this.raisePropertyChanged('location');
        }
    }

    this.startDragDrop = function(dragVisual) {
        Sys.Extended.UI.DragDropManager.startDragDrop(this, dragVisual, null);
    }

    this.get_dropTargetElement = function() {
        return document.body;
    }

    // bool canDrop(DragMode, DataType, Data)
    this.canDrop = function(dragMode, dataType, data) {
        return (dataType == "_floatingObject");
    }

    // void drop(DragMode, DataType, Data)
    this.drop = function(dragMode, dataType, data) { }

    // void onDragEnterTarget(DragMode, DataType, Data)
    this.onDragEnterTarget = function(dragMode, dataType, data) { }

    // void onDragLeaveTarget(DragMode, DataType, Data)
    this.onDragLeaveTarget = function(dragMode, dataType, data) { }

    // void onDragInTarget(DragMode, DataType, Data)
    this.onDragInTarget = function(dragMode, dataType, data) { }
}

Sys.Extended.UI.FloatingBehavior.registerClass('Sys.Extended.UI.FloatingBehavior', Sys.Extended.UI.BehaviorBase, Sys.Extended.UI.IDragSource, Sys.Extended.UI.IDropTarget, Sys.IDisposable);
