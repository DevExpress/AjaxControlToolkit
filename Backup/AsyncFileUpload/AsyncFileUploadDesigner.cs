using System.Web.UI.WebControls;
using System.Web.UI;
using System.Web.UI.Design;
using AjaxControlToolkit;
using AjaxControlToolkit.Design;
using System.ComponentModel;
using System.Collections.Generic;
using System;
using System.ComponentModel.Design;
using System.Windows.Forms.Design;
using System.Windows.Forms;
using System.Text;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.ComponentModel.Design.Serialization;
using System.IO;


namespace AjaxControlToolkit
{
    /// <summary>
    /// Control Designer for the TabContainer
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class AsyncFileUploadDesigner : System.Web.UI.Design.ControlDesigner
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private AjaxControlToolkit.AsyncFileUpload AsyncFileUpload
        {
            get
            {
                return (AjaxControlToolkit.AsyncFileUpload)Component;
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override string GetDesignTimeHtml(DesignerRegionCollection regions)
        {
            StringBuilder sb = new StringBuilder(1024);
            StringWriter sr = new StringWriter(sb, CultureInfo.InvariantCulture);
            HtmlTextWriter writer = new HtmlTextWriter(sr);
            AsyncFileUpload.CreateChilds();
            AsyncFileUpload.RenderControl(writer);
            return sb.ToString();
        }
    }
}
