﻿<%@ Page Title="AjaxFileUpload Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="AjaxFileUpload.aspx.cs" Inherits="AjaxFileUpload_AjaxFileUpload" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    AjaxFileUpload Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <style>
        .ajax__fileupload_button {
            background-color: green;
        }
    </style>

    <script type="text/javascript">

        function onClientUploadComplete(sender, e) {
            onImageValidated("TRUE", e);
        }

        function onImageValidated(arg, context) {

            var test = document.getElementById("testuploaded");
            test.style.display = 'block';

            var fileList = document.getElementById("fileList");
            var item = document.createElement('div');
            item.style.padding = '4px';

            if(arg == "TRUE") {
                var url = context.get_postedUrl();
                url = url.replace('&amp;', '&');
                item.appendChild(createThumbnail(context, url));
            } else {
                item.appendChild(createFileInfo(context));
            }

            fileList.appendChild(item);
        }

        function createFileInfo(e) {
            var holder = document.createElement('div');
            holder.appendChild(document.createTextNode(e.get_fileName() + ' with size ' + e.get_fileSize() + ' bytes'));

            return holder;
        }

        function createThumbnail(e, url) {
            var holder = document.createElement('div');
            var img = document.createElement("img");
            img.style.width = '80px';
            img.style.height = '80px';
            img.setAttribute("src", url);

            holder.appendChild(createFileInfo(e));
            holder.appendChild(img);

            return holder;
        }

        function onClientUploadStart(sender, e) {
            document.getElementById('uploadCompleteInfo').innerHTML = 'Please wait while uploading ' + e.get_filesInQueue() + ' files...';
        }

        function onClientUploadError(sender, e) {
            document.getElementById('uploadCompleteInfo').innerHTML = "There was an error while uploading.";
        }

        function onClientUploadCompleteAll(sender, e) {

            var args = JSON.parse(e.get_serverArguments()),
                unit = args.duration > 60 ? 'minutes' : 'seconds',
                duration = (args.duration / (args.duration > 60 ? 60 : 1)).toFixed(2);

            var info = 'At <b>' + args.time + '</b> server time <b>'
                + e.get_filesUploaded() + '</b> of <b>' + e.get_filesInQueue()
                + '</b> files were uploaded with status code <b>"' + e.get_reason()
                + '"</b> in <b>' + duration + ' ' + unit + '</b>';

            document.getElementById('uploadCompleteInfo').innerHTML = info;
        }
    </script>

    Click <i>Select File</i> to select an image file to upload. You can upload a maximum of 10 jpeg files (files with the .jpg or .jpeg extension)
    <br />
    <asp:Label runat="server" ID="myThrobber" Style="display: none;"><img align="absmiddle" alt="" src="uploading.gif"/></asp:Label>
    <ajaxToolkit:AjaxFileUpload ID="AjaxFileUpload1" runat="server" Padding-Bottom="4"
        Padding-Left="2" Padding-Right="1" Padding-Top="4" ThrobberID="myThrobber" OnClientUploadComplete="onClientUploadComplete"
        OnUploadComplete="AjaxFileUpload1_OnUploadComplete" MaximumNumberOfFiles="10"
        AllowedFileTypes="jpg,jpeg" 
        OnClientUploadCompleteAll="onClientUploadCompleteAll" 
        OnUploadCompleteAll="AjaxFileUpload1_UploadCompleteAll" 
        OnUploadStart="AjaxFileUpload1_UploadStart" 
        OnClientUploadStart="onClientUploadStart"
        OnClientUploadError="onClientUploadError"
        MaxFileSize="1024"/>

    <div id="uploadCompleteInfo"></div>
    <br />
    <div id="testuploaded" style="display: none; padding: 4px; border: gray 1px solid;">
        <h4>list of uploaded files:</h4>
        <hr />
        <div id="fileList">
        </div>
    </div>
    <asp:Button ID="btnSubmit" runat="server" Text="Submit" />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>AjaxFileUpload Description</Header>
        <Content>
            <div runat="server" data-control-type="AjaxFileUpload" data-content-type="description" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>AjaxFileUpload Temporary Data</Header>
        <Content>
            <p>
                The AjaxFileUpload control buffers the file being uploaded onto your web server's hard drive. This temporary
                folder is located at Path.GetTempPath().
            </p>
            <br />
            <p>
                When you call the SaveAs() method to save the uploaded file to a new location, the AjaxFileUpload control
                deletes the temporary file automatically. If you don't call the SaveAs() method (for example, you are saving the 
                uploaded file to a database) then you need to call the AjaxFileUploadEventArgs.DeleteTemporaryData() method 
                to delete the temporary file. 
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>AjaxFileUpload Handler</Header>
        <Content>
            <p>
                The AjaxFileUpload control uses an HTTP Handler named <b>AjaxFileUploadHandler.axd</b>

                This handler has the type <b>AjaxControlToolkit.AjaxFileUploadHandler</b>.
                You must add this handler to your Web.Config file in order for the AjaxFileUpload control to work.             
            </p>
            <br />
            <b>Here's the Web.Config configuration that you must add:</b><br />

            <pre>
&lt;system.web&gt;
&nbsp;&nbsp;&nbsp;&nbsp;....
&nbsp;&nbsp;&nbsp;&nbsp;&lt;httpHandlers&gt;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&ltadd verb="*" path="AjaxFileUploadHandler.axd"
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type="AjaxControlToolkit.AjaxFileUploadHandler, 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AjaxControlToolkit"/&gt
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/httpHandlers&gt;
&lt;/system.web&gt;
            </pre>

            <b>For IIS7:</b><br />

            <pre>
&lt;system.webServer&gt;
&nbsp;&nbsp;&nbsp;&nbsp;....
&nbsp;&nbsp;&nbsp;&nbsp;&lt;validation validateIntegratedModeConfiguration="false" /&gt;
&nbsp;&nbsp;&nbsp;&nbsp;&lt;handlers&gt;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;add name="AjaxFileUploadHandler" verb="*" 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;path="AjaxFileUploadHandler.axd"
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type="AjaxControlToolkit.AjaxFileUploadHandler, 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AjaxControlToolkit"/&gt;
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/handlers&gt;
&lt;/system.webServer&gt;
            </pre>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>AjaxFileUpload Events, Properties and Methods</Header>
        <Content>
            <div runat="server" data-control-type="AjaxFileUpload" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
