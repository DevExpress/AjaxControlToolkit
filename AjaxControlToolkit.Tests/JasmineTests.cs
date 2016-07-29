﻿using NUnit.Framework;
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

        TimeSpan _maxTimeout = TimeSpan.FromMinutes(4);
        TimeSpan _checkInterval = TimeSpan.FromSeconds(5);
        string _siteUrl;
        string _driverDir;

        [SetUp]
        public void Setup() {
            _siteUrl = Environment.GetEnvironmentVariable("AjaxControlToolkitTestSiteUrl");

            if(String.IsNullOrWhiteSpace(_siteUrl))
                _siteUrl = "http://localhost/JasmineTests/TestRunner.aspx";

            _driverDir = GetDriverDirectory();
        }

        static string GetDriverDirectory() {
            return Directory.GetParent(Path.GetDirectoryName(typeof(JasmineTests).Assembly.Location)).FullName;
        }

        [Test]
        public void Chrome() {
            var driver = new ChromeDriver(_driverDir);

            TestBrowser(driver);
        }

        [Test]
        public void FireFox() {
            var driverService = FirefoxDriverService.CreateDefaultService(_driverDir, "geckodriver.exe");
            driverService.FirefoxBinaryPath = @"C:\Program Files (x86)\Mozilla Firefox\firefox.exe";
            driverService.HideCommandPromptWindow = true;
            driverService.SuppressInitialDiagnosticInformation = true;
            var driver = new FirefoxDriver(driverService, new FirefoxOptions(), TimeSpan.FromSeconds(60));

            TestBrowser(driver);
        }

        [Test]
        public void InternetExplorer() {
            var driver = new InternetExplorerDriver(_driverDir, new InternetExplorerOptions(), TimeSpan.FromMinutes(3));

            TestBrowser(driver);
        }

        void TestBrowser(IWebDriver driver) {            

            try {
                driver.Navigate().GoToUrl(_siteUrl);                

                var selectAllCheckbox = driver.FindElement(By.XPath("//label[text()='SELECT ALL']"));
                selectAllCheckbox.Click();

                var runButton = driver.FindElement(By.ClassName("run-button"));
                runButton.Click();

                var currentSpecCount = driver.FindElement(By.XPath("//div[@class='spec-counter']/span[@class='current']"));
                var totalSpecCount = driver.FindElement(By.XPath("//div[@class='spec-counter']/span[@class='total']"));

                var stopwatch = new Stopwatch();
                stopwatch.Start();

                while(stopwatch.ElapsedMilliseconds < _maxTimeout.TotalMilliseconds) {
                    Thread.Sleep(_checkInterval);
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
