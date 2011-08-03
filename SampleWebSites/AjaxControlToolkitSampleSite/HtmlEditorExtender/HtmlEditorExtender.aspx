<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="HTMLEditorExtender.aspx.cs" Inherits="HTMLEditorExtender" Title="HTMLEditorExtender Sample"
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">
            HTMLEditorExtender Demonstration</div>
        <asp:UpdatePanel ID="updatePanel1" runat="server">                    
            <ContentTemplate>                                
                <asp:TextBox runat="server" ID="txtBox1" TextMode="MultiLine" Columns="50" Rows="10"
                    Text="Hello <b>world!</b>" /><br />
                <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender1" TargetControlID="txtBox1"
                    runat="server">
                </ajaxToolkit:HtmlEditorExtender>
                <br />
                <br />

                <b>Below example with configurable toolbar:</b>
                <br />                
                <asp:TextBox runat="server" ID="txtBox2" TextMode="MultiLine" Columns="50" Rows="10"
                    Text="Hello <b>world!</b>" /><br />
                <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender2" TargetControlID="txtBox2"
                    runat="server">
                    <Toolbar>                        
                        <ajaxToolkit:Bold />
                        <ajaxToolkit:Italic />
                        <ajaxToolkit:Underline />
                        <ajaxToolkit:HorizontalSeparator />
                        <ajaxToolkit:JustifyLeft />
                        <ajaxToolkit:JustifyCenter />
                        <ajaxToolkit:JustifyRight />
                        <ajaxToolkit:JustifyFull />                                                
                        <ajaxToolkit:CreateLink />
                        <ajaxToolkit:UnLink />                                                
                    </Toolbar>
                </ajaxToolkit:HtmlEditorExtender>
                <br />
                <br />
                <asp:Button runat="server" Text="Submit content" ID="submit" />
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            HTMLEditorExtender Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            The HtmlEditorExtender is an ASP.NET AJAX Control that enables you to extend the
            standard ASP.NET TextBox control with support for rich formatting. For example,
            the HtmlEditorExtender enables users to apply bold, italic, underline, subscript,
            superscript, and different foreground and background color to text.
        </p>
        <br />
        <p>
            The HtmlEditorExtender
            control is very lightweight and takes advantage of HTML5. The new HtmlEditorExtender
            is compatible with IE6 and newer, and the latest versions of Mozilla Firefox, Google
            Chrome, and Apple Safari.
        </p>
        <br />
        <p>
            Furthermore, you can easily customize the
            toolbar buttons displayed by the HtmlEditorExtender. For example, you can customize
            the HtmlEditorExtender so that it displays only bold and italic buttons and no other
            buttons.
        </p>
        <br />

        <br />
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            HTMLEditorExtender Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The HtmlEditorExtender is initialized with this code. The <em>italic</em> properties
            are optional:</p>
        <pre>
        &lt;ajaxToolkit:HtmlEditorExtender ID="HtmlEditorExtender1" 
            TargetControlID="TextBox1" runat="server"/&gt;<em>
            &lt;Toolbar&gt; 
                &lt;ajaxToolkit:Undo /&gt;
                &lt;ajaxToolkit:Redo /&gt;
                &lt;ajaxToolkit:Bold /&gt;
                &lt;ajaxToolkit:Italic /&gt;
                &lt;ajaxToolkit:Underline /&gt;
                &lt;ajaxToolkit:StrikeThrough /&gt;
                &lt;ajaxToolkit:Subscript /&gt;
                &lt;ajaxToolkit:Superscript /&gt;
                &lt;ajaxToolkit:JustifyLeft /&gt;
                &lt;ajaxToolkit:JustifyCenter /&gt;
                &lt;ajaxToolkit:JustifyRight /&gt;
                &lt;ajaxToolkit:JustifyFull /&gt;
                &lt;ajaxToolkit:InsertOrderedList /&gt;
                &lt;ajaxToolkit:InsertUnorderedList /&gt;
                &lt;ajaxToolkit:CreateLink /&gt;
                &lt;ajaxToolkit:UnLink /&gt;
                &lt;ajaxToolkit:RemoveFormat /&gt;
                &lt;ajaxToolkit:SelectAll /&gt;
                &lt;ajaxToolkit:UnSelect /&gt;
                &lt;ajaxToolkit:Delete /&gt;
                &lt;ajaxToolkit:Cut /&gt;
                &lt;ajaxToolkit:Copy /&gt;
                &lt;ajaxToolkit:Paste /&gt;
                &lt;ajaxToolkit:BackgroundColorSelector /&gt;
                &lt;ajaxToolkit:ForeColorSelector /&gt;
                &lt;ajaxToolkit:FontNameSelector /&gt;
                &lt;ajaxToolkit:FontSizeSelector /&gt;
                &lt;ajaxToolkit:Indent /&gt;
                &lt;ajaxToolkit:Outdent /&gt;
                &lt;ajaxToolkit:InsertHorizontalRule /&gt;
                &lt;ajaxToolkit:HorizontalSeparator /&gt;
            &lt;/Toolbar&gt;</em>
        &lt;/ajaxToolkit:HtmlEditorExtender&gt;
            </pre>
        <ul>
            <li><strong>TargetControlId</strong> - ID of textbox to extend with htmlEditor.</li>
            <li><strong>Toolbar</strong> - This provides facility to customize toolbar as per requirement.
                This tag is optional and if user does not provide toolbar tag then by default all
                buttons will be populated in the toolbar. User must add at least 1 button in the
                toolbar tag. </li>
            <li><strong>SanitizerProvider</strong> - Returns the Sanitizer Provider or null when no
            Sanitizer Provider is configured.</li>

        </ul>
    </asp:Panel>


    <asp:Panel ID="Security_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Security_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            HtmlEditorExtender Security
        </div>
    </asp:Panel>
    <asp:Panel ID="Security_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
           We strongly recommend that you do not use the HtmlEditorExtender on a public website
           without using the AntiXSS Sanitizer Provider. If you do not use the AntiXss Sanitizer
           Provider then your website will be open to Cross-Site Scripting (XSS) Attacks. 
        </p>
        <br />
        <p>
        The AntiXSS Sanitizer Provider is included in the SanitizerProviders folder with the 
        CodePlex release of the Ajax Control Toolkit. You need to add a reference to all three
        assemblies contained in the folder: SanitizerProviders.dll, AntiXSSLibrary.dll, and 
        HtmlSanitizationLibrary.dll.
        </p>
        <br />
        <p>
        You must add the following configuration sections to your Web.config file to enable the
        provider:
        </p>
        <br />
        <pre>
&lt;configuration&gt;
&lt;configSections&gt;
  &lt;sectionGroup name="system.web"&gt;
	&lt;section name="sanitizer" 
      requirePermission="false" 
      type="AjaxControlToolkit.Sanitizer.ProviderSanitizerSection, 
        AjaxControlToolkit"/&gt;
      &lt;/sectionGroup&gt;
&lt;/configSections&gt;
&lt;system.web&gt;
	&lt;compilation targetFramework="4.0" debug="true"/&gt;
	&lt;sanitizer defaultProvider="AntiXssSanitizerProvider"&gt;
		&lt;providers&gt;
			&lt;add name="AntiXssSanitizerProvider" 
            type="AjaxControlToolkit.Sanitizer.
              AntiXssSanitizerProvider"&gt;&lt;/add&gt;
		&lt;/providers&gt;
	&lt;/sanitizer&gt;
&lt;/system.web&gt;
&lt;/configuration&gt;
        </pre>
        <br />
        <p>
        The AjaxControlToolkitSampleSite is configured to use the AntiXss Sanitizer Provider.
        </p>

    </asp:Panel>


     <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />    
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="False" ImageControlID="Properties_ToggleImage" />    
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeSecurity" runat="Server" TargetControlID="Security_ContentPanel"
        ExpandControlID="Security_HeaderPanel" CollapseControlID="Security_HeaderPanel"
        Collapsed="False" ImageControlID="Security_ToggleImage" />    


</asp:Content>
