<%@ Page Title="HtmlEditor" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="HtmlEditor.aspx.cs" Inherits="HtmlEditor_HtmlEditor" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit.HtmlEditor" TagPrefix="htmlEditor" %>
<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    HTMLEditor Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <htmlEditor:Editor runat="server" id="editor" height="300px" autofocus="true" width="100%" />
    <asp:Label runat="server" ID="ContentChangedLabel" />
    <br />
    <asp:Button runat="server" Text="Submit content" ID="submit" />
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
</asp:Content>
