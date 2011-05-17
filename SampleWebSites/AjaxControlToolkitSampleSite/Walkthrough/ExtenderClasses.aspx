<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    Title="Extender Base Classes" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <div class="walkthrough">

        <div class="heading">Extender base class features</div>

        <p>
            <span>All of the controls in the Toolkit are built upon a set of classes that really help streamline
                the process of writing control extenders. These classes form
                a thin "glue" layer between the Toolkit controls and the ASP.NET AJAX classes as they
                exist today.</span></p>
        <p>
            </p>
        <p>
            <span><span></span></span>
            <span>To get the most out of this document,
                you should have written a control with the Toolkit, or at least read about
                <a href="http://www.asp.net/learn/Ajax-Control-Toolkit/tutorial-49-cs.aspx">creating a new extender</a>.</span></p>
        <p>
            </p>
        <p>
            <span>The Extender Classes automate a couple
                of major things:</span></p>
        <ul>
        <li>The generation of script
                that hooks up your behavior to an element on the page</li><li>The loading of your script
                file reference</li><li>The management of any scripts
                that your behavior or control may be dependent on</li><li>The mapping of properties and
                their values from the managed side to the client script</li><li>Help in developing and debugging
                your script</li><li>A mechanism to move state back-and-forth
                between your extender and the behaviors in the browser</li></ul>
        <p>
            </p>
        <p>
            <span>The main class is called <b>AjaxControlToolkit.ExtenderControlBase
            </b>(ECB for the purposes of this document). ECB is an abstract class, which
                means you can't instantiate it directly; you have to create a derived type.<span>
                </span>The main job of this component is to hook up an HTML element with some behaviors
                on the page. Derived classes can add a TargetControlTypeAttribute to restrict the types
                of elements they can be hooked up to.</span></p>
        <p>
            </p>
        <p>
            <span>On this class is where you declare
                your managed object model. A simple one would look like this:</span></p>
    <pre>[<span style='color:Teal'>TargetControlType</span><span style='color:Black'>(</span><span style='color:Blue'>typeof</span><span style='color:Black'>(</span><span style='color:Teal'>IButtonControl</span><span style='color:Black'>))]
    </span><span style='color:Blue'>public</span><span style='color:Black'> </span><span style='color:Blue'>class</span><span style='color:Black'> </span><span style='color:Teal'>ConfirmButtonExtender</span><span style='color:Black'> : </span><span style='color:Teal'>ExtenderControlBase
    </span><span style='color:Black'>{
    </span><span style='color:Black'>    [</span><span style='color:Teal'>ExtenderControlProperty</span><span style='color:Black'>()]
        </span><span style='color:Blue'>public</span><span style='color:Black'> </span><span style='color:Blue'>string</span><span style='color:Black'> ConfirmText
        {
            </span><span style='color:Blue'>get
    </span><span style='color:Black'>        {
                </span><span style='color:Blue'>return</span><span style='color:Black'> GetPropertyValue(</span><span style='color:Maroon'>&quot;ConfirmText&quot;</span><span style='color:Black'>, </span><span style='color:Maroon'>&quot;&quot;</span><span style='color:Black'>);
            }
            </span><span style='color:Blue'>set
    </span><span style='color:Black'>        {
                SetPropertyValue(</span><span style='color:Maroon'>&quot;ConfirmText&quot;</span><span style='color:Black'>, </span><span style='color:Blue'>value</span><span style='color:Black'>);
            }
        }
    }
    </span></pre>
        <p>
            <span>The general lifecycle works as follows. The developer adds an extender to their ASPX page:</span></p>
        <p>
        </p>
        <code>
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">&lt;</span><span
                style="font-size: 10pt; color: maroon; font-family: 'Courier New'">ns</span><span
                    style="font-size: 10pt; color: blue; font-family: 'Courier New'">:</span><span style="font-size: 10pt;
                        color: maroon; font-family: 'Courier New'">MyExtender</span><span style="font-size: 10pt;
                            font-family: 'Courier New'"> <span style="color: red">ID</span><span style="color: blue">="myExtender1"</span>
                            <span style="color: red">runat</span><span style="color: blue">="server"&gt;</span></span>
        <br/>
            <span style="font-size: 10pt;
                        font-family: 'Courier New'"> <span style="color: red">  TargetControlID</span><span
                            style="color: blue">="Button1"<br />
                              </span> <span style="color: red">SomeValue</span><span
                                style="color: blue">="Foo" /&gt;</span></span>
        </code>
        <p>
            <span>When the page loads, this instantiates a server control that derives from ECB above.
            The server control talks to ASP.NET AJAX to hook itself up, and the client browser automatically downloads and initializes all the necessary scripts.</span></p>
        <p>
            </p>
        <p>
            </p>
        <p>
            <span class="heading">ExtenderControlBase
                Features:</span></p>
        <p>
            </p>
        <p>
            <b><span>RequiredScripts: </span></b><span
               ><span> You can specify which scripts
                    are required for a given extender using the <strong>RequiredScriptAttribute</strong>.</span></span></p>
            <code>
            <span>[<span style="font-family: Courier New">RequiredScript</span>(<span
                style="font-family: Courier New"><span style="color: #008080">typeof(MyOtherExtender)</span>)]</span></span><br />
            <span><span></span></span>
            
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">public</span><span
                style="font-size: 10pt; font-family: 'Courier New'"> MyExtender()<br />
                {<span>  </span><span>     </span><span> </span>
                <span>   </span></span>
        <br />
            <span style="font-size: 10pt; font-family: 'Courier New'">}</span><span style="font-size: 10pt;
                font-family: Arial"></span>
                </code>

        <p >
            <span>This attribute takes a type that references another script file that needs to
                be loaded prior to your component's scripts. This allows
                you to build extenders that have behaviors that derive from or use other behaviors.
                RequiredScriptAttribute also has a <strong>LoadOrder</strong> property as well to
                enforce which scripts get loaded in which order. This loading is recursive as well - if the extenders you reference also have dependencies, they will automatically
                be created.</span></p>
        <code><span style="font-size: 10pt">
        
            [<span style="font-family: Courier New">RequiredScript</span>(<span
                style="font-family: Courier New"><span style="color: #008080">typeof(MyExtender</span>),0)]</span>
        <br/>
            [<span style="font-family: Courier New">RequiredScript</span>(<span style="font-family: Courier New"><span
                style="color: #008080">typeof(MyOtherExtender</span>),1)]</span>
        <br/>
            
            <span style="color: blue; font-family: 'Courier New'">public</span></span><span
                style="font-family: 'Courier New'"><span
                style="font-size: 10pt"> MyCombinedExtender() { }</span><span><span style="font-size: 10pt">
                    </span>
                       </span><span>     </span><span>
                    </span><span>   </span></span>
        </code>
        <p >
            <b><span>ScriptPath: </span></b><span>This is a debugging
                helper property that really simplifies your script development.
                Once you've got your ECB class created, create an ASPX page.<span>
                </span>Copy your “MyBehavior.js” file next to that ASPX page, and then add the following
                (in <b>bold</b>) to your extender declaration:</span></p>
        <code>
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">&lt;</span><span
                style="font-size: 10pt; color: maroon; font-family: 'Courier New'">ns</span><span
                    style="font-size: 10pt; color: blue; font-family: 'Courier New'">:</span><span style="font-size: 10pt;
                        color: maroon; font-family: 'Courier New'">MyExtender</span><span style="font-size: 10pt;
                            font-family: 'Courier New'"> <span style="color: red">ID</span><span style="color: blue">="myExtender1"
                            </span><b><span style="color: red">ScriptPath</span><span style="color: blue">="MyBehavior.js"
                                TargetControlID="Button1"<br />
                            </span></b><span style="color: red"><strong><span style="color: #000"> </span>
                            </strong>runat</span><span style="color: blue">="server"&gt;</span></span>
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'"><span></span></span><br/>
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">&lt;/</span><span
                style="font-size: 10pt; color: maroon; font-family: 'Courier New'">ns</span><span
                    style="font-size: 10pt; color: blue; font-family: 'Courier New'">:</span><span style="font-size: 10pt;
                        color: maroon; font-family: 'Courier New'">&lt;MyExtender</span><span style="font-size: 10pt;
                            color: blue; font-family: 'Courier New'">&gt;</span>
                            </code>
        
        <p >
            <span>This will cause the extender to load
                your script from the URL you give it instead of from the DLL, which is the default.<span>
                </span>This allows you to debug and modify your script file without having to rebuild
                your extender. When you're done, don't forget to copy this file
                back into your project.</span></p>
            <p>
                </p>
            <p>
                <span><strong>BehaviorID: </strong><span> In cases where you would like to access the
                    client-side behavior for your extender from script code in the client, you can set
                    this BehaviorID to simplify the process. See example below:</span></span></p>
            <p>
                <code><span style="font-size: 10pt; font-family: 'Courier New'"></span>
                    <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">&lt;<span
                style="font-size: 10pt; color: maroon; font-family: 'Courier New'">ns</span><span
                    style="font-size: 10pt; color: blue; font-family: 'Courier New'">:</span><span style="font-size: 10pt;
                        color: maroon; font-family: 'Courier New'">MyExtender</span><span style="font-size: 10pt;
                            font-family: 'Courier New'"><span style="color: #000000"> </span><span style="color: red">
                                        ID</span><span style="color: blue">="myExtender1"</span></span></span><span style="font-size: 10pt; color: blue; font-family: 'Courier New'"><span
                    style="font-size: 10pt; font-family: 'Courier New'"><b><span style="color: blue"><br />
                    </span></b><span style="color: red"><strong><span style="color: #000"> </span>
                    </strong>runat</span><span style="color: blue">="server" TargetControlID="Button1" BehaviorID="myBehavior1"
                        /&gt;</span></span><span style="color: #000000"></span></span>
                        <br /><br />
                        <span
                    style="color: #000000">    
                     &lt;script</span> <span style="font-size: 10pt; color: red; font-family: 'Courier New'">type</span>=<span style="font-size: 10pt; color: blue; font-family: 'Courier New'">"text/javascript"</span>&gt;<br />
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">function</span> changeValue() {<br />
                <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">var</span> myBehavior = $find("myBehavior1");<br />            
                myBehavior.set_Value(0);<br />
            }<br />        
        &lt;/script&gt;
        <br />
        
            </code>
                     
            </p>
            <p>
                <span><span></span></span></p>
            <p>
                <span><span></span></span></p>
        
        <p >
            <b><span>ClientScriptResourceAttribute: </span></b><span>This isn't a method
                on ECB but it's related to it. This is what associates your ECB
                instance with a script file. Normally, it looks like this:</span></p>
        
        <code>
            <span style="font-size: 10pt; font-family: 'Courier New'">[<span style="color: teal">ClientScriptResource</span>(<span
                style="color: maroon">"MyNamespace.MyBehavior</span><span style="color: maroon">"</span>,<br />
                
                <span style="color: maroon">"MyProject.MyBehavior.js"</span>)]</span>
                </code>
        <p >
            <span>But if you want to wrap an existing set of scripts in ASP.NET AJAX so that you can easily use it on the server-side, you just pass
                null for the namespace and drop the resource name:</span></p>
        
        <code>
            <span style="font-size: 10pt; font-family: 'Courier New'">[<span style="color: teal">ClientScriptResource</span>(<span
                style="color: blue">null</span>, <span style="color: maroon">"SomeScripts.js"</span>)]</span></code>
        <p >
            <span></span></p>
        <p >
            </p>
         <p >
            <b><span>ResolveTargetControlID: </span></b><span><span> There are times where it is inconvenient to put the extender directly next to the control that it is extending.  In cases where a NamingContainer is involved, this can prevent the extender from 
               being able to locate it's target control.  In these cases, the user can handle the ResolveTargetControlID event on the extender.  If the ECB is unable to locate the control, this event will be called with the 
               control's ID.  In this event, the user code can locate the control and return the instance.  Note that this fires for TargetControlID only, not for other properties marked with the IDPropertyAttribute.  We may add that support later.</span></span></p>
        
        <pre>   <span style="color: blue">protected void</span> MyExtender_ResolveTargetControlID(
                        <span style="color: blue">object</span> sender, ResolveControlEventArgs e) {
        <span style="color: blue">if</span> (e.ControlID == "Button1") {
            <span style="color: green">// Button1 is in another container -
            // find it.</span>
            e.Control = container1.FindControl(e.ControlID);
        }
      }
      </pre>
        
        <p >
            <span class="heading"></span></p>
        <p >
            <b><span>EnsureValid: </span></b><span>When you create
                your ECB instance, you override this to make sure that the user has set all of the
                appropriate values. The default implementation checks that all
                of the properties marked with the <strong>RequiredPropertyAttribute</strong> are
                populated.</span></p>
        <p >
            </p>
        <p >
            <b><span>EnableClientState: </span></b><span>This property enables client
                state transport between your extender and the class running on the client.<span>
                </span>See the <b>ClientState</b> property below. This defaults
                to <b>false</b>, so if you don't set it, ClientState will do nothing.</span></p>
        <p >
            </p>
        <p >
            <b><span>ClientState: </span></b><span>This is a simple
                string property that will be made available to your running behavior instance on
                the client side. So you could do something like this on the server
                side:</span></p>
        <code>
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">protected</span><span
                style="font-size: 10pt; font-family: 'Courier New'"> <span style="color: blue">void</span>
                Page_Load(<span style="color: blue">object</span> sender, <span style="color: teal">
                    EventArgs</span> e)<br />
                {</span>
        <br />
            <span style="font-size: 10pt; font-family: 'Courier New'"><span>
                 </span>MyExtender1.ClientState = <span style="color: maroon">
                    "hello"</span>;</span>
        <br />
            <span style="font-size: 10pt; font-family: 'Courier New'">
                }</span>
        <br />
        </code>
        <p >
            <span>And on the client side, (in Javascript):</span></p>
        <p >
        </p>
        <code>
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">var</span><span
                style="font-size: 10pt; font-family: 'Courier New'"> state = <span style="color: blue">
                    this</span>.get_ClientState(); <span style="color: green">// returns "hello"</span></span></code>
        
        <p >
            <span>It's that simple.
                There is a corresponding set_ClientState method on the Javascript side that you can
                call as well to change the value that the server-side receives.
                These values persist only for the life of the page. If the user
                refreshes or navigates away and back to the page, they start from their initial
                state again.</span></p>
            <p>
                </p>

                <span class="heading">Adding Extender Properties</span>
            <p>
                </p>
            <p>
                To add extender properties to your class, you need to let the Toolkit framework
                know which properties it should send to the client.
            </p>
            <p>
                </p>
            <p>
                The first property is a required one. Put this property on all properties
                that are related to your client-side behavior:</p>
            <p>
                 <code>
            <span style="font-size: 10pt; font-family: 'Courier New'">[<span
                style="color: teal">ExtenderControlProperty</span>]</span>
        <br/>
            <span style="font-size: 10pt; font-family: 'Courier New'"><span
                style="color: blue">public</span> <span style="color: blue">string</span> SomeValue
                { … }</span>
        <br />
            </code></p>
            <p>
                <strong>ExtenderControlPropertyAttribute: </strong>Marks a property to be
                sent to the client side behavior.</p>
        
            <p >
                </p>
        <p >
            Here are the optional attributes you can use on the ECB properties that you create:<br />
            </p>
        <p >
            <b><span>DefaultValueAttribute: </span></b><span>Put this on a TPB
                property to tell the framework what the default value is for a property.<span>
                </span>Note this <i>does not</i> set that value, but is a comparison. 
                So, of you've got a string value, you would normally put [DefaultValue(null)] or
                [DefaultValue(0)] for an int. The benefit of this is that it
                prevents the ECB from serializing out default values. It sounds
                simple but it's pretty important to get things working right.</span></p>
        <p >
            </p>
        <p >
            <b><span>ClientPropertyNameAttribute: <span>
            </span></span></b><span>This allows you
                to declare a different property name in your managed code from your client script
                code. For example, you may want to have your managed class names
                start with an upper-case character, and your client script ones start with a lower
                case character.  Or you may be wrapping an existing behavior and
                prefer other names.</span></p>
        
        
        <code>
            <span style="font-size: 10pt; font-family: 'Courier New'">[<span
                style="color: teal">ClientPropertyName</span>(<span style="color: maroon">"someValue"</span>)][<span
                style="color: teal">ExtenderControlProperty</span>]</span><br/>
            <span style="font-size: 10pt; font-family: 'Courier New'"><span
                style="color: blue">public</span> <span style="color: blue">string</span> SomeValue
                { … }</span>
        <br />
            </code>
        <p >
            <b><span>IDReferenceAttribute: <span>
            </span></span></b><span>This attribute tells
                the ECB that it references the ID of a control on the page. So
                during rendering, the ECB will replace this value with the Client ID of the control.<span>
                </span>Note this also tells the designer what kind of controls can be set into this
                property:</span></p>
        <code>
            <span style="font-size: 10pt; font-family: 'Courier New'">[<span style="color: teal">IDReferenceProperty</span>(<span
                style="color: blue">typeof</span>(<span style="color: teal">WebControl</span>))]</span><br />
            <span style="font-size: 10pt">
            <span style="font-family: 'Courier New'">[<span style="color: teal">DefaultValue</span>(<span
                style="color: blue">""</span>)]<br />
            </span>[<span
                style="color: teal">ExtenderControlProperty</span>]</span>
            <br />
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">public</span><span
                style="font-size: 10pt; font-family: 'Courier New'"> <span style="color: blue">string</span>
                PopupControlID { … }</span><br />
            </code>
        <p >
            <span><strong>ElementReferenceAttribute: </strong>This is related to the IDReferenceAttribute
                above. This tells the framework that the property on the client side takes
                an element reference rather than an ID.  In this case, the framework will
                automatically look up the component and pass it's value to the client instead of
                the ID. This will usually be done in conjunction with the ClientPropertyNameAttribute
                as in the example below:</span></p>
            <p>
                <code>
            <span style="font-size: 10pt; font-family: 'Courier New'">[<span style="color: teal">IDReferenceProperty</span>(<span
                style="color: blue">typeof</span>(<span style="color: teal">WebControl</span>))]</span><br />
            <span style="font-size: 10pt">
            <span style="font-family: 'Courier New'">
                [<span style="color: teal">DefaultValue</span>(<span style="color: blue">""</span>)]<br />
                [<span style="color: teal">ExtenderControlProperty</span>]            <br />
                [<span style="color: teal">ClientPropertyName("popupElement")</span>] <br />
                [<span style="color: teal">ElementReference</span>]            <br />
                [<span style="color: teal">ExtenderControlProperty</span>]<br />
            </span>
            </span>
            <br />
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">public</span><span
                style="font-size: 10pt; font-family: 'Courier New'"> <span style="color: blue">string</span>
                PopupControlID { … }</span><br />
            </code></p>
            <p>
                <span></span></p>
            <p>
                </p>
            <p>
                <span>One last thing is on the AjaxControlToolkit.Design.</span><span
                style="font-size: 10pt; color: teal; font-family: 'Courier New'"><strong>ExtenderControlBaseDesigner</strong></span><span
                   ></span></p>
        <p >
            <span>class. In most
                cases you won't need to do anything with this class but there is one virtual member:</span></p>
        <p >
            </p>
        <p >
            <b><span>ExtenderPropertyName: </span></b><span>Override this to
                control the name of the property that shows up in the property grid for your extender
                when you click on the item that you want to extend.</span></p>
        <code>
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'">protected</span><span
                style="font-size: 10pt; font-family: 'Courier New'"> <span style="color: blue">override</span>
                <span style="color: blue">string</span> ExtenderPropertyName<br />
                {</span>
        <br />
            <span style="font-size: 10pt; font-family: 'Courier New'"><span> </span>
                <span style="color: blue">get<br />
                </span><span> 
                </span> {</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'"><span> </span><span> 
                <span style="color: #0000ff">return</span> </span><span style="color: maroon">"TheNameToShowInThePropertyGrid"</span>;</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'"><span> </span>
                }<br />
                }</span></code>

    </div>
</asp:Content>