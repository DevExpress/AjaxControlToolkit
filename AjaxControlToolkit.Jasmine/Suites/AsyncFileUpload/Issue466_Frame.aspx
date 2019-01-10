<%@ Page Language="C#" AutoEventWireup="true" %>

<form id="form1" runat="server">
    <asp:ScriptManager runat="server" />
    <act:AsyncFileUpload runat="server" ID="upload1" OnClientUploadStarted="function() { parent.Issue466_UploadStarted = true; }" />
    <asp:Button runat="server" />
</form>

<% if(!IsPostBack) { %>
<script>
    Sys.Application.add_load(function() {
        var upload1 = $find("upload1");
        var input = upload1._inputFile;
        input.type = "";
        input.value = "c:/test";
        upload1._onchange({});
    });
</script>
<% } %>
