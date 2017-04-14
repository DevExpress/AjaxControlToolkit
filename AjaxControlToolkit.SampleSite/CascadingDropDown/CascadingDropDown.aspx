<%@ Page Title="CascadingDropDown Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="CascadingDropDown.aspx.cs" Inherits="CascadingDropDown_CascadingDropDown" EnableEventValidation="false"%>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    CascadingDropDown Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <table>
        <tr>
            <td>Make</td>
            <td>
                <asp:DropDownList ID="DropDownList1" runat="server" Width="170" /></td>
        </tr>
        <tr>
            <td>Model</td>
            <td>
                <asp:DropDownList ID="DropDownList2" runat="server" Width="170" /></td>
        </tr>
        <tr>
            <td>Color</td>
            <td>
                <asp:DropDownList ID="DropDownList3" runat="server" Width="170" AutoPostBack="true"
                    OnSelectedIndexChanged="DropDownList3_SelectedIndexChanged" /></td>
        </tr>
    </table>
    <br />

    <ajaxToolkit:CascadingDropDown ID="CascadingDropDown1" runat="server" TargetControlID="DropDownList1"
        Category="Make" PromptText="Please select a make" LoadingText="[Loading makes...]"
        ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContents" />

    <ajaxToolkit:CascadingDropDown ID="CascadingDropDown2" runat="server" TargetControlID="DropDownList2"
        Category="Model" PromptText="Please select a model" LoadingText="[Loading models...]"
        ServiceMethod="GetDropDownContentsPageMethod" ParentControlID="DropDownList1" />

    <ajaxToolkit:CascadingDropDown ID="CascadingDropDown3" runat="server" TargetControlID="DropDownList3"
        Category="Color" PromptText="Please select a color" LoadingText="[Loading colors...]"
        ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContents"
        ParentControlID="DropDownList2" />

    <asp:UpdatePanel ID="UpdatePanel1" runat="server" UpdateMode="Conditional" RenderMode="inline">
        <ContentTemplate>
            <asp:Label ID="Label1" runat="server" Text="[No response provided yet]" />
        </ContentTemplate>
        <Triggers>
            <asp:AsyncPostBackTrigger ControlID="DropDownList3" EventName="SelectedIndexChanged" />
        </Triggers>
    </asp:UpdatePanel>
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>CascadingDropDown Description</Header>
        <Content>
            <div runat="server" data-control-type="CascadingDropDown" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>CascadingDropDown Properties</Header>
        <Content>
             <div runat="server" data-control-type="CascadingDropDown" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>