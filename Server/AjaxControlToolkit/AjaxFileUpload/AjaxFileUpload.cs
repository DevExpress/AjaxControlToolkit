﻿using System;
using System.Collections;
using System.ComponentModel.Design.Serialization;
using System.Data;
using System.Configuration;
using System.Reflection;
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

[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.Control.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.Control.debug.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.EventArgs.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.EventArgs.debug.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.Item.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.Item.debug.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.Utils.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.Utils.debug.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.Processor.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.Processor.debug.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.ProcessorHtml5.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AjaxFileUpload.AjaxFileUpload.ProcessorHtml5.debug.js", "application/x-javascript")]
[assembly: WebResource("AjaxFileUpload.AjaxFileUpload.css", "text/css", PerformSubstitution = true)]

#endregion

namespace AjaxControlToolkit
{

    public delegate void EventAjaxFileUploadOnComplete(object sender, HttpPostedFile file);


    /// <summary>
    /// AjaxFileUpload enables you to upload multiple files to a server. Url of uploaded file can be passed
    /// back to client to use e.g. to display preview of image.
    /// </summary>
    [Designer("AjaxControlToolkit.AjaxFileUploadDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientCssResource("AjaxFileUpload.AjaxFileUpload.css")]
    [ClientScriptResource("Sys.Extended.UI.AjaxFileUpload.Control", "AjaxFileUpload.AjaxFileUpload.Utils.js", true)]
    [ClientScriptResource("Sys.Extended.UI.AjaxFileUpload.Control", "AjaxFileUpload.AjaxFileUpload.Item.js", true)]
    [ClientScriptResource("Sys.Extended.UI.AjaxFileUpload.Control", "AjaxFileUpload.AjaxFileUpload.Processor.js", true)]
    [ClientScriptResource("Sys.Extended.UI.AjaxFileUpload.Control", "AjaxFileUpload.AjaxFileUpload.ProcessorHtml5.js", true)]
    [ClientScriptResource("Sys.Extended.UI.AjaxFileUpload.Control", "AjaxFileUpload.AjaxFileUpload.Control.js", true)]
    [ClientScriptResource("Sys.Extended.UI.AjaxFileUpload.Control", "AjaxFileUpload.AjaxFileUpload.EventArgs.js", true)]
    public class AjaxFileUpload : ScriptControlBase
    {
        internal const string ContextKey = "{DA8BEDC8-B952-4d5d-8CC2-59FE922E2923}";
        private const string TempDirectory = "~/App_Data";
        private HttpPostedFile _postedFile;

        private string _uploadedFilePath = null;


        #region [ Constructors ]

        /// <summary>
        /// Initializes a new AjaxFileUpload.
        /// </summary>
        public AjaxFileUpload()
            : base(true, HtmlTextWriterTag.Div)
        {
        }

        #endregion

        #region [Private Properties]
        /// <summary>
        /// Gets whether control is in design mode or not.
        /// </summary>
        private bool IsDesignMode
        {
            get
            {
                return (HttpContext.Current == null);
            }
        }

        #endregion

        #region Public Properties

        /// <summary>
        /// Any value/Id that can be used when storing file. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(null)]
        [ClientPropertyName("contextKeys")]
        public string ContextKeys
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the ID of a control that is displayed while the file is being uploaded.
        /// </summary>
        [Category("Behavior")]
        [Description("ID of Throbber")]
        [DefaultValue("")]
        public string ThrobberID
        {
            get
            {
                return (string)(ViewState["ThrobberID"] ?? string.Empty);
            }
            set
            {
                ViewState["ThrobberID"] = value;
            }
        }

        /// <summary>
        /// This will be true when postback will happen from the control.
        /// This can be used to avoid execution of unnecessary code during partial postback.
        /// </summary>
        [Browsable(false)]
        [DefaultValue(false)]
        public bool IsInFileUploadPostBack
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the number of maximum file allowed in the queue to upload.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(10)]
        [ClientPropertyName("maximumNumberOfFiles")]
        public int MaximumNumberOfFiles
        {
            get;
            set;
        }

        /// <summary>
        /// Allowed file types to upload (comma separated)
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("allowedFileTypes")]
        public string AllowedFileTypes
        {
            get;
            set;
        }

        #endregion

        #region Members

        /// <summary>
        /// Init event of control.
        /// </summary>
        /// <param name="e">Event arguments.</param>
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            if (!IsDesignMode)
            {
                if (!string.IsNullOrEmpty(this.Page.Request.QueryString["contextkey"]) && this.Page.Request.QueryString["contextkey"] == ContextKey)
                {
                    this.IsInFileUploadPostBack = true;
                }
            }
        }

        /// <summary>
        /// On load Event 
        /// </summary>
        /// <param name="e">event arguments</param>
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            // Register an empty OnSubmit statement so the ASP.NET WebForm_OnSubmit method will be automatically
            // created and our behavior will be able to disable input file controls prior to submission
            ScriptManager.RegisterOnSubmitStatement(this, typeof(AjaxFileUpload), "AjaxFileUploadOnSubmit", "null;");
        }

        /// <summary>
        /// OnPreRender renders the output of result to client side.
        /// </summary>
        /// <param name="e">Event arguments.</param>
        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            var fileId = this.Page.Request.QueryString["guid"];
            if (this.Page.Request.QueryString["contextkey"] == ContextKey)
            {
                Page.Response.ClearContent();

                if (this.Page.Request.QueryString["cancel"] == "1" && !string.IsNullOrEmpty(fileId))
                {
                    AjaxFileUploadHelper.Abort(fileId);
                }
                else if (this.Page.Request.QueryString["done"] == "1" && !string.IsNullOrEmpty(fileId))
                {

                    if (UploadComplete != null)
                    {
                        var tempFolder = Page.Server.MapPath(Path.Combine(TempDirectory, fileId));
                        var fileName = Directory.GetFiles(tempFolder)[0];
                        var fileInfo = new FileInfo(fileName);

                        _uploadedFilePath = fileName;

                        var args = new AjaxFileUploadEventArgs(
                            fileId, AjaxFileUploadState.Success, "Success", fileInfo.Name, (int)fileInfo.Length,
                            fileInfo.Extension, null);

                        UploadComplete(this, args);

                        Page.Response.Write(new JavaScriptSerializer().Serialize(args));
                    }
                }

                Page.Response.End();
            }
        }

        /// <summary>
        /// Saves the uploaded file with the specified file name.
        /// </summary>
        /// <param name="fileName">file name with/without full path at server.</param>
        public void SaveAs(string fileName)
        {
            //_postedFile.SaveAs(fileName);
            var dir = Path.GetDirectoryName(_uploadedFilePath);
            File.Move(_uploadedFilePath, fileName);
            Directory.Delete(dir);
        }

        #endregion

        #region Controls

        /// <summary>
        /// CreateChilds call to create child controls for ajaxfileupload.
        /// </summary>
        internal void CreateChilds()
        {
            this.Controls.Clear();
            this.CreateChildControls();
        }

        /// <summary>
        /// CreateChildControls creates html controls for a ajaxFileUpload control.
        /// </summary>
        protected override void CreateChildControls()
        {
            GenerateHtmlInputControls();
        }


        /// <summary>
        /// GenerateHtmlInputControls creates drop zone and input file control for AjaxFileUpload control.
        /// </summary>
        /// <returns>Return the client id of parent div that contains all other html controls.</returns>
        protected string GenerateHtmlInputControls()
        {
            HtmlGenericControl parent = new HtmlGenericControl("div");
            parent.Attributes.Add("class", "ajax__fileupload");
            Controls.Add(parent);

            var inputFileStyle =
                "opacity:0; -moz-opacity: 0.0; filter: alpha(opacity=0);";

            HtmlInputFile inputFile = new HtmlInputFile();
            if (!this.Enabled)
                inputFile.Disabled = true;
            inputFile.Attributes.Add("id", this.ClientID + "_Html5InputFile");
            inputFile.Attributes.Add("multiple", "multiple");
            inputFile.Attributes.Add("style", inputFileStyle);
            HideElement(inputFile);

            HtmlInputFile inputFileElement = new HtmlInputFile();
            if (!this.Enabled)
                inputFileElement.Disabled = true;
            inputFileElement.Attributes.Add("id", this.ClientID + "_InputFileElement");
            inputFileElement.Attributes.Add("name", "act-file-data");
            inputFileElement.Attributes.Add("style", inputFileStyle);
            HideElement(inputFileElement);

            HtmlGenericControl dropZone = new HtmlGenericControl("div");
            dropZone.Attributes.Add("class", "ajax__fileupload_dropzone");
            dropZone.Attributes.Add("id", this.ClientID + "_Html5DropZone");
            // IE 10 requested dropzone to be have actual size
            dropZone.Attributes.Add("style", "width:100%; height:60px;");
            HideElement(dropZone);
            parent.Controls.Add(dropZone);

            HtmlGenericControl fileStatusContainer = new HtmlGenericControl("div");
            fileStatusContainer.Attributes.Add("id", this.ClientID + "_FileStatusContainer");
            HideElement(fileStatusContainer);

            var selectFileContainer = GenerateHtmlSelectFileContainer(inputFileElement, inputFile, fileStatusContainer);
            parent.Controls.Add(selectFileContainer);

            HtmlGenericControl queueContainer = new HtmlGenericControl("div");
            queueContainer.Attributes.Add("id", this.ClientID + "_QueueContainer");
            queueContainer.Attributes.Add("class", "ajax__fileupload_queueContainer");
            parent.Controls.Add(queueContainer);
            HideElement(queueContainer);

            HtmlGenericControl progressBar = new HtmlGenericControl("div");
            progressBar.Attributes.Add("id", this.ClientID + "_ProgressBar");
            progressBar.Attributes.Add("class", "ajax__fileupload_progressBar");
            progressBar.Attributes.Add("style", "width: 100%; display: none; visibility: hidden; overflow:visible;white-space:nowrap; height:20px;");

            var uploadButton = GenerateHtmlFooterContainer(progressBar);
            parent.Controls.Add(uploadButton);
            return parent.ClientID;
        }

        /// <summary>
        /// This creates footer part that contains Upload/cancel button.
        /// </summary>
        /// <param name="progressBar"></param>
        /// <returns></returns>
        private HtmlGenericControl GenerateHtmlFooterContainer(Control progressBar)
        {
            HtmlGenericControl footerContainer = new HtmlGenericControl("div");
            footerContainer.Attributes.Add("class", "ajax__fileupload_footer");
            footerContainer.Attributes.Add("id", this.ClientID + "_Footer");
            footerContainer.Attributes["align"] = "right";

            HtmlGenericControl uploadOrCancelButton = new HtmlGenericControl("div");
            uploadOrCancelButton.Attributes.Add("id", this.ClientID + "_UploadOrCancelButton");
            uploadOrCancelButton.Attributes.Add("class", "ajax__fileupload_uploadbutton");

            HtmlGenericControl progressBarContainer = new HtmlGenericControl("div");
            progressBarContainer.Attributes.Add("id", this.ClientID + "_ProgressBarContainer");
            progressBarContainer.Attributes["align"] = "left";
            progressBarContainer.Style["float"] = "left";
            progressBarContainer.Style["width"] = "100%";
            progressBarContainer.Controls.Add(progressBar);
            HideElement(progressBarContainer);

            HtmlGenericControl progressBarHolder = new HtmlGenericControl("div");
            progressBarHolder.Attributes.Add("class", "ajax__fileupload_ProgressBarHolder");
            progressBarHolder.Controls.Add(progressBarContainer);

            footerContainer.Controls.Add(progressBarHolder);
            footerContainer.Controls.Add(uploadOrCancelButton);

            return footerContainer;
        }

        /// <summary>
        /// This Creates Select File container that contains Input file controls and Select file button. 
        /// </summary>
        /// <param name="html5InputFileElement">Input File Element that will be used to Upload files for modern browsers.</param>
        /// <param name="inputFileElement">Input File Element that will be used to Upload files for older browsers.</param>
        /// <param name="fileStatusContainer">File Status Container that keeps information of uploading file.</param>
        /// <returns></returns>
        private HtmlGenericControl GenerateHtmlSelectFileContainer(Control html5InputFileElement, Control inputFileElement, Control fileStatusContainer)
        {
            // build select file Container that stays on top
            var htmlSelectFileContainer = new HtmlGenericControl("span");
            htmlSelectFileContainer.Attributes.Add("id", this.ClientID + "_SelectFileContainer");
            htmlSelectFileContainer.Attributes.Add("class", "ajax__fileupload_selectFileContainer");

            // build select file button
            var htmlSelectFileButton = new HtmlGenericControl("span");
            htmlSelectFileButton.Attributes.Add("id", this.ClientID + "_SelectFileButton");
            htmlSelectFileButton.Attributes.Add("class", "ajax__fileupload_selectFileButton");
            //htmlSelectFileButton.Style["float"] = "left";

            var htmlTopFileStatus = new HtmlGenericControl("div");
            htmlTopFileStatus.Attributes.Add("class", "ajax__fileupload_topFileStatus");
            htmlTopFileStatus.Style[HtmlTextWriterStyle.Overflow] = "hidden";
            //htmlTopFileStatus.Style["float"] = "left";
            htmlTopFileStatus.Controls.Add(fileStatusContainer);

            htmlSelectFileContainer.Controls.Add(htmlSelectFileButton);
            htmlSelectFileContainer.Controls.Add(inputFileElement);
            htmlSelectFileContainer.Controls.Add(html5InputFileElement);
            htmlSelectFileContainer.Controls.Add(htmlTopFileStatus);


            return htmlSelectFileContainer;
        }

        private void HideElement(HtmlControl element)
        {
            element.Style["display"] = "none";
            element.Style["visibility"] = "hidden";
        }

        /// <summary>
        /// DescribeComponent creates propreties in ScriptComponentDescriptor for child controls in ajaxFileUpload
        /// </summary>
        /// <param name="descriptor">Descriptor object which will accpet server components to convert in client script.</param>
        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            if (!IsDesignMode)
            {
                descriptor.AddProperty("contextKey", ContextKey);
                descriptor.AddProperty("postBackUrl", this.Page.Request.RawUrl);

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

        #endregion

        #region Client Events

        /// <summary>
        /// Event handler for upload complete event.
        /// </summary>
        public event EventHandler<AjaxFileUploadEventArgs> UploadComplete;

        /// <summary>
        /// Gets or sets the client script that executes when a file upload completes.
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadComplete")]
        public string OnClientUploadComplete
        {
            get
            {
                return (string)(ViewState["OnClientUploadComplete"] ?? string.Empty);
            }
            set
            {
                ViewState["OnClientUploadComplete"] = value;
            }
        }

        /// <summary>
        /// Gets or sets the client script that executes when a file upload error.
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("uploadError")]
        public string OnClientUploadError
        {
            get
            {
                return (string)(ViewState["OnClientUploadError"] ?? string.Empty);
            }
            set
            {
                ViewState["OnClientUploadError"] = value;
            }
        }


        #endregion

    }
}
