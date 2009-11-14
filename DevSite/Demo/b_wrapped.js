(function() {

function execute() {
    // script contents here
}

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript("b", null, execute);
}
else {
    execute();
}


})();