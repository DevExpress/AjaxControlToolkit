using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace AjaxControlToolkit
{
    /// <summary>
    /// All toolbar buttons for HtmlEditorExtender will be derived from this class.
    /// </summary>
    public abstract class HtmlEditorExtenderButton
    {
        /// <summary>
        /// get name of command that will be passed to execCommand method 
        /// </summary>
        public abstract string CommandName {  get; }

        /// <summary>
        /// get value to show tooltip for the button
        /// </summary>
        public virtual string Tooltip { get { return CommandName; } }

        /// <summary>
        /// Get index of icon
        /// </summary>
        public abstract int IconIndex { get; }

        /// <summary>
        /// Get offset value
        /// </summary>
        public string Offset
        {
            get
            {
                return (IconIndex * HtmlEditorExtender.ButtonWidthDef * -1) + "px 0px";
            }
        }

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
            get {return "Bold"; }
        }

        /// <summary>
        /// Get index of icon
        /// </summary>
        public override int IconIndex {
            get {return 2; }
        }

        /// <summary>         
        /// Decode tags associated to a bold button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value) {
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
            get {return "Italic"; }
        }

        /// <summary>
        /// Get index of icon
        /// </summary>
        public override int IconIndex {
            get {return 3; }
        }

        /// <summary>         
        /// Decode tags associated to a Italic button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value) {
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
        /// Get index of icon
        /// </summary>
        public override int IconIndex
        {
            get { return 4; }
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
        /// Get index of icon
        /// </summary>
        public override int IconIndex
        {
            get { return 5; }
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
        /// Get index of icon
        /// </summary>
        public override int IconIndex
        {
            get { return 6; }
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
        /// Get index of icon
        /// </summary>
        public override int IconIndex
        {
            get { return 7; }
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
        /// Get index of icon
        /// </summary>
        public override int IconIndex
        {
            get { return 10; }
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
        /// Get index of icon
        /// </summary>
        public override int IconIndex
        {
            get { return 12; }
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
            result = Regex.Replace(result, "&lt;div&gt;", "<div>",RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div align=&quot;right&quot;&gt;", "<div align=\"right\">",RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div align=right&gt;", "<div align=right>",RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&lt;div style=&quot;text-align: right;&quot;&gt;", "<div style=\"text-align: right;\">",RegexOptions.IgnoreCase);
            return Regex.Replace(result, "&lt;/div&gt;", "</div>",RegexOptions.IgnoreCase);
            
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
        /// Get index of icon
        /// </summary>
        public override int IconIndex
        {
            get { return 11; }
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
        /// Get index of icon
        /// </summary>
        public override int IconIndex
        {
            get { return 15; }
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
        /// Get index of icon
        /// </summary>
        public override int IconIndex
        {
            get { return 16; }
        }

        /// <summary>         
        /// Decode tags associated to a UnOrderedList button
        /// </summary>
        /// <param name="value">string that contains tags to decode</param>
        /// <returns>string value after decode</returns>
        public override string Decode(string value)
        {
            var result = Regex.Replace(value, "&lt;ul&gt;", "<ul>",RegexOptions.IgnoreCase);
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

    #endregion    
}
