<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    CodeFile="PasswordStrength.aspx.cs"
    Inherits="Automated_PasswordStrength"
    Title="PasswordStrength Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox><br />
    <asp:Label ID="helpLabel" runat="server"></asp:Label><br />
    
    <asp:TextBox ID="TextBox2" runat="server"></asp:TextBox><br />
    <asp:Label ID="helpLabel2" runat="server"></asp:Label>

    <aspext:PasswordStrength ID="p1" runat="server" TargetControlID="TextBox1" PreferredPasswordLength="10" HelpStatusLabelID="helpLabel" />
    <aspext:PasswordStrength ID="p2" runat="server" TargetControlID="TextBox2" PreferredPasswordLength="10" HelpStatusLabelID="helpLabel2" MinimumNumericCharacters="1" MinimumSymbolCharacters="1" RequiresUpperAndLowerCaseCharacters="true" StrengthIndicatorType="BarIndicator" />

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.PasswordStrengthExtenderBehavior'];
    
        // Test Harness
        var testHarness = null;

        // Controls in the page
        var tb1 = null;
        var tb1_indicator = null;
        var tb1_helpLabel = null;

        var tb2 = null;
        var tb2_indicator1 = null;
        var tb2_indicator2 = null;
        var tb2_helpLabel = null;

        // Ensure the textbox and strength indicator is in its empty/initial state
        function checkEmptyState() {
            testHarness.assertEqual('', tb1_helpLabel.innerHTML, "TextBox1's Strength help text should be an empty string instead of '" + tb1_helpLabel.innerHTML + "'");
            testHarness.assertTrue(tb1_indicator.style.display == '' || tb1_indicator.style.display == 'none', "TextBox1's Strength Indicator display style should be 'none' instead of '" + tb1_indicator.style.display + "'");
            testHarness.assertEqual('hidden', tb1_indicator.style.visibility, "TextBox1's Strength Indicator visibility style should be 'hidden' or an empty string instead of '" + tb1_indicator.style.visibility + "'");
            testHarness.assertEqual('', tb2_helpLabel.innerHTML, "TextBox2's Strength help text should be an empty string instead of '" + tb2_helpLabel.innerHTML + "'");
            testHarness.assertTrue(tb2_indicator1.style.display == '' || tb2_indicator1.style.display == 'none', "TextBox2's Strength Indicator display style should be 'none' instead of '" + tb2_indicator1.style.display + "'");
            testHarness.assertEqual('hidden', tb2_indicator1.style.visibility, "TextBox2's Strength Indicator visibility style should be 'hidden' or an empty string instead of '" + tb2_indicator1.style.visibility + "'");
            testHarness.assertTrue(tb2_indicator2.style.display == '' || tb2_indicator2.style.display == 'none', "TextBox2's Strength Indicator display style should be 'none' instead of '" + tb2_indicator2.style.display + "'");
            testHarness.assertEqual('hidden', tb2_indicator2.style.visibility, "TextBox2's Strength Indicator visibility style should be 'hidden' or an empty string instead of '" + tb2_indicator2.style.visibility + "'");
        }


        // Reset the controls to their initial state
        function resetControlState() {
            tb1.value = '';
            tb2.value = '';
            tb1.readOnly = false;
            tb2.readOnly = false;
            tb1_helpLabel.innerHTML = '';
            tb1_indicator.style.display = 'none';
            tb1_indicator.style.visibility = 'hidden';
            tb2_helpLabel.innerHTML = '';
            tb2_indicator1.style.display = 'none';
            tb2_indicator1.style.visibility = 'hidden';
            tb2_indicator2.style.display = 'none';
            tb2_indicator2.style.visibility = 'hidden';
            testHarness.fireEvent(tb1, 'onBlur');
            testHarness.fireEvent(tb2, 'onblur');
        }

        // Test the initial state of the control
        function testInitialState() {
            checkEmptyState();
        }

        // Test entering some data (not a strong password) into the control for a textual indicator
        function testPartialKeyPress() {
            tb1.value = '123';
            testHarness.fireEvent(tb1, 'onkeyup');
            testHarness.assertNotEqual('', tb1_helpLabel.innerHTML, "TextBox1's Strength help text should NOT be empty instead of '" + tb1_helpLabel.innerHTML + "'");
            testHarness.assertNotEqual('none', tb1_indicator.style.display, "TextBox1's Strength Indicator display style should NOT be 'none'");
            testHarness.assertNotEqual('', tb1.value, "TextBox1's value should NOT be an empty string");
            testHarness.assertEqual('visible', tb1_indicator.style.visibility, "TextBox1's Strength Indicator visibility style should be 'visible' instead of '" + tb1_indicator.style.visibility + "'");
            
        }

        // Test entering some data (not a strong password) into the control for a bar indicator
        function testPartialKeyPress2() {
            tb2.value = '123';
            testHarness.fireEvent(tb2, 'onkeyup');
            testHarness.assertNotEqual('', tb2_helpLabel.innerHTML, "TextBox2's Strength help text should NOT be empty instead of '" + tb2_helpLabel.innerHTML + "'");
            testHarness.assertNotEqual('', tb2.value, "TextBox2's value should NOT be an empty string");
            testHarness.assertNotEqual('none', tb2_indicator1.style.display, "TextBox2's Strength Indicator display style should NOT be 'none'");
            testHarness.assertEqual('visible', tb2_indicator1.style.visibility, "TextBox2's Strength Indicator visibility style should be 'visible' instead of '" + tb2_indicator1.style.visibility + "'");
            testHarness.assertNotEqual('none', tb2_indicator2.style.display, "TextBox2's Strength Indicator display style should NOT be 'none'");
            testHarness.assertEqual('visible', tb2_indicator2.style.visibility, "TextBox2's Strength Indicator visibility style should be 'visible' instead of '" + tb2_indicator2.style.visibility + "'");
        }

        // Test removing focus from the control with only some characters entered for a textual indicator
        function testPartialEntryBlur() {
            testHarness.fireEvent(tb1, 'onblur');
            testHarness.assertNotEqual('', tb1_helpLabel.innerHTML, "TextBox1's Strength help text should NOT be an empty string instead of '" + tb1_helpLabel.innerHTML + "'");
            testHarness.assertTrue(tb1_indicator.style.display == '' || tb1_indicator.style.display == 'none', "TextBox1's Strength Indicator display style should be 'none' or an empty string instead of '" + tb1_indicator.style.display + "'");
            testHarness.assertEqual('hidden', tb1_indicator.style.visibility, "TextBox1's Strength Indicator visibility style should be 'hidden' or an empty string instead of '" + tb1_indicator.style.visibility + "'");
        }

        // Test removing focus from the control with only some characters entered for a textual indicator
        function testPartialEntryBlur2() {
            testHarness.fireEvent(tb2, 'onblur');
            testHarness.assertNotEqual('', tb2_helpLabel.innerHTML, "TextBox2's Strength help text should NOT be an empty string instead of '" + tb2_helpLabel.innerHTML + "'");
            testHarness.assertTrue(tb2_indicator1.style.display == '' || tb2_indicator1.style.display == 'none', "TextBox2's Strength Indicator display style should be 'none' or an empty string instead of '" + tb2_indicator1.style.display + "'");
            testHarness.assertEqual('hidden', tb2_indicator1.style.visibility, "TextBox2's Strength Indicator visibility style should be 'hidden' or an empty string instead of '" + tb2_indicator1.style.visibility + "'");
            testHarness.assertTrue(tb2_indicator2.style.display == '' || tb2_indicator2.style.display == 'none', "TextBox2's Strength Indicator display style should be 'none' or an empty string instead of '" + tb2_indicator2.style.display + "'");
            testHarness.assertEqual('hidden', tb2_indicator2.style.visibility, "TextBox2's Strength Indicator visibility style should be 'hidden' or an empty string instead of '" + tb2_indicator2.style.visibility + "'");
        }

        // Test removing focus from the control with a complete set of characters (strong password) entered for a textual indicator
        function testCompleteEntryBlur() {
            testHarness.fireEvent(tb1, 'onblur');
            testHarness.assertNotEqual('', tb1_helpLabel.innerHTML, "TextBox1's Strength help text should NOT be an empty string instead of '" + tb1_helpLabel.innerHTML + "'");
            testHarness.assertTrue(tb1_indicator.style.display == '' || tb1_indicator.style.display == 'none', "TextBox1's Strength Indicator display style should be 'none' or an empty string instead of '" + tb1_indicator.style.display + "'");
            testHarness.assertEqual('hidden', tb1_indicator.style.visibility, "TextBox1's Strength Indicator visibility style should be 'hidden' or an empty string instead of '" + tb1_indicator.style.visibility + "'");
        }

        // Test entry into the textbox with a strong password for the textual indicator
        function testCompleteKeyPress() {
            tb1.value = '123456789%66_Th';
            testHarness.fireEvent(tb1, 'onkeyup');
            testHarness.assertEqual('', tb1_helpLabel.innerHTML, "TextBox1's Strength help text should be empty instead of '" + tb1_helpLabel.innerHTML + "'");
            testHarness.assertNotEqual('none', tb1_indicator.style.display, "TextBox1's Strength Indicator display style should NOT be 'none'");
            testHarness.assertNotEqual('', tb1.value, "TextBox1's value should NOT be an empty string");
            testHarness.assertEqual('visible', tb1_indicator.style.visibility, "TextBox1's Strength Indicator visibility style should be 'visible' instead of '" + tb1_indicator.style.visibility + "'");
            
        }

        // Test entry into the textbox with a strong password for the bar indicator
        function testCompleteKeyPress2() {
            tb2.value = '1234567&612_02989%66_Th';
            testHarness.fireEvent(tb2, 'onkeyup');
            testHarness.assertEqual('', tb2_helpLabel.innerHTML, "TextBox2's Strength help text should be empty instead of '" + tb2_helpLabel.innerHTML + "'");
            testHarness.assertNotEqual('', tb2.value, "TextBox2's value should NOT be an empty string");
            testHarness.assertNotEqual('none', tb2_indicator1.style.display, "TextBox2's Strength Indicator display style should NOT be 'none'");
            testHarness.assertEqual('visible', tb2_indicator1.style.visibility, "TextBox2's Strength Indicator visibility style should be 'visible' instead of '" + tb2_indicator1.style.visibility + "'");
            testHarness.assertNotEqual('none', tb2_indicator2.style.display, "TextBox2's Strength Indicator display style should NOT be 'none'");
            testHarness.assertEqual('visible', tb2_indicator2.style.visibility, "TextBox2's Strength Indicator visibility style should be 'visible' instead of '" + tb2_indicator2.style.visibility + "'");
        }

        // Test removing focus from the control with a complete set of characters (strong password) entered for a textual indicator
        function testCompleteEntryBlur() {
            testHarness.fireEvent(tb1, 'onblur');
            testHarness.assertEqual('', tb1_helpLabel.innerHTML, "TextBox1's Strength help text should be an empty string instead of '" + tb1_helpLabel.innerHTML + "'");
            testHarness.assertTrue(tb1_indicator.style.display == '' || tb1_indicator.style.display == 'none', "TextBox1's Strength Indicator display style should be 'none' or an empty string instead of '" + tb1_indicator.style.display + "'");
            testHarness.assertEqual('hidden', tb1_indicator.style.visibility, "TextBox1's Strength Indicator visibility style should be 'hidden' or an empty string instead of '" + tb1_indicator.style.visibility + "'");
        }

        // Test removing focus from the control with a complete set of characters (strong password) entered for a bar indicator
        function testCompleteEntryBlur2() {
            testHarness.fireEvent(tb2, 'onblur');
            testHarness.assertEqual('', tb2_helpLabel.innerHTML, "TextBox2's Strength help text should be an empty string instead of '" + tb1_helpLabel.innerHTML + "'");
            testHarness.assertTrue(tb2_indicator1.style.display == '' || tb2_indicator1.style.display == 'none', "TextBox2's Strength Indicator display style should be 'none' or an empty string instead of '" + tb2_indicator1.style.display + "'");
            testHarness.assertEqual('hidden', tb2_indicator1.style.visibility, "TextBox2's Strength Indicator visibility style should be 'hidden' or an empty string instead of '" + tb2_indicator1.style.visibility + "'");
            testHarness.assertTrue(tb2_indicator2.style.display == '' || tb2_indicator2.style.display == 'none', "TextBox2's Strength Indicator display style should be 'none' or an empty string instead of '" + tb2_indicator2.style.display + "'");
            testHarness.assertEqual('hidden', tb2_indicator2.style.visibility, "TextBox2's Strength Indicator visibility style should be 'hidden' or an empty string instead of '" + tb2_indicator2.style.visibility + "'");
        }

        // Test entering some data (not a strong password) into the control for a textual indicator
        function testReadOnlyTextBox() {
            tb1.readOnly = true;
            testHarness.fireEvent(tb1, 'onkeyup');
            testHarness.assertTrue(tb1_indicator.style.display == 'none' || tb1_indicator.style.display == '', tb1_indicator.style.display, "TextBox1's Strength Indicator display style SHOULD be 'none' instead of " + tb1_indicator.style.display);
            testHarness.assertEqual('hidden', tb1_indicator.style.visibility, "TextBox1's Strength Indicator visibility style should be 'hidden' instead of '" + tb1_indicator.style.visibility + "'");
        }
            

        // Register the tests
        function registerTests(harness)
        {
            testHarness = harness;

            // Get the controls from the page
            tb1 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox1');
            tb1_helpLabel = testHarness.getElement('ctl00_ContentPlaceHolder1_helpLabel');
            tb1_indicator = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox1_PasswordStrength');
            tb2 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox2');
            tb2_helpLabel = testHarness.getElement('ctl00_ContentPlaceHolder1_helpLabel2');
            tb2_indicator1 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox2_PasswordStrengthBar1');
            tb2_indicator2 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox2_PasswordStrengthBar2');
            
            var test = testHarness.addTest('Initial');
            test.addStep(resetControlState);
            test.addStep(testInitialState);
            
            test = testHarness.addTest('TextIndicator InValid Entry');
            test.addStep(resetControlState);
            test.addStep(testInitialState);
            test.addStep(testPartialKeyPress);
            test.addStep(testPartialEntryBlur);
            
            test = testHarness.addTest('TextIndicator Valid Entry');
            test.addStep(resetControlState);
            test.addStep(testInitialState);
            test.addStep(testPartialKeyPress);
            test.addStep(testPartialEntryBlur);
            test.addStep(testCompleteKeyPress);
            test.addStep(testCompleteEntryBlur);

            test = testHarness.addTest('BarIndicator InValid Entry');
            test.addStep(resetControlState);
            test.addStep(testInitialState);
            test.addStep(testPartialKeyPress2);
            test.addStep(testPartialEntryBlur2);

            test = testHarness.addTest('BarIndicator Valid Entry');
            test.addStep(resetControlState);
            test.addStep(testInitialState);
            test.addStep(testPartialKeyPress2);
            test.addStep(testPartialEntryBlur2);
            test.addStep(testCompleteKeyPress2);
            test.addStep(testCompleteEntryBlur2);

            test = testHarness.addTest('Text Input set to READONLY');
            test.addStep(resetControlState);
            test.addStep(testInitialState);
            test.addStep(testReadOnlyTextBox);
        }
    </script>
</asp:Content>
