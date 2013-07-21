<%@ Page Language="C#" 
         MasterPageFile="~/DefaultMaster.master"
         AutoEventWireup="true" 
         Inherits="CommonPage" Theme="SampleSiteTheme" %>

<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<%@ Register TagPrefix="custom" Namespace="CustomControlDemo" Assembly="CustomControlDemo" %>


<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" />
    <style>
        .code-example {
            font-size: 9.5pt;
            font-family: Consolas;
            white-space: nowrap;
            overflow-x: scroll;
            max-width: 431px;
        }
    </style>

    <div class="walkthrough">
        <div class="heading">Combine custom control script</div>
    
    
        <p>
            <span>
                You can create your own ASP.NET Web server control and combine the scripts of your custom control
                along with combined script in ToolkitScriptManager by using <b>ClientScriptResource</b> attribute or <b>RequiredScript</b> attribute.
            </span>
            <br/><br/>
            <span>
                For example we want to create ASP.NET Web server control based on walkthrough from <a href="http://msdn.microsoft.com/en-us/library/yhzc935f(v=vs.100).aspx">this MSDN library</a>.
                Here's the explanation from MSDN about what we're going to create in this walkthrough: <br/>
                <code>
                    You will create a simple control that derives from the standard Label control. 
                    The control is named WelcomeLabel. It appends the user's name to the text string that is defined in the Text property. For example, if the page developer sets "Hello" as the value of the Text property, the WelcomeLabel control renders "Hello, userName!"
                    <br/><br/>
                    The control defines a DefaultUserName property that specifies the user name value to use when the user is not logged in. For example, if the page developer sets the Text property to "Hello" and the DefaultUserName property to "Guest", the control displays "Hello Guest!" if the user is not logged in.
                </code>
            </span>
            <span>
                Now we want to modify this custom control, so when user clicks the label there will be a message box appears and says "You've been clicked!" as shown bellow: 
            </span>
        </p>
        <br/>
        <div class="demoarea">
            <custom:WelcomeLabel ID="WelcomeLabel1" runat="server" Text="Welcome" DefaultUserName="Guest"></custom:WelcomeLabel>
        </div>
        <div class="demobottom"></div>
        
        <div class="heading">How to do that?</div>
        <ol>
            <li>Follow the instructions from <a href="http://msdn.microsoft.com/en-us/library/yhzc935f(v=vs.100).aspx" title="Developing and Using a Custom Web Server Control">http://msdn.microsoft.com/en-us/library/yhzc935f(v=vs.100).aspx walkthrough</a> about <b>Developing and Using a Custom Web Server Control.</b></li>
            <li>Add Javascript file on your project, naming it <b>WelcomeLabel.js</b>.</li>
            <li>Fill the content of <b>WelcomeLabel.js</b> script to be like this:
                <code class="code-example">
                    <p >
                        <span >(</span><span style="color: blue; background: white">function</span><span > () {</span></p>
                    <p >
                        <span ><span >&nbsp;&nbsp;&nbsp; </span>window.welcomeLabel = {</span></p>
                    <p >
                        <span ><span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>init: </span><span style="color: blue; background: white">function</span><span > (id) {</span></p>
                    <p >
                        <span ><span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">var</span><span > element = document.getElementById(id);</span></p>
                    <p >
                        <span ><span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>$common.setStyle(element, { cursor: </span><span style="color: #A31515; background: white">&#39;pointer&#39;</span><span > });</span></p>
                    <p >
                        <span ><span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>element.onclick = </span><span style="color: blue; background: white">function</span><span > () {</span></p>
                    <p >
                        <span ><span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>alert(</span><span style="color: #A31515; background: white">&quot;You&#39;ve been clicked!&quot;</span><span >);</span></p>
                    <p >
                        <span ><span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>};</span></p>
                    <p >
                        <span ><span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>}</span></p>
                    <p >
                        <span ><span >&nbsp;&nbsp;&nbsp; </span>};</span></p>
                    <p >
                        <span style="color: black; background: white">})();</span></p>
                </code>
            </li>
            <li>Set the Build Action of <b>WelcomeLabel.js</b> as an Embedded Resource.</li>
            <li>Add <b>AjaxControlToolkit.dll</b> as reference.</li>
            <li>
                Open <b>WelcomeLabel.cs</b> file and modify it to be like this:
                <br />
                <code class="code-example">
                    <p>
                        <span style="color: blue; background: white">using</span><span > System;</span></p>
                    <p>
                        <span style="color: blue; background: white">using</span><span > System.ComponentModel;</span></p>
                    <p>
                        <span style="color: blue; background: white">using</span><span > System.Web.UI;</span></p>
                    <p>
                        <span style="color: blue; background: white">using</span><span > System.Web.UI.WebControls;</span></p>
                    <p>
                        <span style="color: blue; background: white">using</span><span > AjaxControlToolkit;</span></p>
                    <p>
                        <span >&nbsp;</span></p>
                    <p>
                        <span >[</span><span style="color: blue; background: white">assembly</span><span >: </span><span style="color: #2B91AF; background: white">WebResource</span><span >(</span><span style="color: #A31515; background: white">&quot;CustomControlDemo.WelcomeLabel.js&quot;</span><span >, </span><span style="color: #A31515; background: white">
                                                                                                                                                                                                                                                                                                                            &quot;text/javascript&quot;</span><span >)]</span></p>
                    <p>
                        <span >&nbsp;</span></p>
                    <p>
                        <span style="color: blue; background: white">namespace</span><span > CustomControlDemo</span></p>
                    <p>
                        <span >{</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp; </span></span><span style="color: gray; background: white">///</span><span style="color: green; background: white"> </span><span style="color: gray; background: white">&lt;summary&gt;</span><span ></span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp; </span></span><span style="color: gray; background: white">///</span><span style="color: green; background: white"> Modified from MSDN Example code http://msdn.microsoft.com/en-us/library/yhzc935f(v=vs.100).aspx.</span><span ></span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp; </span></span><span style="color: gray; background: white">///</span><span style="color: green; background: white"> </span><span style="color: gray; background: white">&lt;/summary&gt;</span><span ></span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp; </span>[</span><span style="color: #2B91AF; background: white">DefaultProperty</span><span >(</span><span style="color: #A31515; background: white">&quot;Text&quot;</span><span >)]</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp; </span>[</span><span style="color: #2B91AF; background: white">ToolboxData</span><span >(</span><span style="color: #A31515; background: white">&quot;&lt;{0}:WelcomeLabel runat=server&gt;&lt;/{0}:WelcomeLabel&gt;&quot;</span><span >)]</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp; </span>[</span><span style="color: #2B91AF; background: white">RequiredScript</span><span >(</span><span style="color: blue; background: white">typeof</span><span >(</span><span style="color: #2B91AF; background: white">CommonToolkitScripts</span>))]</p>
                    <p>
                        <span >
                            &nbsp;&nbsp;&nbsp; [</span><span style="color: #2B91AF; background: white">ClientScriptResource</span><span >(</span><span style="color: blue; background: white">null</span><span >, </span><span style="color: #A31515; background: white">&quot;CustomControlDemo.WelcomeLabel.js&quot;</span><span >]</span>
                    </p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">public</span><span > </span><span style="color: blue; background: white">class</span><span > </span><span style="color: #2B91AF; background: white">WelcomeLabel</span><span > : </span>
                        <span style="color: #2B91AF; background: white">Label</span><span ></span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp; </span>{</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>[</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: #2B91AF; background: white">Bindable</span><span >(</span><span style="color: blue; background: white">true</span><span >),</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: #2B91AF; background: white">Category</span><span >(</span><span style="color: #A31515; background: white">&quot;Appearance&quot;</span><span >),</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: #2B91AF; background: white">DefaultValue</span><span >(</span><span style="color: #A31515; background: white">&quot;&quot;</span><span >),</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: #2B91AF; background: white">Description</span><span >(</span><span style="color: #A31515; background: white">&quot;The text to display when the user is not logged in.&quot;</span><span >),</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: #2B91AF; background: white">Localizable</span><span >(</span><span style="color: blue; background: white">true</span><span >)</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>]</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">public</span><span > </span><span style="color: blue; background: white">virtual</span><span > </span><span style="color: blue; background: white">string</span><span > DefaultUserName</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>{</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">get</span><span ></span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>{</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">string</span><span > s = (</span><span style="color: blue; background: white">string</span><span >)ViewState[</span><span style="color: #A31515; background: white">&quot;DefaultUserName&quot;</span><span >];</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;</span></span><span style="color: blue; background: white">return</span><span > (s == </span><span style="color: blue; background: white">null</span><span >) ? </span><span style="color: #2B91AF; background: white">String</span><span >.Empty : s;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>}</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">set</span><span ></span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>{</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>ViewState[</span><span style="color: #A31515; background: white">&quot;DefaultUserName&quot;</span><span >] = </span><span style="color: blue; background: white">value</span><span >;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>}</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>}</span></p>
                    <p>
                        <span >&nbsp;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">protected</span><span > </span><span style="color: blue; background: white">override</span><span > </span><span style="color: blue; background: white">void</span><span > RenderContents(</span><span style="color: #2B91AF; background: white">HtmlTextWriter</span><span > 
                                                                                                                                                                                                                                                                                                                                                                                                                    writer)</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>{</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;</span>writer.WriteEncodedText(Text);</span></p>
                    <p>
                        <span >&nbsp;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">string</span><span > displayUserName = DefaultUserName;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">if</span><span > (Context != </span><span style="color: blue; background: white">null</span><span >)</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>{</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">string</span><span > userName = Context.User.Identity.Name;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">if</span><span > (!</span><span style="color: #2B91AF; background: white">String</span><span >.IsNullOrEmpty(userName))</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>displayUserName = userName;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>}</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>}</span></p>
                    <p>
                        <span >&nbsp;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">if</span><span > (!</span><span style="color: #2B91AF; background: white">String</span><span >.IsNullOrEmpty(displayUserName))</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>{</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>writer.Write(</span><span style="color: #A31515; background: white">&quot;, &quot;</span><span >);</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>writer.WriteEncodedText(displayUserName);</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>}</span></p>
                    <p>
                        <span >&nbsp;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>writer.Write(</span><span style="color: #A31515; background: white">&quot;! Please click me.&quot;</span><span >);</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>}</span></p>
                    <p>
                        <span >&nbsp;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">protected</span><span > </span><span style="color: blue; background: white">override</span><span > </span><span style="color: blue; background: white">void</span><span > OnPreRender(</span><span style="color: #2B91AF; background: white">EventArgs</span><span > 
                                                                                                                                                                                                                                                                                                                                                                                                            e)</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>{</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">base</span><span >.OnPreRender(e);</span></p>
                    <p>
                        <span >&nbsp;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="color: blue; background: white">var</span><span > script = </span><span style="color: #A31515; background: white">&quot;welcomeLabel.init(&#39;&quot;</span><span > + </span><span style="color: blue; background: white">this</span><span >.ClientID + </span>
                        <span style="color: #A31515; background: white">&quot;&#39;);&quot;</span><span >;</span></p>
                    <p>
                        <span >&nbsp;</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>Page.ClientScript.RegisterStartupScript(</span><span style="color: blue; background: white">this</span><span >.GetType(), </span><span style="color: #A31515; background: white">&quot;WelcomeLabelScript&quot;</span><span >, script, </span><span style="color: blue; background: white">true</span><span >);</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>}</span></p>
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp; </span>}</span></p>
                    <p>
                        <span >}</span></p>
                    <p>
                        &nbsp;</p>
            
                </code>
            
                The usage of:
                <code class="code-example">
                    <p>
                        <span ><span>&nbsp;&nbsp;&nbsp; </span>[</span><span style="color: #2B91AF; background: white">RequiredScript</span><span >(</span><span style="color: blue; background: white">typeof</span><span >(</span><span style="color: #2B91AF; background: white">CommonToolkitScripts</span>))]</p>
                    <p>
                        <span >
                            &nbsp;&nbsp;&nbsp; [</span><span style="color: #2B91AF; background: white">ClientScriptResource</span><span >(</span><span style="color: blue; background: white">null</span><span >, </span><span style="color: #A31515; background: white">&quot;CustomControlDemo.WelcomeLabel.js&quot;</span><span >]</span>
                    </p>
                </code>
                Will causing all scripts required on <b>CommonToolkitScripts</b> and also <b>WelcomeLabel.js</b> script to be combined along with all other combinable scripts on ToolkitScriptManager.
            </li>        
        </ol>

    </div>
</asp:Content>