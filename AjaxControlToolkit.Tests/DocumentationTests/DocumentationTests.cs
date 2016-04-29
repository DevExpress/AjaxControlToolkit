using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;
using Moq;
using System.Globalization;
using System.Web.UI;
using AjaxControlToolkit.Reference.Core.Rendering;
using AjaxControlToolkit.Reference.Core;
using AjaxControlToolkit.Reference;
using System.IO;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class DocumentationTests {

        [Test]
        public void DocumentationConsistent() {
            var typeNames = ToolkitTypes.GetTypeNames();
            var xmlDocFolder = GetXmlDocFolder();
            var scriptsFolder = GetScriptFolder();

            foreach(var typeName in typeNames)
                Documentation.Get(typeName, xmlDocFolder, scriptsFolder);

            Assert.DoesNotThrow(() => {
                foreach(var typeName in typeNames)
                    Documentation.Get(typeName, xmlDocFolder, scriptsFolder);
            });
        }

        static string GetScriptFolder() {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\AjaxControlToolkit\Scripts");
        }

        static string GetXmlDocFolder() {
            return AppDomain.CurrentDomain.BaseDirectory;
        }
    }
}
