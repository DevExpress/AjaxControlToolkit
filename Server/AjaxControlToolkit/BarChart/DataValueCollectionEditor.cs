using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.Design;

namespace AjaxControlToolkit
{
    /// <summary>
    /// 
    /// </summary>
    public class DataValueCollectionEditor : CollectionEditor
    {
        public DataValueCollectionEditor(Type type)
            : base(type)
        {
        }

        protected override Type[] CreateNewItemTypes()
        {
            return new Type[] { typeof(DataValue) };
        }

        protected override bool CanSelectMultipleInstances()
        {
            return false;
        }
    }
}