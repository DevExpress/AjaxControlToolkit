<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="DebugStaticTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManagerTests.DebugStatic" %>

<%@ Register Assembly="AjaxControlToolkit.Jasmine" Namespace="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager" TagPrefix="test" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server"></asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:TextBox runat="server" ID="Target" />
    <test:TestExtender runat="server" TargetControlID="Target" />

    <script>
        describe("ToolkitResourceManager", function() {

            describe("Static", function() {

                it("loads static debug custom script", function() {
                    var extender = Sys.Extended.UI.TestExtender;

                    expect(extender.ScriptMode).toBe("Debug");
                    expect(extender.ScriptSource).toBe("Static");
                });

                it("loads static debug script", function() {
                    var base = Sys.Extended.UI.BehaviorBase;

                    expect(base.ScriptMode).toBe("Debug");
                    expect(base.ScriptSource).toBe("Static");
                })

            });

        });
    </script>
</asp:Content>
