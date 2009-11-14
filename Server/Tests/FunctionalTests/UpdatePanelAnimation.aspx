<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    AutoEventWireup="true"
    CodeFile="UpdatePanelAnimation.aspx.cs"
    Inherits="UpdatePanelAnimation"
    Title="UpdatePanelAnimation Tests" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <script type="text/javascript">
        // Flags that will be set in the animation
        window.updating = false;
        window.updated = false;
    </script>

    <asp:UpdatePanel ID="update" runat="server">
        <ContentTemplate>
            <asp:TextBox ID="txtValue" runat="server" Text="" />
            <asp:Button ID="btnUpdate" runat="server" Text="Update" OnClick="btnUpdate_Click" />
        </ContentTemplate>
    </asp:UpdatePanel>
    
        
    <aspext:UpdatePanelAnimationExtender ID="UpdatePanelAnimationExtender1" runat="server" TargetControlID="update">
        <Animations>
            <OnUpdating><ScriptAction Script="window.updating = true;"/></OnUpdating>
            <OnUpdated><ScriptAction Script="window.updated = true;"/></OnUpdated>
        </Animations>
    </aspext:UpdatePanelAnimationExtender>

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.Animation.Animation', 'Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior'];
    
        // Test Harness
        var testHarness = null;

        // Controls in the test page
        var txtValue = null;
        var behavior = null;
        var btnUpdate = null;
        
        // Register the tests
        function registerTests(harness) {
            testHarness = harness;

            // Get the controls on the page
            txtValue = testHarness.getElement('ctl00_ContentPlaceHolder1_txtValue');
            btnUpdate = testHarness.getElement('ctl00_ContentPlaceHolder1_btnUpdate');
            behavior = testHarness.getObject('ctl00_ContentPlaceHolder1_UpdatePanelAnimationExtender1');
            
            test = testHarness.addTest('OnUpdating/OnUpdated');
            test.addStep(
                function() {
                    if (Sys.Browser.agent == Sys.Browser.Firefox) {
                        testHarness.cancel('This test cannot be run on Firefox because it does not allow causing an update by calling .click() on a control inside an UpdatePanel');
                    } else {
                        btnUpdate.click();
                    }
                },
                function() { return (window.updating && window.updated); },
                100, 5000,
                function() {
                    testHarness.assertTrue(window.updating, 'Updating animation did not play');
                    testHarness.assertTrue(window.updated, 'Updated animation did not play');
                });

        }
    </script>
</asp:Content>