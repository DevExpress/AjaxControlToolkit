using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI.Design;
using System.ComponentModel.Design;

namespace AjaxControlToolkit
{
    // STILL IN RESEARCH MODE
    public class HtmlEditorExtenderDesigner : AjaxControlToolkit.Design.ExtenderControlBaseDesigner<HtmlEditorExtender>
    {        
        protected override bool UsePreviewControl
        {
            get { return true; }
        }

        public override string GetDesignTimeHtml(DesignerRegionCollection regions)
        {
            return "RESEARCH: TEST HTML DESIGN VIEW DesignerRegionCollection";
        }

        public override string GetPersistenceContent()
        {
            return "RESEARCH: PERSIST CONTENTS";
        }

        protected override bool Visible
        {
            get { return true; }
        }
    }
}
