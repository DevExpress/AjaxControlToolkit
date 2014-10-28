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
            <p>
                NumericUpDown is an ASP.NET AJAX extender that can be attached to an ASP.NET TextBox control
                to add "up" and "down" buttons that increment and decrement the value in the TextBox.  The
                increment and decrement can be simple +1/-1 arithmetic, they can cycle through a provided list
                of values (like the months of the year), or they can call a Web Service to determine the next
                value.  Page authors can also provide custom images to be used instead of the default up/down
                button graphics.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>NumericUpDown Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties
                are optional:
            </p>
            <pre>
&lt;ajaxToolkit:NumericUpDownExtender ID="NUD1" runat="server"
    TargetControlID="TextBox1" 
    Width="100"
    <em>RefValues</em>="January;February;March;April"
    <em>TargetButtonDownID</em>="Button1"
    <em>TargetButtonUpID</em>="Button2"
    <em>ServiceDownPath</em>="WebService1.asmx"
    <em>ServiceDownMethod</em>="PrevValue"
    <em>ServiceUpPath</em>="WebService1.asmx"
    <em>ServiceUpMethod</em>="NextValue"
    <em>Tag</em>="1" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the TextBox to modify</li>
                <li><strong>Width</strong> - Combined size of the TextBox and Up/Down buttons (min value 25).
                    This property is not used if you provide custom buttons.</li>
                <li><strong>RefValues</strong> - A list of strings separated by semicolons (;) to be used as
                    an enumeration by NumericUpDown</li>
                <li><strong>Step</strong> - Step used for simple numeric incrementing and decrementing.
                    The default value is 1.</li>
                <li><strong>TargetButtonDownID/TargetButtonUpID</strong> - Reference to custom Up/Down buttons.</li>
                <li><strong>ServiceDownPath/ServiceUpPath</strong> - Path to a web service that returns the
                    data used to get the next or previous value.  This property should be left null if ServiceUpMethod
                    or ServiceDownMethod refers to a page method.  The web service should be decorated with the
                    System.Web.Script.Services.ScriptService attribute.</li>
                <li><strong>ServiceDownMethod/ServiceUpMethod</strong> - Web service method that returns the data
                    used to get the next or previous value, or the name of a method declared on the Page which is
                    decorated with the WebMethodAttribute.  The signature of this method must match the following:
            <pre>
[System.Web.Services.WebMethod]
[System.Web.Script.Services.ScriptMethod]
public int NextValue(int current, string tag) { ... }
            </pre>
                    Note you can replace "NextValue" with a name of your choice, but the return type and parameter
                    name and type must exactly match, including case.
                </li>
                <li><strong>Tag</strong> - Specifies a custom parameter to pass to the Web Service</li>
                <li><strong>Minimum</strong> - The minimum value allowed by the extender. Currently,
                it does not prevent out of range values from being entered into the textbox even if Minimum 
                or Maximum are specified on the extender, but using the up/down buttons should bring the 
                value into the allowed range when clicked.</li>
                <li><strong>Maximum</strong> - The maximum value allowed by the extender.</li>
            </ul>
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
