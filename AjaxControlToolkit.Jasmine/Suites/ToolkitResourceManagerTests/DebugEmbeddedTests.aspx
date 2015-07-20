<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="DebugEmbeddedTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager.ToolkitResourceManager_DebugEmbedded" %>

<%@ Register Assembly="AjaxControlToolkit.Jasmine" Namespace="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager" TagPrefix="test" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">ToolkitResourceManager Debug Embedded</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:TextBox runat="server" ID="Target" />
    <test:TestExtender runat="server" TargetControlID="Target" />

    <script>
        describe("ToolkitResourceManager", function() {

            describe("Embedded", function() {

                it("loads custom embedded debug script", function() {
                    var extender = Sys.Extended.UI.TestExtender;

                    expect(extender.ScriptMode).toBe("Debug");
                    expect(extender.ScriptSource).toBe("Embedded");
                });

                it("loads embedded debug script", function() {
                    expect(Sys.Extended.UI.BehaviorBase).not.toBeUndefined();
                })

            });

        });
    </script>
</asp:Content>
