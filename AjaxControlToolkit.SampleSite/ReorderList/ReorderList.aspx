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
            <p>
                ReorderList is an ASP.NET AJAX control that implements a bulleted, data-bound list with items
                that can be reordered interactively.  To reorder the items in the list, the user simply drags
                the item's control bar to its new location.  Graphical feedback is shown where the item will
                be placed as it is dragged by the user.  The data source is updated after the item is dropped
                in its new location.
            </p>
            <br />
            <p>
                When bound to data, the ReorderList control will behave like many other databound controls. If
                the data you are displaying has a field that determines sort order (e.g. the select query is
                sorted by this column), and that column is of an integer type, the ReorderList can automatically
                perform reorders if its SortOrderField property is set.  The ReorderList can also bind to any data
                source that implements IList (such as Arrays).
            </p>
            <br />
            <p>
                The ReorderList control is different than the other samples here because it is an ASP.NET server
                control that is aware of ASP.NET AJAX behaviors.  Rather than extending existing controls on the
                page, it delivers a rich client experience directly and still has a traditional post-back server
                model for interacting with the application.
            </p>
            <br />
            <p>
                The ReorderList can handle reorders in two ways, either via a callback or via a postback.  For a
                callback, no page postback happens on a reorder.  This is useful if the data is only to be ordered.
                If the data items are to be deleted or edited, a full postback needs to occur to sync the server
                side state with the client side state.  The <b>PostbackOnReorder</b> property enables this.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>ReorderList Properties</Header>
        <Content>
             <p>
                The control above is initialized with this code. The <em>italic</em> properties are optional:
            </p>
            <pre>
&lt;ajaxToolkit:ReorderList ID="ReorderList1" runat="server" 
    DataSourceID="ObjectDataSource1"
    <em>DragHandleAlignment</em>="Left" 
    <em>ItemInsertLocation</em>="Beginning"
    DataKeyField="ItemID" 
    SortOrderField="Priority"
    AllowReorder="true"&gt;
        &lt;ItemTemplate&gt;...&lt;/ItemTemplate&gt;
        &lt;ReorderTemplate&gt;...&lt;/ReorderTemplate&gt;
        &lt;DragHandleTemplate&gt;...&lt;/DragHandleTemplate&gt;
        &lt;InsertItemTemplate&gt;...&lt;/InsertItemTemplate&gt;
&lt;/ajaxToolkit:ReorderList&gt;
            </pre>
            <ul>
                <li><strong>DataSourceID</strong> - The DataSource to use to populate this control</li>
                <li><strong>DataKeyField</strong> - The primary key field for the data</li>
                <li><strong>SortOrderField</strong> - The field that represents the sort order of the items.</li>
                <li><strong><em>ItemInsertLocation</em></strong> - Determines where new items are inserted into the list, can be Beginning or End</li>
                <li><strong><em>DragHandleAlignment</em></strong> - Where the drag handle should be relative to the item row - can be "Top", "Bottom", "Left", or "Right"</li>
                <li><strong>AllowReorder</strong> - whether to allow drag/drop reordering. This is automatically set to true if a ReorderTemplate is present</li>
                <li><strong>ItemTemplate</strong> - The template to display for items in the list</li>
                <li><strong>EditItemTemplate</strong> - The template do display for a row that is in edit mode</li>
                <li><strong>ReorderTemplate</strong> - The template to use to show the drop location when doing a reorder operation. This template is not data bindable.</li>
                <li><strong>InsertItemTemplate</strong> - The template to show for adding new items to the list.</li>
                <li><strong>DragHandleTemplate</strong> - The template for the drag handle that the user clicks and drags to reorder items.</li>
                <li><strong>EmptyListTemplate</strong> - The template to show when the list has no data. This item is not data-bindable.</li>
                <li><strong>PostbackOnReorder</strong> - Determines if reorders initiate a postback or callback. To use any edit or delete functionality of a data-bound list, postbacks must be enabled.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>

