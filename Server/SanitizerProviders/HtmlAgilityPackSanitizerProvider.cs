
using System.Collections.Generic;
using HtmlAgilityPack;
using System.Drawing;
using System.Text;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;
namespace AjaxControlToolkit.Sanitizer
{
    class HtmlAgilityPackSanitizerProvider : SanitizerProvider
    {

        private string _applicationName;

        public override string ApplicationName
        {
            get
            {
                return _applicationName;
            }
            set
            {
                _applicationName = value;
            }

        }

        public override bool RequiresFullTrust
        {
            get
            {
                return false;
            }
        }

        public override string GetSafeHtmlFragment(string htmlFragment, Dictionary<string, string[]> elementWhiteList, Dictionary<string, string[]> attributeWhiteList)
        {
            return SanitizeHtml(htmlFragment, elementWhiteList, attributeWhiteList);
        }

        private string SanitizeHtml(string htmlText, Dictionary<string, string[]> elementWhiteList, Dictionary<string, string[]> attributeWhiteList)
        {
            // Create Html document
            HtmlDocument html = new HtmlDocument();
            html.OptionFixNestedTags = true;
            html.OptionAutoCloseOnEnd = true;
            html.OptionDefaultStreamEncoding = Encoding.UTF8;
            html.LoadHtml(htmlText);

            if (html == null)
                return string.Empty;

            HtmlNode allNodes = html.DocumentNode;
            Dictionary<string, string[]> validHtmlTags = elementWhiteList;
            Dictionary<string, string[]> validAttributes = attributeWhiteList;
            string[] tagWhiteList = (from kv in validHtmlTags
                                     select kv.Key).ToArray();

            CleanNodes(allNodes, tagWhiteList);

            // Filter the attributes of the remaining
            foreach (KeyValuePair<string, string[]> tag in validHtmlTags)
            {
                IEnumerable<HtmlNode> nodes = (from n in allNodes.DescendantsAndSelf()
                                               where n.Name == tag.Key
                                               select n);

                if (nodes == null) continue;

                foreach (var n in nodes)
                {
                    if (!n.HasAttributes) continue;

                    // Get all the allowed attributes for this tag
                    HtmlAttribute[] attr = n.Attributes.ToArray();
                    foreach (HtmlAttribute a in attr)
                    {
                        if (!tag.Value.Contains(a.Name))
                        {
                            a.Remove(); // Wasn't in the list
                        }
                        else
                        {
                            CleanAttributeValues(validAttributes, a);
                            // AntiXss
                            //a.Value =
                            //    Microsoft.Security.Application.Encoder.UrlEncode(a.Value);
                        }
                    }
                }
            }

            return allNodes.InnerHtml;
        }

        private void CleanNodes(HtmlNode node, string[] tagWhiteList)
        {
            // remove node that is not in the whitelist.
            if (node.NodeType == HtmlNodeType.Element)
            {
                if (!tagWhiteList.Contains(node.Name))
                {
                    node.ParentNode.RemoveChild(node);
                    return; // We're done
                }
            }

            // remove nested nodes those are not in the whitelist.
            if (node.HasChildNodes)
                CleanChildren(node, tagWhiteList);
        }

        /// <summary>
        /// Apply CleanNodes to each of the child nodes
        /// </summary>
        private void CleanChildren(HtmlNode parent, string[] tagWhiteList)
        {
            for (int i = parent.ChildNodes.Count - 1; i >= 0; i--)
                CleanNodes(parent.ChildNodes[i], tagWhiteList);
        }

        private void CleanAttributeValues(Dictionary<string, string[]> validAttributes, HtmlAttribute attribute)
        {

            attribute.Value = HttpUtility.HtmlEncode(attribute.Value);

            attribute.Value = Regex.Replace(attribute.Value, @"\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*", "", RegexOptions.IgnoreCase);
            attribute.Value = Regex.Replace(attribute.Value, @"\s*s\s*c\s*r\s*i\s*p\s*t\s*", "", RegexOptions.IgnoreCase);

            if (attribute.Name.ToLower() == "style")
            {
                attribute.Value = Regex.Replace(attribute.Value, @"\s*e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*", "", RegexOptions.IgnoreCase);
                attribute.Value = Regex.Replace(attribute.Value, @"\s*b\s*e\s*h\s*a\s*v\s*i\s*o\s*r\s*", "", RegexOptions.IgnoreCase);
            }

            if (attribute.Name.ToLower() == "href" || attribute.Name.ToLower() == "src")
            {
                //if (!attribute.Value.StartsWith("http://") || attribute.Value.StartsWith("/"))
                //    attribute.Value = "";
            }

        }

        //private void CleanAttributeValues(Dictionary<string, string[]> validAttributes, HtmlAttribute attribute)
        //{

        //    // check attribute value
        //    IEnumerable<KeyValuePair<string, string[]>> attKeyValue = (from att in validAttributes
        //                                                               where att.Key == attribute.Name
        //                                                               select att).ToArray();

        //    var isMatched = false;
        //    switch (attribute.Name.ToLower())
        //    {
        //        case "style":
        //            string[] nestedAttributes = attKeyValue.FirstOrDefault().Value;
        //            foreach (string nestedAttribute in nestedAttributes)
        //            {
        //                if (attribute.Value.ToLower().Contains(nestedAttribute.ToLower()))
        //                {
        //                    string lastPart;
        //                    string firstPart = attribute.Value.Substring(0, attribute.Value.ToLower().IndexOf(nestedAttribute.ToLower()));
        //                    string attValue = attribute.Value.Substring(attribute.Value.ToLower().IndexOf(nestedAttribute.ToLower()));
        //                    firstPart += attValue.Substring(0, attValue.IndexOf(":"));
        //                    attValue = attValue.Substring(attValue.IndexOf(":") + 1).Trim();

        //                    switch (nestedAttribute.ToLower())
        //                    {
        //                        case "background-color":
        //                            if (attValue.IndexOf(");") > 0)
        //                            {
        //                                lastPart = attValue.Substring(attValue.IndexOf(");"));
        //                                attValue = attValue.Substring(0, attValue.IndexOf(");"));
        //                            }
        //                            else
        //                            {
        //                                lastPart = attValue.Substring(7);
        //                                attValue = attValue.Substring(0, 7);
        //                            }

        //                            if (!IsValidColor(attValue))
        //                                attribute.Value = firstPart + lastPart;
        //                            break;
        //                        case "margin":
        //                        case "margin-right":
        //                        case "margin-left":
        //                        case "margin-top":
        //                        case "margin-bottom":
        //                        case "padding":
        //                            lastPart = attValue.Substring(attValue.IndexOf("px"));
        //                            attValue = attValue.Substring(0, attValue.IndexOf("px")).Trim();
        //                            string[] arrValues = attValue.Split(" ".ToCharArray());
        //                            attValue = "";
        //                            foreach (string arrVal in arrValues)
        //                            {
        //                                attValue += arrVal.Trim();
        //                            }
        //                            int marginVal;
        //                            if (!int.TryParse(attValue, out marginVal))
        //                                attribute.Value = firstPart + lastPart;
        //                            break;
        //                        case "border":
        //                            lastPart = attValue.Substring(attValue.IndexOf(";"));
        //                            attValue = attValue.Substring(0, attValue.IndexOf(";")).Trim();
        //                            if (attValue.ToLower() != "none")
        //                                attribute.Value = firstPart + lastPart;
        //                            break;
        //                        case "text-align":
        //                            lastPart = attValue.Substring(attValue.IndexOf(";"));
        //                            attValue = attValue.Substring(0, attValue.IndexOf(";")).Trim();
        //                            // get possible attribute values
        //                            attKeyValue = (from att in validAttributes
        //                                           where att.Key == "align"
        //                                           select att).ToArray();

        //                            isMatched = false;
        //                            foreach (string arrVal in attKeyValue.FirstOrDefault().Value)
        //                            {
        //                                if (attValue == arrVal)
        //                                    isMatched = true;
        //                            }

        //                            if (!isMatched)
        //                                attribute.Value = firstPart + lastPart;
        //                            break;
        //                    }
        //                }
        //            }
        //            break;
        //        case "align":
        //        case "dir":
        //        case "size":
        //            attKeyValue = (from att in validAttributes
        //                           where att.Key == attribute.Name
        //                           select att).ToArray();

        //            isMatched = false;
        //            foreach (string arrVal in attKeyValue.FirstOrDefault().Value)
        //            {
        //                if (attribute.Value.ToLower() == arrVal.ToLower())
        //                    isMatched = true;
        //            }
        //            if (!isMatched)
        //                attribute.Value = "";
        //            break;
        //        case "face":
        //            attKeyValue = (from att in validAttributes
        //                           where att.Key == attribute.Name
        //                           select att).ToArray();

        //            isMatched = false;
        //            foreach (string arrVal in attKeyValue.FirstOrDefault().Value)
        //            {
        //                if (attribute.Value.ToLower().Contains(arrVal.ToLower()))
        //                    isMatched = true;
        //            }
        //            if (!isMatched)
        //                attribute.Value = "";
        //            break;
        //        case "color":
        //            if (!IsValidColor(attribute.Value))
        //                attribute.Value = "";
        //            break;
        //        case "width":
        //            if (!IsValidWidth(attribute.Value))
        //                attribute.Value = "";
        //            break;
        //        case "href":
        //        case "src":
        //            //attribute.Value = HttpUtility.UrlEncode(attribute.Value);
        //            break;
        //    }
        //}

        /// <summary>
        /// Checks if agrument value represents to a valid color.
        /// </summary>
        /// <param name="colorValue">#hash or argb value.</param>
        /// <returns>If valid color then true else false.</returns>
        //private bool IsValidColor(string colorValue)
        //{
        //    try
        //    {
        //        if (colorValue.StartsWith("#"))
        //        {
        //            Color validColor = ColorTranslator.FromHtml(colorValue);
        //            return true;
        //        }
        //        else if (colorValue.StartsWith("rgb"))
        //        {
        //            colorValue = colorValue.Substring(colorValue.IndexOf("(") + 1);
        //            colorValue = colorValue.Substring(0, colorValue.LastIndexOf(")"));
        //            string[] rgbValues = colorValue.Split(",".ToCharArray());
        //            Color validColor = Color.FromArgb(int.Parse(rgbValues[0]), int.Parse(rgbValues[1]), int.Parse(rgbValues[2]));
        //            return true;
        //        }
        //    }
        //    catch
        //    {
        //        return false;
        //    }
        //    return false;
        //}

        /// <summary>
        /// Checks if agrument value represents to a valid width.
        /// </summary>
        /// <param name="widthVal">width value.</param>
        /// <returns>If valid width then true else false.</returns>
        //private bool IsValidWidth(string widthVal)
        //{
        //    widthVal = widthVal.Replace("px", "").Replace("%", "");
        //    try
        //    {
        //        decimal validWidth = decimal.Parse(widthVal.Trim());
        //        return true;
        //    }
        //    catch
        //    {
        //        return false;
        //    }
        //}

    }

    //class WhiteList
    //{
    //    private Dictionary<string, string[]> _TagList;
    //    private Dictionary<string, string[]> _AttributeList;

    //    public Dictionary<string, string[]> TagList
    //    {
    //        get
    //        {
    //            if (_TagList == null)
    //            {
    //                CreateWhiteList();
    //            }
    //            return _TagList;
    //        }
    //    }

    //    public Dictionary<string, string[]> AttributeList
    //    {
    //        get
    //        {
    //            if (_AttributeList == null)
    //            {
    //                CreateWhiteList();
    //            }
    //            return _AttributeList;
    //        }
    //    }

    //    private void CreateWhiteList()
    //    {
    //        // make list of tags and its relatd attributes
    //        _TagList = new Dictionary<string, string[]>();

    //        _TagList.Add("strong", new string[] { "style", "class" });
    //        _TagList.Add("b", new string[] { "style", "class" });
    //        _TagList.Add("em", new string[] { "style", "class" });
    //        _TagList.Add("i", new string[] { "style", "class" });
    //        _TagList.Add("u", new string[] { "style", "class" });
    //        _TagList.Add("strike", new string[] { "style", "class" });
    //        _TagList.Add("sub", new string[] { "style", "class" });
    //        _TagList.Add("sup", new string[] { "style", "class" });
    //        _TagList.Add("p", new string[] { "style", "class", "align", "dir" });
    //        _TagList.Add("ol", new string[] { "style", "class" });
    //        _TagList.Add("li", new string[] { "style", "class" });
    //        _TagList.Add("ul", new string[] { "style", "class" });
    //        _TagList.Add("font", new string[] { "style", "class", "color", "face", "size" });
    //        _TagList.Add("blockquote", new string[] { "style", "class", "dir" });
    //        _TagList.Add("hr", new string[] { "style", "class", "size", "width" });
    //        _TagList.Add("img", new string[] { "style", "class", "src", "height", "width", "alt", "title", "hspace", "vspace", "border" });
    //        _TagList.Add("div", new string[] { "style", "class", "align" });
    //        _TagList.Add("span", new string[] { "style", "class" });
    //        _TagList.Add("br", new string[] { "style", "class" });
    //        _TagList.Add("center", new string[] { "style", "class" });
    //        _TagList.Add("a", new string[] { "style", "class", "href", "title", "target" });

    //        _AttributeList = new Dictionary<string, string[]>();
    //        // create white list of attributes and its values
    //        _AttributeList.Add("style", new string[] { "background-color", "margin", "margin-right", "margin-left", "margin-top", "margin-bottom", "padding", "border", "text-align" });
    //        _AttributeList.Add("align", new string[] { "left", "right", "center", "justify" });
    //        _AttributeList.Add("color", new string[] { });
    //        _AttributeList.Add("size", new string[] { "1", "2", "3", "4", "5", "6", "7" });
    //        _AttributeList.Add("face", new string[] { "Arial", "Courier New", "Georgia", "Tahoma", "Times New Roman", "Verdana", "Impact", "Wingdings", "Sans-seri", "helvetica" });
    //        _AttributeList.Add("dir", new string[] { "ltr", "rtl", "Auto" });
    //        _AttributeList.Add("width", new string[] { });
    //        _AttributeList.Add("src", new string[] { });
    //        _AttributeList.Add("href", new string[] { });           
    //    }

    //}
}
