<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26975.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript">
        function uploadError(sender, args) {
//                $get(errorTextID).value = "";
//                the_errorMessages[sender._element] = "";
//                var message = args.get_errorMessage();
//                pushErrorMessage(sender, message);
        }

        function uploadComplete(sender, args) {
//                var textError = $get(errorTextID).value;
//                if (textError && textError.length > 0) {
//                    sender._onError(textError); // raise OnClientUploadError event
//                }
//                else 
//                {
//                    pushErrorMessage(sender, "");
//                }
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ScriptManager1" runat="server" />
    <input type="hidden" id="errorTextPlaceholder" runat="server" />
    <div class="RepeaterDiv">
        <asp:Repeater ID="TheRepeater" runat="server">
            <ItemTemplate>
                <div>
                    <act:asyncfileupload runat="server" id="AsyncFileUpload1" width="250px" 
                        onclientuploaderror="uploadError" onclientuploadcomplete="uploadComplete" />
                    <asp:Label ID="FileNameErr1" runat="server" Text=""></asp:Label>
                </div>
            </ItemTemplate>
        </asp:Repeater>
    </div>
    </form>
</body>
</html>
