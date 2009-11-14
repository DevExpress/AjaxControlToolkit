<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    CodeFile="ToggleButton.aspx.cs"
    Inherits="Automated_ToggleButton"
    Title="ToggleButton Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:CheckBox ID="CheckBox1" runat="server" Checked="true" Text="CheckBox" />
    <aspext:ToggleButtonExtender ID="ToggleButtonExtender1" runat="server" TargetControlID="CheckBox1" ImageWidth="19" ImageHeight="19" UncheckedImageUrl="~/Images/ToggleButton_Unchecked.gif" CheckedImageUrl="~/Images/ToggleButton_Checked.gif" />
    <br />
    <asp:CheckBox ID="CheckBox2" runat="server" Text="CheckBox (AutoPostBack)" AutoPostBack="true" />
    <aspext:ToggleButtonExtender ID="ToggleButtonExtender2" runat="server" TargetControlID="CheckBox2" ImageWidth="19" ImageHeight="19" UncheckedImageUrl="~/Images/ToggleButton_Unchecked.gif" CheckedImageUrl="~/Images/ToggleButton_Checked.gif" />
    <br />
    <asp:Button ID="Button1" runat="server" Text="Button" OnClick="Button1_Click" />
    <br />
    <asp:Label ID="Label1" runat="server" />


    <script type="text/javascript">
    // Script objects that should be loaded before we run
    var typeDependencies = ['Sys.Extended.UI.ToggleButtonBehavior'];

     // Test Harness
    var testHarness = null;

    // Controls on the page
    var cb1 = null;
    var a1 = null;
    var a2 = null;
    var btn1 = null;

    // Check for an unchecked checkbox (cb1)
    function checkUncheckedState() {
        testHarness.assertFalse(cb1.checked, "CheckBox1 should be unchecked.");
    }

    // Check for a checked checkbox (cb1)
    function checkCheckedState() {
        testHarness.assertTrue(cb1.checked, "CheckBox1 should be checked.");
    }

    // Toggle the checked state (cb1)
    function toggleCheck() {
        testHarness.fireEvent(a1, 'onclick')
    }

    // Verify that a postback happened
    function verifyPostback() {
        testHarness.assertEqual("postback", testHarness.getElement("ctl00_ContentPlaceHolder1_Label1").innerHTML);
    }

    // Register the tests
    function registerTests(harness) {
        testHarness = harness;
        var test;

        cb1 = testHarness.getElement("ctl00_ContentPlaceHolder1_CheckBox1");
        a1 = testHarness.getElement("ctl00_ContentPlaceHolder1_CheckBox1_ToggleButton");
        a2 = testHarness.getElement("ctl00_ContentPlaceHolder1_CheckBox2_ToggleButton");
        btn1 = testHarness.getElement("ctl00_ContentPlaceHolder1_Button1");

        test = testHarness.addTest("Initial State");
        test.addStep(checkCheckedState);

        test = testHarness.addTest("Uncheck/Check");
        test.addStep(toggleCheck);
        test.addStep(checkUncheckedState);
        test.addStep(toggleCheck);
        test.addStep(checkCheckedState);

        test = testHarness.addTest("Unchecked Submit");
        test.addStep(toggleCheck);
        test.addStep(checkUncheckedState);
        test.addPostBack(btn1);
        test.addStep(checkUncheckedState);

        test = testHarness.addTest("AutoPostBack");
        test.addStep(function() { a2.click = function() { testHarness.fireEvent(a2, 'onclick') } });
        test.addPostBack(a2);
        test.addStep(verifyPostback);
    }

    </script>
</asp:Content>
