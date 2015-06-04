<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="HtmlEditorExtenderTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.HtmlEditorExtenderTests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">
    HtmlEditorExtender
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:TextBox ID="Target" runat="server" Width="500" Height="300" />
    <act:HtmlEditorExtender runat="server" TargetControlID="Target" ID="TargetExtender" EnableSanitization="false" DisplaySourceTab="true" />

    <script>
        describe("HtmlEditorExtender", function() {

            beforeEach(function() {
                this.extender = $find("<%= TargetExtender.ClientID %>");
            });

            it("does not throw exception on submit if text is empty", function() {
                expect($.proxy(function() {
                    this.extender._editableDiv_submit();
                }, this)).not.toThrow();
            });

            it("checks if element is HTML DOM element properly", function() {
                var htmlElement = $("<div>").get(0);

                expect(this.extender._isHtmlElement(htmlElement)).toBeTruthy()
                expect(this.extender._isHtmlElement("test string element")).toBeFalsy();
            });

            // CodePlex items 27744, 27717, 27745
            it("does not throw exception on submit if editor has HTML content", function() {
                var text = "lorem ipsum dolor sit amet";
                this.extender._editableDiv.textContent = text;

                selectHtmlEditorText(this.extender, 0, text.length);

                var $container = $(this.extender._container);
                $container.find(toClassSelector(HTML_EDITOR_BOLD_BUTTON_CLASS_NAME)).click();
                $container.find(toClassSelector(HTML_EDITOR_ITALIC_BUTTON_CLASS_NAME)).click();
                $container.find(toClassSelector(HTML_EDITOR_UNDERLINE_BUTTON_CLASS_NAME)).click();

                expect($.proxy(function() {
                    this.extender._editableDiv_submit();
                }, this)).not.toThrow();
            });

            var HTML_EDITOR_BOLD_BUTTON_CLASS_NAME = "ajax__html_editor_extender_Bold",
                HTML_EDITOR_ITALIC_BUTTON_CLASS_NAME = "ajax__html_editor_extender_Italic",
                HTML_EDITOR_UNDERLINE_BUTTON_CLASS_NAME = "ajax__html_editor_extender_Underline";

            var toClassSelector = function(className) {
                return "." + className;
            };

            var selectHtmlEditorText = function(htmlExtender, startOffset, endOffset) {
                var range = document.createRange();
                range.setStart(htmlExtender._editableDiv.firstChild, startOffset);
                range.setEnd(htmlExtender._editableDiv.firstChild, endOffset);

                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            };
        });
    </script>

</asp:Content>
