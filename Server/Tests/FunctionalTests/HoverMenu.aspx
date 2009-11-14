<%@ Page
    Language="C#"
    CodeFile="HoverMenu.aspx.cs"
    Inherits="Automated_HoverMenu"
    Title="HoverMenu Tests"
    MasterPageFile="~/Default.master" %>

<asp:Content ID="Content" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:Panel ID="Panel1" runat="server" style="background-color:Aqua">
        This panel is always displayed
    </asp:Panel>
    <asp:Panel ID="Popup" runat="server" style="background-color:Lime;width:300px">
        This content hovers above the panel
    </asp:Panel>
    <br />
    <asp:Button ID="Button1" runat="server" Text="Button" OnClick="Button1_Click" />

    <aspext:HoverMenuExtender ID="HoverMenuExtender1" runat="Server"  PopupControlID="Popup" TargetControlID="Panel1" PopupPosition="Left" PopDelay="0" BehaviorID="hmb1"
            DynamicControlID="Popup" DynamicContextKey="DynamicContextKey" DynamicServicePath="ToolkitTestService.asmx" DynamicServiceMethod="GetContextKey">

    </aspext:HoverMenuExtender>

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.HoverMenuBehavior'];
    
        // Test Harness
        var testHarness = null;

        // Controls in the test page
        var panel = null;
        var popup = null;
        var behavior = null;

        // Constants
        var deltaX = 40;
        var deltaY = 60;
        var className = 'watermarked';

        // Ensure the popup is not displayed
        function checkHidden() {
            testHarness.assertEqual(popup.style.visibility, 'hidden', 'Popup should be hidden');
        }

        // Ensure the popup is displayed
        function checkVisible() {
            testHarness.assertEqual(popup.style.visibility, 'visible', 'Popup should be visible');
        }

        // Display the menu
        function showMenuAndCheckVisible() {
            testHarness.fireEvent(panel, 'onmouseover');
            checkVisible();
        }

        // Poll for the dynamic content to be populated
        function pollPopulated() {
            return (popup.innerHTML == 'DynamicContextKey');
        }

        // Hide the menu
        function hideMenu() {
            testHarness.fireEvent(panel, 'onmouseout');            
        }

        // Register the tests
        function registerTests(harness)
        {
            testHarness = harness;

            // Get the controls on the page
            panel = testHarness.getElement('ctl00_ContentPlaceHolder1_Panel1');
            popup = testHarness.getElement('ctl00_ContentPlaceHolder1_Popup');
            behavior = testHarness.getObject('hmb1');
            
            var test = testHarness.addTest('Initially Hidden');
            test.addStep(checkHidden);
            
            var test = testHarness.addTest('Show');
            test.addStep(checkHidden);
            test.addStep(showMenuAndCheckVisible, pollPopulated);
            
            var test = testHarness.addTest('Show again');
            test.addStep(checkHidden);
            test.addStep(showMenuAndCheckVisible);
            test.addStep(showMenuAndCheckVisible);
            
            var test = testHarness.addTest('Hide');
            test.addStep(checkHidden);
            test.addStep(showMenuAndCheckVisible);
            test.addStep(hideMenu, function() { try { checkHidden(); return true; } catch (ex) { return false; } }, 200, 5000);
            
            var test = testHarness.addTest('Tweak');
            test.addStep(function () {
                panel.style.backgroundColor = '';
                behavior.set_HoverCssClass(className);
                behavior.set_PopupPosition( null);
                behavior.set_OffsetX( behavior.get_OffsetX() + deltaX);
                behavior.set_OffsetY( behavior.get_OffsetY() + deltaY);
                behavior.set_PopDelay( behavior.get_PopDelay() + 50);
                showMenuAndCheckVisible();
                var bounds = CommonToolkitScripts.getBounds(popup);
                testHarness.assertTrue(deltaX <= bounds.x, 'X unchanged');
                testHarness.assertTrue(deltaY <= bounds.y, 'Y unchanged');
                testHarness.assertEqual(className, panel.className, 'CSS class not applied');
            });
        }
    </script>
</asp:Content>