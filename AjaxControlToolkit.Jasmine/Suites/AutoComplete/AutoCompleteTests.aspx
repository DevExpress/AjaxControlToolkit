
<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="AutoCompleteTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.AutoCompleteTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    AutoComplete
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:TextBox
        runat="server"
        id="TestInput"
        AutoPostBack="true"/>
    <act:AutoCompleteExtender  
        runat="server" 
        ID="TestExtender" 
        MinimumPrefixLength="0"
        TargetControlID="TestInput" 
        ServicePath="TestWebService.asmx" 
        ServiceMethod="GetSampleData"
        CompletionInterval="0" />

    <script>
        describe("AutoComplete", function() {
            var TEXTBOX_CLIENT_ID = "<%= TestInput.ClientID %>";
            var AUTOCOMPLETE_CLIENT_ID = "<%= TestExtender.ClientID %>";

            it("does not close completion list", function (done) {
                var textbox = $("#" + TEXTBOX_CLIENT_ID);
                textbox.focus();
                var firstClick = createMouseEvent("click", textbox[0]);
                textbox[0].dispatchEvent(firstClick);
                var completionList = $("#" + AUTOCOMPLETE_CLIENT_ID + "_completionListElem");

                setTimeout(function() {
                    expect(completionList.is(":visible")).toBe(true);
                    done();
                }, 2000);
            });
        });
    </script>
</asp:Content>
