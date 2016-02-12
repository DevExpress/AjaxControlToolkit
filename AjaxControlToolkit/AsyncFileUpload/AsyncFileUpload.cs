#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using System.Web.UI.HtmlControls;
using System.Web.UI;
using System.IO;
using System.Web.UI.WebControls;
using System.Drawing;

namespace AjaxControlToolkit {
    /// <summary>
    /// AsyncFileUpload is an ASP.NET AJAX Control that allows you to asynchronously upload files to the server.
    /// The file uploading results can be checked both on the server and client sides.
    /// </summary>
    [Designer(typeof(AsyncFileUploadDesigner))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.AsyncFileUpload", AjaxControlToolkit.Constants.AsyncFileUploadName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), AjaxControlToolkit.Constants.AsyncFileUploadName + AjaxControlToolkit.Constants.IconPostfix)]
    public class AsyncFileUpload : ScriptControlBase {

        public static class Constants {
            public const string
                FileUploadIDKey = "AsyncFileUploadID",
                InternalErrorInvalidIFrame = "The ExtendedFileUpload control has encountered an error with the uploader in this page. Please refresh the page and try again.",
                fileUploadGUID = "b3b89160-3224-476e-9076-70b500c816cf";

            public static class Errors {
                public const string
                    NoFiles = "No files are attached to the upload.",
                    FileNull = "The file attached is invalid.",
                    NoFileName = "The file attached has an invalid filename.",
                    InputStreamNull = "The file attached could not be read.",
                    EmptyContentLength = "The file attached is empty.";
            }

            public static class StatusMessages {
                public const string UploadSuccessful = "The file uploaded successfully.";
            }
        }

        HttpPostedFile _postedFile = null;
        HtmlInputFile _inputFile = null;
        string _lastError = String.Empty;
        string _hiddenFieldID = String.Empty;
        string _innerTBID = String.Empty;
        bool _persistFile = false;
        bool _failedValidation = false;
        AsyncFileUploaderStyle _controlStyle = AsyncFileUploaderStyle.Traditional;

        public AsyncFileUpload()
            : base(true, HtmlTextWriterTag.Div) {
        }

        /// <summary>
        /// Fires when the file is successfully uploaded.
        /// </summary>
        [Bindable(true)]
        [Category("Server Events")]
        public event EventHandler<AsyncFileUploadEventArgs> UploadedComplete;

        /// <summary>
        /// Fires when the uploaded file is corrupted.
        /// </summary>
        [Bindable(true)]
        [Category("Server Events")]
        public event EventHandler<AsyncFileUploadEventArgs> UploadedFileError;

        bool IsDesignMode {
            get { return (HttpContext.Current == null); }
        }

        HttpPostedFile CurrentFile {
            get { return _persistFile ? PersistentStoreManager.Instance.GetFileFromSession(ClientID) : _postedFile; }
        }

        /// <summary>
        /// The name of a javascript function executed on the client side if the file upload started.
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadStarted")]
        public string OnClientUploadStarted {
            get { return (string)(ViewState["OnClientUploadStarted"] ?? String.Empty); }
            set { ViewState["OnClientUploadStarted"] = value; }
        }

        /// <summary>
        /// The name of a javascript function executed on the client side after a file is successfully uploaded.
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadComplete")]
        public string OnClientUploadComplete {
            get { return (string)(ViewState["OnClientUploadComplete"] ?? String.Empty); }
            set { ViewState["OnClientUploadComplete"] = value; }
        }

        /// <summary>
        /// The name of a javascript function executed on the client side if the file upload failed.
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadError")]
        public string OnClientUploadError {
            get { return (string)(ViewState["OnClientUploadError"] ?? String.Empty); }
            set { ViewState["OnClientUploadError"] = value; }
        }

        /// <summary>
        /// Uploaded file bytes
        /// </summary>
        [BrowsableAttribute(false)]
        public byte[] FileBytes {
            get {
                PopulateObjectPriorToRender(ClientID);
                var file = CurrentFile;
                if(file != null) {
                    try {
                        return GetBytesFromStream(file.InputStream);
                    } catch { }
                }
                return null;
            }
        }

        /// <summary>
        /// ID of a control that is shown while the file is being uploaded.
        /// </summary>
        [Category("Behavior")]
        [Description("ID of Throbber")]
        [DefaultValue("")]
        public string ThrobberID {
            get { return (string)(ViewState["ThrobberID"] ?? string.Empty); }
            set { ViewState["ThrobberID"] = value; }
        }

        /// <summary>
        /// The control's background color on upload complete. The default value is Lime.
        /// </summary>
        [Category("Appearance")]
        [TypeConverter(typeof(WebColorConverter))]
        [Description("Control's background color on upload complete.")]
        [DefaultValue(typeof(Color), "Lime")]
        public Color CompleteBackColor {
            get { return (Color)(ViewState["CompleteBackColor"] ?? Color.Lime); }
            set { ViewState["CompleteBackColor"] = value; }
        }

        /// <summary>
        /// The control's background color when uploading is in progress.
        /// The default value is White.
        /// </summary>
        [Category("Appearance")]
        [TypeConverter(typeof(WebColorConverter))]
        [Description("Control's background color when uploading is in progress.")]
        [DefaultValue(typeof(Color), "White")]
        public Color UploadingBackColor {
            get { return (Color)(ViewState["UploadingBackColor"] ?? Color.White); }
            set { ViewState["UploadingBackColor"] = value; }
        }

        /// <summary>
        /// The control's background color on an upload error.
        /// The default value is Red.
        /// </summary>
        [Category("Appearance")]
        [TypeConverter(typeof(WebColorConverter))]
        [Description("Control's background color on upload error.")]
        [DefaultValue(typeof(Color), "Red")]
        public Color ErrorBackColor {
            get { return (Color)(ViewState["ErrorBackColor"] ?? Color.Red); }
            set { ViewState["ErrorBackColor"] = value; }
        }

        /// <summary>
        /// The control's width (Unit).
        /// The default value is 355px.
        /// </summary>
        [DefaultValue(typeof(Unit), "")]
        [Category("Layout")]
        public override Unit Width {
            get { return base.Width; }
            set { base.Width = value; }
        }

        /// <summary>
        /// Whether validation is failed
        /// </summary>
        [BrowsableAttribute(false)]
        public bool FailedValidation {
            get { return _failedValidation; }
            set { _failedValidation = value; }
        }

        /// <summary>
        /// The control's appearance style (Traditional, Modern). The default value is Traditional.
        /// </summary>
        [Bindable(true)]
        [Category("Appearance")]
        [BrowsableAttribute(true)]
        [DefaultValue(AsyncFileUploaderStyle.Traditional)]
        public AsyncFileUploaderStyle UploaderStyle {
            get { return _controlStyle; }
            set { _controlStyle = value; }
        }

        /// <summary>
        /// A HttpPostedFile object that provides access to the uploaded file
        /// </summary>
        [BrowsableAttribute(false)]
        public HttpPostedFile PostedFile {
            get {
                PopulateObjectPriorToRender(ClientID);
                return CurrentFile;
            }
        }

        /// <summary>
        /// A bool value indicating whether the control contains a file
        /// </summary>
        [BrowsableAttribute(false)]
        public bool HasFile {
            get {
                PopulateObjectPriorToRender(ClientID);
                if(_persistFile) {
                    return PersistentStoreManager.Instance.FileExists(ClientID);
                }
                return (_postedFile != null);
            }
        }

        /// <summary>
        /// Gets the name of a file on the client that is uploaded using the control.
        /// </summary>
        [BrowsableAttribute(false)]
        public string FileName {
            get {
                PopulateObjectPriorToRender(ClientID);
                if(_persistFile) {
                    return Path.GetFileName(PersistentStoreManager.Instance.GetFileName(ClientID));
                } else if(_postedFile != null) {
                    return Path.GetFileName(_postedFile.FileName);
                }
                return String.Empty;
            }
        }

        /// <summary>
        /// Gets the name of a file on the client that is uploaded using the control.
        /// </summary>
        [BrowsableAttribute(false)]
        public string ContentType {
            get {
                PopulateObjectPriorToRender(ClientID);
                if(_persistFile) {
                    return PersistentStoreManager.Instance.GetContentType(ClientID);
                } else if(_postedFile != null) {
                    return _postedFile.ContentType;
                }
                return String.Empty;
            }
        }

        /// <summary>
        /// Gets a Stream object that points to an uploaded file to prepare for reading the content of the file.
        /// </summary>
        [BrowsableAttribute(false)]
        public Stream FileContent {
            get {
                PopulateObjectPriorToRender(ClientID);
                var file = CurrentFile;
                if(file == null || file.InputStream == null)
                    return null;

                return file.InputStream;
            }
        }

        /// <summary>
        /// Whether a file is being uploaded.
        /// </summary>
        [BrowsableAttribute(false)]
        public bool IsUploading {
            get { return (Page.Request.QueryString[Constants.FileUploadIDKey] != null); }
        }

        /// <summary>
        /// Whether a file is stored in session.
        /// The default value is false.
        /// </summary>
        [Bindable(true)]
        [BrowsableAttribute(true)]
        [DefaultValue(false)]
        public bool PersistFile {
            get { return _persistFile; }
            set { _persistFile = value; }
        }

        /// <summary>
        /// Clears all uploaded files of a current control from session.
        /// </summary>
        public void ClearAllFilesFromPersistedStore() {
            PersistentStoreManager.Instance.ClearAllFilesFromSession(this.ClientID);
        }

        /// <summary>
        /// Clears all uploaded files of current control from session
        /// </summary>
        public void ClearFileFromPersistedStore() {
            PersistentStoreManager.Instance.RemoveFileFromSession(this.ClientID);
        }

        /// <summary>
        /// Saves the content of an uploaded file.
        /// </summary>
        /// <param name="fileName" type="String">Uploaded file name</param>
        public void SaveAs(string fileName) {
            PopulateObjectPriorToRender(this.ClientID);
            var file = CurrentFile;
            file.SaveAs(fileName);
        }

        void PopulateObjectPriorToRender(string controlId) {
            bool exists;
            if(_persistFile)
                exists = PersistentStoreManager.Instance.FileExists(controlId);
            else
                exists = (_postedFile != null);

            if((!exists) && (this.Page != null && this.Page.Request.Files.Count != 0))
                ReceivedFile(controlId);
        }

        protected virtual void OnUploadedFileError(AsyncFileUploadEventArgs e) {
            if(UploadedFileError != null)
                UploadedFileError(this, e);
        }

        protected virtual void OnUploadedComplete(AsyncFileUploadEventArgs e) {
            if(UploadedComplete != null)
                UploadedComplete(this, e);
        }

        void ReceivedFile(string sendingControlID) {
            AsyncFileUploadEventArgs eventArgs = null;
            _lastError = String.Empty;

            if(this.Page.Request.Files.Count > 0) {
                HttpPostedFile file = null;
                if(sendingControlID == null || sendingControlID == String.Empty) {
                    file = this.Page.Request.Files[0];
                } else {
                    foreach(string uploadedFile in this.Page.Request.Files) {
                        var fileToUse = uploadedFile;
                        var straggler = "$ctl02";
                        if(fileToUse.EndsWith(straggler))
                            fileToUse = fileToUse.Remove(fileToUse.Length - straggler.Length);

                        if(fileToUse.Replace("$", "_").EndsWith(sendingControlID)) {
                            file = this.Page.Request.Files[uploadedFile];
                            break;
                        }
                    }
                }
                if(file == null) {
                    _lastError = Constants.Errors.FileNull;
                    eventArgs = new AsyncFileUploadEventArgs(
                        AsyncFileUploadState.Failed,
                        Constants.Errors.FileNull,
                        String.Empty,
                        String.Empty
                    );

                    OnUploadedFileError(eventArgs);
                } else if(file.FileName == String.Empty) {
                    _lastError = Constants.Errors.NoFileName;

                    eventArgs = new AsyncFileUploadEventArgs(
                       AsyncFileUploadState.Unknown,
                       Constants.Errors.NoFileName,
                       file.FileName,
                       file.ContentLength.ToString()
                    );

                    OnUploadedFileError(eventArgs);
                } else if(file.InputStream == null) {
                    _lastError = Constants.Errors.NoFileName;

                    eventArgs = new AsyncFileUploadEventArgs(
                        AsyncFileUploadState.Failed,
                        Constants.Errors.NoFileName,
                        file.FileName,
                        file.ContentLength.ToString()
                    );

                    OnUploadedFileError(eventArgs);
                } else if(file.ContentLength < 1) {
                    _lastError = Constants.Errors.EmptyContentLength;

                    eventArgs = new AsyncFileUploadEventArgs(
                        AsyncFileUploadState.Unknown,
                        Constants.Errors.EmptyContentLength,
                        file.FileName,
                        file.ContentLength.ToString()
                    );

                    OnUploadedFileError(eventArgs);
                } else {
                    eventArgs = new AsyncFileUploadEventArgs(
                        AsyncFileUploadState.Success,
                        String.Empty,
                        file.FileName,
                        file.ContentLength.ToString()
                    );

                    if(_persistFile) {
                        GC.SuppressFinalize(file);
                        PersistentStoreManager.Instance.AddFileToSession(this.ClientID, file.FileName, file);
                    } else {
                        _postedFile = file;
                    }
                    OnUploadedComplete(eventArgs);
                }
            }
        }

        public byte[] GetBytesFromStream(Stream stream) {
            var buffer = new byte[32768];
            using(var ms = new MemoryStream()) {
                stream.Seek(0, SeekOrigin.Begin);
                while(true) {
                    int read = stream.Read(buffer, 0, buffer.Length);
                    if(read <= 0) {
                        return ms.ToArray();
                    }
                    ms.Write(buffer, 0, read);
                }
            }
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            string sendingControlID = this.Page.Request.QueryString[Constants.FileUploadIDKey];

            if(sendingControlID == null || sendingControlID == this.ClientID) {
                ReceivedFile(this.ClientID);
                if(sendingControlID != null && sendingControlID.StartsWith(this.ClientID)) {
                    string result;
                    if(_lastError == String.Empty) {
                        var bytes = this.FileBytes;
                        if(bytes != null)
                            result = bytes.Length.ToString() + "------" + ContentType;
                        else
                            result = String.Empty;
                    } else {
                        result = "error------" + _lastError;
                    }

                    TextWriter output = Page.Response.Output;
                    output.Write("<div id='" + ClientID + "'>");
                    output.Write(result);
                    output.Write("</div>");
                }
            }
        }

        internal void CreateChilds() {
            Controls.Clear();
            CreateChildControls();
        }

        protected override void CreateChildControls() {
            PersistentStoreManager.Instance.ExtendedFileUploadGUID = Constants.fileUploadGUID;
            string sendingControlID = null;
            if(!IsDesignMode)
                sendingControlID = this.Page.Request.QueryString[Constants.FileUploadIDKey];

            if(IsDesignMode || String.IsNullOrEmpty(sendingControlID)) {
                this._hiddenFieldID = GenerateHtmlInputHiddenControl();
                string lastFileName = String.Empty;
                if(_persistFile) {
                    if(PersistentStoreManager.Instance.FileExists(this.ClientID))
                        lastFileName = PersistentStoreManager.Instance.GetFileName(this.ClientID);
                } else if(_postedFile != null) {
                    lastFileName = _postedFile.FileName;
                }
                GenerateHtmlInputFileControl(lastFileName);
            }
        }

        protected string GenerateHtmlInputHiddenControl() {
            var field = new HiddenField();
            Controls.Add(field);
            return field.ClientID;
        }

        protected string GenerateHtmlInputFileControl(string lastFileName) {
            var div = new HtmlGenericControl("div");
            Controls.Add(div);

            if(this.UploaderStyle == AsyncFileUploaderStyle.Modern) {
                var bgImageUrl = ToolkitResourceManager.GetImageHref(AjaxControlToolkit.Constants.AsyncFileUploadImage, this);

                var style = "background:url(" + bgImageUrl + ") no-repeat 100% 1px; height:24px; margin:0px; text-align:right;";
                if(!Width.IsEmpty)
                    style += "min-width:" + Width.ToString() + ";width:" + Width.ToString() + " !important;";
                else
                    style += "width:355px;";

                div.Attributes.Add("style", style);
            }

            if(!(this.UploaderStyle == AsyncFileUploaderStyle.Modern && IsDesignMode)) {
                _inputFile = new HtmlInputFile();
                if(!this.Enabled)
                    _inputFile.Disabled = true;
                div.Controls.Add(_inputFile);
                _inputFile.Attributes.Add("id", _inputFile.Name.Replace("$", "_"));
                if(this.UploaderStyle != AsyncFileUploaderStyle.Modern) {
                    if(BackColor != Color.Empty)
                        _inputFile.Style[HtmlTextWriterStyle.BackgroundColor] = ColorTranslator.ToHtml(BackColor);

                    if(!Width.IsEmpty)
                        _inputFile.Style[HtmlTextWriterStyle.Width] = Width.ToString();
                    else
                        _inputFile.Style[HtmlTextWriterStyle.Width] = "355px";
                }
            }

            if(this.UploaderStyle == AsyncFileUploaderStyle.Modern) {
                var style = "opacity:0.0; -moz-opacity: 0.0; filter: alpha(opacity=00); font-size:14px;";
                if(!Width.IsEmpty)
                    style += "width:" + Width.ToString() + ";";

                if(_inputFile != null)
                    _inputFile.Attributes.Add("style", style);
                var textBox = new TextBox();

                if(!IsDesignMode) {
                    var div1 = new HtmlGenericControl("div");
                    div.Controls.Add(div1);
                    style = "margin-top:-23px;text-align:left;";
                    div1.Attributes.Add("style", style);
                    div1.Attributes.Add("type", "text");
                    div1.Controls.Add(textBox);
                    style = "height:17px; font-size:12px; font-family:Tahoma;";
                } else {
                    div.Controls.Add(textBox);
                    style = "height:23px; font-size:12px; font-family:Tahoma;";
                }
                if(!Width.IsEmpty && Width.ToString().IndexOf("px") > 0)
                    style += "width:" + (int.Parse(Width.ToString().Substring(0, Width.ToString().IndexOf("px"))) - 107).ToString() + "px;";
                else
                    style += "width:248px;";

                if(lastFileName != String.Empty || this._failedValidation) {
                    if((this.FileBytes != null && this.FileBytes.Length > 0) && (!this._failedValidation)) {
                        style += "background-color:#00FF00;";
                    } else {
                        this._failedValidation = false;
                        style += "background-color:#FF0000;";
                    }
                    textBox.Text = lastFileName;
                } else if(BackColor != Color.Empty) {
                    style += "background-color:" + ColorTranslator.ToHtml(BackColor) + ";";
                }
                textBox.ReadOnly = true;
                textBox.Attributes.Add("style", style);
                this._innerTBID = textBox.ClientID;
            } else if(IsDesignMode) {
                Controls.Clear();
                Controls.Add(_inputFile);
            }

            return div.ClientID;
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            if(!IsDesignMode) {
                if(this._hiddenFieldID != String.Empty) descriptor.AddElementProperty("hiddenField", this._hiddenFieldID);
                if(this._innerTBID != String.Empty) descriptor.AddElementProperty("innerTB", this._innerTBID);
                if(this._inputFile != null) descriptor.AddElementProperty("inputFile", this._inputFile.Name.Replace("$", "_"));
                descriptor.AddProperty("postBackUrl", this.Page.Request.RawUrl);
                descriptor.AddProperty("formName", Path.GetFileName(this.Page.Form.Name));
                if(CompleteBackColor != Color.Empty)
                    descriptor.AddProperty("completeBackColor", ColorTranslator.ToHtml(CompleteBackColor));

                if(ErrorBackColor != Color.Empty)
                    descriptor.AddProperty("errorBackColor", ColorTranslator.ToHtml(ErrorBackColor));

                if(UploadingBackColor != Color.Empty)
                    descriptor.AddProperty("uploadingBackColor", ColorTranslator.ToHtml(UploadingBackColor));

                if(ThrobberID != string.Empty) {
                    var control = this.FindControl(ThrobberID);
                    if(control != null)
                        descriptor.AddElementProperty("throbber", control.ClientID);
                }
            }
        }

        protected override Style CreateControlStyle() {
            return new AsyncFileUploadStyleWrapper(ViewState);
        }

        sealed class AsyncFileUploadStyleWrapper : Style {
            public AsyncFileUploadStyleWrapper(StateBag state)
                : base(state) {
            }

            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver) {
                base.FillStyleAttributes(attributes, urlResolver);

                attributes.Remove(HtmlTextWriterStyle.BackgroundColor);
                attributes.Remove(HtmlTextWriterStyle.Width);
            }
        }
    }

}
#pragma warning restore 1591