using System;
using System.ComponentModel.Design;

namespace AjaxControlToolkit
{
    /// <summary>
    /// 
    /// </summary>
    public class AreaChartSeriesCollectionEditor : CollectionEditor
    {
        public AreaChartSeriesCollectionEditor(Type type)
            : base(type)
        {
        }

        protected override Type[] CreateNewItemTypes()
        {
            return new Type[] { typeof(AreaChartSeries) };
        }

        protected override bool CanSelectMultipleInstances()
        {
            return false;
        }
    }
}
