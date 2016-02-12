#pragma warning disable 1591
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Web;
using System.Web.UI;

namespace AjaxControlToolkit {

    // The AccordionPaneCollection is used to wrap the Accordion.Controls collection
    // and provide an AccordionPane only view.
    public sealed class AccordionPaneCollection : IList, IEnumerable<AccordionPane> {
        // Parent Accordion whose Controls collection we are filtering
        Accordion _parent;

        // Counter used to prevent modification of the collection during enumeration
        int _version;

        internal AccordionPaneCollection(Accordion parent) {
            if(parent == null)
                throw new ArgumentNullException("parent", "Parent Accordion cannot be null.");
            _parent = parent;
        }

        // Number of AccordionPanes in the parent Accordion's Controls collection
        public int Count {
            get {
                var panes = 0;
                foreach(var c in _parent.Controls)
                    if(c is AccordionPane)
                        panes++;
                return panes;
            }
        }

        public bool IsReadOnly {
            get { return false; }
        }

        // Index the AccordionPanes, or raise an ArgumentException if
        // the index is invalid
        public AccordionPane this[int index] {
            get { return _parent.Controls[ToRawIndex(index)] as AccordionPane; }
        }

        // Index the AccordionPanes by their Control.IDs.  We will return null
        // if the desired pane is not found.
        public AccordionPane this[string id] {
            get {
                for(var i = 0; i < _parent.Controls.Count; i++) {
                    var pane = _parent.Controls[i] as AccordionPane;
                    if(pane != null && pane.ID == id)
                        return pane;
                }
                return null;
            }
        }

        // Since the Accordion.Controls collection may contain other controls than
        // just AccordionPanes, we need to adjust the index for these additional controls.                
        int ToRawIndex(int paneIndex) {
            if(paneIndex < 0)
                return -1;
            var paneCount = -1;
            for(var i = 0; i < _parent.Controls.Count; i++)
                if(_parent.Controls[i] is AccordionPane && ++paneCount == paneIndex)
                    return i;
            throw new ArgumentException(String.Format(CultureInfo.CurrentCulture, "No AccordionPane at position {0}", paneIndex));
        }

        // Given an index in the parent Accordion.Controls collection, we determine
        // its index in the collection of AccordionPanes
        int FromRawIndex(int index) {
            if(index < 0)
                return -1;
            var paneCount = -1;
            for(var i = 0; i < _parent.Controls.Count; i++) {
                if(_parent.Controls[i] is AccordionPane)
                    paneCount++;
                if(index == i)
                    return paneCount;
            }
            throw new ArgumentException(String.Format(CultureInfo.CurrentCulture, "No AccordionPane at position {0}", index));
        }

        public void Add(AccordionPane item) {
            _parent.Controls.Add(item);
            _version++;
        }

        public void Clear() {
            _parent.ClearPanes();
            _version++;
        }

        public bool Contains(AccordionPane item) {
            return _parent.Controls.Contains(item);
        }

        public void CopyTo(Array array, int index) {
            var panes = array as AccordionPane[];
            if(panes == null)
                throw new ArgumentException("Expected an array of AccordionPanes.");
            CopyTo(panes, index);
        }

        public void CopyTo(AccordionPane[] array, int index) {
            if(array == null)
                throw new ArgumentNullException("array", "Cannot copy into a null array.");

            var offset = 0;
            for(var i = 0; i < _parent.Controls.Count; i++) {
                var pane = _parent.Controls[i] as AccordionPane;
                if(pane != null) {
                    if(offset + index == array.Length)
                        throw new ArgumentException("Array is not large enough for the AccordionPanes");
                    array[offset++ + index] = pane;
                }
            }
        }

        public int IndexOf(AccordionPane item) {
            return FromRawIndex(_parent.Controls.IndexOf(item));
        }

        public void Insert(int index, AccordionPane item) {
            _parent.Controls.AddAt(ToRawIndex(index), item);
            _version++;
        }

        public void Remove(AccordionPane item) {
            _parent.Controls.Remove(item);
            _version++;
        }

        public void RemoveAt(int index) {
            _parent.Controls.RemoveAt(ToRawIndex(index));
            _version++;
        }

        int IList.Add(object value) {
            Add(value as AccordionPane);
            return 0;
        }

        bool IList.Contains(object value) {
            return Contains(value as AccordionPane);
        }

        int IList.IndexOf(object value) {
            return IndexOf(value as AccordionPane);
        }

        void IList.Insert(int index, object value) {
            Insert(index, value as AccordionPane);
        }

        bool IList.IsFixedSize {
            get { return false; }
        }

        void IList.Remove(object value) {
            Remove(value as AccordionPane);
        }

        object IList.this[int index] {
            get { return this[index]; }
            set { }
        }

        bool ICollection.IsSynchronized {
            get { return false; }
        }

        object ICollection.SyncRoot {
            get { throw new NotImplementedException(); }
        }

        IEnumerator IEnumerable.GetEnumerator() {
            return new AccordionPaneEnumerator(this);
        }

        public IEnumerator<AccordionPane> GetEnumerator() {
            return new AccordionPaneEnumerator(this);
        }


        private class AccordionPaneEnumerator : IEnumerator<AccordionPane> {
            AccordionPaneCollection _collection;
            IEnumerator _parentEnumerator;

            // Version of the collection when we began enumeration
            // (used to check for modifications of the collection)
            int _version;

            public AccordionPaneEnumerator(AccordionPaneCollection parent) {
                _collection = parent;
                _parentEnumerator = parent._parent.Controls.GetEnumerator();
                _version = parent._version;
            }

            // Ensure the collection has not been modified while enumerating
            void CheckVersion() {
                if(_version != _collection._version)
                    throw new InvalidOperationException("Enumeration can't continue because the collection has been modified.");
            }

            public void Dispose() {
                _parentEnumerator = null;
                _collection = null;
                GC.SuppressFinalize(this);
            }

            public AccordionPane Current {
                get {
                    CheckVersion();
                    return _parentEnumerator.Current as AccordionPane;
                }
            }

            object IEnumerator.Current {
                get { return Current; }
            }

            public bool MoveNext() {
                CheckVersion();
                var result = _parentEnumerator.MoveNext();
                if(result && !(_parentEnumerator.Current is AccordionPane))
                    result = MoveNext();
                return result;
            }

            public void Reset() {
                CheckVersion();
                _parentEnumerator.Reset();
            }
        }
    }

}
#pragma warning restore 1591