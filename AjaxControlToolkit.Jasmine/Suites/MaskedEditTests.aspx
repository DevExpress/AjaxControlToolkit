<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="MaskedEditTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.MaskedEditTests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">MaskedEdit</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox runat="server"
        ID="CommonTarget"
        Text="ABC" />
    <act:MaskedEditExtender runat="server"
        ID="CommonTargetExtender"
        TargetControlID="CommonTarget"
        Mask="LLLLL"
        CultureName="en-US" />

    <asp:TextBox runat="server"
        ID="DateTarget" />
    <act:MaskedEditExtender runat="server"
        ID="DateTargetExtender"
        TargetControlID="DateTarget"
        MaskType="Date"
        Mask="99/99/9999"
        CultureName="en-US" />

    <script>

        describe("MaskedEdit", function() {

            beforeEach(function() {
                this.commonTarget = document.getElementById("<%= CommonTarget.ClientID %>");
                this.commonExtender = $find("<%= CommonTargetExtender.ClientID %>");

                this.dateTarget = document.getElementById("<%= DateTarget.ClientID %>");
                this.dateExtender = $find("<%= DateTargetExtender.ClientID %>");
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
                this.commonExtender._PromptChar = "";
                setCaretToPosition(this.commonTarget, 3);

                this.commonExtender._ExecuteNav(new Sys.UI.DomEvent(keyboardEvent), 8);

                expect(this.commonTarget.value).toBe("AB");
            });

            it("clears mask on blur", function() {
                this.commonTarget.blur();

                expect(this.commonTarget.value).toBe("ABC");
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
                    this.dateExtender.get_CultureDatePlaceholder = function() {
                        return cultures[i].dateSeparator;
                    }

                    var convertedDate = this.dateExtender.ConvFmtDate(cultures[i].localeDateString, false);
                    expect(convertedDate).toBe(cultures[i].convertedDate);

                    convertedDate = this.dateExtender.ConvFmtDate(cultures[i].localeDateString, true);
                    expect(convertedDate).toBe(cultures[i].convertedDate);
                }
            });

            it("date formating returns empty string for non-data values", function() {
                var convertedDate = this.dateExtender.ConvFmtDate("non-data string", false);
                expect(convertedDate).toBe("");

                convertedDate = this.dateExtender.ConvFmtDate("non-data string", true);
                expect(convertedDate).toBe("");
            });
        });

        function getKeyboardEvent(prefs) {
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

        function setCaretToPosition(input, pos) {
            setSelectionRange(input, pos, pos);
        };

        function setSelectionRange(input, selectionStart, selectionEnd) {
            if(input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            } else if(input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        };

    </script>
</asp:Content>
