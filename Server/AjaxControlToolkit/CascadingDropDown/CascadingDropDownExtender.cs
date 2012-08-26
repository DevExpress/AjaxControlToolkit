

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("CascadingDropDown.CascadingDropDownBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("CascadingDropDown.CascadingDropDownBehavior.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit
{
    /// <summary>
    /// CascadingDropDown extender class definition
    /// </summary>
    [Designer("AjaxControlToolkit.CascadingDropDownDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.CascadingDropDownBehavior", "CascadingDropDown.CascadingDropDownBehavior.js")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(DropDownList))]
    [System.Drawing.ToolboxBitmap(typeof(CascadingDropDown), "CascadingDropDown.CascadingDropDown.ico")]
    public class CascadingDropDown : ExtenderControlBase
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public CascadingDropDown()
        {
            ClientStateValuesLoaded += new EventHandler(CascadingDropDown_ClientStateValuesLoaded);
            EnableClientState = true;
        }

        /// <summary>
        /// Optional ID of the parent DropDownList (upon which the contents of this control are based)
        /// </summary>
        [IDReferenceProperty(typeof(DropDownList))]
        [DefaultValue("")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        [ExtenderControlProperty()]
        public string ParentControlID
        {
            get { return GetPropertyValue<string>("ParentControlID", ""); }
            set { SetPropertyValue<string>("ParentControlID", value); }
        }

        /// <summary>
        /// Category of this DropDownList (used when communicating with the helper web service)
        /// </summary>
        [RequiredProperty()]
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string Category
        {
            get { return GetPropertyValue<string>("Category", ""); }
            set { SetPropertyValue<string>("Category", value); }
        }

        /// <summary>
        /// Optional text displayed by a DropDownList the user has not yet touched.
        /// If omitted, first item in the dropdown is selected
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string PromptText
        {
            get { return GetPropertyValue<string>("PromptText", ""); }
            set { SetPropertyValue<string>("PromptText", value); }
        }

        /// <summary>
        /// Optional value for the option displayed by a DropDownList showing the PromptText
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string PromptValue
        {
            get { return GetPropertyValue<string>("PromptValue", ""); }
            set { SetPropertyValue<string>("PromptValue", value); }
        }

        /// <summary>
        /// Optional text for the option displayed when the list is empty
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string EmptyText
        {
            get { return GetPropertyValue<string>("EmptyText", ""); }
            set { SetPropertyValue<string>("EmptyText", value); }
        }

        /// <summary>
        /// Optional value for the option displayed when the list is empty
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string EmptyValue
        {
            get { return GetPropertyValue<string>("EmptyValue", ""); }
            set { SetPropertyValue<string>("EmptyValue", value); }
        }

        /// <summary>
        /// Optional text displayed by a DropDownList when it is loading its data
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string LoadingText
        {
            get { return GetPropertyValue<string>("LoadingText", ""); }
            set { SetPropertyValue<string>("LoadingText", value); }
        }

        /// <summary>
        /// Selected value of the drop down
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string SelectedValue
        {
            get { return ClientState ?? ""; }
            set { ClientState = value; }
        }

        /// <summary>
        /// Path to the helper web service
        /// </summary>        
        [UrlProperty()]
        [ExtenderControlProperty()]
        [TypeConverter(typeof(ServicePathConverter))]
        public string ServicePath
        {
            get { return GetPropertyValue<string>("ServicePath", ""); }
            set { SetPropertyValue<string>("ServicePath", value); }
        }

        /// <summary>
        /// Prevent the service path from being serialized when it's empty
        /// </summary>
        /// <returns>Whether the service path should be serialized</returns>
        private bool ShouldSerializeServicePath()
        {
            return !string.IsNullOrEmpty(ServiceMethod);
        }

        /// <summary>
        /// Name of the web service method
        /// </summary>
        [RequiredProperty()]
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string ServiceMethod
        {
            get { return GetPropertyValue<string>("ServiceMethod", ""); }
            set { SetPropertyValue<string>("ServiceMethod", value); }
        }

        /// <summary>
        /// User/page specific context provided to an optional overload of the
        /// web method described by ServiceMethod/ServicePath.  If the context
        /// key is used, it should have the same signature with an additional
        /// parameter named contextKey of type string.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("contextKey")]
        [DefaultValue(null)]
        public string ContextKey
        {
            get { return GetPropertyValue<string>("ContextKey", null); }
            set
            {
                SetPropertyValue<string>("ContextKey", value);
                UseContextKey = true;
            }
        }

        /// <summary>
        /// Whether or not the ContextKey property should be used.  This will be
        /// automatically enabled if the ContextKey property is ever set
        /// (on either the client or the server).  If the context key is used,
        /// it should have the same signature with an additional parameter
        /// named contextKey of type string.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("useContextKey")]
        [DefaultValue(false)]
        public bool UseContextKey
        {
            get { return GetPropertyValue<bool>("UseContextKey", false); }
            set { SetPropertyValue<bool>("UseContextKey", value); }
        }

        /// <summary>
        /// Determines whether to use HttpGet or HttpPost method for the postback to the server.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("useHttpGet")]
        [DefaultValue(false)]
        public bool UseHttpGet
        {
            get { return GetPropertyValue<bool>("UseHttpGet", false); }
            set { SetPropertyValue<bool>("UseHttpGet", value); }
        }

        /// Whether or not disable the dropdownlist control when this is waiting to 
        /// get data from the service so at the time of loading user can use keyboard 
        /// to navigate to the dropdown control.        
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("enableAtLoading")]
        [DefaultValue(false)]
        public bool EnableAtLoading
        {
            get { return GetPropertyValue<bool>("EnableAtLoading", false); }
            set { SetPropertyValue<bool>("EnableAtLoading", value); }
        }

        /// <summary>
        /// Populate DropDownLists with their SelectedValues
        /// </summary>
        private void CascadingDropDown_ClientStateValuesLoaded(object sender, EventArgs e)
        {
            DropDownList dropDownList = (DropDownList)TargetControl;
            if (null == dropDownList)
            {
                throw new ArgumentNullException("No target control is set for the CascadingDropDown extender.");
            }

            dropDownList.Items.Clear();
            string separator = ":::";
            string clientState = base.ClientState;
            int separatorIndex = (clientState ?? "").IndexOf(separator, StringComparison.Ordinal);
            if (-1 == separatorIndex)
            {
                // ClientState is the value to set
                dropDownList.Items.Add(clientState);
            }
            else
            {
                // Parse the value/text/optionTitle out of ClientState and set them
                string[] tokens = Regex.Split(clientState, separator);
                string value = tokens[0];
                string text = tokens[1];
                ListItem item = new ListItem(text, value);
                if (tokens.Length > 2) {
                    string optionTitle = tokens[2];
                    item.Attributes.Add("title", optionTitle);
                }
                dropDownList.Items.Add(item);
            }        
        }

        /// <summary>
        /// Helper method to parse the private storage format used to communicate known category/value pairs
        /// </summary>
        /// <param name="knownCategoryValues">private storage format string</param>
        /// <returns>dictionary of category/value pairs</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase", Justification = "Avoiding possible breaking change")]
        public static StringDictionary ParseKnownCategoryValuesString(string knownCategoryValues)
        {
            // Validate parameters
            if (null == knownCategoryValues)
            {
                throw new ArgumentNullException("knownCategoryValues");
            }

            StringDictionary dictionary = new StringDictionary();
            if (null != knownCategoryValues)
            {
                // Split into category/value pairs
                foreach (string knownCategoryValue in knownCategoryValues.Split(';'))
                {
                    // Split into category and value
                    string[] knownCategoryValuePair = knownCategoryValue.Split(':');
                    if (2 == knownCategoryValuePair.Length)
                    {
                        // Add the pair to the dictionary
                        dictionary.Add(knownCategoryValuePair[0].ToLowerInvariant(), knownCategoryValuePair[1]);
                    }
                }
            }
            return dictionary;
        }

        /// <summary>
        /// Helper method to provide a simple implementation of a method to query a data set and return the relevant drop down contents
        /// </summary>
        /// <param name="document">XML document containing the data set</param>
        /// <param name="documentHierarchy">list of strings representing the hierarchy of the data set</param>
        /// <param name="knownCategoryValuesDictionary">known category/value pairs</param>
        /// <param name="category">category for which the drop down contents are desired</param>
        /// <returns>contents of the specified drop down subject to the choices already made</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1059:MembersShouldNotExposeCertainConcreteTypes", Justification = "Non-IXPathNavigable members of XmlDocument are used")]
        public static CascadingDropDownNameValue[] QuerySimpleCascadingDropDownDocument(XmlDocument document, string[] documentHierarchy, StringDictionary knownCategoryValuesDictionary, string category)
        {
            // Use a default Regex for input validation that excludes any user input with the characters
            // '/', ''', or '*' in an effort to prevent XPath injection attacks against the web service.
            // Public sites should use a more restrictive Regex that is customized for their own data.
            return QuerySimpleCascadingDropDownDocument(document, documentHierarchy, knownCategoryValuesDictionary, category, new Regex("^[^/'\\*]*$"));
        }

        /// <summary>
        /// Helper method to provide a simple implementation of a method to query a data set and return the relevant drop down contents
        /// </summary>
        /// <param name="document">XML document containing the data set</param>
        /// <param name="documentHierarchy">list of strings representing the hierarchy of the data set</param>
        /// <param name="knownCategoryValuesDictionary">known category/value pairs</param>
        /// <param name="category">category for which the drop down contents are desired</param>
        /// <param name="inputValidationRegex">regular expression used to validate user input to the web service (to prevent XPath injection attacks)</param>
        /// <returns>contents of the specified drop down subject to the choices already made</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1059:MembersShouldNotExposeCertainConcreteTypes", Justification = "Non-IXPathNavigable members of XmlDocument are used")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase", Justification = "Avoiding possible breaking change")]
        public static CascadingDropDownNameValue[] QuerySimpleCascadingDropDownDocument(XmlDocument document, string[] documentHierarchy, StringDictionary knownCategoryValuesDictionary, string category, Regex inputValidationRegex)
        {
            // Validate parameters
            if (null == document)
            {
                throw new ArgumentNullException("document");
            }
            if (null == documentHierarchy)
            {
                throw new ArgumentNullException("documentHierarchy");
            }
            if (null == knownCategoryValuesDictionary)
            {
                throw new ArgumentNullException("knownCategoryValuesDictionary");
            }
            if (null == category)
            {
                throw new ArgumentNullException("category");
            }
            if (null == inputValidationRegex)
            {
                throw new ArgumentNullException("inputValidationRegex");
            }

            // Validate input
            foreach (string key in knownCategoryValuesDictionary.Keys)
            {
                if (!inputValidationRegex.IsMatch(key) || !inputValidationRegex.IsMatch(knownCategoryValuesDictionary[key]))
                {
                    throw new ArgumentException("Invalid characters present.", "category");
                }
            }
            if (!inputValidationRegex.IsMatch(category))
            {
                throw new ArgumentException("Invalid characters present.", "category");
            }

            // Root the XPath query
            string xpath = "/" + document.DocumentElement.Name;

            // Build an XPath query into the data set to select the relevant items
            foreach (string key in documentHierarchy)
            {
                if (knownCategoryValuesDictionary.ContainsKey(key))
                {
                    xpath += string.Format(CultureInfo.InvariantCulture, "/{0}[(@name and @value='{1}') or (@name='{1}' and not(@value))]", key, knownCategoryValuesDictionary[key]);
                }
            }
            xpath += ("/" + category.ToLowerInvariant());

            // Perform the XPath query and add the results to the list
            List<CascadingDropDownNameValue> result = new List<CascadingDropDownNameValue>();
            foreach (XmlNode node in document.SelectNodes(xpath))
            {
                string name = node.Attributes.GetNamedItem("name").Value;
                XmlNode valueNode = node.Attributes.GetNamedItem("value");
                string value = ((null != valueNode) ? valueNode.Value : name);
                XmlNode defaultNode = node.Attributes.GetNamedItem("default");
                bool defaultValue = ((null != defaultNode) ? bool.Parse(defaultNode.Value) : false);
                CascadingDropDownNameValue dropDownOptionItem = new CascadingDropDownNameValue(name, value, defaultValue);

                XmlNode optionTitleNode = node.Attributes.GetNamedItem("optionTitle");
                string optionTitle = ((null != optionTitleNode) ? optionTitleNode.Value : "");
                dropDownOptionItem.optionTitle = optionTitle;
                result.Add(dropDownOptionItem);
            }

            // Return the list
            return result.ToArray();
        }
    }
}
