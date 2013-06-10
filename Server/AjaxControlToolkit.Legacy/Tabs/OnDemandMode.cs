using System;

namespace AjaxControlToolkit
{
    /// <summary>
    /// OnDemand behavior. Used by TabPanel and will only take effect when OnDemand = true on TabContainer
    /// </summary>
    public enum OnDemandMode
    {
        /// <summary>
        /// Turn off OnDemand feature
        /// </summary>
        None = 0,
        /// <summary>
        /// Content will always reloaded on activate
        /// </summary>
        Always = 1,
        /// <summary>
        /// Once content loaded it will not reloaded again on activate
        /// </summary>
        Once = 2
    }
}
