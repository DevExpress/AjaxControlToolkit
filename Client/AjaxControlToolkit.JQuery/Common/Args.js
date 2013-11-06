$act.args = {
    cancelEventArgs: function() {
        this._cancel = false;

        this.get_cancel = function() {
            return this._cancel;
        };

        this.set_cancel = function(val) {
            this._cancel = val;
        };
    }
};