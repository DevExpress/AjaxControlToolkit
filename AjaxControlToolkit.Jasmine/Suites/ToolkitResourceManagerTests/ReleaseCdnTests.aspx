<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="ReleaseCdnTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManagerTests.ReleaseCdn" %>

<%@ Register Assembly="AjaxControlToolkit.Jasmine" Namespace="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager" TagPrefix="test" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">ToolkitResourceManager Release CDN</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:TextBox runat="server" ID="Target" />
    <test:TestExtender runat="server" TargetControlID="Target" />

    <script>
        describe("ToolkitResourceManager", function() {

            describe("CDN", function() {

                it("loads cdn release custom script", function() {
                    var extender = Sys.Extended.UI.TestExtender;

                    expect(extender.ScriptMode).toBe("Release");
                    expect(extender.ScriptSource).toBe("Сdn");
                });

            });

        });
    </script>
</asp:Content>
