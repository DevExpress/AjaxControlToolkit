using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;
using Moq;
using System.Globalization;
using System.Web.UI;
using System.Reflection;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class LocalizationTests {
        Mock<Localization> _moqLocalization = new Mock<Localization>();

        [SetUp]
        public void SetUp() {
            _moqLocalization.Setup(p => p.IsLocalizationEnabled()).Returns(true);
            _moqLocalization.Setup(p => p.BuiltinLocales).Returns(new[] { "en", "en-AU" });
        }

        [Test, SetUICulture("it")]
        public void InvariantLocaleForUnknownLocale() {
            Assert.AreEqual("", _moqLocalization.Object.GetLocaleKey());
        }

        [Test, SetUICulture("en")]
        public void BaseLocaleForKnownBaseLocale() {
            Assert.AreEqual("en", _moqLocalization.Object.GetLocaleKey());
        }

        [Test, SetUICulture("en-AU")]
        public void SpecificLocaleForKnownSpecificLocale() {
            Assert.AreEqual("en-AU", _moqLocalization.Object.GetLocaleKey());
        }

        [Test, SetUICulture("en-BZ")]
        public void BaseLocaleForSpecificLocale() {
            Assert.AreEqual("en", _moqLocalization.Object.GetLocaleKey());
        }

        [Test, SetUICulture("ru")]
        public void CustomLocale() {
            Localization.AddLocale("ru", "TestLocalizationRu", Assembly.GetExecutingAssembly());
            Assert.AreEqual("ru", _moqLocalization.Object.GetLocaleKey());
        }

        [Test]
        public void CustomLocalizationEmbeddedScriptsName() {
            Localization.AddLocale("ru", "TestLocalizationRu", Assembly.GetExecutingAssembly());
            Assert.IsTrue(_moqLocalization.Object.GetAllLocalizationEmbeddedScripts().Select(s => s.Name).Contains("TestLocalizationRu"));
        }

        [Test]
        public void CustomLocalizationEmbeddedScriptsAssembly() {
            var assembly = Assembly.GetExecutingAssembly();
            Localization.AddLocale("ru", "TestLocalizationRu", assembly);
            Assert.IsTrue(_moqLocalization.Object.GetAllLocalizationEmbeddedScripts().Select(s => s.SourceAssembly).Contains(assembly));
        }

        [Test]
        public void BuiltinLocalizationEmbeddedScriptsAssembly() {
            var toolkitAssembly = typeof(Localization).Assembly;
            Assert.IsTrue(_moqLocalization.Object.GetAllLocalizationEmbeddedScripts().Where(r => r.Name == "Localization.Resources").Select(s => s.SourceAssembly).Contains(toolkitAssembly));
        }

        [Test, SetUICulture("ru")]
        public void CustomLocalizationDebugMode()
        {
            Mock<Localization> _localization = new Mock<Localization>();
            _localization.Setup(p => p.IsLocalizationEnabled()).Returns(true);
            _localization.Setup(p => p.BuiltinLocales).Returns(new[] { "en", "en-AU" });
            _localization.Setup(p => p.IsDebuggingEnabled()).Returns(true);

            var assembly = Assembly.GetExecutingAssembly();
            Localization.AddLocale("ru", "TestLocalizationRu", assembly);

            Assert.IsTrue(_localization.Object.GetLocalizationScriptReferences().Select(s => s.Name).Contains("TestLocalizationRu.js"));
        }

        [Test, SetUICulture("ru")]
        public void CustomLocalizationReleaseMode()
        {
            Mock<Localization> _localization = new Mock<Localization>();
            _localization.Setup(p => p.IsLocalizationEnabled()).Returns(true);
            _localization.Setup(p => p.BuiltinLocales).Returns(new[] { "en", "en-AU" });
            _localization.Setup(p => p.IsDebuggingEnabled()).Returns(false);

            var assembly = Assembly.GetExecutingAssembly();
            Localization.AddLocale("ru", "TestLocalizationRu", assembly);

            Assert.IsTrue(_localization.Object.GetLocalizationScriptReferences().Select(s => s.Name).Contains("TestLocalizationRu.min.js"));
        }

        [Test, SetUICulture("ru")]
        public void ExternalLocalization() {
            Mock<Localization> _localization = new Mock<Localization>();
            _localization.Setup(p => p.IsLocalizationEnabled()).Returns(true);
            _localization.Setup(p => p.BuiltinLocales).Returns(new[] { "en", "en-AU" });

            var assembly = Assembly.GetExecutingAssembly();
            Localization.AddExternalLocale("ru", (locale) => new ScriptReference("external"));

            Assert.IsTrue(_localization.Object.GetLocalizationScriptReferences().Select(s => s.Path).Contains("external"));
        }

        [Test, SetUICulture("ru")]
        public void ExternalLocalizationOverridesCustomLocalization() {
            Mock<Localization> _localization = new Mock<Localization>();
            _localization.Setup(p => p.IsLocalizationEnabled()).Returns(true);
            _localization.Setup(p => p.BuiltinLocales).Returns(new[] { "en", "en-AU" });
            _localization.Setup(p => p.IsDebuggingEnabled()).Returns(false);

            var assembly = Assembly.GetExecutingAssembly();
            Localization.AddLocale("ru", "TestLocalizationRu", assembly);
            Localization.AddExternalLocale("ru", (locale) => new ScriptReference("external"));

            Assert.IsTrue(_localization.Object.GetLocalizationScriptReferences().Select(s => s.Path).Contains("external"));
            Assert.IsFalse(_localization.Object.GetLocalizationScriptReferences().Select(s => s.Name).Contains("TestLocalizationRu.min.js"));
        }
    }
}
