

using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Basic collection of ProfilePropertyBindings.
    /// 
    /// We need a special collection here to do notification back to the owning object so that
    /// the designer knows when things changed.
    /// 
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1010:CollectionsShouldImplementGenericInterface", Justification = "IList<T> has a number of unnecessary methods for this special-purpose class")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1035:ICollectionImplementationsHaveStronglyTypedMembers", Justification="As above")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1039:ListsAreStronglyTyped", Justification="As above")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1058:TypesShouldNotExtendCertainBaseTypes", Justification="As above")]
    public class ProfilePropertyBindingCollection : CollectionBase
    {
        internal event EventHandler CollectionChanged;

        internal ProfilePropertyBindingCollection()
        {
        }

        public ProfilePropertyBinding this[int index]
        {
            get
            {
                return (ProfilePropertyBinding)InnerList[index];
            }
            set
            {
                InnerList[index] = value;
            }
        }

        public void Add(ProfilePropertyBinding binding) {
            InnerList.Add(binding);
        }

        public void Insert(int index, ProfilePropertyBinding binding)
        {
            InnerList.Insert(index, binding);
        }

        protected virtual void OnCollectionChanged(EventArgs e)
        {
            if (CollectionChanged != null)
            {
                CollectionChanged(this, e);
            }
        }

        public void Remove(ProfilePropertyBinding binding) {
            InnerList.Remove(binding);
        }

        protected override void OnInsertComplete(int index, object value)
        {
            base.OnInsertComplete(index, value);
            OnCollectionChanged(EventArgs.Empty);
        }

        protected override void OnSetComplete(int index, object oldValue, object newValue)
        {
            base.OnSetComplete(index, oldValue, newValue);
            OnCollectionChanged(EventArgs.Empty);
        }

        protected override void OnRemoveComplete(int index, object value)
        {
            base.OnRemoveComplete(index, value);
            OnCollectionChanged(EventArgs.Empty);
        }

        protected override void OnClearComplete()
        {
            base.OnClearComplete();
            OnCollectionChanged(EventArgs.Empty);
        }
    }
}
