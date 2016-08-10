<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="UpdatePanelAnimationTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.UpdatePanelAnimationTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    TextBoxWatermark
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <asp:UpdatePanel ID="TestUpdatePanel" runat="server" ChildrenAsTriggers="false" UpdateMode="Conditional">
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
        <Animations>
            <OnUpdating>
            <Parallel duration="0">
                <ScriptAction Script="onUpdating();" />
                </Parallel>
            </OnUpdating>
            <OnUpdated>
            <Parallel duration="0">
                <ScriptAction Script="onUpdated();" />
            </Parallel>
            </OnUpdated>
        </Animations>
    </act:UpdatePanelAnimationExtender>

    <asp:DropDownList
        ID="TestDropDownList"
        runat="server"
        AutoPostBack="True">
        <asp:ListItem>1</asp:ListItem>
        <asp:ListItem>2</asp:ListItem>
        <asp:ListItem>3</asp:ListItem>
    </asp:DropDownList>

    <asp:UpdatePanel
        ID="UpdatePanelWithButton"
        runat="server">
        <ContentTemplate>
          Content
          <asp:Button runat="server" Text="Button" />
        </ContentTemplate>
        <Triggers>
          <asp:AsyncPostBackTrigger ControlID="TestDropDownList" EventName="SelectedIndexChanged" />
        </Triggers>
    </asp:UpdatePanel>

    <act:UpdatePanelAnimationExtender
        ID="UpdatePanelWithButtonExtender"
        runat="server"
        TargetControlID="UpdatePanelWithButton"
        AlwaysFinishOnUpdatingAnimation="true">
        <Animations>
            <OnUpdating>
            <Parallel duration="0">
                <ScriptAction Script="onUpdating();" />
                </Parallel>
            </OnUpdating>
            <OnUpdated>
            <Parallel duration="0">
                <ScriptAction Script="onUpdated();" />
            </Parallel>
            </OnUpdated>
        </Animations>
    </act:UpdatePanelAnimationExtender>

    <asp:UpdatePanel ID="UpdatePanelWithChildrenAsTriggers" runat="server" ChildrenAsTriggers="true">
        <ContentTemplate>
            <asp:Button runat="server" Text="Button" ID="btnChildTrigger" />
        </ContentTemplate>
    </asp:UpdatePanel>

    <act:UpdatePanelAnimationExtender
        ID="UpdatePanelExtenderChildrenAsTriggers"
        runat="server"
        TargetControlID="UpdatePanelWithChildrenAsTriggers"
        AlwaysFinishOnUpdatingAnimation="true"
        BehaviorID="animationForChildrenTriggers">
        <Animations>
            <OnUpdating>
            <Parallel duration="0">
                <ScriptAction Script="onUpdating();" />
                </Parallel>
            </OnUpdating>
            <OnUpdated>
            <Parallel duration="0">
                <ScriptAction Script="onUpdated();" />
            </Parallel>
            </OnUpdated>
        </Animations>
    </act:UpdatePanelAnimationExtender>

    <asp:UpdatePanel ID="UpdatePanelWithChildrenAsTriggers2" runat="server" ChildrenAsTriggers="true">
        <ContentTemplate>
            <asp:Button runat="server" Text="Button" ID="btnChildTrigger2" />
        </ContentTemplate>
    </asp:UpdatePanel>

    <act:UpdatePanelAnimationExtender
        ID="UpdatePanelExtenderChildrenAsTriggers2"
        runat="server"
        TargetControlID="UpdatePanelWithChildrenAsTriggers2"
        AlwaysFinishOnUpdatingAnimation="true"
        ChildrenAsTriggers="true"
        BehaviorID="animationForChildrenTriggers2">
        <Animations>
            <OnUpdating>
            <Parallel duration="0">
                <ScriptAction Script="onUpdating();" />
                </Parallel>
            </OnUpdating>
            <OnUpdated>
            <Parallel duration="0">
                <ScriptAction Script="onUpdated();" />
            </Parallel>
            </OnUpdated>
        </Animations>
    </act:UpdatePanelAnimationExtender>

    <script>
        function onUpdating() {
        }

        function onUpdated() {
        }

        describe("UpdatePanelAnimation", function() {

            var BUTTON_TRIGGER_CLIENT_ID = "<%= btnTrigger.ClientID %>";
            var BUTTON_NON_TRIGGER_CLIENT_ID = "<%= btnNonTrigger.ClientID %>";
            var DROPDOWNLIST_CLIENT_ID = "<%= TestDropDownList.ClientID %>";
            var BUTTON_CHILD_TRIGGER_CLIENT_ID = "<%= btnChildTrigger.ClientID %>";
            var BUTTON_CHILD_TRIGGER2_CLIENT_ID = "<%= btnChildTrigger2.ClientID %>";
            var playSpy;
            var playSpyChildrenAsTriggers;

            describe("Postback", function() {

                beforeEach(function() {
                    this.extender = $find("animation");
                    this.extenderForChildrenTriggers = $find("animationForChildrenTriggers");
                    this.extenderForChildrenTriggers2 = $find("animationForChildrenTriggers2");
                    playSpy = spyOn(this.extender._onUpdating.__proto__, 'play');
                    spyOn(window, 'onUpdating');
                    spyOn(window, 'onUpdated');
                });

                it("is not updated by non-trigger", function() {
                    $("#" + BUTTON_NON_TRIGGER_CLIENT_ID).click();
                    expect(this.extender._onUpdating.__proto__.play).not.toHaveBeenCalled();
                });

                it("is calling onUpdating", function() {
                    $("#" + BUTTON_TRIGGER_CLIENT_ID).click();
                    expect(this.extender._onUpdating.__proto__.play).toHaveBeenCalled();
                });

                it("is calling onUpdated", function() {
                    $("#" + BUTTON_TRIGGER_CLIENT_ID).click();
                    expect(this.extender._onUpdated.__proto__.play).toHaveBeenCalled();
                });

                it("is updated by DropDownList", function (done) {
                    $("#" + DROPDOWNLIST_CLIENT_ID)
                        .val("2")
                        .trigger('change');
                    
                    waitFor(
                        function () {
                            return playSpy.calls.any();
                        }, done);
                });

                it("is not updated by child trigger", function () {
                    $("#" + BUTTON_CHILD_TRIGGER_CLIENT_ID).click();
                    expect(this.extenderForChildrenTriggers._onUpdated.__proto__.play).not.toHaveBeenCalled();
                });

                it("reacts to child trigger", function (done) {
                    $("#" + BUTTON_CHILD_TRIGGER2_CLIENT_ID).click();

                    waitFor(
                        function () {
                            return playSpy.calls.any();
                        }, done);
                });
            });
        });
    </script>

</asp:Content>