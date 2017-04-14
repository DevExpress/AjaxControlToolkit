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
            <div runat="server" data-control-type="Seadragon" data-content-type="description" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>Seadragon Properties</Header>
        <Content>
            <div runat="server" data-control-type="Seadragon" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
