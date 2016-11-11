<%@ Page Title="NumericUpDown Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="NumericUpDown.aspx.cs" Inherits="NumericUpDown_NumericUpDown" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    NumericUpDown Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <table>
                <tr>
                    <td>Enter a numeric value and use the up and down buttons to increment/decrement (min:1 and max:7)</td>
                    <td>
                        <asp:TextBox ID="TextBox1" runat="server" Text="3" Width="120" Style="text-align: center" /></td>
                </tr>
                <tr>
                    <td>Choose your favorite month</td>
                    <td>
                        <asp:TextBox ID="TextBox2" runat="server" Text="June" Width="120" Style="text-align: center" /></td>
                </tr>
                <tr>
                    <td>Let the web service pick a random number between 0 and 1000 that is higher/lower than the displayed value</td>
                    <td>
                        <asp:TextBox ID="TextBox3" runat="server" Text="500" Width="120" Style="text-align: center" /></td>
                </tr>
                <tr>
                    <td>Use the arrow images to increment/decrement the value</td>
                    <td>
                        <asp:TextBox ID="TextBox4" runat="server" Text="0" Width="60" Style="text-align: center" />
                        <asp:ImageButton ID="img1" runat="server" ImageUrl="~/images/down.gif" AlternateText="Down" Width="15" Height="15" />
                        <asp:ImageButton ID="img2" runat="server" ImageUrl="~/images/up.gif" AlternateText="Up" Width="15" Height="15" />
                    </td>
                </tr>
            </table>
            <br />
            <asp:Button ID="Button1" runat="server" Text="Submit" OnClick="Button1_Click" />
            <br />
            <br />
            <asp:Label ID="Label1" runat="server" Text="[No response provided yet]" />

            <ajaxToolkit:NumericUpDownExtender ID="NumericUpDownExtender1" runat="server"
                TargetControlID="TextBox1"
                Width="120"
                RefValues=""
                ServiceDownMethod=""
                ServiceUpMethod=""
                TargetButtonDownID=""
                TargetButtonUpID=""
                Minimum="1"
                Maximum="7" />
            <ajaxToolkit:NumericUpDownExtender ID="NumericUpDownExtender2" runat="server"
                TargetControlID="TextBox2"
                Width="120"
                RefValues="January;February;March;April;May;June;July;August;September;October;November;December"
                ServiceDownMethod=""
                ServiceUpMethod=""
                TargetButtonDownID=""
                TargetButtonUpID="" />
            <ajaxToolkit:NumericUpDownExtender ID="NumericUpDownExtender3" runat="server"
                TargetControlID="TextBox3"
                Tag=""
                Width="120"
                ServiceUpPath="NumericUpDown.asmx"
                ServiceDownPath="NumericUpDown.asmx"
                ServiceUpMethod="NextValue"
                ServiceDownMethod="PrevValue"
                RefValues=""
                TargetButtonDownID=""
                TargetButtonUpID="" />
            <ajaxToolkit:NumericUpDownExtender ID="NumericUpDownExtender4" runat="server"
                TargetControlID="TextBox4"
                Width="80"
                TargetButtonDownID="img1"
                TargetButtonUpID="img2"
                RefValues=""
                ServiceDownMethod=""
                ServiceUpMethod="" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>NumericUpDown Description</Header>
        <Content>
            <div runat="server" data-control-type="NumericUpDownExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>NumericUpDown Properties</Header>
        <Content>
            <div runat="server" data-control-type="NumericUpDownExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>NumericUpDown Known Issues</Header>
        <Content>
            <p>
                The display of the default up/down buttons in Safari is such that Safari's "shiny" button
                style makes the up/down arrows difficult to see.  Custom images can be used for complete
                control over the appearance.
            </p>
        </Content>
    </samples:InfoBlock>
</asp:Content>
