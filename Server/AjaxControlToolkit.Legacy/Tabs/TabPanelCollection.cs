using System;
using System.Web.UI;

namespace AjaxControlToolkit
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1035:ICollectionImplementationsHaveStronglyTypedMembers", Justification="Unnecessary for this specialized class")]
    public class TabPanelCollection : ControlCollection
    {
        public TabPanelCollection(Control owner)
            : base(owner)
        {
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public override void Add(Control child)
        {
            if (!(child is TabPanel))
            {
                throw new ArgumentException("TabPanelCollection can only contain TabPanel controls.");
            }
            base.Add(child);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public override void AddAt(int index, Control child)
        {
            if (!(child is TabPanel))
            {
                throw new ArgumentException("TabPanelCollection can only contain TabPanel controls.");
            }
            base.AddAt(index, child);
        }

        public new TabPanel this[int index]
        {
            get { return (TabPanel)base[index]; }
        }
    }
}
