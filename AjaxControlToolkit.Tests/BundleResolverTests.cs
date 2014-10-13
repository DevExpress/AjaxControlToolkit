using AjaxControlToolkit.Bundling;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class BundleResolverTests {
        Mock<HttpContextBase> _moqContext;
        Mock<HttpServerUtilityBase> _moqServer;
        Mock<ICache> _moqCache;
        const string CacheConfigName = "e3e5a62a67434f0aa62901759726f470";

        [SetUp]        
        public void Init() {
            _moqContext = new Mock<HttpContextBase>();
            _moqServer = new Mock<HttpServerUtilityBase>();
            _moqCache = new Mock<ICache>();
            _moqContext.Setup(s => s.Server).Returns(_moqServer.Object);
        }

        [TearDown]
        public void CleanUp() {
            _moqCache.Setup(c => c.Get<string>(CacheConfigName)).Returns("");
        }

        [Test]
        public void DefaultBundleTest() {
            UseConfigFile(true);

            var configManager = new BundleResolver(_moqCache.Object);
            var results = configManager.GetControlTypesInBundles(_moqContext.Object, null);

            // Assert all controls in default bundle group
            AssertResults(results, new[] {
                "TextBoxWatermarkExtender",
                "RoundedCornersExtender",
                "DropShadowExtender"
            });
        }

        [Test]
        public void MultipleControlsInBundleTest() {
            UseConfigFile(true);

            var resolver = new BundleResolver(_moqCache.Object);
            var results = resolver.GetControlTypesInBundles(_moqContext.Object, new[] { "MultiBundle" });

            // Assert all controls in MultiBundle group
            AssertResults(results, new[] {
                "TextBoxWatermarkExtender",
                "RoundedCornersExtender",
                "DropShadowExtender"
            });
        }

        [Test]
        public void SingleControlInBundleTest() {
            UseConfigFile(true);

            var resolver = new BundleResolver(_moqCache.Object);
            var results = resolver.GetControlTypesInBundles(_moqContext.Object, new[] { "SingleBundle" });

            // Assert all controls in SingleBundle group
            AssertResults(results, new[] { "TextBoxWatermarkExtender" });
        }

        [Test]
        public void WithoutConfigShouldReturnsAllActControlsTest() {
            UseConfigFile(false);

            var resolver = new BundleResolver(_moqCache.Object);
            var results = resolver.GetControlTypesInBundles(_moqContext.Object, null);

            var bundleTypes = new List<string>();
            foreach(var bundleControl in BundleResolver.ControlDependencyTypeMaps) {
                bundleTypes.AddRange(bundleControl.Value);
            }

            Assert.AreEqual(results.Count, bundleTypes.Distinct().Count());
            foreach(string type in bundleTypes) {
                Assert.IsTrue(results.Select(r => r.FullName).Contains(type), "Can't resolve {0}", type);
            }
        }

        [Test]
        [ExpectedException(typeof(Exception), MatchType=MessageMatch.Contains, ExpectedMessage="AjaxControlToolkit.config file is not defined")]
        public void CustomBundleWithoutConfigFileShouldErrorTest() {
            UseConfigFile(false);

            var resolver = new BundleResolver(_moqCache.Object);
            resolver.GetControlTypesInBundles(_moqContext.Object, new[] { "Accordion" });
        }

        [Test]
        public void Caching_SetMethodIsCalledIfCacheIsEmpty() {
            UseConfigFile(true);

            _moqCache.Setup(c => c.Get<string>(CacheConfigName)).Returns("");

            var resolver = new BundleResolver(_moqCache.Object);
            resolver.GetControlTypesInBundles(_moqContext.Object, null);
            _moqCache.Verify(c => c.Set(CacheConfigName, It.IsAny<string>(), It.IsAny<string>()), Times.Once());
        }

        [Test]
        public void Caching_SetMethodIsNotCalledIfCacheIsFull() {
            UseConfigFile(true);

            _moqCache.Setup(c => c.Get<string>(CacheConfigName)).Returns(File.ReadAllText(GetTestConfigPath()));

            var resolver = new BundleResolver(_moqCache.Object);
            resolver.GetControlTypesInBundles(_moqContext.Object, null);
            _moqCache.Verify(c => c.Set(CacheConfigName, It.IsAny<string>(), It.IsAny<string>()), Times.Never());
        }

        void UseConfigFile(bool use) {
            _moqServer.Setup(a => a.MapPath(It.IsAny<string>())).Returns(use ? GetTestConfigPath() : "nonexists.file");
        }

        static string GetTestConfigPath() {
            return Path.GetDirectoryName(typeof(BundleResolverTests).Assembly.Location) + "\\TestData\\AjaxControlToolkit.config";
        }

        static void AssertResults(List<Type> results, string[] maps) {
            // Get dependency in standard ACT control dependency maps based on maps
            var bundleControls = BundleResolver.ControlDependencyTypeMaps.Where(c => maps.Contains(c.Key.Remove(0, "AjaxControlToolkit.".Length)));
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