<%@ Page Language="C#" MasterPageFile="~/Default.master" CodeFile="ComboBox.aspx.cs"
    Inherits="ComboBox" Title="ComboBox Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <aspext:ComboBox ID="ComboBox1" runat="server" DropDownStyle="Simple">
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
        <asp:ListItem>ee fff</asp:ListItem>
    </aspext:ComboBox>
    <br />
    <br />
    <aspext:ComboBox ID="ComboBox2" runat="server" DropDownStyle="DropDown">
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
        <asp:ListItem>ee fff</asp:ListItem>
    </aspext:ComboBox>
    <br />
    <br />
    <aspext:ComboBox ID="ComboBox3" runat="server" DropDownStyle="DropDownList">
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
        <asp:ListItem>ee fff</asp:ListItem>
    </aspext:ComboBox>
    <br />
    <br />
    <aspext:ComboBox ID="ComboBox4" runat="server">
    </aspext:ComboBox>
    <br />
    <br />

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.PopupBehavior', 'Sys.Extended.UI.PositioningMode'];

        // Test Harness
        var testHarness = null;

        // Controls in the page
        var cb1, cb2, cb3;

        function initializeEvent(element, eventName, charCode, keyCode, eventGroup) {

            var eventObject;
            if (document.createEventObject) { // ie
                eventObject = document.createEventObject();
                eventObject.srcElement = element;
                eventObject.type = eventName;
                if (keyCode) {
                    eventObject.keyCode = keyCode;
                }
                if (charCode) {
                    eventObject.charCode = charCode;
                }
            } else if (document.createEvent) { // ff, webkit
                if (Sys.Browser.agent == Sys.Browser.Safari || Sys.Browser.agent == Sys.Browser.Opera) {
                    eventGroup = 'UIEvents';
                }
                eventObject = document.createEvent(eventGroup);
            } else {
                alert("Can't create fire events using this browser");
                return null;
            }

            return eventObject;

        }

        function initializeKeyEvent(element, eventName, charCode, keyCode, shiftKey) {

            var eventObject = initializeEvent(element, eventName, charCode, keyCode, 'KeyEvents');
            if (document.createEvent) { // ff, webkit
                if (Sys.Browser.agent == Sys.Browser.Safari || Sys.Browser.agent == Sys.Browser.Opera) {
                    eventObject.initEvent(eventName, true, true);
                }
                else {
                    eventObject.initKeyEvent(eventName, true, true, null, false, false, shiftKey, false, keyCode, charCode);
                }
            }

            var domEvent = new Sys.UI.DomEvent(eventObject);
            domEvent.shiftKey = shiftKey;
            return domEvent;

        }

        function initializeMouseEvent(element, eventName, charCode, keyCode, shiftKey) {

            var eventObject = initializeEvent(element, eventName, charCode, keyCode, 'MouseEvents');

            if (document.createEvent) { // ff, webkit
                eventObject.initEvent(eventName, true, true);
            }

            var domEvent = new Sys.UI.DomEvent(eventObject);
            domEvent.shiftKey = shiftKey;
            return domEvent;

        }

        function sendFocus(element) {
            return function() {
                testHarness.fireEvent(element, 'onfocus')
            }
        }

        function sendBlur(element) {
            return function() {
                testHarness.fireEvent(element, 'onblur')
            }
        }

        function sendTextBoxKey(cb, charString, keyCode, shiftKey) {
            return function() {
                var textBox = cb.get_textBoxControl();
                // for character keys, IE fires keydown before keypress (so does Safari 3 release)
                if (Sys.Browser.agent == Sys.Browser.InternetExplorer || Sys.Browser.agent == Sys.Browser.Safari) {
                    cb._onTextBoxKeyDown(initializeKeyEvent(textBox, 'keydown', null, keyCode, shiftKey));
                    if (charString != null) {
                        cb._onTextBoxKeyPress(initializeKeyEvent(textBox, 'keypress', charString.charCodeAt(0), keyCode, shiftKey));
                    }
                }
                else { // browser is probably ff or opera
                    if (charString != null) {
                        cb._onTextBoxKeyPress(initializeKeyEvent(textBox, 'keypress', charString.charCodeAt(0), keyCode, shiftKey));
                    } else {
                        cb._onTextBoxKeyPress(initializeKeyEvent(textBox, 'keypress', 0, keyCode, shiftKey));
                    }
                }
            }
        }

        function sendButtonClick(cb) {
            return function() {
                var button = cb.get_buttonControl();
                var clickEvent = initializeMouseEvent(button, 'click', null, null, false);
                cb._onButtonClick(clickEvent);
            }
        }

        function sendListItemMouseOver(cb, hoveredIndex) {
            return function() {
                var list = cb.get_optionListControl();
                var hoverEvent = initializeMouseEvent(list, 'mouseover', null, null, false);
                hoverEvent.target = list.childNodes[hoveredIndex];
                cb._onListMouseOver(hoverEvent);
            }
        }

        function sendListItemMouseDown(cb, hoveredIndex) {
            return function() {
                var list = cb.get_optionListControl();
                var hoverEvent = initializeMouseEvent(list, 'mouseover', null, null, false);
                hoverEvent.target = list.childNodes[hoveredIndex];
                cb._onListMouseDown(hoverEvent);
            }
        }

        function checkSelectedIndex(cb, expectedIndex) {
            return function() {
                var selectedIndex = cb.get_selectedIndex();
                var dropDownStyle = cb.get_dropDownStyle();
                var items = cb._optionListItems;

                // selectedIndex can only be -2 when custom text is entered
                testHarness.assertFalse((selectedIndex == -2 && dropDownStyle == Sys.Extended.UI.ComboBoxStyle.DropDownList), 'SelectedIndex cannot be "-2" when DropDownStyle is "DropDownList"');

                // selectedIndex can only be -1 when the list is empty
                testHarness.assertFalse((selectedIndex == -1 && items.length > 0), 'SelectedIndex cannot be "-1" unless there are no items in the list');

                // selectedIndex cannot be out of bounds
                testHarness.assertFalse((selectedIndex > (items.length - 1)), 'SelectedIndex is out of bounds: it is "' + selectedIndex + '" but there is/are only "' + items.length + '" item(s) in the list.');

                // make sure the selectedIndex is expected
                testHarness.assertEqual(selectedIndex, expectedIndex, 'Expected SelectedIndex to be "' + expectedIndex + '" but it is "' + selectedIndex + '"');
            }
        }

        function checkHighlightedIndex(cb, expectedIndex) {
            return function() {
                var highlightedIndex = cb._highlightedIndex;

                // make sure the highlightedIndex is expected
                testHarness.assertEqual(highlightedIndex, expectedIndex, 'Expected HighlightedIndex to be "' + expectedIndex + '" but it is "' + highlightedIndex + '"');
            }
        }

        function checkTextBoxValue(cb, expectedText) {
            return function() {
                var textBox = cb.get_textBoxControl();

                // make sure the text is expected
                testHarness.assertEqual(textBox.value, expectedText, 'Expected TextBox value to be "' + expectedText + '" but it is "' + textBox.value + '"');
            }
        }

        function checkPopupVisibility(cb, expectedVisibility) {
            return function() {
                testHarness.assertEqual(cb._popupBehavior._visible, expectedVisibility, 'Expected PopupBehavior\'s visibility to be "' + expectedVisibility + '" but it is "' + cb._popupBehavior._visible);
            }
        }

        function changeAutoCompleteMode(cb, newMode) {
            return function() {
                cb.set_autoCompleteMode(newMode);
            }
        }

        function changeDropDownStyle(cb, newStyle) {
            return function() {
                cb.set_dropDownStyle(newStyle);
            }
        }

        var spKey = 32;
        var n4Key = 52;
        var n7Key = 55;
        var aKey = 65;
        var bKey = 66;
        var cKey = 67;
        var dKey = 68;
        var eKey = 69;
        var fKey = 70;
        var gKey = 71;
        var hKey = 72;
        var iKey = 73;
        var jKey = 74;
        var kKey = 75;
        var lKey = 76;
        var mKey = 77;
        var nKey = 78;
        var oKey = 79;
        var pKey = 80;
        var qKey = 81;
        var rKey = 82;
        var sKey = 83;
        var tKey = 84;
        var uKey = 85;
        var vKey = 86;
        var wKey = 87;
        var xKey = 88;
        var yKey = 88;
        var zKey = 88;

        // Register the tests
        function registerTests(harness) {

            testHarness = harness;

            cb1 = testHarness.getObject('ctl00_ContentPlaceHolder1_ComboBox1');
            cb2 = testHarness.getObject('ctl00_ContentPlaceHolder1_ComboBox2');
            cb3 = testHarness.getObject('ctl00_ContentPlaceHolder1_ComboBox3');
            cb4 = testHarness.getObject('ctl00_ContentPlaceHolder1_ComboBox4');

            tb1 = cb1.get_textBoxControl();
            tb2 = cb2.get_textBoxControl();
            tb3 = cb3.get_textBoxControl();
            tb4 = cb4.get_textBoxControl();

            var test;

            test = testHarness.addTest('Simple focus & blur without autocompletion');
            test.addStep(sendFocus(tb1));
            test.addStep(checkSelectedIndex(cb1, 0));
            test.addStep(checkTextBoxValue(cb1, '&'));
            test.addStep(checkPopupVisibility(cb1, true));
            test.addStep(sendBlur(tb1));
            test.addStep(checkPopupVisibility(cb1, false));

            test = testHarness.addTest('Simple typing characters without autocompletion'); //TODO backspace and delete keys not working
            test.addStep(sendFocus(tb1));
            test.addStep(sendTextBoxKey(cb1, 'd', dKey, true));
            test.addStep(checkTextBoxValue(cb1, 'd'));
            test.addStep(checkSelectedIndex(cb1, 0));
            test.addStep(sendBlur(tb1));
            test.addStep(checkSelectedIndex(cb1, -2));
            test.addStep(sendFocus(tb1));
            test.addStep(sendTextBoxKey(cb1, 'a', aKey, false));
            test.addStep(checkTextBoxValue(cb1, 'a'));
            test.addStep(checkSelectedIndex(cb1, -2));
            test.addStep(sendBlur(tb1));
            test.addStep(checkSelectedIndex(cb1, 1));
            test.addStep(sendFocus(tb1));
            test.addStep(sendTextBoxKey(cb1, 'a', aKey, false));
            test.addStep(sendTextBoxKey(cb1, 'a', aKey, false));
            test.addStep(checkTextBoxValue(cb1, 'AA'));
            test.addStep(checkSelectedIndex(cb1, 1));
            test.addStep(sendBlur(tb1));
            test.addStep(checkSelectedIndex(cb1, 3));

            test = testHarness.addTest('Simple arrow & enter keys');
            test.addStep(sendFocus(tb1));
            test.addStep(checkTextBoxValue(cb1, '&'));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.down, false));
            test.addStep(checkTextBoxValue(cb1, 'AaA'));
            test.addStep(sendBlur(tb1));
            test.addStep(checkSelectedIndex(cb1, 4));
            test.addStep(sendFocus(tb1));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.down, false));
            test.addStep(checkTextBoxValue(cb1, 'bd'));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.up, false));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.up, false));
            test.addStep(checkTextBoxValue(cb1, 'bc'));
            test.addStep(checkPopupVisibility(cb1, true));
            test.addStep(sendTextBoxKey(cb1, null, Sys.UI.Key.enter, false));
            test.addStep(checkPopupVisibility(cb1, false));
            test.addStep(checkTextBoxValue(cb1, 'bc'));
            test.addStep(checkSelectedIndex(cb1, 6));
            test.addStep(sendBlur(tb1));
            test.addStep(checkSelectedIndex(cb1, 6));

            test = testHarness.addTest('DropDown focus & blur without autocompletion');
            test.addStep(sendFocus(tb2));
            test.addStep(checkSelectedIndex(cb2, 0));
            test.addStep(checkTextBoxValue(cb2, '&'));
            test.addStep(sendBlur(tb2));

            test = testHarness.addTest('DropDown typing characters without autocompletion');
            test.addStep(sendFocus(tb2));
            test.addStep(sendTextBoxKey(cb2, 'b', dKey, false));
            test.addStep(sendTextBoxKey(cb2, 'c', dKey, false));
            test.addStep(sendTextBoxKey(cb2, 'd', dKey, false));
            test.addStep(checkTextBoxValue(cb2, 'bcd'));
            test.addStep(sendBlur(tb2));
            test.addStep(checkSelectedIndex(cb2, 7));
            test.addStep(sendFocus(tb2));
            test.addStep(checkTextBoxValue(cb2, 'bcd'));
            test.addStep(sendTextBoxKey(cb2, 'a', dKey, false));
            test.addStep(sendTextBoxKey(cb2, 'a', dKey, false));
            test.addStep(sendTextBoxKey(cb2, 'a', dKey, false));
            test.addStep(checkTextBoxValue(cb2, 'AaA'));
            test.addStep(checkSelectedIndex(cb2, 7));
            test.addStep(sendBlur(tb2));
            test.addStep(checkSelectedIndex(cb2, 4));
            test.addStep(sendFocus(tb2));
            test.addStep(sendTextBoxKey(cb2, 'd', dKey, false));
            test.addStep(checkTextBoxValue(cb2, 'd'));
            test.addStep(checkSelectedIndex(cb2, 4));
            test.addStep(sendBlur(tb2));
            test.addStep(checkSelectedIndex(cb2, -2));

            test = testHarness.addTest('DropDown arrow & enter keys');
            test.addStep(sendFocus(tb2));
            test.addStep(checkTextBoxValue(cb2, '&'));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false)); // need extra arrow because popup not already visible
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false));
            test.addStep(checkTextBoxValue(cb2, 'AaA'));
            test.addStep(sendBlur(tb2));
            test.addStep(checkSelectedIndex(cb2, 4));
            test.addStep(sendFocus(tb2));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false)); // need extra arrow because popup not already visible
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false));
            test.addStep(checkTextBoxValue(cb2, 'bd'));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.up, false));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.up, false));
            test.addStep(checkTextBoxValue(cb2, 'bc'));
            test.addStep(checkPopupVisibility(cb2, true));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.enter, false));
            test.addStep(checkPopupVisibility(cb2, false));
            test.addStep(checkTextBoxValue(cb2, 'bc'));
            test.addStep(checkSelectedIndex(cb2, 6));
            test.addStep(sendBlur(tb2));
            test.addStep(checkSelectedIndex(cb2, 6));

            test = testHarness.addTest('DropDownList focus & blur without autocompletion');
            test.addStep(sendFocus(tb3));
            test.addStep(checkSelectedIndex(cb3, 0));
            test.addStep(checkTextBoxValue(cb3, '&'));
            test.addStep(sendBlur(tb3));

            test = testHarness.addTest('DropDownList typing characters without autocompletion');
            test.addStep(sendFocus(tb3));
            test.addStep(sendTextBoxKey(cb3, 'b', dKey, false));
            test.addStep(sendTextBoxKey(cb3, 'c', dKey, false));
            test.addStep(sendTextBoxKey(cb3, 'd', dKey, false));
            test.addStep(checkTextBoxValue(cb3, 'bcd'));
            test.addStep(sendTextBoxKey(cb3, 'x', xKey, false));
            test.addStep(checkTextBoxValue(cb3, 'bcd'));
            test.addStep(sendBlur(tb3));
            test.addStep(checkSelectedIndex(cb3, 7));
            test.addStep(sendFocus(tb3));
            test.addStep(checkTextBoxValue(cb3, 'bcd'));
            test.addStep(sendTextBoxKey(cb3, 'a', dKey, false));
            test.addStep(sendTextBoxKey(cb3, 'a', dKey, false));
            test.addStep(sendTextBoxKey(cb3, 'a', dKey, false));
            test.addStep(checkTextBoxValue(cb3, 'AaA'));
            test.addStep(sendTextBoxKey(cb3, 'r', rKey, false));
            test.addStep(checkTextBoxValue(cb3, 'AaA'));
            test.addStep(checkSelectedIndex(cb3, 7));
            test.addStep(sendBlur(tb3));
            test.addStep(checkSelectedIndex(cb3, 4));
            test.addStep(sendFocus(tb3));
            test.addStep(sendTextBoxKey(cb3, 'd', dKey, false));
            test.addStep(checkTextBoxValue(cb3, 'AaA'));

            test = testHarness.addTest('DropDownList arrow & enter keys');
            test.addStep(sendFocus(tb3));
            test.addStep(checkTextBoxValue(cb3, '&'));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.down, false)); // need extra arrow because popup not already visible
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.down, false));
            test.addStep(checkTextBoxValue(cb3, 'AaA'));
            test.addStep(sendBlur(tb3));
            test.addStep(checkSelectedIndex(cb3, 4));
            test.addStep(sendFocus(tb3));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.down, false)); // need extra arrow because popup not already visible
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.down, false));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.down, false));
            test.addStep(checkTextBoxValue(cb3, 'bd'));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.up, false));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.up, false));
            test.addStep(checkTextBoxValue(cb3, 'bc'));
            test.addStep(checkPopupVisibility(cb3, true));
            test.addStep(sendTextBoxKey(cb3, null, Sys.UI.Key.enter, false));
            test.addStep(checkPopupVisibility(cb3, false));
            test.addStep(checkTextBoxValue(cb3, 'bc'));
            test.addStep(checkSelectedIndex(cb3, 6));
            test.addStep(sendBlur(tb3));
            test.addStep(checkSelectedIndex(cb3, 6));

            test = testHarness.addTest('Suggest autocompletion');
            test.addStep(changeAutoCompleteMode(cb1, Sys.Extended.UI.ComboBoxAutoCompleteMode.Suggest));
            test.addStep(changeAutoCompleteMode(cb2, Sys.Extended.UI.ComboBoxAutoCompleteMode.Suggest));
            test.addStep(changeAutoCompleteMode(cb3, Sys.Extended.UI.ComboBoxAutoCompleteMode.Suggest));

            test.addStep(sendFocus(tb1));
            test.addStep(checkPopupVisibility(cb1, true));
            test.addStep(sendTextBoxKey(cb1, 'e', eKey, false));
            test.addStep(sendBlur(tb1));
            test.addStep(checkSelectedIndex(cb1, 10));
            test.addStep(checkTextBoxValue(cb1, 'ee fff'));

            test.addStep(sendFocus(tb2));
            test.addStep(checkPopupVisibility(cb2, false));
            test.addStep(sendTextBoxKey(cb2, 'e', eKey, false));
            test.addStep(checkPopupVisibility(cb2, true));
            test.addStep(sendBlur(tb2));
            test.addStep(checkSelectedIndex(cb2, 10));
            test.addStep(checkTextBoxValue(cb1, 'ee fff'));
            test.addStep(sendFocus(tb2));
            test.addStep(checkPopupVisibility(cb2, false));
            test.addStep(sendTextBoxKey(cb2, 'b', bKey, false));
            test.addStep(checkTextBoxValue(cb2, 'b'));
            test.addStep(checkPopupVisibility(cb2, true));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false));
            test.addStep(checkSelectedIndex(cb2, 6));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.down, false));
            test.addStep(checkSelectedIndex(cb2, 7));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.up, false));
            test.addStep(checkSelectedIndex(cb2, 6));
            test.addStep(checkPopupVisibility(cb2, true));
            test.addStep(sendTextBoxKey(cb2, null, Sys.UI.Key.enter, false));
            test.addStep(checkPopupVisibility(cb2, false));
            test.addStep(sendBlur(tb2));

            test.addStep(sendFocus(tb3));
            test.addStep(checkPopupVisibility(cb3, false));
            test.addStep(sendTextBoxKey(cb3, 'e', eKey, false));
            test.addStep(checkPopupVisibility(cb3, true));
            test.addStep(sendBlur(tb3));
            test.addStep(checkSelectedIndex(cb3, 10));
            test.addStep(sendFocus(tb3));
            test.addStep(sendTextBoxKey(cb3, 'e', eKey, false));
            test.addStep(sendTextBoxKey(cb3, 'x', xKey, false));
            test.addStep(checkTextBoxValue(cb3, 'e'));
            test.addStep(sendBlur(tb3));
            test.addStep(checkTextBoxValue(cb3, 'ee fff'));

            test.addStep(changeAutoCompleteMode(cb1, Sys.Extended.UI.ComboBoxAutoCompleteMode.None));
            test.addStep(changeAutoCompleteMode(cb2, Sys.Extended.UI.ComboBoxAutoCompleteMode.None));
            test.addStep(changeAutoCompleteMode(cb3, Sys.Extended.UI.ComboBoxAutoCompleteMode.None));

            test = testHarness.addTest('Append autocompletion');
            test.addStep(changeAutoCompleteMode(cb1, Sys.Extended.UI.ComboBoxAutoCompleteMode.Append));
            test.addStep(changeAutoCompleteMode(cb2, Sys.Extended.UI.ComboBoxAutoCompleteMode.Append));
            test.addStep(changeAutoCompleteMode(cb3, Sys.Extended.UI.ComboBoxAutoCompleteMode.Append));

            test.addStep(sendFocus(tb1));
            test.addStep(sendTextBoxKey(cb1, 'e', eKey, false));
            test.addStep(checkSelectedIndex(cb1, 0));
            test.addStep(checkTextBoxValue(cb1, 'ee fff'));
            test.addStep(sendTextBoxKey(cb1, 'x', xKey, false));
            test.addStep(checkTextBoxValue(cb1, 'ex'));
            test.addStep(sendBlur(tb1));
            test.addStep(checkSelectedIndex(cb1, -2));

            test.addStep(sendFocus(tb2));
            test.addStep(sendTextBoxKey(cb2, 'e', eKey, false));
            test.addStep(checkSelectedIndex(cb2, 0));
            test.addStep(checkTextBoxValue(cb2, 'ee fff'));
            test.addStep(sendTextBoxKey(cb2, 'x', xKey, false));
            test.addStep(checkTextBoxValue(cb2, 'ex'));
            test.addStep(sendBlur(tb2));
            test.addStep(checkSelectedIndex(cb2, -2));

            test.addStep(sendFocus(tb3));
            test.addStep(sendTextBoxKey(cb3, 'e', eKey, false));
            test.addStep(checkSelectedIndex(cb3, 0));
            test.addStep(checkTextBoxValue(cb3, 'ee fff'));
            test.addStep(sendTextBoxKey(cb3, 'x', xKey, false));
            test.addStep(checkTextBoxValue(cb3, 'ee fff'));
            test.addStep(sendBlur(tb3));
            test.addStep(checkSelectedIndex(cb3, 10));

            test.addStep(changeAutoCompleteMode(cb1, Sys.Extended.UI.ComboBoxAutoCompleteMode.None));
            test.addStep(changeAutoCompleteMode(cb2, Sys.Extended.UI.ComboBoxAutoCompleteMode.None));
            test.addStep(changeAutoCompleteMode(cb3, Sys.Extended.UI.ComboBoxAutoCompleteMode.None));

            test = testHarness.addTest('SuggestAppend autocompletion');
            test.addStep(changeAutoCompleteMode(cb1, Sys.Extended.UI.ComboBoxAutoCompleteMode.SuggestAppend));
            test.addStep(changeAutoCompleteMode(cb2, Sys.Extended.UI.ComboBoxAutoCompleteMode.SuggestAppend));
            test.addStep(changeAutoCompleteMode(cb3, Sys.Extended.UI.ComboBoxAutoCompleteMode.SuggestAppend));

            test.addStep(sendFocus(tb1));
            test.addStep(checkPopupVisibility(cb1, true));
            test.addStep(sendTextBoxKey(cb1, 'e', eKey, false));
            test.addStep(checkTextBoxValue(cb1, 'ee fff'));
            test.addStep(sendTextBoxKey(cb1, 'x', xKey, false));
            test.addStep(checkTextBoxValue(cb1, 'ex'));
            test.addStep(checkSelectedIndex(cb1, 0));
            test.addStep(sendBlur(tb1));
            test.addStep(checkSelectedIndex(cb1, -2));

            test.addStep(sendFocus(tb1));
            test.addStep(checkPopupVisibility(cb1, true));
            test.addStep(sendTextBoxKey(cb1, 'e', eKey, false));
            test.addStep(checkTextBoxValue(cb1, 'ee fff'));
            test.addStep(checkSelectedIndex(cb1, -2));
            test.addStep(sendBlur(tb1));
            test.addStep(checkSelectedIndex(cb1, 10));

            test.addStep(sendFocus(tb2));
            test.addStep(checkPopupVisibility(cb2, false));
            test.addStep(sendTextBoxKey(cb2, 'e', eKey, false));
            test.addStep(checkPopupVisibility(cb2, true));
            test.addStep(checkTextBoxValue(cb2, 'ee fff'));
            test.addStep(sendTextBoxKey(cb2, 'x', xKey, false));
            test.addStep(checkTextBoxValue(cb2, 'ex'));
            test.addStep(checkSelectedIndex(cb2, 0));
            test.addStep(sendBlur(tb2));
            test.addStep(checkSelectedIndex(cb2, -2));

            test.addStep(sendFocus(tb2));
            test.addStep(checkPopupVisibility(cb2, false));
            test.addStep(sendTextBoxKey(cb2, 'e', eKey, false));
            test.addStep(checkPopupVisibility(cb2, true));
            test.addStep(checkTextBoxValue(cb2, 'ee fff'));
            test.addStep(checkSelectedIndex(cb2, -2));
            test.addStep(sendBlur(tb2));
            test.addStep(checkSelectedIndex(cb2, 10));

            test.addStep(sendFocus(tb3));
            test.addStep(checkPopupVisibility(cb3, false));
            test.addStep(sendTextBoxKey(cb3, 'e', eKey, false));
            test.addStep(checkPopupVisibility(cb3, true));
            test.addStep(checkTextBoxValue(cb3, 'ee fff'));
            test.addStep(sendTextBoxKey(cb3, 'x', xKey, false));
            test.addStep(checkTextBoxValue(cb3, 'ee fff'));
            test.addStep(checkSelectedIndex(cb3, 0));
            test.addStep(sendBlur(tb3));
            test.addStep(checkSelectedIndex(cb3, 10));

            test.addStep(changeAutoCompleteMode(cb1, Sys.Extended.UI.ComboBoxAutoCompleteMode.None));
            test.addStep(changeAutoCompleteMode(cb2, Sys.Extended.UI.ComboBoxAutoCompleteMode.None));
            test.addStep(changeAutoCompleteMode(cb3, Sys.Extended.UI.ComboBoxAutoCompleteMode.None));

            test = testHarness.addTest('Button and item clicks');
            test.addStep(checkPopupVisibility(cb1, false));
            test.addStep(sendButtonClick(cb1));
            test.addStep(checkPopupVisibility(cb1, true));
            test.addStep(sendListItemMouseOver(cb1, 6));
            test.addStep(checkHighlightedIndex(cb1, 6));
            test.addStep(sendListItemMouseOver(cb1, 9));
            test.addStep(checkHighlightedIndex(cb1, 9));
            test.addStep(sendListItemMouseOver(cb1, 4));
            test.addStep(checkHighlightedIndex(cb1, 4));
            test.addStep(sendListItemMouseDown(cb1, 4));
            test.addStep(checkTextBoxValue(cb1, 'AaA'));
            test.addStep(checkPopupVisibility(cb2, false));
            test.addStep(sendButtonClick(cb2));
            test.addStep(checkPopupVisibility(cb2, true));
            test.addStep(sendListItemMouseOver(cb2, 6));
            test.addStep(checkHighlightedIndex(cb2, 6));
            test.addStep(sendListItemMouseOver(cb2, 9));
            test.addStep(checkHighlightedIndex(cb2, 9));
            test.addStep(sendListItemMouseOver(cb2, 4));
            test.addStep(checkHighlightedIndex(cb2, 4));
            test.addStep(sendListItemMouseDown(cb2, 4));
            test.addStep(checkTextBoxValue(cb2, 'AaA'));
            test.addStep(checkPopupVisibility(cb3, false));
            test.addStep(sendButtonClick(cb3));
            test.addStep(checkPopupVisibility(cb3, true));
            test.addStep(sendListItemMouseOver(cb3, 6));
            test.addStep(checkHighlightedIndex(cb3, 6));
            test.addStep(sendListItemMouseOver(cb3, 9));
            test.addStep(checkHighlightedIndex(cb3, 9));
            test.addStep(sendListItemMouseOver(cb3, 4));
            test.addStep(checkHighlightedIndex(cb3, 4));
            test.addStep(sendListItemMouseDown(cb3, 4));
            test.addStep(checkTextBoxValue(cb3, 'AaA'));

            test = testHarness.addTest('Simple empty item collection');
            test.addStep(changeDropDownStyle(cb4, Sys.Extended.UI.ComboBoxStyle.Simple));
            test.addStep(sendFocus(tb4));
            test.addStep(checkSelectedIndex(cb4, -1));
            test.addStep(sendTextBoxKey(cb4, ' ', spKey, false));
            test.addStep(checkTextBoxValue(cb4, ' '));
            test.addStep(sendBlur(tb4));
            test.addStep(checkTextBoxValue(cb4, ''));
            test.addStep(checkSelectedIndex(cb4, -1));
            test.addStep(sendFocus(tb4));
            test.addStep(sendTextBoxKey(cb4, 'a', spKey, false));
            test.addStep(checkTextBoxValue(cb4, 'a'));
            test.addStep(sendBlur(tb4));
            test.addStep(checkTextBoxValue(cb4, 'a'));
            test.addStep(checkSelectedIndex(cb4, -2));
            test.addStep(changeDropDownStyle(cb4, Sys.Extended.UI.ComboBoxStyle.DropDown));

            test = testHarness.addTest('DropDown empty item collection');
            test.addStep(sendFocus(tb4));
            test.addStep(checkSelectedIndex(cb4, -1));
            test.addStep(sendTextBoxKey(cb4, ' ', spKey, false));
            test.addStep(checkTextBoxValue(cb4, ' '));
            test.addStep(sendBlur(tb4));
            test.addStep(checkTextBoxValue(cb4, ''));
            test.addStep(checkSelectedIndex(cb4, -1));
            test.addStep(sendFocus(tb4));
            test.addStep(sendTextBoxKey(cb4, 'a', spKey, false));
            test.addStep(checkTextBoxValue(cb4, 'a'));
            test.addStep(sendBlur(tb4));
            test.addStep(checkTextBoxValue(cb4, 'a'));
            test.addStep(checkSelectedIndex(cb4, -2));

            test = testHarness.addTest('DropDownList empty item collection');
            test.addStep(changeDropDownStyle(cb4, Sys.Extended.UI.ComboBoxStyle.DropDownList));
            test.addStep(sendFocus(tb4));
            test.addStep(checkSelectedIndex(cb4, -1));
            test.addStep(sendTextBoxKey(cb4, ' ', spKey, false));
            test.addStep(checkTextBoxValue(cb4, ''));
            test.addStep(sendBlur(tb4));
            test.addStep(checkTextBoxValue(cb4, ''));
            test.addStep(checkSelectedIndex(cb4, -1));
            test.addStep(sendFocus(tb4));
            test.addStep(sendTextBoxKey(cb4, 'a', spKey, false));
            test.addStep(checkTextBoxValue(cb4, ''));
            test.addStep(sendBlur(tb4));
            test.addStep(checkTextBoxValue(cb4, ''));
            test.addStep(checkSelectedIndex(cb4, -1));
            test.addStep(changeDropDownStyle(cb4, Sys.Extended.UI.ComboBoxStyle.DropDown));


        }    

    </script>
</asp:Content>
