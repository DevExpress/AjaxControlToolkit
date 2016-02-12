#pragma warning disable 1591
namespace AjaxControlToolkit.Design {

    public class SlideShowExtenderDesigner : ExtenderControlBaseDesigner<SlideShowExtender> {
        // Signature of the page method for SlideShow's web service that
        // is used to support adding/navigating to the page method from the designer.
        // СontextKey is an optional user specific context.
        // Returns slides to display.
        [PageMethodSignature("SlideShow", "SlideShowServicePath", "SlideShowServiceMethod", "UseContextKey")]
        delegate Slide[] GetSlides(string contextKey);
    }

}

#pragma warning restore 1591