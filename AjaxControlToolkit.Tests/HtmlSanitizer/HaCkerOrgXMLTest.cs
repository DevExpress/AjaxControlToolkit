using AjaxControlToolkit.HtmlEditor.Sanitizer;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Xml;

namespace AjaxControlToolkit.Tests.HtmlSanititzer {

    [TestFixture]
    public class HaCkerOrgXMLTest {

        // Make sure all code from http://ha.ckers.org/xssAttacks.xml sanitized
        [Test]
        [TestCaseSource("TestCases")]
        public void MakeSureItSanitized(string htmlFragment, string message) {
            var target = new DefaultHtmlSanitizer();
            var elementWhiteList = CreateElementWhiteList();

            var actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            if(htmlFragment != "See Below")
                StringAssert.AreNotEqualIgnoringCase(htmlFragment, actual, message);
        }

        static IEnumerable<TestCaseData> TestCases {
            get {
                var source = new XmlDocument();
                source.Load(Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"HtmlSanitizer\XssAttacks.xml"));
                foreach(XmlNode node in source.SelectNodes("/xss/attack"))
                    yield return new TestCaseData(node["code"].InnerText, " ---> " + node["label"].InnerText);
            }
        }

        Dictionary<string, string[]> CreateElementWhiteList() {
            return new Dictionary<string, string[]>{
                { "strong", new string[] { "style", } },
                { "b", new string[] { "style" } },
                { "em", new string[] { "style" } },
                { "i", new string[] { "style" } },
                { "u", new string[] { "style" } },
                { "strike", new string[] { "style" } },
                { "sub", new string[] { } },
                { "sup", new string[] { } },
                { "p", new string[] { "style", "align", "dir" } },
                { "ol", new string[] { } },
                { "li", new string[] { } },
                { "ul", new string[] { } },
                { "font", new string[] { "style", "color", "face", "size" } },
                { "blockquote", new string[] { "style", "dir" } },
                { "hr", new string[] { "size", "width" } },
                { "img", new string[] { "src" } },
                { "div", new string[] { "style", "align" } },
                { "span", new string[] { "style" } },
                { "br", new string[] { "style" } },
                { "center", new string[] { "style" } },
                { "a", new string[] { "href" } }
            };
        }
    }

}