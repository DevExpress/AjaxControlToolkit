#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace AjaxControlToolkit {

    public class MultipartFormDataParser {
        const string EOF = "\r\n";

        public static FileHeaderInfo ParseHeaderInfo(byte[] bytes, Encoding encoding) {
            var data = Parse(bytes, encoding);
            FileHeaderInfo result = null;
            foreach(var s in data.Boundaries) {
                if(s.Contains("Content-Disposition")) {
                    var nameMatch = new Regex(@"(?<=name\=\"")(.*?)(?=\"")").Match(s);
                    var fileNameMatch = new Regex(@"(?<=filename\=\"")(.*?)(?=\"")").Match(s);

                    if(nameMatch.Success && fileNameMatch.Success && nameMatch.Value == "act-file-data") {
                        // Look for Content-Type
                        var re = new Regex(@"(?<=Content\-Type:)(.*?)(?=" + EOF + EOF + ")");
                        var contentTypeMatch = re.Match(data.Source);

                        if(!contentTypeMatch.Success)
                            return null;

                        // Find start index position of file contents. That should be 2 lines after Content Type.
                        var startIndexOld = contentTypeMatch.Index + contentTypeMatch.Length + (EOF + EOF).Length;
                        var startIndex = GetContentTypeIndex(bytes, encoding, contentTypeMatch.Value) + contentTypeMatch.Length + (EOF + EOF).Length;

                        result = new FileHeaderInfo {
                            StartIndex = startIndex,
                            BoundaryDelimiterLength = (EOF + data.Delimiter + EOF + EOF).Length,
                            //endIndex - startIndex,
                            FileName = fileNameMatch.Value.Trim(),
                            ContentType = contentTypeMatch.Value.Trim()
                        };
                    }
                }
            }

            return result;
        }

        static int GetContentTypeIndex(byte[] bytes,  Encoding encoding, string contentTypeString) {
            var contentTypeBytes = encoding.GetBytes(contentTypeString);
            return bytes.StartingIndex(contentTypeBytes).First();
        }

        static MultipartFormData Parse(byte[] bytes, Encoding encoding) {
            var source = encoding.GetString(bytes);
            var firstEofIndex = source.IndexOf(EOF);
            if(firstEofIndex < 0)
                return null;


            var boundaryDelimiter = source.Substring(0, firstEofIndex);
            var boundaries = source.Split(new[] { boundaryDelimiter }, StringSplitOptions.RemoveEmptyEntries);
            return new MultipartFormData {
                Boundaries = boundaries,
                Delimiter = boundaryDelimiter,
                Source = source
            };
        }

        class MultipartFormData {
            internal string[] Boundaries { get; set; }
            internal string Source { get; set; }
            internal string Delimiter { get; set; }
        }
    }

}
#pragma warning restore 1591