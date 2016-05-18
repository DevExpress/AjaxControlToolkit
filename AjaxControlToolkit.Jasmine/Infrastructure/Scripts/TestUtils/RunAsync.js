function runAsync(runFunction, checkCondition, checkInterval)
{
    var runFunctionIntervalTimer = setInterval(function() {
        if(checkCondition()) {
            cancel();
            runFunction();
        }
    }, checkInterval || 1);

    function cancel() {
        clearInterval(runFunctionIntervalTimer);
    }
}