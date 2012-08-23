<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="AjaxFileUpload.aspx.cs" Inherits="AjaxFileUpload_AjaxFileUpload" Title="AjaxFileUpload Sample"
    Culture="auto" UICulture="auto" 
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <style>
        .ajax__fileupload_button
        {
            background-color: green;
        }
    </style>
    <script type="text/javascript">


        function onClientUploadComplete(sender, e) {
            var id = e.get_fileId();
            onImageValidated("TRUE", e);
        }

        function onImageValidated(arg, context) {

            var test = document.getElementById("testuploaded");
            test.style.display = 'block';

            var fileList = document.getElementById("fileList");
            var item = document.createElement('div');
            item.style.padding = '4px';

            if (arg == "TRUE") {
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
    
    </script>
    <div class="demoarea">
        <div class="demoheading">
            AjaxFileUpload Demonstration</div>
        Click <i>Select File</i> to select an image file to upload. You can upload a maximum
        of 10 jpeg files (files with the .jpg or .jpeg extension)
        <br />
        <asp:Label runat="server" ID="myThrobber" Style="display: none;"><img align="absmiddle" alt="" src="uploading.gif"/></asp:Label>
        <ajaxToolkit:AjaxFileUpload ID="AjaxFileUpload1" runat="server" Padding-Bottom="4"
            Padding-Left="2" Padding-Right="1" Padding-Top="4" ThrobberID="myThrobber" OnClientUploadComplete="onClientUploadComplete"
            OnUploadComplete="AjaxFileUpload1_OnUploadComplete" MaximumNumberOfFiles="10"
            AllowedFileTypes="jpg,jpeg" />
        <br />
        <div id="testuploaded" style="display: none; padding: 4px; border: gray 1px solid;">
            <h4>
                list of uploaded files:</h4>
            <hr />
            <div id="fileList">
            </div>
        </div>
        <asp:Button ID="btnSubmit" runat="server" Text="Submit" />
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            AjaxFileUpload Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            AjaxFileUpload is an ASP.NET Ajax control which enables you to upload multiple files
            to the server asynchronously. When the control is used with a browser which supports
            the latest features of HTML5 -- such as Microsoft Internet Explorer 10, Mozilla
            Firefox 9, or Google Chrome 17 -- then the AjaxFileUpload supports displaying file
            upload progress. The control displays a progress bar as the file is being uploaded.
        </p>   
            <br />
        <p>
            If a browser does not support the HTML5 File API (for example, Internet Explorer
            9) then upload progress is not displayed and a throbber image is displayed instead.
            In other words, a busy wait image is displayed instead of actual progress.
        </p>
            <br />
        <p>
            The AjaxFileUpload control also supports a drag-and-drop interface. You can add
            multiple files to the AjaxFileUpload upload queue by dragging the files onto the
            AjaxFileUpload control on a page. Alternatively, you can select multiple files to
            upload by using the SHIFT key or CTRL key when selecting files with the file upload
            dialog. These features are not supported by older browsers.
        </p>
            <br />
        <p>
            By taking advantage of the AllowedFileTypes property, you can restrict the types
            of files which can be uploaded with the AjaxFileUpload control. For example, you
            can prevent any file except image files (files with the extensions jpeg, png, or
            gif) from being uploaded. By taking advantage of the MaximumNumberOfFiles property,
            you can limit the number of files which can be uploaded with the control. For example,
            you can prevent a user from uploading more than 5 files.
        </p>
            <br />
        <p>
            When a file is uploaded, the control's UploadComplete event is raised. By creating
            an UploadComplete event handler, you can store the uploaded file anywhere that you
            please including the file system, a database, or session state. Before you can save
            the file to the file system, your ASP.NET application must have the necessary Write
            permissions.
        </p>
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            AjaxFileUpload Events, Properties and Methods
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The control above is initialized with this code. The <em>italic</em> properties
            are optional:</p>
        <pre>
&lt;ajaxToolkit:AjaxFileUpload ID="AjaxFileUpload1"
    <em>ThrobberID=&quot;myThrobber&quot;</em>
    <em>ContextKeys=&quot;fred&quot;</em>
    <em>AllowedFileTypes=&quot;jpg,jpeg&quot;</em>
    <em>MaximumNumberOfFiles=10</em>
    runat="server"/&gt;                    
    </pre>
        <b>Events</b>
        <ul>
            <li><strong>UploadedComplete</strong> - Raised on the server when a file is uploaded
                successfully. In this event an instance of AjaxFileUploadEventArgs is passed in the 
                argument that contains file name, size and content type.</li>
        </ul>
        <br />
        <b>Properties</b>
        <ul>
            <li><strong>ThrobberID</strong> - The ID of a control that is shown while the file is
                uploading. The throbber image is displayed for browsers that do not support the
                HTML5 File API.</li>
            <li><strong>ContextKeys</strong> - A dictionary that can be used to pass information
                to the server when a file is uploaded.</li>
            <li><strong>MaximumNumberOfFiles</strong> - This property enables you to limit the number
                of files that a user can add to the upload queue.</li>
            <li><strong>AllowedFileTypes</strong> - This property enables you to restrict the types
                of files that can be uploaded. You can assign a comma delimited list of file extensions
                to this property.</li>
            <li><strong>IsInFileUploadPostBack</strong> - This property has the value true when a page is 
                created in response to an AjaxFileUpload asynchronous postback.</li>
            <li><strong>OnClientUploadComplete</strong> - The name of a JavaScript function executed in 
                the client-side after a file is uploaded successfully.</li>
            <li><strong>OnClientUploadError</strong> - The name of a JavaScript function executed in the 
                client-side if the file upload failed.</li>
        </ul>
        <br />
        <b>Methods</b>
        <ul>
            <li><strong>SaveAs(<span style="color: #2b91af">string</span> filename)</strong> - Saves the contents of an 
            uploaded file to the file system. Your application must have the required Write permissions.</li>
        </ul>
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />
</asp:Content>
