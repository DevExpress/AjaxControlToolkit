<%@ Page Title="ReorderList Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="ReorderList.aspx.cs" Inherits="ReorderList_ReorderList" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    ReorderList Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <i>To Do:</i>
    <asp:UpdatePanel ID="up1" runat="server">
        <ContentTemplate>
            <div class="reorderListDemo">
                <ajaxToolkit:ReorderList ID="ReorderList1" runat="server"
                    PostBackOnReorder="false"
                    DataSourceID="ObjectDataSource1"
                    CallbackCssStyle="callbackStyle"
                    DragHandleAlignment="Left"
                    ItemInsertLocation="Beginning"
                    DataKeyField="ItemID"
                    SortOrderField="Priority">
                    <ItemTemplate>
                        <div class="itemArea">
                            <asp:Label ID="Label1" runat="server"
                                Text='<%# HttpUtility.HtmlEncode(Convert.ToString(Eval("Title"))) %>' />
                            <asp:Label ID="Label2" runat="server"
                                Text='<%# HttpUtility.HtmlEncode(Convert.ToString(Eval("Description", " - {0}"))) %>' />
                        </div>
                    </ItemTemplate>
                    <EditItemTemplate>
                        <div class="itemArea">
                            <asp:TextBox ID="TextBox2" runat="server" Text='<%# Bind("Title") %>' ValidationGroup="edit" />
                            <asp:TextBox ID="TextBox3" runat="server" Text='<%# Bind("Description") %>' ValidationGroup="edit" />
                            <asp:TextBox ID="TextBox4" runat="server" Text='<%# Bind("Priority") %>' ValidationGroup="edit" />
                        </div>
                    </EditItemTemplate>
                    <ReorderTemplate>
                        <asp:Panel ID="Panel2" runat="server" CssClass="reorderCue" />
                    </ReorderTemplate>
                    <DragHandleTemplate>
                        <div class="dragHandle"></div>
                    </DragHandleTemplate>
                    <InsertItemTemplate>
                        <!-- bottom border is workaround for IE7 Beta issue where bg doesn't render -->
                        <div style="padding-left: 25px; border-bottom: thin solid transparent;">
                            <asp:Panel ID="panel1" runat="server" DefaultButton="Button1">
                                <asp:TextBox ID="TextBox1" runat="server" Text='<%# Bind("Title") %>' ValidationGroup="add" />
                                <asp:Button ID="Button1" runat="server" CommandName="Insert" Text="Add" ValidationGroup="add" />
                                <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ValidationGroup="add"
                                    ErrorMessage="Please enter some text" ControlToValidate="TextBox1" />
                            </asp:Panel>
                        </div>
                    </InsertItemTemplate>
                </ajaxToolkit:ReorderList>
            </div>

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

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>ReorderList Description</Header>
        <Content>
            <div runat="server" data-control-type="ReorderList" data-content-type="description" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>ReorderList Properties</Header>
        <Content>
             <div runat="server" data-control-type="ReorderList" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>

