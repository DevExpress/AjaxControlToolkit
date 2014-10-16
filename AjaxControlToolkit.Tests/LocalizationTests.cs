using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;
using Moq;
using System.Globalization;
using System.Web.UI;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class LocalizationTests {
        Mock<Localization> _moqLocalization = new Mock<Localization>();

        [SetUp]
        public void SetUp() {
            _moqLocalization.Setup(p => p.IsLocalizationEnabled()).Returns(true);
            _moqLocalization.Setup(p => p.KnownLocales).Returns(new[] { "en", "en-AU" });
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
    }
}
