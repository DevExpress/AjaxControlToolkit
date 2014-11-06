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
            <p>
                DynamicPopulate is a simple extender that replaces the contents of a control with the result of a
                web service or page method call. The method call returns a string of HTML that is inserted as the
                children of the target element.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>DynamicPopulate Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The properties in <em>italic</em> are optional. The
                CustomScript or the ServiceMethod field needs to be specified.
            </p>
            <pre>
&lt;ajaxToolkit:DynamicPopulateExtender ID="dp" runat="server"
    TargetControlID="Panel1" 
    <em>ClearContentsDuringUpdate</em>="true" 
    <em>PopulateTriggerControlID</em>="Label1" 
    <em>ServiceMethod</em>="GetHtml" 
    <em>UpdatingCssClass</em>="dynamicPopulate_Updating" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the button or link for this extender to operate on</li>
                <li><strong>ClearContentsDuringUpdate</strong> - true (default) to clear the HTML contents of the target element when an update begins</li>
                <li><strong>ServicePath</strong> - The URL of the web service to call. Leave this parameter blank and specify a ServiceMethod to call a PageMethod.  The web service should be decorated with the System.Web.Script.Services.ScriptService attribute.</li>
                <li><strong>ServiceMethod</strong> - The name of the method to call on the page or web service. The signature of this method must match the following:
                    <pre>
[System.Web.Services.WebMethod]
[System.Web.Script.Services.ScriptMethod]
string DynamicPopulateMethod(string contextKey) { ... }
                    </pre>
                    Note you can replace "DynamicPopulateMethod" with a naming of your choice, but the return type and parameter name and type must exactly match, including case.
                </li>
                <li><strong>PopulateTriggerControlID</strong> - The optional name of a control that, when clicked, triggers the population of the target.</li>
                <li><strong>UpdatingCssClass</strong> - The CSS class to apply to the target during asynchronous calls.</li>
                <li><strong>CustomScript</strong> - The script to invoke instead of calling a Web or Page method. This script must evaluate to a string value.</li>
                <li><strong>ContextKey</strong> - An arbitrary string value to be passed to the web method. For example, if the element to be populated is within a data-bound repeater, this could be the ID of the current row.</li>
                <li><strong>CacheDynamicResults</strong> - Whether the results of the dynamic population should be cached and not fetched again after the first load.  The default value is false.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
