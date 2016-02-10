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
    public class GitHubDocRendererTests {
        Mock<Localization> _moqLocalization = new Mock<Localization>();
        IDocRenderer _gitHubRenderer = new GitHubDocRenderer();

        [Test]
        public void RenderHeaderEmptyTextTest() {
            var text = String.Empty;
            var actualText = _gitHubRenderer.RenderHeader(text);
            Assert.AreEqual(String.Empty, actualText);
        }

        [Test]
        public void RenderHeaderTest() {
            var text = "text";
            var actualText = _gitHubRenderer.RenderHeader(text);
            Assert.AreEqual("# " + text, actualText);
        }

        [Test]
        public void RenderHeaderSecondLevelTest() {
            var text = "text";
            var actualText = _gitHubRenderer.RenderHeader(text, 2);
            Assert.AreEqual("## " + text, actualText);
        }

        [Test]
        public void RenderEmptyTextTest() {
            var text = String.Empty;
            var actualText = _gitHubRenderer.RenderText(text);
            Assert.AreEqual(String.Empty, actualText);
        }

        [Test]
        public void RenderTextTest() {
            var text = "text";
            var actualText = _gitHubRenderer.RenderText(text);
            Assert.AreEqual(text, actualText);
        }

        [Test]
        public void RenderBoldTextTest() {
            var text = "text";
            var actualText = _gitHubRenderer.RenderText(text, bold: true);
            Assert.AreEqual("**" + text + "**", actualText);
        }

        [Test]
        public void RenderItalicTextTest() {
            var text = "text";
            var actualText = _gitHubRenderer.RenderText(text, italic: true);
            Assert.AreEqual("_" + text + "_", actualText);
        }

        [Test]
        public void RenderBoldItalicTextTest() {
            var text = "text";
            var actualText = _gitHubRenderer.RenderText(text, bold: true, italic: true);
            Assert.AreEqual("_**" + text + "**_", actualText);
        }

        [Test]
        public void RenderLineBreakTest() {
            var actualText = _gitHubRenderer.RenderNewParagraph();
            Assert.AreEqual("\n\n", actualText);
        }

        [Test]
        public void RenderEmptyListItemTest() {
            var actualText = _gitHubRenderer.RenderListItem(String.Empty);
            Assert.AreEqual(String.Empty, actualText);
        }

        [Test]
        public void RenderListItemTest() {
            var text = "text";
            var actualText = _gitHubRenderer.RenderListItem(text);
            Assert.AreEqual("* " + text + "\n", actualText);
        }

        [Test]
        public void RenderOrderedListItemTest() {
            var text = "text";
            var actualText = _gitHubRenderer.RenderListItem(text, true);
            Assert.AreEqual("1. " + text + "\n", actualText);
        }

        [Test]
        public void RenderSecondLevelListItemTest() {
            var text = "text";
            var actualText = _gitHubRenderer.RenderListItem(text, level: 2);
            Assert.AreEqual("    * " + text + "\n", actualText);
        }

        [Test]
        public void RenderOrderedSecondLevelListItemTest() {
            var text = "text";
            var actualText = _gitHubRenderer.RenderListItem(text, true, 2);
            Assert.AreEqual("    1. " + text + "\n", actualText);
        }

        [Test]
        public void SanitizeNullTest() {
            var actualText = _gitHubRenderer.Sanitize(null);
            Assert.AreEqual(String.Empty, actualText);
        }

        [Test]
        public void SanitizeBoldTest() {
            var text = "*text*";
            var actualText = _gitHubRenderer.Sanitize(text);
            Assert.AreEqual("\\*text\\*", actualText);
        }

        [Test]
        public void SanitizeItalicsTest() {
            var text = "_text_";
            var actualText = _gitHubRenderer.Sanitize(text);
            Assert.AreEqual("\\_text\\_", actualText);
        }
        
        [Test]
        public void SanitizeHeadingTest() {
            var text = "# text";
            var actualText = _gitHubRenderer.Sanitize(text);
            Assert.AreEqual("\\# text", actualText);
        }

        [Test]
        public void SanitizeNumberListTest() {
            var text = "1. text";
            var actualText = _gitHubRenderer.Sanitize(text);
            Assert.AreEqual("\\1\\. text", actualText);
        }

        [Test]
        public void RenderCodeBlockTest() {
            var text = "<code>text</code>";
            var actualText = _gitHubRenderer.RenderText(text);
            Assert.AreEqual("`text`", actualText);
        }

        [Test]
        public void RenderUrlTest() {
            var text = "abc";
            var url = "http://bcd.ef";
            var actualText = _gitHubRenderer.RenderUrl(text, url);
            Assert.AreEqual("[abc](http://bcd.ef)", actualText);
        }

        [Test]
        public void RenderDescriptionBlockTest() {
            var values = new Dictionary<string, string>();
            values.Add("Name1", "Description1");
            values.Add("Name2", "Description2");

            var actualText = _gitHubRenderer.RenderDescriptionBlock(values);
            Assert.AreEqual("| Name | Description |\n| --- | --- |\n| Name1 | Description1 |\n| Name2 | Description2 |\n", actualText);
        }
    }
}
