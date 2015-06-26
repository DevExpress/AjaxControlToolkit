
using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Razor;

namespace AjaxControlToolkit.Reference.Core.Razor {

    public static class Extensions {

        public static GeneratorResults GenerateCode(this RazorTemplateEngine engine, string input) {
            using(var inputReader = new StringReader(input)) {
                return engine.GenerateCode(inputReader);
            }
        }

        public static string GetGeneratedCode(this CodeDomProvider codeProvider, GeneratorResults generatorResult) {
            using(StringWriter sw = new StringWriter()) {
                codeProvider.GenerateCodeFromCompileUnit(generatorResult.GeneratedCode, sw, new CodeGeneratorOptions());
                return sw.GetStringBuilder().ToString();
            }
        }
    }

}