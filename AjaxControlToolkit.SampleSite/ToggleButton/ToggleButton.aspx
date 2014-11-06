<%@ Page Title="ToggleButton Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="ToggleButton.aspx.cs" Inherits="ToggleButton_ToggleButton" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    ToggleButton Demonstration
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <asp:CheckBox ID="CheckBox1" Checked="true" Text="I like ASP.NET" runat="server" /><br />
            <ajaxToolkit:ToggleButtonExtender ID="ToggleButtonExtender1" runat="server"
                TargetControlID="CheckBox1"
                ImageWidth="19"
                ImageHeight="19"
                UncheckedImageUrl="ToggleButton_Unchecked.gif"
                CheckedImageUrl="ToggleButton_Checked.gif"
                CheckedImageAlternateText="It's really nice to hear from you that you like ASP.NET"
                UncheckedImageAlternateText="I don't understand why you don't like ASP.NET" />

            <asp:CheckBox ID="CheckBox2" Checked="true" Text='I like ASP.NET AJAX' runat="server" /><br />
            <br />
            <ajaxToolkit:ToggleButtonExtender ID="ToggleButtonExtender2" runat="server"
                TargetControlID="CheckBox2"
                ImageWidth="19"
                ImageHeight="19"
                UncheckedImageUrl="ToggleButton_Unchecked.gif"
                CheckedImageUrl="ToggleButton_Checked.gif"
                CheckedImageAlternateText="It's really nice to hear from you that you like ASP.NET AJAX"
                UncheckedImageAlternateText="I don't understand why you don't like ASP.NET AJAX" />

            <asp:Button ID="Button1" runat="server" Text="Submit" OnClick="Button1_Click" />
            <br />
            <br />
            <asp:Label ID="Label1" runat="server" Text="[No response provided yet]" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>ToggleButton Description</Header>
        <Content>
            <p>
                ToggleButton is an ASP.NET AJAX extender that can be attached to an ASP.NET CheckBox control.
                ToggleButton enables the use of custom images to show the state of the CheckBox.
                The behavior of the CheckBox is unaffected.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>ToggleButton Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties
                are optional:
            </p>
            <pre>
&lt;ajaxToolkit:ToggleButtonExtender ID="ToggleEx" runat="server"
    TargetControlID="CheckBox1" 
    ImageWidth="19" 
    ImageHeight="19"
    <em>CheckedImageAlternateText</em>="Check"
    <em>UncheckedImageAlternateText</em>="UnCheck"
    UncheckedImageUrl="ToggleButton_Unchecked.gif" 
    CheckedImageUrl="ToggleButton_Checked.gif" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the CheckBox to modify</li>
                <li><strong>ImageHeight\ImageWidth</strong> - The height and width of the image</li>
                <li><strong>CheckedImageUrl</strong> - the URL of the image to show when the toggle button is in the checked state.</li>
                <li><strong>UncheckedImageUrl</strong> - the URL of the image to show when the toggle button is in the unchecked state. </li>
                <li><strong>DisabledCheckedImageUrl</strong> - the URL of the image to show when the toggle button is disabled and in the checked state.</li>
                <li><strong>DisabledUncheckedImageUrl</strong> - the URL of the image to show when the toggle button is disabled and in the unchecked state. </li>
                <li><strong>CheckedImageOverUrl</strong> - the URL of the image to show when the toggle button is in the checked state and the mouse is over the button.</li>
                <li><strong>UncheckedImageOverUrl</strong> - the URL of the image to show when the toggle button is in the unchecked state and the mouse is over the button.</li>
                <li><strong>CheckedImageAlternateText</strong> - the alt text to show when the toggle button is in the checked state.</li>
                <li><strong>UncheckedImageAlternateText</strong> - the alt text to show when the toggle button is in the unchecked state.</li>
                <li><strong>CheckedImageOverAlternateText</strong> - the alt text to show when the toggle button is in the checked state and the mouse is over the button.</li>
                <li><strong>UncheckedImageOverAlternateText</strong> - the alt text to show when the toggle button is in the unchecked state and the mouse is over the button.</li>
                <li><strong>ImageHeight/ImageWidth</strong> - The height and width, respectively, of the image that will be displayed.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>

