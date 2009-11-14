using Microsoft.Web.Testing.Light;

namespace FunctionalTests.Extended.Watermark
{
    [WebTestClass]
    public class Tests
    {
        [WebTestMethod]
        public void CreateControl()
        {
            // Navigate to the page
            HtmlPage page = new HtmlPage("/Extended/Watermark/Watermark.htm");

            
            // Verify content of the page
            Assert.AreEqual("Hello World!", page.Elements.Find("LoginName1").GetInnerText());

        }




    }
}
