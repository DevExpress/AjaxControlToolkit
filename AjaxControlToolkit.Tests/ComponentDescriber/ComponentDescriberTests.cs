using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using NUnit.Framework;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class ComponentDescriberTests {

        void AssertMemberNotSerialized(ScriptComponentDescriptorMock descriptor, string propertyName) {
            Assert.AreEqual(false, descriptor.Properties.ContainsKey(propertyName));
            Assert.AreEqual(false, descriptor.ElementProperties.ContainsKey(propertyName));
            Assert.AreEqual(false, descriptor.EventProperties.ContainsKey(propertyName));
        }

        [Test]
        public void DescribeEnumTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AccordionExtender();
            extender.AutoSize = AutoSize.Fill;

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual(AutoSize.Fill, descriptor.Properties["AutoSize"]);
        }

        [Test]
        public void DescribeDefaultEnumTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AccordionExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);
            var propertyName = "AutoSize";
            AssertMemberNotSerialized(descriptor, propertyName);
        }

        [Test]
        public void DescribeIntTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AccordionExtender();
            extender.TransitionDuration = 100;

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual(100, descriptor.Properties["TransitionDuration"]);
        }

        [Test]
        public void DescribeDefaultIntTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AccordionExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            var propertyName = "TransitionDuration";
            AssertMemberNotSerialized(descriptor, propertyName);
        }

        [Test]
        public void DescribeBoolTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AccordionExtender();
            extender.FadeTransitions = true;

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual(true, descriptor.Properties["FadeTransitions"]);
        }

        [Test]
        public void DescribeDefaultBoolTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AccordionExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            var propertyName = "FadeTransitions";
            AssertMemberNotSerialized(descriptor, propertyName);
        }

        [Test]
        public void DescribeStringTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AccordionExtender();
            extender.HeaderCssClass = "ABC";

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual("ABC", descriptor.Properties["HeaderCssClass"]);
        }

        [Test]
        public void DescribeDefaultStringTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AccordionExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            var propertyName = "HeaderCssClass";
            AssertMemberNotSerialized(descriptor, propertyName);
        }

        [Test]
        public void DescribeEventTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AjaxFileUpload();
            extender.OnClientUploadStart = "ABC";

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual("ABC", descriptor.EventProperties["uploadStart"]);
        }

        [Test]
        public void DescribeDefaultEventTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AjaxFileUpload();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            var propertyName = "uploadStart";
            AssertMemberNotSerialized(descriptor, propertyName);
        }

        [Test]
        public void DescribeFloatTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AlwaysVisibleControlExtender();
            extender.ScrollEffectDuration = 1.5f;

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual(1.5f, descriptor.Properties["ScrollEffectDuration"]);
        }

        [Test]
        public void DescribeDefaultFloatTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AlwaysVisibleControlExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            var propertyName = "ScrollEffectDuration";
            AssertMemberNotSerialized(descriptor, propertyName);
        }

        [Test]
        public void DescribeObjectTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AnimationExtender();
            extender.OnClick = new Animation();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual("{\"AnimationName\":null,\"AnimationChildren\":[]}", descriptor.Properties["OnClick"]);
        }

        [Test]
        public void DescribeDefaultObjectTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AnimationExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            var propertyName = "OnClick";
            AssertMemberNotSerialized(descriptor, propertyName);
        }

        [Test]
        public void DescribeCollectionTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AreaChart();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            CollectionAssert.AreEqual(new List<AreaChartSeries>(), descriptor.Properties["ClientSeries"] as IEnumerable<AreaChartSeries>);
        }

        [Test]
        public void DescribeServicePathTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AutoCompleteExtender();
            extender.ServicePath = "ABC";

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual("ABC", descriptor.Properties["servicePath"]);
        }

        [Test]
        public void DescribeDefaultServicePathTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new AutoCompleteExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual(String.Empty, descriptor.Properties["servicePath"]);
        }

        [Test]
        public void DescribeIDReferenceTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new BalloonPopupExtender();
            extender.BalloonPopupControlID = "ABC";

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual("ABC", descriptor.Properties["BalloonPopupControlID"]);
        }

        [Test]
        public void DescribeDefaultIDReferenceTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new BalloonPopupExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            var propertyName = "BalloonPopupControlID";
            AssertMemberNotSerialized(descriptor, propertyName);
        }

        [Test]
        public void DescribeElementReferenceTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new CalendarExtender();
            extender.PopupButtonID = "ABC";

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual("ABC", descriptor.ElementProperties["button"]);
        }

        [Test]
        public void DescribeDefaultElementReferenceTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new CalendarExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            var propertyName = "button";
            AssertMemberNotSerialized(descriptor, propertyName);
        }


        [Test]
        public void DescribeNullableDateTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new CalendarExtender();
            extender.SelectedDate = new DateTime(2000, 1, 2, 3, 4, 5, 6);

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual("2000-01-02T03:04:05", descriptor.Properties["selectedDate"]);
        }

        [Test]
        public void DescribeDefaultNullableDateTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new CalendarExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            var propertyName = "selectedDate";
            AssertMemberNotSerialized(descriptor, propertyName);
        }

        [Test]
        public void DescribeColorTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new DropDownExtender();
            extender.HighlightBackColor = Color.AntiqueWhite;

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual("AntiqueWhite", descriptor.Properties["highlightBackgroundColor"]);
        }

        [Test]
        public void DescribeDefaultColorTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new DropDownExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            var propertyName = "highlightBackgroundColor";
            AssertMemberNotSerialized(descriptor, propertyName);
        }

        [Test]
        public void DescribeCustomCollectionTest() {
            var descriptor = new ScriptComponentDescriptorMock();
            var extender = new HtmlEditorExtender();

            ComponentDescriber.DescribeComponent(extender, descriptor, null, extender);

            Assert.AreEqual(new HtmlEditorExtenderButtonCollection(), descriptor.Properties["ToolbarButtons"]);
        }

    }
}

