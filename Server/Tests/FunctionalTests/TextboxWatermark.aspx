<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    CodeFile="TextBoxWatermark.aspx.cs"
    Inherits="Automated_TextBoxWatermark"
    Title="TextBoxWatermark Tests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <asp:TextBox ID="TextBox1" runat="server" CssClass="unwatermarked"></asp:TextBox>
    <aspext:TextBoxWatermarkExtender ID="TextBoxWatermarkExtender1" runat="server" TargetControlID="TextBox1" WatermarkCssClass="watermarked" WatermarkText="watermark" />
    <asp:TextBox ID="TextBox2" runat="server" CssClass="unwatermarked" MaxLength="3"></asp:TextBox>
    <aspext:TextBoxWatermarkExtender ID="TextBoxWatermarkExtender2" runat="server" TargetControlID="TextBox2" WatermarkCssClass="watermarked" WatermarkText="watermark" />
    <asp:Button ID="Button1" runat="server" Text="Button" OnClick="Button1_Click" />
    <asp:Label ID="Label1" runat="server" Text=":Label:" />

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.TextBoxWatermarkBehavior'];

        // Test Harness
        var testHarness = null;

        // Controls in the page
        var tb1 = null;
        var tb2 = null;
        var tbb1 = null;
        var btn = null;
        var lbl = null;

        // Variables
        var watermarkText = 'watermark';
        var watermarkCssClass = 'watermarked';

        // Ensure the textbox is in its empty state
        function checkEmptyState() {
            testHarness.assertEqual(watermarkCssClass, tb1.className, "TextBox1's class name should be '" + watermarkCssClass + "' instead of '" + tb1.className + "'");
            testHarness.assertEqual(watermarkText, tb1.value, "TextBox1's value should be '" + watermarkText + "' instead of '" + tb1.value + "'");
            testHarness.assertEqual('', tbb1.get_Text(), "TextBox1's behavior text should be '' instead of '" + tbb1.get_Text() + "'");
        }

        // Ensure the textbox is in its full state
        function checkFullState() {
            testHarness.assertEqual('unwatermarked', tb1.className, "TextBox1's class name should be 'unwatermarked' instead of '" + tb1.className + "'");
            testHarness.assertEqual('full', tb1.value, "TextBox1's value should be 'full' instead of '" + tb1.value + "'");
            testHarness.assertEqual('full', tbb1.get_Text(), "TextBox1's behavior text should be 'full' instead of '" + tbb1.get_Text() + "'");
        }

        // Ensure the label has the right text
        function checkLabelContents(text) {
            testHarness.assertEqual(text, lbl.innerHTML, "Label should be '"+text+"' instead of '"+lbl.innerHTML+"'.");
        }

        // Test the initial state of the control
        function testInitialState() {
            checkEmptyState();
            checkLabelContents(":Label:");
        }

        // Test focusing the control
        function testFocus() {
            testHarness.fireEvent(tb1, 'onfocus');
            testHarness.assertEqual('unwatermarked', tb1.className, "TextBox1's class name should be 'unwatermarked' instead of '" + tb1.className + "'");
            testHarness.assertEqual('', tb1.value, "TextBox1's value should be empty instead of '" + tb1.value + "'");
        }

        // Test removing focus from the control
        function testEmptyBlur() {
            testHarness.fireEvent(tb1, 'onblur');
            checkEmptyState();
        }

        // Test removing focus from a filled control
        function testFullBlur() {
            testHarness.fireEvent(tb1, 'onfocus');
            tb1.value = 'full';
            testHarness.fireEvent(tb1, 'onblur');
            checkFullState();
        }

        // Test removing focus from an empty control
        function testEmptiedBlur() {
            testHarness.fireEvent(tb1, 'onfocus');
            tb1.value = '';
            testHarness.fireEvent(tb1, 'onblur');
            checkEmptyState();
        }

        // Register the tests
        function registerTests(harness)
        {
            testHarness = harness;

            // Get the controls from the page
            tb1 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox1');
            tb2 = testHarness.getElement('ctl00_ContentPlaceHolder1_TextBox2');
            tbb1 = testHarness.getObject('ctl00_ContentPlaceHolder1_TextBoxWatermarkExtender1');
            btn = testHarness.getElement('ctl00_ContentPlaceHolder1_Button1');
            lbl = testHarness.getElement('ctl00_ContentPlaceHolder1_Label1');

            var test = testHarness.addTest('Initial');
            test.addStep(testInitialState);
            
            test = testHarness.addTest('Focus');
            test.addStep(testInitialState);
            test.addStep(testFocus);
            
            test = testHarness.addTest('Empty Blur');
            test.addStep(testInitialState);
            test.addStep(testFocus);
            test.addStep(testEmptyBlur);
            
            test = testHarness.addTest('Full Blur');
            test.addStep(testInitialState);
            test.addStep(testFocus);
            test.addStep(testEmptyBlur);
            test.addStep(testFullBlur);
            
            test = testHarness.addTest('Emptied Blur');
            test.addStep(testInitialState);
            test.addStep(testFocus);
            test.addStep(testEmptyBlur);
            test.addStep(testEmptiedBlur);
            
            test = testHarness.addTest('Empty Submit');
            test.addStep(testEmptiedBlur);
            test.addPostBack(btn);
            test.addStep(checkEmptyState);
            test.addStep(function() { checkLabelContents("::"); });
            
            test = testHarness.addTest('Full Submit');
            test.addStep(testFullBlur);
            test.addPostBack(btn);
            test.addStep(checkFullState);
            test.addStep(function() { checkLabelContents(":full:"); });
            
            test = testHarness.addTest('Text set methods');
            test.addStep(checkEmptyState);
            test.addStep(function() { tbb1.set_Text("full"); });
            test.addStep(checkFullState);
            test.addStep(function() { tbb1.set_Text(""); });
            test.addStep(checkEmptyState);
            
            test = testHarness.addTest('MaxLength');
            test.addStep(function() { testHarness.assertEqual('watermark', tb2.value,
                "TextBox2's value should be 'watermark' instead of '" + tb2.value + "'");});
            
            test = testHarness.addTest('Text property changes');
            test.addStep(checkEmptyState);
            test.addStep(function() { watermarkText = 'watermark2'; });
            test.addStep(function() { tbb1.set_WatermarkText(watermarkText); });
            test.addStep(checkEmptyState);
            test.addStep(function() { watermarkCssClass = 'watermarked2'; });
            test.addStep(function() { tbb1.set_WatermarkCssClass(watermarkCssClass); });
            test.addStep(checkEmptyState);
        }
    </script>
</asp:Content>
