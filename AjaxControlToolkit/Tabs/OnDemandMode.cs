#pragma warning disable 1591
namespace AjaxControlToolkit {

    // OnDemand behavior. Used by TabPanel and will only take effect when OnDemand = true on TabContainer
    public enum OnDemandMode {
        // Turn off OnDemand feature
        None,
        // Content will always reloaded on activate
        Always,
        // Once content loaded it will not reloaded again on activate
        Once
    }

}

#pragma warning restore 1591