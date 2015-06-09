(function() {

    String.prototype.toIdSelector = function() {
        return "#" + this.toString();
    };

    String.prototype.toClassSelector = function() {
        return "." + this.toString();
    };

}());