<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Popup.aspx.cs" Inherits="Popup" MasterPageFile="~/Default.master" %>

<asp:Content ID="Content" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:TextBox ID="T" runat="server" />
    <asp:Panel ID="P" runat="server" BorderStyle="Solid" BorderWidth="1" BorderColor="Black">
        Foo
    </asp:Panel>
    <aspext:PopupExtender runat="Server" ID="PE" TargetControlID="P" ParentElementID="T" />
    
    <div style="position: absolute;">
        <asp:TextBox ID="TextBox2" runat="server" />
        <asp:Panel ID="Panel2" runat="server" BorderStyle="Solid" BorderWidth="1" BorderColor="Black">
            Foo
        </asp:Panel>
        <aspext:PopupExtender runat="Server" ID="PopupExtender2" TargetControlID="Panel2" ParentElementID="TextBox2" />
    </div>
    
    <div style="position: relative;">
        <asp:TextBox ID="TextBox3" runat="server" />
        <asp:Panel ID="Panel3" runat="server" BorderStyle="Solid" BorderWidth="1" BorderColor="Black">
            Foo
        </asp:Panel>
        <aspext:PopupExtender runat="Server" ID="PopupExtender3" TargetControlID="Panel3" ParentElementID="TextBox3" />
    </div>


    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.PopupBehavior'];
    
        // TestRunner
        var testHarness = null;

        // Controls in the test page
        var textbox = null;
        var popup = null;
        var popup2 = null;
        var popup3 = null;

        // Ensure the popup is not displayed
        function checkHidden() {
            testHarness.assertEqual(popup.style.display, 'none', 'Popup should be hidden');
        }

        // Ensure the popup is displayed
        function checkVisible() {
            testHarness.assertEqual(popup.style.display, '', 'Popup should be visible');
        }

        function showPopup() {
            popup._behaviors[0].show();
        }
        
        function hidePopup() {
            popup._behaviors[0].hide();
        }

        function showPopup2(popupObj) {
            popupObj._behaviors[0].show();
        }

        function testAppearanceOverOtherPageElements(popupElement, errorMsg) {
            var hideWindowedElementsIFrame = popupElement._hideWindowedElementsIFrame;

            var popupElementBounds = $common.getBounds(popupElement);
            var iframeBounds = $common.getBounds(hideWindowedElementsIFrame);

            testHarness.assertEqual(popupElementBounds.x, iframeBounds.x, errorMsg);
            testHarness.assertEqual(popupElementBounds.y, iframeBounds.y, errorMsg);
            testHarness.assertEqual(popupElementBounds.width, iframeBounds.width, errorMsg);
            testHarness.assertEqual(popupElementBounds.height, iframeBounds.height, errorMsg);
        }
        
        // Register the tests
        function registerTests(harness)
        {
            testHarness = harness;

            // Get the controls on the page
            textbox = testHarness.getElement('ctl00_ContentPlaceHolder1_T');
            popup = testHarness.getElement('ctl00_ContentPlaceHolder1_P');
            popup2 = testHarness.getElement('ctl00_ContentPlaceHolder1_Panel2');
            popup3 = testHarness.getElement('ctl00_ContentPlaceHolder1_Panel3');
            
            var test = testHarness.addTest('Initial state');
            test.addStep(checkHidden);
            
            test = testHarness.addTest('Show');
            test.addStep(checkHidden);
            test.addStep(showPopup);
            test.addStep(checkVisible);

            test = testHarness.addTest('Hide');
            test.addStep(checkHidden);
            test.addStep(showPopup);
            test.addStep(checkVisible);
            test.addStep(hidePopup);
            test.addStep(checkHidden);

            if ((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.version < 7)) {
                test = testHarness.addTest('Test appearance over other page elements in IE6');
                test.addStep(function() {
                    showPopup2(popup);
                });
                test.addStep(function() {
                    testAppearanceOverOtherPageElements(popup, 'In IE6 the popup doesn\'t appear above other page elements.');
                });
                test.addStep(function() {
                    showPopup2(popup2);
                });
                test.addStep(function() {
                    testAppearanceOverOtherPageElements(popup2, 'In IE6 the popup doesn\'t appear above other page elements when it is positioned absolute.');
                });
                test.addStep(function() {
                    showPopup2(popup3);
                });
                test.addStep(function() {
                    testAppearanceOverOtherPageElements(popup3, 'In IE6 the popup doesn\'t appear above other page elements when it is positioned relative.');
                });
            }
        }
    </script>
</asp:Content>