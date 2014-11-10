using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Web.UI.Design;

namespace AjaxControlToolkit.Design {

    public class BubbleChartDesigner : ControlDesigner {

        AjaxControlToolkit.BubbleChart BubbleChart {
            get { return (AjaxControlToolkit.BubbleChart)Component; }
        }

        public override string GetDesignTimeHtml(DesignerRegionCollection regions) {
            var sb = new StringBuilder(1024);
            sb.Append(string.Format("<div style=\"width: {0}px; height:{1}px;border-style: solid; border-width: 1px;\">", BubbleChart.ChartWidth, BubbleChart.ChartHeight));
            var sr = new StringWriter(sb, CultureInfo.InvariantCulture);
            var writer = new HtmlTextWriter(sr);
            BubbleChart.CreateChilds();
            BubbleChart.RenderControl(writer);
            return sb.ToString();
        }
    }

}