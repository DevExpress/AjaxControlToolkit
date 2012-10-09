<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26751.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
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

      function openFileOption() {
          //document.getElementById('ctl00_MainContent_AsyncFileUpload1_ctl02').click();
      }
      </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <act:ToolkitScriptManager ID="sm1" runat="server" />

    <act:AsyncFileUpload ID="async1" runat="server"  OnClientUploadError="uploadError" OnClientUploadComplete="uploadComplete" />

     <table style="border-collapse: collapse; border-left: solid 1px #aaaaff; border-top: solid 1px #aaaaff;" runat="server" cellpadding="3" id="clientSide" />
    </div>
    </form>
</body>
</html>
