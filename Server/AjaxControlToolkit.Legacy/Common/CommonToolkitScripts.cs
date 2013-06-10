

using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;


#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("Common.Common.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Common.Common.debug.js", "text/javascript")]
#endregion


namespace AjaxControlToolkit
{    
    /// <summary>
    /// This class just exists as a type to get common scripts loaded.  For further info
    /// see Common.js in this folder.
    /// </summary>
    [ClientScriptResource(null, "Common.Common.js")]
    public static class CommonToolkitScripts
    {        
    }
}


