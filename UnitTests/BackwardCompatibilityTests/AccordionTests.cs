using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI.WebControls;
using NUnit.Framework;

namespace AjaxControlToolkit.BackwardCompatibilityTests
{
    [TestFixture]
    public class AccordionTests
    {
        private Accordion _accordion = new Accordion();

        [Test]
        public void Test()
        {
            Assert.IsInstanceOf(typeof (WebControl), _accordion);
            Assert.That(_accordion, Has.Property("ItemCreated"));
        }
    }
}
