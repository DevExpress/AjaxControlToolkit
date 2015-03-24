describe("MaskedEdit", function() {

    beforeEach(function(done) {
        Testing.LoadSpec("MaskedEdit", done);
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
        Testing.Target.value = "ABC";
        Testing.Component._PromptChar = "";
        setCaretPosition(Testing.Target, 3);
        
        // Act
        Testing.Component._ExecuteNav(new Testing.Sys.UI.DomEvent(keyboardEvent), 8);

        // Assert
        expect(Testing.Target.value).toBe("AB");
    });

});

// http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
function setCaretPosition(el, caretPos) {
    el.value = el.value;
    // ^ this is used to not only get "focus", but
    // to make sure we don't have it everything -selected-
    // (it causes an issue in chrome, and having it doesn't hurt any other browser)

    if (el !== null) {

        if (el.createTextRange) {
            var range = el.createTextRange();
            range.move('character', caretPos);
            range.select();
            return true;
        }

        else {
            // (el.selectionStart === 0 added for Firefox bug)
            if (el.selectionStart || el.selectionStart === 0) {
                el.focus();
                el.setSelectionRange(caretPos, caretPos);
                return true;
            }

            else  { // fail city, fortunately this never happens (as far as I've tested) :)
                el.focus();
                return false;
            }
        }
    }
}