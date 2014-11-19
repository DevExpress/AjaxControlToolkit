<%@ Page Title="" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="Seadragon.aspx.cs" Inherits="Seadragon_Seadragon" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <style type="text/css">
        .seadragon {
            width: 470px;
            height: 400px;
            background-color: black;
            border: 1px solid black;
            color: white; /* text color for messages */
        }

        .overlay {
            background-color: white;
            opacity: 0.7;
            filter: alpha(opacity=70);
            border: 1px solid red;
        }
    </style>
    <div class="demoheading">
        Seadragon control with default properties
    </div>
    <ajaxToolkit:Seadragon ID="Seadragon" CssClass="seadragon" runat="server" SourceUrl="sample.xml">
    </ajaxToolkit:Seadragon>

    <div class="demoheading">
        Seadragon with a scalable overlay and a regular control
    </div>
    <ajaxToolkit:Seadragon ID="Seadragon2" CssClass="seadragon" runat="server" SourceUrl="dzc_output.xml">
        <ControlsCollection>
            <ajaxToolkit:SeadragonControl ID="SeadragonControl1" runat="server" Anchor="TopRight">
                <asp:Menu ID="Menu1" runat="server" BackColor="#FFFBD6" DynamicHorizontalOffset="2" Font-Names="Verdana"
                    Font-Size="10px" ForeColor="#990000" Orientation="Horizontal" StaticSubMenuIndent="10px"
                    Font-Bold="True">
                    <StaticSelectedStyle BackColor="#FFCC66" />
                    <StaticMenuItemStyle HorizontalPadding="5px" VerticalPadding="2px" />
                    <DynamicHoverStyle BackColor="#990000" ForeColor="White" />
                    <DynamicMenuStyle BackColor="#FFFBD6" />
                    <DynamicSelectedStyle BackColor="#FFCC66" />
                    <DynamicMenuItemStyle HorizontalPadding="5px" VerticalPadding="2px" />
                    <StaticHoverStyle BackColor="#990000" ForeColor="White" />
                    <Items>
                        <asp:MenuItem Text="Menu" Value="Menu" />
                        <asp:MenuItem Text="Control" Value="Control" />
                        <asp:MenuItem Text="Over" Value="Over" />
                        <asp:MenuItem Text="Seadragon" Value="Seadragon" />
                    </Items>
                </asp:Menu>
            </ajaxToolkit:SeadragonControl>
        </ControlsCollection>
        <OverlaysCollection>
            <ajaxToolkit:SeadragonScalableOverlay ID="SeadragonScalableOverlay1" runat="server" Rect-Height="0.24"
                Rect-Width="0.26" CssClass="overlay"
                Rect-Point-X="0.14" Rect-Point-Y="0.06">
            </ajaxToolkit:SeadragonScalableOverlay>
        </OverlaysCollection>
    </ajaxToolkit:Seadragon>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>Seadragon Description</Header>
        <Content>
            <p>
                The Seadragon control can be used for viewing Deep Zoom images. Use your mouse to pan and zoom around the image.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>Seadragon Properties</Header>
        <Content>
            <p>
                First example above is initialized with this code.
            </p>
            <pre>
&lt;ajaxToolkit:Seadragon ID="Seadragon"
	runat="server"
	SourceUrl="sample.xml"&gt;
	CssClass="seadragon"
&lt;/ajaxToolkit:Seadragon&gt;
</pre>
            <p>
                Second example above is initialized with this code.
            </p>
            <pre>
&lt;ajaxToolkit:Seadragon ID="Seadragon2"
  runat="server"
  CssClass="seadragon"
  SourceUrl="dzc_output.xml"&gt;
  &lt;ControlsCollection&gt;
    &lt;ajaxToolkit:SeadragonControl runat="server"
      Anchor="TOP_RIGHT"&gt;
      &lt;asp:Menu runat="server" ...&gt;
        <i>set menu style</i>
        &lt;Items&gt;
          &lt;asp:MenuItem Text="Menu" Value="Menu" /&gt;
          &lt;asp:MenuItem Text="Control" Value="Control" /&gt;
          &lt;asp:MenuItem Text="Over" Value="Over" /&gt;
          &lt;asp:MenuItem Text="Seadragon" Value="Seadragon" /&gt;
        &lt;/Items&gt;
      &lt;/asp:Menu&gt;
    &lt;/ajaxToolkit:SeadragonControl&gt;
  &lt;/ControlsCollection&gt;
  &lt;OverlaysCollection&gt;
    &lt;ajaxToolkit:SeadragonScalableOverlay 
      runat="server"
      Rect-Height="0.24"
      Rect-Width="0.26" 
      CssClass="overlay" 
      Rect-Point-X="0.14" 
      Rect-Point-Y="0.06"     
    &lt;/ajaxToolkit:SeadragonScalableOverlay&gt;
  &lt;/OverlaysCollection&gt;
&lt;/ajaxToolkit:Seadragon&gt;
</pre>
            <ul>
                <li><strong>animationTime </strong>- The amount of time in seconds that animations should last. Default is 1.5.</li>
                <li><strong>blendTime</strong> - The amount of time in seconds that new tiles take to blend from transparent to opaque. Default is 0.5.</li>
                <li><strong>alwaysBlend</strong> - Whether tiles should always blend in and out, not just when they're first loaded. Default is false.</li>
                <li><strong>autoHideControls</strong> - Whether controls should get automatically hidden when the user's mouse is off the viewer and the image has stopped animating. Default is true.</li>
                <li><strong>immediateRender</strong> - Whether the most appropriate tiles should always be rendered first, before any lower-res tiles are rendered. This loses the "sharpening" effect and instead creates a very visible "tiling" effect. Default is false.</li>
                <li><strong>minZoomDimension</strong> - The minimum size (in screen pixels) of either dimension that can result from zooming out. Default is 16.</li>
                <li><strong>maxZoomPixelRatio</strong> - The maximum pixel ratio (screen pixel to content pixel) that can result from zooming in. Default is 4.</li>
                <li><strong>visibilityRatio</strong> - The minimum portion of the viewport that must show visible content in both dimensions. Default is 0.1.</li>
                <li><strong>springStiffness</strong> - Determines how sharply the springs used for animations move. Default is 5.0.</li>
                <li><strong>imageLoaderLimit</strong> - The maximum number of concurrent image downloads that can be performed by each viewer. Default is 2.</li>
                <li><strong>clickTimeThreshold</strong> - The maximum number of milliseconds that can pass between a mousedown and a mouseup for the action to still be considered a "quick" click. Default is 200. </li>
                <li><strong>clickDistThreshold</strong> - The maximum number of pixels the mouse can move between a mousedown and a mouseup for the action to still be considered a "quick" click. Default is 5. </li>
                <li><strong>zoomPerClick</strong> - The factor by which images should zoom when clicked on. Default is 2.</li>
                <li><strong>zoomPerSecond</strong> - The factor by which images should zoom over each second when the zoom buttons are held down. Default is 2.</li>
                <li><strong>sourceUrl</strong> - The path for all UI images. This can be absolute or relative. If relative, it must be relative to the HTML page. A change to this value will only affect new viewers. Default is "img/". </li>
                <li><strong>showNavigationControl</strong> - Whether navigation buttons should be shown.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
