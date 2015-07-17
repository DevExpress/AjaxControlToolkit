<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="UpdatePanelAnimationTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.UpdatePanelAnimationTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    TextBoxWatermark
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:UpdatePanel ID="TestUpdatePanel" runat="server">
        <ContentTemplate>
            <asp:Label ID="lblUpdate" runat="server" Text="1" />
        </ContentTemplate>
        <Triggers>
            <asp:AsyncPostBackTrigger ControlID="btnTrigger" EventName="Click" />
        </Triggers>
    </asp:UpdatePanel>

    <asp:UpdatePanel ID="AnotherUpdatePanel" runat="server">
        <Triggers>
            <asp:AsyncPostBackTrigger ControlID="btnNonTrigger" EventName="Click" />
        </Triggers>
    </asp:UpdatePanel>

    <asp:Button ID="btnTrigger" runat="server" Text="Update" OnClick="btnTrigger_Click" />
    <asp:Button ID="btnNonTrigger" runat="server" Text="Click me" OnClick="btnNonTrigger_Click" />
        
    <act:UpdatePanelAnimationExtender ID="TargetExtender" runat="server" TargetControlID="TestUpdatePanel" AlwaysFinishOnUpdatingAnimation="true" BehaviorID="animation">
    </act:UpdatePanelAnimationExtender>

    <script>
        describe("UpdatePanelAnimation", function() {

            var BUTTON_CLIENT_ID = "<%= btnNonTrigger.ClientID %>";

            describe("Postback", function() {

                beforeEach(function() {
                    this.extender = $find("animation");
                    spyOn(this.extender._onUpdating.__proto__, 'play');
                });

                it("update by trigger", function() {
                    $("#" + BUTTON_CLIENT_ID).click();
                    expect(this.extender._onUpdating.__proto__.play).not.toHaveBeenCalled();
                });
            });
        });
    </script>

</asp:Content>
