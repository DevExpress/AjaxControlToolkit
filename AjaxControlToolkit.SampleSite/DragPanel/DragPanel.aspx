<%@ Page Title="DragPanel Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="DragPanel.aspx.cs" Inherits="DragPanel_DragPanel" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    DragPanel Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <script type="text/javascript">
        // The following snippet works around a problem where FloatingBehavior
        // doesn't allow drops outside the "content area" of the page - where "content
        // area" is a little unusual for our sample web pages due to their use of CSS
        // for layout.
        function setBodyHeightToContentHeight() {
            document.body.style.height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) + "px";
        }
        setBodyHeightToContentHeight();
        $addHandler(window, "resize", setBodyHeightToContentHeight);
    </script>
    <div style="height: 300px; width: 250px; float: left; padding: 5px;">
        <asp:Panel ID="Panel6" runat="server" Width="250px" Style="z-index: 20;">
            <asp:Panel ID="Panel7" runat="server" Width="100%" Height="20px"
                BorderStyle="Solid" BorderWidth="2px" BorderColor="black">
                <div class="dragMe">Drag Me</div>
            </asp:Panel>
            <asp:Panel ID="Panel8" runat="server" Width="100%" Height="250px"
                Style="overflow: scroll;" BackColor="#0B3D73" ForeColor="whitesmoke"
                BorderWidth="2px" BorderColor="black" BorderStyle="Solid">
                <div>
                    <p>This panel will reset its position on a postback or page refresh.</p>
                    <hr />
                    <p><%= DemoData.ContentFillerText %></p>
                </div>
            </asp:Panel>
        </asp:Panel>
    </div>
    <div style="clear: both;"></div>

    <ajaxToolkit:DragPanelExtender ID="DragPanelExtender1" runat="server"
        TargetControlID="Panel6"
        DragHandleID="Panel7" />
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>DragPanel Description</Header>
        <Content>
            <p>
                The DragPanel extender allows users to easily add "draggability" to their controls.  The
                DragPanel targets any ASP.NET Panel and takes an additional parameter that signifies the
                control to use as the "drag handle".  Once initialized, the user can freely drag the panel
                around the web page using the drag handle.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>DragPanel Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code:<br />
            </p>
            <pre>
&lt;ajaxToolkit:DragPanelExtender ID="DPE1" runat="server"
    TargetControlID="Panel3"
    DragHandleID="Panel4" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of a Panel to make draggable.</li>
                <li><strong>DragHandleID</strong> - The ID of a control that will serve as the "drag handle" for the panel.  When the user clicks and drags this control, the panel will move.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
