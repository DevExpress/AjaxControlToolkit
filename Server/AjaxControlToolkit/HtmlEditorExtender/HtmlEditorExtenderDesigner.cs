using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI.Design;
using System.Web.UI.WebControls;
using System.ComponentModel.Design;
using System.Web.UI;
using System.IO;
using System.Globalization;

namespace AjaxControlToolkit
{    
    public class HtmlEditorExtenderDesigner : AjaxControlToolkit.Design.ExtenderControlBaseDesigner<HtmlEditorExtender>
    {
        HtmlEditorExtender ext;
        StringBuilder sbHtmlEditorExtender;
        TextBox targetTextBox;
        StringBuilder sbButtons;

        protected override bool UsePreviewControl
        {
            get { return true; }
        }

        public override string GetDesignTimeHtml(DesignerRegionCollection regions)
        {
            ext = this.Component as HtmlEditorExtender;
                        
            StringWriter sr = new StringWriter();
            HtmlTextWriter writer = new HtmlTextWriter(sr);                        
            ext.RenderControl(writer);            
            return sr.ToString();            
        }

        public override string GetPersistenceContent()
        {
            return "";
        }

        protected override bool Visible
        {
            get { return true; }
        }        
    }
}
