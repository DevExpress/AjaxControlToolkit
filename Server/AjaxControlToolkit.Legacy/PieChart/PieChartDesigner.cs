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
using System.Globalization;
using System.ComponentModel.Design.Serialization;
using System.IO;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Control Designer for the PieChart
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class PieChartDesigner : System.Web.UI.Design.ControlDesigner
    {
        /// <summary>
        /// Gets reference of PieChart component
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private AjaxControlToolkit.PieChart PieChart
        {
            get
            {
                return (AjaxControlToolkit.PieChart)Component;
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
            sb.Append(string.Format("<div style=\"width: {0}px; height:{1}px;border-style: solid; border-width: 1px;\">", PieChart.ChartWidth, PieChart.ChartHeight));
            StringWriter sr = new StringWriter(sb, CultureInfo.InvariantCulture);
            HtmlTextWriter writer = new HtmlTextWriter(sr);
            PieChart.CreateChilds();
            PieChart.RenderControl(writer);
            return sb.ToString();
        }
    }
}
