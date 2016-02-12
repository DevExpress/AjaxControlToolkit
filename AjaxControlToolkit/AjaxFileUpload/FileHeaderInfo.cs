#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit {

    public class FileHeaderInfo {

        public string FileName { get; set; }
        public string ContentType { get; set; }
        public int StartIndex { get; set; }
        public int BoundaryDelimiterLength { get; set; }
    }

}
#pragma warning restore 1591