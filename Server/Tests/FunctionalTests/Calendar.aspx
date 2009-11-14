<%@ Page 
    Language="C#" 
    MasterPageFile="~/Default.master" 
    Title="Automated Calendar" 
    CodeFile="Calendar.aspx.cs" 
    Inherits="Automated_Calendar"
    Culture="hi-in" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <!-- harness -->
    <asp:TextBox runat="server" ID="Text" />
    <aspext:CalendarExtender runat="Server" BehaviorID="Calendar" TargetControlID="Text" />
    <asp:Button runat="server" ID="Button" OnClientClick="return false;" />
    <script type="text/javascript">

        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.CalendarBehavior'];
        
        function registerTests(harness) {
            var text = harness.getElement('ctl00_ContentPlaceHolder1_Text');
            var calendar = harness.getObject('Calendar');
            var button = harness.getElement('ctl00_ContentPlaceHolder1_Button');
            var test = null;
            
            test = harness.addTest('Show on focus');
            test.addStep(function() { 
                harness.fireEvent(text, "onfocus");
                harness.assertTrue(calendar._isOpen);
            });

            test = harness.addTest('Hide on blur');
            test.addStep(function() { 
                harness.fireEvent(text, "onfocus");
                harness.fireEvent(text, "onblur");
            }, 100, function() { return !calendar._isOpen; });
            
            test = harness.addTest('Parse date');
            test.addStep(function() {
                text.value = '15-1-2000';
                harness.fireEvent(text, "onfocus");
                harness.fireEvent(text, 'onchange');
                harness.assertEqual('15-1-2000', calendar.get_selectedDate().format("d-M-yyyy"));
            });
            
//            test = harness.addTest('Pick date');
//            test.addStep(function() {
//                calendar.set_visibleDate(new Date('1/1/2000'));
//                calendar.show();
//                harness.fireEvent(calendar._daysBody.rows[0].cells[6], "click");
//                harness.assertEqual('1/1/2000', text.value);
//            });

            test = harness.addTest('set_firstDayOfWeek typo');
            test.addStep(function() {
                calendar.set_firstDayOfWeek(Sys.Extended.UI.FirstDayOfWeek.Default);
            });
        }

    </script>

</asp:Content>

