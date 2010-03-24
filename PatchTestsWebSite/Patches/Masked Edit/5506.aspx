<%@ Page Language="C#" MasterPageFile="~/DefaultTests.master" AutoEventWireup="true" CodeFile="5506.aspx.cs"
    Inherits="Patch5506" Title="Untitled Page" UICulture="en-US" Culture="en-US" %>
    
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">

    <asp:TextBox ID="TextBox14703" Text="123456" runat="server"></asp:TextBox>

    <asp:MaskedEditExtender ID="MaskedEditExtender14703" TargetControlID="TextBox14703" runat="server"
            ClearMaskOnLostFocus="false" Mask="(999) 999-9999" MaskType="None" />

</asp:Content>

