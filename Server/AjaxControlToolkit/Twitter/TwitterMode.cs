using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    /// <summary>
    /// Determines the overall behavior of the Twitter control
    /// </summary>
    public enum TwitterMode {
        /// <summary>
        /// Shows tweets for a particular Twitter user
        /// </summary>
        Profile,

        /// <summary>
        /// Shows tweets that match a search query
        /// </summary>
        Search
    }
}
