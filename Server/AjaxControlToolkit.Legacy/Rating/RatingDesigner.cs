


using System.Web.UI.WebControls;
using System.Web.UI;

using AjaxControlToolkit.Design;
using System.ComponentModel.Design;
using System.Collections.Generic;
using System.Web.UI.Design;
using System.Drawing.Design;
using System.ComponentModel;
using System.Windows.Forms.Design;
using System;


namespace AjaxControlToolkit
{

    class RatingDesigner : System.Web.UI.Design.ControlDesigner
    {
        private DesignerActionListCollection _actionLists;

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public RatingDesigner()
        {
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override DesignerActionListCollection ActionLists
        {
            get
            {
                if (_actionLists == null)
                {
                    _actionLists = new DesignerActionListCollection();
                    _actionLists.AddRange(base.ActionLists);

                    // Add a custom DesignerActionList
                    _actionLists.Add(new ActionList(this));
                }
                return _actionLists;
            }
        }

        public class ActionList : DesignerActionList
        {
            private RatingDesigner _parent;
            private DesignerActionItemCollection _items;

            // Constructor
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            public ActionList(RatingDesigner parent)
                : base(parent.Component)
            {
                _parent = parent;

            }
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Use in GetSortedActionItems")]
            [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods")]
            public int StartRating
            {
                get
                {
                    return ((Rating)_parent.Component).CurrentRating;
                }
                set
                {
                    try
                    {
                        PropertyDescriptor propDesc = TypeDescriptor.GetProperties(_parent.Component)["CurrentRating"];
                        propDesc.SetValue(_parent.Component, value);
                    }
                    catch 
                    {
                        throw;
                    }
                }
            }
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Use in GetSortedActionItems")]
            [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods")]
            public int MaxRating
            {
                get
                {
                    return ((Rating)_parent.Component).MaxRating;
                }
                set 
                {
                    try
                    {
                        PropertyDescriptor propDesc = TypeDescriptor.GetProperties(_parent.Component)["MaxRating"];
                        propDesc.SetValue(_parent.Component, value);
                    }
                    catch
                    {
                        throw;
                    }
                }
            }
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Use in GetSortedActionItems")]
            [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods")]
            public bool RealOnly
            {
                get
                {
                    return ((Rating)_parent.Component).ReadOnly;
                }
                set
                {
                    PropertyDescriptor propDesc = TypeDescriptor.GetProperties(_parent.Component)["ReadOnly"];
                    propDesc.SetValue(_parent.Component, value);
                }
            }
            
            // Create the ActionItem collection
            [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods")]
            public override DesignerActionItemCollection GetSortedActionItems()
            {
                if (_items == null)
                {
                    _items = new DesignerActionItemCollection();
                    //Add PropertyItem
                    _items.Add(new DesignerActionPropertyItem("StartRating", "Initial Rating"));
                    _items.Add(new DesignerActionPropertyItem("MaxRating", "Maximum Rating"));
                    _items.Add(new DesignerActionPropertyItem("RealOnly", "Read-only"));
                    //Add MethodItem
                    _items.Add(new DesignerActionMethodItem(this, "Alignment", "Switch Align"));
                    _items.Add(new DesignerActionMethodItem(this, "Direction", "Switch Direction"));

                }
                return _items;
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods")]
            [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
            private void Alignment()
            {

                Rating rating = ((Rating)_parent.Component);

                // Get a reference to the control's Alignment property
                PropertyDescriptor propDesc = TypeDescriptor.GetProperties(rating)["RatingAlign"];

                //Switch
                if (rating.RatingAlign == Orientation.Horizontal)
                    propDesc.SetValue(rating, Orientation.Vertical);
                else
                    propDesc.SetValue(rating, Orientation.Horizontal);
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods")]
            [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
            private void Direction()
            {

                Rating rating = ((Rating)_parent.Component);

                // Get a reference to the control's Alignment property
                PropertyDescriptor propDesc = TypeDescriptor.GetProperties(rating)["RatingDirection"];

                //Switch
                if (rating.RatingDirection == RatingDirection.LeftToRightTopToBottom)
                    propDesc.SetValue(rating, RatingDirection.RightToLeftBottomToTop);
                else
                    propDesc.SetValue(rating, RatingDirection.LeftToRightTopToBottom);
            }

        }
    }
}
