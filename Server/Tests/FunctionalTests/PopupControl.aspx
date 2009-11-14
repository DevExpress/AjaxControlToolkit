<%@ Page
    Language="C#"
    CodeFile="PopupControl.aspx.cs"
    Inherits="Automated_PopupControl"
    Title="PopupControl Tests"
    MasterPageFile="~/Default.master" %>

<asp:Content ID="Content" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:TextBox ID="TextBox1" runat="server" autocomplete="off"></asp:TextBox>
    <aspext:PopupControlExtender ID="PopupControlExtender1" runat="server" TargetControlID="TextBox1" PopupControlID="Popup1" Position="Bottom" CommitScript="$get('ctl00_ContentPlaceHolder1_TextBox1').style.backgroundColor='lime';"
            DynamicControlID="Label1" DynamicContextKey="DynamicContextKey" DynamicServicePath="ToolkitTestService.asmx" DynamicServiceMethod="GetContextKey" />

    <asp:Panel ID="Popup1" runat="server" BorderStyle="Solid" BorderWidth="1" BorderColor="Black">
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
                <asp:Label ID="Label1" runat="server" Text="This content hovers above the panel"></asp:Label>
                <asp:Button ID="Button1" runat="server" Text="Commit" OnClick="Button1_Click" UseSubmitBehavior="false" />
                <asp:Button ID="Button2" runat="server" Text="Clear" OnClick="Button2_Click" UseSubmitBehavior="false" />
                <asp:Button ID="Button3" runat="server" Text="Cancel" OnClick="Button3_Click" UseSubmitBehavior="false" />
                <asp:Button ID="Button7" runat="server" Text="Multiple Cancel" OnClick="Button7_Click" UseSubmitBehavior="false" />
                <asp:Button ID="Button8" runat="server" Text="Commit(foo) / Commit(bar)" OnClick="Button8_Click" UseSubmitBehavior="false" />
                <asp:Button ID="Button9" runat="server" Text="Cancel() / Commit(bar2)" OnClick="Button9_Click" UseSubmitBehavior="false" />
                <asp:Button ID="Button10" runat="server" Text="Commit(bar3) / Cancel()" OnClick="Button10_Click" UseSubmitBehavior="false" />
            </ContentTemplate>
        </asp:UpdatePanel>
    </asp:Panel>


    <asp:UpdatePanel ID="UpdatePanel2" runat="server" RenderMode="Inline">
        <ContentTemplate>
            <asp:TextBox ID="TextBox2" runat="server" autocomplete="off"></asp:TextBox>
            <aspext:PopupControlExtender ID="PopupControlExtender2" runat="server" TargetControlID="TextBox2" PopupControlID="Popup2" Position="Right" CommitScript="$get('ctl00_ContentPlaceHolder1_TextBox2').style.backgroundColor='aqua';" />
        </ContentTemplate>
    </asp:UpdatePanel>

    <asp:Panel ID="Popup2" runat="server" BorderStyle="Solid" BorderWidth="1" BorderColor="Black">
        <asp:UpdatePanel ID="UpdatePanel3" runat="server">
            <ContentTemplate>
                <asp:Label ID="Label2" runat="server" Text="This content hovers above the panel"></asp:Label>
                <asp:Button ID="Button4" runat="server" Text="Commit" OnClick="Button4_Click" UseSubmitBehavior="false" />
                <asp:Button ID="Button5" runat="server" Text="Clear" OnClick="Button5_Click" UseSubmitBehavior="false" />
                <asp:Button ID="Button6" runat="server" Text="Cancel" OnClick="Button6_Click" UseSubmitBehavior="false" />
            </ContentTemplate>
        </asp:UpdatePanel>
    </asp:Panel>


    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.PopupControlBehavior'];
    
        // TestRunner
        var testHarness = null;

        // Controls in the test page
        var textbox = null;
        var textbox2 = null;
        var popup = null;
        var label = null;

        // Ensure the popup is not displayed
        function checkHidden() {
            testHarness.assertFalse(Sys.UI.DomElement.getVisible(popup), 'Popup should be hidden');
        }

        // Ensure the popup is displayed
        function checkVisible() {
            testHarness.assertTrue(Sys.UI.DomElement.getVisible(popup), 'Popup should be visible');
        }

        function pollPopulated() {
            return (label.innerHTML == 'DynamicContextKey');
        }

        function clickTextbox() {
            testHarness.fireEvent(textbox, 'onclick');
        }

        function clickBody() {
            testHarness.fireEvent(testHarness.getDocument().body, 'onclick');
        }

        function commit() {
            // Find the commit button (UpdatePanel submits change it)
            commit = testHarness.getElement('ctl00_ContentPlaceHolder1_Button1');
            commit.click();
        }

        function commit2() {
            // Find the commit button (UpdatePanel submits change it)
            commit2 = testHarness.getElement('ctl00_ContentPlaceHolder1_Button4');
            commit2.click();
        }

        function clear() {
            // Find the clear button (UpdatePanel submits change it)
            clear = testHarness.getElement('ctl00_ContentPlaceHolder1_Button2');
            clear.click();
        }

        function cancel() {
            // Find the cancel button (UpdatePanel submits change it)
            cancel = testHarness.getElement('ctl00_ContentPlaceHolder1_Button3');
            cancel.click();
        }

        function multipleCancel() {
            // Find the multiple cancel button (UpdatePanel submits change it)
            manyCancel = testHarness.getElement('ctl00_ContentPlaceHolder1_Button7');
            manyCancel.click();
        }
        
        function commitFooBar() {
            // Find the cancel foobar button (UpdatePanel submits change it)
            closeFooBar = testHarness.getElement('ctl00_ContentPlaceHolder1_Button8');
            closeFooBar.click();
        }
        
        function cancelCommit() {
            // Find the cancel foobar button (UpdatePanel submits change it)
            trigger = testHarness.getElement('ctl00_ContentPlaceHolder1_Button9');
            trigger.click();
        }
        
        function commitCancel() {
            // Find the cancel foobar button (UpdatePanel submits change it)
            trigger = testHarness.getElement('ctl00_ContentPlaceHolder1_Button10');
            trigger.click();
        }
        

        // Register the tests
        function registerTests(harness)
        {
            testHarness = harness;

            // Get the controls on the page
            textbox = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox1');
            textbox2 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox2');
            popup = testHarness.getElement('ctl00_ContentPlaceHolder1_Popup1');
            popup2 = testHarness.getElement('ctl00_ContentPlaceHolder1_Popup2');
            label = testHarness.getElement('ctl00_ContentPlaceHolder1_Label1');

            var test = testHarness.addTest('Initial state');
            test.addStep(checkHidden);

            test = testHarness.addTest('Show');
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);

            test = testHarness.addTest('Hide');
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);
            test.addStep(clickBody);
            test.addStep(checkHidden);

            test = testHarness.addTest('Show Again');
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);
            test.addStep(clickBody);
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);

            test = testHarness.addTest('Cancel in Popup');
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);
            test.addStep(cancel, function() { return !Sys.UI.DomElement.getVisible(popup); }, 200, 5000);
            test.addStep(function() { testHarness.assertEqual(textbox.value, '', 'Popup value committed'); });

            test = testHarness.addTest('Commit in Popup');
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);
            test.addStep(commit, function() { return !Sys.UI.DomElement.getVisible(popup); }, 200, 5000);
            test.addStep(function() {
                testHarness.assertEqual(textbox.value, 'Commit', 'Popup value not committed');
                testHarness.assertEqual(textbox.style.backgroundColor, 'lime', 'CommitScript not run');
            });

            test = testHarness.addTest('Commit empty text in Popup');
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);
            test.addStep(function() { textbox.value = 'text'; });
            test.addStep(clear, function() { return !Sys.UI.DomElement.getVisible(popup); }, 200, 5000);
            test.addStep(function() {
                testHarness.assertEqual(textbox.value, '', 'Popup value not committed');
                testHarness.assertEqual(textbox.style.backgroundColor, 'lime', 'CommitScript not run');
            });

            test = testHarness.addTest('Commit in UpdatePanel Popup');
            test.addStep(function () { testHarness.fireEvent(textbox2, 'onclick'); });
            test.addStep(commit2, function() { return (
                    ( $get('ctl00_ContentPlaceHolder1_TextBox2').value == 'Commit' ) &&
                    ( $get('ctl00_ContentPlaceHolder1_TextBox2').style.backgroundColor == 'aqua')); }, 200, 10000);
            
            test = testHarness.addTest('Mutliple calls to Cancel() on server');
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);
            test.addStep(multipleCancel, function() { return !Sys.UI.DomElement.getVisible(popup); }, 200, 5000);
            test.addStep(function() { testHarness.assertEqual(textbox.value, '', 'Popup value committed'); });
            
            test = testHarness.addTest('Commit("foo") / Commit("bar")');
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);
            test.addStep(commitFooBar, function() { return !Sys.UI.DomElement.getVisible(popup); }, 200, 5000);
            test.addStep(function() { testHarness.assertEqual(textbox.value, 'bar', 'Popup value committed'); });
            
            test = testHarness.addTest('Cancel() / Commit("bar2")');
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);
            test.addStep(cancelCommit, function() { return !Sys.UI.DomElement.getVisible(popup); }, 200, 5000);
            test.addStep(function() { testHarness.assertEqual(textbox.value, 'bar2', 'Popup value committed'); });
            
           test = testHarness.addTest('Commit("bar3") / Cancel()');
            test.addStep(checkHidden);
            test.addStep(clickTextbox);
            test.addStep(checkVisible, pollPopulated);
            test.addStep(commitCancel, function() { return !Sys.UI.DomElement.getVisible(popup); }, 200, 5000);
            test.addStep(function() { testHarness.assertEqual(textbox.value, '', 'Popup value canceled'); });
        }
    </script>
</asp:Content>