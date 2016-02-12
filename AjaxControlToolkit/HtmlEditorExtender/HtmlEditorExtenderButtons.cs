#pragma warning disable 1591
using System.Collections.Generic;

namespace AjaxControlToolkit {
    public abstract class HtmlEditorExtenderButton {
        public abstract string CommandName { get; }

        public virtual string Tooltip { get { return CommandName; } }

        // Get list of elements associated to the button
        public abstract Dictionary<string, string[]> ElementWhiteList { get; }

        // Get list of Attribute and its values associated to the button
        public abstract Dictionary<string, string[]> AttributeWhiteList { get; }

    }

    #region button classes

    // Bold class represents to bold tag
    public class Bold : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Bold"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("b", new string[] { "style" });
                elementWhiteList.Add("strong", new string[] { "style" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    public class Italic : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Italic"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("i", new string[] { "style" });
                elementWhiteList.Add("em", new string[] { "style" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    public class Underline : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Underline"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("u", new string[] { "style" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    public class StrikeThrough : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "StrikeThrough"; }
        }

        public override string Tooltip {
            get { return "Strike Through"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("strike", new string[] { "style" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    public class Subscript : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Subscript"; }
        }

        public override string Tooltip {
            get { return "Sub Script"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("sub", new string[] { });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class Superscript : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Superscript"; }
        }

        public override string Tooltip {
            get { return "Super Script"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("sup", new string[] { });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class JustifyLeft : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "JustifyLeft"; }
        }

        public override string Tooltip {
            get { return "Justify Left"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("p", new string[] { "align" });
                elementWhiteList.Add("div", new string[] { "style", "align" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { "text-align" });
                attributeWhiteList.Add("align", new string[] { "left" });
                return attributeWhiteList;
            }
        }
    }

    public class JustifyRight : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "JustifyRight"; }
        }

        public override string Tooltip {
            get { return "Justify Right"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("p", new string[] { "align" });
                elementWhiteList.Add("div", new string[] { "style", "align" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { "text-align" });
                attributeWhiteList.Add("align", new string[] { "right" });
                return attributeWhiteList;
            }
        }
    }

    public class JustifyCenter : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "JustifyCenter"; }
        }

        public override string Tooltip {
            get { return "Justify Center"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("p", new string[] { "align" });
                elementWhiteList.Add("div", new string[] { "style", "align" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { "text-align" });
                attributeWhiteList.Add("align", new string[] { "center" });
                return attributeWhiteList;
            }
        }
    }

    public class JustifyFull : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "JustifyFull"; }
        }

        public override string Tooltip {
            get { return "Justify Full"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("p", new string[] { "align" });
                elementWhiteList.Add("div", new string[] { "style", "align" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { "text-align" });
                attributeWhiteList.Add("align", new string[] { "justify" });
                return attributeWhiteList;
            }
        }
    }

    public class InsertOrderedList : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "insertOrderedList"; }
        }

        public override string Tooltip {
            get { return "Insert Ordered List"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("ol", new string[] { });
                elementWhiteList.Add("li", new string[] { });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class InsertUnorderedList : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "insertUnorderedList"; }
        }

        public override string Tooltip {
            get { return "Insert Unordered List"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("ul", new string[] { });
                elementWhiteList.Add("li", new string[] { });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class Undo : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Undo"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class Redo : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Redo"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class CreateLink : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "createLink"; }
        }

        public override string Tooltip {
            get { return "Create Link"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("a", new string[] { "href" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("href", new string[] { });
                return null;
            }
        }
    }

    public class Delete : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Delete"; }
        }

        public override string Tooltip {
            get { return "Delete"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class SelectAll : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "SelectAll"; }
        }

        public override string Tooltip {
            get { return "Select All"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class UnSelect : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "UnSelect"; }
        }

        public override string Tooltip {
            get { return "UnSelect"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class UnLink : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "UnLink"; }
        }

        public override string Tooltip {
            get { return "UnLink"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class BackgroundColorSelector : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "BackColor"; }
        }

        public override string Tooltip {
            get { return "Back Color"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("font", new string[] { "style" });
                elementWhiteList.Add("span", new string[] { "style" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { "background-color" });
                return attributeWhiteList;
            }
        }
    }

    public class Copy : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Copy"; }
        }

        public override string Tooltip {
            get { return "Copy"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class Cut : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Cut"; }
        }

        public override string Tooltip {
            get { return "Cut"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class Paste : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Paste"; }
        }

        public override string Tooltip {
            get { return "Paste"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class CleanWord : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "CleanWord"; }
        }

        public override string Tooltip {
            get { return "Clean Word HTML"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class FontNameSelector : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "FontName"; }
        }

        public override string Tooltip {
            get { return "Font Name"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("font", new string[] { "face" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("face", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    public class FontSizeSelector : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "FontSize"; }
        }

        public override string Tooltip {
            get { return "Font Size"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("font", new string[] { "size" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("size", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    public class ForeColorSelector : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "ForeColor"; }
        }

        public override string Tooltip {
            get { return "Fore Color"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("font", new string[] { "color" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("color", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    public class Indent : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Indent"; }
        }

        public override string Tooltip {
            get { return "Indent"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("blockquote", new string[] { "style", "dir" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { "margin-right", "margin", "padding", "border" });
                attributeWhiteList.Add("dir", new string[] { "ltr", "rtl", "auto" });
                return attributeWhiteList;
            }
        }
    }

    public class InsertHorizontalRule : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "InsertHorizontalRule"; }
        }

        public override string Tooltip {
            get { return "Insert Horizontal Rule"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("hr", new string[] { "size", "width" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("size", new string[] { });
                attributeWhiteList.Add("width", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    public class Outdent : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "Outdent"; }
        }

        public override string Tooltip {
            get { return "Outdent"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class RemoveFormat : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "RemoveFormat"; }
        }

        public override string Tooltip {
            get { return "Remove Format"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class HorizontalSeparator : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "HorizontalSeparator"; }
        }

        public override string Tooltip {
            get { return "Separator"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class InsertImage : HtmlEditorExtenderButton {
        public override string CommandName {
            get { return "InsertImage"; }
        }

        public override string Tooltip {
            get { return "Insert Image"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get {
                var elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("img", new string[] { "src" });
                return elementWhiteList;
            }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get {
                var attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("src", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    #endregion
}
#pragma warning restore 1591