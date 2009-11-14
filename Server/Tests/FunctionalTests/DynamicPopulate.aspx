<%@ Page Language="C#" MasterPageFile="~/Default.master" AutoEventWireup="true" CodeFile="DynamicPopulate.aspx.cs" Inherits="DynamicPopulate" Title="Untitled Page" %>



<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div>

       
    <asp:Label ID="Label1" runat="server" Text="Label">Page Method Update:</asp:Label>
    <asp:Panel ID="Panel1" runat="server" BackColor="silver">
    </asp:Panel>
    
    <br />
    <br />
        
    <asp:Label ID="Label2" runat="server" Text="Label">Script Method Update:</asp:Label>
    <asp:Panel ID="Panel2" runat="server" BackColor="Silver">
    </asp:Panel>
    
    
    <aspext:DynamicPopulateExtender BehaviorID="dp1" runat="server" TargetControlID="Panel1" PopulateTriggerControlID="Label1" ServicePath="ToolkitTestService.asmx" ServiceMethod="GetContextKey" ContextKey="Web Service Success" />
    <aspext:DynamicPopulateExtender BehaviorID="dp2" runat="server" TargetControlID="Panel2" PopulateTriggerControlID="Label2" CustomScript="'Script Success';" />
       
    </div>
    
     <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.DynamicPopulateBehavior'];
        
    
        // Test Harness
        var testHarness = null;
        var panel1, panel2, dp1, dp2;
        
        var webServiceResult, scriptResult, customResult;
        
        function fireUpdate(targetId) {
            var target = testHarness.getElement(targetId);            
            testHarness.fireEvent(target, 'onclick');                        
        }
        
        function webServiceComplete() {         
            return webServiceResult;
        }
        
        function scriptComplete() {
            return scriptResult;
        }
        
        function customComplete() {
            
            return customResult;
        }
        
        function webServiceSuccess() {            
            testHarness.assertEqual(webServiceResult, "Web Service Success", "Web service call failed: " + webServiceResult);
            return true;
        }
        
        function scriptSuccess() {            
            testHarness.assertEqual(scriptResult, "Script Success", "Script call failed: " + scriptResult);
            return true;
        }
        
        function customSuccess() {   
            
            testHarness.assertEqual(customResult, "Custom Success", "DOM call failed: " + customResult);
            return true;
        }
        
        function onWebServicePopulated(s, e) {
            webServiceResult = panel1.innerHTML;
        }
        
        function onScriptPopulated(s, e) {
            scriptResult = panel2.innerHTML;
            
        }
        
        function onCustomPopulated(s, e) {
            customResult = panel1.innerHTML;            
        }
        
        function testCustom() {
            dp1.remove_populated(onWebServicePopulated);
            dp1.add_populated(onCustomPopulated);
            dp1.populate("Custom Fail 1");
            dp1.populate("Custom Fail 2");
            dp1.populate("Custom Success");
        }
    
        

        // Register the tests
        function registerTests(harness) {
            
            testHarness = harness;

            // Get the controls on the page
            panel1 = testHarness.getElement('ctl00_ContentPlaceHolder1_Panel1');
            panel2 = testHarness.getElement('ctl00_ContentPlaceHolder1_Panel2');
            
            dp1 = testHarness.getObject('dp1');                 
            dp1.add_populated(onWebServicePopulated);
            
                   
            dp2 = testHarness.getObject('dp2');
            dp2.add_populated(onScriptPopulated);
            
            
            var test = testHarness.addTest('Test Page Method');
            test.addStep(function(){fireUpdate('ctl00_ContentPlaceHolder1_Label1');}, webServiceComplete, webServiceSuccess);
            
            var test = testHarness.addTest('Test Script Method');
            test.addStep(function(){fireUpdate('ctl00_ContentPlaceHolder1_Label2');}, scriptComplete, scriptSuccess);            
            
            var test = testHarness.addTest('Test Custom');
            test.addStep(testCustom, customComplete, customSuccess);            
        }
     </script>
</asp:Content>

