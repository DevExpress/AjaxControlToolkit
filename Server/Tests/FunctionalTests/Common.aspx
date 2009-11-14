<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    Title="Common Tests" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <!--
        .commonCurrent1
        {
            background-color: red;
            padding: 10px;
            padding-top: 5px;
            border: solid 1px #000000;
        }
        .commonCurrent2
        {
            background-color: blue;
            padding: 1px;
        }
    -->
    <div id="div0" class="commonCurrent1">div0</div>
    <div id="div1" class="commonCurrent2">div1</div>
    <div id="div2" class="commonCurrent1" style="text-decoration: underline; padding-top: 8px;">div2</div>
    <div id="div3" class="commonCurrent1 commonCurrent2" style="text-decoration: underline; padding-top: 8px;">div3<div id="div4">div4</div></div>
    <div id="div5">div5</div>
    
    <!-- Put an extender in that uses the Common Toolkit Script so it will be loaded -->
    <asp:Panel ID="Panel1" runat="server" Height="50px" Width="125px" BackColor="Lime">
    </asp:Panel>
    <aspext:RoundedCornersExtender ID="RoundedCornersExtender1" runat="server" TargetControlID="Panel1" />
    
    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['CommonToolkitScripts'];
        
        // Reference to the Test Harness
        var testHarness = null;
    
        // Controls in the test page
        var div0 = null;
        var div1 = null;
        var div2 = null;
        var div3 = null;
        var div4 = null;
        var div5 = null;
        
        // Ensure that a value falls within a range of acceptable values
        function checkContains(expectedValues, value, message) {
            for (var i = 0; i < expectedValues.length; i++) {
                if (expectedValues[i] === value) {
                    return;
                }
            }
            testHarness.fail(message);
        }

        // Ensure the current style value matches the expected value
        function checkExpectedStyle(element, attribute, expectedValues) {
            return function() {
                var value = CommonToolkitScripts.getCurrentStyle(element, attribute);
                checkContains(expectedValues, value, (element ? element.id : 'null') + '.' + attribute + ' should not be ' + value);
            }
        }
        
        // Ensure the inherited background color matches the expected color
        function checkExpectedBackgroundColor(element, expectedColors) {
            return function() {
                var color = CommonToolkitScripts.getInheritedBackgroundColor(element);
                checkContains(expectedColors, color, (element ? element.id : 'null') + ' should not have a background color of ' + color);
            }
        }
        
        // Register the AlwaysVisibleControl test cases
        function registerTests(harness) {
            testHarness = harness;

             // Get the controls on the page
            div0 = testHarness.getElement("div0");
            div1 = testHarness.getElement("div1");
            div2 = testHarness.getElement("div2");
            div3 = testHarness.getElement("div3");
            div4 = testHarness.getElement("div4");
            div5 = testHarness.getElement("div5");
            
            // Test the getCurrentStyle function
            var test = testHarness.addTest('Get current style');
            // div0's properties (and a few general checks)
            test.addStep(checkExpectedStyle(div0, 'backgroundColor', ['red', 'rgb(255, 0, 0)']));
            test.addStep(checkExpectedStyle(div0, 'background-color', [null]));
            test.addStep(checkExpectedStyle(div0, 'paddingBottom', ['10px']));
            test.addStep(checkExpectedStyle(div0, 'paddingLeft', ['10px']));
            test.addStep(checkExpectedStyle(div0, 'paddingRight', ['10px']));
            test.addStep(checkExpectedStyle(div0, 'paddingTop', ['5px']));
            test.addStep(checkExpectedStyle(div0, 'padding-top', [null]));
            test.addStep(checkExpectedStyle(div0, 'borderWidth', ['1px', null]));
            test.addStep(checkExpectedStyle(div0, 'marginTop', ['auto', '0px']));
            // div1's properties
            test.addStep(checkExpectedStyle(div1, 'backgroundColor', ['blue', 'rgb(0, 0, 255)']));
            test.addStep(checkExpectedStyle(div1, 'padding', ['1px', null]));
            test.addStep(checkExpectedStyle(div1, 'paddingTop', ['1px']));
            test.addStep(checkExpectedStyle(div1, 'marginTop', ['auto', '0px']));
            // div2's properties
            test.addStep(checkExpectedStyle(div2, 'backgroundColor', ['red', 'rgb(255, 0, 0)']));
            test.addStep(checkExpectedStyle(div2, 'paddingBottom', ['10px']));
            test.addStep(checkExpectedStyle(div2, 'paddingLeft', ['10px']));
            test.addStep(checkExpectedStyle(div2, 'paddingRight', ['10px']));
            test.addStep(checkExpectedStyle(div2, 'paddingTop', ['8px']));
            test.addStep(checkExpectedStyle(div2, 'textDecoration', ['underline']));
            // div3's properties
            test.addStep(checkExpectedStyle(div3, 'borderWidth', ['1px', null]));
            test.addStep(checkExpectedStyle(div3, 'marginTop', ['auto', '0px']));
            test.addStep(checkExpectedStyle(div3, 'backgroundColor', ['blue', 'rgb(0, 0, 255)']));
            test.addStep(checkExpectedStyle(div3, 'paddingBottom', ['1px']));
            test.addStep(checkExpectedStyle(div3, 'paddingLeft', ['1px']));
            test.addStep(checkExpectedStyle(div3, 'paddingRight', ['1px']));
            test.addStep(checkExpectedStyle(div3, 'paddingTop', ['8px']));
            test.addStep(checkExpectedStyle(div3, 'textDecoration', ['underline']));
            // div4 and div5's properties
            test.addStep(checkExpectedStyle(div4, 'backgroundColor', ['transparent', 'rgba(0, 0, 0, 0)']));
            test.addStep(checkExpectedStyle(div5, 'backgroundColor', ['transparent', 'rgba(0, 0, 0, 0)']));
            // General tests
            test.addStep(checkExpectedStyle(document.body, 'backgroundColor', ['transparent', 'rgba(0, 0, 0, 0)']));
            test.addStep(checkExpectedStyle(null, null, [null]));
            
            // Test the getInheritedBackgroundColor function
            test = testHarness.addTest('Get inherited background color');
            test.addStep(checkExpectedBackgroundColor(div0, ['red', 'rgb(255, 0, 0)']));
            test.addStep(checkExpectedBackgroundColor(div1, ['blue', 'rgb(0, 0, 255)']));
            test.addStep(checkExpectedBackgroundColor(div2, ['red', 'rgb(255, 0, 0)']));
            test.addStep(checkExpectedBackgroundColor(div3, ['blue', 'rgb(0, 0, 255)']));
            test.addStep(checkExpectedBackgroundColor(div4, ['blue', 'rgb(0, 0, 255)']));
            test.addStep(checkExpectedBackgroundColor(div5, ['#FFFFFF']));
            test.addStep(checkExpectedBackgroundColor(null, ['#FFFFFF']));
            
            // Test setElementOpacity / getElementOpacity
            test = testHarness.addTest('Test setElementOpacity / getElementOpacity');
            test.addStep(function() {
                CommonToolkitScripts.setElementOpacity(div0, 0.5);
            });
            test.addStep(function() {
                testHarness.assertEqual(CommonToolkitScripts.getElementOpacity(div0), 0.5, 'The element opacity is not correct.');
            });

            // Test setVisible / getVisible
            test = testHarness.addTest('Test setVisible / getVisible');
            test.addStep(function() {
                CommonToolkitScripts.setVisible(div0, false);
            });
            test.addStep(function() {
                testHarness.assertEqual(CommonToolkitScripts.getVisible(div0), false, 'The element should be hidden.');
            });
            test.addStep(function() {
                CommonToolkitScripts.setVisible(div0, true);
            });
            test.addStep(function() {
                testHarness.assertEqual(CommonToolkitScripts.getVisible(div0), true, 'The element should be visible.');
            });
        }
    </script>
</asp:Content>
