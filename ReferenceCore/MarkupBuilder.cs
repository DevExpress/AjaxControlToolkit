using AjaxControlToolkit.Reference.Core.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Reference.Core {
    public abstract class MarkupBuilder {
        protected IDocRenderer _renderer;
        protected StringBuilder _markupStringBuilder = new StringBuilder();

        public MarkupBuilder(IDocRenderer renderer) {
            _renderer = renderer;
        }
    }
}
