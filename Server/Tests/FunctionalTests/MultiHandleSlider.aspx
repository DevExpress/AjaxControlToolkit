<%@ Page Language="C#" 
         AutoEventWireup="true" 
         CodeFile="MultiHandleSlider.aspx.cs" 
         Inherits="Slider"
         MasterPageFile="~/Default.master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <table>
        <tr>
            <td>
                <asp:TextBox ID="slider1" runat="server"></asp:TextBox>
                <br /><br />
            </td>                       
        </tr>
        <tr>
            <td>
                <asp:TextBox ID="slider1_boundControl" runat="server" Text="0"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td>
                <asp:TextBox ID="slider2" runat="server"></asp:TextBox>
                <br /><br />
            </td>
        </tr>
        <tr>
            <td>
                <asp:TextBox ID="slider2_boundControl1" runat="server" Text="25"></asp:TextBox>
                <asp:TextBox ID="slider2_boundControl2" runat="server" Text="100"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td>
                <asp:Button ID="btnPostBack" runat="server" Text="Postback" />
            </td>
        </tr>
    </table>
    
    <aspext:MultiHandleSliderExtender ID="SliderExtender1" runat="server"
        TargetControlID="slider1"
        BoundControlID="slider1_boundControl"
        Decimals="0" />

    <aspext:MultiHandleSliderExtender ID="SliderExtender2" runat="server"
        TargetControlID="slider2"
        BehaviorID="SliderExtender2">
        <MultiHandleSliderTargets>
            <aspext:MultiHandleSliderTarget ControlID="slider2_boundControl1" />
            <aspext:MultiHandleSliderTarget ControlID="slider2_boundControl2" />
        </MultiHandleSliderTargets>                                
    </aspext:MultiHandleSliderExtender>
    
    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.MultiHandleSliderBehavior'];
    
        // Test Harness
        var testHarness = null;

        // Controls in the page
        var slider1 = null;
        var slider2 = null;
        var slider1_boundControl = null;
        var slider2_boundControl1 = null;
        var slider2_boundControl2 = null;
        var btn = null;
               
        // Helper methods
        function testInitialized() {
            return function() {
                return slider1.get_SliderInitialized();
            }
        }
        
        // Test methods
        
        function testSetValueFromBoundControl(){
            return function() {
                slider1_boundControl.value = 20;
                testHarness.assertTrue(20 == slider1.get_Value(), "Expected value of 20 but was " + slider1.get_Value());
            }
        }
        
        function testSetValuesOutOfRange(){
            return function() {
                // Maximum
                slider1_boundControl.value = 200;
                testHarness.fireEvent(slider1_boundControl, 'onchange');
                testHarness.assertTrue(slider1.get_maximum() == slider1.get_Value(), "Expected maximum value of " + slider1.get_maximum() + " but was " + slider1.get_Value());   
                
                // Minimum
                slider1_boundControl.value = -100;
                testHarness.fireEvent(slider1_boundControl, 'onchange');
                testHarness.assertTrue(slider1.get_minimum() == slider1.get_Value(), "Expected minimum value of " + slider1.get_minimum() + " but was " + slider1.get_Value());   
            }
        }
        
        function checkTextBox() {
            testHarness.assertEqual(parseFloat(slider1.get_Value()), parseFloat(slider1.get_element().value), 
                'Expected textbox value of ' + slider1.get_Value() + ' but was ' + slider1.get_element().value);
        }
        
        function checkBoundControl() {
            testHarness.assertEqual(parseFloat(slider1.get_Value()), parseFloat(slider1_boundControl.value), 
                'Expected bound control value of ' + slider1.get_Value() + ' but was ' + slider1_boundControl.value);
        }
        
        function testValueFromSlider(value) {
            return function() {
                slider1.set_Value(value);
                testHarness.assertTrue(slider1.get_Value() == value, "Value should be set to " + value + " but was " + slider1.get_Value());
                checkTextBox();
                checkBoundControl();
            };
        }
        
        function testValueFromSliderMulti(index, value) {
            return function() {
                slider2.setValue(index, value);
                testHarness.assertTrue(slider2.getValue(index) == value, "Value for handle " + index + " should be set to " + value + " but was " + slider2.getValue(index));
            };
        }
        
        function testValueAfterPostBack(value) {
            return function() {
                testHarness.assertEqual(parseFloat(slider1.get_Value()), parseFloat(value), 'Value after postback should be ' + value + ' instead of ' + slider1.get_Value());
            }
        }
        
        function testValueAfterPostBackMulti(index, value) {
            return function() {
                testHarness.assertEqual(parseFloat(slider2.getValue(index)), parseFloat(value), 'Value of handle ' + index + ' after postback should be ' + value + ' instead of ' + slider2.getValue(index));
            }
        }
        
        function testHandleCount() {
            return function() {
                testHarness.assertEqual(2, slider2._handles, 'Slider should have two handles, but is internally set as ' + slider2._handles);
            }
        }
        
        function testHandleCollision() {
            return function() {
                slider2_boundControl1.value = 20;
                testHarness.fireEvent(slider2_boundControl1, 'onchange');
                
                slider2_boundControl2.value = 10; // Can't be lower than the left handle
                testHarness.fireEvent(slider2_boundControl2, 'onchange');
                
                testHarness.assertEqual(parseFloat(slider2.getValue(1)), 20, "Right handle should be 20 but is " + slider2.getValue(1));
            }
        }
        
        function testSetInvalidValueFromBoundControl(){
            return function() {
                slider1_boundControl.value = "foo";
                testHarness.fireEvent(slider1_boundControl, 'onchange');
                testHarness.assertTrue(slider1.get_minimum() == slider1.get_Value(), "Expected value of " + slider1.get_minimum()+ " but was " + slider1.get_Value());
            }
        }
                               
        // Register the tests
        function registerTests(harness)
        {
            testHarness = harness;

            // Get the controls from the page
            
            slider1 = testHarness.getObject('ctl00_ContentPlaceHolder1_SliderExtender1');
            slider2 = testHarness.getObject('SliderExtender2'); // by behavior
            
            slider1_boundControl = testHarness.getElement('ctl00_ContentPlaceHolder1_slider1_boundControl');
            slider2_boundControl1 = testHarness.getElement('ctl00_ContentPlaceHolder1_slider2_boundControl1');
            slider2_boundControl2 = testHarness.getElement('ctl00_ContentPlaceHolder1_slider2_boundControl2');
            
            btn = testHarness.getElement('ctl00_ContentPlaceHolder1_btnPostBack');
            
            // Tests against the one-handled classic interface
            
            var test = testHarness.addTest('Initialize');
            test.addStep(Function.emptyMethod, testInitialized());
            
            test = testHarness.addTest('Classic slider interface: Set a value from the bound control');
            test.addStep(testSetValueFromBoundControl());
            
            test = testHarness.addTest('Classic slider interface: Set values out of minimum and maximum range');
            test.addStep(testSetValuesOutOfRange());
                     
            test = testHarness.addTest('Classic slider interface: Invalid value in bound control');
            test.addStep(Function.emptyMethod, testInitialized());
            test.addStep(testSetInvalidValueFromBoundControl());
            
            test = testHarness.addTest('Classic slider interface: Postback test');
            test.addStep(Function.emptyMethod, testInitialized());
            test.addStep(testValueFromSlider(80));
            test.addPostBack(btn);
            test.addStep(Function.emptyMethod, testInitialized());
            test.addStep(testValueAfterPostBack(80));
            
            // Tests against the multi-handled new interface
            
            test = testHarness.addTest('New slider interface: Verify internal handle count');
            test.addStep(Function.emptyMethod, testInitialized());
            test.addStep(testHandleCount());       
            
            test = testHarness.addTest('New slider interface: Set values of two handles');
            test.addStep(Function.emptyMethod, testInitialized());
            test.addStep(testValueFromSliderMulti(0, 25));
            test.addStep(testValueFromSliderMulti(1, 75));
            
            test = testHarness.addTest('New slider interface: Handle collision test');
            test.addStep(Function.emptyMethod, testInitialized());
            test.addStep(testHandleCollision());    
            
            test = testHarness.addTest('New slider interface: Postback test');
            test.addStep(Function.emptyMethod, testInitialized());
            test.addStep(testValueFromSliderMulti(0, 80));
            test.addStep(testValueFromSliderMulti(1, 90));
            test.addPostBack(btn);
            test.addStep(Function.emptyMethod, testInitialized());
            test.addStep(testValueAfterPostBackMulti(0, 80));        
            test.addStep(testValueAfterPostBackMulti(1, 90));            
        }
    </script>
    
</asp:Content>
