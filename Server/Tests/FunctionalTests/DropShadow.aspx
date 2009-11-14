<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    CodeFile="DropShadow.aspx.cs"
    Inherits="Automated_DropShadow"
    Title="DropShadow Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <asp:Panel ID="Panel1" runat="server" Style="width: 250px; background-color: Teal; color:White;">
        <asp:Panel ID="Panel2" runat="server" Style="padding:1px;">
            <p>Here is some text in a panel.</p>
            <p id="MoreText">And here is some more...</p>
        </asp:Panel>
    </asp:Panel>

    <aspext:DropShadowExtender ID="DropShadowEfxtender1" runat="server" TargetControlID="Panel1" BehaviorID="DropShadowProperties1">
        
    </aspext:DropShadowExtender>

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.DropShadowBehavior'];
    
        // Test Harness
        var testHarness;

        // Controls and behaviors
        var panel;
        var behavior;

        // Variables
        var panelBounds;

        // Helper functions

        function CheckShadowBounds(rounded) {
            return function() {
                var shadowWidth = behavior.get_Width();
                var shadowDiv = behavior._shadowDiv;
                if (0 < shadowWidth && shadowDiv) {
                    var shadowBounds = CommonToolkitScripts.getBounds(shadowDiv);
                    testHarness.assertEqual(shadowBounds.x, panelBounds.x + shadowWidth, 'Unexpected shadow x = ' + (panelBounds.x + shadowWidth) + ' (expected ' + shadowBounds.x + ')');
                    testHarness.assertEqual(shadowBounds.y, panelBounds.y + shadowWidth, 'Unexpected shadow y = ' + (panelBounds.y + shadowWidth) + ' (expected ' + shadowBounds.y + ')');
                    testHarness.assertEqual(shadowBounds.width, panelBounds.width, 'Unexpected shadow width = ' + panelBounds.width + ' (expected ' + shadowBounds.width + ')');
                    if (rounded) {
                        testHarness.assertTrue(panelBounds.height < shadowBounds.height, 'Unexpected shadow height (' + panelBounds.height + " > " + shadowBounds.height + ")" );
                    } else {
                        testHarness.assertEqual(shadowBounds.height, panelBounds.height, 'Unexpected shadow height (' + panelBounds.height + " != " + shadowBounds.height + ")");
                    }
                    testHarness.assertTrue(shadowDiv.style.zIndex < panel.style.zIndex, 'Unexpected zIndex');
                }
            };
        }

        function CheckOpacity(val) {
            return function() {
                testHarness.assertEqual(val, behavior.get_Opacity(), 'Unexpected opacity');
            }
        }
        
        function CheckInitialPosition() {
            panelBounds = CommonToolkitScripts.getBounds(panel);
            testHarness.assertTrue((0 < panelBounds.x) && (0 < panelBounds.y), 'Unexpected panel location = ' + panelBounds.x + ',' + panelBounds.y + ' (expected greater than 0,0)');
        }

        // Register the tests
        function registerTests(harness) {
            testHarness = harness;

            panel = testHarness.getElement('ctl00_ContentPlaceHolder1_Panel1');
            behavior = testHarness.getObject('DropShadowProperties1');

            var test = testHarness.addTest('Initial position');
            test.addStep(CheckInitialPosition);

            test = testHarness.addTest('Initial state');
            test.addStep(CheckInitialPosition);
            test.addStep(CheckShadowBounds(false));
            test.addStep(CheckOpacity(1.0));

            test = testHarness.addTest('Changing Width');
            test.addStep(CheckInitialPosition);
            test.addStep(function() { behavior.set_Width(behavior.get_Width() + 5); });
            test.addStep(CheckShadowBounds(false));
            test.addStep(function() { behavior.set_Width(0); });
            test.addStep(CheckShadowBounds(false));
            test.addStep(function() { behavior.set_Width(8); });
            test.addStep(CheckShadowBounds(false));

            test = testHarness.addTest('Changing Opacity');
            test.addStep(CheckInitialPosition);
            test.addStep(function() { behavior.set_Opacity(0.4); });
            test.addStep(CheckOpacity(0.4));
            test.addStep(CheckShadowBounds(false));

            test = testHarness.addTest('Rounded');
            test.addStep(CheckInitialPosition);
            test.addStep(function() { behavior.set_Rounded(true); });
            test.addStep(CheckShadowBounds(true));

            test = testHarness.addTest('Changing Rounded Width');
            test.addStep(CheckInitialPosition);
            test.addStep(function() { behavior.set_Rounded(true); });
            test.addStep(function() { behavior.set_Width(behavior.get_Width() + 5); });
            test.addStep(CheckShadowBounds(true));
            test.addStep(function() { behavior.set_Width(0); });
            test.addStep(CheckShadowBounds(true));
            test.addStep(function() { behavior.set_Width(8); });
            test.addStep(CheckShadowBounds(true));

            test = testHarness.addTest('Changing Rounded Radius');
            test.addStep(CheckInitialPosition);
            test.addStep(function() { behavior.set_Rounded(true); });
            test.addStep(function() { behavior.set_Radius(behavior.get_Radius() + 5); });
            test.addStep(CheckShadowBounds(true));
            test.addStep(function() { behavior.set_Radius(0); });
            test.addStep(CheckShadowBounds(false));  // false because radius of 0 is effectively unrounded
            test.addStep(function() { behavior.set_Radius(8); });
            test.addStep(CheckShadowBounds(true));

            test = testHarness.addTest('Unrounded');
            test.addStep(CheckInitialPosition);
            test.addStep(function() { behavior.set_Rounded(true); });
            test.addStep(function() { behavior.set_Rounded(false); });
            test.addStep(CheckShadowBounds(false));

            test = testHarness.addTest('Panel movement');
            test.addStep(CheckInitialPosition);
            test.addStep(function() {
                    panel.style.left = '150px';
                    panelBounds = CommonToolkitScripts.getBounds(panel);
                    behavior.set_TrackPosition(true);
                    behavior.set_TrackPositionDelay(25);
                },
                function() {  try { CheckShadowBounds(false); return true; } catch (ex) { return false; }  },
                200, 5000);
            
            test = testHarness.addTest('Panel shrink');
            test.addStep(CheckInitialPosition);
            test.addStep(function() {
                    panel.style.left = '150px';
                    panelBounds = CommonToolkitScripts.getBounds(panel);
                    behavior.set_TrackPosition(true);
                    behavior.set_TrackPositionDelay(25);
                },
                function() {  try { CheckShadowBounds(false); return true; } catch (ex) { return false; }  },
                200, 5000);
            test.addStep(function() {
                    testHarness.getElement('MoreText').style.display = 'none';
                    panelBounds = CommonToolkitScripts.getBounds(panel);
                },
                function() {  try { CheckShadowBounds(false); return true; } catch (ex) { return false; }  },
                200, 5000);
        }
    </script>
</asp:Content>
