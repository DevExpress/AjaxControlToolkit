using AjaxControlToolkit.Sanitizer;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using HtmlAgilityPack;

namespace UnitTests
{
    
    
    /// <summary>
    ///This is a test class for HtmlAgilityPackSanitizerProviderTest and is intended
    ///to contain all HtmlAgilityPackSanitizerProviderTest Unit Tests
    ///</summary>
    [TestClass()]
    public class HtmlAgilityPackSanitizerProviderTest
    {


        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Additional test attributes
        // 
        //You can use the following additional attributes as you write your tests:
        //
        //Use ClassInitialize to run code before running the first test in the class
        //[ClassInitialize()]
        //public static void MyClassInitialize(TestContext testContext)
        //{
        //}
        //
        //Use ClassCleanup to run code after all tests in a class have run
        //[ClassCleanup()]
        //public static void MyClassCleanup()
        //{
        //}
        //
        //Use TestInitialize to run code before running each test
        //[TestInitialize()]
        //public void MyTestInitialize()
        //{
        //}
        //
        //Use TestCleanup to run code after each test has run
        //[TestCleanup()]
        //public void MyTestCleanup()
        //{
        //}
        //
        #endregion
        
        /// <summary>
        ///A test for Xss locator
        ///</summary>
        [TestMethod()]
        public void XSSLocatorTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "'';!--\"<XSS>=&{()}";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "'';!--\"<XSS>=&{()}";
            string actual = "'';!--\"<XSS>=&{()}";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector
        ///</summary>
        [TestMethod()]
        public void ImageXSS1Test()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=\"javascript:alert('XSS');\">";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=\":alert(&#39;XSS&#39;);\">";
            string actual = "<IMG SRC=\"javascript:alert('XSS');\">";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector without quotes and semicolon.
        ///</summary>
        [TestMethod()]
        public void ImageXSS2Test()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=javascript:alert('XSS')>";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=\":alert(&#39;XSS&#39;)\">";
            string actual = "<IMG SRC=javascript:alert('XSS')>";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image xss vector with case insensitive.
        ///</summary>
        [TestMethod()]
        public void ImageCaseInsensitiveXSSTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=JaVaScRiPt:alert('XSS')>";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=\":alert(&#39;XSS&#39;)\">";
            string actual = "<IMG SRC=JaVaScRiPt:alert('XSS')>";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector with Html entities
        ///</summary>
        [TestMethod()]
        public void ImageHtmlEntitiesXSSTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=javascript:alert(&quot;XSS&quot;)>";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=\":alert(&amp;quot;XSS&amp;quot;)\">";
            string actual = "<IMG SRC=javascript:alert(&quot;XSS&quot;)>";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector with grave accent
        ///</summary>
        [TestMethod()]
        public void ImageGraveAccentXSSTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=`javascript:alert(\"RSnake says, 'XSS'\")`>";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=`:alert(&quot;RSnake says, 'XSS'&quot;)`>";
            string actual = "<IMG SRC=`javascript:alert(\"RSnake says, 'XSS'\")`>";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector with malformed
        ///</summary>
        [TestMethod()]
        public void ImageMalformedXSSTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG \"\"\"><SCRIPT>alert(\"XSS\")</SCRIPT>\">";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG>\">";
            string actual = "<IMG \"\"\"><SCRIPT>alert(\"XSS\")</SCRIPT>\">";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector with ImageFromCharCode
        ///</summary>
        [TestMethod()]
        public void ImageFromCharCodeXSSTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=\":alert(String.fromCharCode(88,83,83))\">";
            string actual = "<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector with Hex encoding without semicolon
        ///</summary>   
        [TestMethod()]
        public void ImageHexEncodeXSSTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=\"&amp;#x6A&amp;#x61&amp;#x76&amp;#x61&amp;#x73&amp;#x63&amp;#x72&amp;#x69&amp;#x70&amp;#x74&amp;#x3A&amp;#x61&amp;#x6C&amp;#x65&amp;#x72&amp;#x74&amp;#x28&amp;#x27&amp;#x58&amp;#x53&amp;#x53&amp;#x27&amp;#x29\">";
            string actual = "<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector with embedded tab
        ///</summary>   
        [TestMethod()]
        public void ImageEmbeddedTabXSSTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=\"jav	ascript:alert('XSS');\">";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=\":alert(&#39;XSS&#39;);\">";
            string actual = "<IMG SRC=\"jav	ascript:alert('XSS');\">";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector with embedded encoded tab
        ///</summary>   
        [TestMethod()]
        public void ImageEmbeddedEncodedTabXSSTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=\"jav&#x09;ascript:alert('XSS');\">";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=\"jav&amp;#x09;a:alert(&#39;XSS&#39;);\">";
            string actual = "<IMG SRC=\"jav&#x09;ascript:alert('XSS');\">";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector with embedded new line
        ///</summary>   
        [TestMethod()]
        public void ImageEmbeddedNewLineXSSTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=\"jav&#x0A;ascript:alert('XSS');\">";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=\"jav&amp;#x0A;a:alert(&#39;XSS&#39;);\">";
            string actual = "<IMG SRC=\"jav&#x0A;a:alert('XSS');\">";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Image Xss vector with embedded carriage return
        ///</summary>   
        [TestMethod()]
        public void ImageEmbeddedCarriageReturnXSSTest()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            string htmlFragment = "<IMG SRC=\"jav&#x0D;ascript:alert('XSS');\">";
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();
            string expected = "<IMG SRC=\"jav&amp;#x0D;a:alert(&#39;XSS&#39;);\">";
            string actual = "<IMG SRC=\"jav&#x0D;ascript:alert('XSS');\">";
            actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);
            Assert.AreEqual(expected, actual, true);
            //Assert.Inconclusive("Verify the correctness of this test method.");
        }

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
            AttributeList.Add("size", new string[] {  });
            AttributeList.Add("face", new string[] { });
            AttributeList.Add("dir", new string[] { "ltr", "rtl", "Auto" });
            AttributeList.Add("width", new string[] { });
            AttributeList.Add("src", new string[] { });
            AttributeList.Add("href", new string[] { });

            return AttributeList;
        } 
    }
}
