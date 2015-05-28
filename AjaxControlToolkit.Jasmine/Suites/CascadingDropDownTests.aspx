<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CascadingDropDownTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.CascadingDropDown" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <link rel="stylesheet" href="/Vendor/jasmine-2.2.0/jasmine.css" />

    <script src="/Vendor/jasmine-2.2.0/jasmine.js"></script>
    <script src="/Vendor/jasmine-2.2.0/jasmine-html.js"></script>
    <script src="/Vendor/jasmine-2.2.0/boot.js"></script>
    <script>
        if(parent && parent.Testing) {      // Run as an iframe
            var queryString = new jasmine.QueryString({
                getWindowLocation: function() { return window.location; }
            });
            var specIndex = +queryString.getParam("specIndex");

            var env = jasmine.getEnv();
            env.addReporter(parent.Testing.Reporter);
            env.specFilter = function(spec) {
                return spec.id === "spec" + (specIndex - 1);
            };
        }
    </script>

</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager runat="server" />
    </form>

    <script>
        describe("Cascading-Drop-Down", function() {

            describe("Inner-Suite", function() {

                it("runs1", function() {
                    expect(1).toBe(1);
                });

                it("runs1", function() {
                    expect(1).toBe(2);
                });

            });

            it("fails", function() {
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

            it("runs7", function() {
                expect(1).toBe(1);
            });
        });
    </script>

</body>
</html>
