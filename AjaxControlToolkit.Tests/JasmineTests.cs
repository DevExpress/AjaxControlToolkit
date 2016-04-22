using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System.IO;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class JasmineTests {

        [Test]
        public void Chrome() {
            var dir = Path.GetDirectoryName(typeof(JasmineTests).Assembly.Location);            
            IWebDriver driver = new ChromeDriver(dir);
            driver.Navigate().GoToUrl("http://localhost:49290");
            driver.Quit();
            Assert.AreEqual(1, 1);
        }
    }
}
