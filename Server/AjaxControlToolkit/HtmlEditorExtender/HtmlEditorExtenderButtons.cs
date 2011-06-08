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
            var result = Regex.Replace(value, "&gt;b&lt;", "<b>");            
            result = Regex.Replace(result, "&gt;/b&lt;", "</b>");
            result = Regex.Replace(result, "&gt;strong&lt;", "<strong>");
            return Regex.Replace(result, "&gt;/strong&lt;", "</strong>");

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
            var result = Regex.Replace(value, "&gt;i&lt;", "<i>");
            return Regex.Replace(result, "&gt;/i&lt;", "</i>");
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
            var result = Regex.Replace(value, "&gt;u&lt;", "<u>");
            return Regex.Replace(result, "&gt;/u&lt;", "</u>");
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
            var result = Regex.Replace(value, "&gt;s&lt;", "<s>");
            result = Regex.Replace(result, "&gt;/s&lt;", "</s>");
            result = Regex.Replace(value, "&gt;strike&lt;", "<strike>");
            return Regex.Replace(result, "&gt;/strike&lt;", "</strike>");

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
            var result = Regex.Replace(value, "&gt;sub&lt;", "<sub>");
            return Regex.Replace(result, "&gt;/sub&lt;", "</sub>");
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
            var result = Regex.Replace(value, "&gt;sup&lt;", "<sup>");
            return Regex.Replace(result, "&gt;/sup&lt;", "</sup>");
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
            var result = Regex.Replace(value, "&gt;p&lt;", "<p>");
            return Regex.Replace(result, "&gt;/p&lt;", "</p>");
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
            var result = Regex.Replace(value, "&gt;p&lt;", "<p>");
            return Regex.Replace(result, "&gt;/p&lt;", "</p>");
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
            var result = Regex.Replace(value, "&gt;p&lt;", "<p>");
            result = Regex.Replace(result, "&gt;/p&lt;", "</p>");
            result = Regex.Replace(value, "&gt;center&lt;", "<center>");
            return Regex.Replace(result, "&gt;/center&lt;", "</center>");
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
            var result = Regex.Replace(value, "&gt;ol&lt;", "<ol>");
            result = Regex.Replace(result, "&gt;/ol&lt;", "</ol>");
            result = Regex.Replace(value, "&gt;l1&lt;", "<l1>");
            return Regex.Replace(result, "&gt;/l1&lt;", "</l1>");
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
            var result = Regex.Replace(value, "&gt;ul&lt;", "<ul>");
            result = Regex.Replace(result, "&gt;/ul&lt;", "</ul>");
            result = Regex.Replace(value, "&gt;l1&lt;", "<l1>");
            return Regex.Replace(result, "&gt;/l1&lt;", "</l1>");
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
