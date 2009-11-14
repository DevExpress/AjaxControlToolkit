(function() {

function execute() {
    // script contents here
}

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript("a", null, execute);
}
else {
    execute();
}


})();