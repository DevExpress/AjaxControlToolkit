using NUnit.Framework;
using System;
using System.IO;
using System.Web;
using System.Web.Hosting;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class AjaxFileUploadTests {
        string _tempFolder;

        [OneTimeSetUp]
        public void Init() {
            _tempFolder = AjaxFileUpload.BuildRootTempFolder();
        }

        [SetUp]
        public void ClearTempFoder() {
            if(Directory.Exists(_tempFolder))
                Directory.Delete(_tempFolder, true);
        }

        [Test]
        public void NotAllowedFileExtensionIsBlocked() {
            var request = new WorkerRequest("", "fileName=aaa.exe", "");
            var context = new HttpContext(request);
            Assert.Throws<Exception>(() => AjaxFileUploadHelper.Process(context));
        }
        
        [Test]
        public void AllowedFileExtensionIsAccepted() {
            var request = new WorkerRequest("------WebKitFormBoundaryCqenIHPHe1ZTCr0d\r\nContent-Disposition: form-data; name=\"act-file-data\"; filename=\"zero.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryCqenIHPHe1ZTCr0d--\r\n", "filename=aaa.jpg&fileId=testtemp", "multipart/form-data; boundary=----WebKitFormBoundaryCqenIHPHe1ZTCr0d");
            var context = new HttpContext(request);
            AjaxFileUploadHelper.Process(context);
            Assert.True(File.Exists(Path.Combine(_tempFolder, "testtemp", "aaa.jpg")));
        }
            var context = new HttpContext(request);
            AjaxFileUploadHelper.Process(context);
        }
    }
}