<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    AutoEventWireup="true"
    CodeFile="ResizableControl.aspx.cs"
    Inherits="ResizableControl"
    Title="ResizableControl Tests" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:Panel
        ID="Panel1"
        runat="server"
        Width="100"
        Height="100"
        BackColor="LightSteelBlue"
        style="overflow:hidden">
        <asp:Panel
            ID="Panel2"
            runat="server"
            style="width:100%; height:100%;
            overflow:hidden">
            Panel content...
        </asp:Panel>
    </asp:Panel>

    <aspext:ResizableControlExtender ID="ResizableControlExtender1" runat="server"
            TargetControlID="Panel1"
            HandleCssClass="resizeHandle"
            ResizableCssClass="resizeStyle"
            MinimumWidth="40"
            MinimumHeight="50"
            MaximumWidth="300"
            MaximumHeight="400"
            OnClientResize="OnClientResize"
            OnClientResizing="OnClientResizing"
            OnClientResizeBegin="OnClientResizeBegin"
            HandleOffsetX="10"
            HandleOffsetY="-5" />

    <asp:Button
        ID="Button1"
        runat="server"
        Text = "Submit"
        OnClick="Button1_Click" />

    <asp:Label
        ID="Label1"
        runat="server"
        Text="Label" />

    <script type="text/javascript">
    // Script objects that should be loaded before we run
    var typeDependencies = ['Sys.Extended.UI.ResizableControlBehavior'];

     // Test Harness
    var testHarness = null;

    // Controls on the page
    var pnl = null;
    var ins = null;
    var rce = null;
    var btn = null;
    var lbl = null;

    // Functions

    function VerifyWidthHeight(width, height, checkLabel) {
        testHarness.assertEqual(pnl.offsetWidth, width, "Panel width not expected value");
        testHarness.assertEqual(pnl.offsetHeight, height, "Panel weight not expected value");
        testHarness.assertEqual(ins.offsetWidth, width, "Insert width not expected value");
        testHarness.assertEqual(ins.offsetHeight, height, "Insert height not expected value");
    }

    function VerifyLabel(width, height) {
        testHarness.assertEqual(width+"x"+height, lbl.innerHTML, "Server width/height not expected value");
    }

    function SetWidthHeight(width, height) {
        rce._onmousedownImplementation(0, 0);
        rce.set_Size( { width: width, height:height } );
        rce._onmouseup();
    }

    var resizeFired = false;
    function OnClientResize() {
        resizeFired = true;
    }

    var resizingFired = false;
    function OnClientResizing() {
        resizingFired = true;
    }

    var resizeBeginFired = false;
    function OnClientResizeBegin() {
        resizeBeginFired = true;
    }

    function VerifyEventsFired(checkResizeBegin) {
        testHarness.assertTrue(resizeFired, "Resize event not fired");
        testHarness.assertTrue(resizingFired, "Resizing event not fired");
        testHarness.assertTrue(!checkResizeBegin || resizeBeginFired, "ResizeBegin event not fired");
    }

    function ResetEventsFired() {
        resizeFired = false;
        resizingFired = false;
        resizeBeginFired = false;
    }

    // Register the tests
    function registerTests(harness) {
        testHarness = harness;
        var test;

        pnl = testHarness.getElement("ctl00_ContentPlaceHolder1_Panel1");
        ins = testHarness.getElement("ctl00_ContentPlaceHolder1_Panel2");
        rce = testHarness.getObject("ctl00_ContentPlaceHolder1_ResizableControlExtender1");
        btn = testHarness.getElement("ctl00_ContentPlaceHolder1_Button1");
        lbl = testHarness.getElement("ctl00_ContentPlaceHolder1_Label1");

        test = testHarness.addTest("Initial State");
        test.addStep(function() { VerifyWidthHeight(100, 100) });

        test = testHarness.addTest("Client resize");
        test.addStep(function() { SetWidthHeight(90, 95) });
        test.addStep(function() { VerifyWidthHeight(90, 95) });

        test = testHarness.addTest("Client resize too small");
        test.addStep(function() { SetWidthHeight(10, 15) });
        test.addStep(function() { VerifyWidthHeight(40, 50) });

        test = testHarness.addTest("Client resize too big");
        test.addStep(function() { SetWidthHeight(400, 500) });
        test.addStep(function() { VerifyWidthHeight(300, 400) });

        test = testHarness.addTest("Postback preserves/modifies size");
        test.addStep(function() { SetWidthHeight(150, 155) });
        test.addPostBack(btn);
        test.addStep(function() { VerifyLabel(150, 155) });
        test.addStep(function() { VerifyWidthHeight(150+10, 155+15) });

        test = testHarness.addTest("Events fire");
        test.addStep(function() { VerifyEventsFired(false) });
        test.addStep(function() { ResetEventsFired() });
        test.addStep(function() { SetWidthHeight(90, 95) });
        test.addStep(function() { VerifyWidthHeight(90, 95) });
        test.addStep(function() { VerifyEventsFired(true) });
    }

    </script>

</asp:Content>
