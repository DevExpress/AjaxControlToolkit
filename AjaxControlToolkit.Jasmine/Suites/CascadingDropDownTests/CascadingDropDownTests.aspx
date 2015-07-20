<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="CascadingDropDownTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.CascadingDropDownTests.CascadingDropDown" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">CascadingDropDown</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:DropDownList runat="server"
        ID="Target" />

    <act:CascadingDropDown runat="server"
        ID="TargetExtender"
        TargetControlID="Target"
        Category="Category"
        ServicePath="~/Suites/CascadingDropDownTests/TestWebService.asmx"
        ServiceMethod="GetContents" />
    <script>
        describe("Cascading-Drop-Down", function() {

            beforeEach(function(done) {
                this.target = document.getElementById("<%= Target.ClientID %>")
                this.targetExtender = $find("<%= TargetExtender.ClientID %>")


                var initPopulatedHandler = (function(targetExtender) {
                    return function() {
                        targetExtender.remove_populated(initPopulatedHandler);
                        done();
                    };
                })(this.targetExtender);

                this.targetExtender.add_populated(initPopulatedHandler);
            });

            // CodePlex item 27844
            it("fires populated event after been populated", function(done) {
                var category = "Bingo",
                    target = this.target;


                this.targetExtender.add_populated(function() {
                    expect(target.value).toMatch("^" + category);
                    done();
                });

                this.targetExtender.set_Category(category)
                this.targetExtender._onParentChange(null, false);
            })

        });
    </script>
</asp:Content>
