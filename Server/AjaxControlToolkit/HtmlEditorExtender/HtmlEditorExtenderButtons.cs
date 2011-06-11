using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace AjaxControlToolkit
{
    public abstract class HtmlEditorExtenderButton
    {
        public abstract string Name {  get; }

        public virtual string Title { get { return Name; } }

        public abstract int IconIndex { get; }

        public string Offset
        {
            get
            {
                return (IconIndex * HtmlEditorExtender.ButtonWidthDef * -1) + "px 0px";
            }
        }

        public abstract string Decode(string value);
    }

    #region button classes

    public class Bold : HtmlEditorExtenderButton 
    {
        public override string Name {
            get {return "Bold"; }
        }

        public override int IconIndex {
            get {return 2; }
        }
      
        public override string Decode(string value) {
            var result = Regex.Replace(value, "&lt;b&gt;", "<b>");            
            result = Regex.Replace(result, "&lt;/b&gt;", "</b>");
            result = Regex.Replace(result, "&lt;B&gt;", "<b>");
            result = Regex.Replace(result, "&lt;/B&gt;", "</b>");
            result = Regex.Replace(result, "&lt;strong&gt;", "<strong>");
            result = Regex.Replace(result, "&lt;/strong&gt;", "</strong>");
            result = Regex.Replace(result, "&lt;STRONG&gt;", "<strong>");
            return Regex.Replace(result, "&lt;/STRONG&gt;", "</strong>");

        }

    }

    public class Italic : HtmlEditorExtenderButton 
    {
        public override string Name {
            get {return "Italic"; }
        }

        public override int IconIndex {
            get {return 3; }
        }
      
        public override string Decode(string value) {
            var result = Regex.Replace(value, "&lt;i&gt;", "<i>");
            result = Regex.Replace(result, "&lt;/i&gt;", "</i>");
            result = Regex.Replace(result, "&lt;I&gt;", "<i>");            
            return Regex.Replace(result, "&lt;/I&gt;", "</i>");
        }

    }

    public class Underline : HtmlEditorExtenderButton
    {
        public override string Name
        {
            get { return "Underline"; }
        }

        public override int IconIndex
        {
            get { return 4; }
        }

        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;u&gt;", "<u>");            
            result = Regex.Replace(result, "&lt;/u&gt;", "</u>");
            result = Regex.Replace(result, "&lt;U&gt;", "<u>");
            return Regex.Replace(result, "&lt;/U&gt;", "</u>");
        }

    }

    public class StrikeThrough : HtmlEditorExtenderButton
    {
        public override string Name
        {
            get { return "StrikeThrough"; }
        }

        public override string Title
        {
            get { return "Strike Through"; }
        }

        public override int IconIndex
        {
            get { return 5; }
        }

        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;s&gt;", "<s>");
            result = Regex.Replace(result, "&lt;/s&gt;", "</s>");
            result = Regex.Replace(result, "&lt;S&gt;", "<s>");
            result = Regex.Replace(result, "&lt;/S&gt;", "</s>");
            result = Regex.Replace(result, "&lt;strike&gt;", "<strike>");
            result = Regex.Replace(result, "&lt;/strike&gt;", "</strike>");
            result = Regex.Replace(result, "&lt;STRIKE&gt;", "<strike>");
            return Regex.Replace(result, "&lt;/STRIKE&gt;", "</strike>");

        }

    }

    public class Subscript : HtmlEditorExtenderButton
    {
        public override string Name
        {
            get { return "Subscript"; }
        }

        public override string Title
        {
            get { return "Sub Script"; }
        }

        public override int IconIndex
        {
            get { return 6; }
        }

        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;sub&gt;", "<sub>");
            result = Regex.Replace(result, "&lt;/sub&gt;", "</sub>");
            result = Regex.Replace(result, "&lt;SUB&gt;", "<sub>");
            return Regex.Replace(result, "&lt;/SUB&gt;", "</sub>");
        }

    }

    public class Superscript : HtmlEditorExtenderButton
    {
        public override string Name
        {
            get { return "Superscript"; }
        }

        public override string Title
        {
            get { return "Super Script"; }
        }

        public override int IconIndex
        {
            get { return 7; }
        }

        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;sup&gt;", "<sup>");
            result = Regex.Replace(result, "&lt;/sup&gt;", "</sup>");
            result = Regex.Replace(result, "&lt;SUP&gt;", "<sup>");
            return Regex.Replace(result, "&lt;/SUP&gt;", "</sup>");
        }

    }

    public class JustifyLeft : HtmlEditorExtenderButton
    {
        public override string Name
        {
            get { return "JustifyLeft"; }
        }

        public override string Title
        {
            get { return "Justify Left"; }
        }

        public override int IconIndex
        {
            get { return 10; }
        }

        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;p&gt;", "<p>");
            result = Regex.Replace(result, "&lt;/p&gt;", "</p>");
            result = Regex.Replace(result, "&lt;P&gt;", "<p>");
            result = Regex.Replace(result, "&lt;/P&gt;", "</p>");
            result = Regex.Replace(result, "&lt;div&gt;", "<div>");
            result = Regex.Replace(result, "&lt;/div&gt;", "</div>");
            result = Regex.Replace(result, "&lt;DIV&gt;", "<div>");
            return Regex.Replace(result, "&lt;/DIV&gt;", "</div>");
        }

    }

    public class JustifyRight : HtmlEditorExtenderButton
    {
        public override string Name
        {
            get { return "JustifyRight"; }
        }

        public override string Title
        {
            get { return "Justify Right"; }
        }

        public override int IconIndex
        {
            get { return 12; }
        }

        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;p&gt;", "<p>");
            result = Regex.Replace(result, "&lt;/p&gt;", "</p>");
            result = Regex.Replace(result, "&lt;P&gt;", "<p>");
            result = Regex.Replace(result, "&lt;/P&gt;", "</p>");
            result = Regex.Replace(result, "&lt;div&gt;", "<div>");
            result = Regex.Replace(result, "&lt;/div&gt;", "</div>");
            result = Regex.Replace(result, "&lt;DIV&gt;", "<div>");
            return Regex.Replace(result, "&lt;/DIV&gt;", "</div>");
        }

    }

    public class JustifyCenter : HtmlEditorExtenderButton
    {
        public override string Name
        {
            get { return "JustifyCenter"; }
        }

        public override string Title
        {
            get { return "Justify Center"; }
        }

        public override int IconIndex
        {
            get { return 11; }
        }

        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;p&gt;", "<p>");
            result = Regex.Replace(result, "&lt;/p&gt;", "</p>");
            result = Regex.Replace(result, "&lt;P&gt;", "<p>");
            result = Regex.Replace(result, "&lt;/P&gt;", "</p>");
            result = Regex.Replace(result, "&lt;div&gt;", "<div>");
            result = Regex.Replace(result, "&lt;/div&gt;", "</div>");
            result = Regex.Replace(result, "&lt;DIV&gt;", "<div>");
            result = Regex.Replace(result, "&lt;/DIV&gt;", "</div>");
            result = Regex.Replace(result, "&lt;center&gt;", "<center>");
            result = Regex.Replace(result, "&lt;/center&gt;", "</center>");
            result = Regex.Replace(result, "&lt;CENTER&gt;", "<center>");
            return Regex.Replace(result, "&lt;/CENTER&gt;", "</center>");
        }

    }

    public class insertOrderedList : HtmlEditorExtenderButton
    {
        public override string Name
        {
            get { return "insertOrderedList"; }
        }

        public override string Title
        {
            get { return "Insert Ordered List"; }
        }

        public override int IconIndex
        {
            get { return 13; }
        }

        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;ol&gt;", "<ol>");
            result = Regex.Replace(result, "&lt;/ol&gt;", "</ol>");
            result = Regex.Replace(result, "&lt;OL&gt;", "<ol>");
            result = Regex.Replace(result, "&lt;/OL&gt;", "</ol>");
            result = Regex.Replace(result, "&lt;li&gt;", "<li>");
            result = Regex.Replace(result, "&lt;/li&gt;", "</li>");
            result = Regex.Replace(result, "&lt;LI&gt;", "<li>");
            return Regex.Replace(result, "&lt;/LI&gt;", "</li>");
        }

    }

    public class insertUnorderedList : HtmlEditorExtenderButton
    {
        public override string Name
        {
            get { return "insertUnorderedList"; }
        }

        public override string Title
        {
            get { return "Insert Unordered List"; }
        }

        public override int IconIndex
        {
            get { return 14; }
        }

        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;ul&gt;", "<ul>");
            result = Regex.Replace(result, "&lt;/ul&gt;", "</ul>");
            result = Regex.Replace(result, "&lt;UL&gt;", "<ul>");
            result = Regex.Replace(result, "&lt;/UL&gt;", "</ul>");
            result = Regex.Replace(result, "&lt;l1&gt;", "<l1>");
            result = Regex.Replace(result, "&lt;/l1&gt;", "</l1>");
            result = Regex.Replace(result, "&lt;L1&gt;", "<l1>");
            return Regex.Replace(result, "&lt;/L1&gt;", "</l1>");
        }

    }

    #endregion

    public static class ButtonList
    {
        public static List<HtmlEditorExtenderButton> Buttons 
        {
            get{
                List<HtmlEditorExtenderButton> buttonList = new List<HtmlEditorExtenderButton>();
                buttonList.Add(new Bold());
                buttonList.Add(new Italic());
                buttonList.Add(new Underline());
                buttonList.Add(new StrikeThrough());
                buttonList.Add(new Subscript());
                buttonList.Add(new Superscript());
                buttonList.Add(new JustifyLeft());
                buttonList.Add(new JustifyRight());
                buttonList.Add(new JustifyCenter());
                buttonList.Add(new insertOrderedList());
                buttonList.Add(new insertUnorderedList());
                
                return buttonList;
            }
        }
    }
}
