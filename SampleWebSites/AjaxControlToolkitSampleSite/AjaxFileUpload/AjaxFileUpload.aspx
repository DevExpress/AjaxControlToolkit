<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="AjaxFileUpload.aspx.cs" Inherits="AjaxFileUpload_AjaxFileUpload" Title="AjaxFileUpload Sample"
    Culture="auto" UICulture="auto" 
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1"/>
    <style>
        .ajax__fileupload_button
        {
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
            
            document.getElementById('uploadCompleteInfo').innerHTML=info;
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
            AllowedFileTypes="jpg,jpeg" AzureContainerName="" OnClientUploadCompleteAll="onClientUploadCompleteAll" OnUploadCompleteAll="AjaxFileUpload1_UploadCompleteAll" OnUploadStart="AjaxFileUpload1_UploadStart" OnClientUploadStart="onClientUploadStart" />
        
        <div id="uploadCompleteInfo"></div>
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

    <div class="demobottom"></div>

    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            AjaxFileUpload Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            AjaxFileUpload is an ASP.NET Ajax control which supports:
        </p>
        <br />    
            <ul>
                <li>
                    <p>
                    Displaying File Upload Progress
                    </p>
                </li>
                <li>
                    <p>
                    Uploading Very Large Files (greater than 1 Gigabyte)
                    </p>
                </li>
                <li>
                    Client-Side File Chunking 
                </li>
                <li>
                    <p>                    
                    Uploading Multiple Files at a Time
                    </p>
                </li>
                <li>
                    <p>
                    Drag-and-Drop File Upload
                    </p>
                </li>
            </ul> 
            <br />            
            <p>
            The AjaxFileUpload control uses one of two methods of showing file upload progress. If you are using a browser which
                fully supports the HTML5 File API (such as Google Chrome or Mozilla Firefox) then upload progress is displayed
                using client-side events.  If, on the other hand, you are using a browser which does not fully support the HTML5 standard (such as Microsoft
                Internet Explorer or Apple Safari) then file upload progress is displayed by polling the server.
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
        <br/>
        
    </asp:Panel>
    
    <asp:Panel ID="TemporaryData_HeaderPanel" runat="server" Style="cursor: pointer;">
            <div class="heading">
            <asp:ImageButton ID="TemporaryData_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            AjaxFileUpload Temporary Data
        </div>
        </asp:Panel>
    <asp:Panel ID="TemporaryData_ContentPanel" runat="server" Style="overflow: hidden;" Height="0px">
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
        <br/>        
        </asp:Panel>

    <asp:Panel ID="Handler_HeaderPanel" runat="server" Style="cursor: pointer;">
            <div class="heading">
            <asp:ImageButton ID="Handler_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            AjaxFileUpload Handler
        </div>
        </asp:Panel>
    <asp:Panel ID="Handler_ContentPanel" runat="server" Style="overflow: hidden;" Height="0px">
        <p>
            The AjaxFileUpload control uses an HTTP Handler named <b>AjaxFileUploadHandler.axd</b>
             
            This handler has the type <b>AjaxControlToolkit.AjaxFileUploadHandler</b>.
            You must add this handler to your Web.Config file in order for the AjaxFileUpload control to work. 
            
        </p>
        <br/>

        <b>Here's the Web.Config configuration that you must add:</b><br/>

<pre>&lt;system.web&gt;
&nbsp;&nbsp;&nbsp;&nbsp;....
&nbsp;&nbsp;&nbsp;&nbsp;&lt;httpHandlers&gt;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&ltadd verb="*" path="AjaxFileUploadHandler.axd"
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type="AjaxControlToolkit.AjaxFileUploadHandler, 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AjaxControlToolkit"/&gt
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/httpHandlers&gt;
&lt;/system.web&gt;</pre>

        <b>For IIS7:</b><br/>

<pre>&lt;system.webServer&gt;
&nbsp;&nbsp;&nbsp;&nbsp;....
&nbsp;&nbsp;&nbsp;&nbsp;&lt;validation validateIntegratedModeConfiguration="false" /&gt;
&nbsp;&nbsp;&nbsp;&nbsp;&lt;handlers&gt;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;add name="AjaxFileUploadHandler" verb="*" 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;path="AjaxFileUploadHandler.axd"
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type="AjaxControlToolkit.AjaxFileUploadHandler, 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AjaxControlToolkit"/&gt;
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/handlers&gt;
&lt;/system.webServer&gt;</pre>
        </asp:Panel>
    
    <asp:Panel ID="StoreToAzure_HeaderPanel" runat="server" Style="cursor: pointer;">
            <div class="heading">
            <asp:ImageButton ID="StoreToAzure_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
                Store To Azure
        </div>
        </asp:Panel>
    <asp:Panel ID="StoreToAzure_ContentPanel" runat="server" Style="overflow: hidden;" Height="0px">
        <p>
            If you have a Windows Azure account, you may want to upload files directly to your Windows Azure storage. To do that, you need to follow these simple steps:</p>

        <p>
            <ol>
                <li>
                    Set your Windows Azure connection string by adding a setting to web.config file under the appSettings key. This settings key must be named&nbsp; <b>AjaxFileUploadAzureConnectionString</b>. It should be like this:<br/>
                <pre>&lt;appSettings&gt;
    &lt;add key="AjaxFileUploadAzureConnectionString" 
        value="[Your Azure Connection String]"/&gt;
&lt;/appSettings&gt;</pre>
                    To use the Windows Azure emulator with your development environment you can set the Azure connection string to <b>UseDevelopmentStorage=true</b>.
                </li>
                <li>
                    Set <b>StoreToAzure</b> property to <b>True</b>.
                </li>
                <li>
                    Set <b>AzureContainerName</b> property to the appropriate container name (the name of the container where you want the uploaded files to be located on your Windows Azure storage). This property cannot be blank and must follow the rules for valid Windows Azure container names. Check out this <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dd135715.aspx">link</a> and go to the <i>Container Names</i> section to see more detail.
                </li>
            </ol>
            <p>
                This feature enables you to store uploaded files directly to Windows Azure. When uploading files directly to Windows Azure, you no longer need to create a temporary file to buffer the upload. Windows Azure has its own mechanism for buffering.</p>
            <br/>
            <p>
            </p>
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
        
<pre>&lt;ajaxToolkit:AjaxFileUpload ID="AjaxFileUpload1"
    <em>ThrobberID=&quot;myThrobber&quot;</em>
    <em>ContextKeys=&quot;fred&quot;</em>
    <em>AllowedFileTypes=&quot;jpg,jpeg&quot;</em>
    <em>MaximumNumberOfFiles=10</em>
    runat="server"/&gt;</pre>
        <b>Events</b>
        <ul>
            <li><strong>UploadedComplete</strong> - Raised on the server when a file is uploaded
                successfully. In this event an instance of AjaxFileUploadEventArgs is passed in the 
                argument that contains file name, size and content type.</li>
            <li><strong>UploadedCompleteAll</strong> - Raised on the server when all files are uploaded.
            </li>
            <li><strong>UploadedStart</strong> - Raised on the server before any files are uploaded.
            </li>

        </ul>
        <br />
        <b>Properties</b>
        <ul>
            <li><strong>Mode</strong> - Determines how upload progress is displayed. Possible
                values are Auto (the default), Client, and Server. If, for example, you want force the AjaxFileUpload
                control to display upload progress by using server-side polling then set Mode="Server".
            </li>
            <li><strong>ThrobberID</strong> - The ID of a control that is shown while the file is
                uploading. The throbber image is displayed for browsers that do not support the
                HTML5 File API or server-side polling.</li>
            <li><strong>ContextKeys</strong> - A dictionary that can be used to pass information
                to the server when a file is uploaded.</li>
            <li><strong>MaximumNumberOfFiles</strong> - This property enables you to limit the number
                of files that a user can add to the upload queue.</li>
            <li><strong>AllowedFileTypes</strong> - This property enables you to restrict the types
                of files that can be uploaded. You can assign a comma delimited list of file extensions
                to this property.</li>
            <li><strong>IsInFileUploadPostBack</strong> - This property has the value true when a page is 
                created in response to an AjaxFileUpload asynchronous postback.</li>
            <li><strong>OnClientUploadComplete</strong> - The name of a JavaScript function executed on 
                the client-side after a file is uploaded successfully.</li>
            <li><strong>OnClientUploadError</strong> - The name of a JavaScript function executed on the 
                client-side if the file upload failed.</li>

            <li><strong>OnClientUploadCompleteAll</strong> - The name of a JavaScript function executed on the 
                client-side after all files are uploaded.</li>
            <li><strong>OnClientUploadStart</strong> - The name of a JavaScript function executed on the 
                client-side before any files are uploaded.</li>


        </ul>
        <br />
        <b>Methods</b>
        <ul>
            <li><strong>SaveAs(<span style="color: #2b91af">string</span> filename)</strong> - Saves the contents of an 
            uploaded file to the file system. Your application must have the required Write permissions.</li>
            <li><strong>CleanAllTemporaryData()</strong> - Delete all temporary uploaded files from temporary folder.</li>
        </ul>
    </asp:Panel>

    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeTemporaryData" runat="Server" TargetControlID="TemporaryData_ContentPanel"
        ExpandControlID="TemporaryData_HeaderPanel" CollapseControlID="TemporaryData_HeaderPanel"
        Collapsed="True" ImageControlID="TemporaryData_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeHandler" runat="Server" TargetControlID="Handler_ContentPanel"
        ExpandControlID="Handler_HeaderPanel" CollapseControlID="Handler_HeaderPanel"
        Collapsed="True" ImageControlID="Handler_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeStoreToAzure" runat="Server" TargetControlID="StoreToAzure_ContentPanel"
        ExpandControlID="StoreToAzure_HeaderPanel" CollapseControlID="StoreToAzure_HeaderPanel"
        Collapsed="True" ImageControlID="StoreToAzure_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />
</asp:Content>
