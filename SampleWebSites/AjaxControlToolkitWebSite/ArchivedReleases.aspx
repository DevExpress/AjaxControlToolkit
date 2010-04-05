<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    Inherits="CommonPage"
    Title="Archived Toolkit Releases Notes" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    <p>
        <u><strong>Version 3.5.30729.1</strong></u></p>
    <strong><u>New control</u></strong>
    <ul class="releaseList">
        <li><strong><a href="MultiHandleSlider/MultiHandleSlider.aspx">MultiHandleSlider</a></strong>
            <p>The MultiHandleSlider extender provides a feature-rich extension to a regular asp:Textbox control. It allows
            you to choose a single value, or multiple values in a range, through a graphical slider interface. It supports
            one handle, dual handles, or any number of handles bound to the values of asp:TextBox or asp:Label controls.</p>
            
            <p>It also provides options for read-only access, custom graphic styling, hover and drag handle styles, as well
            as mouse and keyboard support for accessibility.</p>
            
            <p>This control is backwards-compatible and can be used as a drop-in replacement of 
                <a href="Slider/Slider.aspx">the Slider control</a>.</p>
            
            <p>Many thanks to Daniel Crenna for building this.</p></li>
    </ul>
    <br />
    <strong><u>Community effort</u></strong>
    <p>
        This release includes many <a href="http://www.codeplex.com/AtlasControlToolkit/Wiki/View.aspx?title=PatchUtility">
            patch fixes</a> provided by members of the Toolkit community. We would like
        to specially thank all the patch contributors for their effort which helped make
        this release possible. We recognize their names on the <a href="http://www.codeplex.com/AtlasControlToolkit/Wiki/View.aspx?title=PatchHallOfFame">
            Toolkit Patch Hall of Fame</a>.
    </p>
    <br />
    <strong><u>Setting up the environment to use the Toolkit</u></strong>: This Toolkit
    release targets the .NET Framework 3.5 SP1 (3.5.30729.1) and Visual Studio 2008 SP1.<br />
    <br />
    <p>
        <strong><u>Note: </u></strong><strong>Toolkit version 3.5.20820</strong> is <em>only</em>
        for users who are building on top of .NET Framework 3.5 SP1 using Visual Studio 2008 SP1.
        If you are using .NET Framework 2.0 and Visual Studio 2005 then you should use <strong>
            Toolkit version 1.0.20229</strong>.</p>
    <br />    

    <hr />
    <p>
        <u><strong>Version 3.5.20229</strong></u></p>
        <strong><u>Major Fixes</u></strong>
    <ul class="releaseList">
        <li><strong>ValidatorCallout</strong> supports styling the popup using CSS and 
            server-side validation. </li>
        <li><strong>ListSearch</strong> has enabled the options of searching for sub-strings 
            in the list items and clearing the search query if no match is found. </li>
        <li><strong>AutoComplete</strong> only queries for matches when the user types a 
            character. </li>
    </ul>
    <br />
    <strong><u>Community effort</u></strong>
    <p>
        This release includes over 10
        <a href="http://www.codeplex.com/AtlasControlToolkit/Wiki/View.aspx?title=PatchUtility">
        patch fixes</a> provided by members of the Toolkit community. We would like to 
        specially thank all the patch contributors for their effort which helped make 
        this release possible. We recognize their names on the
        <a href="http://www.codeplex.com/AtlasControlToolkit/Wiki/View.aspx?title=PatchHallOfFame">
        Toolkit Patch Hall of Fame</a>.
    </p>
    <br />
    <strong><u>Setting up the environment to use the Toolkit</u></strong>: This 
    Toolkit release targets two different versions of the .NET Framework:<br />
    <ul class="releaseList">
        <li><strong><u>Version 3.5.20229</u></strong> for .NET Framework 3.5 and Visual 
            Studio 2008:<br />
            <p>
                Download the <u>AjaxControlToolkit-Framework3.5.zip</u> or <u>
                AjaxControlToolkit-Framework3.5-NoSource.zip</u>.
            </p>
        </li>
        <li><strong><u>Version 1.0.20229</u></strong> for ASP.NET AJAX version 1.0 and .NET 
            Framework 2.0:
            <br />
            <p>
                Download the <u>AjaxControlToolkit.zip</u> or <u>AjaxControlToolkit-NoSource.zip</u>.
            </p>
        </li>
    </ul>
    <br />
    <p>
        <strong><u>Note: </u>Toolkit version 3.5.20229</strong> is <em>only</em> for 
        users who are building on top of .NET Framework 3.5 using Visual Studio 2008. If 
        you are using .NET Framework 2.0 and Visual Studio 2005 then you should use
        <strong>Toolkit version 1.0.20229</strong>.</p>
    <br />    

    <hr />
    <p>
        <u><strong>Versions 3.5.11119.0 and 1.0.11119.0</strong></u></p>
    This Toolkit release targets two different versions of the .NET Framework:<br />
    <br />
    <u><strong>Version 3.5.11119.0 for .NET Framework 3.5 and Visual Studio 2008</strong></u>
    <p>
    </p>
    Toolkit version 3.5.11119.0 is supported on .NET 3.5 Framework and Visual Studio
    2008. It has specific fixes that will make your designer experience in Visual Studio
    2008 much better when working with extenders.
    <br />
    <br />
    <strong>Note: </strong>Toolkit version 3.5.11119.0 is <em>only</em> for users who
    are building on top of .NET Framework 3.5 using Visual Studio 2008. If you are using
    .NET Framework 2.0 and Visual Studio 2005 then you should use Toolkit version <a
        href="#Framework1.0">1.0.11119.0</a>.
    <br />
    <br />
    <strong>Setting up the environment to use the Toolkit:</strong>
    <ul class="releaseList">
        <li>Follow the instructions to download and install Visual Studio 2008 from <a href="http://msdn2.microsoft.com/vstudio/default.aspx">
            here</a>.</li>
        <li>Download the <strong>AjaxControlToolkit-Framework3.5.zip</strong> or <strong>AjaxControlToolkit-Framework3.5-NoSource.zip</strong>
            from the <a href="http://www.codeplex.com/AtlasControlToolkit/Release/ProjectReleases.aspx">
                Toolkit Releases page</a>. </li>
    </ul>
    <br />
    <strong>Features: </strong>
    <ul class="releaseList">
        <li><strong>JavaScript IntelliSense support: </strong>We have added reference tags to
            all Toolkit JavaScript files that enables you to take advantage of new features
            in Visual Studio 2008. With the multi-targeting support in this Visual Studio Beta,
            IntelliSense will be available for the ASP.NET AJAX 1.0 flavor of the Toolkit as
            well. This <a href="http://blogs.msdn.com/webdevtools/archive/2007/03/02/jscript-IntelliSense-in-orcas.aspx">
                article</a> discusses the reference tag feature in detail.</li>
        <li><strong>Extender designer support: </strong>Enhanced designer support for Toolkit
            controls using the new "Add Extender" user interface.</li>
        <li><strong>Animations and PageMethods in design mode: </strong>Design mode workarounds
            that targeted Visual Studio 2008 Beta 2 issues when using Animations and "Add PageMethod"
            support in the Toolkit have removed since the release version of Visual Studio 2008
            has fixed the same.</li>
    </ul>
    <br />
    <a name="Framework1.0"></a><u><strong>Version 1.0.11119.0 for ASP.NET AJAX version 1.0
        and .NET Framework 2.0</strong> (No changes from 1.0.10920)</u>
    <br />
    <br />
    <strong>Setting up the environment to use the Toolkit:</strong>
    <ul class="releaseList">
        <li>Download the <strong>AjaxControlToolkit.zip</strong> or <strong>AjaxControlToolkit-NoSource.zip</strong>
            from the <a href="http://www.codeplex.com/AtlasControlToolkit/Release/ProjectReleases.aspx">
                Toolkit Releases page</a>. </li>
    </ul>
    <br />    

    <hr />
    <p>
        <u><strong>Version 1.0.10920.0</strong></u></p>
    This release has two flavors that work against two versions of the .NET Framework:<br />
    <ul>
        <li>ASP.NET AJAX version 1.0 and .NET Framework 2.0</li>
        <li>.NET Framework 3.5 Beta 2 (includes ASP.NET AJAX), <a href="#Framework3.5">details
            below</a></li>
    </ul>
    <p>
    </p>
    <br />
    <p>
        The TemplateVSI project has a dependency on vjslib.dll which is a part of the Visual
        J# Redistributable Package. If you would like to build that project successfully
        then please install the package from <a href="http://www.microsoft.com/downloads/details.aspx?familyid=f72c74b3-ed0e-4af8-ae63-2f0e42501be1&displaylang=en">
            here</a>.
    </p>
    <p>
    </p>
    <br />
    <strong>General fixes:</strong>
    <ul class="releaseList">
        <li><strong>Controls with Embedded styles (Calendar, Tabs and Slider): </strong>Toolkit
            controls no longer need explicit style references when loaded asynchronously. For
            example, if a Calendar control is placed inside an UpdatePanel and made visible
            on an UpdatePanel postback, the embedded styles are now loaded properly.</li>
        <li><strong>PopupBehavior positioning (AutoComplete, Calendar, DropDown, HoverMenu,
            ListSearch, PopupControl and ValidatorCallout):</strong> PopupBehavior now respects
            the position of its parent element even when the browser window is very narrow or
            the parent element is close the window edge.</li>
        <li><strong>Focusing extended controls (Accordion, CollapsiblePanel, DropShadow, Tabs):</strong>
            Pages that use Toolkit controls which re-parent DOM elements can use a workaround
            to focus a specific element on page load. The new method Utility.SetFocusOnLoad ensures
            that the desired control receives focus.</li>
    </ul>
    <p>
    </p>
    <br />
    <p>
        <strong>Control specific fixes:</strong>
    </p>
    <ul class="releaseList">
        <li><strong>Calendar: </strong>Property to specify the position of Calendar, a default
            date feature that allows the calendar to start out with a selected date, and a consistent
            show, hide and focus story that makes the Calendar user experience more intuitive.</li>
        <li><strong>ModalPopup: </strong>Ability to disable repositioning of the ModalPopup in response
            to window resize and scroll.</li>
        <li><strong>ConfirmButton: </strong>ModalPopup functionality now supported in addition
            to the regular windows alert dialog.</li>
        <li><strong>MaskedEdit: </strong>Extended Textbox no longer uses Invariant culture if
            no CultureName is specified and falls back to the Page Culture.</li>
        <li><strong>AutoComplete: </strong>Allow users to associate additional
            data with the AutoComplete suggestions.</li>
        <li><strong>Slider: </strong>Slider can be easily customized using its various CSS properties.</li>
    </ul>
    <br />
    <p>
        Breaking Changes:</p>
    <p>
    </p>
    <ul class="releaseList">
        <li>No breaking changes</li>
    </ul>
    <p>
    </p>
    <p>
        Known Issues:</p>
    <p>
    </p>
    <ul class="releaseList">
        <li>No new issues</li>
    </ul>
    <br />    

    <hr />
    <p>
        <a name="Framework3.5"></a><u><strong>Toolkit for .NET Framework 3.5 Beta 2 and Visual
            Studio 2008 Beta 2:</strong></u>
    </p>
    This is the second Toolkit version that also has a flavor that is supported on .NET
    3.5 Framework Beta 2 and Visual Studio 2008 Beta 2. If you are trying out Beta 2
    then you can also try out the Toolkit with it.
    <br />
    <br />
    <strong>Note: </strong>This Toolkit flavor is <em>only</em> for users who are using
    Beta 2. If you are not using Beta 2 and you attempt to use this flavor of the Toolkit
    against .NET Framework 2.0 and Visual Studio 2005 it is <em>not</em> supported and
    will not work.
    <br />
    <br />
    <strong>Setting up the environment to use the Toolkit with Beta 2:</strong>
    <ul class="releaseList">
        <li>Follow the instructions to download and install Beta 2 from <a href="http://msdn2.microsoft.com/en-us/vstudio/aa700831.aspx">
            here</a>.</li>
        <li>Download the <strong>AjaxControlToolkit-Framework3.5.zip</strong> or <strong>AjaxControlToolkit-Framework3.5-NoSource.zip</strong>
            from the <a href="http://www.codeplex.com/AtlasControlToolkit/Release/ProjectReleases.aspx">
                Toolkit Releases page</a>. </li>
    </ul>
    <br />
    <strong>Features: </strong>
    <ul class="releaseList">
        <li><strong>JavaScript IntelliSense support: </strong>We have added
            reference tags to all Toolkit JavaScript files that enables you to take advantage of
            new features in Visual Studio 2008 Beta 2. With the multi-targeting support in
            this Visual Studio Beta, IntelliSense will be available for the ASP.NET AJAX 1.0
            flavor of the Toolkit as well. This <a href="http://blogs.msdn.com/webdevtools/archive/2007/03/02/jscript-IntelliSense-in-orcas.aspx">
                article</a> discusses the reference tag feature in detail.</li>
        <li><strong>Extender designer support: </strong>Enhanced designer support for Toolkit
            controls using the new "Add Extender" user interface.</li>
    </ul>
    <br />
    <strong>Known issues with the Toolkit and Beta 2: </strong>
    <ul class="releaseList">
        <li>Pages with controls using Toolkit Animations may not work properly if edited in
            design mode. This is a known issue with Beta 2 and should be fixed in future releases.
        </li>
    </ul>
        <br />    

    <hr />
    <p><u><strong>Version 1.0.10618.0</strong></u></p>
        <p>
            This is a refresh release that fixes some of the issues discovered in the 1.0.10606.0
            release.
        </p>
        <br />
        It has two flavors that work against two versions of the .NET Framework:<br />
        <ul>
            <li>ASP.NET AJAX version 1.0 and .NET Framework
                2.0</li>
            <li>.NET Framework 3.5 Beta 2 (includes ASP.NET AJAX), <a href="#Framework3.5">details below</a></li>
        </ul>
    <br />
    <strong>General fixes:</strong>
    <ul class="releaseList">
        <li><strong>Tabs: </strong>Resolved NamingContainer issues so that FindControl works
            as expected in Tabs.</li>
        <li><strong>ToolkitScriptManager: </strong>Shorter combined script URLs and new HTTP
            handler support for generation of combined script files.</li>
        <li><strong>Dependencies: </strong>Removed explicit reference to VsWebSite.Interop.dll
            and stdole.dll. They will not be automatically included in the web configuration
            files by Visual Studio.</li>
        <li><strong>FilteredTextBox: </strong>Navigation, Control and Delete keys work fine
            in all browsers.</li>
        <li><strong>Localization: </strong>Turkish, Dutch, and Traditional and Simplified Chinese
            language support added.</li>
    </ul>
    <br />
    <p>
        Breaking Changes:</p>
    <p>
    </p>
    <ul class="releaseList">
        <li>No breaking changes</li>
    </ul>
    <p>
    </p>
    <p>
        Known Issues:</p>
    <p>
    </p>
    <ul class="releaseList">
        <li>No new issues</li>
    </ul>
    <br />    

    <hr />
    <p><a name="Framework3.5"></a>
        <u><strong>Toolkit for .NET Framework 3.5 Beta 2 and Visual Studio 2008 Beta 2:</strong></u>
    </p>
    This Toolkit version now has a flavor that is supported on .NET 3.5 Framework Beta
    2 and Visual Studio 2008 Beta 2. If you are trying out Beta 2 then you can also
    try out the Toolkit with it.
    <br />
    <br />
    <strong>Note: </strong>This Toolkit flavor is <em>only</em> for users who are using
    Beta 2. If you are not using Beta 2 and you attempt to use this flavor of the
    Toolkit against .NET Framework 2.0 and Visual Studio 2005 it is <em>not</em> supported
    and will not work.
    <br />
    <br />
    <strong>Setting up the environment to use the Toolkit with Beta 2:</strong>
    <ul class="releaseList">
        <li>Follow the instructions to download and install Beta 2 from <a href="http://msdn2.microsoft.com/en-us/vstudio/aa700831.aspx">
            here</a>.</li>
        <li>Download the <strong>AjaxControlToolkit-Framework3.5.zip</strong> or <strong>AjaxControlToolkit-Framework3.5-NoSource.zip</strong>
            from the <a href="http://www.codeplex.com/AtlasControlToolkit/Release/ProjectReleases.aspx">
                Toolkit Releases page</a>. </li>
    </ul>
    <br />
    <strong>What's new in the Toolkit for Beta 2?</strong>
    <ul class="releaseList">
        <li>Enhanced designer support for Toolkit controls like the new "Add Extender" user
            interface.</li>
    </ul>
    <br />
    <strong>Known issues with the Toolkit and Beta 2 </strong>
    <ul class="releaseList">
        <li>Pages with controls using Toolkit Animations may not work properly if edited in
            design mode. This is a known issue with Beta 2 and should be fixed in future releases.
        </li>
    </ul>
    <br />    

    <hr />
    <p>
    <u><strong>Version 1.0.10606.0</strong></u> - <em>Requires ASP.NET AJAX version 1.0</em></p>
    <p>
        <strong>General fixes:</strong></p>
    <ul class="releaseList">
        <li><strong>Design Mode support:</strong>
            <ul>
                <li><strong>Tabs designer:</strong> Tabs control can be configured in the designer.</li>
                <li><strong>PageMethods in code-behind:</strong> Extenders that consume web services
                    can now have PageMethods added to code-behind automatically when using the designer.
                    A repair mode fixes existing PageMethods with incorrect signatures.</li>
                <li><strong>Control icons:</strong> Toolkit controls have more meaningful icons that
                    show up in the Visual Studio Toolbox when the Toolkit DLL is added to it.</li>
            </ul>
        </li>
        <li><strong>Dynamic context:</strong> Toolkit extenders that consume web services can
            now pass additional context beyond what is used by the default web service signature.</li>
        <li><strong>Validators and Toolkit extenders:</strong> Extenders that target TextBoxes
            with ASP.NET validators attached to them no longer interfere with the validation
            process.</li>
        <li><strong>Animation support:</strong> Toolkit controls that build on top of PopupBehavior
            now have generic animation support built in.</li>
        <li><strong>Script combiner:</strong> When the <a href="Walkthrough/OtherNeatStuff.aspx">
            ToolkitScriptManager</a> is used, Toolkit scripts are downloaded in a single, common
            JavaScript file instead of multiple files. This allows for faster downloads and
            fewer roundtrips. The combined file is generated dynamically depending on the controls
            being used on the page. All Toolkit sample pages use this new functionality.</li>
        <li><strong>Events support:</strong> Toolkit controls fire events for core actions.
            This is in part to make plugging in animation easier and also to allow users to
            hook into the various Toolkit controls' behaviors and perform custom actions.</li>
        <li><strong>Bug fixes:</strong> This <a href="http://www.codeplex.com/AtlasControlToolkit/Release/ProjectReleases.aspx?ReleaseId=1813">
            release</a> includes fixes for over <strong>120 issues</strong> tracked in the Toolkit
            Issue Tracker representing over <strong>750 user votes</strong>.</li>
        <li><strong>Accessibility fixes:</strong> Slider and AutoComplete have support for high
            contrast and some controls like AutoComplete, NumericUpDown, CascadingDropDown and
            DynamicPopulate which issue XmlHttpRequests update a hidden DOM element to <a href="http://juicystudio.com/article/improving-ajax-applications-for-jaws-users.php">
                automatically refresh the JAWS screen buffer</a> to reflect new data.</li>
    </ul>
    <br />
    <p>
        <strong>Control updates:</strong></p>
    <ul>
        <li><strong>MaskedEdit</strong> extender works well with the Calendar extender and the
            ValidatorCallout extender when targeting the same TextBox.</li>
        <li><strong>AutoComplete</strong> supports scrolling in the fly-out, multi-word, first
            word default selection and it has animation built into it.</li>
        <li><strong>ModalPopup</strong> fix for most common scenarios involving absolute and
            relative positioning.</li>
        <li><strong>NumericUpDown</strong> has new Minimum and Maximum properties to restrict
            the range of numbers allowed.</li>
    </ul>
    <p>
    </p>
    <br />
    <p>
        <strong>Visual Studio Codename "Orcas" support:</strong></p>
    <ul>
        <li>The Toolkit DLL works with ASP.NET AJAX Orcas Beta 1 DLLs and there are no breaking
            changes.</li>
    </ul>
    <br />
    <p>
        Breaking Changes:</p>
    <p>
    </p>
    <ul class="releaseList">
        <li>No breaking changes</li>
    </ul>
    <p>
    </p>
    <p>
        Known Issues:</p>
    <p>
    </p>
    <ul class="releaseList">
        <li>No new issues</li>
    </ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.10301.0</strong></u> - <em>Requires ASP.NET AJAX version 1.0</em></p>
    <p><strong>New Controls:</strong></p>
    <p></p>
    <ul class="releaseList">
        <li><strong>ListSearch:</strong> Extender that searches for items in a listbox or dropdown</li>
        <li><strong>SlideShow:</strong> Extender for image controls that lets you transition through a set of pictures</li>
    </ul><br />
    <p><strong>General Notes:</strong></p>
    <p></p>
    <ul class="releaseList">
        <li>Skinning support added for extenders; all demo page collapsible panels are now themed</li>
        <li>Localization infrastructure added to Toolkit, specifically, the "Today" string in the Calendar control is localized in 14 languages</li>        
        <li>JavaScript comment stripper added to the Toolkit which cuts the size of the scripts by about half on average</li>
        <li>Accessibility fixes made to the website and controls in terms of keyboard support, specifically, Accordion, CollapsiblePanel, Calendar and NumericUpDown</li>
        <li>Accordion, Slider and ReorderList bug fixes</li>
    </ul>
    <p></p>
    <br />
    <p>Breaking Changes:</p>
    <p></p>
    <ul class="releaseList">
        <li>No breaking changes</li></ul>
    <p></p>
    <p>Known Issues:</p>
    <p></p>
    <ul class="releaseList">
        <li>No new issues</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.10201.0</strong></u> - <em>Requires ASP.NET AJAX version 1.0</em></p>
    <p>This is an update release for the Toolkit. We have fixed some issues that were raised since the 10123 release.</p><br />
    <p><strong>General Notes:</strong></p>
    <p></p>
    <ul class="releaseList">
        <li>Fixed AutoComplete and TabPanel dispose issues exposed by UpdatePanels</li>
        <li>Fixed TextBoxWatermark issue where the textbox retained focus even though the watermark showed up</li>
        <li>Fixed Calendar localization issues</li>
        <li>Simplified ModalPopup drag behavior</li>
    </ul>
    <p></p><br />
    <p>Breaking Changes:</p>
    <p></p>
    <ul class="releaseList">
        <li>No breaking changes</li></ul>
    <p></p>
    <p>Known Issues:</p>
    <p></p>
    <ul class="releaseList">
        <li>No new issues</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.10123.0</strong></u> - <em>Requires ASP.NET AJAX version 1.0</em></p>
    <p>This is a major release for the Toolkit. We have ported over all fixes in the development branch 
    and have brand new set of controls, feature changes and script base classes.</p><br />
    <p><strong>New Controls: </strong></p>
    <p></p>
    <ul class="releaseList">
        <li><strong>AutoComplete</strong>: The much-requested control that provides suggestions to complete input typed in a textbox</li>
        <li><strong>Calendar</strong>: Client-side calendar control</li>
        <li><strong>MaskedEdit</strong>: Control to enforce input entered into a text box is in a specific format complying with specific types using client-side validation</li>
        <li><strong>TabContainer</strong>: Tab strip control to organize page content</li>
    </ul><br />
    <p><strong>General Notes:</strong></p>
    <p></p>
    <ul class="releaseList">
        <li><strong>Updated the Toolkit framework, all controls, all samples, and all documentation for the new 
        <asp:HyperLink ID="HyperLink4" runat="server" NavigateUrl="http://ajax.asp.net/">ASP.NET AJAX v1.0</asp:HyperLink></strong></li>
        <li><strong>Bug Fixes:</strong> Over 75 issue fixes in the Toolkit development branch are a part of this release making it those most stable and feature rich one so far</li>        
        <li><strong>ModalPopup changes:</strong> Added absolute positioning, drag/drop ability, async post-back support</li>
        <li><strong>RounderCorners:</strong> Added ability to specify which corners to round</li>
        <li><strong>ExtenderBaseControl/Script changes:</strong> Revised ExtenderControlBase architecture to make it easier to author new Toolkit Controls</li>
    </ul>
    <p></p><br />
    <p>Breaking Changes:</p>
    <p></p>
    <ul class="releaseList">
        <li>No breaking changes</li></ul>
    <p></p>
    <p>Known Issues:</p>
    <p></p>
    <ul class="releaseList">
        <li>No new issues</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.61214.0</strong></u> - <em>Requires ASP.NET AJAX v1.0 RC</em></p>
    <p>General Notes:</p>
    <p></p>
    <ul class="releaseList">
        <li><strong>Updated the Toolkit framework, all controls, all samples, and all documentation for the new <asp:HyperLink ID="HyperLink12" runat="server" NavigateUrl="http://ajax.asp.net/">ASP.NET AJAX v1.0 RC</asp:HyperLink></strong></li>
        <li>Added missing Accordion property attributes</li>
        <li>Fixed Slider initialize, reposition, and default value code</li>
        <li>Enhanced ModalPopup tab-prevention for background elements</li>
    </ul>
    <p></p>
    <p>Breaking Changes</p>
    <p></p>
    <ul class="releaseList">
        <li>No breaking changes</li></ul>
    <p></p>
    <p>Known Issues</p>
    <p></p>
    <ul class="releaseList">
        <li>No new issues</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.61121.0</strong></u></p>
    <p>General Notes:</p>
    <p></p>
    <ul class="releaseList">
        <li><strong>Removed AJAX Control Toolkit's dependency on Microsoft.Web.Extensions.Design.dll. This DLL is part of ASP.NET AJAX, but is not installed on machines without some flavor of Visual Studio already installed. The missing DLL caused problems for web servers (which typically do not have development tools installed on them).</strong></li>
        <li><strong>Moved the workaround for the scenario when EnableEventValidation=false (and ASP.NET AJAX doesn't render extenders or ScriptManager to the page during an async postback) up a level from CascadingDropDown to ExtenderBase so that all Toolkit controls will benefit</strong></li>
        <li>Revised ModalPopup server-side Show/Hide implementation to work even when the ModalPopupExtender is not part of the current async postback (regressed due to an ASP.NET AJAX change)</li>
        <li>Fixed an issue preventing ClientState from working properly inside an UpdatePanel (regressed due to an ASP.NET AJAX change)</li>
        <li>Fixed ModalPopup server-side Show/Hide to apply to only the next page load/async postback instead of applying to all subsequent page loads/async postbacks</li>
        <li>Updated Accordion to adjust its pane sizes after an async postback in order to avoid clipping the new pane contents if they were bigger than the old pane contents</li>
        <li>Fixed an issue with AjaxControlToolkit.IEDragDropManager.unregisterDropTarget that could cause a script error during page unload/dispose if multiple DragPanels were being used</li>
        <li>Fixed a width issue with AjaxControlToolkit.CommonToolkitScripts.getLocation</li>
        <li>Updated web.config files to include changes associated with ASP.NET AJAX Beta 2 and resolve issues running under IIS7</li>
    </ul>
    <p></p>
    <p>Breaking Changes</p>
    <p></p>
    <ul class="releaseList">
        <li>No breaking changes</li></ul>
    <p></p>
    <p>Known Issues</p>
    <p></p>
    <ul class="releaseList">
        <li>No new issues</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.61106.0</strong></u></p>
    <p>General Notes:</p>
    <p></p>
    <ul class="releaseList">
        <li><strong>Updated the Toolkit framework, all controls, all samples, and all documentation for the new <asp:HyperLink ID="HyperLink11" runat="server" NavigateUrl="http://ajax.asp.net/">ASP.NET AJAX v1.0 Beta 2</asp:HyperLink></strong></li>
    </ul>
    <p></p>
    <p>Breaking Changes</p>
    <p></p>
    <ul class="releaseList">
        <li>No breaking changes</li></ul>
    <p></p>
    <p>Known Issues</p>
    <p></p>
    <ul class="releaseList">
        <li>No new issues</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.61020.0</strong></u></p>
    <p>New controls (see sample pages on left):</p>
    <p></p>
    <ul class="releaseList">
        <li><strong>DropDown</strong>: Provides a dynamic drop-down functionality, similar to
            what is found in Windows Sharepoint Server.</li><li><strong>MutuallyExclusiveCheckbox</strong>: Allows picklists of mutually-exclusive
            values.</li><li><strong>ValidatorCallout</strong>: Adds great client-side UI to ASP.NET validators</li></ul>
    <p></p>
    <p>General Notes:</p>
    <p></p>
    <ul class="releaseList">
    <li><strong>Updated the Toolkit framework, all controls, all samples, and all documentation for the new <asp:HyperLink ID="HyperLink9" runat="server" NavigateUrl="http://ajax.asp.net/">ASP.NET AJAX v1.0 Beta</asp:HyperLink></strong></li><li>The ASP.NET AJAX Beta has a number of changes from earlier releases of "Atlas" - users are encouraged to familiarize themselves with those changes because many of them directly impact the Toolkit</li>
        <li>For Toolkit users (e.g. those not writing components, see this <a href="Walkthrough/AtlasToAspNetAjax.aspx">
            walkthrough</a> for migrating your pages.</li>
        <li>TemplateVSI now includes Web Site projects in addition to the Extender projects and Extender items it already had - C# and VB versions are available for all templates</li></ul>
    <p></p>
    <p>Breaking Changes</p>
    <p></p>
    <ul class="releaseList">
        <li>Technically, everything in this release is a breaking change since the syntax on
            the client- and server-side has changed. We have, however, worked hard to
            minimize the impact of this to page developers. The server-side move to this
            build is trivial, see the <a href="Walkthrough/AtlasToAspNetAjax.aspx">walkthrough</a>.</li><li>The ASP.NET AJAX Extensions DLL (now Microsoft.Web.Extensions.dll) is not included with the Toolkit and must be <asp:HyperLink ID="HyperLink10" runat="server" NavigateUrl="http://ajax.asp.net/">downloaded and installed separately</asp:HyperLink></li><li>Extenders no longer contain a set of properties classes. The property values
            for an extender are now directly on the extender object. This means that,
            in past cases where you had one extender and multiple properties objects, you will
            now have multiple extenders. This greatly simplifies the use of extenders.</li><li>The coding pattern for JavaScript behaviors has changed from the closure model to the Prototype model - all Toolkit behaviors have been updated. See documentation
                on the ASP.NET AJAX website for more information on this change.</li><li>The default Toolkit tag prefix changed from "atlasToolkit" to "ajaxToolkit"</li><li>Profile Binding is not supported in this release.</li></ul>
    <p></p>
    <p>Known Issues</p>
    <p></p>
    <ul class="releaseList">
        <li>Many of the controls are known to work well with the recently released Opera browser, though Opera support was not a focus of this release. In future releases,
            we plan to continue to improve our Opera support as ASP.NET AJAX does.</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.60914.0</strong></u></p>
    <p>New controls (see sample pages on left):</p>
    <p></p>
    <ul class="releaseList">
        <li><strong>Animation</strong>: Adds powerful, easy to use animations to any element or control</li><li><strong>NoBot</strong>: Applies simple rules to prevent automated bots or scripts from posting to a page</li><li><strong>Slider</strong>: Adds an elegant scrollbar-like user interface for setting numeric values</li><li><strong>UpdatePanelAnimation</strong>: Animates page elements corresponding to hidden postback activity</li></ul>
    <p></p>
    <p>General Notes:</p>
    <p></p>
    <ul class="releaseList">
    <li><strong>Made Microsoft.AtlasControlExtender.dll functionality public and integrated it into AtlasControlToolkit.dll</strong></li><li><strong>Added animation framework that makes creating and running complex animations easy - see <asp:HyperLink ID="HyperLink8" runat="server" NavigateUrl="~/Walkthrough/UsingAnimations.aspx">Using animations</asp:HyperLink> for details</strong></li><li><strong>Fixed problem introduced in last release where extender entries in the properties window didn't expand when the '+' was clicked</strong></li><li>Significantly improved data binding implementation to avoid unnecessary problems</li><li>Changed load time of ClientState values to make them more easily accessible by extender code</li><li>Improved FindControlHelper implementation to enable it to successfully find controls in more scenarios</li><li>Added ASP.NET AJAX profile service support to the extender base class to make persisting values easier - see <asp:HyperLink ID="HyperLink5" runat="server" Text="Other neat stuff" NavigateUrl="~/Walkthrough/OtherNeatStuff.aspx"></asp:HyperLink> for details</li><li>Added CommonToolkitScripts.getCurrentStyle function to hide the cross-browser aspects of querying the current (computed) style of an element</li><li>Added DynamicPopulate*Base classes to make it easy to add DynamicPopulate functionality to any extender - see <asp:HyperLink ID="HyperLink6" runat="server" Text="Other neat stuff" NavigateUrl="~/Walkthrough/OtherNeatStuff.aspx"></asp:HyperLink> for details</li><li>Added PageRequestManagerID property to BehaviorBase to allow behaviors to easily hook up to partial update begin/end events - see <asp:HyperLink ID="HyperLink7" runat="server" Text="Other neat stuff" NavigateUrl="~/Walkthrough/OtherNeatStuff.aspx"></asp:HyperLink> for details</li><li>Modified all behaviors to raise ASP.NET AJAX's "PropertyChanged" event when any of their property values change</li><li>Revised Safari compatibility layer patching to allow event handler access of window.event (enabled by default by ASP.NET AJAX)</li><li>Improved handling of ID changes to controls that create extenders/properties</li><li>Added data binding support to Accordion to allow creation of panes from a data source</li><li>Modified CascadingDropDown to populate DropDownList.SelectedItem.Text so that both text and value can be accessed</li><li>CascadingDropDown now populates its DropDownList before Page_Load so the .SelectedValue will can be used in Page_Load</li><li>CascadingDropDown now supports 1:many parent:child relationships so that multiple CascadingDropDowns can have the same parent</li><li>ConfirmButton and ModalPopup updated to respect the "disabled" state of buttons and ignore disabled button clicks</li><li>Added Radius property to DropShadow extender for customizing the corner radius</li><li>HoverMenu, ModalPopup, and PopupControl now have DynamicPopulate functionality built-in (via the new DynamicPopulate*Base classes)</li><li>Improved ModalPopup behavior when used with UpdatePanels in order to avoid possible null dereferences</li><li>Added support for showing and hiding the ModalPopup display element from server-side code</li><li>PasswordStrength now supports customizable weightings of each password requirement class</li><li>PopupControl now works properly when its TargetControlID is within an UpdatePanel</li><li>PopupControl now supports .Commit calls specifying the empty string ("")</li><li>Reenabled postback mode for ReorderList to allow scenarios that require postbacks</li><li>Fixed ReorderList behavior when SortOrderField is set with a bound IList data source</li><li>ResizableControl implementation changed to work around some browser bugs that unnecessarily reloaded images</li><li>Fixed some cursor display issues when tabbing through TextBoxWatermark</li><li>Modified TextBoxWatermark to re-apply its watermark after UpdatePanel postbacks to avoid losing the watermark</li><li>Added ToggleButton support for disabled checkbox images by enabling different images for disabled checked/unchecked boxes</li><li>Other minor improvements throughout</li></ul>
    <p></p>
    <p>Breaking Changes</p>
    <p></p>
    <ul class="releaseList">
        <li>Removed obsolete Commit and Cancel method overrides of PopupControlExtender (were replaced by versions that do not take a Control parameter in the previous release)</li><li>Namespace of certain classes changed from "Microsoft.AtlasControlExtender" to "AtlasControlToolkit"</li><li>Removed GetAccordionPanes method on Accordion, replaced by Panes property. Existing pages may have a tag prefix on the Panes element (e.g. "&lt;cc1:Panes&gt;") that should be removed.</li></ul>
    <p></p>
    <p>Known Issues</p>
    <p></p>
    <ul class="releaseList">
        <li>No new issues</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.60731.0</strong></u></p>
    <p>New controls (see sample pages on left):</p>
    <p></p>
    <ul class="releaseList">
        <li><strong>DynamicPopulate</strong>: (Re-)populates any element with HTML content downloaded from the server.</li><li><strong>FilteredTextBox</strong>: Prevents unwanted characters from being typed into a text box.</li><li><strong>PagingBulletedList</strong>: Adds flexible paging and sorting to any bulleted list.</li><li><strong>PasswordStrength</strong>: Provides interactive feedback about the strength of a password being created.</li><li><strong>Rating</strong>: Displays a "4 out of 5 stars" interface for ranking.</li></ul>
    <p></p>
    <p>General Notes:</p>
    <p></p>
    <ul class="releaseList">
    <li><strong>Updated to include/support the ASP.NET AJAX July CTP release</strong></li><li>Added support for data binding in Extender properties declarations - see <asp:HyperLink ID="HyperLink3" runat="server" Text="Other neat stuff" NavigateUrl="~/Walkthrough/OtherNeatStuff.aspx"></asp:HyperLink> for details</li><li>Changed ASP.NET AJAX control registration behavior to better enable multiple extenders to hook up to the same element (example: ASP.NET AJAX's AutoComplete and Toolkit's TextBoxWatermark)</li><li>Added getCurrentStyle and getInheritedBackgroundColor helpers to CommonToolkitScripts object in Common.js to isolate the relevant browser-specific code</li><li>Modified AlwaysVisibleControl to use CSS "position:fixed" style on browsers that support it</li><li>Enabled AutoPostBack scenario for CascadingDropDown DropDownLists so that a submit button is no longer necessary</li><li>Added "LoadingText" property to CascadingDropDown for specifying the text to display as the DropDownList populates from the server</li><li>Changed DropShadow to match the visibility state of its target</li><li>Added ReorderList support for Array and IList data sources</li><li>Changed ReorderList to use callbacks instead of postbacks for a more seamless user experience</li><li>Simplified ReorderList hook-up process to make it even easier to use</li><li>Added RoundedCorners support for hooking up to elements with "width=x%"</li><li>Added get_Text and set_Text methods to TextBoxWatermark to support client-side script access to the text in a watermarked text box</li><li>Improved automated testing coverage</li><li>Added debug mode to automated test framework to make it easier to identify exceptions</li><li>Added support for firing keyboard events to automated test framework</li><li>Removed double-encoding of script references in generated XML Script</li><li>Other minor improvements throughout</li></ul>
    <p></p>
    <p>Breaking Changes</p>
    <p></p>
    <ul class="releaseList">
        <li>No breaking changes</li></ul>
    <p></p>
    <p>Known Issues</p>
    <p></p>
    <ul class="releaseList">
        <li>No new issues</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.60626.0</strong></u></p>
    <p>New controls (see sample pages on left):</p>
    <p></p>
    <ul class="releaseList">
        <li><strong>Accordion</strong>: Displays one pane at a time from a set of multiple panes.</li><li><strong>NumericUpDown</strong>: Lets you attach flexible up/down "spinners" to any TextBox.</li><li><strong>ResizableControl</strong>: Makes any control resizable.</li></ul>
    <p></p>
    <p>General Notes:</p>
    <p></p>
    <ul class="releaseList">
    <li><strong>Included custom test framework along with complete control tests - see <asp:HyperLink ID="HyperLink1" runat="server" Text="Automated Testing" NavigateUrl="~/Walkthrough/AutomatedTesting.aspx"></asp:HyperLink> for details</strong></li><li>Added ResolveControlID event to replace ResolveTargetControlID and enable page authors to identify controls that can't be located by the ExtenderControlBase class (e.g., because they're in an unusual naming container) - see <asp:HyperLink ID="HyperLink2" runat="server" Text="Other neat stuff" NavigateUrl="~/Walkthrough/OtherNeatStuff.aspx"></asp:HyperLink> for details</li><li>Moved getMarkupContext/removeObject workaround for ASP.NET AJAX dispose issue up to BehaviorBase script class; modified all behaviors to inherit from it</li><li>Changed the way ID properties are handled by the ExtenderControlBase class so that controls with IDs no longer cause problems in design mode</li><li>Modified ExtenderControlBase class to detect target controls marked Visible="false" and not render the corresponding Toolkit control</li><li>Fixed GetClientClassForControl method to match derived classes</li><li>Removed CollabpsibleContent UserControl from sample web site because it broke design mode; use CollapsiblePanel directly instead</li><li>Added "default value" setting to CascadingDropDown's CascadingDropDownNameValue class for specifying the default value</li><li>Fixed regression where CascadingDropDown DropDownList controls no longer fired the OnSelectedIndexChanged event</li><li>Fixed regression where CascadingDropDown's onXxxError methods weren't populating the error string correctly</li><li>Improved CollapsiblePanel sizing behavior</li><li>Fixed minor height miscalculation in DropShadow</li><li>Fixed ModalPopup bug where multiple background layers could be created</li><li>Improved ModalPopup popup technique to allow form controls within the popup to postback</li><li>Improved ModalPopup modality by disabling tab-able controls in the background</li><li>Worked around ModalPopup IE z-index issue by hiding dropdown controls in the background</li><li>Got PopupControl working within a repeater; improved server-side usability, general resiliency</li><li>Fixed various ReorderList functionality and sample issues</li><li>Added ItemsCollection to ReorderList</li><li>Fixed problem where using ToggleButton with AutoPostBack wasn't working</li><li>Improved ToggleButton decoy image tracking during page resize</li><li>Added "alt" image properties to ToggleButton images</li></ul>
    <p></p>
    <p>Breaking Changes</p>
    <p></p>
    <ul class="releaseList">
        <li>Removed obsolete ScriptReferenceCollection property (was replaced by RequiredScriptAttribte in previous release)</li></ul>
    <p></p>
    <p>Known Issues</p>
    <p></p>
    <ul class="releaseList">
        <li>No new issues</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.60504.0</strong></u></p>
    <p>New controls (see sample pages on left):</p>
    <p></p>
    <ul class="releaseList">
        <li><strong>AlwaysVisibleControl</strong>: Docks any panel to the browser edge so it remains visible all the time.</li><li><strong>DropShadow</strong>: Adds attractive drop shadows to any control on the page!</li><li><strong>ModalPopup</strong>: Shows styled modal UI without using HTML dialogs!</li><li><strong>RoundedCorners</strong>: Rounds the corners of any control for a clean, professional look.</li></ul>
    <p></p>
    <p>General Notes:</p>
    <p></p>
    <ul class="releaseList">
    <li>Significantly improved support for Apple's Safari web browser by fixing most issues
        (see known issues below)</li><li>Enabled strong-name signing for AtlasControlToolkit.dll</li><li>Added ID property to TargetPropertiesBase. This allows behaviors to be accessed
            directly from script using the "$object('id')" statement.</li><li>Added GetUniqueID helper for building unique behavior IDs for behaviors that need
            ideas and are used in repeaters.</li><li>Changed XMLScript generation to bind to specific control types where possible. Old
            version always generated "&lt;control id='controlId&gt;" for all control types.
            Now for known types (e.g. TextBox), "&lt;textBox id='controlId'&gt;" Will be generated,
            which allows access to ASP.NET AJAX control class (e.g. this.control is Sys.UI.TextBox
            instead of Sys.UI.Control).</li><li>CascadingDropDown can now call PageMethod as well as web services (Just leave the
            ServicePath property blank).</li><li>CascadingDropDown now has a "SelectedValue" property to predefine what's selected.
            Note this should be the text representation of the value (not the text) that you
            want to select</li><li>CascadingDropDown's usage of web service callbacks has been optimized</li><li>Added support for virtual paths in control properties (properties that use URLs
            can now use the "~/File.htm" representation)</li><li>Added RequiredPropertyAttribute to simplify EnsureValid logic</li><li>Added RequiredScriptAttribute to simplify control sharing, as well as the ability
        to specify another extender type in the attribute. Doing so will cause the
        referenced extender's scripts to be loaded before the scripts for the given control.
        This allows usage of other extenders classes in a custom extender's behavior.</li><li>Improved PopupControl user interaction behavior - now dismisses on click instead
        of mouse leave</li><li>Improved CollapsiblePanel behavior, added ImageControlID property for expand/collapse images. Will now properly handle initially hidden panels (they need overflow
        set to hidden) so they don't initially show.</li><li>Added Common.js file for sharing common control/script code. To reference
        this code, add [RequiredScripts(typeof(CommonToolkitScripts)] to your extender type.</li><li>Changed from overloading DisplayName to using dedicated ClientPropertyNameAttribute
        for matching property names on TargetPropertiesBase to the client name</li><li>Modified sample pages to use CollapsiblePanel for section </li>
    <li>Miscellaneous fixes and incorporation of user feedback to all controls</li></ul>
    <p></p>
    <p>Breaking Changes</p>
    <p></p>
    <ul class="releaseList">
        <li>RequiredScripts property on ExtenderControlBase has been deprecated. Move
            to RequiredScriptsAttribute before next refresh.</li><li>ToggleButton's image properties are now typed as string instead of System.Uri</li><li>DisplayNameAttribute no longer modifies the name for client properties. This
            functionality has been moved to the ClientPropertyNameAttribute</li><li>String properties no longer default to null if empty, but rather "".</li><li>For Safari compat, type prefix names must be all lower-case. The ExtenderBaseControl
            now enforces this. If your components stop working when you install this release,
            find the "<em>Sys.TypeDescriptor.addType</em>" call in your JS behavior file and
            change the first parameter value to be only lower case characters.</li></ul>
    <p></p>
    <p>Known Issues</p>
    <p></p>
    <ul class="releaseList">
        <li>Since UpdatePanels don't work on Safari, PopupControl won't be able to populate
            the textboxes upon closing.</li><li>Using behaviors directly through script. Adding the ID property to the behaviors
            made them very easy to access directly through script. If you are using the
            behaviors directly from script, changing properties after they have been initialized.</li><li>If you are writing a custom behavior that binds to a DropDownList, you may run into
            issues. The workaround is to override GetClientClassForControl on your extender
            class and return "control". Note this will prevent you from accessing Sys.UI.Select
            features on the control class that is attached to your behavior.</li><li>On Internet Explorer, using the DropShadow control you may see a brief flash when
            it is reparenting items inside of the target panel.</li><li>On Safari, tabbing out of a textbox doesn't appear to cause an "onblur" event.
            This interferes with TextBoxWatermark replacing the watermark if the user tabs through.
            Works fine with the mouse.</li><li>TextBoxWatermark watermark isn't cleared before submit on Safari</li><li>PopupControl doesn't dismiss reliably on Safari when the mouse is clicked outside
            the popup.</li></ul>
    <br />    

    <hr />
    <p><u><strong>Version 1.0.0.0</strong></u></p>
    <ul class="releaseList">
    <li>Initial release!</li><li>New controls:
    <ul class="releaseList">
    <li>CascadingDropDown: Easily link drop downs, complete with asynchronous population and no postbacks!</li><li>CollapsiblePanel:  This extender allows panels on your page to collapse and expand with no code.</li><li>ConfirmButton: This extender adds a confirm dialog to any Button, LinkButton, or ImageButton control.</li><li>DragPanel: Makes any panel into an object that you can drag around the page.</li><li>HoverMenu: Allows UI to pop up next to a control when the user hovers over it.</li><li>PopupControl: This extender turns any panel into a popup.</li><li>ReorderList: This control is a full-featured data-bound control that allows its elements to be reordered on the client via drag and drop.</li><li>TextBoxWatermark:  This extender adds "watermark" prompt text to TextBoxes on the page.</li><li>ToggleButton:  This extender turns an ASP.NET CheckBox into an image checkbox.</li></ul>
    </li>
    </ul>
</asp:Content>