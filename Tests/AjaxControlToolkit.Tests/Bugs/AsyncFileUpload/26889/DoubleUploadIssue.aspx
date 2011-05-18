<%@ Page Language="C#" AutoEventWireup="true" Inherits="DoubleUploadIssue" Codebehind="DoubleUploadIssue.aspx.cs" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <script language="JavaScript" type="text/javascript">
        function AjaxUploadComplete() {

            //Postback is necessary for asyncfileupload
            __doPostBack('UploadPostback', '');
        }
    </script>

</head>
<body>
    <form id="form1" runat="server">
    <div>
        <div>
            <ajaxToolkit:ToolkitScriptManager ID="mgr1" runat="server">
            </ajaxToolkit:ToolkitScriptManager>
            <ajaxToolkit:AsyncFileUpload ID="AsyncFileUpload1" runat="server" OnUploadedComplete="AsyncFileUpload1_UploadedComplete"
                OnClientUploadComplete="AjaxUploadComplete" />
        </div>
        <p>
            &nbsp;</p>
        <asp:GridView ID="GridView1" Width="595px" runat="server" AutoGenerateColumns="False"
            OnRowDeleting="GridView1_RowDeleting">
            <Columns>
                <asp:TemplateField HeaderText="File Name">
                    <ItemTemplate>
                        <asp:Label ID="lblFileName" runat="server" Text='<%# Eval("FileName") %>'></asp:Label>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Confidential?">
                    <ItemTemplate>
                        <asp:CheckBox ID="chkConfidential" runat="server" Checked='<%# Eval("IsConfidential") %>' />
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="" AccessibleHeaderText="Remove">
                    <ItemTemplate>
                        <asp:LinkButton ID="LinkButton1" runat="server" Text="Delete" CommandName="Delete"
                            CausesValidation="False" />
                    </ItemTemplate>
                </asp:TemplateField>
            </Columns>
        </asp:GridView>
    </div>
    </form>
</body>
</html>
