using System;

namespace AjaxControlToolkit
{
    public class AjaxFileUploadBlobInfo
    {
        public string Name { get; set; }
        public long Length { get; set; }
        public string Extension { get; set; }
        public string ContentType { get; set; }
        public Uri Uri { get; set; }
    }
}
