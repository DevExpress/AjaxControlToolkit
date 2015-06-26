using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AjaxControlToolkit;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class MultipartFormDataParserTests {

        [Test]
        public void ParseHeaderInfo() {
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

        [Test]
        public void ParseHeaderInfoWithUnicode() {
            const string ieSource = @"-----------------------------7dd312236107a0
Content-Disposition: form-data; name=""act-file-data""; filename=""ºªãõ.txt""
Content-Type: text/plain

Uploaded data value
-----------------------------7dd312236107a0--";
            var encoding = Encoding.UTF8;
            var bytes = encoding.GetBytes(ieSource);

            var result = MultipartFormDataParser.ParseHeaderInfo(bytes, encoding);
            var dataValueBytes = encoding.GetBytes("Uploaded data value");

            Assert.AreEqual("ºªãõ.txt", result.FileName);
            Assert.AreEqual("text/plain", result.ContentType);
            Assert.AreEqual(bytes.StartingIndex(dataValueBytes).First(), result.StartIndex);
        }

        [Test]
        public void ParseHeaderInfoWithExtraData() {
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