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
            <p>
                NoBot is a control that attempts to provide <a href="http://en.wikipedia.org/wiki/Captcha">CAPTCHA</a>-like
                bot/spam prevention without requiring any user interaction.  This approach is easier to bypass than an
                implementation that requires actual human intervention, but NoBot has the benefit of being completely
                invisible.  NoBot is probably most relevant for low-traffic sites where blog/comment spam is a problem
                and 100% effectiveness is not required.
            </p>
            <br />
            <p>
                NoBot employs a few different anti-bot techniques:
            </p>
            <ul>
                <li>Forcing the client's browser to perform a configurable JavaScript calculation and verifying the
                    result as part of the postback. (Ex: the calculation may be a simple numeric one, or may also
                    involve the DOM for added assurance that a browser is involved)</li>
                <li>Enforcing a configurable delay between when a form is requested and when it can be posted back.
                    (Ex: a human is unlikely to complete a form in less than two seconds)</li>
                <li>Enforcing a configurable limit to the number of acceptable requests per IP address per unit of
                    time. (Ex: a human is unlikely to submit the same form more than five times in one minute)</li>
            </ul>
            <br />
            <p>
                NoBot can be tested by violating any of the above techniques: posting back quickly, posting back
                many times, or disabling JavaScript in the browser.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>NoBot Properties</Header>
        <Content>
            <p>The control above is initialized with this code. The <em>italic</em> properties are optional:</p>
            <pre>
&lt;ajaxToolkit:NoBot
    ID="NoBot2"
    runat="server"
    <em>OnGenerateChallengeAndResponse</em>="CustomChallengeResponse"
    <em>ResponseMinimumDelaySeconds</em>="2"
    <em>CutoffWindowSeconds</em>="60"
    <em>CutoffMaximumInstances</em>="5" /&gt;
            </pre>
            <ul>
                <li><strong>OnGenerateChallengeAndResponse</strong> - Optional EventHandler&lt;NoBotEventArgs&gt;
                    providing a custom implementation of the challenge/response code</li>
                <li><strong>ResponseMinimumDelaySeconds</strong> - Optional minimum number of seconds before which
                    a response (postback) is considered valid</li>
                <li><strong>CutoffWindowSeconds</strong> - Optional number of seconds specifying the length of the
                    cutoff window that tracks previous postbacks from each IP address</li>
                <li><strong>CutoffMaximumInstances</strong> - Optional maximum number of postbacks to allow by a
                    single IP addresses within the cutoff window</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
