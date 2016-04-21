<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="PagingBulletedListTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.PagingBulletedListTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    PagingBulletedList
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:UpdatePanel runat="server">
        <ContentTemplate>

            <asp:BulletedList ID="TestList" runat="server" DisplayMode="LinkButton" BulletStyle="Square">
                <asp:ListItem Text="A" Value="A" />
                <asp:ListItem Text="B" Value="B" />
                <asp:ListItem Text="C" Value="C" />
                <asp:ListItem Text="D" Value="D" />
                <asp:ListItem Text="E" Value="E" />
                <asp:ListItem Text="F" Value="F" />
                <asp:ListItem Text="G" Value="G" />
                <asp:ListItem Text="H" Value="H" />
            </asp:BulletedList>

            <act:PagingBulletedListExtender
                ID="TargetExtender"
                runat="server"
                ClientSort="True"
                Enabled="True"
                TargetControlID="TestList" />

        </ContentTemplate>
    </asp:UpdatePanel>

    <script>
        describe("PagingBulletedList", function() {

            var BULLET_LIST_CLIENT_ID = "<%= TestList.ClientID %>";
            var BULLET_LIST_UNIQUE_ID = "<%= TestList.UniqueID %>";
            var EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID %>";

            describe("Rendering", function() {

                beforeEach(function() {
                    this.extender = $find(EXTENDER_CLIENT_ID);

                    this.$element = $(this.extender._element);
                    this.$pageContainer = $("#" + BULLET_LIST_CLIENT_ID).parent().prev();
                });

                it("client state saves selected item", function(done) {
                    var target = this.$pageContainer.children().eq(2)[0];
                    var event = createMouseEvent("click", target);
                    target.dispatchEvent(event);

                    __doPostBack(BULLET_LIST_UNIQUE_ID, '1');

                    setTimeout(function() {
                        $listElement = $("#" + BULLET_LIST_CLIENT_ID + " > li > a");
                        expect($listElement.text()).toBe("B");
                        done();
                    }, 200);
                    
                });
            });
        });
    </script>
</asp:Content>
