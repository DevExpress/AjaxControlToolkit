using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AjaxControlToolkit;
using System.Web.UI;
using System.IO;
using Moq;
using System.Xml;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class TabPanelTests {

        [Test]
        public void ParseHeaderInfo() {
            var wrapper = new TabPanelWrapper();
            var mockWrapper = new Mock<TabPanelWrapper>();

            var layout = wrapper.RenderElement();

            using(var reader = XmlReader.Create(new StringReader(layout))) {
                reader.Read();
            }
        }

    }

    class TabPanelWrapper : TabPanel {

        public TabPanelWrapper() {
            ID = "abc";
        }

        protected override void RegisterScriptDescriptors() {
        }

        public string RenderElement() {
            StringBuilder sb = new StringBuilder();
            TextWriter textWriter = new StringWriter(sb);
            HtmlTextWriter writer = new HtmlTextWriter(textWriter);
            Render(writer);

            return sb.ToString();
        }
    }

}