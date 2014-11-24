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
            <p>
                DropDown is an ASP.NET AJAX extender that can be attached to almost any ASP.NET control to provide
                a SharePoint-style drop-down menu.  The displayed menu is merely another panel or control.  In the
                above sample the drop-down is a Panel which contains LinkButtons.  The drop-down is activated by left-
                or right-clicking the attached control.  If the behavior is attached to a Hyperlink or LinkButton, 
                clicking on the link itself will operate normally.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>DropDown Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties
                are optional:
            </p>
            <pre>
&lt;ajaxToolkit:DropDownExtender runat="server" ID="DDE"
    TargetControlID="TextLabel" 
    <em>DropDownControlID</em>="DropPanel" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the control which needs a drop-down.</li>
                <li><strong>DropDownControlID</strong> - The ID of the control which will be displayed as the dropdown.</li>
                <li><strong>Animations</strong> - Generic animations for the DropDown extender.  See the <a href="https://ajaxcontroltoolkit.codeplex.com/wikipage?title=Animation%20Control%20Reference">Animation Reference</a> for more details.
                <ul>
                    <li><strong>OnShow</strong> - The OnShow animation will be played each time the dropdowns displayed.  The dropdown will be positioned correctly but hidden.  The animation can use <span class="codeReference">&lt;HideAction Visible="true" /&gt;</span> to display the dropdown along with any other visual effects.</li>
                    <li><strong>OnHide</strong> - The OnHide animation will be played each time the dropdown is hidden.</li>
                </ul>
                </li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>