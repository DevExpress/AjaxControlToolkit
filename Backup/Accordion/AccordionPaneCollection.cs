

using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Web;
using System.Web.UI;

namespace AjaxControlToolkit
{
    /// <summary>
    /// The AccordionPaneCollection is used to wrap the Accordion.Controls collection
    /// and provide an AccordionPane only view.
    /// </summary>
    public sealed class AccordionPaneCollection : IList, IEnumerable<AccordionPane>
    {
        /// <summary>
        /// Parent Accordion whose Controls collection we are filtering
        /// </summary>
        private Accordion _parent;

        /// <summary>
        /// Counter used to prevent modification of the collection during enumeration
        /// </summary>
        private int _version;

        /// <summary>
        /// Constructor to associate the collection with an Accordion
        /// </summary>
        /// <param name="parent">Parent Accordion</param>
        internal AccordionPaneCollection(Accordion parent)
        {
            if (parent == null)
                throw new ArgumentNullException("parent", "Parent Accordion cannot be null.");
            _parent = parent;
        }

        /// <summary>
        /// Number of AccordionPanes in the parent Accordion's Controls collection
        /// </summary>
        public int Count
        {
            get
            {
                int panes = 0;
                foreach (Control c in _parent.Controls)
                    if (c is AccordionPane)
                        panes++;
                return panes;
            }
        }

        /// <summary>
        /// The collection is not read-only so this always returns false
        /// </summary>
        public bool IsReadOnly
        {
            get { return false; }
        }

        /// <summary>
        /// Index the AccordionPanes, or raise an ArgumentException if
        /// the index is invalid
        /// </summary>
        /// <param name="index">Index</param>
        /// <returns>AccordionPane</returns>
        public AccordionPane this[int index]
        {
            get { return _parent.Controls[ToRawIndex(index)] as AccordionPane; }
        }

        /// <summary>
        /// Index the AccordionPanes by their Control.IDs.  We will return null
        /// if the desired pane is not found.
        /// </summary>
        /// <param name="id">AccordionPane Control ID</param>
        /// <returns>AccordionPane, or null if not found</returns>
        public AccordionPane this[string id]
        {
            get
            {
                for (int i = 0; i < _parent.Controls.Count; i++)
                {
                    AccordionPane pane = _parent.Controls[i] as AccordionPane;
                    if (pane != null && pane.ID == id)
                        return pane;
                }
                return null;
            }
        }

        /// <summary>
        /// Since the Accordion.Controls collection may contain other controls than
        /// just AccordionPanes, we need to adjust the index for these additional controls.
        /// </summary>
        /// <param name="paneIndex">Index of the desired AccordionPane</param>
        /// <returns>Raw index in the Accordion.Controls collection</returns>
        [SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        private int ToRawIndex(int paneIndex)
        {
            if (paneIndex < 0)
                return -1;
            int paneCount = -1;
            for (int i = 0; i < _parent.Controls.Count; i++)
                if (_parent.Controls[i] is AccordionPane && ++paneCount == paneIndex)
                    return i;
            throw new ArgumentException(String.Format(CultureInfo.CurrentCulture, "No AccordionPane at position {0}", paneIndex));
        }

        /// <summary>
        /// Given an index in the parent Accordion.Controls collection, we determine
        /// its index in the collection of AccordionPanes
        /// </summary>
        /// <param name="index">Index in the Controls collection</param>
        /// <returns>Index in the AccordionPaneCollection</returns>
        [SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        private int FromRawIndex(int index)
        {
            if (index < 0)
                return -1;
            int paneCount = -1;
            for (int i = 0; i < _parent.Controls.Count; i++)
            {
                if (_parent.Controls[i] is AccordionPane)
                    paneCount++;
                if (index == i)
                    return paneCount;
            }
            throw new ArgumentException(String.Format(CultureInfo.CurrentCulture, "No AccordionPane at position {0}", index));
        }

        /// <summary>
        /// Add a new AccordionPane to the collection
        /// </summary>
        /// <param name="item">AccordionPane</param>
        public void Add(AccordionPane item)
        {
            _parent.Controls.Add(item);
            _version++;
        }

        /// <summary>
        /// Clear the AccordionPanes in the collection
        /// </summary>
        public void Clear()
        {
            _parent.ClearPanes();
            _version++;
        }

        /// <summary>
        /// Check if the collection contains the desired AccordionPane
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public bool Contains(AccordionPane item)
        {
            return _parent.Controls.Contains(item);
        }

        /// <summary>
        /// Copy the collection into an array
        /// </summary>
        /// <param name="array">Array (of AccordionPanes)</param>
        /// <param name="index">Index to begin copying</param>
        [SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public void CopyTo(Array array, int index)
        {
            AccordionPane[] panes = array as AccordionPane[];
            if (panes == null)
                throw new ArgumentException("Expected an array of AccordionPanes.");
            CopyTo(panes, index);
        }

        /// <summary>
        /// Copy the collection into an array
        /// </summary>
        /// <param name="array">Arrray</param>
        /// <param name="arrayIndex">Index to begin copying</param>
        [SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public void CopyTo(AccordionPane[] array, int index)
        {
            if (array == null)
                throw new ArgumentNullException("array", "Cannot copy into a null array.");

            int offset = 0;
            for (int i = 0; i < _parent.Controls.Count; i++)
            {
                AccordionPane pane = _parent.Controls[i] as AccordionPane;
                if (pane != null)
                {
                    if (offset + index == array.Length)
                        throw new ArgumentException("Array is not large enough for the AccordionPanes");
                    array[offset++ + index] = pane;
                }
            }
        }

        /// <summary>
        /// Get the index of the AccordionPane in the list
        /// </summary>
        /// <param name="item">AccordionPane</param>
        /// <returns>Index of the AccordionPane</returns>
        public int IndexOf(AccordionPane item)
        {
            return FromRawIndex(_parent.Controls.IndexOf(item));
        }

        /// <summary>
        /// Insert a new AccordionPane at the given index
        /// </summary>
        /// <param name="index">Index</param>
        /// <param name="item">AccordionPane to insert</param>
        public void Insert(int index, AccordionPane item)
        {
            _parent.Controls.AddAt(ToRawIndex(index), item);
            _version++;
        }

        /// <summary>
        /// Remove an AccordionPane from the collection
        /// </summary>
        /// <param name="item">AccordionPane</param>
        /// <returns>True if we were able to remove, false otherwise</returns>
        public void Remove(AccordionPane item)
        {
            _parent.Controls.Remove(item);
            _version++;
        }

        /// <summary>
        /// Remove the AccordionPane at the given index from the collection
        /// </summary>
        /// <param name="index">Index of the AccordionPane to remove</param>
        public void RemoveAt(int index)
        {
            _parent.Controls.RemoveAt(ToRawIndex(index));
            _version++;
        }

        /// <summary>
        /// Add an AccordionPane to the list
        /// </summary>
        /// <param name="value">AccordionPane</param>
        /// <returns>Always returns 0</returns>
        int IList.Add(object value)
        {
            Add(value as AccordionPane);
            return 0;
        }

        /// <summary>
        /// Check if the list contains the AccordionPane
        /// </summary>
        /// <param name="value">AccordionPane</param>
        /// <returns>True if it contains the pane, false otherwise</returns>
        bool IList.Contains(object value)
        {
            return Contains(value as AccordionPane);
        }

        /// <summary>
        /// Get the inded of the provided AccordionPane
        /// </summary>
        /// <param name="value">AccordionPane</param>
        /// <returns>Index of the AccordionPane</returns>
        int IList.IndexOf(object value)
        {
            return IndexOf(value as AccordionPane);
        }

        /// <summary>
        /// Insert an AccordionPane at the given index
        /// </summary>
        /// <param name="index">Index</param>
        /// <param name="value">AccordionPane</param>
        void IList.Insert(int index, object value)
        {
            Insert(index, value as AccordionPane);
        }

        /// <summary>
        /// The collection is not a fixed size, so this
        /// always returns false
        /// </summary>
        bool IList.IsFixedSize
        {
            get { return false; }
        }

        /// <summary>
        /// Remove an AccordionPane from the list
        /// </summary>
        /// <param name="value">AccordionPane</param>
        void IList.Remove(object value)
        {
            Remove(value as AccordionPane);
        }

        /// <summary>
        /// Get an AccordionPane given its index
        /// </summary>
        /// <param name="index">Index</param>
        /// <returns>AccordionPane</returns>
        object IList.this[int index]
        {
            get { return this[index]; }
            set { }
        }

        /// <summary>
        /// This collection is not synchronized, so it always returns false
        /// </summary>
        bool ICollection.IsSynchronized
        {
            get { return false; }
        }

        /// <summary>
        /// This collection is not synchronized, so this always throws a
        /// NotImplementedException
        /// </summary>
        object ICollection.SyncRoot
        {
            get { throw new NotImplementedException(); }
        }

        /// <summary>
        /// Get an enumerator for the collection
        /// </summary>
        /// <returns>Enumerator</returns>
        IEnumerator IEnumerable.GetEnumerator()
        {
            return new AccordionPaneEnumerator(this);
        }

        /// <summary>
        /// Get an enumerator for the collection
        /// </summary>
        /// <returns>Enumerator</returns>
        public IEnumerator<AccordionPane> GetEnumerator()
        {
            return new AccordionPaneEnumerator(this);
        }

        /// <summary>
        /// Enumerator for the AccordionPaneCollection
        /// </summary>
        private class AccordionPaneEnumerator : IEnumerator<AccordionPane>
        {
            /// <summary>
            /// Reference to the collection
            /// </summary>
            private AccordionPaneCollection _collection;

            /// <summary>
            /// Enumerator for the parent Accordion.Controls collection
            /// </summary>
            private IEnumerator _parentEnumerator;

            /// <summary>
            /// Version of the collection when we began enumeration
            /// (used to check for modifications of the collection)
            /// </summary>
            private int _version;

            /// <summary>
            /// Constructor
            /// </summary>
            /// <param name="parent">AccordionPaneCollection</param>
            public AccordionPaneEnumerator(AccordionPaneCollection parent)
            {
                _collection = parent;
                _parentEnumerator = parent._parent.Controls.GetEnumerator();
                _version = parent._version;
            }

            /// <summary>
            /// Ensure the collection has not been modified while enumerating
            /// </summary>
            [SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
            private void CheckVersion()
            {
                if (_version != _collection._version)
                    throw new InvalidOperationException("Enumeration can't continue because the collection has been modified.");
            }

            /// <summary>
            /// Dispose of the enumerator
            /// </summary>
            public void Dispose()
            {
                _parentEnumerator = null;
                _collection = null;
                GC.SuppressFinalize(this);
            }

            /// <summary>
            /// Current AccordionPane
            /// </summary>
            public AccordionPane Current
            {
                get
                {
                    CheckVersion();
                    return _parentEnumerator.Current as AccordionPane;
                }
            }

            /// <summary>
            /// Current AccordionPane
            /// </summary>
            object IEnumerator.Current
            {
                get { return Current; }
            }

            /// <summary>
            /// Move to the next AccordionPane
            /// </summary>
            /// <returns>True if we were able to move, false otherwise</returns>
            public bool MoveNext()
            {
                CheckVersion();
                bool result = _parentEnumerator.MoveNext();
                if (result && !(_parentEnumerator.Current is AccordionPane))
                    result = MoveNext();
                return result;
            }

            /// <summary>
            /// Reset the enumerator to the beginning of the list
            /// </summary>
            public void Reset()
            {
                CheckVersion();
                _parentEnumerator.Reset();
            }
        }
    }
}