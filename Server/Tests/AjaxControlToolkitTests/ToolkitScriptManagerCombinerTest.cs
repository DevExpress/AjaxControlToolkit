using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using Microsoft.Ajax.Utilities;
using Moq;
using NUnit.Framework;

namespace AjaxControlToolkit.Tests {
    [TestFixture]
    public class ToolkitScriptManagerCombinerTest {

        private Mock<HttpContextBase> _moqContext;
        private Mock<IAjaxControlToolkitCacheProvider> _mockCacheProvider;
        private Mock<ToolkitScriptManagerConfig> _mockScriptManagerConfig;
        private Mock<ToolkitScriptManagerHelper> _mockToolkitScriptManagerHelper;
            
        [SetUp]
        public void Init() {
            _moqContext = new Mock<HttpContextBase>();
            _mockCacheProvider = new Mock<IAjaxControlToolkitCacheProvider>();
            _mockScriptManagerConfig = new Mock<ToolkitScriptManagerConfig>(_mockCacheProvider.Object);
            _mockToolkitScriptManagerHelper = new Mock<ToolkitScriptManagerHelper>();
        }

        [Test]
        [ExpectedException(typeof (OperationCanceledException))]
        public void IsScriptRegisteredWorksOnlyWhenScriptEntriesLoadedTest() {
            var scriptCombiner = new ToolkitScriptManagerCombiner(_mockScriptManagerConfig.Object, _mockToolkitScriptManagerHelper.Object);
            scriptCombiner.IsScriptRegistered(new ScriptReference());
        }

        [Test]
        public void IsScriptRegisteredWithNoScriptEntriesTest() {
            var scriptCombiner = new ToolkitScriptManagerCombiner(_mockScriptManagerConfig.Object, _mockToolkitScriptManagerHelper.Object);

            // Pretend no control is registered, thus no script reference that registered
            _mockScriptManagerConfig.Setup(
                c => c.GetControlTypesInBundles(It.IsAny<HttpContextBase>(), It.IsAny<string[]>()))
                                    .Returns(new List<Type>() {});

            // Call GetScriptReferences so script references are registered
            scriptCombiner.LoadScriptReferences(null, null);

            // Assertion
            var result = scriptCombiner.IsScriptRegistered(new ScriptReference());
            Assert.AreEqual(false, result);
        }

        [Test]
        public void IsScriptRegisteredTest() {
            
            var targetType = typeof (AccordionExtender);

            _mockScriptManagerConfig.Setup(
                c => c.GetControlTypesInBundles(It.IsAny<HttpContextBase>(), It.IsAny<string[]>()))
                                    .Returns(new List<Type>() {targetType});

            var scriptCombiner = new ToolkitScriptManagerCombiner(_mockScriptManagerConfig.Object,
                _mockToolkitScriptManagerHelper.Object);

            // Call GetScriptReferences so script references are registered
            scriptCombiner.LoadScriptReferences(null, null);

            // Get one of script reference as a test data
            var reference = ScriptObjectBuilder.GetScriptReferences(targetType).First();

            // Assertion
            var result =
                scriptCombiner.IsScriptRegistered(new ScriptReference() {
                                                                            Assembly = reference.Assembly,
                                                                            Name = reference.Name
                                                                        });
            Assert.AreEqual(true, result);
        }

        [Test]
        public void GetCombinedScriptContentHashTest() {
            var scriptCombiner = new ToolkitScriptManagerCombiner(_mockScriptManagerConfig.Object, _mockToolkitScriptManagerHelper.Object);
            var targetType = typeof(AccordionExtender);

            _mockScriptManagerConfig.Setup(
                c => c.GetControlTypesInBundles(It.IsAny<HttpContextBase>(), It.IsAny<string[]>()))
                                    .Returns(new List<Type>() { targetType });

            _mockToolkitScriptManagerHelper.Setup(h => h.Hashing(It.IsAny<string>()))
                                           .Returns((string content) =>
                                           {
                                               if (string.IsNullOrEmpty(content))
                                                   return "empty-hash";
                                               return "hashed";
                                           });

            scriptCombiner.LoadScriptReferences(_moqContext.Object, null);
            var result=scriptCombiner.GetCombinedScriptContentHash(null, null, false);
            Assert.AreEqual("hashed", result);
        }

        [Test]
        public void OutputCombinedScriptFileSkipTest() {
            var scriptCombiner = new ToolkitScriptManagerCombiner(_mockScriptManagerConfig.Object, _mockToolkitScriptManagerHelper.Object);
            var mockHttpRequest = new Mock<HttpRequestBase>();

            // Setup empty GET request in HttpContext
            mockHttpRequest.Setup(r => r.Params).Returns(new NameValueCollection());
            mockHttpRequest.Setup(r => r.RequestType).Returns("get");
            _moqContext.Setup(c => c.Request).Returns(mockHttpRequest.Object);

            // Assertion
            var result = scriptCombiner.OutputCombinedScriptFile(_moqContext.Object);
            Assert.AreEqual(false, result);
        }

        [Test]
        public void OutputCombinedScriptFileTest() {

            // Just to avoid error, let config manager returns something
            _mockScriptManagerConfig.Setup(
                c => c.GetControlTypesInBundles(It.IsAny<HttpContextBase>(), It.IsAny<string[]>()))
                                    .Returns(new List<Type> {typeof (AccordionExtender)});

            var mockHttpResponse = new Mock<HttpResponseBase>();
            var mockHttpRequest = new Mock<HttpRequestBase>();
            var mockCachePolicy = new Mock<HttpCachePolicyBase>();
            var mockHttpBrowserCapabilities = new Mock<HttpBrowserCapabilitiesBase>();

            mockCachePolicy.Setup(c => c.VaryByParams).Returns(new HttpCacheVaryByParams());
            mockHttpResponse.Setup(r => r.Cache).Returns(mockCachePolicy.Object);
            mockHttpResponse.Setup(r => r.OutputStream).Returns(new MemoryStream());
            mockHttpRequest.Setup(r => r.Browser).Returns(mockHttpBrowserCapabilities.Object);
            mockHttpRequest.Setup(r => r.Headers).Returns(new NameValueCollection());

            // Request in HttpContext
            var request = new NameValueCollection {
                                                      // Pretend there is a combine request 
                                                      {ToolkitScriptManager.CombinedScriptsParamName, "true"},
                                                      {ToolkitScriptManager.CacheBustParamName, "somehash"},
                                                      {ToolkitScriptManager.EnableCdnParamName, "false"}
                                                  };

            mockHttpRequest.Setup(r => r.Params).Returns(request);
            mockHttpRequest.Setup(r => r.RequestType).Returns("get");

            _moqContext.Setup(c => c.Response).Returns(mockHttpResponse.Object);
            _moqContext.Setup(c => c.Request).Returns(mockHttpRequest.Object);

            // Fake minification result to avoid error
            _mockToolkitScriptManagerHelper.Setup(h => h.MinifyJS(It.IsAny<string>()))
                                           .Returns(new MinificationResult {
                                                                               ErrorList =
                                                                                   new Collection<ContextError>(),
                                                                               Result = "Cool!"
                                                                           });

            // Execute it
            var scriptCombiner = new ToolkitScriptManagerCombiner(_mockScriptManagerConfig.Object,
                                                                  _mockToolkitScriptManagerHelper.Object);

            // Assertions
            var result = scriptCombiner.OutputCombinedScriptFile(_moqContext.Object);

            // HttpCachePolicyBase Assertions
            mockCachePolicy.Verify(c => c.SetCacheability(HttpCacheability.Public), Times.Once(),
                                   "HttpCachePolicyBase failed to set HttpCacheability.Public");
            mockCachePolicy.Verify(c => c.SetOmitVaryStar(true), Times.Once(),
                                   "HttpCachePolicyBase failed to SetOmitVaryStar(true)");
            mockCachePolicy.Verify(c => c.SetExpires(It.IsAny<DateTime>()), Times.Once(),
                                   "HttpCachePolicyBase failed to set cache expiration");
            mockCachePolicy.Verify(c => c.SetValidUntilExpires(true), Times.Once(),
                                   "HttpCachePolicyBase failed to SetValidUntilExpires(true)");
            mockCachePolicy.Verify(c => c.SetLastModifiedFromFileDependencies(), Times.Once(),
                                   "HttpCachePolicyBase failed to SetLastModifiedFromFileDependencies");
            var varyByParams = mockCachePolicy.Object.VaryByParams;
            Assert.AreEqual(true, varyByParams[ToolkitScriptManager.CombinedScriptsParamName],
                            "Failed to set HttpCachePolicyBase.VaryByParams for CombinedScriptsParamName");
            Assert.AreEqual(true, varyByParams[ToolkitScriptManager.HiddenFieldParamName],
                            "Failed to set HttpCachePolicyBase.VaryByParams for HiddenFieldParamName");
            Assert.AreEqual(true, varyByParams[ToolkitScriptManager.CacheBustParamName],
                            "Failed to set HttpCachePolicyBase.VaryByParams for CacheBustParamName");

            // Minification and writing to output stream assertions
            _mockToolkitScriptManagerHelper.Verify(h => h.MinifyJS(It.IsAny<string>()), Times.Once(),
                                                   "Minification script failed");
            _mockToolkitScriptManagerHelper.Verify(
                h => h.WriteErrors(It.IsAny<StreamWriter>(), It.IsAny<IEnumerable<ContextError>>()), Times.Never(),
                "Error occurred while minifying scripts");
            _mockToolkitScriptManagerHelper.Verify(h => h.WriteToStream(It.IsAny<StreamWriter>(), "Cool!"),
                                                   "Failed to write minified script");
            _mockToolkitScriptManagerHelper.Verify(
                h =>
                h.WriteToStream(It.IsAny<StreamWriter>(),"if(typeof(Sys)!=='undefined')Sys.Application.notifyScriptLoaded();"),
                "Failed to write the ASP.NET AJAX script notification code");

            // Should returning TRUE, indicating scripts successfully combined and minified
            Assert.AreEqual(true, result);
        }
    }
}
