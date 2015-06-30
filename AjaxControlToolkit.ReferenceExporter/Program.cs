using AjaxControlToolkit.Reference.Core;
using AjaxControlToolkit.Reference.Core.Razor;
using System;
using System.IO;

namespace AjaxControlToolkit.ReferenceExporter {

    class Program {

        static void Main(string[] args) {

            var rootDir = Path.Combine(
                Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.FullName,
                "AjaxControlToolkit.Reference"
            );

            var engine = new Engine(rootDir);
            var template = engine.CreateTemplateInstance<TypeDoc>("~/Views/Reference/Type.cshtml");

            var result = template.Render(new TypeDoc("AjaxControlTookit.Test"));

            Console.WriteLine(result);
            Console.ReadKey();
        }
    }

}
