function runAsync(runFunction, checkCondition, checkInterval)
{
    var runFunctionIntervalTimer = setInterval(function() {
        if(checkCondition()) {
            cancel();
            runFunction();
        }
    }, checkInterval || 50);

    function cancel() {
        clearInterval(runFunctionIntervalTimer);
    }
}