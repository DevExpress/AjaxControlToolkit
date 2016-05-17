function runAsync(runFunction, checkCondition, timeout, checkInterval)
{
    var runFunctionIntervalTimer = setInterval(function() {
        if(checkCondition()) {
            cancel();
            runFunction();
        }
    }, checkInterval || 1);

    var runFunctionTimeoutTimer = setTimeout(function() {
        cancel();
        runFunction();
    }, timeout);

    function cancel() {
        clearInterval(runFunctionIntervalTimer);
        clearTimeout(runFunctionTimeoutTimer);
    }
}