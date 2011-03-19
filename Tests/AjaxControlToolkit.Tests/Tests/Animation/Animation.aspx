<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="Animation.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.Animation.Animation" %>

<asp:Content ID="Content2" ContentPlaceHolderID="Script" runat="server">
    <script>
        // Tests that the background color of a panel changes to
        // red when page loads.
        asyncTest("OnLoad", 1, function () {


            // Different browsers represent red differently
            // so we create a function:
            var isRed = function (r) {
                return (r === "red" || r === "rgb(255, 0, 0)");
            };

            resetTestFrame(function () {
                // Wait for the Panel background to change to red
                waitFor({
                    condition: function () {
                        var actual = $testFrame("#Panel1").css("background-color");
                        return isRed(actual);
                    },
                    success: function () {
                        var actual = $testFrame("#Panel1").css("background-color");
                        ok(isRed(actual), "Actual value is " + actual);
                        start();
                    }
                });
            });
        });

        // Tests that the background color of a panel changes to
        // blue when the button is clicked.
        asyncTest('OnClick', 1, function () {


            // Different browsers represent blue differently
            // so we create a function:
            var isBlue = function (b) {
                return (b === "blue" || b === "rgb(0, 0, 255)");
            };

            // Click the Panel using Simulate
            QUnit.triggerEvent($testFrame("#Panel1")[0], "click");

            // Wait for the Panel background to change to blue
            waitFor({
                condition: function () {
                    var actual = $testFrame("#Panel1").css("background-color");
                    return isBlue(actual);
                },
                success: function () {
                    var actual = $testFrame("#Panel1").css("background-color");
                    ok(isBlue(actual), "Actual value is " + actual);
                    start();
                }
            });
        });


        // Tests that the background color of a panel changes to
        // Orange on MouseOver.
        asyncTest('OnMouseOver', 1, function () {


            // Different browsers represent orange differently
            // so we create a function:
            var isOrange = function (b) {
                return (b === "orange" || b === "rgb(255, 165, 0)");
            };

            // MouseOver the Panel using Simulate
            QUnit.triggerEvent($testFrame("#Panel1")[0], "mouseover");

            // Wait for the Panel background to change to orange
            waitFor({
                condition: function () {
                    var actual = $testFrame("#Panel1").css("background-color");
                    return isOrange(actual);
                },
                success: function () {
                    var actual = $testFrame("#Panel1").css("background-color");
                    ok(isOrange(actual), "Actual value is " + actual);
                    start();
                }
            });
        });


        // Tests that background color of a panel changes 
        // to Green on MouseOut

        asyncTest('OnMouseOut', 1, function () {

            var isGreen = function (g) {
                return (g === "green" || g === "rgb(0, 128, 0)");
            };

            QUnit.triggerEvent($testFrame("#Panel1")[0], "mouseout");

            waitFor({
                condition: function () {
                    var actual = $testFrame("#Panel1").css("background-color");
                    return isGreen(actual);
                },
                success: function () {
                    var actual = $testFrame("#Panel1").css("background-color");
                    ok(isGreen(actual), "Actual value is " + actual);
                    start();
                }
            });
        });


        // Tests that color of panel text changes
        // to purple on hoverOver

        asyncTest('OnHoverOver', 1, function () {

            var isPurple = function (b) {
                return (b === "purple" || b === "rgb(128, 0, 128)");
            };

            QUnit.triggerEvent($testFrame('#Panel1')[0], "mouseover");

            waitFor({
                condition: function () {
                    var actual = $testFrame('#Panel1').css('color');
                    return isPurple(actual);
                },
                success: function () {
                    var actual = $testFrame('#Panel1').css('color');
                    ok(isPurple(actual), "Actual value is " + actual);
                    start();
                }
            });
        });


        // Tests that color of panel text changes
        // to yellow on hoverOut

        asyncTest('OnHoverOut', 1, function () {

            var isYellow = function (o) {
                return (o === "yellow" || o === "rgb(255, 255, 0)");
            };

            QUnit.triggerEvent($testFrame('#Panel1')[0], "mouseout");

            waitFor({
                condition: function () {
                    var actual = $testFrame('#Panel1').css('color');
                    return isYellow(actual);
                },
                success: function () {
                    var actual = $testFrame('#Panel1').css('color');
                    ok(isYellow(actual), "Actual value is " + actual);
                    start();
                }
            });
        });
    </script>
</asp:Content>
