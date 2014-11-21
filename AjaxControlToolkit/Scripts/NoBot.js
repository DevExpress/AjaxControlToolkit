Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.NoBotBehavior = function(element) {
    Sys.Extended.UI.NoBotBehavior.initializeBase(this, [element]);

    this._ChallengeScript = "";
}

Sys.Extended.UI.NoBotBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.NoBotBehavior.callBaseMethod(this, "initialize");

        // Evaluate challenge script and store response in ClientState
        var response = eval(this._ChallengeScript);
        Sys.Extended.UI.NoBotBehavior.callBaseMethod(this, "set_ClientState", [response]);
    },

    dispose: function() {
        Sys.Extended.UI.NoBotBehavior.callBaseMethod(this, "dispose");
    },

    get_ChallengeScript: function() {
        // JavaScript to be evaluated
        return this._ChallengeScript;
    },

    set_ChallengeScript: function(value) {
        if(this._ChallengeScript != value) {
            this._ChallengeScript = value;
            this.raisePropertyChanged('ChallengeScript');
        }
    }
}

Sys.Extended.UI.NoBotBehavior.registerClass("Sys.Extended.UI.NoBotBehavior", Sys.Extended.UI.BehaviorBase);