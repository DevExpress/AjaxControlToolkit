<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="CascadingDropDownTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.CascadingDropDownTests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">
    CascadingDropDown
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <script>
        describe("Cascading-Drop-Down", function() {

            describe("Inner-Suite", function() {

                it("runs1", function() {
                    expect(1).toBe(1);
                });

                it("runs1", function() {
                    expect(1).toBe(1);
                });

                it("fails1", function() {
                    expect(1).toBe(2);
                });

            });

            it("fails2", function() {
                expect(1).toBe(2);
            });

            it("runs3", function() {
                expect(1).toBe(1);
            });

            it("runs4", function() {
                expect(1).toBe(1);
            });

            it("runs5", function() {
                expect(1).toBe(1);
            });

            it("runs6", function() {
                expect(1).toBe(1);
            });

            it("fails3", function() {
                expect(1).toBe(2);
            });

            it("runs7", function() {
                expect(1).toBe(1);
            });
        });
    </script>
</asp:Content>
