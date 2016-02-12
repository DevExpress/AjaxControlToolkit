#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace AjaxControlToolkit {
    public class EmbeddedScript {
        public Assembly SourceAssembly { get; private set; }
        public string Name { get; private set; }

        public EmbeddedScript(string name, Assembly sourceAssembly) {
            Name = name;
            SourceAssembly = sourceAssembly;
        }
    }
}

#pragma warning restore 1591