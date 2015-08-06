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
            var actualText = _codePlexRenderer.RenderText(text, bold:true, italic: true);
            Assert.AreEqual("_*" + text + "*_", actualText);
        }

        [Test]
        public void RenderTextBlockTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderTextBlock(text);
            Assert.AreEqual(text, actualText);
        }

        [Test]
        public void RenderNullListTest() {
            var actualText = _codePlexRenderer.RenderList(null);
            Assert.AreEqual(String.Empty, actualText);
        }

        [Test]
        public void RenderEmptyListTest() {
            var items = new List<DocListItem>();
            var actualText = _codePlexRenderer.RenderList(items);
            Assert.AreEqual(String.Empty, actualText);
        }

        [Test]
        public void RenderListHeaderOnlyTest() {
            var items = new List<DocListItem>();
            items.Add(new DocListItem() { Header = "Header" });
            var actualText = _codePlexRenderer.RenderList(items);
            Assert.AreEqual("* " + items[0].Header, actualText);
        }

        [Test]
        public void RenderListTypeOnlyTest() {
            var items = new List<DocListItem>();
            items.Add(new DocListItem() { Type = "Type" });
            var actualText = _codePlexRenderer.RenderList(items);
            Assert.AreEqual("** " + items[0].Type, actualText);
        }

        [Test]
        public void RenderListDescriptionOnlyTest() {
            var items = new List<DocListItem>();
            items.Add(new DocListItem() { Description = "Description" });
            var actualText = _codePlexRenderer.RenderList(items);
            Assert.AreEqual("** " + items[0].Description, actualText);
        }

        [Test]
        public void RenderListHeaderAndDescriptionTest() {
            var items = new List<DocListItem>();
            items.Add(new DocListItem() { Header = "Header", Description = "Description" });
            var actualText = _codePlexRenderer.RenderList(items);
            Assert.AreEqual("* " + items[0].Header + Environment.NewLine + "** " + items[0].Description, actualText);
        }

        [Test]
        public void RenderListTypeAndDescriptionTest() {
            var items = new List<DocListItem>();
            items.Add(new DocListItem() { Type = "Type", Description = "Description" });
            var actualText = _codePlexRenderer.RenderList(items);
            Assert.AreEqual("** " + items[0].Type + Environment.NewLine + "** " + items[0].Description, actualText);
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
            Assert.AreEqual("* " + text, actualText);
        }

        [Test]
        public void RenderOrderedListItemTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderListItem(text, true);
            Assert.AreEqual("# " + text, actualText);
        }

        [Test]
        public void RenderSecondLevelListItemTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderListItem(text, level: 2);
            Assert.AreEqual("** " + text, actualText);
        }

        [Test]
        public void RenderOrderedSecondLevelListItemTest() {
            var text = "text";
            var actualText = _codePlexRenderer.RenderListItem(text, true, 2);
            Assert.AreEqual("## " + text, actualText);
        }
    }
}
