<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="NamedBundling.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManagerTests.NamedBundling" %>

<%@ Register Assembly="AjaxControlToolkit.Jasmine" Namespace="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager" TagPrefix="test" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">ToolkitResourceManager Named Bundle</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox runat="server" ID="Target" />
    <test:TestExtender runat="server" TargetControlID="Target" />

    <script>
        describe("ToolkitResourceManager", function() {

            describe("Named Bundle", function() {

                it("loads only static for testing purposes", function() {
                    var embeddedScripts = [].filter.call(document.scripts, function(script) {
                        return script.attributes["src"] && script.attributes["src"].value.startsWith("/ScriptResource");
                    });

                    expect(embeddedScripts.length).toBe(0);
                });

                it("does not load unbundled scripts", function() {
                    var scripts = [].filter.call(document.scripts, function(script) {
                        return script.attributes["src"] &&
                            !/\/Scripts\/AjaxControlToolkit\/TestExtenderBundle\?v=.+/.test(script.attributes["src"].value) &&
                            !/\/ScriptResource/.test(script.attributes["src"].value) &&
                            !/\/Infrastructure/.test(script.attributes["src"].value) &&
                            !/MicrosoftAjax.js$/.test(script.attributes["src"].value) &&
                            !/MicrosoftAjaxWebForms.js$/.test(script.attributes["src"].value) &&
                            !/\/WebResource.axd\?d=/.test(script.attributes["src"].value);
                    });

                    expect(scripts.length).toBe(0);
                });

                it("loads one bundle", function() {
                    var bundles = [].filter.call(document.scripts, function(script) {
                        return script.attributes["src"] && /\/Scripts\/AjaxControlToolkit\/TestExtenderBundle\?v=.+/.test(script.attributes["src"].value);
                    });

                    expect(bundles.length).toBe(1);
                });

                it("includes custom script in bundle", function() {
                    var extender = Sys.Extended.UI.TestExtender;

                    expect(extender.ScriptMode).toBe("Release");
                    expect(extender.ScriptSource).toBe("Static");
                });

                it("includes base script in bundle", function() {
                    var base = Sys.Extended.UI.BehaviorBase;

                    expect(base.ScriptSource).toBe("Static");
                });

                it("does not include other(AccordionExtender) script in bundle", function() {
                    var extender = Sys.Extended.UI.Accordion;

                    expect(extender).toBeUndefined();
                });
            });

        });
    </script>

</asp:Content>
