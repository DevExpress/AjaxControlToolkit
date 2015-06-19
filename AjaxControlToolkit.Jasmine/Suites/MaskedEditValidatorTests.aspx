<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="MaskedEditValidatorTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.MaskedEditValidatorTests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TestSuiteName" runat="server">
    MaskedEditValidator
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="TestSuite" runat="server">
    <asp:TextBox runat="server" ID="TextBox1" ValidationGroup="TVG" Text="1111.11.11" />
    <act:MaskedEditExtender runat="server"
        ID="MaskedEditExtender1"
        TargetControlID="TextBox1"
        Mask="9999/99/99"
        MaskType="Date" 
        CultureName="en-US"/>
    <act:MaskedEditValidator runat="server"
        ID="MaskedEditValidator1"
        ControlExtender="MaskedEditExtender1"
        ControlToValidate="TextBox1"
        Display="Static"
        IsValidEmpty="true"
        InvalidValueMessage="FAIL"
        InvalidValueBlurredMessage="*"
        ValidationGroup="TVG" />

    <script>
        describe("MaskedEditValidator", function() {

            beforeEach(function() {
                this.target = document.getElementById("<%= TextBox1.ClientID %>");
                this.validator = $find("<%= MaskedEditValidator1.ClientID %>");
            });

            it("validates long date format", function() {
                expect(Page_ClientValidate("TVG")).toBeTruthy();
            });
        });
    </script>

</asp:Content>
