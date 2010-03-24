<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultTests.master"
    AutoEventWireup="true"
    CodeFile="5389.aspx.cs"
    Inherits="Patch5389"
    Title="AsyncFileUpload Sample"
    Theme="SampleSiteTheme" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">
    <link href="../../StyleSheet.css" rel="stylesheet" type="text/css" />
    <div class="demoarea">
        <div class="demoheading">ReorderList Demonstration</div>
        <i>To Do:</i>
        <asp:UpdatePanel ID="up1" runat="server">
            <ContentTemplate>
                <div class="reorderListDemo">
                    <asp:ReorderList ID="ReorderList1" runat="server"
                        PostBackOnReorder="true"
                        DataSourceID="ObjectDataSource1"
                        CallbackCssStyle="callbackStyle"
                        DragHandleAlignment="Left"
                        ItemInsertLocation="Beginning"
                        DataKeyField="ItemID"
                        SortOrderField="Priority">
                        <ItemTemplate>
                            <div class="itemArea">
                                <asp:Button runat="server" CommandName="Edit" Text="Edit" ValidationGroup="edit" />
                                <asp:Label ID="Label1" runat="server"
                                    Text='<%# HttpUtility.HtmlEncode(Convert.ToString(Eval("Title"))) %>' />
                                <asp:Label ID="Label2" runat="server"
                                    Text='<%# HttpUtility.HtmlEncode(Convert.ToString(Eval("Description", " - {0}"))) %>' />
                            </div>
                        </ItemTemplate>
                        <EditItemTemplate>
                            <div class="itemArea">
                                <asp:Button runat="server" CommandName="Update" Text="OK" ValidationGroup="edit" />
                                <asp:Button runat="server" CommandName="Cancel" Text="Cancel" ValidationGroup="edit" />
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
                            <div style="padding-left:25px; border-bottom:thin solid transparent;">
                                <asp:Panel ID="panel1" runat="server" DefaultButton="Button1">
                                    <asp:TextBox ID="TextBox1" runat="server" Text='<%# Bind("Title") %>' ValidationGroup="add" />
                                    <asp:Button ID="Button1" runat="server" CommandName="Insert" Text="Add"  ValidationGroup="add" />
                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ValidationGroup="add"
                                        ErrorMessage="Please enter some text" ControlToValidate="TextBox1" />
                                </asp:Panel>
                            </div>
                        </InsertItemTemplate>
                    </asp:ReorderList>
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
    </div>
</asp:Content>
