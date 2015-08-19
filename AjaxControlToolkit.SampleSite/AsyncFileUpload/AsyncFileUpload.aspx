<%@ Page Title="AsyncFileUpload Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="AsyncFileUpload.aspx.cs" Inherits="AsyncFileUploader_AsyncFileUpload" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    AsyncFileUpload Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <script type="text/javascript">
        function fillCell(row, cellNumber, text) {
            var cell = row.insertCell(cellNumber);
            cell.innerHTML = text;
            cell.style.borderBottom = cell.style.borderRight = "solid 1px #aaaaff";
        }
        function addToClientTable(name, text) {
            var table = document.getElementById("<%= clientSide.ClientID %>");
            var row = table.insertRow(0);
            fillCell(row, 0, name);
            fillCell(row, 1, text);
        }

        function uploadError(sender, args) {
            addToClientTable(args.get_fileName(), "<span style='color:red;'>" + args.get_errorMessage() + "</span>");
        }
        function uploadComplete(sender, args) {
            var contentType = args.get_contentType();
            var text = args.get_length() + " bytes";
            if(contentType.length > 0) {
                text += ", '" + contentType + "'";
            }
            addToClientTable(args.get_fileName(), text);
        }
    </script>

    Click '<i>Select File</i>' for asynchronous uploading.
    <br />
    <br />

    <ajaxToolkit:AsyncFileUpload
        OnClientUploadError="uploadError" OnClientUploadComplete="uploadComplete"
        runat="server" ID="AsyncFileUpload1" Width="400px" UploaderStyle="Modern"
        UploadingBackColor="#CCFFFF" ThrobberID="myThrobber" />
    &nbsp;<asp:Label runat="server" ID="myThrobber" Style="display: none;"><img alt="" src="uploading.gif" /></asp:Label>
    <div><strong>The latest Server-side event:</strong></div>
    <asp:Label runat="server" Text="&nbsp;" ID="uploadResult" />
    <br />
    <br />
    <div><strong>Client-side events:</strong></div>
    <table style="border-collapse: collapse; border-left: solid 1px #aaaaff; border-top: solid 1px #aaaaff;" runat="server" cellpadding="3" id="clientSide" />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>AsyncFileUpload Description</Header>
        <Content>
            <p>
                AsyncFileUpload is an ASP.NET AJAX Control that allows you asynchronously upload files to server.
                The file uploading results can be checked both in the server and client sides.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>AsyncFileUpload Events, Properties and Methods</Header>
        <Content>
            <p>
                The control above is initialized with this code.  The <em>italic</em> properties are optional:
            </p>
            <div style="display: block; margin: 15px 15px 15px 0; padding: 10px; border: 1px dashed #CCC; background-color: #FFF; font-family: 'Courier New', Monospace; font-size: 0.9em; font-style: normal;">
                <span style="color: blue">&lt;</span><span style="color: #a31515">ajaxToolkit</span><span style="color: blue">:</span><span style="color: #a31515">AsyncFileUpload</span>&nbsp;<span style="color: red; font-style: italic">OnClientUploadError</span><span style="color: blue">=&quot;uploadError&quot;<br />
                </span><span style="color: red; font-style: italic">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OnClientUploadComplete</span><span style="color: blue">=&quot;uploadComplete&quot;</span>&nbsp;<span style="color: red">runat</span><span style="color: blue">=&quot;server&quot;<br />
                </span><span style="color: red">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID</span><span style="color: blue">=&quot;AsyncFileUpload1&quot;</span> <span style="color: red; font-style: italic">Width</span><span style="color: blue">=&quot;400px&quot; </span><span style="color: red; font-style: italic">UploaderStyle</span><span style="color: blue">=&quot;Modern&quot;<br />
                </span><span style="color: red; font-style: italic">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UploadingBackColor</span><span style="color: blue">=&quot;#CCFFFF&quot;</span><span style="color: red; font-style: italic">&nbsp;ThrobberID</span><span style="color: blue">=&quot;myThrobber&quot;<br />
                    /&gt;</span>
            </div>
            <b>Events</b>
            <ul>
                <li><strong>UploadedComplete</strong> - Fired on the server side when the file successfully uploaded</li>
                <li><strong>UploadedFileError</strong> - Fired on the server side when the uploaded file is corrupted</li>
            </ul>
            <br />
            <b>Properties</b>
            <ul>
                <li><strong>CompleteBackColor</strong> - The control's background color on upload complete. Default value - <i>'Lime'</i>.</li>
                <li><strong>ContentType</strong> - Gets the MIME content type of a file sent by a client.</li>
                <li><strong>ErrorBackColor</strong> - The control's background color on upload error.Default value - <i>'Red'</i>.</li>
                <li><strong>FileContent</strong> - Gets a <span style="color: #2b91af">Stream</span> object that points to an uploaded file to prepare for reading the contents of the file.</li>
                <li><strong>FileName</strong> - Gets the name of a file on a client to upload using the control.</li>
                <li><strong>HasFile</strong> - Gets a <span style="color: #2b91af">bool</span> value indicating whether the control contains a file.</li>
                <li><strong>OnClientUploadComplete</strong> - The name of a javascript function executed in the client-side after the file successfully uploaded</li>
                <li><strong>OnClientUploadError</strong> - The name of a javascript function executed in the client-side if the file uploading failed</li>
                <li><strong>OnClientUploadStarted</strong> - The name of a javascript function executed in the client-side on the file uploading started</li>
                <li><strong>PostedFile</strong> - Gets a <span style="color: #2b91af">HttpPostedFile</span> object that provides access to the uploaded file.</li>
                <li><strong>ThrobberID</strong> - ID of control that is shown while the file is uploading.</li>
                <li><strong>UploaderStyle</strong> - The control's appearance style (Traditional, Modern). Default value - <i>'Traditional'</i>.</li>
                <li><strong>UploadingBackColor</strong> - The control's background color when uploading is in progress. Default value - <i>'White'</i>.</li>
                <li><strong>Width</strong> - The control's width (<span style="color: #2b91af">Unit</span>). Default value - <i>'355px'</i>.</li>
            </ul>
            <br />
            <b>Methods</b>
            <ul>
                <li><strong>SaveAs(<span style="color: #2b91af">string</span> filename)</strong> - Saves the contents of an uploaded file.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>

