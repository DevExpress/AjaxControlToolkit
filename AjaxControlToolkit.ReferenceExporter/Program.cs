using AjaxControlToolkit.Reference.Core;
using AjaxControlToolkit.Reference.Core.Parsing;
using System;
using System.IO;
using System.Linq;
using System.Xml.Linq;

namespace AjaxControlToolkit.ReferenceExporter {

    class Program {

        static void Main(string[] args) {

            var rootDir = Path.Combine(
                Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.FullName,
                "AjaxControlToolkit.Reference"
            );

            var engine = new Engine(rootDir);
            var template = engine.CreateTemplateInstance<TypeDoc>("~/Views/Reference/Type.cshtml");

            var outputDir = Path.Combine(
                AppDomain.CurrentDomain.BaseDirectory,
                "Docs");

            if(Directory.Exists(outputDir))
                Directory.Delete(outputDir, true);

            Directory.CreateDirectory(outputDir);

            foreach(var doc in GetDoc().Types) {
                Console.WriteLine(doc.Name);
                File.WriteAllText(Path.Combine(outputDir, doc.Name + ".html"), template.Render(doc));
            }

            Console.WriteLine();
            Console.WriteLine("Done!");
            Console.ReadKey();
        }


        static Documentation GetDoc() {
            var doc = new Documentation();
            var xml = LoadXml(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "AjaxControltoolkit.xml"));

            var members = xml.Root.Element("members").Elements().Select(el => new RawDoc(el.Attribute("name").Value) {
                Elements = el.Elements()
            }).OrderBy(el => el.TargetFullName);

            doc.Add(members);
            return doc;
        }

        static XDocument LoadXml(string fileName) {
            XDocument xml;
            if(!System.IO.File.Exists(fileName))
                throw new ArgumentException(String.Format("File '{0}' not found", fileName), "fileName");

            xml = XDocument.Load(fileName);
            if(xml == null)
                throw new ArgumentException(String.Format("Unable to load XML from '{0}'", fileName), "fileName");

            return xml;
        }
    }

}
