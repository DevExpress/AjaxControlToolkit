using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;
using System.ComponentModel;
using System.Text;
using System;

[assembly: WebResource("HtmlEditorExtender.HtmlEditorExtenderBehavior.js", "text/javascript")]
[assembly: WebResource("HtmlEditorExtender.HtmlEditorExtenderBehavior.debug.js", "text/javascript")]
[assembly: WebResource("HtmlEditorExtender.HtmlEditorExtender_resource.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("HtmlEditorExtender.Images.html-editor-buttons.png", "img/png")]

namespace AjaxControlToolkit
{
    
    [TargetControlType(typeof(TextBox))]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditorExtenderBehavior", "HtmlEditorExtender.HtmlEditorExtenderBehavior.js")]
    [ClientCssResource("HtmlEditorExtender.HtmlEditorExtender_resource.css")]
    public class HtmlEditorExtender : ExtenderControlBase
    {
        [ExtenderControlProperty]
        [DefaultValue("test")]        
        public string ToolbarContent
        {
            get { return GetPropertyValue("ToolbarContent", "Bold|Italic|Underline|Strike|Subscript|Superscript|LeftToRight|RightToLeft|Center"); }
            set { SetPropertyValue("ToolbarContent", value); }
        }
        
    }

}
