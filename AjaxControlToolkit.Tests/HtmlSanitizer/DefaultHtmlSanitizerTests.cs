using AjaxControlToolkit.HtmlEditor.Sanitizer;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit.Tests.HtmlSanititzer {

    [TestFixture]
    public class DefaultHtmlsanitizerSanitizerTests {

        // A test for Xss locator
        [Test]
        public void XSSLocatorTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<a href=\"'';!--\"<XSS>=&{()}\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<a href=\"&#x26;&#x23;39&#x3B;&#x26;&#x23;39&#x3B;&#x3B;&#x21;&#x2D;&#x2D;\"></a>";
            Assert.AreEqual(expected, actual);
        }

        // A test for Image Xss vector
        [Test]
        public void ImageXSS1Test() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Action
            string htmlFragment = "<IMG SRC=\"javascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector without quotes and semicolon.
        [Test]
        public void ImageXSS2Test() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=javascript:alert('XSS')>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image xss vector with case insensitive.
        [Test]
        public void ImageCaseInsensitiveXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=JaVaScRiPt:alert('XSS')>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with Html entities
        [Test]
        public void ImageHtmlEntitiesXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=javascript:alert(&quot;XSS&quot;)>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with grave accent
        [Test]
        public void ImageGraveAccentXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=`javascript:alert(\"RSnake says, 'XSS'\")`>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x60;\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with malformed
        [Test]
        public void ImageMalformedXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG \"\"\"><SCRIPT>alert(\"XSS\")</SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG>\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with ImageFromCharCode
        [Test]
        public void ImageFromCharCodeXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with UTF-8 Unicode
        [Test]
        public void ImageUTF8UnicodeXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x26;amp&#x3B;&#x23;106&#x3B;&#x26;amp&#x3B;&#x23;97&#x3B;&#x26;amp&#x3B;&#x23;118&#x3B;&#x26;amp&#x3B;&#x23;97&#x3B;&#x26;amp&#x3B;&#x23;115&#x3B;&#x26;amp&#x3B;&#x23;99&#x3B;&#x26;amp&#x3B;&#x23;114&#x3B;&#x26;amp&#x3B;&#x23;105&#x3B;&#x26;amp&#x3B;&#x23;112&#x3B;&#x26;amp&#x3B;&#x23;116&#x3B;&#x26;amp&#x3B;&#x23;58&#x3B;&#x26;amp&#x3B;&#x23;97&#x3B;&#x26;amp&#x3B;&#x23;108&#x3B;&#x26;amp&#x3B;&#x23;101&#x3B;&#x26;amp&#x3B;&#x23;114&#x3B;&#x26;amp&#x3B;&#x23;116&#x3B;&#x26;amp&#x3B;&#x23;40&#x3B;&#x26;amp&#x3B;&#x23;39&#x3B;&#x26;amp&#x3B;&#x23;88&#x3B;&#x26;amp&#x3B;&#x23;83&#x3B;&#x26;amp&#x3B;&#x23;83&#x3B;&#x26;amp&#x3B;&#x23;39&#x3B;&#x26;amp&#x3B;&#x23;41&#x3B;\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with Long UTF-8 Unicode
        [Test]
        public void ImageLongUTF8UnicodeXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x26;amp&#x3B;&#x23;0000106&#x26;amp&#x3B;&#x23;0000097&#x26;amp&#x3B;&#x23;0000118&#x26;amp&#x3B;&#x23;0000097&#x26;amp&#x3B;&#x23;0000115&#x26;amp&#x3B;&#x23;0000099&#x26;amp&#x3B;&#x23;0000114&#x26;amp&#x3B;&#x23;0000105&#x26;amp&#x3B;&#x23;0000112&#x26;amp&#x3B;&#x23;0000116&#x26;amp&#x3B;&#x23;0000058&#x26;amp&#x3B;&#x23;0000097&#x26;amp&#x3B;&#x23;0000108&#x26;amp&#x3B;&#x23;0000101&#x26;amp&#x3B;&#x23;0000114&#x26;amp&#x3B;&#x23;0000116&#x26;amp&#x3B;&#x23;0000040&#x26;amp&#x3B;&#x23;0000039&#x26;amp&#x3B;&#x23;0000088&#x26;amp&#x3B;&#x23;0000083&#x26;amp&#x3B;&#x23;0000083&#x26;amp&#x3B;&#x23;0000039&#x26;amp&#x3B;&#x23;0000041\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with Hex encoding without semicolon
        [Test]
        public void ImageHexEncodeXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x26;amp&#x3B;&#x23;x6A&#x26;amp&#x3B;&#x23;x61&#x26;amp&#x3B;&#x23;x76&#x26;amp&#x3B;&#x23;x61&#x26;amp&#x3B;&#x23;x73&#x26;amp&#x3B;&#x23;x63&#x26;amp&#x3B;&#x23;x72&#x26;amp&#x3B;&#x23;x69&#x26;amp&#x3B;&#x23;x70&#x26;amp&#x3B;&#x23;x74&#x26;amp&#x3B;&#x23;x3A&#x26;amp&#x3B;&#x23;x61&#x26;amp&#x3B;&#x23;x6C&#x26;amp&#x3B;&#x23;x65&#x26;amp&#x3B;&#x23;x72&#x26;amp&#x3B;&#x23;x74&#x26;amp&#x3B;&#x23;x28&#x26;amp&#x3B;&#x23;x27&#x26;amp&#x3B;&#x23;x58&#x26;amp&#x3B;&#x23;x53&#x26;amp&#x3B;&#x23;x53&#x26;amp&#x3B;&#x23;x27&#x26;amp&#x3B;&#x23;x29\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with embedded tab
        [Test]
        public void ImageEmbeddedTabXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"jav   ascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with embedded encoded tab
        [Test]
        public void ImageEmbeddedEncodedTabXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"jav&#x09;ascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"jav&#x26;amp&#x3B;&#x23;x09&#x3B;a&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with embedded new line
        [Test]
        public void ImageEmbeddedNewLineXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"jav&#x0A;ascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"jav&#x26;amp&#x3B;&#x23;x0A&#x3B;a&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with embedded carriage return
        [Test]
        public void ImageEmbeddedCarriageReturnXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"jav&#x0D;ascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"jav&#x26;amp&#x3B;&#x23;x0D&#x3B;a&#x3A;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with Multiline using ASCII carriage return
        // SRC
        // =
        // " 
        // j
        // a
        // v
        // a
        // s
        // c
        // r
        // i
        // p
        // t
        // :
        // a
        // l
        // e
        // r
        // t
        // (
        // '
        // X
        // S
        // S
        // '
        // )
        // "
        //> -->
        [Test]
        public void ImageMultilineInjectedXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

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

            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<img src=\"&#x0A;a&#x0D;&#x0A;l&#x0D;&#x0A;e&#x0D;&#x0A;r&#x0D;&#x0A;t&#x0D;&#x0A;&#x28;&#x0D;&#x0A;&#x26;&#x23;39&#x3B;&#x0D;&#x0A;X&#x0D;&#x0A;S&#x0D;&#x0A;S&#x0D;&#x0A;&#x26;&#x23;39&#x3B;&#x0D;&#x0A;&#x29;&#x0D;&#x0A;\">\r\n";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with Null breaks up Javascript directive 
        [Test]
        public void ImageNullBreaksUpXSSTest1() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "perl -e 'print \"<IMG SRC=java\0script:alert(\"XSS\")>\";' > out";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "perl -e 'print \"<img src=\"java&#xfffd;&#x3A;alert&#x28;&#x26;quot&#x3B;XSS&#x26;quot&#x3B;&#x29;\">\";' > out";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with Null breaks up cross site scripting vector 
        [Test]
        public void ImageNullBreaksUpXSSTest2() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<image src=\" perl -e 'print \"<SCR\0IPT>alert(\"XSS\")</SCR\0IPT>\";' > out \">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "\";' > out \">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with spaces and Meta characters 
        [Test]
        public void ImageSpaceAndMetaCharXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\" &#14;  javascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x20;&#x26;amp&#x3B;&#x23;14&#x3B;\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with half open html
        [Test]
        public void ImageHalfOpenHtmlXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"javascript:alert('XSS')\"";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with double open angle bracket
        [Test]
        public void ImageDoubleOpenAngleBracketXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<image src=http://ha.ckers.org/scriptlet.html <";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Dic Xss vector with Javascript escaping
        [Test]
        public void DivJavascriptEscapingXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<div style=\"\";alert('XSS');//\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<div style=\"\"></div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with input image
        [Test]
        public void ImageInputXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<INPUT TYPE=\"IMAGE\" SRC=\"javascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with Dynsrc
        [Test]
        public void ImageDynsrcXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG DYNSRC=\"javascript:alert('XSS')\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Xss vector with Lowsrc
        [Test]
        public void ImageLowsrcXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG LOWSRC=\"javascript:alert('XSS')\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Xss vector with BGSound
        [Test]
        public void BGSoundXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<BGSOUND SRC=\"javascript:alert('XSS');\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for BR with Javascript Include
        [Test]
        public void BRJavascriptIncludeXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<BR SIZE=\"&{alert('XSS')}\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<BR>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for P with url in style
        [Test]
        public void PWithUrlInStyleXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<p STYLE=\"behavior: url(www.ha.ckers.org);\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            // intentionally keep it failing to get notice when reviewing unit tests so can disucss
            string expected = "<p STYLE=\"&#x3A;&#x20;url&#x28;www&#x2E;ha&#x2E;ckers&#x2E;org&#x29;&#x3B;\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image with vbscript
        [Test]
        public void ImageWithVBScriptXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC='vbscript:msgbox(\"XSS\")'>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC='vb&#x3A;msgbox&#x28;&#x26;quot&#x3B;XSS&#x26;quot&#x3B;&#x29;'>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image with Mocha
        [Test]
        public void ImageWithMochaXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"mocha:[code]\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"&#x3A;&#x5B;code&#x5D;\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image with Livescript
        [Test]
        public void ImageWithLivescriptXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"Livescript:[code]\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"Live&#x3A;&#x5B;code&#x5D;\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Iframe
        [Test]
        public void IframeXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IFRAME SRC=\"javascript:alert('XSS');\"></IFRAME>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Frame
        [Test]
        public void FrameXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<FRAMESET><FRAME SRC=\"javascript:alert('XSS');\"></FRAMESET>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Table
        [Test]
        public void TableXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<TABLE BACKGROUND=\"javascript:alert('XSS')\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for TD
        [Test]
        public void TDXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<TABLE><TD BACKGROUND=\"javascript:alert('XSS')\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div Background Image
        [Test]
        public void DivBackgroundImageXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<DIV STYLE=\"background-image: url(javascript:alert('XSS'))\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<DIV STYLE=\"background&#x2D;image&#x3A;&#x20;url&#x28;\"></div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div Background Image  with unicoded XSS
        [Test]
        public void DivBackgroundImageWithUnicodedXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<DIV STYLE=\"background-image:\0075\0072\006C\0028'\006a\0061\0076\0061\0073\0063\0072\0069\0070\0074\003a\0061\006c\0065\0072\0074\0028.1027\0058.1053\0053\0027\0029'\0029\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<DIV STYLE=\"background&#x2D;image&#x3A;&#xfffd;075&#xfffd;072&#xfffd;06C&#xfffd;028&#x26;&#x23;39&#x3B;&#xfffd;06a&#xfffd;061&#xfffd;076&#xfffd;061&#xfffd;073&#xfffd;063&#xfffd;072&#xfffd;069&#xfffd;070&#xfffd;074&#xfffd;03a&#xfffd;061&#xfffd;06c&#xfffd;065&#xfffd;072&#xfffd;074&#xfffd;028&#x2E;1027&#xfffd;058&#x2E;1053&#xfffd;053&#xfffd;027&#xfffd;029&#x26;&#x23;39&#x3B;&#xfffd;029\"></div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div Background Image  with extra characters
        [Test]
        public void DivBackgroundImageWithExtraCharactersXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<DIV STYLE=\"background-image: url(&#1;javascript:alert('XSS'))\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<DIV STYLE=\"background&#x2D;image&#x3A;&#x20;url&#x28;&#x26;amp&#x3B;&#x23;1&#x3B;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for DIV expression
        [Test]
        public void DivExpressionXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<DIV STYLE=\"width: expression(alert('XSS'));\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<DIV STYLE=\"width&#x3A;&#x28;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x29;&#x3B;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image with break up expression
        [Test]
        public void ImageStyleExpressionXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG STYLE=\"xss:expr/*XSS*/ession(alert('XSS'))\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with break up expression
        [Test]
        public void AnchorTagStyleExpressionXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "exp/*<A STYLE='no\\xss:noxss(\"*//*\");xss:&#101;x&#x2F;*XSS*//*/*/pression(alert(\"XSS\"))'>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "exp/*<a></a>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for BaseTag
        [Test]
        public void BaseTagXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<BASE HREF=\"javascript:alert('XSS');//\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for EMBEDTag
        [Test]
        public void EmbedTagXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<EMBED SRC=\"http://ha.ckers.org/xss.swf\" AllowScriptAccess=\"always\"></EMBED>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for EMBEDSVG
        [Test]
        public void EmbedSVGXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<EMBED SRC=\"data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dH A6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcv MjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hs aW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxOTQiIGhlaWdodD0iMjAw IiBpZD0ieHNzIj48c2NyaXB0IHR5cGU9InRleHQvZWNtYXNjcmlwdCI+YWxlcnQoIlh TUyIpOzwvc2NyaXB0Pjwvc3ZnPg==\" type=\"image/svg+xml\" AllowScriptAccess=\"always\"></EMBED>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for XML namespace
        [Test]
        public void XmlNamespaceXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<HTML xmlns:xss>  <?import namespace=\"xss\" implementation=\"http://ha.ckers.org/xss.htc\">  <xss:xss>XSS</xss:xss></HTML>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for XML with CData
        [Test]
        public void XmlWithCDataXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<XML ID=I><X><C><![CDATA[<IMG SRC=\"javas]]><![CDATA[cript:alert('XSS');\">]]></C></X></xml><SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<SPAN></SPAN>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for XML with Comment obfuscation
        [Test]
        public void XmlWithCommentObfuscationXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<XML ID=\"xss\"><I><B>&lt;IMG SRC=\"javas<!-- -->cript:alert('XSS')\"&gt;</B></I></XML><SPAN DATASRC=\"#xss\" DATAFLD=\"B\" DATAFORMATAS=\"HTML\"></SPAN>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<SPAN></SPAN>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for XML with Embedded script
        [Test]
        public void XmlWithEmbeddedScriptXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<XML SRC=\"xsstest.xml\" ID=I></XML><SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML></SPAN>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<SPAN></SPAN>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Html + Time
        [Test]
        public void HtmlPlusTimeXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<HTML><BODY><?xml:namespace prefix=\"t\" ns=\"urn:schemas-microsoft-com:time\"><?import namespace=\"t\" implementation=\"#default#time2\"><t:set attributeName=\"innerHTML\" to=\"XSS&lt;SCRIPT DEFER&gt;alert(&quot;XSS&quot;)&lt;/SCRIPT&gt;\"></BODY></HTML>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Embedded commands
        [Test]
        public void ImageWithEmbeddedCommandXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"http://www.thesiteyouareon.com/somecommand.php?somevariables=maliciouscode\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"http&#x3A;&#x2F;&#x2F;www&#x2E;thesiteyouareon&#x2E;com&#x2F;somecommand&#x2E;php&#x3F;somevariables&#x3D;maliciouscode\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Image Embedded commands part 2
        [Test]
        public void ImageWithEmbeddedCommand2XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG SRC=\"Redirect 302 /a.jpg http://victimsite.com/admin.asp&deleteuser\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<IMG SRC=\"Redirect&#x20;302&#x20;&#x2F;a&#x2E;jpg&#x20;http&#x3A;&#x2F;&#x2F;victimsite&#x2E;com&#x2F;admin&#x2E;asp&#x26;amp&#x3B;deleteuser\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag IP verses hostname
        [Test]
        public void AnchorTagIPVersesHostnameXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://66.102.7.147/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;66&#x2E;102&#x2E;7&#x2E;147&#x2F;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Url encoding
        [Test]
        public void AnchorTagUrlEncodingXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;&#x25;77&#x25;77&#x25;77&#x25;2E&#x25;67&#x25;6F&#x25;6F&#x25;67&#x25;6C&#x25;65&#x25;2E&#x25;63&#x25;6F&#x25;6D\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Dword encoding
        [Test]
        public void AnchorTagDwordEncodingXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://1113982867/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;1113982867&#x2F;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Hex encoding
        [Test]
        public void AnchorTagHexEncodingXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://0x42.0x0000066.0x7.0x93/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;0x42&#x2E;0x0000066&#x2E;0x7&#x2E;0x93&#x2F;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Octal encoding
        [Test]
        public void AnchorTagOctalEncodingXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://0102.0146.0007.00000223/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;0102&#x2E;0146&#x2E;0007&#x2E;00000223&#x2F;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Mixed encoding
        [Test]
        public void AnchorTagMixedEncodingXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = @"<A HREF=""h
tt	p://6&#9;6.000146.0x7.147/"">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"h&#x0D;&#x0A;tt&#x09;p&#x3A;&#x2F;&#x2F;6&#x26;amp&#x3B;&#x23;9&#x3B;6&#x2E;000146&#x2E;0x7&#x2E;147&#x2F;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Protocol resolution
        [Test]
        public void AnchorTagProtocolResolutionXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"//www.google.com/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"&#x2F;&#x2F;www&#x2E;google&#x2E;com&#x2F;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Google feeling lucky part1
        [Test]
        public void AnchorTagGoogleFeelingLucky1XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"//google\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"&#x2F;&#x2F;google\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Google feeling lucky part2
        [Test]
        public void AnchorTagGoogleFeelingLucky2XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://ha.ckers.org@google\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x40;google\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Google feeling lucky part3
        [Test]
        public void AnchorTagGoogleFeelingLucky3XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://google:ha.ckers.org\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;google&#x3A;ha&#x2E;ckers&#x2E;org\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with removing cnames
        [Test]
        public void AnchorTagRemovingCNamesXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://google.com/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;google&#x2E;com&#x2F;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with extra dot for absolute dns
        [Test]
        public void AnchorTagAbsoluteDNSXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.google.com./\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;google&#x2E;com&#x2E;&#x2F;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with javascript link location
        [Test]
        public void AnchorTagJavascriptLinkLocationXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"javascript:document.location='http://www.google.com/'\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with content replace
        [Test]
        public void AnchorTagContentReplaceXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.gohttp://www.google.com/ogle.com/\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;gohttp&#x3A;&#x2F;&#x2F;www&#x2E;google&#x2E;com&#x2F;ogle&#x2E;com&#x2F;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with no filter evasion
        [Test]
        public void AnchorTagNoFilterEvasionXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x26;gt&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with no filter evasion
        [Test]
        public void DivNoFilterEvasionXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x26;gt&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and no filter evasion
        [Test]
        public void DivStyleExpressionNoFilterEvasionXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x26;gt&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;&#x29;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with non alpha non digit xss
        [Test]
        public void AnchorTagNonAlphaNonDigitXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT/XSS SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x2F;XSS&#x20;SRC&#x3D;\">\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with non alpha non digit xss
        [Test]
        public void DivNonAlphaNonDigitXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT/XSS SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x2F;XSS&#x20;SRC&#x3D;\">\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and non alpha non digit xss
        [Test]
        public void DivStyleExpressionNonAlphaNonDigitXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT/XSS SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x2F;XSS&#x20;SRC&#x3D;\">)\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with non alpha non digit part 3 xss
        [Test]
        public void AnchorTagNonAlphaNonDigit3XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT/SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x2F;SRC&#x3D;\">\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with non alpha non digit part 3 xss
        [Test]
        public void DivNonAlphaNonDigit3XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT/SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x2F;SRC&#x3D;\">\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and non alpha non digit part 3 xss
        [Test]
        public void DivStyleExpressionNonAlphaNonDigit3XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT/SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x2F;SRC&#x3D;\">)\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Extraneous open brackets xss
        [Test]
        public void AnchorTagExtraneousOpenBracketsXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<<SCRIPT>alert(\"XSS\");//<</SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;\"></A>\">XSS";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with Extraneous open brackets xss
        [Test]
        public void DivExtraneousOpenBracketsXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<<SCRIPT>alert(\"XSS\");//<</SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;\"></Div>\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and Extraneous open brackets xss
        [Test]
        public void DivStyleExpressionExtraneousOpenBracketsXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<<SCRIPT>alert(\"XSS\");//<</SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;\"></div>)\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with No closing script tags xss
        [Test]
        public void AnchorTagNoClosingScriptTagsXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js?<B>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x3F;&#x26;lt&#x3B;B&#x26;gt&#x3B;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with No closing script tags xss
        [Test]
        public void DivNoClosingScriptTagsXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT SRC=http://ha.ckers.org/xss.js?<B>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x3F;&#x26;lt&#x3B;B&#x26;gt&#x3B;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and No closing script tags xss
        [Test]
        public void DivStyleExpressionNoClosingScriptTagsXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT SRC=http://ha.ckers.org/xss.js?<B>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;SRC&#x3D;http&#x3A;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;xss&#x2E;js&#x3F;&#x26;lt&#x3B;B&#x26;gt&#x3B;&#x29;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Protocol resolution in script tags xss
        [Test]
        public void AnchorTagProtocolResolutionScriptXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT SRC=//ha.ckers.org/.j>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;&#x2E;j&#x26;gt&#x3B;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with Protocol resolution in script tags xss
        [Test]
        public void DivProtocolResolutionScriptXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT SRC=//ha.ckers.org/.j>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;SRC&#x3D;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;&#x2E;j&#x26;gt&#x3B;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and Protocol resolution in script tags xss
        [Test]
        public void DivStyleExpressionProtocolResolutionScriptXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT SRC=//ha.ckers.org/.j>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;SRC&#x3D;&#x2F;&#x2F;ha&#x2E;ckers&#x2E;org&#x2F;&#x2E;j&#x26;gt&#x3B;&#x29;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with no single quotes or double quotes or semicolons xss
        [Test]
        public void AnchorTagNoQuotesXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT>a=/XSS/alert(a.source)</SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;gt&#x3B;a&#x3D;&#x2F;XSS&#x2F;alert&#x28;a&#x2E;source&#x29;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with no single quotes or double quotes or semicolons xss
        [Test]
        public void DivNoQuotesXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT>a=/XSS/alert(a.source)</SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;gt&#x3B;a&#x3D;&#x2F;XSS&#x2F;alert&#x28;a&#x2E;source&#x29;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and no single quotes or double quotes or semicolons xss
        [Test]
        public void DivStyleExpressionNoQuotesXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT>a=/XSS/alert(a.source)</SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x26;gt&#x3B;a&#x3D;&#x2F;XSS&#x2F;alert&#x28;a&#x2E;source&#x29;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;&#x29;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with US-ASCII encoding xss
        [Test]
        public void AnchorTagUSASCIIEncodingXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=¼script¾alert(¢XSS¢)¼/script¾\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;&#x23;188&#x3B;&#x26;&#x23;190&#x3B;alert&#x28;&#x26;&#x23;162&#x3B;XSS&#x26;&#x23;162&#x3B;&#x29;&#x26;&#x23;188&#x3B;&#x2F;&#x26;&#x23;190&#x3B;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with US-ASCII encoding xss
        [Test]
        public void DivUSASCIIEncodingXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=¼script¾alert(¢XSS¢)¼/script¾\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;&#x23;188&#x3B;&#x26;&#x23;190&#x3B;alert&#x28;&#x26;&#x23;162&#x3B;XSS&#x26;&#x23;162&#x3B;&#x29;&#x26;&#x23;188&#x3B;&#x2F;&#x26;&#x23;190&#x3B;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and US-ASCII encoding xss
        [Test]
        public void DivStyleExpressionUSASCIIEncodingXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(¼script¾alert(¢XSS¢)¼/script¾)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;&#x23;188&#x3B;&#x26;&#x23;190&#x3B;alert&#x28;&#x26;&#x23;162&#x3B;XSS&#x26;&#x23;162&#x3B;&#x29;&#x26;&#x23;188&#x3B;&#x2F;&#x26;&#x23;190&#x3B;&#x29;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Downlevel-Hidden block xss
        [Test]
        public void AnchorTagDownlevelHiddenBlockXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<!--[if gte IE 4]><SCRIPT>alert('XSS');</SCRIPT><![endif]-->\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x21;&#x2D;&#x2D;&#x5B;if&#x20;gte&#x20;IE&#x20;4&#x5D;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x21;&#x5B;endif&#x5D;&#x2D;&#x2D;&#x26;gt&#x3B;\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with Downlevel-Hidden block xss
        [Test]
        public void DivDownlevelHiddenBlockXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<!--[if gte IE 4]><SCRIPT>alert('XSS');</SCRIPT><![endif]-->\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x21;&#x2D;&#x2D;&#x5B;if&#x20;gte&#x20;IE&#x20;4&#x5D;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x21;&#x5B;endif&#x5D;&#x2D;&#x2D;&#x26;gt&#x3B;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and Downlevel-Hidden block xss
        [Test]
        public void DivStyleExpressionDownlevelHiddenBlockXSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<!--[if gte IE 4]><SCRIPT>alert('XSS');</SCRIPT><![endif]-->)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x21;&#x2D;&#x2D;&#x5B;if&#x20;gte&#x20;IE&#x20;4&#x5D;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x26;gt&#x3B;alert&#x28;&#x26;&#x23;39&#x3B;XSS&#x26;&#x23;39&#x3B;&#x29;&#x3B;&#x26;lt&#x3B;&#x2F;&#x26;gt&#x3B;&#x26;lt&#x3B;&#x21;&#x5B;endif&#x5D;&#x2D;&#x2D;&#x26;gt&#x3B;&#x29;\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Html Quotes Encapsulation 1 xss
        [Test]
        public void AnchorTagHtmlQuotesEncapsulation1XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT a=\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with Html Quotes Encapsulation 1 xss
        [Test]
        public void DivHtmlQuotesEncapsulation1XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT a=\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and Html Quotes Encapsulation 1 xss
        [Test]
        public void DivStyleExpressionHtmlQuotesEncapsulation1XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT a=\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;a&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">)\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Html Quotes Encapsulation 2 xss
        [Test]
        public void AnchorTagHtmlQuotesEncapsulation2XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT =\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with Html Quotes Encapsulation 2 xss
        [Test]
        public void DivHtmlQuotesEncapsulation2XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT =\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and Html Quotes Encapsulation 2 xss
        [Test]
        public void DivStyleExpressionHtmlQuotesEncapsulation2XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT =\">\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x3D;\">\" SRC=\"http://ha.ckers.org/xss.js\">)\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Html Quotes Encapsulation 3 xss
        [Test]
        public void AnchorTagHtmlQuotesEncapsulation3XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT a=\">\" '' SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\">\" '' SRC=\"http://ha.ckers.org/xss.js\">\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with Html Quotes Encapsulation 3 xss
        [Test]
        public void DivHtmlQuotesEncapsulation3XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT a=\" > \" '' SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\"> \" '' SRC=\"http://ha.ckers.org/xss.js\">\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and Html Quotes Encapsulation 3 xss
        [Test]
        public void DivStyleExpressionHtmlQuotesEncapsulation3XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT a=\" > \" '' SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;a&#x3D;\"> \" '' SRC=\"http://ha.ckers.org/xss.js\">)\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Html Quotes Encapsulation 4 xss
        [Test]
        public void AnchorTagHtmlQuotesEncapsulation4XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT \"a='>'\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;\">\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with Html Quotes Encapsulation 4 xss
        [Test]
        public void DivHtmlQuotesEncapsulation4XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT \"a='>'\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;\">\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and Html Quotes Encapsulation 4 xss
        [Test]
        public void DivStyleExpressionHtmlQuotesEncapsulation4XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT \"a='>'\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;\">)\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Html Quotes Encapsulation 5 xss
        [Test]
        public void AnchorTagHtmlQuotesEncapsulation5XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT a=`>` SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;&#x60;&#x26;gt&#x3B;&#x60;&#x20;SRC&#x3D;\">\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with Html Quotes Encapsulation 5 xss
        [Test]
        public void DivHtmlQuotesEncapsulation5XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT a=`>` SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;&#x60;&#x26;gt&#x3B;&#x60;&#x20;SRC&#x3D;\">\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and Html Quotes Encapsulation 5 xss
        [Test]
        public void DivStyleExpressionHtmlQuotesEncapsulation5XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT a=`>` SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;a&#x3D;&#x60;&#x26;gt&#x3B;&#x60;&#x20;SRC&#x3D;\">)\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Html Quotes Encapsulation 6 xss
        [Test]
        public void AnchorTagHtmlQuotesEncapsulation6XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT a=\">'>\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\">'>\" SRC=\"http://ha.ckers.org/xss.js\">\">XSS</A>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with Html Quotes Encapsulation 6 xss
        [Test]
        public void DivHtmlQuotesEncapsulation6XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT a=\">'>\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;a&#x3D;\">'>\" SRC=\"http://ha.ckers.org/xss.js\">\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and Html Quotes Encapsulation 6 xss
        [Test]
        public void DivStyleExpressionHtmlQuotesEncapsulation6XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT a=\">'>\" SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;a&#x3D;\">'>\" SRC=\"http://ha.ckers.org/xss.js\">)\"></Div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for AnchorTag with Html Quotes Encapsulation 7 xss
        [Test]
        public void AnchorTagHtmlQuotesEncapsulation7XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<A HREF=\"http://www.codeplex.com?url=<SCRIPT>document.write(\"<SCRI\");</SCRIPT>PT SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">XSS</A>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<A HREF=\"http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;gt&#x3B;document&#x2E;write&#x28;\"></a>PT SRC=\"http://ha.ckers.org/xss.js\">\">XSS";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with Html Quotes Encapsulation 7 xss
        [Test]
        public void DivHtmlQuotesEncapsulation7XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: http://www.codeplex.com?url=<SCRIPT>document.write(\"<SCRI\");</SCRIPT>PT SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x20;http&#x3A;&#x2F;&#x2F;www&#x2E;codeplex&#x2E;com&#x3F;url&#x3D;&#x26;lt&#x3B;&#x26;gt&#x3B;document&#x2E;write&#x28;\"></div>PT SRC=\"http://ha.ckers.org/xss.js\">\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with style expression and Html Quotes Encapsulation 7 xss
        [Test]
        public void DivStyleExpressionHtmlQuotesEncapsulation7XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expression(<SCRIPT>document.write(\"<SCRI\");</SCRIPT>PT SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x26;gt&#x3B;document&#x2E;write&#x28;\"></div>PT SRC=\"http://ha.ckers.org/xss.js\">)\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        [Test]
        public void HtmlEncode() {
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<div style=\"background-color: test\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<div style=\"background&#x2D;color&#x3A;&#x20;test\"></div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div with double suspicious word and Html Quotes Encapsulation 7 xss
        [Test]
        public void DivDoubleSuspiciousWordHtmlQuotesEncapsulation7XSSTest() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<Div style=\"background-color: expexpressionression(<SCRIPT>document.write(\"<SCRI\");</SCRIPT>PT SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>)\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<Div style=\"background&#x2D;color&#x3A;&#x28;&#x26;lt&#x3B;&#x26;gt&#x3B;document&#x2E;write&#x28;\"></div>PT SRC=\"http://ha.ckers.org/xss.js\">)\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for image with style attribute
        [Test]
        public void ImageWithStyleAttribute() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<IMG style=\"border:5px solid red\"> sanitizes to <img>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<img> sanitizes to <img>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div tag for broken expression embedded in style attribute.
        [Test]
        public void DivStyleWithBrokenExpression() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<div STYLE=\"background-color:expre/* x*/ssion(alert(window.location))\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<div STYLE=\"background&#x2D;color&#x3A;&#x28;alert&#x28;window&#x2E;location&#x29;&#x29;\"></div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div tag for -moz-binding in style attribute.
        [Test]
        public void DivStyleWithMozBinding() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<div style=\"color: red; -moz-binding: url(https://bugzilla.mozilla.org/attachment.cgi?id=209238#exploit); \">  This is a paragraph with inline exploit CSS. </div>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<div style=\"color&#x3A;&#x20;red&#x3B;&#x20;binding&#x3A;&#x20;url&#x28;https&#x3A;&#x2F;&#x2F;bugzilla&#x2E;mozilla&#x2E;org&#x2F;attachment&#x2E;cgi&#x3F;id&#x3D;209238&#x23;exploit&#x29;&#x3B;&#x20;\">  This is a paragraph with inline exploit CSS. </div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Link tag for webkit external css.
        [Test]
        public void LinkWithWebKitCSS() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<link rel=\"stylesheet\" media=\"screen and -webkit-min-device-pixel-ratio: 0\" href=\"webkit.css\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<link rel=\"stylesheet\" media=\"screen&#x20;and&#x20;minpixel&#x2D;ratio&#x3A;&#x20;0\" href=\"webkit&#x2E;css\">";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div tag for webkit css in style attribute.
        [Test]
        public void DivWithWebKitStyle() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<div style=\"-webkit-transform: rotate(45deg);\"></div>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<div style=\"transform&#x3A;&#x20;rotate&#x28;45deg&#x29;&#x3B;\"></div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }


        // A test for Div tag with custom ms extenstion in style attribute.
        [Test]
        public void DivWithMSExtension() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<div style=\"-ms-writing-mode: tb-rl\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<div style=\"writing&#x2D;mode&#x3A;&#x20;tb&#x2D;rl\"></div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div tag with custom KHtml extenstion in style attribute.
        [Test]
        public void DivWithKHtmlExtension() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<div style=\"-khtml-opacity: 0.5;\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<div style=\"opacity&#x3A;&#x20;0&#x2E;5&#x3B;\"></div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for Div tag with custom O extenstion in style attribute.
        [Test]
        public void DivWithOExtension() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<div style=\"-o-text-overflow: clip;\">";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<div style=\"text&#x2D;overflow&#x3A;&#x20;clip&#x3B;\"></div>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        // A test for P tag with custom Wap extenstion in style attribute.
        [Test]
        public void PWithWapExtension() {
            // Arrange
            DefaultHtmlSanitizer target = new DefaultHtmlSanitizer();
            Dictionary<string, string[]> elementWhiteList = CreateElementWhiteList();

            // Act
            string htmlFragment = "<p style=\"display: -wap-marquee; -wap-marquee-dir: ltr\">Hello, welcome to our WCSS Tutorial.</p>";
            string actual = target.GetSafeHtmlFragment(htmlFragment, elementWhiteList);

            // Assert
            string expected = "<p style=\"display&#x3A;&#x20;marquee&#x3B;&#x20;marquee&#x2D;dir&#x3A;&#x20;ltr\">Hello, welcome to our WCSS Tutorial.</p>";
            StringAssert.AreEqualIgnoringCase(expected, actual);
        }

        Dictionary<string, string[]> CreateElementWhiteList() {
            return new Dictionary<string, string[]> {
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
                { "a", new string[] { "href" } },
                { "link", new string[] { "rel", "media", "href" } }
            };
        }
    }
}