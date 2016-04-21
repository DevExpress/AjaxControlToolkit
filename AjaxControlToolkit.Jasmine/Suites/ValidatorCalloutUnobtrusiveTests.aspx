<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="ValidatorCalloutUnobtrusiveTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ValidatorCalloutUnobtrusiveTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    ValidatorCallout (unobtrusive validation)
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">
    <asp:TextBox runat="server"
        ID="TestTextBox">
    </asp:TextBox>

    <asp:RequiredFieldValidator runat="server"
        ID="TestRequiredFieldValidator"
        ControlToValidate="TestTextBox"
        ErrorMessage="<b>Required field missing</b> <br> Text required"
        Display="None">
    </asp:RequiredFieldValidator>
    <act:ValidatorCalloutExtender runat="server"
        ID="TargetExtender"
        TargetControlID="TestRequiredFieldValidator">
    </act:ValidatorCalloutExtender>

    <script>
        describe("ValidatorCallout", function() {

            var VALIDATOR_CALLOUT_EXTENDER_CLIENT_ID = "<%= TargetExtender.ClientID %>",
                REQUIRED_FIELD_VALIDATOR_ERROR_MESSAGE = "<%= TestRequiredFieldValidator.ErrorMessage %>";

            describe("Rendering", function() {
                beforeEach(function() {
                    this.extender = $find(VALIDATOR_CALLOUT_EXTENDER_CLIENT_ID);
                });

                it("shows validator", function() {
                    this.extender._onvalidate(Page_Validators[0]);
                    var $container = $("#" + VALIDATOR_CALLOUT_EXTENDER_CLIENT_ID + "_popupTable");
                    expect($container.is(":visible")).toBeTruthy();
                });
            });
        });
    </script>

</asp:Content>
