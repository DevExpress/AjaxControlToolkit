<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    Title="Other neat stuff" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <div class="walkthrough">

        <div class="heading">Other neat stuff</div>
        <p>The following items represent some handy tips, techniques, and features that are available with the AJAX Control Toolkit.
        A brief description is provided here along with a reference to one or more samples that demonstrate the use of the concept in complete detail.</p>

        <div class="subheading">Combining Scripts to Reduce Round-Trips</div>
        <p>
        The ToolkitScriptManager class derives from ScriptManager and enables the automatic combining of multiple script files in the corresponding web page.
        Any scripts (and localized script resources) coming from assemblies indicating their willingness to have their scripts combined (with the new assembly-level ScriptCombine attribute) will automatically be combined into one file for download by the user's browser.
        This combining action (and the automatic compression of the resulting file) can dramatically reduce the number of round-trips made by the browser to fetch scripts and correspondingly improve the page's responsiveness.
        The combined script file will be cached by the user's browser just like its individual parts would have been with the ASP.NET AJAX ScriptManager's default ScriptResource.axd behavior.
        Any changes to the page or the associated DLLs invalidates the cached copy of the combined scripts and prompts a re-download during the next page access.
        </p>
        <p>&nbsp;</p>
        <p>
        This new behavior is enabled by default for ToolkitScriptManager and can be disabled by setting its CombineScripts property to "false".
        Assemblies containing scripts which should not be combined in this fashion for some reason may use the ScriptCombine attribute's ExcludeScripts/IncludeScripts properties to specify exactly which scripts can be combined.
        The absence of the ScriptCombine attribute on an assembly means that none of its scripts can be combined in this manner; this is an explicit opt-in model for Assemblies.
        </p>

        <div class="subheading">Localizing Extender Strings</div>
        <p>If you would like to localize strings that a Toolkit control displays in the browser, then you can use the built-in infrastructure to
        add translations of that string in various languages to the resx files. They are located in the ScriptResources folder under the AjaxControlToolkit project.
        The right string is retrieved depending on the locale from the corresponding resx file (the locale may be set in the browser, the webapp or on the 
        server). For example, the expression below pulls the string "Today" from the resource file if the culture is English/Invariant and displays it
        in the calendar control as: "Today: March 1, 2007" to show today's date. </p>
<pre>
    AjaxControlToolkit.Resources.Calendar_Today
</pre>
        <div class="subheading">Theming Toolkit Controls</div>
        <p>Theming is now enabled on all controls extending from ExtenderControlBase. You can create a theme in the web application and
        add .skin files to it. If you do not provide an ID for the skin it becomes the default skin for all controls on pages using that theme. 
        All demo page collapsible panels are now using a default collapsible panel theme. You can extract a common set of extender properties used repetitively
        and put them in the skin file. For example, the following is the CollapsiblePanel skin definition for the sample website. Since all demo section
        collapsible panels were to have the same expand direction, images, header text and suppress postback setting, we moved those to the skin file. </p>
<pre>
    &lt;ajaxToolkit:CollapsiblePanelExtender runat="server"
        ExpandDirection="Vertical"
        ExpandedImage="~/images/collapse.jpg"
        ExpandedText="Collapse"
        CollapsedImage="~/images/expand.jpg"
        CollapsedText="Expand"
        SuppressPostBack="true" /&gt;
</pre>

        <div class="subheading">JavaScript Comment Stripper</div>
        <p>The release version of the Toolkit has embedded Javascript files that are compressed in size during the build process by removing safe newlines, 
        extra whitespace and comments. This helps reduce their size by about half and allows for more smaller downloads.</p>

        <div class="subheading">Using data binding to specify Extender properties</div>
        <p>If you want to initialize Extender instances dynamically from data (instead of with server-side code), this is now supported.
        The example below demonstrates setting the "WatermarkText" property of a TextBoxWatermark from the "WatermarkTextField" value of a data source.
        A working example of Extender data binding within a Repeater can be found in the DataBinding.aspx automated test (in the ToolkitTests folder).</p>
    <pre>
    &lt;ajaxToolkit:TextBoxWatermarkExtender ID="TBWE" runat="server"
        TargetControlID="TextBox1"
        <b>WatermarkText='&lt;%# Eval("WatermarkTextField") %&gt;'</b> /&gt;
    </pre>

        <div class="subheading">Maintaining state on the client</div>
        <p>Sometimes it's handy to maintain state on the client side across postbacks to the server.
        This is made easy by the ClientState property implemented by ExtenderControlBase and Behavior.js.
        Look at the script for AlwaysVisibleControl, CascadingDropDown, CollabsiblePanel, PopupControl, RoundedCorners, or TextboxWatermark for examples.</p>
    <!--
        <div class="subheading">Persisting state on the server</div>
        <p>Some settings need to be persisted on the server so they will be preserved the next time the user visits a page.
        <asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="http://ajax.asp.net/docs/atlas/doc/appservices/profile.aspx">ASP.NET AJAX's profile service</asp:HyperLink> supports this scenario and can now be easily leveraged by Toolkit controls.
        After enabling profile support in web.config (refer to the ASP.NET AJAX documentation for details), all it takes to support two-way profile persistence is the addition of a few page elements.
        See below for sample syntax and look at DragPanel for an example.</p>
    <pre>
    &lt;ajaxToolkit:DragPanelProperties ...&gt;
        <b>&lt;ProfileBindings&gt;
            &lt;ajaxToolkit:ProfilePropertyBinding
                ExtenderPropertyName="Location"
                ProfilePropertyName="dragLocation" /&gt;
        &lt;/ProfileBindings&gt;</b>
    &lt;/ajaxToolkit:DragPanelProperties&gt;
    </pre>
    -->
        <div class="subheading">Making sure required properties have values</div>
        <p>Missing properties for required fields should be easy to identify - and they are if you use the RequiredPropertyAttribute or the ExtenderControlBase.EnsureValid override.
        In most cases, you can simply add the RequiredPropertyAttribute to any required properties and an exception will automatically be thrown if they're not set.
        See the Properties classes for CascadingDropDown, HoverMenu, ModalPopup, PopupControl, TextboxWatermark, or ToggleButton for examples.
        If the checking of required fields is a little more involved, simply override the EnsureValid method and add whatever logic you need.
        Look at the Properties classes for AlwaysVisibleControl or CollapsiblePanel for examples.</p>

        <div class="subheading">Easily modifying and debugging scripts</div>
        <p>Scripts are automatically referenced as embedded resources by default which is very handy for using and deploying them.
        However, it can make developing and debugging them a little harder.
        When developing scripts, simply return true from AllowScriptPath (done by default) and set the ScriptPath of your extender to point to a script file somewhere in your website project.
        The script will be automatically referenced from the web site, so it will be easier to change and debug.
        When you're ready to deploy it, simply remove the ScriptPath and the script will be accessed from the resource again.</p>
        <p>For example:</p>
    <pre>
    &lt;name:MyExtender ID="MyExtender1" <b>ScriptPath="MyBehavior.js"</b>
        runat="server"&gt;
    </pre>

        <div class="subheading">Sharing common code</div>
        <p>If you have some handy script functions that you'd like to make available to multiple controls, you can put that code in the Common.js file and add the RequiredScriptAttribute to your class and reference the CommonToolkitScripts type.
        The common script will automatically be available to your control at run time!
        See the CascadingDropDown or HoverMenu for examples.</p>

        <div class="subheading">Easily referencing behavior instances</div>
        <p>It used to be tricky to get a reference to a behavior from client script, but now you can simply add a "BehaviorID" attribute to your control's property specification and it will be easily accessible on the client via ASP.NET AJAX's Sys.Application.findComponent(<em>id</em>) method or its $find(<em>id</em>) shortcut.
        (Note: If BehaviorID isn't specified, the behavior's ID on the client will be the same as the extender control's ClientID.)
        See DynamicPopulate or ResizableControl for examples.</p>

        <div class="subheading">Finding controls in unusual locations</div>
        <p>The ExtenderControlBase class tries to find controls used by extenders, but if those controls are buried within other naming containers, it may not be able to find them.
        When that happens, it will fire the ResolveControlID event and any event handlers registered by the page author will be able to identify the relevant control by using the additional context available to the page developer.
        See the ExtenderBase test page for an example.</p>

        <div class="subheading">Easily adding dynamic population</div>
        <p>The DynamicPopulate*Base classes (DynamicPopulateExtenderControlBase and DynamicPopulateBehaviorBase) make adding dynamic population to a new or existing extender simple.
        Just derive the extender's code from the DynamicPopulate*Base classes to get the necessary properties (DynamicControlID, DynamicContextKey, DynamicServicePath, and DynamicServiceMethod) for users to (optionally) hook up the population feature.
        When your behavior implementation makes a base method call to the "populate" function, the relevant page content will be dynamically updated by the DynamicPopulate control.
        Population can be done with a page method or a web service and works just as it does when using DynamicPopulate directly.
        Look at HoverMenu, ModalPopup, or PopupControl for examples.</p>

        <div class="subheading">Automatically expanding virtual paths</div>
        <p>If your control has a property that accepts a path from the user, mark that property with the UrlPropertyAttribute and virtual paths will be automatically resolved.
        See CascadingDropDown, CollapsiblePanel, or ToggleButton for examples.</p>

        <div class="subheading">Hooking up to partial update (UpdatePanel) events</div>
        <p>All controls with a behavior deriving from BehaviorBase have _partialUpdateBeginRequest and _partialUpdateEndRequest methods and a registerPartialUpdateEvents method to enable them.
        By calling the registerPartialUpdateEvents method, the PageRequestManager's begin/end request events are automatically used to call the _partialUpdateBeginRequest and _partialUpdateEndRequest methods.
        _partialUpdateBeginRequest is called when a partial rendering (i.e., an UpdatePanel postback) begins and _partialUpdateEndRequest is called when it ends.
        Look at the PopupControl, TextBoxWatermark, or UpdatePanelAnimation behaviors for examples.</p>

        <div class="subheading">Wrapping an existing behavior</div>
        <p>If you want your extender to take advantage of or expose one of the many existing ASP.NET AJAX behaviors, it's easy to do.
        Look at the AlwaysVisibleControl, DropShadow, HoverMenu, ModalPopup, PopupControl, or ReorderList for examples.</p>

        <div class="subheading">Exposing properties to the designer with customized names</div>
        <p>If you want to expose a property to the designer or script code with a different name than the property itself, just decorate that property with the ClientPropertyNameAttribute.
        (Note that this is a common scenario when wrapping existing behaviors.)
        Look at the DragPanel's DragHandleID property for an example.</p>
    <!--
        <div class="subheading">Rendering extra XML Script</div>
        <p>If you want to render some additional XML Script inside your behavior, the RenderInnerScript override enables you to do so.
        Look at the DropWatcherExtender.RenderInnerScript override in ReorderList for an example.</p>
    -->
        <div class="subheading">Adding required script references</div>
        <p>If you want to add some required script references to the page to support your behavior, you can do so with the RequiredScriptAttribute.
        RequiredScriptAttribute supports referencing required scripts with the FrameworkScript enum or by referring to another extender type that you want to use.
        It also allows you to specify a specific load order for those cases where the default behavior needs to be altered.
        Look at the AlwaysVisibleControl, CascadingDropDown, CollapsiblePanel, DragPanel, DropShadow, HoverMenu, ModalPopup, or ReorderList for examples.</p>

    </div>
</asp:Content>