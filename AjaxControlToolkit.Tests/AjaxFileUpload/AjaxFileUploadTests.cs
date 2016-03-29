using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security;
using System.Text;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class AjaxFileUploadTests {

        [Test]
        public void ProcessStream_MediumTrust() {
            var ajaxFileUploadWrapper = CreateWrapper();
            Assert.DoesNotThrow(() => ajaxFileUploadWrapper.ProcessStreamWithoutTempRootPath(), "Medium trust environment exception");
        }

        [Test]
        public void ProcessStreamWithTempRootPath_MediumTrust() {
            var ajaxFileUploadWrapper = CreateWrapper();
            Assert.Throws<SecurityException>(() => ajaxFileUploadWrapper.ProcessStreamWithTempRootPath(), "Medium trust environment exception");
        }

        AjaxFileUploadWrapper CreateWrapper() {
            var appDomain = new AppDomainBuilder().CreateMediumTrustDomain();

            return (AjaxFileUploadWrapper)appDomain.CreateInstanceAndUnwrap(
                typeof(AjaxFileUploadWrapper).Assembly.FullName,
                typeof(AjaxFileUploadWrapper).FullName);
        }
    }
}
