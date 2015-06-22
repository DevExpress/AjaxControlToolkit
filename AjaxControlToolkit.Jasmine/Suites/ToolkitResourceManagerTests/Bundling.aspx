<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="Bundling.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManagerTests.Bundling" %>

<%@ Register Assembly="AjaxControlToolkit.Jasmine" Namespace="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager" TagPrefix="test" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">ToolkitResourceManager Bundling</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:TextBox runat="server" ID="Target" />
    <test:TestExtender runat="server" TargetControlID="Target" />

    <script>
        describe("ToolkitResourceManager", function() {

            describe("Bundling", function() {

                it("loads only static for testing purposes", function() {
                    var embeddedScriptsQty = 0;
                    $.each(document.scripts, function() {
                        if(this.attributes["src"] && this.attributes["src"].value.startsWith("/ScriptResource"))
                            embeddedScriptsQty += 1;
                    });

                    expect(embeddedScriptsQty).toBe(0);
                });

                it("loads one bundle", function() {
                    var bundlesQty = 0;
                    $.each(document.scripts, function() {
                        if(this.attributes["src"] && /\/Scripts\/AjaxControlToolkit\/Bundle\?v=.+/.test(this.attributes["src"].value))
                            bundlesQty += 1;
                    });

                    expect(bundlesQty).toBe(1);
                });

                it("loads static debug custom script", function() {
                    var extender = Sys.Extended.UI.TestExtender;

                    expect(extender.ScriptMode).toBe("Debug");
                    expect(extender.ScriptSource).toBe("Static");
                });

                it("loads debug base script", function() {
                    var base = Sys.Extended.UI.BehaviorBase;

                    expect(base.ScriptSource).toBe("Static");
                })
            });

        });
    </script>

</asp:Content>
