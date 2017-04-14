<%@ Page Title="ResizableControl Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="ResizableControl.aspx.cs" Inherits="ResizableControl_ResizableControl" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    ResizableControl Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <p><strong>Resizable image with buttons for automatic resizing</strong></p>

    <asp:Panel ID="PanelImage" runat="server" CssClass="frameImage">
        <asp:Image ID="Image1" runat="server" ImageUrl="~/images/AJAX.gif"
            AlternateText="ASP.NET AJAX" Style="width: 100%; height: 100%;" />
    </asp:Panel>
    <div style="float: right; width: 160px; border: 1px dotted Gray; text-align: right">
        <asp:LinkButton ID="Button1" runat="server" Text="Submit" /><br />
        <asp:LinkButton ID="Button2" runat="server" Text="Shrink (via Server)" OnClick="Button2_Click" /><br />
        <asp:LinkButton ID="Button3" runat="server" Text="Grow (via Client)" OnClientClick="return OnClientClickGrow();" /><br />
        <p id="lastResize">Last image resize: Unknown</p>
    </div>
    <p><%= DemoData.ContentFillerText %></p>
    <p></p>

    <p><strong>Resizable text with "onresize" event handler</strong></p>
    <asp:Panel ID="PanelText" runat="server" CssClass="frameText">
        This text resizes itself to be as large as possible within its container.
    </asp:Panel>
    <p><%= DemoData.ContentFillerText %></p>

    <script type="text/javascript">
        function OnClientClickGrow() {
            var rcp = $find('ResizableControlBehavior1');
            var size = rcp.get_Size();
            rcp.set_Size({ width: size.width * 2, height: size.height * 2 });
            return false;
        }

        function OnClientResizeImage(sender, eventArgs) {
            $get("lastResize").innerHTML = "Last image resize at " + (new Date()).toString();
        }

        var fontSize = 12;
        function OnClientResizeText(sender, eventArgs) {
            // This sample code isn't very efficient, but demonstrates the idea well enough
            var e = sender.get_element();
            // Make the font bigger until it's too big
            while((e.scrollWidth <= e.clientWidth) || (e.scrollHeight <= e.clientHeight)) {
                e.style.fontSize = (fontSize++) + 'pt';
            }
            var lastScrollWidth = -1;
            var lastScrollHeight = -1;
            // Make the font smaller until it's not too big - or the last change had no effect
            // (for Opera where e.clientWidth and e.scrollWidth don't behave correctly)
            while(((e.clientWidth < e.scrollWidth) || (e.clientHeight < e.scrollHeight)) &&
                ((Sys.Browser.agent !== Sys.Browser.Opera) || (e.scrollWidth != lastScrollWidth) || (e.scrollHeight != lastScrollHeight))) {
                lastScrollWidth = e.scrollWidth;
                lastScrollHeight = e.scrollHeight;
                e.style.fontSize = (fontSize--) + 'pt';
            }
        }
    </script>

    <ajaxToolkit:ResizableControlExtender ID="ResizableControlExtender1" runat="server"
        BehaviorID="ResizableControlBehavior1"
        TargetControlID="PanelImage"
        ResizableCssClass="resizingImage"
        HandleCssClass="handleImage"
        MinimumWidth="50"
        MinimumHeight="26"
        MaximumWidth="250"
        MaximumHeight="170"
        HandleOffsetX="3"
        HandleOffsetY="3"
        OnClientResize="OnClientResizeImage" />
    <ajaxToolkit:ResizableControlExtender ID="ResizableControlExtender2" runat="server"
        TargetControlID="PanelText"
        ResizableCssClass="resizingText"
        HandleCssClass="handleText"
        MinimumWidth="100"
        MinimumHeight="50"
        MaximumWidth="400"
        MaximumHeight="150"
        OnClientResize="OnClientResizeText" />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>ResizableControl Description</Header>
        <Content>
            <div runat="server" data-control-type="ResizableControlExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>ResizableControl Properties</Header>
        <Content>
             <div runat="server" data-control-type="ResizableControlExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
