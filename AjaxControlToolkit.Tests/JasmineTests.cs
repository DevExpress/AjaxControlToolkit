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

        [Test]
        public void Chrome() {
            var dir = Path.GetDirectoryName(typeof(JasmineTests).Assembly.Location);
            var driver = new ChromeDriver(dir);

            try {
                driver.Navigate().GoToUrl("http://localhost/JasmineTests/TestRunner.aspx");

                var selectAllCheckbox = driver.FindElement(By.XPath("//label[text()='SELECT ALL']"));
                selectAllCheckbox.Click();

                var runButton = driver.FindElement(By.ClassName("run-button"));
                runButton.Click();

                var currentSpecCount = driver.FindElement(By.XPath("//div[@class='spec-counter']/span[@class='current']"));
                var totalSpecCount = driver.FindElement(By.XPath("//div[@class='spec-counter']/span[@class='total']"));

                int maxTimeout = 2 * 60 * 1000;
                int sleepDuration = 5 * 1000;

                var stopwatch = new Stopwatch();
                stopwatch.Start();

                while(stopwatch.ElapsedMilliseconds < maxTimeout) {
                    Thread.Sleep(sleepDuration);

                    if(currentSpecCount.Text == totalSpecCount.Text) {
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

                Assert.Fail("Test timed out");
            } finally {
                //driver.Quit();
            }
        }
    }
}
