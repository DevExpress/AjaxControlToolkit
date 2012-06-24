using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using AjaxControlToolkit;
using System.Web.Configuration;
using AjaxControlToolkit.Sanitizer;

namespace UnitTests.HtmlEditorExtenderTests {
    /// <summary>
    /// Summary description for DecodeTests
    /// </summary>
    [TestClass]
    public class DecodeTests {
        public DecodeTests() {
            //
            // TODO: Add constructor logic here
            //
        }

        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext {
            get {
                return testContextInstance;
            }
            set {
                testContextInstance = value;
            }
        }

        #region Additional test attributes
        //
        // You can use the following additional attributes as you write your tests:
        //
        // Use ClassInitialize to run code before running the first test in the class
        // [ClassInitialize()]
        // public static void MyClassInitialize(TestContext testContext) { }
        //
        // Use ClassCleanup to run code after all tests in a class have run
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
        // Use TestInitialize to run code before running each test 
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // Use TestCleanup to run code after each test has run
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //
        #endregion

        [TestMethod]
        public void TestDecodeSanitizerProvider() {
            // Arrange
            var editor = new HtmlEditorExtender();
            
            // Act
            editor.SanitizerProvider = new HtmlAgilityPackSanitizerProvider();

            // Assert
            Assert.AreEqual("AjaxControlToolkit.Sanitizer.HtmlAgilityPackSanitizerProvider", editor.SanitizerProvider.ToString());
        }

        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.CSV", "Inputs.csv", "Inputs#csv", DataAccessMethod.Sequential)]
        [DeploymentItem("Server\\Tests\\UnitTests\\HtmlEditorExtenderTests\\Inputs.csv")]
        [TestMethod]
        public void TestDecode() {
            // Arrange
            var editor = new HtmlEditorExtender();
            editor.SanitizerProvider = new HtmlAgilityPackSanitizerProvider();
            var input = TestContext.DataRow["Input"] as string;
            var output = TestContext.DataRow["Output"] as string;

            // Act
            var result = editor.Decode(input);
            
            // Assert
            Assert.AreEqual(output, input);
        }
    }
}
