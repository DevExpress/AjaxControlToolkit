<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Tabs.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.Tabs.Tabs" %>
<asp:Content ContentPlaceHolderID="Script" runat="server">

    <script type="text/javascript">

//        module("Initial State");
//        asyncTest("Initial State", function () {
//            resetTestFrame(function () {
//                start();
//            });
//        });

        module("Scrolling");
        test("Scroll position in Chrome", function () {
            var container = $find("TabContainer1");
            var before = $testFrame("#BeforeTabs")[0];
            var panel1 = $find("TabPanel1");
            var panel2 = $find("TabPanel2");
            before.innerHTML = new Array(50).join("<div>c</div>");
            panel1.get_element().innerHTML = "<ol>" + new Array(100).join("<li>a</li>") + "</ol>";
            panel2.get_element().innerHTML = "<ol>" + new Array(100).join("<li>b</li>") + "</ol>";
            var win = testFrameWindow();
            win.scrollTo(0, 1500);
            var offset = win.pageYOffset;
            container.set_activeTabIndex(1);
            ok(offset == win.pageYOffset, "scroll position changed after tab index change");
        });
        
    </script>

</asp:Content>
