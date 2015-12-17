using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public class DefaultHtmlSanitizer : IHtmlSanitizer {

        public string GetSafeHtmlFragment(string htmlText, Dictionary<string, string[]> tagsWhiteList) {
            var html = new HtmlDocument();
            html.OptionFixNestedTags = true;
            html.OptionAutoCloseOnEnd = true;
            html.OptionDefaultStreamEncoding = Encoding.UTF8;
            html.LoadHtml(htmlText);

            if(html == null)
                return String.Empty;

            Sanitize(new HtmlNodeWrapper(html.DocumentNode), tagsWhiteList);

            return html.DocumentNode.InnerHtml;
        }

        static void Sanitize(IHtmlNode rootNode, IDictionary<string, string[]> whiteList) {
            CleanNodes(rootNode.Children, whiteList);

            if(whiteList.ContainsKey(rootNode.Name))
                CleanAttributes(rootNode.Attributes, whiteList[rootNode.Name]);
        }

        static void CleanNodes(IEnumerable<IHtmlNode> nodes, IDictionary<string, string[]> whiteList) {
            var nodesToBeRemoved = new List<IHtmlNode>();

            foreach(var node in nodes) {
                if(whiteList.ContainsKey(node.Name)) {
                    CleanAttributes(node.Attributes, whiteList[node.Name]);
                    CleanNodes(node.Children, whiteList);
                } else {
                    nodesToBeRemoved.Add(node);
                }
            }

            foreach(var node in nodesToBeRemoved)
                node.Remove();
        }

        static void CleanAttributes(IEnumerable<IHtmlAttribute> attributes, ICollection<string> allowedAttributes) {
            var attributesToBeRemoved = new List<IHtmlAttribute>();

            foreach(var attribute in attributes) {
                if(allowedAttributes.Contains(attribute.Name))
                    CleanAttributeValue(attribute);
                else
                    attributesToBeRemoved.Add(attribute);
            }

            foreach(var attribute in attributesToBeRemoved)
                attribute.Remove();
        }

        static void CleanAttributeValue(IHtmlAttribute attribute) {
            var hasMatch = true;
            while(hasMatch) {
                hasMatch = false;

                // basic

                if(Regex.IsMatch(attribute.Value, @"/\*([a]*|[^a]*)\*/", RegexOptions.IgnoreCase))
                    hasMatch = true;
                attribute.Value = Regex.Replace(attribute.Value, @"/\*([a]*|[^a]*)\*/", "", RegexOptions.IgnoreCase);

                if(Regex.IsMatch(attribute.Value, @"\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:.*", RegexOptions.IgnoreCase))
                    hasMatch = true;
                attribute.Value = Regex.Replace(attribute.Value, @"\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:.*", "", RegexOptions.IgnoreCase);


                if(Regex.IsMatch(attribute.Value, @"\s*s\s*c\s*r\s*i\s*p\s*t\s*", RegexOptions.IgnoreCase))
                    hasMatch = true;
                attribute.Value = Regex.Replace(attribute.Value, @"\s*s\s*c\s*r\s*i\s*p\s*t\s*", "", RegexOptions.IgnoreCase);

                // style attr

                if(attribute.Name == "style") {
                    if(Regex.IsMatch(attribute.Value, @"\s*e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*", RegexOptions.IgnoreCase))
                        hasMatch = true;
                    attribute.Value = Regex.Replace(attribute.Value, @"\s*e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*", "", RegexOptions.IgnoreCase);

                    if(Regex.IsMatch(attribute.Value, @"\s*b\s*e\s*h\s*a\s*v\s*i\s*o\s*r\s*", RegexOptions.IgnoreCase))
                        hasMatch = true;
                    attribute.Value = Regex.Replace(attribute.Value, @"\s*b\s*e\s*h\s*a\s*v\s*i\s*o\s*r\s*", "", RegexOptions.IgnoreCase);

                    if(Regex.IsMatch(attribute.Value, @"-[a-zA-Z\s]+-", RegexOptions.IgnoreCase))
                        hasMatch = true;
                    attribute.Value = Regex.Replace(attribute.Value, @"-[a-zA-Z\s]+-", "", RegexOptions.IgnoreCase);
                }

                // media attr

                if(attribute.Name == "media") {
                    if(Regex.IsMatch(attribute.Value, @"-[a-zA-Z\s]+-", RegexOptions.IgnoreCase))
                        hasMatch = true;
                    attribute.Value = Regex.Replace(attribute.Value, @"-[a-zA-Z\s]+-", "", RegexOptions.IgnoreCase);
                }

                // href & src attrs

                if(attribute.Name == "href" || attribute.Name == "src") {
                    if(Regex.IsMatch(attribute.Value, @"\s*m\s*o\s*c\s*h\s*a\s*", RegexOptions.IgnoreCase))
                        hasMatch = true;

                    attribute.Value = Regex.Replace(attribute.Value, @"\s*m\s*o\s*c\s*h\s*a\s*", "", RegexOptions.IgnoreCase);
                }
            }

            attribute.Value = HttpUtility.HtmlEncode(attribute.Value);

            // HtmlEntity Escape
            var sbAttriuteValue = new StringBuilder();
            foreach(char c in attribute.Value.ToCharArray()) {
                sbAttriuteValue.Append(EncodeCharacterToHtmlEntityEscape(c));
            }

            attribute.Value = sbAttriuteValue.ToString();
        }

        static string EncodeCharacterToHtmlEntityEscape(char c) {
            string hex;
            // check for alphnumeric characters
            if(c < 0xFF) {
                hex = GetEncodedChar(c);
                if(hex == null)
                    return String.Empty + c;
            } else {
                hex = ((int)(c)).ToString("X2");
            }

            // check for illegal characters
            if((c <= 0x1f && c != '\t' && c != '\n' && c != '\r') || (c >= 0x7f && c <= 0x9f))
                hex = "fffd"; // Let's entity encode this instead of returning it

            return "&#x" + hex + ";";
        }

        static string GetEncodedChar(int charCode) {
            if(charCode >= 0x30 && charCode <= 0x39 || charCode >= 0x41 && charCode <= 0x5A || charCode >= 0x61 && charCode <= 0x7A)
                return null;
            else
                return charCode.ToString("X2");
        }
    }

}