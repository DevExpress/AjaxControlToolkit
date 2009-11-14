

using System;
using System.Drawing;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class UpdatePanelAnimation : Page
{
    /// <summary>
    /// Turn partial rendering on for this page (since the master turns it off)
    /// </summary>
    protected override void OnPreInit(EventArgs e)
    {
        base.OnPreInit(e);
        ScriptManager manager = ScriptManager.GetCurrent(Page);
        if (manager != null)
            manager.EnablePartialRendering = true;
    }
    
    /// <summary>
    /// Change the value of the textbox depending on whether or not OnUpdating fired
    /// </summary>
    protected void btnUpdate_Click(object sender, EventArgs e)
    {
        txtValue.Text = "Updated";
    }
}
