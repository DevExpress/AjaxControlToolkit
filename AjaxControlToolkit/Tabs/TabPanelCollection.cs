#pragma warning disable 1591
using System;
using System.Web.UI;

namespace AjaxControlToolkit {

    public class TabPanelCollection : ControlCollection {

        public TabPanelCollection(Control owner)
            : base(owner) {
        }

        public override void Add(Control child) {
            if(!(child is TabPanel)) {
                throw new ArgumentException("TabPanelCollection can only contain TabPanel controls.");
            }
            base.Add(child);
        }

        public override void AddAt(int index, Control child) {
            if(!(child is TabPanel)) {
                throw new ArgumentException("TabPanelCollection can only contain TabPanel controls.");
            }
            base.AddAt(index, child);
        }

        public new TabPanel this[int index] {
            get { return (TabPanel)base[index]; }
        }
    }
}

#pragma warning restore 1591