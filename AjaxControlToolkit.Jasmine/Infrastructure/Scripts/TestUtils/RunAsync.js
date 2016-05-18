function runAsync(predicate, next, checkInterval)
{
    var nextIntervalTimer = setInterval(function() {
        if(predicate()) {
            cancel();
            next();
        }
    }, checkInterval || 50);

    function cancel() {
        clearInterval(nextIntervalTimer);
    }
}