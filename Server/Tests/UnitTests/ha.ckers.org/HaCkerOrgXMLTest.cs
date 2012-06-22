using System.Collections.Generic;
using AjaxControlToolkit.Sanitizer;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UnitTests
{
    [TestClass]
    public class HaCkerOrgXMLTest
    {
        public TestContext TestContext { get; set; }

        /// <summary>
        /// Make sure all code from http://ha.ckers.org/xssAttacks.xml sanitized
        /// </summary>
        [TestMethod]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML", "|DataDirectory|\\XssAttacks.xml", "attack", DataAccessMethod.Sequential)]
        [DeploymentItem("Server\\Tests\\UnitTests\\ha.ckers.org\\XssAttacks.xml")]
        public void MakeSureItSanitized()
        {
            var target = new HtmlAgilityPackSanitizerProvider();
            var elementWhiteList = CreateElementWhiteList();
            var attributeWhiteList = CreateAttributeWhiteList();

            var htmlFragment = (string)TestContext.DataRow["code"];
            var label = " ---> " + (string)TestContext.DataRow["label"];
            var actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            if (htmlFragment != "See Below")
                Assert.AreNotEqual(htmlFragment, actual, true, label);
        }


        #region private methods

        private Dictionary<string, string[]> CreateElementWhiteList()
        {
            // make list of tags and its relatd attributes
            Dictionary<string, string[]> TagList = new Dictionary<string, string[]>();

            TagList.Add("strong", new string[] { "style", });
            TagList.Add("b", new string[] { "style" });
            TagList.Add("em", new string[] { "style" });
            TagList.Add("i", new string[] { "style" });
            TagList.Add("u", new string[] { "style" });
            TagList.Add("strike", new string[] { "style" });
            TagList.Add("sub", new string[] { });
            TagList.Add("sup", new string[] { });
            TagList.Add("p", new string[] { "style", "align", "dir" });
            TagList.Add("ol", new string[] { });
            TagList.Add("li", new string[] { });
            TagList.Add("ul", new string[] { });
            TagList.Add("font", new string[] { "style", "color", "face", "size" });
            TagList.Add("blockquote", new string[] { "style", "dir" });
            TagList.Add("hr", new string[] { "size", "width" });
            TagList.Add("img", new string[] { "src" });
            TagList.Add("div", new string[] { "style", "align" });
            TagList.Add("span", new string[] { "style" });
            TagList.Add("br", new string[] { "style" });
            TagList.Add("center", new string[] { "style" });
            TagList.Add("a", new string[] { "href" });

            return TagList;
        }

        private Dictionary<string, string[]> CreateAttributeWhiteList()
        {
            Dictionary<string, string[]> AttributeList = new Dictionary<string, string[]>();
            // create white list of attributes and its values
            AttributeList.Add("style", new string[] { "background-color", "margin", "margin-right", "padding", "border", "text-align" });
            AttributeList.Add("align", new string[] { "left", "right", "center", "justify" });
            AttributeList.Add("color", new string[] { });
            AttributeList.Add("size", new string[] { });
            AttributeList.Add("face", new string[] { });
            AttributeList.Add("dir", new string[] { "ltr", "rtl", "Auto" });
            AttributeList.Add("width", new string[] { });
            AttributeList.Add("src", new string[] { });
            AttributeList.Add("href", new string[] { });

            return AttributeList;
        }

        #endregion
    }
}