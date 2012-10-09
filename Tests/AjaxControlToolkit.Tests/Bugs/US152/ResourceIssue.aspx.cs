using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Resources;
using System.Reflection;

namespace AjaxControlToolkit.Tests.Bugs.US152
{
    public partial class ResourceIssue : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            string localresourcestring = string.Empty;

            ResourceManager _rm = new ResourceManager("ScriptResources.BaseScriptsResources", Assembly.GetExecutingAssembly());

            System.IO.UnmanagedMemoryStream m = _rm.GetStream("Calendar_Today");

            string globalresourcestring = string.Empty;
            // Get the local resource string.
            try
            {
                localresourcestring = (String)GetLocalResourceObject("Calendar_Today");
            }
            catch
            {
                localresourcestring = "Could not find local resource.";
            }
        }


    }
}