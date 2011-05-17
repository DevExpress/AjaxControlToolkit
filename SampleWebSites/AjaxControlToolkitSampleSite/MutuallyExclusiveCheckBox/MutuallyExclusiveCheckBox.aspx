<%@ Page
    Language="C#"
    AutoEventWireup="true"
    MasterPageFile="~/DefaultMaster.master"
    Inherits="CommonPage"
    Title="MutuallyExclusiveCheckBox Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content runat="server" ContentPlaceHolderID="SampleContent">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">MutuallyExclusiveCheckBox Demonstration</div>
        <table>
            <tr>
	            <td>
	                <b>Must Have</b><br />
		            <asp:Checkbox runat="server" ID="MustHaveGuestBedroomCheckBox" 
		                Text="Guest Bed Downstairs" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender runat="server" ID="MustHaveGuestBedroomCheckBoxEx" 
	                    TargetControlID="MustHaveGuestBedroomCheckBox" 
	                    Key="GuestBedroomCheckBoxes" />
		            
		            <asp:Checkbox runat="server" ID="MustHaveSplitPlanCheckBox" 
		                Text="Split Plan" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender runat="server" ID="MustHaveSplitPlanCheckBoxEx" 
	                    TargetControlID="MustHaveSplitPlanCheckBox" 
	                    Key="SplitPlanCheckBoxes" />
		            
		            <asp:Checkbox runat="server" ID="MustHaveCoveredPatioCheckBox" 
		                Text="Covered Patio" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender runat="server" ID="MustHaveCoveredPatioCheckBoxEx" 
	                    TargetControlID="MustHaveCoveredPatioCheckBox" 
	                    Key="CoveredPatioCheckBoxes" />
		            
		            <asp:Checkbox runat="server" ID="MustHaveGatedCommunityCheckBox" 
		                Text="Gated Community" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender ID="MustHaveGatedCommunityCheckBoxEx" runat="server" 
	                    TargetControlID="MustHaveGatedCommunityCheckBox" 
	                    Key="GatedCommunityCheckBoxes" />
		            
		            <asp:Checkbox runat="server" ID="MustHaveGolfCommunityCheckBox" 
		                Text="Golf Community" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender runat="server" ID="MustHaveGolfCommunityCheckBoxEx" 
	                    TargetControlID="MustHaveGolfCommunityCheckBox" 
	                    Key="GolfCommunityCheckBoxes" />
		            
		            <asp:Checkbox runat="server" ID="MustHaveCommunityPoolCheckBox" 
		                Text="Community Pool" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender runat="server" ID="MustHaveCommunityPoolCheckBoxEx" 
	                    TargetControlID="MustHaveCommunityPoolCheckBox" 
	                    Key="CommunityPoolCheckBoxes" />
		            
		            <asp:Checkbox runat="server" ID="MustHaveSoldOutCheckBox" 
		                Text="Sold Out" />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender runat="server" ID="MustHaveSoldOutCheckBoxEx" 
	                    TargetControlID="MustHaveSoldOutCheckBox" 
	                    Key="SoldOutCheckBoxes" />
	            </td>
	            <td>
	                <b>Must Not Have</b><br />
		            <asp:Checkbox runat="server" id="MustNotHaveGuestBedroomCheckBox"
		                Text="Guest Bed Downstairs" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender ID="MutuallyExclusiveCheckboxExtender1" runat="server"
	                    TargetControlID="MustNotHaveGuestBedroomCheckBox"
	                    Key="GuestBedroomCheckBoxes" />
		            
		            <asp:Checkbox runat="server" id="MustNotHaveSplitPlanCheckBox"
		                Text="Split Plan" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender ID="MutuallyExclusiveCheckboxExtender2" runat="server"
	                    TargetControlID="MustNotHaveSplitPlanCheckBox"
	                    Key="SplitPlanCheckBoxes" />
		            
		            <asp:Checkbox runat="server" id="MustNotHaveCoveredPatioCheckBox"
		                Text="Covered Patio" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender ID="MutuallyExclusiveCheckboxExtender3" runat="server"
	                    TargetControlID="MustNotHaveCoveredPatioCheckBox"
	                    Key="CoveredPatioCheckBoxes" />
		            
		            <asp:Checkbox runat="server" id="MustNotHaveGatedCommunityCheckBox"
		                Text="Gated Community" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender ID="MutuallyExclusiveCheckboxExtender4" runat="server"
	                    TargetControlID="MustNotHaveGatedCommunityCheckBox"
	                    Key="GatedCommunityCheckBoxes" />
		            
		            <asp:Checkbox runat="server" id="MustNotHaveGolfCommunityCheckBox"
		                Text="Golf Community" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender ID="MutuallyExclusiveCheckboxExtender5" runat="server"
	                    TargetControlID="MustNotHaveGolfCommunityCheckBox"
	                    Key="GolfCommunityCheckBoxes" />
		            
		            <asp:Checkbox runat="server" id="MustNotHaveCommunityPoolCheckBox"
		                Text="Community Pool" /><br />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender ID="MutuallyExclusiveCheckboxExtender6" runat="server"
	                    TargetControlID="MustNotHaveCommunityPoolCheckBox"
	                    Key="CommunityPoolCheckBoxes" />
		            
		            <asp:Checkbox runat="server" id="MustNotHaveSoldOutCheckBox"
		                Text="Sold Out" />
	                <ajaxToolkit:MutuallyExclusiveCheckboxExtender ID="MutuallyExclusiveCheckboxExtender7" runat="server"
	                    TargetControlID="MustNotHaveSoldOutCheckBox"
	                    Key="SoldOutCheckBoxes" />
	            </td>            
	        </tr>
        </table>
    </div>
    <div class="demobottom"></div>
    
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            MutuallyExclusiveCheckBox Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            MutuallyExclusiveCheckBox is an ASP.NET AJAX extender that can be attached to any ASP.NET
            CheckBox control.  By adding a number of checkboxes to the same "Key", only one checkbox
            with the specified key can be checked at a time.  This extender is useful when a number of
            choices are available but only one can be chosen, similar to a radio button.  The use of
            checkboxes however allows you to choose to uncheck a value which is not possible normally
            with radio buttons.  This also provides a more consistent and expected interface than using
            javascript to allow the de-selection of a RadioButton item.
        </p>
    </asp:Panel>
    
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            MutuallyExclusiveCheckBox Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;" Height="0px">
        <p>The control above is initialized with this code.</p>
<pre>&lt;ajaxToolkit:MutuallyExclusiveCheckboxExtender runat="server"
    ID="MustHaveGuestBedroomCheckBoxEx"
    TargetControlID="MustHaveGuestBedroomCheckBox" 
    Key="GuestBedroomCheckBoxes" /&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of the CheckBox to modify</li>
            <li><strong>Key</strong> - The unique key to use to associate checkboxes.  This key does not
                respect INamingContainer renaming.</li>
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