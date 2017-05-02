using NUnit.Framework;
using System;
using System.IO;
using System.Web;
using System.Web.Hosting;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class AjaxFileUploadTests {

        [Test]
        public void NotAllowedFileExtensionIsBlocked() {
            var request = new SimpleWorkerRequest("", "", "", "fileName=aaa.exe", new StringWriter());
            var context = new HttpContext(request);
            Assert.Throws<Exception>(() => AjaxFileUploadHelper.Process(context));
        }

        [Test]
        public void AllowedFileExtensionIsAccepted() {
            var request = new WorkerRequest("------WebKitFormBoundaryCqenIHPHe1ZTCr0dContent - Disposition: form - data; name = \"act-file-data\"; filename = \"zero.jpg\"Content - Type: image / jpeg------WebKitFormBoundaryCqenIHPHe1ZTCr0d--\r\n", "filename=aaa.jpg", "multipart/form-data; boundary=----WebKitFormBoundaryCqenIHPHe1ZTCr0d");
            var context = new HttpContext(request);
            AjaxFileUploadHelper.Process(context);
        }
    }
}