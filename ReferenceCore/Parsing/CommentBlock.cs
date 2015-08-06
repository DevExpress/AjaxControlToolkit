using System.Collections.Generic;
using System.Linq;

namespace AjaxControlToolkit.Reference.Core.Parsing {

    public class CommentBlock {
        List<string> _lines = new List<string>();

        public bool IsEmpty {
            get { return !_lines.Any(); }
        }

        public IList<string> Lines {
            get { return _lines; }
        }

        public void AddLine(string line) {
            _lines.Add(line);
        }
    }
}