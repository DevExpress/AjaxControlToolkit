describe("MaskedEdit", function() {

    var getKeyboardEvent = function(prefs) {
        var keyboardEvent = document.createEvent("KeyboardEvent");
        var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

        keyboardEvent[initMethod](
            prefs.typeArg,
            prefs.canBubbleArg,
            prefs.cancelableArg,
            prefs.viewArg,
            prefs.ctrlKeyArg,
            prefs.altKeyArg,
            prefs.shiftKeyArg,
            prefs.metaKeyArg,
            prefs.keyCodeArg,
            prefs.charCodeArg
        );

        return keyboardEvent;
    };

    beforeEach(function(done) {
        var that = this;

        Testing.LoadSpec(function() {


            done();
        }, "MaskedEdit");
    });

    it("removes symbol on backspace", function() {
        var keyboardEvent = getKeyboardEvent({
            typeArg: "keydown",
            canBubbleArg: true,
            cancelableArg: true,
            viewArg: window,
            ctrlKeyArg: false,
            altKeyArg: false,
            shiftKeyArg: false,
            metaKeyArg: false,
            keyCodeArg: 8,
            charCodeArg: 0
        });
        Testing.CommonExtender._PromptChar = "";
        
        Testing.CommonExtender._ExecuteNav(new Testing.Sys.UI.DomEvent(keyboardEvent), 8);

        expect(Testing.CommonTarget.value).toBe("AB");
    });

    it("clears mask on blur", function() {
        Testing.CommonTarget.blur();

        expect(Testing.CommonTarget.value).toBe("ABC");
    });

    // CodePlex item 27764
    it("formats date properly for different cultures", function() {
        var cultures = [
            {
                name: "en-US",
                dateSeparator: "/",
                localeDateString: "02/01/2015",
                convertedDate: "02/01/2015"
            },
            {
                name: "hu-HU",
                dateSeparator: ".",
                localeDateString: "01.02.2015.",
                convertedDate: "01.02.2015"
            },
            {
                name: "hy-AM",
                dateSeparator: ".",
                localeDateString: "(01.02.2015)",
                convertedDate: "01.02.2015"
            },
        ];

        for(var i = 0; i < cultures.length; i++) {
            Testing.DateExtender.get_CultureDatePlaceholder = function() {
                return cultures[i].dateSeparator;
            }

            var convertedDate = Testing.DateExtender.ConvFmtDate(cultures[i].localeDateString, false);

            expect(convertedDate).toBe(cultures[i].convertedDate);
        }
    });
});