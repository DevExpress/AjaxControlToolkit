<%@ Page
    Language="C#"
    CodeFile="ConfirmButton.aspx.cs"
    Inherits="Automated_ConfirmButton"
    Title="ConfirmButton Tests"
    MasterPageFile="~/Default.master" %>

<asp:Content ID="Content" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:Label ID="Label1" runat="server" />
    <asp:Button ID="Button2" runat="server" OnClick="Link_Click" Text="Click Me"/>

    <aspext:ConfirmButtonExtender ID="ConfirmButtonExtender1" runat="server" TargetControlID="Button2" ConfirmText="Are you sure you want to click this?&#10;Really??" />

    <asp:Button ID="Button3" runat="server" OnClick="Link_Click" Text="Submit test" />
    <aspext:ConfirmButtonExtender ID="ConfirmButtonExtender3" runat="server" TargetControlID="Button3" ConfirmText="Are you sure you want to click this?&#10;Really??" ConfirmOnFormSubmit="true" />

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.ConfirmButtonBehavior'];
    
        // Test Harness
        var testHarness = null;

        // Controls in the test page
        var label = null;
        var link = null;
        var btn = null;
        var behavior = null;

        // Variables
        var confirmText = 'Are you sure you want to click this?\nReally??';

        // Function used to replace window.confirm and return true
        function confirmYes(prompt) {
            testHarness.assertEqual(prompt, confirmText, 'Confirmation message incorrect');
            return true;
        }

        // Function used to replace window.confirm and return false
        function confirmNo(prompt) {
            testHarness.assertEqual(prompt, confirmText, 'Confirmation message incorrect');
            return false;
        }
        
        function setConfirm(func) {
            return function() { testHarness.getWindow().confirm = func; };
        }

        // Register the tests
        function registerTests(harness) {
            testHarness = harness;

            // Get the controls on the page
            link = testHarness.getElement('ctl00_ContentPlaceHolder1_Button2');
            label = testHarness.getElement('ctl00_ContentPlaceHolder1_Label1');
            behavior = testHarness.getObject('ctl00_ContentPlaceHolder1_ConfirmButtonExtender1');
            button3 = testHarness.getElement('ctl00_ContentPlaceHolder1_Button3');
            behavior3 = testHarness.getObject('ctl00_ContentPlaceHolder1_ConfirmButtonExtender3');

            var test = testHarness.addTest('Initial');
            test.addStep(function() {
                testHarness.assertTrue(label.innerHTML == null || label.innerHTML.length == 0,  'Label should be empty');
                testHarness.assertEqual(behavior.get_ConfirmText.call(behavior), confirmText, 'Confirm text mis-match');
            });

            test = testHarness.addTest('Click Yes');
            test.addStep(setConfirm(confirmYes));
            test.addPostBack(link);
            test.addStep(function() { testHarness.assertTrue(label.innerHTML != null && label.innerHTML.length != 0, 'Label should not be empty'); });

            test = testHarness.addTest('Click No');
            test.addStep(setConfirm(confirmNo));
            test.addStep(function() { link.click(); });
            test.addStep(function() { testHarness.assertTrue(label.innerHTML == null || label.innerHTML.length == 0, 'Label should be empty'); });

            test = testHarness.addTest('Change confirm text, click No');
            test.addStep(function() {
                confirmText = 'Altered confirm text';
                behavior.set_ConfirmText.call(behavior, confirmText);
            });
            test.addStep(setConfirm(confirmNo));
            test.addStep(function() { link.click(); });
            
            test = testHarness.addTest('Ignore when disabled');
            test.addStep(function() { link.disabled = true; });
            test.addStep(setConfirm(confirmYes));
            test.addStep(function() { link.click(); });
            test.addStep(function() { testHarness.assertTrue(label.innerHTML == null || label.innerHTML.length == 0, 'Label should be empty'); });

            test = testHarness.addTest('Click Yes (ConfirmOnFormSubmit)');
            test.addStep(setConfirm(confirmYes));
            test.addPostBack(button3);
            test.addStep(function() { testHarness.assertTrue(label.innerHTML != null && label.innerHTML.length != 0, 'Label should not be empty'); });

            test = testHarness.addTest('Click No (ConfirmOnFormSubmit)');
            test.addStep(setConfirm(confirmNo));
            test.addStep(function() { button3.click(); });
            test.addStep(function() { testHarness.assertTrue(label.innerHTML == null || label.innerHTML.length == 0, 'Label should be empty'); });
        }
    </script>
</asp:Content>