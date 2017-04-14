<%@ Page Title="DropDown Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="DropDown.aspx.cs" Inherits="DropDown_DropDown" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    DropDown Demonstration
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <div>Hover over the text below and click to select an option:</div>
    <br />
    <asp:Label ID="TextLabel" runat="server" Text="Select your favorite exotic ice-cream flavor"
        Style="display: block; width: 300px; padding: 2px; padding-right: 50px; font-family: Tahoma; font-size: 11px;" />
    <asp:Panel ID="DropPanel" runat="server" CssClass="ContextMenuPanel" Style="display: none; visibility: hidden;">
        <asp:LinkButton runat="server" ID="Option1" Text="Mocha Blast" CssClass="ContextMenuItem" OnClick="OnSelect" />
        <asp:LinkButton runat="server" ID="Option2" Text="Java Cyclone" CssClass="ContextMenuItem" OnClick="OnSelect" />
        <asp:LinkButton runat="server" ID="Option3" Text="Dry Fruit" CssClass="ContextMenuItem" OnClick="OnSelect" />
    </asp:Panel>
    <ajaxToolkit:DropDownExtender runat="server" ID="DDE"
        TargetControlID="TextLabel"
        DropDownControlID="DropPanel" />
    <br />
    <asp:UpdatePanel ID="Update" runat="server">
        <ContentTemplate>
            <asp:Label ID="lblSelection" runat="server" Style="padding: 5px;" />
        </ContentTemplate>
        <Triggers>
            <asp:AsyncPostBackTrigger ControlID="Option1" EventName="Click" />
            <asp:AsyncPostBackTrigger ControlID="Option2" EventName="Click" />
            <asp:AsyncPostBackTrigger ControlID="Option3" EventName="Click" />
        </Triggers>
    </asp:UpdatePanel>

    <ajaxToolkit:UpdatePanelAnimationExtender ID="UpdateAnimation" runat="server" TargetControlID="Update" BehaviorID="Highlight">
        <Animations>
                <OnUpdated>
                    <Sequence>
                        <Color AnimationTarget="lblSelection"
                            Duration=".5" PropertyKey="backgroundColor"
                            StartValue="#FFFF90" EndValue="#FFFFFF"  />
                    </Sequence>
                </OnUpdated>
        </Animations>
    </ajaxToolkit:UpdatePanelAnimationExtender>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>DropDown Description</Header>
        <Content>
            <div runat="server" data-control-type="DropDownExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>DropDown Properties</Header>
        <Content>
            <div runat="server" data-control-type="DropDownExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>