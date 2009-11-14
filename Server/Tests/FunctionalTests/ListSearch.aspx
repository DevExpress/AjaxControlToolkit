<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    CodeFile="ListSearch.aspx.cs"
    Inherits="Automated_ListSearch"
    Title="ListSearch Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
        <asp:ListBox ID="ListBox1" runat="server" Width="120px">
            <asp:ListItem>Compaq</asp:ListItem>
            <asp:ListItem>Digital</asp:ListItem>
            <asp:ListItem>HP</asp:ListItem>
        </asp:ListBox>
        <aspext:listsearchextender id="ListSearchExtender1" runat="server"
        targetcontrolid="ListBox1"
        PromptPosition="Top"
        PromptText="a"
        BehaviorID="ListSearchExtender1"/>

        <asp:ListBox ID="ListBox2" runat="server" Width="120px">
            <asp:ListItem>&amp;</asp:ListItem>
            <asp:ListItem>a</asp:ListItem>
            <asp:ListItem>A</asp:ListItem>
            <asp:ListItem>AA</asp:ListItem>
            <asp:ListItem>AaA</asp:ListItem>
            <asp:ListItem>b</asp:ListItem>
            <asp:ListItem>bc</asp:ListItem>
            <asp:ListItem>bcd</asp:ListItem>
            <asp:ListItem>bd</asp:ListItem>
            <asp:ListItem>c</asp:ListItem>
        </asp:ListBox>
        <aspext:listsearchextender id="ListSearchExtender2" runat="server" targetcontrolid="ListBox2" PromptPosition="Top" BehaviorID="ListSearchExtender2"></aspext:listsearchextender>
        <asp:DropDownList ID="DropDownList1" runat="server" Width="120px">
            <asp:ListItem>Compaq</asp:ListItem>
            <asp:ListItem>Digital</asp:ListItem>
            <asp:ListItem>HP</asp:ListItem>
        </asp:DropDownList>
        <aspext:ListSearchExtender ID="ListSearchExtender3" runat="server"
        TargetControlID="DropDownList1"
        PromptPosition="Top"
        PromptText="a"
        BehaviorID="ListSearchExtender3" />
        <asp:DropDownList ID="DropDownList2" runat="server" Width="120px">
            <asp:ListItem>&amp;</asp:ListItem>
            <asp:ListItem>a</asp:ListItem>
            <asp:ListItem>A</asp:ListItem>
            <asp:ListItem>AA</asp:ListItem>
            <asp:ListItem>AaA</asp:ListItem>
            <asp:ListItem>b</asp:ListItem>
            <asp:ListItem>bc</asp:ListItem>
            <asp:ListItem>bcd</asp:ListItem>
            <asp:ListItem>bd</asp:ListItem>
            <asp:ListItem>c</asp:ListItem>
        </asp:DropDownList>
        <aspext:ListSearchExtender ID="ListSearchExtender4" runat="server" TargetControlID="DropDownList2" PromptPosition="Top" BehaviorID="ListSearchExtender4"></aspext:ListSearchExtender>
    &nbsp;<br />
    <br />
    &nbsp;
    <br />

    <script type="text/javascript">
    // Script objects that should be loaded before we run
    var typeDependencies = ['Sys.Extended.UI.ListSearchBehavior', 'Sys.Extended.UI.PopupBehavior'];
    
    // Test Harness
    var testHarness = null;
    
    // Last object to fire an OnChange
    var lastOnChange = null;
    
    var changeHandler = null;
   
    function initializeEvent(element, eventName, charCode, keyCode) {
        var eventObject;
        if(document.createEventObject) {
            var eventObject = document.createEventObject();                
            eventObject.srcElement = element;
            eventObject.type = eventName;
            if(keyCode) {
                eventObject.keyCode = keyCode;
            }
            if(charCode) {
                eventObject.charCode = charCode;
            }
        } else if(document.createEvent) {
            var eventObject = document.createEvent('KeyEvents');
            eventObject.initKeyEvent( eventName, true, true, null, false, false, false, false, keyCode, charCode );
        } else {
            alert("Can't create fire events using this browser");
            return null;
        }

        return new Sys.UI.DomEvent(eventObject);
    }

    function sendKey(extender, element, charString, keyCode) {
        extender._onKeyDown( initializeEvent(element, 'keydown', null, keyCode));
        if(!charString && keyCode && Sys.Browser.agent != Sys.Browser.InternetExplorer) {    // FireFox fires a keyPresss for backspace etc.
            extender._onKeyPress(initializeEvent(element, 'keypress', 0, keyCode));
        } else if (charString) {
            extender._onKeyPress(initializeEvent(element, 'keypress', charString.charCodeAt(0), 0));
        }
        extender._onKeyUp(initializeEvent(element, 'keyup', null, keyCode));
    }



    function checkPrompt(extender, expectedPrompt) {
        var prompt = extender._promptDiv;
        testHarness.assertTrue(prompt, 'Expected prompt "' + expectedPrompt + '" but got no prompt');
        
        if(expectedPrompt == '') {
            testHarness.assertEqual(prompt.innerHTML, '', 'Expected prompt to be empty but it is "' + prompt.innerHTML + "'");
        } else {
            testHarness.assertEqual(prompt.firstChild.nodeValue, expectedPrompt, 'Expected prompt to be "' + expectedPrompt + '" but it is "' + prompt.firstChild.nodeValue + '"');
        }
    }

    function sendKeyAndCheck(extender, element, charString, keyCode, expectedPrompt, expectedIndex) {
        sendKey(extender, element, charString, keyCode);
        checkPrompt(extender, expectedPrompt);
        testHarness.assertEqual(element.selectedIndex, expectedIndex, 'Expected selected index to be ' + expectedIndex + ' but it is ' + element.selectedIndex);
    }

    function checkLastOnChange(element) {
        testHarness.assertTrue(lastOnChange, 'Expected an OnChangeEvent to have been fired.');
        testHarness.assertEqual(lastOnChange.type, 'change', 'Expected a change event to have been fired, but got ' + lastOnChange.type);
        testHarness.assertEqual(lastOnChange.target, element, 'Change event fired for wrong target');
        lastOnChange = null;
    }    
    
    function checkNoOnChange() {
        testHarness.assertFalse(lastOnChange, 'Expected no OnChangeEvent to have been fired.');
    }    

    function onChange(eventObject) {
        lastOnChange = eventObject;
    }
    
    function attachOnChangeEvent(element) {
        lastOnChange = null;
        changeHandler = Function.createDelegate(this, onChange);
        
        $addHandler(element, 'change',     changeHandler);
    }
    
    function removeOnChangeEvent(element) {
        $removeHandler(element, 'change',     changeHandler);
    }

    var listBox1;
    var extender1;
    var listBox2;
    var extender2;
    
    var dropDownList1;
    var extender3;
    var dropDownList2;
    var extender4;


    var aKey = 65;
    var bKey = 66;
    var cKey = 67;
    var dKey = 68;
    var xKey = 88;
    var ampKey = 55;
    
    // Register the tests
    function registerTests(harness) {
        testHarness = harness;
        
        listBox1 = testHarness.getElement('ctl00_ContentPlaceHolder1_ListBox1');
        extender1 = testHarness.getObject("ListSearchExtender1");
        
        listBox2 = testHarness.getElement('ctl00_ContentPlaceHolder1_ListBox2');
        extender2 = testHarness.getObject("ListSearchExtender2");
               
        dropDownList1 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList1');
        extender3 = testHarness.getObject("ListSearchExtender3");
        
        dropDownList2 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList2');
        extender4 = testHarness.getObject("ListSearchExtender4");
        
        var test = testHarness.addTest("ListBox Focus with default prompt");
        test.addStep( function() { testHarness.fireEvent(listBox2, 'onfocus');checkPrompt(extender2, 'Type to search'); });
        test.addStep( function() { testHarness.fireEvent(listBox2, 'onblur'); testHarness.assertFalse(extender2._promptDiv); });
                
        test = testHarness.addTest("ListBox Focus and blur with custom prompt");
        test.addStep( function() { testHarness.fireEvent(listBox1, 'onfocus');});
        test.addStep( function() { checkPrompt(extender1, 'a'); });
        test.addStep( function() { testHarness.fireEvent(listBox1, 'onblur'); testHarness.assertFalse(extender1._promptDiv); });
        
        test = testHarness.addTest("ListBox Type and delete characters that matches the second element in the list");
        test.addStep( function() { testHarness.fireEvent(listBox1, 'onfocus');});
        test.addStep( function() { checkPrompt(extender1, 'a'); });
        test.addStep( function() { sendKeyAndCheck(extender1, listBox1, 'd', dKey, 'd', 1); });
        test.addStep( function() { sendKeyAndCheck(extender1, listBox1, 'c', cKey, 'dc', 1); });
        test.addStep( function() { sendKeyAndCheck(extender1, listBox1, null, Sys.UI.Key.backspace, 'd', 1); });
        test.addStep( function() { sendKeyAndCheck(extender1, listBox1, null, Sys.UI.Key.backspace, '', 0); });
        test.addStep( function() { testHarness.fireEvent(listBox1, 'onblur'); testHarness.assertFalse(extender1._promptDiv); });
        
        test = testHarness.addTest("ListBox OnChange fires when losing focus");
        test.addStep( function() { attachOnChangeEvent(listBox1); });
        test.addStep( function() { testHarness.fireEvent(listBox1, 'onfocus');});
        test.addStep( function() { sendKeyAndCheck(extender1, listBox1, 'd', dKey, 'd', 1); });
        test.addStep( function() { checkNoOnChange(); });
        test.addStep( function() { testHarness.fireEvent(listBox1, 'onblur'); testHarness.assertFalse(extender1._promptDiv); });
        test.addStep( function() { checkLastOnChange(listBox1); });
        test.addStep( function() { removeOnChangeEvent(listBox1); });
        
        test = testHarness.addTest("ListBox OnChange fires only when enter pressed");
        test.addStep( function() { attachOnChangeEvent(listBox1); });
        test.addStep( function() { testHarness.fireEvent(listBox1, 'onfocus');});
        test.addStep( function() { sendKeyAndCheck(extender1, listBox1, 'd', dKey, 'd', 1); });
        test.addStep( function() { checkNoOnChange(); });
        test.addStep( function() { sendKeyAndCheck(extender1, listBox1, null, Sys.UI.Key.enter, 'd', 1); });
        test.addStep( function() { checkLastOnChange(listBox1); });
        test.addStep( function() { testHarness.fireEvent(listBox1, 'onblur'); testHarness.assertFalse(extender1._promptDiv); });
        test.addStep( function() { removeOnChangeEvent(listBox1); });

        test = testHarness.addTest("ListBox Type and delete & (can't be used for innerHTML)");
        test.addStep( function() { testHarness.fireEvent(listBox2, 'onfocus');});
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, '&', ampKey, '&', 0); });
        test.addStep( function() { testHarness.fireEvent(listBox2, 'onblur'); testHarness.assertFalse(extender2._promptDiv); });

        test = testHarness.addTest("ListBox Check that hitting enter does nothing and escape clears the text typed so far");
        test.addStep( function() { testHarness.fireEvent(listBox2, 'onfocus');});
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'a', aKey, 'a', 1); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, '\n', Sys.UI.Key.enter, 'a', 1); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'a', aKey, 'aa', 3); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'a', aKey, 'aaa', 4); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.esc, '', 0); });
        test.addStep( function() { testHarness.fireEvent(listBox2, 'onblur'); testHarness.assertFalse(extender2._promptDiv); });

        test = testHarness.addTest("ListBox Type and delete characters that closely match elements in the list");
        test.addStep( function() { testHarness.fireEvent(listBox2, 'onfocus');});
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'A', aKey, 'A', 1); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'a', aKey, 'Aa', 3); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'a', aKey, 'Aaa', 4); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.backspace, 'Aa', 3); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.backspace, 'A', 1); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.backspace, '', 0); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'b', bKey, 'b', 5); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'x', xKey, 'bx', 5); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.backspace, 'b', 5); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'c', cKey, 'bc', 6); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'd', dKey, 'bcd', 7); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'a', aKey, 'bcda', 7); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.backspace, 'bcd', 7); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.backspace, 'bc', 6); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.backspace, 'b', 5); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'd', dKey, 'bd', 8); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.backspace, 'b', 5); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.backspace, '', 0); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, 'c', cKey, 'c', 9); });
        test.addStep( function() { sendKeyAndCheck(extender2, listBox2, null, Sys.UI.Key.backspace, '', 0); });
        test.addStep( function() { testHarness.fireEvent(listBox2, 'onblur'); testHarness.assertFalse(extender2._promptDiv); });

        //
        test = testHarness.addTest("DropDownList Focus with default prompt");
        test.addStep( function() { testHarness.fireEvent(dropDownList2, 'onfocus');checkPrompt(extender4, 'Type to search'); });
        test.addStep( function() { testHarness.fireEvent(dropDownList2, 'onblur'); testHarness.assertFalse(extender4._promptDiv); });
                
        test = testHarness.addTest("DropDownList Focus and blur with custom prompt");
        test.addStep( function() { testHarness.fireEvent(dropDownList1, 'onfocus');});
        test.addStep( function() { checkPrompt(extender3, 'a'); });
        test.addStep( function() { testHarness.fireEvent(dropDownList1, 'onblur'); testHarness.assertFalse(extender3._promptDiv); });
        
        test = testHarness.addTest("DropDownList Type and delete characters that matches the second element in the list");
        test.addStep( function() { testHarness.fireEvent(dropDownList1, 'onfocus');});
        test.addStep( function() { checkPrompt(extender3, 'a'); });
        test.addStep( function() { sendKeyAndCheck(extender3, dropDownList1, 'd', dKey, 'd', 1); });
        test.addStep( function() { sendKeyAndCheck(extender3, dropDownList1, 'c', cKey, 'dc', 1); });
        test.addStep( function() { sendKeyAndCheck(extender3, dropDownList1, null, Sys.UI.Key.backspace, 'd', 1); });
        test.addStep( function() { sendKeyAndCheck(extender3, dropDownList1, null, Sys.UI.Key.backspace, '', 0); });
        test.addStep( function() { testHarness.fireEvent(dropDownList1, 'onblur'); testHarness.assertFalse(extender3._promptDiv); });
        
        test = testHarness.addTest("DropDownList OnChange fires when losing focus");
        test.addStep( function() { attachOnChangeEvent(dropDownList1); });
        test.addStep( function() { testHarness.fireEvent(dropDownList1, 'onfocus');});
        test.addStep( function() { sendKeyAndCheck(extender3, dropDownList1, 'd', dKey, 'd', 1); });
        test.addStep( function() { checkNoOnChange(); });
        test.addStep( function() { testHarness.fireEvent(dropDownList1, 'onblur'); testHarness.assertFalse(extender3._promptDiv); });
        test.addStep( function() { checkLastOnChange(dropDownList1); });
        test.addStep( function() { removeOnChangeEvent(dropDownList1); });
        
        test = testHarness.addTest("DropDownList OnChange fires only when enter pressed");
        test.addStep( function() { attachOnChangeEvent(dropDownList1); });
        test.addStep( function() { testHarness.fireEvent(dropDownList1, 'onfocus');});
        test.addStep( function() { sendKeyAndCheck(extender3, dropDownList1, 'd', dKey, 'd', 1); });
        test.addStep( function() { checkNoOnChange(); });
        test.addStep( function() { sendKeyAndCheck(extender3, dropDownList1, null, Sys.UI.Key.enter, 'd', 1); });
        test.addStep( function() { checkLastOnChange(dropDownList1); });
        test.addStep( function() { testHarness.fireEvent(dropDownList1, 'onblur'); testHarness.assertFalse(extender3._promptDiv); });
        test.addStep( function() { removeOnChangeEvent(dropDownList1); });

        test = testHarness.addTest("DropDownList Type and delete & (can't be used for innerHTML)");
        test.addStep( function() { testHarness.fireEvent(dropDownList2, 'onfocus');});
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, '&', ampKey, '&', 0); });
        test.addStep( function() { testHarness.fireEvent(dropDownList2, 'onblur'); testHarness.assertFalse(extender4._promptDiv); });


        test = testHarness.addTest("DropDownList Check that hitting enter does nothing and escape clears the text typed so far");
        test.addStep( function() { testHarness.fireEvent(dropDownList2, 'onfocus');});
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'a', aKey, 'a', 1); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, '\n', Sys.UI.Key.enter, 'a', 1); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'a', aKey, 'aa', 3); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'a', aKey, 'aaa', 4); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.esc, '', 0); });
        test.addStep( function() { testHarness.fireEvent(dropDownList2, 'onblur'); testHarness.assertFalse(extender4._promptDiv); });


        test = testHarness.addTest("DropDownList Type and delete characters that closely match elements in the list");
        test.addStep( function() { testHarness.fireEvent(dropDownList2, 'onfocus');});
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'A', aKey, 'A', 1); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'a', aKey, 'Aa', 3); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'a', aKey, 'Aaa', 4); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.backspace, 'Aa', 3); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.backspace, 'A', 1); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.backspace, '', 0); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'b', bKey, 'b', 5); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'x', xKey, 'bx', 5); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.backspace, 'b', 5); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'c', cKey, 'bc', 6); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'd', dKey, 'bcd', 7); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'a', aKey, 'bcda', 7); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.backspace, 'bcd', 7); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.backspace, 'bc', 6); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.backspace, 'b', 5); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'd', dKey, 'bd', 8); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.backspace, 'b', 5); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.backspace, '', 0); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, 'c', cKey, 'c', 9); });
        test.addStep( function() { sendKeyAndCheck(extender4, dropDownList2, null, Sys.UI.Key.backspace, '', 0); });
        test.addStep( function() { testHarness.fireEvent(dropDownList2, 'onblur'); testHarness.assertFalse(extender4._promptDiv); });

    }

    </script>


</asp:Content>
