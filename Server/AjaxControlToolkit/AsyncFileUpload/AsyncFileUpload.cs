using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Script;
using System.ComponentModel;
using System.Xml;
using System.IO;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using AjaxControlToolkit;
using System.Text;
using System.Web.Script.Serialization;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Design;

#region [ Resources ]

[assembly: System.Web.UI.WebResource("AsyncFileUpload.AsyncFileUpload.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AsyncFileUpload.AsyncFileUpload.debug.js", "application/x-javascript")]
[assembly: WebResource("AsyncFileUpload.images.fileupload.png", "image/png")]

#endregion

namespace AjaxControlToolkit
{
    /// <summary>
    /// AsyncFileUpload enables you to you asynchronously upload files to a server. The results of the file upload can be checked both in the server and client sides. 
    /// 
    /// You can save the uploaded file by calling the SaveAs() method in a handler for the server UploadedComplete event.
    /// </summary>
    [Designer("AjaxControlToolkit.AsyncFileUploadDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.AsyncFileUpload", "AsyncFileUpload.AsyncFileUpload.js")]
    public class AsyncFileUpload : ScriptControlBase
    {
        #region [ Phrases Static Class ]

        /// <summary>
        /// Constants to keep static string values. These values will be used by classes to upload file asynchronously.
        /// </summary>
        public static class Constants
        {
            public readonly static string FileUploadIDKey = "AsyncFileUploadID";
            public readonly static string InternalErrorInvalidIFrame = "The ExtendedFileUpload control has encountered an error with the uploader in this page. Please refresh the page and try again.";
            public readonly static string fileUploadGUID = "b3b89160-3224-476e-9076-70b500c816cf";

            /// <summary>
            /// Errors to keep user friendly error messages. These error messages will be displayed to end user if any error occurs during the file upload.
            /// </summary>
            public static class Errors
            {
                public readonly static string NoFiles = "No files are attached to the upload.";
                public readonly static string FileNull = "The file attached is invalid.";
                public readonly static string NoFileName = "The file attached has an invalid filename.";
                public readonly static string InputStreamNull = "The file attached could not be read.";
                public readonly static string EmptyContentLength = "The file attached is empty.";
            }

            /// <summary>
            /// StatusMessages keep state message that will be displayed after file is uploaded at server.
            /// </summary>
            public static class StatusMessages
            {
                public readonly static string UploadSuccessful = "The file uploaded successfully.";
            }
        }
        #endregion

        #region [ Public Enums ]

        /// <summary>
        /// UploaderStyleEnum represents available apprearance styles for AsyncFileUpload (Traditional, Modern). 
        /// Default value is Traditional.
        /// </summary>
        public enum UploaderStyleEnum
        {
            Traditional = 0,
            Modern = 1
        }

        /// <summary>
        /// Store type to persist values (Session). Currently asyncFileUpload persist values in session only.
        /// </summary>
        public enum PersistedStoreTypeEnum
        {
            Session = 0
        }
        #endregion

        #region [ Fields ]

        private HttpPostedFile postedFile = null;
        private PersistedStoreTypeEnum persistStorageType = PersistedStoreTypeEnum.Session;
        private string lastError = String.Empty;
        private bool failedValidation = false;
        private UploaderStyleEnum controlStyle = UploaderStyleEnum.Traditional;
        private string hiddenFieldID = String.Empty;
        private string innerTBID = String.Empty;
        private HtmlInputFile inputFile = null;
        private bool persistFile = false;

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new AsyncFileUpload.
        /// </summary>
        public AsyncFileUpload()
            : base(true, HtmlTextWriterTag.Div)
        {
        }

        #endregion

        #region [ Public Server Events ]

        /// <summary>
        /// Event to raise on the server when the file is uploaded successfully.
        /// </summary>
        [Bindable(true)]
        [Category("Server Events")]
        public event EventHandler<AsyncFileUploadEventArgs> UploadedComplete;

        /// <summary>
        /// Event to raise on the server when the file is corrupted.
        /// </summary>
        [Bindable(true)]
        [Category("Server Events")]
        public event EventHandler<AsyncFileUploadEventArgs> UploadedFileError;

        #endregion

        #region [ Public Client Events ]

        /// <summary>
        /// Gets or sets the client script that executes when a file upload starts.
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadStarted")]
        public string OnClientUploadStarted
        {
            get { return (string)(ViewState["OnClientUploadStarted"] ?? string.Empty); }
            set { ViewState["OnClientUploadStarted"] = value; }
        }

        /// <summary>
        /// Gets or sets the client script that executes when a file upload completes.
        /// </summary>                
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadComplete")]
        public string OnClientUploadComplete
        {
            get { return (string)(ViewState["OnClientUploadComplete"] ?? string.Empty); }
            set { ViewState["OnClientUploadComplete"] = value; }
        }

        /// <summary>
        /// Gets or sets the client script that executes when a file upload error occurs.
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadError")]
        public string OnClientUploadError
        {
            get { return (string)(ViewState["OnClientUploadError"] ?? string.Empty); }
            set { ViewState["OnClientUploadError"] = value; }
        }

        #endregion

        #region [ Private Properties ]
        /// <summary>
        /// Gets whether control is in design mode or not.
        /// </summary>
        private bool IsDesignMode
        {
            get { return (HttpContext.Current == null); }
        }

        /// <summary>
        /// Gets the reference of current posted file.
        /// </summary>
        private HttpPostedFile CurrentFile
        {
            get
            {
                return persistFile ? AfuPersistedStoreManager.Instance.GetFileFromSession(this.ClientID) : postedFile;
            }
        }
        #endregion

        #region [ Public Properties ]

        /// <summary>
        /// Gets an array of the bytes in the file being uploaded.
        /// </summary>        
        [BrowsableAttribute(false)]
        public byte[] FileBytes
        {
            get
            {
                PopulatObjectPriorToRender(this.ClientID);
                HttpPostedFile file = CurrentFile;
                if (file != null)
                {
                    try
                    {
                        return GetBytesFromStream(file.InputStream);
                    }
                    catch
                    {
                    }
                }
                return null;
            }
        }

        /// <summary>
        /// Gets or sets the ID of a control that is displayed while the file is being uploaded.
        /// </summary>
        [Category("Behavior")]
        [Description("ID of Throbber")]
        [DefaultValue("")]
        public string ThrobberID
        {
            get { return (string)(ViewState["ThrobberID"] ?? string.Empty); }
            set { ViewState["ThrobberID"] = value; }
        }

        /// <summary>
        /// Gets or sets the control's background color when the file is uploaded.
        /// The default value is Lime
        /// </summary>
        [Category("Appearance")]
        [TypeConverter(typeof(WebColorConverter))]
        [Description("Control's background color on upload complete.")]
        [DefaultValue(typeof(Color), "Lime")]
        public Color CompleteBackColor
        {
            get { return (Color)(ViewState["CompleteBackColor"] ?? Color.Lime); }
            set { ViewState["CompleteBackColor"] = value; }
        }

        /// <summary>
        /// Gets or sets the control's background color while the file is
        /// in the process of being uploaded.
        /// The default value is White.
        /// </summary>
        [Category("Appearance")]
        [TypeConverter(typeof(WebColorConverter))]
        [Description("Control's background color when uploading is in progress.")]
        [DefaultValue(typeof(Color), "White")]
        public Color UploadingBackColor
        {
            get { return (Color)(ViewState["UploadingBackColor"] ?? Color.White); }
            set { ViewState["UploadingBackColor"] = value; }
        }

        /// <summary>
        /// Gets or sets the control's background color when there is an upload error. 
        /// The default value is Red
        /// </summary>
        [Category("Appearance")]
        [TypeConverter(typeof(WebColorConverter))]
        [Description("Control's background color on upload error.")]
        [DefaultValue(typeof(Color), "Red")]
        public Color ErrorBackColor
        {
            get { return (Color)(ViewState["ErrorBackColor"] ?? Color.Red); }
            set { ViewState["ErrorBackColor"] = value; }
        }

        /// <summary>
        /// Gets or sets the control's width.
        /// </summary>
        [DefaultValue(typeof(Unit), "")]
        [Category("Layout")]
        public override Unit Width
        {
            get { return base.Width; }
            set { base.Width = value; }
        }

        /// <summary>
        /// Gets or Sets the status of validation failed.
        /// </summary>
        [BrowsableAttribute(false)]
        public bool FailedValidation
        {
            get { return failedValidation; }
            set { failedValidation = value; }
        }

        /// <summary>
        /// Gets or sets the storage provider for the control.
        /// The default is value is Session.
        /// </summary>
        [Bindable(true)]
        [Category("Behavior")]
        [DefaultValue(AsyncFileUpload.PersistedStoreTypeEnum.Session)]
        public PersistedStoreTypeEnum PersistedStoreType
        {
            get { return persistStorageType; }
            set { persistStorageType = value; }
        }

        /// <summary>
        /// Gets or sets the control's appearance (Traditional, Modern).
        /// The default value is Traditional
        /// </summary>
        [Bindable(true)]
        [Category("Appearance")]
        [BrowsableAttribute(true)]
        [DefaultValue(UploaderStyleEnum.Traditional)]
        public UploaderStyleEnum UploaderStyle
        {
            get { return controlStyle; }
            set { controlStyle = value; }
        }

        /// <summary>
        /// Gets an HttpPostedFile object that provides access to the uploaded file.
        /// </summary>
        [BrowsableAttribute(false)]
        public HttpPostedFile PostedFile
        {
            get
            {
                PopulatObjectPriorToRender(this.ClientID);
                return CurrentFile;
            }
        }

        /// <summary>
        /// Returns true when a file has been uploaded.
        /// Else returns false.
        /// </summary>
        [BrowsableAttribute(false)]
        public bool HasFile
        {
            get
            {
                PopulatObjectPriorToRender(this.ClientID);
                if (persistFile)
                {
                    return AfuPersistedStoreManager.Instance.FileExists(this.ClientID);
                }
                return (postedFile != null);
            }
        }

        /// <summary>
        /// Gets the file name of the uploaded file.
        /// Else returns empty string.
        /// </summary>
        [BrowsableAttribute(false)]
        public string FileName
        {
            get
            {
                PopulatObjectPriorToRender(this.ClientID);
                if (persistFile)
                {
                    return Path.GetFileName(AfuPersistedStoreManager.Instance.GetFileName(this.ClientID));
                }
                else if (postedFile != null)
                {
                    return Path.GetFileName(postedFile.FileName);
                }
                return String.Empty;
            }
        }

        /// <summary>
        /// Gets the Type of contents of the uploaded file.
        /// </summary>
        [BrowsableAttribute(false)]
        public string ContentType
        {
            get
            {
                PopulatObjectPriorToRender(this.ClientID);
                if (persistFile)
                {
                    return AfuPersistedStoreManager.Instance.GetContentType(this.ClientID);
                }
                else if (postedFile != null)
                {
                    return postedFile.ContentType;
                }
                return String.Empty;
            }
        }

        /// <summary>
        /// Gets a Stream object that points to an uploaded file to prepare for reading the contents of the file.
        /// </summary>
        [BrowsableAttribute(false)]
        public Stream FileContent
        {
            get
            {
                PopulatObjectPriorToRender(this.ClientID);
                HttpPostedFile file = CurrentFile;
                if (file != null && file.InputStream != null)
                {
                    return file.InputStream;
                }
                return null;
            }
        }

        /// <summary>
        /// Returns true when the file is in the process of being uploaded.
        /// </summary>
        [BrowsableAttribute(false)]
        public bool IsUploading
        {
            get
            {
                return (this.Page.Request.QueryString[Constants.FileUploadIDKey] != null);
            }
        }

        /// <summary>
        /// Gets or sets the status whether file is persisted or not.
        /// </summary>
        [Bindable(true)]
        [BrowsableAttribute(true)]
        [DefaultValue(false)]
        public bool PersistFile
        {
            get
            {
                return persistFile;
            }
            set
            {
                persistFile = value;
            }
        }

        #endregion

        #region [ Methods ]

        /// <summary>
        /// Removes all files from the storage provider.
        /// </summary>
        public void ClearAllFilesFromPersistedStore()
        {
            AfuPersistedStoreManager.Instance.ClearAllFilesFromSession(this.ClientID);
        }

        /// <summary>
        /// Removes a particular file from the storage provider.
        /// </summary>
        public void ClearFileFromPersistedStore()
        {
            AfuPersistedStoreManager.Instance.RemoveFileFromSession(this.ClientID);
        }

        /// <summary>
        /// Saves the uploaded file with a particular file name.
        /// </summary>
        /// <param name="fileName">file name at server.</param>
        public void SaveAs(string fileName)
        {
            PopulatObjectPriorToRender(this.ClientID);
            HttpPostedFile file = CurrentFile;
            file.SaveAs(fileName);
        }

        /// <summary>
        /// PopulateObjectPriorToRender passes the file to upload 
        /// if file is already not in request to upload and uploadable file is in request.          
        /// </summary>
        /// <param name="controlId">Id of AsyncFileUpload.</param>
        private void PopulatObjectPriorToRender(string controlId)
        {
            bool exists;
            if (persistFile)
            {
                exists = AfuPersistedStoreManager.Instance.FileExists(controlId);
            }
            else
            {
                exists = (postedFile != null);
            }
            if ((!exists) && (this.Page != null && this.Page.Request.Files.Count != 0))
            {
                ReceivedFile(controlId);
            }
        }

        /// <summary>
        /// OnUploadedFileError execute the event attached to UploadedFileError
        /// When error occurs during file upload.
        /// </summary>
        /// <param name="e">Arguments containing information of uploadable file.</param>
        protected virtual void OnUploadedFileError(AsyncFileUploadEventArgs e)
        {
            if (UploadedFileError != null)
            {
                UploadedFileError(this, e);
            }
        }

        /// <summary>
        /// OnUploadedComplete execute the event attached to UploadedFileComplete
        /// after the file uploaded successfully.
        /// </summary>
        /// <param name="e">Arguments containing information of uploadable file.</param>
        protected virtual void OnUploadedComplete(AsyncFileUploadEventArgs e)
        {
            if (UploadedComplete != null)
            {
                UploadedComplete(this, e);
            }
            //ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "OnUploadedComplete", "top.$find(\"" + this.ClientID + "\")._stopLoad('111------www');", true);
        }

        /// <summary>
        /// ReceivedFile takes the file from request for upload, creates AsyncFileUploadEventArgs and calls to OnUploadError/OnUploadComplete events.
        /// </summary>
        /// <param name="sendingControlID">Id of AsyncFileUpload.</param>
        private void ReceivedFile(string sendingControlID)
        {
            AsyncFileUploadEventArgs eventArgs = null;
            lastError = String.Empty;

            if (this.Page.Request.Files.Count > 0)
            {
                HttpPostedFile file = null;
                if (sendingControlID == null || sendingControlID == String.Empty)
                {
                    file = this.Page.Request.Files[0];
                }
                else
                {
                    foreach (string uploadedFile in this.Page.Request.Files)
                    {                        
                        string fileToUse = uploadedFile;
                        string straggler = "$ctl02";
                        if (fileToUse.EndsWith(straggler))
                        {
                            fileToUse = fileToUse.Remove(fileToUse.Length - straggler.Length);
                        }
                        if (fileToUse.Replace("$", "_").EndsWith(sendingControlID))
                        {
                            file = this.Page.Request.Files[uploadedFile];
                            break;
                        }
                    }
                }
                if (file == null)
                {
                    lastError = Constants.Errors.FileNull;
                    eventArgs = new AsyncFileUploadEventArgs(
                        AsyncFileUploadState.Failed,
                        Constants.Errors.FileNull,
                        String.Empty,
                        String.Empty
                    );

                    OnUploadedFileError(eventArgs);
                }
                else if (file.FileName == String.Empty)
                {
                    lastError = Constants.Errors.NoFileName;

                    eventArgs = new AsyncFileUploadEventArgs(
                       AsyncFileUploadState.Unknown,
                       Constants.Errors.NoFileName,
                       file.FileName,
                       file.ContentLength.ToString()
                    );

                    OnUploadedFileError(eventArgs);
                }
                else if (file.InputStream == null)
                {
                    lastError = Constants.Errors.NoFileName;

                    eventArgs = new AsyncFileUploadEventArgs(
                        AsyncFileUploadState.Failed,
                        Constants.Errors.NoFileName,
                        file.FileName,
                        file.ContentLength.ToString()
                    );

                    OnUploadedFileError(eventArgs);
                }
                else if (file.ContentLength < 1)
                {
                    lastError = Constants.Errors.EmptyContentLength;

                    eventArgs = new AsyncFileUploadEventArgs(
                        AsyncFileUploadState.Unknown,
                        Constants.Errors.EmptyContentLength,
                        file.FileName,
                        file.ContentLength.ToString()
                    );

                    OnUploadedFileError(eventArgs);
                }
                else
                {
                    eventArgs = new AsyncFileUploadEventArgs(
                        AsyncFileUploadState.Success,
                        String.Empty,
                        file.FileName,
                        file.ContentLength.ToString()
                    );

                    if (persistFile)
                    {
                        GC.SuppressFinalize(file);
                        AfuPersistedStoreManager.Instance.AddFileToSession(this.ClientID, file.FileName, file);
                    }
                    else
                    {
                        postedFile = file;
                    }
                    OnUploadedComplete(eventArgs);
                }
            }
        }

        /// <summary>
        /// Retrieves an array of bytes from a file stream.
        /// </summary>
        /// <param name="stream">stream containg file contents.</param>
        /// <returns>Array of bytes of contents of requested file.</returns>
        public byte[] GetBytesFromStream(Stream stream)
        {
            byte[] buffer = new byte[32768];
            using (MemoryStream ms = new MemoryStream())
            {
                stream.Seek(0, SeekOrigin.Begin);
                while (true)
                {
                    int read = stream.Read(buffer, 0, buffer.Length);
                    if (read <= 0)
                    {
                        return ms.ToArray();
                    }
                    ms.Write(buffer, 0, read);
                }
            }
        }

        #endregion

        #region [ Members ]

        /// <summary>
        /// OnPreRender renders the output of result to client side.        
        /// </summary>
        /// <param name="e">Event arguments.</param>
        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);
            AfuPersistedStoreManager.Instance.PersistedStorageType = (AfuPersistedStoreManager.PersistedStoreTypeEnum)this.PersistedStoreType;

            string sendingControlID = this.Page.Request.QueryString[Constants.FileUploadIDKey];

            if ((sendingControlID != null && sendingControlID == this.ClientID) || sendingControlID == null)
            {
                ReceivedFile(this.ClientID);
                if (sendingControlID != null && sendingControlID.StartsWith(this.ClientID))
                {
                    string result;
                    if (lastError == String.Empty)
                    {
                        byte[] bytes = this.FileBytes;
                        if (bytes != null)
                        {
                            result = bytes.Length.ToString() + "------" + ContentType;
                        }
                        else
                        {
                            result = "";
                        }
                    }
                    else
                    {
                        result = "error------" + lastError;
                    }

                    TextWriter output = Page.Response.Output;
                    //Page.Response.ClearContent();
                    //output.Write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\r\n<html xmlns=\"http://www.w3.org/1999/xhtml\"><head><title></title></head><body><div id='" + ClientID + "'>");
                    //output.Write(result);
                    //output.Write("</div></body></html>");
                    //Page.Response.End();
                    output.Write("<div id='" + ClientID + "'>");
                    output.Write(result);
                    output.Write("</div>");
                }
            }
        }

        /// <summary>
        /// CreateChilds call to create child controls for asyncfileupload.
        /// </summary>
        internal void CreateChilds()
        {
            this.Controls.Clear();
            this.CreateChildControls();
        }

        /// <summary>
        /// CreateChildControls creates html controls for a asyncFileUpload control.
        /// </summary>
        protected override void CreateChildControls()
        {
            AfuPersistedStoreManager.Instance.ExtendedFileUploadGUID = Constants.fileUploadGUID;
            string sendingControlID = null;
            if (!IsDesignMode)
            {
                sendingControlID = this.Page.Request.QueryString[Constants.FileUploadIDKey];
            }
            if ((IsDesignMode || sendingControlID == null || sendingControlID == String.Empty))
            {
                this.hiddenFieldID = GenerateHtmlInputHiddenControl();
                string lastFileName = String.Empty;
                if (persistFile)
                {
                    if (AfuPersistedStoreManager.Instance.FileExists(this.ClientID))
                    {
                        lastFileName = AfuPersistedStoreManager.Instance.GetFileName(this.ClientID);
                    }
                }
                else if (postedFile != null)
                {
                    lastFileName = postedFile.FileName;
                }
                GenerateHtmlInputFileControl(lastFileName);
            }
        }

        //protected override void RenderContents(HtmlTextWriter output)
        //{
        //    base.RenderContents(output);
        //    AfuPersistedStoreManager.Instance.ExtendedFileUploadGUID = Constants.fileUploadGUID;
        //    string sendingControlID = null;
        //    if (!IsDesignMode)
        //    {
        //        sendingControlID = this.Page.Request.QueryString[Constants.FileUploadIDKey];
        //    }
        //    if ((IsDesignMode || sendingControlID == null || sendingControlID == String.Empty))
        //    {
        //    }
        //    else
        //    {
        //        byte[] bytes = this.FileBytes;
        //        if (bytes != null)
        //        {
        //            output.Write(bytes.Length.ToString());
        //        }
        //    }

        //}

        /// <summary>
        /// GenerateHtmlInputHiddenControl creates a html hidden control for AsyncFileUpload control.
        /// </summary>
        /// <returns>returns if of newly created hidden control.</returns>
        protected string GenerateHtmlInputHiddenControl()
        {
            HiddenField field = new HiddenField();
            Controls.Add(field);
            return field.ClientID;
        }

        /// <summary>
        /// GenerateHtmlInputFileControl creates input file control for AsyncFileUpload control.
        /// </summary>
        /// <param name="lastFileName">Name of Posted file.</param>
        /// <returns>Return the client id of parent div that contains all other html controls.</returns>
        protected string GenerateHtmlInputFileControl(string lastFileName)
        {
            HtmlGenericControl div = new HtmlGenericControl("div");
            Controls.Add(div);
            //div.Attributes.Add("Name", div.ClientID);

            if (this.UploaderStyle == UploaderStyleEnum.Modern)
            {
                string bgImage = String.Empty;
                bgImage = Page.ClientScript.GetWebResourceUrl(typeof(AsyncFileUpload), "AsyncFileUpload.images.fileupload.png");
                string style = "background:url(" + bgImage + ") no-repeat 100% 1px; height:24px; margin:0px; text-align:right;";
                if (!Width.IsEmpty)
                {
                    style += "min-width:" + Width.ToString() + ";width:" + Width.ToString() + " !important;";
                }
                else
                {
                    style += "width:355px;";
                }
                div.Attributes.Add("style", style);
            }

            if (!(this.UploaderStyle == UploaderStyleEnum.Modern && IsDesignMode))
            {
                inputFile = new HtmlInputFile();
                if (!this.Enabled)
                    inputFile.Disabled = true;
                div.Controls.Add(inputFile);
                inputFile.Attributes.Add("id", inputFile.Name.Replace("$", "_"));
                //inputFile.Attributes.Add("onkeydown", "return false;");
                //inputFile.Attributes.Add("onkeypress", "return false;");
                //inputFile.Attributes.Add("onmousedown", "return false;");
                if (this.UploaderStyle != UploaderStyleEnum.Modern)
                {
                    if (BackColor != Color.Empty)
                    {
                        inputFile.Style[HtmlTextWriterStyle.BackgroundColor] = ColorTranslator.ToHtml(BackColor);
                    }
                    if (!Width.IsEmpty)
                    {
                        inputFile.Style[HtmlTextWriterStyle.Width] = Width.ToString();
                    }
                    else
                    {
                        inputFile.Style[HtmlTextWriterStyle.Width] = "355px";
                    }
                }
            }

            if (this.UploaderStyle == UploaderStyleEnum.Modern)
            {
                string style = "opacity:0.0; -moz-opacity: 0.0; filter: alpha(opacity=00); font-size:14px;";
                if (!Width.IsEmpty)
                {
                    style += "width:" + Width.ToString() + ";";
                }
                if (inputFile != null) inputFile.Attributes.Add("style", style);
                TextBox textBox = new TextBox();

                if (!IsDesignMode)
                {
                    HtmlGenericControl div1 = new HtmlGenericControl("div");
                    div.Controls.Add(div1);
                    //div1.Attributes.Add("Name", div.ClientID);
                    style = "margin-top:-23px;text-align:left;";
                    div1.Attributes.Add("style", style);
                    div1.Attributes.Add("type", "text");
                    div1.Controls.Add(textBox);
                    style = "height:17px; font-size:12px; font-family:Tahoma;";
                }
                else
                {
                    div.Controls.Add(textBox);
                    style = "height:23px; font-size:12px; font-family:Tahoma;";
                }
                if (!Width.IsEmpty && Width.ToString().IndexOf("px") > 0)
                {
                    style += "width:" + (int.Parse(Width.ToString().Substring(0, Width.ToString().IndexOf("px"))) - 107).ToString() + "px;";
                }
                else
                {
                    style += "width:248px;";
                }
                if (lastFileName != String.Empty || this.failedValidation)
                {
                    if ((this.FileBytes != null && this.FileBytes.Length > 0) && (!this.failedValidation))
                    {
                        style += "background-color:#00FF00;";
                    }
                    else
                    {
                        this.failedValidation = false;
                        style += "background-color:#FF0000;";
                    }
                    textBox.Text = lastFileName;
                }
                else if (BackColor != Color.Empty)
                {
                    style += "background-color:" + ColorTranslator.ToHtml(BackColor) + ";";
                }
                textBox.ReadOnly = true;
                textBox.Attributes.Add("style", style);
                this.innerTBID = textBox.ClientID;
            }
            else if (IsDesignMode)
            {
                Controls.Clear();
                Controls.Add(inputFile);
            }

            return div.ClientID;
        }

        /// <summary>
        /// DescribeComponent creates propreties in ScriptComponentDescriptor for child controls in asyncFileUpload
        /// </summary>
        /// <param name="descriptor">Descriptor object which will accpet server components to convert in client script.</param>
        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            if (!IsDesignMode)
            {
                if (this.hiddenFieldID != String.Empty) descriptor.AddElementProperty("hiddenField", this.hiddenFieldID);
                if (this.innerTBID != String.Empty) descriptor.AddElementProperty("innerTB", this.innerTBID);
                if (this.inputFile != null) descriptor.AddElementProperty("inputFile", this.inputFile.Name.Replace("$", "_"));
                descriptor.AddProperty("postBackUrl", this.Page.Request.RawUrl);
                descriptor.AddProperty("formName", Path.GetFileName(this.Page.Form.Name));
                if (CompleteBackColor != Color.Empty)
                {
                    descriptor.AddProperty("completeBackColor", ColorTranslator.ToHtml(CompleteBackColor));
                }
                if (ErrorBackColor != Color.Empty)
                {
                    descriptor.AddProperty("errorBackColor", ColorTranslator.ToHtml(ErrorBackColor));
                }
                if (UploadingBackColor != Color.Empty)
                {
                    descriptor.AddProperty("uploadingBackColor", ColorTranslator.ToHtml(UploadingBackColor));
                }
                if (ThrobberID != string.Empty)
                {
                    Control control = this.FindControl(ThrobberID);
                    if (control != null)
                    {
                        descriptor.AddElementProperty("throbber", control.ClientID);
                    }
                }
            }
        }

        /// <summary>
        /// CreateControlStyle creates object of style for AsyncFileUpload control.
        /// </summary>
        /// <returns>Style object.</returns>
        protected override Style CreateControlStyle()
        {
            AsyncFileUploadStyle style = new AsyncFileUploadStyle(ViewState);
            return style;
        }

        #endregion

        #region [ AsyncFileUploadStyle ]

        /// <summary>
        /// AsyncFileUploadStyle sets css attributes for the AsyncFileUpload control.
        /// </summary>
        private sealed class AsyncFileUploadStyle : Style
        {
            public AsyncFileUploadStyle(StateBag state)
                : base(state)
            {
            }


            /// <summary>
            /// FillStyleAttributes sets the css atrribute for asyncFileUpload.
            /// </summary>
            /// <param name="attributes">css attributes</param>
            /// <param name="urlResolver">object of IUrlResolutionService</param>
            protected override void FillStyleAttributes(CssStyleCollection attributes, IUrlResolutionService urlResolver)
            {
                base.FillStyleAttributes(attributes, urlResolver);

                attributes.Remove(HtmlTextWriterStyle.BackgroundColor);
                attributes.Remove(HtmlTextWriterStyle.Width);
            }
        }

        #endregion
    }
}
