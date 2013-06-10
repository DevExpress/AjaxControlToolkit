using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.UI;
using System.ComponentModel;

namespace AjaxControlToolkit
{
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

        /// <summary>
        /// Get list of elements associated to the button
        /// </summary>
        public abstract Dictionary<string, string[]> ElementWhiteList { get; }

        /// <summary>
        /// Get list of Attribute and its values associated to the button
        /// </summary>
        public abstract Dictionary<string, string[]> AttributeWhiteList { get; }
        
    }

    #region button classes

    /// <summary>
    /// Bold class represents to bold tag
    /// </summary>
    public class Bold : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Bold"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get 
            { 
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("b", new string[] { "style" });
                elementWhiteList.Add("strong", new string[] { "style" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get 
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// Italic class represents to italic tag
    /// </summary>
    public class Italic : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Italic"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("i", new string[] { "style" });
                elementWhiteList.Add("em", new string[] { "style" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// Underline class represents to underline tag
    /// </summary>
    public class Underline : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Underline"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("u", new string[] { "style" });                
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// StrikeThrough class represents to Strike Through tag
    /// </summary>
    public class StrikeThrough : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "StrikeThrough"; }
        }

        /// <summary>
        /// Get tooltip associated to this button
        /// </summary>
        public override string Tooltip
        {
            get { return "Strike Through"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("strike", new string[] { "style" });                
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// Subscript class represents to Subscript tag
    /// </summary>
    public class Subscript : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Subscript"; }
        }

        /// <summary>
        /// Get tooltip assciated to Subscript button
        /// </summary>
        public override string Tooltip
        {
            get { return "Sub Script"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("sub", new string[] { });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// Superscript class represents to Superscript tag
    /// </summary>
    public class Superscript : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Superscript"; }
        }

        /// <summary>
        /// Get tooltip assciated to Superscript button
        /// </summary>
        public override string Tooltip
        {
            get { return "Super Script"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("sup", new string[] { });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// JustifyLeft class represents to JustifyLeft tag
    /// </summary>
    public class JustifyLeft : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "JustifyLeft"; }
        }

        /// <summary>
        /// Get tooltip assciated to JustifyLeft button
        /// </summary>
        public override string Tooltip
        {
            get { return "Justify Left"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("p", new string[] { "align" });
                elementWhiteList.Add("div", new string[] { "style", "align" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] {"text-align" });
                attributeWhiteList.Add("align", new string[] { "left"});
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// JustifyRight class represents to JustifyRight tag
    /// </summary>
    public class JustifyRight : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "JustifyRight"; }
        }

        /// <summary>
        /// Get tooltip assciated to JustifyRight button
        /// </summary>
        public override string Tooltip
        {
            get { return "Justify Right"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("p", new string[] { "align" });
                elementWhiteList.Add("div", new string[] { "style", "align" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { "text-align" });
                attributeWhiteList.Add("align", new string[] { "right" });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// JustifyCenter class represents to JustifyCenter tag
    /// </summary>
    public class JustifyCenter : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "JustifyCenter"; }
        }

        /// <summary>
        /// Get tooltip assciated to JustifyCenter button
        /// </summary>
        public override string Tooltip
        {
            get { return "Justify Center"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("p", new string[] { "align" });
                elementWhiteList.Add("div", new string[] { "style", "align" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { "text-align" });
                attributeWhiteList.Add("align", new string[] { "center" });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// JustifyFull class represents to JustifyFull tag
    /// </summary>
    public class JustifyFull : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "JustifyFull"; }
        }

        /// <summary>
        /// Get tooltip assciated to JustifyFull button
        /// </summary>
        public override string Tooltip
        {
            get { return "Justify Full"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("p", new string[] { "align" });
                elementWhiteList.Add("div", new string[] { "style", "align" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] { "text-align" });
                attributeWhiteList.Add("align", new string[] { "justify" });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// insertOrderedList class represents to OrderedList tag
    /// </summary>
    public class InsertOrderedList : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "insertOrderedList"; }
        }

        /// <summary>
        /// Get tooltip assciated to OrderedList button
        /// </summary>
        public override string Tooltip
        {
            get { return "Insert Ordered List"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("ol", new string[] { });
                elementWhiteList.Add("li", new string[] { });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// insertUnOrderedList class represents to UnOrderedList tag
    /// </summary>
    public class InsertUnorderedList : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "insertUnorderedList"; }
        }

        /// <summary>
        /// Get tooltip assciated to UnOrderedList button
        /// </summary>
        public override string Tooltip
        {
            get { return "Insert Unordered List"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("ul", new string[] { });
                elementWhiteList.Add("li", new string[] { });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// Undo class represents to undo action
    /// </summary>
    public class Undo : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Undo"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {                
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// Redo class represents to undo action
    /// </summary>
    public class Redo : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Redo"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {                
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
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

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("a", new string[] { "href"});                
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("href", new string[] { });
                return null;
            }
        }
    }

    /// <summary>
    /// Delete class represents to Delete button
    /// </summary>
    public class Delete : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Delete"; }
        }

        /// <summary>
        /// Get tooltip assciated to UnOrderedList button
        /// </summary>
        public override string Tooltip
        {
            get { return "Delete"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// SelectAll class represents to SelectAll action
    /// </summary>
    public class SelectAll : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "SelectAll"; }
        }

        /// <summary>
        /// Get tooltip assciated to SelectAll button
        /// </summary>
        public override string Tooltip
        {
            get { return "Select All"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// UnSelect class represents to UnSelect action
    /// </summary>
    public class UnSelect : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "UnSelect"; }
        }

        /// <summary>
        /// Get tooltip assciated to UnSelect button
        /// </summary>
        public override string Tooltip
        {
            get { return "UnSelect"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
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

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// BackColor class represents to BackColor action
    /// </summary>
    public class BackgroundColorSelector : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "BackColor"; }
        }

        /// <summary>
        /// Get tooltip assciated to BackColor button
        /// </summary>
        public override string Tooltip
        {
            get { return "Back Color"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("font", new string[] { "style" });
                elementWhiteList.Add("span", new string[] { "style" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] {"background-color" });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// Copy class represents to Copy action
    /// </summary>
    public class Copy : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Copy"; }
        }

        /// <summary>
        /// Get tooltip assciated to Copy button
        /// </summary>
        public override string Tooltip
        {
            get { return "Copy"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// Cut class represents to Cut action
    /// </summary>
    public class Cut : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Cut"; }
        }

        /// <summary>
        /// Get tooltip assciated to Cut button
        /// </summary>
        public override string Tooltip
        {
            get { return "Cut"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// Paste class represents to Copy action
    /// </summary>
    public class Paste : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Paste"; }
        }

        /// <summary>
        /// Get tooltip assciated to Paste button
        /// </summary>
        public override string Tooltip
        {
            get { return "Paste"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }


    /// <summary>
    /// FontName class represents to FontName action
    /// </summary>
    public class FontNameSelector : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "FontName"; }
        }

        /// <summary>
        /// Get tooltip assciated to FontName button
        /// </summary>
        public override string Tooltip
        {
            get { return "Font Name"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("font", new string[] { "face" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("face", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// FontSize class represents to FontSize action
    /// </summary>
    public class FontSizeSelector : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "FontSize"; }
        }

        /// <summary>
        /// Get tooltip assciated to FontSize button
        /// </summary>
        public override string Tooltip
        {
            get { return "Font Size"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("font", new string[] { "size" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("size", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// ForeColor class represents to ForeColor action
    /// </summary>
    public class ForeColorSelector : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "ForeColor"; }
        }

        /// <summary>
        /// Get tooltip assciated to ForeColor button
        /// </summary>
        public override string Tooltip
        {
            get { return "Fore Color"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("font", new string[] { "color" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("color", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// Indent class represents to Indent action
    /// </summary>
    public class Indent : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Indent"; }
        }

        /// <summary>
        /// Get tooltip assciated to Indent button
        /// </summary>
        public override string Tooltip
        {
            get { return "Indent"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("blockquote", new string[] { "style", "dir" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("style", new string[] {"margin-right", "margin", "padding", "border" });
                attributeWhiteList.Add("dir", new string[] { "ltr", "rtl", "auto"});
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// InsertHorizontalRule class represents to InsertHorizontalRule action
    /// </summary>
    public class InsertHorizontalRule : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "InsertHorizontalRule"; }
        }

        /// <summary>
        /// Get tooltip assciated to InsertHorizontalRule button
        /// </summary>
        public override string Tooltip
        {
            get { return "Insert Horizontal Rule"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("hr", new string[] { "size", "width" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("size", new string[] {  });
                attributeWhiteList.Add("width", new string[] {  });
                return attributeWhiteList;
            }
        }
    }

    /// <summary>
    /// Outdent class represents to Outdent action
    /// </summary>
    public class Outdent : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "Outdent"; }
        }

        /// <summary>
        /// Get tooltip assciated to Outdent button
        /// </summary>
        public override string Tooltip
        {
            get { return "Outdent"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// RemoveFormat class represents to RemoveFormat action
    /// </summary>
    public class RemoveFormat : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "RemoveFormat"; }
        }

        /// <summary>
        /// Get tooltip assciated to RemoveFormat button
        /// </summary>
        public override string Tooltip
        {
            get { return "Remove Format"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// HorizontalSeparator class represents to add HorizontalSeparator
    /// </summary>
    public class HorizontalSeparator : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "HorizontalSeparator"; }
        }

        /// <summary>
        /// Get tooltip assciated to Horizontal Separator button
        /// </summary>
        public override string Tooltip
        {
            get { return "Separator"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                return null;
            }
        }
    }

    /// <summary>
    /// InsertImage class represents to Insert Image action
    /// </summary>
    public class InsertImage : HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public override string CommandName
        {
            get { return "InsertImage"; }
        }

        /// <summary>
        /// Get tooltip assciated to InsertImage button
        /// </summary>
        public override string Tooltip
        {
            get { return "Insert Image"; }
        }

        /// <summary>
        /// Get ElementWhiteList associated to the button.
        /// </summary>
        public override Dictionary<string, string[]> ElementWhiteList
        {
            get
            {
                Dictionary<string, string[]> elementWhiteList = new Dictionary<string, string[]>();
                elementWhiteList.Add("img", new string[] { "src" });
                return elementWhiteList;
            }
        }

        /// <summary>
        /// Get AttributeWhiteList associated to the  button.
        /// </summary>
        public override Dictionary<string, string[]> AttributeWhiteList
        {
            get
            {
                Dictionary<string, string[]> attributeWhiteList = new Dictionary<string, string[]>();
                attributeWhiteList.Add("src", new string[] { });
                return attributeWhiteList;
            }
        }
    }

    #endregion
}