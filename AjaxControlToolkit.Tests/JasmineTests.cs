using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class JasmineTests {

        TimeSpan maxTimeout = TimeSpan.FromMinutes(2);
        TimeSpan checkInterval = TimeSpan.FromSeconds(5);

        [Test]
        public void Chrome() {
            var dir = Path.GetDirectoryName(typeof(JasmineTests).Assembly.Location);
            var driver = new ChromeDriver(dir);
            var siteUrl = Environment.GetEnvironmentVariable("AjaxControlToolkitTestSiteUrl");

            if(String.IsNullOrWhiteSpace(siteUrl))
                siteUrl = "http://localhost/JasmineTests/TestRunner.aspx";

            TestBrowser(driver, siteUrl, maxTimeout, checkInterval);
        }

        void TestBrowser(IWebDriver driver, string siteUrl, TimeSpan maxTimeout, TimeSpan checkInterval) {
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
