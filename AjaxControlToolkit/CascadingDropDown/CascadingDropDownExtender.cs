using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.CascadingDropDownExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.CascadingDropDownBehavior", Constants.CascadingDropDownScriptName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(DropDownList))]
    [ToolboxBitmap(typeof(CascadingDropDown), "CascadingDropDown.ico")]
    public class CascadingDropDown : ExtenderControlBase {
        public CascadingDropDown() {
            ClientStateValuesLoaded += new EventHandler(CascadingDropDown_ClientStateValuesLoaded);
            EnableClientState = true;
        }

        [IDReferenceProperty(typeof(DropDownList))]
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string ParentControlID {
            get { return GetPropertyValue<string>("ParentControlID", String.Empty); }
            set { SetPropertyValue<string>("ParentControlID", value); }
        }

        // Used when communicating with the helper web service
        [RequiredProperty()]
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string Category {
            get { return GetPropertyValue<string>("Category", String.Empty); }
            set { SetPropertyValue<string>("Category", value); }
        }

        // Optional text displayed by a DropDownList the user has not yet touched.
        // If omitted, first item in the dropdown is selected
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string PromptText {
            get { return GetPropertyValue<string>("PromptText", String.Empty); }
            set { SetPropertyValue<string>("PromptText", value); }
        }

        // Optional value for the option displayed by a DropDownList showing the PromptText
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string PromptValue {
            get { return GetPropertyValue<string>("PromptValue", String.Empty); }
            set { SetPropertyValue<string>("PromptValue", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string EmptyText {
            get { return GetPropertyValue<string>("EmptyText", String.Empty); }
            set { SetPropertyValue<string>("EmptyText", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string EmptyValue {
            get { return GetPropertyValue<string>("EmptyValue", String.Empty); }
            set { SetPropertyValue<string>("EmptyValue", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string LoadingText {
            get { return GetPropertyValue<string>("LoadingText", String.Empty); }
            set { SetPropertyValue<string>("LoadingText", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string SelectedValue {
            get { return ClientState ?? String.Empty; }
            set { ClientState = value; }
        }

        [UrlProperty()]
        [ExtenderControlProperty()]
        [TypeConverter(typeof(ServicePathConverter))]
        public string ServicePath {
            get { return GetPropertyValue<string>("ServicePath", String.Empty); }
            set { SetPropertyValue<string>("ServicePath", value); }
        }

        // Prevent the service path from being serialized when it's empty
        bool ShouldSerializeServicePath() {
            return !String.IsNullOrEmpty(ServiceMethod);
        }

        [RequiredProperty()]
        [DefaultValue("")]
        [ExtenderControlProperty()]
        public string ServiceMethod {
            get { return GetPropertyValue<string>("ServiceMethod", String.Empty); }
            set { SetPropertyValue<string>("ServiceMethod", value); }
        }

        // User/page specific context provided to an optional overload of the
        // web method described by ServiceMethod/ServicePath.  If the context
        // key is used, it should have the same signature with an additional
        // parameter named contextKey of type string.
        [ExtenderControlProperty]
        [ClientPropertyName("contextKey")]
        [DefaultValue(null)]
        public string ContextKey {
            get { return GetPropertyValue<string>("ContextKey", null); }
            set {
                SetPropertyValue<string>("ContextKey", value);
                UseContextKey = true;
            }
        }

        // Whether or not the ContextKey property should be used.  This will be
        // automatically enabled if the ContextKey property is ever set
        // (on either the client or the server).  If the context key is used,
        // it should have the same signature with an additional parameter
        // named contextKey of type string.
        [ExtenderControlProperty]
        [ClientPropertyName("useContextKey")]
        [DefaultValue(false)]
        public bool UseContextKey {
            get { return GetPropertyValue<bool>("UseContextKey", false); }
            set { SetPropertyValue<bool>("UseContextKey", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("useHttpGet")]
        [DefaultValue(false)]
        public bool UseHttpGet {
            get { return GetPropertyValue<bool>("UseHttpGet", false); }
            set { SetPropertyValue<bool>("UseHttpGet", value); }
        }

        // Whether or not disable the dropdownlist control when this is waiting to 
        // get data from the service so at the time of loading user can use keyboard 
        // to navigate to the dropdown control.        
        [ExtenderControlProperty]
        [ClientPropertyName("enableAtLoading")]
        [DefaultValue(false)]
        public bool EnableAtLoading {
            get { return GetPropertyValue<bool>("EnableAtLoading", false); }
            set { SetPropertyValue<bool>("EnableAtLoading", value); }
        }

        // Populate DropDownLists with their SelectedValues
        void CascadingDropDown_ClientStateValuesLoaded(object sender, EventArgs e) {
            var dropDownList = (DropDownList)TargetControl;
            if(dropDownList == null)
                throw new ArgumentNullException("No target control is set for the CascadingDropDown extender.");

            dropDownList.Items.Clear();
            var separator = ":::";
            var clientState = base.ClientState;
            var separatorIndex = (clientState ?? String.Empty).IndexOf(separator, StringComparison.Ordinal);
            if(separatorIndex  == - 1)
                dropDownList.Items.Add(clientState);
            else {
                // Parse the value/text/optionTitle out of ClientState and set them
                var tokens = Regex.Split(clientState, separator);
                var value = tokens[0];
                var text = tokens[1];
                var item = new ListItem(text, value);
                if(tokens.Length > 2) {
                    var optionTitle = tokens[2];
                    item.Attributes.Add("title", optionTitle);
                }
                dropDownList.Items.Add(item);
            }
        }

        // Helper method to parse the private storage format used to communicate known category/value pairs
        // param knownCategoryValues - private storage format string
        // returns dictionary of category/value pairs
        public static StringDictionary ParseKnownCategoryValuesString(string knownCategoryValues) {
            // Validate parameters
            if(knownCategoryValues == null)
                throw new ArgumentNullException("knownCategoryValues");

            var dictionary = new StringDictionary();
            if(knownCategoryValues != null)
                // Split into category/value pairs
                foreach(var knownCategoryValue in knownCategoryValues.Split(';')) {
                    // Split into category and value
                    var knownCategoryValuePair = knownCategoryValue.Split(':');
                    if(knownCategoryValuePair.Length == 2)
                        dictionary.Add(knownCategoryValuePair[0].ToLowerInvariant(), knownCategoryValuePair[1]);
                }

            return dictionary;
        }

        // Helper method to provide a simple implementation of a method to query a data set and return the relevant drop down contents

        // param document - XML document containing the data set
        // param documentHierarchy - list of strings representing the hierarchy of the data set
        // param knownCategoryValuesDictionar - known category/value pairs
        // param category - category for which the drop down contents are desired
        // returns contents of the specified drop down subject to the choices already made
        public static CascadingDropDownNameValue[] QuerySimpleCascadingDropDownDocument(XmlDocument document, string[] documentHierarchy, StringDictionary knownCategoryValuesDictionary, string category) {
            // Use a default Regex for input validation that excludes any user input with the characters
            // '/', ''', or '*' in an effort to prevent XPath injection attacks against the web service.
            // Public sites should use a more restrictive Regex that is customized for their own data.
            return QuerySimpleCascadingDropDownDocument(document, documentHierarchy, knownCategoryValuesDictionary, category, new Regex("^[^/'\\*]*$"));
        }

        // Helper method to provide a simple implementation of a method to query a data set and return the relevant drop down contents

        // param document - XML document containing the data set
        // param documentHierarchy - list of strings representing the hierarchy of the data set
        // param knownCategoryValuesDictionary - known category/value pairs
        // param category - category for which the drop down contents are desired
        // param inputValidationRegex - regular expression used to validate user input to the web service (to prevent XPath injection attacks)
        // returns contents of the specified drop down subject to the choices already made
        public static CascadingDropDownNameValue[] QuerySimpleCascadingDropDownDocument(XmlDocument document, string[] documentHierarchy,
            StringDictionary knownCategoryValuesDictionary, string category, Regex inputValidationRegex) {

            // Validate parameters
            if(document == null)
                throw new ArgumentNullException("document");
            if(documentHierarchy == null)
                throw new ArgumentNullException("documentHierarchy");
            if(knownCategoryValuesDictionary == null)
                throw new ArgumentNullException("knownCategoryValuesDictionary");
            if(category == null)
                throw new ArgumentNullException("category");
            if(inputValidationRegex == null)
                throw new ArgumentNullException("inputValidationRegex");

            // Validate input
            foreach(string key in knownCategoryValuesDictionary.Keys)
                if(!inputValidationRegex.IsMatch(key) || !inputValidationRegex.IsMatch(knownCategoryValuesDictionary[key]))
                    throw new ArgumentException("Invalid characters present.", "category");

            if(!inputValidationRegex.IsMatch(category))
                throw new ArgumentException("Invalid characters present.", "category");

            // Root the XPath query
            var xpath = "/" + document.DocumentElement.Name;

            // Build an XPath query into the data set to select the relevant items
            foreach(var key in documentHierarchy)
                if(knownCategoryValuesDictionary.ContainsKey(key))
                    xpath += String.Format(CultureInfo.InvariantCulture, "/{0}[(@name and @value='{1}') or (@name='{1}' and not(@value))]", key, knownCategoryValuesDictionary[key]);

            xpath += ("/" + category.ToLowerInvariant());

            // Perform the XPath query and add the results to the list
            var result = new List<CascadingDropDownNameValue>();
            foreach(XmlNode node in document.SelectNodes(xpath)) {
                var name = node.Attributes.GetNamedItem("name").Value;

                var valueNode = node.Attributes.GetNamedItem("value");
                var value = ((valueNode != null) ? valueNode.Value : name);

                var defaultNode = node.Attributes.GetNamedItem("default");
                var defaultValue = ((defaultNode != null) ? bool.Parse(defaultNode.Value) : false);

                var dropDownOptionItem = new CascadingDropDownNameValue(name, value, defaultValue);

                var optionTitleNode = node.Attributes.GetNamedItem("optionTitle");
                var optionTitle = ((optionTitleNode != null) ? optionTitleNode.Value : String.Empty);
                dropDownOptionItem.optionTitle = optionTitle;
                result.Add(dropDownOptionItem);
            }

            return result.ToArray();
        }
    }

}
