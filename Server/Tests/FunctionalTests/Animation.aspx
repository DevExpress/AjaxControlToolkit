<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    Title="Animation Tests" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    Warning: do not mouse over this button while the test is running (or it will fail)!<br />
    <asp:Button ID="target" runat="server" Text="Animate Me" OnClientClick="return false;"></asp:Button>
    <aspext:AnimationExtender ID="extender" runat="server" TargetControlID="target">
            <Animations>
                <OnLoad><StyleAction Attribute="backgroundColor" Value="red" /></OnLoad>
                <OnClick><StyleAction Attribute="backgroundColor" Value="blue" /></OnClick>
                <OnMouseOver><StyleAction Attribute="backgroundColor" Value="blue" /></OnMouseOver>
                <OnMouseOut><StyleAction Attribute="backgroundColor" Value="green" /></OnMouseOut>
                <OnHoverOver><StyleAction Attribute="color" Value="blue" /></OnHoverOver>
                <OnHoverOut><StyleAction Attribute="color" Value="yellow" /></OnHoverOut>
            </Animations>
    </aspext:AnimationExtender>
    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.Animation.Animation', 'Sys.Extended.UI.Animation.AnimationBehavior'];
    
        // Test Harness
        var testHarness = null;

        // Controls in the test page
        var panel = null;
        var behavior = null;
        
        function waitChanged(attribute, value) {
            return function() {
                panel = testHarness.getElement('ctl00_ContentPlaceHolder1_target');
                var expected = panel.style[attribute];
                return (expected == value);
            };
        }
        
        function checkFired(attribute, value) {
            return function() {
                panel = testHarness.getElement('ctl00_ContentPlaceHolder1_target');
                var expected = panel.style[attribute];
                testHarness.assertEqual(expected, value, 'Event failed to fire');
            };
        }

        // Fire an onmouseover event at point (x,y)
        function mouseOver(element, x, y) {
            return function() {
                if (!testHarness.getDocument().createEvent) {
                    testHarness.cancel('This test can only be run on a browser that supports document.createEvent (such as Firefox)');
                    return;
                }
                var e = testHarness.getDocument().createEvent('MouseEvents');
                e.initMouseEvent('mouseover', true, false, window, 0, x, y, x, y, false, false, false, false, 0, null);
                element.dispatchEvent(e);
            };
        }
        
        // Fire an onmouseout event at point (x,y)
        function mouseOut(element, x, y) {
            return function() {
                if (!testHarness.getDocument().createEvent) {
                    testHarness.cancel('This test can only be run on a browser that supports document.createEvent (such as Firefox)');
                    return;
                }
                var e = testHarness.getDocument().createEvent('MouseEvents');
                e.initMouseEvent('mouseout', true, false, window, 0, x, y, x, y, false, false, false, false, 0, null);
                element.dispatchEvent(e);
            };
        }

        // Register the tests
        function registerTests(harness) {
            testHarness = harness;

            // Get the controls on the page
            panel = testHarness.getElement('ctl00_ContentPlaceHolder1_target');
            behavior = testHarness.getObject('ctl00_ContentPlaceHolder1_extender');
            
            var id = function() {};
            
            var test = testHarness.addTest('OnLoad');
            test.addStep(id, waitChanged('backgroundColor', 'red'), checkFired('backgroundColor', 'red'));
            
            test = testHarness.addTest('OnClick');
            test.addStep(id, waitChanged('backgroundColor', 'red'), checkFired('backgroundColor', 'red'));
            test.addStep(function() { panel.click(); }, waitChanged('backgroundColor', 'blue'), checkFired('backgroundColor', 'blue'));
            
            test = testHarness.addTest('Mouse Events');
            test.addStep(id, waitChanged('backgroundColor', 'red'), checkFired('backgroundColor', 'red'));
            test.addStep(mouseOver(panel, panel.offsetWidth + 20, panel.offsetHeight + 20), waitChanged('backgroundColor', 'blue'), checkFired('backgroundColor', 'blue'));
            test.addStep(mouseOut(panel, 0, 0), waitChanged('backgroundColor', 'green'), checkFired('backgroundColor', 'green'));
            test.addStep(mouseOver(panel, panel.offsetWidth + 20, panel.offsetHeight + 20), waitChanged('color', 'blue'), checkFired('color', 'blue'));
            test.addStep(mouseOut(panel, 0, 0), waitChanged('color', 'yellow'), checkFired('color', 'yellow'));
        }
    </script>
</asp:Content>