function log(msg) {
    Sys.get('#results').innerHTML += msg + "<br/>";
}

function showScripts() {
    var scripts = Sys.query("script");
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i].src;
        if (script) {
            log(script);
        }
    }
}