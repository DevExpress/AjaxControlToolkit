#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// AutoComplete extends any ASP.NET TextBox control. It associates that control with a
    /// popup panel to display words that begin with the prefix that is entered into the text box.   
    /// </summary>
    [Designer(typeof(AutoCompleteExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.AutoCompleteBehavior", Constants.AutoCompleteName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(TimerScript))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(TextBox))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.AutoCompleteName + Constants.IconPostfix)]
    public class AutoCompleteExtender : AnimationExtenderControlBase {
        /// <summary>
        /// Minimum length of text before the webservice provides suggestions.
        /// The default is 3
        /// </summary>
        [DefaultValue(3)]
        [ExtenderControlProperty]
        [ClientPropertyName("minimumPrefixLength")]
        public virtual int MinimumPrefixLength {
            get { return GetPropertyValue("MinimumPrefixLength", 3); }
            set { SetPropertyValue("MinimumPrefixLength", value); }
        }

        /// <summary>
        /// Time in milliseconds when the timer will kick in to get suggestions using the web service.
        /// The default is 1000
        /// </summary>
        [DefaultValue(1000)]
        [ExtenderControlProperty]
        [ClientPropertyName("completionInterval")]
        public virtual int CompletionInterval {
            get { return GetPropertyValue("CompletionInterval", 1000); }
            set { SetPropertyValue("CompletionInterval", value); }
        }


        /// <summary>
        /// A number of suggestions to be provided.
        /// The default is 10
        /// </summary>
        [DefaultValue(10)]
        [ExtenderControlProperty]
        [ClientPropertyName("completionSetCount")]
        public virtual int CompletionSetCount {
            get { return GetPropertyValue("CompletionSetCount", 10); }
            set { SetPropertyValue("CompletionSetCount", value); }
        }

        /// <summary>
        /// ID of an element that will serve as the completion list.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("completionListElementID")]
        [IDReferenceProperty(typeof(WebControl))]
        [Obsolete("Instead of passing in CompletionListElementID, use the default flyout and style that using the CssClass properties.")]
        public virtual string CompletionListElementID {
            get { return GetPropertyValue("CompletionListElementID", String.Empty); }
            set { SetPropertyValue("CompletionListElementID", value); }
        }

        /// <summary>
        /// The web service method to be called
        /// </summary>
        [DefaultValue("")]
        [RequiredProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("serviceMethod")]
        public virtual string ServiceMethod {
            get { return GetPropertyValue("ServiceMethod", String.Empty); }
            set { SetPropertyValue("ServiceMethod", value); }
        }

        /// <summary>
        /// The path to the web service that the extender will pull the 
        /// word/sentence completions from. If this is not provided, the 
        /// service method should be a page method.
        /// </summary>
        [UrlProperty]
        [ExtenderControlProperty]
        [TypeConverter(typeof(ServicePathConverter))]
        [ClientPropertyName("servicePath")]
        public virtual string ServicePath {
            get { return GetPropertyValue("ServicePath", String.Empty); }
            set { SetPropertyValue("ServicePath", value); }
        }

        /// <summary>
        /// User/page specific context provided to an optional overload of the web method described by ServiceMethod/ServicePath. 
        /// If the context key is used, it should have the same signature with an additional parameter named contextKey of a string type.
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
        /// Whether or not the ContextKey property should be used.
        /// This will be automatically enabled if the ContextKey property is ever set (on either the client or the server). 
        /// If the context key is used, it should have the same signature with an additional parameter named contextKey of a string type.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("useContextKey")]
        [DefaultValue(false)]
        public bool UseContextKey {
            get { return GetPropertyValue<bool>("UseContextKey", false); }
            set { SetPropertyValue<bool>("UseContextKey", value); }
        }

        /// <summary>
        /// A CSS class that will be used to style the completion list flyout.	
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("completionListCssClass")]
        public string CompletionListCssClass {
            get { return GetPropertyValue("CompletionListCssClass", String.Empty); }
            set { SetPropertyValue("CompletionListCssClass", value); }
        }

        /// <summary>
        /// A CSS class that will be used to style an item in the autocomplete list.	
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("completionListItemCssClass")]
        public string CompletionListItemCssClass {
            get { return GetPropertyValue("CompletionListItemCssClass", String.Empty); }
            set { SetPropertyValue("CompletionListItemCssClass", value); }
        }

        /// <summary>
        /// A CSS class that will be used to style a highlighted item in the autocomplete list.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightedItemCssClass")]
        public string CompletionListHighlightedItemCssClass {
            get { return GetPropertyValue("CompletionListHighlightedItemCssClass", String.Empty); }
            set { SetPropertyValue("CompletionListHighlightedItemCssClass", value); }
        }

        /// <summary>
        /// A flag to denote whether client-side caching is enabled.
        /// The default is true.
        /// </summary>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("enableCaching")]
        public virtual bool EnableCaching {
            get { return GetPropertyValue("EnableCaching", true); }
            set { SetPropertyValue("EnableCaching", value); }
        }

        /// <summary>
        /// The character(s) used to separate words for autocomplete
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("delimiterCharacters")]
        public virtual string DelimiterCharacters {
            get { return GetPropertyValue("DelimiterCharacters", String.Empty); }
            set { SetPropertyValue("DelimiterCharacters", value); }
        }

        /// <summary>
        /// Determines if the first row of the Search Results is selected by default.
        /// The default is false.
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("firstRowSelected")]
        public virtual bool FirstRowSelected {
            get { return GetPropertyValue("FirstRowSelected", false); }
            set { SetPropertyValue("FirstRowSelected", value); }
        }

        /// <summary>
        /// If delimiter characters are specified and ShowOnlyCurrentWordInCompletionListItem is set to true,
        /// then the completion list displays suggestions just for the current word, 
        /// otherwise, it displays the whole string that will show up in the TextBox 
        /// if that item is selected, which is the current default.
        /// The default is false.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("showOnlyCurrentWordInCompletionListItem")]
        [DefaultValue(false)]
        public bool ShowOnlyCurrentWordInCompletionListItem {
            get { return GetPropertyValue<bool>("ShowOnlyCurrentWordInCompletionListItem", false); }
            set { SetPropertyValue<bool>("ShowOnlyCurrentWordInCompletionListItem", value); }
        }

        /// <summary>
        /// OnShow animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }
        Animation _onShow;

        /// <summary>
        /// OnHide animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }
        Animation _onHide;

        /// <summary>
        /// A handler attached to the client-side populating event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("populating")]
        public string OnClientPopulating {
            get { return GetPropertyValue("OnClientPopulating", String.Empty); }
            set { SetPropertyValue("OnClientPopulating", value); }
        }

        /// <summary>
        /// A handler attached to the client-side populated event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("populated")]
        public string OnClientPopulated {
            get { return GetPropertyValue("OnClientPopulated", String.Empty); }
            set { SetPropertyValue("OnClientPopulated", value); }
        }

        /// <summary>
        /// A handler attached to the client-side showing event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("showing")]
        public string OnClientShowing {
            get { return GetPropertyValue("OnClientShowing", String.Empty); }
            set { SetPropertyValue("OnClientShowing", value); }
        }

        /// <summary>
        /// A handler attached to the client-side shown event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("shown")]
        public string OnClientShown {
            get { return GetPropertyValue("OnClientShown", String.Empty); }
            set { SetPropertyValue("OnClientShown", value); }
        }

        /// <summary>
        /// A handler attached to the client-side hiding event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hiding")]
        public string OnClientHiding {
            get { return GetPropertyValue("OnClientHiding", String.Empty); }
            set { SetPropertyValue("OnClientHiding", value); }
        }

        /// <summary>
        /// A handler attached to the client-side hidden event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hidden")]
        public string OnClientHidden {
            get { return GetPropertyValue("OnClientHidden", String.Empty); }
            set { SetPropertyValue("OnClientHidden", value); }
        }

        /// <summary>
        /// A handler attached to the client-side itemSelected event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("itemSelected")]
        public string OnClientItemSelected {
            get { return GetPropertyValue("OnClientItemSelected", String.Empty); }
            set { SetPropertyValue("OnClientItemSelected", value); }
        }

        /// <summary>
        /// A handler attached to the client-side itemOver event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("itemOver")]
        public string OnClientItemOver {
            get { return GetPropertyValue("OnClientItemOver", String.Empty); }
            set { SetPropertyValue("OnClientItemOver", value); }
        }

        /// <summary>
        /// A handler attached to the client-side itemOut event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("itemOut")]
        public string OnClientItemOut {
            get { return GetPropertyValue("OnClientItemOut", String.Empty); }
            set { SetPropertyValue("OnClientItemOut", value); }
        }

        // Convert server IDs into ClientIDs for animations
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }

        /// <summary>
        /// Creates a serialized JSON object representing a text/value pair that can
        /// be returned by the webservice
        /// </summary>
        /// <param name="text" type="String">Text part</param>
        /// <param name="value" type="String">Value part</param>
        /// <returns>Serialized JSON</returns>
        public static string CreateAutoCompleteItem(string text, string value) {
            return new JavaScriptSerializer().Serialize(new Pair(text, value));
        }
    }

}
#pragma warning restore 1591