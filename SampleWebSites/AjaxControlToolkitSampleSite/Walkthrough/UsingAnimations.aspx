<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    Title="Using Animations" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" />
    <div class="walkthrough">
    <div class="heading">Using Animations</div>
    <p>
        While the AJAX Control Toolkit is focused primarily on providing great AJAX controls and extenders, it also
        includes a powerful animation framework which you can use to add awesome visual effects on your pages.
        This walkthrough describes the basics of using this framework to create declarative animations.
    </p>
    <p></p>
    
    
    
    <div class="subheading">Generic XML Animations</div>
    <p>
        The animations are implemented in JavaScript as an ASP.NET AJAX class hierarchy and can be invoked via JavaScript
        by calling the Animation's <span class="codeReference">play</span> function.  This is very
        useful when writing to the animation classes from code, but writing complex animations ends up being time consuming and error prone.
        To make it very easy to use the animation framework without writing any JavaScript, the Toolkit provides the
        ability to declare animations via XML markup.
    </p>
    <p></p>
    <p>
        Extenders with animation support, like the <span class="codeReference">AnimationExtender</span>, expose various
        events, like <span class="codeReference">OnClick</span>, that can be associated with a generic XML animation declaration.  
        Within this declaration, you specify which types of animation effects you would like to occur.
        For example, to make a <span class="codeReference">Panel</span> with <span class="codeReference">ID = "MyPanel"</span> disappear
        from the page when clicked, you could add an <span class="codeReference">AnimationExtender</span> like this:
        <pre>
&lt;ajaxToolkit:AnimationExtender id="MyExtender"
  runat="server" TargetControlID="MyPanel"&gt;
  &lt;Animations&gt;
    &lt;OnClick&gt;
      &lt;FadeOut Duration=".5" Fps="20" /&gt;
    &lt;/OnClick&gt;
  &lt;/Animations&gt;
&lt;/ajaxToolkit:AnimationExtender&gt;</pre>
        Let's take a closer look at exactly what's going on in the XML above.  The <span class="codeReference">AnimationExtender</span>
        is used to indicate that we want to make our animation target
        the control with <span class="codeReference">ID = "MyPanel"</span>.  The <span class="codeReference">Animations</span>
        section is where all generic animations are declared.  <span class="codeReference">OnClick</span> indicates that when
        the target is clicked we will play the animation nested inside it.  Finally, <span class="codeReference">FadeOut</span>
        defines the specific animation that will be played and sets the values of its <span class="codeReference">Duration</span>
        and <span class="codeReference">Fps</span> properties.  Here's the example in action:
    </p>
    
    <center>
        <asp:Panel ID="Example1A" runat="server" style="width: 100px; background-color: #FFFFFF; border: solid 1px #666666; padding: 10px; cursor: pointer;">
            <h2>Click me to fade out!</h2>
        </asp:Panel>
        <asp:LinkButton ID="Example1B" runat="server" OnClientClick="return false;" Style="visibility: hidden;">Reset</asp:LinkButton>
    </center>
    <ajaxToolkit:AnimationExtender ID="AnimationExample1A" runat="server" TargetControlID="Example1A">
        <Animations>
            <OnClick>
                <Sequence>
                    <FadeOut Duration=".5" Fps="20" />
                    <StyleAction AnimationTarget="ctl00_SampleContent_Example1B" Attribute="visibility" Value="visible" />
                </Sequence>
            </OnClick>
        </Animations>
    </ajaxToolkit:AnimationExtender>
    <ajaxToolkit:AnimationExtender ID="AnimationExample1B" runat="server" TargetControlID="Example1B">
        <Animations>
            <OnClick>
                <Sequence>
                    <StyleAction Attribute="visibility" Value="hidden" />
                    <OpacityAction AnimationTarget="ctl00_SampleContent_Example1A" Opacity="1" />
                </Sequence>
            </OnClick>
        </Animations>
    </ajaxToolkit:AnimationExtender>
    <p>
        The events associated with animations vary from extender to extender.  The <a href="../Animation/Animation.aspx"><span class="codeReference">AnimationExtender</span></a>
        has events for <span class="codeReference">OnLoad</span>, <span class="codeReference">OnClick</span>, <span class="codeReference">OnMouseOver</span>,
        <span class="codeReference">OnMouseOut</span>, <span class="codeReference">OnHoverOver</span>, and <span class="codeReference">OnHoverOut</span>.
        The <a href="../UpdatePanelAnimation/UpdatePanelAnimation.aspx"><span class="codeReference">UpdatePanelAnimationExtender</span></a> has events for
        <span class="codeReference">OnUpdating</span> and <span class="codeReference">OnUpdated</span>.  It is <b>important</b> to note that each event can only have
        one child XML node associated with it but you can use the using the <span class="codeReference">Sequence</span> and <span class="codeReference">Parallel</span>
        animations to arbitrarily nest and group animations, which is discussed in detail below.
        </p>
        <br />
        <p>
        
        Below is an example which uses <span class="codeReference">OnHoverOver</span> and <span class="codeReference">OnHoverOut</span> to fade
        a <span class="codeReference">Panel</span> in and out when the mouse moves over it.  We use the <span class="codeReference">FadeIn</span> and
        <span class="codeReference">FadeOut</span> animations and set their <span class="codeReference">MinimumOpacity</span> and
        <span class="codeReference">MaximumOpacity</span> properties.
    </p>
    <center>
        <asp:Panel ID="Example2A" runat="server" style="width: 100px; background-color: #FFFFFF; border: solid 1px #666666; padding: 10px; cursor: pointer;">
            <h2>Hover over me to fade in!</h2>
        </asp:Panel>
    </center>
    <ajaxToolkit:AnimationExtender ID="AnimationExample2A" runat="server" TargetControlID="Example2A">
        <Animations>
            <OnLoad>
                <OpacityAction Opacity=".2" />
            </OnLoad>
            <OnHoverOver>
                <FadeIn Duration=".25" Fps="20" MinimumOpacity=".2" MaximumOpacity=".8" />
            </OnHoverOver>
            <OnHoverOut>
                <FadeOut Duration=".25" Fps="20" MinimumOpacity=".2" MaximumOpacity=".8" />
            </OnHoverOut>
        </Animations>
    </ajaxToolkit:AnimationExtender>
    <p></p>
    <p>
        Each animation corresponds to a JavaScript class (for example, <span class="codeReference">FadeIn</span> is mapped to the
        <span class="codeReference">Sys.Extended.UI.Animation.FadeInAnimation</span> class).  The name of the animation is used
        as the generic XML animation declaration's tag and its properties, which correspond to the properties on the JavaScript class,
        are attributes of that tag.  For example, to change the size of an element we could use <span class="codeReference">Resize</span>
        which has properties <span class="codeReference">Width</span>, <span class="codeReference">Height</span>, and <span class="codeReference">Unit</span>.
     </p>
     <br />
     <p> 
        We would declare it as:
        
        <code>&lt;Resize Width="200" Height="300" Unit="px" /&gt;</code>
        
        The name of the animation and properties are case insensitive in generic XML animation declarations.
        Since the animation framework is based on a hierarchy of animation classes, all the animations have the properties
        <span class="codeReference">Duration</span> (in seconds) and <span class="codeReference">Fps</span> (frames per second).
        All the animations and their properties are described in the <a href="AnimationReference.aspx">Animation Reference</a>.
    </p>
    <p></p>
    <div class="subheading">Composing Animations</div>
    <p>
        Some of the animations are used to aggregate and combine other animations.  Examples include <span class="codeReference">Parallel</span> Animation
        which will run its child animations simultaneously and <span class="codeReference">Sequence</span> which runs its child animations sequentially, waiting for each to finish before starting the next.  
        To use these animations in the generic XML animation declaration syntax, we include their child animations as nested XML elements.
        For example, to have an element pulse and then fade out while scaling its size by 500%, we could declare the following:
        <pre>
&lt;Sequence&gt;
  &lt;Pulse Duration=".1" /&gt;
  &lt;Parallel Duration=".5" Fps="30"&gt;
    &lt;FadeOut /&gt;
    &lt;Scale ScaleFactor="5" Unit="px" Center="true"
      ScaleFont="true" FontUnit="pt" /&gt;
  &lt;/Parallel&gt;
&lt;/Sequence&gt;</pre>      
        Here is what this animation would do if associated with the <span class="codeReference">OnClick</span> event:
    </p>
    
    <center>
        <div style="width: 100px; height: 100px;">
            <asp:Panel ID="Example3A" runat="server" style="font-size: 16px; font-weight: bold; width: 100px; height: 100px; background-color: #FFFFFF; border: solid 1px #666666; padding: 10px; cursor: pointer;">

                
                    <table style="height: 100%; width: 100%;">
                        <tr valign="middle">
                            <td valign="middle"><center>Explode!</center></td>
                        </tr>
                    </table>
                
            </asp:Panel>
        </div>
        <asp:LinkButton ID="Example3B" runat="server" OnClientClick="return false;" Style="visibility: hidden;">Reset</asp:LinkButton>
    </center>

    <ajaxToolkit:AnimationExtender ID="AnimationExample3A" runat="server" TargetControlID="Example3A">
        <Animations>
            <OnClick>
                <Sequence>
                    <Pulse Duration=".1" />
                    <Parallel Duration="1" Fps="20">
                        <FadeOut />
                        <Scale ScaleFactor="5" Unit="px" Center="true" ScaleFont="true" FontUnit="px" />
                    </Parallel>
                    <HideAction />
                    <StyleAction AnimationTarget="ctl00_SampleContent_Example3B" Attribute="visibility" Value="visible" />
                </Sequence>
            </OnClick>
        </Animations>
    </ajaxToolkit:AnimationExtender>
    <ajaxToolkit:AnimationExtender ID="AnimationExample3B" runat="Server" TargetControlID="Example3B">
        <Animations>
            <OnClick>
                <Sequence>
                    <StyleAction Attribute="visibility" Value="hidden" />
                    <ScriptAction Script="var e = $get('ctl00_SampleContent_Example3A'); var pos = CommonToolkitScripts.getLocation(e.parentNode); e.style.fontSize = '16px'; e.style.height = '100px'; e.style.width = '100px'; e.style.top = pos.y + 'px'; e.style.left = pos.x + 'px';" />
                    <OpacityAction AnimationTarget="ctl00_SampleContent_Example3A" Opacity="1" />
                    <StyleAction AnimationTarget="ctl00_SampleContent_Example3A" Attribute="display" Value=""/>
                </Sequence>
            </OnClick>
        </Animations>
    </ajaxToolkit:AnimationExtender>
    <p></p>
    <p>
        Most of the animations included in the framework are very simple and perform a single function.  When you combine them together
        using animations like <span class="codeReference">Sequence</span> and <span class="codeReference">Parallel</span> you can create very
        sophisticated effects.
    </p>
    <p></p>

    
    
    <div class="subheading">Actions</div>
    <p>
        The animation framework also includes a number of animation actions that perform an instantaneous operation.  They differ from regular
        animations which perform an operation in small steps over a period of time.  The actions are often useful in composite animations to assist
        in creating polished effects.  Examples include the <span class="codeReference">EnableAction</span> which allows you to set whether or not
        an element can be clicked, the <span class="codeReference">StyleAction</span> which allows you to set a style attribute on the target
        element, and the <span class="codeReference">HideAction</span> that hides the element.  If you wanted to prevent a
        <span class="codeReference">Button</span> on a page from being clicked twice, you could use the following animation:
        <pre>
&lt;Sequence&gt;
  &lt;EnableAction Enabled="false" /&gt;
  &lt;Parallel Duration=".2"&gt;
    &lt;Resize Height="0" Width="0" Unit="px" /&gt;
    &lt;FadeOut /&gt;
  &lt;/Parallel&gt;
  &lt;HideAction /&gt;
  &lt;ScriptAction Script="alert('Goodbye!');" /&gt;
&lt;/Sequence&gt;</pre>
        If hooked up to a <span class="codeReference">Button</span>, this would look like:
    </p>
    <center>
        <div style="height: 30px; width: 100px;">
            <asp:Button ID="Example4A" runat="server" style="width: 100px; height: 30px" Text="Click Me" OnClientClick="return false;" />
        </div>
        <asp:LinkButton ID="Example4B" runat="server" OnClientClick="return false;" Style="visibility: hidden;">Reset</asp:LinkButton>
    </center>
    <ajaxToolkit:AnimationExtender ID="AnimationExample4A" runat="server" TargetControlID="Example4A">
        <Animations>
            <OnClick>
                <Sequence>
                    <EnableAction Enabled="false" />
                    <Parallel Duration=".2">
                        <Resize Height="0" Width="0" Unit="px" />
                        <FadeOut />
                    </Parallel>
                    <HideAction />
                    <StyleAction AnimationTarget="ctl00_SampleContent_Example4B" Attribute="visibility" Value="visible" />
                    <ScriptAction Script="alert('Goodbye!');" />
                </Sequence>
            </OnClick>
        </Animations>
    </ajaxToolkit:AnimationExtender>
    <ajaxToolkit:AnimationExtender ID="AnimationExample4B" runat="server" TargetControlID="Example4B">
        <Animations>
            <OnClick>
                <Sequence>
                    <StyleAction Attribute="visibility" Value="hidden" />
                    <OpacityAction AnimationTarget="ctl00_SampleContent_Example4A" Opacity="1" />
                    <EnableAction AnimationTarget="ctl00_SampleContent_Example4A" Enabled="true" />
                    <StyleAction AnimationTarget="ctl00_SampleContent_Example4A" Attribute="width" Value="100px" />
                    <StyleAction AnimationTarget="ctl00_SampleContent_Example4A" Attribute="height" Value="30px" />
                    <StyleAction AnimationTarget="ctl00_SampleContent_Example4A" Attribute="display" Value="" />
                </Sequence>
            </OnClick>
        </Animations>
    </ajaxToolkit:AnimationExtender>
    
    <div class="subheading">Animation Targets</div>
    <p>
        The animations perform their various operations on a target element.  The default target element for an animation is
        the control it is extending (i.e. the control pointed to by <span class="codeReference">TargetControlID</span> on its
        <span class="codeReference">Extender</span> tag).  You can also specify alternate targets using the
        <span class="codeReference">AnimationTarget</span> property.  This is very useful when you want to wire up the
        <span class="codeReference">AnimationExtender</span> to one control, like a <span class="codeReference">Button</span>,
        but have the animation modify another control, like a <span class="codeReference">Panel</span>.  A child animation will
        have the same target as its parent animation unless another target was explicitly specified.  Here's an example of how we
        could have a button's <span class="codeReference">OnClick</span> event animate the background color of another control:
        <pre>
&lt;Sequence&gt;
  &lt;EnableAction Enabled="false" /&gt;
  &lt;Color AnimationTarget="MyContent"
    Duration="1"
    StartValue="#FF0000"
    EndValue="#666666"
    Property="style"
    PropertyKey="backgroundColor" /&gt;
  &lt;Color AnimationTarget="MyContent"
    Duration="1"
    StartValue="#FF0000"
    EndValue="#666666"
    Property="style"
    PropertyKey="backgroundColor" /&gt;
  &lt;EnableAction Enabled="true" /&gt;
&lt;/Sequence&gt;</pre>
        Clicking this button will demonstrate the animation:
    </p>
    <center>
        <asp:Button ID="Example5A" runat="server" style="width: 100px; height: 30px" Text="Click Me" OnClientClick="return false;" />
    </center>
    <ajaxToolkit:AnimationExtender ID="AnimationExample5A" runat="server" TargetControlID="Example5A">
        <Animations>
            <OnClick>
                <Sequence>
                    <EnableAction Enabled="false" />
                    <Color AnimationTarget="master_contentplaceholder"
                        Duration="1"
                        StartValue="#EFEFEF"
                        EndValue="#FF0000"
                        Property="style"
                        PropertyKey="backgroundColor" />
                    <Color AnimationTarget="master_contentplaceholder"
                        Duration="1"
                        StartValue="#FF0000"
                        EndValue="#EFEFEF"
                        Property="style"
                        PropertyKey="backgroundColor" />
                    <EnableAction Enabled="true" />
                </Sequence>
            </OnClick>
        </Animations>
    </ajaxToolkit:AnimationExtender>
    <div class="subheading">Conclusion</div>
    <p>
    The animation framework provides you with the ability to easily add interactivity to your web pages that's never before been available.  Beyond 
    specifying animations in markup, they're also easy to use in code so you can add professional looking transitions and visual
    effects to your Toolkit components and controls. 
    </p>    
    
    
    </div>
</asp:Content>