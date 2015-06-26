using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace AjaxControlToolkit.Reference.Core.Razor {

    public class CompileException : Exception {

        public IList<CompilerError> CompilerErrors { get; private set; }
        public string GeneratedCode { get; private set; }

        public CompileException(CompilerErrorCollection errors, string generatedCode) :
            base(String.Format("{0} error{1} occured during template compilation.", errors.Count, errors.Count == 1 ? "" : "s")) {

            GeneratedCode = generatedCode;
            CompilerErrors = errors.Cast<CompilerError>().ToList().AsReadOnly();
        }

        public override string ToString() {
            var builder = new StringBuilder();
            builder.AppendLine(base.ToString()).AppendLine();

            foreach(var error in CompilerErrors)
                builder.Append(error).AppendLine().AppendLine();

            return builder.ToString();
        }
    }

}