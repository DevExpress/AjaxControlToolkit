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
            <div runat="server" data-control-type="MutuallyExclusiveCheckBoxExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>MutuallyExclusiveCheckBox Properties</Header>
        <Content>
            <div runat="server" data-control-type="MutuallyExclusiveCheckBoxExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
