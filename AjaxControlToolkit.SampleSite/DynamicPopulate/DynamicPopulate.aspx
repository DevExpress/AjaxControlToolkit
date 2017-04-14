<%@ Page Title="DynamicPopulate Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="DynamicPopulate.aspx.cs" Inherits="DynamicPopulate_DynamicPopulate" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    DynamicPopulate Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <script type="text/javascript">
        function updateDateKey(value) {
            var behavior = $find('dp1');
            if(behavior) {
                behavior.populate(value);
            }
        }
        Sys.Application.add_load(function() { updateDateKey('G'); });
    </script>

    <p>
        <asp:Label ID="Label1" runat="server" Text="Label" CssClass="subheading">Time at the server:</asp:Label>
    </p>
    <p>Choose a date/time format:</p>
    <p>
        <label for="r0">
            <input type="radio" name="rbFormat" id="r0" value='G' onclick="updateDateKey(this.value);" checked="checked" />
            Normal
        </label>
        <br />
        <label for="r1">
            <input type="radio" name="rbFormat" id="r1" value='d' onclick="updateDateKey(this.value);" />
            Short Date
        </label>
        <br />
        <label for="r2">
            <input type="radio" name="rbFormat" id="r2" value='D' onclick="updateDateKey(this.value);" />
            Long Date
        </label>
        <br />
        <label for="r3">
            <input type="radio" name="rbFormat" id="r3" value='U' onclick="updateDateKey(this.value);" />
            UTC Date/Time
        </label>
        <br />
    </p>
    <br />
    <p>
        This time is dynamically formatted and returned as HTML from the server:
    </p>
    <asp:Panel ID="Panel1" runat="server" CssClass="dynamicPopulate_Normal" />
    <br />

    <ajaxToolkit:DynamicPopulateExtender ID="dp" BehaviorID="dp1" runat="server"
        TargetControlID="Panel1"
        ClearContentsDuringUpdate="true"
        PopulateTriggerControlID="Label1"
        ServiceMethod="GetHtml"
        UpdatingCssClass="dynamicPopulate_Updating" />
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>DynamicPopulate Description</Header>
        <Content>
            <div runat="server" data-control-type="DynamicPopulateExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>DynamicPopulate Properties</Header>
        <Content>
            <div runat="server" data-control-type="DynamicPopulateExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
