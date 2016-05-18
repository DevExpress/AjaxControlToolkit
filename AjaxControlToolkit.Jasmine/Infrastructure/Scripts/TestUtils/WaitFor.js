function waitFor(predicate, next, checkInterval){
    var nextIntervalTimer = setInterval(function() {
        if(predicate()) {
            clear();
            next();
        }
    }, checkInterval || 50);

    function clear() {
        clearInterval(nextIntervalTimer);
    }
}