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
using AjaxControlToolkit.HtmlEditor.Sanitizer;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class HtmlEditorExtenderTests {

        [Test]
        public void DoNotClearUrlText() {
            var extender = new HtmlEditorExtender();
            extender.EnableSanitization = false;
            var text = "Please click <a href=\"www.curl.com\">here</a>.";
            var actual = extender.Decode(text);
            var expected = text;
            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void AlwaysHasDefaultWhitelistEements() {
            var extender = new HtmlEditorExtender();
            extender.EnableSanitization = true;
            var sanitizerMoq = new Mock<IHtmlSanitizer>();
            sanitizerMoq.Setup(c => c.GetSafeHtmlFragment(It.IsAny<string>(), It.IsAny<Dictionary<string, string[]>>())).Returns((string x, Dictionary<string, string[]> y) => x);
            extender.Sanitizer = sanitizerMoq.Object;

            var text = "<span>text</span><br />";
            var actual = extender.Decode(text);
            var expected = text;
            Assert.AreEqual(expected, actual);
        }
    }
}