<%@ Page Language="C#" MasterPageFile="~/Default.master" CodeFile="PagingBulletedList.aspx.cs"
    Inherits="Automated_PagingBulletedList" Title="PagingBulletedList Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:BulletedList ID="BulletedList1" runat="server" DisplayMode="Text">
        <asp:ListItem>zzzzzz</asp:ListItem>
        <asp:ListItem>1</asp:ListItem>
        <asp:ListItem>11</asp:ListItem>
        <asp:ListItem>111</asp:ListItem>
        <asp:ListItem>2</asp:ListItem>
        <asp:ListItem>5</asp:ListItem>
        <asp:ListItem>a</asp:ListItem>
        <asp:ListItem>b</asp:ListItem>
        <asp:ListItem>c</asp:ListItem>
        <asp:ListItem>d</asp:ListItem>
    </asp:BulletedList>
    
    <asp:Button ID="Button1" runat="server" Text="PostBack" />
    
    <aspext:PagingBulletedListExtender ID="PagingBulletedListExtender1" runat="server"
        TargetControlID="BulletedList1" ClientSort="false" IndexSize="1" Separator=" - " />


    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.PagingBulletedListBehavior'];
    
        // Test Harness
        var testHarness = null;
        var waitLength = 150;
        var timeOut = 5000;

        // Controls in the page
        var bl1 = null;
        var pble = null;
        var btn = null;

        //Event
        _indexHandler = Function.createDelegate(this, this.onIndexChange);
        var _eventOk;
        
        function checkIndex(pagingBulletedListExtender, index, value)
        {
            testHarness.assertEqual(pagingBulletedListExtender.get_tabIndex()[index].innerHTML, value, "Value of tabIndex[" + index + "] should be equal " + value + " and not " + pagingBulletedListExtender.get_tabIndex()[index].innerHTML);
        }
        
        function checkValue(pagingBulletedListExtender, index, item, value)
        {
            testHarness.assertEqual(pagingBulletedListExtender.get_tabValue()[index][item].innerHTML, value, "Value of tabValue[" + index + "]["+ item +"] should be equal " + value + " and not " + pagingBulletedListExtender.get_tabValue()[index][item].innerHTML);
        }

        function checkIndexSequence(sequence)
        {
            var tab = sequence.split(';');
            for(var i = 0; i<tab.length; i++)
            {
                checkIndex(pble, i, tab[i]);
            }
        }
        
        function selectItem(index)
        {
           testHarness.fireEvent(pble.get_tabIndex()[index], 'onclick');
        }
        
        function checkValueSequence(index, sequence)
        {
            var tab = sequence.split(";");
            for(var i = 0; i<tab.length; i++)
            {
               
               checkValue(pble, index, i, tab[i]);
            }
        }
        
        function sortMode()
        {
            pble.set_ClientSort(true);
        }
        function unSortMode()
        {
            pble.set_ClientSort(false);
        }
        
        function checkInit()
        {
            checkIndexSequence('Z;1;2;5;A;B;C;D');
            checkValueSequence(0,'zzzzzz');
        }
        function changeIndex1()
        {
            selectItem(1);
        }
        function changeIndex0()
        {
            selectItem(0);
        }
        function maxItemPageSize3()
        {
           pble.set_MaxItemPerPage(3);
        }
        function checkIndex1()
        {
            checkValueSequence(1,'1;11;111');
        }
        function checkAfterSort()
        {
            checkIndexSequence('1;2;5;A;B;C;D;Z');
            checkValueSequence(0,'1;11;111');
        }
        function checkAfterMaxItemPerPage()
        {
            checkIndexSequence('zzzzzz;111;a');
            checkValueSequence(0,'zzzzzz;1;11');
            checkValueSequence(1,'111;2;5');
        }
        function changeIndexSize2()
        {
            pble.set_IndexSize(2);
        }
        function checkAfterIndexSize()
        {
            checkIndexSequence('ZZ;1;11;2;5;A;B;C');
            checkValueSequence(0,'zzzzzz');
            checkValueSequence(1,'1');
            checkValueSequence(2,'11;111');
        }
        

        function attachEvent()
        {
            _eventOk = false;
            pble.add_indexChanged(_indexHandler);
        }
        function onIndexChange(sender, eventArgs)
        {
            _eventOk = true;
        }
        
        function checkEvent()
        {
            try { 
                checkValueSequence(1,'1;11;111');
                testHarness.assertEqual(_eventOk, true, "Event not index change not lauch '" + pble.id + "'");        
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
            bl1 = testHarness.getElement('ctl00_ContentPlaceHolder1_BulletedList1');
            pble = testHarness.getObject('ctl00_ContentPlaceHolder1_PagingBulletedListExtender1');
            btn = testHarness.getElement('ctl00_ContentPlaceHolder1_Button1');

            test = testHarness.addTest('Initial State');
            test.addStep(checkInit);
            
            //Change Index
            test = testHarness.addTest('Change Index');
            test.addStep(changeIndex1);
            test.addStep(checkIndex1);
            
            //Sort
            test = testHarness.addTest('Sort Client');
            test.addStep(changeIndex0);
            test.addStep(sortMode);
            test.addStep(checkAfterSort);
            
            //UnSort
            test = testHarness.addTest('UnSort Client');
            test.addStep(unSortMode);
            test.addStep(checkInit);
            
            //Change IndexSize
            test = testHarness.addTest('Index Size = 2');
            test.addStep(changeIndexSize2);
            test.addStep(checkAfterIndexSize);
            
            //MaxItemPerPage
            test = testHarness.addTest('Max Item per page = 3');
            test.addStep(maxItemPageSize3);
            test.addStep(checkAfterMaxItemPerPage);
                                    
            //Attach to onChangeIndex
            //TODO : Attach event with new Framework
            test = testHarness.addTest('Attach to onChangeIndex');
            test.addStep(attachEvent);
            test.addStep(changeIndex1, checkEvent, waitLength, timeOut);            
            
            //PostBack
            test = testHarness.addTest('PostBack');
            test.addStep(changeIndex1);
            test.addPostBack(btn);
            test.addStep(checkIndex1);
        }
    </script>




</asp:Content>
