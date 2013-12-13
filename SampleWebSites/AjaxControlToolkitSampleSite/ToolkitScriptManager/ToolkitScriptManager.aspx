<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    Title="ToolkitScriptManager"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    
    <style>
        .src_code {
            background-color: white;
            padding: 15px;
        }
    </style>
    <div class="heading">ToolkitScriptManager</div>
    <p>
        You must add a ToolkitScriptManager control to any page that contains Ajax Control Toolkit controls. The ToolkitScriptManager performs two main functions.</p>
    <p>
        <br />
    </p>
    <p>
        First, the ToolkitScriptManager handles dependency resolution. The ToolkitScriptManager is responsible for loading all of the JavaScript files required by a set of Ajax Control Toolkit controls.
    </p>
    <p>
        <br />
    </p>
    <p>
        Second, the ToolkitScriptManager is responsible for optimizing JavaScript and files. The ToolkitScriptManager combines, minifies, compresses and caches JavaScript files so that they can be delivered more efficiently to the browser.</p>
    <p>
        <br />
    </p>
    <p>
        To take full advantage of the ToolkitScriptManager, and get the best performance out of a website that uses the Ajax Control Toolkit, you need to understand two features of the ToolkitScriptManager: the CombineScripts HTTP Handler and control bundles.</p>
    <div class="heading">Using the CombineScripts Handler</div>

    <p>
        The ToolkitScriptManager caches all JavaScript files with a far future cache header. JavaScript files are cached for one year into the future. Caching with a far future cache header has a dramatic impact on performance because it means that scripts need to be downloaded only when someone first visits your website.</p>
    <p>
        <br />
    </p>
    <p>
        The ToolkitScriptManager serves the cached files with a version query string. If you change any of the cached JavaScript files then the version query string is changed and browsers will load the new versions of the files. All of this works automatically.</p>
    <p>
        <br />
    </p>
    <p>
        To take full advantage of caching, you should register the Ajax Control Toolkit CombineScripts HTTP Handler in your web.config file in both the &lt;httpHandlers&gt; and &lt;system.webServer&gt; sections of your root web.config file like this:</p>
    <p>
        <br />
    </p>
    <div class="src_code">
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;</font><font color="#a31515" face="Consolas, serif" size="2">system.web</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">httpHandlers</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;!--</font><font color="#008000" face="Consolas, serif" size="2"> Using CombineCriptsHandler.axd as path of handler </font><font color="#0000ff" face="Consolas, serif" size="2">--&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">add</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">verb</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">*</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">path</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">CombineScriptsHandler.axd</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font></p>
    <p>
        <font color="#ff0000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<font face="Consolas, serif" size="2">type</font></font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">AjaxControlToolkit.CombineScriptsHandler,</font></p>
    <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;AjaxControlToolkit</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2"> /&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;/</font><font color="#a31515" face="Consolas, serif" size="2">httpHandlers</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">system.web</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <br />
    </p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;</font><font color="#a31515" face="Consolas, serif" size="2">system.webServer</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">validation</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">validateIntegratedModeConfiguration</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">false</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2"> /&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">handlers</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;!--</font><font color="#008000" face="Consolas, serif" size="2"> Using CombineCriptsHandler as name of handler </font><font color="#0000ff" face="Consolas, serif" size="2">--&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">add</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">CombineScriptsHandler</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">verb</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">*</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&nbsp; </font></p>
        <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <font color="#ff0000" face="Consolas, serif" size="2">&nbsp;path</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">CombineScriptsHandler.axd</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font></p>
    <p>
        &nbsp;<font color="#ff0000" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; type</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">AjaxControlToolkit.CombineScriptsHandler,</font></p>
        <p>
            <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; AjaxControlToolkit</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2"> /&gt;</font></p>
    <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <font color="#0000ff" face="Consolas, serif" size="2">&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">handlers</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">system.webServer</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    </div>
    <p>
        &nbsp;</p>
    <p>
        To make it easier to debug your scripts, Combining, minification, compression, and caching are enabled only in Release mode. You can enable Release mode in your web.config file by setting debug=”false” like this:</p>
    <p>
        &nbsp;</p>
    <div class="src_code">
        <font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&lt;</font></font><font color="#a31515" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">compilation</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> </font></font><font color="#ff0000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">debug</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">=</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">false</font></font><font color="#000000" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt">&quot;</font></font><font color="#0000ff" face="Consolas, sans-serif"><font size="2" style="font-size: 9pt"> /&gt;</font></font></div>
    <p>
        &nbsp;</p>
    <p>
        Alternatively, you can enable Release mode with the ToolkitScriptManager like this:</p>
    <p>
        &nbsp;</p>
    <div class="src_code">
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;</font><font color="#800000" face="Consolas, serif" size="2">ajaxToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">:</font><font color="#800000" face="Consolas, serif" size="2">ToolkitScriptManager</font><font color="#0000ff" face="Consolas, serif" size="2">
        <br />
&nbsp;&nbsp; </font><font color="#ff0000" face="Consolas, serif" size="2">runat</font><font color="#0000ff" face="Consolas, serif" size="2">=&quot;server&quot; </font><font color="#ff0000" face="Consolas, serif" size="2">
        <br />
&nbsp;&nbsp; ID</font><font color="#0000ff" face="Consolas, serif" size="2">=&quot;ScriptManager1&quot; 
        <br />
&nbsp;&nbsp; <font color="#ff0000" face="Consolas, serif" size="2">
        ScriptMode</font>=&quot;Release&quot; /&gt;</font></div>
    <div class="heading">Using Control Bundles</div>
    <p>
        By default, the ToolkitScriptManager combines all of the scripts required by the entire Ajax Control Toolkit and -- after minifying and compressing the combined scripts -- serves the combined script to the browser. If you are using a subset of Ajax Control Toolkit controls in your web application then you might want to deliver only the scripts that you really need.</p>
    <p>
        <br />
    </p>
    <p>
        For example, if you only need to use the Ajax Control Toolkit Accordion extender in your web application then you might not want to include all of the JavaScript files required by other Ajax Control Toolkit controls such as the MaskedEdit and ToggleButton controls.</p>
    <p>
        <br />
    </p>
    <p>
        Or, your web application might be organized into different sections. You might want to use different subsets of the Ajax Control Toolkit controls on different pages.</p>
    <p>
        <br />
    </p>
    <p>
        You can control how the ToolkitScriptManager combines scripts by defining one or more <i>control bundles</i>. You define control bundles in a configuration file named AjaxControlTookit.config that you place in the root of your application. For example, the following AjaxControlToolkit.config file defines three control bundles:</p>
    <p>
        <br />
    </p>
    <div class="src_code">
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;</font><font color="#a31515" face="Consolas, serif" size="2">ajaxControlToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">controlBundles</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <br />
    </p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;!-- </font><font color="#008000" face="Consolas, serif" size="2">works for most pages</font><font color="#000000" face="Consolas, serif" size="2"> </font><font color="#0000ff" face="Consolas, serif" size="2">--&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">controlBundle</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">AccordionExtender</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">CalendarExtender</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">HtmlEditorExtender</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/</font><font color="#a31515" face="Consolas, serif" size="2">controlBundle</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <br />
    </p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;!-- </font><font color="#008000" face="Consolas, serif" size="2">Works for pages that use only AccordionExtender</font><font color="#000000" face="Consolas, serif" size="2"> </font><font color="#0000ff" face="Consolas, serif" size="2">--&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">controlBundle</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">Group1</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">AccordionExtender</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/</font><font color="#a31515" face="Consolas, serif" size="2">controlBundle</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <br />
    </p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;!--</font><font color="#008000" face="Consolas, serif" size="2"> Works for pages that use only CalendarExtender and </font></p>
        <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <font color="#008000" face="Consolas, serif" size="2"> HtmlEditorExtender </font><font color="#0000ff" face="Consolas, serif" size="2">--&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">controlBundle</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">Group2</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">CalendarExtender</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">HtmlEditorExtender</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/</font><font color="#a31515" face="Consolas, serif" size="2">controlBundle</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <br />
    </p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;/</font><font color="#a31515" face="Consolas, serif" size="2">controlBundles</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">ajaxControlToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font>
        </div>
    
    <p><br/></p>
    <p>
        The first control bundle includes the AccordionExtender, CalendarExtender, and HtmlEditorExtender controls. This bundle combines all of the JavaScript and Cascading Style Sheet files required by these three controls. Because this first control bundle does not have a name, it is the default control bundle.</p>
    <p>
        <br />
    </p>
    <p>
        You don’t need to do anything special to use the default bundle. If you declare a ToolkitScriptManager without specifying a control bundle then the default bundle is used automatically:</p>
    <p>
        <br />
    </p>
    <div class="src_code">
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;</font><font color="#800000" face="Consolas, serif" size="2">ajaxToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">:</font><font color="#800000" face="Consolas, serif" size="2">ToolkitScriptManager</font><font color="#0000ff" face="Consolas, serif" size="2">
        <br />
&nbsp;&nbsp; </font><font color="#ff0000" face="Consolas, serif" size="2">runat</font><font color="#0000ff" face="Consolas, serif" size="2">=&quot;server&quot; </font><font color="#ff0000" face="Consolas, serif" size="2">
        <br />
&nbsp;&nbsp; ID</font><font color="#0000ff" face="Consolas, serif" size="2">=&quot;ScriptManager1&quot; /&gt;</font></div>
    <p>
        <br />
    </p>
    <p>
        The second control bundle contains a single control. This bundle only contains the scripts and Cascading Style Sheet files required to use the Accordion extender. This second bundle has the name Group1. Here’s how you would use the Group1 control bundle with the ToolkitScriptManager:</p>
    <p>
        <br />
    </p>
    <div class="src_code">
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;</font><font color="#800000" face="Consolas, serif" size="2">ajaxToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">:</font><font color="#800000" face="Consolas, serif" size="2">ToolkitScriptManager</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">runat</font><font color="#0000ff" face="Consolas, serif" size="2">=&quot;server&quot;</font></p>
        <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <font color="#ff0000" face="Consolas, serif" size="2">ID</font><font color="#0000ff" face="Consolas, serif" size="2">=&quot;ScriptManager1&quot;&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;</font><font color="#800000" face="Consolas, serif" size="2">ControlBundles</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#800000" face="Consolas, serif" size="2">ajaxToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">:</font><font color="#800000" face="Consolas, serif" size="2">ControlBundle</font><font color="#000000" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">Name</font><font color="#0000ff" face="Consolas, serif" size="2">=&quot;Group1&quot;/&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;/</font><font color="#800000" face="Consolas, serif" size="2">ControlBundles</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;/</font><font color="#800000" face="Consolas, serif" size="2">ajaxToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">:</font><font color="#800000" face="Consolas, serif" size="2">ToolkitScriptManager</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    </div>
        <p>
        <br />
    </p>
    <p>
        Finally, the third control bundle includes both the Calendar extender and the HtmlEditor extender controls. This final bundle has the name Group2. Here’s how you would use the Group2 control bundle with the ToolkitScriptManager:</p>
    <p>
        <br />
    </p>
    <div class="src_code">
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;</font><font color="#800000" face="Consolas, serif" size="2">ajaxToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">:</font><font color="#800000" face="Consolas, serif" size="2">ToolkitScriptManager</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">runat</font><font color="#0000ff" face="Consolas, serif" size="2">=&quot;server&quot;</font></p>
        <p>
            <font color="#ff0000" face="Consolas, serif" size="2">&nbsp;&nbsp; ID</font><font color="#0000ff" face="Consolas, serif" size="2">=&quot;ScriptManager1&quot;&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;</font><font color="#800000" face="Consolas, serif" size="2">ControlBundles</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#800000" face="Consolas, serif" size="2">ajaxToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">:</font><font color="#800000" face="Consolas, serif" size="2">ControlBundle</font><font color="#000000" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">Name</font><font color="#0000ff" face="Consolas, serif" size="2">=&quot;Group2&quot;/&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;/</font><font color="#800000" face="Consolas, serif" size="2">ControlBundles</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;/</font><font color="#800000" face="Consolas, serif" size="2">ajaxToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">:</font><font color="#800000" face="Consolas, serif" size="2">ToolkitScriptManager</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    </div>
        <p>
        <br />
    </p>
    <p>
        You can use control bundles with custom controls. When including a custom control in a bundle, you must also provide the name of the custom control’s assembly. For example, the following control bundle includes a custom control named AcmeHtmlEditor:</p>
    <p>
        <br />
    </p>
    <div class="src_code">
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;</font><font color="#a31515" face="Consolas, serif" size="2">ajaxControlToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">controlBundles</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">controlBundle</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">AccordionExtender</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">CalendarExtender</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;!--</font><font color="#008000" face="Consolas, serif" size="2"> Use custom control in bundle </font><font color="#0000ff" face="Consolas, serif" size="2">--&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2"> </font><font color="#ff0000" face="Consolas, serif" size="2">name</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">AcmeHtmlEditor</font><font color="#000000" face="Consolas, serif" size="2">&quot; </font></p>
        <p>
        &nbsp; <font color="#ff0000" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; assembly</font><font color="#0000ff" face="Consolas, serif" size="2">=</font><font color="#000000" face="Consolas, serif" size="2">&quot;</font><font color="#0000ff" face="Consolas, serif" size="2">AcmeToolkit</font><font color="#000000" face="Consolas, serif" size="2">&quot; </font><font color="#0000ff" face="Consolas, serif" size="2">&gt;&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">control</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/</font><font color="#a31515" face="Consolas, serif" size="2">controlBundle</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&nbsp;&nbsp; &lt;/</font><font color="#a31515" face="Consolas, serif" size="2">controlBundles</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    <p>
        <font color="#0000ff" face="Consolas, serif" size="2">&lt;/</font><font color="#a31515" face="Consolas, serif" size="2">ajaxControlToolkit</font><font color="#0000ff" face="Consolas, serif" size="2">&gt;</font></p>
    </div>


    <div class="heading">Including and Excluding Scripts</div>
    <p>
        You can use &lt;add&gt; and &lt;remove&gt; elements in the AjaxControlToolkit.config file to exclude or
        include a particular JavaScript script from a control bundle. For example, imagine that you want
        to include Twitter Bootstrap in your control bundle. In that case, you can add the following &lt;add&gt; element
        to your AjaxControlToolkit.config file:
    </p>

<pre style="font-family:Consolas;font-size:16;color:black;background:white;"><span style="color:blue;">&lt;</span><span style="color:maroon;">ajaxControlToolkit</span><span style="color:blue;">&gt;</span>
 <span style="color:blue;">&lt;</span><span style="color:maroon;">scripts</span><span style="color:blue;">&gt;</span>
   <span style="color:blue;">&lt;</span><span style="color:maroon;">add</span> <span style="color:red;">name</span><span style="color:blue;">=</span><span style="color:blue;">&quot;MyApp.Scripts.bootstrap.js.bootstrap.js&quot;</span> 
       <span style="color:red;">assembly</span><span style="color:blue;">=</span><span style="color:blue;">&quot;MyApp&quot;</span><span style="color:blue;">/&gt;</span>
 <span style="color:blue;">&lt;/</span><span style="color:maroon;">scripts</span><span style="color:blue;">&gt;</span> 
 
     ...
 
<span style="color:blue;">&lt;/</span><span style="color:maroon;">ajaxControlToolkit</span><span style="color:blue;">&gt;</span>
</pre>

    <p>
        In the code above, you should replace <i>MyApp</i> with the name of your Web Forms application.
    </p>

    <br />

    <p>
        To get this to work, you need to embed the bootstrap.js file in your Web Forms application's assembly.  Open the Properties
        window for the bootstrap.js JavaScript file in your project and set its
        Build Action to the value <i>Embedded Resource</i>. Finally, add the following attribute to your Global.asax file:
    </p>

    <pre>
[assembly: System.Web.UI.WebResource(
        "MyApp.Scripts.bootstrap.js.bootstrap.js", 
        "application/x-javascript")]
    </pre>

    <p>
        After you complete these steps, Twitter Bootstrap will be included in your JavaScript bundle (compressed, minified, bundled,
        and far future cached).
    </p>
    <br />

    <p>
        The ability to remove scripts from a control bundle is useful when you want to use your own version of jQuery
        with the Ajax Control Toolkit. To learn more about using jQuery with the Ajax Control Toolkit, read
        <a href="../Walkthrough/UsingJQuery/UsingJQuery.aspx">Using jQuery with the Ajax Control Toolkit</a>
    </p>



    <div class="heading">How It Works</div>
    <p>
        The ToolkitScriptManager uses four attributes to determine which scripts and Cascading Style Sheet files to load and combine. These attributes are server-side attributes applied to Ajax Control Toolkit controls:</p>
    <p>
        <br />
    </p>
    <ul>
        <li>
            <p>
                ClientScriptResource – This attribute represents a JavaScript file that has been embedded in an assembly.</p>
        </li>
        <li>
            <p>
                ClientCssResource – This attribute represents a Cascading Style Sheet file that has been embedded in an assembly.</p>
        </li>
        <li>
            <p>
                RequiredScript – This attribute loads all of the scripts required by a class or a control.
            </p>
        </li>
        <li>
            <p>
                ScriptCombine – This attribute can be used to prevent a JavaScript file from being combined with other JavaScript files.
            </p>
        </li>
    </ul>
    <p>
        <br />
    </p>
    <p>
        For example, the Calendar extender control includes the following attributes:</p>
    <p>
        <br />
    </p>
    <div class="src_code">
    <p>
        <font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">[</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">ClientScriptResource</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#a31515" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">&quot;Sys.Extended.UI.CalendarBehavior&quot;</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">, </span></font></font>
    </p>
        <p>
        &nbsp;&nbsp;&nbsp;&nbsp; <font color="#a31515" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">&quot;Calendar.CalendarBehavior.js&quot;</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">)]
        </span></font></font>
    </p>
    <p>
        <font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">[</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">ClientCssResource</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#a31515" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">&quot;Calendar.Calendar_resource.css&quot;</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">)]</span></font></font></p>
    <p>
        <font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">[</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">RequiredScript</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#0000ff" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">typeof</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">CommonToolkitScripts</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">), 0)]</span></font></font></p>
    <p>
        <font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">[</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">RequiredScript</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#0000ff" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">typeof</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">DateTimeScripts</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">), 1)]</span></font></font></p>
    <p>
        <font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">[</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">RequiredScript</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#0000ff" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">typeof</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">PopupExtender</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">), 2)]</span></font></font></p>
    <p>
        <font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">[</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">RequiredScript</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#0000ff" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">typeof</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">AnimationScripts</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">), 3)]</span></font></font></p>
    <p>
        <font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">[</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">RequiredScript</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#0000ff" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">typeof</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">(</span></font></font><font color="#2b91af" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">ThreadingScripts</span></font></font><font color="#000000" face="Consolas, serif"><font size="2" style="font-size: 9pt"><span style="background: #ffffff">), 4)]</span></font></font></p>
    </div>
        <p>
        <br />
    </p>
    <p>
        When the ToolkitScriptManager loads the scripts required by the Calendar extender, it loads the scripts specified by the ClientScriptResource and RequiredScript attributes. In particular, it loads the Calendar.CalenderBehavior.js JavaScript file and all of the JavaScript files required by the CommonToolkitScripts, DateTimeScripts, PopupExtender, AnimationScripts, and ThreadingScripts classes.</p>
    <p>
        <br />
    </p>
    <p>
        Notice that the RequiredScript attribute accepts a number. This number represents the order in which the scripts are loaded.</p>
    <p>
        <br />
    </p>
    <p>
        <a name="_GoBack"></a>If you want to create a custom control that works with the ToolkitScriptManager then you need to add these four attributes to your control.</p>
    </asp:Content>