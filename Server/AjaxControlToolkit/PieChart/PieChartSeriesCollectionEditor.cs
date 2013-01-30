using System;
using System.ComponentModel.Design;

namespace AjaxControlToolkit
{
    /// <summary>
    /// 
    /// </summary>
    public class PieChartSeriesCollectionEditor : CollectionEditor
    {
        public PieChartSeriesCollectionEditor(Type type)
            : base(type)
        {
        }

        protected override Type[] CreateNewItemTypes()
        {
            return new Type[] { typeof(PieChartSeries) };
        }

        protected override bool CanSelectMultipleInstances()
        {
            return false;
        }
    }
}