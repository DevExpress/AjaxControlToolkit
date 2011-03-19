<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="RoundedCorners.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.RoundedCorners.RoundedCorners" %>

<asp:Content ID="Content2" ContentPlaceHolderID="Script" runat="server">
    <script type="text/javascript">

        var panel = null;
        var panel2 = null;

        // Test that verifies if the panel has rounded divs.
        module('Initial State');
        asyncTest('Initial State', 1, function () {
            resetTestFrame(function () {
                verifyRoundedDivs();
                start();
            });
        });


        // Verifies that the number of DIVs used
        // to create the rounded corners is always
        // double the radius
        test("Changing radius", 99, function () {
            panel = $testFrame("#Panel1")[0];
            b = $find("RoundedCornersExtender1");

            for (var i = 1; i < 100; i++) {
                b.set_Radius(i);
                equals(getDivCount(panel), i * 2);
            }
        });

        // Returns number of DIVs for making rounded corner
        function getDivCount(el) {
            var count = 0;

            for (var i = 0; i < panel.childNodes.length; i++) {
                var child = panel.childNodes[i];
                if (child && child.__roundedDiv) {
                    count++;
                }
            }
            return count;
        }

        // Verifies that changing behavior color
        // has no effect on DIV count
        test("Changing radius", 2, function () {
            panel = $testFrame("#Panel1")[0];
            b = $find("RoundedCornersExtender1");

            // Get initial count of divs
            b.set_Radius(10);
            var initialDivs = getDivCount(panel);

            // Change the color
            b.set_Color("Red");
            equals(b.get_Color(), "Red");

            // Verify div count has not changed
            equals(getDivCount(panel), initialDivs);
        });


        // Test that changes the innerHTML of Panel2 
        // and verifies that panel2 and panel1 have 
        // different innerHTML
        module('Changing Text');
        asyncTest('Changing Text', 1, function () {
            modifyText();
            start();
        });

        // Test that sets border color
        // and verifies borders
        module('Border Color');
        asyncTest('Border Color', 20, function () {
            b = $find("RoundedCornersExtender1");
            b.set_BorderColor("#000000");
            verifyBorderDivs();
            start();
        });

        // Function that verify rounded divs.
        function verifyRoundedDivs(expectedCount) {
            var count = 0;
            panel = $testFrame("#Panel1")[0];
            b = $find("RoundedCornersExtender1");

            for (var i = 0; i < panel.childNodes.length; i++) {
                var child = panel.childNodes[i];
                if (child && child.__roundedDiv) {
                    count++;
                }
            }

            if (expectedCount) {
                equal(count / 2, expectedCount);
            }
            else {
                equal(count / 2, b.get_Radius());
            }
        }

        // Function that verifies the Border of Divs
        function verifyBorderDivs() {
            panel = $testFrame("#Panel1")[0];
            for (var i = 0; i < panel.childNodes.length; i++) {
                var child = panel.childNodes[i];
                if (child && child.__roundedDiv) {
                    ok(child.style.borderLeftStyle == "solid" || child.__roundedDivNoBorder);
                }
            }
        }


        // Function that modified the text of panel2.
        function modifyText() {
            panel = $testFrame("#Panel1")[0];
            panel2 = $testFrame("#Panel2")[0];
            var height = panel.offsetHeight;
            panel2.innerHTML = panel.innerHTML;
            notEqual(height, panel.offsetHeight);
        }
    </script>
</asp:Content>
