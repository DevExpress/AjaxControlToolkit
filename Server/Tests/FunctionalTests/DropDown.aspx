<%@ Page Language="C#" MasterPageFile="~/Default.master" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:Label runat="server" ID="L0" Text="L0" />
    <asp:HyperLink runat="server" ID="L1" Text="L1" NavigateUrl="javascript:void(L1WasClicked=true)" />
    
    <aspext:DropDownExtender runat="server" ID="D0" TargetControlID="L0" DropDownControlID="P0" />
    <aspext:DropDownExtender runat="server" ID="D1" TargetControlID="L1" DropDownControlID="P1" />
    
    <asp:Panel runat="Server" ID="P0" style="display:none;visibility:hidden;"></asp:Panel>
    <asp:Panel runat="Server" ID="P1" style="display:none;visibility:hidden;"></asp:Panel>
    
    <asp:UpdatePanel runat="server" ID="UP1">
        <ContentTemplate>
            <asp:Label runat="server" ID="L2" Text="L2" />
            <asp:Panel runat="Server" ID="P2" style="display:none;visibility:hidden;"></asp:Panel>
            <aspext:DropDownExtender runat="server" ID="D2" TargetControlID="L2" DropDownControlID="P2" />
            <asp:Button runat="server" ID="B0" OnClick="OnClick" />
        </ContentTemplate>
    </asp:UpdatePanel>
    
    <script type="text/javascript">
    // Script objects that should be loaded before we run
    var typeDependencies = ['Sys.Extended.UI.DropDownBehavior'];
    
    // Test Harness
    var testHarness = null;
    
    var L0;
    var L1;
    var D0;
    var D1;
    var P0;
    var P1;
    var L1WasClicked = false;       
    var dropWrapper;
    
    
    function hover(e) { return function() { testHarness.fireEvent(e, "onmouseover"); } }
    function unhover(e) { return function() { testHarness.fireEvent(e, "onmouseout"); } }
    function click(e) { return function() { testHarness.fireEvent(e, "onclick"); } }
    function context(e) { return function() {
            if (Sys.Browser.agent != Sys.Browser.InternetExplorer) {
                testHarness.cancel('This test can only be run on a browser that can raise oncontextmenu (such as Internet Explorer)');
            } else {
                testHarness.fireEvent(e, "oncontextmenu");
            }
        }
    }
    function checkOver(e, name) { return function() { testHarness.assertTrue(e.get_isOver(), name + " is not over but should be"); } }
    function checkOut(e, name) { return function() { testHarness.assertTrue(!e.get_isOver(), name + " is over but should not be"); } }
    function checkOpen(e, name) { return function() { testHarness.assertTrue(e.get_isOpen(), name + " is  not open but should be"); } }
    function checkClosed(e, name) { return function() { testHarness.assertTrue(!e.get_isOpen(), name + " is open but should not be"); } }
    
    function getB0() { return testHarness.getElement("<%=B0.ClientID%>"); }
    
    // Register the tests
    function registerTests(harness) {
        testHarness = harness;
        var test;
        
        L0 = testHarness.getElement("<%=L0.ClientID%>");
        L1 = testHarness.getElement("<%=L1.ClientID%>");
        P0 = testHarness.getElement("<%=P0.ClientID%>");
        P1 = testHarness.getElement("<%=P1.ClientID%>");
        D0 = testHarness.getObject("<%=D0.ClientID%>");
        D1 = testHarness.getObject("<%=D1.ClientID%>");
                
        test = testHarness.addTest("Hover/Unhover L0");
        test.addStep(hover(D0._dropWrapper));
        test.addStep(checkOver(D0, 'D0'));
        test.addStep(unhover(D0._dropWrapper));
        test.addStep(checkOut(D0, 'D0'));
        
        test = testHarness.addTest("Click L0, Click Body");
        test.addStep(hover(D0._dropWrapper));
        test.addStep(click(D0._dropWrapper));
        test.addStep(unhover(D0._dropWrapper));
        test.addStep(checkOut(D0, 'D0'));
        test.addStep(click(document));
        test.addStep(checkClosed(D0, 'D0'));
        
        test = testHarness.addTest("Click L0, Click L0");
        test.addStep(hover(D0._dropWrapper));
        test.addStep(click(D0._dropWrapper));
        test.addStep(click(D0._dropWrapper));
        test.addStep(checkClosed(D0, 'D0'));
        
//        test = testHarness.addTest("Click L0, Click P0");
//        test.addStep(hover(D0._dropWrapper));
//        test.addStep(click(D0._dropWrapper));
//        test.addStep(unhover(D0._dropWrapper));
//        test.addStep(click(P0));
//        test.addStep(checkOpen(D0, 'D0'));
        
        test = testHarness.addTest("Context L0, Context Body");
        test.addStep(hover(D0._dropWrapper));
        test.addStep(context(D0._dropWrapper));
        test.addStep(unhover(D0._dropWrapper));
        test.addStep(context(document));
        test.addStep(checkClosed(D0, 'D0'));
        
        test = testHarness.addTest("Context L0, Context P0");
        test.addStep(hover(D0._dropWrapper));
        test.addStep(context(D0._dropWrapper));
        test.addStep(unhover(D0._dropWrapper));
        test.addStep(context(P0));
        test.addStep(checkOpen(D0, 'D0'));

        test = testHarness.addTest("Click L1 (wrapper/frame area)");
        test.addStep(hover(D1._dropWrapper));
        test.addStep(click(D1._dropWrapper));
        test.addStep(checkOpen(D1, 'D1'));
        
        test = testHarness.addTest("Click L1 (link)");
        test.addStep(hover(D1._dropWrapper));
        test.addStep(click(L1));
        test.addStep(checkClosed(D1, 'D1'));
        
        test = testHarness.addTest("Context L1 (wrapper/frame area)");
        test.addStep(hover(D1._dropWrapper));
        test.addStep(context(D1._dropWrapper));
        test.addStep(checkOpen(D1, 'D1'));
        
        test = testHarness.addTest("Context L1 (link)");
        test.addStep(hover(D1._dropWrapper));
        test.addStep(context(L1));
        test.addStep(checkClosed(D1, 'D1'));
        
        test = testHarness.addTest("Cleanup after UpdatePanel submit");
        test.addStep(function() {
            if (Sys.Browser.agent == Sys.Browser.Firefox) {
                testHarness.cancel('This test cannot be run on Firefox because it does not allow causing an update by calling .click() on a control inside an UpdatePanel');
            } else {
                testHarness.fireEvent(testHarness.getElement("<%=L2.ClientID%>"), "onmouseover"); }
            }
        );
        test.addStep(function() { dropWrapper = testHarness.getObject("<%=D2.ClientID%>")._dropWrapper; });
        test.addStep(function() { testHarness.getElement("<%=B0.ClientID%>").click(); },
            function() { return testHarness.getElement("<%=B0.ClientID%>").value == "!"; }, 200, 5000);
        test.addStep(function() {
            testHarness.assertTrue(dropWrapper.parentNode == null || dropWrapper.parentNode.nodeName == "#document-fragment", "dropWrapper was not detached.");
        });

    }

    </script>

    <script runat="server" type="text/C#">
        
        protected void OnClick(object sender, EventArgs e)
        {
            B0.Text = "!";
        }
        
    </script>    


</asp:Content>

