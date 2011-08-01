using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.UI;
using System.ComponentModel;

namespace AjaxControlToolkit {
    /// <summary>
    /// All toolbar buttons for HtmlEditorExtender will be derived from this class.
    /// </summary>
    //[ToolboxItem(false)]
    public abstract class HtmlEditorExtenderButton //: Control
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public abstract string CommandName { get; }

        /// <summary>
        /// get value to show tooltip for the button
        /// </summary>
        public virtual string Tooltip { get { return CommandName; } }
    }

    #region button classes

    /// <summary>
    /// Bold class represents to bold tag
    /// </summary>
    public class Bold : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Bold"; }
        }
    }

    /// <summary>
    /// Italic class represents to italic tag
    /// </summary>
    public class Italic : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Italic"; }
        }
    }

    /// <summary>
    /// Underline class represents to underline tag
    /// </summary>
    public class Underline : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Underline"; }
        }
    }

    /// <summary>
    /// StrikeThrough class represents to Strike Through tag
    /// </summary>
    public class StrikeThrough : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "StrikeThrough"; }
        }

        /// <summary>
        /// Get tooltip associated to this button
        /// </summary>
        public override string Tooltip {
            get { return "Strike Through"; }
        }
    }

    /// <summary>
    /// Subscript class represents to Subscript tag
    /// </summary>
    public class Subscript : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Subscript"; }
        }

        /// <summary>
        /// Get tooltip assciated to Subscript button
        /// </summary>
        public override string Tooltip {
            get { return "Sub Script"; }
        }
    }

    /// <summary>
    /// Superscript class represents to Superscript tag
    /// </summary>
    public class Superscript : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Superscript"; }
        }

        /// <summary>
        /// Get tooltip assciated to Superscript button
        /// </summary>
        public override string Tooltip {
            get { return "Super Script"; }
        }
    }

    /// <summary>
    /// JustifyLeft class represents to JustifyLeft tag
    /// </summary>
    public class JustifyLeft : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "JustifyLeft"; }
        }

        /// <summary>
        /// Get tooltip assciated to JustifyLeft button
        /// </summary>
        public override string Tooltip {
            get { return "Justify Left"; }
        }
    }

    /// <summary>
    /// JustifyRight class represents to JustifyRight tag
    /// </summary>
    public class JustifyRight : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "JustifyRight"; }
        }

        /// <summary>
        /// Get tooltip assciated to JustifyRight button
        /// </summary>
        public override string Tooltip {
            get { return "Justify Right"; }
        }
    }

    /// <summary>
    /// JustifyCenter class represents to JustifyCenter tag
    /// </summary>
    public class JustifyCenter : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "JustifyCenter"; }
        }

        /// <summary>
        /// Get tooltip assciated to JustifyCenter button
        /// </summary>
        public override string Tooltip {
            get { return "Justify Center"; }
        }
    }

    /// <summary>
    /// JustifyFull class represents to JustifyFull tag
    /// </summary>
    public class JustifyFull : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "JustifyFull"; }
        }

        /// <summary>
        /// Get tooltip assciated to JustifyFull button
        /// </summary>
        public override string Tooltip {
            get { return "Justify Full"; }
        }
    }

    /// <summary>
    /// insertOrderedList class represents to OrderedList tag
    /// </summary>
    public class InsertOrderedList : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "insertOrderedList"; }
        }

        /// <summary>
        /// Get tooltip assciated to OrderedList button
        /// </summary>
        public override string Tooltip {
            get { return "Insert Ordered List"; }
        }
    }

    /// <summary>
    /// insertUnOrderedList class represents to UnOrderedList tag
    /// </summary>
    public class InsertUnorderedList : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "insertUnorderedList"; }
        }

        /// <summary>
        /// Get tooltip assciated to UnOrderedList button
        /// </summary>
        public override string Tooltip {
            get { return "Insert Unordered List"; }
        }
    }

    /// <summary>
    /// Undo class represents to undo action
    /// </summary>
    public class Undo : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Undo"; }
        }
    }

    /// <summary>
    /// Redo class represents to undo action
    /// </summary>
    public class Redo : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Redo"; }
        }
    }
    
        /// <summary>
        /// CreateLink class represents to hyperlink tag
        /// </summary>
        public class CreateLink : HtmlEditorExtenderButton
        {
            /// <summary>
            /// get name of command that will be passed to execCommand method 
            /// </summary>
            public override string CommandName
            {
                get { return "createLink"; }
            }

            /// <summary>
            /// Get tooltip assciated to CreateLink button
            /// </summary>
            public override string Tooltip
            {
                get { return "Create Link"; }
            }
        }
    
    /// <summary>
    /// Delete class represents to Delete button
    /// </summary>
    public class Delete : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Delete"; }
        }

        /// <summary>
        /// Get tooltip assciated to UnOrderedList button
        /// </summary>
        public override string Tooltip {
            get { return "Delete"; }
        }
    }

    /// <summary>
    /// SelectAll class represents to SelectAll action
    /// </summary>
    public class SelectAll : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "SelectAll"; }
        }

        /// <summary>
        /// Get tooltip assciated to SelectAll button
        /// </summary>
        public override string Tooltip {
            get { return "Select All"; }
        }
    }

    /// <summary>
    /// UnSelect class represents to UnSelect action
    /// </summary>
    public class UnSelect : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "UnSelect"; }
        }

        /// <summary>
        /// Get tooltip assciated to UnSelect button
        /// </summary>
        public override string Tooltip {
            get { return "UnSelect"; }
        }
    }
    
        /// <summary>
        /// UnLink class represents to UnLink action
        /// </summary>
        public class UnLink : HtmlEditorExtenderButton
        {
            /// <summary>
            /// get name of command that will be passed to execCommand method 
            /// </summary>
            public override string CommandName
            {
                get { return "UnLink"; }
            }

            /// <summary>
            /// Get tooltip assciated to UnSelect button
            /// </summary>
            public override string Tooltip
            {
                get { return "UnLink"; }
            }
        }
    
    /// <summary>
    /// BackColor class represents to BackColor action
    /// </summary>
    public class BackgroundColorSelector : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "BackColor"; }
        }

        /// <summary>
        /// Get tooltip assciated to BackColor button
        /// </summary>
        public override string Tooltip {
            get { return "Back Color"; }
        }
    }

    /// <summary>
    /// Copy class represents to Copy action
    /// </summary>
    public class Copy : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Copy"; }
        }

        /// <summary>
        /// Get tooltip assciated to Copy button
        /// </summary>
        public override string Tooltip {
            get { return "Copy"; }
        }
    }

    /// <summary>
    /// Cut class represents to Cut action
    /// </summary>
    public class Cut : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Cut"; }
        }

        /// <summary>
        /// Get tooltip assciated to Cut button
        /// </summary>
        public override string Tooltip {
            get { return "Cut"; }
        }
    }

    /// <summary>
    /// Paste class represents to Copy action
    /// </summary>
    public class Paste : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Paste"; }
        }

        /// <summary>
        /// Get tooltip assciated to Paste button
        /// </summary>
        public override string Tooltip {
            get { return "Paste"; }
        }
    }


    /// <summary>
    /// FontName class represents to FontName action
    /// </summary>
    public class FontNameSelector : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "FontName"; }
        }

        /// <summary>
        /// Get tooltip assciated to FontName button
        /// </summary>
        public override string Tooltip {
            get { return "Font Name"; }
        }
    }

    /// <summary>
    /// FontSize class represents to FontSize action
    /// </summary>
    public class FontSizeSelector : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "FontSize"; }
        }

        /// <summary>
        /// Get tooltip assciated to FontSize button
        /// </summary>
        public override string Tooltip {
            get { return "Font Size"; }
        }
    }

    /// <summary>
    /// ForeColor class represents to ForeColor action
    /// </summary>
    public class ForeColorSelector : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "ForeColor"; }
        }

        /// <summary>
        /// Get tooltip assciated to ForeColor button
        /// </summary>
        public override string Tooltip {
            get { return "Fore Color"; }
        }
    }

    /// <summary>
    /// Indent class represents to Indent action
    /// </summary>
    public class Indent : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Indent"; }
        }

        /// <summary>
        /// Get tooltip assciated to Indent button
        /// </summary>
        public override string Tooltip {
            get { return "Indent"; }
        }
    }

    /// <summary>
    /// InsertHorizontalRule class represents to InsertHorizontalRule action
    /// </summary>
    public class InsertHorizontalRule : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "InsertHorizontalRule"; }
        }

        /// <summary>
        /// Get tooltip assciated to InsertHorizontalRule button
        /// </summary>
        public override string Tooltip {
            get { return "Insert Horizontal Rule"; }
        }
    }

    /// <summary>
    /// Outdent class represents to Outdent action
    /// </summary>
    public class Outdent : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "Outdent"; }
        }

        /// <summary>
        /// Get tooltip assciated to Outdent button
        /// </summary>
        public override string Tooltip {
            get { return "Outdent"; }
        }
    }

    /// <summary>
    /// RemoveFormat class represents to RemoveFormat action
    /// </summary>
    public class RemoveFormat : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "RemoveFormat"; }
        }

        /// <summary>
        /// Get tooltip assciated to RemoveFormat button
        /// </summary>
        public override string Tooltip {
            get { return "Remove Format"; }
        }
    }

    /// <summary>
    /// HorizontalSeparator class represents to add HorizontalSeparator
    /// </summary>
    public class HorizontalSeparator : HtmlEditorExtenderButton {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName {
            get { return "HorizontalSeparator"; }
        }

        /// <summary>
        /// Get tooltip assciated to InsertImage button
        /// </summary>
        public override string Tooltip {
            get { return "Separator"; }
        }
    }

    #endregion
}