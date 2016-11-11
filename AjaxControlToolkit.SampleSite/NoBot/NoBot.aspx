<%@ Page Title="NoBot Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="NoBot.aspx.cs" Inherits="NoBot_NoBot" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    NoBot Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:MultiView ID="MultiView1" runat="server">
        <asp:View ID="View1" runat="server">
            <p>Please fill out the form below and submit it:</p>
            <p>
                First Name:
                <asp:TextBox ID="TextBox1" runat="server" Text="Anonymous" /><br />
                Last Name:
                <asp:TextBox ID="TextBox2" runat="server" Text="User" />
            </p>
            <asp:Button ID="Button1" runat="server" Text="Submit" />
        </asp:View>
        <asp:View ID="View2" runat="server">
            <asp:Label ID="Label1" Font-Bold="true" runat="server" />
            <br />
            <p>Explanation of possible responses:</p>
            <ul>
                <li><b>Valid</b>: All NoBot tests passed; user appears to be human</li>
                <li><b>InvalidBadResponse</b>: An invalid response was provided to the challenge
                        suggesting the challenge script was not run</li>
                <li><b>InvalidResponseTooSoon</b>: The postback occurred quickly enough that a
                        human was probably not involved</li>
                <li><b>InvalidAddressTooActive</b>: The source IP address has submitted so many
                        responses that a human was probably not involved</li>
                <li><b>InvalidBadSession</b>: The ASP.NET session state for this session was unusable</li>
                <li><b>InvalidUnknown</b>: An unknown problem occurred</li>
            </ul>
            <br />
            <asp:HyperLink ID="HyperLink" runat="server" Text="Try again" NavigateUrl="~/NoBot/NoBot.aspx" />
            <br />
            <br />
            <div style="font-size: 8pt; background-color: #eeeeee; border-style: dashed; border-width: 1pt; padding: 3px">
                <p>NoBot's user address cache (time IP):</p>
                <p>
                    <asp:Label ID="Label2" runat="server" />
                </p>
            </div>
        </asp:View>
    </asp:MultiView>
    <ajaxToolkit:NoBot ID="NoBot1" runat="server" OnGenerateChallengeAndResponse="CustomChallengeResponse" />
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>NoBot Description</Header>
        <Content>
            <div runat="server" data-control-type="NoBot" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>NoBot Properties</Header>
        <Content>
            <div runat="server" data-control-type="NoBot" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
