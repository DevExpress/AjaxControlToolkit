<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="ReorderListTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ReorderListTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    ReorderList
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <style>
        ul {
            list-style: none;
            font-family: Tahoma;
            font-size: 12px;
        }

        .drag-handle {
            background-color: darkblue;
            border: 1px solid white;
            height: 15px;
            width: 10px;
        }

        .callback-style {
            border: thin blue inset;
        }

        .callback-style table {
            background-color: #5377A9;
            color: Black;
        }

        .reorder-cue {
            border: dashed thin black;
            width: 100%;
            height: 20px;
        }
    </style>

    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <act:ReorderList runat="server" ID="ReorderList"
                PostBackOnReorder="false"
                DataSourceID="TestObjectDataSource"
                CallbackCssStyle="callback-style"
                DragHandleAlignment="Left"
                ItemInsertLocation="Beginning"
                DataKeyField="ID"
                SortOrderField="Priority">
                <ItemTemplate>
                    <div>
                        <asp:Label runat="server" Text='<%# Eval("Title") %>' />
                        -
                        <asp:Label runat="server" Text='<%# Eval("Description") %>' />
                    </div>
                </ItemTemplate>

                <ReorderTemplate>
                    <asp:Panel runat="server" CssClass="reorder-cue"/>
                </ReorderTemplate>

                <DragHandleTemplate>
                    <div class="drag-handle"></div>
                </DragHandleTemplate>

                <InsertItemTemplate>
                    <asp:Panel runat="server">
                        <asp:TextBox ID="ItemTitleTextBox" runat="server" Text='<%# Bind("Title") %>' />
                        <asp:Button runat="server" CommandName="Insert" Text="Add" />
                    </asp:Panel>
                </InsertItemTemplate>
            </act:ReorderList>

            <asp:ObjectDataSource runat="server"
                ID="TestObjectDataSource"
                TypeName="AjaxControlToolkit.Jasmine.Suites.ReorderListItems"
                SelectMethod="GetItems"
                InsertMethod="InsertItem"
                UpdateMethod="UpdateItem" />
        </ContentTemplate>
    </asp:UpdatePanel>

    <script>
        describe("ReorderList", function() {

            var REORDER_LIST_CLIENT_ID = "<%= ReorderList.ClientID %>";

            describe("Rendering", function() {
               
                beforeEach(function() {
                    this.$container = $("#" + REORDER_LIST_CLIENT_ID);
                });

                it("container contains marked lists", function() {
                    expect(this.$container.children("ul").length).toBe(2);
                });

                it("container list element contains table", function() {
                    var $listElement = this.$container.find("li").first();

                    expect($listElement.children("table").length).toBe(1);
                });

                beforeEach(function() {
                    this.$listElementTable = this.$container.find("li table").first()
                });

                it("list element table hasn't cellpadding attribute", function() {
                    expect(this.$listElementTable.attr("cellpadding")).toBeFalsy();
                });

                it("list element table cell has proper padding", function() {
                    var $cell = this.$listElementTable.find("td").first();

                    expect($cell.css("padding-top")).toBeAnyOf(["0", "0px"]);
                    expect($cell.css("padding-right")).toBeAnyOf(["0", "0px"]);
                    expect($cell.css("padding-bottom")).toBeAnyOf(["0", "0px"]);
                    expect($cell.css("padding-left")).toBeAnyOf(["0", "0px"]);
                });

                it("list element table hasn't cellspacing attribute", function() {
                    expect(this.$listElementTable.attr("cellspacing")).toBeFalsy();
                });

                it("list element table has proper border spacing", function() {
                    expect(this.$listElementTable.css("border-spacing")).toBeAnyOf(["0 0", "0px 0px"]);
                });
            });
        });
    </script>

</asp:Content>
