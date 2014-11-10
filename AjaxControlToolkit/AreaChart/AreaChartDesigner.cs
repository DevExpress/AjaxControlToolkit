using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Web.UI.Design;

namespace AjaxControlToolkit.Design {

    public class AreaChartDesigner : ControlDesigner {

        AreaChart AreaChart {
            get { return (AreaChart)Component; }
        }

        public override string GetDesignTimeHtml(DesignerRegionCollection regions) {
            var sb = new StringBuilder(1024);
            sb.Append(String.Format("<div style=\"width: {0}px; height: {1}px;border-style: solid; border-width: 1px;\">", AreaChart.ChartWidth, AreaChart.ChartHeight));
            var sr = new StringWriter(sb, CultureInfo.InvariantCulture);
            var writer = new HtmlTextWriter(sr);
            AreaChart.CreateChilds();
            AreaChart.RenderControl(writer);
            return sb.ToString();
        }
    }

}