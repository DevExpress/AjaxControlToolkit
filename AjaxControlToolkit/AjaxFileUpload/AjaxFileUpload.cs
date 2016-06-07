#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.Collections.ObjectModel;

namespace AjaxControlToolkit {

    /// <summary>
    /// AjaxFileUpload is an ASP.NET AJAX Control that allows you to asynchronously upload files to the server.
    /// </summary>
    [Designer(typeof(AjaxFileUploadDesigner))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientCssResource(Constants.AjaxFileUploadName)]
    [ClientScriptResource("Sys.Extended.UI.AjaxFileUpload.Control", Constants.AjaxFileUploadName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.AjaxFileUploadName + Constants.IconPostfix)]
    public class AjaxFileUpload : ScriptControlBase {

        internal const string ContextKey = "{DA8BEDC8-B952-4d5d-8CC2-59FE922E2923}";
        const string DefaultTempSubDir = "_AjaxFileUpload";

        // Location of uploaded temporary file path
        string _uploadedFilePath = null;

        public AjaxFileUpload()
            : base(true, HtmlTextWriterTag.Div) {
        }

        bool IsDesignMode {
            get { return (HttpContext.Current == null); }
        }

        // Any value/Id that can be used when storing file.
        public string ContextKeys { get; set; }

        /// <summary>
        /// The ID of a control that is shown on the file upload.
        /// The throbber image is displayed for browsers that do not support the HTML5 File API or server-side polling.
        /// </summary>
        [Description("ID of Throbber")]
        [Category("Behavior")]
        [DefaultValue("")]
        public string ThrobberID {
            get { return (string)(ViewState["ThrobberID"] ?? string.Empty); }
            set { ViewState["ThrobberID"] = value; }
        }

        ///<summary>
        /// This will be true when a postback will be performed from the control. 
        /// This can be used to avoid execution of unnecessary code during a partial postback. 
        /// The default is false.
        /// </summary>
        [Browsable(false)]
        [DefaultValue(false)]
        public bool IsInFileUploadPostBack { get; set; }

        /// <summary>
        /// A maximum number of files in an upload queue.
        /// The default is 10.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(10)]
        [ClientPropertyName("maximumNumberOfFiles")]
        public int MaximumNumberOfFiles { get; set; }

        /// <summary>
        /// A comma-separated list of allowed file extensions.
        /// The default is an empty string.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("allowedFileTypes")]
        public string AllowedFileTypes { get; set; }

        /// <summary>
        /// The size of a chunk used by HTML5 to upload large files in bytes.
        /// The default is 4096.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(4096)]
        [ClientPropertyName("chunkSize")]
        public int ChunkSize {
            get { return int.Parse((string)ViewState["ChunkSize"] ?? "4096"); }
            set { ViewState["ChunkSize"] = value.ToString(); }
        }

        /// <summary>
        /// The maximum size of a file to be uploaded in Kbytes.
        /// A non-positive value means the size is unlimited. 
        /// The default is 0.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        [ClientPropertyName("maxFileSize")]
        public int MaxFileSize {
            get { return int.Parse((string)ViewState["MaxFileSize"] ?? "0"); }
            set { ViewState["MaxFileSize"] = value.ToString(); }
        }

        /// <summary>
        /// Whether or not to hide file upload list container after the uploading finished
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("clearFileListAfterUpload")]
        public bool ClearFileListAfterUpload {
            get { return bool.Parse((string)ViewState["ClearFileListAfterUpload"] ?? "false");  }
            set { ViewState["ClearFileListAfterUpload"] = value.ToString(); }
        }

        /// <summary>
        /// Whether or not to use absolute path for AjaxFileUploadHandler
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("useAbsoluteHandlerPath")]
        public bool UseAbsoluteHandlerPath {
            get { return bool.Parse((string)ViewState["UseAbsoluteHandlerPath"] ?? "true"); }
            set { ViewState["UseAbsoluteHandlerPath"] = value.ToString(); }
        }

        ///<summary>
        /// How AjaxFileUpload displays a progress bar.
        /// The default is Auto.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(AjaxFileUploadMode.Auto)]
        [ClientPropertyName("mode")]
        public AjaxFileUploadMode Mode {
            get { return (AjaxFileUploadMode)Enum.Parse(typeof(AjaxFileUploadMode), (string)ViewState["Mode"] ?? "Auto"); }
            set { ViewState["Mode"] = value.ToString(); }
        }

        /// <summary>
        /// Whether or not automatically start upload files after drag/drop or select in file dialog. The default is false
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("autoStartUpload")]
        public bool AutoStartUpload
        {
            get { return bool.Parse((string)ViewState["AutoStartUpload"] ?? "false"); }
            set { ViewState["AutoStartUpload"] = value.ToString(); }
        }

        /// <summary>
        /// An event raised when the file upload starts.
        /// </summary>
        [Bindable(true)]
        [Category("Server Events")]
        public event EventHandler<AjaxFileUploadStartEventArgs> UploadStart;

        /// <summary>
        /// An event raised when the file upload is complete.
        /// </summary>
        [Bindable(true)]
        [Category("Server Events")]
        public event EventHandler<AjaxFileUploadEventArgs> UploadComplete;

        /// <summary>
        /// An event handler that will be raised when the UploadComplete event is raised 
        /// in all files in an upload queue, or when a user presses the Cancel button to stop uploading.
        /// </summary>
        [Bindable(true)]
        [Category("Server Events")]
        public event EventHandler<AjaxFileUploadCompleteAllEventArgs> UploadCompleteAll;

        /// <summary>
        /// The name of a JavaScript function executed on the client side before any files are uploaded.
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadStart")]
        public string OnClientUploadStart {
            get { return (string)(ViewState["OnClientUploadStart"] ?? string.Empty); }
            set { ViewState["OnClientUploadStart"] = value; }
        }

        /// <summary>
        /// The name of a JavaScript function executed on the client side after a file is uploaded successfully.
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadComplete")]
        public string OnClientUploadComplete {
            get { return (string)(ViewState["OnClientUploadComplete"] ?? string.Empty); }
            set { ViewState["OnClientUploadComplete"] = value; }
        }

        /// <summary>
        /// The client script that executes when all of files in queue uploaded, 
        /// or when user hits Cancel button to stop uploading
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadCompleteAll")]
        public string OnClientUploadCompleteAll {
            get { return (string)(ViewState["OnClientUploadCompleteAll"] ?? string.Empty); }
            set { ViewState["OnClientUploadCompleteAll"] = value; }
        }

        /// <summary>
        /// The name of a JavaScript function executed on the client side if the file upload failed.
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadError")]
        public string OnClientUploadError {
            get { return (string)(ViewState["OnClientUploadError"] ?? string.Empty); }
            set { ViewState["OnClientUploadError"] = value; }
        }

        /// <summary>
        /// Whether or not AjaxFileUpload supports server polling.
        /// </summary>
        public bool ServerPollingSupport {
            get { return true; }
        }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(IsDesignMode || !AreFileUploadParamsPresent()) 
                return;
                
            IsInFileUploadPostBack = true;

            var processor = new UploadRequestProcessor {
                Context = Context,               
                UploadStart = UploadStart,
                UploadComplete = UploadComplete,
                UploadCompleteAll = UploadCompleteAll,
                SetUploadedFilePath = SetUploadedFilePath
            };

            processor.ProcessRequest();
        }

        bool AreFileUploadParamsPresent() {
            return  !string.IsNullOrEmpty(Page.Request.QueryString["contextkey"])
                    && 
                    Page.Request.QueryString["contextkey"] == ContextKey
                    &&
                    Page.Request.QueryString["controlID"] == ClientID;
        }

        void SetUploadedFilePath(string path) {
            _uploadedFilePath = path;
        }

        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);

            // Register an empty OnSubmit statement so the ASP.NET WebForm_OnSubmit method will be automatically
            // created and our behavior will be able to disable input file controls prior to submission
            ScriptManager.RegisterOnSubmitStatement(this, typeof(AjaxFileUpload), "AjaxFileUploadOnSubmit", "null;");
        }

        /// <summary>
        /// Saves the uploaded file with the specified file name
        /// </summary>
        /// <param name="fileName" type="String">Name of the file to save</param>
        public void SaveAs(string fileName) {
            var dir = Path.GetDirectoryName(_uploadedFilePath);

            // Override existing file if any
            if(File.Exists(fileName))
                File.Delete(fileName);

            File.Copy(_uploadedFilePath, fileName);
            File.Delete(_uploadedFilePath);

            // Delete temporary data
            Directory.Delete(dir);
        }

        public static void CleanAllTemporaryData() {
            var dirInfo = new DirectoryInfo(BuildRootTempFolder());
            foreach(var dir in dirInfo.GetDirectories()) {
                dir.Delete(true);
            }
        }

        public static string BuildTempFolder(string fileId) {
            return Path.Combine(BuildRootTempFolder(), fileId);
        }

        public static string BuildRootTempFolder() {
            var userPath = ToolkitConfig.TempFolder;

            if(!String.IsNullOrWhiteSpace(userPath)) {
                var physicalPath = GetPhysicalPath(userPath);

                if(!Directory.Exists(physicalPath))
                    throw new IOException(String.Format("Temp directory '{0}' does not exist.", physicalPath));

                return physicalPath;
            }

            var defaultPath = Path.Combine(Path.GetTempPath(), DefaultTempSubDir);

            if(!Directory.Exists(defaultPath))
                Directory.CreateDirectory(defaultPath);

            return defaultPath;
        }

        static string GetPhysicalPath(string path) {
            if(path.StartsWith("~"))
                return HttpContext.Current.Server.MapPath(path);

            return path;
        }

        internal void CreateChilds() {
            Controls.Clear();
            CreateChildControls();
        }

        protected override void CreateChildControls() {
            GenerateHtmlInputControls();
        }

        // Return the client id of parent div that contains all other html controls.
        protected string GenerateHtmlInputControls() {
            HtmlGenericControl parent = new HtmlGenericControl("div");
            parent.Attributes.Add("class", "ajax__fileupload");
            Controls.Add(parent);

            var inputFileStyle =
                "opacity:0; -moz-opacity: 0.0; filter: alpha(opacity=0);";

            HtmlInputFile inputFile = new HtmlInputFile();
            if(!Enabled)
                inputFile.Disabled = true;
            inputFile.Attributes.Add("id", ClientID + "_Html5InputFile");
            inputFile.Attributes.Add("multiple", "multiple");
            inputFile.Attributes.Add("style", inputFileStyle);
            HideElement(inputFile);

            HtmlInputFile inputFileElement = new HtmlInputFile();
            if(!Enabled)
                inputFileElement.Disabled = true;
            inputFileElement.Attributes.Add("id", ClientID + "_InputFileElement");
            inputFileElement.Attributes.Add("name", "act-file-data");
            inputFileElement.Attributes.Add("style", inputFileStyle);
            HideElement(inputFileElement);

            HtmlGenericControl dropZone = new HtmlGenericControl("div");
            dropZone.Attributes.Add("class", "ajax__fileupload_dropzone");
            dropZone.Attributes.Add("id", ClientID + "_Html5DropZone");
            // IE 10 requested dropzone to be have actual size
            dropZone.Attributes.Add("style", "width:100%; height:60px;");
            HideElement(dropZone);
            parent.Controls.Add(dropZone);

            HtmlGenericControl fileStatusContainer = new HtmlGenericControl("div");
            fileStatusContainer.Attributes.Add("id", ClientID + "_FileStatusContainer");
            fileStatusContainer.Style[HtmlTextWriterStyle.Position] = "absolute";
            fileStatusContainer.Style["right"] = "0";
            fileStatusContainer.Style["top"] = "2px";
            fileStatusContainer.Style["height"] = "20px";
            fileStatusContainer.Style["line-height"] = "20px";
            HideElement(fileStatusContainer);

            var selectFileContainer = GenerateHtmlSelectFileContainer(inputFileElement, inputFile);
            parent.Controls.Add(selectFileContainer);
            parent.Controls.Add(GenerateHtmlTopFileStatus(fileStatusContainer));

            var queueContainer = new HtmlGenericControl("div");
            queueContainer.Attributes.Add("id", ClientID + "_QueueContainer");
            queueContainer.Attributes.Add("class", "ajax__fileupload_queueContainer");
            queueContainer.Style[HtmlTextWriterStyle.MarginTop] = "28px";
            parent.Controls.Add(queueContainer);
            HideElement(queueContainer);

            var progressBar = new HtmlGenericControl("div");
            progressBar.Attributes.Add("id", ClientID + "_ProgressBar");
            progressBar.Attributes.Add("class", "ajax__fileupload_progressBar");
            progressBar.Attributes.Add("style", "width: 100%; display: none; visibility: hidden; overflow:visible;white-space:nowrap; height:20px;");

            var uploadButton = GenerateHtmlFooterContainer(progressBar);
            parent.Controls.Add(uploadButton);
            return parent.ClientID;
        }

        HtmlGenericControl GenerateHtmlFooterContainer(Control progressBar) {
            var footerContainer = new HtmlGenericControl("div");
            footerContainer.Attributes.Add("class", "ajax__fileupload_footer");
            footerContainer.Attributes.Add("id", ClientID + "_Footer");
            footerContainer.Attributes["align"] = "right";

            var uploadOrCancelButton = new HtmlGenericControl("div");
            uploadOrCancelButton.Attributes.Add("id", ClientID + "_UploadOrCancelButton");
            uploadOrCancelButton.Attributes.Add("class", "ajax__fileupload_uploadbutton");

            var progressBarContainer = new HtmlGenericControl("div");
            progressBarContainer.Attributes.Add("id", ClientID + "_ProgressBarContainer");
            progressBarContainer.Attributes["align"] = "left";
            progressBarContainer.Style["float"] = "left";
            progressBarContainer.Style["width"] = "100%";
            progressBarContainer.Controls.Add(progressBar);
            HideElement(progressBarContainer);

            var progressBarHolder = new HtmlGenericControl("div");
            progressBarHolder.Attributes.Add("class", "ajax__fileupload_ProgressBarHolder");
            progressBarHolder.Controls.Add(progressBarContainer);

            footerContainer.Controls.Add(progressBarHolder);
            footerContainer.Controls.Add(uploadOrCancelButton);

            return footerContainer;
        }

        HtmlGenericControl GenerateHtmlSelectFileContainer(Control html5InputFileElement, Control inputFileElement) {
            // build select file Container that stays on top
            var htmlSelectFileContainer = new HtmlGenericControl("span");
            htmlSelectFileContainer.Attributes.Add("id", ClientID + "_SelectFileContainer");
            htmlSelectFileContainer.Attributes.Add("class", "ajax__fileupload_selectFileContainer");
            htmlSelectFileContainer.Style["float"] = "left";

            // build select file button
            var htmlSelectFileButton = new HtmlGenericControl("span");
            htmlSelectFileButton.Attributes.Add("id", ClientID + "_SelectFileButton");
            htmlSelectFileButton.Attributes.Add("class", "ajax__fileupload_selectFileButton");

            htmlSelectFileContainer.Controls.Add(htmlSelectFileButton);
            htmlSelectFileContainer.Controls.Add(inputFileElement);
            htmlSelectFileContainer.Controls.Add(html5InputFileElement);

            return htmlSelectFileContainer;
        }

        HtmlGenericControl GenerateHtmlTopFileStatus(Control fileStatusContainer) {
            var htmlTopFileStatus = new HtmlGenericControl("div");
            htmlTopFileStatus.Attributes.Add("class", "ajax__fileupload_topFileStatus");
            htmlTopFileStatus.Style[HtmlTextWriterStyle.Position] = "relative";
            htmlTopFileStatus.Controls.Add(fileStatusContainer);

            return htmlTopFileStatus;
        }

        void HideElement(HtmlControl element) {
            element.Style["display"] = "none";
            element.Style["visibility"] = "hidden";
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            if(IsDesignMode)
                return;

            descriptor.AddProperty("contextKey", ContextKey);
            descriptor.AddProperty("postBackUrl", Page.Request.RawUrl);
            descriptor.AddProperty("serverPollingSupport", ServerPollingSupport);

            if(ThrobberID != String.Empty) {
                Control control = FindControl(ThrobberID);
                if(control != null)
                    descriptor.AddElementProperty("throbber", control.ClientID);
            }
        }


        class UploadRequestProcessor {
            public HttpContext Context;

            public EventHandler<AjaxFileUploadStartEventArgs> UploadStart;
            public EventHandler<AjaxFileUploadEventArgs> UploadComplete;
            public EventHandler<AjaxFileUploadCompleteAllEventArgs> UploadCompleteAll;
            public Action<string> SetUploadedFilePath;

            HttpRequest Request {
                get { return Context.Request; } 
            }

            HttpResponse Response {
                get { return Context.Response; }
            }

            public void ProcessRequest() {
                string fileId;
                var xhrType = ParseRequest(out fileId);

                if(xhrType != XhrType.None) {
                    Response.ClearContent();
                    Response.Cache.SetCacheability(HttpCacheability.NoCache);

                    // Process xhr request
                    switch(xhrType) {
                        case XhrType.Poll:
                            // Upload progress polling request
                            XhrPoll(fileId);
                            break;

                        case XhrType.Cancel:
                            // Cancel upload request
                            XhrCancel(fileId);
                            break;

                        case XhrType.Done:
                            // A file is successfully uploaded
                            XhrDone(fileId);
                            break;

                        case XhrType.Complete:
                            // All files successfully uploaded
                            XhrComplete();
                            break;

                        case XhrType.Start:
                            XhrStart();
                            break;
                    }

                    Response.End();
                }
            }

            XhrType ParseRequest(out string fileId) {
                fileId = Request.QueryString["guid"];
              
                if(!string.IsNullOrEmpty(fileId)) {
                    if(Request.QueryString["poll"] == "1")
                        return XhrType.Poll;

                    if(Request.QueryString["cancel"] == "1")
                        return XhrType.Cancel;

                    if(Request.QueryString["done"] == "1")
                        return XhrType.Done;
                }

                if(Request.QueryString["complete"] == "1")
                    return XhrType.Complete;

                if(Request.QueryString["start"] == "1")
                    return XhrType.Start;

                return XhrType.None;
            }

            void XhrStart() {
                var filesInQueue = int.Parse(Request.QueryString["queue"] ?? "0");
                var args = new AjaxFileUploadStartEventArgs(filesInQueue);
                if(UploadStart != null)
                    UploadStart(this, args);
                Response.Write(new JavaScriptSerializer().Serialize(args));
            }

            void XhrComplete() {
                var filesInQueue = int.Parse(Request.QueryString["queue"] ?? "0");
                var filesUploaded = int.Parse(Request.QueryString["uploaded"] ?? "0");
                var reason = Request.QueryString["reason"];

                AjaxFileUploadCompleteAllReason completeReason;
                switch(reason) {
                    case "done":
                        completeReason = AjaxFileUploadCompleteAllReason.Success;
                        break;

                    case "cancel":
                        completeReason = AjaxFileUploadCompleteAllReason.Canceled;
                        break;

                    default:
                        completeReason = AjaxFileUploadCompleteAllReason.Unknown;
                        break;
                }

                var args = new AjaxFileUploadCompleteAllEventArgs(filesInQueue, filesUploaded, completeReason);
                if(UploadCompleteAll != null)
                    UploadCompleteAll(this, args);
                Response.Write(new JavaScriptSerializer().Serialize(args));
            }

            void XhrDone(string fileId) {
                AjaxFileUploadEventArgs args;

                var tempFolder = BuildTempFolder(fileId);
                if(!Directory.Exists(tempFolder))
                    return;

                var files = Directory.GetFiles(tempFolder);
                if(files.Length == 0)
                    return;

                var fileInfo = new FileInfo(files[0]);
                SetUploadedFilePath(fileInfo.FullName);

                args = new AjaxFileUploadEventArgs(
                    fileId, AjaxFileUploadState.Success, "Success", fileInfo.Name, (int)fileInfo.Length,
                    fileInfo.Extension);

                if(UploadComplete != null)
                    UploadComplete(this, args);

                Response.Write(new JavaScriptSerializer().Serialize(args));
            }

            void XhrCancel(string fileId) {
                AjaxFileUploadHelper.Abort(Context, fileId);
            }

            void XhrPoll(string fileId) {
                Response.Write((new AjaxFileUploadStates(Context, fileId)).Percent.ToString());
            }
        
        }


    }

}
#pragma warning restore 1591