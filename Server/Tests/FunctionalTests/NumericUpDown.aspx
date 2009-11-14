<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    CodeFile="NumericUpDown.aspx.cs"
    Inherits="Automated_NumericUpDown"
    Title="NumericUpDown Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    1. Enter numeric value :
                <asp:TextBox ID="TextBox1" runat="server" Text="3"></asp:TextBox>
                <br />
                2. Enter a month :
                <asp:TextBox ID="TextBox2" runat="server" Text="June"></asp:TextBox><br />
                3. Random value between 0 and 1000 (WebService Call) :
                <asp:TextBox ID="TextBox3" runat="server" Text="500"></asp:TextBox><br />
                4.
                <input type=button ID="bt1" value="down"/><asp:TextBox ID="TextBox4" runat="server" Text="0"></asp:TextBox>
                <input type=button ID="bt2" value="up"/><br />
                
              
    <asp:Button ID="Button1" runat="server" Text="Button" OnClick="Button1_Click" />
       <aspext:NumericUpDownExtender ID="NumericUpDownExtender1" runat="server"
            TargetControlID="TextBox1" Width="80" RefValues=""
            ServiceDownMethod="" ServiceUpMethod="" TargetButtonDownID="" TargetButtonUpID="" />
        <aspext:NumericUpDownExtender id="NumericUpDownExtender2" runat="server"
            TargetControlID="TextBox2" Width="120" RefValues="January;February;March;April;May;June;July;August;September;October;November;December"
            ServiceDownMethod="" ServiceUpMethod="" TargetButtonDownID="" TargetButtonUpID="" />
        <aspext:NumericUpDownExtender id="NumericUpDownExtender3" runat="server"
            TargetControlID="TextBox3" Width="80" ServiceUpMethod="NextValue"
            ServiceDownMethod="PrevValue" RefValues="" Tag="5" TargetButtonDownID="" TargetButtonUpID="" />
        <aspext:NumericUpDownExtender id="NumericUpDownExtender4" runat="server"
            TargetControlID="TextBox4" Width="80" TargetButtonDownID="bt1"
            TargetButtonUpID="bt2" RefValues="" ServiceDownMethod="" ServiceUpMethod="" />
    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.NumericUpDownBehavior'];
    
        // Test Harness
        var testHarness = null;
        var waitLength = 150;
        var timeOut = 5000;

        // Controls in the page
        var tb1 = null;
        var tb2 = null;
        var tb3 = null;
        var tb4 = null;
        var bt1 = null;
        var bt2 = null;
        var btn = null;
        var nud1 = null;
        var nud2 = null;
        var nud3 = null;
        var nud4 = null;

        //Event
        var _changeHandler;
        var _eventOk;
        _changeHandler = Function.createDelegate(this, this.onChangeEvent);
        
        function checkValue(textbox, value)
        {
            testHarness.assertEqual(textbox.value, value, "Textbox '" + textbox.id + "' should be equal " + value + " and not " + textbox.value);
        }
        
        function checkInit()
        {
            checkValue(tb1, '3');
            checkValue(tb2, 'June');
            checkValue(tb3, '500');
            checkValue(tb4, '0');
        }
        function moreOne()
        {
            //1
            nud1._clickUp();
            //2
            nud2._clickUp();
            //4
            testHarness.fireEvent(bt2, 'onclick');
        }
        function moreOne50Times()
        {
            for (var i = 0; i<50; i++)
            {
                nud2._clickUp();
            }
        }
        function lessOne()
        {
            //1
            nud1._clickDown();
            //2
            nud2._clickDown();
            //4
            testHarness.fireEvent(bt1, 'onclick');
        }
        function lessOne50Times()
        {
            for (var i = 0; i<50; i++)
            {
                nud2._clickDown();
            }
        }
        
        function clickUpWS()
        {
            //3
            nud3._clickUp();
        }
        
        function clickDownWS()
        {
            //3
            nud3._clickDown();
        }

        function waitSubed()
        {
            try { 
                checkValue(tb3, '499');
                return true;
            } catch (ex) {
                return false;
            }
        }        
        
        function waitAdded()
        {
            try { 
                checkValue(tb3, '501');
                return true;
            } catch (ex) {
                return false;
            }
        }        
        function checkValueMoreOne()
        {
            checkValue(tb1, '4');
            checkValue(tb2, 'July');
            checkValue(tb4, '1');
        }
        function checkValueArrayMax()
        {
            checkValue(tb2, 'December');
        }
        function checkValueArrayMin()
        {
            checkValue(tb2, 'January');
        }
       
        function changeValueManually()
        {
            tb1.value = '10';
            testHarness.fireEvent(tb1, 'onblur');
//            tb2.value = 'July';
//            testHarness.fireEvent(tb2, 'onblur');
//            tb3.value = '10';
//            testHarness.fireEvent(tb3, 'onblur');
            tb4.value = '10';
            testHarness.fireEvent(tb4, 'onblur');
        }
        function checkValueIndex()
        {
            tb2.value = '2';
            testHarness.fireEvent(tb2, 'onblur');
            checkValue(tb2, 'March');
        }
        function checkValueIndexError()
        {
            tb2.value = '50';
            testHarness.fireEvent(tb2, 'onblur');
            checkValue(tb2, 'January');
        }
        function checkValueManually()
        {
            checkValue(tb1, '10');
//            checkValue(tb2, 'July');
//            checkValue(tb3, '10');
            checkValue(tb4, '10');
        }
        function checkValueSubOne()
        {
            checkValue(tb1, '2');
            checkValue(tb2, 'May');
            checkValue(tb4, '-1');
        }
        
        
        function changeValueError()
        {
            tb1.value = 'aa';
            testHarness.fireEvent(tb1, 'onblur');
//            tb2.value = 'aa';
//            testHarness.fireEvent(tb2, 'onblur');
//            tb3.value = 'aa';
//            testHarness.fireEvent(tb3, 'onblur');
            tb4.value = 'aa';
            testHarness.fireEvent(tb4, 'onblur');
        }
        function checkValueManuallyError()
        {
            checkValue(tb1, '-1.7976931348623157e+308');
//            checkValue(tb2, 'January');
//            checkValue(tb3, '0');
            checkValue(tb4, '-1.7976931348623157e+308');
        }
        
        function checkChangeArray()
        {
           nud2.set_RefValues("Monday;Tuesday;Wednesday;Thursday;Friday;Saturday;Sunday");
           checkValue(tb2, 'Monday');
        }
        function checkValueNewArrayMax()
        {
            checkValue(tb2, 'Sunday');
        }
        function checkValueNewArrayMin()
        {
            checkValue(tb2, 'Monday');
        }
        function attachEvent()
        {
            _eventOk = false;
            nud1.add_currentChanged(_changeHandler);
        }
        function onChangeEvent(sender, eventArgs)
        {
            _eventOk = true;
        }
        function checkEvent()
        {
            try { 
                checkValue(tb1, '4');
                testHarness.assertEqual(_eventOk, true, "Event not lauch on Textbox '" + tb1.id + "'");        
                return true;
            } catch (ex) {
                return false;
            }

        }

        function checkPositionOfUpButton() {
            var upButtonlocation = $common.getLocation(nud1._bUp);
            var elementLocation = $common.getLocation(nud1.get_element());

            testHarness.assertTrue(Math.abs(upButtonlocation.y - elementLocation.y) <= 2, 'The Up button is not positioned correctly');
        }

        function checkPositionOfDownButton() {
            var downButtonlocation = $common.getLocation(nud1._bDown);
            var elementLocation = $common.getLocation(nud1.get_element());

            testHarness.assertTrue(Math.abs(downButtonlocation.y - (elementLocation.y + nud1._bUp.offsetHeight)) <= 2, 'The Down button is not positioned correctly');
        }

        // Register the tests
        function registerTests(harness)
        {
            testHarness = harness;
            var test;
            
            // Get the controls from the page
            tb1 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox1');
            tb2 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox2');
            tb3 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox3');
            tb4 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox4');
            bt1 = testHarness.getElement('bt1');
            bt2 = testHarness.getElement('bt2');
            btn = testHarness.getElement('ctl00_ContentPlaceHolder1_Button1');
            nud1 = testHarness.getObject('ctl00_ContentPlaceHolder1_NumericUpDownExtender1');
            nud2 = testHarness.getObject('ctl00_ContentPlaceHolder1_NumericUpDownExtender2');
            nud3 = testHarness.getObject('ctl00_ContentPlaceHolder1_NumericUpDownExtender3');
            nud4 = testHarness.getObject('ctl00_ContentPlaceHolder1_NumericUpDownExtender4');
            
            btn = testHarness.getElement('ctl00_ContentPlaceHolder1_Button1');

            test = testHarness.addTest('Initial State');
            test.addStep(checkInit);
            
            //Add / Sub 1 to all
            test = testHarness.addTest('Add 1');
            test.addStep(moreOne);
            test.addStep(checkValueMoreOne);
            //test = testHarness.addTest('Add 1WS');
            //test.addStep(clickUpWS, waitAdded, waitLength, timeOut);
            test = testHarness.addTest('Sub 1');
            test.addStep(lessOne);
            test.addStep(checkValueSubOne);
            //test = testHarness.addTest('Sub 1WS');
            //test.addStep(clickDownWS, waitSubed, waitLength, timeOut);
            
            //Test ends of array
            test = testHarness.addTest('Ends of Array');
            test.addStep(moreOne50Times);
            test.addStep(checkValueArrayMax);
            test.addStep(lessOne50Times);
            test.addStep(checkValueArrayMin);
                        
            //Change Value manually
            test = testHarness.addTest('Change value manually');
            test.addStep(changeValueManually);
            test.addStep(checkValueManually);
            test = testHarness.addTest('Change value manually Error');
            test.addStep(changeValueError);
            test.addStep(checkValueManuallyError);
//            test = testHarness.addTest('Change value Index');
//            test.addStep(checkValueIndex);
//            test = testHarness.addTest('Change value Index Error');
//            test.addStep(checkValueIndexError);
            
            //Change array dynamically 
            test = testHarness.addTest('Change array dynamically');
            test.addStep(checkChangeArray);
            test.addStep(moreOne50Times);
            test.addStep(checkValueNewArrayMax);
            test.addStep(lessOne50Times);
            test.addStep(checkValueNewArrayMin);
                        
            //Attach to onChangeEvent
            test = testHarness.addTest('Attach to onChangeEvent');
            test.addStep(attachEvent);
            test.addStep(moreOne, checkEvent, waitLength, timeOut);
            
            //Test PostBack
            test = testHarness.addTest("AutoPostBack After Change Manually");
            test.addStep(changeValueManually);
            test.addPostBack(btn);
            test.addStep(checkValueManually);
//            test = testHarness.addTest("AutoPostBack After Change Click Up");
//            test.addStep(moreOne);
//            test.addPostBack(btn);
//            test.addStep(checkValueMoreOne);
//            test = testHarness.addTest("AutoPostBack After Change Click Down");
//            test.addStep(lessOne);
//            test.addPostBack(btn);
//            test.addStep(checkValueSubOne);

            //Test position of Up/Down buttons
            test = testHarness.addTest("Test position of Up/Down buttons");
            test.addStep(checkPositionOfUpButton);
            test.addStep(checkPositionOfDownButton);
        }
    </script>
</asp:Content>
