using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;
using Moq;
using System.Globalization;
using System.Web.UI;
using AjaxControlToolkit.Reference.Core.Rendering;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class CodePlexDocRendererTests {
        Mock<Localization> _moqLocalization = new Mock<Localization>();
        IDocRenderer _codePlexRenderer = new CodePlexDocRenderer();

        [Test]
        public void RenderHeaderEmptyTextTest() {
            var text = String.Empty;
            var actualText = _codePlexRenderer.RenderHeader(text);
            Assert.AreEqual(String.Empty, actualText);
        }

        [Test]
        public void RenderHeaderTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderHeader(text);
            Assert.AreEqual("! " + text, actualText);
        }

        [Test]
        public void RenderHeaderSecondLevelTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderHeader(text, 2);
            Assert.AreEqual("!! " + text, actualText);
        }

        [Test]
        public void RenderEmptyTextTest() {
            var text = String.Empty;
            var actualText = _codePlexRenderer.RenderText(text);
            Assert.AreEqual(String.Empty, actualText);
        }

        [Test]
        public void RenderTextTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderText(text);
            Assert.AreEqual(text, actualText);
        }

        [Test]
        public void RenderBoldTextTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderText(text, bold: true);
            Assert.AreEqual("*" + text + "*", actualText);
        }

        [Test]
        public void RenderItalicTextTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderText(text, italic: true);
            Assert.AreEqual("_" + text + "_", actualText);
        }

        [Test]
        public void RenderBoldItalicTextTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderText(text, bold: true, italic: true);
            Assert.AreEqual("_*" + text + "*_", actualText);
        }

        [Test]
        public void RenderLineBreakTest() {
            var actualText = _codePlexRenderer.RenderNewParagraph();
            Assert.AreEqual("\n", actualText);
        }

        [Test]
        public void RenderEmptyListItemTest() {
            var actualText = _codePlexRenderer.RenderListItem(String.Empty);
            Assert.AreEqual(String.Empty, actualText);
        }

        [Test]
        public void RenderListItemTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderListItem(text);
            Assert.AreEqual("* " + text + "\n", actualText);
        }

        [Test]
        public void RenderOrderedListItemTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderListItem(text, true);
            Assert.AreEqual("# " + text + "\n", actualText);
        }

        [Test]
        public void RenderSecondLevelListItemTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderListItem(text, level: 2);
            Assert.AreEqual("** " + text + "\n", actualText);
        }

        [Test]
        public void RenderOrderedSecondLevelListItemTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderListItem(text, true, 2);
            Assert.AreEqual("## " + text + "\n", actualText);
        }

        [Test]
        public void SanitizeNullTest() {
            var actualText = _codePlexRenderer.Sanitize(null);
            Assert.AreEqual(String.Empty, actualText);
        }

        [Test]
        public void SanitizeBoldTest() {
            var text = "*text*";
            var actualText = _codePlexRenderer.Sanitize(text);
            Assert.AreEqual("{\"*\"}text{\"*\"}", actualText);
        }

        [Test]
        public void SanitizeItalicsTest() {
            var text = "_text_";
            var actualText = _codePlexRenderer.Sanitize(text);
            Assert.AreEqual("{\"_\"}text{\"_\"}", actualText);
        }

        [Test]
        public void SanitizeUnderlineTest() {
            var text = "+text+";
            var actualText = _codePlexRenderer.Sanitize(text);
            Assert.AreEqual("{\"+\"}text{\"+\"}", actualText);
        }

        [Test]
        public void SanitizeHeadingTest() {
            var text = "! text";
            var actualText = _codePlexRenderer.Sanitize(text);
            Assert.AreEqual("{\"!\"} text", actualText);
        }

        [Test]
        public void SanitizeNumberListTest() {
            var text = "# text";
            var actualText = _codePlexRenderer.Sanitize(text);
            Assert.AreEqual("{\"#\"} text", actualText);
        }

        [Test]
        public void RenderCodeBlockTest() {
            var text = "<code>text</code>";
            var actualText = _codePlexRenderer.RenderText(text);
            Assert.AreEqual("{{text}}", actualText);
        }

        [Test]
        public void RenderUrlTest() {
            var text = "abc";
            var url = "http://bcd.ef";
            var actualText = _codePlexRenderer.RenderUrl(text, url);
            Assert.AreEqual("[url:abc|http://bcd.ef]", actualText);
        }
    }
}
