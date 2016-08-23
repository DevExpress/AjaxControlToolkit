using System.Collections.Generic;
using System.ComponentModel;

namespace AjaxControlToolkit {
    public abstract class HtmlEditorExtenderButton {
        public abstract string CommandName { get; }

        string _Tooltip = string.Empty;

        /// <summary>
        /// Determines text to display as a tooltip;
        /// </summary>
        [Description("Determines the text to display as the tooltip;")]
        [DefaultValue("")]
        public virtual string Tooltip {
            get { return (_Tooltip.Length == 0 ? CommandName : _Tooltip); }
            set { _Tooltip = value; }
        }

        // Get list of elements associated to the button
        public abstract Dictionary<string, string[]> ElementWhiteList { get; }

        // Get list of Attribute and its values associated to the button
        public abstract Dictionary<string, string[]> AttributeWhiteList { get; }

    }

    #region button classes

    // Bold class represents to bold tag
    public class Bold : HtmlEditorExtenderButton {
        public Bold() {
            Tooltip = "Bold";
        }

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
        public Italic() {
            Tooltip = "Italic";
        }

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
        public Underline() {
            Tooltip = "Underline";
        }

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
        public StrikeThrough() {
            Tooltip = "Strike Through";
        }

        public override string CommandName {
            get { return "StrikeThrough"; }
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
        public Subscript() {
            Tooltip = "Sub Script";
        }

        public override string CommandName {
            get { return "Subscript"; }
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
        public Superscript() {
            Tooltip = "Super Script";
        }

        public override string CommandName {
            get { return "Superscript"; }
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
        public JustifyLeft() {
            Tooltip = "Justify Left";
        }

        public override string CommandName {
            get { return "JustifyLeft"; }
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
        public JustifyRight() {
            Tooltip = "Justify Right";
        }

        public override string CommandName {
            get { return "JustifyRight"; }
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
        public JustifyCenter() {
            Tooltip = "Justify Center";
        }

        public override string CommandName {
            get { return "JustifyCenter"; }
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
        public JustifyFull() {
            Tooltip = "Justify Full";
        }

        public override string CommandName {
            get { return "JustifyFull"; }
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
        public InsertOrderedList() {
            Tooltip = "Insert Ordered List";
        }

        public override string CommandName {
            get { return "insertOrderedList"; }
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
        public InsertUnorderedList() {
            Tooltip = "Insert Unordered List";
        }

        public override string CommandName {
            get { return "insertUnorderedList"; }
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
        public Undo() {
            Tooltip = "Undo";
        }

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
        public Redo() {
            Tooltip = "Redo";
        }

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
        public CreateLink() {
            Tooltip = "Create Link";
        }

        public override string CommandName {
            get { return "createLink"; }
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
        public Delete() {
            Tooltip = "Delete";
        }

        public override string CommandName {
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
        public SelectAll() {
            Tooltip = "Select All";
        }

        public override string CommandName {
            get { return "SelectAll"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class UnSelect : HtmlEditorExtenderButton {
        public UnSelect() {
            Tooltip = "UnSelect";
        }

        public override string CommandName {
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
        public UnLink() {
            Tooltip = "UnLink";
        }

        public override string CommandName {
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
        public BackgroundColorSelector() {
            Tooltip = "Back Color";
        }

        public override string CommandName {
            get { return "BackColor"; }
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
        public Copy() {
            Tooltip = "Copy";
        }

        public override string CommandName {
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
        public Cut() {
            Tooltip = "Cut";
        }

        public override string CommandName {
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
        public Paste() {
            Tooltip = "Paste";
        }

        public override string CommandName {
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
        public CleanWord() {
            Tooltip = "Clean Word HTML";
        }

        public override string CommandName {
            get { return "CleanWord"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class FontNameSelector : HtmlEditorExtenderButton {
        public FontNameSelector() {
            Tooltip = "Font Name";
        }

        public override string CommandName {
            get { return "FontName"; }
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
        public FontSizeSelector() {
            Tooltip = "Font Size";
        }

        public override string CommandName {
            get { return "FontSize"; }
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
        public ForeColorSelector() {
            Tooltip = "Fore Color";
        }

        public override string CommandName {
            get { return "ForeColor"; }
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
        public Indent() {
            Tooltip = "Indent";
        }

        public override string CommandName {
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
        public InsertHorizontalRule() {
            Tooltip = "Insert Horizontal Rule";
        }

        public override string CommandName {
            get { return "InsertHorizontalRule"; }
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
        public Outdent() {
            Tooltip = "Outdent";
        }

        public override string CommandName {
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
        public RemoveFormat() {
            Tooltip = "Remove Format";
        }

        public override string CommandName {
            get { return "RemoveFormat"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class HorizontalSeparator : HtmlEditorExtenderButton {
        public HorizontalSeparator() {
            Tooltip = "Separator";
        }

        public override string CommandName {
            get { return "HorizontalSeparator"; }
        }

        public override Dictionary<string, string[]> ElementWhiteList {
            get { return null; }
        }

        public override Dictionary<string, string[]> AttributeWhiteList {
            get { return null; }
        }
    }

    public class InsertImage : HtmlEditorExtenderButton {
        public InsertImage() {
            Tooltip = "Insert Image";
        }

        public override string CommandName {
            get { return "InsertImage"; }
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

        public string AjaxFileUploadHandlerPath { get; set; }
    }

    #endregion
}
