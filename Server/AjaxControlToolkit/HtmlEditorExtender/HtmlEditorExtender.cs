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
        internal const int ButtonWidthDef = 23;
        internal const int ButtonHeightDef = 21;


        [ExtenderControlProperty(true, true)]
        [DefaultValue(null)]
        public HtmlEditorExtenderButton[] ToolbarButtons
        {
            get { return GetPropertyValue("ToolbarButtons", ButtonList.Buttons.ToArray()); }
            set { SetPropertyValue("ToolbarButtons", value); }
        }

        //[ExtenderControlProperty]
        //[DefaultValue("")]
        //public string Text
        //{
        //    get { return GetPropertyValue("Text", ""); }
        //    set
        //    {
        //        SetPropertyValue("Text", DecodeValues(value));
        //    }
        //}

        private string DecodeValues(string value)
        {
            foreach (HtmlEditorExtenderButton button in ButtonList.Buttons)
            {
                value = button.Decode(value);
            }
            return value;
        }

        [ExtenderProvidedProperty]
        [DefaultValue(ButtonWidthDef)]
        public int ButtonWidth
        {
            get { return GetPropertyValue<int>("ButtonWidth", 23); }
            set { SetPropertyValue<int>("ButtonWidth", value); }
        }

        [ExtenderProvidedProperty]
        [DefaultValue(ButtonHeightDef)]
        public int ButtonHeight
        {
            get { return GetPropertyValue<int>("ButtonHeight", 21); }
            set { SetPropertyValue<int>("ButtonHeight", value); }
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            // decode values of textbox
            TextBox txtBox = (TextBox) TargetControl;
            txtBox.Text = DecodeValues(txtBox.Text);
        }
    }

}
