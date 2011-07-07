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
        public virtual string Tooltip { get { return CommandName; }  }

        /// <summary>
        /// Abstract method that will be overridden by child classes to implement decoding 
        /// for tags associated to a button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public abstract string Decode(string value);
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
        /// Decode tags associated to a bold button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;b&gt;", "<b>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;/b&gt;", "</b>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;strong&gt;", "<strong>", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/strong&gt;", "</strong>", RegexOptions.IgnoreCase);
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
        /// Decode tags associated to a Italic button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;i&gt;", "<i>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;/i&gt;", "</i>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;em&gt;", "<em>", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/em&gt;", "</em>", RegexOptions.IgnoreCase);
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
        /// Decode tags associated to a Underline button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;u&gt;", "<u>", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/u&gt;", "</u>", RegexOptions.IgnoreCase);
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
        /// Decode tags associated to a stikethrough button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;s&gt;", "<s>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;/s&gt;", "</s>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;strike&gt;", "<strike>", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/strike&gt;", "</strike>", RegexOptions.IgnoreCase);
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
        /// Decode tags associated to a Subscript button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;sub&gt;", "<sub>", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/sub&gt;", "</sub>", RegexOptions.IgnoreCase);
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
        /// Decode tags associated to a Superscript button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;sup&gt;", "<sup>", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/sup&gt;", "</sup>", RegexOptions.IgnoreCase);
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
        /// Decode tags associated to a JustifyLeft button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;p&gt;", "<p>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;p align=&quot;left&quot;&gt;", "<p align=\"left\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;p align=left&gt;", "<p align=left>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;p style=&quot;text-align: left;&quot;&gt;", "<p style=\"text-align: left;\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;/p&gt;", "</p>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div&gt;", "<div>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div align=&quot;left&quot;&gt;", "<div align=\"left\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div align=left&gt;", "<div align=left>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div style=&quot;text-align: left;&quot;&gt;", "<div style=\"text-align: left;\">", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/div&gt;", "</div>", RegexOptions.IgnoreCase);

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
        /// Decode tags associated to a JustifyRight button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;p&gt;", "<p>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;p align=&quot;right&quot;&gt;", "<p align=\"right\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;p align=right&gt;", "<p align=right>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;p style=&quot;text-align: right;&quot;&gt;", "<p style=\"text-align: right;\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;/p&gt;", "</p>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div&gt;", "<div>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div align=&quot;right&quot;&gt;", "<div align=\"right\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div align=right&gt;", "<div align=right>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div style=&quot;text-align: right;&quot;&gt;", "<div style=\"text-align: right;\">", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/div&gt;", "</div>", RegexOptions.IgnoreCase);

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
        /// Decode tags associated to a JustifyCenter button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;p&gt;", "<p>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;p align=&quot;center&quot;&gt;", "<p align=\"center\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;p align=center&gt;", "<p align=center>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;p style=&quot;text-align: center;&quot;&gt;", "<p style=\"text-align: center;\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;/p&gt;", "</p>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div&gt;", "<div>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div align=&quot;center&quot;&gt;", "<div align=\"center\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div align=center&gt;", "<div align=center>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div style=&quot;text-align: center;&quot;&gt;", "<div style=\"text-align: center;\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;/div&gt;", "</div>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;center&gt;", "<center>", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/center&gt;", "</center>", RegexOptions.IgnoreCase);
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
        /// Decode tags associated to a JustifyFull button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            //code will come here to decode tags associated to this class
            return value;
        }

    }

    /// <summary>
    /// insertOrderedList class represents to OrderedList tag
    /// </summary>
    public class insertOrderedList : HtmlEditorExtenderButton
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
        /// Decode tags associated to a OrderedList button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;ol&gt;", "<ol>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;/ol&gt;", "</ol>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;li&gt;", "<li>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=&quot;left&quot;&gt;", "<l1 align=\"left\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=&quot;center&quot;&gt;", "<l1 align=\"center\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=&quot;right&quot;&gt;", "<l1 align=\"right\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1 style=&quot;text-align: left;&quot;&gt;", "<l1 style=\"text-align: left;\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1 style=&quot;text-align: right;&quot;&gt;", "<l1 style=\"text-align: right;\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1 style=&quot;text-align: center;&quot;&gt;", "<l1 style=\"text-align: center;\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=left&gt;", "<l1 align=left>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=center&gt;", "<l1 align=center>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=right&gt;", "<l1 align=right>", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/li&gt;", "</li>", RegexOptions.IgnoreCase);
        }

    }

    /// <summary>
    /// insertUnOrderedList class represents to UnOrderedList tag
    /// </summary>
    public class insertUnorderedList : HtmlEditorExtenderButton
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
        /// Decode tags associated to a UnOrderedList button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;ul&gt;", "<ul>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;/ul&gt;", "</ul>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1&gt;", "<l1>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=&quot;left&quot;&gt;", "<l1 align=\"left\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=&quot;center&quot;&gt;", "<l1 align=\"center\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=&quot;right&quot;&gt;", "<l1 align=\"right\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1 style=&quot;text-align: left;&quot;&gt;", "<l1 style=\"text-align: left;\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1 style=&quot;text-align: right;&quot;&gt;", "<l1 style=\"text-align: right;\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1 style=&quot;text-align: center;&quot;&gt;", "<l1 style=\"text-align: center;\">", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=left&gt;", "<l1 align=left>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=center&gt;", "<l1 align=center>", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;l1align=right&gt;", "<l1 align=right>", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/l1&gt;", "</l1>", RegexOptions.IgnoreCase);

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
        /// Nothing to undo for undo action
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Nothing to redo for redo action
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a CreateLink button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;a", "<a", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&gt;", ">", RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/a&gt;", "</a>", RegexOptions.IgnoreCase);
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
        /// Decode tags associated to a Delete button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a SelectAll button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a UnSelect button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a UnLink button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a BackColor button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a Copy button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a Cut button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a Paste button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a FontName button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a FontSize button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a ForeColor button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a Indent button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a InsertHorizontalRule button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a Outdent button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Decode tags associated to a RemoveFormat button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
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
        /// Get tooltip assciated to InsertImage button
        /// </summary>
        public override string Tooltip
        {
            get { return "Separator"; }
        }

        /// <summary>         
        /// Decode tags associated to a InsertImage button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            return value;
        }
    }

    #endregion
}
