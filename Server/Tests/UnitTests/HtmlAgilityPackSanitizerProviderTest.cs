// To create unit tests in this class reference is taken from
// https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#RULE_.232_-_Attribute_Escape_Before_Inserting_Untrusted_Data_into_HTML_Common_Attributes
// and http://ha.ckers.org/xss.html



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
        /// A test for Xss locator
        /// Example <!-- <a href="'';!--\"<XSS>=&{()}"> --> 
        /// </summary>
        [TestMethod()]
        public void XSSLocatorTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<a href=\"'';!--\"<XSS>=&{()}\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<a href=\"&#x26;&#x23;39&#x3B;&#x26;&#x23;39&#x3B;&#x3B;&#x21;&#x2D;&#x2D;\"></a>";
            Assert.AreEqual(expected, actual);
        }

        /// <summary>
        /// A test for Image Xss vector
        /// Example <!-- <IMG SRC="javascript:alert('XSS');"> -->
        /// </summary>
        [TestMethod()]
        public void ImageXSS1Test()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Action
            string htmlFragment = "<IMG SRC=\"javascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector without quotes and semicolon.
        /// Example <!-- <IMG SRC=javascript:alert('XSS')> -->
        /// </summary>
        [TestMethod()]
        public void ImageXSS2Test()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=javascript:alert('XSS')>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image xss vector with case insensitive.
        /// Example <!-- <IMG SRC=JaVaScRiPt:alert('XSS')> -->
        /// </summary>
        [TestMethod()]
        public void ImageCaseInsensitiveXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=JaVaScRiPt:alert('XSS')>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with Html entities
        /// Example <!-- <IMG SRC=javascript:alert(&quot;XSS&quot;)> -->
        /// </summary>
        [TestMethod()]
        public void ImageHtmlEntitiesXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=javascript:alert(&quot;XSS&quot;)>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x3A;alert&#x28;&#x26;amp&#x3B;quot&#x3B;XSS&#x26;amp&#x3B;quot&#x3B;&#x29;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with grave accent
        /// Example <!-- <IMG SRC=`javascript:alert("RSnake says, 'XSS'")`> -->
        /// </summary>
        [TestMethod()]
        public void ImageGraveAccentXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=`javascript:alert(\"RSnake says, 'XSS'\")`>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x60;&#x3A;alert&#x28;&#x26;quot&#x3B;RSnake\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with malformed
        /// Example <!-- <IMG \"\"\"><SCRIPT>alert(\"XSS\")</SCRIPT>\"> -->
        /// </summary>
        [TestMethod()]
        public void ImageMalformedXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG \"\"\"><SCRIPT>alert(\"XSS\")</SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG>\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with ImageFromCharCode
        /// Example <!-- <IMG SRC=javascript:alert(String.fromCharCode(88,83,83))> -->
        /// </summary>
        [TestMethod()]
        public void ImageFromCharCodeXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x3A;alert&#x28;String&#x2E;fromCharCode&#x28;88&#x2C;83&#x2C;83&#x29;&#x29;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with UTF-8 Unicode
        /// Example <!-- <IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;> -->
        /// </summary>
        [TestMethod()]
        public void ImageUTF8UnicodeXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x26;amp&#x3B;&#x23;106&#x3B;&#x26;amp&#x3B;&#x23;97&#x3B;&#x26;amp&#x3B;&#x23;118&#x3B;&#x26;amp&#x3B;&#x23;97&#x3B;&#x26;amp&#x3B;&#x23;115&#x3B;&#x26;amp&#x3B;&#x23;99&#x3B;&#x26;amp&#x3B;&#x23;114&#x3B;&#x26;amp&#x3B;&#x23;105&#x3B;&#x26;amp&#x3B;&#x23;112&#x3B;&#x26;amp&#x3B;&#x23;116&#x3B;&#x26;amp&#x3B;&#x23;58&#x3B;&#x26;amp&#x3B;&#x23;97&#x3B;&#x26;amp&#x3B;&#x23;108&#x3B;&#x26;amp&#x3B;&#x23;101&#x3B;&#x26;amp&#x3B;&#x23;114&#x3B;&#x26;amp&#x3B;&#x23;116&#x3B;&#x26;amp&#x3B;&#x23;40&#x3B;&#x26;amp&#x3B;&#x23;39&#x3B;&#x26;amp&#x3B;&#x23;88&#x3B;&#x26;amp&#x3B;&#x23;83&#x3B;&#x26;amp&#x3B;&#x23;83&#x3B;&#x26;amp&#x3B;&#x23;39&#x3B;&#x26;amp&#x3B;&#x23;41&#x3B;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with Long UTF-8 Unicode
        /// Example <!-- <IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041> --> 
        /// </summary>
        [TestMethod()]
        public void ImageLongUTF8UnicodeXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x26;amp&#x3B;&#x23;0000106&#x26;amp&#x3B;&#x23;0000097&#x26;amp&#x3B;&#x23;0000118&#x26;amp&#x3B;&#x23;0000097&#x26;amp&#x3B;&#x23;0000115&#x26;amp&#x3B;&#x23;0000099&#x26;amp&#x3B;&#x23;0000114&#x26;amp&#x3B;&#x23;0000105&#x26;amp&#x3B;&#x23;0000112&#x26;amp&#x3B;&#x23;0000116&#x26;amp&#x3B;&#x23;0000058&#x26;amp&#x3B;&#x23;0000097&#x26;amp&#x3B;&#x23;0000108&#x26;amp&#x3B;&#x23;0000101&#x26;amp&#x3B;&#x23;0000114&#x26;amp&#x3B;&#x23;0000116&#x26;amp&#x3B;&#x23;0000040&#x26;amp&#x3B;&#x23;0000039&#x26;amp&#x3B;&#x23;0000088&#x26;amp&#x3B;&#x23;0000083&#x26;amp&#x3B;&#x23;0000083&#x26;amp&#x3B;&#x23;0000039&#x26;amp&#x3B;&#x23;0000041\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with Hex encoding without semicolon
        /// Example <!-- <IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29> -->
        /// </summary>   
        [TestMethod()]
        public void ImageHexEncodeXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x26;amp&#x3B;&#x23;x6A&#x26;amp&#x3B;&#x23;x61&#x26;amp&#x3B;&#x23;x76&#x26;amp&#x3B;&#x23;x61&#x26;amp&#x3B;&#x23;x73&#x26;amp&#x3B;&#x23;x63&#x26;amp&#x3B;&#x23;x72&#x26;amp&#x3B;&#x23;x69&#x26;amp&#x3B;&#x23;x70&#x26;amp&#x3B;&#x23;x74&#x26;amp&#x3B;&#x23;x3A&#x26;amp&#x3B;&#x23;x61&#x26;amp&#x3B;&#x23;x6C&#x26;amp&#x3B;&#x23;x65&#x26;amp&#x3B;&#x23;x72&#x26;amp&#x3B;&#x23;x74&#x26;amp&#x3B;&#x23;x28&#x26;amp&#x3B;&#x23;x27&#x26;amp&#x3B;&#x23;x58&#x26;amp&#x3B;&#x23;x53&#x26;amp&#x3B;&#x23;x53&#x26;amp&#x3B;&#x23;x27&#x26;amp&#x3B;&#x23;x29\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with embedded tab
        /// Example <!-- <IMG SRC=\"jav	ascript:alert('XSS');\"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageEmbeddedTabXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"jav	ascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with embedded encoded tab
        /// Example <!-- <IMG SRC="jav&#x09;ascript:alert('XSS');"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageEmbeddedEncodedTabXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"jav&#x09;ascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"jav&#x26;amp&#x3B;&#x23;x09&#x3B;a&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with embedded new line
        /// Example <!-- <IMG SRC="jav&#x0A;ascript:alert('XSS');"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageEmbeddedNewLineXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"jav&#x0A;ascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"jav&#x26;amp&#x3B;&#x23;x0A&#x3B;a&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with embedded carriage return
        /// Example <!-- <IMG SRC=\"jav&#x0D;ascript:alert('XSS');\"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageEmbeddedCarriageReturnXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"jav&#x0D;ascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"jav&#x26;amp&#x3B;&#x23;x0D&#x3B;a&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with Multiline using ASCII carriage return
        /// Example <!-- <IMG
        /// SRC
        /// =
        /// " 
        /// j
        /// a
        /// v
        /// a
        /// s
        /// c
        /// r
        /// i
        /// p
        /// t
        /// :
        /// a
        /// l
        /// e
        /// r
        /// t
        /// (
        /// '
        /// X
        /// S
        /// S
        /// '
        /// )
        /// "
        ///> -->
        /// </summary>   
        [TestMethod()]
        public void ImageMultilineInjectedXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = @"<IMG
SRC
=
"" 
j
a
v
a
s
c
r
i
p
t
:
a
l
e
r
t
(
'
X
S
S
'
)
""
>
";

            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<img src=\"&#x3A;&#x0D;&#x0A;a&#x0D;&#x0A;l&#x0D;&#x0A;e&#x0D;&#x0A;r&#x0D;&#x0A;t&#x0D;&#x0A;&#x28;&#x0D;&#x0A;&#x26;&#x23;39&#x3B;&#x0D;&#x0A;X&#x0D;&#x0A;S&#x0D;&#x0A;S&#x0D;&#x0A;&#x26;&#x23;39&#x3B;&#x0D;&#x0A;&#x29;&#x0D;&#x0A;\">\r\n";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with Null breaks up Javascript directive 
        /// Example <!-- perl -e 'print "<IMG SRC=java\0script:alert(\"XSS\")>";' > out -->
        /// </summary>   
        [TestMethod()]
        public void ImageNullBreaksUpXSSTest1()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "perl -e 'print \"<IMG SRC=java\0script:alert(\"XSS\")>\";' > out";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "perl -e 'print \"<img src=\"java&#xfffd;&#x3A;alert&#x28;&#x26;quot&#x3B;XSS&#x26;quot&#x3B;&#x29;\">\";' > out";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with Null breaks up cross site scripting vector 
        /// Example <!-- <image src=" perl -e 'print "<SCR\0IPT>alert(\"XSS\")</SCR\0IPT>";' > out "> -->
        /// </summary>
        [TestMethod()]
        public void ImageNullBreaksUpXSSTest2()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<image src=\" perl -e 'print \"<SCR\0IPT>alert(\"XSS\")</SCR\0IPT>\";' > out \">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "\";' > out \">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with spaces and Meta characters 
        /// Example <!-- <IMG SRC=" &#14;  javascript:alert('XSS');"> -->
        /// </summary>
        [TestMethod()]
        public void ImageSpaceAndMetaCharXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\" &#14;  javascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x20;&#x26;amp&#x3B;&#x23;14&#x3B;&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with half open html
        /// Example <!-- <IMG SRC="javascript:alert('XSS')" -->
        /// </summary>   
        [TestMethod()]
        public void ImageHalfOpenHtmlXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"javascript:alert('XSS')\"";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with double open angle bracket
        /// Example <!-- <image src=http://ha.ckers.org/scriptlet.html < -->
        /// </summary>   
        [TestMethod()]
        public void ImageDoubleOpenAngleBracketXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<image src=http://ha.ckers.org/scriptlet.html <";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Dic Xss vector with Javascript escaping
        /// Example <!-- <div style="\";alert('XSS');//"> -->
        /// </summary>   
        [TestMethod()]
        public void DivJavascriptEscapingXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<div style=\"\";alert('XSS');//\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<div style=\"\"></div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with input image
        /// Example <!-- <INPUT TYPE="IMAGE" SRC="javascript:alert('XSS');"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageInputXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<INPUT TYPE=\"IMAGE\" SRC=\"javascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with Dynsrc
        /// Example <!-- <IMG DYNSRC="javascript:alert('XSS')"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageDynsrcXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG DYNSRC=\"javascript:alert('XSS')\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Xss vector with Lowsrc
        /// Example <!-- <IMG LOWSRC="javascript:alert('XSS')"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageLowsrcXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG LOWSRC=\"javascript:alert('XSS')\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Xss vector with BGSound
        /// Example <!-- <BGSOUND SRC="javascript:alert('XSS');"> -->
        /// </summary>   
        [TestMethod()]
        public void BGSoundXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<BGSOUND SRC=\"javascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for BR with Javascript Include
        /// Example <!-- <BR SIZE="&{alert('XSS')}"> -->
        /// </summary>   
        [TestMethod()]
        public void BRJavascriptIncludeXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<BR SIZE=\"&{alert('XSS')}\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<BR>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for P with url in style
        /// Example <!-- <p STYLE="behavior: url(www.ha.ckers.org);"> -->
        /// </summary>   
        [TestMethod()]
        public void PWithUrlInStyleXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<p STYLE=\"behavior: url(www.ha.ckers.org);\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            // intentionally keep it failing to get notice when reviewing unit tests so can disucss
            string expected = "<p STYLE=\"&#x3A;&#x20;url&#x28;www&#x2E;ha&#x2E;ckers&#x2E;org&#x29;&#x3B;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image with vbscript
        /// Example <!-- <IMG SRC='vbscript:msgbox("XSS")'> -->
        /// </summary>   
        [TestMethod()]
        public void ImageWithVBScriptXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC='vbscript:msgbox(\"XSS\")'>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC='vb&#x3A;msgbox&#x28;&#x26;quot&#x3B;XSS&#x26;quot&#x3B;&#x29;'>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image with Mocha
        /// Example <!-- <IMG SRC="mocha:[code]"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageWithMochaXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"mocha:[code]\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x3A;&#x5B;code&#x5D;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image with Livescript
        /// Example <!-- <IMG SRC="Livescript:[code]"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageWithLivescriptXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"Livescript:[code]\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"Live&#x3A;&#x5B;code&#x5D;\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Iframe
        /// Example <!-- <IFRAME SRC="javascript:alert('XSS');"></IFRAME> -->
        /// </summary>   
        [TestMethod()]
        public void IframeXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IFRAME SRC=\"javascript:alert('XSS');\"></IFRAME>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Frame
        /// Example <!-- <FRAMESET><FRAME SRC="javascript:alert('XSS');"></FRAMESET> -->
        /// </summary>   
        [TestMethod()]
        public void FrameXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<FRAMESET><FRAME SRC=\"javascript:alert('XSS');\"></FRAMESET>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Table
        /// Example <!-- <TABLE BACKGROUND="javascript:alert('XSS')"> -->
        /// </summary>   
        [TestMethod()]
        public void TableXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<TABLE BACKGROUND=\"javascript:alert('XSS')\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for TD
        /// Example <!-- <TABLE><TD BACKGROUND="javascript:alert('XSS')"> -->
        /// </summary>   
        [TestMethod()]
        public void TDXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<TABLE><TD BACKGROUND=\"javascript:alert('XSS')\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div Background Image
        /// Example <!-- <DIV STYLE="background-image: url(javascript:alert('XSS'))"> -->
        /// </summary>   
        [TestMethod()]
        public void DivBackgroundImageXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<DIV STYLE=\"background-image: url(javascript:alert('XSS'))\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<DIV STYLE=\"background&#x2D;image&#x3A;&#x20;url&#x28;&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x29;\"></div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div Background Image  with unicoded XSS
        /// Example <!-- <DIV STYLE="background-image:\0075\0072\006C\0028'\006a\0061\0076\0061\0073\0063\0072\0069\0070\0074\003a\0061\006c\0065\0072\0074\0028.1027\0058.1053\0053\0027\0029'\0029"> -->
        /// </summary>   
        [TestMethod()]
        public void DivBackgroundImageWithUnicodedXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<DIV STYLE=\"background-image:\0075\0072\006C\0028'\006a\0061\0076\0061\0073\0063\0072\0069\0070\0074\003a\0061\006c\0065\0072\0074\0028.1027\0058.1053\0053\0027\0029'\0029\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<DIV STYLE=\"background&#x2D;image&#x3A;&#xfffd;075&#xfffd;072&#xfffd;06C&#xfffd;028&#x26;&#x23;39&#x3B;&#xfffd;06a&#xfffd;061&#xfffd;076&#xfffd;061&#xfffd;073&#xfffd;063&#xfffd;072&#xfffd;069&#xfffd;070&#xfffd;074&#xfffd;03a&#xfffd;061&#xfffd;06c&#xfffd;065&#xfffd;072&#xfffd;074&#xfffd;028&#x2E;1027&#xfffd;058&#x2E;1053&#xfffd;053&#xfffd;027&#xfffd;029&#x26;&#x23;39&#x3B;&#xfffd;029\"></div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div Background Image  with extra characters
        /// Example <!-- <DIV STYLE="background-image: url(&#1;javascript:alert('XSS'))"> -->
        /// </summary>   
        [TestMethod()]
        public void DivBackgroundImageWithExtraCharactersXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<DIV STYLE=\"background-image: url(&#1;javascript:alert('XSS'))\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<DIV STYLE=\"background&#x2D;image&#x3A;&#x20;url&#x28;&#x26;amp&#x3B;&#x23;1&#x3B;&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x29;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for DIV expression
        /// Example <!-- <DIV STYLE="width: expression(alert('XSS'));"> -->
        /// </summary>   
        [TestMethod()]
        public void DivExpressionXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<DIV STYLE=\"width: expression(alert('XSS'));\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<DIV STYLE=\"width&#x3A;&#x28;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x29;&#x3B;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image with break up expression
        /// Example <!-- <IMG STYLE="xss:expr/*XSS*/ession(alert('XSS'))"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageStyleExpressionXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG STYLE=\"xss:expr/*XSS*/ession(alert('XSS'))\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with break up expression
        /// Example <!-- exp/*<A STYLE='no\xss:noxss("*//*");xss:&#101;x&#x2F;*XSS*//*/*/pression(alert("XSS"))'> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagStyleExpressionXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "exp/*<A STYLE='no\\xss:noxss(\"*//*\");xss:&#101;x&#x2F;*XSS*//*/*/pression(alert(\"XSS\"))'>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "exp/*<a></a>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for BaseTag
        /// Example <!-- <BASE HREF="javascript:alert('XSS');//"> -->
        /// </summary>   
        [TestMethod()]
        public void BaseTagXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<BASE HREF=\"javascript:alert('XSS');//\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for EMBEDTag
        /// Example <!-- <EMBED SRC="http://ha.ckers.org/xss.swf" AllowScriptAccess="always"></EMBED> -->
        /// </summary>   
        [TestMethod()]
        public void EmbedTagXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<EMBED SRC=\"http://ha.ckers.org/xss.swf\" AllowScriptAccess=\"always\"></EMBED>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for EMBEDSVG
        /// Example <!-- <EMBED SRC="data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dH A6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcv MjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hs aW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxOTQiIGhlaWdodD0iMjAw IiBpZD0ieHNzIj48c2NyaXB0IHR5cGU9InRleHQvZWNtYXNjcmlwdCI+YWxlcnQoIlh TUyIpOzwvc2NyaXB0Pjwvc3ZnPg==" type="image/svg+xml" AllowScriptAccess="always"></EMBED> -->
        /// </summary>   
        [TestMethod()]
        public void EmbedSVGXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<EMBED SRC=\"data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dH A6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcv MjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hs aW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxOTQiIGhlaWdodD0iMjAw IiBpZD0ieHNzIj48c2NyaXB0IHR5cGU9InRleHQvZWNtYXNjcmlwdCI+YWxlcnQoIlh TUyIpOzwvc2NyaXB0Pjwvc3ZnPg==\" type=\"image/svg+xml\" AllowScriptAccess=\"always\"></EMBED>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for XML namespace
        /// Example <!-- <HTML xmlns:xss>  <?import namespace="xss" implementation="http://ha.ckers.org/xss.htc">  <xss:xss>XSS</xss:xss></HTML> -->
        /// </summary>   
        [TestMethod()]
        public void XmlNamespaceXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<HTML xmlns:xss>  <?import namespace=\"xss\" implementation=\"http://ha.ckers.org/xss.htc\">  <xss:xss>XSS</xss:xss></HTML>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for XML with CData
        /// Example <!-- <XML ID=I><X><C><![CDATA[<IMG SRC="javas]]><![CDATA[cript:alert('XSS');">]]></C></X></xml><SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN> -->
        /// </summary>   
        [TestMethod()]
        public void XmlWithCDataXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<XML ID=I><X><C><![CDATA[<IMG SRC=\"javas]]><![CDATA[cript:alert('XSS');\">]]></C></X></xml><SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<SPAN></SPAN>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for XML with Comment obfuscation
        /// Example <!-- <XML ID="xss"><I><B>&lt;IMG SRC="javas<!-- -->cript:alert('XSS')"&gt;</B></I></XML><SPAN DATASRC="#xss" DATAFLD="B" DATAFORMATAS="HTML"></SPAN> -->
        /// </summary>   
        [TestMethod()]
        public void XmlWithCommentObfuscationXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<XML ID=\"xss\"><I><B>&lt;IMG SRC=\"javas<!-- -->cript:alert('XSS')\"&gt;</B></I></XML><SPAN DATASRC=\"#xss\" DATAFLD=\"B\" DATAFORMATAS=\"HTML\"></SPAN>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<SPAN></SPAN>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for XML with Embedded script
        /// Example <!-- <XML SRC="xsstest.xml" ID=I></XML><SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN> -->
        /// </summary>   
        [TestMethod()]
        public void XmlWithEmbeddedScriptXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<XML SRC=\"xsstest.xml\" ID=I></XML><SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<SPAN></SPAN>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Html + Time
        /// Example <!-- <HTML><BODY><?xml:namespace prefix="t" ns="urn:schemas-microsoft-com:time"><?import namespace="t" implementation="#default#time2"><t:set attributeName="innerHTML" to="XSS&lt;SCRIPT DEFER&gt;alert(&quot;XSS&quot;)&lt;/SCRIPT&gt;"></BODY></HTML> -->
        /// </summary>   
        [TestMethod()]
        public void HtmlPlusTimeXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<HTML><BODY><?xml:namespace prefix=\"t\" ns=\"urn:schemas-microsoft-com:time\"><?import namespace=\"t\" implementation=\"#default#time2\"><t:set attributeName=\"innerHTML\" to=\"XSS&lt;SCRIPT DEFER&gt;alert(&quot;XSS&quot;)&lt;/SCRIPT&gt;\"></BODY></HTML>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Embedded commands
        /// Example <!-- <IMG SRC="http://www.thesiteyouareon.com/somecommand.php?somevariables=maliciouscode"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageWithEmbeddedCommandXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"http://www.thesiteyouareon.com/somecommand.php?somevariables=maliciouscode\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"http&#x3A;&#x2F;&#x2F;www&#x2E;thesiteyouareon&#x2E;com&#x2F;somecommand&#x2E;php&#x3F;somevariables&#x3D;maliciouscode\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Image Embedded commands part 2
        /// Example <!-- <IMG SRC="Redirect 302 /a.jpg http://victimsite.com/admin.asp&deleteuser"> -->
        /// </summary>   
        [TestMethod()]
        public void ImageWithEmbeddedCommand2XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"Redirect 302 /a.jpg http://victimsite.com/admin.asp&deleteuser\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<IMG SRC=\"Redirect&#x20;302&#x20;&#x2F;a&#x2E;jpg&#x20;http&#x3A;&#x2F;&#x2F;victimsite&#x2E;com&#x2F;admin&#x2E;asp&#x26;amp&#x3B;deleteuser\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag IP verses hostname
        /// Example <!-- <A HREF="http://66.102.7.147/">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagIPVersesHostnameXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://66.102.7.147/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;66&#x2E;102&#x2E;7&#x2E;147&#x2F;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Url encoding
        /// Example <!-- <A HREF="http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagUrlEncodingXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;&#x25;77&#x25;77&#x25;77&#x25;2E&#x25;67&#x25;6F&#x25;6F&#x25;67&#x25;6C&#x25;65&#x25;2E&#x25;63&#x25;6F&#x25;6D\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Dword encoding
        /// Example <!-- <A HREF="http://1113982867/">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagDwordEncodingXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://1113982867/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;1113982867&#x2F;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Hex encoding
        /// Example <!-- <A HREF="http://0x42.0x0000066.0x7.0x93/">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagHexEncodingXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://0x42.0x0000066.0x7.0x93/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;0x42&#x2E;0x0000066&#x2E;0x7&#x2E;0x93&#x2F;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Octal encoding
        /// Example <!-- <A HREF="http://0102.0146.0007.00000223/">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagOctalEncodingXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://0102.0146.0007.00000223/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;0102&#x2E;0146&#x2E;0007&#x2E;00000223&#x2F;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Mixed encoding
        /// Example <!-- <A HREF="h tt	p://6&#9;6.000146.0x7.147/">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagMixedEncodingXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = @"<A HREF=""h
tt	p://6&#9;6.000146.0x7.147/"">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"h&#x0D;&#x0A;tt&#x09;p&#x3A;&#x2F;&#x2F;6&#x26;amp&#x3B;&#x23;9&#x3B;6&#x2E;000146&#x2E;0x7&#x2E;147&#x2F;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Protocol resolution
        /// Example <!-- <A HREF="//www.google.com/">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagProtocolResolutionXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"//www.google.com/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"&#x2F;&#x2F;www&#x2E;google&#x2E;com&#x2F;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Google feeling lucky part1
        /// Example <!-- <A HREF="//google">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagGoogleFeelingLucky1XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"//google\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"&#x2F;&#x2F;google\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Google feeling lucky part2
        /// Example <!-- <A HREF="http://ha.ckers.org@google">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagGoogleFeelingLucky2XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://ha.ckers.org@google\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x40;google\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Google feeling lucky part3
        /// Example <!-- <A HREF="http://google:ha.ckers.org">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagGoogleFeelingLucky3XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://google:ha.ckers.org\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;google&#x3A;ha&#x2E;ckers&#x2E;org\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with removing cnames
        /// Example <!-- <A HREF="http://google.com/">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagRemovingCNamesXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://google.com/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;google&#x2E;com&#x2F;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with extra dot for absolute dns
        /// Example <!-- <A HREF="http://www.google.com./">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagAbsoluteDNSXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.google.com./\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;google&#x2E;com&#x2E;&#x2F;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with javascript link location
        /// Example <!-- <A HREF="javascript:document.location='http://www.google.com/'">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagJavascriptLinkLocationXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"javascript:document.location='http://www.google.com/'\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"&#x3A;document&#x2E;location&#x3D;&#x26;&#x23;39&#x3B;http&#x3A;&#x2F;&#x2F;www&#x2E;google&#x2E;com&#x2F;&#x26;&#x23;39&#x3B;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with content replace
        /// Example <!-- <A HREF="http://www.gohttp://www.google.com/ogle.com/">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagContentReplaceXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.gohttp://www.google.com/ogle.com/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;gohttp&#x3A;&#x2F;&#x2F;www&#x2E;google&#x2E;com&#x2F;ogle&#x2E;com&#x2F;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with no filter evasion
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagNoFilterEvasionXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x26;gt&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with no filter evasion
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivNoFilterEvasionXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x26;gt&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and no filter evasion
        /// Example <!-- <Div style="background-color: expression(<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionNoFilterEvasionXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x26;gt&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;&#x29;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with non alpha non digit xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT/XSS SRC="http://ha.ckers.org/xss.js"></SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagNonAlphaNonDigitXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT/XSS SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x2F;XSS&#x20;SRC&#x3D;\">\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with non alpha non digit xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT/XSS SRC=http://ha.ckers.org/xss.js></SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivNonAlphaNonDigitXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT/XSS SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x2F;XSS&#x20;SRC&#x3D;\">\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and non alpha non digit xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT/XSS SRC="http://ha.ckers.org/xss.js"></SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionNonAlphaNonDigitXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT/XSS SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x2F;XSS&#x20;SRC&#x3D;\">)\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with non alpha non digit part 3 xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT/SRC="http://ha.ckers.org/xss.js"></SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagNonAlphaNonDigit3XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT/SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x2F;SRC&#x3D;\">\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with non alpha non digit part 3 xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT/SRC=http://ha.ckers.org/xss.js></SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivNonAlphaNonDigit3XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT/SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x2F;SRC&#x3D;\">\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and non alpha non digit part 3 xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT/SRC="http://ha.ckers.org/xss.js"></SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionNonAlphaNonDigit3XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT/SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x2F;SRC&#x3D;\">)\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Extraneous open brackets xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<<SCRIPT>alert("XSS");//<</SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagExtraneousOpenBracketsXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<<SCRIPT>alert(\"XSS\");//<</SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;\"></A>\">XSS";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with Extraneous open brackets xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<<SCRIPT>alert("XSS");//<</SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivExtraneousOpenBracketsXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<<SCRIPT>alert(\"XSS\");//<</SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;\"></Div>\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and Extraneous open brackets xss
        /// Example <!-- <Div style="background-color: expression(<<SCRIPT>alert("XSS");//<</SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionExtraneousOpenBracketsXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<<SCRIPT>alert(\"XSS\");//<</SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;\"></div>)\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with No closing script tags xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js?<B>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagNoClosingScriptTagsXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js?<B>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x3F;&#x26;lt&#x3B;B&#x26;gt&#x3B;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with No closing script tags xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js?<B>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivNoClosingScriptTagsXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js?<B>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x3F;&#x26;lt&#x3B;B&#x26;gt&#x3B;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and No closing script tags xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT SRC=http://ha.ckers.org/xss.js?<B>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionNoClosingScriptTagsXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT SRC=http://ha.ckers.org/xss.js?<B>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x3F;&#x26;lt&#x3B;B&#x26;gt&#x3B;&#x29;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Protocol resolution in script tags xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT SRC=//ha.ckers.org/.j>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagProtocolResolutionScriptXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT SRC=//ha.ckers.org/.j>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;&#x2E;j&#x26;gt&#x3B;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with Protocol resolution in script tags xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT SRC=//ha.ckers.org/.j>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivProtocolResolutionScriptXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT SRC=//ha.ckers.org/.j>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;&#x2E;j&#x26;gt&#x3B;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and Protocol resolution in script tags xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT SRC=//ha.ckers.org/.j>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionProtocolResolutionScriptXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT SRC=//ha.ckers.org/.j>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;SRC&#x3D;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;&#x2E;j&#x26;gt&#x3B;&#x29;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with no single quotes or double quotes or semicolons xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT>a=/XSS/alert(a.source)</SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagNoQuotesXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT>a=/XSS/alert(a.source)</SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;gt&#x3B;a&#x3D;&#x2F;XSS&#x2F;alert&#x28;a&#x2E;source&#x29;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with no single quotes or double quotes or semicolons xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT>a=/XSS/alert(a.source)</SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivNoQuotesXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT>a=/XSS/alert(a.source)</SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;gt&#x3B;a&#x3D;&#x2F;XSS&#x2F;alert&#x28;a&#x2E;source&#x29;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and no single quotes or double quotes or semicolons xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT>a=/XSS/alert(a.source)</SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionNoQuotesXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT>a=/XSS/alert(a.source)</SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x26;gt&#x3B;a&#x3D;&#x2F;XSS&#x2F;alert&#x28;a&#x2E;source&#x29;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;&#x29;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with US-ASCII encoding xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=¼script¾alert(¢XSS¢)¼/script¾">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagUSASCIIEncodingXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=¼script¾alert(¢XSS¢)¼/script¾\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;&#x23;188&#x3B;&#x26;&#x23;190&#x3B;alert&#x28;&#x26;&#x23;162&#x3B;XSS&#x26;&#x23;162&#x3B;&#x29;&#x26;&#x23;188&#x3B;&#x2F;&#x26;&#x23;190&#x3B;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with US-ASCII encoding xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=¼script¾alert(¢XSS¢)¼/script¾"> -->
        /// </summary>   
        [TestMethod()]
        public void DivUSASCIIEncodingXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=¼script¾alert(¢XSS¢)¼/script¾\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;&#x23;188&#x3B;&#x26;&#x23;190&#x3B;alert&#x28;&#x26;&#x23;162&#x3B;XSS&#x26;&#x23;162&#x3B;&#x29;&#x26;&#x23;188&#x3B;&#x2F;&#x26;&#x23;190&#x3B;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and US-ASCII encoding xss
        /// Example <!-- <Div style="background-color: expression(¼script¾alert(¢XSS¢)¼/script¾)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionUSASCIIEncodingXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(¼script¾alert(¢XSS¢)¼/script¾)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;&#x23;188&#x3B;&#x26;&#x23;190&#x3B;alert&#x28;&#x26;&#x23;162&#x3B;XSS&#x26;&#x23;162&#x3B;&#x29;&#x26;&#x23;188&#x3B;&#x2F;&#x26;&#x23;190&#x3B;&#x29;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Downlevel-Hidden block xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<!--[if gte IE 4]><SCRIPT>alert('XSS');</SCRIPT><![endif]-->">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagDownlevelHiddenBlockXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<!--[if gte IE 4]><SCRIPT>alert('XSS');</SCRIPT><![endif]-->\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x21;&#x2D;&#x2D;&#x5B;if&#x20;gte&#x20;IE&#x20;4&#x5D;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x21;&#x5B;endif&#x5D;&#x2D;&#x2D;&#x26;gt&#x3B;\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with Downlevel-Hidden block xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<!--[if gte IE 4]><SCRIPT>alert('XSS');</SCRIPT><![endif]-->"> -->
        /// </summary>   
        [TestMethod()]
        public void DivDownlevelHiddenBlockXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<!--[if gte IE 4]><SCRIPT>alert('XSS');</SCRIPT><![endif]-->\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x21;&#x2D;&#x2D;&#x5B;if&#x20;gte&#x20;IE&#x20;4&#x5D;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x21;&#x5B;endif&#x5D;&#x2D;&#x2D;&#x26;gt&#x3B;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and Downlevel-Hidden block xss
        /// Example <!-- <Div style="background-color: expression(<!--[if gte IE 4]><SCRIPT>alert('XSS');</SCRIPT><![endif]-->)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionDownlevelHiddenBlockXSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<!--[if gte IE 4]><SCRIPT>alert('XSS');</SCRIPT><![endif]-->)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x21;&#x2D;&#x2D;&#x5B;if&#x20;gte&#x20;IE&#x20;4&#x5D;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x21;&#x5B;endif&#x5D;&#x2D;&#x2D;&#x26;gt&#x3B;&#x29;\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Html Quotes Encapsulation 1 xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT a=">" SRC="http://ha.ckers.org/xss.js"></SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagHtmlQuotesEncapsulation1XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT a=\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with Html Quotes Encapsulation 1 xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT a=">" SRC="http://ha.ckers.org/xss.js"></SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivHtmlQuotesEncapsulation1XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT a=\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and Html Quotes Encapsulation 1 xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT a=">" SRC="http://ha.ckers.org/xss.js"></SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionHtmlQuotesEncapsulation1XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT a=\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;a&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">)\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Html Quotes Encapsulation 2 xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT =">" SRC="http://ha.ckers.org/xss.js"></SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagHtmlQuotesEncapsulation2XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT =\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with Html Quotes Encapsulation 2 xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT =">" SRC="http://ha.ckers.org/xss.js"></SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivHtmlQuotesEncapsulation2XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT =\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and Html Quotes Encapsulation 2 xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT =">" SRC="http://ha.ckers.org/xss.js"></SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionHtmlQuotesEncapsulation2XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT =\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">)\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Html Quotes Encapsulation 3 xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT a=">" '' SRC="http://ha.ckers.org/xss.js"></SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagHtmlQuotesEncapsulation3XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT a=\">\" '' SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\">\" '' SRC=\"http://ha.ckers.org/xss.js\">\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with Html Quotes Encapsulation 3 xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT a=">" '' SRC="http://ha.ckers.org/xss.js"></SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivHtmlQuotesEncapsulation3XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT a=\" > \" '' SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\"> \" '' SRC=\"http://ha.ckers.org/xss.js\">\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and Html Quotes Encapsulation 3 xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT a=">" '' SRC="http://ha.ckers.org/xss.js"></SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionHtmlQuotesEncapsulation3XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT a=\" > \" '' SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;a&#x3D;\"> \" '' SRC=\"http://ha.ckers.org/xss.js\">)\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Html Quotes Encapsulation 4 xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT "a='>'" SRC="http://ha.ckers.org/xss.js"></SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagHtmlQuotesEncapsulation4XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT \"a='>'\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;\">\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with Html Quotes Encapsulation 4 xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT "a='>'" SRC="http://ha.ckers.org/xss.js"></SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivHtmlQuotesEncapsulation4XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT \"a='>'\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;\">\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and Html Quotes Encapsulation 4 xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT "a='>'" SRC="http://ha.ckers.org/xss.js"></SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionHtmlQuotesEncapsulation4XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT \"a='>'\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;\">)\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Html Quotes Encapsulation 5 xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT a=`>` SRC="http://ha.ckers.org/xss.js"></SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagHtmlQuotesEncapsulation5XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT a=`>` SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;&#x60;&#x26;gt&#x3B;&#x60;&#x20;SRC&#x3D;\">\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with Html Quotes Encapsulation 5 xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT a=`>` SRC="http://ha.ckers.org/xss.js"></SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivHtmlQuotesEncapsulation5XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT a=`>` SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;&#x60;&#x26;gt&#x3B;&#x60;&#x20;SRC&#x3D;\">\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and Html Quotes Encapsulation 5 xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT a=`>` SRC="http://ha.ckers.org/xss.js"></SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionHtmlQuotesEncapsulation5XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT a=`>` SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;a&#x3D;&#x60;&#x26;gt&#x3B;&#x60;&#x20;SRC&#x3D;\">)\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Html Quotes Encapsulation 6 xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT a=">'>" SRC="http://ha.ckers.org/xss.js"></SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagHtmlQuotesEncapsulation6XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT a=\">'>\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\">'>\" SRC=\"http://ha.ckers.org/xss.js\">\">XSS</A>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with Html Quotes Encapsulation 6 xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT a=">'>" SRC="http://ha.ckers.org/xss.js"></SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivHtmlQuotesEncapsulation6XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT a=\">'>\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\">'>\" SRC=\"http://ha.ckers.org/xss.js\">\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and Html Quotes Encapsulation 6 xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT a=">'>" SRC="http://ha.ckers.org/xss.js"></SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionHtmlQuotesEncapsulation6XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT a=\">'>\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;a&#x3D;\">'>\" SRC=\"http://ha.ckers.org/xss.js\">)\"></Div>";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for AnchorTag with Html Quotes Encapsulation 7 xss
        /// Example <!-- <A HREF="http://www.codeplex.com?url=<SCRIPT>document.write("<SCRI");</SCRIPT>PT SRC="http://ha.ckers.org/xss.js"></SCRIPT>">XSS</A> -->
        /// </summary>   
        [TestMethod()]
        public void AnchorTagHtmlQuotesEncapsulation7XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT>document.write(\"<SCRI\");</SCRIPT>PT SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;gt&#x3B;document&#x2E;write&#x28;\"></a>PT SRC=\"http://ha.ckers.org/xss.js\">\">XSS";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with Html Quotes Encapsulation 7 xss
        /// Example <!-- <Div style="background-color: http://www.codeplex.com?url=<SCRIPT>document.write("<SCRI");</SCRIPT>PT SRC="http://ha.ckers.org/xss.js"></SCRIPT>"> -->
        /// </summary>   
        [TestMethod()]
        public void DivHtmlQuotesEncapsulation7XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT>document.write(\"<SCRI\");</SCRIPT>PT SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;gt&#x3B;document&#x2E;write&#x28;\"></div>PT SRC=\"http://ha.ckers.org/xss.js\">\">";
            Assert.AreEqual(expected, actual, true);
        }

        /// <summary>
        /// A test for Div with style expression and Html Quotes Encapsulation 7 xss
        /// Example <!-- <Div style="background-color: expression(<SCRIPT>document.write("<SCRI");</SCRIPT>PT SRC="http://ha.ckers.org/xss.js"></SCRIPT>)"> -->
        /// </summary>   
        [TestMethod()]
        public void DivStyleExpressionHtmlQuotesEncapsulation7XSSTest()
        {
            // Arrange
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT>document.write(\"<SCRI\");</SCRIPT>PT SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x26;gt&#x3B;document&#x2E;write&#x28;\"></div>PT SRC=\"http://ha.ckers.org/xss.js\">)\">";
            Assert.AreEqual(expected, actual, true);
        }

        [TestMethod]
        public void HtmlEncode()
        {
            HtmlAgilityPackSanitizerProvider target = new HtmlAgilityPackSanitizerProvider();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();
            Dictionary<string, string[]> attributeWhiteList = CreateAttributeWhiteList();

            // Act
            string htmlFragment = "<div style=\"background-color: test\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList, attributeWhiteList);

            // Assert
            string expected = "<div style=\"background&#x2D;color&#x3A;&#x20;test\"></div>";
            Assert.AreEqual(expected, actual, true);
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
