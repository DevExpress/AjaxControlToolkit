using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace AjaxControlToolkit.Reference.Core.Parsing {

    public class RawDoc {

        public RawDoc(string name) {
            var match = Regex.Match(name, @"^(?<prefix>[a-zA-Z]{1,2}):(?<fullName>[^(]*)(\([^)]*\))?");

            TargetNamePrefix = match.Groups["prefix"].Value;
            TargetFullName = match.Groups["fullName"].Value;
        }

        public string TargetFullName { get; set; }
        public string TargetNamePrefix { get; set; }
        public IEnumerable<XElement> Elements { get; set; }
    }
}