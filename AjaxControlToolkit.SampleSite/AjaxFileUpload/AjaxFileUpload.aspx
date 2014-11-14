<%@ Page Title="AjaxFileUpload Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="AjaxFileUpload.aspx.cs" Inherits="AjaxFileUpload_AjaxFileUpload" %>

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
        AllowedFileTypes="jpg,jpeg" OnClientUploadCompleteAll="onClientUploadCompleteAll" OnUploadCompleteAll="AjaxFileUpload1_UploadCompleteAll" OnUploadStart="AjaxFileUpload1_UploadStart" OnClientUploadStart="onClientUploadStart" />

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

</asp:Content>

