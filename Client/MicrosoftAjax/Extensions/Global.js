var merge = function _merge(target) {
    target = target || {};
    foreach(arguments, function(o) {
        if (o) {
            forIn(o, function(v, n) {
                target[n] = v;
            });
        }
    }, 1);
    return target;
}
var forIn = function _forIn(obj, callback) {
    for (var x in obj) {
        //if (obj.hasOwnProperty(x)) callback(obj[x], x);
        callback(obj[x], x);
    }
}
var foreach = function _foreach(arr, callback, start) {
    var cancelled;
    if (arr) {
        // javascript array
        arr = arr !== window && typeof(arr.nodeType) === "undefined" &&
            (arr instanceof Array || 
            // arguments array, or nodelist (has .item and is not a dom element or window)
            (typeof(arr.length) === 'number' && (typeof(arr.callee) === "function" || (arr.item && typeof(arr.nodeType) === "undefined") && !arr.addEventListener && !arr.attachEvent)))
            ? arr : [arr];
        for (var i = start||0, l = arr.length; i < l; i++) {
            if (callback(arr[i], i)) {
                cancelled = true;
                break;
            }
        }
    }
    return !cancelled;
}
var callIf = function _callIf(obj, name, args) {
    // calls a function on an object if it exists, passing in the optional arguments
    var fn = obj[name],
        exists = typeof(fn) === "function";
    if (exists) fn.call(obj, args);
    return exists;
}
