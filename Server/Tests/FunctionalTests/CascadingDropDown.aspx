<%@ Page
    Language="C#"
    CodeFile="CascadingDropDown.aspx.cs"
    Inherits="Automated_CascadingDropDown"
    Title="CascadingDropDown Tests"
    MasterPageFile="~/Default.master"
    EnableEventValidation="false" %>
    

<script runat="server">
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static AjaxControlToolkit.CascadingDropDownNameValue[] GetDropDownContents_PageMethod(string knownCategoryValues, string category)
        {
            AjaxControlToolkit.CascadingDropDownNameValue[] values = new CarsService().GetDropDownContents(knownCategoryValues, category);

            if (1 < values.Length)
            {
                values[1].isDefaultValue = true;
            }
            return values;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static AjaxControlToolkit.CascadingDropDownNameValue[] GetDropDownContentsWithContext(string knownCategoryValues, string category, string contextKey)
        {
            return new CascadingDropDownNameValue[] { new CascadingDropDownNameValue(contextKey, contextKey) };
        }
</script>

<asp:Content ID="Content" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:DropDownList ID="DropDownList1" runat="server" Width="170" OnSelectedIndexChanged="DropDownList1_SelectedIndexChanged" /><br />
    <asp:DropDownList ID="DropDownList2" runat="server" Width="170" /><br />
    <asp:DropDownList ID="DropDownList3" runat="server" Width="170" /><br />
    <asp:DropDownList ID="DropDownList3b" runat="server" Width="170" /><br />
    <aspext:CascadingDropDown ID="CascadingDropDown1" runat="server" TargetControlID="DropDownList1" Category="Make"  PromptText="Please select a make"  ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContents" PromptValue="PromptValue"/>
    <aspext:CascadingDropDown ID="CascadingDropDown5" runat="server" TargetControlID="DropDownList2" Category="Model" PromptText="Please select a model" ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContents" ParentControlID="DropDownList1" />
    <aspext:CascadingDropDown ID="CascadingDropDown6" runat="server" TargetControlID="DropDownList3" Category="Color" PromptText="Please select a color" ServiceMethod="GetDropDownContents_PageMethod" ParentControlID="DropDownList2" />
    <aspext:CascadingDropDown ID="CascadingDropDown7" runat="server" TargetControlID="DropDownList3b" Category="Color" PromptText="Please select a color" ServiceMethod="GetDropDownContents_PageMethod" ParentControlID="DropDownList2"/>
    
    <asp:Label ID="Label1" runat="server" Text="Label"></asp:Label><br />
    <asp:Label ID="Label4" runat="server" Text="Label"></asp:Label><br />
    <asp:Button ID="Button1" runat="server" Text="Button" OnClick="Button1_Click" /><br />

    <br />

    BMW:<asp:DropDownList ID="DropDownList4" runat="server" Width="170" /><br />
    3 Series:<asp:DropDownList ID="DropDownList5" runat="server" Width="170" /><br />
    RacingBlue: <asp:DropDownList ID="DropDownList6" runat="server" Width="170" /><br />
    <aspext:CascadingDropDown ID="CascadingDropDownx" runat="server"  TargetControlID="DropDownList4" Category="Make"  PromptText="Please select a make"  ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContents" SelectedValue="BMW (value)" />
    <aspext:CascadingDropDown ID="CascadingDropDowny" runat="server" TargetControlID="DropDownList5" Category="Model" PromptText="Please select a model" ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContents" ParentControlID="DropDownList4" SelectedValue="3 series (value)"/>
    <aspext:CascadingDropDown ID="CascadingDropDownz" runat="server" TargetControlID="DropDownList6" Category="Color" PromptText="Please select a color" ServiceMethod="GetDropDownContents_PageMethod" ParentControlID="DropDownList5" SelectedValue="Racing Blue (value)" />
    

    <br />

    AutoPostBack: <asp:DropDownList ID="DropDownList7" runat="server" Width="170" AutoPostBack="true" OnSelectedIndexChanged="DropDownList7_SelectedIndexChanged" /><br />
    <asp:Label ID="Label2" runat="server" Text="Label"></asp:Label>
    <aspext:CascadingDropDown ID="CascadingDropDown3" runat="server" TargetControlID="DropDownList7" Category="Make" LoadingText="[Loading makes...]" ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContents" />

    <br />
    
    ContextKey: <asp:DropDownList ID="contextKeyDropDown" runat="server" Width="170" /><br />
    <aspext:CascadingDropDown ID="contextKeyExtender" runat="server"
        TargetControlID="contextKeyDropDown"
        Category="Make"
        ServiceMethod="GetDropDownContentsWithContext"
        ContextKey="Context..." />

    <br />

    Default value: <asp:DropDownList ID="DropDownList8" runat="server" Width="170" /> <br />
    <asp:Label ID="Label3" runat="server" Text="Label"></asp:Label>
    <aspext:CascadingDropDown ID="CascadingDropDown4" runat="server" TargetControlID="DropDownList8" Category="Make" PromptText="Please select a make" LoadingText="[Loading makes...]" ServiceMethod="GetDropDownContents_PageMethod" />
    <br />
    <br />
    &nbsp;Cascading Defaults (* indicates default):<br />
    Make:<asp:DropDownList ID="cascadingDefaultMakeDropDown" runat="server" Width="170" /><br />
    Model:<asp:DropDownList ID="cascadingDefaultModelDropDown" runat="server" Width="170" /><br />
    Color:
    <asp:DropDownList ID="cascadingDefaultColorDropDown" runat="server" Width="170" /><br />
    <aspext:CascadingDropDown ID="CascadingDropDown2" runat="server"  TargetControlID="cascadingDefaultMakeDropDown" Category="Make"  PromptText="Please select a make"  ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContentsWithDefaults" />
    <aspext:CascadingDropDown ID="CascadingDropDown8" runat="server" TargetControlID="cascadingDefaultModelDropDown" Category="Model" PromptText="Please select a model" ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContentsWithDefaults" ParentControlID="cascadingDefaultMakeDropDown"/>
    <aspext:CascadingDropDown ID="CascadingDropDown9" runat="server" TargetControlID="cascadingDefaultColorDropDown" Category="Color" PromptText="Please select a color" ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContentsWithDefaults" ParentControlID="cascadingDefaultModelDropDown" />
    <asp:Label ID="Label6" runat="server" Text="Label"></asp:Label><br />

    <div style="display:none">
        <asp:DropDownList ID="DropDownListH" runat="server" />
        <aspext:CascadingDropDown ID="CascadingDropDownH" runat="server" TargetControlID="DropDownListH" Category="Make" PromptText="Please select a make" ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContents" SelectedValue="BMW (value)" />
    </div>

    <br /><br />

    <asp:DropDownList ID="DropDownListI" runat="server" />
    <aspext:CascadingDropDown ID="CascadingDropDownI" runat="server" TargetControlID="DropDownListI" Category="Make" PromptText="Please select a make" ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContents" SelectedValue="Acura" /> <br />
    <asp:Label ID="Label5" runat="server" Text="Label"></asp:Label>
    <br /><br />
    Auto Select First Item (no prompt):
    <asp:DropDownList ID="DropDownList9" runat="server" Width="170" /><br /><asp:Button runat="server" ID="Button2" Text="Button2" OnClick="Button2_Click" />
    <aspext:CascadingDropDown ID="CascadingDropDown10" runat="server" TargetControlID="DropDownList9" Category="Make" LoadingText="[Loading makes...]" ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContents" />
    <asp:Label ID="Label7" runat="server" Text="Label"></asp:Label>

    <br />
    <br />
    Empty Text & Value:<br />
    Make:<asp:DropDownList ID="emptyTextMakeDropDown" runat="server" Width="170" /><br />
    Model:<asp:DropDownList ID="emptyTextModelDropDown" runat="server" Width="170" /><br />
    Color:<asp:DropDownList ID="emptyTextColorDropDown" runat="server" Width="170" /><br />
    <aspext:CascadingDropDown ID="CascadingDropDown13" runat="server"  TargetControlID="emptyTextMakeDropDown" Category="Make"  PromptText="Please select a make"  ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContentsWithDefaults" LoadingText="Loading..." EmptyText="No choices available"  EmptyValue="-1" PromptValue="-2" />
    <aspext:CascadingDropDown ID="CascadingDropDown14" runat="server" TargetControlID="emptyTextModelDropDown" Category="Model" PromptText="Please select a model" ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContentsWithDefaults" ParentControlID="emptyTextMakeDropDown" LoadingText="Loading..." EmptyText="No choices available" EmptyValue="-1" PromptValue="-2" />
    <aspext:CascadingDropDown ID="CascadingDropDown15" runat="server" TargetControlID="emptyTextColorDropDown" Category="Color" PromptText="Please select a color" ServicePath="CarsService.asmx" ServiceMethod="GetDropDownContentsWithDefaults" ParentControlID="emptyTextModelDropDown" LoadingText="Loading..." EmptyText="No choices available" EmptyValue="-1" PromptValue="-2"  />

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.CascadingDropDownBehavior'];

        // Test Harness
        var testHarness = null;

        // Controls in the test page
        var drop1 = null;
        var drop2 = null;
        var drop3 = null;
        var drop3b = null;
        var drop4 = null;
        var drop5 = null;
        var drop6 = null;
        var drop7 = null;
        var dropContext = null;
        var drop8 = null;
        var drop9 = null;
        var dropH = null;
        var dropI = null;
        var btn = null;
        var btn2 = null;
        var label = null;
        var label2 = null;
        var label3 = null;
        var label4 = null;
        var label5 = null;
        var label7 = null;
        var emptyTextMakeDropDown = null;
        var emptyTextModelDropDown = null;
        var emptyTextColorDropDown = null;

        // Check if the supplied list of drop downs are enabled
        function checkLoaded() {
            var args = arguments;
            return function() {
                for (var i = 0; i < args.length; i++) {
                    if (args[i].disabled) {
                        return false;
                    }
                }
                return true;
            }
        }

        // Ensure the dropdown is properly enabled
        function checkEnabled(dropdown)
        {
            testHarness.assertTrue(!dropdown.disabled, "Drop down '" + dropdown.id + "' should be enabled");
        }

        // Ensure the dropdown is disabled
        function checkDisabled(dropdown)
        {
            testHarness.assertTrue(dropdown.disabled, "Drop down '" + dropdown.id + "' should be disabled");
        }

        // Ensure the dropdown contains the values
        // specified by the rest of the argument list
        function checkContainsValues(dropdown)
        {
            testHarness.assertEqual(dropdown.options.length, arguments.length - 1, "Drop down '" + dropdown.id + "' does not have exactly " + (arguments.length - 1) + " options, it has " + dropdown.options.length);
            if (dropdown.options.length == arguments.length - 1)
            {
                for (i = 1; i < arguments.length; i++)
                {
                    testHarness.assertEqual(dropdown.options[i - 1].value, arguments[i], "Drop down '" + dropdown.id + "'s option " + (i - 1) + " has value '" + dropdown.options[i - 1].value + "' instead of expected value '" + arguments[i] + "'");
                }
            }
        }

        function checkSelected(dropdown, val) {
            testHarness.assertTrue(dropdown.selectedIndex > 0, "Drop down '" + dropdown.id + "' should should have value at index > 0 selected");
            testHarness.assertEqual(dropdown.value, val, "Drop down '" + dropdown.id + "' should should have value '" + val + "' selected, it has '" + dropdown.value + "'");
        }

        function checkLabel4Empty() {
            testHarness.assertEqual(label4.innerHTML, ",,,");
        }

        // Set the selected index of a drop down and
        // force the onChange event to be fired
        function setSelectedIndex(dropdown, index)
        {
            return function() {
                dropdown.selectedIndex = index;
                testHarness.fireEvent(dropdown, 'onchange');
            };
        }

        // Test the initial state
        function testInitialState()
        {
            checkEnabled(drop1);
            checkContainsValues(drop1, 'PromptValue', 'Acura', 'Audi (value)', 'BMW (value)');
            checkDisabled(drop2);
            checkContainsValues(drop2, '');
            checkDisabled(drop3);
            checkContainsValues(drop3, '');
            checkDisabled(drop3b);
            checkContainsValues(drop3b, '');
        }

        // Ensure the last dropdowns respond after a selection in the first
        function testValuesAfterFirstSelected()
        {
            testHarness.assertEqual(drop1.selectedIndex, 3, "First drop down does not have selected index 3");
            checkEnabled(drop1);
            checkContainsValues(drop1, 'PromptValue', 'Acura', 'Audi (value)', 'BMW (value)');
            checkEnabled(drop2);
            checkContainsValues(drop2, '', '3 series (value)', '5 series (value)', '7 series (value)');
            checkDisabled(drop3);
            checkContainsValues(drop3, '');
            checkDisabled(drop3b);
            checkContainsValues(drop3b, '');
        }

        // Ensure the last dropdown responds after a selection in the second
        function testValuesAfterSecondSelected()
        {
            testHarness.assertEqual(drop1.selectedIndex, 3, "First drop down does not have selected index 3");
            checkEnabled(drop1);
            checkContainsValues(drop1, 'PromptValue', 'Acura', 'Audi (value)', 'BMW (value)');
            testHarness.assertEqual(drop2.selectedIndex, 2, "Second drop down does not have selected index 2");
            checkEnabled(drop2);
            checkContainsValues(drop2, '', '3 series (value)', '5 series (value)', '7 series (value)');
            checkEnabled(drop3);
            checkContainsValues(drop3, '', 'Yellow (value)', 'Banana (value)');
            checkSelected(drop3, 'Banana (value)');
            checkEnabled(drop3b);
            checkContainsValues(drop3b, '', 'Yellow (value)', 'Banana (value)');
            checkSelected(drop3b, 'Banana (value)');
        }

        function testSelectedValues() {
            testHarness.assertEqual(drop4.selectedIndex, 3, "Selected Make should be BMW");
            testHarness.assertEqual(drop5.selectedIndex, 1, "Selected Model should be 3-Series");
            testHarness.assertEqual(drop6.selectedIndex, 3, "Selected Make should be Racing Blue");
        }

        // Run the tests
        function registerTests(harness)
        {
            testHarness = harness;

            // Get the controls on the page
            drop1 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList1');
            drop2 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList2');
            drop3 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList3');
            drop3b = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList3b');
            btn = testHarness.getElement('ctl00_ContentPlaceHolder1_Button1');
            label = testHarness.getElement('ctl00_ContentPlaceHolder1_Label1');
            drop4 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList4');
            drop5 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList5');
            drop6 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList6');
            drop7 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList7');
            label2 = testHarness.getElement('ctl00_ContentPlaceHolder1_Label2');
            dropContext = testHarness.getElement('ctl00_ContentPlaceHolder1_contextKeyDropDown');
            drop8 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList8');
            label3 = testHarness.getElement('ctl00_ContentPlaceHolder1_Label3');
            label4 = testHarness.getElement('ctl00_ContentPlaceHolder1_Label4');
            label5 = testHarness.getElement('ctl00_ContentPlaceHolder1_Label5');
            dropH = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownListH');
            dropI = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownListI');
            drop9 = testHarness.getElement('ctl00_ContentPlaceHolder1_DropDownList9');
            label7 = testHarness.getElement('ctl00_ContentPlaceHolder1_Label7');
            btn2 = testHarness.getElement('ctl00_ContentPlaceHolder1_Button2');
                        
            emptyTextMakeDropDown = testHarness.getElement('ctl00_ContentPlaceHolder1_emptyTextMakeDropDown');
            emptyTextModelDropDown = testHarness.getElement('ctl00_ContentPlaceHolder1_emptyTextModelDropDown');
            emptyTextColorDropDown = testHarness.getElement('ctl00_ContentPlaceHolder1_emptyTextColorDropDown'); 

            var empty = function() {};

            // Test the initial values
            var test = testHarness.addTest('Initial Values');
            test.addStep(empty, checkLoaded(drop1, drop4, drop5, drop6));
            test.addStep(testInitialState);
            test.addStep(testSelectedValues);

            // Select from first level
            var test = testHarness.addTest('Select from first level');
            test.addStep(empty, checkLoaded(drop1, drop4, drop5, drop6));
            test.addStep(testInitialState);
            test.addStep(setSelectedIndex(drop1, 3), checkLoaded(drop1, drop2), testValuesAfterFirstSelected);

            // Values preserved on postback
            var test = testHarness.addTest('Values preserved on PostBack');
            test.addStep(empty, checkLoaded(drop1, drop4, drop5, drop6));
            test.addStep(testInitialState);
            test.addStep(testSelectedValues);
            test.addStep(setSelectedIndex(drop1, 3), checkLoaded(drop1, drop2), testValuesAfterFirstSelected);
            test.addPostBack(btn);
            test.addStep(empty, checkLoaded(drop1, drop2, drop4, drop5, drop6));
            test.addStep(testValuesAfterFirstSelected);
            test.addStep(function() { testHarness.assertEqual(label.innerHTML, 'SelectedIndexChanged', 'SelectedIndexChanged did not fire'); });

            // Select from second level
            var test = testHarness.addTest('Select from second level');
            test.addStep(empty, checkLoaded(drop1, drop4, drop5, drop6));
            test.addStep(testInitialState);
            test.addStep(testSelectedValues);
            test.addStep(setSelectedIndex(drop1, 3), checkLoaded(drop1, drop2), testValuesAfterFirstSelected);
            test.addStep(setSelectedIndex(drop2, 2), checkLoaded(drop1, drop2, drop3, drop3b), testValuesAfterSecondSelected);

            // Clear second level
            var test = testHarness.addTest('Clear second level');
            test.addStep(empty, checkLoaded(drop1, drop4, drop5, drop6));
            test.addStep(testInitialState);
            test.addStep(testSelectedValues);
            test.addStep(setSelectedIndex(drop1, 3), checkLoaded(drop1, drop2), testValuesAfterFirstSelected);
            test.addStep(setSelectedIndex(drop2, 2), checkLoaded(drop1, drop2, drop3, drop3b), testValuesAfterSecondSelected);
            test.addStep(setSelectedIndex(drop2, 0), function() { return !drop1.disabled && !drop2.disabled && drop3.disabled && drop3b.disabled; }, testValuesAfterFirstSelected);

            // Test default value and .Text
            var test = testHarness.addTest('Test default value and .Text');
            test.addStep(empty, checkLoaded(drop8));
            test.addStep(testInitialState);
            test.addPostBack(btn);
            test.addStep(function() { testHarness.assertEqual(label3.innerHTML, "Audi (value):Audi (value):Audi", "Default value not handled correctly"); });

            // Test untouched submit
            var test = testHarness.addTest('Test untouched submit');
            test.addStep(empty, checkLoaded(drop8));
            test.addPostBack(btn);
            test.addStep(function() { testHarness.assertEqual(label3.innerHTML, "Audi (value):Audi (value):Audi", "Values not preserved correctly"); });
            test.addPostBack(btn);
            test.addStep(function() { testHarness.assertEqual(label3.innerHTML, "Audi (value):Audi (value):Audi", "Values not preserved correctly"); });

            // Test prompt text selection handling
            var test = testHarness.addTest('Test prompt text selection handling');
            test.addStep(empty, checkLoaded(drop1));
            test.addStep(checkLabel4Empty);
            test.addPostBack(btn);
            test.addStep(empty, checkLoaded(drop1));
            test.addStep(checkLabel4Empty);
            test.addStep(setSelectedIndex(drop1, 1));
            test.addStep(setSelectedIndex(drop1, 0));
            test.addPostBack(btn);
            test.addStep(empty, checkLoaded(drop1));
            test.addStep(checkLabel4Empty);

            // Test SelectedValue reset
            var test = testHarness.addTest('Test SelectedValue reset');
            test.addStep(empty, checkLoaded(drop1, drop4, drop5, drop6));
            test.addStep(setSelectedIndex(drop1, 3), checkLoaded(drop1, drop2), testValuesAfterFirstSelected);
            test.addStep(setSelectedIndex(drop2, 2), checkLoaded(drop1, drop2, drop3, drop3b), testValuesAfterSecondSelected);
            test.addStep(setSelectedIndex(drop1, 0), function() { return !drop1.disabled && drop2.disabled && drop3.disabled && drop3b.disabled; });
            test.addPostBack(btn);
            test.addStep(checkLabel4Empty);

            // Test IE6 hidden SELECT workaround
            var test = testHarness.addTest('Test IE6 hidden SELECT workaround');
            test.addStep(empty, checkLoaded(dropH));
            test.addStep(function() { testHarness.assertEqual(3, dropH.selectedIndex, "SelectedValue not set properly") });

            // Test untouched submit when SelectedValue set
            var test = testHarness.addTest('Test untouched submit when SelectedValue set');
            test.addStep(empty, checkLoaded(dropI));
            test.addStep(function() { testHarness.assertEqual(label5.innerHTML, "Acura", "Value not set correctly"); });
            test.addPostBack(btn);
            test.addStep(empty, checkLoaded(dropI));
            test.addStep(function() { testHarness.assertEqual(label5.innerHTML, "Acura", "Value not set correctly"); });
            
            // Test ContextKey
            var test = testHarness.addTest('Context Key');
            test.addStep(empty, function() { try { checkContainsValues(dropContext, 'Context...'); return true; } catch(ex) { return false; } });

            // Test LoadingText without PromptText
            var test = testHarness.addTest('Test LoadingText without PromptText');
            test.addStep(empty, checkLoaded(drop7));

            // Test first value loaded without PromptText
            var test = testHarness.addTest('Test first value loaded without PromptText');
            test.addStep(empty, checkLoaded(drop9));
            test.addPostBack(btn2);
            test.addStep(function() { testHarness.assertNotEqual(label7.innerHTML, "ERROR", "Value not set correctly"); });
            
            // Test AutoPostBack
            // var test = testHarness.addTest('Test AutoPostBack');
            // test.addStep(empty, checkLoaded(drop7));
            // test.addStep(setSelectedIndex(drop7, 2));
            // TODO: Validate label2.innerHTML==SelectedIndexChanged (doesn't seem easy to do because of the nature of the AutoPostBack)

            // Test PromptValue
            var test = testHarness.addTest('Test PromptValue');
            test.addStep(empty, checkLoaded(drop1));
            test.addStep(function() { testHarness.assertEqual(0, drop1.selectedIndex, "selectedIndex not set properly: " + drop1.selectedIndex) } );
            test.addStep(function() { testHarness.assertEqual("PromptValue", drop1.value, "selectedValue not set properly: " + drop1.value) } );

            // Test EmptyText/EmptyValue
            var test = testHarness.addTest('Test EmptyText/EmptyValue');
            test.addStep(empty, checkLoaded(emptyTextMakeDropDown, emptyTextModelDropDown));
            test.addStep(function() { checkSelected(emptyTextMakeDropDown, 'Incomplete Make') } );
            test.addStep(function() { checkSelected(emptyTextModelDropDown, 'Incomplete Model') } );
            test.addStep(function() { testHarness.assertEqual(0, emptyTextColorDropDown.selectedIndex, "selectedIndex not set properly: " + emptyTextColorDropDown.selectedIndex) } );
            test.addStep(function() { testHarness.assertEqual('No choices available', emptyTextColorDropDown.options[0].text, "emptyTextColorDropDown.options[0].text not set properly: " + emptyTextColorDropDown.options[0].text) } );
            test.addStep(function() { testHarness.assertEqual("-1", emptyTextColorDropDown.value, "selectedValue not set properly: " + emptyTextColorDropDown.value) } );
        }
    </script>
</asp:Content>
