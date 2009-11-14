<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    AutoEventWireup="true"
    CodeFile="Regressions.aspx.cs"
    Inherits="Regressions"
    Title="Regressions Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:UpdatePanel ID="UpdatePanel" runat="server">
    <ContentTemplate>

        <asp:TextBox ID="TextBox" runat="server" />
        <aspext:TextBoxWatermarkExtender ID="TextBoxWatermarkExtender" runat="server" TargetControlID="TextBox" WatermarkText="WatermarkText" />

        <asp:Button ID="Submit" runat="server" Text="Submit" />

        <!-- Verify that Visible=false controls with extenders don't cause errors -->
        <asp:Button ID="Hidden" runat="server" Text="Hidden" Visible="false" />
        <aspext:ConfirmButtonExtender ID="ConfirmButtonExtender1" runat="server" TargetControlID="Hidden" ConfirmText="ConfirmText" />

        <hr />

    </ContentTemplate>
    </asp:UpdatePanel>

    <script type="text/javascript">
    // Script objects that should be loaded before we run
    var typeDependencies = ['Sys.Extended.UI.TextBoxWatermarkBehavior'];

     // Test Harness
    var testHarness = null;

    // Functions

    function CheckExtenderHookup() {
        return ("WatermarkText" == testHarness.getElement("ctl00_ContentPlaceHolder1_TextBox").value);
    }

    function VerifyExtenderHookup() {
        testHarness.assertTrue(CheckExtenderHookup(), "Extender not hooked up properly");
    }

    // Register the tests
    function registerTests(harness) {
        testHarness = harness;
        var test;

        test = testHarness.addTest("Extender hookup after UpdatePanel submit");
        // Check the initial state
        test.addStep(VerifyExtenderHookup);
        // Simulate an UpdatePanel submit
        test.addStep(function() { testHarness.fireEvent($get('ctl00_ContentPlaceHolder1_Submit'), 'onclick'); });
        test.addStep(function() { testHarness.fireEvent($get('aspnetForm'), 'onsubmit'); });
        // Check the resulting state
        test.addStep(function() {}, CheckExtenderHookup, 100);
    }

    </script>

</asp:Content>
