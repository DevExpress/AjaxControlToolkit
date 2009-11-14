<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    CodeFile="AutoComplete.aspx.cs"
    Inherits="Automated_AutoComplete"
    Title="AutoComplete Tests"
    %>
    
    <script runat="server">
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static string[] GetCompletionListWithContext(string prefixText, int count, string contextKey)
        {
            if (contextKey != null)
                return "this is a total of fifteen words that will be returned when we use context".Split(' ');
                
            if (count == 0)
            {
                count = 10;
            }

            if (prefixText.Equals("xyz"))
            {
                return new string[0];
            }

            ArrayList items = new ArrayList(count);
            Random random = new Random();
            for (int i = 0; i < count; i++)
            {
                char c1 = (char)random.Next(65, 90);
                char c2 = (char)random.Next(97, 122);
                char c3 = (char)random.Next(97, 122);

                items.Add(prefixText + c1 + c2 + c3);
            }

            return (string[])items.ToArray(typeof(string));
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static string[] GetCompletionListWithContextAndValues(string prefixText, int count, string contextKey)
        {
            System.Collections.Generic.List<string> items = new System.Collections.Generic.List<string>(GetCompletionListWithContext(prefixText, count, contextKey));
            for (int i = 0; i < items.Count; i++)
            {
                items[i] = AjaxControlToolkit.AutoCompleteExtender.CreateAutoCompleteItem(items[i], i.ToString());
            }
            return items.ToArray();
        }

        // Test data for issue 16362
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static string[] GetCompletionListAllNumbers(string prefixText, int count)
        {
            ArrayList items = new ArrayList(10);
            Random random = new Random();
            for (int i = 0; i < items.Capacity; i++)
            {
                char c1 = (char)random.Next(48, 57);
                char c2 = (char)random.Next(48, 57);
                char c3 = (char)random.Next(48, 57);
                
                items.Add(prefixText + c1 + c2 + c3);
            }

            return (string[])items.ToArray(typeof(string));
        }

        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);
            TextBox5.Focus();
        }
    </script>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:TextBox ID="TextBox1" runat="server" ></asp:TextBox>
    <div id="listID1"></div>
    <aspext:AutoCompleteExtender 
        ID="AutoCompleteExtender1" 
        runat="server" 
        TargetControlID="TextBox1"
        ServiceMethod="GetCompletionList"
        ServicePath="ToolkitTestService.asmx"
        MinimumPrefixLength="3" 
        EnableCaching="true"
        CompletionSetCount="5" 
        CompletionInterval="1000" 
        BehaviorID="autoCompleteBehavior1"
        /> 
    <br /><br />    
    <asp:TextBox ID="TextBox2" runat="server" ></asp:TextBox>
    <aspext:AutoCompleteExtender 
        ID="AutoCompleteExtender2" 
        runat="server" 
        TargetControlID="TextBox2"
        ServiceMethod="GetCompletionListWithContext"
        UseContextKey="true"
        MinimumPrefixLength="2" 
        EnableCaching="false"
        CompletionSetCount="10" 
        CompletionInterval="2000" 
        BehaviorID="autoCompleteBehavior2"
        FirstRowSelected="true"
        DelimiterCharacters=";," /> 
    <br /><br />    
    <asp:TextBox ID="TextBox3" runat="server" ></asp:TextBox>
    <aspext:AutoCompleteExtender 
        ID="AutoCompleteExtender3" 
        runat="server" 
        TargetControlID="TextBox3"
        ServiceMethod="GetCompletionListWithContextAndValues"
        UseContextKey="true"
        MinimumPrefixLength="2" 
        EnableCaching="false"
        CompletionSetCount="10" 
        CompletionInterval="1000" 
        BehaviorID="autoCompleteBehavior3" />
	<br /><br />    
    <asp:TextBox ID="TextBox4" runat="server" ></asp:TextBox>
    <aspext:AutoCompleteExtender 
        ID="AutoCompleteExtender4" 
        runat="server" 
        TargetControlID="TextBox4"
        ServiceMethod="GetCompletionList"
        ServicePath="ToolkitTestService.asmx"
        MinimumPrefixLength="3" 
        EnableCaching="true"
        CompletionSetCount="5" 
        CompletionInterval="1000" 
        BehaviorID="autoCompleteBehavior4"
        FirstRowSelected="true"
        DelimiterCharacters=";,"
        ShowOnlyCurrentWordInCompletionListItem="true" />  
    <br /><br />    
    <asp:TextBox ID="TextBox5" runat="server" ></asp:TextBox>
    <aspext:AutoCompleteExtender 
        ID="AutoCompleteExtender5" 
        runat="server" 
        TargetControlID="TextBox5"
        ServiceMethod="GetCompletionListAllNumbers"
        MinimumPrefixLength="2" 
        EnableCaching="false"
        CompletionSetCount="10" 
        CompletionInterval="1000" 
        BehaviorID="autoCompleteBehavior5" />

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.AutoCompleteBehavior'];

        // Test Harness
        var testHarness = null;

        // Controls in the page
        var tb1 = null;
        var autoCompleteBehavior1 = null;
        
        var tb2 = null;
        var autoCompleteBehavior2 = null;
        
        var tb3 = null;
        var autoCompleteBehavior3 = null;
        
        var tb4 = null;
        var autoCompleteBehavior4 = null;

        var tb5 = null;
        var autoCompleteBehavior5 = null;
       
        // Ensure the textbox is in its empty state
        function checkEmptyState(autoCompleteList, textBox) {
            return function() {
                testHarness.fireEvent(textBox, 'onfocus');
                testHarness.assertEqual('', textBox.value, "TextBox's  text should be '' instead of '" + textBox.value + "'");
                var children = autoCompleteList.childNodes;            
                testHarness.assertEqual(children.length, 0, "Div should be have no content when textbox is empty");
            };
        }

        // Test the initial state of the control
        function testInitialState(autoCompleteList, textBox) {
            return function() {
                checkEmptyState(autoCompleteList, textBox);
            };
        }
        
        // reset content in textbox
        function resetTextBox(textBox) {
            return function(){
                textBox.value = '';
            };
        }
        
        // Test adding text focus from full control
        function setText(text, textBox) {
            return function(){
                textBox.value = text; 
                testHarness.fireEvent(textBox, 'onfocus');
                testHarness.fireEvent(textBox, 'onkeydown');
            };
         }
        
        function checkAutoComplete(numMatches, autoCompleteList){
            return function() {
                var children = autoCompleteList.childNodes; 
                return (children.length == numMatches);
            };
        }
        
        function verifyAutoCompleteBehavior(text, numMatches, autoCompleteList) {       
            return function() {
                var children = autoCompleteList.childNodes; 
                testHarness.assertEqual(children.length, numMatches, "Div should have: " + numMatches + " when there are " + text.length + " characters in the textbox; Actual matches: " + children.length);
                if(children.length > 0) {
                    for (var i = 0; i < numMatches; i++) {
                        var child = children[i];
                        var match = child.innerHTML;
                        testHarness.assertEqual(match.indexOf(text), 0, "Every word should start with text: " + text + " Actual: " + match); 
                    }
                }
            };
        }
        
        function verifySelectedIndex(index, autoCompleteBehavior) {
            return function () {
                testHarness.assertEqual(autoCompleteBehavior._selectIndex, index, "Selected index should be: " + index + "; Actual: " + autoCompleteBehavior._selectIndex);
            };
        }
        
        function verifyLastWordStartsWith(delimiters, lastWordPrefix, autoCompleteList) {
            return function(){
                var children = autoCompleteList.childNodes; 
                if(children.length > 0) {
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        var match = child.innerHTML;
                        var tokens = match.split(delimiters);
                        var lastToken = tokens[tokens.length - 1];
                        testHarness.assertEqual(lastToken.indexOf(lastWordPrefix), 0, "The last word should start with text: " + lastWordPrefix + " Actual: " + lastToken); 
                    }
                }
            };
        }
        
        function verifyValues(autoCompleteList) {
            return function() {
                var children = autoCompleteList.childNodes;
                for (var i = 0; i < children.length; i++) {
                    testHarness.assertTrue(i == children[i]._value, "The value of child " + i + " should be '" + i + "' instead of '" + children[i]._value + "'"); 
                }
            };
        }

        // Register the tests
        function registerTests(harness)
        {
            testHarness = harness;
 
            tb1 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox1');
            autoCompleteBehavior1 = testHarness.getObject('autoCompleteBehavior1');
            tb2 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox2');
            autoCompleteBehavior2 = testHarness.getObject('autoCompleteBehavior2');
            tb3 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox3');
            autoCompleteBehavior3 = testHarness.getObject('autoCompleteBehavior3');            
            // Get the third text box from the page
            tb4 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox4');
            autoCompleteBehavior4 = testHarness.getObject('autoCompleteBehavior4');
            tb5 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox5');
            autoCompleteBehavior5 = testHarness.getObject('autoCompleteBehavior5');

            var test = testHarness.addTest('Initial1');
            test.addStep(testInitialState(autoCompleteBehavior1._completionListElement, tb1));
                     
            var test = testHarness.addTest('TextBox1_CharsLessThanLimit');
            test.addStep(setText('ab', tb1), checkAutoComplete(0, autoCompleteBehavior1._completionListElement), 50, 2000, verifyAutoCompleteBehavior('ab', 0, autoCompleteBehavior1._completionListElement));
            
            var test = testHarness.addTest('TextBox1_Reset1');
            test.addStep(resetTextBox(tb1));
            test.addStep(testInitialState(autoCompleteBehavior1._completionListElement, tb1));
                        
            var test = testHarness.addTest('TextBox1_CharsEqualToLimit')
            test.addStep(setText('abc', tb1), checkAutoComplete(5, autoCompleteBehavior1._completionListElement) , 50, 2000, verifyAutoCompleteBehavior('abc', 5, autoCompleteBehavior1._completionListElement));
                            
            var test = testHarness.addTest('TextBox1_Reset2');
            test.addStep(resetTextBox(tb1));
            test.addStep(testInitialState(autoCompleteBehavior1._completionListElement, tb1));            
            
            var test = testHarness.addTest('TextBox1_CharsGreaterThanLimit');
            test.addStep(setText('abcd', tb1), checkAutoComplete(5, autoCompleteBehavior1._completionListElement) , 50, 2000, verifyAutoCompleteBehavior('abcd', 5, autoCompleteBehavior1._completionListElement));
            
            var test = testHarness.addTest('TextBox1_Reset3');
            test.addStep(resetTextBox(tb1));
            test.addStep(testInitialState(autoCompleteBehavior1._completionListElement, tb1)); 
                                   
            var test = testHarness.addTest('Initial2');
            test.addStep(testInitialState(autoCompleteBehavior2._completionListElement, tb2));
                     
            var test = testHarness.addTest('TextBox2_CharsLessThanLimit');
            test.addStep(setText('a', tb2), checkAutoComplete(0, autoCompleteBehavior2._completionListElement), 50, 3000, verifyAutoCompleteBehavior('a', 0, autoCompleteBehavior2._completionListElement));
            
            var test = testHarness.addTest('TextBox2_Reset1');
            test.addStep(resetTextBox(tb2));
            test.addStep(testInitialState(autoCompleteBehavior2._completionListElement, tb2));
                        
            var test = testHarness.addTest('TextBox2_CharsEqualToLimit')
            test.addStep(setText('ab', tb2), checkAutoComplete(10, autoCompleteBehavior2._completionListElement) , 50, 3000, verifyAutoCompleteBehavior('ab', 10, autoCompleteBehavior2._completionListElement));
                            
            var test = testHarness.addTest('TextBox2_Reset2');
            test.addStep(resetTextBox(tb2));
            test.addStep(testInitialState(autoCompleteBehavior2._completionListElement, tb2));            
            
            var test = testHarness.addTest('TextBox2_CharsGreaterThanLimit');
            test.addStep(setText('abcd', tb2), checkAutoComplete(10, autoCompleteBehavior2._completionListElement) , 50, 3000, verifyAutoCompleteBehavior('abcd', 10, autoCompleteBehavior2._completionListElement));
            
            var test = testHarness.addTest('TextBox2_Reset3');
            test.addStep(resetTextBox(tb2));
            test.addStep(testInitialState(autoCompleteBehavior2._completionListElement, tb2)); 
            
            
            var test = testHarness.addTest('Service with ContextKey');
            test.addStep(function() { autoCompleteBehavior2.set_contextKey('user specific context...'); });
            test.addStep(setText('abcd', tb2), checkAutoComplete(15, autoCompleteBehavior2._completionListElement) , 50, 3000, verifyAutoCompleteBehavior('', 15, autoCompleteBehavior2._completionListElement));

            var test = testHarness.addTest('First option selected turned off');
            test.addStep(setText('abcd', tb1), 
                checkAutoComplete(5, autoCompleteBehavior1._completionListElement) , 
                50, 2000, 
                verifySelectedIndex(-1, autoCompleteBehavior1));
            
            var test = testHarness.addTest('First option selected turned on');
            test.addStep(setText('abc', tb2), 
                checkAutoComplete(10, autoCompleteBehavior2._completionListElement) , 
                50, 3000, 
                verifySelectedIndex(0, autoCompleteBehavior2));
                
            var test = testHarness.addTest('Multiword autocomplete');
            test.addStep(setText('abc;bcd', tb2), 
                checkAutoComplete(10, autoCompleteBehavior2._completionListElement) , 
                50, 3000, 
                verifyLastWordStartsWith(";", "bcd", autoCompleteBehavior2._completionListElement));
                
            var test = testHarness.addTest('Text/Value Pairs');
            test.addStep(setText('abcd', tb3), checkAutoComplete(10, autoCompleteBehavior3._completionListElement), 50, 3000, verifyValues(autoCompleteBehavior3._completionListElement));
            
            
            var test = testHarness.addTest('Initial4');
            test.addStep(testInitialState(autoCompleteBehavior4._completionListElement, tb4));
                     
            var test = testHarness.addTest('TextBox4_CharsLessThanLimit');
            test.addStep(setText('ab', tb4), checkAutoComplete(0, autoCompleteBehavior4._completionListElement), 50, 2000, verifyAutoCompleteBehavior('ab', 0, autoCompleteBehavior3._completionListElement));
            
            var test = testHarness.addTest('TextBox4_Reset1');
            test.addStep(resetTextBox(tb4));
            test.addStep(testInitialState(autoCompleteBehavior4._completionListElement, tb4));
                        
            var test = testHarness.addTest('TextBox4_CharsEqualToLimit')
            test.addStep(setText('abc', tb4), checkAutoComplete(5, autoCompleteBehavior4._completionListElement) , 50, 2000, verifyAutoCompleteBehavior('abc', 5, autoCompleteBehavior4._completionListElement));
                            
            var test = testHarness.addTest('TextBox4_Reset2');
            test.addStep(resetTextBox(tb4));
            test.addStep(testInitialState(autoCompleteBehavior3._completionListElement, tb4));            
            
            var test = testHarness.addTest('TextBox4_CharsGreaterThanLimit');
            test.addStep(setText('abcd', tb4), checkAutoComplete(5, autoCompleteBehavior4._completionListElement) , 50, 2000, verifyAutoCompleteBehavior('abcd', 5, autoCompleteBehavior4._completionListElement));
            
            var test = testHarness.addTest('TextBox4_Reset3');
            test.addStep(resetTextBox(tb4));
            test.addStep(testInitialState(autoCompleteBehavior4._completionListElement, tb4)); 
            
            var test = testHarness.addTest('TextBox4_NoDelimetersInList');
            test.addStep(setText('abcd,djshg,agsdj', tb4), checkAutoComplete(5, autoCompleteBehavior4._completionListElement) , 50, 2000, verifyAutoCompleteBehavior('agsdj', 5, autoCompleteBehavior4._completionListElement));
           
            var test = testHarness.addTest('TextBox4_Reset4');
            test.addStep(resetTextBox(tb4));
            test.addStep(testInitialState(autoCompleteBehavior4._completionListElement, tb4));

            // Test case for issue 16362
            var test = testHarness.addTest('All digit values starting with 0');
            test.addStep(setText('00', tb5), checkAutoComplete(10, autoCompleteBehavior5._completionListElement), 50, 3000, verifyAutoCompleteBehavior('00', 10, autoCompleteBehavior5._completionListElement));

            // Test case for issues 13107, 14790
            var test = testHarness.addTest("TextBox5 has focus on page load");
            testHarness.assertTrue(autoCompleteBehavior5._textBoxHasFocus == false, "AutoComplete shouldn't know that textbox has focus.");
            test.addStep(setText('00', tb5), checkAutoComplete(10, autoCompleteBehavior5._completionListElement), 50, 3000, verifyAutoCompleteBehavior('00', 10, autoCompleteBehavior5._completionListElement));
        }
    </script>
</asp:Content>
