<%@ Page Title="HoverMenu Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="HoverMenu.aspx.cs" Inherits="HoverMenu_HoverMenu" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    HoverMenu Demonstration
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <p>Mouse over the grid below to see the options for each row.</p>

    <asp:UpdatePanel ID="up1" runat="server">
        <ContentTemplate>

            <asp:GridView ID="GridView1" runat="server"
                AutoGenerateColumns="False" DataKeyNames="ItemID" DataSourceID="ObjectDataSource1"
                ShowHeader="False" Width="100%" BackColor="Azure" GridLines="None">
                <Columns>
                    <asp:TemplateField>
                        <ItemTemplate>
                            <asp:Panel CssClass="popupMenu" ID="PopupMenu" runat="server">
                                <div style="border: 1px outset white; padding: 2px;">
                                    <div>
                                        <asp:LinkButton ID="LinkButton1" runat="server" CommandName="Edit" Text="Edit" />
                                    </div>
                                    <div>
                                        <asp:LinkButton ID="LinkButton2" runat="server" CommandName="Delete" Text="Delete" />
                                    </div>
                                </div>
                            </asp:Panel>

                            <asp:Panel ID="Panel9" runat="server">
                                <table width="100%">
                                    <tr>
                                        <td width="25%">
                                            <asp:Label Font-Bold="true" ID="Label1" runat="server"
                                                Text='<%# HttpUtility.HtmlEncode(Convert.ToString(Eval("Title"))) %>' /></td>
                                        <td width="50%">
                                            <asp:Label ID="Label2" runat="server"
                                                Text='<%# HttpUtility.HtmlEncode(Convert.ToString(Eval("Description"))) %>' /></td>
                                        <td width="25%">
                                            <asp:Label ID="Label3" runat="server" Text='<%# Eval("Priority") %>' /></td>
                                    </tr>
                                </table>
                            </asp:Panel>

                            <ajaxToolkit:HoverMenuExtender ID="hme2" runat="Server"
                                HoverCssClass="popupHover"
                                PopupControlID="PopupMenu"
                                PopupPosition="Left"
                                TargetControlID="Panel9"
                                PopDelay="25" />
                        </ItemTemplate>
                        <EditItemTemplate>
                            <asp:Panel ID="Panel9" runat="server" Width="80%">
                                <table width="100%">
                                    <tr>
                                        <td width="30%">Title:<br />
                                            <asp:TextBox Font-Bold="true" ID="TextBox1" runat="server"
                                                Text='<%# Bind("Title") %>' Width="100" /></td>
                                        <td width="55%">Desc:<br />
                                            <asp:TextBox ID="TextBox2" runat="server"
                                                Text='<%# Bind("Description") %>' Width="150" /></td>
                                        <td width="15%">Pri:<br />
                                            <asp:TextBox ID="TextBox3" runat="server"
                                                Text='<%# Bind("Priority") %>' Width="40" /></td>
                                    </tr>
                                </table>
                            </asp:Panel>

                            <ajaxToolkit:HoverMenuExtender ID="hme1" runat="Server"
                                TargetControlID="Panel9"
                                PopupControlID="PopupMenu"
                                HoverCssClass="popupHover"
                                PopupPosition="Right" />

                            <asp:Panel ID="PopupMenu" runat="server" CssClass="popupMenu" Width="80">
                                <div style="border: 1px outset white">
                                    <asp:LinkButton ID="LinkButton1" runat="server"
                                        CausesValidation="True" CommandName="Update" Text="Update" />
                                    <br />
                                    <asp:LinkButton ID="LinkButton2" runat="server"
                                        CausesValidation="False" CommandName="Cancel" Text="Cancel" />
                                </div>
                            </asp:Panel>
                        </EditItemTemplate>
                    </asp:TemplateField>
                </Columns>
            </asp:GridView>
            <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" DeleteMethod="Delete"
                InsertMethod="Insert" OldValuesParameterFormatString="original_{0}" SelectMethod="Select"
                TypeName="SessionTodoXmlDataObject" UpdateMethod="Update">
                <DeleteParameters>
                    <asp:Parameter Name="Original_ItemID" Type="Int32" />
                </DeleteParameters>
                <UpdateParameters>
                    <asp:Parameter Name="Title" Type="String" />
                    <asp:Parameter Name="Description" Type="String" />
                    <asp:Parameter Name="Priority" Type="Int32" />
                    <asp:Parameter Name="Original_ItemID" Type="Int32" />
                </UpdateParameters>
                <InsertParameters>
                    <asp:Parameter Name="Title" Type="String" />
                    <asp:Parameter Name="Description" Type="String" />
                    <asp:Parameter Name="Priority" Type="Int32" />
                </InsertParameters>
            </asp:ObjectDataSource>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>HoverMenu Description</Header>
        <Content>
            <p>
                HoverMenu is an ASP.NET AJAX extender that can be attached to any ASP.NET WebControl, and will
            associate that control with a popup panel do display additional content.  When the user moves
            the mouse cursor over the main control two things happen:
            </p>
            <ol>
                <li>The popup panel is displayed at a position specified by the page developer (at the left, right,
                top, or bottom of the main control)</li>
                <li>Optionally, a CSS style is applied to the control
                to specify it as "hot"</li>
            </ol>
            <p>
                In the sample above, an ASP.NET GridView is populated with data from a database.  In each row of
            the GridView, a HoverMenu associates the content of the row with a Panel containing links that
            operate on that row.
            </p>
            <br />
            <p>
                Mouse over the GridView above to see this behavior.  Upon choosing "Edit", the row will go into
            edit mode, and you'll notice the menu will appear to the right of the content, demonstrating the
            ability to choose the popup position.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>HoverMenu Properties</Header>
        <Content>
            <p>
                Each row of the GridView above contains a HoverMenu which is initialized with this code.
            The <em>italic</em> properties are optional:
            </p>
            <pre>&lt;ajaxToolkit:HoverMenuExtender ID="hme2" runat="Server"
    TargetControlID="Panel9"
    PopupControlID="PopupMenu"
    <em>HoverCssClass="popupHover"
    PopupPosition="Left"
    OffsetX="0"
    OffsetY="0"
    PopDelay="50"</em> /&gt;</pre>
            <ul>
                <li><strong>TargetControlID</strong> - The control that the extender is targeting.
                When the mouse cursor is over this control, the hover menu popup will be displayed.</li>
                <li><strong>PopupControlID</strong> - The ID of the control to display when mouse is
                over the target control.  In this case, it's just a simple panel with two links:
                    <pre>&lt;asp:Panel CssClass="popupMenu" ID="PopupMenu" 
        runat="server"&gt;
        &lt;asp:LinkButton ID="LinkButton1" runat="server" 
            CommandName="Edit" Text="Edit" /&gt;
        &lt;br /&gt;
        &lt;asp:LinkButton ID="LinkButton2" runat="server" 
            CommandName="Delete" Text="Delete" /&gt;
    &lt;/asp:Panel&gt;</pre>
                </li>
                <li><strong>HoverCssClass</strong> - The CSS class to apply to the target when the hover
                menu popup is visible.</li>
                <li><strong>PopupPostion</strong> - Where the popup should be positioned relative to
                the target control. Can be Left (Default), Right, Top, Bottom, Center.</li>
                <li><strong>OffsetX/OffsetY</strong> - The number of pixels to offset the Popup from
                it's default position, as specified by PopupPosition. So if you want it to
                popup to the left of the target and have a 5px space between the popup and the target,
                the value should be "-5".</li>
                <li><strong>HoverDelay</strong> - The time, in milliseconds, before the popup displays after hovering over the target control.  Default is 0.</li>
                <li><strong>PopDelay</strong> - The time, in milliseconds, for the popup to remain visible after the mouse moves away from the target control. Default is 100.</li>
                <li><strong>Animations</strong> - Generic animations for the HoverMenu extender.  See the <a href="https://ajaxcontroltoolkit.codeplex.com/wikipage?title=Animation%20Control%20Reference">Animation Reference</a> for more details.
                <ul>
                    <li><strong>OnShow</strong> - The OnShow animation will be played each time the hover menu is displayed.
                        The hover menu will be positioned correctly but hidden.  The animation can use
                        <span class="codeReference">&lt;HideAction Visible="true" /&gt;</span> to display the hover
                        menu along with any other visual effects.</li>
                    <li><strong>OnHide</strong> - The OnHide animation will be played each time the hover menu is hidden.</li>
                </ul>
                </li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
