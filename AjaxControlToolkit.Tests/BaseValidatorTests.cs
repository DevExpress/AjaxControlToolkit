using NUnit.Framework;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class BaseValidatorTests {

        [Test]
        public void MaskedEditValidatorInheritance() {
            var validator = new MaskedEditValidator();
            Assert.AreEqual(typeof(System.Web.UI.WebControls.BaseValidator), validator.GetType().BaseType);
        }
    }
}
