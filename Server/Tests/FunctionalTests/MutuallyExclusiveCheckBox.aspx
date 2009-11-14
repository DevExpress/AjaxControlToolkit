<%@ Page Language="C#" MasterPageFile="~/Default.master" AutoEventWireup="true" Title="MutuallyExclusiveCheckBox Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <table>
        <tr>
            <td>
                <b>0</b><br />
	            <asp:Checkbox runat="server" id="A0" Text="A" /><br />
	            <asp:Checkbox runat="server" id="B0" Text="B" /><br />
            </td>
            <td>
                <b>1</b><br />
	            <asp:Checkbox runat="server" id="A1" Text="A" /><br />
	            <asp:Checkbox runat="server" id="B1" Text="B" /><br />
            </td>            
        </tr>
    </table>
    
    <aspext:MutuallyExclusiveCheckboxExtender ID="A0Ext" runat="server" TargetControlID="A0" Key="ACheckBoxes" />
    <aspext:MutuallyExclusiveCheckboxExtender ID="B0Ext" runat="server" TargetControlID="B0" Key="BCheckBoxes" />
    <aspext:MutuallyExclusiveCheckboxExtender ID="A1Ext" runat="server" TargetControlID="A1" Key="ACheckBoxes" />
    <aspext:MutuallyExclusiveCheckboxExtender ID="B1Ext" runat="server" TargetControlID="B1" Key="BCheckBoxes" />
    
    <script type="text/javascript">
    // Script objects that should be loaded before we run
    var typeDependencies = ['Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior'];
    
    // Test Harness
    var testHarness = null;
    
    var A0;
    var B0;
    var A1;
    var B1;
    
    function checkACheckBoxes(checked0, checked1) {
        testHarness.assertEqual(A0.checked, checked0, 'CheckBox A0.checked is ' + A0.checked + ' should be ' + checked0);
        testHarness.assertEqual(A1.checked, checked1, 'CheckBox A1.checked is ' + A1.checked + ' should be ' + checked1);
    }
    function checkBCheckBoxes(checked0, checked1) {
        testHarness.assertEqual(B0.checked, checked0, 'CheckBox B0.checked is ' + B0.checked + ' should be ' + checked0);
        testHarness.assertEqual(B1.checked, checked1, 'CheckBox B1.checked is ' + B1.checked + ' should be ' + checked1);
    }
    function clickA0() {
        A0.click();
    }
    function clickA1() {
        A1.click();
    }
    function clickB0() {
        B0.click();
    }
    function clickB1() {
        B1.click();
    }

    // Register the tests
    function registerTests(harness) {
        testHarness = harness;
        var test;
        
        A0 = $get('ctl00_ContentPlaceHolder1_A0');
        B0 = $get('ctl00_ContentPlaceHolder1_B0');
        A1 = $get('ctl00_ContentPlaceHolder1_A1');
        B1 = $get('ctl00_ContentPlaceHolder1_B1');
        
        test = testHarness.addTest('Initial State');
        test.addStep(function() { checkACheckBoxes(false, false); });
        test.addStep(function() { checkBCheckBoxes(false, false); });
        
        test = testHarness.addTest('Check A0');
        test.addStep(function() { clickA0(); });
        test.addStep(function() { checkACheckBoxes(true, false); });
        test.addStep(function() { checkBCheckBoxes(false, false); });

        test = testHarness.addTest('Check A0, A1');
        test.addStep(function() { clickA0(); });
        test.addStep(function() { clickA1(); });
        test.addStep(function() { checkACheckBoxes(false, true); });
        test.addStep(function() { checkBCheckBoxes(false, false); });

        test = testHarness.addTest('Check A0, B0');
        test.addStep(function() { clickA0(); });
        test.addStep(function() { clickB0(); });
        test.addStep(function() { checkACheckBoxes(true, false); });
        test.addStep(function() { checkBCheckBoxes(true, false); });
    }

    </script>
    
</asp:Content>

