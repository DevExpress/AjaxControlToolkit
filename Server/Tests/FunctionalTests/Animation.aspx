<%@ Page Language="C#" MasterPageFile="~/Default.master" Title="Animation Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    Warning: do not mouse over this button while the test is running (or it will fail)!<br />
    <asp:Button ID="target" runat="server" Text="Animate Me" OnClientClick="return false;">
    </asp:Button>
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
    Issue 8884 ->
    <asp:Panel ID="Panel2" runat="server" Width="300px" BackColor="Gold">
        <div id="parentDiv">
            Parent element layout
            <div id="childDiv">
                Child element layout</div>
        </div>
    </asp:Panel>
    <aspext:AnimationExtender ID="Extender2" runat="server" TargetControlID="Panel2">
        <Animations>
                <OnHoverOver>
                    <Condition ConditionScript="onDivHoverOver()"></Condition>
                </OnHoverOver>
                <OnHoverOut >
                    <Condition ConditionScript="onDivHoverOut()"></Condition>
                </OnHoverOut>
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
        var parentdiv = null;
        var extender2 = null;

        //local variables
        var count = 0;

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
        function onDivHoverOver() {
            count = 0;
        }
        function onDivHoverOut() {
            count++;
        }

        // Register the tests
        function registerTests(harness) {
            testHarness = harness;

            // Get the controls on the page
            panel = testHarness.getElement('ctl00_ContentPlaceHolder1_target');
            behavior = testHarness.getObject('ctl00_ContentPlaceHolder1_extender');

            panel2 = testHarness.getElement('ctl00_ContentPlaceHolder1_Panel2');
            extender2 = testHarness.getObject('ctl00_ContentPlaceHolder1_Extender2');
            var childDiv = testHarness.getElement('childDiv');

            var id = function() { };

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