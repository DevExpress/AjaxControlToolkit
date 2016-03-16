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
        public void AddAttributesToRender() {
            var wrapper = new TabContainerWrapper();

            foreach(var theme in Enum.GetValues(typeof(TabsCssTheme))) {
                wrapper.CssTheme = (TabsCssTheme)theme;
                var layout = wrapper.RenderAttributes();

                using(var reader = XmlReader.Create(new StringReader(layout))) {
                    reader.Read();

                    var hasClassAttribute = reader.MoveToAttribute("class");

                    if((TabsCssTheme)theme == TabsCssTheme.None)
                        Assert.False(hasClassAttribute);
                    else 
                        Assert.True(!String.IsNullOrWhiteSpace(reader.Value));
                }
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