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
        Mock<ICache> _moqCache;
        const string CacheConfigName = "e3e5a62a67434f0aa62901759726f470";

        [SetUp]        
        public void Init() {
            _moqContext = new Mock<HttpContextBase>();
            _moqCache = new Mock<ICache>();
        }

        [TearDown]
        public void CleanUp() {
            _moqCache.Setup(c => c.Get<string>(CacheConfigName)).Returns("");
        }

        [Test]
        public void MultipleControlsInBundleTest() {
            var resolver = new BundleResolver(_moqCache.Object);
            var results = resolver.GetControlTypesInBundles(new[] { "MultiBundle" }, TestConfigPath);

            // Assert all controls in MultiBundle group
            AssertResults(results, new[] {
                "TextBoxWatermarkExtender",
                "RoundedCornersExtender",
                "DropShadowExtender"
            });
        }

        [Test]
        public void SingleControlInBundleTest() {
            var resolver = new BundleResolver(_moqCache.Object);
            var results = resolver.GetControlTypesInBundles(new[] { "SingleBundle" }, TestConfigPath);

            // Assert all controls in SingleBundle group
            AssertResults(results, new[] { "TextBoxWatermarkExtender" });
        }

        [Test]
        public void WithoutConfigShouldReturnsAllActControlsTest() {
            var resolver = new BundleResolver(_moqCache.Object);
            var results = resolver.GetControlTypesInBundles(null, "nonexistantfile");

            var bundleTypes = new List<Type>();
            foreach(var bundleControl in ControlDependencyMap.Maps.Values) {
                bundleTypes.AddRange(bundleControl.Dependecies);
            }

            Assert.AreEqual(results.Count, bundleTypes.Distinct().Count());
            foreach(var type in bundleTypes) {
                Assert.IsTrue(results.Contains(type), "Can't resolve {0}", type);
            }
        }

        [Test]
        public void CustomBundleWithoutConfigFileShouldErrorTest() {
            var resolver = new BundleResolver(_moqCache.Object);
            Assert.Throws<Exception>(() => resolver.GetControlTypesInBundles(new[] { "Accordion" }, "nonexistantfile"), "AjaxControlToolkit.config file is not defined");
        }

        [Test]
        public void Caching_SetMethodIsCalledIfCacheIsEmpty() {
            _moqCache.Setup(c => c.Get<string>(CacheConfigName)).Returns("");

            var resolver = new BundleResolver(_moqCache.Object);
            resolver.GetControlTypesInBundles(new[] { "SingleBundle" }, TestConfigPath);
            _moqCache.Verify(c => c.Set(CacheConfigName, It.IsAny<string>(), It.IsAny<string>()), Times.Once());
        }

        [Test]
        public void Caching_SetMethodIsNotCalledIfCacheIsFull() {
            _moqCache.Setup(c => c.Get<string>(CacheConfigName)).Returns(File.ReadAllText(TestConfigPath));

            var resolver = new BundleResolver(_moqCache.Object);
            resolver.GetControlTypesInBundles(null, TestConfigPath);
            _moqCache.Verify(c => c.Set(CacheConfigName, It.IsAny<string>(), It.IsAny<string>()), Times.Never());
        }

        static string TestConfigPath {
            get { return Path.GetDirectoryName(typeof(BundleResolverTests).Assembly.Location) + "\\TestData\\AjaxControlToolkit.config"; }
        }

        static void AssertResults(List<Type> results, string[] maps) {
            // Get dependency in standard ACT control dependency maps based on maps
            var bundleControls = ControlDependencyMap.Maps
                .Where(c => maps.Contains(c.Key.Remove(0, "AjaxControlToolkit.".Length)))
                .Select(p => p.Value);
            var bundleTypes = new List<Type>();
            foreach (var bundleControl in bundleControls) {
                bundleTypes.AddRange(bundleControl.Dependecies);
            }

            Assert.AreEqual(results.Count, bundleTypes.Count);
            foreach (var type in bundleTypes) {
                Assert.IsTrue(results.Contains(type));
            }
        }            
    }

}