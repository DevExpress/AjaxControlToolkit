<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    Title="Automated Testing" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <div class="walkthrough">
        <div class="heading">Automated Testing</div>
        <p>
            JavaScript presents several challenges when testing user interface components written using ASP.NET AJAX.
            With asynchronous operations like web service calls or animation, you have to start the operation
            and wait for it to complete without blocking before you can verify the result.  Postbacks are just
            as difficult because you have to perform an action that causes a postback and then have the test
            resume processing where it left off when the page loads again.  We have written a JavaScript testing
            framework, in the <span class="codeReference">ToolkitTests</span> web project, to eliminate these
            problems when writing tests for your components.
        </p>
        <p></p>
        <p>
            The following walkthrough describes the steps you need to take to get started using the AJAX Control
            Toolkit Automated Test Harness.
        </p>
        <p></p>
        <div class="subheading">Creating a Component Unit Test</div>
        <p>
            The AJAX Control Toolkit Automated Test Harness allows you to easily write tests for user interface
            components written in JavaScript.  The test harness is the web application that actually runs all of
            the selected test suites and displays their results.  A test suite is an <span class="codeReference">*.aspx</span>
            page that contains instances of your component as well as the definition of several test cases.  A test
            case is an individual unit test consisting of a series of test steps to evaluate a particular area of
            functionality.  A test step is an action (possibly performed asynchronously or after a postback) that
            operates on your component.
        </p>
        <p></p>
        <p>
            There are four basic steps to creating a suite:</p>
            <ol>
                <li>Create an ASPX page with the UI that you'd like to test.</li><li>Declare a top-level JavaScript variable called <span class="codeReference">typeDependencies</span>
                    that lists the types that need to be loaded for your type to run.</li><li>Declare a JavaScript function called <span class="codeReference">registerTests</span> that defines
                    the tests and the steps of those tests.</li><li>Inside of <span class="codeReference">registerTests</span>, declare a set of tests and test steps.</li></ol>
        <p>
            As you'll see below, the Test Harness takes a set of steps, queues them up, then executes them in order, either
            synchronously or asynchronously, by waiting for their completion function to return true.
        </p>
        <p></p>
        <p>
            To create a new test suite, add a new Web Form to the <span class="codeReference">ToolkitTests</span> project and
            select the <span class="codeReference">Default.master</span> master page.  Then add instances of your component to
            the Web Form that you will use in the tests.  Next, you need to create a <span class="codeReference">&lt;script&gt;</span>
            block that contains definitions of your test cases and test harness entry points.  If you were writing a test suite
            for <span class="codeReference">CascadingDropDown</span>, it would look something like this:
        </p>
        <code>
            
                <span style=" background: yellow; font-family: 'Lucida Console'; 
                    ">&lt;%</span><span style=" color: blue; font-family: 'Lucida Console';
                        ">@</span><span style=" font-family: 'Lucida Console';
                            "> <span style="color: maroon">Page</span></span>
                
                <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span><span style="color: red">Language</span><span
                        style="color: blue">="C#"</span></span>
                <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span><span style="color: red">CodeFile</span><span
                        style="color: blue">="CascadingDropDown.aspx.cs"</span></span>
                <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span><span style="color: red">Inherits</span><span
                        style="color: blue">="Automated_CascadingDropDown"</span></span>
                <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span><span style="color: red">Title</span><span
                        style="color: blue">="CascadingDropDown Tests"</span></span>
                <br />        
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span><span style="color: red">MasterPageFile</span><span
                        style="color: blue">="~/Default.master"</span></span>
                <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span><span style="color: red">EnableEventValidation</span><span
                        style="color: blue">="false"</span> <span style="background: yellow; ">
                            %&gt;</span></span>
                <br />  
                <span style=" color: blue; font-family: 'Lucida Console'; ">
                    &lt;</span><span style=" color: maroon; font-family: 'Lucida Console';
                        ">asp</span><span style=" color: blue; font-family: 'Lucida Console';
                            ">:</span><span style=" color: maroon; font-family: 'Lucida Console';
                                ">Content</span><span style=" font-family: 'Lucida Console';
                                    "> <span style="color: red">ID</span><span style="color: blue">="Content"</span></span><
                  <br />
                 <span style=" font-family: 'Lucida Console'; ">
                    <span style="color: blue"></span></span><span style=" font-family: 'Lucida Console';
                        "><span style="color: red">ContentPlaceHolderID</span><span style="color: blue">="SampleContent"</span></span>
                  <br />
                 <span style=" font-family: 'Lucida Console'; ">
                    <span style="color: blue"></span><span style="color: red">Runat</span><span style="color: blue">="Server"&gt;</span></span>
                  <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue"><span style="color: #000">
                         </span>&lt;</span><span style="color: maroon">asp</span><span style="color: blue">:</span><span
                            style="color: maroon">DropDownList</span> <span style="color: red">ID</span><span
                                style="color: blue">="DropDownList1"</span></span>
                  <br />
                  <span style=" font-family: 'Lucida Console'; ">
                    <span style="color: blue"></span><span style="color: red">runat</span><span style="color: blue">="server"</span>
                    <span style="color: red">Width</span><span style="color: blue">="170"</span><span
                        style="color: #0000ff; ">&gt;</span></span>
                  <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: blue">&lt;</span><span
                        style="color: maroon">ajaxToolkit</span><span style="color: blue">:</span><span
                            style="color: maroon">CascadingDropDown</span> <span style="color: red">ID</span><span
                                style="color: blue">="CascadingDropDown1"</span></span>
                  <br />
                  <span style=" font-family: 'Lucida Console'; ">
                    <span style="color: blue"></span><span style="color: red">runat</span><span style="color: blue">="server"</span></span>
                  <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="color: red">  TargetControlID</span><span style="color: blue">="DropDownList1"</span>
                    
                </span>
                  <br />
            
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span><span style="color: red">Category</span><span
                        style="color: blue">="Make"</span></span>
                  <br />
                  <span style=" font-family: 'Lucida Console';
                    "><span style="color: blue"></span><span style="color: red">PromptText</span><span
                        style="color: blue">="Please select a make"</span><span style=""> </span></span>
                  <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span></span><span style=" font-family: 'Lucida Console';
                        "><span style="">  </span><span
                            style="color: red">ServicePath</span><span style="color: blue">="CarsService.asmx"</span></span>
                  <br />
                  <span style=" font-family: 'Lucida Console';
                    "><span style="color: blue"></span><span style="color: red">ServiceMethod</span><span
                        style="color: blue">="GetDropDownContents"</span> <span style="color: blue">/&gt;</span><span
                            style="">    </span><span style="color: blue">
                            </span></span>
                  <br />
                 <span style=" font-family: 'Lucida Console'; ">
                    <span style="color: blue">&lt;</span><span style="color: maroon">asp</span><span
                        style="color: blue">:</span><span style="color: maroon">Label</span> <span style="color: red">
                            ID</span><span style="color: blue">="Label1"</span> <span style="color: red">runat</span><span
                                style="color: blue">="server"</span></span>
                  <br />
                 <span style=" font-family: 'Lucida Console'; ">
                    <span style="color: blue"></span><span style="color: red">Text</span><span style="color: blue">="Label"&gt;&lt;/</span><span
                        style="color: maroon">asp</span><span style="color: blue">:</span><span style="color: maroon">Label</span><span
                            style="color: blue">&gt;</span></span>
                  <br />
                 <span style=" font-family: 'Lucida Console'; ">
                    <span style="color: blue">&lt;</span><span style="color: maroon">asp</span><span
                        style="color: blue">:</span><span style="color: maroon">Button</span> <span style="color: red">
                            ID</span><span style="color: blue">="Button1"</span> <span style="color: red">runat</span><span
                                style="color: blue">="server"</span></span>
                  <br />
                  <span style=" font-family: 'Lucida Console'; ">
                    <span style="color: blue"></span><span style="color: red">Text</span><span style="color: blue">="Button"</span>
                    <span style="color: red">OnClick</span><span style="color: blue">="Button1_Click"</span>
                    <span style="color: blue">/&gt;</span></span>
                  <br />
                <span style=" color: blue; font-family: 'Lucida Console'; ">
                    
                </span><span style=" font-family: 'Lucida Console'; ">
                    <span style="color: blue">&lt;</span><span style="color: maroon">script</span> <span
                        style="color: red">type</span><span style="color: blue">="text/javascript"&gt;</span></span>
                  <br />
                <span style=" color: blue; font-family: 'Lucida Console'; ">
                    <span style=""></span></span>
                  <br />
                <span style=" color: blue; font-family: 'Lucida Console'; ">
                    <span style="">  </span></span><span style="
                        color: green; font-family: 'Lucida Console';  ">
                        // Define the test cases</span>
          <br />
                <span style=" color: green; font-family: 'Lucida Console'; 
                    ">
                    
                </span>
                  <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">&lt;/</span><span
                        style="color: maroon">script</span><span style="color: blue">&gt;</span></span>
                  <br />
                <span style=" color: blue; font-family: 'Lucida Console'; ">
                    &lt;/</span><span style=" color: maroon; font-family: 'Lucida Console';
                        ">asp</span><span style=" color: blue; font-family: 'Lucida Console';
                            ">:</span><span style=" color: maroon; font-family: 'Lucida Console';
                                ">Content</span><span style=" color: blue; font-family: 'Lucida Console';
                                    ">&gt;</span>

        </code>
        <p>
            Now, in the JavaScript block, we declare an array of strings called <span class="codeReference">typeDependencies</span> that
            contains the fully qualified JavaScript names of the components used in your test suite.  The test harness will wait for all
            of these objects to have been defined before running any of your tests.  This is critical; without it the tests will
            intermittently fail based on how long it takes to load the behaviors.
        </p>
        <p></p>
        <p>
            For the <span class="codeReference">CascadingDropDown</span> test suite, we have: 
        </p>
        <code>
            
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: green">// Script objects that should
                        be loaded before we run</span></span>
                        <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">var</span> typeDependencies
                    =</span>
            <br />
                 <span style=" font-family: 'Lucida Console'; ">
                </span><span style=" font-family: 'Lucida Console'; ">
                    [</span><span style=" font-family: 'Lucida Console'; "><span
                        style="color: maroon">'AjaxControlToolkit.CascadingDropDownBehavior'</span>];</span>
        
        </code>
        <p>
            Next, declare a function <span class="codeReference">registerTests</span> that takes a parameter called harness.
            The test harness will pass this function a reference to itself when loading the test suite so the suite can add
            new test cases.  You will often want to save the reference to the test harness in a global variable because it
            contains useful utility functions, like assertions, that you may want to use elsewhere.
        </p>
        <p></p>
        <p>
            Before we start writing test cases, let's first get references to controls used in the test suite with
            <span class="codeReference">testHarness.getElement(id)</span> and <span class="codeReference">testHarness.getObject('id')</span>.
            These two methods wrap <span class="codeReference">document.getElementByID</span> and
            <span class="codeReference">Sys.Application.findControl</span> respectively, but also raise errors if controls
            aren't found and prevent your test cases from running.  Since we will use the references in other areas, we make
            them global variables.  The script for the <span class="codeReference">CascadingDropDown test</span> suite should now look like this:
        </p>
        <code>
            <span style="font-size: 10pt; font-family: Consolas; "><span
            style=""></span></span><span style=" color: blue;
                font-family: 'Lucida Console'; ">&lt;</span><span style="
                    color: maroon; font-family: 'Lucida Console'; ">script</span><span
                        style=" font-family: 'Lucida Console'; "> <span style="color: red">
                            type</span><span style="color: blue">="text/javascript"&gt;</span></span>
            <br />
                                    <span style=" font-family: 'Lucida Console'; "><span
                                        style=""> </span><span style="color: green">// Script objects
                                            that should be loaded before we run</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: blue">var</span> typeDependencies
                    =</span>
            <br />
                  <span style=" font-family: 'Lucida Console'; ">
                    [<span style="color: maroon">'AjaxControlToolkit.CascadingDropDownBehavior'</span>];</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span>
                    
                </span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: green">// Test Harness</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: blue">var</span> testHarness
                    = <span style="color: blue">null</span>;</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">
                    
                </span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: green">// Controls in the
                        test page</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: blue">var</span> drop1
                    = <span style="color: blue">null</span>;</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: blue">var</span> btn
                    = <span style="color: blue">null</span>;</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: blue">var</span> label
                    = <span style="color: blue">null</span>;</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">    </span>
                    
                </span>
            
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: green">// Run the tests</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: blue">function</span>
                    registerTests(harness) {</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span>testHarness = harness;</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">
                    
                </span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span><span style="color: green">// Get the
                        client ID's from the controls on the page</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span>drop1 = testHarness.getElement(</span>
            <br />
                   <span style=" font-family: 'Lucida Console';
                    "><span style="color: maroon">'ctl00_SampleContent_DropDownList1'</span>);</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span></span><span style="
                        font-family: 'Lucida Console'; "><span style=""></span>
                        btn = testHarness.getElement(</span>
            <br />
                   <span style=" font-family: 'Lucida Console';
                    "><span style="color: maroon">'ctl00_SampleContent_Button1'</span>);</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span>label = testHarness.getElement(</span>
            <br />
                   <span style=" font-family: 'Lucida Console';
                    "><span style="color: maroon">'ctl00_SampleContent_Label1'</span>);<span
                        style="">      </span>
                    
                </span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span> }</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">&lt;/</span><span style="color: maroon">script</span><span
                        style="color: blue">&gt;</span></span>
        </code>
        <p>
            For the full version of these functions, please see <span class="codeReference">CascadingDropDown.aspx</span> in the
            <span class="codeReference">ToolkitTests</span> project.  Now that we have all the plumbing out of the way, we can define the test
            cases using <span class="codeReference">var test = testHarness.addTest('test name')</span>.  This returns a test case object that
            we can add a sequence of steps to for the test harness to run.  We will reload the page before running each test case, so you
            should expect the controls to be in their initial state for each test iteration.  Be careful not to expect changes to persist
            from one test to another.
        </p>
        <p></p>
        <p>
            Once we have a test case, we can add steps to it with <span class="codeReference">test.addStep</span> and
            <span class="codeReference">test.addPostBack</span>.  There are three main types of test steps:
        </p>
            <ul>
                <li>simple steps that perform an action an return: <span class="codeReference">test.addStep(someFunction)</span></li><li>steps that perform an asynchronous action and wait for it to finish: <span class="codeReference">
                    test.addStep(someFunction, isCompleteFunction, pollingInterval, timeOutTime, verifyStateFunction)</span></li><li>steps that force post-backs: <span class="codeReference">test.addPostBack(postBackElement)</span></li></ul>
        <p>For an asynchronous step, here are the parameter descriptions:</p>
            <ul>
                <li><span class="codeReference">someFunction</span> - the function to execute </li>
                <li><span class="codeReference">isCompleteFunction</span> - a function to call to check if the action has completed (optional)</li><li><span class="codeReference">interval</span> - the time to wait between calls to the check function (optional)</li><li><span class="codeReference">timeout</span> - the total time to wait before failing the test (optional)</li><li><span class="codeReference">verifyStateFunction</span> - a function to call to verify the state after the check function has completed (optional)</li></ul>
        <p>
            Note that the functions must take no parameters (if they need to take parameters, wrap them as mentioned below).
        </p>
        <p></p>
        <p>
            Here are example test cases from the <span class="codeReference">registerTests</span> function in the
            <span class="codeReference">CascadingDropDown</span> test suite, see below for function definitions):
        </p>
        <code>
            
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: green">// Test the initial values<span
                        style="">      </span>
                        </span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">var</span> test = testHarness.addTest(<span
                        style="color: maroon">'Initial Values'</span>);<br />
                    <span style=""></span><span style="color: green"></span></span>
            
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="color: green">// Wait until the drop downs are loaded</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addStep(function() {},</span>
            <br />
                 <span style=" font-family: 'Lucida Console'; ">
                    checkLoaded(drop1, drop4, drop5, drop6));</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addStep(testInitialState);</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style=""></span>
                    
                </span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: green"></span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="color: green">// Select from first level</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">var</span> test = testHarness.addTest(<span
                        style="color: maroon">'Select from first level'</span>);</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addStep(function() {},</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">
                    checkLoaded(drop1, drop4, drop5, drop6));</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addStep(testInitialState);</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addStep(setSelectedIndex(drop1, 3),</span>
            <br />
                 <span style=" font-family: 'Lucida Console'; ">
                    checkLoaded(drop1, drop2),
                    
                </span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>testValuesAfterFirstSelected);</span>
        </code>
        <p>
            To add a postback step, simply call <span class="codeReference">test.addPostBack(element);</span> where the
            <span class="codeReference">element</span> is a link, button, form, etc., that will cause a postback when
            clicked or submitted.  When the test case is run and a postback occurs, the test harness will automatically
            resume processing the test on the <i>next step after the postback</i> when the page has reloaded.  The
            following test case from the <span class="codeReference">CascadingDropDown</span> test suite shows an example
            of using a postback step:
        </p>
        <code>
            
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: green">// Values preserved on postback</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">var</span> test = testHarness.addTest(<span
                        style="color: maroon">'Values preserved on PostBack'</span>);</span>
            
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addStep(function() {},</span>
            <br />
                 <span style=" font-family: 'Lucida Console'; ">
                    checkLoaded(drop1, drop4, drop5, drop6));</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addStep(testInitialState);</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addStep(setSelectedIndex(drop1, 3),</span>
            <br />
                 <span style=" font-family: 'Lucida Console'; ">
                    checkLoaded(drop1, drop2),
                    
                </span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>testValuesAfterFirstSelected);</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addPostBack(btn);</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addStep(empty,</span>
            <br />
                 <span style=" font-family: 'Lucida Console'; ">
                    checkLoaded(drop1, drop2, drop4, drop5, drop6));</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>test.addStep(testValuesAfterFirstSelected);</span><span
                        style="font-size: 10pt; font-family: 'Verdana','sans-serif'; "></span>
        </code>
        <p>
            To define the test cases, we will need to provide the test steps with functions that actually operate on the component.
            It is very important to note that the test steps <i>can only take functions with no parameters</i>, so if we have a function
            that needs parameters, wrap it in a parameterless function (for an example, see <span class="codeReference">setSelectedIndex</span>
            below).  These functions can use the utility functions of the test harness to make them easier to write.  
        </p>
        <p></p>
        <p>
            The utility functions will be familiar to those using TDD and include:
        </p>
            <ul>
                <li><span class="codeReference">assertTrue(condition, 'message')</span></li><li><span class="codeReference">assertFalse(condition, 'message')</span></li><li><span class="codeReference">assertEqual(objA, objB, 'message')</span></li><li><span class="codeReference">assertNotEqual(objA, objB, 'message')</span></li><li><span class="codeReference">assertNull(obj, 'message')</span></li><li><span class="codeReference">assertNotNull(obj, 'message')</span></li><li><span class="codeReference">fireEvent(element, 'eventName')</span></li></ul>
        <p>
            For the <span class="codeReference">CascadingDropDown</span> test suite, we could add the following test functions:
        </p>
        <code>
            
                <span style=" color: green; font-family: 'Lucida Console'; ">
                    // Check if the drop down elements passed as arguments</span>
            <br />
                <span style="font-size: 10pt; font-family: Consolas; "><span style="">
                </span></span><span style=" color: green; font-family: 'Lucida Console';
                    ">// are loaded by seeing if they have been enabled</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">function</span> checkLoaded()
                    {</span>
            <br />
                <span style=" color: green; font-family: 'Lucida Console'; ">
                    <span style=""> </span>// ...</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>}</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">
                    
                </span>
            <br />
            
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: green">// Ensure the dropdown is
                        properly enabled</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">function</span> checkEnabled(dropdown)
                    {</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span>testHarness.assertTrue(!dropdown.disabled,</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span><span style="color: maroon">"Drop down
                        '"</span> + dropdown.id + <span style="color: maroon">"' should be enabled"</span>);</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">}</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">
                    
                </span>
            <br />
                <span style=" color: green; font-family: 'Lucida Console'; ">
                    <span style=""></span>// ...</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">    </span>
                    <br />
                    <span style=""></span><span style="color: green">// Set the selected
                        index of a drop down and</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: green">// force the onChange event
                        to be fired</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">function</span> setSelectedIndex(dropdown,
                    index) {</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue"> return</span>
                    <span style="color: blue">function</span>() {</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span>dropdown.selectedIndex = index;</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="">  </span>testHarness.fireEvent(dropdown, <span
                        style="color: maroon">'onchange'</span>);</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span>};</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">}</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">
                    
                </span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: green">// Test the initial state</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">function</span> testInitialState()
                    {</span>
            <br />
                <span style=" color: green; font-family: 'Lucida Console'; ">
                    <span style=""></span> // ...</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">}</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">
                    
                </span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: green">// Ensure the last dropdowns
                        respond after a selection</span></span>
            <br />
                // <span style=" font-family: 'Lucida Console'; "><span
                    style="color: green">in the first</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">function</span> testValuesAfterFirstSelected()
                    {
                    
                </span>
            <br />
                <span style=" color: green; font-family: 'Lucida Console'; ">
                    <span style=""> </span>// ...</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>}</span>
            <br />
                <span style=" font-family: 'Lucida Console'; ">
                    
                </span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: green">// Ensure the last dropdown
                        responds after a selection</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style="color: green">// in the second</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span><span style="color: blue">function</span> testValuesAfterSecondSelected()
                    {</span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""> </span><span style="color: green">// ...</span></span>
            <br />
                <span style=" font-family: 'Lucida Console'; "><span
                    style=""></span>}</span><span style=" font-family: 'Lucida Console'"></span>
        </code>
        <p>
            We can now start the test harness by viewing <span class="codeReference">Default.aspx</span> of the
            <span class="codeReference">ToolkitTests</span> project and select our test suite to run.
            For the automated <span class="codeReference">CascadingDropDown.aspx</span> test suite and tests for the rest 
            of the toolkit controls, see the <span class="codeReference">ToolkitTests</span> project.
        </p>
    </div>
</asp:Content>