<%@ Page Title="MutuallyExclusiveCheckBox Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="MutuallyExclusiveCheckBox.aspx.cs" Inherits="MutuallyExclusiveCheckBox_MutuallyExclusiveCheckBox" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    MutuallyExclusiveCheckBox Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <table>
        <tr>
            <td>
                <b>Must Have</b><br />
                <asp:CheckBox runat="server" ID="MustHaveGuestBedroomCheckBox"
                    Text="Guest Bed Downstairs" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender runat="server" ID="MustHaveGuestBedroomCheckBoxEx"
                    TargetControlID="MustHaveGuestBedroomCheckBox"
                    Key="GuestBedroomCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustHaveSplitPlanCheckBox"
                    Text="Split Plan" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender runat="server" ID="MustHaveSplitPlanCheckBoxEx"
                    TargetControlID="MustHaveSplitPlanCheckBox"
                    Key="SplitPlanCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustHaveCoveredPatioCheckBox"
                    Text="Covered Patio" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender runat="server" ID="MustHaveCoveredPatioCheckBoxEx"
                    TargetControlID="MustHaveCoveredPatioCheckBox"
                    Key="CoveredPatioCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustHaveGatedCommunityCheckBox"
                    Text="Gated Community" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender ID="MustHaveGatedCommunityCheckBoxEx" runat="server"
                    TargetControlID="MustHaveGatedCommunityCheckBox"
                    Key="GatedCommunityCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustHaveGolfCommunityCheckBox"
                    Text="Golf Community" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender runat="server" ID="MustHaveGolfCommunityCheckBoxEx"
                    TargetControlID="MustHaveGolfCommunityCheckBox"
                    Key="GolfCommunityCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustHaveCommunityPoolCheckBox"
                    Text="Community Pool" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender runat="server" ID="MustHaveCommunityPoolCheckBoxEx"
                    TargetControlID="MustHaveCommunityPoolCheckBox"
                    Key="CommunityPoolCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustHaveSoldOutCheckBox"
                    Text="Sold Out" />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender runat="server" ID="MustHaveSoldOutCheckBoxEx"
                    TargetControlID="MustHaveSoldOutCheckBox"
                    Key="SoldOutCheckBoxes" />
            </td>
            <td>
                <b>Must Not Have</b><br />
                <asp:CheckBox runat="server" ID="MustNotHaveGuestBedroomCheckBox"
                    Text="Guest Bed Downstairs" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender ID="MutuallyExclusiveCheckboxExtender1" runat="server"
                    TargetControlID="MustNotHaveGuestBedroomCheckBox"
                    Key="GuestBedroomCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustNotHaveSplitPlanCheckBox"
                    Text="Split Plan" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender ID="MutuallyExclusiveCheckboxExtender2" runat="server"
                    TargetControlID="MustNotHaveSplitPlanCheckBox"
                    Key="SplitPlanCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustNotHaveCoveredPatioCheckBox"
                    Text="Covered Patio" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender ID="MutuallyExclusiveCheckboxExtender3" runat="server"
                    TargetControlID="MustNotHaveCoveredPatioCheckBox"
                    Key="CoveredPatioCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustNotHaveGatedCommunityCheckBox"
                    Text="Gated Community" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender ID="MutuallyExclusiveCheckboxExtender4" runat="server"
                    TargetControlID="MustNotHaveGatedCommunityCheckBox"
                    Key="GatedCommunityCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustNotHaveGolfCommunityCheckBox"
                    Text="Golf Community" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender ID="MutuallyExclusiveCheckboxExtender5" runat="server"
                    TargetControlID="MustNotHaveGolfCommunityCheckBox"
                    Key="GolfCommunityCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustNotHaveCommunityPoolCheckBox"
                    Text="Community Pool" /><br />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender ID="MutuallyExclusiveCheckboxExtender6" runat="server"
                    TargetControlID="MustNotHaveCommunityPoolCheckBox"
                    Key="CommunityPoolCheckBoxes" />

                <asp:CheckBox runat="server" ID="MustNotHaveSoldOutCheckBox"
                    Text="Sold Out" />
                <ajaxToolkit:MutuallyExclusiveCheckBoxExtender ID="MutuallyExclusiveCheckboxExtender7" runat="server"
                    TargetControlID="MustNotHaveSoldOutCheckBox"
                    Key="SoldOutCheckBoxes" />
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>MutuallyExclusiveCheckBox Description</Header>
        <Content>
            <p>
                MutuallyExclusiveCheckBox is an ASP.NET AJAX extender that can be attached to any ASP.NET
                CheckBox control.  By adding a number of checkboxes to the same "Key", only one checkbox
                with the specified key can be checked at a time.  This extender is useful when a number of
                choices are available but only one can be chosen, similar to a radio button.  The use of
                checkboxes however allows you to choose to uncheck a value which is not possible normally
                with radio buttons.  This also provides a more consistent and expected interface than using
                javascript to allow the de-selection of a RadioButton item.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>MutuallyExclusiveCheckBox Properties</Header>
        <Content>
            <p>The control above is initialized with this code.</p>
            <pre>
&lt;ajaxToolkit:MutuallyExclusiveCheckboxExtender runat="server"
    ID="MustHaveGuestBedroomCheckBoxEx"
    TargetControlID="MustHaveGuestBedroomCheckBox" 
    Key="GuestBedroomCheckBoxes" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the CheckBox to modify</li>
                <li><strong>Key</strong> - The unique key to use to associate checkboxes.  This key does not
                    respect INamingContainer renaming.</li>
             </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
