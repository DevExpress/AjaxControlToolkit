<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    CodeFile="ModalPopup.aspx.cs"
    Inherits="Automated_ModalPopup"
    Title="ModalPopup Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <asp:Button ID="Button1" runat="server" Text="Popup" />
    <asp:Panel ID="Panel1" runat="server" BorderStyle="Solid" BorderColor="Lime" BorderWidth="2">
        <asp:Button ID="Button2" runat="server" Text="OK" />
        <asp:Button ID="Button3" runat="server" Text="Cancel" />
        <asp:Button ID="Button4" runat="server" Text="OK Via Server" OnClick="Button4_Click" />
        <asp:Button ID="HideViaServer" runat="server" Text="Hide Via Server" OnClick="HideViaServer_Click" />
        <asp:Label ID="Label2" runat="server" Text="Label2" />
    </asp:Panel>
    <asp:Label ID="Label1" runat="server" Text="Label1"></asp:Label>
    
    <asp:Button ID="ShowViaServer" runat="server" Text="Show Via Server" OnClick="ShowViaServer_Click" />
    <asp:Button ID="MultipleShowsViaServer" runat="server" Text="Multiple Show()s Via Server" OnClick="MultipleShowsViaServer_Click" />

    <aspext:ModalPopupExtender ID="ModalPopupExtender1" runat="server" TargetControlID="Button1" PopupControlID="Panel1" BackgroundCssClass="watermarked" OkControlID="Button2" CancelControlID="Button3" OnOkScript="okScript()" OnCancelScript="cancelScript()"
            DynamicControlID="Label2" DynamicContextKey="DynamicContextKey" DynamicServicePath="~/ToolkitTestService.asmx" DynamicServiceMethod="GetContextKey" />

    <script type="text/javascript">
    // Script objects that should be loaded before we run
    var typeDependencies = ['Sys.Extended.UI.ModalPopupBehavior'];

     // Test Harness
    var testHarness = null;

    // Controls on the page
    var show;
    var popup;
    var ok;
    var cancel;
    var postback;
    var populated;
    var behavior;

    // Variables
    var msg;

    function okScript() {
        msg = 'ok';
    }

    function cancelScript() {
        msg = 'cancel';
    }

    function checkPopupNotVisible() {
        testHarness.assertEqual(popup.style.display, 'none', 'Popup should not be visible');
    }

    function checkPopupVisible() {
        testHarness.assertEqual(popup.style.display, '', 'Popup should be visible');
    }

    function pollPopulated() {
        return (populated.innerHTML == 'DynamicContextKey');
    }

    function checkMessage(m) {
        testHarness.assertEqual(msg, m, 'Message \"'+msg+'\" should be \"'+m+'\"');
    }

    function checkLabel(m) {
        var label = testHarness.getElement("ctl00_ContentPlaceHolder1_Label1").innerHTML;
        testHarness.assertEqual(label, m, 'Label \"'+label+'\" should be \"'+m+'\"');
    }

    function showPopup() {
        show.click();
    }

    function clickMultipleShowsViaServer() {
        multipleShowsViaServer.click();
    }
    
    function clickOK() {
        ok.click();
    }

    function clickCancel() {
        cancel.click();
    }

    // Register the tests
    function registerTests(harness) {
        testHarness = harness;
        var test;

        show = testHarness.getElement("ctl00_ContentPlaceHolder1_Button1");
        popup = testHarness.getElement("ctl00_ContentPlaceHolder1_Panel1");
        ok = testHarness.getElement("ctl00_ContentPlaceHolder1_Button2");
        cancel = testHarness.getElement("ctl00_ContentPlaceHolder1_Button3");
        postback = testHarness.getElement("ctl00_ContentPlaceHolder1_Button4");
        populated = testHarness.getElement("ctl00_ContentPlaceHolder1_Label2");
        behavior = testHarness.getObject("ctl00_ContentPlaceHolder1_ModalPopupExtender1");

        showViaServer = testHarness.getElement("ctl00_ContentPlaceHolder1_ShowViaServer");
        hideViaServer = testHarness.getElement("ctl00_ContentPlaceHolder1_HideViaServer");
        multipleShowsViaServer = testHarness.getElement("ctl00_ContentPlaceHolder1_MultipleShowsViaServer");
        
        msg = '';
        behavior.set_DropShadow(!behavior.get_DropShadow());

        test = testHarness.addTest("Initial State");
        test.addStep(function() { checkLabel('Label1'); });
        test.addStep(checkPopupNotVisible);
        test.addStep(function() { checkMessage(''); });

        test = testHarness.addTest("Show Event/State");
        test.addStep(showPopup);
        test.addStep(checkPopupVisible, pollPopulated);
        test.addStep(function() { checkMessage(''); });

        test = testHarness.addTest("Cancel Event/State");
        test.addStep(showPopup);
        test.addStep(checkPopupVisible);
        test.addStep(clickCancel);
        test.addStep(checkPopupNotVisible, function() { try { checkMessage('cancel'); return true; } catch (ex) { return false; } }, 100, 5000);

        test = testHarness.addTest("OK Event/State");
        test.addStep(showPopup);
        test.addStep(checkPopupVisible);
        test.addStep(clickOK);
        test.addStep(checkPopupNotVisible, function() { try { checkMessage('ok'); return true; } catch (ex) { return false; } }, 100, 5000);

        test = testHarness.addTest("Script Show/Hide");
        test.addStep(function() { behavior.show(); });
        test.addStep(checkPopupVisible);
        test.addStep(function() { behavior.hide(); });
        test.addStep(checkPopupNotVisible);

        test = testHarness.addTest("Postback");
        test.addStep(function() { behavior.show(); });
        test.addPostBack(postback);
        test.addStep(function() { checkLabel('Button4'); });

        test = testHarness.addTest("Ignore when disabled");
        test.addStep(function() { show.disabled = true;});
        test.addStep(showPopup);
        test.addStep(checkPopupNotVisible);

        test = testHarness.addTest("Server Show/Hide");
        test.addStep(checkPopupNotVisible);
        test.addPostBack(showViaServer);
        test.addStep(checkPopupVisible);
        test.addPostBack(hideViaServer);
        test.addStep(checkPopupNotVisible);
        test.addPostBack(multipleShowsViaServer);
        test.addStep(clickMultipleShowsViaServer);
        test.addStep(checkPopupVisible);
    }

    </script>

</asp:Content>
