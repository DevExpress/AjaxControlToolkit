using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;
using System.ComponentModel;
using System.Text;
using System;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Drawing.Design;
using System.IO;
using System.Linq;
using System.Reflection;
using AjaxControlToolkit.Sanitizer;
using System.Web.UI.HtmlControls;

[assembly: WebResource("HtmlEditorExtender.HtmlEditorExtenderBehavior.js", "text/javascript")]
[assembly: WebResource("HtmlEditorExtender.HtmlEditorExtenderBehavior.debug.js", "text/javascript")]
[assembly: WebResource("HtmlEditorExtender.HtmlEditorExtender_resource.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("HtmlEditorExtender.Images.html-editor-buttons.png", "img/png")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// HtmlEditorExtender extends to a textbox and creates and renders an editable div 
    /// in place of targeted textbox.
    /// </summary>
    [TargetControlType(typeof(TextBox))]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(ColorPickerExtender), 1)]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditorExtenderBehavior", "HtmlEditorExtender.HtmlEditorExtenderBehavior.js")]
    [ClientCssResource("HtmlEditorExtender.HtmlEditorExtender_resource.css")]
    [ParseChildren(true)]
    [PersistChildren(false)]
    [System.Drawing.ToolboxBitmap(typeof(HtmlEditorExtender), "HtmlEditorExtender.html_editor_extender.ico")]
    public class HtmlEditorExtender : ExtenderControlBase
    {
        internal const int ButtonWidthDef = 23;
        internal const int ButtonHeightDef = 21;
        private HtmlEditorExtenderButtonCollection buttonList = null;
        private SanitizerProvider sanitizerProvider = null;
        private AjaxFileUpload ajaxFileUpload = null;
        private bool enableSanitization = true;

        public HtmlEditorExtender()
        {
            EnableClientState = true;
            sanitizerProvider = Sanitizer.Sanitizer.GetProvider();
        }

        public SanitizerProvider SanitizerProvider
        {
            get { return this.sanitizerProvider; }
            set { this.sanitizerProvider = value; }
        }


        /// <summary>
        /// Provide button list to client side. Need help from Toolbar property 
        /// for designer experience support, cause Editor always blocks the property
        /// ability to provide values to client side as ExtenderControlProperty on run time.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        public HtmlEditorExtenderButtonCollection ToolbarButtons
        {
            get
            {
                EnsureButtons();
                return buttonList;
            }
        }

        /// <summary>
        /// Ensure Toolbar buttons are created. Only creates the buttons
        /// once no matter how many times called
        /// </summary>
        private void EnsureButtons()
        {
            if (buttonList == null || buttonList.Count == 0)
            {
                CreateButtons();
            }
        }


        /// <summary>
        /// Helper property to cacth buttons from modifed buttons on design time.
        /// This property will only attached when Toolbar property are not empty in design time.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(HtmlEditorExtenderButtonCollectionEditor), typeof(UITypeEditor))]
        [Description("Costumize visible buttons, leave empty to show all buttons")]
        public HtmlEditorExtenderButtonCollection Toolbar
        {
            get
            {
                if (buttonList == null)
                    buttonList = new HtmlEditorExtenderButtonCollection();
                return buttonList;
            }
        }

        /// <summary>
        /// Determines whether to display source view tab/button to see source view of the HtmlEditorExtender.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("displaySourceTab")]
        public bool DisplaySourceTab
        {
            get { return GetPropertyValue("DisplaySourceTab", false); }
            set { SetPropertyValue("DisplaySourceTab", value); }
        }

        /// <summary>
        /// Name of client side function that will be called onchange in contents
        /// </summary>
        [ExtenderControlEvent]
        [ClientPropertyName("change")]
        [DefaultValue("")]
        public string OnClientChange
        {
            get { return GetPropertyValue<string>("OnClientChange", string.Empty); }
            set { SetPropertyValue<string>("OnClientChange", value); }
        }

        [Browsable(false)]
        public AjaxFileUpload AjaxFileUpload
        {
            get { return ajaxFileUpload; }
        }

        [Browsable(true)]
        [DefaultValue(true)]
        public bool EnableSanitization
        {
            get { return enableSanitization; }
            set { enableSanitization = value; }
        }

        /// <summary>
        /// Event handler for Ajax Image upload complete event.
        /// </summary>
        public event EventHandler<AjaxFileUploadEventArgs> ImageUploadComplete;

        /// <summary>
        /// Decodes html tags those are not generated by any htmlEditorExtender button
        /// </summary>
        /// <param name="value">Value that contains html tags to decode</param>
        /// <returns>value after decoded</returns>
        public string Decode(string value)
        {
            EnsureButtons();

            string tags = "font|div|span|br|strong|em|strike|sub|sup|center|blockquote|hr|ol|ul|li|br|s|p|b|i|u|img";
            string attributes = "style|size|color|face|align|dir|src";
            string attributeCharacters = "\\'\\,\\w\\-#\\s\\:\\;\\?\\&\\.\\-\\=";
            var result = Regex.Replace(value, "\\&quot\\;", "\"", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&apos;", "'", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "(?:\\&lt\\;|\\<)(\\/?)((?:" + tags + ")(?:\\s(?:" + attributes + ")=\"[" + attributeCharacters + "]*\")*)(?:\\&gt\\;|\\>)", "<$1$2>", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            //for decoding a tags
            //if (buttonList.Find(b => b.CommandName == "createLink") != null)
            //{
            string hrefCharacters = "^\\\"\\>\\<\\\\";
            result = Regex.Replace(result, "(?:\\&lt\\;|\\<)(\\/?)(a(?:(?:\\shref\\=\\\"[" + hrefCharacters + "]*\\\")|(?:\\sstyle\\=\\\"[" + attributeCharacters + "]*\\\"))*)(?:\\&gt\\;|\\>)", "<$1$2>", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            //}
            result = Regex.Replace(result, "&amp;", "&", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "&nbsp;", "\xA0", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "<[^>]*expression[^>]*>", "_", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "<[^>]*data\\:[^>]*>", "_", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "<[^>]*script[^>]*>", "_", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "<[^>]*filter[^>]*>", "_", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "<[^>]*behavior[^>]*>", "_", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "<[^>]*url[^>]*>", "_", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "<[^>]*javascript\\:[^>]*>", "_", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);
            result = Regex.Replace(result, "<[^>]*position\\:[^>]*>", "_", RegexOptions.IgnoreCase | RegexOptions.ECMAScript);

            // Check Whether EnableSanitization is disabled or not.
            if (EnableSanitization && sanitizerProvider != null)
            {
                Dictionary<string, string[]> elementWhiteList = MakeCombinedElementList();
                Dictionary<string, string[]> attributeWhiteList = MakeCombinedAttributeList();
                result = sanitizerProvider.GetSafeHtmlFragment(result, elementWhiteList, attributeWhiteList);
            }

            return result;
        }

        /// <summary>
        /// On Init add popup div and ajaxfileupload control to support Add image
        /// </summary>
        /// <param name="e">Event Arguments</param>
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            if (!DesignMode)
            {
                // Check if EnableSanitization is enabled and sanitizer provider is not configured.
                if (EnableSanitization && sanitizerProvider == null)
                {
                    throw new Exception("Sanitizer provider is not configured in the web.config file. If you are using the HtmlEditorExtender with a public website then please configure a Sanitizer provider. Otherwise, set the EnableSanitization property to false.");
                }

                HtmlGenericControl popupdiv = new HtmlGenericControl("div");
                popupdiv.Attributes.Add("Id", this.ClientID + "_popupDiv");
                popupdiv.Attributes.Add("style", "opacity: 0;");
                popupdiv.Attributes.Add("class", "popupDiv");

                ajaxFileUpload = new AjaxFileUpload();
                ajaxFileUpload.ID = this.ID + "_ajaxFileUpload";
                ajaxFileUpload.MaximumNumberOfFiles = 10;
                ajaxFileUpload.AllowedFileTypes = "jpg,jpeg,gif,png";
                ajaxFileUpload.Enabled = true;
                ajaxFileUpload.OnClientUploadComplete = "ajaxClientUploadComplete";
                if (ImageUploadComplete != null)
                {
                    ajaxFileUpload.UploadComplete += ImageUploadComplete;
                }
                popupdiv.Controls.Add(ajaxFileUpload);

                HtmlGenericControl btnCancel = new HtmlGenericControl("div");
                btnCancel.Attributes.Add("Id", this.ClientID + "_btnCancel");
                btnCancel.Attributes.Add("style", "float: right; position:relative; padding-left: 20px; top:10px; width: 55px; border-color:black;border-style: solid; border-width: 1px;cursor:pointer;");
                btnCancel.Attributes.Add("float", "right");
                btnCancel.Attributes.Add("unselectable", "on");
                btnCancel.InnerText = "Cancel";
                popupdiv.Controls.Add(btnCancel);

                this.Controls.Add(popupdiv);
            }
        }

        /// <summary>
        /// On load method decode contents of textbox before render these to client side.
        /// </summary>
        /// <param name="e">event arguments</param>
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            // Register an empty OnSubmit statement so the ASP.NET WebForm_OnSubmit method will be automatically
            // created and our behavior will be able to wrap it to encode html tags prior to submission
            ScriptManager.RegisterOnSubmitStatement(this, typeof(HtmlEditorExtender), "HtmlEditorExtenderOnSubmit", "null;");

            // If this extender has default focus, use ClientState to let it know
            ClientState = (string.Compare(Page.Form.DefaultFocus, TargetControlID, StringComparison.OrdinalIgnoreCase) == 0) ? "Focused" : null;

            // decode values of textbox
            TextBox txtBox = (TextBox)TargetControl;
            if (txtBox != null)
                txtBox.Text = Decode(txtBox.Text);

            bool hasImageButton = false;
            foreach (HtmlEditorExtenderButton button in buttonList)
            {
                if (button.CommandName == "InsertImage")
                {
                    hasImageButton = true;
                }
            }

            if (!hasImageButton)
            {
                ajaxFileUpload.Visible = false;
            }
        }

        /// <summary>
        /// When user defines/customize buttons on design time Toolbar property will accessed twice
        /// so we need to skip the first accessing of this property to avoid buttons created twice
        /// </summary>
        bool tracked = false;

        /// <summary>
        /// CreateButtons creates list of buttons for the toolbar
        /// </summary>        
        protected virtual void CreateButtons()
        {
            buttonList = new HtmlEditorExtenderButtonCollection();

            // avoid buttons for twice buttons creation
            if (!tracked)
            {
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
            //buttonList.Add(new InsertImage());
        }

        /// <summary>
        /// Combine Element list from all toolbar buttons.
        /// </summary>
        /// <returns>dictionary object containing keys and related attributes.</returns>
        private Dictionary<string, string[]> MakeCombinedElementList()
        {
            Dictionary<string, string[]> elementCombineWhiteList = new Dictionary<string, string[]>();
            foreach (HtmlEditorExtenderButton button in ToolbarButtons)
            {
                if (button.ElementWhiteList != null)
                {
                    // loop through each element for the button
                    foreach (KeyValuePair<string, string[]> keyvalue in button.ElementWhiteList)
                    {
                        // check if key contains in the combine elementWhiteList
                        if (elementCombineWhiteList.ContainsKey(keyvalue.Key))
                        {
                            string[] combineAtt;
                            List<string> listCombineAtt;
                            bool isChanged = false;

                            // check if attribute value is already exist in the element
                            if (elementCombineWhiteList.TryGetValue(keyvalue.Key, out combineAtt))
                            {
                                listCombineAtt = combineAtt.ToList();
                                foreach (string value in keyvalue.Value)
                                {
                                    if (!combineAtt.Contains(value))
                                    {
                                        listCombineAtt.Add(value);
                                        isChanged = true;
                                    }
                                }

                                if (isChanged)
                                {
                                    // associate updated attribute list with the element
                                    elementCombineWhiteList[keyvalue.Key] = listCombineAtt.ToArray();
                                }
                            }
                        }
                        else
                        {
                            //add element and its related attributes
                            elementCombineWhiteList.Add(keyvalue.Key, keyvalue.Value);
                        }
                    }
                }
            }
            return elementCombineWhiteList;

        }

        private Dictionary<string, string[]> MakeCombinedAttributeList()
        {
            Dictionary<string, string[]> attributeCombineWhiteList = new Dictionary<string, string[]>();
            foreach (HtmlEditorExtenderButton button in ToolbarButtons)
            {
                if (button.AttributeWhiteList != null)
                {
                    // loop through each element for the button
                    foreach (KeyValuePair<string, string[]> keyvalue in button.AttributeWhiteList)
                    {
                        // check if key contains in the combine elementWhiteList
                        if (attributeCombineWhiteList.ContainsKey(keyvalue.Key))
                        {
                            string[] combineAttVal;
                            List<string> listCombineAttVal;
                            bool isChanged = false;

                            // check if attribute value is already exist in the element
                            if (attributeCombineWhiteList.TryGetValue(keyvalue.Key, out combineAttVal))
                            {
                                listCombineAttVal = combineAttVal.ToList();
                                foreach (string value in keyvalue.Value)
                                {
                                    if (!combineAttVal.Contains(value))
                                    {
                                        listCombineAttVal.Add(value);
                                        isChanged = true;
                                    }
                                }

                                if (isChanged)
                                {
                                    // associate updated attribute list with the element
                                    attributeCombineWhiteList[keyvalue.Key] = listCombineAttVal.ToArray();
                                }
                            }
                        }
                        else
                        {
                            //add element and its related attributes
                            attributeCombineWhiteList.Add(keyvalue.Key, keyvalue.Value);
                        }
                    }
                }
            }

            return attributeCombineWhiteList;
        }
    }

}
