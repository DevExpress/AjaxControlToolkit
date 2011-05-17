<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    CodeFile="ToggleButton.aspx.cs"
    Inherits="ToggleButton_ToggleButton"
    Title="ToggleButton Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager EnablePartialRendering="true" runat="Server" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">ToggleButton Demonstration</div>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
                <asp:CheckBox ID="CheckBox1" Checked="true" Text="I like ASP.NET" runat="server"/><br />
                <ajaxToolkit:ToggleButtonExtender ID="ToggleButtonExtender1" runat="server"
                    TargetControlID="CheckBox1"
                    ImageWidth="19"
                    ImageHeight="19"
                    UncheckedImageUrl="ToggleButton_Unchecked.gif"
                    CheckedImageUrl="ToggleButton_Checked.gif"
                    CheckedImageAlternateText="Check"
                    UncheckedImageAlternateText="UnCheck" />
        
                <asp:CheckBox ID="CheckBox2" Checked="true" Text='I like ASP.NET AJAX' runat="server"/><br /><br />
                <ajaxToolkit:ToggleButtonExtender ID="ToggleButtonExtender2" runat="server"
                    TargetControlID="CheckBox2"
                    ImageWidth="19"
                    ImageHeight="19"
                    UncheckedImageUrl="ToggleButton_Unchecked.gif"
                    CheckedImageUrl="ToggleButton_Checked.gif"
                    CheckedImageAlternateText="Check"
                    UncheckedImageAlternateText="UnCheck" />

                <asp:Button ID="Button1" runat="server" Text="Submit" OnClick="Button1_Click" />
                <br /><br />
                <asp:Label ID="Label1" runat="server" Text="[No response provided yet]" />
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    <div class="demobottom"></div>

    <asp:Panel ID="Description_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            ToggleButton Description
        </div>
    </asp:Panel>
    <asp:Panel id="Description_ContentPanel" runat="server" style="overflow:hidden;">
        <p>
            ToggleButton is an ASP.NET AJAX extender that can be attached to an ASP.NET CheckBox control.
            ToggleButton enables the use of custom images to show the state of the CheckBox.
            The behavior of the CheckBox is unaffected.
        </p>
    </asp:Panel>

    <asp:Panel ID="Properties_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            ToggleButton Properties
        </div>
    </asp:Panel>
    <asp:Panel id="Properties_ContentPanel" runat="server" style="overflow:hidden;" Height="0px">
        <p>
            The control above is initialized with this code. The <em>italic</em> properties
            are optional:
        </p>
<pre>&lt;ajaxToolkit:ToggleButtonExtender ID="ToggleEx" runat="server"
    TargetControlID="CheckBox1" 
    ImageWidth="19" 
    ImageHeight="19"
    <em>CheckedImageAlternateText</em>="Check"
    <em>UncheckedImageAlternateText</em>="UnCheck"
    UncheckedImageUrl="ToggleButton_Unchecked.gif" 
    CheckedImageUrl="ToggleButton_Checked.gif" /&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of the CheckBox to modify</li>
            <li><strong>ImageHeight\ImageWidth</strong> - The height and width of the image</li>
            <li><strong>CheckedImageUrl</strong> - the URL of the image to show when the toggle
                button is in the checked state.</li>
            <li><strong>UncheckedImageUrl</strong> - the URL of the image to show when the toggle
                button is in the unchecked state. </li>
            <li><strong>DisabledCheckedImageUrl</strong> - the URL of the image to show when the
                toggle button is disabled and in the checked state.</li>
            <li><strong>DisabledUncheckedImageUrl</strong> - the URL of the image to show when the
                toggle button is disabled and in the unchecked state. </li>
            <li><strong>CheckedImageOverUrl</strong> - the URL of the image to show when the toggle
                button is in the checked state and the mouse is over the button.</li>
            <li><strong>UncheckedImageOverUrl</strong> - the URL of the image to show when the toggle
                button is in the unchecked state and the mouse is over the button.</li>
            <li><strong>CheckedImageAlternateText</strong> - the alt text to show when the toggle
                button is in the checked state.</li>
            <li><strong>UncheckedImageAlternateText</strong> - the alt text to show when the toggle
                button is in the unchecked state.</li>  
            <li><strong>CheckedImageOverAlternateText</strong> - the alt text to show when the toggle
                button is in the checked state and the mouse is over the button.</li>
            <li><strong>UncheckedImageOverAlternateText</strong> - the alt text to show when the toggle
                button is in the unchecked state and the mouse is over the button.</li>
            <li><strong>ImageHeight/ImageWidth</strong> - The height and width, respectively, of
                the image that will be displayed.</li>
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