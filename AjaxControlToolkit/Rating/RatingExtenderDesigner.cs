using System.ComponentModel;
using System.ComponentModel.Design;
using System.Web.UI.Design;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Design {

    class RatingExtenderDesigner : ControlDesigner {
        DesignerActionListCollection _actionLists;

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

        public class ActionList : DesignerActionList {
            RatingExtenderDesigner _parent;
            DesignerActionItemCollection _items;

            public ActionList(RatingExtenderDesigner parent)
                : base(parent.Component) {
                _parent = parent;
            }

            public int StartRating {
                get { return ((Rating)_parent.Component).CurrentRating; }
                set {
                    try {
                        var propDesc = TypeDescriptor.GetProperties(_parent.Component)["CurrentRating"];
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
                        var propDesc = TypeDescriptor.GetProperties(_parent.Component)["MaxRating"];
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
                    var propDesc = TypeDescriptor.GetProperties(_parent.Component)["ReadOnly"];
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

            void Alignment() {
                var rating = ((Rating)_parent.Component);

                // Get a reference to the control's Alignment property
                var propDesc = TypeDescriptor.GetProperties(rating)["RatingAlign"];

                //Switch
                if(rating.RatingAlign == Orientation.Horizontal)
                    propDesc.SetValue(rating, Orientation.Vertical);
                else
                    propDesc.SetValue(rating, Orientation.Horizontal);
            }

            void Direction() {
                var rating = ((Rating)_parent.Component);

                // Get a reference to the control's Alignment property
                var propDesc = TypeDescriptor.GetProperties(rating)["RatingDirection"];

                //Switch
                if(rating.RatingDirection == RatingDirection.LeftToRightTopToBottom)
                    propDesc.SetValue(rating, RatingDirection.RightToLeftBottomToTop);
                else
                    propDesc.SetValue(rating, RatingDirection.LeftToRightTopToBottom);
            }
        }
    }

}
