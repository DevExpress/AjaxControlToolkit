<%@ Page Language="C#" AutoEventWireup="true" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<script runat="Server" type="text/C#">
    [System.Web.Services.WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static AjaxControlToolkit.Slide[] GetSlides()
    {
        return new AjaxControlToolkit.Slide[] { 
            new AjaxControlToolkit.Slide("images/Blue hills.jpg", "Blue Hills", "Go Blue"),
            new AjaxControlToolkit.Slide("images/Sunset.jpg", "Sunset", "Setting sun"),
            new AjaxControlToolkit.Slide("images/Winter.jpg", "Winter", "Wintery...")};
    }
    
    [System.Web.Services.WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static AjaxControlToolkit.Slide[] GetSlidesWithContext(string contextKey)
    {
        string text = contextKey ?? "";
        return new AjaxControlToolkit.Slide[] { 
            new AjaxControlToolkit.Slide("images/Blue hills.jpg", text, "Go Blue"),
            new AjaxControlToolkit.Slide("images/Sunset.jpg", text, "Setting sun"),
            new AjaxControlToolkit.Slide("images/Winter.jpg", text, "Wintery...")};
    }
</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Slide Show test page</title>
</head>
<body>
    <form id="form1" runat="server">
        &nbsp;&nbsp;
        <br />
        <div>
            <aspext:ToolkitScriptManager ID="ScriptManager1" runat="server">
            </aspext:ToolkitScriptManager>
            <asp:Image runat="server" ID="image1" Height="100" />
            <asp:Button runat="Server" ID="prevButton1" Text="Previous" />
            <asp:Button runat="Server" ID="nextButton1" Text="Next" />
            <aspext:SlideShowExtender runat="Server" ID="slideShowExtender1" TargetControlID="image1"
                NextButtonID="nextButton1" PreviousButtonID="prevButton1" SlideShowServiceMethod="GetSlides"
                Loop="true" />
        </div><br />
        <div>
            <asp:Image runat="server" ID="image2" Height="150" />
            <asp:Button runat="Server" ID="prevButton2" Text="Previous" />
            <asp:Button runat="Server" ID="nextButton2" Text="Next" />
            <aspext:SlideShowExtender runat="Server" ID="slideShowExtender2" TargetControlID="image2"
                NextButtonID="nextButton2" PreviousButtonID="prevButton2" SlideShowServiceMethod="GetSlidesWithContext"
                BehaviorID="SlideShow" ContextKey="Context..." />
        </div>

        <script type="text/javascript">
        
            // Script objects that should be loaded before we run
            var typeDependencies = ['Sys.Extended.UI.SlideShowBehavior'];
            
            // Test Harness
            var testHarness = null;
            
            function navigate(button) {
                return function() {
                    testHarness.fireEvent(button, 'onclick');
                };
            }
               
            function verifySlide(image, slideUrl) {
                return function() {
                    testHarness.assertTrue(image.src.indexOf(slideUrl) > 0, "Image url: " + image.src + " should contain slideUrl: " + slideUrl);    
                };
            }
            
            function imageLoaded(image) {
                return function() {
                    // noop
                };
            }
            
            // Register the tests
            function registerTests(harness) {
                testHarness = harness;
                nextButton = testHarness.getElement('nextButton1');
                prevButton = testHarness.getElement('prevButton1');
                image = testHarness.getElement('image1');
                centMilliSecs = 100;

                var test = testHarness.addTest('Validate slide show with loop=true');
                test.addStep(imageLoaded(image), centMilliSecs * 5, verifySlide(image, "images/Blue%20hills.jpg"));
                // Click next button and validate 2nd slide');
                test.addStep(navigate(nextButton), centMilliSecs * 5, verifySlide(image, "images/Sunset.jpg"));
                // Click next button and validate 3rd slide');
                test.addStep(navigate(nextButton), centMilliSecs * 5, verifySlide(image, "images/Winter.jpg"));
                // Click next button and validate round robin functionality and first slide');
                test.addStep(navigate(nextButton), centMilliSecs * 1, verifySlide(image, "images/Blue%20hills.jpg")); // check for round robin
                // Click prev button and validate round robin functionality and last slide');
                test.addStep(navigate(prevButton), centMilliSecs * 1, verifySlide(image,  "images/Winter.jpg"));
                // Click prev button and validate round robin functionality and second last slide');
                test.addStep(navigate(prevButton), centMilliSecs * 1, verifySlide(image, "images/Sunset.jpg"));
                // Click prev button and validate round robin functionality and first slide');
                test.addStep(navigate(prevButton), centMilliSecs * 1, verifySlide(image, "images/Blue%20hills.jpg"));

                nextButton = testHarness.getElement('nextButton2');
                prevButton = testHarness.getElement('prevButton2');
                image = testHarness.getElement('image2');  
                
                var test = testHarness.addTest('Validate slide show with loop=false');
                test.addStep(imageLoaded(image), centMilliSecs * 5, verifySlide(image, "images/Blue%20hills.jpg"));
                // Click next button and validate 2nd slide');
                test.addStep(navigate(nextButton), centMilliSecs * 5, verifySlide(image, "images/Sunset.jpg"));
                // Click next button and validate 3rd slide');
                test.addStep(navigate(nextButton), centMilliSecs * 5, verifySlide(image, "images/Winter.jpg"));
                // Click next button and validate you are still at the last picture');
                test.addStep(navigate(nextButton), centMilliSecs * 1, verifySlide(image, "images/Winter.jpg")); // check for round robin off
                // Click prev button and validate second last slide');
                test.addStep(navigate(prevButton), centMilliSecs * 1, verifySlide(image,  "images/Sunset.jpg"));
                // Click prev button and check the first slide');
                test.addStep(navigate(prevButton), centMilliSecs * 1, verifySlide(image, "images/Blue%20hills.jpg"));
                // Click prev button and validate round robin functionality is off and that you are at the first slide');
                test.addStep(navigate(prevButton), centMilliSecs * 1, verifySlide(image, "images/Blue%20hills.jpg"));

                var test = testHarness.addTest('ContextKey');
                var behavior = testHarness.getObject('SlideShow');
                test.addStep(imageLoaded(image), centMilliSecs * 5, function() {
                    testHarness.assertEqual(behavior._slides[0].Name, 'Context...', "Slide name '" + behavior._slides[0].Name + "' should be 'Context...'");
                });
            }

        </script>

    </form>
</body>
</html>
