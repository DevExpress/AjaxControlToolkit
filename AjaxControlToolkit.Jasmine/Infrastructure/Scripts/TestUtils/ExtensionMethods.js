(function($) {

    $.fn.zIndex = function() {
        return this.css("zIndex");
    };

    String.prototype.toIdSelector = function() {
        return "#" + this.toString();
    };

    String.prototype.toClassSelector = function() {
        return "." + this.toString();
    };

}(jQuery));