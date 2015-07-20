<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="ReleaseEmbeddedTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager.ToolkitResourceManager_ReleaseEmbedded" %>

<%@ Register Assembly="AjaxControlToolkit.Jasmine" Namespace="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager" TagPrefix="test" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">ToolkitResourceManager Debug Embedded</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:TextBox runat="server" ID="Target" />
    <test:TestExtender runat="server" TargetControlID="Target" />

    <script>
        describe("ToolkitResourceManager", function() {

            describe("Embedded", function() {

                it("loads embedded release custom script", function() {
                    var extender = Sys.Extended.UI.TestExtender;

                    expect(extender.ScriptMode).toBe("Release");
                    expect(extender.ScriptSource).toBe("Embedded");
                });

                it("loads embedded release script", function() {
                    expect(Sys.Extended.UI.BehaviorBase).not.toBeUndefined();
                })

            });

        });
    </script>
</asp:Content>
