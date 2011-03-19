<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="AlwaysVisibleControl.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.AlwaysVisibleControl.AlwaysVisibleControl" %>

<asp:Content ID="Content2" ContentPlaceHolderID="Script" runat="server">
    <script>
        // Declare variables to hold references of controls/elements
        var visiblePanel = null;
        var button1 = null;
        var beginDiv = null;
        var endDiv = null;
        var rightDiv = null;
        var behaviorControl = null;

        // Constants
        var initialTop = 15;
        var initialLeft = 40;

        // Start QUnit Tests
        module("Initial Position of Control");

        // test top and left position of asp.net panel
        // Control should be placed at initial position
        test("Initial Position", 2, function () {
            visiblePanel = $testFrame("#content");
            checkInitialPosition(visiblePanel);
        });

        module("Vertical Floating");

        // Move visible panel to end to change its vertical position
        asyncTest("Floating Vertically to down", 3, function () {

            // reset controls to its initial position
            resetTestFrame(function () {

                visiblePanel = $testFrame("#content");
                // Check initial position of control
                checkInitialPosition(visiblePanel);

                // Get the ASP.NET AJAX objects on the page
                behaviorControl = $find('avc1');
                endDiv = $testFrame("#end");

                //check if browser supports animation            
                if (behaviorControl._animate) {
                    // move visiblePanel vertically down                                
                    endDiv[0].scrollIntoView();

                    waitFor({
                        condition: function () {
                            return visiblePanel[0].offsetTop != initialTop;
                        },
                        success: function () {
                            notEqual(visiblePanel[0].offsetTop, initialTop);
                            start();
                        }
                    });
                }
                else {
                    ok(true, 'This test can only be run on a behavior that uses animation.');
                    start();
                }

            });
        });

        // Move visible panel to begin to change its vertical position
        asyncTest("Floating Vertically to up", 3, function () {
            // reset controls to its initial position
            resetTestFrame(function () {

                visiblePanel = $testFrame("#content");
                // Check initial position of control
                checkInitialPosition(visiblePanel);

                // Get the ASP.NET AJAX objects on the page
                behaviorControl = $find('avc1');
                beginDiv = $testFrame("#begin");

                //check if browser supports animation            
                if (behaviorControl._animate) {
                    // move vertically up
                    beginDiv[0].scrollIntoView();

                    waitFor({
                        condition: function () {
                            return visiblePanel[0].offsetTop != initialTop;
                        },
                        success: function () {
                            notEqual(visiblePanel[0].offsetTop, initialTop);
                            start();
                        }
                    });
                }
                else {
                    ok(true, 'This test can only be run on a behavior that uses animation.');
                    start();
                }
            });
        });

        module("Postback");

        // Test after postback visible panel reset to initial position
        asyncTest("At Postback reset the position to initial", 4, function () {

            // reset controls to its initial position
            resetTestFrame(function () {

                visiblePanel = $testFrame("#content");
                // Check initial position of control
                checkInitialPosition(visiblePanel);

                button1 = $testFrame("#Button1");
                // trigger click event of button to refresh the page            
                button1.click();

                waitFor({
                    condition: function () {
                        visiblePanel = $testFrame("#content");
                        return visiblePanel[0].offsetTop === initialTop;
                    },
                    success: function () {
                        visiblePanel = $testFrame("#content");
                        checkInitialPosition(visiblePanel);
                        start();
                    }
                });

            });

        });

        module("Horizontal floating");

        // Move visible panel to right to check 
        // panel's horizontal float behaviour
        asyncTest("Move to right", 3, function () {

            // reset controls to its initial position
            resetTestFrame(function () {

                visiblePanel = $testFrame("#content");
                // Check initial position of control
                checkInitialPosition(visiblePanel);

                // Get the ASP.NET AJAX objects on the page
                behaviorControl = $find('avc1');
                rightDiv = $testFrame("#right");

                //check if browser supports animation
                if (behaviorControl._animate) {
                    // move visiblePanel Horizontally
                    rightDiv[0].scrollIntoView();

                    waitFor({
                        condition: function () {
                            return visiblePanel[0].offsetLeft != initialLeft;
                        },
                        success: function () {
                            notEqual(visiblePanel[0].offsetLeft, initialLeft);
                            start();
                        }
                    });
                }
                else {
                    ok(true, 'This test can only be run on a behavior that uses animation.');
                    start();
                }

            });

        });

        module("Positioning Changes");

        //Change the top and left position of visible panel
        // by sliding horizontally and vertically
        asyncTest('Positioning changes', 4, function () {

            // reset controls to its initial position
            resetTestFrame(function () {

                visiblePanel = $testFrame("#content");

                waitFor({
                    condition: function () {
                        return visiblePanel[0].offsetTop == initialTop;
                    },
                    success: function () {
                        // Check initial position of control
                        checkInitialPosition(visiblePanel);

                        // Get the ASP.NET AJAX objects on the page
                        behaviorControl = $find('avc1');

                        // change the position of control
                        behaviorControl.set_HorizontalSide(testFrameWindow().Sys.Extended.UI.HorizontalSide.Right);
                        behaviorControl.set_HorizontalOffset(behaviorControl.get_HorizontalOffset() * 2);
                        behaviorControl.set_VerticalSide(testFrameWindow().Sys.Extended.UI.VerticalSide.Bottom);
                        behaviorControl.set_VerticalOffset(behaviorControl.get_VerticalOffset() * 2);
                        behaviorControl.set_ScrollEffectDuration(behaviorControl.get_ScrollEffectDuration() / 2);
                        behaviorControl._reposition();

                        //check panel's position should not be equal to initial position
                        notEqual(visiblePanel[0].offsetTop, initialTop);
                        notEqual(visiblePanel[0].offsetLeft, initialLeft);
                        start();
                    }
                });

            });

        });

        // Helper method
        function checkInitialPosition(element) {
            equal(element[0].offsetTop, initialTop);
            equal(element[0].offsetLeft, initialLeft);
        }
    </script>
</asp:Content>
