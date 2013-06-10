using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.Design;

namespace AjaxControlToolkit
{
    public class BarChartSeriesCollectionEditor : CollectionEditor
    {
        public BarChartSeriesCollectionEditor(Type type)
            : base(type)
        {
        }

        protected override Type[] CreateNewItemTypes()
        {
            return new Type[]{ typeof(BarChartSeries)};            
        }

        protected override bool CanSelectMultipleInstances()
        {
            return false;
        }
    }
}
