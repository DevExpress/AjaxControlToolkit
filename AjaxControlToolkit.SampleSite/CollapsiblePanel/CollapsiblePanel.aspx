<%@ Page Title="CollapsiblePanel Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="CollapsiblePanel.aspx.cs" Inherits="CollapsiblePanel_CollapsiblePanel" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    CollapsiblePanel Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:Panel ID="Panel2" runat="server" CssClass="collapsePanelHeader" Height="30px">
        <div style="padding: 5px; cursor: pointer; vertical-align: middle;">
            <div style="float: left;">What is ASP.NET AJAX?</div>
            <div style="float: left; margin-left: 20px;">
                <asp:Label ID="Label1" runat="server">(Show Details...)</asp:Label>
            </div>
            <div style="float: right; vertical-align: middle;">
                <asp:ImageButton ID="Image1" runat="server" ImageUrl="~/images/expand_blue.jpg" AlternateText="(Show Details...)" />
            </div>
        </div>
    </asp:Panel>
    <asp:Panel ID="Panel1" runat="server" CssClass="collapsePanel" Height="0">
        <br />
        <p>
            <asp:ImageButton ID="Image2" runat="server" ImageUrl="~/Images/AJAX.gif"
                AlternateText="ASP.NET AJAX" ImageAlign="right" />
            <%= DemoData.ContentFillerText %>
        </p>
    </asp:Panel>

    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDemo" runat="Server"
        TargetControlID="Panel1"
        ExpandControlID="Panel2"
        CollapseControlID="Panel2"
        Collapsed="True"
        TextLabelID="Label1"
        ImageControlID="Image1"
        ExpandedText="(Hide Details...)"
        CollapsedText="(Show Details...)"
        ExpandedImage="~/Images/collapse_blue.jpg"
        CollapsedImage="~/Images/expand_blue.jpg"
        SuppressPostBack="true"
        SkinID="CollapsiblePanelDemo" />

</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>CollapsiblePanel Description</Header>
        <Content>
            <p>
	            The CollapsiblePanel is a very flexible extender that allows you to easily add collapsible
	            sections to your web page.  This extender targets any ASP.NET Panel control.  The page developer
	            specifies which control(s) on the page should be the open/close controller for the panel, or the
	            panel can be set to automatically expand and/or collapse when the mouse cursor moves in or out
	            of it, respectively.
	        </p>
	        <br />
	        <p>
	            The panel is also post-back aware.  On a client postback, it automatically remembers and restores
	            its client state.  This demonstrates the ability of these extenders to have some communication
	            between the client and the server code.  Click
	            <asp:LinkButton ID="LinkButton2" runat="server">here</asp:LinkButton> to cause a postback.
	        </p>
	        <br />
	        <p>
	            The page developer can specify whether the panel should scroll when it does not expand to the full
	            size of its contents, and can also specify whether the panel expands in the height or width dimensions.
	        </p>
	        <br />
	        <p>
	            Note: CollapsiblePanel assumes that the standard CSS box model is being used. Early versions of
	            Internet Explorer
	            <a href="http://msdn2.microsoft.com/en-us/library/ms535242.aspx">didn't support that model completely</a>,
	            so please use the <strong style="white-space:nowrap">!DOCTYPE</strong> declaration (as found at the top
	            of this page and enabled by default for new ASP.NET pages) to specify that the page should be rendered
	            in IE's standards-compliant mode.
	        </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>CollapsiblePanel Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties are optional:
            </p>
        <pre>
&lt;ajaxToolkit:CollapsiblePanelExtender ID="cpe" runat="Server"
    TargetControlID="Panel1"
    <em>CollapsedSize</em>="0"
    <em>ExpandedSize</em>="300"
    <em>Collapsed</em>="True"
    <em>ExpandControlID</em>="LinkButton1"
    <em>CollapseControlID</em>="LinkButton1"
    <em>AutoCollapse</em>="False"
    <em>AutoExpand</em>="False"
    <em>ScrollContents</em>="True"
    <em>TextLabelID</em>="Label1"
    <em>CollapsedText</em>="Show Details..."
    <em>ExpandedText</em>="Hide Details" 
    <em>ImageControlID</em>="Image1"
    <em>ExpandedImage</em>="~/images/collapse.jpg"
    <em>CollapsedImage</em>="~/images/expand.jpg"
    <em>ExpandDirection</em>="Vertical" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - the Panel to operate expand and collapse.</li>
                <li><strong>CollapsedSize</strong> - The size of the target, in pixels, when it is in the collapsed state.</li>
                <li><strong>ExpandedSize</strong> - The size of the target, in pixels, when it is in the opened state.</li>
                <li><strong>Collapsed</strong> - Specifies that the object should initially be collapsed or expanded.
                    Set this to match your initial size. In this case, we initially set the panel to a height of 0 to
                    match the CollapsedSize property, so when the page first renders, we don't see the panel expanded.</li>
                <li><strong>AutoCollapse</strong> - True to automatically collapse when the mouse is moved off the panel.</li>
                <li><strong>AutoExpand</strong> - True to automatically expand when the mouse is moved over the panel.</li>
                <li><strong>ScrollContents</strong> - True to add a scrollbar if the contents are larger than the panel
                    itself. False to just clip the contents.</li>
                <li><strong>ExpandControlID/CollapseControlID</strong> - The controls that will expand or collapse the panel
                    on a click, respectively. If these values are the same, the panel will automatically toggle its state on
                    each click.</li>
                <li><strong>TextLabelID</strong> - The ID of a label control where the "status text" for the panel will be
                    placed. The panel will replace the internal HTML of this control (e.g. any HTML between the tags).</li>
                <li><strong>CollapsedText</strong> - The text to show in the control specified by TextLabelID when the panel
                    is collapsed.  This text is also used as the alternate text of the image if ImageControlID is set.</li>
                <li><strong>ExpandedText</strong> - The text to show in the control specified by TextLabelID when the panel is
                    opened.  This text is also used as the alternate text of the image if ImageControlID is set.</li>
                <li><strong>ImageControlID</strong> - The ID of an Image control where an icon indicating the collapsed status
                    of the panel will be placed.  The extender will replace the source of this Image with the CollapsedImage
                    and ExpandedImage urls as appropriate.  If the ExpandedText or CollapsedText properties are set, they are
                    used as the alternate text for the image.</li>
                <li><strong>CollapsedImage</strong> - The path to an image used by ImageControlID when the panel is collapsed</li>
                <li><strong>ExpandedImage</strong> - The path to an image used by ImageControlID when the panel is expanded</li>
                <li><strong>ExpandDirection</strong> - can be "Vertical" or "Horizontal" to determine whether the panel expands
                    top-to-bottom or left-to-right.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
