using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;
using System.ComponentModel;

[assembly: WebResource("HtmlExtender.HtmlExtenderBehavior.js", "text/javascript")]
[assembly: WebResource("HtmlExtender.HtmlExtenderBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    
    [TargetControlType(typeof(TextBox))]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [ClientScriptResource("AjaxControlToolkit.HtmlExtenderBehavior", "HtmlExtender.HtmlExtenderBehavior.js")]
    public class HtmlExtender : ExtenderControlBase
    {
        
    }

}
