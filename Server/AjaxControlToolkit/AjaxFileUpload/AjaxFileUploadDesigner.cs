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
    /// Control Designer for the AjaxFileUpload
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class AjaxFileUploadDesigner : System.Web.UI.Design.ControlDesigner
    {
        /// <summary>
        /// Gets reference of AjaxFileUpload component
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private AjaxControlToolkit.AjaxFileUpload AjaxFileUpload
        {
            get
            {
                return (AjaxControlToolkit.AjaxFileUpload)Component;
            }
        }

        /// <summary>
        /// This returns design time html contents of the control.
        /// </summary>
        /// <param name="regions"></param>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override string GetDesignTimeHtml(DesignerRegionCollection regions)
        {
            StringBuilder sb = new StringBuilder(1024);
            StringWriter sr = new StringWriter(sb, CultureInfo.InvariantCulture);
            HtmlTextWriter writer = new HtmlTextWriter(sr);
            AjaxFileUpload.CreateChilds();
            AjaxFileUpload.RenderControl(writer);
            return sb.ToString();
        }
    }
}
