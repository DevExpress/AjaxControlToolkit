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

    public class ChartBaseDesigner : ControlDesigner {

        public override string GetDesignTimeHtml(DesignerRegionCollection regions) {
            var chart = (ChartBase)Component;
            var stringBuilder = new StringBuilder(1024);
            stringBuilder.AppendFormat("<div style=\"width: {0}px; height:{1}px;border-style: solid; border-width: 1px;\">", chart.ChartWidth, chart.ChartHeight);

            return stringBuilder.ToString();
        }

    }

}
#pragma warning restore 1591