using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AjaxControlToolkit.Reference.Core {
    public class LinkHelper {
        public static string GetSampleSiteLink(string typeName) {
            var pageName = typeName.Replace("Extender", "");

            if(typeName == "HtmlEditorExtender")
                pageName += "Extender";

            if(typeName == "TabContainer"
                ||
                typeName == "TabPanel")
                pageName = "Tabs";

            if(typeName == "MaskedEditValidator")
                pageName = "MaskedEdit";

            return String.Format("http://ajaxcontroltoolkit.devexpress.com/{0}/{0}.aspx", pageName);
        }
    }
}