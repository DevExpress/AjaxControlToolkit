<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    Title="Using the CascadingDropDown with a Database" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" />
    <div class="walkthrough">
        <div class="heading">Using CascadingDropDown with a Database</div>
        <p>
            The sample that ships with the Toolkit uses the CascadingDropDown with an XML data
            store. A common question is how to use it with a database. This walkthrough
            will demonstrate that.</p>
        <p>
            </p>
        <p>
            First, create a new ASP.NET AJAX Website, and add a reference to the toolkit assembly.
            You'll find the assembly (called AjaxControlToolkit.dll) in the "AjaxControlToolkit\bin"
            directory where you installed the toolkit.<br />
            <br />
            In the default.aspx page and add some dropdowns to it:<br />
        </p>
        <code>
        
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span style="color: blue">&lt;</span><span
                    style="color: maroon">div</span><span style="color: blue">&gt;<?xml namespace=""
                        ns="urn:schemas-microsoft-com:office:office" prefix="o" ?><?xml namespace="" prefix="o" ?></span></span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span>Make: <span style="color: blue">&lt;</span><span
                    style="color: maroon">asp</span><span style="color: blue">:</span><span style="color: maroon">DropDownList</span>
                <span style="color: red">ID</span><span style="color: blue">="ddlMake"<br />
                </span> <span
                    style="color: red">  runat</span><span style="color: blue">="server"/&gt;&lt;</span><span
                        style="color: maroon">br</span><span style="color: blue">/&gt;</span></span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span>Model: <span style="color: blue">&lt;</span><span
                    style="color: maroon">asp</span><span style="color: blue">:</span><span style="color: maroon">DropDownList</span>
                <span style="color: red">ID</span><span style="color: blue">="ddlModel"<br />
                </span><span
                    style="color: red">  runat</span><span style="color: blue">="server"/&gt;&lt;</span><span
                        style="color: maroon">br</span><span style="color: blue">/&gt;</span></span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span>Color: <span style="color: blue">&lt;</span><span
                    style="color: maroon">asp</span><span style="color: blue">:</span><span style="color: maroon">DropDownList</span>
                <span style="color: red">ID</span><span style="color: blue">="ddlColor"<br />
                      </span> <span
                    style="color: red">runat</span><span style="color: blue">="server"/&gt;</span><span
                        style="">      </span>
                
            </span>
        
        
        <br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span style="color: blue">&lt;</span><span
                    style="color: maroon">br</span> <span style="color: blue">/&gt;</span><span style="">
                            </span>
                
            </span>
        <br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span style="color: blue">&lt;</span><span
                    style="color: maroon">asp</span><span style="color: blue">:</span><span style="color: maroon">Button</span>
                <span style="color: red">ID</span><span style="color: blue">="Button1"<br />
                      </span> <span
                    style="color: red">runat</span><span style="color: blue">="server"</span> <span style="color: red">
                        Text</span><span style="color: blue">="Submit"</span> <span style="color: blue">/&gt;</span></span>
        <br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span style="color: blue">&lt;/</span><span
                    style="color: maroon">div</span><span style="color: blue">&gt;</span></span>
                    </code>
        Now, at the top of your ASPX page, register a prefix for the reference to the toolkit:<br />
        <code>
            <span style="font-size: 10pt; background: yellow; font-family: 'Courier New';">&lt;%</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">@</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "> <span style="color: maroon">Register<br />
                        </span> <span style="color: red"> 
                            Assembly</span><span style="color: blue">="AjaxControlToolkit"</span> <span style="color: red"><br />
                                 
                                Namespace</span><span style="color: blue">="AjaxControlToolkit"</span><br />
                        <span style="color: red">  TagPrefix</span><span style="color: blue">="ajaxToolkit"</span>                    
                        <span style="background: yellow;">%&gt;</span></span></code>
        And then add the extender itself:<br />
        <code>
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'; ">
                &lt;</span><span style="font-size: 10pt; color: maroon; font-family: 'Courier New';
                    ">ajaxToolkit</span><span style="font-size: 10pt; color: blue;
                        font-family: 'Courier New'; ">:</span><span style="font-size: 10pt;
                            color: maroon; font-family: 'Courier New'; ">CascadingDropDown<br />
                        </span><span
                                style="font-size: 10pt; font-family: 'Courier New'; "> <span style="color: red">
                                    ID</span><span style="color: blue">="CascadingDropDown1"<br />
                                    </span> <span style="color: red">
                                        runat</span><span style="color: blue">="server"/&gt;</span></span><span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style="">   </span>
                
            </span>
        </code>
        At runtime, the extender will make callbacks to a web service we specify (which
            is decorated with the <strong>System.Web.Script.Services.ScriptService</strong> attribute).
        In that web service, it expects a WebMethod with the following signature (<span style="color:#ff0000"><em>note that parameter names must match too</em></span></strong>!):<br />
        <code>
            <span style="font-size: 10pt; font-family: 'Courier New'; ">[<span
                style="color: teal">WebMethod</span>]</span>
        <br />
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'; ">
                public</span><span style="font-size: 10pt; font-family: 'Courier New'; ">
                    <span style="color: teal">CascadingDropDownNameValue</span>[] GetColorsForModel(<br />
                      </span><span
                        style="font-size: 10pt; color: blue; font-family: 'Courier New';">string</span>
                        <span style="font-size: 10pt; font-family: 'Courier New';"> <strong>knownCategoryValues</strong>,<br />
                             
                            <span style="color: blue">string</span> <strong>category</strong>)<span style=""><br />
                            </span></span>
                            </code>
            The <strong>knownCategoryValues</strong> parameter will return a string containing
            the currently selected category values, as well as the category to retrieve values
            for. For example, if the extender is populating the "Color" field, you will
            be passed the values for the "Make" and "Model" fields, as well as "Color" to specify
            the field to return values for.<br />
            <br />
            The CascadingDropDown class has a helper method for unpacking the category values:
        <code>
            <span style="font-size: 10pt; color: teal; font-family: 'Courier New'; ">
                StringDictionary</span><span style="font-size: 10pt; font-family: 'Courier New';
                    "> kv = <span style="color: teal">CascadingDropDown</span><br />
                     .ParseKnownCategoryValuesString(knownCategoryValues);</span></code>
        <p  style=" ">
            This method will return a StringDictionary containing the name/value pairs of the
            currently selected values. So imagine you've got a database with tables for
            the Make (manufacturer), Model, and Color information, and you're accessing that
            database through a DataSet to which you've added methods for getting each set of
            values.<br />
            <br />
            The web method to get the available colors for a given model would look like this:</p>
        <code>
            <span style="font-size: 10pt; font-family: 'Courier New'; ">[<span
                style="color: teal">WebMethod</span>]</span><br />
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'; ">
                public</span><span style="font-size: 10pt; font-family: 'Courier New'; ">
                    <span style="color: teal">CascadingDropDownNameValue</span>[] GetColorsForModel(</span><br />
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'; ">
                string</span><span style="font-size: 10pt; font-family: 'Courier New'; ">
                    knownCategoryValues,<br />
                     <span style="color: blue">string</span> category)<br />
                    {</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; ">
                
                </span>
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span style="color: teal">StringDictionary</span>
                kv =<br />
                  <span
                    style="color: teal"><span> CascadingDropDown</span></span>.ParseKnownCategoryValuesString(<br />
                  knownCategoryValues);</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; ">
                
                 
                <br />
            </span>
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span style="color: blue"> int</span>
                modelId;</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; ">
                
                 </span>
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span style="color: blue">if</span>
                (!kv.ContainsKey(<span style="color: maroon">"Model"</span>) ||<br />
                   !<span style="color: teal">Int32</span>.TryParse(kv[<span
                    style="color: maroon">"Model"</span>], <span style="color: blue">out</span>
                modelId))</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span>{</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style="">  </span><span style="color: blue">return null;</span></span><br/>
            <span style="font-size: 10pt; font-family: 'Courier New';
                    "> }</span><br />
            
        <br/>
            <span style="font-size: 10pt; font-family: 'Courier New'; "> CarsTableAdapters.<span style="color: teal">ColorTableAdapter</span>
                adapter =<br />
                <span style="color: blue">  new</span>
                
            </span>
            <span style="font-size: 10pt; font-family: 'Courier New'; ">CarsTableAdapters.<span
                style="color: teal">ColorTableAdapter</span>();</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; ">
                
                </span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span style="color: teal"> Cars</span>.<span
                    style="color: teal">ColorDataTable</span> colorTable =<br />
                  adapter.GetColorsForModel(modelId);</span><br/>
          

    <br />
            <span style="font-size: 10pt; color: teal; font-family: 'Courier New'; ">
                List</span><span style="font-size: 10pt; font-family: 'Courier New'; ">&lt;<span
                    style="color: teal">CascadingDropDownNameValue</span>&gt; values =<br />
                    <span style="color: blue"> 
                        new</span>
                    
                </span>
            <span style="font-size: 10pt; color: teal; font-family: 'Courier New'; ">
                List</span><span style="font-size: 10pt; font-family: 'Courier New'; ">&lt;<span
                    style="color: teal">CascadingDropDownNameValue</span>&gt;();</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; ">
                
                 </span>
        <br/>    <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span style="color: blue"> foreach</span>
                (<span style="color: teal">DataRow</span> dr <span style="color: blue">in</span>
                colorTable)<br />
             {</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style="">   </span>values.Add(</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New'; ">new</span><span style="font-size: 10pt; font-family: 'Courier New'; ">
                    <span style="color: teal">CascadingDropDownNameValue</span>(</span><br />
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'; "> 
                
                (string</span><span style="font-size: 10pt; font-family: 'Courier New'; ">) dr[<span
                    style="color: maroon">"Color"</span>],</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; ">   dr[<span
                style="color: maroon">"ColorID"</span>].ToString()));</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span>}</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> 
                <br />
            </span><span style="color: blue"> return</span>
                values.ToArray();</span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; ">}</span>
            </code>

        So it's simple to return the values. Note that the values are returned
            as an array of <strong>CascadaingDropDownNameValue</strong> structures. This
            structure also includes an <strong>isDefaultValue</strong> boolean field that allows
            the specification of which value should be selected when the list is first displayed.<br />
            <br />
            Now let's hook up our extender:<br />
        <code>
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'; ">
                &lt;</span><span style="font-size: 10pt; color: maroon; font-family: 'Courier New';
                    ">ajaxToolkit</span><span style="font-size: 10pt; color: blue;
                        font-family: 'Courier New'; ">:</span><span style="font-size: 10pt;
                            color: maroon; font-family: 'Courier New'; ">CascadingDropDown<br />
                        </span><span
                                style="font-size: 10pt; font-family: 'Courier New'; "> <span style="color: red">
                                    
                                    ID</span><span style="color: blue">="CascadingDropDown1"<br />
                                    </span> <span style="color: red"><span style="color: #000"> </span>
                                        runat</span><span style="color: blue">="server"</span></span><br />
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span>
                
            </span>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                TargetControlID</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="ddlMake"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        ">
                        
                    </span>
        <br />
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                Category</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="Make"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        ">
                        
                    </span>
       <br />
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                PromptText</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="Select a manufacturer"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        ">
                        
                    </span>
       <br />
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                ServicePath</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="CarsService.asmx"</span><br />
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                ServiceMethod</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="GetCarMakes"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "> <span style="color: blue">/&gt;</span></span></code>
        If you look at this it's pretty simple. <strong>TargetControlID</strong> specifies
        which control we're extending, in this case it's the drop down that specifies the
        manufacturer or "make" of the car. <strong>PromptText</strong> specifies the
        text to show in the dropdown when no value is selected, and the <strong>ServicePath</strong>
        and <strong>ServiceMethod</strong> attributes tell the extender which web service
        to call to fetch its values.<br />
        <br />
        We can also do this hook up from the designer. If you switch to design view,
        and select the "ddlModel" DropDownList, you can make these hookups in the property
        browser at design time:<br />
        <br />
        <asp:Image ID="Image1" runat="server" ImageUrl="~/images/pbrs.png" />
        <br />
        <br />
        Note the "<strong>ParentControlID</strong>" property which specifies which DropDownList
        is the "parent" for this one. By setting these parent values, you can chain
        or "cascade" these values, and the CascadingDropDown extender will automatically
        manage setting, clearing, and loading the data for you.
        <br />
        <br />
        If you set up the ddlModel and ddlColor lists as well and go back to source view,
        you'll see:<br />
        <code>
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span style="color: blue">
                    &lt;</span><span style="color: maroon">ajaxToolkit</span><span style="color: blue">:</span><span
                        style="color: maroon">CascadingDropDown<br />
                        <span style="color: blue">  </span></span><span style="color: red">ID</span><span
                            style="color: blue">="CascadingDropDown1"<br />
                        </span><span style="color: red"><span style="color: #000"></span>  runat</span><span
                                style="color: blue">="server"</span></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                TargetControlID</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="ddlMake"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                Category</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="Make"</span><br/> 
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                PromptText</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="Select a manufacturer"</span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                ServicePath</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="CarsService.asmx"</span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                ServiceMethod</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="GetCarMakes"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "> <span style="color: blue">/&gt;</span></span><br/>
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style=""> </span><span
                    style="color: blue">&lt;<span style="color: maroon">ajaxToolkit</span><span style="color: blue">:</span><span
                        style="color: maroon">CascadingDropDown<br />
                        <span style="color: blue">  </span></span><span style="color: red">ID</span><span
                            style="color: blue">="CascadingDropDown2"<br />
                        </span><span style="color: red"><span style="color: #000"></span>  runat</span><span
                                style="color: blue">="server"</span></span></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                TargetControlID</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="ddlModel"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                ParentControlID</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="ddlMake"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                PromptText</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="Please select a model"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                ServiceMethod</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="GetModelsForMake"</span><br/>
            <span style="font-size: 10pt; font-family: 'Courier New'; "><span
                style="COLOR: #ff0000">  
            </span><span style="color: red">ServicePath</span><span
                style="color: blue">="CarsService.asmx"</span></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                Category</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="Model"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "> <span style="color: blue">/&gt;</span></span><br/>
            <span style="font-size: 10pt; color: blue; font-family: 'Courier New'; ">&lt;<span style="color: maroon">ajaxToolkit</span><span style="color: blue">:</span><span
                        style="color: maroon">CascadingDropDown<br />
                    <span style="color: blue">  </span></span><span style="color: red">ID</span><span
                            style="color: blue">="CascadingDropDown3"<br />
                    </span><span style="color: red"><span style="color: #000"></span>  runat</span><span
                                style="color: blue">="server"</span></span><span
                                style="font-size: 10pt; font-family: 'Courier New'; "></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                TargetControlID</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="ddlColor"</span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                ParentControlID</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="ddlModel"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                PromptText</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="Please select a color"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                ServiceMethod</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="GetColorsForModel"</span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                ServicePath</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="CarsService.asmx"</span><span style="font-size: 10pt; font-family: 'Courier New';
                        "></span><br/>
            <span style="font-size: 10pt; color: red; font-family: 'Courier New'; "> 
                Category</span><span style="font-size: 10pt; color: blue; font-family: 'Courier New';
                    ">="Color" /&gt;</span></code>
        Once you've completed your web service methods, your cascading drop down is complete!<br />
        <br />
        <p  style="margin: 0in 0in 0pt">
            Finally, in order for the values to be submitted, EventValidation needs to be disabled
            for the page. EventValidation ensures that the values in each control match
            the values that were present when the page was rendered, but since these drop downs
            are populating on the client side, this is never true.<span style="">
            </span>We’re hoping to find a way to resolve this issue but please ensure
            that you understand the potential risks of this and validate the data appropriately
            in your post back when using this control.</p>
        <div>

        <asp:Panel ID="WebServiceCode_HeaderPanel" runat="server" style="cursor: pointer;">
            <div class="heading">
                <asp:ImageButton ID="WebServiceCode_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse"  /> Full WebService Code
            </div>
        </asp:Panel>
        <asp:Panel id="WebServiceCode_ContentPanel" runat="server" style="overflow:hidden;" Height="0px">

                <pre>using System;
    using System.Web;
    using System.Collections;
    using System.Collections.Generic;
    using System.Collections.Specialized;
    using System.Web.Services;
    using System.Web.Services.Protocols;
    using AjaxControlToolkit;
    using System.Data;
    using System.Data.SqlClient;

    /// &lt;summary&gt;
    /// Summary description for CarData
    /// &lt;/summary&gt;
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class CarData : System.Web.Services.WebService
    {
      public CarData()
      {
        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
      }

      [WebMethod]
      public CascadingDropDownNameValue[] GetMakes(
        string knownCategoryValues,
        string category)
      {
        CarsTableAdapters.MakeTableAdapter makeAdapter =
          new CarsTableAdapters.MakeTableAdapter();
        Cars.MakeDataTable makes = makeAdapter.GetMakes();
        List&lt;CascadingDropDownNameValue&gt; values =
          new List&lt;CascadingDropDownNameValue&gt;();
        foreach (DataRow dr in makes)
        {
          string make = (string)dr["Make"];
          int makeId = (int)dr["MakeID"];
          values.Add(new CascadingDropDownNameValue(
            make, makeId.ToString()));
        }
        return values.ToArray();
      }

      [WebMethod]
      public CascadingDropDownNameValue[] GetModelsForMake(
        string knownCategoryValues,
        string category)
      {
        StringDictionary kv =<br />      CascadingDropDown.ParseKnownCategoryValuesString(
          knownCategoryValues);
        int makeId;
        if (!kv.ContainsKey("Make") ||
            !Int32.TryParse(kv["Make"], out makeId))
        {
          return null;
        }
        CarsTableAdapters.ModelTableAdapter makeAdapter =
          new CarsTableAdapters.ModelTableAdapter();
        Cars.ModelDataTable models =
          makeAdapter.GetModelsForMake(makeId);
        List&lt;CascadingDropDownNameValue&gt; values =
          new List&lt;CascadingDropDownNameValue&gt;();
        foreach (DataRow dr in models)
        {
          values.Add(new CascadingDropDownNameValue(
            (string)dr["Model"], dr["ModelID"].ToString()));
        }
        return values.ToArray();
      }

      [WebMethod]
      public CascadingDropDownNameValue[] GetColorsForModel(
        string knownCategoryValues,
        string category)
      {
        StringDictionary kv =
          CascadingDropDown.ParseKnownCategoryValuesString(
          knownCategoryValues);
        int modelId;
        if (!kv.ContainsKey("Model") ||
            !Int32.TryParse(kv["Model"], out modelId))
        {
          return null;
        }
        CarsTableAdapters.ColorTableAdapter adapter =
          new CarsTableAdapters.ColorTableAdapter();
        Cars.ColorDataTable colorTable =
          adapter.GetColorsForModel(modelId);
        List&lt;CascadingDropDownNameValue&gt; values =
          new List&lt;CascadingDropDownNameValue&gt;();
        foreach (DataRow dr in colorTable)
        {
          values.Add(new CascadingDropDownNameValue(
            (string)dr["Color"], dr["ColorID"].ToString()));
        }
        return values.ToArray();
      }
    }</pre> 
                
        </asp:Panel>

        <ajaxToolkit:CollapsiblePanelExtender ID="demoCpe" runat="Server"
            TargetControlID="WebServiceCode_ContentPanel"
            ExpandControlID="WebServiceCode_HeaderPanel"
            CollapseControlID="WebServiceCode_HeaderPanel"
            Collapsed="True"        
            ExpandDirection="Vertical"
            ImageControlID="WebServiceCode_ToggleImage"
            ExpandedImage="~/images/collapse.jpg"
            ExpandedText="Collapse"
            CollapsedImage="~/images/expand.jpg"
            CollapsedText="Expand"
            SuppressPostBack="true" />
        </div>
    </div>
</asp:Content>