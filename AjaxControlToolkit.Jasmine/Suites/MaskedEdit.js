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
        
        // Act
        Testing.Component._ExecuteNav(new Testing.Sys.UI.DomEvent(keyboardEvent), 8);

        // Assert
        expect(Testing.Target.value).toBe("AB");
    });

});