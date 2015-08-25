using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using Moq;
using NUnit.Framework;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class ComponentDescriberTests {

        enum Enum {
            Abc,
            Def
        }

        class TestObject {
            public override string ToString() {
                return "TestObjectSerialized";
            }
        }

        class ExtenderWithNonDefaultValues {
            [DefaultValue(999)]
            [ExtenderControlProperty]
            public int Prop { get; set; }

            [DefaultValue("BCD")]
            [ExtenderControlEvent]
            public string EventProp { get; set; }

            [DefaultValue("BCD")]
            [ElementReference]
            [ExtenderControlProperty]
            public string ElementProp { get; set; }

            [DefaultValue("BCD")]
            [ComponentReference]
            [ExtenderControlProperty]
            public string ComponentProp { get; set; }
        }

        class Extender {
            [ExtenderControlProperty]
            public TestObject ObjectProp { get; set; }

            [DefaultValue(null)]
            [ExtenderControlProperty]
            public DateTime? DateTimeProp { get; set; }

            [DefaultValue("NotNull")]
            [ExtenderControlProperty]
            public string NullableProp { get; set; }

            public int PropWithNoAttributes { get; set; }
        }

        #region Property groups and defaults
        [Test]
        public void DescribeComponent_PropertyName() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>();

            ComponentDescriber.DescribeComponent(new ExtenderWithNonDefaultValues { Prop = 123 }, descriptorMock.Object, null, null);

            descriptorMock.Verify(d => d.AddProperty("Prop", It.IsAny<object>()), Times.Once);
        }

        [Test]
        public void DescribeComponent_DefaultProperty() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>(MockBehavior.Strict);

            ComponentDescriber.DescribeComponent(new ExtenderWithNonDefaultValues { Prop = 999, EventProp = "BCD", ElementProp = "BCD", ComponentProp = "BCD" }, descriptorMock.Object, null, null);
        }

        [Test]
        public void DescribeComponent_EventName() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>();

            ComponentDescriber.DescribeComponent(new ExtenderWithNonDefaultValues { EventProp = "ABC" }, descriptorMock.Object, null, null);

            descriptorMock.Verify(d => d.AddEvent("EventProp", It.IsAny<string>()), Times.Once);
        }

        [Test]
        public void DescribeComponent_DefaultEvent() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>(MockBehavior.Strict);

            ComponentDescriber.DescribeComponent(new ExtenderWithNonDefaultValues { Prop = 999, EventProp = "BCD", ElementProp = "BCD", ComponentProp = "BCD" }, descriptorMock.Object, null, null);
        }

        [Test]
        public void DescribeComponent_ElementName() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>();

            ComponentDescriber.DescribeComponent(new ExtenderWithNonDefaultValues { ElementProp = "ABC" }, descriptorMock.Object, null, null);

            descriptorMock.Verify(d => d.AddElementProperty("ElementProp", It.IsAny<string>()), Times.Once);
        }

        [Test]
        public void DescribeComponent_DefaultElement() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>(MockBehavior.Strict);

            ComponentDescriber.DescribeComponent(new ExtenderWithNonDefaultValues { Prop = 999, EventProp = "BCD", ElementProp = "BCD", ComponentProp = "BCD" }, descriptorMock.Object, null, null);
        }

        [Test]
        public void DescribeComponent_ComponentName() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>();

            ComponentDescriber.DescribeComponent(new ExtenderWithNonDefaultValues { ComponentProp = "ABC" }, descriptorMock.Object, null, null);

            descriptorMock.Verify(d => d.AddComponentProperty("ComponentProp", It.IsAny<string>()), Times.Once);
        }

        [Test]
        public void DescribeComponent_DefaultComponent() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>(MockBehavior.Strict);

            ComponentDescriber.DescribeComponent(new ExtenderWithNonDefaultValues { Prop = 999, EventProp = "BCD", ElementProp = "BCD", ComponentProp = "BCD" }, descriptorMock.Object, null, null);
        }

        #endregion

        #region Serialization
        [Test]
        public void DescribeComponent_ObjectValue() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>();

            ComponentDescriber.DescribeComponent(new Extender { ObjectProp = new TestObject() }, descriptorMock.Object, null, null);

            descriptorMock.Verify(d => d.AddProperty("ObjectProp", "TestObjectSerialized"), Times.Once);
        }

        [Test]
        public void DescribeComponent_DateTimeValue() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>();

            ComponentDescriber.DescribeComponent(new Extender { DateTimeProp = new DateTime(2000, 1, 2, 3, 4, 5, 6) }, descriptorMock.Object, null, null);

            descriptorMock.Verify(d => d.AddProperty("DateTimeProp", "2000-01-02T03:04:05"), Times.Once);
        }

        [Test]
        public void DescribeComponent_DoNotSerializeNullValue() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>(MockBehavior.Strict);

            ComponentDescriber.DescribeComponent(new Extender { NullableProp = null }, descriptorMock.Object, null, null);
        }

        [Test]
        public void DescribeComponent_IgnoreNonExtenderControlPropertyAndNonExtenderControlEvent() {
            var descriptorMock = new Mock<IScriptComponentDescriptor>(MockBehavior.Strict);

            ComponentDescriber.DescribeComponent(new Extender { PropWithNoAttributes = 123 }, descriptorMock.Object, null, null);
        }
        #endregion

    }
}