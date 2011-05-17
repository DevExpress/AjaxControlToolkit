<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    CodeFile="DropDown.aspx.cs"
    Inherits="DropDown_DropDown"
    Title="DropDown Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="server" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">DropDown Demonstration</div>
        
        <div>Hover over the text below and click to select an option:</div>
        <br />
        <asp:Label ID="TextLabel" runat="server" Text="Select your favorite exotic ice-cream flavor"
            Style="display: block; width: 300px; padding:2px; padding-right: 50px; font-family: Tahoma; font-size: 11px;" />
        <asp:Panel ID="DropPanel" runat="server" CssClass="ContextMenuPanel" Style="display :none; visibility: hidden;">
            <asp:LinkButton runat="server" ID="Option1" Text="Mocha Blast" CssClass="ContextMenuItem" OnClick="OnSelect" />
            <asp:LinkButton runat="server" ID="Option2" Text="Java Cyclone" CssClass="ContextMenuItem" OnClick="OnSelect" />
            <asp:LinkButton runat="server" ID="Option3" Text="Dry Fruit" CssClass="ContextMenuItem" OnClick="OnSelect" />        
        </asp:Panel>
        <ajaxToolkit:DropDownExtender runat="server" ID="DDE"
            TargetControlID="TextLabel"
            DropDownControlID="DropPanel" />
        <br />
        <asp:UpdatePanel id="Update" runat="server">
            <ContentTemplate>
                <asp:Label id="lblSelection" runat="server" Style="padding: 5px;" />
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
    </div>
    <div class="demobottom"></div>
    
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            DropDown Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            DropDown is an ASP.NET AJAX extender that can be attached to almost any ASP.NET control to provide
            a SharePoint-style drop-down menu.  The displayed menu is merely another panel or control.  In the
            above sample the drop-down is a Panel which contains LinkButtons.  The drop-down is activated by left-
            or right-clicking the attached control.  If the behavior is attached to a Hyperlink or LinkButton, 
            clicking on the link itself will operate normally.
        </p>
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            DropDown Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;" Height="0px">
        <p>
            The control above is initialized with this code. The <em>italic</em> properties
            are optional:
        </p>
<pre>&lt;ajaxToolkit:DropDownExtender runat="server" ID="DDE"
    TargetControlID="TextLabel" 
    <em>DropDownControlID</em>="DropPanel" /&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of the control which needs a drop-down.</li>
            <li><strong>DropDownControlID</strong> - The ID of the control which will be displayed as the dropdown.</li>
            <li><strong>Animations</strong> - Generic animations for the DropDown extender.  See the
                <a href="../Walkthrough/UsingAnimations.aspx">Using Animations</a> walkthrough and
                <a href="../Walkthrough/AnimationReference.aspx">Animation Reference</a> for more details.
                <ul>
                    <li><strong>OnShow</strong> - The OnShow animation will be played each time the dropdown
                        is displayed.  The dropdown will be positioned correctly but hidden.  The animation can use
                        <span class="codeReference">&lt;HideAction Visible="true" /&gt;</span>
                        to display the dropdown along with any other visual effects.</li>
                    <li><strong>OnHide</strong> - The OnHide animation will be played each time the dropdown
                        is hidden.</li>
                </ul>
            </li>
        </ul>
    </asp:Panel>
    
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server"
        TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel"
        CollapseControlID="Description_HeaderPanel"
        Collapsed="False"
        ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server"
        TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel"
        CollapseControlID="Properties_HeaderPanel"
        Collapsed="True"
        ImageControlID="Properties_ToggleImage" />
</asp:Content>