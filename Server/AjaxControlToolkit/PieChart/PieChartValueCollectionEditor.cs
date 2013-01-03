using System;
using System.ComponentModel.Design;

namespace AjaxControlToolkit
{
    /// <summary>
    /// 
    /// </summary>
    public class PieChartValueCollectionEditor : CollectionEditor
    {
        public PieChartValueCollectionEditor(Type type)
            : base(type)
        {
        }

        protected override Type[] CreateNewItemTypes()
        {
            return new Type[] { typeof(PieChartValue) };
        }

        protected override bool CanSelectMultipleInstances()
        {
            return false;
        }
    }
}
