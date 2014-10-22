using System.ComponentModel;
using System.ComponentModel.Design;
using System.Web.UI.Design;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Design {

    class RatingExtenderDesigner: ControlDesigner {
        private DesignerActionListCollection _actionLists;

        public RatingExtenderDesigner() {
        }

        public override DesignerActionListCollection ActionLists {
            get {
                if(_actionLists == null) {
                    _actionLists = new DesignerActionListCollection();
                    _actionLists.AddRange(base.ActionLists);

                    // Add a custom DesignerActionList
                    _actionLists.Add(new ActionList(this));
                }
                return _actionLists;
            }
        }

        public class ActionList: DesignerActionList {
            private RatingExtenderDesigner _parent;
            private DesignerActionItemCollection _items;

            public ActionList(RatingExtenderDesigner parent)
                : base(parent.Component) {
                _parent = parent;
            }

            public int StartRating {
                get { return ((Rating)_parent.Component).CurrentRating; }
                set {
                    try {
                        PropertyDescriptor propDesc = TypeDescriptor.GetProperties(_parent.Component)["CurrentRating"];
                        propDesc.SetValue(_parent.Component, value);
                    }
                    catch {
                        throw;
                    }
                }
            }

            public int MaxRating {
                get { return ((Rating)_parent.Component).MaxRating; }
                set {
                    try {
                        PropertyDescriptor propDesc = TypeDescriptor.GetProperties(_parent.Component)["MaxRating"];
                        propDesc.SetValue(_parent.Component, value);
                    }
                    catch {
                        throw;
                    }
                }
            }

            public bool RealOnly {
                get { return ((Rating)_parent.Component).ReadOnly; }
                set {
                    PropertyDescriptor propDesc = TypeDescriptor.GetProperties(_parent.Component)["ReadOnly"];
                    propDesc.SetValue(_parent.Component, value);
                }
            }

            // Create the ActionItem collection
            public override DesignerActionItemCollection GetSortedActionItems() {
                if(_items == null) {
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

            private void Alignment() {
                Rating rating = ((Rating)_parent.Component);

                // Get a reference to the control's Alignment property
                PropertyDescriptor propDesc = TypeDescriptor.GetProperties(rating)["RatingAlign"];

                //Switch
                if(rating.RatingAlign == Orientation.Horizontal)
                    propDesc.SetValue(rating, Orientation.Vertical);
                else
                    propDesc.SetValue(rating, Orientation.Horizontal);
            }

            private void Direction() {
                Rating rating = ((Rating)_parent.Component);

                // Get a reference to the control's Alignment property
                PropertyDescriptor propDesc = TypeDescriptor.GetProperties(rating)["RatingDirection"];

                //Switch
                if(rating.RatingDirection == RatingDirection.LeftToRightTopToBottom)
                    propDesc.SetValue(rating, RatingDirection.RightToLeftBottomToTop);
                else
                    propDesc.SetValue(rating, RatingDirection.LeftToRightTopToBottom);
            }
        }
    }

}
