using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit
{
    public enum AjaxFileUploadMode : int
    {
        /// <summary>
        /// Automaticallu use Mode="Client" if the browser supports HTML5 progress. 
        /// If the browser does not support HTML5 progress, and the app is running on .NET 4.5, then use Mode="Server". 
        /// If not using .NET 4.5, display a standard INPUT TYPE="file" tag.
        /// </summary>
        Auto = 0, 

        /// <summary>
        /// If a browser supports HTML5 then show progress using HTML5, 
        /// otherwise, display a standard INPUT TYPE="file" tag.
        /// </summary>
        Client = 1, 

        /// <summary>
        /// If using .NET 4.5 then show progress by polling the size of the temporary file on the server. 
        /// Otherwise, if not using .NET 4.5, then display a standard INPUT TYPE="file" tag.
        /// </summary>
        Server = 2
    }
}
