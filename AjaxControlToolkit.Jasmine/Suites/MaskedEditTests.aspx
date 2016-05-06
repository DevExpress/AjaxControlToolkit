<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="MaskedEditTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.MaskedEditTests" Culture="auto" UICulture="auto" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    MaskedEdit
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

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

    <asp:TextBox runat="server"
        ID="NumberWithZeroTarget" />
    <act:MaskedEditExtender runat="server"
        ID="NumberWithZeroTargetExtender"
        TargetControlID="NumberWithZeroTarget"
        MaskType="Number"
        ClearMaskOnLostFocus="false"
        Mask="09999"
        CultureName="en-US" />

    <asp:TextBox runat="server"
        ID="RightToLeftNumberTarget" />
    <act:MaskedEditExtender runat="server"
        ID="RightToLeftNumberTargetExtender"
        TargetControlID="RightToLeftNumberTarget"
        MaskType="Number"
        ClearMaskOnLostFocus="false"
        InputDirection="RightToLeft"
        DisplayMoney="Left"
        AcceptNegative="Left"
        Mask="9,999,999.99"
        CultureName="en-US" />

    <asp:TextBox runat="server"
        ID="RightToLeftNumberEmptyTarget" />
    <act:MaskedEditExtender runat="server"
        ID="RightToLeftNumberEmptyTargetExtender"
        TargetControlID="RightToLeftNumberEmptyTarget"
        MaskType="Number"
        ClearMaskOnLostFocus="false"
        InputDirection="RightToLeft"
        Mask="999.99"
        CultureName="en-US" />

    <asp:TextBox runat="server"
        ID="RightToLeftNumberClearMaskTarget" />
    <act:MaskedEditExtender runat="server"
        ID="RightToLeftNumberClearMaskTargetExtender"
        TargetControlID="RightToLeftNumberClearMaskTarget"
        MaskType="Number"
        ClearMaskOnLostFocus="true"
        InputDirection="RightToLeft"
        DisplayMoney="Left"
        AcceptNegative="Left"
        Mask="9,999,999.99"
        CultureName="en-US" />

    <asp:TextBox runat="server"
        ID="PhoneNumberTarget" MaxLength="10" />
    <act:MaskedEditExtender runat="server"
        ID="PhoneNumberTargetExtender"
        TargetControlID="PhoneNumberTarget"
        MaskType="Number"
        ClearMaskOnLostFocus="false"
        Mask="(999) 999-9999"
        ClearTextOnInvalid="false"
        CultureName="en-US" />

    <asp:TextBox runat="server"
        ID="TimeTarget" />
    <act:MaskedEditExtender ID="TimeTargetMaskedEditExtender" runat="server"
        TargetControlID="TimeTarget"
        Mask="99:99:99"
        MaskType="Time"
        AcceptAMPM="True"
        CultureName="en-US" />

    <asp:TextBox runat="server"
        ID="CzechTimeTarget" />
    <act:MaskedEditExtender ID="CzechTimeTargetMaskedEditExtender" runat="server"
        TargetControlID="CzechTimeTarget"
        Mask="99:99:99"
        MaskType="Time"
        AcceptAMPM="True"
        CultureName="cs-CZ" />

    <asp:TextBox runat="server"
        ID="ShortTimeTarget" />
    <act:MaskedEditExtender ID="ShortTimeTargetExtender" runat="server"
        TargetControlID="ShortTimeTarget"
        Mask="99:99"
        MaskType="Time"
        AcceptAMPM="True" />

    <script>

        describe("MaskedEdit", function() {
            var originalTimeout;
            var
                TIME_TARGET_CLIENT_ID = "<%= TimeTarget.ClientID %>",
                TIME_TARGET_EXTENDER_CLIENT_ID = "<%= TimeTargetMaskedEditExtender.ClientID %>";
            CZECH_TIME_TARGET_CLIENT_ID = "<%= CzechTimeTarget.ClientID %>",
            CZECH_TIME_TARGET_EXTENDER_CLIENT_ID = "<%= CzechTimeTargetMaskedEditExtender.ClientID %>",
                SHORT_TIME_TARGET_CLIENT_ID = "<%= ShortTimeTarget.ClientID %>",
                SHORT_TIME_TARGET_EXTENDER_CLIENT_ID = "<%= ShortTimeTargetExtender.ClientID %>",
                COMMON_TARGET_CLIENT_ID = "<%= CommonTarget.ClientID%>",
                COMMON_EXTENDER_CLIENT_ID = "<%= CommonTargetExtender.ClientID%>",
                DATE_TARGET_CLIENT_ID = "<%= DateTarget.ClientID %>",
                DATE_EXTENDER_CLIENT_ID = "<%= DateTargetExtender.ClientID %>",
                NUMBER_WITH_ZERO_TARGET_CLIENT_ID = "<%= NumberWithZeroTarget.ClientID %>",
                NUMBER_WITH_ZERO_CLIENT_ID = "<%= NumberWithZeroTargetExtender.ClientID %>",
                RIGHT_TO_LEFT_NUMBER_TARGET_CLIENT_ID = "<%= RightToLeftNumberTarget.ClientID %>",
                RIGHT_TO_LEFT_NUMBER_CLIENT_ID = "<%= RightToLeftNumberTargetExtender.ClientID %>",
                RIGHT_TO_LEFT_NUMBER_EMPTY_TARGET_CLIENT_ID = "<%= RightToLeftNumberEmptyTarget.ClientID %>",
                RIGHT_TO_LEFT_NUMBER_EMPTY_CLIENT_ID = "<%= RightToLeftNumberEmptyTargetExtender.ClientID %>",
                RIGHT_TO_LEFT_NUMBER_CLEARMASK_TARGET_CLIENT_ID = "<%= RightToLeftNumberClearMaskTarget.ClientID %>",
                RIGHT_TO_LEFT_NUMBER_CLEARMASK_CLIENT_ID = "<%= RightToLeftNumberClearMaskTargetExtender.ClientID %>",
                PHONE_NUMBER_EXTENDER_CLIENT_ID = "<%= PhoneNumberTargetExtender.ClientID%>",
                PHONE_NUMBER_TARGET_CLIENT_ID = "<%= PhoneNumberTarget.ClientID %>";

            beforeEach(function() {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

                this.$commonTarget = $(COMMON_TARGET_CLIENT_ID.toIdSelector());
                this.commonExtender = $find(COMMON_EXTENDER_CLIENT_ID);

                this.$dateTarget = $(DATE_TARGET_CLIENT_ID.toIdSelector());
                this.dateExtender = $find(DATE_EXTENDER_CLIENT_ID);

                this.$numberWithZeroTarget = $(NUMBER_WITH_ZERO_TARGET_CLIENT_ID.toIdSelector());
                this.numberWithZeroExtender = $find(NUMBER_WITH_ZERO_CLIENT_ID);

                this.$rightToLeftTarget = $(RIGHT_TO_LEFT_NUMBER_TARGET_CLIENT_ID.toIdSelector());
                this.rightToLeftExtender = $find(RIGHT_TO_LEFT_NUMBER_CLIENT_ID);

                this.$rightToLeftEmptyTarget = $(RIGHT_TO_LEFT_NUMBER_EMPTY_TARGET_CLIENT_ID.toIdSelector());
                this.rightToLeftEmptyExtender = $find(RIGHT_TO_LEFT_NUMBER_EMPTY_CLIENT_ID);

                this.$rightToLeftClearMaskTarget = $(RIGHT_TO_LEFT_NUMBER_CLEARMASK_TARGET_CLIENT_ID.toIdSelector());
                this.rightToLeftClearMaskExtender = $find(RIGHT_TO_LEFT_NUMBER_CLEARMASK_CLIENT_ID);

                this.phoneNumberExtender = $find(PHONE_NUMBER_EXTENDER_CLIENT_ID);
                this.$phoneNumberTarget = $(PHONE_NUMBER_TARGET_CLIENT_ID.toIdSelector());

                this.timeExtender = $find(TIME_TARGET_EXTENDER_CLIENT_ID);
                this.$timeTarget = $(TIME_TARGET_CLIENT_ID.toIdSelector());

                this.czechTimeExtender = $find(CZECH_TIME_TARGET_EXTENDER_CLIENT_ID);
                this.$czechTimeTarget = $(CZECH_TIME_TARGET_CLIENT_ID.toIdSelector());

                this.shortTimeExtender = $find(SHORT_TIME_TARGET_EXTENDER_CLIENT_ID);
                this.$shortTimeTarget = $(SHORT_TIME_TARGET_CLIENT_ID.toIdSelector());
            });

            afterEach(function() {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
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
                this.commonExtender._promptCharacter = "";
                setCaretToPosition(this.$commonTarget.get(0), 3);

                this.commonExtender._ExecuteNav(new Sys.UI.DomEvent(keyboardEvent), 8);

                expect(this.$commonTarget.val()).toBe("AB");
            });

            it("clears mask on blur", function() {
                var expectedValue = this.$commonTarget.val();

                this.$commonTarget.blur();

                expect(this.$commonTarget.val()).toBe(expectedValue);
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

                spyOn(this.dateExtender, "get_cultureDatePlaceholder").and.callFake(function() {
                    return cultures[i].dateSeparator;
                });

                for(var i = 0; i < cultures.length; i++) {
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

            it("does not add zero when focusing", function() {
                var expectedValue = this.$numberWithZeroTarget.val();

                this.$numberWithZeroTarget.blur();
                this.$numberWithZeroTarget.focus();
                this.$numberWithZeroTarget.blur();

                expect(this.$numberWithZeroTarget.val()).toBe(expectedValue);
            });

            it("does not add zero when focusing with cleared mask", function() {
                var expectedValue = this.$rightToLeftClearMaskTarget.val();

                this.$rightToLeftClearMaskTarget.blur();
                this.$rightToLeftClearMaskTarget.focus();
                this.$rightToLeftClearMaskTarget.blur();

                expect(this.$rightToLeftClearMaskTarget.val()).toBe(expectedValue);
            });

            it("does not add zero when focusing with mask", function() {
                var expectedValue = this.$rightToLeftTarget.val();

                this.$rightToLeftTarget.blur();
                this.$rightToLeftTarget.focus();
                this.$rightToLeftTarget.blur();

                expect(this.$rightToLeftTarget.val()).toBe(expectedValue);
            });

            it("allows entering leading zeros", function() {
                setCaretToPosition(this.$rightToLeftEmptyTarget.get(0), 3);
                pressButtons(this.$rightToLeftEmptyTarget, "00");
                expect(this.$rightToLeftEmptyTarget.val()).toBe("_00.__");
            });

            it("correctly switches shorttime group forward", function() {
                this.$shortTimeTarget.focus();
                setCaretToPosition(this.$shortTimeTarget.get(0), 2);
                pressButtons(this.$shortTimeTarget, ":");

                expect(getCaretPosition(this.$shortTimeTarget.get(0))).toBe(3);
            });

            it("correctly switches shorttime group backward", function(done) {
                var self = this;
                self.$shortTimeTarget.focus();

                setTimeout(function() {
                    setCaretToPosition(self.$shortTimeTarget.get(0), 3);
                    pressButtonsWithDelay(self.$shortTimeTarget, ":", true);

                    setTimeout(function() {
                        expect(getCaretPosition(self.$shortTimeTarget.get(0))).toBe(0);
                        done();
                    }, 500);
                }, 500);

            });

            it("date formatting does not throw an exception when user date format is set (CodePlex item 27921)", function() {
                this.dateExtender._UserDateFormat = Sys.Extended.UI.MaskedEditUserDateFormat.DayMonthYear;

                var that = this;
                expect(function() {
                    that.dateExtender.ConvFmtDate("10/10/2000", true)
                }).not.toThrow();
            });

            it("target control should have proper initialization text (CodePlex item 27920)", function() {
                expect(this.$phoneNumberTarget.val()).toBe("(123) 456-7890");
            });

            it("loads value with AMPM", function(done) {
                var self = this;

                this.$timeTarget.focus();

                setTimeout(function() {
                    $removeHandler(self.timeExtender.get_element(), "focus", self.timeExtender._focusHandler);
                    self.timeExtender._focusHandler = null;

                    pressButtonsWithDelay(self.$timeTarget, "0");

                    setTimeout(function() {
                        pressButtonsWithDelay(self.$timeTarget, "5");

                        setTimeout(function() {
                            pressButtonsWithDelay(self.$timeTarget, "0");

                            setTimeout(function() {
                                pressButtonsWithDelay(self.$timeTarget, "0");

                                setTimeout(function() {
                                    pressButtonsWithDelay(self.$timeTarget, "0");

                                    setTimeout(function() {
                                        pressButtonsWithDelay(self.$timeTarget, "0");

                                        setTimeout(function() {
                                            self.$timeTarget.blur();

                                            setTimeout(function() {
                                                expect(self.$timeTarget.val()).toBe("05:00:00 AM");

                                                self.timeExtender._focusHandler = Function.createDelegate(self.timeExtender, self.timeExtender._onFocus);
                                                $addHandler(self.timeExtender.get_element(), "focus", self.timeExtender._focusHandler);

                                                done();
                                            }, 500);
                                        }, 500);
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            });

            it("loads value with AMPM for cs-CZ", function(done) {
                var self = this;
                this.$czechTimeTarget.focus();

                setTimeout(function() {
                    pressButtonsWithDelay(self.$czechTimeTarget, "0");

                    setTimeout(function() {
                        pressButtonsWithDelay(self.$czechTimeTarget, "5");

                        setTimeout(function() {
                            pressButtonsWithDelay(self.$czechTimeTarget, "0");

                            setTimeout(function() {
                                pressButtonsWithDelay(self.$czechTimeTarget, "0");

                                setTimeout(function() {
                                    pressButtonsWithDelay(self.$czechTimeTarget, "0");

                                    setTimeout(function() {
                                        pressButtonsWithDelay(self.$czechTimeTarget, "0");

                                        setTimeout(function() {
                                            self.$czechTimeTarget.blur();

                                            setTimeout(function() {
                                                expect(self.$czechTimeTarget.val()).toBe("05:00:00 dop.");
                                                done();
                                            }, 500);
                                        }, 500);
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);

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

        function pressButtons(target, sequence) {
            for(var i = 0; i < sequence.length; i++) {
                var charCode = sequence.charCodeAt(i);
                target.simulate("keypress", { charCode: charCode });
            }
        };

        function pressButtonsWithDelay(target, sequence, shiftKey, selectionStart) {


            for(var i = 0; i < sequence.length; i++) {
                var charCode = sequence.charCodeAt(i);
                target.simulate("keydown", { charCode: charCode, shiftKey: shiftKey || false });
                setTimeout(function() {
                    target.simulate("keypress", { charCode: charCode, shiftKey: shiftKey || false });
                }, 200);
            }
        };

        function getCaretPosition(input) {

            // Initialize
            var caretPos = 0;

            // IE Support
            if(document.selection) {

                // Set focus on the element
                input.focus();

                // To get cursor position, get empty selection range
                var selection = document.selection.createRange();

                // Move selection start to 0 position
                selection.moveStart('character', -input.value.length);

                // The caret position is selection length
                caretPos = selection.text.length;
            }

                // Firefox support
            else if(input.selectionStart || input.selectionStart == '0')
                caretPos = input.selectionStart;

            // Return results
            return caretPos;
        }

    </script>
</asp:Content>
