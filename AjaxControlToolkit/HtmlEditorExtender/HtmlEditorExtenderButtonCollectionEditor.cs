#pragma warning disable 1591
using System;
using System.ComponentModel.Design;

namespace AjaxControlToolkit {
    public class HtmlEditorExtenderButtonCollectionEditor : CollectionEditor {
        public HtmlEditorExtenderButtonCollectionEditor(Type type)
            : base(type) {
        }

        protected override Type[] CreateNewItemTypes() {
            return new Type[] {
                typeof( Undo),
                typeof( Redo),
                typeof( Bold),
                typeof( Italic),
                typeof( Underline),
                typeof( StrikeThrough),
                typeof( Subscript),
                typeof( Superscript),
                typeof( JustifyLeft),
                typeof( JustifyCenter),
                typeof( JustifyRight),
                typeof( JustifyFull),
                typeof( InsertOrderedList),
                typeof( InsertUnorderedList),
                typeof( RemoveFormat),
                typeof( SelectAll),
                typeof( UnSelect),
                typeof( Delete),
                typeof( Cut),
                typeof( Copy),
                typeof( Paste),
                typeof( BackgroundColorSelector),
                typeof( ForeColorSelector),
                typeof( FontNameSelector),
                typeof( FontSizeSelector),
                typeof( Indent),
                typeof( Outdent),
                typeof( InsertHorizontalRule),
                typeof(HorizontalSeparator),
                typeof(InsertImage)
            };
        }

        protected override bool CanSelectMultipleInstances() {
            return false;
        }
    }
}
#pragma warning restore 1591