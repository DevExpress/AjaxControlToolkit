using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class JasmineTests {

        TimeSpan maxTimeout = TimeSpan.FromMinutes(4);
        TimeSpan checkInterval = TimeSpan.FromSeconds(5);
        string siteUrl;

        [SetUp]
        public void Setup() {
            siteUrl = Environment.GetEnvironmentVariable("AjaxControlToolkitTestSiteUrl");

            if(String.IsNullOrWhiteSpace(siteUrl))
                siteUrl = "http://localhost/JasmineTests/TestRunner.aspx";
        }

        [Test]
        public void Chrome() {
            var dir = Path.GetDirectoryName(typeof(JasmineTests).Assembly.Location);
            var driver = new ChromeDriver(dir);

            TestBrowser(driver);
        }

        [Test]
        public void FireFox() {
            var driver = new FirefoxDriver();

            TestBrowser(driver);
        }

        [Test]
        public void InternetExplorer() {
            var dir = Path.GetDirectoryName(typeof(JasmineTests).Assembly.Location);
            var driver = new InternetExplorerDriver(dir, new InternetExplorerOptions(), TimeSpan.FromMinutes(3));

            TestBrowser(driver);
        }

        void TestBrowser(IWebDriver driver) {            

            try {
                driver.Navigate().GoToUrl(siteUrl);                

                var selectAllCheckbox = driver.FindElement(By.XPath("//label[text()='SELECT ALL']"));
                selectAllCheckbox.Click();

                var runButton = driver.FindElement(By.ClassName("run-button"));
                runButton.Click();

                var currentSpecCount = driver.FindElement(By.XPath("//div[@class='spec-counter']/span[@class='current']"));
                var totalSpecCount = driver.FindElement(By.XPath("//div[@class='spec-counter']/span[@class='total']"));

                var stopwatch = new Stopwatch();
                stopwatch.Start();

                while(stopwatch.ElapsedMilliseconds < maxTimeout.TotalMilliseconds) {
                    Thread.Sleep(checkInterval);
                    CheckTestResults(driver, currentSpecCount, totalSpecCount);
                }

                Assert.Fail("Test timed out");

            } finally {
                driver.Quit();
            }
        }

        void CheckTestResults(IWebDriver driver, IWebElement currentSpecCount, IWebElement totalSpecCount) {
            if(currentSpecCount.Text != totalSpecCount.Text)
                return;

            var failedSpecCount = driver.FindElement(By.XPath("//div[@class='spec-counter']/span[contains(@class,'done')]/span[@class='failed-count']"));

            if(failedSpecCount.Text == "0")
                Assert.Pass();
            else {
                var failedReports = driver.FindElements(By.ClassName("test-result-failure"));
                var exceptionMessage = String.Empty;

                foreach(var report in failedReports) {
                    var extenderName = report.FindElement(By.ClassName("suite-name-badge")).Text;
                    var testName = report.FindElement(By.ClassName("test-name")).Text;
                    var errorMessage = report.FindElement(By.XPath("//div[@class='stack-trace']/div[@class='header']")).Text;

                    exceptionMessage += String.Format("{0} {1}: {2}" + Environment.NewLine, extenderName, testName, errorMessage);
                }
                Assert.Fail(exceptionMessage);
            }
        }
    }
}
