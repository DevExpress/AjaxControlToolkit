using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.Design;

namespace AjaxControlToolkit
{
    public class BubbleChartValueCollectionEditor : CollectionEditor
    {
        public BubbleChartValueCollectionEditor(Type type)
            : base(type)
        {
        }

        protected override Type[] CreateNewItemTypes()
        {
            return new Type[] { typeof(BubbleChartValue) };            
        }

        protected override bool CanSelectMultipleInstances()
        {
            return false;
        }
    }
}
