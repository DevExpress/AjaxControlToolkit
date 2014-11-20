using AjaxControlToolkit.HtmlEditor.Sanitizer;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml;
using System.Reflection;
using System.Web.UI;

namespace AjaxControlToolkit.Tests.HtmlSanititzer {

    [TestFixture]
    public class HaCkerOrgXMLTest {

        [Test]
        public void CheckParseChildrenAttributes() {
            Assembly assembly = typeof(ExtenderControlBase).Assembly;
            foreach(var type in assembly.GetTypes()) {
                var attrs = type.GetCustomAttributes(typeof(ParseChildrenAttribute), false);

                if(attrs.Length == 0)
                    continue;

                var parentAttrs = type.BaseType.GetCustomAttributes(typeof(ParseChildrenAttribute), true);


                if(parentAttrs.Length == 0) {
                    Console.WriteLine("+    {0} ", type.Name);
                    continue;
                }

                if(parentAttrs.Length == 1) {
                    Console.WriteLine("{1}    {0} ", type.Name, ((ParseChildrenAttribute)parentAttrs[0]).ChildrenAsProperties);
                    continue;
                }

                throw new Exception("AHTUNG!");
            }
        }

        // Make sure all code from http://ha.ckers.org/xssAttacks.xml sanitized
        [Test]
        [TestCaseSource("TestCases")]
        public void MakeSureItSanitized(string htmlFragment, string message) {
            var target = new HtmlAgilityPackSanitizerProvider();
            var elementWhiteList = CreateElementWhiteList();

            var actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            if(htmlFragment != "See Below")
                StringAssert.AreNotEqualIgnoringCase(htmlFragment, actual, message);
        }

        IEnumerable<TestCaseData> TestCases {
            get {
                var source = new XmlDocument();
                source.Load("../AjaxControlToolkit.Tests/HtmlSanititzer/XssAttacks.xml");

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