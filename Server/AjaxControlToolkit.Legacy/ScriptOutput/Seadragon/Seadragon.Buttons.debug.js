// (c) 2010 CodePlex Foundation
Type.registerNamespace('Sys.Extended.UI.Seadragon');
Type.registerNamespace('Seadragon');

Sys.Extended.UI.Seadragon.ButtonState = function() {
	throw Error.invalidOperation();
}
Sys.Extended.UI.Seadragon.ButtonState.prototype = {
	REST: 0,
	GROUP: 1,
	HOVER: 2,
	DOWN: 3
}
Sys.Extended.UI.Seadragon.ButtonState.registerEnum("Sys.Extended.UI.Seadragon.ButtonState", false);

Sys.Extended.UI.Seadragon.Button = function() {
	Sys.Extended.UI.Seadragon.Button.initializeBase(this);

	this._tooltip = null;
	this._srcRest = null;
	this._srcGroup = null;
	this._srcHover = null;
	this._srcDown = null;
	this._button = null;
	this.config = null;

}
Sys.Extended.UI.Seadragon.Button.prototype = {
    initialize: function() {
        Sys.Extended.UI.Seadragon.Button.callBaseMethod(this, 'initialize');

        this._button = Seadragon.Utils.makeNeutralElement("span");
        this._currentState = Sys.Extended.UI.Seadragon.ButtonState.GROUP;
        this._tracker = new Seadragon.MouseTracker(this._button, this.config.clickTimeThreshold, this.config.clickDistThreshold);
        this._imgRest = Seadragon.Utils.makeTransparentImage(this._srcRest);
        this._imgGroup = Seadragon.Utils.makeTransparentImage(this._srcGroup);
        this._imgHover = Seadragon.Utils.makeTransparentImage(this._srcHover);
        this._imgDown = Seadragon.Utils.makeTransparentImage(this._srcDown);

        this._fadeDelay = 0;      // begin fading immediately
        this._fadeLength = 2000;  // fade over a period of 2 seconds
        this._fadeBeginTime = null;
        this._shouldFade = false;

        this._button.style.display = "inline-block";
        this._button.style.position = "relative";
        this._button.title = this._tooltip;

        this._button.appendChild(this._imgRest);
        this._button.appendChild(this._imgGroup);
        this._button.appendChild(this._imgHover);
        this._button.appendChild(this._imgDown);

        var styleRest = this._imgRest.style;
        var styleGroup = this._imgGroup.style;
        var styleHover = this._imgHover.style;
        var styleDown = this._imgDown.style;

        styleGroup.position = styleHover.position = styleDown.position = "absolute";
        styleGroup.top = styleHover.top = styleDown.top = "0px";
        styleGroup.left = styleHover.left = styleDown.left = "0px";
        styleHover.visibility = styleDown.visibility = "hidden";

        if (Seadragon.Utils.getBrowser() == Seadragon.Browser.FIREFOX &&
                    Seadragon.Utils.getBrowserVersion() < 3) {
            styleGroup.top = styleHover.top = styleDown.top = "";
        }

        this._tracker.enterHandler = Function.createDelegate(this, this._enterHandler);
        this._tracker.exitHandler = Function.createDelegate(this, this._exitHandler);
        this._tracker.pressHandler = Function.createDelegate(this, this._pressHandler);
        this._tracker.releaseHandler = Function.createDelegate(this, this._releaseHandler);
        this._tracker.clickHandler = Function.createDelegate(this, this._clickHandler);

        this._tracker.setTracking(true);
        this._outTo(Sys.Extended.UI.Seadragon.ButtonState.REST);
    },
    dispose: function() {
    },
    _scheduleFade: function() {
        window.setTimeout(Function.createDelegate(this, this._updateFade), 20);
    },
    _updateFade: function() {
        if (this._shouldFade) {
            var currentTime = new Date().getTime();
            var deltaTime = currentTime - this._fadeBeginTime;
            var opacity = 1.0 - deltaTime / this._fadeLength;

            opacity = Math.min(1.0, opacity);
            opacity = Math.max(0.0, opacity);

            Seadragon.Utils.setElementOpacity(this._imgGroup, opacity, true);
            if (opacity > 0) {
                this._scheduleFade();    // fade again
            }
        }
    },
    _beginFading: function() {
        this._shouldFade = true;
        this._fadeBeginTime = new Date().getTime() + this._fadeDelay;
        window.setTimeout(Function.createDelegate(this, this._scheduleFade), this._fadeDelay);
    },
    _stopFading: function() {
        this._shouldFade = false;
        Seadragon.Utils.setElementOpacity(this._imgGroup, 1.0, true);
    },
    _inTo: function(newState) {
        if (newState >= Sys.Extended.UI.Seadragon.ButtonState.GROUP && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.REST) {
            this._stopFading();
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.GROUP;
        }

        if (newState >= Sys.Extended.UI.Seadragon.ButtonState.HOVER && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.GROUP) {
            this._imgHover.style.visibility = "";
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.HOVER;
        }

        if (newState >= Sys.Extended.UI.Seadragon.ButtonState.DOWN && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.HOVER) {
            this._imgDown.style.visibility = "";
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.DOWN;
        }
    },
    _outTo: function(newState) {
        if (newState <= Sys.Extended.UI.Seadragon.ButtonState.HOVER && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.DOWN) {
            this._imgDown.style.visibility = "hidden";
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.HOVER;
        }

        if (newState <= Sys.Extended.UI.Seadragon.ButtonState.GROUP && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.HOVER) {
            this._imgHover.style.visibility = "hidden";
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.GROUP;
        }

        if (this._newState <= Sys.Extended.UI.Seadragon.ButtonState.REST && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.GROUP) {
            this._beginFading();
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.REST;
        }
    },
    _enterHandler: function(tracker, position, buttonDownElmt, buttonDownAny) {
        if (buttonDownElmt) {
            this._inTo(Sys.Extended.UI.Seadragon.ButtonState.DOWN);
            this._raiseEvent("onEnter", this);
        } else if (!buttonDownAny) {
            this._inTo(Sys.Extended.UI.Seadragon.ButtonState.HOVER);
        }
    },
    _exitHandler: function(tracker, position, buttonDownElmt, buttonDownAny) {
        this._outTo(Sys.Extended.UI.Seadragon.ButtonState.GROUP);
        if (buttonDownElmt) {
            this._raiseEvent("onExit", this);
        }
    },
    _pressHandler: function(tracker, position) {
        this._inTo(Sys.Extended.UI.Seadragon.ButtonState.DOWN);
        this._raiseEvent("onPress", this);
    },
    _releaseHandler: function(tracker, position, insideElmtPress, insideElmtRelease) {
        if (insideElmtPress && insideElmtRelease) {
            this._outTo(Sys.Extended.UI.Seadragon.ButtonState.HOVER);
            this._raiseEvent("onRelease", this);
        } else if (insideElmtPress) {
            this._outTo(Sys.Extended.UI.Seadragon.ButtonState.GROUP);
        } else {
            this._inTo(Sys.Extended.UI.Seadragon.ButtonState.HOVER);
        }
    },
    _clickHandler: function(tracker, position, quick, shift) {        
        if (quick) {
            this._raiseEvent("onClick", this);
        }
    },
    _raiseEvent: function(eventName, eventArgs) {
        var handler = this.get_events().getHandler(eventName);

        if (handler) {
            if (!eventArgs) {
                eventArgs = Sys.EventArgs.Empty;
            }

            handler(this, eventArgs);
        }
    },
    get_element: function() {
        return this._button;
    },
    get_tooltip: function() {
        return this._tooltip;
    },
    set_tooltip: function(value) {
        this._tooltip = value;
    },
    get_config: function() {
        return this.config;
    },
    set_config: function(value) {
        this.config = value;
    },
    get_srcRest: function() {
        return this._srcRest;
    },
    set_srcRest: function(value) {
        this._srcRest = value;
    },
    get_srcGroup: function() {
        return this._srcGroup;
    },
    set_srcGroup: function(value) {
        this._srcGroup = value;
    },
    get_srcHover: function() {
        return this._srcHover;
    },
    set_srcHover: function(value) {
        this._srcHover = value;
    },
    get_srcDown: function() {
        return this._srcDown;
    },
    set_srcDown: function(value) {
        this._srcDown = value;
    },
    add_onPress: function(handler) {
        this.get_events().addHandler("onPress", handler);
    },
    remove_onPress: function(handler) {
        this.get_events().removeHandler("onPress", handler);
    },
    add_onClick: function(handler) {
        this.get_events().addHandler("onClick", handler);
    },
    remove_onClick: function(handler) {
        this.get_events().removeHandler("onClick", handler);
    },
    add_onEnter: function(handler) {
        this.get_events().addHandler("onEnter", handler);
    },
    remove_onEnter: function(handler) {
        this.get_events().removeHandler("onEnter", handler);
    },
    add_onRelease: function(handler) {
        this.get_events().addHandler("onRelease", handler);
    },
    remove_onRelease: function(handler) {
        this.get_events().removeHandler("onRelease", handler);
    },
    add_onExit: function(handler) {
        this.get_events().addHandler("onExit", handler);
    },
    remove_onExit: function(handler) {
        this.get_events().removeHandler("onExit", handler);
    },
    notifyGroupEnter: function() {
        this._inTo(Sys.Extended.UI.Seadragon.ButtonState.GROUP);
    },
    notifyGroupExit: function() {
        this._outTo(Sys.Extended.UI.Seadragon.ButtonState.REST);
    }
}
Sys.Extended.UI.Seadragon.Button.registerClass('Sys.Extended.UI.Seadragon.Button', Sys.Component);

Sys.Extended.UI.Seadragon.ButtonGroup = function() {
	Sys.Extended.UI.Seadragon.ButtonGroup.initializeBase(this);

	this._buttons = null;
	this._group = null;
	this.config = null;
}
Sys.Extended.UI.Seadragon.ButtonGroup.prototype = {
	initialize: function() {
		Sys.Extended.UI.Seadragon.ButtonGroup.callBaseMethod(this, 'initialize');

		this._group = Seadragon.Utils.makeNeutralElement("span");
		var buttons = this._buttons.concat([]);   // copy
		var tracker = new Seadragon.MouseTracker(this._group, this.config.clickTimeThreshold, this.config.clickDistThreshold);
		this._group.style.display = "inline-block";

		for (var i = 0; i < buttons.length; i++) {
			this._group.appendChild(buttons[i].get_element());
		}

		tracker.enterHandler = Function.createDelegate(this, this._enterHandler);
		tracker.exitHandler = Function.createDelegate(this, this._exitHandler);
		tracker.releaseHandler = Function.createDelegate(this, this._releaseHandler);

		tracker.setTracking(true);
	},
	dispose: function() {
	},
	get_buttons: function() {
		return this._buttons;
	},
	set_buttons: function(value) {
		this._buttons = value;
	},
	get_element: function() {
		return this._group;
	},
	get_config: function() {
		return this.config;
	},
	set_config: function(value) {
		this.config = value;
	},
	_enterHandler: function(tracker, position, buttonDownElmt, buttonDownAny) {
		for (var i = 0; i < this._buttons.length; i++) {
			this._buttons[i].notifyGroupEnter();
		}
	},
	_exitHandler: function(tracker, position, buttonDownElmt, buttonDownAny) {
		if (!buttonDownElmt) {
			for (var i = 0; i < this._buttons.length; i++) {
				this._buttons[i].notifyGroupExit();
			}
		}
	},
	_releaseHandler: function(tracker, position, insideElmtPress, insideElmtRelease) {

		if (!insideElmtRelease) {
			for (var i = 0; i < this._buttons.length; i++) {
				this._buttons[i].notifyGroupExit();
			}
		}
	},
	emulateEnter: function() {
		this._enterHandler();
	},

	emulateExit: function() {
		this._exitHandler();
	}
}
Sys.Extended.UI.Seadragon.ButtonGroup.registerClass('Sys.Extended.UI.Seadragon.ButtonGroup', Sys.Component);
