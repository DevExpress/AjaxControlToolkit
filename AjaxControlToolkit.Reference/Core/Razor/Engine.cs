using Microsoft.CSharp;
using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Razor;
using System.Text.RegularExpressions;

namespace AjaxControlToolkit.Reference.Core.Razor {

    public class Engine {
        string _rootDir;

        public Engine(string rootDir) {
            _rootDir = rootDir;
        }

        static Lazy<Engine> _instance = new Lazy<Engine>(() => new Engine(AppDomain.CurrentDomain.BaseDirectory), true);
        public static Engine Instance {
            get { return _instance.Value; }
        }

        public string LoadFile(string path) {
            return File.ReadAllText(path.Replace("~", _rootDir));
        }

        public string RenderLayoutFromFile(string path, string body) {
            return RenderLayout(LoadFile(path), body);
        }

        public string RenderPageFromFile<T>(string path, T model) {
            return RenderPage(LoadFile(path), model);
        }

        public string RenderLayout(string layout, string body) {
            var instance = CreateTemplateInstance<LayoutTemplateBase>(layout,
                GetReferencedAssemblies(typeof(LayoutTemplateBase)),
                GetTypeName(typeof(LayoutTemplateBase)));

            instance.Body = body;

            return instance.ToString();
        }

        public string RenderPage<T>(string template, T model) {
            var referencedAssemblies = new List<string>();
            referencedAssemblies.Add(Assembly.GetExecutingAssembly().Location);
            referencedAssemblies.AddRange(GetReferencedAssemblies(typeof(PageTemplateBase<T>)));

            var instance = CreateTemplateInstance<PageTemplateBase<T>>(
                CleanTemplate(template),
                referencedAssemblies,
                GetTypeName(typeof(PageTemplateBase<T>)));

            instance.Model = model;

            return instance.ToString();
        }

        T CreateTemplateInstance<T>(string template, IEnumerable<string> referencedAssemblies, string baseClassName) where T : TemplateBase {
            var templateClassName = "Template";
            var templateNamespace = "Razor";

            var host = new RazorEngineHost(new CSharpRazorCodeLanguage()) {
                DefaultBaseClass = baseClassName,
                DefaultClassName = templateClassName,
                DefaultNamespace = templateNamespace
            };

            AddNamespaces(host);

            var razorResult = new RazorTemplateEngine(host).GenerateCode(template);

            var codeProvider = new CSharpCodeProvider();
            var compilerResults = codeProvider.CompileAssemblyFromDom(new CompilerParameters(referencedAssemblies.Distinct().ToArray()), razorResult.GeneratedCode);

            if(compilerResults.Errors.HasErrors)
                throw new CompileException(compilerResults.Errors, codeProvider.GetGeneratedCode(razorResult));

            return compilerResults.CompiledAssembly.CreateInstance(String.Format("{0}.{1}", templateNamespace, templateClassName)) as T;
        }

        IEnumerable<string> GetReferencedAssemblies(Type type) {
            var declaringAssembly = type.Assembly;
            yield return declaringAssembly.Location;

            foreach(var assemblyName in declaringAssembly.GetReferencedAssemblies())
                yield return Assembly.ReflectionOnlyLoad(assemblyName.FullName).Location;

            if(!type.IsGenericType)
                yield break;

            foreach(var arg in type.GetGenericArguments())
                foreach(var location in GetReferencedAssemblies(arg))
                    yield return location;
        }

        string CleanTemplate(string template) {
            return Regex.Replace(template, "@model .*" + Environment.NewLine, String.Empty);
        }

        static void AddNamespaces(RazorEngineHost host) {
            host.NamespaceImports.Add("System");
            host.NamespaceImports.Add("System.Linq");
            host.NamespaceImports.Add("System.Collections.Generic");
        }

        string GetTypeName(Type type) {
            if(!type.IsGenericType)
                return type.FullName;

            var sb = new StringBuilder();
            sb.Append(type.FullName.Substring(0, type.FullName.IndexOf('`')));
            sb.Append("<");

            var args = type.GetGenericArguments();

            foreach(var arg in args) {
                sb.Append(GetTypeName(arg));
                sb.Append(",");
            }

            if(args.Length > 0)
                sb.Length -= 1;

            sb.Append(">");

            return sb.ToString();
        }
    }

}