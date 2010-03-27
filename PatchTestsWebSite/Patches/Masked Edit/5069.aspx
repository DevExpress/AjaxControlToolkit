<%@ Page Language="C#" MasterPageFile="~/DefaultTests.master" AutoEventWireup="true" CodeFile="test5069.aspx.cs"
    Inherits="Patch5069" Title="Untitled Page" UICulture="en-US" Culture="en-US" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">

    <strong>Enter Date and Time (format: <em>99/99/9999 99:99:99</em>)</strong>
        <br />
        <asp:TextBox ID="TextBox5" ReadOnly="true" runat="server" Width="180px"/>
        <asp:MaskedEditExtender ID="MaskedEditExtender5" runat="server"
            TargetControlID="TextBox5" 
            Mask="9999/99/99 99:99:99"
            OnFocusCssClass="MaskedEditFocus"
            OnInvalidCssClass="MaskedEditError"
            MaskType="DateTime"
            AcceptAMPM="True"
        />
    <br />
    MaskType: Date, mask: YYYY. MM. DD (hu-HU)
    <br />
    <asp:TextBox ID="TextBox1" runat="server" ReadOnly="true" Width="328px"></asp:TextBox><br />
    
    <asp:MaskedEditExtender ID="MaskedEditExtender1" runat="server" 
        AcceptNegative="Left"
        DisplayMoney="Left" 
        Mask="9999/99/99" 
        MaskType="Date" 
        OnFocusCssClass="MaskedEditFocus" 
        OnInvalidCssClass="MaskedEditError" 
        TargetControlID="TextBox1" 
        />
        <input type="button" onclick="disable(true)" value="Enable First"/>
        <input type="button" onclick="disable(false)" value="Enable Second"/>

<script>
function disable(val) {
    var tb1=$get('<%=TextBox1.ClientID %>'),
    tb2=$get('<%=TextBox5.ClientID %>');

    tb1.readOnly=val;
    tb2.readOnly=!val;
    (val ? tb2 : tb1).focus();
}
</script>
</asp:Content>

