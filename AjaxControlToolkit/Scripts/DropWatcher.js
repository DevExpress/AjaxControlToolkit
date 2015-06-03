// This behavior exists to trap a drop on the list.  When an item is dropped,
// this behavior owns firing the postback so the server-side ReorderList control knows it happened.
Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.RepeatDirection = function() {
    throw Error.invalidOperation();
}

Sys.Extended.UI.RepeatDirection.prototype = {
    Vertical: 0,
    Horizontal: 1
}

Sys.Extended.UI.RepeatDirection.registerEnum('Sys.Extended.UI.RepeatDirection');

Sys.Extended.UI.DragDropList = function(associatedElement) {
    Sys.Extended.UI.DragDropList.initializeBase(this, [associatedElement]);

    this._acceptedDataTypes = [];

    this._isDragging = null;

    this._dataType = null;
    this._dragMode = Sys.Extended.UI.DragMode.Move;
    this._dragVisual = null;
    this._direction = Sys.Extended.UI.RepeatDirection.Vertical;

    this._emptyTemplate = null;
    this._emptyTemplateInstance = null;
    this._dropCueTemplate = null;
    this._dropCueTemplateInstance = null;
    this._floatContainerInstance = null;

    this._originalParent = null;
    this._originalNextSibling = null;
    this._originalZIndex = null;

    this._currentContext = null;
    this._data = null;
}

Sys.Extended.UI.DragDropList.IsValidDataType = function(dataType) {
    if(dataType && typeof (dataType) == 'string' && dataType.length >= 4)
        return dataType.substring(0, 4) === "HTML";

    return false;
}

Sys.Extended.UI.DragDropList.prototype = {

    get_data: function() {
        return this._data;
    },

    set_data: function(value) {
        this._data = value;
    },

    initialize: function() {
        Sys.Extended.UI.DragDropList.callBaseMethod(this, 'initialize');
        this.get_element().__dragDropList = this;
        Sys.Extended.UI.DragDropManager.registerDropTarget(this);
    },

    // -- IDragSource (related) members --

    startDragDrop: function(dragObject, context, dragVisual) {
        if(!this._isDragging) {
            this._isDragging = true;
            this._currentContext = context;

            if(!dragVisual)
                dragVisual = this.createDragVisual(dragObject);
            else
                this._dragVisual = dragVisual;

            Sys.Extended.UI.DragDropManager.startDragDrop(this, dragVisual, context, !(Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version > 7 && Sys.Browser.documentMode != 0));
        }

    },

    createDragVisual: function(dragObject) {
        if(this._dragMode === Sys.Extended.UI.DragMode.Copy)
            this._dragVisual = dragObject.cloneNode(true);
        else
            this._dragVisual = dragObject;

        var oldOffset = Sys.Extended.UI.DragDropManager._getInstance().getScrollOffset(dragObject, true);

        this._dragVisual.preDragWidth = this._dragVisual.style.width;
        this._dragVisual.preDragHeight = this._dragVisual.style.height;

        this._dragVisual.style.width = dragObject.offsetWidth + "px";
        this._dragVisual.style.height = dragObject.offsetHeight + "px";

        this._dragVisual.style.opacity = "0.4";
        this._dragVisual.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(opacity=0.4);";
        this._originalZIndex = this._dragVisual.style.zIndex;
        this._dragVisual.style.zIndex = Sys.Extended.UI.zIndex.DropWatcherDragVisual;

        this._originalParent = this._dragVisual.parentNode;
        this._originalNextSibling = Sys.Extended.UI.DragDropManager._getInstance().getNextSibling(this._dragVisual);

        var currentLocation = $common.getLocation(dragObject);

        // Store the drag object in a temporary container to make it self-contained.
        var dragVisualContainer = this._getFloatContainer();
        $common.setLocation(dragVisualContainer, currentLocation);

        if(Sys.Extended.UI.DragDropManager._getInstance().hasParent(this._dragVisual))
            this._dragVisual.parentNode.removeChild(this._dragVisual);

        dragVisualContainer.appendChild(this._dragVisual);

        var newOffset = Sys.Extended.UI.DragDropManager._getInstance().getScrollOffset(dragObject, true);
        if(oldOffset.x !== newOffset.x || oldOffset.y !== newOffset.y) {
            var diff = Sys.Extended.UI.DragDropManager._getInstance().subtractPoints(oldOffset, newOffset);
            var location = Sys.Extended.UI.DragDropManager._getInstance().subtractPoints(currentLocation, diff);

            $common.setLocation(dragVisualContainer, location);
        }

        return dragVisualContainer;
    },

    get_emptyTemplate: function() {
        return this._emptyTemplate;
    },

    set_emptyTemplate: function(value) {
        this._emptyTemplate = value;
    },

    get_dragDataType: function() {
        return this._dataType;
    },

    set_dragDataType: function(value) {
        this._dataType = value;
    },

    getDragData: function(context) {
        return context;
    },

    get_dragMode: function() {
        return this._dragMode;
    },

    set_dragMode: function(value) {
        this._dragMode = value;
    },

    dispose: function() {
        Sys.Extended.UI.DragDropManager.unregisterDropTarget(this);
        this.get_element().__dragDropList = null;
        Sys.Extended.UI.DragDropList.callBaseMethod(this, 'dispose');
    },

    onDragStart: function() {
        this._validate();
    },

    onDrag: function() {
    },

    onDragEnd: function(cancelled) {
        if(this._floatContainerInstance) {
            if(this._dragMode === Sys.Extended.UI.DragMode.Copy) {
                this._floatContainerInstance.removeChild(this._dragVisual);
            } else {
                // NOTE: There seems to be a cursor issue in Mozilla when setting the opacity to 1. We 
                // can work around this by setting the opacity to anything lower than 1 instead.
                this._dragVisual.style.opacity = "0.999";
                //_dragVisual.style.opacity = "1";
                this._dragVisual.style.filter = "";

                this._dragVisual.style.zIndex = this._originalZIndex ? this._originalZIndex : 0;

                // restore the height/width of the drag visual.
                //
                if(this._dragVisual.preDragWidth != null) {
                    this._dragVisual.style.width = this._dragVisual.preDragWidth;
                    this._dragVisual.preDragWidth = null;
                }

                if(this._dragVisual.preDragHeight != null) {
                    this._dragVisual.style.height = this._dragVisual.preDragHeight;
                    this._dragVisual.preDragHeight = null;
                }

                if(cancelled) {
                    // Re-parent the drag visual to its original position.
                    this._dragVisual.parentNode.removeChild(this._dragVisual);

                    if(this._originalNextSibling != null)
                        this._originalParent.insertBefore(this._dragVisual, this._originalNextSibling);
                    else
                        this._originalParent.appendChild(this._dragVisual);
                } else {
                    if(this._dragVisual.parentNode === this._floatContainerInstance)
                        this._dragVisual.parentNode.removeChild(this._dragVisual);
                }
            }

            // Remove the container.
            document.body.removeChild(this._floatContainerInstance);
        }
        else {
            this._dragVisual.parentNode.removeChild(this._dragVisual);
        }

        if(!cancelled && this._data && this._dragMode === Sys.Extended.UI.DragMode.Move) {
            var data = this.getDragData(this._currentContext);
            if(this._data && data)
                Array.remove(this._data, data);
        }

        this._isDragging = false;
        this._validate();
    },

    // -- IDropTarget (related) members --

    get_direction: function() {
        return this._direction;
    },

    set_direction: function(value) {
        this._direction = value;
    },

    get_acceptedDataTypes: function() {
        return this._acceptedDataTypes;
    },

    set_acceptedDataTypes: function(value) {
        if(typeof (value) == "string")
            this._acceptedDataTypes = value.split(",");
        else
            this._acceptedDataTypes = value;
    },

    get_dropCueTemplate: function() {
        return this._dropCueTemplate;
    },

    set_dropCueTemplate: function(value) {
        this._dropCueTemplate = value;
    },

    get_dropTargetElement: function() {
        return this.get_element();
    },

    canDrop: function(dragMode, dataType, data) {
        for(var i = 0; i < this._acceptedDataTypes.length; i++)
            if(this._acceptedDataTypes[i] === dataType)
                return true;

        return false;
    },

    drop: function(dragMode, dataType, data) {
        if(Sys.Extended.UI.DragDropList.IsValidDataType(dataType) && dragMode === Sys.Extended.UI.DragMode.Move) {
            // Re-parent the drag visual.
            dragVisual = data;

            var potentialNextSibling = this._findPotentialNextSibling(dragVisual);
            this._setDropCueVisible(false, dragVisual);
            dragVisual.parentNode.removeChild(dragVisual);

            if(potentialNextSibling)
                this.get_element().insertBefore(dragVisual, potentialNextSibling);
            else
                this.get_element().appendChild(dragVisual);
        } else {
            this._setDropCueVisible(false);
        }
    },

    onDragEnterTarget: function(dragMode, dataType, data) {
        if(Sys.Extended.UI.DragDropList.IsValidDataType(dataType)) {
            this._setDropCueVisible(true, data);
            this._validate();
        }
    },

    onDragLeaveTarget: function(dragMode, dataType, data) {
        if(Sys.Extended.UI.DragDropList.IsValidDataType(dataType)) {
            this._setDropCueVisible(false);
            this._validate();
        }
    },

    onDragInTarget: function(dragMode, dataType, data) {
        if(Sys.Extended.UI.DragDropList.IsValidDataType(dataType))
            this._setDropCueVisible(true, data);
    },

    _setDropCueVisible: function(visible, dragVisual) {
        if(this._dropCueTemplate) {
            if(visible) {
                if(!this._dropCueTemplateInstance) {
                    var documentContext = document.createDocumentFragment();
                    this._dropCueTemplateInstance = this._dropCueTemplate.cloneNode(true);
                }

                var potentialNextSibling = this._findPotentialNextSibling(dragVisual);

                if(!Sys.Extended.UI.DragDropManager._getInstance().hasParent(this._dropCueTemplateInstance)) {
                    // Add drop cue.
                    if(potentialNextSibling)
                        this.get_element().insertBefore(this._dropCueTemplateInstance, potentialNextSibling);
                    else
                        this.get_element().appendChild(this._dropCueTemplateInstance);

                    this._dropCueTemplateInstance.style.width = dragVisual.offsetWidth + "px";
                    this._dropCueTemplateInstance.style.height = dragVisual.offsetHeight + "px";
                } else {
                    // Move drop cue.
                    if(Sys.Extended.UI.DragDropManager._getInstance().getNextSibling(this._dropCueTemplateInstance) !== potentialNextSibling) {
                        this.get_element().removeChild(this._dropCueTemplateInstance);

                        if(potentialNextSibling)
                            this.get_element().insertBefore(this._dropCueTemplateInstance, potentialNextSibling);
                        else
                            this.get_element().appendChild(this._dropCueTemplateInstance);
                    }
                }
            } else {
                if(this._dropCueTemplateInstance && Sys.Extended.UI.DragDropManager._getInstance().hasParent(this._dropCueTemplateInstance))
                    this.get_element().removeChild(this._dropCueTemplateInstance);
            }
        }
    },

    _findPotentialNextSibling: function(dragVisual) {
        var dragVisualRect = $common.getBounds(dragVisual),
            isVertical = (this._direction === 0 /*Sys.Extended.UI.RepeatDirection.Vertical*/),
            nodeRect;

        for(var node = this.get_element().firstChild; node !== null; node = node.nextSibling) {
            if(node.innerHTML && node !== this._dropCueTemplateInstance && node !== this._emptyTemplateInstance) {
                nodeRect = $common.getBounds(node);

                if((!isVertical && dragVisualRect.x <= nodeRect.x) || (isVertical && dragVisualRect.y <= nodeRect.y))
                    return node;
            }
        }

        return null;
    },

    _validate: function() {
        var visible = (this._dropCueTemplateInstance == null || !Sys.Extended.UI.DragDropManager._getInstance().hasParent(this._dropCueTemplateInstance));

        // Check if there are draggables left in this host. If not, display a placeholder.
        var count = 0;
        for(var node = this.get_element().firstChild; node !== null; node = node.nextSibling)
            if(node.innerHTML && node !== this._emptyTemplateInstance && node !== this._dropCueTemplateInstance)
                count++;

        if(count > 0)
            visible = false;

        this._setEmptyTemplateVisible(visible);
    },

    _setEmptyTemplateVisible: function(visible) {
        if(this._emptyTemplate)
            if(visible) {
                if(!this._emptyTemplateInstance)
                    this._emptyTemplateInstance = this._emptyTemplate.createInstance(this.get_element()).instanceElement;
                else if(!Sys.Extended.UI.DragDropManager._getInstance().hasParent(this._emptyTemplateInstance))
                    this.get_element().appendChild(this._emptyTemplateInstance);
            } else {
                if(this._emptyTemplateInstance && Sys.Extended.UI.DragDropManager._getInstance().hasParent(this._emptyTemplateInstance))
                    this.get_element().removeChild(this._emptyTemplateInstance);
            }
    },

    _getFloatContainer: function() {
        if(!this._floatContainerInstance) {
            this._floatContainerInstance = document.createElement(this.get_element().tagName);
            var none = "0px 0px 0px 0px";

            this._floatContainerInstance.style.position = "absolute";
            this._floatContainerInstance.style.padding = none;
            this._floatContainerInstance.style.margin = none;
            this._floatContainerInstance.className = 'dragVisualContainer';

            document.body.appendChild(this._floatContainerInstance);
        } else if(!Sys.Extended.UI.DragDropManager._getInstance().hasParent(this._floatContainerInstance)) {
            document.body.appendChild(this._floatContainerInstance);
        }

        return this._floatContainerInstance;
    }
}

Sys.Extended.UI.DragDropList.registerClass('Sys.Extended.UI.DragDropList', Sys.Extended.UI.BehaviorBase, Sys.Extended.UI.IDragSource, Sys.Extended.UI.IDropTarget, Sys.IDisposable);

function callbackSuccessStub(response, context) {
    var contextSplit = context.split(":"),
        id = contextSplit[0],
        obj = $find(id);

    if(obj)
        obj._onCallbackSuccess(response, contextSplit[1]);
}

function callbackErrorStub(response, context) {
    var contextSplit = context.split(":"),
        id = contextSplit[0],
        obj = $find(id);

    alert('error');
    if(obj)
        obj._onCallbackError(response, contextSplit[1]);
}

Sys.Extended.UI.DragDropWatcher = function(e) {
    Sys.Extended.UI.DragDropWatcher.initializeBase(this, [e]);

    this._childList = new Array();
    this._inProgressDrops = new Object();

    this._postbackCode = null;
    this._callbackCssStyle = null;

    this._argReplaceString = null;
    this._argContextString = null;
    this._argErrorString = null;
    this._argSuccessString = null;
}

Sys.Extended.UI.DragDropWatcher.prototype = {

    dispose: function() {
        Sys.Extended.UI.DragDropWatcher.callBaseMethod(this, 'dispose');

    },

    initialize: function() {
        Sys.Extended.UI.DragDropWatcher.callBaseMethod(this, 'initialize');

        this._saveChildOrder();
    },

    add_reorderComplete: function(handler) {
        this.get_events().addHandler("reorderComplete", handler);
    },

    remove_reorderComplete: function(handler) {
        this.get_events().removeHandler("reorderComplete", handler);
    },

    raiseReorderComplete: function() {
        var handler = this.get_events().getHandler("reorderComplete");
        if(handler)
            handler(this, Sys.EventArgs.Empty);
    },

    findChild: function(parent, childId) {
        // just walk through the list of children looking for the child
        var childIndex = 0,
            nodes = parent.childNodes;

        for(var i = 0; i < nodes.length; i++) {
            var item = nodes[i];

            // nodeName check is for Safari which enumerates LI contents as well
            if((item != null) && (item.nodeName == "LI")) {
                if(item.id == childId)
                    return childIndex;

                childIndex++;
            }
        }

        return -1;
    },

    canDrop: function(dragMode, dataType, data) {
        if(this._inProgressDrops && this._inProgressDrops.length > 0)
            return false;

        var dropOk = Sys.Extended.UI.DragDropWatcher.callBaseMethod(this, 'canDrop', [dragMode, dataType, data]);

        if(dropOk) {
            // data is the thing being dragged
            var dragVisualRect = $common.getBounds(data),
                nodeRect,
                hitInsertNode = false,
                e = this.get_element();

            for(var node = e.firstChild; node != null && !hitInsertNode; node = node.nextSibling) {
                if(!node.id)
                    continue;

                nodeRect = $common.getBounds(node);
                if(dragVisualRect.y <= nodeRect.y)
                    break;

                hitInsertNode = (node.id.lastIndexOf("Insert", node.id.length - 6) != -1);
            }
            dropOk = !hitInsertNode;
        }

        return dropOk;
    },

    drop: function(dragMode, dataType, data) {
        Sys.Extended.UI.DragDropWatcher.callBaseMethod(this, 'drop', [dragMode, dataType, data]);

        var childId = data.id;
        if(!this._postbackCode || !childId)
            return;

        // figure out which child index we're moving to
        var newIndex = this.findChild(this.get_element(), childId);
        Sys.Debug.assert(newIndex != -1, String.format(Sys.Extended.UI.Resources.ReorderList_DropWatcherBehavior_NoChild, childId));

        var oldIndex = this._getSavedChildIndex(childId);
        if(newIndex != -1 && newIndex != oldIndex) {
            this._saveChildOrder();
            this.doPostBack(childId, newIndex, oldIndex);
        }
    },

    _setupDropState: function(childId, newIndex, oldIndex) {
        if(childId) {
            var child = $get(childId);
            this._inProgressDrops[childId] = { "oldCss": child.className, "newIndex": newIndex, "oldIndex": oldIndex };

            if(this._callbackCssStyle)
                child.className = this._callbackCssStyle;
        }
    },

    _onDropCallback: function(childId) {
        if(childId) {

            this.set_ClientState("true");

            var item = this._inProgressDrops[childId];

            if(item) {
                var child = $get(childId);

                if(this._callbackCssStyle)
                    child.className = item.oldCss;

                delete this._inProgressDrops[childId];
            }

            return item;
        }
    },


    doPostBack: function(childId, newIndex, oldIndex) {
        var item = this._inProgressDrops[childId];

        if(item)
            // don't allow recursive drops.                
            return;

        // setup the postback string
        var postbackArg = "reorder:" + childId + ":" + oldIndex.toString() + ":" + newIndex.toString();

        // replace the specified replace string with the arg and build the full postback string
        var postbackCode = this._postbackCode.replace(this._argReplaceString, postbackArg);

        if(this._argSuccessString)
            postbackCode = postbackCode.replace(this._argSuccessString, "callbackSuccessStub");

        if(this._argErrorString)
            postbackCode = postbackCode.replace(this._argErrorString, "callbackErrorStub");

        if(this._argContextString)
            postbackCode = postbackCode.replace(this._argContextString, this.get_id() + ":" + childId);

        this._setupDropState(childId, newIndex, oldIndex);

        window.setTimeout(postbackCode, 0);
    },

    _onCallbackSuccess: function(response, context) {
        if(response && response.length > 0) {
            this._onCallbackError(response, context);
        } else {
            this._onDropCallback(context);
            this.raiseReorderComplete();
        }

    },

    _onCallbackError: function(response, context) {
        var item = this._onDropCallback(context);

        // undo the move
        if(item.oldIndex || item.newIndex) {
            this._saveChildOrder();
            this.doReorder(item.newIndex, item.oldIndex, true);
        }

        alert(String.format(Sys.Extended.UI.Resources.ReorderList_DropWatcherBehavior_CallbackError, response));
    },

    doReorder: function(oldIndex, newIndex, skipPostback) {
        var e = this.get_element(),
            children = this._childList;

        if(oldIndex >= 0 && children.length > oldIndex && oldIndex != newIndex) {
            var child = $get(children[oldIndex]),
                item = this._inProgressDrops[child.id];

            if(item)
                // don't allow recursive drops.                
                return;

            if(child) {
                if(newIndex > oldIndex)
                    // if the destination element is after the source element
                    // we can't insert after, we need to insert after.  
                    // so we increment the newIndex.
                    newIndex++;

                var append = newIndex >= children.length;

                try {
                    e.removeChild(child);
                } catch(e) {
                    // Safari likes to throw NOT_FOUND_ERR (DOMException 8)
                    // but it seems to work fine anyway.
                    //
                }

                if(append) {
                    e.appendChild(child);
                } else {
                    var childAtNewIndex = $get(children[newIndex]);
                    e.insertBefore(child, childAtNewIndex);
                }

                if(!skipPostback) {
                    this.doPostBack(child.id, newIndex, oldIndex);
                } else {
                    this._saveChildOrder();
                    this.raiseReorderComplete();
                }
            }
        }
    },

    getItem: function(index) {
        if(!this._childList)
            this._saveChildOrder();

        return this._childList[index];
    },

    _getSavedChildIndex: function(childId) {
        if(this._childList && childId)
            for(var i = 0; i < this._childList.length; i++)
                if(childId == this._childList[i])
                    return i;

        return -1;
    },

    _saveChildOrder: function() {
        var e = this.get_element();
        if(!e)
            return;

        var children = e.childNodes;
        this._childList = [];
        var childCount = 0;

        for(var i = 0; i < children.length; i++)
            // note Safari is returning all children, not just direct ones
            if(children[i] && children[i].parentNode === e && children[i].tagName && children[i].tagName.toLowerCase() == "li")
                this._childList[childCount++] = children[i].id;
    },


    get_argReplaceString: function() {
        return this._argReplaceString;
    },

    set_argReplaceString: function(value) {
        if(this._argReplaceString != value) {
            this._argReplaceString = value;
            this.raisePropertyChanged('argReplaceString');
        }
    },

    get_argContextString: function() {
        return this._argContextString;
    },

    set_argContextString: function(value) {
        if(this._argContextString != value) {
            this._argContextString = value;
            this.raisePropertyChanged('argContextString');
        }
    },

    get_argErrorString: function() {
        return this._argErrorString;
    },

    set_argErrorString: function(value) {
        if(this._argErrorString != value) {
            this._argErrorString = value;
            this.raisePropertyChanged('argErrorString');
        }
    },

    get_argSuccessString: function() {
        return this._argSuccessString;
    },

    set_argSuccessString: function(value) {
        if(this._argSuccessString != value) {
            this._argSuccessString = value;
            this.raisePropertyChanged('argSuccessString');
        }
    },

    get_postbackCode: function() {
        return this._postbackCode;
    },

    set_postbackCode: function(value) {
        if(this._postbackCode != value) {
            this._postbackCode = value;
            this.raisePropertyChanged('postbackCode');
        }
    },

    get_callbackCssStyle: function() {
        return this._callbackCssStyle;
    },

    set_callbackCssStyle: function(value) {
        if(this._callbackCssStyle != value) {
            this._callbackCssStyle = value;
            this.raisePropertyChanged('callbackCssStyle');
        }
    }
}

Sys.Extended.UI.DragDropWatcher.registerClass('Sys.Extended.UI.DragDropWatcher', Sys.Extended.UI.DragDropList);