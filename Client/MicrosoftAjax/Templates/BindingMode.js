$type = Sys.BindingMode = function BindingMode() {
}
$type.prototype = {
    auto: 0,
    oneTime: 1,
    oneWay: 2,
    twoWay: 3,
    oneWayToSource: 4
}

$type.registerEnum("Sys.BindingMode");
