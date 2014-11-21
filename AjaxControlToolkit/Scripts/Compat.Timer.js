Sys.Timer = function() {
    Sys.Timer.initializeBase(this);

    this._interval = 1000;
    this._enabled = false;
    this._timer = null;
}

Sys.Timer.prototype = {

    get_interval: function() {

        return this._interval;
    },

    set_interval: function(value) {
        if(this._interval !== value) {
            this._interval = value;
            this.raisePropertyChanged('interval');

            if(!this.get_isUpdating() && (this._timer !== null)) {
                this._stopTimer();
                this._startTimer();
            }
        }
    },

    get_enabled: function() {
        return this._enabled;
    },

    set_enabled: function(value) {
        if(value !== this.get_enabled()) {
            this._enabled = value;
            this.raisePropertyChanged('enabled');

            if(!this.get_isUpdating())
                if(value)
                    this._startTimer();
                else
                    this._stopTimer();
        }
    },

    add_tick: function(handler) {
        this.get_events().addHandler("tick", handler);
    },

    remove_tick: function(handler) {
        this.get_events().removeHandler("tick", handler);
    },

    dispose: function() {
        this.set_enabled(false);
        this._stopTimer();

        Sys.Timer.callBaseMethod(this, 'dispose');
    },

    updated: function() {
        Sys.Timer.callBaseMethod(this, 'updated');

        if(this._enabled) {
            this._stopTimer();
            this._startTimer();
        }
    },

    _timerCallback: function() {
        var handler = this.get_events().getHandler("tick");
        if(handler)
            handler(this, Sys.EventArgs.Empty);
    },

    _startTimer: function() {
        this._timer = window.setInterval(Function.createDelegate(this, this._timerCallback), this._interval);
    },

    _stopTimer: function() {
        window.clearInterval(this._timer);
        this._timer = null;
    }
}

Sys.Timer.descriptor = {
    properties: [{ name: 'interval', type: Number },
                    { name: 'enabled', type: Boolean }],
    events: [{ name: 'tick' }]
}

Sys.Timer.registerClass('Sys.Timer', Sys.Component);