using System.Xml.Serialization;

namespace AjaxControlToolkit.Config
{
    [XmlRoot("AjaxControlToolkit")]
    public class Settings
    {
        [XmlElement("ControlBundles", IsNullable = false)]
        public ControlBundleSection[] ControlBundles { get; set; }
    }

    public class ControlBundleSection
    {
        [XmlElement("ControlBundle", IsNullable = false)]
        public ControlBundle[] ControlBundles { get; set; }
    }

    public class ControlBundle
    {
        [XmlAttribute]
        public string Name { get; set; }

        [XmlElement("Control", IsNullable = false)]
        public Control[] Controls { get; set; }
    }

    public class Control
    {
        [XmlAttribute]
        public string Name { get; set; }

        [XmlAttribute]
        public string Assembly { get; set; }
    }
}
