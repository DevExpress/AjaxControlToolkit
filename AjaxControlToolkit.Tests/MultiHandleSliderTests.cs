using NUnit.Framework;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class MultiHandleSliderTests {

        [Test]
        public void MultiHandleSliderTargets_Runtime() {
            var extender = new MultiHandleSliderExtender();
            Assert.IsNotNull(extender.MultiHandleSliderTargets);
        }
    }

}