<%@ Page
    Language="C#"
    CodeFile="RoundedCorners.aspx.cs"
    Inherits="Automated_RoundedCorners"
    MasterPageFile="~/Default.master"
    Title="RoundedCorners Tests" %>

<asp:Content ID="Content" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:Panel ID="Panel1" runat="server" BackColor="Gold">
        This is just a plain old panel.
        <br />
        <br />
        <asp:Panel ID="Panel2" runat="server" BackColor="Purple">
        </asp:Panel>
        It's got a bunch of text in it.<br />
        <br />
        And it's gold.
    </asp:Panel>

   <aspext:RoundedCornersExtender ID="RoundedCornersExtender1" runat="server" TargetControlID="Panel1" Color="Lime" Radius="10" />

   <script type="text/javascript">
    // Script objects that should be loaded before we run
    var typeDependencies = ['Sys.Extended.UI.RoundedCornersBehavior'];
   
    // Reference to the Test Harness
    var testHarness = null;
        
        // Controls in the test page
    var panel = null;
    var panel2 = null;
    var behavior = null;

    
    
    function verifyRoundedDivs(expectedCount) {
        
        var count = 0;
        for (var i = 0; i < panel.childNodes.length; i++) {
            var child = panel.childNodes[i];
            if (child && child.__roundedDiv) {
                count++;
            }
        }

        if (expectedCount) {
            testHarness.assertEqual(count / 2, expectedCount, "Checking expected div number (Expected " + expectedCount + ", found " + (count /2) + ")");
        }
        else {
            testHarness.assertEqual(count / 2, behavior.get_Radius(), "Checking div number");
        }
    }
    
    function verifyBorderDivs() {
        for (var i = 0; i < panel.childNodes.length; i++) {
            var child = panel.childNodes[i];
            if (child && child.__roundedDiv) {
                testHarness.assertTrue(child.style.borderLeftStyle == "solid" || child.__roundedDivNoBorder);
            }
        }
    }
    
    function modifyColorAndRadius(count) {
        behavior.set_Color("Red");
        
        modifyRadius(count);        
    }
    
    function modifyRadius(count) {
        if (!count) return;
        // bump up the radius                
        behavior.set_Radius(behavior.get_Radius() + 5);        
        if (--count) {
            window.setTimeout(function(){modifyRadius(count);}, 50);
        }
    }
    
    function modifyText() {
        var height = panel.offsetHeight;
        panel2.innerHTML = panel.innerHTML;
        testHarness.assertNotEqual(height, panel.offsetHeight, "Checking rounded panel expansion.");
    }
    
    
        function registerTests(harness) {
            testHarness = harness;

             // Get the controls on the page
            panel = testHarness.getElement("ctl00_ContentPlaceHolder1_Panel1");
            panel2 = testHarness.getElement("ctl00_ContentPlaceHolder1_Panel2");
            behavior = testHarness.getObject("ctl00_ContentPlaceHolder1_RoundedCornersExtender1");
         
            var test = testHarness.addTest('Initial State');
            test.addStep(verifyRoundedDivs);
            
            test = testHarness.addTest("Changing color and radius");
            test.addStep(function(){ modifyColorAndRadius(4) },
                function(){ try { verifyRoundedDivs(30); return true; } catch (ex) { return false; } },
                250, 5000);
            
            test = testHarness.addTest("Changing text");
            test.addStep(modifyText);
            
            test = testHarness.addTest("Border Color");
            test.addStep(function() { behavior.set_BorderColor("#000000");});
            test.addStep(verifyBorderDivs);
        }

    </script>
</asp:Content>
