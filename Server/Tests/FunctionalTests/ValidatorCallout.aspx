<%@ Page Language="C#" MasterPageFile="~/Default.master" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:TextBox runat="server" ID="T0" />
    <asp:RequiredFieldValidator runat="server" ID="R0" ControlToValidate="T0" ErrorMessage="T0-R0" />
    <asp:TextBox runat="server" ID="T1" />
    <asp:CompareValidator runat="server" ID="R1" ControlToValidate="T1" ValueToCompare="1" Operator="GreaterThan" Type="Integer" ErrorMessage="T1-R1" />
    <asp:Button runat="server" ID="B0" Text="B0" />
    
    <aspext:ValidatorCalloutExtender runat="server" ID="V0" TargetControlID="R0" />
    <aspext:ValidatorCalloutExtender runat="server" ID="V1" TargetControlID="R1" />
    
    <script type="text/javascript">
    // Script objects that should be loaded before we run
    var typeDependencies = ['Sys.Extended.UI.ValidatorCalloutBehavior'];
    
    // Test Harness
    var testHarness = null;
    
    var T0;
    var R0;
    var T1;
    var R1;
    var V0;
    var V1;       
    
    function setT0Empty() {
        T0.value = "";
    }
    function setT0NotEmpty() {
        T0.value = "T0";
    }
    function setT1Empty() {
        T1.value = "";
    }
    function setT1Invalid() {
        T1.value = "0";
    }
    function setT1Valid() {
        T1.value = "2";
    }
    
    function checkValidatorIsShown(validator) {
        return (validator._popupBehavior) ?
            $common.getVisible(validator._popupBehavior.get_element()) :
            false;
    }
    
    function checkV0Visible() {
        testHarness.assertTrue(V0.get_isOpen(), "V0 is not open and should be");
        testHarness.assertTrue(checkValidatorIsShown(V0), "V0 is not visible and should be");
    }
    
    function checkV0Hidden() {
        testHarness.assertFalse(V0.get_isOpen(), "V0 is open and should not be");
        testHarness.assertFalse(checkValidatorIsShown(V0), "V0 is visible and should not be");
    }
    
    function checkV1Visible() {
        testHarness.assertTrue(V1.get_isOpen(), "V1 is not open and should be");
        testHarness.assertTrue(checkValidatorIsShown(V1), "V1 is not visible and should be");
    }
    
    function checkV1Hidden() {
        testHarness.assertFalse(V1.get_isOpen(), "V1 is open and should not be");
        testHarness.assertFalse(checkValidatorIsShown(V1), "V1 is visible and should not be");
    }
    
    function clickCloseOnV0() {
        V0._closeImage.click();
    }
    
    function setFocusToT0() {
        T0.focus();
    }

    function setFocusToT1() {
        T1.focus();
    }
    
    function clickB0() {
        B0.click();
    }

    // Register the tests
    function registerTests(harness) {
        testHarness = harness;
        var test;
        
        T0 = testHarness.getElement("<%=T0.ClientID%>");
        R0 = testHarness.getElement("<%=R0.ClientID%>");
        T1 = testHarness.getElement("<%=T1.ClientID%>");
        R1 = testHarness.getElement("<%=R1.ClientID%>");
        B0 = testHarness.getElement("<%=B0.ClientID%>");
        V0 = testHarness.getObject("<%=V0.ClientID%>");
        V1 = testHarness.getObject("<%=V1.ClientID%>");
        
        test = testHarness.addTest("Invalidate T0 (RequiredField)");
        test.addStep(function() { setT0Empty(); });
        test.addStep(function() { checkV0Hidden(); });
        test.addStep(function() { clickB0(); });
        test.addStep(function() { checkV0Visible(); });
        
        test = testHarness.addTest("Invalidate T0 (RequiredField), then validate");
        test.addStep(function() { setT0Empty(); });
        test.addStep(function() { checkV0Hidden(); });
        test.addStep(function() { setT0NotEmpty(); });
        test.addPostBack(B0);
        test.addStep(function() { checkV0Hidden(); });
        
        test = testHarness.addTest("Invalidate T1 (Compare)");
        test.addStep(function() { setT0NotEmpty(); });
        test.addStep(function() { checkV1Hidden(); });
        test.addStep(function() { setT1Invalid(); });
        test.addStep(function() { clickB0(); });
        test.addStep(function() { checkV1Visible(); });
        
//        test = testHarness.addTest("Invalidate T0, T1 (set focus to T1)");
//        test.addStep(function() { setT0Empty(); });
//        test.addStep(function() { setT1Invalid(); });
//        test.addStep(function() { clickB0(); });
//        test.addStep(function() { setFocusToT0(); });        
//        test.addStep(function() { checkV0Visible(); });
//        test.addStep(function() { setFocusToT1(); });        
//        test.addStep(function() { checkV1Visible(); });
        
//        test = testHarness.addTest("Invalidate T0, click close");
//        test.addStep(function() { setT0Empty(); });
//        test.addStep(function() { clickB0(); });
//        test.addStep(function() { checkV0Visible(); });
//        test.addStep(function() { clickCloseOnV0(); });        
//        test.addStep(function() { checkV0Hidden(); });

        test = testHarness.addTest("Bug 10900: T0 was shown, T0 becomes valid, push submit, T1 should show");
        test.addStep(function() { setT0Empty(); });
        test.addStep(function() { setFocusToT1(); });
        test.addStep(function() { setT1Invalid(); });
        test.addStep(function() { clickB0(); });
        test.addStep(function() { checkV0Visible(); });
        test.addStep(function() { checkV1Hidden(); });
        test.addStep(function() { setT0NotEmpty(); });
        test.addStep(function() { clickB0(); });
        test.addStep(function() { checkV0Hidden(); });
        test.addStep(function() { checkV1Visible(); });
    }

    </script>
    


</asp:Content>

