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

        [Test]
        public void DoNotStripTagsWithAttributeNameStartsWithScript() {
            var extender = new HtmlEditorExtender {
                EnableSanitization = false
            };

            var text = @"<mrow class=""MJX-TeXAtom-ORD""><mstyle displaystyle=""true"" scriptlevel=""0""></mstyle></mrow>";
            var actual = extender.Decode(text);
            var expected = text;

            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void StripScriptTagWithoutAttributes() {
            var extender = new HtmlEditorExtender {
                EnableSanitization = false
            };

            var text = @" <script>";
            var actual = extender.Decode(text);

            Assert.AreEqual(" ", actual);
        }

        [Test]
        public void DoNotStripDataEncodedImage() {
            using(var html = new HtmlEditorExtender()) {
                html.Sanitizer = new DefaultHtmlSanitizer();

                var decodedText = html.Decode(@"
                    <img src=""data:text/javascript,alert(1)"">
                    <img src=""data:image/png;base64,iVBOReprst"">
                ");

                Assert.True(decodedText.Contains("data:image/png"));
                Assert.False(decodedText.Contains("data:text/javascript"));
            }
        }

        [Test]
        public void RemoveInsecureHtml() {
            using(var html = new HtmlEditorExtender()) {
                html.EnableSanitization = false;

                // was "Z"
                Assert.AreEqual("A", html.Decode("A<script>Z"));

                // was "<script>Z"
                Assert.AreEqual("", html.Decode("<script>Z"));

                Assert.AreEqual("AZ", html.Decode("A<script attr>...</script attr>Z"));

                // was "Hello world!alert()" - see https://github.com/DevExpress/AjaxControlToolkit/issues/525
                Assert.AreEqual(
                    "Hello world! ",
                    html.Decode("Hello world! <script>alert();</script>")
                );

                // was "<style</style>" - see https://github.com/DevExpress/AjaxControlToolkit/issues/513
                var issue513html = "<style><!-- body { font-family: Script; } --></style>";
                Assert.AreEqual(issue513html, html.Decode(issue513html));

                // was "<pClick me</a></p>"
                Assert.AreEqual(
                    "<p><a>Click me</a></p>",
                    html.Decode("<p><a href='javascript:alert()'>Click me</a></p>")
                );

                var comment = "<!-- behavior of expression filter data:text/plain -->";
                Assert.AreEqual(comment, html.Decode(comment));

                Assert.AreEqual(
                    "<p><p><p><p>",
                    html.Decode(
                        "<p style='width: expression(1)'>" +
                        "<p style='position: absolute'>" +
                        "<p style='filter: inherit'>" +
                        "<p style='behavior: url(something.htc)>"
                    )
                );
            }
        }
    }
}
