<%@ Page
    Language="C#"
    CodeFile="5349.aspx.cs"
    Inherits="Patch5349"
    MasterPageFile="~/DefaultTests.master"
    Title="RoundedCorners Tests" %>

<asp:Content ID="Content" ContentPlaceHolderID="SampleContent" Runat="Server">
    <div style="background-color:Gray">above</div>
    
    <asp:Panel ID="Panel1" runat="server" BackColor="Red">
        <p> Panel with rounded corners</p>
        <p> The p tag makes the panel have extra margins, which the fix makes have the background color of the panel</p>
    </asp:Panel>
    <div style="background-color:Gray">below</div>

    <asp:RoundedCornersExtender runat="server" TargetControlID="Panel1" Radius="10" />

    <p></p>

    <div style="background-color:Gray">above</div>
   
    <asp:Panel ID="Panel2" runat="server" BackColor="Red">
        Panel with rounded corners
    </asp:Panel>
   
    <div style="background-color:Gray">below</div>
   
    <asp:RoundedCornersExtender runat="server" TargetControlID="Panel2" Radius="10" />

    <p></p>

    <div style="background-color:Gray">above</div>
    
    <asp:Panel runat="server" ID="Panel3" BackColor="Red" Radius="10" style="height:50px;" >
        <p> Fixed height Panel with rounded corners</p>
        <p> The p tag makes the panel have extra margins, which the fix makes have the background color of the panel</p>
    </asp:Panel>
    
    <div style="background-color:Gray">below</div>
    
    <asp:RoundedCornersExtender runat="server" TargetControlID="Panel3" Radius="10" />

    <p></p>

    <div style="background-color:Gray">above</div>
    
    <asp:Panel runat="server" ID="Panel4" BackColor="Red" Radius="10" style="height:50px; overflow:hidden" >
        <p> Fixed height Panel, inline overflow:hidden</p>
        <p> The p tag makes the panel have extra margins, which the fix makes have the background color of the panel</p>
    </asp:Panel>
    
    <div style="background-color:Gray">below</div>

    <asp:RoundedCornersExtender runat="server" TargetControlID="Panel4" Radius="10" />

    <p></p>

</asp:Content>


 <%--style="overflow:auto"--%>