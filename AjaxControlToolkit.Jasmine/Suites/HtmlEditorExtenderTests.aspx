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

            <asp:Button ID="SubmitButton" runat="server" Text="Submit button" ClientIDMode="Static"/>
        </ContentTemplate>
    </asp:UpdatePanel>

    <script>
        describe("HtmlEditorExtender", function() {

            var HTML_EDITOR_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID %>";

            beforeEach(function() {
                this.extender = $find(HTML_EDITOR_EXTENDER_CLIENT_ID);

                this.ua = detect.parse(navigator.userAgent);
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
                var mock = new HtmlEditorMock(this.extender);
                mock.setContent("lorem ipsum dolor sit amet").selectText().pressToolbarButtons(["bold", "italic", "underline"]);

                expect($.proxy(function() {
                    this.extender._editableDiv_submit();
                }, this)).not.toThrow();
            });

            it("does not throw exception on submit if editor has HTML content with extremely short text", function() {
                var mock = new HtmlEditorMock(this.extender);
                mock.setContent("a").selectText().pressToolbarButtons(["bold", "italic", "underline"]);

                expect($.proxy(function() {
                    this.extender._editableDiv_submit();
                }, this)).not.toThrow();
            });

            it("renders all buttons", function() {
                var mock = new HtmlEditorMock(this.extender);

                for(var button in mock.TOOLBAR_BUTTONS) {
                    var $button = $(mock.TOOLBAR_BUTTONS[button].toClassSelector());
                    expect(mock.currentState.containsElement($button)).toBeTruthy("button name <" + button + ">");
                }
            });

            it("keeps html code after submit if link contains title attribute", function(done) {
                var sourceText = 'lorem <a href="lipsum.com" title="Lorem ipsum">ipsum</a>';

                var mock = new HtmlEditorMock(this.extender);
                mock.setContent(sourceText, "source");

                Sys.WebForms.PageRequestManager.getInstance().add_endRequest(function() {
                    var extender = $find("<%= TargetExtender.ClientID %>"),
                        mock = new HtmlEditorMock(extender);

                    expect(mock.currentState.editorContent()).toEqual("lorem ipsum");

                    done();
                });

                $("#SubmitButton").click();
            });

            it("bold button works properly", function() {
                var testContentText = "lorem ipsum dolor sit amet",
                    expectedSourceText = this.ua.browser.family === "IE" ? "<strong>lorem</strong> ipsum dolor sit amet" : "<b>lorem</b> ipsum dolor sit amet",
                    actualSourceText;

                var mock = new HtmlEditorMock(this.extender);
                mock.setContent(testContentText).selectText(0, 5).pressToolbarButtons(["bold"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(expectedSourceText);

                mock.pressToolbarButtons(["bold"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(testContentText);
            });

            it("italic button works properly", function() {
                var testContentText = "lorem ipsum dolor sit amet",
                    expectedSourceText = this.ua.browser.family === "IE" ? "<em>lorem</em> ipsum dolor sit amet" : "<i>lorem</i> ipsum dolor sit amet",
                    actualSourceText;

                var mock = new HtmlEditorMock(this.extender);
                mock.setContent(testContentText).selectText(0, 5).pressToolbarButtons(["italic"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(expectedSourceText);

                mock.pressToolbarButtons(["italic"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(testContentText);
            });

            it("underline button works properly", function() {
                var testContentText = "lorem ipsum dolor sit amet",
                    expectedSourceText = "<u>lorem</u> ipsum dolor sit amet",
                    actualSourceText;

                var mock = new HtmlEditorMock(this.extender);
                mock.setContent(testContentText).selectText(0, 5).pressToolbarButtons(["underline"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(expectedSourceText);

                mock.pressToolbarButtons(["underline"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(testContentText);
            });

            it("strike through button works properly", function() {
                var testContentText = "lorem ipsum dolor sit amet",
                    expectedSourceText = "<strike>lorem</strike> ipsum dolor sit amet",
                    actualSourceText;

                var mock = new HtmlEditorMock(this.extender);
                mock.setContent(testContentText).selectText(0, 5).pressToolbarButtons(["strike-through"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(expectedSourceText);

                mock.pressToolbarButtons(["strike-through"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(testContentText);
            });

            it("subscript button works properly", function() {
                var testContentText = "lorem ipsum dolor sit amet",
                    expectedSourceText = "<sub>lorem</sub> ipsum dolor sit amet",
                    actualSourceText;

                var mock = new HtmlEditorMock(this.extender);
                mock.setContent(testContentText).selectText(0, 5).pressToolbarButtons(["subscript"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(expectedSourceText);

                mock.pressToolbarButtons(["subscript"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(testContentText);
            });

            it("superscript button works properly", function() {
                var testContentText = "lorem ipsum dolor sit amet",
                    expectedSourceText = "<sup>lorem</sup> ipsum dolor sit amet",
                    actualSourceText;

                var mock = new HtmlEditorMock(this.extender);
                mock.setContent(testContentText).selectText(0, 5).pressToolbarButtons(["superscript"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(expectedSourceText);

                mock.pressToolbarButtons(["superscript"]);

                actualSourceText = mock.currentState.editorContent("source");
                expect(actualSourceText).toEqual(testContentText);
            });
        });
    </script>

</asp:Content>
