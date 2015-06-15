<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="HtmlEditorExtenderTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.HtmlEditorExtenderTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    HtmlEditorExtender
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">
    <asp:UpdatePanel runat="server" UpdateMode="Conditional">
        <ContentTemplate>
            <asp:TextBox runat="server"
                ID="Target"
                Width="500"
                Height="300" />

            <act:HtmlEditorExtender runat="server"
                TargetControlID="Target" 
                ID="TargetExtender" 
                EnableSanitization="false" 
                DisplaySourceTab="true">
                <Toolbar>
                    <act:Undo />
                    <act:Redo />
                    <act:Bold />
                    <act:Italic />
                    <act:Underline />
                    <act:StrikeThrough />
                    <act:Subscript />
                    <act:Superscript />
                    <act:JustifyLeft />
                    <act:JustifyCenter />
                    <act:JustifyRight />
                    <act:JustifyFull />
                    <act:InsertOrderedList />
                    <act:InsertUnorderedList />
                    <act:CreateLink />
                    <act:UnLink />
                    <act:RemoveFormat />
                    <act:SelectAll />
                    <act:UnSelect />
                    <act:Delete />
                    <act:Cut />
                    <act:Copy />
                    <act:Paste />
                    <act:BackgroundColorSelector />
                    <act:ForeColorSelector />
                    <act:FontNameSelector />
                    <act:FontSizeSelector />
                    <act:Indent />
                    <act:Outdent />
                    <act:InsertHorizontalRule />
                    <act:HorizontalSeparator />
                    <act:InsertImage />
                </Toolbar>
            </act:HtmlEditorExtender>
        </ContentTemplate>
    </asp:UpdatePanel>

    <script>
        describe("HtmlEditorExtender", function() {

            var HTML_EDITOR_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID %>";

            beforeEach(function() {
                this.extender = $find(HTML_EDITOR_EXTENDER_CLIENT_ID);
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
                $container.find(HTML_EDITOR_BOLD_BUTTON_CLASS_NAME.toClassSelector()).click();
                $container.find(HTML_EDITOR_ITALIC_BUTTON_CLASS_NAME.toClassSelector()).click();
                $container.find(HTML_EDITOR_UNDERLINE_BUTTON_CLASS_NAME.toClassSelector()).click();

                expect($.proxy(function() {
                    this.extender._editableDiv_submit();
                }, this)).not.toThrow();
            });

            var HTML_EDITOR_BOLD_BUTTON_CLASS_NAME = "ajax__html_editor_extender_Bold",
                HTML_EDITOR_ITALIC_BUTTON_CLASS_NAME = "ajax__html_editor_extender_Italic",
                HTML_EDITOR_UNDERLINE_BUTTON_CLASS_NAME = "ajax__html_editor_extender_Underline";

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
