using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Represents the possible ways to handle the inner rail graphic.
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Multi")]
    public enum MultiHandleInnerRailStyle
    {
        /// <summary>
        /// The rail style is presented as it is defined.
        /// </summary>
        AsIs,
        /// <summary>
        /// The rail style is offset by its invisible area.
        /// </summary>
        SlidingDoors
    }
}
