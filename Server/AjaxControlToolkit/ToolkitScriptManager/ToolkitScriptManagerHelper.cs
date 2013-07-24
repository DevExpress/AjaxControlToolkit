using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Microsoft.Ajax.Utilities;

namespace AjaxControlToolkit
{
    public class ToolkitScriptManagerHelper {
        private static readonly Dictionary<string, Assembly> LoadedAssemblies = new Dictionary<string, Assembly>();

        internal static Assembly GetAssembly(string name) {
            if (!LoadedAssemblies.ContainsKey(name))
                LoadedAssemblies.Add(name, Assembly.Load(name));
            return LoadedAssemblies[name];
        }

        internal static string GetRequestParamValue(HttpRequestBase request, string key)
        {
            string paramValue;
            if (request.RequestType.ToUpper() == "GET") {
                paramValue = request.Params[key];
            }
            else {
#if NET45
                paramValue = request.Form[key];
#else
                paramValue = request.Params[key];
#endif
            }
            return paramValue;
        }

        /// <summary>
        /// Callable implementation of System.Web.Script.Serialization.JavaScriptString.AppendCharAsUnicode
        /// </summary>
        /// <param name="builder">string builder</param>
        /// <param name="c">character to append</param>
        internal static void AppendCharAsUnicode(StringBuilder builder, char c) {
            builder.Append(@"\u");
            builder.AppendFormat(CultureInfo.InvariantCulture, "{0:x4}", new object[] {(int) c});
        }

        /// <summary>
        /// Callable implementation of System.Web.Script.Serialization.JavaScriptString.QuoteString
        /// </summary>
        /// <param name="value">value to quote</param>
        /// <returns>quoted string</returns>
        internal static string QuoteString(string value) {
            StringBuilder builder = null;
            if (string.IsNullOrEmpty(value)) {
                return string.Empty;
            }
            int startIndex = 0;
            int count = 0;
            for (int i = 0; i < value.Length; i++) {
                char c = value[i];
                if ((((c == '\r') || (c == '\t')) || ((c == '"') || (c == '\''))) ||
                    ((((c == '<') || (c == '>')) || ((c == '\\') || (c == '\n'))) ||
                     (((c == '\b') || (c == '\f')) || (c < ' ')))) {
                    if (builder == null) {
                        builder = new StringBuilder(value.Length + 5);
                    }
                    if (count > 0) {
                        builder.Append(value, startIndex, count);
                    }
                    startIndex = i + 1;
                    count = 0;
                }

                switch (c) {
                    case '<':
                    case '>':
                    case '\'': {
                        AppendCharAsUnicode(builder, c);
                        continue;
                    }
                    case '\\': {
                        builder.Append(@"\\");
                        continue;
                    }
                    case '\b': {
                        builder.Append(@"\b");
                        continue;
                    }
                    case '\t': {
                        builder.Append(@"\t");
                        continue;
                    }
                    case '\n': {
                        builder.Append(@"\n");
                        continue;
                    }
                    case '\f': {
                        builder.Append(@"\f");
                        continue;
                    }
                    case '\r': {
                        builder.Append(@"\r");
                        continue;
                    }
                    case '"': {
                        builder.Append("\\\"");
                        continue;
                    }
                }
                if (c < ' ') {
                    AppendCharAsUnicode(builder, c);
                }
                else {
                    count++;
                }
            }
            if (builder == null) {
                return value;
            }
            if (count > 0) {
                builder.Append(value, startIndex, count);
            }
            return builder.ToString();
        }

        public virtual string Hashing(string content) {
            string hash;
            using (SHA256 hashAlgorithm = new SHA256Managed()) {
                hash = HttpServerUtility.UrlTokenEncode(
                    hashAlgorithm.ComputeHash(
                        Encoding.Unicode.GetBytes(string.IsNullOrEmpty(content) ? "empty_script" : content)));
            }
            return hash;
        }

        public virtual MinificationResult MinifyJS(string scriptContent) {
            var minifier = new Minifier();
            var result = minifier.MinifyJavaScript(scriptContent, new CodeSettings()
            { 
                CollapseToLiteral = true, 
                LocalRenaming = LocalRenaming.CrunchAll,
                MacSafariQuirks = true,
                RemoveUnneededCode = true,
                StripDebugStatements = true,
                EvalTreatment = EvalTreatment.Ignore,
                InlineSafeStrings = true
            });

            return new MinificationResult {
                                              ErrorList = minifier.ErrorList,
                                              Result = result
                                          };
        }

        public virtual void WriteErrors(StreamWriter writer, IEnumerable<ContextError> errors) {
            writer.WriteLine("/* ");
            writer.WriteLine("Javascript minification errors:");
            foreach (object obj in errors)
                writer.WriteLine(obj.ToString());
            writer.WriteLine(" */\r\n");
        }

        public virtual void WriteToStream(StreamWriter outputStream, string value) {
            outputStream.WriteLine(value);
        }
    }

    public class MinificationResult {
        public string Result { get; set; }
        public ICollection<ContextError> ErrorList { get; set; }
    }
}
