// The ASP.NET 3.5 ScriptManager assumes application service types are available in MicrosoftAjax.js.
// In Microsoft AJAX 4.0, these were moved into their own script.
// However, ScriptManager 3.5 renders out some inline javascript to initialize the app service types,
// so to support replacing the 3.5 version of MicrosoftAjax with the 4.0 one, we have to setup some
// shell objects to accept that data. The real classes, if needed, will be included manually and will
// pick up the data, if any.
var ns = Sys.Services;
// since this is only compat script and will never be debugged, we want to minimize its footprint.
// Aliasing member names, etc, with these strings aids in crunching.
var service = "Service",
    role = "Role",
    auth = "Authentication",
    profile = "Profile";
function setPath(path) {
    this._path = path;
}
// authentication service
ns[auth+service] = {
    set_path: setPath,
    _setAuthenticated: function(auth) {
        this._auth = auth;
    }
};
ns["_" + auth + service] = {};

// profile service
ns[profile + service] = { set_path: setPath };
ns["_" + profile + service] = {};
ns.ProfileGroup = function ns$ProfileGroup(properties) {
    this._propertygroup = properties;
}

// role service
ns[role + service] = { set_path: setPath };
ns["_" + role + service] = {};


