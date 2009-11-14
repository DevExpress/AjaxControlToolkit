<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    AutoEventWireup="true"
    CodeFile="NoBot.aspx.cs"
    Inherits="NoBot"
    Title="NoBot Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <aspext:NoBot ID="NoBot1" runat="server" ResponseMinimumDelaySeconds="1" CutoffMaximumInstances="4" CutoffWindowSeconds="20" />
    <aspext:NoBot ID="NoBot2" runat="server" ResponseMinimumDelaySeconds="1" CutoffMaximumInstances="4" CutoffWindowSeconds="20" OnGenerateChallengeAndResponse="NoBot2_GenerateChallengeAndResponse"/>

    <asp:Label ID="Label1" runat="server" Text="Label1" />
    <asp:Label ID="Label2" runat="server" Text="Label2" />
    <br />
    <asp:Button ID="Button1" runat="server" Text="Submit" />
    <br />
    <asp:Button ID="Button2" runat="server" Text="EmptyUserAddressCache" OnClick="Button2_Click" />

    <script type="text/javascript">

    // Script objects that should be loaded before we run
    var typeDependencies = ['Sys.Extended.UI.NoBotBehavior'];

     // Test Harness
    var testHarness = null;
    var label1 = null;
    var label2 = null;
    var submit = null;
    var empty = null;
    var response1 = null;
    var response2 = null;

    // Functions
    function AssertNoBotState(state) {
        return function() {
            testHarness.assertEqual(label1.innerHTML, state, "NoBot1: Actual state "+label1.innerHTML+" not equal to expected state "+state);
            testHarness.assertEqual(label2.innerHTML, state, "NoBot2: Actual state "+label2.innerHTML+" not equal to expected state "+state);
        }
    }

    function GarbleResponse() {
        response1.value = "garbled";
        response2.value = "garbled";
    }

    function returnTrue() {
        return true;
    }

    function addTestDelay(test, delay) {
        test.addStep(returnTrue, delay, returnTrue);
    }

    // Register the tests
    function registerTests(harness) {
        testHarness = harness;
        var test;

        label1 = testHarness.getElement("ctl00_ContentPlaceHolder1_Label1");
        label2 = testHarness.getElement("ctl00_ContentPlaceHolder1_Label2");
        submit = testHarness.getElement("ctl00_ContentPlaceHolder1_Button1");
        empty = testHarness.getElement("ctl00_ContentPlaceHolder1_Button2");
        response1 = testHarness.getElement("ctl00_ContentPlaceHolder1_NoBot1_NoBot1_NoBotExtender_ClientState");
        response2 = testHarness.getElement("ctl00_ContentPlaceHolder1_NoBot2_NoBot2_NoBotExtender_ClientState");

        test = testHarness.addTest("Valid on initial load");
        test.addStep(AssertNoBotState("Valid"));
        test.addPostBack(empty);  // Clear cache so we always start clean

        test = testHarness.addTest("Valid after delayed submit");
        addTestDelay(test, 1200);
        test.addPostBack(submit);
        test.addStep(AssertNoBotState("Valid"));

        test = testHarness.addTest("Invalid after non-delayed submit");
        addTestDelay(test, 100);
        test.addPostBack(submit);
        test.addStep(AssertNoBotState("InvalidResponseTooSoon"));

        test = testHarness.addTest("Invalid after garbled response");
        addTestDelay(test, 1200);
        test.addStep(GarbleResponse);
        test.addPostBack(submit);
        test.addStep(AssertNoBotState("InvalidBadResponse"));

        test = testHarness.addTest("Invalid after too much activity");
        addTestDelay(test, 1200);
        test.addPostBack(submit);
        test.addStep(AssertNoBotState("InvalidAddressTooActive"));

        test = testHarness.addTest("Valid after user address cache cleared");
        test.addPostBack(empty);
        addTestDelay(test, 1200);
        test.addPostBack(submit);
        test.addStep(AssertNoBotState("Valid"));
    }
    </script>
</asp:Content>