<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    AutoEventWireup="true"
    CodeFile="TestHarnessTests.aspx.cs"
    Inherits="Automated_TestHarnessTests"
    Title="Test Harness Tests" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <input id="btn" type="button" value="Button" onclick="clicked = true; return false;" />
    <script type="text/javascript">
        var testHarness = null;
        var clicked = false;
        
        function testAsserts() {
            testHarness.assertTrue(true, 'assertTrue');
            testHarness.assertNull(null);
            testHarness.assertNull(null, 'assertNull');
            testHarness.assertNotNull(this);
            testHarness.assertNotNull(this, 'assertNotNull');
            testHarness.assertEqual(1, 1);
            testHarness.assertEqual(1, 1, 'assertEqual');
            testHarness.assertNotEqual(1, 2);
            testHarness.assertNotEqual(1, 2, 'assertNotEqual');
        }

        function registerTests(harness) {
        
            testHarness = harness;
            
            var test = testHarness.addTest('Asserts');
            test.addStep(testAsserts);
            
            test = testHarness.addTest('Events');
            test.addStep(function() {
                testHarness.fireEvent(testHarness.getElement('btn'), 'onclick');
                testHarness.assertTrue(clicked, 'fireEvent failed');
            });
            
            test = testHarness.addTest('Type Conversion');
            test.addStep(function() {
                testHarness.assertNotEqual(1, '1', 'Type converted undesirably');
            });

            /*

            // Failure tests
            testRunner.Log('  TestRunner: Fail test');
            testRunner.Fail('TestRunner: Fail intentionally called');

            testRunner.Log('  TestRunner: Assert failure test');
            testRunner.Assert(false, '  TestRunner: Assert intentionally failed');

            testRunner.Log('  TestRunner: AssertNull failure test');
            testRunner.AssertNull(this);
            testRunner.AssertNull(this, 'AssertNull intentionally failed');

            testRunner.Log('  TestRunner: AssertNotNull failure test');
            testRunner.AssertNotNull(null);
            testRunner.AssertNotNull(null, 'AssertNotNull intentionally failed');

            testRunner.Log('  TestRunner: AssertEqual failure test');
            testRunner.AssertEqual(1, 2);
            testRunner.AssertEqual(1, 2, 'AssertEqual intentionally failed');

            testRunner.Log('  TestRunner: AssertNotEqual failure test');
            testRunner.AssertNotEqual(1, 1);
            testRunner.AssertNotEqual(1, 1, 'AssertNotEqual intentionally failed');

            testRunner.Log('  TestRunner: Type conversion failure test');
            testRunner.AssertEqual(1, '1', 'Type converted undesirably');

            */
        }
    </script>
</asp:Content>

