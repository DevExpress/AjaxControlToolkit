using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace JSBuild {
    public class StackFrame {
        private Directive _directive;
        private bool _writeDebug;
        private bool _writeRelease;

        public StackFrame(Directive directive, bool writeDebug, bool writeRelease) {
            _directive = directive;
            _writeDebug = writeDebug;
            _writeRelease = writeRelease;
        }

        public Directive Directive {
            get { return _directive; }
        }

        public bool WriteDebug {
            get { return _writeDebug; }
        }

        public bool WriteRelease {
            get { return _writeRelease; }
        }
    }
}
