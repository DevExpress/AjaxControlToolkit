﻿using NUnit.Framework;
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
            _tempFolder = AjaxFileUpload.GetRootTempFolder();
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
            var request = new WorkerRequest("------WebKitFormBoundaryCqenIHPHe1ZTCr0d\r\nContent-Disposition: form-data; name=\"act-file-data\"; filename=\"zero.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryCqenIHPHe1ZTCr0d--\r\n", "filename=aaa.jpg&fileId=E63F2078-D5C7-66FA-5CAD-02C169149BD5", "multipart/form-data; boundary=----WebKitFormBoundaryCqenIHPHe1ZTCr0d");
            var context = new HttpContext(request);
            AjaxFileUploadHelper.Process(context);
            Assert.True(File.Exists(Path.Combine(_tempFolder, "E63F2078-D5C7-66FA-5CAD-02C169149BD5", "aaa.jpg.tmp")));
        }

        [Test, Timeout(5000)]
        public void EmptyBodyDoesNotHangHandler() {
            var request = new WorkerRequest("", "filename=aaa.jpg", "");
            var context = new HttpContext(request);
            AjaxFileUploadHelper.Process(context);            
        }

        [Test]
        public void CheckTempFileExtension() {
            var root = AjaxFileUpload.GetRootTempFolder();
            Assert.Throws<Exception>(() => AjaxFileUpload.CheckTempFilePath(Path.Combine(root, @"E63F2078-D5C7-66FA-5CAD-02C169149BD5\a.exe")));
        }

        [Test]
        public void CheckTempFolderMask() {
            var root = AjaxFileUpload.GetRootTempFolder();
            Assert.Throws<Exception>(() => AjaxFileUpload.CheckTempFilePath(Path.Combine(root, @"b\a.tmp")));
        }

        [Test]
        public void CheckTempFolderNesting() {
            var root = AjaxFileUpload.GetRootTempFolder();
            Assert.Throws<Exception>(() => AjaxFileUpload.CheckTempFilePath(Path.Combine(root, @"extraFolder\E63F2078-D5C7-66FA-5CAD-02C169149BD5\a.tmp")));
        }

        [Test]
        public void HandleClassicReadEntityBodyMode() {
            var request = new WorkerRequest("------WebKitFormBoundaryCqenIHPHe1ZTCr0d\r\nContent-Disposition: form-data; name=\"act-file-data\"; filename=\"zero.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryCqenIHPHe1ZTCr0d--\r\n", "filename=aaa.jpg&fileId=E63F2078-D5C7-66FA-5CAD-02C169149BD5", "multipart/form-data; boundary=----WebKitFormBoundaryCqenIHPHe1ZTCr0d");
            var context = new HttpContext(request);
            // read entity via InputStream
            // https://referencesource.microsoft.com/#System.Web/HttpRequest.cs,3231
            var a = context.Request.InputStream.Length;
            AjaxFileUploadHelper.Process(context);
        }
    }
}