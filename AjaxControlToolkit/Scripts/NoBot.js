Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.NoBotBehavior = function (element) {
    Sys.Extended.UI.NoBotBehavior.initializeBase(this, [element]);

    this._challengeScript = "";
}

Sys.Extended.UI.NoBotBehavior.prototype = {

    initialize: function () {
        Sys.Extended.UI.NoBotBehavior.callBaseMethod(this, "initialize");

        // Evaluate challenge script and store response in ClientState
        var response = eval(this._challengeScript);
        Sys.Extended.UI.NoBotBehavior.callBaseMethod(this, "set_ClientState", [response]);
    },

    dispose: function () {
        Sys.Extended.UI.NoBotBehavior.callBaseMethod(this, "dispose");
    },

    /// <summary>
    /// Challenge script.
    /// </summary>
    /// <getter>get_challengeScript</getter>
    /// <setter>set_challengeScript</setter>
    /// <member name="cP:AjaxControlToolkit.NoBotExtender.challengeScript" />
    get_challengeScript: function () {
        // JavaScript to be evaluated
        return this._challengeScript;
    },
    set_challengeScript: function (value) {
        if (this._challengeScript != value) {
            this._challengeScript = value;
            this.raisePropertyChanged('challengeScript');
        }
    },

    get_ChallengeScript: function () {
        Sys.Extended.Deprecated("get_ChallengeScript", "get_challengeScript");
        return this.get_challengeScript();
    },

    set_ChallengeScript: function (value) {
        Sys.Extended.Deprecated("set_ChallengeScript", "set_challengeScript");
        this.set_challengeScript(value);
    }
}

Sys.Extended.UI.NoBotBehavior.registerClass("Sys.Extended.UI.NoBotBehavior", Sys.Extended.UI.BehaviorBase);