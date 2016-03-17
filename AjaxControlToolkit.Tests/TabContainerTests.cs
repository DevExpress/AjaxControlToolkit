using NUnit.Framework;
using System;
using System.Text;
using System.Web.UI;
using System.IO;
using System.Xml;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class TabContainerTests {
        [Test]
        public void CssClassDoesNotContainCssTheme() {

            foreach(var theme in Enum.GetValues(typeof(TabCssTheme))) {
                var wrapper = new TabContainerWrapper();
                wrapper.CssTheme = (TabCssTheme)theme;
                var testCssClass = "test-class";
                wrapper.CssClass = testCssClass;

                var layout = wrapper.RenderAttributes();
                var classValue = GetClassAttribute(layout);

                Assert.AreEqual(testCssClass, classValue);
            }
        }

        string GetClassAttribute(string layout) {
            using(var reader = XmlReader.Create(new StringReader(layout))) {
                reader.Read();
                return reader.MoveToAttribute("class") ? reader.Value : null;
            }
        }

    }

    class TabContainerWrapper : TabContainer {

        public string RenderAttributes() {
            using(var stringWriter = new StringWriter())
            using(var htmlTextWriter = new HtmlTextWriter(stringWriter)) {
                AddAttributesToRender(htmlTextWriter);
                htmlTextWriter.RenderBeginTag(HtmlTextWriterTag.Div);
                htmlTextWriter.RenderEndTag();

                return stringWriter.ToString();
            }
        }
    }

}