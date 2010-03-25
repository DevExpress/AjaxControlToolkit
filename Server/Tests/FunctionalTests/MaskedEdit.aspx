<%@ Page Language="C#" MasterPageFile="~/Default.master" AutoEventWireup="true" CodeFile="MaskedEdit.aspx.cs" Inherits="MaskedEdit" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    MaskType: Date, mask: 99/99/9999
    <br />
    <asp:TextBox ID="TextBox1" runat="server" ValidationGroup="Demo1" Width="328px"></asp:TextBox><br />
    <aspext:MaskedEditExtender ID="MaskedEditExtender1" runat="server" AcceptNegative="Left"
        DisplayMoney="Left" Mask="99/99/9999" MaskType="Date" MessageValidatorTip="true"
        OnFocusCssClass="MaskedEditFocus" OnInvalidCssClass="MaskedEditError" TargetControlID="TextBox1" CultureName="en-US" AutoComplete="true" AutoCompleteValue="05/23/1964">
    </aspext:MaskedEditExtender>
    <aspext:MaskedEditValidator ID="MaskedEditValidator1" runat="server" ControlExtender="MaskedEditExtender1"
        ControlToValidate="TextBox1" Display="Dynamic" IsValidEmpty="False" MaximumValue="01/01/2010"
        EmptyValueMessage="Date is required" InvalidValueMessage="Date is invalid" MaximumValueMessage="Message Max"
        MinimumValueMessage="Message Min" TooltipMessage="Input a Date" MinimumValue="02/02/1900" ValidationGroup="Demo1"></aspext:MaskedEditValidator>

    MaskType: number, mask: 999,999.99<br />
    <asp:TextBox ID="TextBox2" runat="server" MaxLength="1" ValidationGroup="Demo1" Width="328px"></asp:TextBox><br />
    <aspext:MaskedEditExtender ID="MaskedEditExtender2" runat="server" Mask="999,999.99" MaskType="Number" MessageValidatorTip="true" 
        OnFocusCssClass="MaskedEditFocus" OnInvalidCssClass="MaskedEditError" TargetControlID="TextBox2" CultureName="pt-BR">
    </aspext:MaskedEditExtender>
    <aspext:MaskedEditValidator ID="MaskedEditValidator2" runat="server" ControlExtender="MaskedEditExtender2"
        ControlToValidate="TextBox2" Display="Dynamic" IsValidEmpty="False" EmptyValueMessage="Message Empty"
         InvalidValueMessage="Message Invalid" TooltipMessage="Input a number" ValidationGroup="Demo1" MaximumValue="20000" MaximumValueMessage="Message Max" MinimumValue="100" MinimumValueMessage="Message Min" ></aspext:MaskedEditValidator>
    &nbsp; MaskType: time mask: 99:99:99<br />
    <asp:TextBox ID="TextBox3" runat="server" MaxLength="1" ValidationGroup="Demo1" Width="328px"></asp:TextBox><br />
    <aspext:MaskedEditExtender ID="MaskedEditExtender3" runat="server"  AcceptAmPm="false"
        Mask="99:99:99" MaskType="Time" MessageValidatorTip="true" OnFocusCssClass="MaskedEditFocus" OnInvalidCssClass="MaskedEditError" TargetControlID="TextBox3" CultureName="pt-BR">
    </aspext:MaskedEditExtender>
    <aspext:MaskedEditValidator ID="MaskedEditValidator3" runat="server" ControlExtender="MaskedEditExtender3"
        ControlToValidate="TextBox3" Display="Dynamic" IsValidEmpty="False" MinimumValue="03:30:00" MaximumValue="18:00:00"
        EmptyValueMessage="Message Empty" InvalidValueMessage="Message Invalid" MaximumValueMessage="Message Max"
        MinimumValueMessage="Message Min" TooltipMessage="Input a Time" ValidationGroup="Demo1"></aspext:MaskedEditValidator>

    &nbsp; &nbsp; MaskType: none mask: ?{30}<br />
    <asp:TextBox ID="TextBox4" runat="server" MaxLength="1" ValidationGroup="Demo1" Width="328px"></asp:TextBox><br />
    <aspext:MaskedEditExtender ID="MaskedEditExtender4" runat="server"  AcceptAmPm="true"
        Mask="?{30}" MessageValidatorTip="true" OnFocusCssClass="MaskedEditFocus" OnInvalidCssClass="MaskedEditError" TargetControlID="TextBox4">
    </aspext:MaskedEditExtender>
    <aspext:MaskedEditValidator ID="MaskedEditValidator4" runat="server" ControlExtender="MaskedEditExtender4"
        ControlToValidate="TextBox4" Display="Dynamic" IsValidEmpty="False"
        EmptyValueMessage="Message Empty" InvalidValueMessage="Message Invalid" MaximumValueMessage="Message Max"
        MinimumValueMessage="Message Min" TooltipMessage="Input a Text" MinimumValue="3" ValidationGroup="Demo1"></aspext:MaskedEditValidator>
    <asp:TextBox ID="TextBox14703" Text="1111111111" runat="server"></asp:TextBox>
    <aspext:MaskedEditExtender ID="MaskedEditExtender14703" TargetControlID="TextBox14703" runat="server"
            ClearMaskOnLostFocus="false" Mask="(999) 999-9999" MaskType="None" />
    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ["Sys.Extended.UI.MaskedEditBehavior","Sys.Extended.UI.MaskedEditBehavior"];
        // Control in the page
        var MaskedEdit1 = null;
        var MaskedEditvalid1 = null;
        var MaskedEdit2 = null;
        var MaskedEditvalid2 = null;
        var MaskedEdit3 = null;
        var MaskedEditvalid3 = null;
        var MaskedEdit4 = null;
        var MaskedEditvalid4 = null;
        var MaskedEdit14703 = null;
        // Test Harness
        var testHarness = null;

        function checkvalidMsgErrInvalid(target,targetvld,value) {
            TextLoadValue(target, value);
            target._onBlur();
            var expectedText = targetvld.InvalidValueMessage;
            testHarness.assertEqual(targetvld.innerHTML, expectedText, "Value in " + targetvld.id + " should be '" + expectedText + "', not '" + targetvld.innerHTML + "'");
        }
        function checkvalidMsgErrInvalidTM(target,targetvld,value,AMPM) {
            TextLoadValue(target, value);
            target.InsertAMPM(AMPM);
            target._onBlur();
            var expectedText = targetvld.InvalidValueMessage;
            testHarness.assertEqual(targetvld.innerHTML, expectedText, "Value in " + targetvld.id + " should be '" + expectedText + "', not '" + targetvld.innerHTML + "'");
        }
        function checkvalidMsgErrEmpty(target,targetvld) {
            target.get_element().value = "";
            target._onFocus();
            target._onBlur();
            var expectedText = targetvld.EmptyValueMessage;
            testHarness.assertEqual(targetvld.innerHTML, expectedText, "Value in " + targetvld.id + " should be '" + expectedText + "', not '" + targetvld.innerHTML + "'");
        }
        function checkvalidMsgErrMin(target,targetvld,value) {
            TextLoadValue(target, value);
            target._onBlur();
            var expectedText = targetvld.MinimumValueMessage;
            testHarness.assertEqual(targetvld.innerHTML, expectedText, "Value in " + targetvld.id + " should be '" + expectedText + "', not '" + targetvld.innerHTML + "'");
        }
        function checkvalidMsgErrMax(target,targetvld,value) {
            TextLoadValue(target, value);
            target._onBlur();
            var expectedText = targetvld.MaximumValueMessage;
            testHarness.assertEqual(targetvld.innerHTML, expectedText, "Value in " + targetvld.id + " should be '" + expectedText + "', not '" + targetvld.innerHTML + "'");
        }
        function checkvalidMsgTip(target,targetvld) {
            target.get_element().value = "";
            target._onFocus();
            var expectedText = targetvld.TooltipMessage;
            testHarness.assertEqual(targetvld.innerHTML, expectedText, "Value in " + targetvld.id + " should be '" + expectedText + "', not '" + targetvld.innerHTML + "'");
        }
        function TextLoadValue(target, value) {
            target.get_element().value = "";
            target.initialize();
            target._onFocus();
            if (target._InputDirection == Sys.Extended.UI.MaskedEditInputDirections.LeftToRight)
            {
                target.loadValue(value,target._LogicFirstPos);
            }
            else
            {
                target.loadValue(value,target._LogicLastPos);
            }
        }
        function checkText(target, text, expectedText) {
            TextLoadValue(target, text);
            target._onBlur();
            testHarness.assertEqual(target.get_element().value, expectedText, "Value in " + target.id + " should be '" + expectedText + "', not '" + target.get_element().value + "'");
        }
        function checkTextInvalid(target, text, expectedText) {
            TextLoadValue(target, text);
            testHarness.assertEqual(target.get_element().value, expectedText, "Value in " + target.id + " should be '" + expectedText + "', not '" + target.get_element().value + "'");
        }
        function checkTextTM(target, text, expectedText,AMPM) {
            TextLoadValue(target, text);
            target.InsertAMPM(AMPM);
            target._onBlur();
            testHarness.assertEqual(target.get_element().value, expectedText, "Value in " + target.id + " should be '" + expectedText + "', not '" + target.get_element().value + "'");
        }
        function checkInitialValue(target, expectedText) {
            testHarness.assertEqual(target.get_element().value, expectedText, "Initial Value in " + target.id + " should be '" + expectedText + "', not '" + target.get_element().value + "'");
        }
        // Register the tests
        function registerTests(harness)
        {
            testHarness = harness;
            
            // Get the controls from the page
            MaskedEdit1 = testHarness.getObject("ctl00_ContentPlaceHolder1_MaskedEditExtender1");
            MaskedEditvalid1 = testHarness.getElement("ctl00_ContentPlaceHolder1_MaskedEditValidator1");
            
            // Check empty Text
            var test = testHarness.addTest('Test message empty validator date');
            test.addStep(function(){checkText(MaskedEdit1, "", "");});
            test.addStep(function(){checkvalidMsgErrEmpty(MaskedEdit1,MaskedEditvalid1);});
            // Check Tip Text
            var test = testHarness.addTest('Test message tip validator date');
            test.addStep(function(){checkText(MaskedEdit1, "", "");});
            test.addStep(function(){checkvalidMsgTip(MaskedEdit1,MaskedEditvalid1);});
            // Check valid chars
            var test = testHarness.addTest('Test valid input date');
            test.addStep(function(){checkText(MaskedEdit1, "01/01/1980", "01/01/1980");});
            // Check invalid chars
            var test = testHarness.addTest('Test invalid input date');
            test.addStep(function(){checkTextInvalid(MaskedEdit1, "01a/02b/1980", "01/02/1980");});
            // Check autocomplete 
            var test = testHarness.addTest('Test autocomplete date');
            test.addStep(function(){checkText(MaskedEdit1,"05/__/____","05/23/1964");});
            test.addStep(function(){checkText(MaskedEdit1,"12/12/____","12/12/1964");});
            // Check error Text
            var test = testHarness.addTest('Test message error validator date');
            test.addStep(function(){checkvalidMsgErrInvalid(MaskedEdit1,MaskedEditvalid1,"33/33/3333");});
            // Check error Min Text
            var test = testHarness.addTest('Test message Min validator date');
            test.addStep(function(){checkvalidMsgErrMin(MaskedEdit1,MaskedEditvalid1,"01/01/1900");});
            // Check error Max Text
            var test = testHarness.addTest('Test message Max validator date');
            test.addStep(function(){checkvalidMsgErrMax(MaskedEdit1,MaskedEditvalid1,"02/02/2010");});

            // Get the controls from the page
            MaskedEdit2 = testHarness.getObject("ctl00_ContentPlaceHolder1_MaskedEditExtender2");
            MaskedEditvalid2 = testHarness.getElement("ctl00_ContentPlaceHolder1_MaskedEditValidator2");

            // Check empty Text
            var test = testHarness.addTest('Test message empty validator number');
            test.addStep(function(){checkText(MaskedEdit2, "", "");});
            test.addStep(function(){checkvalidMsgErrEmpty(MaskedEdit2,MaskedEditvalid2);});
            // Check Tip Text
            var test = testHarness.addTest('Test message tip validator number');
            test.addStep(function(){checkText(MaskedEdit2, "", "");});
            test.addStep(function(){checkvalidMsgTip(MaskedEdit2,MaskedEditvalid2);});
            // Check valid chars
            var test = testHarness.addTest('Test valid input number');
            test.addStep(function(){checkText(MaskedEdit2, "123", "123.000,00");});
            // Check invalid chars
            var test = testHarness.addTest('Test invalid input number');
            test.addStep(function(){checkText(MaskedEdit2, "1a2b3c4d5e6f.7g8", "123.456,78");});
            // Check error Max Text
            var test = testHarness.addTest('Test message Max validator number');
            test.addStep(function(){checkvalidMsgErrMax(MaskedEdit2,MaskedEditvalid2,"123");});
            // Check error Min Text
            var test = testHarness.addTest('Test message Min validator number');
            test.addStep(function(){checkvalidMsgErrMin(MaskedEdit2,MaskedEditvalid2,"000.001,23");});

            // Get the controls from the page
            MaskedEdit3 = testHarness.getObject("ctl00_ContentPlaceHolder1_MaskedEditExtender3");
            MaskedEditvalid3 = testHarness.getElement("ctl00_ContentPlaceHolder1_MaskedEditValidator3");

            // Check empty Text
            var test = testHarness.addTest('Test message empty validator Time');
            test.addStep(function(){checkText(MaskedEdit3, "", "");});
            test.addStep(function(){checkvalidMsgErrEmpty(MaskedEdit3,MaskedEditvalid3);});
            // Check Tip Text
            var test = testHarness.addTest('Test message tip validator Time');
            test.addStep(function(){checkText(MaskedEdit3, "", "");});
            test.addStep(function(){checkvalidMsgTip(MaskedEdit3,MaskedEditvalid3);});
            // Check valid chars
            var test = testHarness.addTest('Test valid input Time');
            test.addStep(function(){checkTextTM(MaskedEdit3, "05:30:23", "05:30:23","");});
            // Check invalid chars
            var test = testHarness.addTest('Test invalid input Time');
            test.addStep(function(){checkTextTM(MaskedEdit3, "aa:bb:xx", "","");});
            // Check error Text
            var test = testHarness.addTest('Test message error validator Time');
            test.addStep(function(){checkvalidMsgErrInvalidTM(MaskedEdit3,MaskedEditvalid3,"45:45:45","");});

            // Get the controls from the page
            MaskedEdit4 = testHarness.getObject("ctl00_ContentPlaceHolder1_MaskedEditExtender4");
            MaskedEditvalid4 = testHarness.getElement("ctl00_ContentPlaceHolder1_MaskedEditValidator4");
            
            // Check empty Text
            var test = testHarness.addTest('Test message empty validator None');
            test.addStep(function(){checkText(MaskedEdit4, "", "");});
            test.addStep(function(){checkvalidMsgErrEmpty(MaskedEdit4,MaskedEditvalid4);});
            // Check Tip Text
            var test = testHarness.addTest('Test message tip validator None');
            test.addStep(function(){checkText(MaskedEdit4, "", "");});
            test.addStep(function(){checkvalidMsgTip(MaskedEdit4,MaskedEditvalid4);});
            // Check valid chars
            var test = testHarness.addTest('Test valid input none');
            test.addStep(function(){checkText(MaskedEdit4, "abcdefghijabcdefghijabcdefghij", "abcdefghijabcdefghijabcdefghij");});
            test.addStep(function(){checkText(MaskedEdit4, "abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij", "abcdefghijabcdefghijabcdefghij");});
            // Check error Min Text
            var test = testHarness.addTest('Test message Min validator none');
            test.addStep(function() { checkvalidMsgErrMin(MaskedEdit4, MaskedEditvalid4, "a"); });

            // Get the controls from the page
            MaskedEdit14703 = testHarness.getObject("ctl00_ContentPlaceHolder1_MaskedEditExtender14703");

            // Check Inital text
            var test = testHarness.addTest('Issue -> 14703');
            test.addStep(function() { checkInitialValue(MaskedEdit14703, "(111) 111-1111"); });
        }
    </script>
</asp:Content>

