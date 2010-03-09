(function(window, Sys) {

if (!Sys || !Sys.loader) {
//#define LOADER
//#define JQUERYSTART
//#include "../extensions/global.js"
//#include "loader.js"
//#include "RegisterPlugin.js"
//#include "Definitions.js"
//#include "typecompat.js"
if (window.jQuery) {
    Sys._onjQuery();
}
Sys._domLoaded();
}

})(window, window.Sys);

