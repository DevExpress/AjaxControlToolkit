#pragma warning disable 1591
using System.Web.UI;
using System.Web.UI.WebControls;
using System.ComponentModel;
using System;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Drawing.Design;
using System.Linq;
using System.Web.UI.HtmlControls;
using System.Drawing;
using AjaxControlToolkit.HtmlEditor.Sanitizer;
using System.Web.Configuration;
using System.Configuration;
using System.Configuration.Provider;

namespace AjaxControlToolkit {
    ///<summary>
    /// HtmlEditorExtender extends to a textbox and creates and renders an editable
    /// div instead of a targeted textbox
    /// </summary>
    [TargetControlType(typeof(TextBox))]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(ColorPickerExtender), 1)]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditorExtenderBehavior", Constants.HtmlEditorExtenderName)]
    [ClientCssResource(Constants.HtmlEditorExtenderName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.HtmlEditorExtenderName + Constants.IconPostfix)]
    public class HtmlEditorExtender : ExtenderControlBase {
        internal const int ButtonWidthDef = 23;
        internal const int ButtonHeightDef = 21;

        static Lazy<IHtmlSanitizer> _sanitizer = new Lazy<IHtmlSanitizer>(CreateSanitizer, true);

        HtmlEditorExtenderButtonCollection buttonList = null;
        AjaxFileUpload ajaxFileUpload = null;
        bool enableSanitization = true;

        static IHtmlSanitizer CreateSanitizer() {

            if(String.IsNullOrEmpty(ToolkitConfig.HtmlSanitizer))
                return null;

            var sanitizerType = Type.GetType(ToolkitConfig.HtmlSanitizer);
            var sanitizer = Activator.CreateInstance(sanitizerType);

            return (IHtmlSanitizer)sanitizer;
        }

        public HtmlEditorExtender() {
            EnableClientState = true;
        }

        public IHtmlSanitizer Sanitizer {
            get { return _sanitizer.Value; }
            set { _sanitizer = new Lazy<IHtmlSanitizer>(() => value, true); }
        }

        ///<summary>
        /// Provides a button list to the client side. The Toolbar property is required for designer experience support,
        /// because the editor always prevents the property's capability to provide values to the client side as
        /// ExtenderControlProperty at runtime
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("toolbarButtons")]
        public HtmlEditorExtenderButtonCollection ToolbarButtons {
            get {
                EnsureButtons();
                return buttonList;
            }
        }

        // Ensure Toolbar buttons are created. Only creates the buttons
        // once no matter how many times called
        private void EnsureButtons() {
            if(buttonList == null || buttonList.Count == 0)
                CreateButtons();
        }

        ///<summary>
        /// A Helper property to cacth buttons from modifed buttons at design time.
        /// This property will be attached only when the Toolbar property is not empty at design time
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(HtmlEditorExtenderButtonCollectionEditor), typeof(UITypeEditor))]
        [Description("Costumize visible buttons, leave empty to show all buttons")]
        public HtmlEditorExtenderButtonCollection Toolbar {
            get {
                if(buttonList == null)
                    buttonList = new HtmlEditorExtenderButtonCollection();
                return buttonList;
            }
        }

        ///<summary>
        /// Determines whether or not to display a source view tab/button to see the source view of HtmlEditorExtender
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("displaySourceTab")]
        public bool DisplaySourceTab {
            get { return GetPropertyValue("DisplaySourceTab", false); }
            set { SetPropertyValue("DisplaySourceTab", value); }
        }

        /// <summary>
        /// The name of a JavaScript function to attach to the client-side Change event
        /// </summary>
        [ExtenderControlEvent]
        [ClientPropertyName("change")]
        [DefaultValue("")]
        public string OnClientChange {
            get { return GetPropertyValue<string>("OnClientChange", String.Empty); }
            set { SetPropertyValue<string>("OnClientChange", value); }
        }

        /// <summary>
        /// AjaxFileUpload that is used to upload images
        /// </summary>
        [Browsable(false)]
        public AjaxFileUpload AjaxFileUpload {
            get { return ajaxFileUpload; }
        }

        /// <summary>
        /// Determines whether or not to use HTML-sanitization before data transfer to the server
        /// </summary>
        [Browsable(true)]
        [DefaultValue(true)]
        public bool EnableSanitization {
            get { return enableSanitization; }
            set { enableSanitization = value; }
        }

        ///<summary>
        /// An event handler to complete the Ajax Image upload
        /// </summary>
        public event EventHandler<AjaxFileUploadEventArgs> ImageUploadComplete;

        ///<summary>
        /// Decodes html tags that are not generated by an htmlEditorExtender button
        /// </summary>
        public string Decode(string value) {
            EnsureButtons();

            var tags = "font|div|span|br|strong|em|strike|sub|sup|center|blockquote|hr|ol|ul|li|br|s|p|b|i|u|img";
            var attributes = "style|size|color|face|align|dir|src|width|id|class";
            var attributeCharacters = "\\'\\,\\w\\-#\\s\\:\\;\\?\\&\\.\\-\\=";
            var result = Regex.Replace(value, "\\&quot\\;", "\"", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&apos;", "'", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "(?:\\&lt\\;|\\<)(\\/?)((?:" + tags + ")(?:\\s(?:" + attributes + ")=\"[" + attributeCharacters + "]*\")*)(?:\\&gt\\;|\\>)", "<$1$2>", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);

            var hrefCharacters = "^\\\"\\>\\<\\\\";
            result = Regex.Replace(result, "(?:\\&lt\\;|\\<)(\\/?)(a(?:(?:\\shref\\=\\\"[" + hrefCharacters + "]*\\\")|(?:\\sstyle\\=\\\"[" + attributeCharacters + "]*\\\"))*)(?:\\&gt\\;|\\>)", "<$1$2>", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);

            result = Regex.Replace(result, "&?lt;", "<");
            result = Regex.Replace(result, "&?gt;", ">");

            result = Regex.Replace(result, "&amp;", "&", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&nbsp;", "\xA0", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "[^<]<[^>]*expression[^>]*>", "", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "[^<]<[^>]*data\\:[^>]*>", "", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "[^<]<[^>]*script[^>]*>", "", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "[^<]<[^>]*filter[^>]*>", "", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "[^<]<[^>]*behavior[^>]*>", "", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "[^<]<[^>]*javascript\\:[^>]*>", "", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "[^<]<[^>]*position\\:[^>]*>", "", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);

            // Check Whether EnableSanitization is disabled or not.
            if(EnableSanitization && Sanitizer != null) {
                var elementWhiteList = MakeCombinedElementList();

                if(!elementWhiteList.ContainsKey("span"))
                    elementWhiteList.Add("span", new string[0]);

                if(!elementWhiteList.ContainsKey("br"))
                    elementWhiteList.Add("br", new string[0]);

                result = Sanitizer.GetSafeHtmlFragment(result, elementWhiteList);
            }

            // HtmlAgilityPack vanishes self-closing <hr /> tag, so replace it after sanitization
            result = result.Replace("<hr>", "<hr />");

            return result;
        }

        // On Init add popup div and ajaxfileupload control to support Add image
        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(!DesignMode) {
                // Check if EnableSanitization is enabled and sanitizer provider is not configured.
                if(EnableSanitization && Sanitizer == null)
                    throw new Exception("The Sanitizer is not configured in the web.config file. Either install the AjaxControlToolkit.HtmlEditor.Sanitizer NuGet package or set the EnableSanitization property to False (insecure).");

                var popupdiv = new HtmlGenericControl("div");
                popupdiv.Attributes.Add("Id", this.ClientID + "_popupDiv");
                popupdiv.Attributes.Add("style", "opacity: 0;");
                popupdiv.Attributes.Add("class", "ajax__html_editor_extender_popupDiv");

                ajaxFileUpload = new AjaxFileUpload();
                ajaxFileUpload.ID = this.ID + "_ajaxFileUpload";
                ajaxFileUpload.MaximumNumberOfFiles = 10;
                ajaxFileUpload.AllowedFileTypes = "jpg,jpeg,gif,png";
                ajaxFileUpload.Enabled = true;
                ajaxFileUpload.OnClientUploadComplete = "ajaxClientUploadComplete";
                if(ImageUploadComplete != null) {
                    ajaxFileUpload.UploadComplete += ImageUploadComplete;
                }
                popupdiv.Controls.Add(ajaxFileUpload);

                var btnCancel = new HtmlGenericControl("div");
                btnCancel.Attributes.Add("Id", this.ClientID + "_btnCancel");
                btnCancel.Attributes.Add("style", "float: right; position:relative; padding-left: 20px; top:10px; width: 55px; border-color:black;border-style: solid; border-width: 1px;cursor:pointer;");
                btnCancel.Attributes.Add("float", "right");
                btnCancel.Attributes.Add("unselectable", "on");
                btnCancel.InnerText = "Cancel";
                popupdiv.Controls.Add(btnCancel);

                this.Controls.Add(popupdiv);
            }
        }

        // On load method decode contents of textbox before render these to client side.
        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);

            // Register an empty OnSubmit statement so the ASP.NET WebForm_OnSubmit method will be automatically
            // created and our behavior will be able to wrap it to encode html tags prior to submission
            ScriptManager.RegisterOnSubmitStatement(this, typeof(HtmlEditorExtender), "HtmlEditorExtenderOnSubmit", "null;");

            // If this extender has default focus, use ClientState to let it know
            ClientState = (string.Compare(Page.Form.DefaultFocus, TargetControlID, StringComparison.OrdinalIgnoreCase) == 0) ? "Focused" : null;

            // decode values of textbox
            var txtBox = (TextBox)TargetControl;
            if(txtBox != null)
                txtBox.Text = Decode(txtBox.Text);

            var hasImageButton = false;
            foreach(HtmlEditorExtenderButton button in buttonList) {
                if(button.CommandName == "InsertImage")
                    hasImageButton = true;
            }

            if(!hasImageButton)
                ajaxFileUpload.Visible = false;
        }

        // When user defines/customize buttons on design time Toolbar property will accessed twice
        // so we need to skip the first accessing of this property to avoid buttons created twice
        bool tracked = false;

        // CreateButtons creates list of buttons for the toolbar
        protected virtual void CreateButtons() {
            buttonList = new HtmlEditorExtenderButtonCollection();

            // avoid buttons for twice buttons creation
            if(!tracked) {
                tracked = true;
                return;
            }

            tracked = false;
            buttonList.Add(new Undo());
            buttonList.Add(new Redo());
            buttonList.Add(new Bold());
            buttonList.Add(new Italic());
            buttonList.Add(new Underline());
            buttonList.Add(new StrikeThrough());
            buttonList.Add(new Subscript());
            buttonList.Add(new Superscript());
            buttonList.Add(new JustifyLeft());
            buttonList.Add(new JustifyCenter());
            buttonList.Add(new JustifyRight());
            buttonList.Add(new JustifyFull());
            buttonList.Add(new InsertOrderedList());
            buttonList.Add(new InsertUnorderedList());
            buttonList.Add(new CreateLink());
            buttonList.Add(new UnLink());
            buttonList.Add(new RemoveFormat());
            buttonList.Add(new SelectAll());
            buttonList.Add(new UnSelect());
            buttonList.Add(new Delete());
            buttonList.Add(new Cut());
            buttonList.Add(new Copy());
            buttonList.Add(new Paste());
            buttonList.Add(new BackgroundColorSelector());
            buttonList.Add(new ForeColorSelector());
            buttonList.Add(new FontNameSelector());
            buttonList.Add(new FontSizeSelector());
            buttonList.Add(new Indent());
            buttonList.Add(new Outdent());
            buttonList.Add(new InsertHorizontalRule());
            buttonList.Add(new HorizontalSeparator());
            buttonList.Add(new CleanWord());
        }

        // Combine Element list from all toolbar buttons.
        Dictionary<string, string[]> MakeCombinedElementList() {
            var elementCombineWhiteList = new Dictionary<string, string[]>();
            foreach(HtmlEditorExtenderButton button in ToolbarButtons) {
                if(button.ElementWhiteList != null) {
                    // loop through each element for the button
                    foreach(KeyValuePair<string, string[]> keyvalue in button.ElementWhiteList) {
                        // check if key contains in the combine elementWhiteList
                        if(elementCombineWhiteList.ContainsKey(keyvalue.Key)) {
                            string[] combineAtt;
                            List<string> listCombineAtt;
                            var isChanged = false;

                            // check if attribute value is already exist in the element
                            if(elementCombineWhiteList.TryGetValue(keyvalue.Key, out combineAtt)) {
                                listCombineAtt = combineAtt.ToList();
                                foreach(var value in keyvalue.Value) {
                                    if(!combineAtt.Contains(value)) {
                                        listCombineAtt.Add(value);
                                        isChanged = true;
                                    }
                                }

                                if(isChanged) {
                                    // associate updated attribute list with the element
                                    elementCombineWhiteList[keyvalue.Key] = listCombineAtt.ToArray();
                                }
                            }
                        } else {
                            //add element and its related attributes
                            elementCombineWhiteList.Add(keyvalue.Key, keyvalue.Value);
                        }
                    }
                }
            }

            return elementCombineWhiteList;
        }
    }

}
#pragma warning restore 1591