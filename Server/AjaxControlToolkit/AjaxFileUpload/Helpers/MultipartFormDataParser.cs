using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

namespace AjaxControlToolkit
{
    public class MultipartFormDataParser
    {
        const string Eof = "\r\n";        

        /// <summary>
        /// Get header information from multipart-form-data stored in byte array.
        /// </summary>
        /// <param name="bytes">Multipart-form-data stored in byte array.</param>
        /// <param name="encoding"></param>
        /// <returns></returns>
        public static FileHeaderInfo ParseHeaderInfo(byte[] bytes, Encoding encoding)
        {
            var data = Parse(bytes, encoding);
            FileHeaderInfo result = null;
            foreach (var s in data.Boundaries)
            {
                if (s.Contains("Content-Disposition"))
                {
                    var nameMatch = new Regex(@"(?<=name\=\"")(.*?)(?=\"")").Match(s);
                    var fileNameMatch = new Regex(@"(?<=filename\=\"")(.*?)(?=\"")").Match(s);

                    if (nameMatch.Success && fileNameMatch.Success && nameMatch.Value == "act-file-data")
                    {
                        // Look for Content-Type
                        var re = new Regex(@"(?<=Content\-Type:)(.*?)(?=" + Eof + Eof + ")");
                        var contentTypeMatch = re.Match(data.Source);

                        if (!contentTypeMatch.Success)
                            return null;

                        // Find start index position of file contents. That should be 2 lines after Content Type.
                        var startIndex = contentTypeMatch.Index + contentTypeMatch.Length + (Eof + Eof).Length;

                        result = new FileHeaderInfo
                                     {
                                         StartIndex = startIndex,
                                         BoundaryDelimiterLength = (Eof + data.Delimiter + Eof + Eof).Length,
                                         //endIndex - startIndex,
                                         FileName = fileNameMatch.Value.Trim(),
                                         ContentType = contentTypeMatch.Value.Trim()
                                     };
                    }
                }
            }

            return result;
        }

        private static MultipartFormData Parse(byte[] bytes, Encoding encoding)
        {
            var source = encoding.GetString(bytes);
            var firstEofIndex = source.IndexOf(Eof);
            if (firstEofIndex < 0)
                return null;


            var boundaryDelimiter = source.Substring(0, firstEofIndex);
            var boundaries = source.Split(new[] {boundaryDelimiter}, StringSplitOptions.RemoveEmptyEntries);
            return new MultipartFormData {
                           Boundaries = boundaries,
                           Delimiter = boundaryDelimiter,
                           Source = source
                       };
        }

        internal class MultipartFormData
        {
            internal string[] Boundaries { get; set; }
            internal string Source { get; set; }
            internal string Delimiter { get; set; }
        }
    }
}
