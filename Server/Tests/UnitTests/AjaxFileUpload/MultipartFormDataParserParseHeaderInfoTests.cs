using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using AjaxControlToolkit;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UnitTests.AjaxFileUpload
{
    [TestClass]
    public class MultipartFormData_ParserParseHeaderInfo_Tests
    {
        [TestMethod]
        public void MultipartFormDataParser_ParseHeaderInfo_Test()
        {
            const string ieSource = @"-----------------------------7dd312236107a0
Content-Disposition: form-data; name=""act-file-data""; filename=""AjaxFileUploadTest.txt""
Content-Type: text/plain

Uploaded data value
-----------------------------7dd312236107a0--";

            
            var result = MultipartFormDataParser.ParseHeaderInfo(Encoding.UTF8.GetBytes(ieSource), Encoding.UTF8);

            Assert.AreEqual("AjaxFileUploadTest.txt", result.FileName);
            Assert.AreEqual("text/plain", result.ContentType);
            Assert.AreEqual("Uploaded data value", ieSource.Substring(result.StartIndex, ieSource.Length - result.StartIndex - result.BoundaryDelimiterLength + ("\r\n").Length));
        }

        [TestMethod]
        public void MultipartFormDataParser_ParseHeaderInfo_WithExtraData_Test()
        {
            const string ieSource = @"------WebKitFormBoundaryr9JHpNZtXU44HbTS
Content-Disposition: form-data; name=""fileId""

B38276BC-C5E1-8FA6-5D2E-84CD7256B03D
------WebKitFormBoundaryr9JHpNZtXU44HbTS
Content-Disposition: form-data; name=""act-file-data""; filename=""AjaxFileUploadTest.txt""
Content-Type: text/html

Uploaded data value
------WebKitFormBoundaryr9JHpNZtXU44HbTS--";


            var result = MultipartFormDataParser.ParseHeaderInfo(Encoding.UTF8.GetBytes(ieSource), Encoding.UTF8);

            Assert.AreEqual("AjaxFileUploadTest.txt", result.FileName);
            Assert.AreEqual("text/html", result.ContentType);
            Assert.AreEqual("Uploaded data value", ieSource.Substring(result.StartIndex, ieSource.Length - result.StartIndex - result.BoundaryDelimiterLength + ("\r\n").Length));
        }
        
    }


}
