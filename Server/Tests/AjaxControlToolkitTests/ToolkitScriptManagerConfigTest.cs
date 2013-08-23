using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using Moq;
using NUnit.Framework;

namespace AjaxControlToolkit.Tests {
    [TestFixture]
    public class ToolkitScriptManagerConfigTest {
        private Mock<HttpContextBase> _moqContext;
        private Mock<HttpServerUtilityBase> _moqServer;
        private Mock<IAjaxControlToolkitCacheProvider> _mockCacheProvider;
        private const string CacheConfigName = "__CACHED__AjaxControlToolkitConfig";

        [SetUp]
        [DeploymentItem("TestData\\AjaxControlToolkit.config")]
        public void Init() {
            _moqContext = new Mock<HttpContextBase>();
            _moqServer = new Mock<HttpServerUtilityBase>();
            _mockCacheProvider = new Mock<IAjaxControlToolkitCacheProvider>();
            _moqContext.Setup(s => s.Server).Returns(_moqServer.Object);
        }

        [TearDown]
        public void CleanUp() {
            _mockCacheProvider.Setup(c => c.Get<string>(CacheConfigName)).Returns("");
        }

        

        [Test]
        public void DefaultBundleTest() {

            UseConfigFile(true);

            var configManager = new ToolkitScriptManagerConfig(_mockCacheProvider.Object);
            var results = configManager.GetControlTypesInBundles(_moqContext.Object, null);

            // Assert all controls in default bundle group
            AssertResults(results, new[] {
                                             "AsyncFileUpload",
                                             "AutoCompleteExtender",
                                             "BalloonPopupExtender",
                                             "BarChart",
                                             "BubbleChart"
                                         });
        }

        [Test]
        public void MultipleControlsInBundleTest() {

            UseConfigFile(true);

            var configManager = new ToolkitScriptManagerConfig(_mockCacheProvider.Object);
            var results = configManager.GetControlTypesInBundles(_moqContext.Object,
                                                                        new[] {"MultiBundle"});

            // Assert all controls in MultiBundle group
            AssertResults(results, new[] {
                                             "AjaxFileUpload",
                                             "AlwaysVisibleControlExtender",
                                             "AreaChart"
                                         });

        }

        [Test]
        public void SingleControlInBundleTest() {

            UseConfigFile(true);

            var configManager = new ToolkitScriptManagerConfig(_mockCacheProvider.Object);
            var results = configManager.GetControlTypesInBundles(_moqContext.Object, new[] {"SingleBundle"});

            // Assert all controls in SingleBundle group
            AssertResults(results, new[] {"AccordionExtender"});
        }

        [Test]
        public void WithoutConfigShouldReturnsAllActControlsTest() {

            UseConfigFile(false);

            var configManager = new ToolkitScriptManagerConfig(_mockCacheProvider.Object);
            var results = configManager.GetControlTypesInBundles(_moqContext.Object, null);

            var bundleTypes = new List<string>();
            foreach (var bundleControl in ToolkitScriptManagerConfig.ControlDependencyTypeMaps) {
                bundleTypes.AddRange(bundleControl.Value);
            }

            Assert.AreEqual(results.Count, bundleTypes.Distinct().Count());
            foreach (string type in bundleTypes) {
                Assert.IsTrue(results.Select(r => r.FullName).Contains(type),
                              "Can't resolve {0}", type);
            }
        }

        [Test]
        [ExpectedException(typeof (Exception))]
        public void CustomBundleWithoutConfigFileShouldErrorTest() {

            UseConfigFile(false);

            var configManager = new ToolkitScriptManagerConfig(_mockCacheProvider.Object);
            configManager.GetControlTypesInBundles(_moqContext.Object, new[] {"Accordion"});
        }

        [Test]
        public void CachingConfigContentTest() {

            UseConfigFile(true);

            _mockCacheProvider.Setup(c => c.Get<string>(CacheConfigName)).Returns("");

            var configManager = new ToolkitScriptManagerConfig(_mockCacheProvider.Object);
            configManager.GetControlTypesInBundles(_moqContext.Object, null);
            _mockCacheProvider.Verify(c => c.Set(CacheConfigName, It.IsAny<string>(), 
                It.IsAny<string>()), Times.Once());
        }

        [Test]
        public void DoNotCacheConfigContentTest()
        {

            UseConfigFile(true);

            

            _mockCacheProvider.Setup(c => c.Get<string>(CacheConfigName)).Returns(
@"<?xml version=""1.0"" encoding=""utf-8"" ?>
<ajaxControlToolkit>
  <controlBundles>
    <controlBundle>
      <control name=""AsyncFileUpload""></control>
      <control name=""AutoCompleteExtender""></control>
      <control name=""BalloonPopupExtender""></control>
      <control name=""BarChart""></control>
      <control name=""BubbleChart""></control>
    </controlBundle>
  </controlBundles>
</ajaxControlToolkit>");

            var configManager = new ToolkitScriptManagerConfig(_mockCacheProvider.Object);
            configManager.GetControlTypesInBundles(_moqContext.Object, null);
            _mockCacheProvider.Verify(c => c.Set(CacheConfigName, It.IsAny<string>(),
                It.IsAny<string>()), Times.Never());
        }


        private void UseConfigFile(bool use) {
            _moqServer.Setup(a => a.MapPath(It.IsAny<string>())).Returns(
                use
                    ? Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + "\\AjaxControlToolkit.config"
                    : "nonexists.file");
        }

        private static void AssertResults(List<Type> results, string[] maps) {

            // Get dependency in standard ACT control dependency maps based on maps
            var bundleControls = ToolkitScriptManagerConfig.ControlDependencyTypeMaps
                                                           .Where(c => maps.Contains(c.Key.Remove(0, "AjaxControlToolkit.".Length)));
            var bundleTypes = new List<string>();
            foreach (var bundleControl in bundleControls) {
                bundleTypes.AddRange(bundleControl.Value);
            }

            Assert.AreEqual(results.Count, bundleTypes.Count);
            foreach (string type in bundleTypes) {
                Assert.IsTrue(results.Select(r => r.FullName).Contains(type));
            }
        }
    }
}