<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="MaskedEditTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.MaskedEditTests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">
    MaskedEdit
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:TextBox ID="Target" runat="server" />
    <act:MaskedEditExtender ID="TargetExtender" runat="server"
        TargetControlID="Target"
        Mask="LLLLL"
        CultureName="en-US"
        ClientIDMode="Static" />

    <input type="text" id="focusStealer" />

    <script>
        describe("MaskedEdit", function() {

            beforeEach(function() {
                this.component = $find("<%= TargetExtender.ClientID %>");
                this.target = document.getElementById("<%= Target.ClientID %>");
            });

            it("must remove symbol on backspace", function() {
                // Arrange
                var keyboardEvent = document.createEvent("KeyboardEvent");
                var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

                keyboardEvent[initMethod](
                                   "keydown", // event type : keydown, keyup, keypress
                                    true, // bubbles
                                    true, // cancelable
                                    window, // viewArg: should be window
                                    false, // ctrlKeyArg
                                    false, // altKeyArg
                                    false, // shiftKeyArg
                                    false, // metaKeyArg
                                    8, // keyCodeArg : unsigned long the virtual key code, else 0
                                    0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
                );
                
                this.target.value = "ABC";
                this.component._PromptChar = "";
                setCaretPosition(this.target, 3);

                // Act
                this.component._ExecuteNav(new Sys.UI.DomEvent(keyboardEvent), 8);

                // Assert
                expect(this.target.value).toBe("AB");
                console.log("1");
            });

            it("must clear mask on blur", function() {
                // Arrange
                var focusStealer = document.getElementById("focusStealer");
                console.log("2");
                this.target.value = "ZZZ";
                setCaretPosition(this.target, 0);

                //Act
                focusStealer.focus();

                // Assert
                expect(this.target.value).toBe("ZZZ");
            });
        });

        // http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
        function setCaretPosition(el, caretPos) {
            el.value = el.value;
            // ^ this is used to not only get "focus", but
            // to make sure we don't have it everything -selected-
            // (it causes an issue in chrome, and having it doesn't hurt any other browser)

            if(el.createTextRange) {
                var range = el.createTextRange();
                range.move('character', caretPos);
                range.select();
                return true;
            }
            else {
                // (el.selectionStart === 0 added for Firefox bug)
                if(el.selectionStart || el.selectionStart === 0) {
                    el.focus();
                    el.setSelectionRange(caretPos, caretPos);
                    return true;
                }
                else {
                    el.focus();
                    return false;
                }
            }
        }
    </script>
</asp:Content>
