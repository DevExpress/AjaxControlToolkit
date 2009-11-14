<%@ Page
    Language="C#"
    CodeFile="ExtenderBase.aspx.cs"
    Inherits="Automated_ExtenderBase"
    Theme="TestTheme" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>ExtenderBase Tests</title>
</head>
<body>
    <form id="form1" runat="server">
    <aspext:ToolkitScriptManager ID="ScriptManager1" runat="server" />
    <div>

    <asp:LoginView ID="LoginView1" runat="server">
        <AnonymousTemplate>
            <asp:Button ID="LoginViewButton" runat="server" Text="Button" />
            <asp:Label ID="LoginViewLabel" runat="server" />
            <br />
            <asp:Panel ID="LoginViewPanel1" runat="server">
            </asp:Panel>
            <asp:Panel ID="LoginViewPanel2" runat="server">
            </asp:Panel>
        </AnonymousTemplate>
        <LoggedInTemplate>
            <asp:Button ID="LoginViewButton" runat="server" Text="Button" />
            <asp:Label ID="LoginViewLabel" runat="server" />
            <br />
            <asp:Panel ID="LoginViewPanel1" runat="server">
            </asp:Panel>
            <asp:Panel ID="LoginViewPanel2" runat="server">
            </asp:Panel>
        </LoggedInTemplate>
    </asp:LoginView>

    <%-- Note: The following is a deliberate use of obsolete OnResolveTargetControlID
    to test it. It has been removed to avoid the compiler warning that results.
    OnResolveTargetControlID="cbe_ResolveTargetControlID" --%>
    <aspext:ConfirmButtonExtender ID="ConfirmButtonExtender1" BehaviorID="ConfirmButtonBehavior1" runat="server" ScriptPath="ExtenderBase.js" TargetControlID="LoginView1:LoginViewButton" ConfirmText="SUCCESS" />

    <aspext:CollapsiblePanelExtender ID="CollapsiblePanelExtender1" runat="server" OnResolveControlID="cpe_ResolveControlID" TargetControlID="LoginViewPanel1" ExpandControlID="LoginViewPanel2" />

    <!-- The following is a test that verifies Theme/Skin support is present and working; WatermarkText is explicitly unspecified here -->
    <br />
    <asp:TextBox ID="TextBox1" runat="server" />
    <aspext:TextBoxWatermarkExtender ID="TextBoxWatermarkExtender1" runat="server" TargetControlID="TextBox1" SkinID="TextBoxWatermarkExtenderSkin" />

   <script type="text/javascript">
        var typeDependencies = ['Sys.Extended.UI.ConfirmButtonBehavior', 'Sys.Extended.UI.CollapsiblePanelBehavior'];

        // Register the AlwaysVisibleControl test cases
        function registerTests(harness) {
            testHarness = harness;
          
            // Get the elements on the page
            var element = testHarness.getElement('LoginView1_LoginViewButton');
            var behavior = testHarness.getObject('ConfirmButtonBehavior1');

            // Test the initialization
            var test = testHarness.addTest('Initialization');
            test.addStep(function() {
                testHarness.assertEqual(element, behavior.get_element(), "Element did not get hooked up");
                testHarness.assertEqual(element.value, "SUCCESS", "Result did not get set properly");
            });
        }
   </script>

    </div>
    </form>
</body>
</html>
