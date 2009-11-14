using System;
using System.Web.UI;

public partial class Automated_ColorPicker : Page
{
    protected void Page_Init(object sender, EventArgs e)
    {
        ScriptManager scriptManager = ScriptManager.GetCurrent(this);
        scriptManager.EnableScriptLocalization = true;
        scriptManager.EnableScriptGlobalization = true;
    }
}