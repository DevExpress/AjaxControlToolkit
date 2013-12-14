<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    Title="Using jQuery with the Ajax Control Toolkit" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    

    
    <ajaxToolkit:ToolkitScriptManager id="ScriptManager1"
        EnablePartialRendering="true" runat="server">
        <Scripts>
            <%--<asp:ScriptReference 
                Path="~/Scripts/jquery-2.0.3.js"/>--%>
            <asp:ScriptReference 
                Path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.0.3.js"/>
        </Scripts>
    </ajaxToolkit:ToolkitScriptManager>


    <p>
        The Ajax Control Toolkit and jQuery play nicely together. In fact, some of the Ajax Control
        Toolkit controls &mdash; such as the ToggleButton and Tabs controls &mdash; were written using jQuery.
        This page describes how you can use the Ajax Control Toolkit with a website that is already using jQuery.
    </p>



                <div class="heading">Including a jQuery Script Reference in the ToolkitScriptManager</div>


<pre style="font-family:Consolas;font-size:16;color:black;background:white;">    
<span style="color:blue;">&lt;</span><span style="color:maroon;">ajaxToolkit</span><span style="color:blue;">:</span><span style="color:maroon;">ToolkitScriptManager</span> <span style="color:red;">id</span><span style="color:blue;">=</span><span style="color:blue;">&quot;ScriptManager1&quot;</span>
    <span style="color:red;">EnablePartialRendering</span><span style="color:blue;">=</span><span style="color:blue;">&quot;true&quot;</span> <span style="color:red;">runat</span><span style="color:blue;">=</span><span style="color:blue;">&quot;server&quot;</span><span style="color:blue;">&gt;</span>
    <span style="color:blue;">&lt;</span><span style="color:maroon;">Scripts</span><span style="color:blue;">&gt;</span>
        <span style="background:yellow;">&lt;%</span><span style="color:darkgreen;">--&lt;asp:ScriptReference 
            Path=&quot;~/Scripts/jquery-1.9.1.js&quot;/&gt;--</span><span style="background:yellow;">%&gt;</span>
        <span style="color:blue;">&lt;</span><span style="color:maroon;">asp</span><span style="color:blue;">:</span><span style="color:maroon;">ScriptReference</span> 
            <span style="color:red;">Path</span><span style="color:blue;">=</span><span style="color:blue;">&quot;http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.0.3.js&quot;</span><span style="color:blue;">/&gt;</span>
    <span style="color:blue;">&lt;/</span><span style="color:maroon;">Scripts</span><span style="color:blue;">&gt;</span>
<span style="color:blue;">&lt;/</span><span style="color:maroon;">ajaxToolkit</span><span style="color:blue;">:</span><span style="color:maroon;">ToolkitScriptManager</span><span style="color:blue;">&gt;</span>
</pre>





                    <div class="demoarea">
                        jQuery Ajax Control Toolkit version (actJQuery): <strong class="currentACTJQueryVersion"></strong>
                        <br/>
                        jQuery dollar sign ($) version: <strong class="currentJQueryVersion"></strong>
                    </div>

                    <br />
                    <p>        
                        The Ajax Control Toolkit uses a particular version of jQuery. Currently, the Ajax Control
                        Toolkit uses jQuery version <strong class="currentACTJQueryVersion"></strong>.
                    </p>
                        <br />
                    <p>
                        You can use another version of jQuery in the same page as the Ajax Control
                        Toolkit without creating a conflict. The Ajax Control Toolkit uses the jQuery.noConflict() method 
                        to prevent conflicts with other versions of jQuery in the same page. The version of jQuery
                        used by the Ajax Control Toolkit is assigned to a variable named actJQuery. 
                    </p>
                        <br />
                    <p>
                        For example, in the code above, the ToolkitScriptManager is used to add a reference to
                        jQuery version 2.0.3 from the Microsoft Ajax CDN. You can use this version of jQuery 
                        in the page by using the standard jQuery $ variable or the standard <i>jQuery</i> variable.  
                        Because the Ajax Control Toolkit uses actJQuery and not $, the Ajax Control Toolkit does not
                        conflict with existing versions of jQuery used in a website.
                    </p>
                        <br />

 
                <div class="heading">Preventing jQuery from Loading Twice</div>               
                <p>
                    So by default, the Ajax Control Toolkit will not conflict with any existing version of jQuery used in your application. However, this does
                    mean that if you are already using jQuery in your application then jQuery will be loaded twice. For performance reasons, you might want
                    to avoid loading the jQuery library twice.
                </p>
                    <br />

                <p>
                    By taking advantage of the &lt;remove&gt; element in the AjaxControlToolkit.config file, you can prevent the Ajax Control Toolkit from
                    loading its version of jQuery. 
                </p>
                    <br />
 
    
<pre style="font-family:Consolas;font-size:16;color:black;background:white;">    
<span style="color:blue;">&lt;</span><span style="color:maroon;">ajaxControlToolkit</span><span style="color:blue;">&gt;</span> 
   <span style="color:blue;">&lt;</span><span style="color:maroon;">scripts</span><span style="color:blue;">&gt;</span> 
     <span style="color:blue;">&lt;</span><span style="color:maroon;">remove</span> <span style="color:red;">name</span><span style="color:blue;">=</span><span style="color:blue;">&quot;jQuery.jQuery.js&quot;</span><span style="color:blue;">/&gt;</span>
   <span style="color:blue;">&lt;/</span><span style="color:maroon;">scripts</span><span style="color:blue;">&gt;</span>

   ...

<span style="color:blue;">&lt;/</span><span style="color:maroon;">ajaxControlToolkit</span><span style="color:blue;">&gt;</span> 

</pre>

    <p>
        (Be careful here, the name of the script is case-sensitive) 

    </p>
    <br />

    <p>
        If you remove jQuery then it is your responsibility to add the exact same version of jQuery back into your application 
        by using either the ToolkitScriptManager or adding a &lt;script&gt; tag that loads jQuery. Also, if you use a 
        &lt;script&gt; tag then you need to be careful to add jQuery before the opening server-side &lt;form&gt; tag.
    </p>
    <br />

    <p>
        The Ajax Control Toolkit is tested against the particular version of jQuery that is bundled with the Ajax Control Toolkit. 
        Currently, the Ajax Control Toolkit uses jQuery version <strong class="currentACTJQueryVersion"></strong>.  If you attempt
        to use a different version of jQuery with the Ajax Control Toolkit then we will throw an exception at you.
    </p>
        <br />

                
            

        <script type="text/javascript">

            $('.currentACTJQueryVersion').html(actJQuery.fn.jquery);
            $('.currentJQueryVersion').html($.fn.jquery);

        </script>









</asp:Content>
