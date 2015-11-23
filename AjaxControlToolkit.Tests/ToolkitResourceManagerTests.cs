using NUnit.Framework;
using System;
using System.IO;
using System.Reflection;
using System.Web.Hosting;
using System.Web.UI;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class ToolkitResourceManagerTests {

        private class TestCalendar : CalendarExtender {
        }

        [Test]
        public void DerivedStyleLinkGeneration() {
            var testCalendar = new TestCalendar();
            var testCalendarStyleHref = ToolkitResourceManager.GetStyleHref(new ToolkitResourceManager.ResourceEntry("MyCalendar", testCalendar.GetType(), 0), testCalendar, TestGetWebResourceUrl);
            Assert.AreEqual("CustomHash.MyCalendar.min.css", testCalendarStyleHref);
        }

        [Test]
        public void BaseStyleLinkGeneration() {
            var calendar = new CalendarExtender();
            var calendarStyleHref = ToolkitResourceManager.GetStyleHref(new ToolkitResourceManager.ResourceEntry("Calendar", calendar.GetType(), 0), calendar, TestGetWebResourceUrl);
            Assert.AreEqual("ToolkitHash.AjaxControlToolkit.Styles.Calendar.min.css", calendarStyleHref);
        }

        [Test]
        public void BaseStyleInDerivedClassLinkGeneration() {
            var testCalendar = new TestCalendar();
            var testCalendarStyleHref = ToolkitResourceManager.GetStyleHref(new ToolkitResourceManager.ResourceEntry("Calendar", testCalendar.GetType().BaseType, 0), testCalendar, TestGetWebResourceUrl);
            Assert.AreEqual("ToolkitHash.AjaxControlToolkit.Styles.Calendar.min.css", testCalendarStyleHref);
        }

        string TestGetWebResourceUrl(Type type, string resourceName) {
            var typeAssembly = type.Assembly;
            var toolkitAssembly = typeof(ToolkitResourceManager).Assembly;

            if (typeAssembly == toolkitAssembly)
                return "ToolkitHash." + resourceName;

            return "CustomHash." + resourceName;
        }
    }
}
