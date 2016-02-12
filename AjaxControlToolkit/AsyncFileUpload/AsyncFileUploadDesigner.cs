#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Web.UI.Design;

namespace AjaxControlToolkit.Design {

    public class AsyncFileUploadDesigner : ControlDesigner {

        public override string GetDesignTimeHtml(DesignerRegionCollection regions) {
            var asyncFileUpload = (AsyncFileUpload)Component;

            var sb = new StringBuilder(1024);
            var sr = new StringWriter(sb, CultureInfo.InvariantCulture);
            var writer = new HtmlTextWriter(sr);
            asyncFileUpload.CreateChilds();
            asyncFileUpload.RenderControl(writer);

            return sb.ToString();
        }
    }

}
#pragma warning restore 1591