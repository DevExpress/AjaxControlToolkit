using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI.Design;

namespace AjaxControlToolkit
{
    public class HtmlEditorExtenderDesigner : ControlDesigner
    {
        HtmlEditorExtender extender = null;
        public override void Initialize(System.ComponentModel.IComponent component)
        {
            base.Initialize(component);
            extender = component as HtmlEditorExtender;
            if (extender == null)
                throw new Exception("Control must be a HTML Editor Extender");
        }

        public override string GetDesignTimeHtml()
        {
            return "DUMMY TEST HTML DESIGN VIEW";
        }
    }
}
