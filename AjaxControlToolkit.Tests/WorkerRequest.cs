using System.Globalization;
using System.IO;
using System.Net;
using System.Text;
using System.Web.Hosting;

namespace AjaxControlToolkit.Tests {
    public class WorkerRequest : SimpleWorkerRequest {
        Stream _data;
        string _size;
        string _contentType;

        public WorkerRequest(string body, string query, string contentType)
            : base("", "", "", query, new StringWriter()) {
            _data  = new MemoryStream(Encoding.ASCII.GetBytes(body));
            _size = _data.Length.ToString(CultureInfo.InvariantCulture);
            _contentType = contentType;
        }

        public override string GetKnownRequestHeader(int index) {
            switch((HttpRequestHeader)index) {
                case HttpRequestHeader.ContentLength:
                    return _size;
                case HttpRequestHeader.ContentType:
                    return _contentType;
            }
            return base.GetKnownRequestHeader(index);
        }

        public override int ReadEntityBody(byte[] buffer, int offset, int size) {
            return _data.Read(buffer, offset, size);
        }

        public override int ReadEntityBody(byte[] buffer, int size) {
            return ReadEntityBody(buffer, 0, size);
        }
    }
}
