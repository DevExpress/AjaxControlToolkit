<%@ Page Language="C#" AutoEventWireup="true" Inherits="WidthProperty" Codebehind="WidthProperty.aspx.cs" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>      
      <link href="StyleSheet.css" rel="stylesheet" type="text/css" /> 

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
              if (contentType.length > 0) {
                  text += ", '" + contentType + "'";
              }
              addToClientTable(args.get_fileName(), text);
          }
        </script>


</head>
<body>
    <form id="form1" runat="server">
    <div>
        <ajaxToolkit:ToolkitScriptManager ID="mgr1" runat="server"></ajaxToolkit:ToolkitScriptManager>
      
        <div class="demoarea" style="width: 100px">            
            <ajaxtoolkit:asyncfileupload onclientuploaderror="uploadError" onclientuploadcomplete="uploadComplete"
                runat="server" id="AsyncFileUpload1" width="400px" uploaderstyle="Modern" uploadingbackcolor="#CCFFFF"
                throbberid="myThrobber" />
            &nbsp;<asp:Label runat="server" ID="myThrobber" Style="display: none;"><img align="middle" alt="" src="uploading.gif" /></asp:Label>
            <div>
                <strong>The latest Server-side event:</strong></div>
            <asp:Label runat="server" Text="&nbsp;" ID="uploadResult" />
            <br />
            <br />
            <div>
                <strong>Client-side events:</strong></div>
            <table style="border-collapse: collapse; border-left: solid 1px #aaaaff; border-top: solid 1px #aaaaff;"
                runat="server" cellpadding="3" id="clientSide" />
        </div>
    </div>
    </form>
</body>
</html>
