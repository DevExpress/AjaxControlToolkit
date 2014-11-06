using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.AutoCompleteExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.AutoCompleteBehavior", Constants.AutoCompleteName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(TimerScript))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(TextBox))]
    [ToolboxItem("System.Web.UI.Design.WebControlToolboxItem, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a")]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.AutoCompleteName + Constants.IconPostfix)]
    public class AutoCompleteExtender : AnimationExtenderControlBase {
        // Minimum length of text before the webservice provides suggestions.
        [DefaultValue(3)]
        [ExtenderControlProperty]
        [ClientPropertyName("minimumPrefixLength")]
        public virtual int MinimumPrefixLength {
            get { return GetPropertyValue("MinimumPrefixLength", 3); }
            set { SetPropertyValue("MinimumPrefixLength", value); }
        }

        // Time in milliseconds when the timer will kick in to get suggestions using the web service. 
        [DefaultValue(1000)]
        [ExtenderControlProperty]
        [ClientPropertyName("completionInterval")]
        public virtual int CompletionInterval {
            get { return GetPropertyValue("CompletionInterval", 1000); }
            set { SetPropertyValue("CompletionInterval", value); }
        }

        // Number of suggestions to be provided.
        [DefaultValue(10)]
        [ExtenderControlProperty]
        [ClientPropertyName("completionSetCount")]
        public virtual int CompletionSetCount {
            get { return GetPropertyValue("CompletionSetCount", 10); }
            set { SetPropertyValue("CompletionSetCount", value); }
        }

        // ID of element that will serve as the completion list.
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("completionListElementID")]
        [IDReferenceProperty(typeof(WebControl))]
        [Obsolete("Instead of passing in CompletionListElementID, use the default flyout and style that using the CssClass properties.")]
        public virtual string CompletionListElementID {
            get { return GetPropertyValue("CompletionListElementID", String.Empty); }
            set { SetPropertyValue("CompletionListElementID", value); }
        }

        // The web service method to be called.
        [DefaultValue("")]
        [RequiredProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("serviceMethod")]
        public virtual string ServiceMethod {
            get { return GetPropertyValue("ServiceMethod", String.Empty); }
            set { SetPropertyValue("ServiceMethod", value); }
        }

        // The path to the web service that the extender will pull the 
        // word\sentence completions from. If this is not provided, the 
        // service method should be a page method. 
        [UrlProperty]
        [ExtenderControlProperty]
        [TypeConverter(typeof(ServicePathConverter))]
        [ClientPropertyName("servicePath")]
        public virtual string ServicePath {
            get { return GetPropertyValue("ServicePath", String.Empty); }
            set { SetPropertyValue("ServicePath", value); }
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

        // Css Class that will be used to style the completion list flyout.
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("completionListCssClass")]
        public string CompletionListCssClass {
            get { return GetPropertyValue("CompletionListCssClass", String.Empty); }
            set { SetPropertyValue("CompletionListCssClass", value); }
        }

        // Css Class that will be used to style an item in the autocomplete list.
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("completionListItemCssClass")]
        public string CompletionListItemCssClass {
            get { return GetPropertyValue("CompletionListItemCssClass", String.Empty); }
            set { SetPropertyValue("CompletionListItemCssClass", value); }
        }

        // Css Class that will be used to style a highlighted item in the autocomplete list.
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightedItemCssClass")]
        public string CompletionListHighlightedItemCssClass {
            get { return GetPropertyValue("CompletionListHighlightedItemCssClass", String.Empty); }
            set { SetPropertyValue("CompletionListHighlightedItemCssClass", value); }
        }

        // Flag to denote whether client side caching is enabled.
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [ClientPropertyName("enableCaching")]
        public virtual bool EnableCaching {
            get { return GetPropertyValue("EnableCaching", true); }
            set { SetPropertyValue("EnableCaching", value); }
        }
        // Gets or sets the character(s) used to separate words for autocomplete.
        [ExtenderControlProperty]
        [ClientPropertyName("delimiterCharacters")]
        public virtual string DelimiterCharacters {
            get { return GetPropertyValue("DelimiterCharacters", String.Empty); }
            set { SetPropertyValue("DelimiterCharacters", value); }
        }

        // Determines if the First Row of the Search Results be selected by default
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("firstRowSelected")]
        public virtual bool FirstRowSelected {
            get { return GetPropertyValue("FirstRowSelected", false); }
            set { SetPropertyValue("FirstRowSelected", value); }
        }

        // If Delimiter characters are specified and ShowOnlyCurrentWordInCompletionListItem is 
        // set to true, then the completion list displays suggestions just for the current word, 
        // otherwise, it displays the whole string that will show up in the TextBox if that
        // item is selected, which is the current default.
        [ExtenderControlProperty]
        [ClientPropertyName("showOnlyCurrentWordInCompletionListItem")]
        [DefaultValue(false)]
        public bool ShowOnlyCurrentWordInCompletionListItem {
            get { return GetPropertyValue<bool>("ShowOnlyCurrentWordInCompletionListItem", false); }
            set { SetPropertyValue<bool>("ShowOnlyCurrentWordInCompletionListItem", value); }
        }

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

        // Handler to attach to the client-side populating event
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("populating")]
        public string OnClientPopulating {
            get { return GetPropertyValue("OnClientPopulating", String.Empty); }
            set { SetPropertyValue("OnClientPopulating", value); }
        }

        // Handler to attach to the client-side populated event
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("populated")]
        public string OnClientPopulated {
            get { return GetPropertyValue("OnClientPopulated", String.Empty); }
            set { SetPropertyValue("OnClientPopulated", value); }
        }

        // Handler to attach to the client-side showing event
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("showing")]
        public string OnClientShowing {
            get { return GetPropertyValue("OnClientShowing", String.Empty); }
            set { SetPropertyValue("OnClientShowing", value); }
        }

        // Handler to attach to the client-side shown event
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("shown")]
        public string OnClientShown {
            get { return GetPropertyValue("OnClientShown", String.Empty); }
            set { SetPropertyValue("OnClientShown", value); }
        }

        // Handler to attach to the client-side hiding event
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hiding")]
        public string OnClientHiding {
            get { return GetPropertyValue("OnClientHiding", String.Empty); }
            set { SetPropertyValue("OnClientHiding", value); }
        }

        // Handler to attach to the client-side hidden event
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("hidden")]
        public string OnClientHidden {
            get { return GetPropertyValue("OnClientHidden", String.Empty); }
            set { SetPropertyValue("OnClientHidden", value); }
        }

        // Handler to attach to the client-side itemSelected event
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("itemSelected")]
        public string OnClientItemSelected {
            get { return GetPropertyValue("OnClientItemSelected", String.Empty); }
            set { SetPropertyValue("OnClientItemSelected", value); }
        }

        // Handler to attach to the client-side itemOver event
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("itemOver")]
        public string OnClientItemOver {
            get { return GetPropertyValue("OnClientItemOver", String.Empty); }
            set { SetPropertyValue("OnClientItemOver", value); }
        }

        // Handler to attach to the client-side itemOut event
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

        // Create a serialized JSON object representing a text/value pair that can
        // be returned by the webservice.
        public static string CreateAutoCompleteItem(string text, string value) {
            return new JavaScriptSerializer().Serialize(new Pair(text, value));
        }
    }

}