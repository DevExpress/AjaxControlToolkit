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
            <div runat="server" data-control-type="HoverMenuExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>HoverMenu Properties</Header>
        <Content>
            <div runat="server" data-control-type="HoverMenuExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
