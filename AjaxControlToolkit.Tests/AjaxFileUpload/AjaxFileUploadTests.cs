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
            var appDomain = new AppDomainBuilder().CreateMediumTrustDomain();
            var wrapper = (AjaxFileUploadWrapper)appDomain.CreateInstanceAndUnwrap(
                typeof(AjaxFileUploadWrapper).Assembly.FullName,
                typeof(AjaxFileUploadWrapper).FullName);

            Assert.DoesNotThrow(() => wrapper.ProcessStreamWithoutTempRootPath(), "Medium trust environment exception");
        }

        [Test]
        public void ProcessStreamWithTempRootPath_MediumTrust() {
            var appDomain = new AppDomainBuilder().CreateMediumTrustDomain();
            var wrapper = (AjaxFileUploadWrapper)appDomain.CreateInstanceAndUnwrap(
                typeof(AjaxFileUploadWrapper).Assembly.FullName,
                typeof(AjaxFileUploadWrapper).FullName);

            Assert.Throws<SecurityException>(() => wrapper.ProcessStreamWithTempRootPath(), "Medium trust environment exception");
        }

        [Test]
        public void SaveAs() {
            
        }
    }
}
