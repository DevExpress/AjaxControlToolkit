<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="DropDownTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.DropDownTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    DropDown
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:Label ID="TestLabel" runat="server" Text="Test DropDown text" />

    <asp:Panel ID="TestDropPanel" runat="server">
        <asp:LinkButton runat="server" ID="Option1" Text="Option 1" />
        <asp:LinkButton runat="server" ID="Option2" Text="Option 2" />
        <asp:LinkButton runat="server" ID="Option3" Text="Option 3" />
    </asp:Panel>

    <act:DropDownExtender runat="server"
        ID="TargetExtender"
        TargetControlID="TestLabel"
        DropDownControlID="TestDropPanel"
        HighlightBackColor="yellow" />

    <script>
        describe("DropDown", function() {

            var DROPDOWN_CLIENT_ID = "<%= TargetExtender.ClientID %>";

            describe("Rendering", function() {

                beforeEach(function() {
                    this.extender = $find(DROPDOWN_CLIENT_ID);

                    this.$element = $(this.extender._element);
                });

                it("back color highlights on hover when color is set in basic format", function() {
                    this.extender.set_highlightBackgroundColor("red");

                    this.extender.hover();

                    expect(this.$element.css("background-color")).toBe("rgb(255, 0, 0)");
                });

                it("back color highlights on hover when color is set in hex format", function() {
                    this.extender.set_highlightBackgroundColor("#00ff00");

                    this.extender.hover();

                    expect(this.$element.css("background-color")).toBe("rgb(0, 255, 0)");
                });

                it("back color highlights on hover when color is set in 3-value format", function() {
                    this.extender.set_highlightBackgroundColor("0, 0, 255");

                    this.extender.hover();

                    expect(this.$element.css("background-color")).toBe("rgb(0, 0, 255)");
                });
            });
        });
    </script>
</asp:Content>