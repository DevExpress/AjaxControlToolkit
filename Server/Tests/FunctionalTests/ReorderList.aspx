<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReorderList.aspx.cs" Inherits="ReorderList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    
        .dragHandle {
            width:10px;
            height:10px;
            border:thin outset white;
            background-color:red;            
        }
        
        .processing {
            background-color:yellow;
            color:black;  
            border:thin inset white;          
        }
        
        .reorderCue {
            background-color:green;
            border:thin dotted black;
            height:25px;                       
        }
        
        LI {
            list-style:none;
        }
        
        
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <aspext:ToolkitScriptManager ID="sm1" runat="server"></aspext:ToolkitScriptManager>
        <div style="width:50%">
        <div style="display:none" id="databound_div">
     <aspext:ReorderList ID="ReorderList1" runat="server" DataSourceID="ObjectDataSource1" CallbackCssStyle="processing"
        DragHandleAlignment="Left" ItemInsertLocation="Beginning" DataKeyField="ItemID" SortOrderField="Priority">
        <ItemTemplate>
            <%# HttpUtility.HtmlEncode(Convert.ToString(Eval("ItemID"))) %>
        </ItemTemplate>
        <ReorderTemplate>
            <asp:Panel ID="Panel2" runat="server" CssClass="reorderCue">
            </asp:Panel>
        </ReorderTemplate>
        <DragHandleTemplate>
            <div class="dragHandle"></div>
        </DragHandleTemplate>
        <InsertItemTemplate>
        <!-- bottom border is workaround for IE7 Beta issue where bg doesn't render -->
        <div style="padding-left:25px; border-bottom:thin solid transparent;">
            <asp:Panel ID="panel1" runat="server" DefaultButton="Button1">
                <asp:TextBox ID="TextBox1" runat="server" Text='<%# Bind("Title") %>'></asp:TextBox>
                <asp:Button ID="Button1" runat="server" CommandName="Insert" Text="Add"></asp:Button>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="Please enter some text" ControlToValidate="TextBox1"></asp:RequiredFieldValidator>
            </asp:Panel>
            </div>
        </InsertItemTemplate>
    </aspext:ReorderList>
    </div>
    
    <div style="display:none" id="simple_div">
    <aspext:ReorderList id="ReorderList2" runat="server" CallbackCssStyle="processing"></aspext:ReorderList>
     </div>  
     <div style="display:none;" id="ilist_div">
     
    <aspext:ReorderList id="ReorderList3" runat="server" CallbackCssStyle="processing"></aspext:ReorderList>
    
    
    <div id="initial"></div>
    <div id="result"></div>
    </div>
    
     <div style="display:none" id="datatable_div">
    <aspext:ReorderList id="ReorderList4" SortOrderField="Sort" runat="server" CallbackCssStyle="processing">
        <ItemTemplate>
            <%# Eval("ID") %> - <%# Eval("Name") %> (<%# Eval("Sort") %>)
        </ItemTemplate>
    </aspext:ReorderList>
     </div> 
        
    <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" DeleteMethod="Delete"
        InsertMethod="Insert" OldValuesParameterFormatString="original_{0}" SelectMethod="Select"
        TypeName="SessionTodoXmlDataObject" UpdateMethod="Update">
        <DeleteParameters>
            <asp:Parameter Name="Original_ItemID" Type="Int32" />
        </DeleteParameters>
        <UpdateParameters>
            <asp:Parameter Name="Title" Type="String" />
            <asp:Parameter Name="Description" Type="String" />
            <asp:Parameter Name="Priority" Type="Int32" />
            <asp:Parameter Name="Original_ItemID" Type="Int32" />
        </UpdateParameters>
        <InsertParameters>
            <asp:Parameter Name="Title" Type="String" />
            <asp:Parameter Name="Description" Type="String" />
            <asp:Parameter Name="Priority" Type="Int32" />
        </InsertParameters>
    </asp:ObjectDataSource>
    </form>
    
    <script type="text/javascript">
        var typeDependencies = ['Sys.Extended.UI.DragDropWatcher', 'Sys.Extended.UI.DragDropList', 'Sys.Extended.UI.DraggableListItem' ];        
        var testHarness;        
        var isComplete;
        
        
        function onReorderComplete(sender, args) {
            isComplete = true;
        }
        
        function isReorderComplete() {
            return isComplete;
        }    
        
        
        
        function doReorder(behavior, oldIndex, newIndex, postback) {
           
            isComplete = false;
            var oldItem = behavior.getItem(oldIndex).innerHTML;        
            var destItem = behavior.getItem(newIndex).innerHTML;   
            var message = "Reorder " + oldItem + "->" + destItem + " failed. ";
            
            behavior.doReorder(oldIndex, newIndex, false);
            
            if (!postback) {
                //if (newIndex > oldIndex) {
                //  newIndex--;
                //}               
                
                var newItem = behavior.getItem(newIndex).innerHTML;           
                
                if (testHarness) {
                    testHarness.assertEqual(oldItem, newItem, message + "Result: " + oldItem + "->" + newItem );
                }
                else if (oldItem != newItem) {
                    alert(message);
                }
            }
        }
        
        function verifyItemAt(behavior, index, value) {
            var item = behavior.getItem(index).innerHTML;           
            testHarness.assertEqual(value.trim(), item.trim(), "Didn't find value '" + value + "' at index " + index + ", found '" + item + "'");
                
        }
        
        function doReorderDelay(behavior, oldIndex, newIndex) {
            return function doReorderDelay_Proxy(){doReorder(behavior, oldIndex, newIndex);};
        }
        
        function doSetup(behaviorId) {
            return function() {
                 behavior = testHarness.getObject(behaviorId);
                behavior.add_reorderComplete(onReorderComplete);
             }
        }       
        
        
        // Register the tests
        function registerTests(harness) {
            testHarness = harness;
            
            var test = testHarness.addTest('Reorder Normal');
            test.addStep(doSetup("ReorderList1_dItemEx"));
            test.addStep(function(){testHarness.getElement("databound_div").style.display = "";});                      
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList1_dItemEx"), 0,4), isReorderComplete);                        
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList1_dItemEx"), 0,7), isReorderComplete);                        
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList1_dItemEx"), 3,6), isReorderComplete);                        
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList1_dItemEx"), 6,4), isReorderComplete);                        
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList1_dItemEx"), 6,7), isReorderComplete);                        
            
            
            test = testHarness.addTest('Reorder Abort');
            test.addStep(doSetup("ReorderList1_dItemEx"));
            test.addStep(function(){testHarness.getElement("databound_div").style.display = "";});                      
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList1_dItemEx"), 4, 4));            
                        
            test = testHarness.addTest('Reorder End');
            test.addStep(doSetup("ReorderList1_dItemEx"));
            test.addStep(function(){testHarness.getElement("databound_div").style.display = "";});                      
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList1_dItemEx"), 7, 5), isReorderComplete); 
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList1_dItemEx"), 7, 0), isReorderComplete);  
            
            
                       
            
            test = testHarness.addTest('Reorder Array');
            test.addStep(doSetup("ReorderList2_dItemEx"));
            test.addStep(function(){testHarness.getElement("simple_div").style.display = "";});                                  
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList2_dItemEx"), 2, 4), isReorderComplete); 
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList2_dItemEx"), 3, 0), isReorderComplete);                        
    
           
                        
            test = testHarness.addTest('Reorder IList');
            test.addStep(doSetup("ReorderList3_dItemEx")); 
            test.addStep(function(){testHarness.getElement("ilist_div").style.display = "";});                      
            
            test = testHarness.addTest('Reorder DataTable');
            test.addStep(doSetup("ReorderList4_dItemEx")); 
            test.addStep(function(){testHarness.getElement("datatable_div").style.display = "";});                                  
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList4_dItemEx"), 2, 4), isReorderComplete); 
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList4_dItemEx"), 3, 0), isReorderComplete);                        
    
            
            
            // this will cause a postback            
           // test.addStep(function(){alert("now");}, 3000);            
            test.addStep(doReorderDelay(testHarness.getObject("ReorderList3_dItemEx"), 0,1), 1000);            
//            test.addStep(function(){testHarness.getElement("ilist_div").style.display = "";});                                  
//            test.addStep(function(){verifyItemAt(behavior, 1, "Shawn, 3036 ");});
            
          
            
        }    
        
    
    
    </script>
    
  
</body>
</html>
