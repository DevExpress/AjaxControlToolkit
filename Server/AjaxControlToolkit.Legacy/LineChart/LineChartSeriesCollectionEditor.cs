using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.Design;

namespace AjaxControlToolkit
{
    public class LineChartSeriesCollectionEditor : CollectionEditor
    {
        public LineChartSeriesCollectionEditor(Type type)
            : base(type)
        {
        }

        protected override Type[] CreateNewItemTypes()
        {
            return new Type[] { typeof(LineChartSeries) };            
        }

        protected override bool CanSelectMultipleInstances()
        {
            return false;
        }
    }
}
