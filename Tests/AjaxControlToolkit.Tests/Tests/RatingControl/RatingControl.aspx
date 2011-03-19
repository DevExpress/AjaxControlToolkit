<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="RatingControl.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.RatingControl.RatingControl" %>

<asp:Content ID="Content2" ContentPlaceHolderID="Script" runat="server">
    <script type="text/javascript">

        // Controls in the page
        var rating1 = null;
        var rating2 = null;
        var rating3 = null;
        var rating4 = null;

        var btn = null;

        var rating1Extender = null;
        var rating2Extender = null;
        var rating3Extender = null;
        var rating4Extender = null;

        rating1 = $testFrame('#Rating1');


        var _eventOk = false;
        var _eventCallBackOk = false;
        var _resultFromServerSide = null;


        /// This test verifies if all Rating controls have 5 rating 
        //  (which is currentRating attribute in all Rating Controls)
        module('Initial State');
        asyncTest('Initial State', 4, function () {
            resetTestFrame(function () {
                rating1Extender = $find('RatingBehavior1');
                rating2Extender = $find('RatingBehavior2');
                rating3Extender = $find('RatingBehavior3');
                rating4Extender = $find('RatingBehavior4');

                checkInit();
                start();

            });
        });

        // This test changes the Rating and
        //  checks if the rating values are ok
        module('Change Rating');
        asyncTest('Change Rating', 4, function () {
            resetTestFrame(function () {
                rating1Extender = $find('RatingBehavior1');
                rating2Extender = $find('RatingBehavior2');
                rating3Extender = $find('RatingBehavior3');
                rating4Extender = $find('RatingBehavior4');
                changeRating();

                checkAfterRating();
                start();
            });
        });

        // This test attaches onRatingChange , changes rating
        // and then checks if rating changed and 
        // whether onRatingChange was called.
        module('Attach to onChangeRating');
        asyncTest('Attach to onChangeRating', 2, function () {
            resetTestFrame(function () {

                rating1Extender = $find('RatingBehavior1');
                attachEvent();
                changeRating1();

                waitFor({
                    condition: function () {
                        return (testFrameWindow()._eventOk == true);
                    },
                    success: function () {
                        checkEvent();
                        start();
                    }
                });

            });
        });

        // This test attaches onRatingChange , changes rating
        // and then checks if rating changed and 
        // whether onEndClientCallBack was called.
        asyncTest('Attach to onChangeRating EndClientCallBack', 4, function () {
            resetTestFrame(function () {

                rating1Extender = $find('RatingBehavior1');
                attachEvent();
                changeRating1();

                waitFor({
                    condition: function () {
                        return (testFrameWindow()._resultFromServerSide != null && testFrameWindow()._eventOk == true && testFrameWindow()._eventCallBackOk == true);
                    },
                    success: function () {
                        checkEndCallBackEvent();
                        start();
                    }
                });

            });
        });



        function checkInit() {
            checkValue(rating1Extender, '5');
            checkValue(rating2Extender, '5');
            checkValue(rating3Extender, '5');
            checkValue(rating4Extender, '5');
        }

        function checkValue(rating, value) {
            equal(rating.get_Rating(), value);
        }

        function changeRating() {
            clickStar(rating1Extender, 7);
            clickStar(rating4Extender, 7);
            clickStar(rating3Extender, 7);
            clickStar(rating2Extender, 7);
        }

        function changeRating1() {
            clickStar(rating1Extender, 7);
        }

        function clickStar(rating, value) {
            QUnit.triggerEvent(rating.get_Stars()[value], "mouseover");
            QUnit.triggerEvent(rating.get_Stars()[value], "click");
        }

        function checkAfterRating() {
            checkValue(rating1Extender, '8');
            checkValue(rating4Extender, '8');
            checkValue(rating2Extender, '3');
            checkValue(rating3Extender, '3');
        }

        function attachEvent() {
            _eventOk = false;
            _eventCallBackOk = false;

            rating1Extender.add_Rated(testFrameWindow().onRatingChange);
            rating1Extender.add_EndClientCallback(testFrameWindow().onEndClientCallBack);
        }


        function checkEvent() {
            checkValue(rating1Extender, '8');
            equal(testFrameWindow()._eventOk, true);
        }

        function checkEndCallBackEvent() {
            checkValueAfterClientCallBack('Rating1', '8', '99', testFrameWindow()._resultFromServerSide);
            equal(testFrameWindow()._eventCallBackOk, true);
        }

        function checkValueAfterClientCallBack(id, value, tag, result) {
            var tab = result.split(";");
            equal(tab[0], id);
            equal(tab[1], value);
            equal(tab[2], tag);
        }

    </script>
</asp:Content>
