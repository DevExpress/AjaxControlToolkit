<%@ Page Language="C#" 
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true" 
    Inherits="CommonPage" Theme="SampleSiteTheme" %>

<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<%@ Register TagPrefix="custom" Namespace="CustomControlDemo" Assembly="CustomControlDemo" %>

<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" />
    <div class="demoarea">
        <custom:WelcomeLabel ID="WelcomeLabel1" runat="server" Text="Welcome" DefaultUserName="Guest"></custom:WelcomeLabel>
    </div>
</asp:Content>
