<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="HtmlEditorExtenderTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.HtmlEditorExtenderTests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">
    HtmlEditorExtender
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:TextBox ID="Target" runat="server" Width="500" Height="300" />
    <act:HtmlEditorExtender runat="server" TargetControlID="Target" ID="TargetExtender" EnableSanitization="false" />

    <script>
        describe("HtmlEditorExtender", function() {

            it("should not throw exception on submit if text is empty", function() {
                expect(function() {
                    $find("<%= TargetExtender.ClientID %>")._editableDiv_submit();
                }).not.toThrow();
            });
        });
    </script>


</asp:Content>
