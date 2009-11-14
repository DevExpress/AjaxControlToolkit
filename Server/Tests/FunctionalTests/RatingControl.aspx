<%@ Page Language="C#" MasterPageFile="~/Default.master" CodeFile="RatingControl.aspx.cs"
    Inherits="Automated_RatingControl" Title="RatingControl Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <aspext:Rating ID="Rating1" BehaviorID="RatingBehavior1" runat="server" CurrentRating="5" MaxRating="10" ReadOnly="false"
        StarCssClass="ratingStar" WaitingStarCssClass="savedRatingStar" FilledStarCssClass="filledRatingStar"
        EmptyStarCssClass="emptyRatingStar" OnChanged="Rating1_Changed" Tag="99">
    </aspext:Rating>
    <br />
    <aspext:Rating ID="Rating3" BehaviorID="RatingBehavior3" runat="server" CurrentRating="5" MaxRating="10" ReadOnly="false"
        StarCssClass="ratingStar" WaitingStarCssClass="savedRatingStar" FilledStarCssClass="filledRatingStar"
        EmptyStarCssClass="emptyRatingStar" OnChanged="Rating3_Changed" Tag="99" RatingAlign="Vertical"
        RatingDirection="RightToLeftBottomToTop">
    </aspext:Rating>
    <aspext:Rating ID="Rating2" BehaviorID="RatingBehavior2" runat="server" CurrentRating="5" MaxRating="10" ReadOnly="false"
        StarCssClass="ratingStar" WaitingStarCssClass="savedRatingStar" FilledStarCssClass="filledRatingStar"
        EmptyStarCssClass="emptyRatingStar" OnChanged="Rating2_Changed" Tag="99" RatingDirection="RightToLeftBottomToTop">
    </aspext:Rating>
    <aspext:Rating ID="Rating4" BehaviorID="RatingBehavior4" runat="server" CurrentRating="5" MaxRating="10" ReadOnly="false"
        StarCssClass="ratingStar" WaitingStarCssClass="savedRatingStar" FilledStarCssClass="filledRatingStar"
        EmptyStarCssClass="emptyRatingStar" OnChanged="Rating4_Changed" Tag="99" RatingAlign="Vertical">
    </aspext:Rating>



<aspext:Rating ID="Rating5" AutoPostBack="true" BehaviorID="RatingBehavior5" runat="server" CurrentRating="5" MaxRating="10" ReadOnly="false"
        StarCssClass="ratingStar" WaitingStarCssClass="savedRatingStar" FilledStarCssClass="filledRatingStar"
        EmptyStarCssClass="emptyRatingStar" OnChanged="Rating5_Changed">
    </aspext:Rating>

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.RatingBehavior'];
    
        // Test Harness
        var testHarness = null;
        var waitLength = 150;
        var timeOut = 5000;

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

        //Event
        _ratingHandler = Function.createDelegate(this, this.onRatingChange);
        _endClientCallBackHandler = Function.createDelegate(this, this.onEndClientCallBack);
        var _eventOk;
        var _eventCallBackOk;
        var _resultFromServerSide;
        
        function checkValue(rating, value)
        {
            testHarness.assertEqual(rating.get_Rating(), value, "Value should be equal " + value + " and not " + rating.get_Rating());
        }
        
        function clickStar(rating, value)
        {
           testHarness.fireEvent(rating.get_Stars()[value], 'onmouseover');
           testHarness.fireEvent(rating.get_Stars()[value], 'onclick');
        }
        
        function checkValueAfterClientCallBack(id, value, tag, result)
        {
            var tab = result.split(";");
            testHarness.assertEqual(tab[0], id, "Id should be equal " + id + " and not " + tab[0]);
            testHarness.assertEqual(tab[1], value, "Value should be equal " + value + " and not " + tab[1]);
            testHarness.assertEqual(tab[2], tag, "Tag should be equal " + tag + " and not " + tab[2]);
        }
        
        function checkInit()
        {
            checkValue(rating1Extender, '5');
            checkValue(rating2Extender, '5');
            checkValue(rating3Extender, '5');
            checkValue(rating4Extender, '5');
        }
        function changeRating1()
        {
            clickStar(rating1Extender, 7);
        }
        function changeRating()
        {
            clickStar(rating1Extender, 7);
            clickStar(rating4Extender, 7);
            clickStar(rating3Extender, 7);
            clickStar(rating2Extender, 7);
        }
        function checkAfterRating()
        {
            checkValue(rating1Extender, '8');
            checkValue(rating4Extender, '8');
            checkValue(rating2Extender, '3');
            checkValue(rating3Extender, '3');
        }
        

        function attachEvent()
        {
            _eventOk = false;
            _eventCallBackOk = false;
            rating1Extender.add_Rated(_ratingHandler);
            rating1Extender.add_EndClientCallback(_endClientCallBackHandler);
        }
        
        function onRatingChange(sender, eventArgs)
        {
            _eventOk = true;
        }
        
        function onEndClientCallBack(sender, eventArgs)
        {
            _eventCallBackOk = true;
            _resultFromServerSide = eventArgs.get_CallbackResult();
        }

        function checkEvent()
        {
            try { 
                checkValue(rating1Extender,'8');
                testHarness.assertEqual(_eventOk, true, "Event not index change not lauch '" + rating1Extender.id + "'");
                return true;
            } catch (ex) {
                return false;
            }
        }

        function checkEndCallBackEvent()
        {
            try { 
                checkValueAfterClientCallBack('Rating1','8','99',_resultFromServerSide);
                testHarness.assertEqual(_eventCallBackOk, true, "Event not index change not lauch '" + rating1Extender.id + "'");
                return true;
            } catch (ex) {
                return false;
            }
        }
        // Register the tests
        function registerTests(harness)
        {
            testHarness = harness;
            var test;
            
            // Get the controls from the page
            rating1 = testHarness.getElement('ctl00_ContentPlaceHolder1_Rating1');
            rating1Extender = testHarness.getObject('RatingBehavior1');
            rating2 = testHarness.getElement('ctl00_ContentPlaceHolder1_Rating2');
            rating2Extender = testHarness.getObject('RatingBehavior2');
            rating3 = testHarness.getElement('ctl00_ContentPlaceHolder1_Rating3');
            rating3Extender = testHarness.getObject('RatingBehavior3');
            rating4 = testHarness.getElement('ctl00_ContentPlaceHolder1_Rating4');
            rating5 = testHarness.getElement('ctl00_ContentPlaceHolder1_Rating5');
            rating4Extender = testHarness.getObject('RatingBehavior4');
            rating5Extender = testHarness.getObject('RatingBehavior5');
            
            btn = testHarness.getElement('ctl00_ContentPlaceHolder1_Button1');

            test = testHarness.addTest('Initial State');
            test.addStep(checkInit);
            
            //Change Index
            test = testHarness.addTest('Change Rating');
            test.addStep(changeRating);
            test.addStep(checkAfterRating);
            
            //Attach to onChangeRating and EndCallBackEvent
            test = testHarness.addTest('Attach to onChangeRating');
            test.addStep(attachEvent);
            test.addStep(changeRating1, checkEvent, waitLength, timeOut);
            test.addStep(changeRating1, checkEndCallBackEvent, waitLength, timeOut);
            
            //Test PostBack
//            test = testHarness.addTest("AutoPostBack");
//            test.addStep(function() {clickStar(rating5Extender, 7);});            
//            test.addStep(function() {checkValue(rating5Extender, '8');});            
        }
    </script>

    <br />
    <asp:Button ID="Button1" runat="server" Text="Button" />

</asp:Content>
