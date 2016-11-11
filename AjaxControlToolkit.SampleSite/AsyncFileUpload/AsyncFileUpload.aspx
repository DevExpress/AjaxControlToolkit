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
            <div runat="server" data-control-type="AsyncFileUpload" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>AsyncFileUpload Events, Properties and Methods</Header>
        <Content>
            <div runat="server" data-control-type="AsyncFileUpload" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>

