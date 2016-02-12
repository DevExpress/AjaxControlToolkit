#pragma warning disable 1591
using AjaxControlToolkit.Design;
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

    /// <summary>
    /// CascadingDropDown is an ASP.NET AJAX extender that can be attached to an ASP.NET
    /// DropDownList control to get automatic population of a set of DropDownList controls.
    /// Each time selection of one DropDownList control changes, CascadingDropDown makes a call 
    /// to a specified web service to retrieve the list of values for the next DropDownList in the set.
    /// </summary>
    [Designer(typeof(CascadingDropDownExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.CascadingDropDownBehavior", Constants.CascadingDropDownName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(ListBox))]
    [TargetControlType(typeof(DropDownList))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.CascadingDropDownName + Constants.IconPostfix)]
    public class CascadingDropDown : ExtenderControlBase {
        public CascadingDropDown() {
            ClientStateValuesLoaded += new EventHandler(CascadingDropDown_ClientStateValuesLoaded);
            EnableClientState = true;
        }

        /// <summary>
        /// An optional ID of the parent DropDownList (on which the content of this control is based).
        /// </summary>
        [IDReferenceProperty(typeof(DropDownList))]
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("parentControlID")]
        public string ParentControlID {
            get { return GetPropertyValue<string>("ParentControlID", String.Empty); }
            set { SetPropertyValue<string>("ParentControlID", value); }
        }

        // Used when communicating with the helper web service
        /// <summary>
        /// A category of this DropDownList (used when communicating with the helper web service).
        /// </summary>
        [RequiredProperty()]
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("category")]
        public string Category {
            get { return GetPropertyValue<string>("Category", String.Empty); }
            set { SetPropertyValue<string>("Category", value); }
        }

        /// <summary>
        /// Optional text displayed by DropDownList a user has not yet touched. If omitted, the first dropdown item is selected.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("promptText")]
        public string PromptText {
            get { return GetPropertyValue<string>("PromptText", String.Empty); }
            set { SetPropertyValue<string>("PromptText", value); }
        }

        /// <summary>
        /// An optional value for an option displayed by DropDownList showing PromptText.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("promptValue")]
        public string PromptValue {
            get { return GetPropertyValue<string>("PromptValue", String.Empty); }
            set { SetPropertyValue<string>("PromptValue", value); }
        }

        /// <summary>
        /// Optional text for an option displayed when the list is empty.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("emptyText")]
        public string EmptyText {
            get { return GetPropertyValue<string>("EmptyText", String.Empty); }
            set { SetPropertyValue<string>("EmptyText", value); }
        }

        /// <summary>
        /// An optional value for an option displayed when the list is empty.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("emptyValue")]
        public string EmptyValue {
            get { return GetPropertyValue<string>("EmptyValue", String.Empty); }
            set { SetPropertyValue<string>("EmptyValue", value); }
        }

        /// <summary>
        /// Optional text displayed by DropDownList when it is loading its data.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("loadingText")]
        public string LoadingText {
            get { return GetPropertyValue<string>("LoadingText", String.Empty); }
            set { SetPropertyValue<string>("LoadingText", value); }
        }

        /// <summary>
        /// A selected value of the dropdown.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("selectedValue")]
        public string SelectedValue {
            get { return ClientState ?? String.Empty; }
            set { ClientState = value; }
        }

        /// <summary>
        /// A path to the helper web service.
        /// </summary>
        [UrlProperty()]
        [ExtenderControlProperty()]
        [TypeConverter(typeof(ServicePathConverter))]
        [ClientPropertyName("servicePath")]
        public string ServicePath {
            get { return GetPropertyValue<string>("ServicePath", String.Empty); }
            set { SetPropertyValue<string>("ServicePath", value); }
        }

        // Prevent the service path from being serialized when it's empty
        bool ShouldSerializeServicePath() {
            return !String.IsNullOrEmpty(ServiceMethod);
        }

        /// <summary>
        /// The name of a web service method.
        /// </summary>
        [RequiredProperty()]
        [DefaultValue("")]
        [ExtenderControlProperty()]
        [ClientPropertyName("serviceMethod")]
        public string ServiceMethod {
            get { return GetPropertyValue<string>("ServiceMethod", String.Empty); }
            set { SetPropertyValue<string>("ServiceMethod", value); }
        }

        /// <summary>
        /// User/page specific context provided to an optional overload of the web method described by ServiceMethod/ServicePath.
        /// If the context key is used, it should have the same signature with an additional parameter named contextKey of the sting type.
        /// </summary>
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

        /// <summary>
        /// Determines whether or not the ContextKey property should be used. 
        /// It will be automatically enabled if the ContextKey property is ever set (either on the client or server side). 
        /// If the context key is used, it should have the same signature with an additional parameter named contextKey of the string type.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("useContextKey")]
        [DefaultValue(false)]
        public bool UseContextKey {
            get { return GetPropertyValue<bool>("UseContextKey", false); }
            set { SetPropertyValue<bool>("UseContextKey", value); }
        }

        /// <summary>
        /// Determines whether or not to use the HTTP GET method for requesting data.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("useHttpGet")]
        [DefaultValue(false)]
        public bool UseHttpGet {
            get { return GetPropertyValue<bool>("UseHttpGet", false); }
            set { SetPropertyValue<bool>("UseHttpGet", value); }
        }

        /// <summary>
        /// Determines wether or not to disable the DropDownList control when it is waiting for data from the service,
        /// so on loading a user can use the keyboard to navigate to the drop-down control.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("enableAtLoading")]
        [DefaultValue(false)]
        public bool EnableAtLoading {
            get { return GetPropertyValue<bool>("EnableAtLoading", false); }
            set { SetPropertyValue<bool>("EnableAtLoading", value); }
        }

        // Populate DropDownLists with their SelectedValues
        void CascadingDropDown_ClientStateValuesLoaded(object sender, EventArgs e) {
            var dropDownList = (ListControl)TargetControl;
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

        /// <summary>
        /// A helper method to parse the private storage format used to communicate with known category/value pairs.
        /// </summary>
        /// <param name="knownCategoryValues">Private storage format string</param>
        /// <returns>Dictionary of category/value pairs</returns>
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

        /// <summary>
        /// A helper method to provide simple implementation of a method to query a data set and return relevant dropdown content.
        /// </summary>
        /// <param name="document">XML document containing the data set</param>
        /// <param name="documentHierarchy">List of strings representing the hierarchy of the data set</param>
        /// <param name="knownCategoryValuesDictionary">Known category/value pairs</param>
        /// <param name="category">Category for which the drop down contents are desired</param>
        /// <returns>Contents of the specified drop down subject to the choices already made</returns>
        public static CascadingDropDownNameValue[] QuerySimpleCascadingDropDownDocument(XmlDocument document, string[] documentHierarchy, StringDictionary knownCategoryValuesDictionary, string category) {
            // Use a default Regex for input validation that excludes any user input with the characters
            // '/', ''', or '*' in an effort to prevent XPath injection attacks against the web service.
            // Public sites should use a more restrictive Regex that is customized for their own data.
            return QuerySimpleCascadingDropDownDocument(document, documentHierarchy, knownCategoryValuesDictionary, category, new Regex("^[^/'\\*]*$"));
        }

        /// <summary>
        /// A helper method to provide simple implementation of a method to query a data set and return relevant dropdown content.
        /// </summary>
        /// <param name="document">XML document containing the data set</param>
        /// <param name="documentHierarchy">List of strings representing the hierarchy of the data set</param>
        /// <param name="knownCategoryValuesDictionary">Known category/value pairs</param>
        /// <param name="category">Category for which the drop down contents are desired</param>
        /// <param name="inputValidationRegex">Regular expression used to validate user input to the web service (to prevent XPath injection attacks)</param>
        /// <returns>Contents of the specified drop down subject to the choices already made</returns>
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

#pragma warning restore 1591